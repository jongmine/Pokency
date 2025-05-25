export const ok = (body) => ({
  statusCode: 200,
  body: JSON.stringify(body),
});

export const badRequest = (message) => ({
  statusCode: 400,
  body: JSON.stringify({ error: message }),
});

export const internalError = (message) => ({
  statusCode: 500,
  body: JSON.stringify({ error: message }),
});
