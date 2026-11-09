const SR_COUNTRIES = new Set(["RS", "ME", "BA", "HR"]);
const LANGS = new Set(["sr", "en"]);

function langFromCookie(request) {
  const cookie = request.headers.get("Cookie") ?? "";
  const match = cookie.match(/(?:^|;\s*)lang=([^;]*)/);
  return match && LANGS.has(match[1]) ? match[1] : null;
}

export function onRequest(context) {
  const { request } = context;
  const country = request.cf?.country ?? request.headers.get("CF-IPCountry");
  const lang = langFromCookie(request) ?? (SR_COUNTRIES.has(country) ? "sr" : "en");
  return new Response(null, {
    status: 302,
    headers: {
      Location: new URL(`/${lang}/`, request.url).toString(),
      "Cache-Control": "private, no-store",
    },
  });
}
