'use strict';

// libraries
const chai = require('chai');
const fs = require('fs');

// modules
const expect = chai.expect;

const encodeTestDataRaw = fs.readFileSync('./test/unit/tx-encode-test-data.json', 'ascii');

const saltRegex = new RegExp('"salt": ([0-9]+)[^0-9]');

const encodeTestData = JSON.parse(encodeTestDataRaw.replace(saltRegex, '"salt": "$1"'));

const encodeHashUtil = require('../../scripts/tx-hash-encode.js');

// (number of parents, in bytes, in hex)

describe('encode', () => {
  it('encoded tx hash matches decoded tx hash', () => {
    const actual = encodeHashUtil.encodeTxHash(encodeTestData.decodedTx, false, false);
    const expected = encodeTestData.encodedTxHash;
    expect(expected).to.deep.equal(actual);
  });

  beforeEach(async () => {});

  afterEach(async () => {});
});
