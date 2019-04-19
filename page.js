var storage = function(m, v, callback) {
  if (m == "get") {
    chrome.storage.local.get("pageStatus", function(d) {
      callback(d);
    });
  } else if (m == "set") {
    chrome.storage.local.set({
      "pageStatus": v
    });
  }
};


document.querySelector("#form1").onsubmit = function(e) {
  var serialinput = document.querySelector("#MainContent_txtDeviceSerial");
  if (serialinput.value.length > 0 && serialinput.value.length <= 7) {
    e.preventDefault();
    if (serialinput.value.indexOf('LTL') === 0) {
      if ((parseInt(serialinput.value.split('LTL')[1]) + '').length == 3) {
        serialinput.value = "Long Term Loaners " + parseInt(serialinput.value.split('LTL')[1]);
      } else if ((parseInt(serialinput.value.split('LTL')[1]) + '').length == 2) {
        serialinput.value = "Long Term Loaner " + parseInt(serialinput.value.split('LTL')[1]);
      } else if ((parseInt(serialinput.value.split('LTL')[1]) + '').length == 1) {
        serialinput.value = "Long Term Loaner 0" + parseInt(serialinput.value.split('LTL')[1]);
      }
      document.querySelector("#MainContent_rbDeviceName").click();
      serialinput.focus();
      document.querySelector("#MainContent_btnSearch").click();
    } else {
      if (serialinput.value.length == 3) {
        serialinput.value = "CZLOANERS_" + serialinput.value;
      } else if (serialinput.value.length == 2) {
        serialinput.value = "CZLOANER_" + serialinput.value;
      } else if (serialinput.value.length == 1) {
        serialinput.value = "CZLOANER_0" + serialinput.value;
      }
      document.querySelector("#MainContent_rbDeviceName").click();
      serialinput.focus();
      document.querySelector("#MainContent_btnSearch").click();
    }
  }
};

var pageStatus;
var reloadState;
chrome.storage.local.get("isonreload", function(d) {
  reloadState = d.isonreload;
});

function setstat(v) {
  pageStatus = v.pageStatus;
  if (pageStatus == undefined) {
    pageStatus = "off";
    storage("set", "off");
    //storage("get", null, myalert);
  }
  if (this.name == "") {
    //run();
  }
}

function myalert(d) {
  alert(JSON.stringify(d));
}

if (pageStatus == undefined) {
  storage("get", null, setstat);
} else {
  if (this.name == "" || this.name == "Identifying...") {
    //run();
  } else if (this.name == "Running...") {
    this.name = "Identifying...";
    //run();
  }
}

var popupId;

chrome.storage.local.get("popupid", function(id) {
  popupId = id;
});

var resetbuttons = document.querySelectorAll("#BSNavigation_HomeSectionLink, MainContent_btnSave, MainContent_btnSave2");

for (var i = 0; i < resetbuttons.length; i++) {
  //resetbuttons[i].onclick = storage("set", "done");
  resetbuttons[i].onclick = chrome.storage.local.set({
    "isonreload": "home"
  });
}

var popup;
/*chrome.storage.local.get("popup", function(p) {
  if (p !== undefined) {
    popup = p;
  }
});*/
var isPopup;

if (this.name == "Waiting..." || this.name == "Running..." || this.name == "Identifying...") {
  popup = this;
  chrome.storage.local.set({
    "ispopup": false
  });
  d = function() {
    storage("set", "off");
    chrome.storage.local.set({
      "ispopup": false
    });
  };
  chrome.runtime.sendMessage({
    for: "background.js",
    memo: "saveTab"
  }, function(response) {
    console.log(response.notes);
  });
}

function run(idval) {
  chrome.storage.local.get("ispopup", function(d) {
    isPopup = d.ispopup;
  });

  if (this.name !== "") {
    if (this.name == "Waiting...") {
      this.name = "Running...";
      storage("set", "onIdPage");
      pageStatus = "onIdPage";
      if (idval !== "") {
        var id = idval;
        id = id.replace(/(.*\(ID - )/gm, "");
        id = id.replace(/\)/gm, "");
        document.querySelector("#MainContent_txtPerson").value = id;
      } else {
        document.querySelector("#MainContent_txtPerson").value = popup.prompt("No ID found. Please enter: ");
      }
      document.querySelector("#MainContent_btnSearchPerson").click();
    } else if (pageStatus == "onIdPage" && this.name == "Identifying...") {
      var personTable = document.querySelectorAll("#MainContent_gvPerson tbody tr"),
        row;
      for (var i = 0; i < personTable.length; i++) {
        personRow = personTable[i];
        personCell = personRow.querySelectorAll("td");
        if (personCell[2] !== undefined && personCell[2].innerText == "False	" && personCell[4] !== undefined && personCell[4].innerText.charCodeAt(0) == 160) {
          pageStatus = "done";
          storage("set", "done");
          this.location.href = personCell[1].querySelector("a").href;
        }
      }
    }
  } else if (pageStatus == "off" && !reloadState && !isPopup) {
    var w = screen.width / 4 * 3;
    var h = screen.height / 4 * 3;
    popup = window.open(window.location.href, "Waiting...", "width=" + w + ",height=" + h);
    chrome.storage.local.set({
      "ispopup": true
    });
    chrome.storage.local.set({
      "popup": popup
    });
    var parentId = document.querySelector("#MainContent_txtAssignee");
    popup.onload = function() {
      popup.setId(parentId);
      popup.onbeforeunload = function() {
        chrome.storage.local.set({
          "popupid": null
        });
      };
    };
  }
}

function setId(id) {
  if (id !== null) {
    //run(id.value);
  } else {
    //run("");
  }
}

if (reloadState == "home") {
  chrome.storage.local.set({
    "isonreload": false
  });
  reloadState = false;
}

window.onerror = function(m, u, l) {
  //alert("Error on line " + l + " of url " + u + ": " + m);
};
