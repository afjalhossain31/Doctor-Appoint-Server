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
    const appointmentCollection = db.collection("appointments");
    const userCollection = db.collection("users");

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

    // 4. Add new appointment
    app.post('/appointments', async (req, res) => {
      console.log("Receiving Data:", req.body); // Eita dile backend console-e data dekha jabe
      try {
        const appointmentData = req.body;
        const result = await appointmentCollection.insertOne(appointmentData);
        res.send(result);
      } catch (error) {
        console.error("Error:", error);
        res.status(500).send({ message: "Failed to book appointment", error });
      }
    });

    // 5. Get appointments for a user
    app.get('/appointments/:email', async (req, res) => {
      const email = req.params.email;
      const result = await appointmentCollection.find({ userEmail: email }).toArray();
      res.send(result);
    });

    // 6. Get all appointments
    app.get('/appointments', async (req, res) => {
      const result = await appointmentCollection.find().toArray();
      res.send(result);
    });

    // 7. Store user info during registration
    app.post('/users', async (req, res) => {
      try {
        const user = req.body;
        // Check if user already exists
        const query = { email: user.email };
        const existingUser = await userCollection.findOne(query);
        if (existingUser) {
          return res.send({ message: 'user already exists', insertedId: null });
        }
        const result = await userCollection.insertOne(user);
        res.send(result);
      } catch (error) {
        res.status(500).send({ message: "Failed to save user", error });
      }
    });

    // 8. Delete a doctor by ID
    app.delete('/doctors/:id', async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await doctorCollection.deleteOne(query);
        if (result.deletedCount === 1) {
          res.send({ message: "Doctor deleted successfully", success: true });
        } else {
          res.status(404).send({ message: "Doctor not found" });
        }
      } catch (error) {
        res.status(500).send({ message: "Failed to delete doctor", error });
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
