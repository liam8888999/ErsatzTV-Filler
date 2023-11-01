# ErsatzTV-Filler Configuration (Login)

Login (Authentication) options.

## Login Configuration Options

### Register

- `Username`

- `Password`

- `Login Hint`

insert your desired username and password in this form and it will immediately take effect. The autentication currently only works for the webui and not the apis.
The password hint can be retrieved by clicking on Forgot password on the login screen.

### How is the username and password stored?

The username and password are encrypted and stored in a file.

### What if i forget my password?

If you forget your password you can stop ersatztv-filler and delete the file password.json located in the config folder. When you restart the application you can set up an new username/password.

### Remove Login Information

This button will remove the file containing the username and password and remove the need for Authentication in the future if you wish to do so. This can be easily undone by registering a new login.
