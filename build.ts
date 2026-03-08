import * as esbuild from "npm:esbuild@0.24";
import { denoPlugins } from "jsr:@luca/esbuild-deno-loader@0.11";

await esbuild.build({
  plugins: [...denoPlugins()],
  entryPoints: ["src/main.tsx"],
  outfile: "dist/bundle.js",
  bundle: true,
  format: "esm",
  jsx: "automatic",
  jsxImportSource: "preact",
});

await Deno.copyFile("index.html", "dist/index.html");
await Deno.copyFile("favicon.jpeg", "dist/favicon.jpeg");

try {
  await Deno.copyFile("static/theRALPHS.jpeg", "dist/theRALPHS.jpeg");
} catch {
  // static/theRALPHS.jpeg not present; banner will render without image
}

esbuild.stop();
console.log("Build complete → dist/");
