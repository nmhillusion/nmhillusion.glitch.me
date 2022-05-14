"strict";

import fs, { link } from "fs";
import fetch from "node-fetch";
import xml2js from "xml2js";

const TESTING = "true" === process.env.TESTING;

console.log({ TESTING });

function rssParser(xmlData) {
  function getItemAt0(item) {
    return item ? item[0] : null;
  }

  if (!xmlData) {
    return [];
  }

  return new Promise((resolve, reject) => {
    xml2js
      .parseStringPromise(xmlData, { normalize: true })
      .then((r) => {
        try {
          let items = [];
          if (r.rss) {
            items = r.rss.channel[0].item.map((it) => ({
              title: getItemAt0(it.title),
              description: prettierDescription(getItemAt0(it.description)),
              link: parseLinkFromFeed(getItemAt0(it.link)),
              pubDate: getItemAt0(it.pubDate),
              source: parseSourceFromLink(getItemAt0(it.link)),
            }));
          } else if (r.feed) {
            items = r.feed.entry.map((it) => ({
              title: getItemAt0(it.title),
              description: prettierDescription(getItemAt0(it.description)),
              link: parseLinkFromFeed(getItemAt0(it.link)),
              pubDate: getItemAt0(it.pubDate),
              source: parseSourceFromLink(
                parseLinkFromFeed(getItemAt0(it.link))
              ),
            }));
          } else {
            console.error("Not found parser for feed: ", r);
          }
          resolve(items);
        } catch (error) {
          console.error("Error occur: ", error, r);
        }
      })
      .catch(reject);
  });
}

function prettierDescription(description) {
  if (!description) {
    return description;
  }

  return description.replace(/\/zoom\/\d+_\d+/, "");
}

function parseLinkFromFeed(link) {
  if (!link) {
    return link;
  }

  if ("object" == typeof link) {
    if (link["$"]) {
      link = link.$.href;
    }
  }

  return link;
}

function parseSourceFromLink(link) {
  if (!link) {
    return link;
  }
  link = link.replace(/https?:\/\//, "");
  link = link.substring(0, link.indexOf("/"));
  return link;
}

export class CrawlNewsService {
  static loadExample() {
    return new Promise((resolve, reject) => {
      try {
        const xmlData = fs
          .readFileSync(
            process.cwd() + "/service/crawl-news/sample.news.xml"
          )
          .toString();

        rssParser(xmlData).then(resolve).catch(reject);
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
    const newsPromises = this.loadFromNewsSources();

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

  static loadFromNewsSources() {
    const newsResource = this.loadNewsSource();
    const sourcePromises = [];

    for (const sourceNameItem of Object.keys(newsResource)) {
      const sourceItem = newsResource[sourceNameItem];

      sourcePromises.push(
        new Promise((resolve, reject) => {
          const newsPromises = sourceItem.map((src) => {
            return fetch(src, {
              method: "GET",
              redirect: "follow",
              compress: true,
              headers: {
                Connection: "keep-alive",
              },
            })
              .then((r) => r.text())
              .catch((err) => console.error("Error when fetching: ", src, err));
          });

          Promise.all(newsPromises)
            .then(async (resultList) => {
              const combinedNews = [];

              for (const newsData of resultList) {
                combinedNews.push(...(await rssParser(newsData)));
              }

              resolve(combinedNews);
            })
            .catch(reject);
        })
      );
    }

    return sourcePromises;
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
