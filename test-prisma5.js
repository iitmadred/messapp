// test-prisma5.js
const { PrismaClient } = require('@prisma/client');
try {
  const p = new PrismaClient({
    datasourceUrl: process.env.DATABASE_URL
  });
  p.purchase.findMany()
    .then(r => console.log('Purchases:', r.length))
    .catch(e => require('fs').writeFileSync('prisma-err2.txt', e.message))
    .finally(() => p.$disconnect());
} catch (e) {
  require('fs').writeFileSync('prisma-err2.txt', e.message);
}
