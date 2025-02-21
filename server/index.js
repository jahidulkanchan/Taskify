require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 5000;


const app = express();
app.use(express.json());
app.use(cors());


// MongoDB configuration ========================
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.4xfij.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // await client.db("admin").command({ ping: 1 });
    const usersCollection = client.db("taskManageDB").collection("users");
    const tasksCollection = client.db("taskManageDB").collection("tasks");
    app.post('/users', async(req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      res.send(result);
    })
    app.post('/tasks', async(req, res) => {
      const task = req.body;
      const result = await tasksCollection.insertOne(task);
      res.send(result);
    })
    app.get('/tasks', async(req,res)=>{
      const allTask = req.body;
       const result = await tasksCollection.find(allTask).toArray()
       res.send(result);
    })
      // Delete Task item ===================
      app.delete("/tasks/:id", async (req, res) => {
        const id = req.params?.id;
        const query = { _id: new ObjectId(id) };
        const result = await tasksCollection.deleteOne(query);
        res.send(result);
      });
       // Update Task item ===================
       app.put("/tasks/:id", async (req, res) => {
        const id = req.params.id;
        const updatedTask = req.body;
      
        const query = { _id: new ObjectId(id) };
        const updateDoc = {
          $set: {
            title: updatedTask.title || "",  // Prevent null values
            description: updatedTask.description || "",
            category: updatedTask.category, 
          },
        };
      
        try {
          const result = await tasksCollection.updateOne(query, updateDoc);
          res.send(result);
        } catch (error) {
          res.status(500).send({ message: "Error updating task", error });
        }
      });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);


app.get("/", (req, res) => {
  res.send("Server is running...");
});
app.listen(port, () => console.log(`Server running on port ${port}`));
