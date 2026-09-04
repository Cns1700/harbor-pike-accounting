// This file is the only JavaScript the site uses.
// It does three jobs: open/close the mobile menu, switch the service tabs, and check the contact form.

// Find the Menu button in the header (it only shows on small screens).
var menuButton = document.querySelector(".menu-button");

// Find the list of page links that we hide or show on small screens.
var navLinks = document.querySelector(".site-nav");

// Only set up the menu if this page has both the button and the nav.
if (menuButton && navLinks) {
  // When the user clicks the Menu button, run this function.
  menuButton.addEventListener("click", function () {
    // Check whether the nav currently has the "is-open" class.
    var isOpen = navLinks.classList.contains("is-open");

    // If the menu is already open, close it.
    if (isOpen) {
      // Remove the class so the CSS hides the menu again.
      navLinks.classList.remove("is-open");
      // Tell screen readers that the menu is now closed.
      menuButton.setAttribute("aria-expanded", "false");
    } else {
      // Add the class so the CSS shows the menu.
      navLinks.classList.add("is-open");
      // Tell screen readers that the menu is now open.
      menuButton.setAttribute("aria-expanded", "true");
    }
  });
}

// Find every link inside the navigation list.
var navLinkItems = document.querySelectorAll(".site-nav a");

// Walk through those links one at a time.
for (var i = 0; i < navLinkItems.length; i++) {
  // When a nav link is clicked, close the mobile menu.
  navLinkItems[i].addEventListener("click", function () {
    // If the nav is on the page, hide it.
    if (navLinks) {
      // Remove the open class so the menu tucks away.
      navLinks.classList.remove("is-open");
    }
    // If the button is on the page, mark it closed.
    if (menuButton) {
      // Tell screen readers the menu is closed.
      menuButton.setAttribute("aria-expanded", "false");
    }
  });
}

// Find all of the tab buttons on this page.
var tabButtons = document.querySelectorAll(".tab");

// Find all of the tab panels on this page.
var tabPanels = document.querySelectorAll(".tab-panel");

// Only set up tabs if this page has at least one tab button.
if (tabButtons.length > 0) {
  // Walk through each tab button.
  for (var t = 0; t < tabButtons.length; t++) {
    // When this tab is clicked, show its panel and hide the others.
    tabButtons[t].addEventListener("click", function () {
      // Remember which panel this tab is supposed to open.
      var targetId = this.getAttribute("aria-controls");

      // Turn every tab off first.
      for (var u = 0; u < tabButtons.length; u++) {
        // Mark this tab as not selected.
        tabButtons[u].setAttribute("aria-selected", "false");
      }

      // Hide every panel first.
      for (var p = 0; p < tabPanels.length; p++) {
        // Hide this panel.
        tabPanels[p].hidden = true;
      }

      // Mark the clicked tab as the selected one.
      this.setAttribute("aria-selected", "true");

      // Find the panel that matches this tab.
      var targetPanel = document.getElementById(targetId);

      // If that panel is on the page, show it.
      if (targetPanel) {
        // Show the panel.
        targetPanel.hidden = false;
      }
    });
  }
}

// Find the contact form. Other pages do not have this, and that is fine.
var contactForm = document.querySelector("#contact-form");

// Find the error box that sits above the fields.
var errorBox = document.querySelector("#form-error");

// Find the thank-you message that we show after a good submit.
var thanksBox = document.querySelector("#form-thanks");

// Only set up form checks if this page has the contact form.
if (contactForm) {
  // When the user clicks Send message, run this function.
  contactForm.addEventListener("submit", function (event) {
    // Stop the browser from trying to send the form to a server.
    event.preventDefault();

    // Read whatever the user typed in the Name box.
    var nameField = document.querySelector("#name");
    // Read whatever the user typed in the Email box.
    var emailField = document.querySelector("#email");

    // Get the text from the Name box and drop extra spaces on the ends.
    var nameValue = nameField.value.trim();
    // Get the text from the Email box and drop extra spaces on the ends.
    var emailValue = emailField.value.trim();

    // Start with a blank error message.
    var errorText = "";

    // If the name is empty, we will ask for it.
    if (nameValue === "") {
      // Store a plain English message.
      errorText = "Please enter your name.";
    }

    // If the email is empty, we will ask for it.
    if (emailValue === "") {
      // Store a plain English message.
      errorText = "Please enter your email.";
    }

    // If both name and email are empty, say so in one sentence.
    if (nameValue === "" && emailValue === "") {
      // Store a plain English message that covers both fields.
      errorText = "Please enter your name and email.";
    }

    // If the email has text but no @ sign, it is not a valid email.
    if (emailValue !== "" && emailValue.indexOf("@") === -1) {
      // Store a plain English message about the email format.
      errorText = "Please enter a valid email address.";
    }

    // If we stored an error, show it and stop here.
    if (errorText !== "") {
      // Put the message in the error box.
      errorBox.textContent = errorText;
      // Make the error box visible.
      errorBox.hidden = false;
      // Stop here. Do not hide the form. Do not show thanks.
      return;
    }

    // Hide the error box in case it was showing from an earlier try.
    errorBox.hidden = true;

    // Copy every field on the form, including the hidden Netlify name field.
    var formData = new FormData(contactForm);
    // Turn those fields into a string Netlify can store.
    var encoded = new URLSearchParams(formData).toString();
    // Read the action on the form. That is the contact page on the Netlify site.
    var sendTo = contactForm.getAttribute("action");

    // Send the form to Netlify. The live site receives this. The in-browser preview does not.
    fetch(sendTo, {
      // Use POST so Netlify treats this as a form submission.
      method: "POST",
      // Tell Netlify the body is a normal HTML form.
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      // Put the field string in the request body.
      body: encoded
    }).catch(function () {
      // The in-browser preview is not Netlify, so this send can fail. That is fine.
    });

    // Hide the form so the user does not send it twice.
    contactForm.hidden = true;
    // Show the thank-you message instead of the form.
    thanksBox.hidden = false;
  });
}
