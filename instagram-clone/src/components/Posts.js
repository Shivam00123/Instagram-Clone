import React, { useEffect, useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import firebase from "firebase";
import ChatBubbleOutlineRoundedIcon from "@material-ui/icons/ChatBubbleOutlineRounded";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import { Comments } from ".";
import "../style/posts.css";
import { db } from "../firebase";
import { Button } from "@material-ui/core";

function Posts({ username, caption, imgUrl, postId, user, timestamp }) {
  const [comments, setComments] = useState([]);
  const [newcomment, setNewcomment] = useState("");
  useEffect(() => {
    let unsubscribe;
    if (postId) {
      unsubscribe = db
        .collection("DB-Insta-clone")
        .doc(postId)
        .collection("comments")
        .orderBy("timestamp", "desc")
        .onSnapshot((snapshot) => {
          setComments(snapshot.docs.map((doc) => doc.data()));
        });
    }
    return () => {
      unsubscribe();
    };
  }, [postId]);

  const handlePostComment = (ev) => {
    ev.preventDefault();
    if (newcomment) {
      db.collection("insta-posts").doc(postId).collection("comments").add({
        text: newcomment,
        username: user.displayName,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });
      if (ev.onKeyPress == "Enter") {
        db.collection("insta-posts").doc(postId).collection("comments").add({
          text: newcomment,
          username: user.displayName,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        });
      }
    }
    setNewcomment("");
  };

  return (
    <div className="post">
      <div className="post-header">
        <Avatar
          className="avatar"
          alt={username}
          src="/static/image/avatar/1.jpg"
        />
        <h3>{username}</h3>
      </div>
      <img className="post-img" src={imgUrl} alt="post" />
      <FavoriteBorderIcon fontSize="large" />
      <ChatBubbleOutlineRoundedIcon fontSize="large" />
      <h4>
        <strong>{username}</strong>
        {caption}
      </h4>
      {comments &&
        comments.map((comment) => (
          <Comments username={comment.username} comment={comment} />
        ))}
      <form className="comment-section">
        <input
          type="text"
          placeholder="leave a comment..."
          onChange={(e) => setNewcomment(e.target.value)}
        />
        <Button
          type="submit"
          onClick={handlePostComment}
          onKeyPress={handlePostComment}
        >
          POST
        </Button>
      </form>
    </div>
  );
}

export default Posts;
