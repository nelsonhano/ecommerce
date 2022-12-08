const Category = require('../models/Category');
const { redirect } = require("express/lib/response");
const uuid = require('../helpers/uuid');
const Product = require('../models/Product');


let addCat = async(req,res) =>{
    let admin_id = req.params.admin_id || req?.session?.admin?.id;
    if (!admin_id) {
    return res.redirect("/login");
  }
    res.render('admin/addCat')
}
let postCat = async (req, res) => {
    let category = new Category(req.body);
    let fileName = ''
    if (req.files && req.files.image != undefined) {
        let image = req.files.image
        if (image.mimetype.startsWith('image/')) {
            if (image.size <= 2 * 1024 * 1024) {
                fileName = `${category.category_name}-${uuid()}.${image.name.split('.').pop()}`
                image.mv('./uploads/' + fileName, (err) => {
                    if (err) {
                        console.log(err)
                    } 
                })
            } else {
                return res.redirect('back')
            }
        } else {
            return redirect('back')
        }
        category.image = fileName
    }
    await category.save();
    req.flash('success', 'Items is successfully added to the Category Item.');
    res.redirect("/admin/categories");

}
let getCat = async (req, res) => {
    let categories = await Category.fetch()
    let products = await Product.fetch()
    let user = req.session.user
    res.render('categoryProducts', { categories, products, user})
}
let editCat = async (req, res) => {
    let category = await Category.findById(req.params.category_id)
    let admin_id = req.params.admin_id || req?.session?.admin?.id;
    if (!admin_id) {
    return res.redirect("/login");
  }
    if (category) {
        res.render('admin/editCat', { category })
    } else {
        res.redirect('/admin/categories')
    }
}
let updateCat = async(req, res) => {
    let category = await Category.findById(req.params.category_id)    
    category.setProperties(req.body)
    let fileName = ''
    if (req.files && req.files.image != undefined) {
        let image = req.files.image
        if (image.mimetype.startsWith('image/')) {
            if (image.size <= 2 * 1024 * 1024) {
                fileName = `${category.category_name}-${uuid()}.${image.name.split('.').pop()}`
                image.mv('./uploads/' + fileName, (err) => {
                    if (err) {
                        console.log(err)
                    } 
                })
            } else {
                return res.redirect('back')
            }
        } else {
            return redirect('back')
        }
        category.image = fileName
        category.update()
    }
    await category.update()
    res.redirect('/admin/categories');
}
let deleteCat = async (req, res) => {
    let category = await Category.findById(req.params.category_id)
    let admin_id = req.params.admin_id || req?.session?.admin?.id;
    if (!admin_id) {
     return res.redirect("/login");
  }
    await category.delete()
    res.redirect('/admin/categories');
}
let filterProducts = async (req, res) => {
    let categories = await Category.fetch();
    let user = req.session.user;
    let admin = req.session.admin;
    let category_name = req.params.category_name;
    let category = categories.find(
      (cat) => cat.category_name.toLowerCase() == category_name.toLowerCase()
    );
    let products = await Product.findByCategoryId(category.id);
    res.render("index", { products, user, admin, categories });
  };
module.exports = {addCat, postCat, getCat,editCat,updateCat,deleteCat, filterProducts}