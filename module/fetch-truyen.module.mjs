import { Router } from "express";
import fetch from "node-fetch";
import domParser from "html-dom-parser";

export const router = Router();

function queryChild(
  children = [],
  selectors = { type: "tag", name: "head" },
  attribs = { class: "page" }
) {
  let result = null;
  for (const child of children) {
    if (
      Object.keys(selectors).every((type) => child[type] === selectors[type])
    ) {
      result = child;
      break;
    }
  }
  return result;
}

router.get("/", (req, res) => {
  const { url } = req.query;

  fetch(url, { method: "GET", redirect: "follow", compress: true })
    .then((r) => r.text())
    .then((html) => {
      // console.log({ html });

      const parsedDom = domParser(html);
      const htmlEl = queryChild(parsedDom, {
        type: "tag",
        name: "html",
      });

      const bodyEl = queryChild(htmlEl.children, {
        type: "tag",
        name: "body",
      });

      for (const child of bodyEl.children) {
        if (child.name !== "script" && child.name !== "style") {
          console.log({ child });
        }
      }

      // id="js-read__content",class="post-body"

      res.header("Content-Type", "text/html");
      res.charset = "utf-8";
      res.send("ok");
    })
    .catch((error) => {
      console.error(error);
      res.statusCode = 400;
      res.send(error);
    });
});
