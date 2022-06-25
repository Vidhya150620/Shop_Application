const express = require('express');
var cors = require('cors');
const connection = require('./connection')
const billRouter = require('./routes/bill');
const dashboardRouter = require('./routes/dashboard');

const userRoute = require("./routes/user")
const categoryRoute = require('./routes/category');
const productRoute = require('./routes/product')
const app = express()
app.use(cors());
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use('/user',userRoute);
app.use('/category',categoryRoute);
app.use('/product',productRoute);
app.use('/bill',billRouter);
app.use('/dashboard',dashboardRouter);

module.exports=app;