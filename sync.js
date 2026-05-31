// Run this script after editing .env to sync Discord usernames into config.js
// Usage: node sync.js
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');
const configPath = path.join(__dirname, 'config.js');

if (!fs.existsSync(envPath)) {
  console.error('❌ .env file not found. Copy .env.example to .env first.');
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');
const match = envContent.match(/^ALLOWED_DISCORD_USERNAMES=(.+)$/m);
if (!match) {
  console.error('❌ ALLOWED_DISCORD_USERNAMES not found in .env');
  process.exit(1);
}

const usernames = match[1].split(',').map(u => u.trim()).filter(Boolean);
const listStr = usernames.map(u => `    '${u}',`).join('\n');

let config = fs.readFileSync(configPath, 'utf8');
config = config.replace(
  /allowedDiscordUsernames:\s*\[[\s\S]*?\],/,
  `allowedDiscordUsernames: [\n${listStr}\n  ],`
);

fs.writeFileSync(configPath, config, 'utf8');
console.log(`✅ Synced ${usernames.length} username(s) to config.js:`, usernames);
