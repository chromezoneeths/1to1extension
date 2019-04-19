/*jshint esversion: 6*/
window.addEventListener('load', function() {
  if (window.location.hostname.indexOf('customapp.eths.k12.il.us') !== -1) {
    start();
  }
});

function isLoaner(e) {
  if (!doSubmit) {
    doSubmit = true;
    if (document.getElementById('MainContent_rbLoaner')) {
      if (document.getElementById('MainContent_rbLoaner_1').checked) {
        console.log('Daily');
        loanerCheckout();
        return false;
      } else if (document.getElementById('MainContent_rbLoaner_2').checked) {
        console.log('Long term');
        loanerCheckout();
        return false;
      } else {
        console.log('Not a loaner.');
      }
    }
    //return false;
  } else {
    return true;
  }
}

var serial;
var first, last, id, grade, reason, date, time, device, serial, chrometech;

function loanerCheckout() {
  var namestr = document.getElementById('MainContent_txtAssignee').value;
  first = /, (.*?) /.exec(namestr)[1];
  last = /(.*?),/.exec(namestr)[1];
  id = /- ([0-9]*)/.exec(namestr)[1];
  grade = document.getElementById('MainContent_lblGrade').innerHTML;
  reason = document.getElementById('MainContent_ddlLoanReason')
    .querySelector('option[value=\"' + document.getElementById('MainContent_ddlLoanReason').value + '\"]')
    .innerHTML;
  var dateobj = new Date(new Date().toLocaleString("en-US", {
    timeZone: "America/Chicago"
  }));
  date = twoDigit(dateobj.getMonth()) + '/' + twoDigit(dateobj.getDate()) + '/' + dateobj.getFullYear().toString().slice(2, 4);
  time = twoDigit((dateobj.getHours() > 12 ? dateobj.getHours() - 12 : dateobj.getHours())) + ':' + twoDigit(dateobj.getMinutes()) + (dateobj.getHours() >= 12 ? ' PM' : ' AM');
  device = document.getElementById('MainContent_txtDeviceNotes').value;
  if (confirm("Would you like to print a receipt?")) {
    chrometech = prompt("Please type your initials.");
    console.log(first);
    console.log(last);
    console.log(id);
    console.log(grade);
    console.log(reason);
    console.log(date);
    console.log(time);
    console.log(device);
    console.log(serial);
    console.log(chrometech);

    exportPdf();
  }
}

function twoDigit(i) {
  i = i + '';
  if (i.length == 1) {
    i = "0" + i;
  } else {
    i = i;
  }
  return i;
}

function exportPdf() {

  img = document.createElement("img");

  JsBarcode(img, serial, {
    text: " ",
    width: 5,
    height: 50,
    margin: 0
  });

  var doc = new jsPDF("p", "in", [324, 576]);
  doc.setLineWidth(0.01);
  doc.line(0, 0, 0, 8);
  doc.line(0, 8, 5.6, 8);
  doc.line(4.5, 0, 4.5, 8);
  doc.line(0, 0, 4.5, 0);
  doc.setFont("courier", "normal");
  doc.setFontSize("20");

  var centerText = function(text, y) {
    var textWidth =
      doc.getStringUnitWidth(text) *
      doc.internal.getFontSize() /
      doc.internal.scaleFactor;
    var textOffset = (4.5 - textWidth) / 2;
    doc.text(textOffset, y, text);
  };

  var rightText = function(text, y) {
    var textWidth =
      doc.getStringUnitWidth(text) *
      doc.internal.getFontSize() /
      doc.internal.scaleFactor;
    var textOffset = 4.5 - textWidth - 0.25;
    doc.text(textOffset, y, text);
  };

  var leftText = function(text, y) {
    var textWidth =
      doc.getStringUnitWidth(text) *
      doc.internal.getFontSize() /
      doc.internal.scaleFactor;
    var textOffset = 0.25;
    doc.text(textOffset, y, text);
  };

  centerText("ETHS ChromeZone", 0.5);
  leftText(date, 1);
  rightText(time, 1);
  leftText("First:", 2);
  rightText(first, 2);
  leftText("Last:", 2.5);
  rightText(last, 2.5);
  leftText("ID:", 3);
  rightText(id, 3);
  leftText("Grade:", 3.5);
  rightText(grade, 3.5);
  leftText("Reason:", 4);
  rightText(reason, 4);
  leftText("ChromeTech:", 4.5);
  rightText(chrometech, 4.5);
  centerText(device, 5.5);

  doc.addImage(img, 0.25, 6, 4, 1);
  doc.save('dataurl');


}
var doSubmit = false;

function start() {
  /*var script1 = document.createElement('script');
  script1.src = "https://cdn.jsdelivr.net/npm/jsbarcode@3.11.0/dist/barcodes/JsBarcode.code128.min.js";
  document.head.appendChild(script1);
  var script2 = document.createElement('script');
  script2.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/1.5.3/jspdf.debug.js";
  document.head.appendChild(script2);
  var script3 = document.createElement('script');
  script3.src = "https://cdn.jsdelivr.net/npm/canvg/dist/browser/canvg.min.js";
  document.head.appendChild(script3);*/
  if (document.getElementById('MainContent_btnSave')) {
    serial = document.getElementById('MainContent_txtDeviceSerial').value;
    document.getElementById('MainContent_btnSave').setAttribute('type', 'button');
    document.getElementById('MainContent_btnSave').addEventListener('click', isLoaner);
    document.getElementById('MainContent_btnSave2').setAttribute('type', 'button');
    document.getElementById('MainContent_btnSave2').addEventListener('click', isLoaner);
  }
}
