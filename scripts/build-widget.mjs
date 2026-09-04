import * as esbuild from "esbuild";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = resolve(__dirname, "..");

async function build() {
  console.log("[build-widget] Bundling Make-a-Wish widget into public/widget.js...");
  const startTime = Date.now();

  try {
    const result = await esbuild.build({
      entryPoints: [resolve(projectRoot, "src/widget/index.ts")],
      bundle: true,
      minify: true,
      sourcemap: true,
      target: ["es2020"],
      format: "iife",
      outfile: resolve(projectRoot, "public/widget.js"),
      define: {
        "process.env.NODE_ENV": '"production"',
      },
      metafile: true,
    });

    const elapsed = Date.now() - startTime;
    const outputs = Object.keys(result.metafile.outputs);
    const mainOutput = outputs.find((o) => o.endsWith("widget.js"));
    const bytes = mainOutput ? result.metafile.outputs[mainOutput].bytes : 0;
    const kb = (bytes / 1024).toFixed(1);

    console.log(`[build-widget] Successfully built public/widget.js (${kb} KB) in ${elapsed}ms.`);
  } catch (err) {
    console.error("[build-widget] Build failed:", err);
    process.exit(1);
  }
}

build();
