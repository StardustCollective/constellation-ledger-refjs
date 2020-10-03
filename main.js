'use strict';

const index = require('./index.js');

const config = {};
config.hostname = 'lb.constellationnetwork.io';
config.port = 9000;
config.debug = true;
config.transportNodeHid = require('@ledgerhq/hw-transport-node-hid');
config.http = require('http');
// config.fee = 1;

// config.salt longMaxValue: 9223372036854775807
// config.salt longMinValue: -9223372036854775808
config.salt = 0;

const commands = {};
commands['getmbalance'] = async (mnemonic) => {
  const response = await index.getBalanceFromMnemonic(config, mnemonic);
  if (config.debug) {
    console.log('getBalanceFromMnemonic response', response);
  }

  if (response.success) {
    console.log('address', response.address);
    console.log('lastTx', response.lastRef);
    console.log('balance', response.balanceWhole);
  } else {
    console.log('balance error', response.message);
  }
};
commands['getlbalance'] = async (mnemonic) => {
  const response = await index.getBalanceFromLedger(config);
  if (config.debug) {
    console.log('getBalanceFromLedger response', response);
  }
  if (response.success) {
    console.log('address', response.address);
    console.log('lastTx', response.lastRef);
    console.log('balance', response.balance);
  } else {
    console.log('balance error', response.message);
  }
};

commands['msend'] = async (amount, toAddress, mnemonic, debug) => {
  if (debug !== undefined) {
    config.debug = (debug == 'true');
  }
  const response = await index.sendAmountUsingMnemonic(config, amount, toAddress, mnemonic);
  if (config.debug) {
    console.log('sendAmountUsingMnemonic response', JSON.stringify(response));
  }
  if (response.success) {
    console.log('send success', response.message);
  } else {
    console.log('send error', response.message);
  }
};

commands['lsend'] = async (amount, toAddress) => {
  console.log('sendAmountUsingLedger', amount, toAddress);
  const response = await index.sendAmountUsingLedger(config, amount, toAddress);
  if (config.debug) {
    console.log('sendAmountUsingLedger response', JSON.stringify(response));
  }
  if (response.success) {
    console.log('send success', response.message);
  } else {
    console.log('send error', response.message);
  }
};

const run = async () => {
  console.log('constellationjs');
  if (process.argv.length < 3) {
    console.log('#usage:');
    console.log('https://github.com/coranos/constellationjs/blob/master/docs/cli.md');
  } else {
    const command = process.argv[2];
    const arg0 = process.argv[3];
    const arg1 = process.argv[4];
    const arg2 = process.argv[5];
    const arg3 = process.argv[6];

    const fn = commands[command];
    if (fn == undefined) {
      console.log('unknown command', command);
    } else {
      await fn(arg0, arg1, arg2, arg3);
    }
  }
};

run();
