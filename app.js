const express = require('express')
const hbs = require('hbs')
var app = express();
app.set('view engine','hbs');


const MongoClient = require('mongodb').MongoClient;
const url = "mongodb+srv://hoang4326:tamnhungoc88@cluster0.qbbb2.mongodb.net/test";

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static('public'));

app.post('/search', async (req,res)=>{
    const searchText = req.body.txtName;
    const client = await MongoClient.connect(url);
    const dbo = client.db("VietHoangDB");

    const searchCondition = new RegExp(searchText,'i')
    const results = await dbo.collection("SanPham").
    find({name:searchCondition}).toArray();
    
    res.render('showProduct',{model:results})
})

app.post('/add', async (req,res)=>{
    const idInput = req.body.txtId;
    const nameInput = req.body.txtName;
    const priceInput = req.body.txtPrice;
    const imgURLInput = req.body.imgURL;
    const quantityInput = req.body.txtQuantity;
    const newProduct = {id: idInput,name:nameInput, price:priceInput,
        imgUrl:imgURLInput, size : {dai:20, rong:40}, quantity: quantityInput}
    const client = await MongoClient.connect(url);
    const dbo = client.db("VietHoangDB");
    await dbo.collection("SanPham").insertOne(newProduct);
    res.render('index')
})

app.get('/delete',async (req,res)=>{
    const id = req.query.id;
    var ObjectID = require('mongodb').ObjectID;
    const condition = {"_id" : ObjectID(id)};

    const client= await MongoClient.connect(url);
    const dbo = client.db("VietHoangDB");
    await dbo.collection("SanPham").deleteOne(condition);
    res.redirect('/view');
     
})


app.get('/insert',(req,res)=>{
    res.render('addProduct')
})

app.get('/view',async (req,res)=>{
    const client = await MongoClient.connect(url);
    const dbo = client.db("VietHoangDB");
    const results = await dbo.collection("SanPham").
    find({}).toArray();
    
    res.render('showProduct',{model:results})
})

app.get('/',(req,res)=>{
   
    res.render('index')
})



var PORT = process.env.PORT || 5000
app.listen(PORT);
console.log("Server is running at " + PORT)
