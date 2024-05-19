const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5300

// middleware
app.use(express.json())
app.use(cors())







const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gkjrmbe.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
console.log(uri)

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

        const userCollection = client.db('usersDb').collection('users')
        const touristsSpotCollection = client.db('touristSpotDb').collection('spotDetails');

        // tourist spot mongodb

        app.get('/spotDetails', async (req, res) => {
            const cursor = touristsSpotCollection.find()
            const result = await cursor.toArray()
            res.send(result)
        })

        app.get('/spotDetails/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await touristsSpotCollection.findOne(query)
            res.send(result)

        })

        app.post('/spotDetails', async (req, res) => {
            const spotDetails = req.body
            const result = await touristsSpotCollection.insertOne(spotDetails)
            res.send(result)
        })

        // update spotdetails
        app.put('/spotDetails/:id', async (req, res) => {
            const id = req.params.id
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true }
            const updatedSpot = req.body
            const spot = {
                $set: {
                    username: updatedSpot?.username,
                    image: updatedSpot?.image,
                    spotName: updatedSpot?.spotName,
                    country: updatedSpot.country,
                    location: updatedSpot?.location,
                    description: updatedSpot?.description,
                    averageCost: updatedSpot?.averageCost,
                    seasonality: updatedSpot?.seasonality,
                    travelTime: updatedSpot?.travelTime,
                    totalVisitors: updatedSpot?.totalVisitors
                }
            }
            const result = await touristsSpotCollection.updateOne(filter, spot, options)
            res.send(result)
        })


        // delete spotDetails
        app.delete('/spotDetails/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await touristsSpotCollection.deleteOne(query)
            res.send(result)
        })


        // users mongodb
        app.get('/users', async (req, res) => {
            const cursor = userCollection.find()
            const result = await cursor.toArray()
            res.send(result)
        });

        app.post('/users', async (req, res) => {
            const user = req.body
            const result = await userCollection.insertOne(user)
            res.send(result)
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



app.get('/', (req, res) => {
    res.send('The tourism server is running')
})

app.listen(port, () => {
    console.log(`The server is running on Port : ${port}`)
})
