'use strict';

// libraries
const chai = require('chai');
const fs = require('fs');

// modules
const expect = chai.expect;

const encodeTestDataRaw = fs.readFileSync('./test/unit/tx-encode-test-data.json', 'ascii');

const saltRegex = new RegExp('"salt": ([0-9]+)[^0-9]');

const encodeTestData = JSON.parse(encodeTestDataRaw.replace(saltRegex, '"salt": "$1"'));

const txTranscodeUtil = require('../../scripts/tx-transcode.js');

describe('encode', () => {
  it('encoded tx matches decoded tx (spaces)', () => {
    const actual = txTranscodeUtil.encodeTx(encodeTestData.decodedTx, true, false);
    const expected = encodeTestData.encodedTxSpaces;
    expect(expected).to.deep.equal(actual);
  });
  it('encoded tx matches decoded tx (no spaces)', () => {
    const actual = txTranscodeUtil.encodeTx(encodeTestData.decodedTx, false, false);
    const expected = encodeTestData.encodedTx;
    expect(expected).to.deep.equal(actual);
  });
  it('decoded tx matches encoded tx (no spaces)', () => {
    const actual = txTranscodeUtil.decodeTx(encodeTestData.encodedTx);
    const expected = encodeTestData.decodedTx;
    // console.log('expected', JSON.stringify(expected, undefined, 2));
    delete expected.edge.observationEdge.data.baseHash;
    delete expected.edge.observationEdge.data.hashReference;
    delete expected.edge.observationEdge.parents[0].baseHash;
    delete expected.edge.observationEdge.parents[1].baseHash;
    delete expected.edge.signedObservationEdge.signatureBatch.hash;
    expected.edge.signedObservationEdge.signatureBatch.signatures.length = 0;
    expect(expected).to.deep.equal(actual);
  });

  beforeEach(async () => {});

  afterEach(async () => {});
});
