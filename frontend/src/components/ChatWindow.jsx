import React, { useState, useEffect, useRef } from 'react';
import { Send, Calendar, Star, Building2, CheckCheck, User } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export const ChatWindow = ({ conversation, onScheduleSession }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  const recipient = conversation?.recipient || { full_name: 'Peer Student' };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadMessages = async () => {
    if (!conversation?.id) return;
    setLoading(true);
    try {
      const res = await api.getMessages(conversation.id);
      if (res.success && res.messages) {
        setMessages(res.messages);
      }
    } catch (err) {
      console.warn('Failed to fetch messages:', err.message);
    } finally {
      setLoading(false);
      setTimeout(scrollToBottom, 100);
    }
  };

  useEffect(() => {
    loadMessages();
  }, [conversation?.id]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const content = inputText.trim();
    setInputText('');
    setSending(true);

    try {
      const res = await api.sendMessage({
        conversation_id: conversation.id,
        content
      });

      if (res.success && res.message) {
        setMessages(prev => [...prev, res.message]);
        setTimeout(scrollToBottom, 50);
      }
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setSending(false);
    }
  };

  if (!conversation) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center text-slate-400 glass-panel rounded-2xl border border-white/10">
        <div className="w-16 h-16 rounded-full bg-slate-800/80 border border-slate-700 flex items-center justify-center mb-3 text-indigo-400">
          <User className="w-8 h-8" />
        </div>
        <h3 className="text-base font-bold text-white">Select a Conversation</h3>
        <p className="text-xs text-slate-400 max-w-xs mt-1">
          Choose a peer from the list on the left to start exchanging insights and planning sessions.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col glass-panel rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
      
      {/* Conversation Header */}
      <div className="p-4 border-b border-white/10 bg-slate-900/60 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={recipient.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
              alt={recipient.full_name}
              className="w-10 h-10 rounded-full object-cover border border-indigo-500/40"
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#0B0F19]" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">{recipient.full_name}</h3>
            <p className="text-[11px] text-slate-400">{recipient.institution || 'University Peer'}</p>
          </div>
        </div>

        {/* Action button to schedule session */}
        <button
          onClick={() => onScheduleSession && onScheduleSession(recipient)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-indigo-300 bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/30 transition-all hover:scale-105"
        >
          <Calendar className="w-3.5 h-3.5 text-indigo-400" />
          <span>Schedule Session</span>
        </button>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {loading ? (
          <div className="flex items-center justify-center h-full text-xs text-slate-400">
            Loading chat messages...
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-xs text-slate-400">
            <p>No messages yet.</p>
            <p className="text-slate-500 mt-1">Break the ice! Say hello and propose an exchange date.</p>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isMe = msg.sender_id === user?.id;
            return (
              <div
                key={msg.id || index}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-xs shadow-md leading-relaxed ${
                    isMe
                      ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white rounded-br-none'
                      : 'bg-slate-800/90 text-slate-200 border border-slate-700 rounded-bl-none'
                  }`}
                >
                  <p>{msg.content}</p>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-slate-500 mt-1 px-1">
                  <span>
                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {isMe && <CheckCheck className="w-3 h-3 text-indigo-400" />}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input Footer */}
      <form onSubmit={handleSendMessage} className="p-3 border-t border-white/10 bg-slate-900/60 flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={`Type a message to ${recipient.full_name.split(' ')[0]}...`}
          className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || sending}
          className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 transition-all disabled:opacity-40 disabled:hover:bg-indigo-600"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

    </div>
  );
};

export default ChatWindow;
