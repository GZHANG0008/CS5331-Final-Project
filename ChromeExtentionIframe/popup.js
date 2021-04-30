// Initialize butotn with users's prefered color
let changeColor = document.getElementById("changeColor");

chrome.storage.sync.get("color", ({ color }) => {
  changeColor.style.backgroundColor = color;
});

// When the button is clicked, inject setPageBackgroundColor into current page
changeColor.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: setPageBackgroundColor,
  },
    (injectionResults) => {

      console.log(injectionResults);
    });
});

// The body of this function will be execuetd as a content script inside the
// current page
function setPageBackgroundColor() {
  chrome.storage.sync.get("color", ({ color }) => {
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
    return "listOfUrl";

  });
  return "listOfUrl"
}
