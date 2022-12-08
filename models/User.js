const { query } = require('./connection');
const Model = require('./Model');
class User extends Model {
    static async findByUsername(username) {
        let sql = `SELECT * FROM ${this.tableName} WHERE username = '${username}'`
        let results = await query(sql);
        if (results.length > 0) {
            let row = results[0]
            return new this(row)
        }
        return null
    }
    static async findByEmail(email) {
        let sql = `SELECT * FROM ${this.tableName} WHERE email = '${email}'`
        let results = await query(sql);
        if (results.length > 0) {
            let row = results[0]
            return new this(row)
        }
        return null
    }
    static async findByPassword(password) {
        let sql = `SELECT * FROM ${this.tableName} WHERE password = '${password}'`
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

    static async otpExists(otp){
        return (await this.findByOtp(otp)) != null
    }
    get name() {
        return `${this.surname} ${this.first_name}`
    }

}

module.exports = User;
