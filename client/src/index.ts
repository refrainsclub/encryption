import {
  KeyObject,
  createPublicKey,
  publicEncrypt,
  constants,
} from "node:crypto";
import { io } from "socket.io-client";

const socket = io("http://127.0.0.1:3000");
let publicKey: KeyObject | undefined;
const message = "HELLO THIS IS A TEST MESSAGE";

const encryptMessage = (message: string): string => {
  if (!publicKey) throw Error("no public key");

  const encryptedBuffer = publicEncrypt(
    {
      key: publicKey,
      passphrase: "top secret",
      padding: constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: "sha256",
    },
    Buffer.from(message, "utf8")
  );

  return encryptedBuffer.toString("base64");
};

socket.on("connect", () => {
  console.log("connected");

  socket.on("publicKey", (key: string) => {
    console.log(key.trim());

    publicKey = createPublicKey({
      key: key.trim(),
      format: "pem",
      type: "spki",
    });

    const encryptedMessage = encryptMessage(message);

    socket.emit("message", encryptedMessage);
    console.log("emitted message");
  });

  socket.on("disconnect", () => {
    console.log("disconnected");
  });
});
