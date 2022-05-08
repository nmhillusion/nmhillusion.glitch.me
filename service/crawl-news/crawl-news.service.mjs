"strict";

import fs from "fs";
import fetch from "node-fetch";
import xml2js from "xml2js";

const TESTING = "true" === process.env.TESTING;

console.log({ TESTING });

function vnpressParseRss(xmlData) {
  return new Promise((resolve, reject) => {
    xml2js
      .parseStringPromise(xmlData, { normalize: true })
      .then((r) =>
        resolve(
          r.rss.channel[0].item.map((it) => ({
            title: it.title[0],
            description: it.description[0],
            link: it.link[0],
            pubDate: it.pubDate[0],
          }))
        )
      )
      .catch(reject);
  });
}

export class CrawlNewsService {
  static loadExample() {
    return new Promise((resolve, reject) => {
      try {
        const xmlData = fs
          .readFileSync(process.cwd() + "/service/crawl-news/sample.news.xml")
          .toString();

        vnpressParseRss(xmlData).then(resolve).catch(reject);
      } catch (e) {
        reject(e);
      }
    });
  }

  static loadNewsSource() {
    return JSON.parse(
      fs
        .readFileSync(process.cwd() + "/service/crawl-news/news-source.json")
        .toString()
    );
  }

  static loadFromOnlineSource() {
    const newsPromises = [this.loadFromVnExpress()];

    return new Promise((resolve, reject) => {
      try {
        Promise.all(newsPromises)
          .then(async (resultList) => {
            const combinedNews = [];

            for (const resultItem of resultList) {
              combinedNews.push(...resultItem);
            }

            resolve(combinedNews);
          })
          .catch(reject);
      } catch (e) {
        reject(e);
      }
    });
  }

  static loadFromVnExpress() {
    return new Promise((resolve, reject) => {
      const vnexpressSources = this.loadNewsSource()["vnexpress"];
      const vnexpressPromises = vnexpressSources.map((src) => {
        return fetch(src, {
          method: "GET",
          redirect: "follow",
          compress: true,
          headers: {
            Connection: "keep-alive",
          },
        }).then((r) => r.text());
      });

      Promise.all(vnexpressPromises)
        .then(async (resultList) => {
          const combinedNews = [];

          for (const newsData of resultList) {
            combinedNews.push(...await vnpressParseRss(newsData));
          }

          resolve(combinedNews);
        })
        .catch(reject);
    });
  }

  static crawl() {
    return new Promise(async (resolve, reject) => {
      if (TESTING) {
        resolve(this.loadExample());
      } else {
        resolve(await this.loadFromOnlineSource());
      }
    });
  }
}
