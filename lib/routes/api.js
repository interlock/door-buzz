const express = require('express');
const router = express.Router();
const stats = require('../stats');

router.get('/data', function(req, res) {
  stats.aggregate(function(err, data) {
    if (err) {
      res.send(err);
    } else {
      var grouped = data.reduce( (p, item) => {
        var d = `${item._id.at.year}-${item._id.at.month}-${item._id.at.day}`;
        if (p[d] === undefined) {
          p[d] = {};
        }
        p[d][item._id.name] = item.count;
        if (p._.indexOf(item._id.name) == -1) p._.push(item._id.name);
        return p;
      }, {_:[]});

      res.send({data, grouped});
    }
  });

});

module.exports = router;
