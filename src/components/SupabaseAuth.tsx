import React, { useState } from 'react';
import { getSupabase, isSupabaseConfigured } from '../supabase';
import { Mail, Lock, UserPlus, LogIn, AlertTriangle, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';
import Logo from './Logo';
import Aurora from './Aurora';

interface SupabaseAuthProps {
  onAuthSuccess: (email: string) => void;
  onBack?: () => void;
}

export default function SupabaseAuth({ onAuthSuccess, onBack }: SupabaseAuthProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setMessage({ text: 'Veuillez saisir votre adresse email.', type: 'error' });
      return;
    }

    if (isSupabaseConfigured && isSignUp && !trimmedEmail.toLowerCase().endsWith('@estin.dz')) {
      setMessage({ 
        text: "Seules les adresses e-mail officielles de l'école (@estin.dz) sont autorisées à s'inscrire.", 
        type: 'error' 
      });
      return;
    }

    if (password.length < 6) {
      setMessage({ text: 'Le mot de passe doit comporter au moins 6 caractères.', type: 'error' });
      return;
    }

    if (isSignUp && password !== confirmPassword) {
      setMessage({ text: 'Les deux mots de passe ne correspondent pas.', type: 'error' });
      return;
    }

    // Fallback if Supabase is not configured
    if (!isSupabaseConfigured) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        if (isSignUp) {
          setMessage({
            text: `Inscription réussie ! Un e-mail de confirmation a été envoyé à ${trimmedEmail}. Veuillez vérifier votre boîte de réception pour valider votre compte universitaire.`,
            type: 'success'
          });
        } else {
          onAuthSuccess(trimmedEmail);
        }
      }, 800);
      return;
    }

    const supabase = getSupabase();
    if (!supabase) {
      setMessage({ text: 'Impossible de charger le client Supabase.', type: 'error' });
      return;
    }

    setLoading(true);
    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email: trimmedEmail,
          password: password,
        });

        if (error) throw error;

        setMessage({
          text: `Inscription réussie ! Un e-mail de confirmation a été envoyé à ${trimmedEmail}. Veuillez vérifier votre boîte de réception pour valider votre compte universitaire.`,
          type: 'success',
        });
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: trimmedEmail,
          password: password,
        });

        if (error) throw error;

        if (data.user) {
          if (!data.user.email_confirmed_at) {
            await supabase.auth.signOut();
            setMessage({
              text: "Veuillez d'abord valider votre adresse e-mail. Un e-mail de confirmation vous a été envoyé. Veuillez vérifier votre boîte de réception.",
              type: 'error'
            });
            return;
          }

          setMessage({ text: 'Connexion réussie ! Redirection...', type: 'success' });
          setTimeout(() => {
            onAuthSuccess(data.user?.email || trimmedEmail);
          }, 1000);
        }
      }
    } catch (err: any) {
      setMessage({ text: err.message || 'Une erreur est survenue lors de l’authentification.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center p-4 bg-[#07080f] selection:bg-indigo-500/30 overflow-hidden">
      
      {/* Dynamic interactive Aurora background reacting to mouse movement */}
      <Aurora colorStops={['#0c0a24', '#4f46e5', '#1a103c']} />

      {/* Ambient background particles/glows */}
      <div className="absolute top-1/4 left-1/4 h-[350px] w-[350px] rounded-full bg-indigo-500/5 blur-3xl pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 h-[350px] w-[350px] rounded-full bg-purple-500/5 blur-3xl pointer-events-none animate-pulse"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-md w-full rounded-2xl shadow-2xl p-8 border border-white/10 bg-[#0d0f1e]/80 backdrop-blur-xl relative overflow-hidden transition-all duration-300 z-10"
      >
        
        {/* Top styling glowing gradient line */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

        {/* Configuration Notice if Supabase variables are missing */}
        {!isSupabaseConfigured && (
          <div className="mb-6 p-4 rounded-xl border border-yellow-500/20 bg-yellow-500/5 text-yellow-200 text-xs leading-relaxed space-y-1">
            <div className="font-bold flex items-center gap-1.5 text-yellow-500">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              Mode démo hors ligne actif
            </div>
            <p className="text-yellow-200/70">
              Les variables <b>VITE_SUPABASE_URL</b> et <b>VITE_SUPABASE_ANON_KEY</b> ne sont pas configurées. 
              Vous pouvez vous authentifier virtuellement en saisissant n'importe quel e-mail.
            </p>
          </div>
        )}

        {/* Brand / Logo */}
        <div className="text-center mb-8">
          <div className="mb-4 flex justify-center hover:scale-105 transition-transform duration-300">
            <Logo size={60} variant="emblem" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white select-none">
            Esti<span className="text-indigo-400">Nova</span>
          </h1>
          <p className="mt-2 text-sm text-gray-400 font-medium">
            {isSignUp ? "Création de votre compte universitaire" : "Accédez au Portail Académique EstiNova"}
          </p>
        </div>

        {/* Feedback Messages */}
        {message && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-3.5 rounded-xl text-xs font-semibold mb-6 border ${
              message.type === 'success' 
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                : 'bg-red-500/10 border-red-500/20 text-red-400'
            }`}
          >
            {message.text}
          </motion.div>
        )}

        <form onSubmit={handleAuth} className="space-y-5">
          {/* Email Input */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-gray-400">
              Adresse Email
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-500">
                <Mail className="h-4.5 w-4.5" />
              </span>
              <input
                type="email"
                required
                className="w-full pl-10 pr-4 py-3 text-sm rounded-xl outline-none border border-white/5 bg-[#141628]/80 text-white placeholder-gray-500 transition-all focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/40"
                placeholder="ex: prenom.nom@estin.dz"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-gray-400">
              Mot de passe
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-500">
                <Lock className="h-4.5 w-4.5" />
              </span>
              <input
                type="password"
                required
                className="w-full pl-10 pr-4 py-3 text-sm rounded-xl outline-none border border-white/5 bg-[#141628]/80 text-white placeholder-gray-500 transition-all focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/40"
                placeholder="Votre mot de passe (6+ caractères)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
              />
            </div>
          </div>

          {/* Confirm Password Input */}
          {isSignUp && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="overflow-hidden"
            >
              <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-gray-400">
                Confirmer le mot de passe
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-500">
                  <Lock className="h-4.5 w-4.5" />
                </span>
                <input
                  type="password"
                  required={isSignUp}
                  className="w-full pl-10 pr-4 py-3 text-sm rounded-xl outline-none border border-white/5 bg-[#141628]/80 text-white placeholder-gray-500 transition-all focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/40"
                  placeholder="Confirmez votre mot de passe"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  minLength={6}
                />
              </div>
            </motion.div>
          )}

          {/* Buttons */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full relative py-3 rounded-xl font-bold text-white transition-all select-none hover:brightness-110 shadow-lg shadow-indigo-500/10 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 cursor-pointer"
            >
              {loading ? (
                <div className="w-5 h-5 rounded-full border-2 border-t-transparent animate-spin border-white" />
              ) : isSignUp ? (
                <>
                  <UserPlus className="h-4.5 w-4.5" />
                  <span>S'inscrire</span>
                </>
              ) : (
                <>
                  <LogIn className="h-4.5 w-4.5" />
                  <span>Se connecter</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Toggle Sign Up / Sign In */}
        <div className="mt-8 text-center space-y-4">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setMessage(null);
              setConfirmPassword('');
            }}
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-all focus:outline-none cursor-pointer block mx-auto hover:underline"
          >
            {isSignUp ? "Déjà membre ? Se connecter" : "Nouveau sur EstiNova ? Créer un compte"}
          </button>

          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-300 transition-colors focus:outline-none cursor-pointer font-semibold mx-auto mt-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Retourner à l'accueil</span>
            </button>
          )}
        </div>

      </motion.div>
    </div>
  );
}
