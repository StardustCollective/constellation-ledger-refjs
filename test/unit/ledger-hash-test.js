'use strict';

// libraries
const chai = require('chai');

// modules
const expect = chai.expect;

const signUtil = require('../../scripts/tx-sign.js');

const hashUtil = require('../../scripts/sha256-hash.js');

const data = require('./ledger-hash-test.json');

// functions
describe('ledger-hash', () => {
  it('test 1', () => {
    const encodedTx = data.test1.encodedTx;
    const expectedHash = data.test1.expectedHash;
    const publicKey = data.test1.publicKey;
    const signature = data.test1.signature;
    const actualHash = hashUtil.sha256Hash(encodedTx).toString('hex').toUpperCase();
    expect(actualHash).to.deep.equal(expectedHash);
    const expectedVerifyResponse = {
      signature: signature,
      verified: true,
    };
    const verifyResponse = signUtil.verify(Buffer.from(expectedHash, 'hex'), signature, publicKey);
    const actualVerifyResponse = {
      signature: signature,
      verified: verifyResponse,
    };
    expect(actualVerifyResponse).to.deep.equal(expectedVerifyResponse);
  });
  it('test 2', () => {
    const encodedTx = data.test2.encodedTx;
    const expectedHash = data.test2.expectedHash;
    const publicKey = data.test2.publicKey;
    const signature = data.test2.signature;

    const actualHash = hashUtil.sha256Hash(Buffer.from(encodedTx)).toString('hex');
    expect(actualHash).to.deep.equal(expectedHash);

    const expectedVerifyResponse = {
      signature: signature,
      verified: true,
    };
    const verifyResponse = signUtil.verify(Buffer.from(expectedHash, 'hex'), signature, publicKey);
    const actualVerifyResponse = {
      signature: signature,
      verified: verifyResponse,
    };
    expect(actualVerifyResponse).to.deep.equal(expectedVerifyResponse);
  });
  it('test 3', () => {
    const encodedTx = data.test3.encodedTx;
    const expectedHash = data.test3.expectedHash;
    const publicKey = data.test3.publicKey;
    const signature = data.test3.signature;

    const actualHash = hashUtil.sha256Hash(Buffer.from(encodedTx)).toString('hex');
    expect(actualHash).to.deep.equal(expectedHash);

    const expectedVerifyResponse = {
      signature: signature,
      verified: true,
    };
    const verifyResponse = signUtil.verify(expectedHash.toString('hex'), signature, publicKey);
    const actualVerifyResponse = {
      signature: signature,
      verified: verifyResponse,
    };
    expect(actualVerifyResponse).to.deep.equal(expectedVerifyResponse);
  });

  beforeEach(async () => {});

  afterEach(async () => {});
});
