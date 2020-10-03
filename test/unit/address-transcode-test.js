'use strict';

// libraries
const chai = require('chai');

// modules
const expect = chai.expect;

const encodeTestData = require('./tx-encode-test-data.json');

const addressTranscode = require('../../scripts/address-transcode.js');

const DEBUG = false;

describe('address transcode', () => {
  it('raw address transcode', () => {
    const actualAddress = addressTranscode.getAddressFromRawPublicKey(encodeTestData.publicKey);
    expect(actualAddress).to.equal(encodeTestData.address);
  });
  it('der address transcode', () => {
    const actualAddress = addressTranscode.getAddressFromDerPublicKey(encodeTestData.publicKeyWithPrefix);
    if (DEBUG) {
      console.log('actualAddress', actualAddress);
      console.log('encodeTestData.address', encodeTestData.address);
    }
    expect(encodeTestData.address).to.equal(actualAddress);
  });

  beforeEach(async () => {});

  afterEach(async () => {});
});
