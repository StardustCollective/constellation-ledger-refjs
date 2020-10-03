'use strict';

// libraries
const chai = require('chai');

const bs58 = require('bs58');

// modules
const expect = chai.expect;

const publicKeyPrefixHex = '3056301006072a8648ce3d020106052b8104000a034200';

describe('base58', () => {
  it('base58 max bytes', () => {
    const publicKeySize = 65;
    let maxPublicKeySuffixHex = '';
    while (maxPublicKeySuffixHex.length < publicKeySize * 2) {
      maxPublicKeySuffixHex += 'ff';
    }
    const maxPublicKeyHex = publicKeyPrefixHex + maxPublicKeySuffixHex;
    const maxPublicKeyBuffer = Buffer.from(maxPublicKeyHex, 'hex');
    const base58PublicKey = bs58.encode(maxPublicKeyBuffer);
    expect(120).to.equal(base58PublicKey.length);
  });

  beforeEach(async () => {});

  afterEach(async () => {});
});
