"strict";
import express from "express";
import cors from "cors";

import { charsetMiddleWareHandler } from "./middleware/charset.middleware.mjs";
import { ginxMiddleWareHandler } from "./middleware/ginx.middleware.mjs";
import { loggerMiddleWareHandler } from "./middleware/logger.middleware.mjs";

import { router as fetchStoryRouter } from "./router/fetch-story.route.mjs";
import { router as crawlNewsRouter } from "./router/crawl-news.route.mjs";

const app = express();
const PORT = 8000;

app.use(charsetMiddleWareHandler);
app.use(ginxMiddleWareHandler);
app.use(loggerMiddleWareHandler);
app.use("/static", express.static(process.cwd() + "/static"))

app.get("/", (req, res) => {
  res.header("Content-Type", "text/html");
  res.send("nmhillusion works!");
});

app.use("/fetch-story", fetchStoryRouter);
app.use("/crawl-news", cors({ origin: "*" }), crawlNewsRouter);

app.listen(PORT, () => {
  console.log(`app listening on port ${PORT}: http://localhost:8000`);
});
