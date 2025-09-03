# Bitcoin Image Encoder (Proof of Concept)

This repository demonstrates that **any file can be permanently encoded into the Bitcoin blockchain**, even without OP_RETURN or explicit file-storage opcodes.  

The project encodes an image (e.g. `image.jpg`) into Bitcoin **addresses**, then spends dust outputs to those addresses.  
Because addresses are a critical part of Bitcoin’s validation rules, they can never be pruned or removed — meaning the data is immutable once mined.

⚠️ **Disclaimer**:  
This project is for educational and research purposes only.  
**Never** use it to encode or distribute illegal material. Only use safe demo images (like a cat picture). Everything in this repo assumes you are working with benign data.

---

## How it Works

1. **Encoding** (`encode.js` + `grinder.js`)  
   - Reads `image.jpg` byte by byte.  
   - For each byte, grinds a Bitcoin address whose hash160 prefix matches that byte.  
   - Outputs `encoded.json` containing `{ byte, address }` mappings.

2. **Publishing** (`publish.js`)  
   - Reads `encoded.json`.  
   - Builds and signs Bitcoin transactions that send a dust output (≈600 sats) to each encoded address.  
   - Batches outputs (default: 50 per transaction) to keep transactions valid.  
   - Broadcasts transactions to the Bitcoin **mainnet** via Blockstream’s API.  

3. **Immutability**  
   - Once mined, the addresses (and therefore the file’s data) are part of Bitcoin forever.  
   - This demonstrates that limiting OP_RETURN size or payloads does **not** prevent arbitrary file storage on-chain.

---

## Requirements

- Node.js (>=16)
- `npm install bitcoinjs-lib axios`

---

## Usage

### 1. Encode an Image
```bash
node encode.js
