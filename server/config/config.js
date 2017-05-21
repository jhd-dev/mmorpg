module.exports = {
    DOMAIN: process.env.DOMAIN,
    PORT: process.env.PORT || 8080,
    MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/mmorpg',
    FPS: 50
};
