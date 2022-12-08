const Model = require('./model');
const { query } = require('./connection');
class Message extends Model{
    static async findByUser(user_id) {
        let sql = `SELECT * FROM messages WHERE user_id = ${user_id}`;
        let result = await query(sql);
        return result;
    }
}
module.exports = Message;