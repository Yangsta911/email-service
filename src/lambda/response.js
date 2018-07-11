export const createResponse = (message, status, contentType = 'plain/text') => {
  if (status === undefined) {
    throw new Error('Must specif the status code');
  }
  let headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
    'Access-Control-Allow-Headers': 'Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token',
    'Access-Control-Allow-Methods': 'DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT',
  };

  if (contentType) {
    headers = {
      ...headers,
      'Content-Type': contentType
    };
  }

  let reponse = {
    statusCode: status,
    headers,
  };

  if (message) {
    reponse = {
      ...reponse,
      body: message,
    };
  }

  return reponse;
};

export const createJSONResponse = (message, status) => {
  return createResponse(JSON.stringify(message), status, 'application/json');
};

