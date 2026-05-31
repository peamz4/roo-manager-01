require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const DISCORD_CLIENT_ID     = process.env.DISCORD_CLIENT_ID;
const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;
const DISCORD_REDIRECT_URI  = process.env.DISCORD_REDIRECT_URI || `http://localhost:${PORT}/auth/discord/callback`;
const JWT_SECRET            = process.env.JWT_SECRET || 'change-me';

const allowedUsers = (process.env.ALLOWED_DISCORD_USERNAMES || '')
  .split(',').map(u => u.trim().toLowerCase()).filter(Boolean);

function parseCookies(req) {
  const out = {};
  (req.headers.cookie || '').split(';').forEach(pair => {
    const [k, ...v] = pair.trim().split('=');
    if (k) out[k.trim()] = v.join('=').trim();
  });
  return out;
}

app.use(express.static(path.join(__dirname)));

// Redirect to Discord OAuth
app.get('/auth/discord', (req, res) => {
  const params = new URLSearchParams({
    client_id: DISCORD_CLIENT_ID,
    redirect_uri: DISCORD_REDIRECT_URI,
    response_type: 'code',
    scope: 'identify',
  });
  res.redirect(`https://discord.com/api/oauth2/authorize?${params}`);
});

// Discord OAuth callback
app.get('/auth/discord/callback', async (req, res) => {
  const { code } = req.query;
  if (!code) return res.redirect('/?error=cancelled');

  try {
    const tokenRes = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: DISCORD_CLIENT_ID,
        client_secret: DISCORD_CLIENT_SECRET,
        grant_type: 'authorization_code',
        code,
        redirect_uri: DISCORD_REDIRECT_URI,
      }),
    });
    const token = await tokenRes.json();
    if (!token.access_token) return res.redirect('/?error=token_failed');

    const userRes = await fetch('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${token.access_token}` },
    });
    const user = await userRes.json();

    if (!allowedUsers.includes((user.username || '').toLowerCase())) {
      return res.redirect('/?error=unauthorized');
    }

    const signed = jwt.sign(
      { username: user.username, id: user.id, avatar: user.avatar },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    res.setHeader('Set-Cookie', `roo_token=${signed}; HttpOnly; Path=/; Max-Age=86400; SameSite=Lax`);
    res.redirect('/');
  } catch (err) {
    console.error('OAuth error:', err);
    res.redirect('/?error=server_error');
  }
});

// Check session
app.get('/auth/me', (req, res) => {
  const token = parseCookies(req).roo_token;
  if (!token) return res.json({ authenticated: false });
  try {
    const user = jwt.verify(token, JWT_SECRET);
    res.json({ authenticated: true, user: { username: user.username, id: user.id, avatar: user.avatar } });
  } catch {
    res.json({ authenticated: false });
  }
});

// Logout
app.post('/auth/logout', (req, res) => {
  res.setHeader('Set-Cookie', 'roo_token=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax');
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`Server running → http://localhost:${PORT}`);
  console.log(`Allowed users  : ${allowedUsers.join(', ') || '(none configured)'}`);
});
