'use strict';

// libraries
const chai = require('chai');

// modules
const bananojs = require('../../index.js');
const assert = chai.assert;
const expect = chai.expect;

const getUnsupportedConfig = () => {
  const config = getConfig();
  config.transportNodeHid.default.isSupported = () => {
    return false;
  };
  return config;
};

const getNoDeviceConfig = () => {
  const config = getConfig();
  config.transportNodeHid.default.list = () => {
    return new Promise((resolve) => {
      resolve([]);
    });
  };
  return config;
};

const getConfig = () => {
  const config = {};
  config.hostname = '18.144.54.62';
  config.port = 9000;
  config.debug = false;
  config.fee = 0;
  config.salt = 0;
  config.transportNodeHid = {};
  config.transportNodeHid.default = {};
  config.transportNodeHid.default.isSupported = () => {
    return true;
  };
  config.transportNodeHid.default.list = () => {
    return new Promise((resolve) => {
      resolve(['fakeHidPath']);
    });
  };


  const ledgerRequestResponse = {};
  ledgerRequestResponse['80040000008000002C80000471800000000000000000000000'] = '0408DDA015C42EA066A52D68E2AB2985B5AB255D3D0FD2B90363548CC74963B156E1A6AEC5BEB1A0C1DF86025FFDED1DBA91AFA87ECACDC6E32934421AB6C28D9E9000';
  ledgerRequestResponse['80028000B1022844414734457162664A4E53595A444466733741557A6F666F744A7A5A58655259674861475A366A512844414736785872763637724C4161476F5943615565327070424A4D4B73726955694E567A6B4A76760101406261633331383932636234323861663033613061343438383237366539323530353762316561633662666334363630313334333165636130626338636162653002024A010001008000002C80000471800000000000000000000000'] = '3046022100a3d84389889d503b55dd9024b8f8dee48f9c3fa8709ca101d67dfb4a877cee9f022100df6b968c63a3e96d667e451703d2b2cdbcc6dbf447d482ea89016eb718e60cb6FFFF8987E92A61B7E38E82361CCAA62772801654AFA20065C2A5A6D873FE23CCCC499000';

  config.transportNodeHid.default.open = (path) => {
    return new Promise((resolve) => {
      const device = {};
      device.exchange = (request) => {
        return new Promise((resolve) => {
          const requestStr = request.toString('hex').toUpperCase();
          const response = ledgerRequestResponse[requestStr];
          if (response === undefined) {
            throw Error(`no ledger response found for '${requestStr}'`);
          }
          if (config.debug) {
            console.log('exchange', 'request', requestStr);
            console.log('exchange', 'response', response);
          }
          resolve(response);
        });
      };
      device.close = () => {};
      resolve(device);
    });
  };

  const httpRequestResponse = {};
  httpRequestResponse['GET'] = {};
  httpRequestResponse['GET']['/address/DAG4EqbfJNSYZDDfs7AUzofotJzZXeRYgHaGZ6jQ'] = '{"balance":1000000000000,"memPoolBalance":0,"reputation":null,"ancestorBalances":{},"ancestorReputations":{},"balanceByLatestSnapshot":1000000000000,"rewardsBalance":0}';
  httpRequestResponse['GET']['/transaction/last-ref/DAG4EqbfJNSYZDDfs7AUzofotJzZXeRYgHaGZ6jQ'] = '{"prevHash":"bac31892cb428af03a0a4488276e925057b1eac6bfc466013431eca0bc8cabe0","ordinal":586}';
  httpRequestResponse['GET']['/address/DAG819drNmqZqZ42bfGQSGh5dYUrg1dVmw4Bfmcs'] =
  '{"balance":1,"memPoolBalance":0,"reputation":null,  "ancestorBalances":{},"ancestorReputations":{}, "balanceByLatestSnapshot":0,"rewardsBalance":0,"balanceWhole":"0.00000001","address": "DAG819drNmqZqZ42bfGQSGh5dYUrg1dVmw4Bfmcs","success": true}';

  httpRequestResponse['POST'] = {};
  httpRequestResponse['POST']['/transaction'] = {};

  httpRequestResponse['POST']['/transaction']['db77c6b049d98eeae603b2db86106292855da5127de70cb37d2766834bcc4fed'] = 'The request body was invalid.';
  httpRequestResponse['POST']['/transaction']['66ecf3cbcd444b2a3714459d6685d3ef0ca773ab27ed07977943d4bad731bb73'] = '66ecf3cbcd444b2a3714459d6685d3ef0ca773ab27ed07977943d4bad731bb73';

  config.http = {};
  config.http.request = (options, res) => {
    if (config.debug) {
      console.log('request', 'options', options);
    }
    let responseStr = httpRequestResponse[options.method][options.path];
    const typeFn = {};
    const response = {};
    response.on = (type, fn) => {
      typeFn[type] = fn;
    };
    response.write = (data) => {
      if (config.debug) {
        console.log('write', 'responseStr[0]', responseStr);
        console.log('write', 'data', data);
      }
      const dataJson = JSON.parse(data);
      if (config.debug) {
        console.log('write', 'dataJson', dataJson);
      }
      const hash = dataJson.edge.signedObservationEdge.signatureBatch.hash;
      if (config.debug) {
        console.log('write', 'hash', hash);
      }
      if (responseStr[hash] == undefined) {
        throw Error(`no mock response found for '${hash}'`);
      }
      responseStr = responseStr[hash];
      if (config.debug) {
        console.log('write', 'responseStr[1]', responseStr);
      }
    };
    response.end = () => {
      const callbackFn = {};
      callbackFn.on = (type, fn) => {
        typeFn[type] = fn;
      };
      res(callbackFn);
      if (config.debug) {
        console.log('responseStr', responseStr);
      }
      const dataFn = typeFn['data'];
      if (responseStr === undefined) {
        throw Error('no response for options:' + JSON.stringify(options));
      }
      dataFn(Buffer.from(responseStr, 'utf8'));
      const endFn = typeFn['end'];
      endFn();
    };
    return response;
  };
  return config;
};

const expectErrorMessage = async (errorMessage, fn, arg1, arg2, arg3, arg4, arg5, arg6) => {
  try {
    await fn(arg1, arg2, arg3, arg4, arg5, arg6);
  } catch (err) {
    assert.isDefined(err);
    // console.trace('expectErrorMessage', errorMessage, fn, err.message);
    expect(errorMessage).to.deep.equal(err.message);
    if (err.message != errorMessage) {
      // console.trace('expectErrorMessage', errorMessage, fn, err);
      assert.fail(`expected:'${errorMessage}'<>actual:'${err.message}'`);
    }
    return;
  }
  assert.fail(`no error was thrown, expected err.message='${errorMessage}'`);
};

exports.getConfig = getConfig;
exports.getUnsupportedConfig = getUnsupportedConfig;
exports.getNoDeviceConfig = getNoDeviceConfig;
exports.expectErrorMessage = expectErrorMessage;
