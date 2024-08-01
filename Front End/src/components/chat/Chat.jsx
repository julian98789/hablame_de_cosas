import React, { useState, useEffect, useRef, useCallback } from 'react';
import { IoMdSend } from "react-icons/io";
import toast, { Toaster } from 'react-hot-toast';

// Función para limpiar el texto del mensaje, eliminando líneas vacías
const cleanMessage = (text) => {
  return text
    .split('\n')
    .filter(line => line.trim() !== '')
    .join('\n');
};

// Componente para mostrar un mensaje
const Message = ({ text, isOwnMessage }) => {
  const [username, message] = text.split(': ', 2);
  const cleanedMessage = cleanMessage(message);

  return (
    <div className={`mb-2 text-aura1 ${isOwnMessage ? 'text-right' : 'text-left'}`}>
      <div
        className={`inline-block px-4 py-2 rounded-lg ${isOwnMessage ? 'bg-[rgba(26,36,41,255)] text-white' : 'bg-[#334650] text-white'} max-w-64 md:max-w-md lg:max-w-lg`}
        style={{ wordWrap: 'break-word', whiteSpace: 'pre-wrap' }}
      >
        {!isOwnMessage && (
          <p className="text-xs text-[rgb(194,153,248,255)] text-aura1">{username}</p>
        )}
        <p className={`mt-1 text-base ${isOwnMessage ? 'text-white' : 'text-white'}`}>{cleanedMessage}</p>
      </div>
    </div>
  );
};

// Componente para la entrada del nombre de usuario
const UsernameInput = ({ username, setUsername, setIsUsernameSet }) => (
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
          toast.dismiss();
          toast.error('El nombre de usuario no puede estar vacío.', {
            style: {
              backgroundColor: 'black',
              color: 'white',
            },
          });
          return;
        }
        localStorage.setItem('username', username);
        setIsUsernameSet(true);
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
    <div className="relative flex w-full md:w-10/12">
      <textarea
        ref={textAreaRef}
        className={`appearance-none scrollbar-custom bg-[rgba(54,68,72,255)] ${message.trim() === '' ? 'border-none shadow-none placeholder-gray-400' : 'textarea-shadow border border-neutral-200 text-aura1'}  rounded-lg w-full py-[14px] px-3 text-white leading-tight focus:outline-none focus:shadow-outline resize-none overflow-y-auto pr-16`}
        id="messageInput"
        placeholder="Escribe un mensaje"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        rows={1}
        style={{ minHeight: '50px', maxHeight: '160px' }}
      />
      <button
        onClick={sendMessage}
        className={`bg-[rgba(26,36,41,255)] font-bold py-2 px-2 md:py-3 md:px-3 rounded-full absolute right-4 md:bottom-[5px] bottom-2 ${message.trim() === '' ? 'opacity-50 shadow-none cursor-not-allowed' : 'enviar-shadow'}`}
        disabled={message.trim() === ''}
      >
        <IoMdSend className='text-white' />
      </button>
    </div>
  </div>
);

// Componente principal del chat
export const Chat = () => {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
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
    if (socketRef.current.readyState !== WebSocket.OPEN) {
      toast.dismiss();
      toast.error('El WebSocket no está conectado.', {
        style: {
          backgroundColor: 'black',
          color: 'white',
        },
      });
      return;
    }

    if (message.trim() === '') return;

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
    textAreaRef.current.style.height = '50px'; // Restablecer la altura del textarea
  }, [username, message]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (message.trim() !== '') {
        sendMessage();
      }
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
      <div className="md:w-11/12 w-full bg-[rgba(0,5,9,255)] box-shadow shadow-lg rounded-lg md:px-6 px-2 py-4 flex flex-col h-[90vh] md:h-[94vh]">
        <div id="messageArea" className="flex-1 overflow-y-auto pb-4 scrollbar-custom" ref={messageAreaRef}>
          {messages.map((msg) => (
            <Message key={msg.id} text={msg.text} isOwnMessage={msg.isOwnMessage} />
          ))}
        </div>
        {!isUsernameSet ? (
          <UsernameInput
            username={username}
            setUsername={setUsername}
            setIsUsernameSet={setIsUsernameSet}
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
        <Toaster />
      </div>
    </div>
  );
};

