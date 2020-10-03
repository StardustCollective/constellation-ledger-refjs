'use strict';
// libraries
const crypto = require('crypto');
// const KeyEncoder = require('key-encoder').default;
// const keyEncoder = new KeyEncoder('secp256k1');

// modules
const kryoUtil = require('./kryo.js');
const hash256Util = require('./sha256-hash.js');
const keyTranscodeUtil = require('./key-transcode.js');
const txTranscodeUtil = require('./tx-transcode.js');
const txHashEncodeUtil = require('./tx-hash-encode.js');

// constants
const DEBUG = false;

// variables

// functions
const privateToDer = (privateKeyHex) => {
  // return keyEncoder.encodePrivate(privateKeyHex, 'raw', 'der');
  const publicKey = keyTranscodeUtil.getPublicFromPrivate(privateKeyHex);
  const derHex = `30740201010420${privateKeyHex}a00706052b8104000aa144034200${publicKey}`;
  return Buffer.from(derHex, 'hex');
};

const publicToDer = (publicKeyHex) => {
  const publicKeyDerHex = `3056301006072A8648CE3D020106052B8104000A034200${publicKeyHex}`;
  return Buffer.from(publicKeyDerHex, 'hex');
};

const publicToPem = (publicKeyHex) => {
  const publicKeyDer = publicToDer(publicKeyHex);
  const publicKeyDerBase64 = publicKeyDer.toString('base64');
  const publicKeyHexPem = `-----BEGIN PUBLIC KEY-----\n${publicKeyDerBase64}\n-----END PUBLIC KEY-----`;
  // return Buffer.from(, 'hex');
  return publicKeyHexPem;
  // return keyEncoder.encodePublic(publicKeyHex, 'raw', 'pem');
};

const signHash = (hash, privateKey) => {
  /* istanbul ignore if */
  if (DEBUG) {
    console.log('signHash.hash', hash);
  }
  /* istanbul ignore if */
  if (DEBUG) {
    console.log('signHash.privateKey', privateKey);
  }
  const privateKeyDer = privateToDer(privateKey.toString('hex'));
  /* istanbul ignore if */
  if (DEBUG) {
    console.log('signHash.privateKeyDer', privateKeyDer);
  }
  const privateKeyObj = crypto.createPrivateKey( {key: Buffer.from(privateKeyDer, 'hex'), format: 'der', type: 'sec1'} );
  const signer = crypto.createSign('SHA512');
  signer.write(hash);
  signer.end();
  const signature = signer.sign(privateKeyObj);
  const signatureHex = signature.toString('hex');
  /* istanbul ignore if */
  if (DEBUG) {
    console.log('signatureHex', signatureHex);
  }

  return signatureHex;
};

const getHash = (encodedTx, debug) => {
  /* istanbul ignore if */
  if (DEBUG || (debug == true)) {
    console.log('getHash', 'encodedTx', encodedTx);
  }
  const decodedTx = txTranscodeUtil.decodeTx(encodedTx);
  /* istanbul ignore if */
  if (DEBUG || (debug == true)) {
    console.log('getHash', 'decodedTx', decodedTx);
  }
  const encodedHashTx = txHashEncodeUtil.encodeTxHash(decodedTx);
  /* istanbul ignore if */
  if (DEBUG || (debug == true)) {
    console.log('getHash', 'encodedHashTx', encodedHashTx.toString('hex'));
  }
  const kryoSerialized = kryoUtil.serialize(encodedHashTx, debug);
  /* istanbul ignore if */
  if (DEBUG || (debug == true)) {
    console.log('getHash', 'kryoSerialized', kryoSerialized);
  }
  const hash = hash256Util.sha256Hash(Buffer.from(kryoSerialized, 'hex'));
  /* istanbul ignore if */
  if (DEBUG || (debug == true)) {
    console.log('getHash', 'hash', hash.toString('hex'));
  }
  return hash.toString('hex');
};

const sign = (encodedTx, privateKeyHex) => {
  /* istanbul ignore if */
  if (DEBUG) {
    console.log('sign', 'encodedTx', encodedTx);
  }
  const privateKey = Buffer.from(privateKeyHex, 'hex');
  /* istanbul ignore if */
  if (DEBUG) {
    console.log('sign', 'privateKey', privateKey.toString('hex'));
  }
  const hash = getHash(encodedTx);
  /* istanbul ignore if */
  if (DEBUG) {
    console.log('sign', 'hash', hash.toString('hex'));
  }
  const signature = signHash(hash, privateKey);
  /* istanbul ignore if */
  if (DEBUG) {
    console.log('sign', 'signature', signature.toString('hex'));
  }
  return signature;
};

const verify = (hash, signatureHex, publicKeyHex) => {
  /* istanbul ignore if */
  if (DEBUG) {
    console.log('verify', 'hash', hash);
    console.log('verify', 'signatureHex', signatureHex);
    console.log('verify', 'publicKeyHex', publicKeyHex);
  }
  const publicKeyPem = publicToPem(publicKeyHex);
  /* istanbul ignore if */
  if (DEBUG) {
    console.log('verify', 'publicKeyPem', publicKeyPem);
  }
  const publicKeyObj = crypto.createPublicKey( {key: publicKeyPem, format: 'pem', type: 'sec1'} );

  const verifier = crypto.createVerify('SHA512');
  verifier.write(hash);
  verifier.end();
  return verifier.verify(publicKeyObj, signatureHex, 'hex');
};

exports.sign = sign;
exports.getHash = getHash;
exports.signHash = signHash;
exports.verify = verify;
