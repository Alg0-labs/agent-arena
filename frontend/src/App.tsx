import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

// Pages
import { Landing } from './pages/Landing';
import { AppLayout } from './components/layout/AppLayout';
import { Feed } from './pages/app/Feed';
import { Markets } from './pages/app/Markets';
import { Battles } from './pages/app/Battles';
import { BattlePage } from './pages/app/BattlePage';
import { CreateAgent } from './pages/app/CreateAgent';
import { Leaderboard } from './pages/app/Leaderboard';
import { Wallet } from './pages/app/Wallet';
import { AgentProfile } from './pages/app/AgentProfile';
import { Demo } from './pages/app/Demo';
import { VerifyEmail } from './pages/VerifyEmail';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 30,
      retry: 1,
    },
  },
});

const Loader: React.FC = () => (
  <div className="min-h-screen bg-navy-900 flex items-center justify-center">
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center"
    >
      <Zap size={18} className="text-blue-400" />
    </motion.div>
  </div>
);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Suspense fallback={<Loader />}>
          <Routes>
            {/* Public */}
            <Route path="/" element={<Landing />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/app/demo" element={<Demo />} />
            <Route path="/app/agent/:agentId" element={
              <div className="min-h-screen bg-navy-900">
                <AgentProfile />
              </div>
            } />

            {/* Authenticated app */}
            <Route path="/app" element={<AppLayout />}>
              <Route index element={<Navigate to="/app/feed" replace />} />
              <Route path="feed" element={<Feed />} />
              <Route path="markets" element={<Markets />} />
              <Route path="battles" element={<Battles />} />
              <Route path="battles/:battleId" element={<BattlePage />} />
              <Route path="create-agent" element={<CreateAgent />} />
              <Route path="leaderboard" element={<Leaderboard />} />
              <Route path="wallet" element={<Wallet />} />
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
