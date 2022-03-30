"strict";
import express from "express";
import { charsetMiddleWareHandler } from "./middleware/charset.middleware.mjs";
import { ginxMiddleWareHandler } from "./middleware/ginx.middleware.mjs";
import { loggerMiddleWareHandler } from "./middleware/logger.middleware.mjs";

import { router as fetchStoryRouter } from "./router/fetch-story.route.mjs";

const app = express();
const PORT = 3000;

app.use(charsetMiddleWareHandler);
app.use(ginxMiddleWareHandler);
app.use(loggerMiddleWareHandler);

app.get("/", (req, res) => {
  res.header("Content-Type", "text/html");
  res.send("Hello World!");
});

app.use("/fetch-story", fetchStoryRouter);

app.listen(PORT, () => {
  console.log(`app listening on port ${PORT}`);
});
