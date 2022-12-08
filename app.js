const express = require('express');
const client = require('./routes/client');
const adminRoute = require('./routes/adminRoute');
const fileUpload = require('express-fileUpload');
const session = require('express-session');
const flash = require('req-flash');
const logger = require("morgan");
const authenticateAdmin = require('./middlewares/authenticateAdmin');
const {generate} = require('password-hash');
const app = express();


app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: {}
}))

app.use(flash({locals: 'flash'}));

app.use((req, res, next) => {
    res.locals.formErrors = req.session.formErrors;
    res.locals.formBody = req.session.formBody;
    res.locals.cartCount = req.session.cartCount;
    delete req.session.formErrors;
    delete req.session.formBody;
    next()
});

app.use(logger("dev"));
app.use(express.static('public'));
app.use(express.static('uploads'));
app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(express.urlencoded({ extended: true }))
app.use(fileUpload(
    {
     
        useTempFiles: true,
        tempFileDir: './tmp/'
    }
));

app.use(client);
app.use('/admin', authenticateAdmin, adminRoute);
// app.use((err, req, res, next) => {
//     //set locals, only providing error in development
//     res.locals.message = err.message;
//     res.locals.error = req.app.get("env") === "development" ? err : {};
//   });

// app.use((req, res, next) => {
//     const err = new Error('Page not Found');
//     err.status = 404;
//     next(err);
// })

// app.use((err, req, res, next) => {
//     console.log(err);
//     err.status = err.status || 500;
//     err.message = err.status == 500 ? 'Internal Server Error' : err.message;
//     res.status(err.status || 500);
//     res.render('error', {error: err});
// })
app.listen(5000, () => {
    console.log('App listening on port 5000!');
});
// console.log(generate('ope'));
// var some = "hey"
// console.log(some.replace(/['"]+/g, ''));
// var time = new Date();
// console.log(
//   time.toLocaleString('en-US', { hour: 'numeric', hour12: true, minute: 'numeric', second: 'numeric' })
// );  

// let price = 4
// console.log(price.toLocaleString('en-Ng',{style:'currency', currency:'NGN'}));
// var myDate = new Date(new Date().getTime()+(7*24*60*60*1000)).toLocaleString().slice(0, -12).replace('T', ' ')
// console.log(myDate);
// var date = new Date(new Date().getTime() + (48.60*24*60*60)).toISOString().slice(11, -5).replace('T', ' ')
// console.log(date);
var date1 = (new Date(Number(new Date()) + (48.60* 24 *60 *60))).toISOString().slice(0, -5).replace('T', ' ')
console.log(date1);