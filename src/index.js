const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');



const authUser = require('./routes/auth');
const shopRouter = require('./routes/shop');
const categoryRouter = require('./routes/category');
const productRouter = require('./routes/product');
const cartRouter = require('./routes/cart');
const profileRouter = require('./routes/profile');


mongoose.connect(
    `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@cluster0.jxqdz.mongodb.net/${process.env.MONGO_DB_DATABASE}?retryWrites=true&w=majority`,
     {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    },()=>{
       console.log('Database connected.') 
});


const app = express();
app.use(express.json());
app.use(cors());

app.use('/api', authUser);
app.use('/api', categoryRouter);
app.use('/api', productRouter);
app.use('/api', cartRouter);
app.use('/api', shopRouter);
app.use('/api', profileRouter);

app.listen(process.env.PORT, ()=>{
    console.log(`Server running on port ${process.env.PORT}`);
});