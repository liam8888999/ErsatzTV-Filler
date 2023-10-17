const { TEMPLATE_CONSTANTS, THEMES_FOLDER, PASSWORD } = require("../constants/path.constants");
const { retrieveCurrentConfiguration, retrieveNewConfiguration } = require("../modules/config-loader.module");
const { changelogReplace, generateChangelog } = require("../utils/markdown.utils")
const { listFilesInDir } = require("../utils/file.utils")
const { version } = require('../../package.json');
const fs = require('fs');
const cheerio = require('cheerio');
const logger = require("../utils/logger.utils");
const readline = require('readline');
const { checkForUpdates } = require('../utils/update.utils');
const path = require('path');
const { encryptText, decryptText, readAndDecryptPassword } = require("../utils/encryption.utils")
const { findoldVersionThemeFiles } = require("../utils/themes.utils")



const authentificationPageRoutes = async (app) => {

  // Middleware to check if the user is authenticated
const checkAuthentication = (req, res, next) => {
  const { decryptedUsername, decryptedPassword } = readAndDecryptPassword();
  if (!decryptedUsername && !decryptedPassword) {
    req.session.isAuthenticated = true;
    return next();
  }
  if (req.session.isAuthenticated) {
    // User is authenticated; continue to the next middleware or route handler
    return next();
  } else {

  res.redirect('/login');
    // User is not authenticated; redirect to the login page
  }
};

    // Add a login route
    app.get('/login', async (req, res) => {
      const { decryptedUsername, decryptedPassword, authentication, hint } = await readAndDecryptPassword();
      const config_current = await retrieveCurrentConfiguration();
      let UPDATESTATUS = await checkForUpdates();
      const ErsatzTVURL = config_current.ersatztv
        // Render the specific ejs template view
        res.render(TEMPLATE_CONSTANTS().PAGES_FOLDER + "login", {
            layout: TEMPLATE_CONSTANTS().DEFAULT_LAYOUT, //Just registering which layout to use for each view
            page: "Login",
            version: version,
            ErsatzTVURL: ErsatzTVURL,
            updatestatus: UPDATESTATUS,
            authentication: authentication,
            hint: hint
        });
    });

    app.post('/login', (req, res) => {

      const { decryptedUsername, decryptedPassword } = readAndDecryptPassword();

const username = req.body.username;
const password = req.body.password;

if (username === decryptedUsername && password === decryptedPassword) {
  // Set a session flag to indicate that the user is authenticated
  req.session.isAuthenticated = true;

  // Check if there's a stored original URL in the session
  const originalUrl = '/';
  // Redirect the user back to the original URL or the homepage if none is stored
  res.redirect(originalUrl);
} else {
  res.redirect('/login');
}
});



// Define a route to handle form submissions and write to a file
app.post('/register', (req, res) => {
  // Ensure the users.json file exists; create it if it doesn't
  const usersFilePath = PASSWORD;
  if (!fs.existsSync(usersFilePath)) {
      fs.writeFileSync(usersFilePath, '[]', 'utf8');
  }
  const { username, password, hint } = req.body;

  const encryptedusername = encryptText(username)
  const encryptedpassword = encryptText(password)

  // Create a user object with the provided credentials
  const user = { encryptedusername, encryptedpassword, hint };

  // Write the user data to the file, overwriting any existing data
  fs.writeFile(usersFilePath, JSON.stringify(user), (err) => {
      if (err) {
          logger.error(`Error writing registration information to file: ${err}`);
          return res.status(500).send('Error writing to file');
      }

      res.redirect('/login');
  });
});

    app.get('/logout', (req, res) => {
        // Destroy the user's session to log them out
        req.session.destroy(() => {
          res.redirect('/');
        });
      });

app.post('/delusrpswrd', checkAuthentication, async (req, res) => {
  const filePath = PASSWORD; // Replace with the path to the file you want to delete

// Check if the file exists before attempting to delete it
if (fs.existsSync(filePath)) {
  fs.unlink(filePath, (err) => {
    if (err) {
      logger.error('Error deleting the login file:', err);
    } else {
      logger.success('Login File has been deleted successfully.');
    }
  });
} else {
  logger.warn('The login file does not exist.');
}
req.session.destroy(() => {
  res.redirect('/config');
});
});

}



module.exports = { authentificationPageRoutes }
