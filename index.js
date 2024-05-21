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
const users = client.db("mesonDB").collection("users");
const exams = client.db("mesonDB").collection("exams");
const questions = client.db("mesonDB").collection("questions");
const manageExam = client.db("mesonDB").collection("manageExam");

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    app.post("/courses", async (req, res) => {
      const courseInfo = req.body;

      const result = await courses.insertOne(courseInfo);
      res.send(result);
    });
    // upload video link in courses
    app.post("/courses/add-video/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const videoInfo = req.body;
      const result = await courses.updateOne(query, {
        $push: { content: videoInfo },
      });
      console.log(result);
      if (result.modifiedCount === 1) {
        res.send(result);
      }
    });
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

    // get video data
    app.get("/courses/video/onlyVideo", async (req, res) => {
      const result = await courses.find().toArray();
      res.send(result);
    });
    app.get("/courses/quiz/onlyQuiz", async (req, res) => {
      const result = await courses.find().toArray();
      res.send(result);
    });
    // quiz

    app.post("/api/exams/add", async (req, res) => {
      const exam = req.body;
      const result = await exams.insertOne(exam);
      res.send(result);
    });
    // get quiz
    app.get("/api/exams/get-all-exams", async (req, res) => {
      const result = await exams.find().toArray();
      console.log(result);
      res.send(result);
    });
    app.get("/api/exams/get-exam-by-id/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await exams.findOne(query);
      res.send([result]);
    });
    app.post("/users", async (req, res) => {
      const user = req.body;
      console.log(user);
      const result = await users.insertOne(user);
      res.send(result);
    });
    // getting user role
    app.get("/users/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const result = await users.findOne(query);
      console.log(result);
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

app.get("/", async (req, res) => {
  res.send("meson server is running");
});
app.listen(port, (req, res) => {
  console.log("meson server is running");
});
