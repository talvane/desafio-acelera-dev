const axios = require('axios');
const api = require('../services/api');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const crypto = require('crypto');

 const utils = {

    async getChallenge(token) {
        try {           
            const { data } = await axios.get(`${api.defaults.baseUrl}/generate-data`, {
                params: {
                    token: token,
                }
            });

            return data;

        } catch (error) {
            console.log('err recup file');
        }
    },

    async writeFile(contentJson) {

        const jsonFile = path.resolve(__dirname, '..', 'store', 'answer.json');

        try {
            await fs.truncate(jsonFile, 0, (err) => {
                if (err) {
                    console.log('err truncate file');
                    console.log(err);
                }
            })

            await fs.appendFile(jsonFile, JSON.stringify(contentJson, null, 2), (err) => {
                if (err) {
                    console.log('err apend file');
                    console.log(err);
                }
            });

            return true;
            
        } catch (error) {
            console.log('Err try to cleanup file');
        }      
    },

    async decryptMsg(encryptMsg, numberCases) {
        const alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
        const txtCrypt = encryptMsg.toLowerCase();
        const txtCryptArr = txtCrypt.split(' ');
        let txtDecrypt = '';

        txtCryptArr.map((word) => {
            const wordCryptArr = [];
            for (let i = 0; i < word.length; i++) {
                wordCryptArr.push(word.charAt(i))
            }

            let wordCrypt = '';
            wordCryptArr.forEach((letter) => {
                wordCrypt += letter;
            })
            
            let wordCryptPos = '';
            wordCryptArr.forEach((letter) => {
                wordCryptPos += alphabet.indexOf(letter) !== -1 ? `${alphabet.indexOf(letter)},` : `(${letter})`
            })


            const wordDecryptPos = []

            for (let i = 0, pointer; i < wordCrypt.length; i++) {
                pointer = '';
                let letter = '';
                let posLetterInAlphabet = 0;

                letter = wordCrypt.charAt(i)

                if (alphabet.includes(letter)) {
                posLetterInAlphabet = alphabet.indexOf(letter)

                if (posLetterInAlphabet - numberCases < 0) {
                    pointer = alphabet.length
                    - numberCases
                    + posLetterInAlphabet
                } else {
                    pointer = posLetterInAlphabet - numberCases
                }

                wordDecryptPos.push(pointer)
                } else {
                wordDecryptPos.push(letter)
                }
            }

            let wordDecrypt = ''

            wordDecryptPos.map((letter) => {
                if (typeof letter === 'number') {
                wordDecrypt += alphabet[letter]
                } else {
                wordDecrypt += letter
                }
            })

            txtDecrypt += `${wordDecrypt} `
        })
        return txtDecrypt.trim();
    },

    async cryptoResumeTxt(txt) {
        let sha1 = crypto.createHash('sha1');
        let txtCrypt = sha1.update(txt, 'utf8', 'hex');
        txtCrypt = sha1.digest('hex');

        return txtCrypt;
    },

    async updateFile(jsonContent, txtDecrypt, txtCryptResume) {
        const jsonFile = path.resolve(__dirname, '..', 'store', 'answer.json');
        
        try {
            const finalJson = jsonContent;
            finalJson.decifrado = txtDecrypt;
            finalJson.resumo_criptografico = txtCryptResume;

            await fs.writeFile(jsonFile, JSON.stringify(finalJson, null, 2), (err) => {
                if (err) {
                    console.log('err write file');
                    console.log(err);
                }
            })

            return finalJson;
        } catch (error) {
            console.log('Err update file');
        }
    },

    async postChallenge(token) {
        try {            
            const jsonFile = path.resolve(__dirname, '..', 'store', 'answer.json');
            const formdata = FormData();
            
            formdata.append('answer', fs.createReadStream(jsonFile));

            console.log('antes do post ----->>>>');

            const { data } = await axios.post(`${api.defaults.baseUrl}/submit-solution`, formdata, {
                headers: formdata.getHeaders(),
                params: {
                    token: token,
                },
            });

            console.log('try data ----->>> ', data);

            return data;

        } catch (error) {
            console.log('Err post challenge!');
            console.log(error);
        }
    }
 }

module.exports = utils;
