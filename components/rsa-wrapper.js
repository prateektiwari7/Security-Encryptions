const path = require('path');
const rsaWrapper = {};
const fs = require('fs');
const NodeRSA = require('node-rsa');
const crypto = require('crypto');
// open and closed keys generation method
rsaWrapper.generate = (direction) => {
let key = new NodeRSA();
// 2048 — key length, 65537 open exponent
key.generateKeyPair(2048, 65537);
//save keys as pem line in pkcs8
fs.writeFileSync(path.resolve(__dirname, 'keys', direction + '.private.pem'), key.exportKey('pkcs8-private-pem'));
fs.writeFileSync(path.resolve(__dirname, 'keys', direction + '.public.pem'), key.exportKey('pkcs8-public-pem'));
return true;
};
module.exports = rsaWrapper;


rsaWrapper.encrypt = (publicKey, message) => {
    let enc = crypto.publicEncrypt({
    key: publicKey,
    padding: crypto.RSA_PKCS1_OAEP_PADDING
    }, Buffer.from(message));
    return enc.toString('base64');
    };
    // descrypting RSA, using padding OAEP, with nodejs crypto:
    rsaWrapper.decrypt = (privateKey, message) => {
    let enc = crypto.privateDecrypt({
    key: privateKey,
    padding: crypto.RSA_PKCS1_OAEP_PADDING
    }, Buffer.from(message, 'base64'));
    return enc.toString();
    };
    // Loading RSA keys from files to variables:
    rsaWrapper.initLoadServerKeys = (basePath) => {
    rsaWrapper.serverPub = fs.readFileSync(path.resolve(basePath, 'keys', 'server.public.pem'));
    rsaWrapper.serverPrivate = fs.readFileSync(path.resolve(basePath, 'keys', 'server.private.pem'));
    rsaWrapper.clientPub = fs.readFileSync(path.resolve(basePath, 'keys', 'client.public.pem'));
    };
    // Run RSA encryption test scenario. Message is encrypted, log on console in base64 format and message is decrypted and log on console.
    rsaWrapper.serverExampleEncrypt = () => {
    console.log('Server public encrypting');
    let enc = rsaWrapper.encrypt(rsaWrapper.serverPub, 'Server init hello');
    console.log('Server private encrypting …');
    console.log('Encrypted RSA string ', '\n', enc);
    let dec = rsaWrapper.decrypt(rsaWrapper.serverPrivate, enc);
    console.log('Decrypted RSA string …');
    console.log(dec);
    };