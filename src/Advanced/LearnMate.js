import React, { useState, useRef, useEffect } from 'react';
import UserHeader from '../Header/UserHeader';
import './LearnMate.scss';
import { IoSend, IoStop } from "react-icons/io5";
import { FaRobot, FaUser } from "react-icons/fa";

// Function to format messages
const formatMessage = (message) => {
  return message.trim().charAt(0).toUpperCase() + message.trim().slice(1);
};

const LearnMate = () => {
  const [chat, setChat] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [history, setHistory] = useState([]);
  const [typing, setTyping] = useState(false);
  const [responseText, setResponseText] = useState('');
  const [typingInterval, setTypingInterval] = useState(null); // Store interval ID
  const inputRef = useRef(null);
  const chatContainerRef = useRef(null); // Ref for chat container

  // Scroll to bottom when chat or responseText updates
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chat, responseText]);

  const handleSend = () => {
    if (inputMessage.trim()) {
      const formattedMessage = formatMessage(inputMessage);

      // Add formatted user message to chat and history
      setChat((prevChat) => [
        ...prevChat,
        { role: 'user', message: formattedMessage }
      ]);
      setHistory((prevHistory) => [
        ...prevHistory,
        formattedMessage
      ]);

      // Clear the input field
      setInputMessage('');

      // Fetch assistant response
      const data = JSON.stringify({
        messages: [{ role: 'user', content: formattedMessage }],
        web_access: false
      });

      const xhr = new XMLHttpRequest();
      xhr.withCredentials = true;

      xhr.addEventListener('readystatechange', function () {
        if (this.readyState === this.DONE) {
          try {
            const responseText = this.responseText;
            const response = JSON.parse(responseText);

            if (!response.status) {
              console.error('API Error:', response);
              return;
            }

            // Simulate typing effect for the assistant's response
            const assistantMessage = response.result.trim();
            simulateTyping(assistantMessage);
          } catch (error) {
            console.error('Error parsing API response:', error);
          }
        }
      });

      xhr.open('POST', 'https://chatgpt-42.p.rapidapi.com/gpt4');
      xhr.setRequestHeader('x-rapidapi-key', '53335ef937msh1e452d2a916b013p168a60jsn1bae19569914');
      xhr.setRequestHeader('x-rapidapi-host', 'chatgpt-42.p.rapidapi.com');
      xhr.setRequestHeader('Content-Type', 'application/json');

      xhr.send(data);
    }
  };

  const simulateTyping = (text) => {
    setTyping(true);
    let index = -1;
    setResponseText('');

    // Clear any existing interval if a new typing simulation starts
    if (typingInterval) {
      clearInterval(typingInterval);
    }

    const interval = setInterval(() => {
      setResponseText(prevText => prevText + text[index]);
      index += 1;
      if (index >= text.length) {
        clearInterval(interval);
        setTyping(false);
        setChat(prevChat => [
          ...prevChat,
          { role: 'assistant', message: text }
        ]);
      }
    }, 5); // Adjust the typing speed by changing this value

    setTypingInterval(interval);
  };

  const handleStop = () => {
    if (typingInterval) {
      clearInterval(typingInterval);
      setTyping(false);
      setTypingInterval(null);
      // Stop the current response by adding it to the chat
      setChat(prevChat => [
        ...prevChat,
        { role: 'assistant', message: responseText }
      ]);
    }
  };

  const handleNewChat = () => {
    setChat([]);
    setHistory([]);
    setResponseText('');
    setTyping(false);
    setTypingInterval(null);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleHistoryClick = (message) => {
    setInputMessage(message);
    handleSend();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className='LearnMate'>
      <UserHeader />
      <div className='LearnMateContainer'>
        <div className='Container1 Container'>
          <div className='button'>
            <button className='ContBtn' onClick={handleNewChat}>+ New Chat</button>
          </div>

          <div className='allChat'>
            {history.map((item, index) => (
              <div key={index} className='historyBtn' onClick={() => handleHistoryClick(item)}>
                {item.length > 30 ? `${item.slice(0, 30)}...` : item}
              </div>
            ))}
          </div>
        </div>

        <div className='Container2 Container'>
          <div className='OutputMessage' ref={chatContainerRef}>
            {chat.map((item, index) => (
              <div key={index} className={`OutputContainer ${item.role}`}>
                <span>
                  {item.role === 'user' ? <FaUser /> : <FaRobot />}
                </span>
                <div className='message'>{item.message}</div>
              </div>
            ))}
            {typing && (
              <div className='OutputContainer assistant'>
                <span>
                  <FaRobot />
                </span>
                <div className='message'>{responseText}</div>
              </div>
            )}
          </div>

          <div className='InputMessage'>
            <div className='InputContainer'>
              <div className='MsgBtn'>
                <textarea
                  className='inputField'
                  placeholder='Write Your Message Here...'
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  ref={inputRef}
                />
                {typing ? (
                  <span className='sentBtn' onClick={handleStop}><IoStop /></span> // Show Stop button
                ) : (
                  <span className='sentBtn' onClick={handleSend}><IoSend /></span> // Show Send button
                )}
              </div>
              <small className='text'>AI can generate incorrect information.</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LearnMate;