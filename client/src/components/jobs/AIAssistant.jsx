import { useState } from 'react';
import { Bot, Send, Terminal, Zap, Trash } from 'lucide-react';

export default function AIAssistant({ onDraftGenerated }) {
  const [draftInput, setDraftInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!draftInput.trim()) return;
    
    setIsGenerating(true);
    setError('');
    try {
      const token = localStorage.getItem('microgig_token');
      const res = await fetch('/api/jobs/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ notes: draftInput })
      });

      let data;
      try {
        const textData = await res.text();
        data = JSON.parse(textData);
      } catch (parseErr) {
        throw new Error('AI returned an invalid data format.');
      }

      if (res.ok) {
        if (!data || typeof data !== 'object' || (!data.title && !data.description)) {
           throw new Error('Incomplete data received from AI.');
        }
        onDraftGenerated(data);
        setDraftInput('');
      } else {
        setError(data.message || 'AI sequence interrupted.');
      }
    } catch (err) {
      console.error('AI Generation Error:', err);
      setError(err.message === 'Failed to fetch' ? 'Neural link failure. Check connection.' : `[SYSTEM_ERROR]: ${err.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-black border-4 border-black da-shadow-black overflow-hidden mb-12">
      <div className="bg-gray-800 px-4 py-2 border-b-2 border-black flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-green-400" />
          <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Deployment_Assistant_v2.5</span>
        </div>
        <div className="flex gap-1.5">
          <div className="w-2 h-2 rounded-full bg-red-500" />
          <div className="w-2 h-2 rounded-full bg-yellow-500" />
          <div className="w-2 h-2 rounded-full bg-green-500" />
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-start gap-4 mb-4">
          <div className="bg-green-500 p-2 border-2 border-black shrink-0">
             <Bot className="w-4 h-4 text-black" />
          </div>
          <div className="flex-1">
            <p className="font-mono text-xs text-green-400 mb-1 leading-relaxed">
              [SYSTEM]: Feed me raw project thoughts. I will optimize the deployment parameters.
            </p>
            <p className="font-mono text-[10px] text-gray-500 uppercase">Input requirements, deliverables, or constraints below.</p>
          </div>
        </div>

        <div className="relative">
          <textarea
            value={draftInput}
            onChange={(e) => setDraftInput(e.target.value)}
            disabled={isGenerating}
            placeholder="e.g. need a simple landing page for my cookie shop, high contrast, by next week..."
            className="w-full bg-gray-900 border-2 border-gray-700 p-4 font-mono text-sm text-green-400 focus:border-green-500 focus:outline-none placeholder:text-gray-700 resize-none min-h-[120px] transition-all"
          />
          
          <div className="absolute bottom-4 right-4 flex gap-2">
            {draftInput && (
              <button 
                onClick={() => setDraftInput('')}
                className="p-2 border-2 border-gray-700 text-gray-500 hover:text-white hover:border-white transition-all"
              >
                <Trash className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !draftInput.trim()}
              className={`flex items-center gap-2 px-6 py-2 border-2 text-xs font-black uppercase tracking-widest transition-all ${
                isGenerating 
                ? 'bg-gray-800 border-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-green-500 border-black text-black hover:translate-x-1 hover:-translate-y-1 active:translate-x-0 active:translate-y-0'
              }`}
            >
              {isGenerating ? <Zap className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              {isGenerating ? 'PROCESSING...' : 'INITIALIZE'}
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-4 font-mono text-[10px] text-red-500 uppercase flex items-center gap-2 animate-pulse">
            <Zap className="w-3 h-3" /> [ERROR]: {error}
          </div>
        )}
      </div>
    </div>
  );
}
