import { Server } from "socket.io";
import { generateKeys } from "./keys";
import { constants, privateDecrypt } from "node:crypto";
import { createServer } from "http";

const httpServer = createServer();
const io = new Server(httpServer);
const keys = generateKeys();

console.log("generated keys", keys);

const decryptMessage = (encryptedMessage: string) => {
  const decryptedBuffer = privateDecrypt(
    {
      key: keys.privateKey,
      passphrase: "top secret",
      padding: constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: "sha256",
    },
    Buffer.from(encryptedMessage.trim(), "base64")
  );

  return decryptedBuffer.toString("utf8");
};

io.on("connection", (socket) => {
  console.log("user connected");
  socket.emit("publicKey", keys.publicKey);
  console.log("emitted public key");

  socket.on("message", (encryptedMessage: string) => {
    console.log(encryptedMessage);

    const decryptedMessage = decryptMessage(encryptedMessage);

    console.log("message:", decryptedMessage);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

httpServer.listen(3000, () => {
  console.log("listening on :3000");
});
