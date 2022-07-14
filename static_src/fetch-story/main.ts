import { LinkItem } from "./LinkItem.model";

(() => {
  const mainSyncData: LinkItem[] = [];
  let mainKeys: string[];
  const config = {
    sheetId: "{{ n2v:fetchStory.savedLink.sheetId }}",
    apiLink: "{{ n2v:fetchStory.savedLink.apiLink }}",
  };

  function gotoLink() {
    const urlInp = document.querySelector("#url-to-go");
    if (urlInp) {
      const urlToGo = (urlInp as HTMLInputElement).value;
      if (urlToGo) {
        location.href = "/fetch-story/?url=" + urlToGo;
      }
    } else {
      console.error("Not found element #url-to-go");
    }
  }

  function fetchLinks() {
    const formData = new FormData();
    formData.append("type", "{{ n2v:fetchStory.savedLink.apiName.getData }}");
    formData.append("data", JSON.stringify(config.sheetId));

    return new Promise<string[][][]>((resolve, reject) => {
      fetch(config.apiLink, {
        method: "POST",
        body: formData,
      })
        .then((r) => r.json())
        .then(resolve)
        .catch(reject);
    });
  }

  function buildLinkList(linkList: LinkItem[]) {
    const linkListEl = document.querySelector("#link-list");

    if (linkListEl && linkList) {
      while (linkListEl.firstChild) {
        linkListEl.removeChild(linkListEl.firstChild);
      }

      for (const item of linkList) {
        const itemContainer = document.createElement("tr");
        itemContainer.className = "link-item";

        {
          const itemLabel = document.createElement("td");
          itemLabel.textContent = item.title;

          const itemLink = document.createElement("td");
          {
            const linkEl = document.createElement("a");
            linkEl.textContent = item.link;
            linkEl.href = "/fetch-story/?url=" + item.link;

            itemLink.appendChild(linkEl);
          }

          const itemActionBox = document.createElement("td");
          {
            const delButton = document.createElement("button");
            delButton.textContent = "Delete";

            delButton.onclick = () => {
              const idxToDel = mainSyncData.findIndex(
                (it) => it.link == item.link
              );
              if (-1 < idxToDel) {
                mainSyncData.splice(idxToDel, 1);
                buildLinkList(mainSyncData);
              }
            };

            itemActionBox.appendChild(delButton);
          }

          itemContainer.appendChild(itemLabel);
          itemContainer.appendChild(itemLink);
          itemContainer.appendChild(itemActionBox);
        }

        linkListEl.appendChild(itemContainer);
      }
    } else {
      console.error("Not found linkList components");
    }
  }

  (function main() {
    const btnGotoLink = document.querySelector(
      "#btnGotoLink"
    ) as HTMLButtonElement;
    const btnAddLink = document.querySelector(
      "#btnAddLink"
    ) as HTMLButtonElement;
    const btnSyncToServer = document.querySelector(
      "#btnSyncToServer"
    ) as HTMLButtonElement;

    if (btnGotoLink) {
      btnGotoLink.onclick = gotoLink;
    }

    if (btnAddLink) {
      btnAddLink.onclick = () => {
        const inpTitle = document.querySelector(
          "#add-link--title"
        ) as HTMLInputElement;
        const inpLink = document.querySelector(
          "#add-link--link"
        ) as HTMLInputElement;

        if (!inpTitle || !inpLink || !inpTitle.value || !inpLink.value) {
          alert("input must not be empty");
          return;
        }

        mainSyncData.push({
          title: String(inpTitle.value).trim(),
          link: String(inpLink.value).trim(),
        });

        buildLinkList(mainSyncData);
      };
    }

    btnSyncToServer.onclick = () => {
      const dataToSync: string[][] = [];

      dataToSync.push(mainKeys);

      for (const item of mainSyncData) {
        const itemData: string[] = [];

        for (const key of mainKeys) {
          itemData.push(item[key]);
        }

        dataToSync.push(itemData);
      }

      const syncObject = {
        id: config.sheetId,
        index: 0,
        values: dataToSync,
      };

      const formData = new FormData();
      formData.append("type", "{{ n2v:fetchStory.savedLink.apiName.setData }}");
      formData.append("data", JSON.stringify(syncObject));

      fetch(config.apiLink, {
        method: "POST",
        body: formData,
      })
        .then((r) => r.text())
        .then((resp) => {
          console.log({ resp });
          alert("Successful: " + resp);
        })
        .catch((error) => {
          console.error({ error });
          alert("Error when sync: " + error);
        });
    };

    fetchLinks().then((data) => {
      const firstSheet: string[][] = data[0];
      if (firstSheet && 0 < firstSheet.length) {
        const tunedData: { [x: string]: string }[] = [];

        mainKeys = firstSheet.shift()!;

        for (const row of firstSheet) {
          const item = {};
          for (const keyIndex in mainKeys) {
            item[mainKeys[keyIndex]] = row[keyIndex];
          }
          tunedData.push(item);
        }

        console.log({ tunedData });
        mainSyncData.push(...(tunedData as unknown as LinkItem[]));
        buildLinkList(mainSyncData);
      }
    });
  })();
})();
