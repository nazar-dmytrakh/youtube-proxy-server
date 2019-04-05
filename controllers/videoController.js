const httpService = require('../services/httpService');
const fakeDB = require('../fakeDB');
const Boom = require('boom');

const formatVideoItems = items => items.map(({
    id,
    snippet: {
         title,
         thumbnails: { high: { url } },
    },
    contentDetails: { duration, definition },
    statistics: { viewCount, likeCount, dislikeCount }
}) => ({
    id,
    title,
    thumbnailUrl: url,
    duration,
    definition,
    saved: fakeDB.data.includes(id),
    viewCount,
    likeCount,
    dislikeCount,
}));

exports.getSavedVideos = async (req, res) => {
    if (!fakeDB.data.length) res.json({ items: [] });

    const params = {
        id: fakeDB.data.join(','),
        pageToken: req.query.page || '',
    };

    try {
        const { data: { items, nextPageToken } } = await httpService.fetchVideos(params);
        res.json({ items: formatVideoItems(items), nextPageToken });
    } catch ({ response: { status, data } }) {
        res.status(status).send(data);
    }
};

exports.getSingleVideo = async (req, res) => {
    const params = { id: req.params.id };

    try {
        const { data: { items } } = await httpService.fetchVideos(params);
        res.json({ ...formatVideoItems(items)[0] });
    } catch ({ response: { status, data } }) {
        res.status(status).send(data);
    }
};

exports.getTrendVideos = async (req, res) => {
    const params = {
        chart: 'mostPopular',
        pageToken: req.query.page || '',
    };

    try {
        const { data: { items, nextPageToken } } = await httpService.fetchVideos(params);
        res.json({ items: formatVideoItems(items), nextPageToken });
    } catch ({ response: { status, data } }) {
        res.status(status).send(data);
    }
};

exports.searchVideos = async (req, res) => {
    if(!req.query.name) res.json(Boom.badRequest('Name is required'));

    const params = {
        q: req.query.name,
        pageToken: req.query.page || '',
    };

    try {
        const { data: { items: searchItems, nextPageToken } } = await httpService.searchVideos(params);
        const idList = searchItems.map(({ id: { videoId } }) => videoId).join(',');
        const { data: { items } } = await httpService.fetchVideos({ id: idList });

        res.json({ items: formatVideoItems(items), nextPageToken });
    } catch ({ response: { status, data } }) {
        res.status(status).send(data);
    }
};

exports.saveVideo = (req, res) => {
    if(!fakeDB.data.includes(req.params.id)) fakeDB.data.push(req.params.id);

    return res.status(204).send();
};

exports.deleteVideo = (req, res) => {
    fakeDB.data = fakeDB.data.filter(id => id !== req.params.id);

    return res.status(204).send();
};