const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors'); // Frontend theke request allow korar jonno
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
dotenv.config();

const uri = process.env.MONGODB_URI;

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors()); // CORS enable kora holo
app.use(express.json()); // JSON data receive korar jonno

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Database and Collection
    const db = client.db("Doctor-Appoint");
    const doctorCollection = db.collection("doctors");

    // 1. Get all doctors
    app.get('/doctors', async (req, res) => {
      const result = await doctorCollection.find().toArray();
      res.send(result);
    });

    // 2. Get single doctor by ID
    app.get('/doctors/:doctorId', async (req, res) => {
      const doctorId = req.params.doctorId;
      const query = { _id: new ObjectId(doctorId) };
      const result = await doctorCollection.findOne(query);
      res.send(result);
    });

    // 3. Add a new doctor (APNAR NOTUN CODE)
    app.post('/doctors', async (req, res) => {
      try {
        const newDoctor = req.body;
        const result = await doctorCollection.insertOne(newDoctor);
        res.send(result);
      } catch (error) {
        res.status(500).send({ message: "Failed to add doctor", error });
      }
    });

    // Connect and Verify
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (error) {
    console.error("Connection error:", error);
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello, Afjal Hossain Coming!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});