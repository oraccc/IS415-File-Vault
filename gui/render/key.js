const crypto = require('crypto');

const algorithm = 'aes-256-ctr';
const iv = new Buffer.from([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,]);

const encrypt = (data, key) => {
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    const encrypted = Buffer.concat([cipher.update(data), cipher.final()]);
    return encrypted;
};

const decrypt = (data, key) => {
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    const decrpyted = Buffer.concat([decipher.update(data), decipher.final()]);
    return decrpyted;
};

module.exports = {
    encrypt,
    decrypt
};