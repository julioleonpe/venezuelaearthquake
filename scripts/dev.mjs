/**
 * Dev launcher — starts BOTH processes the Hub needs with one command:
 *   1. the REST read service (server/server.ts)
 *   2. the Vite SPA dev server
 *
 * The SPA proxies /api → the read service, so without the service the
 * News / Donations / Resources tiles render "unavailable". Running them together
 * removes that footgun. Zero dependencies: just Node's child_process.
 *
 * Output from each child is prefixed so it's clear which is which. Ctrl-C (or
 * either child exiting) tears both down so you never leave an orphan listening on
 * 5181.
 */
import { spawn } from "node:child_process";

const children = [];
let shuttingDown = false;

function run(name, command, args) {
  // On Windows, `node`/`npx` resolve to .cmd shims that need the shell; invoke
  // the whole command line as a single shelled string (rather than shell:true +
  // separate args, which Node now deprecates) so arg handling stays well-defined.
  const onWin = process.platform === "win32";
  const child = onWin
    ? spawn([command, ...args].join(" "), { stdio: ["ignore", "pipe", "pipe"], shell: true })
    : spawn(command, args, { stdio: ["ignore", "pipe", "pipe"] });
  const tag = `[${name}]`;
  const pipe = (stream, out) => {
    stream.setEncoding("utf8");
    let buf = "";
    stream.on("data", (chunk) => {
      buf += chunk;
      const lines = buf.split("\n");
      buf = lines.pop() ?? "";
      for (const line of lines) out.write(`${tag} ${line}\n`);
    });
    stream.on("end", () => {
      if (buf) out.write(`${tag} ${buf}\n`);
    });
  };
  pipe(child.stdout, process.stdout);
  pipe(child.stderr, process.stderr);

  child.on("exit", (code) => {
    if (!shuttingDown) {
      process.stdout.write(`${tag} exited (code ${code}) — shutting down the other process.\n`);
      shutdown(code ?? 1);
    }
  });
  children.push(child);
  return child;
}

function shutdown(code) {
  if (shuttingDown) return;
  shuttingDown = true;
  for (const c of children) {
    if (!c.killed) c.kill("SIGTERM");
  }
  // Give children a moment to exit cleanly, then force-exit.
  setTimeout(() => process.exit(code), 400);
}

process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));

run("api", "node", ["server/server.ts"]);
run("web", "npx", ["vite"]);
