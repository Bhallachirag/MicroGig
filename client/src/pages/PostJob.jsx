import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Briefcase, AlertCircle, Clock, Zap, Terminal, Target, ArrowRight } from 'lucide-react';
import AIAssistant from '../components/jobs/AIAssistant';

const categories = [
  'Technology & IT', 'Creative & Design', 'Writing & Translation',
  'Marketing & Sales', 'Business & Operations', 'Lifestyle & Health',
  'Photography & Media', 'Events & Hospitality', 'Other Services'
];

export default function PostJob() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: categories[0],
    skills: '',
    budgetMin: '',
    budgetMax: '',
    duration: '',
    isUrgent: false,
    isInstantHire: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const onDraftGenerated = (data) => {
    setFormData({
      title: data.title || '',
      description: data.description || '',
      category: data.category || categories[0],
      skills: data.skills ? data.skills.join(', ') : '',
      budgetMin: data.budgetMin || '',
      budgetMax: data.budgetMax || '',
      duration: data.duration || '',
      isUrgent: false,
      isInstantHire: false
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('microgig_token');
      if (!token) throw new Error('AUTH_REQUIRED: SESSION_INVALID');

      const payload = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
        budget: {
          min: Number(formData.budgetMin),
          max: Number(formData.budgetMax)
        },
        duration: formData.duration,
        isUrgent: formData.isUrgent,
        isInstantHire: formData.isInstantHire
      };

      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'DEPLOYMENT_FAILED');
      }

      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white da-grid-bg pt-32 pb-32">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-12">
          <Link to="/dashboard" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 hover:text-black transition-colors mb-6 group">
             <div className="w-4 h-4 border border-gray-300 flex items-center justify-center group-hover:border-black">←</div>
             RETURN_TO_COMMAND_CENTER
          </Link>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-6xl font-black text-black tracking-tighter leading-[0.85] mb-4">
                DEPLOY <br/> NEW_GIG
              </h1>
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5 px-2 py-0.5 bg-black text-white text-[10px] font-black uppercase tracking-widest">
                  <Terminal className="w-3 h-3" /> System_Active
                </span>
                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                  Ready for project architecture.
                </span>
              </div>
            </div>
            <div className="hidden md:block w-24 h-24 border-4 border-black da-shadow-black flex items-center justify-center bg-yellow-400">
               <Zap className="w-10 h-10 text-black" />
            </div>
          </div>
        </div>

        {/* AI Assistant Hook */}
        <AIAssistant onDraftGenerated={onDraftGenerated} />

        {/* Main Deployment Form */}
        <form onSubmit={handleSubmit} className="bg-white border-4 border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] p-8 sm:p-12 space-y-12">
          
          {error && (
            <div className="bg-red-50 border-4 border-red-500 p-6 flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
              <div>
                <h4 className="font-black text-red-700 text-xs uppercase tracking-widest mb-1">Critical_Error: [SYSTEM_FAILURE]</h4>
                <p className="text-sm text-red-700 font-bold">{error}</p>
              </div>
            </div>
          )}

          {/* Core Parameters */}
          <section className="space-y-8">
            <div className="flex items-center gap-4 mb-4">
               <div className="h-0.5 bg-black flex-1" />
               <h3 className="text-xs font-black uppercase tracking-[0.3em] text-black">CORE_PARAMETERS</h3>
               <div className="h-0.5 bg-black flex-1" />
            </div>
            
            <div className="space-y-3">
              <label className="block text-xs font-black text-black uppercase tracking-widest">
                [01] PROJECT_TITLE
              </label>
              <input 
                type="text" 
                name="title" 
                required 
                value={formData.title} 
                onChange={handleChange} 
                placeholder="ENTER HIGH-SIGNAL IDENTIFIER" 
                className="w-full p-6 border-4 border-black bg-gray-50 focus:bg-white focus:da-shadow-black transition-all outline-none font-black text-xl text-black placeholder:text-gray-300" 
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="block text-xs font-black text-black uppercase tracking-widest">[02] DISCIPLINE</label>
                <select name="category" required value={formData.category} onChange={handleChange} className="w-full p-5 border-4 border-black bg-gray-50 focus:bg-white outline-none font-black text-xs uppercase tracking-widest text-black cursor-pointer appearance-none">
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="space-y-3">
                <label className="block text-xs font-black text-black uppercase tracking-widest">[03] REQ_SKILL_ARRAY</label>
                <input type="text" name="skills" required value={formData.skills} onChange={handleChange} placeholder="COMMA, SEPARATED, VALUES" className="w-full p-5 border-4 border-black bg-gray-50 focus:bg-white outline-none font-bold text-sm text-black" />
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-black text-black uppercase tracking-widest">[04] DETAILED_SCOPE</label>
              <textarea name="description" required value={formData.description} onChange={handleChange} rows="6" placeholder="LOG PROJECT REQUIREMENTS AND DELIVERABLES..." className="w-full p-5 border-4 border-black bg-gray-50 focus:bg-white outline-none font-bold text-sm text-black resize-none" />
            </div>
          </section>

          {/* Logistics */}
          <section className="space-y-8">
            <div className="flex items-center gap-4 mb-4">
               <div className="h-0.5 bg-black flex-1" />
               <h3 className="text-xs font-black uppercase tracking-[0.3em] text-black">LOGISTICS_&_FUNDS</h3>
               <div className="h-0.5 bg-black flex-1" />
            </div>
            
            <div className="grid sm:grid-cols-3 gap-8">
              <div className="space-y-3">
                <label className="block text-xs font-black text-black uppercase tracking-widest">[05] MIN_ALLOCATION ($)</label>
                <input type="number" name="budgetMin" required min="1" value={formData.budgetMin} onChange={handleChange} placeholder="000" className="w-full p-5 border-4 border-black bg-gray-50 focus:bg-white outline-none font-black text-xl text-black" />
              </div>
              <div className="space-y-3">
                <label className="block text-xs font-black text-black uppercase tracking-widest">[06] MAX_ALLOCATION ($)</label>
                <input type="number" name="budgetMax" required min="1" value={formData.budgetMax} onChange={handleChange} placeholder="000" className="w-full p-5 border-4 border-black bg-gray-50 focus:bg-white outline-none font-black text-xl text-black" />
              </div>
              <div className="space-y-3">
                <label className="block text-xs font-black text-black uppercase tracking-widest">[07] TARGET_TIMELINE</label>
                <input type="text" name="duration" required value={formData.duration} onChange={handleChange} placeholder="e.g. 48 HOURS" className="w-full p-5 border-4 border-black bg-gray-50 focus:bg-white outline-none font-bold text-sm text-black" />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6 mt-4">
              <label className={`cursor-pointer flex items-center gap-6 p-6 border-4 transition-all ${formData.isUrgent ? 'border-red-600 bg-red-50 shadow-[4px_4px_0px_0px_rgba(220,38,38,1)]' : 'border-black hover:bg-gray-50'}`}>
                <input type="checkbox" name="isUrgent" checked={formData.isUrgent} onChange={handleChange} className="sr-only" />
                <div className={`w-8 h-8 border-4 border-black flex items-center justify-center transition-colors ${formData.isUrgent ? 'bg-red-600' : 'bg-white'}`}>
                  {formData.isUrgent && <Zap className="w-4 h-4 text-white" />}
                </div>
                <div>
                  <span className={`text-xs font-black uppercase tracking-widest ${formData.isUrgent ? 'text-red-700' : 'text-black'}`}>PRIORITY_OVERRIDE</span>
                  <p className="text-[10px] text-gray-500 font-bold uppercase mt-1">Status: Urgent Delivery</p>
                </div>
              </label>

              <label className={`cursor-pointer flex items-center gap-6 p-6 border-4 transition-all ${formData.isInstantHire ? 'border-blue-600 bg-blue-50 shadow-[4px_4px_0px_0px_rgba(37,99,235,1)]' : 'border-black hover:bg-gray-50'}`}>
                <input type="checkbox" name="isInstantHire" checked={formData.isInstantHire} onChange={handleChange} className="sr-only" />
                <div className={`w-8 h-8 border-4 border-black flex items-center justify-center transition-colors ${formData.isInstantHire ? 'bg-blue-600' : 'bg-white'}`}>
                  {formData.isInstantHire && <Target className="w-4 h-4 text-white" />}
                </div>
                <div>
                  <span className={`text-xs font-black uppercase tracking-widest ${formData.isInstantHire ? 'text-blue-700' : 'text-black'}`}>INSTANT_LOCK</span>
                  <p className="text-[10px] text-gray-500 font-bold uppercase mt-1">Status: Auto-Accept Enabled</p>
                </div>
              </label>
            </div>
          </section>

          <div className="pt-8">
            <button type="submit" disabled={loading} className="w-full p-8 bg-black text-white font-black text-xl uppercase tracking-[0.2em] transform active:scale-[0.98] transition-all flex items-center justify-center gap-4 hover:bg-daInfo-dark da-shadow-black hover:da-shadow-none translate-x-1 translate-y-1">
               <Zap className={`w-6 h-6 ${loading ? 'animate-spin' : ''}`} />
               {loading ? 'INITIALIZING_DEPLOYMENT...' : 'DEPLOY_GIG'}
               <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
