const express = require('express');
const cors = require('cors');
require('dotenv').config();
app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;



//middleware
app.use(cors())
app.use(express.json())




app.get('/', (req, res) => {
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
        const classicCollection = client.db('classicCarDB').collection('classic');

        app.get('/classic', async (req, res) => {
            const cursor = classicCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/classic/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await classicCollection.findOne(query);
            res.send(result);

        })

        //luxury section
        const luxuryCollection = client.db('classicCarDB').collection('luxury');

        app.get('/luxury', async (req, res) => {
            const cursor = luxuryCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        });

        app.get('/luxury/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await luxuryCollection.findOne(query);
            res.send(result);
        })

        //jeep car section
        const jeepCollection = client.db('classicCarDB').collection('jeep');

        app.get('/jeep', async (req, res) => {
            const cursor = jeepCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/jeep/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await jeepCollection.findOne(query);
            res.send(result);
        })

        const allToyCollection = client.db('classicCarDB').collection('alltoys');
        //all toys data from user added;

        app.get('/alltoys', async (req, res) => {
            console.log(req.query.email);
            let query = {}
            if (req.query?.email) {
                query = { email: req.query.email }
            }
            const result = await allToyCollection.find(query).toArray();
            res.send(result);
        })

        app.get('/alltoys', async (req, res) => {
            const cursor = allToyCollection.find().limit(20);
            // const limit = parseInt(req.query.limit) || 20;
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/alltoys/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await allToyCollection.findOne(query);
            res.send(result);

        })

        app.post('/alltoys', async (req, res) => {
            const newToy = req.body;
            const result = await allToyCollection.insertOne(newToy);
            res.send(result);
        })

        //update
        app.put('/alltoys/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true }
            const  updatedToy = req.body;
            const Toy = {
                $set: {
                    toyName: updatedToy.toyName,
                    price: updatedToy.price,
                    category: updatedToy.category,
                    quantity: updatedToy.quantity,
                    descriptions: updatedToy.descriptions,
                }
            }
            const result = await  allToyCollection.updateOne(filter,Toy,options)
            res.send(result);
        })


        app.delete('/alltoys/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await allToyCollection.deleteOne(query);
            res.send(result)
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







app.listen(port, () => {
    console.log(`Toy server is running on port: ${port}`);
})