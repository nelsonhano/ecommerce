let uuid = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
let orderID = () => {
    let orderID = new Date().toISOString().slice(0, 10) + "-" + uuid().slice(0, 8);
    return orderID;

}
module.exports = orderID;