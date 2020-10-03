'use strict';

// libraries
const chai = require('chai');

// modules
const expect = chai.expect;

const encodeTestData = require('./tx-encode-test-data.json');

const keyTranscode = require('../../scripts/key-transcode.js');

describe('key transcode', () => {
  it('private key to public key transcode from ledger', () => {
    const actualPublicKey = keyTranscode.getPublicFromPrivate(encodeTestData.privateKey);
    expect(actualPublicKey).to.equal(encodeTestData.publicKey);
  });
  it('private key to public key transcode with prefix', () => {
    const actualPublicKey = keyTranscode.getPublicFromPrivate(encodeTestData.privateKey);
    expect(encodeTestData.publicKeyWithPrefix).to.equal('3056301006072A8648CE3D020106052B8104000A034200' + actualPublicKey);
  });

  beforeEach(async () => {});

  afterEach(async () => {});
});
