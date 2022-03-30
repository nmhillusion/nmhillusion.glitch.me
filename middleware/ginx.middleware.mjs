"strict";

export function ginxMiddleWareHandler(request, response, next) {
  response.header("X-App-Engine", "Ginx");
  next();
}
