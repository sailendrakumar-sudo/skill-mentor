import React from 'react';
import { Link } from 'react-router-dom';
import { 
  GraduationCap, 
  Sparkles, 
  Users, 
  ShieldCheck, 
  ArrowRightLeft, 
  BookOpen, 
  Award,
  HelpCircle,
  Lightbulb
} from 'lucide-react';

export const About = () => {
  const faqs = [
    {
      q: 'How does reciprocal skill exchange work?',
      a: 'In Skill Mentor, every student has dual roles: you teach what you know (e.g. Python, Video Editing) and learn what you need (e.g. UI/UX Design, Public Speaking). Sessions are free peer exchanges where knowledge is traded collaboratively.'
    },
    {
      q: 'How does Gemini AI generate recommendations?',
      a: 'Our backend uses Google Gemini to analyze your target learning goals against potential peers teaching abilities. It looks for reciprocal synergies—where student A wants to learn what student B teaches, and vice versa—and assigns compatibility scores with clear explanations.'
    },
    {
      q: 'Can I choose between online video calls and in-person study?',
      a: 'Yes! Students can declare their preferred format (Online Video Call, In-Person Study, Hybrid, or Collaborative Project) and filter search results accordingly.'
    },
    {
      q: 'How are peer ratings and reputation scores updated?',
      a: 'After a learning session is concluded, participants submit a 1 to 5 star review with qualitative feedback. The peer profile average rating and completed sessions counter update immediately.'
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Page Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-xs font-semibold text-indigo-300">
          <GraduationCap className="w-4 h-4 text-indigo-400" />
          <span>About Skill Mentor</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white">
          Empowering Students to <span className="gradient-text">Exchange Mastery</span>
        </h1>
        <p className="text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Skill Mentor was engineered on a simple observation: the best person to teach a student is another student who just mastered the concept last semester.
        </p>
      </div>

      {/* Core Mission Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-3">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
            <ArrowRightLeft className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">Dual-Role Exchange</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Eliminate traditional tutor-student hierarchies. By stepping into both mentor and learner shoes, students develop empathy, leadership, and teaching prowess.
          </p>
        </div>

        <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-3">
          <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">Gemini Intelligence</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            AI-driven compatibility scoring identifies complementary gaps and suggests optimal pairings that maximize learning velocity.
          </p>
        </div>

        <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">Verified Peer Standing</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Transparent post-session ratings build a credible academic portfolio. Showcase your teaching dedication on your public profile.
          </p>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="space-y-6">
        <div className="text-center max-w-xl mx-auto">
          <h2 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
            <HelpCircle className="w-6 h-6 text-indigo-400" />
            <span>Frequently Asked Questions</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">Everything you need to know about peer mentoring</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="glass-card rounded-2xl p-5 border border-white/10 space-y-2">
              <h4 className="text-sm font-bold text-white">{faq.q}</h4>
              <p className="text-xs text-slate-300 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="p-8 rounded-2xl bg-slate-900/80 border border-slate-800 text-center space-y-4">
        <h3 className="text-xl font-bold text-white">Ready to join the peer exchange?</h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Get started in seconds, explore active student profiles, and request your first exchange.
        </p>
        <Link
          to="/discover"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 transition-all"
        >
          <span>Explore Students</span>
        </Link>
      </div>

    </div>
  );
};

export default About;
