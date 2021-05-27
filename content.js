/* global chrome */
var classesScraped = [];
var buID;

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
        let y = text.match(/([A-Z][A-Z][A-Z][A-Z][A-Z][0-9]\*\*)+/g, "");

        if (x) classesScraped = classesScraped.concat(x);
        if (y) classesScraped = classesScraped.concat(y);

        document.getElementById("loading").style.display = "none";
        document.getElementById("confirmData").style.display = "flex";

        console.log(classesScraped);

        for (const i in classesScraped)
          classesScraped[i] = "<span>" + classesScraped[i] + "</span>";

        let classesToHtml = classesScraped.join("");
        classesToHtml = classesToHtml.replace(/\s/g, "");

        document.getElementById("allClasses").innerHTML = classesToHtml;
        document.getElementById("savedBUID").innerHTML =
          "<span>BU ID: </span>U" + buID;

        document
          .getElementById("confirmButton")
          .addEventListener("click", () => sendToServer());
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

const sendToServer = (classesScraped) => {
  for (const i in classesScraped)
    classesScraped[i] = classesScraped[i].replace(" ", "");

  let data = {
    classes: classesScraped,
    buID: buID,
  };

  console.log(JSON.stringify(data));

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
  });
}

// Detects user click
window.onload = () => {
  document.getElementById("clickIt").addEventListener("click", () => {
    scrapeDataSequence();

    buID = document.getElementById("buidinput").value;

    document.getElementById("firstPage").style.display = "none";
    document.getElementById("loading").style.display = "flex";
  });

  document.getElementById("BUID").addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.keyCode === 13) {
      scrapeDataSequence();

      buID = document.getElementById("buidinput").value;

      document.getElementById("firstPage").style.display = "none";
      document.getElementById("loading").style.display = "flex";
    }
  });
};
