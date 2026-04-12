import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Hero } from '../components/landing/Hero';
import { HowItWorks } from '../components/landing/HowItWorks';
import { LivePreview } from '../components/landing/LivePreview';
import { FeatureGrid } from '../components/landing/FeatureGrid';
import { LeaderboardPreview } from '../components/landing/LeaderboardPreview';
import { AuthSection } from '../components/landing/AuthSection';
import { Footer } from '../components/landing/Footer';
import { LandingNav } from '../components/landing/LandingNav';
import { useAuthStore } from '../stores/authStore';

export const Landing: React.FC = () => {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  // If already logged in, redirect to app
  useEffect(() => {
    if (isAuthenticated) {
      const returnTo = sessionStorage.getItem('returnTo') || '/app/feed';
      sessionStorage.removeItem('returnTo');
      navigate(returnTo, { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Scroll to #join hash on mount (from auth redirects)
  useEffect(() => {
    if (window.location.hash === '#join') {
      setTimeout(() => {
        document.getElementById('join')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, []);

  return (
    <div className="bg-navy-900">
      <LandingNav />
      <Hero />
      <div id="how-it-works">
        <HowItWorks />
      </div>
      <div id="live-preview">
        <LivePreview />
      </div>
      <FeatureGrid />
      <div id="leaderboard-preview">
        <LeaderboardPreview />
      </div>
      <AuthSection />
      <Footer />
    </div>
  );
};
