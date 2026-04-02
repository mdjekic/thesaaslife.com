export function onRequest(context) {
  const country = context.request.headers.get("CF-IPCountry");
  const lang = country === "RS" ? "sr" : "en";
  return Response.redirect(new URL(`/${lang}/`, context.request.url), 302);
}
