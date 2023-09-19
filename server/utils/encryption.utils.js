const logger = require("../utils/logger.utils");
const crypto = require('crypto');

// Encryption settings
const algorithm = 'aes-256-cbc'; // AES algorithm with a 256-bit key in CBC mode


// Function to encrypt text
function encryptText(textToEncrypt) {
  // Generate a 256-bit (32-byte) encryption key
  const encryptionKey = crypto.randomBytes(32);

  //logger.info('Encryption Key:', encryptionKey.toString('hex'));
    const iv = crypto.randomBytes(16); // Initialization Vector (IV) should be random and unique
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(encryptionKey), iv);
    let encryptedText = cipher.update(textToEncrypt, 'utf8', 'hex');
    encryptedText += cipher.final('hex');
  //  logger.info('Encrypted text:', encryptedText)
    return { encryptedText, iv, encryptionKey };
}

// Function to decrypt text
function decryptText(encryptedText, iv, decryptionKey) {
  // Convert the 'iv' array to a Buffer
      const ivBuffer = Buffer.from(iv);
      const decryptBuffer = Buffer.from(decryptionKey);
    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(decryptBuffer), ivBuffer);
    let decryptedText = decipher.update(encryptedText, 'hex', 'utf8');
    decryptedText += decipher.final('utf8');
//    logger.info('Decrypted text:', decryptedText)
    return decryptedText;
}



module.exports = {
encryptText,
decryptText
}
