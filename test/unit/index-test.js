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
  describe('sendAmountUsingLedger', () => {
    it('sendAmountUsingLedger no config', async () => {
      const message = 'config is a required parameter.';
      await testUtil.expectErrorMessage(message, index.sendAmountUsingLedger);
    });
    it('sendAmountUsingLedger no amount', async () => {
      const config = testUtil.getConfig();
      const message = 'amount is a required parameter.';
      await testUtil.expectErrorMessage(message, index.sendAmountUsingLedger, config);
    });
    it('sendAmountUsingLedger no toAddress', async () => {
      const config = testUtil.getConfig();
      const amount = 1;
      const message = 'toAddress is a required parameter.';
      await testUtil.expectErrorMessage(message, index.sendAmountUsingLedger, config, amount);
    });
    it('sendAmountUsingLedger', async () => {
      const config = testUtil.getConfig();
      // config.debug = true;
      const amount = 1;
      const toAddress = 'DAG6xXrv67rLAaGoYCaUe2ppBJMKsriUiNVzkJvv';
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
      const actual = await index.sendAmountUsingLedger(config, amount, toAddress);
      if (actual.success == false) {
        throw Error(actual.message);
      }
      delete actual.tx.edge.signedObservationEdge.signatureBatch.signatures[0].signature;
      expect(actual).to.deep.equal(expected);
    });
    it('sendAmountUsingLedger sign error 6985', async () => {
      const config = testUtil.getSignErrorConfig('6985');
      // config.debug = true;
      const amount = 1;
      const toAddress = 'DAG6xXrv67rLAaGoYCaUe2ppBJMKsriUiNVzkJvv';
      const actual = await index.sendAmountUsingLedger(config, amount, toAddress);
      const expected = {
        success: false,
        message: '6985 Tx Denied on Ledger'
      }
      expect(actual).to.deep.equal(expected);
    });
    it('sendAmountUsingLedger public key error 6E00', async () => {
      const config = testUtil.getPublicKeyErrorConfig('6E00');
      // config.debug = true;
      const amount = 1;
      const toAddress = 'DAG6xXrv67rLAaGoYCaUe2ppBJMKsriUiNVzkJvv';
      const actual = await index.sendAmountUsingLedger(config, amount, toAddress);
      const expected = {
        success: false,
        publicKey: '',
        message: '6E00 App Not Open On Ledger Device'
      }
      expect(actual).to.deep.equal(expected);
    });
    it('sendAmountUsingLedger sign error bad signature', async () => {
      const config = testUtil.getSignErrorConfig('3046022100a3d84389889d503b55dd9024b8f8dee48f9c3fa8709ca101d67dfb4a877cee9f022100df6b968c63a3e96d667e451703d2b2cdbcc6dbf447d482ea89016eb718e60cb7FFFF8987E92A61B7E38E82361CCAA62772801654AFA20065C2A5A6D873FE23CCCC499000');
      // config.debug = true;
      const amount = 1;
      const toAddress = 'DAG6xXrv67rLAaGoYCaUe2ppBJMKsriUiNVzkJvv';
      const actual = await index.sendAmountUsingLedger(config, amount, toAddress);
      const expected = {
        success: false,
        message: "invalidSignature encodedTx:'022844414734457162664a4e53595a444466733741557a6f666f744a7a5a58655259674861475a366a512844414736785872763637724c4161476f5943615565327070424a4d4b73726955694e567a6b4a76760101406261633331383932636234323861663033613061343438383237366539323530353762316561633662666334363630313334333165636130626338636162653002024a01000100' hash:'66ecf3cbcd444b2a3714459d6685d3ef0ca773ab27ed07977943d4bad731bb73', publicKey:'0408DDA015C42EA066A52D68E2AB2985B5AB255D3D0FD2B90363548CC74963B156E1A6AEC5BEB1A0C1DF86025FFDED1DBA91AFA87ECACDC6E32934421AB6C28D9E' signature:'3046022100A3D84389889D503B55DD9024B8F8DEE48F9C3FA8709CA101D67DFB4A877CEE9F022100DF6B968C63A3E96D667E451703D2B2CDBCC6DBF447D482EA89016EB718E60CB7'"
      }
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
    it('getMinBalanceFromMnemonic', async () => {
      const config = testUtil.getUnsupportedConfig();
      const mnemonic = encodeTestData.mnemonicZero;
      const expected = {
        'address': 'DAG819drNmqZqZ42bfGQSGh5dYUrg1dVmw4Bfmcs',
        'ancestorBalances': {},
        'ancestorReputations': {},
        'balance': 1,
        'balanceByLatestSnapshot': 0,
        'balanceWhole': '0.00000001',
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
    it('sendAmountUsingMnemonic fee 0', async () => {
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
    it('sendAmountUsingMnemonic fee 1', async () => {
      const config = testUtil.getConfigWithFee(1, '84b8587a29cb180b1535b35ee8714393d7082e27664b61db502c91ab3f9d4cfb');
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
                'hashReference': '1164bac31892cb428af03a0a4488276e925057b1eac6bfc466013431eca0bc8cabe035861110',
              },
            },
            'signedObservationEdge': {
              'signatureBatch': {
                'hash': '84b8587a29cb180b1535b35ee8714393d7082e27664b61db502c91ab3f9d4cfb',
                'signatures': [{
                  'id': {
                    'hex': '08DDA015C42EA066A52D68E2AB2985B5AB255D3D0FD2B90363548CC74963B156E1A6AEC5BEB1A0C1DF86025FFDED1DBA91AFA87ECACDC6E32934421AB6C28D9E',
                  },
                }],
              },
            },
            'data': {
              'amount': '1',
              'fee': 1,
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
        'message': '84b8587a29cb180b1535b35ee8714393d7082e27664b61db502c91ab3f9d4cfb',
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
