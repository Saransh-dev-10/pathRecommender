import React, { Suspense } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Target, BookOpen } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Hero3DMesh from '../components/3d/Hero3DMesh';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-surface-900 text-surface-100 flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-24 pb-32 overflow-hidden min-h-[90vh] flex items-center">
        {/* 3D Background */}
        <Suspense fallback={null}>
          <Hero3DMesh />
        </Suspense>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          {/* Badge */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-xs font-semibold tracking-wide mb-8"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI-Powered Learning Path Recommender</span>
          </motion.div>

          {/* Heading */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="heading-serif text-5xl sm:text-7xl lg:text-8xl text-surface-100 max-w-4xl mx-auto"
          >
            Your skills.{' '}
            <span className="text-accent">Your goal.</span>
            <br />
            Your path.
          </motion.h1>

          {/* Subheading */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-8 text-lg sm:text-xl text-surface-400 max-w-2xl mx-auto font-light leading-relaxed"
          >
            Tell us what you know and what you want to learn.
            <br />
            We'll figure out the best path from here.
          </motion.p>

          {/* CTAs */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/register" className="btn-accent text-base py-3.5 px-8 flex items-center gap-2 group">
              <span>Build My Path</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/login" className="btn-ghost text-base py-3.5 px-8">
              Sign In
            </Link>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 border-t border-white/[0.04]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-20">
            <div className="label-muted text-accent mb-4">How it works</div>
            <h2 className="heading-serif text-3xl sm:text-5xl text-surface-100">
              From what you know
              <br />
              to what you need to learn.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-12 md:gap-8">
            
            <div className="text-center md:text-left">
              <div className="text-5xl font-serif text-accent/30 mb-4">01</div>
              <h3 className="text-xl font-semibold text-surface-100 mb-3">Tell us your skills</h3>
              <p className="text-surface-400 text-sm leading-relaxed">
                Add the technologies and topics you already know, with your proficiency level. Upload a resume for automatic extraction.
              </p>
            </div>

            <div className="text-center md:text-left">
              <div className="text-5xl font-serif text-accent/30 mb-4">02</div>
              <h3 className="text-xl font-semibold text-surface-100 mb-3">Choose your goal</h3>
              <p className="text-surface-400 text-sm leading-relaxed">
                Pick what you want to learn — Full Stack Development, Machine Learning, Data Structures, or anything else.
              </p>
            </div>

            <div className="text-center md:text-left">
              <div className="text-5xl font-serif text-accent/30 mb-4">03</div>
              <h3 className="text-xl font-semibold text-surface-100 mb-3">Follow your path</h3>
              <p className="text-surface-400 text-sm leading-relaxed">
                AI builds a personalized, dependency-aware learning sequence. Take assessments and watch your path adapt in real time.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* Feature Cards */}
      <section className="py-24 border-t border-white/[0.04]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6">
            
            <div className="surface-card p-8 surface-card-hover">
              <Target className="w-6 h-6 text-accent mb-5" />
              <h3 className="text-lg font-semibold text-surface-100 mb-2">Skill Gap Analysis</h3>
              <p className="text-surface-400 text-sm leading-relaxed">
                AI compares what you know against what your learning goal requires. No guessing — just clarity.
              </p>
            </div>

            <div className="surface-card p-8 surface-card-hover">
              <BookOpen className="w-6 h-6 text-accent mb-5" />
              <h3 className="text-lg font-semibold text-surface-100 mb-2">Adaptive Learning</h3>
              <p className="text-surface-400 text-sm leading-relaxed">
                Score low on a quiz? Your path adds focused remediation. Score high? Skip what you already know.
              </p>
            </div>

            <div className="surface-card p-8 surface-card-hover">
              <Sparkles className="w-6 h-6 text-accent mb-5" />
              <h3 className="text-lg font-semibold text-surface-100 mb-2">AI Explanations</h3>
              <p className="text-surface-400 text-sm leading-relaxed">
                Every recommended topic explains <em>why</em> it's in your path and what prerequisites led to it.
              </p>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
