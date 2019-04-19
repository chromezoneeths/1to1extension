var popupId;

chrome.storage.local.get("popupid", function(id) {
  popupId = id.popupid;
  if (popupId == null) {
    chrome.tabs.query({
        currentWindow: true,
        active: true
      },
      function(tab) {
        popupId = tab[0].id;
        chrome.storage.local.set({
          "popupid": tab[0].id
        });
      }
    );
  } else {
    popupId = popupId.id;
  }
});

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.for == "background.js" && request.memo == "saveTab") {
      sendResponse({
        notes: "done"
      });
      chrome.tabs.query({
          currentWindow: true,
          active: true
        },
        function(tab) {
          popupId = tab[0].id;
          chrome.storage.local.set({
            "popupid": tab[0].id
          });
        }
      );
    }
  });

chrome.browserAction.onClicked.addListener(function(tab) {
  if (tab.url !== undefined) {
    if (new URL(tab.url).hostname == "customapp.eths.k12.il.us") {
      chrome.storage.local.set({
        "pageStatus": "off"
      });
      chrome.storage.local.set({
        "isonreload": false
      });
      chrome.storage.local.get("popupid", function(id) {
        //chrome.tabs.get(parseInt(popupId), function(id) {
        chrome.tabs.executeScript(id.id, {
          file: "page.js"
        });
        //});
      });
    } else {
      chrome.tabs.update(tab.id, {
        url: "https://customapp.eths.k12.il.us/Pages/OneToOne/ManageDevice/"
      });
    }
  } else {
    chrome.tabs.update(tab.id, {
      url: "https://customapp.eths.k12.il.us/Pages/OneToOne/ManageDevice/"
    });
  }
});

chrome.tabs.onUpdated.addListener(function(a, b, tab) {
  if (tab.url !== undefined) {
    if (new URL(tab.url).hostname == "customapp.eths.k12.il.us") {
      chrome.storage.local.get("isonreload", function(r) {
        if (r.isonreload !== "home") {
          chrome.storage.local.set({
            "isonreload": true
          });
        }
      });

      var popupId;

      chrome.storage.local.get("popupid", function(id) {
        //chrome.tabs.get(parseInt(popupId), function(id) {
        chrome.tabs.executeScript(id.id, {
          file: "page.js"
        });
        //});
      });
    }
  }
});

chrome.contextMenus.create({
  title: "Reset",
  contexts: ["browser_action"],
  onclick: function() {
    chrome.storage.local.set({
      "pageStatus": "off"
    });
    chrome.storage.local.set({
      "isonreload": false
    });
  }
});
