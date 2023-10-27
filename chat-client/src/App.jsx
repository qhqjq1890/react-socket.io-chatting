import "./App.css";
import { useEffect, useState } from "react";
import { socket } from "./socket";

function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(socket.isConnected);

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    socket.on("connect", onConnect);

    socket.on("broadcastMessage", ({ messageObject }) => {
      setMessages((prevMessages) => {
        const updatedMessages = [
          ...prevMessages,
          { Message: messageObject.messagefromserver, Id: messageObject.Id },
        ];
        console.log(updatedMessages);
        return updatedMessages;
      });
    });

    return () => {
      socket.off("connect");
      socket.off("broadcastMessage");
    };
  }, []);

  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  const onClick = () => {
    socket.emit("sendMessage", { Message: message });
    setMessage("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      socket.emit("sendMessage", { Message: message });
      setMessage("");
    }
  };

  return (
    <div className="chat-page">
      <div className="background">
        <div className="messages">
          {messages.map((message) => (
            <div
              className={
                message.Id === socket.id ? "my-message" : "others-message"
              }
            >
              {message.Message}
            </div>
          ))}
        </div>
      </div>
      <div className="input-section">
        <input
          className="chat-input"
          onChange={handleChange}
          onKeyUp={handleKeyPress}
          value={message}
        ></input>
        <button className="send-button" onClick={onClick}>
          전송
        </button>
      </div>
    </div>
  );
}

export default App;
