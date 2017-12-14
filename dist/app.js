'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

/**
 * Wait for Mongo CLI app.
 *
 * @author J. Scott Smith
 * @license BSD-2-Clause-FreeBSD
 * @module app
 */

const MongoClient = require('mongodb').MongoClient;

module.exports = (() => {
  var _ref = _asyncToGenerator(function* (log) {
    const app = {};

    // App setup
    app.eval = (() => {
      var _ref2 = _asyncToGenerator(function* (p) {
        if (!p.url) throw new Error('Required: url');

        let retries = p.retries;
        while (true) {
          try {
            const db = yield MongoClient.connect(p.url);

            log.info('Connected!');

            yield db.close();
            break;
          } catch (err) {
            log.error(err);
          }

          if (retries-- === 0) throw new Error('MongoDB connection retry attempts exceeded');

          yield new Promise(function (resolve) {
            return setTimeout(resolve, p.sleep);
          });
        }
      });

      return function (_x2) {
        return _ref2.apply(this, arguments);
      };
    })();

    return app;
  });

  return function (_x) {
    return _ref.apply(this, arguments);
  };
})();