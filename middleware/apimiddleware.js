const API_SECRET = process.env.Encryption_key;

async function sha256(message) {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function hmacSha256(key, message) {
  const blockSize = 64;
  let keyBytes = new TextEncoder().encode(key);

  if (keyBytes.length > blockSize) {
    keyBytes = new Uint8Array(await crypto.subtle.digest("SHA-256", keyBytes));
  }
  if (keyBytes.length < blockSize) {
    const paddedKey = new Uint8Array(blockSize);
    paddedKey.set(keyBytes);
    keyBytes = paddedKey;
  }

  const oKeyPad = keyBytes.map((b) => b ^ 0x5c);
  const iKeyPad = keyBytes.map((b) => b ^ 0x36);

  const innerHash = await sha256(new TextDecoder().decode(iKeyPad) + message);
  return await sha256(new TextDecoder().decode(oKeyPad) + innerHash);
}

async function verifyRequest(req, res, next) {
  const clientSignature = req.headers["x-signature"];
  const timestamp = req.headers["x-timestamp"];

  if (!clientSignature || !timestamp) {
    return res.status(403).json({ message: "Forbidden: Missing headers" });
  }

  const timeDiff = Math.abs(Date.now() - parseInt(timestamp));
  if (timeDiff > 5 * 60 * 1000) {
    return res.status(403).json({ message: "Forbidden: Expired request" });
  }

  const serverSignature = await hmacSha256(API_SECRET, timestamp);

  if (serverSignature === clientSignature) {
    next();
  } else {
    res.status(403).json({ message: "Forbidden: Invalid signature" });
  }
}

module.exports = verifyRequest;
