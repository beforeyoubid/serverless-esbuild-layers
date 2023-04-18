import _ from 'lodash';
import { APIGatewayProxyEvent, Context } from 'aws-lambda';

import schema from './schema.graphql';

const handler = (event: APIGatewayProxyEvent, context: Context) => {
  console.log('Event: %j', event);
  console.log('Event: %j', context);

  console.log(`Using lodash: ${_.range(10)}`);
  console.log(`GQL schema: ${schema}`);
};

export default handler;
