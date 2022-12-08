const Model = require('./model');
const { query } = require('./connection');
class Wishlist extends Model{
    static get tableName() {
        return "wishlists";
    }
    static async getWishList(user_id) {
        let result = await query(`SELECT * FROM wishlists WHERE user_id = ${user_id}`)
        return result;
    }
    static async findOne(user_id, product_id) {
        let sql = `SELECT * FROM wishlists WHERE user_id = ${user_id} And product_id = ${product_id}`;
        let results = await query(sql);
        if (results.length > 0) {
            let row = results[0];
            return new this(row);
        }
        return null;
    }
  
}
module.exports = Wishlist;