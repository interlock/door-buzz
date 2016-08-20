const StatsService = {
  _stats: {},
  increment: function(name, value) {
    value = value || 1;
    if (this._stats[name]) {
      this._stats[name] += value;
    } else {
      this._stats[name] = value;
    }
  },
  get: function(name) {
    return this._stats[name] || 0;
  }
};

module.exports = StatsService;
