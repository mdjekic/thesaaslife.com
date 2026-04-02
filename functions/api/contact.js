export async function onRequestPost(context) {
  const corsHeaders = {
    "Access-Control-Allow-Origin": context.request.headers.get("Origin") || "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  try {
    const { name, email, subject, company, message } = await context.request.json();

    // Basic validation
    if (!name || !email || !subject || !message) {
      return new Response(JSON.stringify({ error: "All fields are required." }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Simple email format check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(JSON.stringify({ error: "Invalid email address." }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const BREVO_API_KEY = context.env.BREVO_API_KEY;
    const SENDER_EMAIL = context.env.SENDER_EMAIL || "contact@thesaaslife.com";
    const CONTACT_EMAIL = context.env.CONTACT_EMAIL || "mdjekic+saaslife@gmail.com";

    if (!BREVO_API_KEY) {
      console.error("BREVO_API_KEY environment variable is not set");
      return new Response(JSON.stringify({ error: "Server configuration error." }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const companyLabels = {
      general: "General Inquiry",
      estonia: "SaaS Life OÜ (Estonia)",
      serbia: "SaaS LIFE doo (Serbia)",
    };

    const escapedName = escapeHtml(name);
    const escapedEmail = escapeHtml(email);
    const escapedSubject = escapeHtml(subject);
    const escapedMessage = escapeHtml(message).replace(/\n/g, "<br>");
    const escapedCompany = escapeHtml(companyLabels[company] || company || "General Inquiry");

    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        "api-key": BREVO_API_KEY,
      },
      body: JSON.stringify({
        sender: { name: "SaaS Life Website", email: SENDER_EMAIL },
        to: [{ email: CONTACT_EMAIL, name: "Miloš Đekić" }],
        replyTo: { email, name },
        subject: `[SaaS Life] ${subject}`,
        htmlContent: `
          <h2>${escapedSubject}</h2>
          <p><strong>From:</strong> ${escapedName} &lt;${escapedEmail}&gt;</p>
          <p><strong>Regarding:</strong> ${escapedCompany}</p>
          <hr>
          <p>${escapedMessage}</p>
        `,
      }),
    });

    if (!res.ok) {
      const errorBody = await res.text();
      console.error("Brevo API error:", res.status, errorBody);
      return new Response(JSON.stringify({ error: "Failed to send message." }), {
        status: 502,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (err) {
    console.error("Contact function error:", err);
    return new Response(JSON.stringify({ error: "Internal server error." }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400",
    },
  });
}

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
