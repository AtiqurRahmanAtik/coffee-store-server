
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express')
require('dotenv').config()
const cors = require('cors');
const app = express()
const port = process.env.PORT || 5000;


//middleware
app.use(cors());
app.use(express.json());







// //mongodb connection

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.aq01puw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

console.log(uri);
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
    
    const coffeeCollection = client.db("coffeeDB").collection("coffee");
    const userCollection = client.db("coffeeDB").collection("user");
   

    //get
    app.get('/coffee', async(req,res)=>{

         const cursor = coffeeCollection.find();
         const result = await cursor.toArray();
         res.send(result);

    })

    app.get('/coffee/:id', async(req,res)=>{
        const id = req.params.id;
        const query = {_id : new ObjectId(id)};
        const result = await coffeeCollection.findOne(query);
        res.send(result);
    })

    app.put('/coffee/:id', async(req,res)=>{
      const id = req.params.id;
      const coffee = req.body;
      const filter = {_id : new ObjectId(id)};
      const options = { upsert: true };
      const updateCoffee = {
        $set : {
          name : coffee.name,
          PhotoURL: coffee.PhotoURL,
          coffeeName : coffee.coffeeName,
          Supplier : coffee.Supplier,
          Taste : coffee.Taste,
          Details : coffee.Details,
          Quantity : coffee.Quantity

        }
      }

      const result = await coffeeCollection.updateOne(filter,updateCoffee,options);
      res.send(result);
    })


    app.delete('/coffee/:id', async(req,res)=>{
        const id = req.params.id;
        const query = {_id : new ObjectId(id)};
        const result = await coffeeCollection.deleteOne(query);
        res.send(result);
        
    })


    //post
    app.post('/coffee', async(req,res) =>{
        const coffeeUser = req.body;
        console.log(coffeeUser);
        const result = await coffeeCollection.insertOne(coffeeUser);
        res.send(result);
    })

    //user database
    app.post('/user', async(req,res)=>{
      const user = req.body;
      const result = await userCollection.insertOne(user);
      res.send(result);
    })

    app.get('/user', async(req,res)=>{

      const query = userCollection.find();
      const result = await query.toArray();
      res.send(result);
    })

    app.delete('/user/:id', async(req,res)=>{
      const id = req.params.id;
      const query = {_id :new ObjectId(id)};
      const result = await userCollection.deleteOne(query);
      res.send(result);
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



//get 
app.get('/', (req, res) => {
  res.send('Coffee server is readyyyyyyyy');
})

app.listen(port, () => {
  console.log(`Coffee server is ruing  ${port}`)
})