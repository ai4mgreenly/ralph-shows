const build = new Deno.Command("deno", {
  args: ["task", "build"],
  stdout: "inherit",
  stderr: "inherit",
});
const result = await build.output();
if (!result.success) Deno.exit(1);

const host = Deno.env.get("RALPH_SHOWS_HOST") ?? "localhost";
const port = parseInt(Deno.env.get("RALPH_SHOWS_PORT") ?? "5000");

console.log(`Serving on http://${host}:${port}`);

Deno.serve({ hostname: host, port }, async (req) => {
  const url = new URL(req.url);
  let path = url.pathname;
  if (path === "/") path = "/index.html";

  try {
    const file = await Deno.open(`dist${path}`, { read: true });
    const contentType = path.endsWith(".js")
      ? "application/javascript"
      : path.endsWith(".html")
        ? "text/html"
        : "application/octet-stream";
    return new Response(file.readable, {
      headers: { "content-type": contentType },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
});
