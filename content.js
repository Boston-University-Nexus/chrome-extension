/* global chrome */
var classesScraped = [];

// Makes the program wait
const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

// Redirects User
const redirect = (to) => {
  chrome.tabs.getSelected(null, function (tab) {
    chrome.tabs.update(tab.id, { url: to });
  });
};

// Scrapes external credits
const scrapeExtCredits = () => {
  chrome.tabs.query(
    { active: true, windowId: chrome.windows.WINDOW_ID_CURRENT },
    function (tabs) {
      tabId = tabs[0].id;
      let code = `document.body.innerText`;

      chrome.tabs.executeScript(tabId, { code }, function (result) {
        let text = result[0];

        let x = text.match(/([A-Z][A-Z][A-Z][A-Z][A-Z][0-9][0-9][0-9])+/g, "");

        classesScraped = classesScraped.concat(x);
      });
    }
  );
};

// Scrapes classes taken
const scrapeClassesTaken = () => {
  chrome.tabs.query(
    { active: true, windowId: chrome.windows.WINDOW_ID_CURRENT },
    function (tabs) {
      tabId = tabs[0].id;
      let code = `document.body.innerText`;

      chrome.tabs.executeScript(tabId, { code }, function (result) {
        let text = result[0];

        let x = text.match(/([A-Z][A-Z][A-Z] [A-Z][A-Z][0-9][0-9][0-9])+/g, "");

        classesScraped = classesScraped.concat(x);
      });
    }
  );
};

const sendToServer = (classesScraped, buID) => {
  for (const i in classesScraped)
    classesScraped[i] = classesScraped[i].replace(" ", "");

  let data = {
    classes: classesScraped,
    buID,
  };

  fetch("https://bunexusserver.com/api/saveUserClasses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Success:", data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};

// The sequence of operations the program runs
async function scrapeDataSequence() {
  await chrome.tabs.getSelected(null, async function (tab) {
    let path = tab.url.split("/");
    path = path[path.length - 1];

    let privateId = path.split("?")[0];

    redirect(
      "https://www.bu.edu/link/bin/uiscgi_studentlink.pl/" +
        privateId +
        "?ModuleName=allgpa.pl"
    );
    await sleep(3000);
    scrapeClassesTaken();

    redirect(
      "https://www.bu.edu/link/bin/uiscgi_studentlink.pl/" +
        privateId +
        "?ModuleName=xcred.pl"
    );
    await sleep(3000);
    scrapeExtCredits();

    await sleep(1000);
    sendToServer(classesScraped);
  });
}

// Detects user click
window.onload = () => {
  document.getElementById("clickIt").addEventListener("click", () => {
    scrapeDataSequence();
  });
};
