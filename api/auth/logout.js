module.exports = function handler(req, res) {
  res.setHeader('Set-Cookie', 'roo_token=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax');
  res.json({ ok: true });
};
