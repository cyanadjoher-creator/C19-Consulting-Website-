const OWNER = 'cyanadjoher-creator';
const REPO = 'C19-Consulting-Website-';
const BRANCH = 'main';

function checkPassword(body) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  return typeof body.password === 'string' && body.password === expected;
}

async function githubRequest(path, options) {
  return fetch(`https://api.github.com/repos/${OWNER}/${REPO}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      'User-Agent': 'c19-admin',
      Accept: 'application/vnd.github+json',
      ...(options && options.headers),
    },
  });
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const body = req.body || {};
  if (!checkPassword(body)) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const { filename, dataUrl } = body;
  const match = typeof dataUrl === 'string' && dataUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
  if (!filename || !match) {
    res.status(400).json({ error: 'Missing or invalid filename/dataUrl' });
    return;
  }

  const mime = match[1];
  const base64Content = match[2];
  const extFromMime = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif', 'image/svg+xml': 'svg' }[mime] || 'jpg';
  const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, '-').replace(/\.[^.]+$/, '');
  const path = `uploads/${Date.now()}-${safeName}.${extFromMime}`;

  const ghRes = await githubRequest(`/contents/${path}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: 'Upload image via admin panel',
      content: base64Content,
      branch: BRANCH,
    }),
  });

  if (!ghRes.ok) {
    const detail = await ghRes.text();
    res.status(502).json({ error: 'Failed to upload image to GitHub', detail });
    return;
  }

  res.status(200).json({ url: `/${path}` });
};
