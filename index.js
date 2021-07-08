'use strict';

// STARTED TOP nodejs/browser hack
(function() {
  // FINISHED TOP nodejs/browser hack
  const integrationUtil = require('./scripts/integration.js');
  const mnemonicUtil = require('./scripts/mnemonic.js');
  const keyTranscodeUtil = require('./scripts/key-transcode.js');
  const addressTranscodeUtil = require('./scripts/address-transcode.js');
  const ledgerCommUtil = require('./scripts/ledger-comm.js');
  const signUtil = require('./scripts/tx-sign.js');
  const hashUtil = require('./scripts/sha256-hash.js');
  const txTranscodeUtil = require('./scripts/tx-transcode.js');
  const txHashEncodeUtil = require('./scripts/tx-hash-encode.js');
  const kryoUtil = require('./scripts/kryo.js');

  const leftPad = (number, length) => {
    let str = '' + number;
    while (str.length < length) {
      str = '0' + str;
    }
    return str;
  };

  const toWholeNumber = (balance) => {
    // console.log('toWholeNumber', 'balance', balance);
    const paddedBalance = leftPad(balance, 9);
    // console.log('toWholeNumber', 'paddedBalance', paddedBalance);
    const prefixLength = paddedBalance.length - 8;
    // console.log('toWholeNumber', 'prefixLength', prefixLength);
    const prefix = paddedBalance.slice(0, prefixLength);
    // console.log('toWholeNumber', 'prefix', prefix);
    const suffix = paddedBalance.slice(-8);
    // console.log('toWholeNumber', 'suffix', suffix);
    return `${prefix}.${suffix}`;
  };

  const getLedgerDeviceInfo = async (config) => {
    /* istanbul ignore if */
    if (config == undefined) {
      throw Error('config is a required parameter.');
    }
    return new Promise((resolve) => {
      const callback = async (msg) => {
        resolve(msg);
      }
      ledgerCommUtil.getLedgerDeviceInfo(config.transportNodeHid, callback);
    });
  }

  const getBalanceFromLedger = async (config) => {
    /* istanbul ignore if */
    if (config == undefined) {
      throw Error('config is a required parameter.');
    }
    return new Promise((resolve, reject) => {
      const callback = async (msg) => {
        /* istanbul ignore if */
        if (config.debug) {
          console.log('getBalanceFromLedger', 'msg', msg);
        }
        if (msg.success) {
          const publicKey = msg.publicKey;
          /* istanbul ignore if */
          if (config.debug) {
            console.log('getBalanceFromLedger', 'publicKey', publicKey);
          }
          const address = addressTranscodeUtil.getAddressFromRawPublicKey(publicKey);
          /* istanbul ignore if */
          if (config.debug) {
            console.log('getBalanceFromLedger', 'address', address);
          }
          const path = `/address/${address}`;
          const response = await integrationUtil.get(config, path);
          response.balanceWhole = toWholeNumber(response.balance);
          response.address = address;
          response.success = true;
          // const lastRefPath = `/transaction/last-ref/${address}`;
          // const lastRefResponse = await integrationUtil.get(config, lastRefPath);
          // response.lastRef = lastRefResponse;
          resolve(response);
        } else {
          resolve(msg);
          // normally we would reject here to throw an error.
          // but since we are returning a JSON object,
          // we return success:false with a message, instead of throwing an error.
          // reject(Error(msg.message));
          /* istanbul ignore if */
          if (config.debug) {
            console.log('getBalanceFromLedger', 'error ', msg);
          }
        }
      };
      ledgerCommUtil.getPublicKey(config.transportNodeHid, callback);
    });
  };

  const getBalanceFromMnemonic = async (config, mnemonic) => {
    /* istanbul ignore if */
    if (config == undefined) {
      throw Error('config is a required parameter.');
    }
    /* istanbul ignore if */
    if (mnemonic == undefined) {
      throw Error('mnemonic is a required parameter.');
    }
    /* istanbul ignore if */
    if (config.debug) {
      console.log('mnemonic', mnemonic);
    }
    const privateKey = mnemonicUtil.getPrivateKeyFromMnemonic(mnemonic);
    /* istanbul ignore if */
    if (config.debug) {
      console.log('privateKey', privateKey);
    }
    const publicKey = keyTranscodeUtil.getPublicFromPrivate(privateKey);
    /* istanbul ignore if */
    if (config.debug) {
      console.log('publicKey', publicKey);
    }
    const address = addressTranscodeUtil.getAddressFromRawPublicKey(publicKey);
    /* istanbul ignore if */
    if (config.debug) {
      console.log('address', address);
    }
    const path = `/address/${address}`;
    const response = await integrationUtil.get(config, path);
    response.balanceWhole = toWholeNumber(response.balance);
    response.address = address;
    response.success = true;
    // const lastRefPath = `/transaction/last-ref/${address}`;
    // const lastRefResponse = await integrationUtil.get(config, lastRefPath);
    // response.lastRef = lastRefResponse;
    return response;
  };

  const sendAmountUsingMnemonic = async (config, amount, toAddress, mnemonic) => {
    /* istanbul ignore if */
    if (config == undefined) {
      throw Error('config is a required parameter.');
    }
    /* istanbul ignore if */
    if (amount == undefined) {
      throw Error('amount is a required parameter.');
    }
    /* istanbul ignore if */
    if (toAddress == undefined) {
      throw Error('toAddress is a required parameter.');
    }
    /* istanbul ignore if */
    if (mnemonic == undefined) {
      throw Error('mnemonic is a required parameter.');
    }
    /* istanbul ignore if */
    if (config.debug) {
      console.log('sendAmountUsingMnemonic', 'mnemonic', mnemonic);
    }
    const privateKey = mnemonicUtil.getPrivateKeyFromMnemonic(mnemonic);
    /* istanbul ignore if */
    if (config.debug) {
      console.log('sendAmountUsingMnemonic', 'privateKey', privateKey);
    }
    const publicKey = keyTranscodeUtil.getPublicFromPrivate(privateKey);
    /* istanbul ignore if */
    if (config.debug) {
      console.log('sendAmountUsingMnemonic', 'publicKey', publicKey);
    }
    const address = addressTranscodeUtil.getAddressFromRawPublicKey(publicKey);
    /* istanbul ignore if */
    if (config.debug) {
      console.log('sendAmountUsingMnemonic', 'address', address);
    }
    const callback = {};
    callback.signEncodedTx = (encodedTx) => {
      return signUtil.sign(encodedTx, privateKey);
    };

    return await sendAmountUsingCallback(config, amount, toAddress, address, publicKey, callback);
  };

  const sendAmountUsingLedger = async (config, amount, toAddress) => {
    /* istanbul ignore if */
    if (config == undefined) {
      throw Error('config is a required parameter.');
    }
    /* istanbul ignore if */
    if (amount == undefined) {
      throw Error('amount is a required parameter.');
    }
    /* istanbul ignore if */
    if (toAddress == undefined) {
      throw Error('toAddress is a required parameter.');
    }

    return new Promise((resolve) => {
      const getAddressCallback = async (msg) => {
        /* istanbul ignore if */
        if (config.debug) {
          console.log('sendAmountUsingLedger', 'msg', msg);
        }
        if (msg.success) {
          const publicKey = msg.publicKey;
          /* istanbul ignore if */
          if (config.debug) {
            console.log('sendAmountUsingLedger', 'publicKey', publicKey);
          }
          const address = addressTranscodeUtil.getAddressFromRawPublicKey(publicKey);
          /* istanbul ignore if */
          if (config.debug) {
            console.log('sendAmountUsingLedger', 'address', address);
          }

          const callback = {};
          callback.signEncodedTx = (encodedTx) => {
            return new Promise((resolve, reject) => {
              const signCallback = (response) => {
                /* istanbul ignore if */
                if (config.debug) {
                  console.log('sendAmountUsingLedger', 'signCallback', 'response', response);
                }
                if (response.success) {
                  resolve(response.signature);
                  // resolve(Buffer.from(response.signature, 'hex'));
                } else {
                  reject(Error(response.message));
                }
              };
              /* istanbul ignore if */
              if (config.debug) {
                console.log('sendAmountUsingLedger', 'signCallback', 'encodedTx', encodedTx);
              }
              ledgerCommUtil.sign(config.transportNodeHid, encodedTx, signCallback);
            });
          };

          resolve(await sendAmountUsingCallback(config, amount, toAddress, address, publicKey, callback));
        } else {
          resolve(msg);
          /* istanbul ignore if */
          if (config.debug) {
            console.log('getBalanceFromLedger', 'error ', msg);
          }
        }
      };
      ledgerCommUtil.getPublicKey(config.transportNodeHid, getAddressCallback);
    });
  };

  const sendAmountUsingCallback = async (config, amount, toAddress, address, publicKey, callback) => {
    const lastRefPath = `/transaction/last-ref/${address}`;
    const lastRefResponse = await integrationUtil.get(config, lastRefPath);
    if (config.debug) {
      console.log('sendAmountUsingCallback', 'lastRefResponse', lastRefResponse);
    }

    amount = Number(amount);

    lastRefResponse.tx = {
      'edge': {
        'observationEdge': {
          'parents': [{
            'hashReference': address,
            'hashType': 'AddressHash',
          }, {
            'hashReference': toAddress,
            'hashType': 'AddressHash',
          }],
          'data': {
            'hashType': 'TransactionDataHash',
          },
        },
        'signedObservationEdge': {
          'signatureBatch': {
            'hash': '',
            'signatures': [],
          },
        },
        'data': {
          'amount': amount,
          'lastTxRef': {
            'prevHash': lastRefResponse.prevHash,
            'ordinal': lastRefResponse.ordinal,
          },
          'salt': config.salt,
        },
      },
      'lastTxRef': {
        'prevHash': lastRefResponse.prevHash,
        'ordinal': lastRefResponse.ordinal,
      },
      'isDummy': false,
      'isTest': false,
    };

    if (config.fee > 0) {
      lastRefResponse.tx.edge.data.fee = config.fee;
    }

    const hashReference = txHashEncodeUtil.encodeTxHash(lastRefResponse.tx, true);
    lastRefResponse.tx.edge.observationEdge.data.hashReference = hashReference;

    const encodedTx = txTranscodeUtil.encodeTx(lastRefResponse.tx, false, false);

    console.log('hashReference', hashReference);
    console.log('encodedTx', encodedTx);

    const hash = signUtil.getHash(encodedTx, config.debug);
    lastRefResponse.tx.edge.signedObservationEdge.signatureBatch.hash = hash;

    try {
      const signature = await callback.signEncodedTx(encodedTx);
      /* istanbul ignore if */
      if (config.debug) {
        console.log('sendAmountUsingCallback', 'encodedTx', encodedTx);
        console.log('sendAmountUsingCallback', 'hash', hash);
        console.log('sendAmountUsingCallback', 'signature', signature);
        console.log('sendAmountUsingCallback', 'publicKey', publicKey);
      }

      const verifyResponse = signUtil.verify(hash, signature, publicKey);
      // const verifyResponse = signUtil.verify(Buffer.from(hash, 'hex'), signature, publicKey);
      if (verifyResponse == false) {
        throw Error(`invalidSignature encodedTx:'${encodedTx}' hash:'${hash}', publicKey:'${publicKey}' signature:'${signature}'`);
      }
      /* istanbul ignore if */
      if (config.debug) {
        console.log('verifyResponse', verifyResponse);
      }

      const signatureElt = {};
      signatureElt.signature = signature;
      signatureElt.id = {};
      signatureElt.id.hex = publicKey.substring(2);
      lastRefResponse.tx.edge.signedObservationEdge.signatureBatch.signatures.push(signatureElt);

      const transactionPath = '/transaction';
      const transactionResponse = await integrationUtil.post(config, transactionPath, lastRefResponse.tx);

      lastRefResponse.address = address;
      lastRefResponse.success = true;
      lastRefResponse.message = transactionResponse;

      /* istanbul ignore if */
      if (config.debug) {
        console.log('lastRefResponse', lastRefResponse);
      }
      return lastRefResponse;
    } catch (error) {
      const errorResponse = {};
      errorResponse.success = false;
      errorResponse.message = error.message;
      return errorResponse;
    }
  };

  // STARTED BOTTOM nodejs/browser hack
  const exports = (() => {
    //     // istanbul ignore if
    const exports = {};
    exports.getBalanceFromMnemonic = getBalanceFromMnemonic;
    exports.getBalanceFromLedger = getBalanceFromLedger;
    exports.sendAmountUsingMnemonic = sendAmountUsingMnemonic;
    exports.sendAmountUsingLedger = sendAmountUsingLedger;
    exports.getLedgerDeviceInfo = getLedgerDeviceInfo;
    return exports;
  })();
  /* istanbul ignore else */
  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = exports;
  } else {
    window.constellationjs = exports;
  }
})();
// FINISHED BOTTOM nodejs/browser hack
