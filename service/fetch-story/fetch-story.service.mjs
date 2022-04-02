"strict";

import fetch from "node-fetch";
import domParser from "html-dom-parser";
import fs from "fs";

const TESTING = "true" === process.env.TESTING;

console.log({ TESTING });

export class FetchStoryService {
  static #TEMPPLATE_CONTENT = null;

  static getTemplateContent() {
    if (!this.#TEMPPLATE_CONTENT) {
      this.#TEMPPLATE_CONTENT = getTemplateContentInPhysisc();
    }
    return this.#TEMPPLATE_CONTENT;
  }

  static fetch(url = "") {
    return new Promise((resolve, reject) => {
      if (!TESTING) {
        fetch(url, { method: "GET", redirect: "follow", compress: true })
          .then((r) => r.text())
          .then((html) => {
            // console.log({ html });

            resolve(renderedHtmlFromTemplate(html, url));
          })
          .catch(reject);
      } else {
        const samplePage = getSamplePage();
        resolve(renderedHtmlFromTemplate(samplePage, url));
      }
    });
  }
}

function renderedHtmlFromTemplate(html, url) {
  const parsedDom = domParser(html);
  const postBodyEl = queryChild(
    parsedDom,
    { type: "tag", name: "div" },
    { class: ["nh-read__content", "post-body"], id: "js-read__content" }
  );
  const titleEl = queryChild(
    parsedDom,
    {
      type: "tag",
      name: "div",
    },
    {
      class: ["nh-read__title"],
    }
  );
  const pageTitleEl = queryChild(parsedDom, {
    type: "tag",
    name: "title",
  });

  const noPrevChaperNode = queryChild(
    parsedDom,
    {
      type: "tag",
      name: "a",
    },
    {
      class: ["disabled"],
      id: "prevChapter",
    }
  );

  const noNextChaperNode = queryChild(
    parsedDom,
    {
      type: "tag",
      name: "a",
    },
    {
      class: ["disabled"],
      id: "nextChapter",
    }
  );

  const textNodesOfTitle =
    null != titleEl
      ? queryAllChildren(titleEl.children, {
          type: "text",
        })
      : [];

  const textNodesOfPost = queryAllChildren(postBodyEl.children, {
    type: "text",
  });

  const currentChaperNumber = Number(url.substring(url.lastIndexOf("-") + 1));

  const textNodeOfPageTitle = queryChild(pageTitleEl.children, {
    type: "text",
  });

  //// BUILDING ////////////////////////////////////////////////////

  let renderedTitle = "Đọc truyện một mình";
  if (Array.isArray(textNodesOfTitle)) {
    renderedTitle = textNodesOfTitle.map((item) => item.data).join(".");
  }

  let renderedStoryText = "";
  if (Array.isArray(textNodesOfPost)) {
    renderedStoryText = textNodesOfPost.map((item) => item.data).join(`<br >`);
  }

  let resolvePage = FetchStoryService.getTemplateContent()
    .replace("__POST_BODY__", renderedStoryText)
    .replace(/__TITLE__/g, renderedTitle);

  if (!noPrevChaperNode) {
    resolvePage = resolvePage.replace(
      "__PREVIOUS_LINK__",
      buildNavHrefLinkWithUrl("Previous", url, currentChaperNumber - 1)
    );
  } else {
    resolvePage = resolvePage.replace("__PREVIOUS_LINK__", "");
  }
  if (!noNextChaperNode) {
    resolvePage = resolvePage.replace(
      "__NEXT_LINK__",
      buildNavHrefLinkWithUrl("Next", url, currentChaperNumber + 1)
    );
  } else {
    resolvePage = resolvePage.replace("__NEXT_LINK__", "");
  }

  if (textNodeOfPageTitle) {
    resolvePage = resolvePage.replace(
      /__PAGE_TITLE__/g,
      process.env.APP_NAME + " :: " + textNodeOfPageTitle.data
    );
  } else {
    resolvePage = resolvePage.replace(/__PAGE_TITLE__/g, "Không tiêu đề");
  }

  return resolvePage;
}

function buildNavHrefLinkWithUrl(navText, url, pageNumber) {
  url = url.substring(0, url.lastIndexOf("-")) + "-" + pageNumber;
  return `<a href="/fetch-story/?url=${url}" target="_self" class="nav-button">${navText}</a>`;
}

function getTemplateContentInPhysisc() {
  return fs
    .readFileSync(process.env.PWD + "/service/fetch-story/template.html")
    .toString();
}

function getSamplePage() {
  return fs
    .readFileSync(process.env.PWD + "/service/fetch-story/sameple-page.html")
    .toString();
}

function matchingAttribs(attribs, item) {
  // console.log("found on element: ", item);

  if (!!!item) {
    return false;
  }

  if (!attribs) {
    return true;
  }

  return Object.keys(attribs).every((attr) => {
    const selectorAttr = attribs[attr];
    if (!Array.isArray(selectorAttr)) {
      return item.attribs[attr] === selectorAttr;
    } else {
      const itemAttrValues = String(item.attribs[attr]).split(" ");
      // console.log({ itemAttrValues });
      return selectorAttr.every((selectorAttrItem) =>
        itemAttrValues.includes(selectorAttrItem)
      );
    }
  });
}

function matchingSelectors(selectors, item) {
  if (!!!item) {
    return false;
  }

  if (!selectors) {
    return true;
  }

  return Object.keys(selectors).every((type) => item[type] === selectors[type]);
}

function queryChild(children = [], selectors, attribs) {
  let result = null;
  if (Array.isArray(children)) {
    for (const child of children) {
      if (
        matchingSelectors(selectors, child) &&
        matchingAttribs(attribs, child)
      ) {
        result = child;
        break;
      }
    }

    if (!!!result) {
      for (const child of children) {
        if (!!child) {
          result = queryChild(child.children, selectors, attribs);

          if (result) {
            break;
          }
        }
      }
    }
  }
  return result;
}

function queryAllChildren(children = [], selectors, attribs) {
  const resultArray = [];
  if (Array.isArray(children)) {
    for (const child of children) {
      if (
        matchingSelectors(selectors, child) &&
        matchingAttribs(attribs, child)
      ) {
        resultArray.push(child);
      }

      if (!!child) {
        queryAllChildren(child.children, selectors, attribs).forEach((el) =>
          resultArray.push(el)
        );
      }
    }
  }
  return resultArray;
}
