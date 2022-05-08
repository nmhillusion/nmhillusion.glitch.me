"strict";

import { Router } from "express";
import { CrawlNewsService } from "../service/crawl-news/crawl-news.service.mjs";

export const router = Router();

router.get("/", (req, res) => {
  // const { url } = req.query;
  CrawlNewsService.crawl()
    .then((data) => {
      res.header("Content-Type", "application/json");
      res.charset = "utf-8";
      res.send(JSON.stringify(data));
    })
    .catch((error) => {
      res.header("Content-Type", "text/html");
      res.charset = "utf-8";
      res.statusCode = 400;
      res.send(error);
    });
});
