import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import Pusher from "pusher";
import dbModel from "./dbModel.js";

const app = express();
app.use(express.json());
app.use(cors());
const Port = process.env.PORT || 8000;

const pusher = new Pusher({
  appId: "1255838",
  key: "7745b07f825893536777",
  secret: "f3bc91616195cca5bf61",
  cluster: "ap2",
  useTLS: true,
});

const connection_url =
  "mongodb+srv://shivam:6xVBCMvznVL62NQ@cluster0.yxgui.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.post("/upload", (req, res) => {
  const body = req.body;

  dbModel.create(body, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).send(data);
    }
  });
});

app.get("/uploaded", (req, res) => {
  dbModel.find((err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(data);
    }
  });
});

mongoose.connect(connection_url);

mongoose.connection.once("open", () => {
  console.log("Mongo conected");

  const changeStream = mongoose.connection.collection("posts").watch();

  changeStream.on("change", (change) => {
    console.log("change Trigger");
    console.log(change);
    console.log("change finished");

    if (change.operationType === "insert") {
      console.log("Triggering Pusher ***Img Upload***");

      const postDetails = change.fullDocument;

      pusher.trigger("posts", "inserted", {
        user: postDetails.user,
        caption: postDetails.caption,
        image: postDetails.image,
      });
    } else {
      console.log("Bad Request");
    }
  });
});

app.listen(Port, () => {
  console.log("Server started at : http://localhost:" + Port);
});
