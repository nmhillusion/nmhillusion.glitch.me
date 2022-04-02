"strict";

export function ginxMiddleWareHandler(request, response, next) {
  response.header("X-App-Engine", process.env.APP_NAME);
  next();
}
