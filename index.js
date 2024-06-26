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
const reports = client.db("mesonDB").collection("reports");
const quizPractice = client.db("mesonDB").collection("quizPractice");

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
    // edit quiz
    app.put("/api/exams/edit-exam-by-id/:id", async (req, res) => {
      const examId = req.params.id;
      const updatedData = req.body;

      const result = await exams.updateOne(
        { _id: new ObjectId(examId) },
        { $set: updatedData }
      );
      console.log(result);
      res.send(result);
    });
    // delete quiz
    app.delete("/api/exams/delete-exam-by-id/:id", async (req, res) => {
      const examId = req.params.id;
      const result = await exams.deleteOne({ _id: new ObjectId(examId) });
      console.log(result);
      res.send(result);
    });

    // add question
    app.post("/api/exams/add-question-to-exam", async (req, res) => {
      const { name, correctOption, options, exam } = req.body;
      try {
        const result = await questions.insertOne({
          name,
          correctOption,
          options,
          exam,
        });
        res.send(result);
      } catch (error) {
        res.status(500).json({ success: false, message: error.message });
      }
    });

    // edit question

    app.post("/api/exams/edit-question-in-exam", async (req, res) => {
      const { questionId, name, correctOption, options, exam } = req.body;
      try {
        const result = await questions.updateOne(
          { _id: ObjectId(questionId) },
          { $set: { name, correctOption, options, exam } }
        );
        if (result.matchedCount > 0) {
          res.send(result);
        } else {
          res
            .status(404)
            .json({ success: false, message: "Question not found" });
        }
      } catch (error) {
        res.status(500).json({ success: false, message: error.message });
      }
    });
    // get quesiton data
    app.get("/api/exams/get-question-by-exam-id/:id", async (req, res) => {
      const id = req.params.id;
      const query = { exam: id };
      const result = await questions.find(query).toArray();
      res.send(result);
    });
    // delete question data
    app.delete(
      "/api/exams/delete-question-in-exam/:questionId/:examId",
      async (req, res) => {
        const { questionId, examId } = req.params;
        console.log(questionId, examId);
        const query1 = { _id: new ObjectId(questionId) };
        console.log(query1);
        const query2 = { exam: examId };
        console.log(query2);
        const result = await questions.deleteOne(query1, query2);
        console.log(result);
        res.send(result);
      }
    );

    // delete questions after  it has been submitted
    app.delete("/questions/deletedAfterSubmitted", async (req, res) => {
      // Extract IDs from request body
      const { ids } = req.body;
      console.log(ids);

      // Validate IDs
      if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ error: "Invalid or empty IDs array" });
      }

      // Convert string IDs to ObjectId
      const objectIds = ids.map((id) => new ObjectId(id));
      console.log(objectIds);

      // Delete documents matching the provided IDs
      const result = await questions.deleteMany({ _id: { $in: objectIds } });
      console.log(result);

      // Send response
      res.send(result);
    });
    // reports
    app.post("/api/reports/add-report", async (req, res) => {
      const report = req.body;
      const result = await reports.insertOne(report);
      res.send(result);
    });

    // quiz Practice
    // save
    app.post("/api/quiz/saveQuizForQuizCourse", async (req, res) => {
      const quiz = req.body;
      const result = await quizPractice.insertOne(quiz);
      res.send(result);
    });
    // users
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
