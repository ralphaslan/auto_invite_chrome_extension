document.getElementById('automateClick').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (!tabs.length) return;

        chrome.tabs.sendMessage(tabs[0].id, { action: "automateSelection" });
    });
});

function automateSelection() {
  console.log("Automation started...");

  // Step 1: Click the dropdown title to open the list
  const dropdownTitle = document.querySelector('.dropDownTitle');
  if (!dropdownTitle) {
    console.error("Dropdown title not found.");
    return;
  }

  dropdownTitle.click();
  console.log("Clicked dropdown title");

  setTimeout(() => {
    const countryList = document.querySelectorAll('#countryDropDown li:not(.alpha)');
    if (countryList.length === 0) {
      console.error("No countries found in the dropdown.");
      return;
    }

    // New preferred country list
    const preferredCountries = ["Turkey", "Germany", "Italy", "France"];
    let filteredOptions = Array.from(countryList).filter(li => 
      preferredCountries.includes(li.textContent.trim())
    );

    // Fallback to any country if none in preferred list
    const finalList = filteredOptions.length > 0 ? filteredOptions : countryList;
    const randomCountry = finalList[Math.floor(Math.random() * finalList.length)];

    // Ensure the selected country is visible
    randomCountry.scrollIntoView({ behavior: 'smooth', block: 'center' });

    setTimeout(() => {
      randomCountry.click();
      console.log("Selected country:", randomCountry.textContent.trim());

      // Ensure the selection registers
      const dropdownContainer = document.querySelector('#countryDropDown');
      if (dropdownContainer) {
        dropdownContainer.dispatchEvent(new Event('input', { bubbles: true }));
        dropdownContainer.dispatchEvent(new Event('change', { bubbles: true }));
      }

      // Step 2: Wait for selection to process, then submit the form
      setTimeout(() => {
        const submitButton = document.querySelector('.buttonBase.orangeButton.float-right');
        if (submitButton) {
          submitButton.click();
          console.log("Form submitted.");
        } else {
          console.error("Submit button not found.");
        }
      }, 800); // Wait longer to ensure dropdown selection is processed

    }, 300);
  }, 500); // Allow time for dropdown to appear
}
