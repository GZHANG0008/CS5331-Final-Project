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
      console.log(frameListDiv.innerText);
      if (!frameListDiv.innerText) {
        console.log(injectionResults[0].result);
        console.dir(frameListDiv)
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
          let btn = document.getElementById(btnId);
          console.log(btn.id)
          btn.addEventListener("click", eventH);
        }
      }
    });
}

async function eventH(event) {
  console.log("########event\n", event);
  console.dir(event)
  let btn = event.target;
  let id = parseInt(btn.id.substr(-1));
  let domain = btn.innerText;
  console.dir(btn);
  console.log("id", id, "domain", domain);
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  let obj = { id, domain };

  console.dir(chrome.tabs.executeScript)
  chrome.storage.sync.set(obj, function () {
    console.log('after set storage');
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: frameToggle,
    })
  });
}

async function frameToggle(id, domain) {
  chrome.storage.sync.get(['id', 'domain'], function (res) {
    let iframe_element = document.getElementsByTagName("iframe");
    let id = res.id;
    let domain = res.domain;
    console.log(iframe_element);
    console.log(id, domain, iframe_element[id - 1])
    if (id && domain && iframe_element[id - 1]) {
      let targetIFrame = iframe_element[id - 1];
      let value = targetIFrame.attributes.src.value;
      console.log("value 1", value)
      if (value != "null") {
        console.log("in if block", value)
        targetIFrame.attributes.src.value = null;
      }
      else {
        console.log("in else block", value)
        targetIFrame.attributes.src.value = domain;
      }
    }
  })

}

// async function toggleFrameSetting(id, domain) {
//   let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
//   console.log(generateToggleFunc(id, domain))
//   chrome.scripting.executeScript({
//     target: { tabId: tab.id },
//     function: func,
//   })
// }

// function toggleFrameSrc(id, domain) {
//   var iframe_element = document.getElementsByTagName("iframe");
//   console.log(iframe_element)
//   let targetIFrame = iframe_element[id - 1];
//   let value = targetIFrame.attributes.src.value;
//   if (value) {
//     targetIFrame.attributes.src.value = null;
//   }
//   else {
//     targetIFrame.attributes.src.value = domain;
//   }
// }

function generateToggleFunc(id, domain) {
  let _id = id;
  let _domain = domain;
  return function toggleFrameSrc() {
    console.log("id:", id, "_id:", _id);
    var iframe_element = document.getElementsByTagName("iframe");
    console.log(iframe_element)
    let targetIFrame = iframe_element[id - 1];
    let value = targetIFrame.attributes.src.value;
    if (value) {
      targetIFrame.attributes.src.value = null;
    }
    else {
      targetIFrame.attributes.src.value = domain;
    }
  }

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
  }
  console.log(listOfUrl)


  return listOfUrl
}


function findFrames() {
  var color = "#3aa757"
  var iframe_element = document.getElementsByTagName("iframe");
  var listOfUrl = []
  for (i = 0; i < iframe_element.length; i++) {
    iEle = iframe_element[i];
    listOfUrl.push(iEle.attributes.src.value)
  }
  console.log(listOfUrl)
  return listOfUrl
}

async function readIFrames() {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: findFrames,
  },
    (injectionResults) => {
      console.log(frameListDiv.innerText);
      if (!frameListDiv.innerText) {
        console.log(injectionResults[0].result);
        console.dir(frameListDiv)
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
          let btn = document.getElementById(btnId);
          console.log(btn.id)
          btn.addEventListener("click", eventH);
        }
      }
    });
}

window.onload = readIFrames;
