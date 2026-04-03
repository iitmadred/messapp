const { Client } = require('pg');

async function testConnection() {
  const client = new Client({
    connectionString: "postgresql://postgres:NydLJiMeFuYGhzNhVLCSpPDzzjMfBDdZ@interchange.proxy.rlwy.net:50134/railway"
  });

  try {
    await client.connect();
    console.log("SUCCESSFULLY connected to Railway via native pg!");
    const res = await client.query('SELECT count(*) FROM "Purchase"');
    console.log("Row count in Purchase:", res.rows[0].count);
    
    const rows = await client.query('SELECT * FROM "Purchase" ORDER BY id DESC LIMIT 5');
    console.dir(rows.rows);
  } catch (err) {
    console.error("CONNECTION FAILED:", err);
  } finally {
    await client.end();
  }
}

testConnection();
