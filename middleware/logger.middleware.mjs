"strict";

export function loggerMiddleWareHandler(request, response, next) {
  console.log(new Date(), " : ", request.url, " : statusCode = ", response.statusCode);
  next();
}
