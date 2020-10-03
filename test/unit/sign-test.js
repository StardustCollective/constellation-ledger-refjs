'use strict';

// libraries
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
const crypto = require('crypto');
const chai = require('chai');

// modules
const expect = chai.expect;

const signUtil = require('../../scripts/tx-sign.js');

const hashUtil = require('../../scripts/sha256-hash.js');

const txTranscodeUtil = require('../../scripts/tx-transcode.js');

// constants
const encodeTestData = require('./tx-encode-test-data.json');

const DEBUG = false;

// functions
const sha512Hash = (buffer) => {
  return crypto.createHash('sha512').update(buffer).digest();
};

const verifyElliptic = (hash, signatureHex, publicKeyHex) => {
  if (DEBUG) {
    console.log('verifyElliptic.hash', hash);
    console.log('verifyElliptic.signatureHex', signatureHex);
    console.log('verifyElliptic.publicKeyHex', publicKeyHex);
  }
  const key = ec.keyFromPublic(publicKeyHex, 'hex');
  return key.verify(sha512Hash(hash), signatureHex);
};

const signHashElliptic = (hash, privateKey) => {
  const d2h = (d) => {
    let s = (+d).toString(16);
    if (s.length < 2) {
      s = '0' + s;
    }
    return s;
  };
  if (DEBUG) {
    console.log('signHashElliptic.hash', hash);
  }
  if (DEBUG) {
    console.log('signHashElliptic.privateKey', privateKey);
  }
  const privateKeyObj = ec.keyFromPrivate(privateKey);
  const signature = privateKeyObj.sign(sha512Hash(hash));
  // return signature;
  // const signature = ec.sign(hash, privateKey, null);

  const r = signature.r.toArrayLike(Buffer, 'be', 32).toString('hex').toUpperCase();

  const s = signature.s.toArrayLike(Buffer, 'be', 32).toString('hex').toUpperCase();

  // console.log('sign.r',r);
  // console.log('sign.s',s);

  const b2 = d2h(r.length/2);
  const b3 = d2h(s.length/2);
  const suffix = `02${b2}${r}02${b3}${s}`;
  const b1 = d2h(suffix.length/2);
  // 0x30|b1|0x02|b2|r|0x02|b3|s
  // b1 = Length of remaining data
  // b2 = Length of r
  // b3 = Length of s

  const signatureHex = `30${b1}${suffix}`;

  return signatureHex;
};

