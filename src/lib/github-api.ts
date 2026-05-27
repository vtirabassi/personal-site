import type { LibraryItem, LibraryData } from './library-schema';

const GITHUB_API = 'https://api.github.com';
const FILE_PATH = 'src/data/library.json';

function headers() {
  return {
    Authorization: `token ${process.env.GITHUB_TOKEN}`,
    Accept: 'application/vnd.github.v3+json',
    'Content-Type': 'application/json',
  };
}

export async function addLibraryItem(item: LibraryItem): Promise<void> {
  const repo = process.env.GITHUB_REPO;
  const url = `${GITHUB_API}/repos/${repo}/contents/${FILE_PATH}`;

  const getRes = await fetch(url, { headers: headers() });
  const fileData: { content: string; sha: string } = await getRes.json();

  const library: LibraryData = JSON.parse(atob(fileData.content));
  library.items.push(item);

  await fetch(url, {
    method: 'PUT',
    headers: headers(),
    body: JSON.stringify({
      message: `feat: add resource "${item.title}"`,
      content: btoa(JSON.stringify(library, null, 2)),
      sha: fileData.sha,
    }),
  });
}
