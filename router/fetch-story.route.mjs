"strict";

import { Router } from "express";
import { FetchStoryService } from "../service/fetch-story/fetch-story.service.mjs";

export const router = Router();

router.get("/", (req, res) => {
  const { url } = req.query;

  if (!/https?:\/\/metruyenchu\.com\/truyen\/(.+?)\/chuong-\d+/.test(url)) {
    res.header("Content-Type", "text/html");
    res.send(
      `
      <div class="nav-url">
        <input type="text" name="url-to-go" id="url-to-go" />
        <button class="btn btn-primary" onclick="gotoLink()">Goto</button>
      </div>

      <script type="text/javascript">
        function gotoLink() {
          const urlToGo = document.querySelector("#url-to-go").value;
          if (urlToGo) {
            location.href = "/fetch-story/?url=" + urlToGo;
          }
        }
      </script>
      `
    );
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
