import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Shield, User, Satellite, Radio, Eye } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const selectRole = (role) => {
    login(role);
    if (role === 'field') {
      navigate('/field');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0F2A] to-[#0F172A] flex items-center justify-center p-4">
      <div className="max-w-6xl w-full">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-2xl bg-[#1F77D2]/20 flex items-center justify-center">
              <Eye className="w-10 h-10 text-[#1F77D2]" />
            </div>
          </div>
          <h1 className="text-5xl font-black text-white mb-2 tracking-tight">
            Sentinel<span className="text-[#1F77D2]">Ops</span>
          </h1>
          <p className="text-slate-400 text-sm tracking-wider">CENTRE D'OPÉRATIONS TACTIQUE</p>
          <p className="text-slate-500 text-xs mt-2">SÉLECTIONNEZ VOTRE PROTOCOLE D'ACCÈS</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <button
            onClick={() => selectRole('field')}
            className="group relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-8 border border-slate-700 hover:border-[#1F77D2]/50 transition-all duration-300 hover:scale-[1.02] text-left"
          >
            <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
              <User className="w-6 h-6 text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">AGENT DE TERRAIN</h2>
            <p className="text-slate-400 text-sm mb-4">
              Transmission d'intelligence et rapports multimédias.
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1">📸 Photo</span>
              <span className="flex items-center gap-1">📍 GPS</span>
              <span className="flex items-center gap-1">📡 Hors ligne</span>
            </div>
            <div className="mt-4 text-[#1F77D2] text-sm font-medium opacity-0 group-hover:opacity-100 transition">
              Accéder →
            </div>
          </button>

          <button
            onClick={() => selectRole('command')}
            className="group relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-8 border border-slate-700 hover:border-[#1F77D2]/50 transition-all duration-300 hover:scale-[1.02] text-left"
          >
            <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
              <Shield className="w-6 h-6 text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">CENTRE DE COMMANDEMENT</h2>
            <p className="text-slate-400 text-sm mb-4">
              Surveillance temps réel et coordination tactique.
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1">🗺️ Carte</span>
              <span className="flex items-center gap-1">📊 KPIs</span>
              <span className="flex items-center gap-1">🚁 Unités</span>
            </div>
            <div className="mt-4 text-[#1F77D2] text-sm font-medium opacity-0 group-hover:opacity-100 transition">
              Accéder →
            </div>
          </button>
        </div>

        <div className="text-center mt-8">
          <div className="flex justify-center gap-6 text-slate-600 text-xs">
            <span className="flex items-center gap-1"><Radio size={10} /> Sentinel Fusion Active</span>
            <span className="flex items-center gap-1"><Satellite size={10} /> Lien sécurisé</span>
            <span className="flex items-center gap-1"><Eye size={10} /> Veille stratégique</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
