import React, { useState, useEffect, useRef, useCallback } from 'react';
import { IoMdSend } from "react-icons/io";

// Componente para mostrar un mensaje
const Message = ({ text, isOwnMessage }) => {
  const [username, message] = text.split(': ', 2);

  return (
    <div className={`mb-2 ${isOwnMessage ? 'text-right' : 'text-left'}`}>
      <div 
        className={`inline-block px-4 py-2 rounded-lg ${isOwnMessage ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} max-w-64 sm:max-w-sm md:max-w-md lg:max-w-lg`} 
        style={{ wordWrap: 'break-word', whiteSpace: 'pre-wrap' }} // Asegura que los saltos de línea se preserven
      >
        {!isOwnMessage && (
          <p className="text-xs text-blue-600">{username}</p>
        )}
        <p className={`mt-1 ${isOwnMessage ? 'text-white text-sm' : 'text-gray-700 text-sm'}`}>{message}</p>
      </div>
    </div>
  );
};

// Componente para la entrada del nombre de usuario
const UsernameInput = ({ username, setUsername, setIsUsernameSet, error, setError }) => (
  <div className="mb-4">
    <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2">
      Nombre de usuario:
    </label>
    <input
      type="text"
      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      id="username"
      placeholder="Introduce tu nombre"
      value={username}
      onChange={(e) => setUsername(e.target.value)}
    />
    <button
      onClick={() => {
        if (!username.trim()) {
          setError('El nombre de usuario no puede estar vacío.');
          return;
        }
        localStorage.setItem('username', username);
        setIsUsernameSet(true);
        setError('');
      }}
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-2"
    >
      Confirmar Nombre
    </button>
  </div>
);

// Componente para la entrada del mensaje
const MessageInput = ({ message, setMessage, sendMessage, handleKeyDown, textAreaRef }) => (
  <div className="relative flex items-end mt-4 justify-center">
    <textarea
      ref={textAreaRef}
      className="shadow appearance-none border rounded-lg w-full md:w-10/12 py-[14px] px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline resize-none overflow-y-auto pr-16"
      id="messageInput"
      placeholder="Introduce tu mensaje"
      value={message}
      onChange={(e) => setMessage(e.target.value)}
      onKeyDown={handleKeyDown}
      rows={1}
      style={{ minHeight: '50px', maxHeight: '160px' }} // Tamaño ajustado
    />
    <button
      onClick={sendMessage}
      className={`bg-blue-500  text-white font-bold py-3 px-3 md:py-4 md:px-4 rounded-full focus:outline-none focus:shadow-outline absolute right-5 bottom-1 ${message.trim() === '' ? 'opacity-50 ' : 'hover:bg-blue-700'}`}
      disabled={message.trim() === ''}
    >
      <IoMdSend />
    </button>
  </div>
);


// Componente principal del chat
export const Chat = () => {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState('');
  const [isUsernameSet, setIsUsernameSet] = useState(false);
  const socketRef = useRef(null);
  const textAreaRef = useRef(null);
  const messageAreaRef = useRef(null);

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    const storedMessages = JSON.parse(localStorage.getItem('messages')) || [];

    if (storedUsername) {
      setUsername(storedUsername);
      setIsUsernameSet(true);
    }

    setMessages(storedMessages);

    socketRef.current = new WebSocket('ws://localhost:8080/chat');

    const handleMessage = (event) => {
      const receivedMessage = event.data;
      if (receivedMessage.startsWith(`${username}:`)) {
        return;
      }

      setMessages((prevMessages) => {
        const newMessages = [
          ...prevMessages,
          { text: receivedMessage, isOwnMessage: false, id: crypto.randomUUID() }
        ];
        localStorage.setItem('messages', JSON.stringify(newMessages));
        return newMessages;
      });
    };

    socketRef.current.addEventListener('message', handleMessage);

    socketRef.current.onopen = () => {
      console.log('WebSocket connected');
    };

    socketRef.current.onclose = () => {
      console.log('WebSocket disconnected');
    };

    return () => {
      socketRef.current.removeEventListener('message', handleMessage);
      socketRef.current.close();
    };
  }, [username]);

  const sendMessage = useCallback(() => {
    if (!username.trim() || !message.trim()) {
      setError('Nombre de usuario y mensaje no pueden estar vacíos.');
      return;
    }

    if (socketRef.current.readyState !== WebSocket.OPEN) {
      setError('El WebSocket no está conectado.');
      return;
    }

    const fullMessage = `${username}: ${message}`;

    socketRef.current.send(fullMessage);

    setMessages((prevMessages) => {
      const newMessages = [
        ...prevMessages,
        { text: fullMessage, isOwnMessage: true, id: crypto.randomUUID() }
      ];
      localStorage.setItem('messages', JSON.stringify(newMessages));
      return newMessages;
    });

    setMessage('');
    setError('');
    textAreaRef.current.style.height = '50px'; // Restablecer la altura del textarea
  }, [username, message]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    } else {
      const textArea = e.target;
      textArea.style.height = 'auto';
      textArea.style.height = `${textArea.scrollHeight}px`;
    }
  };

  useEffect(() => {
    if (messageAreaRef.current) {
      messageAreaRef.current.scrollTop = messageAreaRef.current.scrollHeight;
    }
  }, [messages]);

  if (!isUsernameSet && localStorage.getItem('username') !== null) {
    setIsUsernameSet(true);
  }

  return (
    <div className="flex justify-center items-center">
      <div className="md:w-11/12 w-full bg-[rgba(236,240,250,255)] shadow-lg rounded-lg md:px-6 px-2 py-4 flex flex-col h-[90vh] md:h-[85vh]">
        <div id="messageArea" className="flex-1 overflow-y-auto pb-4" ref={messageAreaRef}>
          {messages.map((msg) => (
            <Message key={msg.id} text={msg.text} isOwnMessage={msg.isOwnMessage} />
          ))}
        </div>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            {error}
          </div>
        )}
        {!isUsernameSet ? (
          <UsernameInput 
            username={username}
            setUsername={setUsername}
            setIsUsernameSet={setIsUsernameSet}
            error={error}
            setError={setError}
          />
        ) : (
          <MessageInput 
            message={message}
            setMessage={setMessage}
            sendMessage={sendMessage}
            handleKeyDown={handleKeyDown}
            textAreaRef={textAreaRef}
          />
        )}
      </div>
    </div>
  );
};