describe('sign', () => {
  it('verify test sign', () => {
    const encodedTx = txTranscodeUtil.encodeTx(encodeTestData.decodedTx, false, false);
    const hash = signUtil.getHash(encodedTx);
    const signature = signUtil.signHash(hash, encodeTestData.privateKey);
    // console.log('test.. sign', 'hash', hash);
    // console.log('test.. sign', 'signature', signature);
    const expectedVerifyResponse = {signature: signature, verified: true};
    const verifyResponse = signUtil.verify(hash, signature, encodeTestData.publicKey);
    const actualVerifyResponse = {signature: signature, verified: verifyResponse};
    expect(actualVerifyResponse).to.deep.equal(expectedVerifyResponse);
  });
  it('verify hash sign', () => {
    const hash = Buffer.from(encodeTestData.decodedTx.edge.signedObservationEdge.signatureBatch.hash, 'hex');
    const signature = signUtil.signHash(hash, encodeTestData.privateKey);
    // console.log('hash.. sign', 'hashHex', hash.toString('hex'));
    // console.log('hash.. sign', 'hash', hash);
    // console.log('hash.. sign', 'signature', signature);
    // console.log('hash.. sign', 'publicKey', encodeTestData.publicKey);
    const verifyResponse = signUtil.verify(hash, signature, encodeTestData.publicKey);
    const expectedVerifyResponse = {signature: signature, verified: true};
    const actualVerifyResponse = {signature: signature, verified: verifyResponse};
    expect(actualVerifyResponse).to.deep.equal(expectedVerifyResponse);
  });
  it('verify ledger sign', () => {
    const signature = encodeTestData.ledgersig;
    // console.log('ledger sign', 'signature', signature);
    const hash = encodeTestData.decodedTx.edge.signedObservationEdge.signatureBatch.hash;
    // console.log('ledger sign', 'hashHex', hash.toString('hex'));
    // console.log('ledger sign', 'hash', hash);
    // console.log('ledger sign', 'publicKey', encodeTestData.publicKey);
    const verifyResponse = signUtil.verify(hash, signature, encodeTestData.publicKey);
    const expectedVerifyResponse = {signature: signature, verified: true};
    const actualVerifyResponse = {signature: signature, verified: verifyResponse};
    expect(actualVerifyResponse).to.deep.equal(expectedVerifyResponse);
  });
  it('verify their sign', () => {
    const signature = encodeTestData.theirTx.edge.signedObservationEdge.signatureBatch.signatures[0].signature;
    // console.log('their. sign', 'signature', signature);
    const hash = hashUtil.sha256Hash(Buffer.from(encodeTestData.encodedTx));
    // console.log('their. sign', 'hash', hash);
    const verifyResponse = signUtil.verify(hash.toString('hex'), signature, encodeTestData.publicKey);
    const expectedVerifyResponse = {signature: signature, verified: true};
    const actualVerifyResponse = {signature: signature, verified: verifyResponse};
    expect(actualVerifyResponse).to.deep.equal(expectedVerifyResponse);
  });
  it('verify elliptic ledger sign', () => {
    const signature = encodeTestData.ledgersig;
    // console.log('elliptic ledger sign', 'signature', signature);
    const hash = encodeTestData.decodedTx.edge.signedObservationEdge.signatureBatch.hash;
    // console.log('elliptic ledger sign', 'hashHex', hash.toString('hex'));
    // console.log('elliptic ledger sign', 'hash', hash);
    // console.log('elliptic ledger sign', 'publicKey', encodeTestData.publicKey);
    const verifyResponse = verifyElliptic(hash, signature, encodeTestData.publicKey);
    const expectedVerifyResponse = {signature: signature, verified: true};
    const actualVerifyResponse = {signature: signature, verified: verifyResponse};
    expect(actualVerifyResponse).to.deep.equal(expectedVerifyResponse);
  });
  it('verify elliptic their sign', () => {
    const signature = encodeTestData.theirTx.edge.signedObservationEdge.signatureBatch.signatures[0].signature;
    // console.log('elliptic their sign', 'signature', signature);
    const hash = hashUtil.sha256Hash(Buffer.from(encodeTestData.encodedTx));
    // console.log('elliptic their sign', 'hashHex', hash.toString('hex'));
    // console.log('elliptic their sign', 'hash', hash);
    // console.log('elliptic their sign', 'publicKey', encodeTestData.publicKey);
    const verifyResponse = verifyElliptic(hash.toString('hex'), signature, encodeTestData.publicKey);
    const expectedVerifyResponse = {signature: signature, verified: true};
    const actualVerifyResponse = {signature: signature, verified: verifyResponse};
    expect(actualVerifyResponse).to.deep.equal(expectedVerifyResponse);
  });
  it('verify elliptic hash sign', () => {
    const hash = Buffer.from(encodeTestData.decodedTx.edge.signedObservationEdge.signatureBatch.hash, 'hex');
    const signature = signUtil.signHash(hash, encodeTestData.privateKey);
    // console.log('elliptic hash.. sign', 'hashHex', hash.toString('hex'));
    // console.log('elliptic hash.. sign', 'hash', hash);
    // console.log('elliptic hash.. sign', 'signature', signature);
    // console.log('elliptic hash.. sign', 'publicKey', encodeTestData.publicKey);
    const verifyResponse = verifyElliptic(hash, signature, encodeTestData.publicKey);
    const expectedVerifyResponse = {signature: signature, verified: true};
    const actualVerifyResponse = {signature: signature, verified: verifyResponse};
    expect(actualVerifyResponse).to.deep.equal(expectedVerifyResponse);
  });
  it('verify elliptic hash self-sign', () => {
    const hash = Buffer.from(encodeTestData.decodedTx.edge.signedObservationEdge.signatureBatch.hash, 'hex');
    const signature = signHashElliptic(hash, encodeTestData.privateKey);
    // console.log('elliptic hash.. self-sign', 'hashHex', hash.toString('hex'));
    // console.log('elliptic hash.. self-sign', 'hash', hash);
    // console.log('elliptic hash.. self-sign', 'signature', signature);
    // console.log('elliptic hash.. self-sign', 'publicKey', encodeTestData.publicKey);
    const verifyResponse = verifyElliptic(hash, signature, encodeTestData.publicKey);
    const expectedVerifyResponse = {signature: signature, verified: true};
    const actualVerifyResponse = {signature: signature, verified: verifyResponse};
    expect(actualVerifyResponse).to.deep.equal(expectedVerifyResponse);
  });

  beforeEach(async () => {});

  afterEach(async () => {});
});
