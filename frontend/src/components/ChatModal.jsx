import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { X, Send, User, MessageSquare, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const ChatModal = ({ request, isOpen, onClose }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [socketConnected, setSocketConnected] = useState(false);
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  const requestId = request?._id;
  const isRequester = request?.requester?._id === user?.id;
  const otherParty = isRequester ? request?.owner : request?.requester;

  // Initialize Socket.io and fetch history
  useEffect(() => {
    if (!isOpen || !requestId) return;

    // Connect to Socket server
    const socket = io(window.location.origin, {
      path: '/socket.io',
      transports: ['websocket', 'polling']
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      setSocketConnected(true);
      socket.emit('join_room', requestId);
    });

    socket.on('disconnect', () => {
      setSocketConnected(false);
    });

    socket.on('receive_message', (newMsg) => {
      if (newMsg.relatedRequest === requestId) {
        setMessages((prev) => {
          // Avoid duplicate messages
          if (prev.some((m) => m._id === newMsg._id)) return prev;
          return [...prev, newMsg];
        });
      }
    });

    // Load message history via REST API
    api.get(`/api/chat/${requestId}`)
      .then((res) => {
        if (res.data.success) {
          setMessages(res.data.messages || []);
        }
      })
      .catch((err) => console.error('Failed to load chat history:', err))
      .finally(() => setLoading(false));

    return () => {
      socket.disconnect();
    };
  }, [isOpen, requestId]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isOpen || !request) return null;

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const content = inputMessage.trim();
    setInputMessage('');

    // Emit via Socket.io if connected
    if (socketRef.current && socketConnected) {
      socketRef.current.emit('send_message', {
        requestId,
        senderId: user.id,
        recipientId: otherParty?._id || otherParty?.id,
        content
      });
    } else {
      // Fallback to HTTP POST
      try {
        const res = await api.post(`/api/chat/${requestId}`, { content });
        if (res.data.success) {
          setMessages((prev) => [...prev, res.data.message]);
        }
      } catch (err) {
        console.error('Failed to send message over HTTP:', err);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-navy-950/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg h-[600px] rounded-3xl shadow-modal border border-cream-200 flex flex-col overflow-hidden animate-slide-in">
        {/* Chat Header */}
        <div className="p-4 bg-cream-100 border-b border-cream-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {otherParty?.profileImage ? (
              <img
                src={otherParty.profileImage}
                alt={otherParty.name}
                className="w-10 h-10 rounded-full object-cover border border-cream-300"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-navy-800 text-white flex items-center justify-center font-bold text-sm">
                {otherParty?.name?.charAt(0) || 'U'}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-navy-900">{otherParty?.name}</h4>
                <span
                  className={`w-2 h-2 rounded-full ${
                    socketConnected ? 'bg-emerald-500' : 'bg-gray-400'
                  }`}
                  title={socketConnected ? 'Live Connection' : 'Polling'}
                />
              </div>
              <p className="text-[11px] text-gray-500">
                Regarding: <span className="font-semibold text-navy-800">{request.book?.title}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-gray-400 hover:text-navy-900 hover:bg-cream-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-cream-50/50">
          {loading ? (
            <div className="flex items-center justify-center h-full text-xs text-gray-400">
              Loading conversation...
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <MessageSquare className="w-10 h-10 text-cream-300 mb-2" />
              <p className="text-sm font-semibold text-navy-800">No messages yet</p>
              <p className="text-xs text-gray-400 mt-1">
                Say hello and discuss meet-up location on campus!
              </p>
            </div>
          ) : (
            messages.map((msg) => {
              const isMe = msg.sender?._id === user?.id || msg.sender === user?.id;
              const timeString = new Date(msg.createdAt).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
              });

              return (
                <div
                  key={msg._id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[78%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                      isMe
                        ? 'bg-brand-600 text-white rounded-br-none'
                        : 'bg-white text-navy-900 border border-cream-200 rounded-bl-none'
                    }`}
                  >
                    {msg.content}
                  </div>
                  <span className="text-[10px] text-gray-400 mt-1 px-1 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {timeString}
                  </span>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-cream-200 flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your message..."
            maxLength={1000}
            className="flex-1 px-4 py-2.5 rounded-xl border border-cream-300 bg-cream-50/50 text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim()}
            className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white transition-colors disabled:opacity-50 flex items-center justify-center"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatModal;
