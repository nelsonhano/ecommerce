const Product = require("../models/Product");
const Category = require("../models/Category");
const uuid = require('../helpers/uuid');

let addProduct = async (req, res) => {
    let categories = await Category.fetch()
    let admin_id = req.params.admin_id || req?.session?.admin?.id;
    if (!admin_id) {
    return res.redirect("/login");
  }
    res.render('admin/addProduct', {categories })
}
let postProduct = async (req, res) => {
    let product = new Product(req.body);
    console.log(product); 
    let fileName = ''
    if (req.files && req.files.image != undefined) {
        let image = req.files.image
        if (image.mimetype.startsWith('image/')) {
            if (image.size <= 2 * 1024 * 1024) {
                fileName = `${product.name}-${uuid()}.${image.name.split('.').pop()}`
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
        product.image = fileName
    }
    await product.save();
    req.flash('success','You have successfully added a new item to the database!')
    res.redirect("/admin/products");
}
let getProducts = async (req, res) => {
    let category = await Category.fetch()
    let products = await Product.fetch()
    for (const product of products) {
        product.category = await Category.findById(product.category_id)
    }
    res.render('admin/product', { products,category })
}
let editProduct = async (req, res) => {
    let product = await Product.findById(req.params.product_id)
    let category = await Category.fetch();
    let admin_id = req.params.admin_id || req?.session?.admin?.id;
  if (!admin_id) {
    return res.redirect("/login");
  }
    if (product) {
        res.render('admin/editProduct', { product, category})
    } else {
        res.redirect('/admin/products')
    }
}
let updateProduct = async (req, res) => {
    let product = await Product.findById(req.params.product_id)
    let category = await Category.fetch()
    product.setProperties(req.body)
    let fileName = ''
    if (req.files && req.files.image != undefined) {
        let image = req.files.image
        if (image.mimetype.startsWith('image/')) {
            if (image.size <= 2 * 1024 * 1024) {
                fileName = `${product.name}-${uuid()}.${image.name.split('.').pop()}`
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
        product.image = fileName
        product.update()
    }
    await product.update()
    res.redirect('/admin/products')
}
let deleteProduct = async(req, res) => {
    let products = await Product.findById(req.params.product_id)
    let admin_id = req.params.admin_id || req?.session?.admin?.id;
  if (!admin_id) {
    return res.redirect("/login");
  }
    await products.delete()
    res.redirect('/admin/products')
}
let productDetail = async (req, res) => {
    let product = await Product.findByFeature(req.params.product_features);
    let admin = req.session.admin;
    let user = req.session.user;
    let products = await Product.fetch()
    let categories = await Category.fetch();
    res.render("product-detail", { product, admin, user, categories, products });
  };

module.exports = { addProduct, postProduct, getProducts, editProduct, updateProduct, deleteProduct, productDetail };