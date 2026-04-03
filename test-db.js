// test-db.js
const { exec } = require('child_process');

async function checkDb() {
  const { PrismaClient } = require('@prisma/client');
  const prisma = new PrismaClient();
  try {
    const list = await prisma.purchase.findMany();
    console.log("DB connection successful! Purchases count:", list.length);
    console.log("Last 5 items:", list.slice(-5));
  } catch (error) {
    console.error("DB Connection Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDb();
