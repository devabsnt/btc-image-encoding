// decode.js
// Rebuilds original file from encoded.json
// Usage: node decode.js

const fs = require('fs');

function main() {
  const encoded = JSON.parse(fs.readFileSync('encoded.json'));

  // Sort by original order
  // (encode.js already preserves order by index in array)
  const bytes = encoded.map(item => item.byte);

  // Write back to file
  const buffer = Buffer.from(bytes);
  fs.writeFileSync('reconstructed.jpg', buffer);

  console.log(`✅ Reconstructed image written to reconstructed.jpg`);
}

main();
