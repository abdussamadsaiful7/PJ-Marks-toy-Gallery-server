const express = require('express');
const cors = require('cors');
require('dotenv').config();
app= express();
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5000;



//middleware
app.use(cors())
app.use(express.json())


console.log(process.env.DB_PASS)

app.get('/',(req, res)=>{
    res.send('toy server is running........')
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nrvy6gz.mongodb.net/?retryWrites=true&w=majority`;

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
    //await client.connect();

    //classic section
    const classicCollection =client.db('classicCarDB').collection('classic');

    app.get('/classic', async(req, res)=>{
        const cursor = classicCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);







app.listen(port, ()=>{
    console.log(`Toy server is running on port: ${port}`);
})