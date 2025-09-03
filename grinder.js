const { parentPort, workerData } = require('worker_threads');
const bitcoin = require('bitcoinjs-lib');
const ecc = require('tiny-secp256k1');
const { ECPairFactory } = require('ecpair');
const nodeCrypto = require('crypto');

// Shim global.crypto for ecpair in worker threads
global.crypto = {
  getRandomValues: (buffer) => {
    const bytes = nodeCrypto.randomBytes(buffer.length);
    buffer.set(bytes);
    return buffer;
  },
};

const ECPair = ECPairFactory(ecc);
const network = bitcoin.networks.testnet; // switch to mainnet if needed
const byte = workerData.byte;

function grindAddressForByte(byte) {
  const targetHex = byte.toString(16).padStart(2, '0');
  while (true) {
    const keyPair = ECPair.makeRandom();

    // Make sure pubkey is a Buffer, not a Uint8Array
    const pubkey = Buffer.from(keyPair.publicKey);

    const hash160 = bitcoin.crypto.ripemd160(
      bitcoin.crypto.sha256(pubkey)
    ).toString('hex');

    if (hash160.startsWith(targetHex)) {
      const { address } = bitcoin.payments.p2pkh({
        pubkey,
        network,
      });
      return address;
    }
  }
}

const address = grindAddressForByte(byte);
parentPort.postMessage(address);
