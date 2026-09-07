const { defineConfig } = require('drizzle-kit');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '.env') });

module.exports = defineConfig({
  dialect: 'postgresql',
  schema: ['./db/index.js', './models/admin.js', './models/productModel.js'],
  out: './drizzle',
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
