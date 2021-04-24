require('dotenv').config();

import * as Prometheus from 'prom-client';
import { AddressInfo } from 'net';

import app from './app';
import dynamoDocClient from './v1/dynamo.util';

app.locals.docClient = dynamoDocClient();


const port = process.env.PORT || 3001;
const server = app.listen(port, () => {
  let address: string = (server.address() as AddressInfo).address;
  const IPv6FillerAddress: string = '::'
  address = address === IPv6FillerAddress ? 'localhost' : address;
  console.log(`Listening at http://${address}:${port}`);
});

  // Graceful shutdown
process.on('SIGTERM', () => {
  // clearInterval(metricsInterval);
  console.log("SIGTERM signal received ..");
  console.log("Graceful shutdown ..");

  server.close(err => {
    console.log("stop excepting requests ..");
    if (err) {
      console.error(err);
      process.exit(1);
    }

    process.exit(0);
  });
});

