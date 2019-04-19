/*jshint esversion: 6*/

//Wait until page is loaded to start code
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

//Initialize global variables
var serial;
var first, last, id, grade, reason, date, time, device, serial, chrometech;


//Runs when device is saved.
function loanerCheckout() {
  var namestr = document.getElementById('MainContent_txtAssignee').value; //From 1:1
  first = /, (.*?) /.exec(namestr)[1]; //First name
  last = /(.*?),/.exec(namestr)[1]; //Last name
  id = /- ([0-9]*)/.exec(namestr)[1]; //ID number
  grade = document.getElementById('MainContent_lblGrade').innerHTML; //Grade level (eg 09)
  reason = document.getElementById('MainContent_ddlLoanReason') //Reason for checkout
    .querySelector('option[value=\"' + document.getElementById('MainContent_ddlLoanReason').value + '\"]')
    .innerHTML;
  var dateobj = new Date(new Date().toLocaleString("en-US", {
    timeZone: "America/Chicago"
  })); //Gets date and time in current time zone
  date = twoDigit(dateobj.getMonth() + 1) + '/' + twoDigit(dateobj.getDate()) + '/' + dateobj.getFullYear().toString().slice(2, 4); //Date formatting
  time = twoDigit((dateobj.getHours() > 12 ? dateobj.getHours() - 12 : dateobj.getHours())) + ':' + twoDigit(dateobj.getMinutes()) + (dateobj.getHours() >= 12 ? ' PM' : ' AM'); //Time formatting
  device = document.getElementById('MainContent_txtDeviceNotes').value; //Gets device name
  if (confirm("Would you like to print a receipt?")) {
    chrometech = prompt("Please type your initials."); //Gets ChromeTech initials
    /*console.log(first);
    console.log(last);
    console.log(id);
    console.log(grade);
    console.log(reason);
    console.log(date);
    console.log(time);
    console.log(device);
    console.log(serial);
    console.log(chrometech);*/

    exportPdf(); //Generates a pdf
  }
}

//Turns an integer into a two digit string
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

  img = document.createElement("img"); // Blank image for barcode

  JsBarcode(img, serial, { //Generates barcode of the blank image
    text: " ",
    width: 5,
    height: 50,
    margin: 0
  });

  var doc = new jsPDF("p", "in", [324, 576]); // New PDF using jsPDF
  /*doc.setLineWidth(0.01); //border
  doc.line(0, 0, 0, 8);
  doc.line(0, 8, 5.6, 8);
  doc.line(4.5, 0, 4.5, 8);
  doc.line(0, 0, 4.5, 0);*/
  doc.setFont("courier", "normal"); //Font setup
  doc.setFontSize("20");

  var centerText = function(text, y) { //For center-aligned text
    var textWidth =
      doc.getStringUnitWidth(text) *
      doc.internal.getFontSize() /
      doc.internal.scaleFactor;
    var textOffset = (4.5 - textWidth) / 2;
    doc.text(textOffset, y, text);
  };

  var rightText = function(text, y) { //For right-aligned text
    var textWidth =
      doc.getStringUnitWidth(text) *
      doc.internal.getFontSize() /
      doc.internal.scaleFactor;
    var textOffset = 4.5 - textWidth - 0.25;
    doc.text(textOffset, y, text);
  };

  var leftText = function(text, y) { //For left-aligned text
    var textWidth =
      doc.getStringUnitWidth(text) *
      doc.internal.getFontSize() /
      doc.internal.scaleFactor;
    var textOffset = 0.25;
    doc.text(textOffset, y, text);
  };
  //Appends text to pdf
  //Header
  centerText("ETHS ChromeZone", 0.5);
  //Date and time
  leftText(date, 1);
  rightText(time, 1);
  //Student info
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
  //ChromeTech info
  leftText("ChromeTech:", 4.5);
  rightText(chrometech, 4.5);
  //Devuce name
  centerText(device, 5.5);
  //Appends the barcode
  doc.addImage(img, 0.25, 6, 4, 1);
  //Saves as a PDF (will send to cloudprint in the future)
  doc.save('reciept');
}
var doSubmit = false; //Old

function start() { //Runs when page loads
  if (document.getElementById('MainContent_btnSave')) {
    serial = document.getElementById('MainContent_txtDeviceSerial').value; //Grabs the serial value before it can be changed
    document.getElementById('MainContent_btnSave').setAttribute('type', 'button'); //Prevents automatic form submission
    document.getElementById('MainContent_btnSave').addEventListener('click', isLoaner); // Add click event
    document.getElementById('MainContent_btnSave2').setAttribute('type', 'button'); //Prevents automatic form submission
    document.getElementById('MainContent_btnSave2').addEventListener('click', isLoaner); // Add click event
  }
}
