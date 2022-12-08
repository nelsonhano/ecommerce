const { redirect } = require("express/lib/response");
const User = require("../models/User")
const generateOTP = require('../helpers/otpGenerator');
const uuid = require('../helpers/uuid');
const { generate } = require("password-hash");
const sendCode = require('../models/otp');
const Order = require("../models/order");
const Product = require("../models/Product");
const Order_detail = require("../models/orderDetails");
const Wishlist = require("../models/wishlist");
const Message = require("../models/messages");
const Category = require("../models/Category");
let addUser = async (req, res) => {

    res.render('add-user')
}

let postUser = async (req, res) => {
    let { confirm_password, ...otherFields } = req.body
    let user = new User(otherFields)
    user.password = generate(user.password)
    var email = req.body.email;
    var code = await generateOTP();
    user.otp = code;
    user.expired_at = (new Date(Number(new Date()) + (48.60* 24 *60 *60))).toISOString().slice(0, -5).replace('T', ' ')
    await user.save();
    req.session.email = user.email;
    req.session.save(function(err) {
        if(err) return next(err);
      });
    sendCode(email, code);
    req.flash('success', 'OTP is sent to your email')
    res.redirect("/verify")
}

  
let getUser = async (req, res) => {
    let users = await User.fetch()
    res.render('users', { users })
}

let editUser = async (req, res) => {
    let user_id = req.params.user_id || req?.session?.user?.id
    if (!user_id) {
        req.flash("danger", "Please login to continue");
        return res.redirect('/login')
    }
    let user = await User.findById(req?.session?.user?.id)
    res.render('edit-user', { user })
}

let updateUser = async (req, res) => {
    let user = await User.findById(req?.session?.user?.id)
    user.setProperties(req.body)
    await user.update()
    res.redirect("/user/profile")
}
let details = async (req, res) => {
    let user_id = req.params.user_id || req?.session?.user?.id
    if (!user_id) {
        req.flash("danger", "You must be logged in to check your profile");
        return res.redirect('/login')
    }
    let user = await User.findById(user_id)
    let categories = await Category.fetch()
    let products = await Product.fetch()   
    res.render("details", { user, categories, products })
}
let order = async(req, res) => {
    let user_id = req.params.user_id || req?.session?.user?.id
    if (!user_id) {
        req.flash("danger", "You must be logged in to check your order");
        return res.redirect('/login')
    }
    let user = await User.findById(user_id)
    let orders = await Order.findByUserId(user_id)
    let categories = await Category.fetch()
    let products = await Product.fetch()
    for (const order of orders) {
        order.product = await User.findById(order.user_id)
    }
    res.render('myOrder', {orders, user, categories, products})
}
let wishlist = async(req, res) => {
    let user_id = req.params.user_id || req?.session?.user?.id
    if (!user_id) {
        req.flash("danger", "You must be logged in to check your wishlist");
        return res.redirect('/login')
    }
    let user = await User.findById(user_id)
    let wishlists = await Wishlist.getWishList(user_id)
    let categories = await Category.fetch()
    let products = await Product.fetch()
    for (const wish of wishlists) {
        wish.user = await User.findById(wish.user_id)
        wish.product = await Product.findById(wish.product_id)
    }
    res.render('wishlist', {wishlists, user, categories, products})
}
let message = async(req, res) => {
    let user_id = req.params.user_id || req?.session?.user?.id
    if (!user_id) {
        req.flash("danger", "You must be logged in to message us");
        return res.redirect('/login')
    }
    let user = await User.findById(user_id)
    let messages = await Message.findByUser(user_id)
    let categories = await Category.fetch()
    let products = await Product.fetch()
    res.render('message', {messages, user, categories, products})
}
let editPassword = async (req, res) => {
    var user_id = req.session.user
    if (!user_id) {
        req.flash("danger", "Please login to continue");
        return res.redirect('/login')
    }
    let user = await User.findById(req?.session?.user?.id)

        res.render('changePassword', { user })
    
}

let updatePassword = async (req, res) => {
    let user = await User.findById(req?.session?.user?.id)
    let { previous_password, confirm_password, ...otherFields } = req.body
    user.setProperties(otherFields)
    user.password = generate(user.password)
    await user.update()
    res.redirect("/user/profile")
}
let editEmail = async (req, res) => {
    let user_id = req.params.user_id || req?.session?.user?.id
    if (!user_id) {
        req.flash("danger", "Please login to continue");
        return res.redirect('/login')
    }
    let user = await User.findById(req?.session?.user?.id)
    res.render('changeEmail', { user })
}

let updateEmail = async (req, res) => {
    let user = await User.findById(req?.session?.user?.id)
    let {password, ...otherFields} = req.body
    user.setProperties(otherFields)
    var email = req.body.email;
    var code = await generateOTP();
    req.session.email = user.email
    req.session.save(function(err) {
        if(err) return next(err);
      });
    user.otp = code;
    user.expired_at = (new Date(Number(new Date()) + (48.60* 24 *60 *60))).toISOString().slice(0, -5).replace('T', ' ')
    user.verified_at = null;
    await user.update()
    sendCode(email, code);
    req.flash('success', 'OTP is sent to your email')
    res.redirect("/change-email-verification")
}
let editAddress = async (req, res) => {
    let user_id = req.params.user_id || req?.session?.user?.id
    if (!user_id) {
        req.flash("danger", "Please login to continue");
        return res.redirect('/login')
    }
    let user = await User.findById(req?.session?.user?.id);
    res.render("changeAddress", { user });  
  }
  let updateAddress = async (req, res) => {
    let user = await User.findById(req?.session?.user?.id);
    user.setProperties(req.body);
    await user.update();
    req.flash("success", "Address updated successfully");
    res.redirect("/user/profile");
  }

let editPassport = async (req, res) => {
    let user_id = req.params.user_id || req?.session?.user?.id
    if (!user_id) {
        req.flash("danger", "Please login to continue");
        return res.redirect('/login')
    }
    let user = await User.findById(req?.session?.user?.id)
    res.render('changePassport', { user })

}


let updatePassport = async (req, res) => {
    let user = await User.findById(req?.session?.user?.id)
    if (req.files && req.files.passport != undefined) {
        let passport = req.files.passport
        if (passport.mimetype.startsWith('image/')) {
            if (passport.size <= 1024 * 1024) {
                let fileName = `${user.email}-${uuid()}.${passport.name.split('.').pop()}`
                passport.mv('./uploads/' + fileName, (err) => {
                    if (err) {
                        console.log(err)
                    } else {
                        user.passport = fileName
                        user.update();
                    }
                })
            } else {
                req.flash('danger', `File too large! Upload unsuccessful. Try again with a 1MB file...`);
                return res.redirect('back')
            }
        } else {
            return redirect('back')
        }
    }
    req.flash('success', `Upload Successful...`);
    res.redirect("/user/profile")

}
module.exports = { addUser, postUser, getUser, editUser, updateUser, details, wishlist, message,editPassword, order,updatePassword, editPassport, updatePassport, editEmail, updateEmail, editAddress, updateAddress }