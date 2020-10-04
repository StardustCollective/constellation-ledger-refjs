'use strict';

// libraries
const chai = require('chai');

// modules
const expect = chai.expect;

const testUtil = require('../util/test-util.js');

const ledgerCommUtil = require('../../scripts/ledger-comm.js');

describe('ledger-comm', () => {
  describe('sign', () => {
    it('sign long', async () => {
      const longTx = '00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000';
      const config = testUtil.getConfig();
      config.ledgerRequestResponse['80020000FF000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000'] = '9000';
      config.ledgerRequestResponse['8002800015008000002C80000471800000000000000000000000'] = '9000';

      const actual =
        await new Promise((resolve) => {
          const signCallback = (response) => {
            resolve(response);
          };
          ledgerCommUtil.sign(config.transportNodeHid, longTx, signCallback);
        });
      const expected = {
        "message": "9000",
        "signature": "",
        "success": true
      };
      expect(actual).to.deep.equal(expected);
    });
  });
  describe('getPublicKey', () => {
    it('getPublicKey close error', async () => {
        const config = testUtil.getConfig();
        config.transportNodeHid.default.open = (path) => {
          return new Promise((resolve) => {
            const device = {};
            device.exchange = (request) => {
              return new Promise((resolve, reject) => {
                // reject(Error('device error'));
                resolve('');
              });
            };
            device.close = () => {
              throw Error('close error');
            };
            resolve(device);
          });
        };
        const actual =
          await new Promise((resolve) => {
            const callback = (response) => {
              resolve(response);
            };
            ledgerCommUtil.getPublicKey(config.transportNodeHid, callback);
          });
        const expected = {
          "message": "close error",
          "success": false
        };
        expect(actual).to.deep.equal(expected);
      }),
      it('getPublicKey device.exchange is not a function', async () => {
        const config = testUtil.getConfig();
        config.transportNodeHid.default.open = (path) => {
          return new Promise((resolve) => {
            const device = {};
            resolve(device);
          });
        };
        const actual =
          await new Promise((resolve) => {
            const callback = (response) => {
              resolve(response);
            };
            ledgerCommUtil.getPublicKey(config.transportNodeHid, callback);
          });
        const expected = {
          "message": "device.exchange is not a function",
          "success": false
        };
        expect(actual).to.deep.equal(expected);
      })
  });
  beforeEach(async () => {});

  afterEach(async () => {});
});
