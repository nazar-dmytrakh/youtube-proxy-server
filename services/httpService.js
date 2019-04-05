const axios = require('axios');

const { youtubeAPI } = require('../config');

const httpService = {
    fetchVideos(params) {
        const defaultParams = {
            part: 'snippet,contentDetails,statistics',
            maxResults: 20,
        };

        return axios.get(`${youtubeAPI}/videos`, { params: { ...defaultParams, ...params } });
    },
    searchVideos(params) {
        const defaultParams = {
            part: 'snippet',
            type: 'video',
            videoEmbeddable: true,
            maxResults: 20,
        };

        return axios.get(`${youtubeAPI}/search`, { params: { ...defaultParams, ...params } })
    }
};

module.exports = httpService;
