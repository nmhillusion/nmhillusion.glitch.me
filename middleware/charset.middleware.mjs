"strict";

export function charsetMiddleWareHandler(request, response, next) {
  response.charset = "utf-8";
  next();
}
