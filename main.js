const { app, BrowserWindow } = require('electron');
const crypto = require('crypto');
var CIPHER = 'aes-256-cbc',
    KEY_DERIVATION = 'pbkdf2',
    KEY_LENGTH = 256,
    ITERATIONS = 64000;

var algorithm = 'aes256';
var inputEncoding = 'utf8';
var outputEncoding = 'hex';

var secret = 'ciw7p02f70000ysjon7gztjn7';


global.fs = require('fs');
global.path = require('path');
global.base64 = require('file-base64');
const Datastore = require('nedb');

global.dbTests = new Datastore({ filename: 'database/tests.db', autoload: true });
global.dbMedias = new Datastore({ filename: 'database/medias.db', autoload: true });
global.dbReports = new Datastore({ filename: 'database/reports.db', autoload: true, afterSerialization: encryptData, beforeDeserialization: decryptData });
//global.dbReports = new Datastore({ filename: 'database/reports.db', autoload: true});
global.dbCleanReports = new Datastore({ filename: 'database/cleanReports.db', autoload: true});
global.dbReportVideos = new Datastore({ filename: 'database/reportVideos.db', autoload: true});
global.dbUsers = new Datastore({ filename: 'database/users.db', autoload: true, afterSerialization: encryptData, beforeDeserialization: decryptData });

function encryptData (serialized) {
  //return serialized;
  //return CryptoJS.AES.encrypt(serialized, secret);
  return encrData(serialized, secret);
}

function decryptData(rawdata) {
  //return rawdata;
  /*var dec = CryptoJS.AES.decrypt(rawdata, secret);
  return dec.toString(CryptoJS.enc.Utf8);*/
  return decrData(rawdata, secret);
}

function encrData(serialized, secret) {
  var cipher = crypto.createCipher(algorithm, secret);
  var ciphered = cipher.update(serialized, inputEncoding, outputEncoding);
  ciphered += cipher.final(outputEncoding);
  return ciphered;
}

function decrData(ciphered, key) {
  var decipher = crypto.createDecipher(algorithm, key);
  var deciphered = decipher.update(ciphered, outputEncoding, inputEncoding);
  deciphered += decipher.final(inputEncoding);
  return deciphered;
}

function createWindow () {

  // Create the browser window.
  win = new BrowserWindow({
    width: 1400, 
    height: 800,
    backgroundColor: '#ffffff',
    icon: `file://${__dirname}/dist/assets/img/SH_logo.png`
  })
 
  // win.setMenu(null)

  win.loadURL(`file://${__dirname}/dist/index.html`)

  //// uncomment below to open the DevTools.
  // win.webContents.openDevTools()

  // Event when the window is closed.
  win.on('closed', function () {
    win = null
  })

}


// Create window on electron intialization
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {

  // On macOS specific close process
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // macOS specific close process
  if (win === null) {
    createWindow()
  }
})

// SSL/TSL: this is the self signed certificate support
app.on('certificate-error', (event, webContents, url, error, certificate, callback) => {
  // On certificate error we disable default behaviour (stop loading the page)
  // and we then say "it is all fine - true" to the callback
  event.preventDefault();
  callback(true);
});

function encData(input,secret){
  if (!secret) {
    throw new Error('A \'secret\' is required to encrypt');
  }

 
  var salt = crypto.randomBytes( KEY_LENGTH / 8),
      iv = crypto.randomBytes(16);

  try {

    var key = crypto.pbkdf2Sync(secret, salt, ITERATIONS, KEY_LENGTH / 8, 'sha1'),
        cipher = crypto.createCipheriv(CIPHER, key, iv);

    var encryptedValue = cipher.update(input, 'utf8', 'base64');
    encryptedValue += cipher.final('base64');

    var result = {
      cipher: CIPHER,
      keyDerivation: KEY_DERIVATION,
      keyLength: KEY_LENGTH,
      iterations: ITERATIONS,
      iv: iv.toString('base64'),
      salt: salt.toString('base64'),
      value: encryptedValue
    };
    return result;

  } catch (err) {
    throw new Error('Unable to encrypt value due to: ' + err);
  }
}


function decData(input, secret) {
  // Ensure we have something to decrypt
  if (!input) {
    throw new Error('You must provide a value to decrypt');
  }
  // Ensure we have the secret used to encrypt this value
  if (!secret) {
    throw new Error('A \'secret\' is required to decrypt');
  }

  // If we get a string as input, turn it into an object
  if (typeof input !== 'object') {
    try {
      input = JSON.parse(input);
    } catch (err) {
      throw new Error('Unable to parse string input as JSON');
    }
  }

  // Ensure our input is a valid object with 'iv', 'salt', and 'value'
  if (!input.iv || !input.salt || !input.value) {
    throw new Error('Input must be a valid object with \'iv\', \'salt\', and \'value\' properties');
  }

  var salt = new Buffer(input.salt, 'base64'),
      iv = new Buffer(input.iv, 'base64'),
      keyLength = input.keyLength;
	  iterations = input.iterations;

  try {

    var key = crypto.pbkdf2Sync(secret, salt, iterations, keyLength / 8, 'sha1'),
        decipher = crypto.createDecipheriv(CIPHER, key, iv);

    var decryptedValue = decipher.update(input.value, 'base64', 'utf8');
    decryptedValue += decipher.final('utf8');

    return decryptedValue;

  } catch (err) {
    throw new Error('Unable to decrypt value due to: ' + err);
  }
};