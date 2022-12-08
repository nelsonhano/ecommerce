const { redirect } = require("express/lib/response");
const uuid = require("../helpers/uuid");
const Admin = require("../models/admin");
const Message = require("../models/messages");
const User = require('../models/User');
const Subscribers = require('../models/subscribers');
const { generate } = require("password-hash");
const Product = require("../models/Product");
const Category = require("../models/Category");
const Order = require("../models/order");

let addAdmin = (req, res) => {
  res.render("admin/add-admin");
};
let adminDashboard = async (req, res) => {
  let admin_id = req.params.admin_id || req?.session?.admin?.id;
  if (!admin_id) {
    return res.redirect("/login");
  }
  let admins = await Admin.fetch();
  
  let admin = await Admin.findById(admin_id);
  res.render("admin/admin-dashboard", { admins, admin});
};
let categories = async(req, res) => {
  let admin_id = req.params.admin_id || req?.session?.admin?.id;
  if (!admin_id) {
    return res.redirect("/login");
  }
  let categories = await Category.fetch()
  let admin = await Admin.findById(admin_id);
  res.render('admin/categories', {categories, admin})
}
let products = async(req, res) => {
  let admin_id = req.params.admin_id || req?.session?.admin?.id;
  if (!admin_id) {
    return res.redirect("/login");
  }
  let products = await Product.fetch()
  for (const product of products) {
    product.category = await Category.findById(product.categories_id)
}
let admin = await Admin.findById(admin_id);
res.render('admin/products', {products, admin})
}
let orders = async(req, res) => {
  let admin_id = req.params.admin_id || req?.session?.admin?.id;
  if (!admin_id) {
    return res.redirect("/login");
  }
  let orders = await Order.fetch()
  for (const order of orders) {
    order.user = await User.findById(order.user_id)
}
let admin = await Admin.findById(admin_id);
res.render('admin/orders', {orders, admin})
}
let users = async(req, res) => {
  let admin_id = req.params.admin_id || req?.session?.admin?.id;
  if (!admin_id) {
    return res.redirect("/login");
  }
  let users = await User.fetch()
  let admin = await Admin.findById(admin_id);
  res.render('admin/users', {users, admin})
}
let subscribers = async(req, res) => {
  let admin_id = req.params.admin_id || req?.session?.admin?.id;
  if (!admin_id) {
    return res.redirect("/login");
  }
  let admin = await Admin.findById(admin_id);
  let subscribers = await Subscribers.fetch()
  res.render('admin/subscribers', {subscribers, admin})

}
let messages = async(req, res) => {
  let admin_id = req.params.admin_id || req?.session?.admin?.id;
  if (!admin_id) {
    return res.redirect("/login");
  }
  let messages = await Message.fetch();
  let admin = await Admin.findById(admin_id);
  res.render('admin/messages', {messages, admin})
}
let profile = async(req, res) => {
  let admin_id = req.params.admin_id || req?.session?.admin?.id;
  if (!admin_id) {
    return res.redirect("/login");
  }
  let admin = await Admin.findById(admin_id);
  res.render('admin/profile', {admin})
}
let postAdmin =  async (req, res, next) => {
  let { confirm_password, ...otherFields } = req.body
  let admin = new Admin(otherFields)
  admin.password = generate(admin.password)
  await admin.save()
  res.redirect("/admin/dashboard")
};

let editAdmin = async(req, res) => {
  let admin_id = req.params.admin_id || req?.session?.admin?.id;
  if (!admin_id) {
    return res.redirect('/login')
  }
  let admin = await Admin.findById(req?.session?.admin?.id)
    if (!admin) { 
      return res.redirect('/login')
    } else {
      res.render('admin/edit-admin', {admin})

    }
}
let updateAdmin = async (req, res) => {
  let admin = await Admin.findById(req?.session?.admin?.id);
  admin.setProperties(req.body);
  await admin.update()
  req.flash('success', 'Profile update successfully')
  res.redirect("/admin/profile");
};

let editPassword = async(req, res) => {
    let admin = await Admin.findById(req?.session?.admin?.id) 
    let admin_id = req.params.admin_id || req?.session?.admin?.id;
  if (!admin_id) {
    return res.redirect('/login')
  }
    if (admin) {
        res.render('admin/edit-password', {admin})
    } else {
        res.redirect('/admin/profile')
    }
}
let updatePassword = async(req, res) =>{
    let admin = await Admin.findById(req?.session?.admin?.id) 
    let { previous_password, confirm_password, ...otherFields} = req.body
    admin.setProperties(otherFields)
    admin.password = generate(admin.password)
    await admin.update()
    req.flash('success', 'Password reset successfully')
    res.redirect('/admin/profile')
}
let editPassport = async (req, res) => {
  let admin = await Admin.findById(req?.session?.admin?.id)
  let admin_id = req.params.admin_id || req?.session?.admin?.id;
  if (!admin_id) {
    return res.redirect('/login')
  }
  res.render('admin/changePassport', { admin })

}


let updatePassport = async (req, res) => {
  let admin = await Admin.findById(req?.session?.admin?.id)
  if (req.files && req.files.passport != undefined) {
      let passport = req.files.passport
      if (passport.mimetype.startsWith('image/')) {
          if (passport.size <= 1024 * 1024) {
              let fileName = `${admin.email}-${uuid()}.${passport.name.split('.').pop()}`
              passport.mv('./uploads/' + fileName, (err) => {
                  if (err) {
                      console.log(err)
                  } else {
                      admin.passport = fileName
                      admin.update();
                  }
              })
          } else {
              req.flash('danger', `File too large! Upload unsuccessful. Try again with a smaller file...`);
              return res.redirect('back')
          }
      } else {
          return redirect('back')
      }
  }
  req.flash('success', `Upload Successful...`);
  res.redirect("/admin/profile")

}

let editEmail = async (req, res) => {
  let admin = await Admin.findById(req?.session?.admin?.id)
  let admin_id = req.params.admin_id || req?.session?.admin?.id;
  if (!admin_id) {
    return res.redirect('/login')
  }
  res.render('changeEmail', { admin })
}

let updateEmail = async (req, res) => {
  let admin = await Admin.findById(req?.session?.admin?.id)
  let {password, ...otherFields} = req.body
  admin.setProperties(otherFields)
  res.redirect("/admin/profile")
}

let deleteAdmin = async(req, res) => {
  let admin = await Admin.findById(req.params.admin_id)
  let admin_id = req.params.admin_id || req?.session?.admin?.id;
  if (!admin_id) {
    return res.redirect('/login')
  }
  await admin.delete()
  res.redirect('/admin/dashboard')
}

//messages routes

// let profile = async (req, res) => {
//   let admin_id = req.params.admin_id || req?.session?.admin?.id;
//   if (!admin_id) {
//     return res.redirect("/login");
//   }
//   let admin = await Admin.findById(admin_id);
//   res.render("admin/profile", { admin });
// };
module.exports = { addAdmin, editEmail, updateEmail,adminDashboard, postAdmin,  editAdmin, editPassport, updatePassport,updateAdmin, editPassword, updatePassword, deleteAdmin, messages, orders, users, subscribers, profile, products, categories};
