'use strict';

// libraries
const chai = require('chai');
const http = require('http');

// modules
const expect = chai.expect;

const signUtil = require('../../scripts/tx-sign.js');

const hashUtil = require('../../scripts/sha256-hash.js');

const integrationUtil = require('../../scripts/integration.js');

const encodeTestData = require('../unit/tx-encode-test-data.json');

const config = {};
config.hostname = '18.144.54.62';
config.port = 9000;
config.debug = true;
config.transportNodeHid = require('@ledgerhq/hw-transport-node-hid');
config.http = require('http');
config.fee = 1;
config.salt = 0;

// should give good response:
/*
curl http://13.57.231.148:9000/transaction -X POST -H 'Content-Type: application/json' -H 'Accept:application/json' --data '{"edge":{"observationEdge":{"parents":[{"hashReference":"DAG4EqbfJNSYZDDfs7AUzofotJzZXeRYgHaGZ6jQ","hashType":"AddressHash","baseHash":null},{"hashReference":"DAG48nmxgpKhZzEzyc86y9oHotxxG57G8sBBwj56","hashType":"AddressHash","baseHash":null}],"data":{"hashReference":"0405f5e10040303865366630633364363565643062333933363034666665323832333734626635303139353662613434376263316335616334396263643265386363343466640202370301e2400866498342c91b1383","hashType":"TransactionDataHash","baseHash":null}},"signedObservationEdge":{"signatureBatch":{"hash":"8987e92a61b7e38e82361ccaa62772801654afa20065c2a5a6d873fe23cccc49","signatures":[{"signature":"3045022100a7c0660cb2fb12a578dc64f5e75a3ad89562172c01cf55ce8e39d328a5caba060220501913153ca329962f9d6fe4cd7a1bca7504b0c6d6c465e6bd8dfa2d973feb1c","id":{"hex":"08dda015c42ea066a52d68e2ab2985b5ab255d3d0fd2b90363548cc74963b156e1a6aec5beb1a0c1df86025ffded1dba91afa87ecacdc6e32934421ab6c28d9e"}}]}},"data":{"amount":100000000,"lastTxRef":{"prevHash":"08e6f0c3d65ed0b393604ffe282374bf501956ba447bc1c5ac49bcd2e8cc44fd","ordinal":567},"fee":123456,"salt":7370566588033603000}},"lastTxRef":{"prevHash":"08e6f0c3d65ed0b393604ffe282374bf501956ba447bc1c5ac49bcd2e8cc44fd","ordinal":567},"isDummy":false,"isTest":false}'
*/

const theirTx = encodeTestData.theirTx;

// theirTx.hash <Buffer 89 87 e9 2a 61 b7 e3 8e 82 36 1c ca a6 27 72 80 16 54 af a2 00 65 c2 a5 a6 d8 73 fe 23 cc cc 49>
// mymymTx.hash <Buffer 89 87 e9 2a 61 b7 e3 8e 82 36 1c ca a6 27 72 80 16 54 af a2 00 65 c2 a5 a6 d8 73 fe 23 cc cc 49>

// theirTx.signature 30 45
//  02 21 00a7c0660cb2fb12a578dc64f5e75a3ad89562172c01cf55ce8e39d328a5caba06
//  02 20 501913153ca329962f9d6fe4cd7a1bca7504b0c6d6c465e6bd8dfa2d973feb1c
// mymymTx.signature 30 45
// 02 20 79c5506b69df542fcb2276497fc7e25f2792ac626a770bb146604f6c1b694c9b
// 02 21 00acead333185366e468f273150bc52f982a7c8a6ffceede20d429a11ffea404ea

// theirTx.publicKey 0408dda015c42ea066a52d68e2ab2985b5ab255d3d0fd2b90363548cc74963b156e1a6aec5beb1a0c1df86025ffded1dba91afa87ecacdc6e32934421ab6c28d9e
// mymymTx.publicKey 0408DDA015C42EA066A52D68E2AB2985B5AB255D3D0FD2B90363548CC74963B156E1A6AEC5BEB1A0C1DF86025FFDED1DBA91AFA87ECACDC6E32934421AB6C28D9E



