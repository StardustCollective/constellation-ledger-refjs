'use strict';
// libraries

// modules

// constants

// variables
const DEBUG = false;

// functions
const serialize = (msg, debug) => {
  return kryoSerialize(msg, debug);
};

const kryoSerialize = (msg, debug) => {
  /* istanbul ignore if */
  if (DEBUG || (debug == true)) {
    console.log('kryoSerialize', 'msg', msg);
  }
  const prefix = '0301' + Buffer.from(utf8Length(msg.length + 1)).toString('hex');

  const coded = Buffer.from(msg, 'utf8').toString('hex');

  const retval = prefix + coded;

  /* istanbul ignore if */
  if (DEBUG || (debug == true)) {
    console.log('kryoSerialize', 'retval', retval);
  }

  return retval;
};

/* Writes the length of a string.
 * This is a variable length encoded int.
 * The only exception is that the first byte uses bit 8 to denote UTF8 and
 * bit 7 to denote if another byte is present.
 */
const utf8Length = (value) => {
  let buffer;
  let position = 0;

  const require = (length) => buffer = new Uint16Array(length);

  if (value >>> 6 == 0) {
    require(1);
    buffer[position++] = (value | 0x80); // Set bit 8.
  } else if (value >>> 13 == 0) {
    require(2);
    buffer[position++] = (value | 0x40 | 0x80); // Set bit 7 and 8.
    buffer[position++] = (value >>> 6);
  } else if (value >>> 20 == 0) {
    require(3);
    buffer[position++] = (value | 0x40 | 0x80); // Set bit 7 and 8.
    buffer[position++] = ((value >>> 6) | 0x80); // Set bit 8.
    buffer[position++] = (value >>> 13);
  } else if (value >>> 27 == 0) {
    require(4);
    buffer[position++] = (value | 0x40 | 0x80); // Set bit 7 and 8.
    buffer[position++] = ((value >>> 6) | 0x80); // Set bit 8.
    buffer[position++] = ((value >>> 13) | 0x80); // Set bit 8.
    buffer[position++] = (value >>> 20);
  } else {
    require(5);
    buffer[position++] = (value | 0x40 | 0x80); // Set bit 7 and 8.
    buffer[position++] = ((value >>> 6) | 0x80); // Set bit 8.
    buffer[position++] = ((value >>> 13) | 0x80); // Set bit 8.
    buffer[position++] = ((value >>> 20) | 0x80); // Set bit 8.
    buffer[position++] = (value >>> 27);
  }

  return buffer;
};

exports.serialize = serialize;
