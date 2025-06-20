import fs from "fs";
import path from "path";
import ignore from "ignore";

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
scripts
`
  .split("\n")
  .map((v) => v.trim())
  .map((v) => v.length > 0 && (ig = ig.add(v)));

function buildTree(dir, base, prefix = "") {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const validEntries = [];

  // Filter out ignored entries
  for (const entry of entries) {
    const relPath = path.relative(base, path.join(dir, entry.name));
    if (!ig.ignores(relPath)) {
      validEntries.push(entry);
    }
  }

  validEntries.forEach((entry, index) => {
    const isLast = index === validEntries.length - 1;
    const connector = isLast ? "└── " : "├── ";
    const nextPrefix = prefix + (isLast ? "    " : "│   ");

    console.log(prefix + connector + entry.name);

    if (entry.isDirectory()) {
      const fullPath = path.join(dir, entry.name);
      buildTree(fullPath, base, nextPrefix);
    }
  });
}

console.log(path.basename(BASE_DIR) + "/");
buildTree(BASE_DIR, BASE_DIR);
