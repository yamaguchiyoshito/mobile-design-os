import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const docsRoot = path.resolve('docs/architecture/handbook');

const walk = async (dir) => {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        return walk(entryPath);
      }
      return entryPath.endsWith('.mdx') ? [entryPath] : [];
    })
  );

  return files.flat();
};

const files = await walk(docsRoot);
const seenTitles = new Map();
const errors = [];

for (const file of files) {
  const content = await readFile(file, 'utf8');
  const relativePath = path.relative(process.cwd(), file);
  const metaMatch = content.match(/<Meta title="([^"]+)"\s*\/>/);

  if (!metaMatch) {
    errors.push(`${relativePath}: <Meta title=\"...\" /> がありません`);
    continue;
  }

  const title = metaMatch[1];
  if (!title.startsWith('Architecture/Handbook/')) {
    errors.push(
      `${relativePath}: Meta title は Architecture/Handbook/ で始める必要があります`
    );
  }

  const duplicate = seenTitles.get(title);
  if (duplicate) {
    errors.push(`${relativePath}: Meta title が重複しています (${duplicate})`);
  } else {
    seenTitles.set(title, relativePath);
  }
}

if (errors.length > 0) {
  console.error('docs:check failed');
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exitCode = 1;
} else {
  console.log(`docs:check passed (${files.length} files)`);
}
