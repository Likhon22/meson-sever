const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT | 5000;

app.use(express.json());
app.use(cors());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri =
  "mongodb+srv://meson-db:66x9xKQ6CusGQcze@cluster0.azveb8q.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
const courses = client.db("mesonDB").collection("courses");

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    app.get("/courses", async (req, res) => {
      const result = await courses.find().toArray();
      res.send(result);
    });
    // getting single course
    app.get("/courses/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await courses.findOne(query);
      res.send(result);
    });
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/unique-categories", async (req, res) => [
  // const category= await
]);
app.get("/", async (req, res) => {
  res.send("meson server is running");
});
app.listen(port, (req, res) => {
  console.log("meson server is running");
});
