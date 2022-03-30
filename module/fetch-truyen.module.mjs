import { Router } from "express";
import { FetchTruyenService } from "../service/fetch-truyen.service.mjs";

export const router = Router();

router.get("/", (req, res) => {
  const { url } = req.query;

  if (!/https?:\/\/metruyenchu\.com\/truyen\/(.+?)\/chuong-\d+/.test(url)) {
    res.header("Content-Type", "application/json");
    res.charset = "utf-8";
    res.statusCode = 400;
    res.send(
      JSON.stringify({
        errorMessage: "url is not valid",
        validUrlPattern: `/https?:\/\/metruyenchu\.com\/truyen\/(.+?)\/chuong-\d+/`
      })
    );
  } else {
    FetchTruyenService.fetch(url)
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
