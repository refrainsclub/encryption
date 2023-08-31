# Sending an encrypted message to the server

This is a basic implementation and should not be used in production.

## Steps

1. The server sends the public key to the client.
2. The client uses that public key to send an encrypted message.
3. The server reads the encrypted message and decodes it.
