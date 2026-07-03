const OWNER = 'cyanadjoher-creator';
const REPO = 'C19-Consulting-Website-';
const PATH = 'content.json';
const BRANCH = 'main';

function checkPassword(req) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  const provided = req.method === 'GET' ? req.query.password : (req.body && req.body.password);
  return typeof provided === 'string' && provided === expected;
}

async function githubRequest(path, options) {
  const res = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      'User-Agent': 'c19-admin',
      Accept: 'application/vnd.github+json',
      ...(options && options.headers),
    },
  });
  return res;
}

module.exports = async function handler(req, res) {
  if (!checkPassword(req)) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  if (req.method === 'GET') {
    const ghRes = await githubRequest(`/contents/${PATH}?ref=${BRANCH}`);
    if (!ghRes.ok) {
      res.status(502).json({ error: 'Failed to fetch content from GitHub' });
      return;
    }
    const data = await ghRes.json();
    const content = Buffer.from(data.content, 'base64').toString('utf-8');
    res.status(200).json({ content: JSON.parse(content), sha: data.sha });
    return;
  }

  if (req.method === 'POST') {
    const { content, sha } = req.body || {};
    if (!content || !sha) {
      res.status(400).json({ error: 'Missing content or sha' });
      return;
    }
    const ghRes = await githubRequest(`/contents/${PATH}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Update content via admin panel',
        content: Buffer.from(JSON.stringify(content, null, 2) + '\n').toString('base64'),
        branch: BRANCH,
        sha,
      }),
    });
    if (!ghRes.ok) {
      const detail = await ghRes.text();
      res.status(502).json({ error: 'Failed to save content to GitHub', detail });
      return;
    }
    const result = await ghRes.json();
    res.status(200).json({ ok: true, sha: result.content.sha });
    return;
  }

  res.status(405).json({ error: 'Method not allowed' });
};
