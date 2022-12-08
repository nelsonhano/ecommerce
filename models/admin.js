const Model = require('./model');
const { query } = require('./connection');
const { connection } = require("../models/connection");
class Admin extends Model{
    static async findByEmail(email) {
        let sql = `SELECT * FROM ${this.tableName} WHERE email = '${email}'`
        let results = await query(sql);
        if (results.length > 0) {
            let row = results[0]
            return new this(row)
        }
        return null
    }
    static async findByPhone(phone) {
        let sql = `SELECT * FROM ${this.tableName} WHERE phone = '${phone}'`
        let results = await query(sql);
        if (results.length > 0) {
            let row = results[0]
            return new this(row)
        }
        return null
    }
    static async findByFirstName(first_name) {
        let sql = `SELECT * FROM ${this.tableName} WHERE first_name = '${first_name}'`
        let results = await query(sql);
        if (results.length > 0) {
            let row = results[0]
            return new this(row)
        }
        return null
    }
   
    static async findByToken(token) {
        let sql = `SELECT * FROM ${this.tableName} WHERE token = '${token}'`
        let results = await query(sql);
        if (results.length > 0) {
            let row = results[0]
            return new this(row)
        }
        return null
    }

    static async findByOtp(otp) {
        let sql = `SELECT * FROM ${this.tableName} WHERE otp = '${otp}'`
        let results = await query(sql);
        if (results.length > 0) {
            let row = results[0]
            return new this(row)
        }
        return null
    }
    get admin(){
        return `${this.surname} ${this.first_name} `;
    }
}
module.exports = Admin