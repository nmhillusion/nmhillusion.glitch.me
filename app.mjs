import express from "express";

import { router as fetchTruyenRouter } from "./module/fetch-truyen.module.mjs";

const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.header("Content-Type", "text/html");
  res.charset = "utf-8";
  res.send("Hello World! 3");
});

app.use("/fetch-truyen", fetchTruyenRouter);

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
