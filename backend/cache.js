const store = {};

module.exports = {
  get: (key) => store[key],
  set: (key, value) => { store[key] = value; },
  del: (...keys) => keys.forEach((k) => delete store[k]),
};
