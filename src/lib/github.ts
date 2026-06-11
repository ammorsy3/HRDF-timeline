// Reads and writes overrides.json via the GitHub Contents API.
// No redeploy needed — page always fetches fresh from GitHub at request time.

const REPO = process.env.GITHUB_REPO!;          // e.g. "username/hrdf"
const TOKEN = process.env.GITHUB_TOKEN!;
const FILE_PATH = "src/data/overrides.json";
const API_BASE = `https://api.github.com/repos/${REPO}/contents/${FILE_PATH}`;

export interface DeliverableOverride {
  status?: string;
  driveUrl?: string | null;
}

export type Overrides = Record<string, DeliverableOverride>;

async function githubFetch(method: string, body?: object) {
  return fetch(API_BASE, {
    method,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });
}

/** Read current overrides from GitHub — always fresh, no cache */
export async function getOverrides(): Promise<Overrides> {
  try {
    const res = await githubFetch("GET");
    if (!res.ok) return {};
    const data = await res.json();
    const decoded = Buffer.from(data.content, "base64").toString("utf-8");
    return JSON.parse(decoded) as Overrides;
  } catch {
    return {};
  }
}

/** Write updated overrides back to GitHub */
export async function saveOverrides(overrides: Overrides): Promise<void> {
  // First get the current SHA (required for updates)
  const getRes = await githubFetch("GET");
  if (!getRes.ok) throw new Error("Could not read overrides file from GitHub");
  const current = await getRes.json();
  const sha: string = current.sha;

  const content = Buffer.from(
    JSON.stringify(overrides, null, 2)
  ).toString("base64");

  const putRes = await githubFetch("PUT", {
    message: "Update campaign overrides via admin portal",
    content,
    sha,
  });

  if (!putRes.ok) {
    const err = await putRes.text();
    throw new Error(`GitHub write failed: ${err}`);
  }
}
