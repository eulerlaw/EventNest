import React from 'react';
import { Calendar, Heart, Shield, Award } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white">
                <Calendar className="w-4 h-4" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">EventNest</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-md">
              A Next-Generation College Event Management, Personalized Recommendation & AI Sentiment Analysis Platform engineered for campus excellence.
            </p>
            <div className="flex items-center space-x-2 pt-2 text-xs text-brand-400">
              <Award className="w-4 h-4" />
              <span>B.Tech Information Technology Minor Project (2023–2027)</span>
            </div>
          </div>

          {/* Academic Info */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Institution
            </h4>
            <ul className="text-sm space-y-1.5 text-slate-400">
              <li className="font-semibold text-slate-300">Guru Tegh Bahadur Institute of Technology</li>
              <li>Affiliated to GGSIPU, New Delhi</li>
              <li>Dept. of Information Technology</li>
              <li className="pt-1 text-slate-400 text-xs">
                Project Guide: <span className="text-slate-200 font-medium">Ms. Shipra Raheja</span>
              </li>
            </ul>
          </div>

          {/* Project Team */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Development Team
            </h4>
            <ul className="text-xs space-y-1.5 text-slate-300">
              <li>• Anshuman Chaturvedi (03276803123)</li>
              <li>• Divya Prakash Yadav (04376803123)</li>
              <li>• Sahil Raj (03576803123)</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} EventNest. Built with MERN Stack + TF-IDF Recommendation + VADER Sentiment Engine.</p>
          <p className="flex items-center space-x-1 mt-2 sm:mt-0">
            <span>Designed for Campus Viva & Demo</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
