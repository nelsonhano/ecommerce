const User = require('../models/User');

let generateOTP = async function(){
    let otp = Math.random().toString().slice(2, 8)
    while (await User.otpExists(otp)) {
        otp = Math.random().toString().slice(2, 8)
    }
    return otp;
};


module.exports = generateOTP;
