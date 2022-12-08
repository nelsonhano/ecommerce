const Cart = require("../models/cart");
const uuid = require("../helpers/uuid");
const Category = require("../models/Category");
const Product = require('../models/Product')
const { connection, query } = require("../models/connection");
let cart = async (req, res, next) => {
  var summary = req.session.summary;
  var cartSummary;
  if (summary) {
    cartSummary = {
      subTotal: summary.subTotal,
      discount: summary.discount,
      shipping: summary.shipping,
      quantity: summary.totalQuantity,
      total: summary.total,
    };
    var cart = req.session.cart;
    var showCart = [];
    for (var item in cart) {
      var aItem = cart[item];
      if (cart[item].quantity > 0) {
        showCart.push({
          image: aItem.image,
          product_name: aItem.name,
          category_name: aItem.category_name,
          product_id: aItem.id,
          description: aItem.description,
          features: aItem.features,
          price: aItem.price,
          quantity: aItem.quantity,
          total: aItem.total,
        });
      }
    }
  }
  req.session.showCart = showCart;
  req.session.cartSummary = cartSummary;
  var contextDict = {
    title: "Cart",
    user: req.session.user,
    admin: req.session.admin,
    cart: showCart,
    summary: cartSummary,
    categories: await Category.fetch(),
    products: await Product.fetch(),
  };
  res.render("cart", contextDict);
};
let cartUpdate = async (req, res, next) => {
  var cart = req.session.cart;
  var newQuantity = parseInt(req.body[req.params.product_id]);

  for (var item in cart) {
    if (cart[item].id == req.params.product_id) {
      var diff = newQuantity - cart[item].quantity;
      if (diff != 0) {
        var summary = req.session.summary;

        summary.totalQuantity += diff;
        summary.subTotal = summary.subTotal + cart[item].price * diff;
        summary.total = summary.total + cart[item].price * diff;
        cart[item].total = cart[item].total + cart[item].price * diff;
        cart[item].quantity = newQuantity;
      }
    }
  }
  res.redirect("/cart");
};

let cartDelete = async (req, res, next) => {
  var cart = req.session.cart;
  var summary = req.session.summary;
  let product = await Product.findById(req.params.product_id)
  req.flash('success', `${product.name} was removed from cart successfully`)
  summary.totalQuantity -= cart[req.params.product_id].quantity;
  cart[req.params.product_id].quantity = 0;
  summary.subTotal = summary.subTotal - cart[req.params.product_id].total;
  summary.total = summary.total - cart[req.params.product_id].total;
  cart[req.params.product_id].total = 0;
  delete cart[req.params.product_id];
  req.session.cartCount = Object.keys(cart).length || 0;
  if (summary.totalQuantity == 0) {
    delete req.session.cart;
    delete req.session.cartSummary;
    delete req.session.summary;
    delete req.session.cartCount;
    res.redirect("/cart");
  } else {
    res.redirect("/cart");
  }
};

let cartAdd = async (req, res, next) => {
  req.session.cart = req.session.cart || {};
  var cart = req.session.cart;
  req.session.summary = req.session.summary || {
    totalQuantity: 0,
    subTotal: 0,
    discount: 0,
    shipping: 500,
    total: 0,
  };
  var summary = req.session.summary;
  
  var selectQuery =
  "SELECT products.*, categories.category_name from products inner join categories on products.categories_id = categories.id where products.id = " +
  req.params.product_id;
  var rows = await query(selectQuery);
  let product = await Product.findById(req.params.product_id)
  req.flash('success', `${product.name} added to cart successfully`);
  var plusPrice = 0.0;
  var inputQuantity = parseInt(req.body.quantity);
  if (cart[req.params.product_id]) {
    if (inputQuantity) {
      cart[req.params.product_id].quantity += inputQuantity;
      plusPrice = cart[req.params.product_id].price * inputQuantity;
      cart[req.params.product_id].total += plusPrice;
      summary.subTotal += plusPrice;
      summary.totalQuantity += inputQuantity;
    } else {
      cart[req.params.product_id].quantity++;
      plusPrice = cart[req.params.product_id].price;
      cart[req.params.product_id].total += plusPrice;
      summary.subTotal += plusPrice;
      summary.totalQuantity++;
    }
  } else {
    cart[req.params.product_id] = rows[0];
    
    if (req.body.quantity) {
      cart[req.params.product_id].quantity = inputQuantity;
      plusPrice = cart[req.params.product_id].price * inputQuantity;
      cart[req.params.product_id].total = plusPrice;
      summary.subTotal += plusPrice;
      summary.totalQuantity += inputQuantity;
    } else {
      rows[0].quantity = 1;
      plusPrice = cart[req.params.product_id].price;
      cart[req.params.product_id].total = plusPrice;
      summary.subTotal += plusPrice;
      summary.totalQuantity++;
    }
  }
  summary.total = summary.subTotal - summary.discount + summary.shipping;
  req.session.cartCount = Object.keys(req.session.cart).length || 0;
  res.redirect("back");
};
module.exports = {
  cart,
  cartAdd,
  cartDelete,
  cartUpdate,
};
