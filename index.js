const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;



//middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nmlnmya.mongodb.net/?retryWrites=true&w=majority`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();




        //for create database and collections
        const brandCollection = client.db('brandShopDB').collection('brand');
        const productCollection = client.db('brandShopDB').collection('product');
        const myCartCollection = client.db('brandShopDB').collection('myCart');


        //read all data from brand collection
        app.get('/brand', async (req, res) => {
            const cursor = brandCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })


        //insert a new product into product collection
        app.post('/product', async (req, res) => {
            const newProduct = req.body;
            // console.log(newProduct);

            //pass data from server side to database
            const result = await productCollection.insertOne(newProduct);
            res.send(result);
        })


        //get all products for a specific brand from product collection
        app.get('/product/brand/:name', async (req, res) => {

            const name = req.params.name;

            const query = { brand: name };
            const cursor = productCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        })


        //get a single product by specific id from product collection
        app.get('/product/id/:id', async (req, res) => {

            const id = req.params.id;

            const query = { _id: new ObjectId(id) };
            const user = await productCollection.findOne(query);
            res.send(user);
        })


        //get a single product by specific id from product collection
        app.get('/product/forUpdate/:id', async (req, res) => {

            const id = req.params.id;

            const query = { _id: new ObjectId(id) };
            const user = await productCollection.findOne(query);
            res.send(user);
        })



        //get a single product by specific id for update data from product collection
        app.put('/product/update/:id', async (req, res) => {

            const id = req.params.id;
            const product = req.body;


            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updatedProduct = {
                $set: {

                    name: product.name,
                    photoUrl: product.photoUrl,
                    brand: product.brand,
                    type: product.type,
                    price: product.price,
                    description: product.description,
                    rating: product.rating
                }
            }

            const result = await productCollection.updateOne(filter, updatedProduct, options);
            res.send(result);
        })




        //insert a new cart into myCart collection
        app.post('/addToMyCart', async (req, res) => {
            const newCart = req.body;
            // console.log(newCart);

            //pass data from server side to database
            const result = await myCartCollection.insertOne(newCart);
            res.send(result);
        })


        //read all data from myCart collection
        app.get('/myCart', async (req, res) => {
            const cursor = myCartCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })


        //delete a cart from myCart collection
        app.delete('/myCart/:id', async (req, res) => {
            const id = req.params.id;

            const query = { _id: new ObjectId(id) }
            const result = await myCartCollection.deleteOne(query);
            res.send(result);
        })








        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Brand Shop server is running')
})


app.listen(port, () => {
    console.log(`Brand Shop server is running on port: ${port}`)
})