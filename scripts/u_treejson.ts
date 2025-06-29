import fs from "fs";
import path from "path";
import ignore from "ignore";

const BASE_DIR = process.argv[2] || "."; // Use command line argument or default to current directory

// Convert to absolute path
const absoluteBaseDir = path.resolve(BASE_DIR);

// Read and parse .gitignore
const gitignorePath = path.join(absoluteBaseDir, ".gitignore");
let ig = ignore();
if (fs.existsSync(gitignorePath)) {
  const gitignoreContent = fs.readFileSync(gitignorePath, "utf8");
  ig = ig.add(gitignoreContent.split("\n"));
}

// Also ignore common files/directories
`
.git
node_modules
.next
.vercel
dist
build
.DS_Store
*.log
.env*
`
  .split("\n")
  .map((v) => v.trim())
  .filter((v) => v.length > 0)
  .forEach((v) => ig.add(v));

function collectAllFiles(dir: string, base: string): string[] {
  const allFiles: string[] = [];

  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const relPath = path.relative(base, fullPath);

      // Skip if ignored
      if (ig.ignores(relPath)) {
        continue;
      }

      if (entry.isDirectory()) {
        // Recursively collect files from subdirectories
        allFiles.push(...collectAllFiles(fullPath, base));
      } else if (entry.isFile()) {
        // Add file with fully qualified path
        allFiles.push(fullPath);
      }
    }
  } catch (error) {
    // Skip directories that can't be read (permission issues, etc.)
    console.error(`Warning: Could not read directory ${dir}:`, error.message);
  }

  return allFiles;
}

// Collect all files
const allFiles = collectAllFiles(absoluteBaseDir, absoluteBaseDir);

// Sort files for consistent output
allFiles.sort();

// Output as JSON
console.log(JSON.stringify(allFiles, null, 2));
