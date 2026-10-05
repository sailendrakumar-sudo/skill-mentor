import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRightLeft, 
  CheckCircle, 
  XCircle, 
  Clock, 
  MessageSquare, 
  Calendar, 
  UserCheck, 
  ArrowDownLeft, 
  ArrowUpRight,
  Loader2
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import SessionScheduler from '../components/SessionScheduler';

export const Requests = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('received'); // 'received' | 'sent' | 'all'
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [schedulerOpen, setSchedulerOpen] = useState(false);
  const [selectedPeerForSession, setSelectedPeerForSession] = useState(null);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await api.getRequests();
      if (res.success) {
        setRequests(res.all || []);
      }
    } catch (err) {
      console.warn('Failed to load requests:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [user?.id]);

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.updateRequestStatus(id, status);
      fetchRequests();
    } catch (err) {
      console.error(err);
    }
  };

  const handleScheduleWithPeer = (peer) => {
    setSelectedPeerForSession(peer);
    setSchedulerOpen(true);
  };

  const receivedRequests = requests.filter(r => r.receiver_id === user?.id);
  const sentRequests = requests.filter(r => r.sender_id === user?.id);

  const displayedRequests = activeTab === 'received' 
    ? receivedRequests 
    : activeTab === 'sent' 
      ? sentRequests 
      : requests;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-xs font-semibold text-indigo-300 mb-2">
            <ArrowRightLeft className="w-4 h-4 text-indigo-400" />
            <span>Exchange Workflow</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Skill Exchange Requests</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage incoming mentorship proposals and track requests you've sent to peers.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800 self-start sm:self-auto text-xs">
          <button
            onClick={() => setActiveTab('received')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-bold transition-all ${
              activeTab === 'received'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ArrowDownLeft className="w-3.5 h-3.5" />
            <span>Received ({receivedRequests.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('sent')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-bold transition-all ${
              activeTab === 'sent'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>Sent ({sentRequests.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-2 rounded-lg font-semibold transition-all ${
              activeTab === 'all'
                ? 'bg-slate-800 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All ({requests.length})
          </button>
        </div>
      </div>

      {/* Requests List */}
      {loading ? (
        <div className="py-24 text-center space-y-3">
          <Loader2 className="w-8 h-8 text-indigo-400 animate-spin mx-auto" />
          <p className="text-xs text-slate-400">Loading requests...</p>
        </div>
      ) : displayedRequests.length === 0 ? (
        <div className="py-20 text-center glass-panel rounded-2xl border border-white/10 p-8 space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 mx-auto">
            <UserCheck className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">No requests in this tab</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {activeTab === 'received'
              ? 'You have no pending requests from other students. Make sure your profile has skills listed!'
              : 'You haven\'t sent any requests yet. Discover peers and request a mentorship session.'}
          </p>
          <Link
            to="/discover"
            className="inline-block px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md transition-all"
          >
            Discover Mentors
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {displayedRequests.map((req) => {
            const isSender = req.sender_id === user?.id;
            const peer = isSender ? req.receiver : req.sender;
            const isPending = req.status === 'Pending';
            const isAccepted = req.status === 'Accepted';

            return (
              <div
                key={req.id}
                className="glass-card rounded-2xl p-5 sm:p-6 border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
              >
                
                {/* Peer & Exchange Info */}
                <div className="flex items-start gap-4 flex-1">
                  <Link to={`/student/${peer?.id}`}>
                    <img
                      src={peer?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                      alt={peer?.full_name}
                      className="w-14 h-14 rounded-2xl object-cover border border-indigo-500/40 shrink-0"
                    />
                  </Link>

                  <div className="min-w-0 flex-1 space-y-1.5">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <Link to={`/student/${peer?.id}`} className="hover:underline">
                        <h3 className="text-base font-bold text-white">{peer?.full_name}</h3>
                      </Link>
                      
                      <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                        req.status === 'Accepted' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                        req.status === 'Pending' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                        req.status === 'Rejected' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                        'bg-slate-700 text-slate-300'
                      }`}>
                        {req.status}
                      </span>

                      <span className="text-[11px] text-slate-400">
                        {isSender ? '• Sent by you' : '• Received'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300">
                      Requested Skill: <strong className="text-indigo-400">{req.skill_requested}</strong>
                      {req.skill_offered && (
                        <span> • Offered in return: <strong className="text-emerald-400">{req.skill_offered}</strong></span>
                      )}
                    </p>

                    <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 leading-relaxed italic">
                      "{req.objective}"
                    </div>

                    <span className="text-[10px] text-slate-400 block pt-1">
                      {new Date(req.created_at).toLocaleDateString()} at {new Date(req.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 w-full md:w-auto self-end md:self-center shrink-0">
                  {!isSender && isPending && (
                    <>
                      <button
                        onClick={() => handleUpdateStatus(req.id, 'Rejected')}
                        className="flex-1 md:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 border border-rose-500/30 transition-colors"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Decline</span>
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(req.id, 'Accepted')}
                        className="flex-1 md:flex-initial flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md transition-all hover:scale-105"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Accept Exchange</span>
                      </button>
                    </>
                  )}

                  {isSender && isPending && (
                    <button
                      onClick={() => handleUpdateStatus(req.id, 'Cancelled')}
                      className="w-full md:w-auto px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-slate-800 transition-colors"
                    >
                      Cancel Request
                    </button>
                  )}

                  {isAccepted && (
                    <>
                      <Link
                        to="/messages"
                        className="flex-1 md:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md transition-all"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Chat Now</span>
                      </Link>
                      <button
                        onClick={() => handleScheduleWithPeer(peer)}
                        className="flex-1 md:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
                      >
                        <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Schedule</span>
                      </button>
                    </>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Scheduler Modal */}
      {schedulerOpen && selectedPeerForSession && (
        <SessionScheduler
          peer={selectedPeerForSession}
          isOpen={schedulerOpen}
          onClose={() => setSchedulerOpen(false)}
          onSuccess={() => fetchRequests()}
        />
      )}

    </div>
  );
};

export default Requests;
