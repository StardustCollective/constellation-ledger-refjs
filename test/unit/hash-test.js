'use strict';

// libraries
const chai = require('chai');

// modules
const expect = chai.expect;

const encodeTestData = require('./tx-encode-test-data.json');

const signUtil = require('../../scripts/tx-sign.js');

const txTranscodeUtil = require('../../scripts/tx-transcode.js');

// functions
describe('hash', () => {
  it('test hash', () => {
    const encodedTx = txTranscodeUtil.encodeTx(encodeTestData.decodedTx, false, false);
    const hash = signUtil.getHash(encodedTx);
    expect(encodeTestData.decodedTx.edge.signedObservationEdge.signatureBatch.hash).to.equal(hash);
  });

  beforeEach(async () => {});

  afterEach(async () => {});
});
