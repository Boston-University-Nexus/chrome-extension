// chrome.browserAction.onClicked.addListener(function (){
//     chrome.tabs.create({url: 'popup.html'})
// })

chrome.browserAction.onClicked.addListener(function (tab){
    chrome.tabs.create({url: 'popup.html'})
})

