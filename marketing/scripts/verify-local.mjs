import { spawn } from "node:child_process";
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const host = "127.0.0.1";
const port = Number(process.env.VERIFY_PORT || 4338);
const base = `http://${host}:${port}`;

function run(command, args, options = {}) {
  return new Promise((resolveRun, rejectRun) => {
    const child = spawn(command, args, {
      cwd: projectRoot,
      stdio: "inherit",
      ...options,
    });

    child.on("error", rejectRun);
    child.on("exit", (code, signal) => {
      if (code === 0) resolveRun();
      else {
        rejectRun(
          new Error(
            `${command} ${args.join(" ")} failed (${signal || `exit ${code}`})`,
          ),
        );
      }
    });
  });
}

await run("npm", ["run", "build"]);

const dist = resolve(projectRoot, "dist");
const contentTypes = new Map([
  [".css", "text/css; charset=utf-8"],
  [".html", "text/html; charset=utf-8"],
  [".ico", "image/x-icon"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".png", "image/png"],
  [".svg", "image/svg+xml"],
  [".webp", "image/webp"],
]);

const preview = createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, base).pathname);
    const requestedPath = pathname.endsWith("/")
      ? `${pathname}index.html`
      : pathname;
    let filePath = resolve(dist, `.${requestedPath}`);
    if (!filePath.startsWith(`${dist}/`)) {
      response.writeHead(403).end("Forbidden");
      return;
    }

    const fileStat = await stat(filePath);
    if (fileStat.isDirectory()) filePath = resolve(filePath, "index.html");
    const body = await readFile(filePath);
    const extension = filePath.slice(filePath.lastIndexOf("."));
    response.writeHead(200, {
      "content-type": contentTypes.get(extension) || "application/octet-stream",
    });
    response.end(body);
  } catch {
    response.writeHead(404).end("Not found");
  }
});

await new Promise((resolveListen, rejectListen) => {
  preview.once("error", rejectListen);
  preview.listen(port, host, resolveListen);
});

try {
  await run(process.execPath, ["scripts/verify.mjs"], {
    env: { ...process.env, PREVIEW_URL: base },
  });
} finally {
  preview.closeAllConnections();
  await new Promise((resolveClose) => preview.close(resolveClose));
}
