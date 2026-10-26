// Builds a static copy of the site for preview hosting.
// The contact API needs a server, so it is moved aside for this build and the form shows a notice instead.
import { execSync } from "node:child_process";
import { existsSync, renameSync } from "node:fs";

const api = "src/app/api";
const parked = ".preview-api-parked";
if (existsSync(api)) renameSync(api, parked);
try {
  execSync("next build", { stdio: "inherit", env: { ...process.env, PREVIEW_EXPORT: "1", NEXT_PUBLIC_PREVIEW: "1" } });
} finally {
  if (existsSync(parked)) renameSync(parked, api);
}
