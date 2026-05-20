import { Star } from 'lucide-react';

export default function ReviewModal({ reviewModal, setReviewModal, actionLoading, handlePostReview }) {
  if (!reviewModal.shown) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-md" onClick={() => setReviewModal({ shown: false, jobId: null, revieweeId: null, rating: 5, comment: '', title: '' })} />
      <div className="relative bg-white w-full max-w-lg border-2 border-black da-shadow-lg-pink p-8 animate-bounce-slow">
         <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-daInfo-pink rounded-full flex items-center justify-center text-white border-2 border-black animate-spin-slow">
              <Star className="w-8 h-8 fill-white" />
            </div>
         </div>
         <h3 className="text-2xl font-black text-center text-daInfo-dark uppercase tracking-tight mb-2">{reviewModal.title || 'Service Excellence'}</h3>
         <p className="text-gray-500 text-sm text-center mb-8 font-bold">Rate your experience.</p>
         
         <div className="flex justify-center gap-2 mb-8">
           {[1,2,3,4,5].map(s => (
             <button key={s} onClick={() => setReviewModal(prev => ({ ...prev, rating: s }))} className="transition-transform hover:scale-125 focus:scale-125 outline-none">
                <Star className={`w-8 h-8 ${s <= reviewModal.rating ? 'fill-daInfo-pink text-daInfo-pink' : 'text-gray-200'}`} />
             </button>
           ))}
         </div>

         <textarea 
           rows="3" 
           value={reviewModal.comment}
           onChange={(e) => setReviewModal(prev => ({ ...prev, comment: e.target.value }))}
           placeholder="Write a public review..."
           className="w-full p-4 border-2 border-gray-200 focus:border-daInfo-pink outline-none text-daInfo-dark font-medium mb-6 resize-none"
         />

         <button 
           onClick={handlePostReview}
           disabled={actionLoading}
           className="w-full py-4 bg-daInfo-pink text-white font-black uppercase tracking-widest hover:bg-pink-600 transition-colors da-shadow-pink"
         >
           {actionLoading ? 'PUBLISHING...' : 'POST OFFICIAL REVIEW'}
         </button>
      </div>
    </div>
  );
}
