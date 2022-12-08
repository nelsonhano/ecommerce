const Model = require('./model');
const { query } = require('./connection');
class Order_detail extends Model{
    static async findById(order_id) {
        let sql = `SELECT * FROM order_details WHERE order_id = '${order_id}'`
        let results = await query(sql);
        if (results.length > 0) {
            let row = results[0]
            return new this(row)
        }
        return null
    }
}
module.exports = Order_detail;