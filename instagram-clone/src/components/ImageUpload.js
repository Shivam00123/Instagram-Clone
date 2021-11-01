import { Button } from "@material-ui/core";
import React, { useState } from "react";
import firebase from "firebase";
import { db, storage } from "../firebase.js";
import "../style/imageupload.css";
import axios from "../axios.js";
import ImageFileToBase64 from "image-file-to-base64-exif";

function ImageUpload({ username }) {
  const [caption, setCaption] = useState("");
  const [progress, setProgress] = useState(0);
  const [image, setImage] = useState(null);

  // {
  //   image && console.log("base64", ImageFileToBase64(image));
  // }

  const handleChange = (ev) => {
    if (ev.target.files[0]) {
      setImage(ev.target.files[0]);
    }
  };

  const handleUpload = () => {
    const uploadTask = storage.ref(`images/${image.name}`).put(image);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      (error) => {
        console.log(error.message);
        alert(error.message);
      },
      () => {
        storage
          .ref("images")
          .child(image.name)
          .getDownloadURL()
          .then((url) => {
            console.log("url", url);
            axios.post("/upload", {
              caption: caption,
              user: username,
              image: url,
            });

            db.collection("insta-posts").add({
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              caption: caption,
              imgUrl: url,
              username: username,
            });
            setProgress(0);
            setCaption("");
            setImage(null);
          });
      }
    );
  };

  return (
    <div className="upload">
      <progress className="progress-bar" value={progress} max="100" />
      <input
        type="text"
        placeholder="Caption..."
        onChange={(e) => setCaption(e.target.value)}
      />
      <input type="file" onChange={handleChange} />
      <Button onClick={handleUpload}>Upload</Button>
    </div>
  );
}

export default ImageUpload;
