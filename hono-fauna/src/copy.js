/**
 * NOTES:
 * - For the `domain` in configs, please refer to https://docs.fauna.com/fauna/current/api/fql/region_groups
 * - For the `secret`, please make sure that it's `admin`. Refer to https://docs.fauna.com/fauna/current/security/keys?lang=javascript
 * - The script retains the `Ref` of the data when it's being copied from the source to the destination, so relationships relying on this should still work out of the box.
 * - The goal here is to make an exact replicate of the source, so once the script is done running, the destination should just work out of the box.
 * - The script also checks if the collection, index, function or data already exists to prevent duplicates.
 */

/**
 * INSTRUCTIONS on how to use:
 * - The database you are copying FROM is referred to as `source`.
 * - The database you are copying TO is referred to as `destination`.
 *
 * 1. Create a new database on a region that you want.
 * 2. Create a secret key for both the source and destination, make sure their both admins.
 * 3. Put corresponding values to the corresponding config constants below.
 * 4. Run the script
 */

// enter values for the database you want to copy from
const sourceConfig = {
    secret: 'fnAFBncQWJAASbTQJZ9EssnEJxiaKKln11deXGwR',
    domain: 'db.fauna.com'
  };
  
  // enter values for the database you want to copy to
  const destinationConfig = {
    secret: 'fnAFBpx5oiAASao2sxbOcNcQIk8ehnzamxYksWjr',
    domain: 'db.us.fauna.com'
  };
  
  // no need to do anything from here unless debugging
  
  const { Client, query } = require('faunadb');
  
  const defaults = {
    checkNewVersion: false,
    scheme: 'https',
    queryTimeout: 60000,
    timeout: 60000
  };
  
  const source = new Client({
    ...defaults,
    ...sourceConfig
  });
  
  const destination = new Client({
    ...defaults,
    ...destinationConfig
  });
  
  // cache of the collections list for later use when copying the data
  const collections = [];
  
  async function copyCollections() {
    let nextToken = null;
    const dos = [];
  
    do {
      const result = await source.query(
        query.Paginate(query.Collections(), { after: nextToken || [] })
      );
  
      nextToken = result.after;
  
      result.data.map(async collection => {
        // cache the collections list for later use when copying the data
        collections.push(collection.id);
  
        dos.push(
          query.If(
            query.Exists(query.Collection(collection.id)),
            null,
            query.CreateCollection({
              name: collection.id,
              history_days: 0
            })
          )
        );
      });
    } while (nextToken);
  
    await destination.query(query.Do(...dos));
    console.log('Done copying collections');
  }
  
  async function copyIndexes() {
    let nextToken = null;
    const dos = [];
  
    do {
      const result = await source.query(
        query.Map(
          query.Paginate(query.Indexes(), { after: nextToken || [] }),
          query.Lambda(['index'], query.Get(query.Var('index')))
        )
      );
  
      nextToken = result.after;
  
      result.data.map(async index => {
        dos.push(
          query.If(
            query.Exists(query.Index(index.name)),
            null,
            query.CreateIndex({
              name: index.name,
              source: index.source,
              terms: index.terms,
              unique: index.unique || false,
              values: index.values || null
            })
          )
        );
      });
    } while (nextToken);
  
    await destination.query(query.Do(...dos));
    console.log('Done copying indexes');
  }
  
  async function copyData() {
    await Promise.all(
      collections.map(async collection => {
        let nextToken = null;
  
        do {
          const result = await source.query(
            query.Map(
              query.Paginate(
                query.Documents(query.Collection(collection)),
                { after: nextToken || [] }
              ),
              query.Lambda(['ref'], query.Get(query.Var('ref')))
            )
          );
  
          nextToken = result.after;
  
          if (result.data.length) {
            await destination.query(
              query.Do(
                ...result.data.map(document => {
                  return query.If(
                    query.Exists(document.ref),
                    null,
                    query.Create(document.ref, {
                      data: document.data
                    })
                  );
                })
              )
            );
          }
        } while (nextToken);
      })
    );
  
    console.log('Done copying all data');
  }
  
  async function copyFunctions() {
    let nextToken = null;
    const dos = [];
  
    do {
      const result = await source.query(
        query.Map(
          query.Paginate(query.Functions(), {
            after: nextToken || []
          }),
          query.Lambda(
            ['ref'],
            query.Get(
              query.Function(query.Select(['id'], query.Var('ref')))
            )
          )
        )
      );
  
      nextToken = result.after;
  
      result.data.map(async udf => {
        dos.push(
          query.If(
            query.Exists(query.Function(udf.name)),
            null,
            query.CreateFunction({
              name: udf.name,
              body: udf.body
            })
          )
        );
      });
    } while (nextToken);
  
    await destination.query(query.Do(...dos));
    console.log('Done copying functions');
  }
  
  (async () => {
    await copyCollections();
    await copyIndexes();
    await Promise.all([copyData(), copyFunctions()]);
    console.log('Done copying database!');
  })();