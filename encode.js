// encode.js
// Encode image.jpg into 1-byte-per-address chunks.
// Uses parallel worker threads for grinding.
// Outputs encoded.json.

const fs = require('fs');
const os = require('os');
const { Worker } = require('worker_threads');

const INPUT_FILE = 'image.jpg';
const OUTPUT_FILE = 'encoded.json';

// Read image bytes
const data = fs.readFileSync(INPUT_FILE);
const bytes = Array.from(data);

const numWorkers = os.cpus().length;
let nextIndex = 0;
let results = [];
let finished = 0;

function startWorker(byte, index) {
  return new Promise((resolve, reject) => {
    const worker = new Worker('./grinder.js', {
      workerData: { byte }
    });

    worker.on('message', (address) => {
      results[index] = { byte, address };
      resolve();
    });

    worker.on('error', reject);
    worker.on('exit', (code) => {
      if (code !== 0) reject(new Error(`Worker stopped with ${code}`));
    });
  });
}

async function main() {
  console.log(`Encoding ${bytes.length} bytes using ${numWorkers} workers...`);

  // Split work in chunks equal to CPU count
  const promises = [];
  for (let i = 0; i < bytes.length; i++) {
    promises.push(startWorker(bytes[i], i));
    if (promises.length >= numWorkers) {
      await Promise.all(promises);
      promises.length = 0; // reset
      console.log(`Progress: ${i + 1} / ${bytes.length}`);
    }
  }

  // Wait for the last batch
  if (promises.length) await Promise.all(promises);

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(results, null, 2));
  console.log(`✅ Done. Encoded addresses written to ${OUTPUT_FILE}`);
}

main().catch(console.error);
