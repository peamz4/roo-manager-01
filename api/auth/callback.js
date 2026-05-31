const jwt = require('jsonwebtoken');

const getAllowed = () =>
  (process.env.ALLOWED_DISCORD_USERNAMES || '')
    .split(',').map(u => u.trim().toLowerCase()).filter(Boolean);

module.exports = async function handler(req, res) {
  const { code } = req.query;
  if (!code) return res.redirect('/?error=cancelled');

  try {
    // Exchange code → access token
    const tokenRes = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.DISCORD_CLIENT_ID,
        client_secret: process.env.DISCORD_CLIENT_SECRET,
        grant_type: 'authorization_code',
        code,
        redirect_uri: process.env.DISCORD_REDIRECT_URI,
      }),
    });
    const token = await tokenRes.json();
    if (!token.access_token) return res.redirect('/?error=token_failed');

    // Fetch Discord user
    const userRes = await fetch('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${token.access_token}` },
    });
    const user = await userRes.json();

    // Check whitelist
    if (!getAllowed().includes((user.username || '').toLowerCase())) {
      return res.redirect('/?error=unauthorized');
    }

    const secret = process.env.JWT_SECRET || 'change-me';
    const signed = jwt.sign(
      { username: user.username, id: user.id, avatar: user.avatar },
      secret,
      { expiresIn: '24h' }
    );
    const secure = process.env.VERCEL ? '; Secure' : '';
    res.setHeader('Set-Cookie', `roo_token=${signed}; HttpOnly; Path=/; Max-Age=86400; SameSite=Lax${secure}`);
    res.redirect('/');
  } catch (err) {
    console.error('OAuth callback error:', err);
    res.redirect('/?error=server_error');
  }
};
