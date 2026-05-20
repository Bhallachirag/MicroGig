import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AlertCircle } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';

export default function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    dob: '',
    role: 'freelancer'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signup, googleLogin } = useAuth();
  const navigate = useNavigate();

  const handleGoogleAuth = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      setError('');
      const result = await googleLogin(tokenResponse.access_token, formData.role);
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.error || 'Google registration failed.');
        setLoading(false);
      }
    },
    onError: () => {
      setError('Google registration failed.');
    }
  });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const result = await signup(formData.name, formData.email, formData.password, formData.role, formData.dob);
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.error || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setError('An error occurred during sign up. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex selection:bg-daInfo-blue selection:text-white">
      
      {/* Left side - Dark Panel */}
      <div className="hidden lg:flex w-[40%] bg-[#0a0a0a] flex-col justify-between p-16 relative overflow-hidden border-r border-[#1a1a1a]">
        
        {/* Background typographic watermark */}
        <div className="absolute top-1/4 -right-20 opacity-[0.02] text-white pointer-events-none">
          <h1 className="text-[24rem] font-black leading-none tracking-tighter mix-blend-overlay">M.</h1>
        </div>

        <div className="relative z-10 flex h-full items-center">
          
          <div className="max-w-md">
            <div className="w-12 h-1 bg-daInfo-blue mb-4" />
            <h2 className="text-4xl font-medium leading-tight text-white mb-6 tracking-tight">Join the network building the future of work.</h2>
            <p className="text-gray-400 text-lg leading-relaxed">Whether you are executing specialized tasks or hiring top-tier talent, our platform strips away the noise and focuses entirely on delivery.</p>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 da-grid-bg flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-xl bg-white shadow-[8px_8px_0px_0px_rgba(10,10,10,1)] border border-gray-200 p-8 sm:p-14">
          
          <div className="mb-10 border-b border-gray-100 pb-8">
            <h2 className="text-3xl font-bold text-daInfo-dark tracking-tight mb-3">CREATE AN ACCOUNT</h2>
            <p className="text-gray-500 text-sm">Set up your profile to start exploring opportunities.</p>
          </div>

          {error && (
            <div className="mb-8 bg-red-50 border-l-4 border-red-500 p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700 font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Account Type Selection */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">I want to...</label>
              <div className="grid grid-cols-2 gap-4">
                <label className={`cursor-pointer border-2 transition-all p-5 flex flex-col items-center justify-center group ${formData.role === 'freelancer' ? 'border-[#0a0a0a] bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`}>
                  <input type="radio" name="role" value="freelancer" checked={formData.role === 'freelancer'} onChange={handleChange} className="sr-only" />
                  <div className={`w-4 h-4 rounded-full border-2 mb-3 flex items-center justify-center ${formData.role === 'freelancer' ? 'border-[#0a0a0a]' : 'border-gray-300 group-hover:border-gray-400'}`}>
                    {formData.role === 'freelancer' && <div className="w-2 h-2 rounded-full bg-[#0a0a0a]" />}
                  </div>
                  <div className={`font-bold uppercase tracking-widest text-xs ${formData.role === 'freelancer' ? 'text-daInfo-dark' : 'text-gray-500'}`}>Execute Tasks</div>
                </label>

                <label className={`cursor-pointer border-2 transition-all p-5 flex flex-col items-center justify-center group ${formData.role === 'client' ? 'border-[#0a0a0a] bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`}>
                  <input type="radio" name="role" value="client" checked={formData.role === 'client'} onChange={handleChange} className="sr-only" />
                  <div className={`w-4 h-4 rounded-full border-2 mb-3 flex items-center justify-center ${formData.role === 'client' ? 'border-[#0a0a0a]' : 'border-gray-300 group-hover:border-gray-400'}`}>
                    {formData.role === 'client' && <div className="w-2 h-2 rounded-full bg-[#0a0a0a]" />}
                  </div>
                  <div className={`font-bold uppercase tracking-widest text-xs ${formData.role === 'client' ? 'text-daInfo-dark' : 'text-gray-500'}`}>Hire Talent</div>
                </label>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-8">
              <div className="relative">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Full Name</label>
                <input type="text" name="name" required value={formData.name} onChange={handleChange}
                  className="w-full px-0 py-3 border-b-2 border-gray-200 focus:border-daInfo-dark outline-none bg-transparent text-daInfo-dark font-medium transition-colors placeholder-gray-300"
                  placeholder="John Doe"
                />
              </div>

              <div className="relative">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Work Email</label>
                <input type="email" name="email" required value={formData.email} onChange={handleChange}
                  className="w-full px-0 py-3 border-b-2 border-gray-200 focus:border-daInfo-dark outline-none bg-transparent text-daInfo-dark font-medium transition-colors placeholder-gray-300"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-8">
              <div className="relative">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Password</label>
                <input type="password" name="password" required minLength={6} value={formData.password} onChange={handleChange}
                  className="w-full px-0 py-3 border-b-2 border-gray-200 focus:border-daInfo-dark outline-none bg-transparent text-daInfo-dark font-medium transition-colors placeholder-gray-300"
                  placeholder="••••••••"
                />
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-2 flex items-center gap-2">
                   <span className="w-1 h-1 bg-gray-400 rounded-full"/> MIN 6 CHARS
                </p>
              </div>

              <div className="relative">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Date of Birth</label>
                <input type="date" name="dob" required value={formData.dob} onChange={handleChange}
                  className="w-full px-0 py-3 border-b-2 border-gray-200 focus:border-daInfo-dark outline-none bg-transparent text-gray-600 font-medium transition-colors"
                />
              </div>
            </div>

            <div className="pt-4">
               <button type="submit" disabled={loading} className="w-full relative inline-flex items-center justify-center gap-3 px-6 py-5 text-sm font-bold text-white uppercase tracking-widest transition-all duration-200 bg-[#0a0a0a] hover:bg-black group">
                 {loading ? 'INITIALIZING...' : 'CREATE ACCOUNT'}
                 <span className="w-2 h-2 bg-[#22c55e] absolute right-6 group-hover:bg-white transition-colors" />
               </button>

               <div className="relative flex items-center py-6">
                 <div className="flex-grow border-t border-gray-200"></div>
                 <span className="flex-shrink-0 mx-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Or</span>
                 <div className="flex-grow border-t border-gray-200"></div>
               </div>

               <button
                 type="button"
                 onClick={() => handleGoogleAuth()}
                 className="w-full relative inline-flex items-center justify-center gap-3 px-6 py-5 text-sm font-bold text-daInfo-dark uppercase tracking-widest transition-all duration-200 border-2 border-gray-200 hover:border-black bg-white group"
               >
                 <svg className="w-5 h-5" viewBox="0 0 24 24">
                   <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                   <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                   <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                   <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                 </svg>
                 CONTINUE WITH GOOGLE
               </button>
            </div>
          </form>

          <div className="mt-10 pt-8 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-500">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-daInfo-dark hover:text-daInfo-blue transition-colors uppercase tracking-widest text-xs ml-2">
                Log In
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
