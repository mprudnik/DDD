'use strict';

const crypto = require('node:crypto');

const SALT_LENGTH = 15
const KEY_LENGTH = 64

const hash = (password) => new Promise((resolve, reject) => {
  const salt = crypto.randomBytes(SALT_LENGTH).toString('base64');
  crypto.scrypt(password, salt, KEY_LENGTH, (err, result) => {
    if (err) reject(err);
    resolve(salt + ':' + result.toString('base64'));
  });
});

const compare = (password, hash) => new Promise((resolve, reject) => {
	const [salt, hashedPassword] = hash.split(':')
	crypto.scrypt(password, salt, KEY_LENGTH, (err, derivedKey) => {
		if (err !== null) reject(err)
		resolve(derivedKey.toString('hex') === hashedPassword)
	})
})

module.exports = async () => ({ hash, compare });
