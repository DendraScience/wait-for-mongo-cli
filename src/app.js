/**
 * Wait for Mongo CLI app.
 *
 * @author J. Scott Smith
 * @license BSD-2-Clause-FreeBSD
 * @module app
 */

const MongoClient = require('mongodb').MongoClient

module.exports = async (log) => {
  const app = {}

  // App setup
  app.eval = async (p) => {
    if (!p.url) throw new Error('Required: url')

    let retries = p.retries
    while (true) {
      try {
        const db = await MongoClient.connect(p.url)

        log.info('Connected!')

        await db.close()
        break
      } catch (err) {
        log.error(err)
      }

      if (retries-- === 0) throw new Error('MongoDB connection retry attempts exceeded')

      await new Promise(resolve => setTimeout(resolve, p.sleep))
    }
  }

  return app
}
