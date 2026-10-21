// =============================================================
// Contact Form — server-side via Cloudflare Pages Function
// =============================================================
const form = document.getElementById("contact-form");
const statusEl = document.getElementById("form-status");

const lang = location.pathname.startsWith("/sr") ? "sr" : "en";

const messages = {
  sending: { en: "Sending...", sr: "Slanje..." },
  success: {
    en: "Message sent! We'll get back to you soon.",
    sr: "Poruka poslata! Javićemo vam se uskoro.",
  },
  error: {
    en: "Something went wrong. Please try again or email us directly.",
    sr: "Nešto nije u redu. Pokušajte ponovo ili nam pišite direktno.",
  },
};

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const submitBtn = form.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  statusEl.className = "form-status";
  statusEl.textContent = messages.sending[lang];

  // Send whatever fields the form has (homepage and AI Partner forms differ)
  const payload = Object.fromEntries(
    [...new FormData(form)].map(([key, value]) => [key, value.trim()])
  );

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

// =============================================================
// Sticky mobile CTA — hide while the contact form is on screen
// =============================================================
const stickyCta = document.querySelector(".sticky-cta");
const contactSection = document.getElementById("contact");

if (stickyCta && contactSection && "IntersectionObserver" in window) {
  new IntersectionObserver(([entry]) => {
    stickyCta.classList.toggle("hidden", entry.isIntersecting);
  }).observe(contactSection);
}
