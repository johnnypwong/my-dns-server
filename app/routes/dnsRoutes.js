export default async function dnsRoutes(fastify, options) {
  const collection = fastify.mongo.db.collection('dns')

  fastify.post('/', async function addDNSRecord(request, reply) {
    const dnsRecord = { ...request.body, createdAt: new Date() };
    const queryResult = await collection.findOne({ 'hostname': dnsRecord.hostname, 'value': dnsRecord.value });
    if (queryResult) {
      reply.code(400).send('Duplicate');
      return
    }
    if (dnsRecord.type == 'A') {
      // TODO: Validation
    } else if (dnsRecord.type == 'CNAME') {
      // TODO: Validation
    }
    else {
      return
    }
    const insertResult = await collection.insertOne(dnsRecord);
    return await collection.findOne({ '_id': insertResult.insertedId });
  });

  fastify.get('/:hostname', async function resolveHostname(request, reply) {
    const hostname = request.params.hostname;
    const dnsRecords = await collection.aggregate([
      {
        $match: {
          'hostname': hostname,
        }
      },
      {
        $limit: 1
      },
      {
        $graphLookup: {
          from: 'dns',
          startWith: '$hostname',
          connectFromField: 'value',
          connectToField: 'hostname',
          as: 'cnameChain'
        }
      }, {
        $project: {
          hostname: 1,
          type: 1,
          cnameChain: 1
        }
      }
    ]).toArray();

    console.debug(dnsRecords);

    if (dnsRecords === undefined || dnsRecords.length == 0) {
      reply.code(404);
      return
    }

    const type = dnsRecords.at(0).type;
    const pointTo = dnsRecords.at(0).cnameChain.at(-1).hostname;
    const aRecords = await collection.find({ 'hostname': pointTo, 'type': 'A' }).toArray();
    const resolvedIPs = aRecords.map(a => a.value);

    // return dnsRecords
    return { hostname, type, resolvedIPs, pointTo }
  });

  fastify.get('/:hostname/records', async function getDNSByHostname(request, reply) {
    const hostname = request.params.hostname;
    const records = await collection.find({ hostname: hostname },
      {
        projection: {
          _id: 0, type: 1, value: 1
        }
      }).toArray();
    return { hostname, records }
  });

  fastify.delete('/:hostname', async function deleteDNSByHostname(request, reply) {
    const hostname = request.params.hostname;
    const type = request.query.type;
    const value = request.query.value;

    const dnsRecord = await collection.findOne({ hostname, type, value });
    if (!dnsRecord) {
      reply.code(404);
      return
    }
    return await collection.deleteOne(dnsRecord);
  });
}