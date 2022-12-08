const Model = require('./model');
const { query } = require('./connection');
class Subscriber extends Model{
    static async findByEmail(email) {
        let sql = `SELECT * FROM ${this.tableName} WHERE email = '${email}'`
        let results = await query(sql);
        if (results.length > 0) {
            let row = results[0]
            return new this(row)
        }
        return null
    }
}
module.exports = Subscriber