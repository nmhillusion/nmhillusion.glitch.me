import fetch from "node-fetch";
import domParser from "html-dom-parser";

export class FetchTruyenService {
  static fetch(url = "") {
    return new Promise((resolve, reject) => {
      fetch(url, { method: "GET", redirect: "follow", compress: true })
        .then((r) => r.text())
        .then((html) => {
          // console.log({ html });

          const parsedDom = domParser(html);
          const postBodyEl = queryChild(
            parsedDom,
            { type: "tag", name: "div" },
            { class: ["nh-read__content", "post-body"], id: "js-read__content" }
          );

          console.log({ postBodyEl });

          const textNodesOfPost = queryAllChildren(postBodyEl.children, {
            type: "text",
          });

          // console.log({ textNodesOfPost });

          let renderedStoryText = "";
          if (Array.isArray(textNodesOfPost)) {
            renderedStoryText = textNodesOfPost
              .map((item) => item.data)
              .join("<br>");
          }
          resolve(renderedStoryText);
        })
        .catch(reject);
    });
  }
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
