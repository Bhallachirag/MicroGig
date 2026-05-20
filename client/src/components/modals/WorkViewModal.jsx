import { Bot, Zap } from 'lucide-react';

export default function WorkViewModal({ workViewModal, setWorkViewModal }) {
  if (!workViewModal.shown) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-md" onClick={() => setWorkViewModal({ shown: false, submission: null, title: '' })} />
      <div className="relative bg-white w-full max-w-2xl border-2 border-black da-shadow-black p-10 animate-scale-in text-left">
         <h3 className="text-3xl font-black text-daInfo-dark uppercase tracking-tighter mb-1">{workViewModal.title}</h3>
         <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6 border-b border-gray-100 pb-4">Submission Inspection</p>
         
         {workViewModal.submission?.aiVerificationScore !== null && workViewModal.submission?.aiVerificationScore !== undefined && (
            <div className="border-4 border-black p-6 mb-8 bg-black text-white relative overflow-hidden group">
               <div className="absolute -right-4 -top-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
                 <Bot className="w-32 h-32 text-green-500" />
               </div>
               <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6">
                  <div className="flex flex-col items-center justify-center p-4 border-4 border-green-500 bg-black min-w-[120px]">
                     <span className="text-[10px] font-black uppercase text-green-500 tracking-widest mb-1">AI_MATCH</span>
                     <span className="text-4xl font-black text-white">{workViewModal.submission.aiVerificationScore}%</span>
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                     <h4 className="text-xs font-black uppercase tracking-[0.2em] text-green-400 flex items-center justify-center sm:justify-start gap-2 mb-2">
                        <Zap className="w-4 h-4" /> ESCROW_VERIFICATION
                     </h4>
                     <p className="text-sm font-medium text-gray-300 leading-relaxed">
                        {workViewModal.submission.aiVerificationNotes}
                     </p>
                  </div>
               </div>
            </div>
         )}

         <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-2">RAW_SUBMISSION:</h4>
         <div className="bg-gray-50 border-2 border-dashed border-gray-200 p-6 text-sm text-gray-700 leading-relaxed font-medium whitespace-pre-wrap max-h-[50vh] overflow-y-auto mb-8">
            {workViewModal.submission?.content}
         </div>

         <button 
           onClick={() => setWorkViewModal({ shown: false, submission: null, title: '' })}
           className="w-full py-4 border-2 border-black font-black uppercase tracking-widest hover:bg-gray-50 transition-colors"
          >
           DONE REVIEWING
         </button>
      </div>
    </div>
  );
}
