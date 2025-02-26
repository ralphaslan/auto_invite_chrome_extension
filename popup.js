document.getElementById('automateClick').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (!tabs.length) return;

        chrome.tabs.sendMessage(tabs[0].id, { action: "automateSelection" });
    });
});

document.getElementById('startFriendAdding').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (!tabs.length) return;

        chrome.tabs.sendMessage(tabs[0].id, { action: "automateFriendAdding" });
    });
});
