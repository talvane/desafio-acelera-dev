const axios = require('axios');

const api = axios.create({
    //token: process.env.CODENATION_API_TOKEN,
    baseUrl: 'https://api.codenation.dev/v1/challenge/dev-ps',
    headers: 'Content-Type: multipart/form-data'
});

module.exports = api;