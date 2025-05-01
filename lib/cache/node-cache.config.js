const NodeCache = require("node-cache");

const nodeCache = new NodeCache({ stdTTL: 300, checkperiod: 120 });

module.exports = nodeCache;
