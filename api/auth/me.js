const jwt = require('jsonwebtoken');

module.exports = function handler(req, res) {
  const cookie = req.headers.cookie || '';
  const match = cookie.match(/roo_token=([^;]+)/);
  if (!match) return res.json({ authenticated: false });

  try {
    const secret = process.env.JWT_SECRET || 'change-me';
    const user = jwt.verify(match[1], secret);
    res.json({ authenticated: true, user: { username: user.username, id: user.id, avatar: user.avatar } });
  } catch {
    res.json({ authenticated: false });
  }
};
