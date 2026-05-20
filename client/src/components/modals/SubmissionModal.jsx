import { useState } from 'react';

export default function SubmissionModal({ shown, jobId, content, setSubmissionModal, actionLoading, handleSubmitWork }) {
  if (!shown) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-2 sm:p-4">
      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-md" onClick={() => setSubmissionModal({ shown: false, jobId: null, content: '' })} />
      <div className="relative bg-white w-full max-w-lg border-2 border-black da-shadow-black p-6 sm:p-8 animate-scale-in">
         <h3 className="text-2xl font-black text-daInfo-dark uppercase tracking-tight mb-2">Final Submission</h3>
         <p className="text-gray-500 text-sm mb-6 font-bold">Paste your links or final summary below for client review.</p>
         <textarea 
           rows="5" 
           value={content}
           onChange={(e) => setSubmissionModal(prev => ({ ...prev, content: e.target.value }))}
           placeholder="e.g. Here is the link to the GitHub Repo: https://github.com..."
           className="w-full p-4 border-2 border-gray-200 focus:border-daInfo-dark outline-none text-daInfo-dark font-medium mb-6 resize-none"
         />
         <div className="flex gap-4">
           <button 
             onClick={handleSubmitWork}
             disabled={actionLoading}
             className="flex-1 py-4 bg-daInfo-dark text-white font-black uppercase tracking-widest hover:bg-black transition-colors"
           >
             {actionLoading ? 'SUBMITTING...' : 'DEPLOY SUBMISSION'}
           </button>
           <button onClick={() => setSubmissionModal({ shown: false, jobId: null, content: '' })} className="px-6 py-4 border-2 border-gray-200 font-bold uppercase tracking-widest">CANCEL</button>
         </div>
      </div>
    </div>
  );
}
