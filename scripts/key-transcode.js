'use strict';

const EC = require('elliptic').ec;
const curve = new EC('secp256k1');

const DEBUG = false;

const getPublicFromPrivate = (privateKey) => {
  /* istanbul ignore if */
  if (DEBUG) {
    console.log('getPublicFromPrivate.keypair.privateKey.length', curve.genKeyPair().getPrivate('hex').length);
    console.log('getPublicFromPrivate.privateKey.length', privateKey.length);
    console.log('getPublicFromPrivate.privateKey', privateKey);
  }
  const keypair = curve.keyFromPrivate(privateKey, 'hex');
  /* istanbul ignore if */
  if (DEBUG) {
    console.log('getPublicFromPrivate.keypair.privateKey', keypair.getPrivate().toString('hex'));
    console.log('getPublicFromPrivate.keypair.publicKey', keypair.getPublic().encode());
  }
  const publicKey = Buffer.from(keypair.getPublic().encode());
  const publicKeyHex = publicKey.toString('hex').toUpperCase();
  /* istanbul ignore if */
  if (DEBUG) {
    console.log('getPublicFromPrivate.publicKeyHex', publicKeyHex);
  }
  return publicKeyHex;
};

exports.getPublicFromPrivate = getPublicFromPrivate;
