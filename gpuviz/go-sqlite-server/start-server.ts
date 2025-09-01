import { exec } from "child_process";
import { SQLITE_PATH, SQLITE_SERVER_PORT } from "../src/config/default.ts";

const cmd = `cd go-sqlite-server && go run main.go trace.go -db=${SQLITE_PATH} -addr=:${SQLITE_SERVER_PORT}`;
console.log(`[start-go] Running: ${cmd}`);

const proc = exec(cmd);

proc.stdout?.on("data", (data) => {
  process.stdout.write(`[go] ${data}`);
});

proc.stderr?.on("data", (data) => {
  process.stderr.write(`[go-error] ${data}`);
});

proc.on("close", (code) => {
  console.log(`[start-go] exited with code ${code}`);
});
