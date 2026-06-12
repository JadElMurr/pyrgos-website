// Publishing engine for Pyrgos Studio.
// Commits content changes directly to GitHub; Netlify then rebuilds the site.
// The token is provided by the editor at publish time and is never stored in the repo.

export const REPO = 'JadElMurr/pyrgos-website';
export const BRANCH = 'main';
const API = 'https://api.github.com';

async function gh(token: string, method: string, path: string, body?: unknown) {
  const res = await fetch(API + path, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      ...(body ? { 'Content-Type': 'application/json' } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = (json as { message?: string }).message || `GitHub error ${res.status}`;
    throw new Error(msg);
  }
  return json;
}

export async function validateToken(token: string): Promise<{ ok: boolean; error?: string }> {
  try {
    const repo = (await gh(token, 'GET', `/repos/${REPO}`)) as { permissions?: { push?: boolean } };
    if (repo.permissions && repo.permissions.push === false) {
      return { ok: false, error: 'Token has no write access to the repository.' };
    }
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Token check failed' };
  }
}

export type PublishFile =
  | { path: string; contentUtf8: string }
  | { path: string; contentB64: string };

export type PublishProgress = (step: string) => void;

export async function publishCommit(
  token: string,
  files: PublishFile[],
  message: string,
  onProgress: PublishProgress,
): Promise<{ sha: string; url: string }> {
  onProgress('Reading current state of the repository\u2026');
  const ref = (await gh(token, 'GET', `/repos/${REPO}/git/ref/heads/${BRANCH}`)) as {
    object: { sha: string };
  };
  const latestSha = ref.object.sha;
  const latestCommit = (await gh(token, 'GET', `/repos/${REPO}/git/commits/${latestSha}`)) as {
    tree: { sha: string };
  };

  const tree: { path: string; mode: '100644'; type: 'blob'; sha: string }[] = [];
  let n = 0;
  for (const f of files) {
    n += 1;
    onProgress(`Uploading file ${n} of ${files.length}\u2026`);
    const payload =
      'contentB64' in f
        ? { content: f.contentB64, encoding: 'base64' }
        : { content: f.contentUtf8, encoding: 'utf-8' };
    const blob = (await gh(token, 'POST', `/repos/${REPO}/git/blobs`, payload)) as { sha: string };
    tree.push({ path: f.path, mode: '100644', type: 'blob', sha: blob.sha });
  }

  onProgress('Assembling the commit\u2026');
  const newTree = (await gh(token, 'POST', `/repos/${REPO}/git/trees`, {
    base_tree: latestCommit.tree.sha,
    tree,
  })) as { sha: string };

  const commit = (await gh(token, 'POST', `/repos/${REPO}/git/commits`, {
    message,
    tree: newTree.sha,
    parents: [latestSha],
  })) as { sha: string; html_url: string };

  onProgress('Publishing to the live branch\u2026');
  await gh(token, 'PATCH', `/repos/${REPO}/git/refs/heads/${BRANCH}`, { sha: commit.sha });

  return { sha: commit.sha, url: commit.html_url };
}
