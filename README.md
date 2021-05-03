# CS5331-Final-Project
Build a chrome extension to detect iframe and protect user security
1. The main code: ChromeExtentionIframe
2. The testing example file: IframeDetectionTest 

# To run:
1. open in chrome://extensions
2. enable Developer Mode by clicking the toggle switch next to Developer mode
3. load unpacked button
4. select the extension code directory ChromeExtentionIframe

# to try the application with our example iframe:
1. use chrome to open the IframeDetectionTest/iframe_demo_example.html
2. click the extension icon and try with all the buttons

# File directory in ChromeExtentionIframe:
1. manifest.json: configure file
2. button interface: popup.html, popup.js, button.css
3. popup.js is the core function to talk with local html file
4. [optional] options.html, options.js
5. extention image folder: image

# Test the chrome extention:
Local test: Open iframe_demo_example.html in IframeDetectionTest
Production test:
1. China Teaching Website Wangdao: https://wangdoc.com/html/iframe.html
