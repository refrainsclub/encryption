import { generateKeyPairSync } from "node:crypto";

interface Keys {
  publicKey: string;
  privateKey: string;
}

export const generateKeys = (): Keys => {
  return generateKeyPairSync("rsa", {
    modulusLength: 4096,
    publicKeyEncoding: {
      format: "pem",
      type: "spki",
    },
    privateKeyEncoding: {
      type: "pkcs8",
      format: "pem",
      cipher: "aes-256-cbc",
      passphrase: "top secret",
    },
  });
};
