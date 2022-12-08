const pluralize = require('pluralize');
const {query} = require('./connection');
class Model{
  //get table name from class name
  static get tableName() {
    return pluralize(this.name.toLowerCase());
}

constructor(obj = {}) {
    this.setProperties(obj)
}

setProperties(obj) {
    for (const key in obj) {
        this[key] = obj[key]
    }
}

static async fetch() {
    let results = []
    let sql = `SELECT * FROM ${this.tableName}`
    let rows = await query(sql);
    for (const row of rows) {
        results.push(new this(row))
    }
    return results
}

static async findById(id) {
    let sql = `SELECT * FROM ${this.tableName} WHERE id = ${id}`
    let results = await query(sql);
    if (results.length > 0) {
        let row = results[0]
        return new this(row)
    }
    return null
}

async delete() {
    let sql = `DELETE FROM ${this.constructor.tableName} WHERE id = ${this.id}`
    let result = query(sql)
    return result.affectedRows > 0
}

async save() {
    let columns = Object.keys(this).join(', ')
    let values = Object.values(this).map(value => `'${value}'`).join(', ')
    let sql = `INSERT INTO ${this.constructor.tableName} (${columns}) VALUES (${values})`
    let result = await query(sql)
    console.log(result);
    this.id = result.insertId
    this.created_at = result.created_at
    this.updated_at = result?.updated_at
    return result.insertId
}

async update() {
    let sql = `UPDATE ${this.constructor.tableName} SET `
    let values = []
    for (const key in this) {
        if (key !== 'id' && key !== 'created_at' && key !== 'updated_at') {
            values.push(`${key} = ` + ( this[key] == null ? null : `'${this[key]}'`))
        }
    }
    sql += values.join(', ')
    sql += ` WHERE id = ${this.id}`
    let result = query(sql)
    return result.affectedRows > 0
}

toString() {
    return this.name
}

//convert date to 'yyyy-mm-dd' format
dateForInput(date) {
    return date.toISOString().slice(0, 10)
}

//show date in user friendly format
dateForDisplay(date) {
    return date.toDateString()
}

}
module.exports = Model