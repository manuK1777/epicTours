export const handleResponse = (res, code, message, data = null, error = null) => {
  // Use HTTP status code 200 for success responses
  const httpStatus = error ? (code >= 400 && code <= 599 ? code : 500) : 200;
  res.status(httpStatus).json({ code, message, data, error });
};

export const handleError = (res, error) => {
  console.error(error);
  handleResponse(res, 500, 'An error occurred', null, error.message);
};
