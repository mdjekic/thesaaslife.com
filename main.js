// =============================================================
// Language Switching
// =============================================================
let currentLang = "en";

const langToggle = document.getElementById("lang-toggle");

function setLang(lang) {
  currentLang = lang;
  document.documentElement.lang = lang === "sr" ? "sr" : "en";
  langToggle.textContent = lang === "en" ? "SR" : "EN";

  document.querySelectorAll("[data-en]").forEach((el) => {
    const text = el.getAttribute(`data-${lang}`);
    if (text) {
      if (el.children.length === 0) {
        el.textContent = text;
      } else if (el.tagName === "P" && el.querySelector("a")) {
        // Link text is the URL itself — no translation needed
      } else {
        el.textContent = text;
      }
    }
  });

  document.querySelectorAll("select option[data-en]").forEach((opt) => {
    const text = opt.getAttribute(`data-${lang}`);
    if (text) opt.textContent = text;
  });

  localStorage.setItem("saaslife-lang", lang);
}

langToggle.addEventListener("click", () => {
  setLang(currentLang === "en" ? "sr" : "en");
});

// Restore saved language preference
const savedLang = localStorage.getItem("saaslife-lang");
if (savedLang && savedLang !== "en") {
  setLang(savedLang);
}

// =============================================================
// Contact Form — server-side via Cloudflare Pages Function
// =============================================================
const form = document.getElementById("contact-form");
const statusEl = document.getElementById("form-status");

const messages = {
  sending: { en: "Sending...", sr: "Slanje..." },
  success: {
    en: "Message sent! I'll get back to you soon.",
    sr: "Poruka poslata! Javim se uskoro.",
  },
  error: {
    en: "Something went wrong. Please try again or email me directly.",
    sr: "Nešto nije u redu. Pokušajte ponovo ili mi pišite direktno.",
  },
};

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const submitBtn = form.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  statusEl.className = "form-status";
  statusEl.textContent = messages.sending[currentLang];

  const payload = {
    name: form.name.value.trim(),
    email: form.email.value.trim(),
    subject: form.subject.value.trim(),
    company: form.company.value,
    message: form.message.value.trim(),
  };

  try {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      statusEl.className = "form-status success";
      statusEl.textContent = messages.success[currentLang];
      form.reset();
    } else {
      throw new Error(`HTTP ${res.status}`);
    }
  } catch (err) {
    console.error("Contact form error:", err);
    statusEl.className = "form-status error";
    statusEl.textContent = messages.error[currentLang];
  } finally {
    submitBtn.disabled = false;
  }
});
