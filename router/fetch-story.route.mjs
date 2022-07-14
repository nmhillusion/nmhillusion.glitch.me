"strict";

import { Router } from "express";
import { FetchStoryService } from "../service/fetch-story/fetch-story.service.mjs";

export const router = Router();

router.get("/", (req, res) => {
  const { url } = req.query;

  if (!/https?:\/\/metruyenchu\.com\/truyen\/(.+?)\/chuong-\d+/.test(url)) {
    res.redirect("/static/fetch-story");
  } else {
    FetchStoryService.fetch(url)
      .then((renderedHtml) => {
        res.header("Content-Type", "text/html");
        res.charset = "utf-8";
        res.send(renderedHtml);
      })
      .catch((error) => {
        console.error(error);
        res.statusCode = 400;
        res.send(JSON.stringify(error));
      });
  }
});
