import React, { useState } from 'react';
import { DesignComment } from '../types/interiorTypes';
import { Users, MessageSquare, Send, CheckCircle, XCircle, Clock } from 'lucide-react';

interface CollaborationCommentsPanelProps {
  comments: DesignComment[];
  currentRole: 'Architect' | 'Interior Designer' | 'Customer' | 'Admin';
  onAddComment: (text: string) => void;
  onUpdateCommentStatus: (id: string, status: 'Approved' | 'Rejected') => void;
  isDarkMode?: boolean;
}

export const CollaborationCommentsPanel: React.FC<CollaborationCommentsPanelProps> = ({
  comments,
  currentRole,
  onAddComment,
  onUpdateCommentStatus,
  isDarkMode = true
}) => {
  const [newCommentText, setNewCommentText] = useState('');

  const handleSend = () => {
    if (!newCommentText.trim()) return;
    onAddComment(newCommentText);
    setNewCommentText('');
  };

  return (
    <div className={`p-3.5 space-y-4 text-xs font-sans rounded-sm border ${
      isDarkMode ? 'bg-[#0D111A] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-white/10">
        <div className="flex items-center space-x-2">
          <Users className="w-4 h-4 text-[#B59B6D]" />
          <h3 className="font-bold text-sm uppercase tracking-wider">Team Review & Comments</h3>
        </div>
        <span className="px-2 py-0.5 rounded-sm bg-[#B59B6D]/20 text-[#B59B6D] text-[10px] font-bold uppercase border border-[#B59B6D]/30">
          Role: {currentRole}
        </span>
      </div>

      {/* Input Box */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={`Add comment as ${currentRole}...`}
            className={`flex-1 p-2 rounded-sm border text-xs focus:outline-none focus:border-[#B59B6D] ${
              isDarkMode ? 'bg-[#070A11] border-white/15 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
            }`}
          />
          <button
            onClick={handleSend}
            disabled={!newCommentText.trim()}
            className="px-3 py-2 rounded-sm bg-[#B59B6D] hover:bg-[#c4ab7d] text-black font-bold transition disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Comments Log List */}
      <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
        {comments.map((c) => (
          <div
            key={c.id}
            className={`p-2.5 rounded-sm border space-y-1.5 ${
              isDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1.5">
                <span className="font-bold text-xs text-white">{c.userName}</span>
                <span className="px-1.5 py-0.2 rounded-sm bg-white/10 text-slate-300 text-[9px] uppercase font-mono">
                  {c.userRole}
                </span>
              </div>
              <span className="text-[9px] font-mono text-slate-400">{c.timestamp}</span>
            </div>

            <p className="text-slate-300 leading-snug">{c.text}</p>

            <div className="flex items-center justify-between pt-1 border-t border-white/10">
              <span className={`text-[9px] font-bold uppercase flex items-center space-x-1 ${
                c.status === 'Approved' ? 'text-emerald-400' : c.status === 'Rejected' ? 'text-rose-400' : 'text-amber-400'
              }`}>
                {c.status === 'Approved' && <CheckCircle className="w-3 h-3" />}
                {c.status === 'Rejected' && <XCircle className="w-3 h-3" />}
                {c.status === 'Pending' && <Clock className="w-3 h-3" />}
                <span>{c.status}</span>
              </span>

              {(currentRole === 'Architect' || currentRole === 'Admin') && c.status === 'Pending' && (
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => onUpdateCommentStatus(c.id, 'Approved')}
                    className="px-2 py-0.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-[9px] font-bold uppercase"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => onUpdateCommentStatus(c.id, 'Rejected')}
                    className="px-2 py-0.5 rounded bg-rose-600 hover:bg-rose-500 text-white text-[9px] font-bold uppercase"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
