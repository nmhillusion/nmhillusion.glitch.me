"strict";

import * as fs from "fs";
import { Router } from "express";
import { FetchStoryService } from "../service/fetch-story/fetch-story.service.mjs";

export const router = Router();

router.get("/", (req, res) => {
  const { url } = req.query;

  if (!/https?:\/\/metruyenchu\.com\/truyen\/(.+?)\/chuong-\d+/.test(url)) {
    buildHomePageForFetchStory(res);
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

function buildHomePageForFetchStory(res) {
  const REPLACE_PATTERN = "<!--<[[ LINKS_HTML ]]>-->";
  FetchStoryService.fetchSavedLinks()
    .then((links = []) => {
      links = links[0];
      links.splice(0, 1);

      const linksHtml = FetchStoryService.buildSavedLinksHtml(links);
      const fileContent = fs
        .readFileSync(process.cwd() + "/static/fetch-story/_index_.html")
        .toString();

      const outHtml = fileContent.replace(REPLACE_PATTERN, linksHtml);

      res.type("html");
      res.send(outHtml);
    })
    .catch((error) => console.error(error));
}
