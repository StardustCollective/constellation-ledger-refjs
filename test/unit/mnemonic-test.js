'use strict';

// libraries
const chai = require('chai');

// modules
const expect = chai.expect;

const mnemonic = require('../../scripts/mnemonic.js');

const mnemonicInput = 'yard impulse luxury drive today throw farm pepper survey wreck glass federal';

const encodeTestData = require('./tx-encode-test-data.json');


describe('mnemonic', () => {
  it('mnemonic to private key', () => {
    const expectedPrivateKey = encodeTestData.privateKey;
    const actualPrivateKey = mnemonic.getPrivateKeyFromMnemonic(mnemonicInput);
    expect(actualPrivateKey).to.equal(expectedPrivateKey);
  });

  beforeEach(async () => {});

  afterEach(async () => {});
});
