chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "automateSelection") {
        automateSelection();
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
