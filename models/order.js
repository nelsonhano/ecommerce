const Model = require('./model');
const { query } = require('./connection');
class Order extends Model{
    static async findByUserId(user_id) {
        let result = await query (`SELECT * FROM orders WHERE user_id = ${user_id}`)
        return result;
    }
    static async findById(order_id) {
        let sql = `SELECT * FROM orders WHERE order_id = '${order_id}'`
        let results = await query(sql);
        if (results.length > 0) {
            let row = results[0]
            return new this(row)
        }
        return null
    }
}
module.exports = Order;