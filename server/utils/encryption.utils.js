const logger = require("../utils/logger.utils");
const crypto = require('crypto');
const { PASSWORD } = require("../constants/path.constants");
const fs = require('fs')

// Encryption settings
const algorithm = 'aes-256-cbc'; // AES algorithm with a 256-bit key in CBC mode


// Function to encrypt text
function encryptText(textToEncrypt) {
  // Generate a 256-bit (32-byte) encryption key
  const encryptionKey = crypto.randomBytes(32);

  //logger.debug(`Encryption Key: ${encryptionKey.toString('hex')}`);
    const iv = crypto.randomBytes(16); // Initialization Vector (IV) should be random and unique
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(encryptionKey), iv);
    let encryptedText = cipher.update(textToEncrypt, 'utf8', 'hex');
    encryptedText += cipher.final('hex');
  //  logger.debug(`Encrypted text: ${encryptedText}`)
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
//    logger.debug(`Decrypted text: ${decryptedText}`)
    return decryptedText;
}



function readAndDecryptPassword() {
  let decryptedUsername;
  let decryptedPassword;
  let hint;

  try {
    const passwordData = JSON.parse(fs.readFileSync(PASSWORD));
    // Check if hint exists and isn't empty/undefined
if (passwordData.hint) {
  hint = passwordData.hint;
} else {
  hint = 'Hint is unavailable, one can be set in the login config page';
}
    // Decrypt the username and password
    decryptedUsername = decryptText(
      passwordData.encryptedusername.encryptedText,
      passwordData.encryptedusername.iv.data,
      passwordData.encryptedusername.encryptionKey.data
    );
    decryptedPassword = decryptText(
      passwordData.encryptedpassword.encryptedText,
      passwordData.encryptedpassword.iv.data,
      passwordData.encryptedpassword.encryptionKey.data
    );

  } catch (error) {
    // Handle the error encountered when reading or decrypting the password file
    decryptedUsername = '';
    decryptedPassword = '';

    logger.error("No password file is found in the config dir");
  }

  let authentication;
  if (!decryptedUsername && !decryptedPassword) {
    authentication = false;
  } else {
    authentication = true;
  }

  return { decryptedUsername, decryptedPassword, authentication, hint };
}

module.exports = {
encryptText,
decryptText,
readAndDecryptPassword
}
