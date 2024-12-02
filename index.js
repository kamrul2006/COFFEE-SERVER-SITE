const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000

//---------------------------------------------------
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.8jqou.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// console.log(uri)

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

        const CoffeeCollection = client.db("CoffeeDB").collection('All-Coffee')
        const UserCollection = client.db("CoffeeDB").collection('All-Users')

        //---------------------------Showing all coffees---------------------------
        app.get('/coffees', async (req, res) => {
            const cursor = CoffeeCollection.find()
            const result = await cursor.toArray()
            res.send(result)
        })

        //---------------------------Showing all users---------------------------
        app.get('/users', async (req, res) => {
            const cursor = UserCollection.find()
            const result = await cursor.toArray()
            res.send(result)
        })

        //-------------------add coffee-------------------------------------------
        app.post('/coffees', async (req, res) => {
            const newCoffee = req.body
            console.log(newCoffee)
            const result = await CoffeeCollection.insertOne(newCoffee)
            res.send(result)
        })
        //-------------------add users-------------------------------------------
        app.post('/users', async (req, res) => {
            const newUser = req.body
            console.log(newUser)
            const result = await UserCollection.insertOne(newUser)
            res.send(result)
        })

        //--------------------------------delete coffee------------------------------
        app.delete('/coffees/:id', async (req, res) => {
            const id = req.params.id
            console.log(id)
            const cursor = { _id: new ObjectId(id) }
            const result = await CoffeeCollection.deleteOne(cursor)
            res.send(result)
        })

        //--------------------------------delete user------------------------------
        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id
            console.log(id)
            const cursor = { _id: new ObjectId(id) }
            const result = await UserCollection.deleteOne(cursor)
            res.send(result)
        })

        //---------------------------Get coffee by ID-----------------------------
        app.get('/coffees/:id', async (req, res) => {
            const id = req.params.id
            console.log(id)
            const query = { _id: new ObjectId(id) }
            const result = await CoffeeCollection.findOne(query)
            res.send(result)
        })

        //---------------------------Get user by ID-----------------------------
        app.get('/users/:id', async (req, res) => {
            const id = req.params.id
            console.log(id)
            const query = { _id: new ObjectId(id) }
            const result = await UserCollection.findOne(query)
            res.send(result)
        })

        //----------------------- update coffee---------------------------------
        app.put('/coffees/:id', async (req, res) => {
            const id = req.params.id
            console.log(id)
            const query = { _id: new ObjectId(id) }
            const option = { upsert: true }
            const updatedCoffee = req.body
            const Coffee = {
                $set: {
                    name: updatedCoffee.name,
                    supplier: updatedCoffee.supplier,
                    chef: updatedCoffee.chef,
                    taste: updatedCoffee.taste,
                    category: updatedCoffee.category,
                    details: updatedCoffee.details,
                    photo: updatedCoffee.photo,
                    price: updatedCoffee.price
                }
            }

            const result = await CoffeeCollection.updateOne(query, Coffee, option)
            res.send(result)
        })

        //--------------update login time----------------------
        app.patch('/users', async (req, res) => {
            const Email = req.body.Email
            console.log(Email)
            const filter = { Email }
            const updatedDoc = {
                $set: {
                    lastSignInTime: req.body?.lastSignInTime
                }
            }
            const result = await UserCollection.updateOne(filter, updatedDoc)
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
    res.send('Coffee Server is running.')
})

app.listen(port)


