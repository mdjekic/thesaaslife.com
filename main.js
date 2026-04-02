// =============================================================
// Contact Form — server-side via Cloudflare Pages Function
// =============================================================
const form = document.getElementById("contact-form");
const statusEl = document.getElementById("form-status");

const lang = location.pathname.startsWith("/sr") ? "sr" : "en";

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
  statusEl.textContent = messages.sending[lang];

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
      statusEl.textContent = messages.success[lang];
      form.reset();
    } else {
      throw new Error(`HTTP ${res.status}`);
    }
  } catch (err) {
    console.error("Contact form error:", err);
    statusEl.className = "form-status error";
    statusEl.textContent = messages.error[lang];
  } finally {
    submitBtn.disabled = false;
  }
});
