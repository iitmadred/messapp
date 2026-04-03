const { PrismaClient } = require('@prisma/client');
try {
  const p = new PrismaClient({ url: process.env.DATABASE_URL });
  console.log("Initialized OK");
  p.purchase.findMany().then(r => console.log('Purchases:', r.length)).catch(e => console.error(e)).finally(() => p.$disconnect());
} catch (e) {
  console.error("Init Error:", e);
}
