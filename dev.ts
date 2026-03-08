const plansHost = Deno.env.get("RALPH_PLANS_HOST") ?? "localhost";
const plansPort = Deno.env.get("RALPH_PLANS_PORT") ?? "5001";
const plansUrl = `http://${plansHost}:${plansPort}`;

const host = Deno.env.get("RALPH_SHOWS_HOST") ?? "localhost";
const port = parseInt(Deno.env.get("RALPH_SHOWS_PORT") ?? "5000");

console.log(`Serving on http://${host}:${port}`);

Deno.serve({ hostname: host, port }, async (req) => {
  const url = new URL(req.url);
  let path = url.pathname;
  if (path === "/") path = "/index.html";

  try {
    const file = await Deno.readFile(`dist${path}`);
    if (path.endsWith(".html")) {
      const html = new TextDecoder().decode(file);
      const injected = html.replace(
        "<head>",
        `<head>\n  <meta name="ralph-plans-url" content="${plansUrl}">`,
      );
      return new Response(injected, {
        headers: { "content-type": "text/html" },
      });
    }
    const contentType = path.endsWith(".js")
      ? "application/javascript"
      : path.endsWith(".jpeg") || path.endsWith(".jpg")
        ? "image/jpeg"
        : "application/octet-stream";
    return new Response(file, { headers: { "content-type": contentType } });
  } catch {
    return new Response("Not found", { status: 404 });
  }
});
