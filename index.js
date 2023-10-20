const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;

const app = express();

// middleWear
app.use(cors());
app.use(express.json());





const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.bo45c0q.mongodb.net/?retryWrites=true&w=majority`;

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
      await client.connect();

      const brandCollection = client.db('PrestigeWearDB').collection('Brands');
      const productCollection = client.db('PrestigeWearDB').collection('Products');
      const cartDataCollection = client.db('PrestigeWearDB').collection('cartData');
       

      // get requests for brand data
      app.get('/brands', async (req, res) => {
         const result = await brandCollection.find().toArray();
         res.send(result);
      }) 
      // get requests for brand data
      app.get('/cart-data', async (req, res) => {
         const result = await cartDataCollection.find().toArray();
         res.send(result);
      }) 

      // get single Brand data request 
      app.get('/brands/:id', async (req, res) => {
         const { id } = req.params;
         const query = {
            _id: new ObjectId(id),
         }
         const result = await brandCollection.findOne(query);
         res.send(result);
      })

      // get single Product data request 
      app.get('/products/:id', async (req, res) => {
         const { id } = req.params;
         const query = {
            _id: new ObjectId(id),
         }
         const result = await productCollection.findOne(query);
         res.send(result);
      })

      // get requests for Products data
      app.get('/products', async (req, res) => {
         const result = await productCollection.find().toArray();
         res.send(result);
      }) 

      // post request
      app.post('/products', async (req, res) => {
         const Product = req.body;
         const result = await productCollection.insertOne(Product);
         res.send(result);
      })

      // Update request with Put method
      app.put('/products/:id', async (req, res) => {
         const id = req.params.id;
         const updateData = req.body;
         const filter = { _id: new ObjectId(id) }
         const options = { upsert: true }
         const updatedProduct = { $set: updateData }
         const result = await productCollection.updateOne(filter, updatedProduct, options);
         console.log(id);
         console.log(updateData);
         res.send(result);
      });

      /**
       * Handle Product Cart Data
       */

      // get requests for cartItems data
      app.get('/cart-data', async (req, res) => {
         const result = await cartDataCollection.find().toArray();
         res.send(result);
      }) 

      // post request
      app.post('/cart-data', async (req, res) => {
         const Product = req.body;
         const result = await cartDataCollection.insertOne(Product);
         res.send(result);
      })

      // Delete request
      app.delete('/cart-data/:id', async (req, res) => {
         const { id } = req.params;
         const filter = {
            _id: new ObjectId(id),
         }
         const result = await cartDataCollection.deleteOne(filter);
         console.log(result);
         res.send(result);
      });



      // Send a ping to confirm a successful connection
      await client.db("admin").command({ ping: 1 });
      console.log("Pinged your deployment. You successfully connected to MongoDB!");
   } finally {
      // Ensures that the client will close when you finish/error
      // await client.close();
   }
}
run().catch(console.dir);





app.get('/', (req, res) => { 
   res.send('Server returned  successfully')
})

app.listen(port, () => {
   console.log(`listening on ${port}`);
})