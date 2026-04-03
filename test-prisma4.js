const { PrismaClient } = require('@prisma/client');
try {
  const p = new PrismaClient();
  p.purchase.findMany()
    .then(r => console.log('Purchases:', r.length))
    .catch(e => require('fs').writeFileSync('prisma-err.txt', e.message))
    .finally(() => p.$disconnect());
} catch (e) {
  require('fs').writeFileSync('prisma-err.txt', e.message);
}
