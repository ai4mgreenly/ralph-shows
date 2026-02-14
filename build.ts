import * as esbuild from "npm:esbuild@0.24";
import { denoPlugins } from "jsr:@luca/esbuild-deno-loader@0.11";

const plansHost = Deno.env.get("RALPH_PLANS_HOST") ?? "localhost";
const plansPort = Deno.env.get("RALPH_PLANS_PORT") ?? "5001";

await esbuild.build({
  plugins: [...denoPlugins()],
  entryPoints: ["src/main.tsx"],
  outfile: "dist/bundle.js",
  bundle: true,
  format: "esm",
  jsx: "automatic",
  jsxImportSource: "preact",
  define: {
    "__RALPH_PLANS_URL__": JSON.stringify(`http://${plansHost}:${plansPort}`),
  },
});

await Deno.copyFile("index.html", "dist/index.html");
await Deno.copyFile("favicon.jpeg", "dist/favicon.jpeg");

esbuild.stop();
console.log("Build complete → dist/");
