// Handlebar checks equality with this helper file
module.exports = {
  isEqualHelper: (a, b, opts) => {
    return a == b ? opts.fn(this) : opts.inverse(this);
  },
};
