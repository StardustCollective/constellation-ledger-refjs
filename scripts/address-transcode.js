'use strict';

const bs58 = require('bs58');

const Sha256Hash = require('./sha256-hash.js');

const DEBUG = false;

const sumOnlyDigits = (str) => {
  let sum = 0;
  const splitStr = str.split('');

  for (let i = 0; i < splitStr.length; i++) {
    const letter = splitStr[i];
    if (letter >= '0') {
      if (letter <= '9') {
        sum += parseInt(letter);
      }
    }
  }

  return sum;
};


const getAddressFromRawPublicKey = (publicKeyHex) => {
  const derPublicKey = `3056301006072A8648CE3D020106052B8104000A034200${publicKeyHex}`;
  return getAddressFromDerPublicKey(derPublicKey);
};

const getAddressFromDerPublicKey = (publicKeyHex) => {
  /* istanbul ignore if */
  if (DEBUG) {
    console.log('publicKeyHex', publicKeyHex);
  }
  const publicKeyBuffer = Buffer.from(publicKeyHex, 'hex');
  const sha256 = Sha256Hash.sha256Hash(publicKeyBuffer);
  /* istanbul ignore if */
  if (DEBUG) {
    console.log('sha256 of publicKey', sha256.toString('hex'));
  }
  const base58encoded = bs58.encode(sha256);
  /* istanbul ignore if */
  if (DEBUG) {
    console.log('base58encoded of sha256', base58encoded);
  }
  const end = base58encoded.slice(base58encoded.length - 36);
  /* istanbul ignore if */
  if (DEBUG) {
    console.log('end of base58encoded', end);
  }
  const sum = sumOnlyDigits(end);
  /* istanbul ignore if */
  if (DEBUG) {
    console.log('sum of digits of end', sum);
  }
  const par = sum % 9;
  /* istanbul ignore if */
  if (DEBUG) {
    console.log('par of sum', par);
  }

  return 'DAG' + par + end;
};

exports.getAddressFromRawPublicKey = getAddressFromRawPublicKey;
exports.getAddressFromDerPublicKey = getAddressFromDerPublicKey;
