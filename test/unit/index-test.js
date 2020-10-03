'use strict';

// libraries
const chai = require('chai');

// modules
const expect = chai.expect;

const encodeTestData = require('./tx-encode-test-data.json');

const index = require('../../index.js');

const testUtil = require('../util/test-util.js');

describe('index', () => {
  describe('getBalanceFromLedger', () => {
    it('getBalanceFromLedger no config', async () => {
      const message = 'config is a required parameter.';
      await testUtil.expectErrorMessage(message, index.getBalanceFromLedger);
    });
    it('getBalanceFromLedger Unsupported', async () => {
      const config = testUtil.getUnsupportedConfig();
      const expected = {
        'message': 'Your computer does not support the ledger device.',
        'success': false,
      };
      const actual = await index.getBalanceFromLedger(config);
      expect(actual).to.deep.equal(expected);
    });
    it('getBalanceFromLedger NoDevice', async () => {
      const config = testUtil.getNoDeviceConfig();
      const expected = {
        'message': 'No USB device found.',
        'success': false,
      };
      const actual = await index.getBalanceFromLedger(config);
      expect(actual).to.deep.equal(expected);
    });

    it('getBalanceFromLedger Supported', async () => {
      const config = testUtil.getConfig();
      const expected = {
        'address': 'DAG4EqbfJNSYZDDfs7AUzofotJzZXeRYgHaGZ6jQ',
        'ancestorBalances': {},
        'ancestorReputations': {},
        'balance': 1000000000000,
        'balanceByLatestSnapshot': 1000000000000,
        'balanceWhole': '10000.00000000',
        'memPoolBalance': 0,
        'rewardsBalance': 0,
        'success': true,
      };
      const actual = await index.getBalanceFromLedger(config);
      delete actual.reputation;
      expect(actual).to.deep.equal(expected);
    });
  });

  describe('getBalanceFromMnemonic', () => {
    it('getBalanceFromMnemonic no config', async () => {
      const message = 'config is a required parameter.';
      await testUtil.expectErrorMessage(message, index.getBalanceFromMnemonic);
    });
    it('getBalanceFromMnemonic no mnemonic', async () => {
      const message = 'mnemonic is a required parameter.';
      const config = testUtil.getUnsupportedConfig();
      await testUtil.expectErrorMessage(message, index.getBalanceFromMnemonic, config);
    });
    it('getBalanceFromMnemonic', async () => {
      const config = testUtil.getUnsupportedConfig();
      const mnemonic = encodeTestData.mnemonic;
      const expected = {
        'address': 'DAG4EqbfJNSYZDDfs7AUzofotJzZXeRYgHaGZ6jQ',
        'ancestorBalances': {},
        'ancestorReputations': {},
        'balance': 1000000000000,
        'balanceByLatestSnapshot': 1000000000000,
        'balanceWhole': '10000.00000000',
        'memPoolBalance': 0,
        'rewardsBalance': 0,
        'success': true,
      };
      const actual = await index.getBalanceFromMnemonic(config, mnemonic);
      delete actual.reputation;
      expect(actual).to.deep.equal(expected);
    });
  });
  describe('sendAmountUsingMnemonic', () => {
    it('sendAmountUsingMnemonic no config', async () => {
      const message = 'config is a required parameter.';
      await testUtil.expectErrorMessage(message, index.sendAmountUsingMnemonic);
    });
    it('sendAmountUsingMnemonic no amount', async () => {
      const config = testUtil.getConfig();
      const message = 'amount is a required parameter.';
      await testUtil.expectErrorMessage(message, index.sendAmountUsingMnemonic, config);
    });
    it('sendAmountUsingMnemonic no toAddress', async () => {
      const config = testUtil.getConfig();
      const amount = 1;
      const message = 'toAddress is a required parameter.';
      await testUtil.expectErrorMessage(message, index.sendAmountUsingMnemonic, config, amount);
    });
    it('sendAmountUsingMnemonic no mnemonic', async () => {
      const config = testUtil.getConfig();
      const amount = 1;
      const toAddress = 'DAG6xXrv67rLAaGoYCaUe2ppBJMKsriUiNVzkJvv';
      const message = 'mnemonic is a required parameter.';
      await testUtil.expectErrorMessage(message, index.sendAmountUsingMnemonic, config, amount, toAddress);
    });
    it('sendAmountUsingMnemonic', async () => {
      const config = testUtil.getConfig();
      // config.debug = true;
      const amount = 1;
      const toAddress = 'DAG6xXrv67rLAaGoYCaUe2ppBJMKsriUiNVzkJvv';
      const mnemonic = encodeTestData.mnemonic;
      const expected = {
        'prevHash': 'bac31892cb428af03a0a4488276e925057b1eac6bfc466013431eca0bc8cabe0',
        'ordinal': 586,
        'tx': {
          'edge': {
            'observationEdge': {
              'parents': [{
                'hashReference': 'DAG4EqbfJNSYZDDfs7AUzofotJzZXeRYgHaGZ6jQ',
                'hashType': 'AddressHash',
              }, {
                'hashReference': 'DAG6xXrv67rLAaGoYCaUe2ppBJMKsriUiNVzkJvv',
                'hashType': 'AddressHash',
              }],
              'data': {
                'hashType': 'TransactionDataHash',
                'hashReference': '1164bac31892cb428af03a0a4488276e925057b1eac6bfc466013431eca0bc8cabe035861010',
              },
            },
            'signedObservationEdge': {
              'signatureBatch': {
                'hash': '66ecf3cbcd444b2a3714459d6685d3ef0ca773ab27ed07977943d4bad731bb73',
                'signatures': [{
                  'id': {
                    'hex': '08DDA015C42EA066A52D68E2AB2985B5AB255D3D0FD2B90363548CC74963B156E1A6AEC5BEB1A0C1DF86025FFDED1DBA91AFA87ECACDC6E32934421AB6C28D9E',
                  },
                }],
              },
            },
            'data': {
              'amount': '1',
              'lastTxRef': {
                'prevHash': 'bac31892cb428af03a0a4488276e925057b1eac6bfc466013431eca0bc8cabe0',
                'ordinal': 586,
              },
              'salt': '0',
            },
          },
          'lastTxRef': {
            'prevHash': 'bac31892cb428af03a0a4488276e925057b1eac6bfc466013431eca0bc8cabe0',
            'ordinal': 586,
          },
          'isDummy': false,
          'isTest': false,
        },
        'address': 'DAG4EqbfJNSYZDDfs7AUzofotJzZXeRYgHaGZ6jQ',
        'success': true,
        'message': '66ecf3cbcd444b2a3714459d6685d3ef0ca773ab27ed07977943d4bad731bb73',
      };
      const actual = await index.sendAmountUsingMnemonic(config, amount, toAddress, mnemonic);
      if (actual.success == false) {
        throw Error(actual.message);
      }
      delete actual.tx.edge.signedObservationEdge.signatureBatch.signatures[0].signature;
      expect(actual).to.deep.equal(expected);
    });
  });

  beforeEach(async () => {});

  afterEach(async () => {});
});
