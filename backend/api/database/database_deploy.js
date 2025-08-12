const mysql = require('mysql2/promise');
const fs = require('fs').promises;

async function fixAndParseJSON() {
  try {
      let content = await fs.readFile('products.txt', 'utf8');
      
      content = content
          .replace(/'/g, '"') 
          .replace(/(\w+):/g, '"$1":') 
          .trim(); 
      
      if (!content.startsWith('[')) {
          content = '[' + content + ']';
      }
      
      const data = JSON.parse(content);
      return data;
  } catch (error) {
      console.error('JSON Format Error:', error);
      throw error;
  }
}

async function batchInsertItems() {

  // const fileContent = await fs.readFile('products.txt', 'utf8');
  const items = await fixAndParseJSON()

  const connection = await mysql.createConnection({
    host: 'junction.proxy.rlwy.net',
    user: 'root',
    password: 'YTkSQJsbNvVJeIzHoDaMdfmXCHvMraxi',
    database: 'railway',
    port: 18462,
    waitForConnections: true
  });

  try {
    const sql = `
            INSERT INTO item_info 
            (id, name, description, specification, price, rate, stock, brand, ctg, img_path)
            VALUES
            (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

    for (const item of items) {
      const specString = JSON.stringify(item.specification);

      await connection.execute(sql, [
        item.id,
        item.name,
        item.description,
        specString,
        item.price,
        Number((Math.random() * 4 + 1).toFixed(1)),
        item.stock,
        item.brand,
        item.ctg,
        item.img_path
      ]);
    }

    console.log('success');
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await connection.end();
  }
}

batchInsertItems()
  .then(() => console.log('finish'))
  .catch(err => console.error('error:', err));