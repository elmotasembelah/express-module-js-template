const cache = require("./node-cache.config");

const set = async (key, value, ttlInSeconds = 300) => {
  cache.set(key, value, ttlInSeconds);
};

const get = async (key) => {
  return cache.get(key) || null;
};

const remove = async (key) => {
  cache.del(key);
};

module.exports = {
  set,
  get,
  remove,
};
