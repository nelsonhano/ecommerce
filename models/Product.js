const Model = require("./model");
const { query } = require("./connection");

class Product extends Model {
  toString() {
    return this.name;
  }
  static async findByCategoryId(id) {
    let results = [];
    let sql = `SELECT * FROM products where categories_id = ${id}`;
    let rows = await query(sql);
    for (const row of rows) {
      results.push(new this(row));
    }
    return results;
  }
  static async findByName(name) {
    let results = [];
    let sql = `SELECT * FROM products where name LIKE '%${name}%'`;
    let rows = await query(sql);
    for (const row of rows) {
      results.push(new this(row));
    }
    return results;
  }

  static async findByFeature(features) {
    let sql = `SELECT * FROM ${this.tableName} WHERE features = '${features}'`
    let results = await query(sql);
    if (results.length > 0) {
        let row = results[0]
        return new this(row)
    }
    return null
}
}
module.exports = Product;
