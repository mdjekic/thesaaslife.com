# thesaaslife.com

Company website for **SaaS Life OÜ** (Estonia) and **SaaS LIFE doo** (Serbia).

Bilingual (English / Serbian) static site hosted on Cloudflare Pages with a server-side contact form.

## Structure

```
/                  → redirects to /en/
/en/               → English version
/sr/               → Serbian version
/api/contact       → Cloudflare Pages Function (contact form endpoint)
```

### Files

```
index.html              Root redirect to /en/
en/index.html           English page
sr/index.html           Serbian page
style.css               Shared stylesheet
main.js                 Shared JS (contact form)
functions/api/contact.js  Cloudflare Pages Function (Brevo email)
logo-black.png          Logo
favicon.ico             Favicon
```

## Hosting

Hosted on **Cloudflare Pages**, connected to this GitHub repo. Auto-deploys on every push to `main`.

### Cloudflare Pages settings

- **Production branch:** `main`
- **Build command:** (leave blank)
- **Build output directory:** `/`

## Contact Form

The contact form submits to `/api/contact`, a Cloudflare Pages Function that sends email via the **Brevo** transactional email API. The API key is never exposed to the client.

### Environment Variables

Set these in Cloudflare Pages > **Settings** > **Environment variables** (Production):

| Variable | Required | Default | Description |
|---|---|---|---|
| `BREVO_API_KEY` | Yes | — | Brevo transactional email API key |
| `SENDER_EMAIL` | No | `contact@thesaaslife.com` | "From" address on contact form emails |
| `CONTACT_EMAIL` | No | `mdjekic+saaslife@gmail.com` | Destination inbox for contact form submissions |

### Brevo Setup

1. In Brevo, go to **Settings** > **SMTP & API** > **API Keys** and create a key
2. Add the domain in **Settings** > **Senders, Domains & Dedicated IPs** > **Domains**
3. Add the DNS records Brevo provides (DKIM, SPF) in Cloudflare DNS
4. Add a DMARC record in Cloudflare DNS:
   - **Type:** `TXT`
   - **Name:** `_dmarc`
   - **Content:** `v=DMARC1; p=none; rua=mailto:mdjekic+dmarc@gmail.com`
5. Verify the domain in Brevo
6. Add a sender (`contact@thesaaslife.com`) under **Senders**

### Custom Domain

In Cloudflare Pages > **Custom domains**, add `thesaaslife.com`. If the domain is already on Cloudflare DNS, the CNAME is added automatically.
