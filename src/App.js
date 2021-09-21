import "./App.css";
import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";

const socket = io.connect(process.env.REACT_APP_SERVER);

function App() {
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState("");
  const [isstarted, setStarted] = useState(false);
  const [chat, setChat] = useState([]);
  const inputRef = useRef();

  const sendMessage = (e) => {
    e.preventDefault();
    socket.emit("chat message", {
      id: uuidv4(),
      username,
      message,
    });
    setMessage("");
    inputRef.current.focus();
  };
  useEffect(() => {
    socket.on("chat message", (payload) => {
      setChat([...chat, payload]);
    });
  });
  return (
    <div className="App">
      <h1>Chat</h1>
      <div className="container">
        <div className="wrapper">
          {chat.map((payload) => {
            return (
              <span
                key={payload.id}
                className="chat"
                style={
                  payload.username === username
                    ? {
                        alignSelf: "flex-end",
                        backgroundColor: "rgb(247, 229, 205)",
                      }
                    : {
                        alignSelf: "flex-start",
                        backgroundColor: "#2D46B9",
                        color: "#fff",
                      }
                }
              >
                {/* <p className="chat__username"> {payload.username}</p> */}
                <p className="chat__message">{payload.message}</p>
              </span>
            );
          })}

          {!isstarted ? (
            <div className="username__input">
              <input
                type="text"
                value={username}
                placeholder="Enter the username"
                onChange={(e) => setUsername(e.target.value)}
              />
              <button type="submit" onClick={() => setStarted(true)}>
                Set
              </button>
            </div>
          ) : (
            <form onSubmit={sendMessage} className="message__input">
              <input
                type="text"
                value={message}
                ref={inputRef}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button type="submit">Send</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
