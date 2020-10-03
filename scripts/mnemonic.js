'use strict';

const bip39 = require('bip39');
const bip32 = require('bip32');

// coin used by ledger nano s.
const CONSTELLATION_COIN = 1137;
const bip44path = `m/44'/${CONSTELLATION_COIN}'/0'/0/0`;

/**
 * converts a mnemonic into a private key, using the constellation coin's bip44 path.
 *
 * @memberof Main
 * @param {string} mnemonic the mnemonic
 * @return {string} returns the private key, hex encoded, upper case.
 */
function getPrivateKeyFromMnemonic(mnemonic) {
  const seedBytes = bip39.mnemonicToSeedSync(mnemonic);
  // const bip39seed = Buffer.from(seedBytes).toString('hex');
  // console.log('bip39seed', bip39seed);

  const bip32node = bip32.fromSeed(seedBytes);
  // console.log('bip32node', bip32node);

  const bip32child = bip32node.derivePath(bip44path);
  // console.log('bip32child', bip32child);

  return Buffer.from(bip32child.privateKey).toString('hex').toUpperCase();
}

exports.getPrivateKeyFromMnemonic = getPrivateKeyFromMnemonic;
