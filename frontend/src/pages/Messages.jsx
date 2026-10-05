import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Search, Users, Plus, Loader2 } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import ChatWindow from '../components/ChatWindow';
import SessionScheduler from '../components/SessionScheduler';

export const Messages = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchFilter, setSearchFilter] = useState('');

  // Scheduler modal state
  const [schedulerOpen, setSchedulerOpen] = useState(false);
  const [schedulerPeer, setSchedulerPeer] = useState(null);

  const fetchConversations = async () => {
    setLoading(true);
    try {
      const res = await api.getConversations();
      if (res.success && res.conversations) {
        setConversations(res.conversations);
        if (res.conversations.length > 0 && !selectedConversation) {
          setSelectedConversation(res.conversations[0]);
        }
      }
    } catch (err) {
      console.warn('Failed to load conversations:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, [user?.id]);

  const handleOpenScheduler = (peer) => {
    setSchedulerPeer(peer);
    setSchedulerOpen(true);
  };

  const filteredConversations = conversations.filter(c => {
    const name = c.recipient?.full_name || '';
    return name.toLowerCase().includes(searchFilter.toLowerCase());
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-[calc(100vh-5rem)]">
      
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 h-full">
        
        {/* Left: Conversation List */}
        <div className="glass-panel rounded-2xl border border-white/10 flex flex-col h-full overflow-hidden shadow-xl">
          
          <div className="p-4 border-b border-white/10 space-y-3 bg-slate-900/60">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-indigo-400" />
                <span>Peer Messages</span>
              </h2>
              <Link
                to="/discover"
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="Find new students"
              >
                <Plus className="w-4 h-4" />
              </Link>
            </div>

            {/* Search filter */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Search conversations..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* List items */}
          <div className="flex-1 overflow-y-auto divide-y divide-white/5">
            {loading ? (
              <div className="py-12 text-center text-xs text-slate-400">
                <Loader2 className="w-6 h-6 text-indigo-400 animate-spin mx-auto mb-2" />
                <span>Loading conversations...</span>
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="py-12 px-4 text-center text-xs text-slate-400 space-y-2">
                <p>No active conversations found.</p>
                <Link to="/discover" className="text-indigo-400 hover:underline block font-semibold">
                  Connect with a mentor to start chatting
                </Link>
              </div>
            ) : (
              filteredConversations.map((conv) => {
                const recipient = conv.recipient;
                const isSelected = selectedConversation?.id === conv.id;
                const lastMsg = conv.lastMessage;

                return (
                  <button
                    key={conv.id}
                    onClick={() => setSelectedConversation(conv)}
                    className={`w-full text-left p-3.5 flex items-start gap-3 transition-colors ${
                      isSelected
                        ? 'bg-indigo-600/20 border-l-4 border-indigo-500'
                        : 'hover:bg-white/5'
                    }`}
                  >
                    <img
                      src={recipient?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                      alt={recipient?.full_name}
                      className="w-10 h-10 rounded-full object-cover border border-slate-700 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-white truncate">{recipient?.full_name}</h4>
                        {lastMsg && (
                          <span className="text-[10px] text-slate-500">
                            {new Date(lastMsg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">
                        {lastMsg ? lastMsg.content : 'No messages yet'}
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </div>

        </div>

        {/* Right: Active Chat Window */}
        <div className="md:col-span-2 lg:col-span-3 h-full">
          <ChatWindow
            conversation={selectedConversation}
            onScheduleSession={handleOpenScheduler}
          />
        </div>

      </div>

      {schedulerOpen && schedulerPeer && (
        <SessionScheduler
          peer={schedulerPeer}
          isOpen={schedulerOpen}
          onClose={() => setSchedulerOpen(false)}
        />
      )}

    </div>
  );
};

export default Messages;
