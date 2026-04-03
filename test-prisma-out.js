const { execSync } = require('child_process');
try {
  const out = execSync('npx prisma generate', { encoding: 'utf-8', env: process.env });
  console.log('SUCCESS:', out);
} catch (e) {
  console.error('STDOUT:', e.stdout);
  console.error('STDERR:', e.stderr);
  console.error('ERROR:', e.message);
}
