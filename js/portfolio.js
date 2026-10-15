// ==========================================================
// portfolio.js - REPLACE the whole old file with this one.
// ==========================================================

// 1. Dark / light theme (remembers choice)
const root = document.documentElement;
const themeBtn = document.getElementById("themeToggle");

function applyTheme(theme) {
  root.setAttribute("data-theme", theme);
  if (themeBtn) {
    themeBtn.textContent = theme === "dark" ? "Light mode" : "Dark mode";
    themeBtn.setAttribute("aria-pressed", String(theme === "dark"));
  }
}

applyTheme(root.getAttribute("data-theme") || "light");

if (themeBtn) {
  themeBtn.addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    applyTheme(next);
    try {
      localStorage.setItem("theme", next);
    } catch (err) {
      /* storage blocked: theme still changes, just isn't saved */
    }
  });
}

// 2. Copy email button
const copyBtn = document.getElementById("copyEmail");
if (copyBtn) {
  copyBtn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText("xandreiblanco123@gmail.com");
      copyBtn.textContent = "Copied!";
    } catch (err) {
      copyBtn.textContent = "Copy failed";
    }
    setTimeout(() => {
      copyBtn.textContent = "Copy email";
    }, 1500);
  });
}

// 3. Back-to-top button
const topBtn = document.getElementById("backToTop");
if (topBtn) {
  window.addEventListener("scroll", () => {
    topBtn.style.display = window.scrollY > 400 ? "block" : "none";
  });
  topBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// 4. Contact form (validation + send through Formspree)
// PASTE YOUR FORMSPREE URL BELOW (looks like https://formspree.io/f/abcdwxyz)
const FORM_ENDPOINT = "https://formspree.io/f/xeaepkek";

const form = document.getElementById("contactForm");
if (form) {
  const statusEl = document.getElementById("formStatus");
  const submitBtn = document.getElementById("cSubmit");
  const nameEl = document.getElementById("cName");
  const emailEl = document.getElementById("cEmail");
  const messageEl = document.getElementById("cMessage");

  function showStatus(text, type) {
    statusEl.textContent = text;
    statusEl.className = "form-status mt-3 mb-0 " + (type ? "is-" + type : "");
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = nameEl.value.trim();
    const email = emailEl.value.trim();
    const message = messageEl.value.trim();

    if (name.length < 2) {
      showStatus("Enter your name.", "error");
      nameEl.focus();
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showStatus("Enter a valid email address, like name@example.com.", "error");
      emailEl.focus();
      return;
    }
    if (message.length < 10) {
      showStatus("Write at least 10 characters in your message.", "error");
      messageEl.focus();
      return;
    }
    if (FORM_ENDPOINT.includes("YOUR_FORM_ID")) {
      showStatus("The form is not connected yet. Use the Hire me button above to email me.", "error");
      return;
    }

    submitBtn.disabled = true;
    showStatus("Sending...", "");

    try {
      const response = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      if (response.ok) {
        form.reset();
        showStatus("Message sent. I will reply by email.", "success");
      } else {
        showStatus("Message not sent. Try again, or email me directly.", "error");
      }
    } catch (err) {
      showStatus("No connection. Check your internet and try again.", "error");
    } finally {
      submitBtn.disabled = false;
    }
  });
}
