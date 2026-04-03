// test-adapter.js
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');

async function testAdapter() {
  const connectionString = "postgresql://postgres:NydLJiMeFuYGhzNhVLCSpPDzzjMfBDdZ@interchange.proxy.rlwy.net:50134/railway";
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  
  const prisma = new PrismaClient({ adapter });
  try {
    const p = await prisma.purchase.create({
      data: {
        itemName: 'Test Data',
        cost: 15,
        date: '2026-04-03',
        time: '12:00',
        category: 'Other Groceries',
        description: 'Test insertion from adapter',
        source: 'manual'
      }
    });
    console.log("SUCCESSFULLY inserted new test data:", p.id);

    const list = await prisma.purchase.findMany();
    console.log("Total DB items:", list.length);
  } catch (error) {
    console.error("Adapter test error:", error);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

testAdapter();
