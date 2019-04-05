const axios = require('axios');

const { youtubeAPIKey, youtubeAPI } = require('../config');

const initInterceptors = () => {
    axios.interceptors.request.use((config) => {
        if (config.url.includes(youtubeAPI)) config.params.key = youtubeAPIKey;
        return config;
    });
};

module.exports = {
    init: initInterceptors,
};