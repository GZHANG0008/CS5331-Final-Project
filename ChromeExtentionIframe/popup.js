// Initialize butotn with users's prefered color
let changeColor = document.getElementById("changeColor");
let frameListDiv = document.getElementById("frameListDiv");

chrome.storage.sync.get("color", ({ color }) => {
  changeColor.style.backgroundColor = color;
});

// When the button is clicked, inject setPageBackgroundColor into current page
changeColor.addEventListener("click", readIframeAndChangeColorAsync);

async function readIframeAndChangeColorAsync() {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: setPageBackgroundColor,
  },
    (injectionResults) => {
      console.log(injectionResults[0].result);
      let innerList = "";
      let buttonIdList = [];
      if (injectionResults[0].result) {
        let count = 1;

        for (const ele of injectionResults[0].result) {
          let id = "iFrameDetector_Frame_" + count;
          buttonIdList.push(id);
          innerList += '<li><button id="' + id + '" >' + ele + "</button></li>"
          count++;
        }
        frameListDiv.innerHTML = "<ol>" + innerList + "</ol>"
      }
      for (btnId of buttonIdList) {
        btn = document.getElementById(btnId);
        console.dir(btn);
      }
    });

}

// The body of this function will be execuetd as a content script inside the
// current page
function setPageBackgroundColor() {
  var color = "#3aa757"
  var iframe_element = document.getElementsByTagName("iframe");
  var listOfUrl = []
  for (i = 0; i < iframe_element.length; i++) {
    iframe_element[i].style.backgroundColor = color;
    iEle = iframe_element[i];
    console.dir(iEle);
    console.log(iEle.attributes.src.value)
    listOfUrl.push(iEle.attributes.src.value)
    //iEle.attributes.src.value = null;
  }
  console.log(listOfUrl)


  return listOfUrl
}

window.onload = readIframeAndChangeColorAsync;
