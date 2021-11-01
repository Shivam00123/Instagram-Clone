import React from "react";
import "../style/comments.css";
function Comments({ comment, username }) {
  return (
    <div className="comment-container">
      <p>
        <strong>{username}</strong> {comment.text}
      </p>
    </div>
  );
}

export default Comments;
