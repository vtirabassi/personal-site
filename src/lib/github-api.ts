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
  if (!getRes.ok) {
    const body = await getRes.text();
    throw new Error(`GitHub GET failed ${getRes.status}: ${body}`);
  }
  const fileData: { content: string; sha: string } = await getRes.json();

  const library: LibraryData = JSON.parse(atob(fileData.content.replace(/\n/g, '')));
  library.items.push(item);

  const putRes = await fetch(url, {
    method: 'PUT',
    headers: headers(),
    body: JSON.stringify({
      message: `feat: add resource "${item.title}"`,
      content: btoa(unescape(encodeURIComponent(JSON.stringify(library, null, 2)))),
      sha: fileData.sha,
    }),
  });
  if (!putRes.ok) {
    const body = await putRes.text();
    throw new Error(`GitHub PUT failed ${putRes.status}: ${body}`);
  }
}