// // functions
describe('integration', () => {
  it('integration address DAG4EqbfJNSYZDDfs7AUzofotJzZXeRYgHaGZ6jQ', async () => {
    const path = '/address/DAG4EqbfJNSYZDDfs7AUzofotJzZXeRYgHaGZ6jQ';
    const response = await integrationUtil.get(config, path);
    console.log('integration address response', response);
  });
  it('integration hexTx', async () => {
    const hash = '8987e92a61b7e38e82361ccaa62772801654afa20065c2a5a6d873fe23cccc49';
    const signature = '3045022100a7c0660cb2fb12a578dc64f5e75a3ad89562172c01cf55ce8e39d328a5caba060220501913153ca329962f9d6fe4cd7a1bca7504b0c6d6c465e6bd8dfa2d973feb1c';
    const publicKey = '0408DDA015C42EA066A52D68E2AB2985B5AB255D3D0FD2B90363548CC74963B156E1A6AEC5BEB1A0C1DF86025FFDED1DBA91AFA87ECACDC6E32934421AB6C28D9E';
    const verifyResponse = signUtil.verify(hash, signature, publicKey);
    const expectedVerifyResponse = {signature: signature, verified: true};
    const actualVerifyResponse = {signature: signature, verified: verifyResponse};
    expect(actualVerifyResponse).to.deep.equal(expectedVerifyResponse);
  });
  it('integration theirTx', async () => {
    const hash = Buffer.from(theirTx.edge.signedObservationEdge.signatureBatch.hash, 'hex');
    const signature = theirTx.edge.signedObservationEdge.signatureBatch.signatures[0].signature;
    const publicKey = '04' + theirTx.edge.signedObservationEdge.signatureBatch.signatures[0].id.hex;

    console.log('theirTx.hashHex', hash.toString('hex'));
    console.log('theirTx.hash', hash);
    console.log('theirTx.signature', signature);
    console.log('theirTx.publicKey', publicKey);

    // const verifyResponse = signUtil.verify(hash, signature, publicKey);
    // const expectedVerifyResponse = {signature: signature, verified: true};
    // const actualVerifyResponse = {signature: signature, verified: verifyResponse};
    // expect(actualVerifyResponse).to.deep.equal(expectedVerifyResponse);

    const path = '/transaction';
    const response = await integrationUtil.post(config, path, theirTx);
    console.log('integration tx response', response);
  });
  it('integration decodedTx', async () => {
    const path = '/transaction';
    const response = await integrationUtil.post(config, path, encodeTestData.decodedTx);
    console.log('integration tx response', response);
  });
  it.only('integration tx ', async () => {
    const tx = JSON.parse(JSON.stringify(encodeTestData.decodedTx));
    console.log('integration tx copy', JSON.stringify(tx));
    tx.edge.signedObservationEdge.signatureBatch.signatures.length = 0;
    const hash = hashUtil.sha256Hash(Buffer.from(encodeTestData.encodedTx));
    expect(tx.edge.signedObservationEdge.signatureBatch.hash).to.equal(hash.toString('hex'));

    const privateKey = Buffer.from(encodeTestData.privateKey, 'hex');
    const signature = signUtil.signHash(hash.toString('hex'), privateKey);
    const publicKey = encodeTestData.publicKey;
    console.log('myTx.hash', hash);
    console.log('myTx.signature', signature);
    console.log('myTx.publicKey', publicKey);

    const verifyResponse = signUtil.verify(hash.toString('hex'), signature, publicKey);

    const expectedVerifyResponse = {signature: signature, verified: true};
    const actualVerifyResponse = {signature: signature, verified: verifyResponse};
    expect(actualVerifyResponse).to.deep.equal(expectedVerifyResponse);

    const signatureElt = {};
    signatureElt.signature = signature;
    signatureElt.id = {};
    signatureElt.id.hex = encodeTestData.publicKey.substring(2);
    tx.edge.signedObservationEdge.signatureBatch.signatures.push(signatureElt);
    const path = '/transaction';
    const response = await integrationUtil.post(config, path, tx);
    console.log('integration tx response', response);
  });

  it('integration ledgertx ', async () => {
    const signature = encodeTestData.ledgersig;
    const tx = JSON.parse(JSON.stringify(encodeTestData.decodedTx));
    console.log('integration tx copy', JSON.stringify(tx));
    tx.edge.signedObservationEdge.signatureBatch.signatures.length = 0;
    const hash = encodeTestData.ledgerhash;
    expect(tx.edge.signedObservationEdge.signatureBatch.hash).to.equal(hash.toString('hex'));

    const publicKey = encodeTestData.publicKey;
    console.log('ledgertx.hash', hash);
    console.log('ledgertx.signature', signature);
    console.log('ledgertx.publicKey', publicKey);

    const verifyResponse = signUtil.verify(hash.toString('hex'), signature, publicKey);

    const expectedVerifyResponse = {signature: signature, verified: true};
    const actualVerifyResponse = {signature: signature, verified: verifyResponse};
    expect(actualVerifyResponse).to.deep.equal(expectedVerifyResponse);

    const signatureElt = {};
    signatureElt.signature = signature;
    signatureElt.id = {};
    signatureElt.id.hex = encodeTestData.publicKey.substring(2);
    tx.edge.signedObservationEdge.signatureBatch.signatures.push(signatureElt);
    const path = '/transaction';
    const response = await integrationUtil.post(config, path, tx);
    console.log('integration tx response', response);
  });

  beforeEach(async () => {});

  afterEach(async () => {});
});
