import React, { useState } from 'react';
import { X, Star, CheckCircle, Award } from 'lucide-react';
import api from '../services/api';

export const ReviewForm = ({ session, peer, isOpen, onClose, onSuccess }) => {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen || !session) return null;

  const targetPeer = peer || session.mentor || session.learner || { full_name: 'Peer Student', id: session.mentor_id };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await api.createReview({
        session_id: session.id,
        reviewed_id: targetPeer.id,
        rating: rating,
        feedback: feedback.trim()
      });

      if (res.success) {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          onSuccess && onSuccess(res.review);
          onClose();
        }, 1500);
      }
    } catch (err) {
      setError(err.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-md rounded-2xl glass-panel border border-white/10 p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {success ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white">Review Submitted!</h3>
            <p className="text-xs text-slate-300 max-w-xs mx-auto">
              Thank you for evaluating your peer exchange. Reputation ratings and badges have been updated.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <Star className="w-6 h-6 fill-amber-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Review & Feedback</h3>
                <p className="text-xs text-slate-400">Rate your exchange with {targetPeer.full_name}</p>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300">
                {error}
              </div>
            )}

            {/* Star Rating Input */}
            <div className="py-2 text-center space-y-2">
              <label className="text-xs font-semibold text-slate-300 block">
                How would you rate this peer session?
              </label>
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => {
                  const filled = (hoverRating || rating) >= star;
                  return (
                    <button
                      type="button"
                      key={star}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="p-1 transition-transform hover:scale-125 focus:outline-none"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          filled
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-600'
                        } transition-colors`}
                      />
                    </button>
                  );
                })}
              </div>
              <p className="text-xs font-bold text-amber-300">
                {rating === 5 && '🌟 Exceptional Mentor / Collaborator!'}
                {rating === 4 && '👍 Great, very helpful session'}
                {rating === 3 && '👌 Good exchange, solid progress'}
                {rating === 2 && '⚠️ Needs improvement in preparation'}
                {rating === 1 && '❌ Unsatisfactory exchange'}
              </p>
            </div>

            {/* Qualitative Feedback */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Detailed Feedback & Recommendations
              </label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={3}
                placeholder="What did you learn? How well did your peer explain concepts or contribute to the project?"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                required
              />
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 shadow-lg shadow-amber-500/20 transition-all disabled:opacity-50"
              >
                <span>{loading ? 'Submitting...' : 'Submit Review'}</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};

export default ReviewForm;
