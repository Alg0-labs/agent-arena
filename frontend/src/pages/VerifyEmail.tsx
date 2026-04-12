import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { authApi } from '../lib/api';
import { Button } from '../components/ui/Button';

type State = 'loading' | 'success' | 'error';

export const VerifyEmail: React.FC = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [state, setState] = useState<State>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = params.get('token');
    if (!token) {
      setState('error');
      setMessage('No verification token found in the link.');
      return;
    }

    authApi.verifyEmail(token)
      .then((res) => {
        setState('success');
        setMessage(res.message);
      })
      .catch((e) => {
        setState('error');
        setMessage(e.detail ?? 'Verification failed. The link may have expired.');
      });
  }, []);

  return (
    <div className="min-h-screen bg-navy-900 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full rounded-2xl border border-blue-500/15 bg-navy-800/80 backdrop-blur-xl p-10 text-center"
      >
        {state === 'loading' && (
          <>
            <Loader2 size={40} className="text-blue-400 animate-spin mx-auto mb-6" />
            <h2 className="text-xl font-bold text-white">Verifying your email…</h2>
          </>
        )}

        {state === 'success' && (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle2 size={32} className="text-emerald-400" />
            </motion.div>
            <h2 className="text-2xl font-black text-white mb-3">Email verified!</h2>
            <p className="text-slate-400 mb-8">{message}</p>
            <Button variant="primary" size="lg" className="w-full" onClick={() => navigate('/app/feed')}>
              Enter the Arena →
            </Button>
          </>
        )}

        {state === 'error' && (
          <>
            <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6">
              <XCircle size={32} className="text-red-400" />
            </div>
            <h2 className="text-2xl font-black text-white mb-3">Verification failed</h2>
            <p className="text-slate-400 mb-8">{message}</p>
            <Button variant="ghost" size="lg" className="w-full" onClick={() => navigate('/')}>
              Back to Home
            </Button>
          </>
        )}
      </motion.div>
    </div>
  );
};
