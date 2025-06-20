// Save as something like listFiles.js
const fs = require("fs");
const path = require("path");
const ignore = require("ignore");

const BASE_DIR = process.argv[2] || "."; // Use command line argument or default to current directory

// Read and parse .gitignore
const gitignorePath = path.join(BASE_DIR, ".gitignore");
let ig = ignore();
if (fs.existsSync(gitignorePath)) {
  const gitignoreContent = fs.readFileSync(gitignorePath, "utf8");
  ig = ig.add(gitignoreContent.split("\n"));
}
// Also ignore others
`
.git
package-lock.json
pnpm-lock.yaml
pnpm-debug.log
pnpm-workspace.yaml
`
  .split("\n")
  .map((v) => v.trim())
  .map((v) => v.length > 0 && (ig = ig.add(v)));

function getAllFiles(dir, base, filesList = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const relPath = path.relative(base, path.join(dir, entry.name));
    if (ig.ignores(relPath)) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      getAllFiles(fullPath, base, filesList);
    } else if (entry.isFile()) {
      filesList.push(relPath);
    }
  }
  return filesList;
}

function printFilesMarkdown(files) {
  for (const file of files) {
    const content = fs.readFileSync(path.join(BASE_DIR, file), "utf8");
    console.log(`${path.join(BASE_DIR, file)}:`);
    console.log("```");
    console.log(content);
    console.log("```");
    console.log("");
  }
}

const files = getAllFiles(BASE_DIR, BASE_DIR);
printFilesMarkdown(files);
