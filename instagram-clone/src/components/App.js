import { useState, useEffect } from "react";
import firebase from "firebase";
import InstagramEmbed from "react-instagram-embed";
import Modal from "@material-ui/core/Modal";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Input } from "@material-ui/core";
import "../style/App.css";
import { Navbar, Posts, ImageUpload } from "./";
import { db, auth } from "../firebase.js";
import axios from "../axios.js";
import Pusher from "pusher-js";

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [users, setUsers] = useState([]);
  const [email, setEmail] = useState([]);
  const [password, setPassword] = useState([]);
  const [username, setUsername] = useState([]);
  const [open, setOpen] = useState(false);
  const [userlogin, setUserlogin] = useState(null);
  const [openlogin, setOpenlogin] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      console.log("unsubscribe");
      if (authUser) {
        console.log(authUser);
        setUserlogin(authUser);
      } else {
        setUserlogin(null);
      }
    });
    return () => {
      unsubscribe();
    };
  }, [username, userlogin]);

  const fetchPosts = async () =>
    await axios.get("/uploaded").then((response) => {
      console.log(response);
      setUsers(response.data);
    });
  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    const pusher = new Pusher("7745b07f825893536777", {
      cluster: "ap2",
    });

    const channel = pusher.subscribe("posts");
    channel.bind("inserted", function (data) {
      fetchPosts();
    });
  }, []);

  const handleSignup = (event) => {
    event.preventDefault();
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        console.log("function");
        return authUser.user.updateProfile({
          displayName: username,
        });
      })
      .catch((error) => alert(error.message));
    setOpen(false);
  };

  const handlelogin = (event) => {
    event.preventDefault();
    auth
      .signInWithEmailAndPassword(email, password)
      .then(console.log("function"))
      .catch((err) => alert(err.message));
    setOpenlogin(false);
  };

  return (
    <div>
      <Navbar />
      <div className="app">
        <Modal open={open} onClose={() => setOpen(false)}>
          <div style={modalStyle} className={classes.paper}>
            <form className="app_signup">
              <center>
                <img
                  className="signup-logo"
                  src="https://image.flaticon.com/icons/png/512/2111/2111463.png"
                  alt="insta-logo"
                />
              </center>

              <Input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />

              <Input
                type="text"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button type="submit" onClick={handleSignup}>
                SIGN UP
              </Button>
            </form>
          </div>
        </Modal>

        <Modal open={openlogin} onClose={() => setOpenlogin(false)}>
          <div style={modalStyle} className={classes.paper}>
            <form className="app_signup">
              <center>
                <img
                  className="signup-logo"
                  src="https://image.flaticon.com/icons/png/512/2111/2111463.png"
                  alt="insta-logo"
                />
              </center>

              <Input
                type="text"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button type="submit" onClick={handlelogin}>
                LOGIN
              </Button>
            </form>
          </div>
        </Modal>

        {userlogin ? (
          <Button onClick={() => auth.signOut()}>LOGOUT</Button>
        ) : (
          <div>
            <Button onClick={() => setOpen(true)}>SIGN UP</Button>
            <Button onClick={() => setOpenlogin(true)}>LOGIN</Button>
          </div>
        )}

        {users.map((user) => (
          <Posts
            user={userlogin}
            key={user._id}
            postId={user._id}
            username={user.user}
            caption={user.caption}
            imgUrl={user.image}
            timestamp={firebase.firestore.FieldValue.serverTimestamp()}
          />
        ))}
        {userlogin?.displayName ? (
          <ImageUpload username={userlogin.displayName} />
        ) : (
          <h3>Sorry You need to login to upload</h3>
        )}
      </div>
    </div>
  );
}

export default App;
