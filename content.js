chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "automateSelection") {
        automateSelection();
    } else if (request.action === "automateFriendAdding") {
        automateFriendAdding();
    }
});

function automateSelection() {
    console.log("Automation started...");

    // Step 1: Click the isOnline element
    const onlineElement = document.querySelector('label[for="isOnline"] span.bg-sprite-album-page');
    if (!onlineElement) {
        console.error("Step 1 Failed: 'isOnline' element not found.");
        return;
    }

    onlineElement.click();
    console.log("Step 1: Clicked Online element");

    // Step 2: Wait, then click the dropdown and select a country
    setTimeout(() => {
        const dropdownTitle = document.querySelector('.dropDownTitle');
        if (!dropdownTitle) {
            console.error("Step 2 Failed: Dropdown title not found.");
            return;
        }

        dropdownTitle.click();
        console.log("Step 2: Clicked dropdown title");

        setTimeout(() => {
            const countryList = document.querySelectorAll('#countryDropDown li:not(.alpha)');
            if (countryList.length === 0) {
                console.error("Step 2 Failed: No countries found in the dropdown.");
                return;
            }

            // Preferred country list
            const preferredCountries = ["Turkey", "Germany", "Italy", "France"];
            let filteredOptions = Array.from(countryList).filter(li =>
                preferredCountries.includes(li.textContent.trim())
            );

            // Fallback to any country if none in the preferred list
            const finalList = filteredOptions.length > 0 ? filteredOptions : countryList;
            const randomCountry = finalList[Math.floor(Math.random() * finalList.length)];

            randomCountry.scrollIntoView({ behavior: 'smooth', block: 'center' });

            setTimeout(() => {
                randomCountry.click();
                console.log("Step 2: Selected country:", randomCountry.textContent.trim());

                // Ensure the selection registers
                const dropdownContainer = document.querySelector('#countryDropDown');
                if (dropdownContainer) {
                    dropdownContainer.dispatchEvent(new Event('input', { bubbles: true }));
                    dropdownContainer.dispatchEvent(new Event('change', { bubbles: true }));
                }

                // Step 3: Wait and submit the form
                setTimeout(() => {
                    const submitButton = document.querySelector('input[type="submit"][value="Search"]');
                    if (!submitButton) {
                        console.error("Step 3 Failed: Submit button not found.");
                        return;
                    }
                
                    submitButton.focus();
                    submitButton.click();
                    submitButton.dispatchEvent(new Event('click', { bubbles: true }));
                    console.log("Step 3: Clicked Submit button.");
                }, 800);               

            }, 300);
        }, 500);
    }, 500);
}

// New function: Automate friend adding
async function automateFriendAdding() {
    console.log("Starting friend-adding automation...");

    const users = document.querySelectorAll('ul.userWidgetWrapperGrid li');
    let addedCount = 0;

    for (let user of users) {
        if (addedCount >= 20) break; // Stop after adding 20 friends

        // Hover over user to reveal buttons
        const userLink = user.querySelector('.userLink');
        if (!userLink) continue;

        userLink.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
        userLink.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
        await new Promise(res => setTimeout(res, 800)); // Increased wait time

        // Find the "Add Friend" button
        const addFriendButton = user.querySelector('button.buttonBase.nodisable:not(.friendRequested):not(.removeFriend)');
        if (!addFriendButton || addFriendButton.offsetParent === null) {
            console.log("Skipping - 'Add Friend' button is missing or hidden.");
            continue;
        }

        // Scroll into view to make sure it's interactable
        addFriendButton.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // Dispatch multiple events to make sure it registers
        addFriendButton.focus();
        addFriendButton.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
        await new Promise(res => setTimeout(res, 300)); // Small delay before clicking
        addFriendButton.click();
        addFriendButton.dispatchEvent(new Event('click', { bubbles: true }));

        console.log("Clicked 'Add Friend' for:", userLink.href);
        addedCount++;

        // Wait for the confirmation popup
        await new Promise(res => setTimeout(res, 1200));

        // Click the "Send" button in the popup
        const sendButton = document.querySelector('input#preventClick.buttonBase.orangeButton');
        if (sendButton) {
            sendButton.scrollIntoView({ behavior: 'smooth', block: 'center' });
            sendButton.focus();
            await new Promise(res => setTimeout(res, 300));
            sendButton.click();
            sendButton.dispatchEvent(new Event('click', { bubbles: true }));
            console.log("Clicked 'Send' for confirmation.");
        } else {
            console.log("Send button not found.");
        }

        // Wait before moving to the next user (human-like behavior)
        await new Promise(res => setTimeout(res, 2000 + Math.random() * 1000));
    }

    console.log("Friend-adding process completed.");
}