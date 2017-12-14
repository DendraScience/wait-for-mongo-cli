#!/usr/bin/env node
'use strict';

/**
 * Wait for Mongo CLI entry point.
 *
 * @author J. Scott Smith
 * @license BSD-2-Clause-FreeBSD
 * @module wait-for-mongo
 */

const mri = require('mri');

const log = console;

process.on('uncaughtException', err => {
  log.error(`An unexpected error occurred\n  ${err.stack}`);
  process.exit(1);
});

process.on('unhandledRejection', err => {
  if (!err) {
    log.error('An unexpected empty rejection occurred');
  } else if (err instanceof Error) {
    log.error(`An unexpected rejection occurred\n  ${err.stack}`);
  } else {
    log.error(`An unexpected rejection occurred\n  ${err}`);
  }
  process.exit(1);
});

require('./app')(log).then(app => {
  const args = process.argv.slice(2);
  const parsed = mri(args, {
    default: {
      retries: 100,
      sleep: 5000,
      url: process.env.MONGO_URL
    },
    string: ['url']
  });

  return app.eval(parsed);
});