import React, { useState, useEffect, useRef } from 'react';
import { getSupabase, isSupabaseConfigured } from './supabase';
import LandingPage from './components/LandingPage';
import SupabaseAuth from './components/SupabaseAuth';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import LiveTimer from './components/LiveTimer';
import Logo from './components/Logo';
import Aurora from './components/Aurora';
import { Message, FileData } from './types';
import { Sparkles, Menu, AlertCircle, HeartCrack, Cable, Eye, EyeOff, Plus, LogOut, User, Camera, Loader2, HelpCircle, Settings, ChevronDown, MessageSquare, Sun, Moon, X, Search, BookOpen } from 'lucide-react';

const CONFIG = {
  APP_NAME: 'EstiNova',
  WELCOME_HEADER: 'Bonjour, Team ESTIN.',
  WELCOME_SUBHEADER: "Portail académique de l'ESTIN. Comment puis-je vous aider aujourd'hui ?",
  SUGGESTIONS: [
    "Rédige un email pour un partenaire",
    "Analyse ce code Python",
    "Idées de projet pour le club scientifique",
    "Explique le concept de Base de données"
  ],
  FALLBACK_ANSWERS: {
    "Rédige un email pour un partenaire": "### Objet : Proposition d'opportunité académique et scientifique\n\nBonjour,\n\nAu nom de l'équipe **ESTIN Béjaïa**, nous tenons à exprimer notre vif intérêt pour une collaboration stratégique avec votre structure.\n\nNous serions ravis de programmer un court échange pour discuter des projets communs que nous pouvons impulser ensemble cette année.\n\nCordialement,\n**L'équipe EstiNova**",
    "Analyse ce code Python": "Voici une brève analyse de votre code :\n\n`print('Hello World')` : Cette instruction affiche la chaîne de caractères à l'écran. C'est le point de départ classique en programmation.\n\nSi vous avez un script plus complexe, n'hésitez pas à le coller ici !",
    "Idées de projet pour le club scientifique": "Voici de supers idées de projets pour le **Club Scientifique ESTIN** :\n\n1. **Borne de campus IoT** : Une borne physique connectée aux API d'EstiNova.\n2. **Hackathon d'Optimisation Routière** : Codage d'une solution pour optimiser les transports universitaires de Béjaïa.\n3. **Plateforme Peer-to-Peer** : Échange collaboratif de résumés de cours et de chapitres scientifiques.",
    "Explique le concept de Base de données": "## Qu'est-ce qu'une Base de Données ?\n\nUne **base de données** est un système structuré permettant de stocker et d'organiser des informations.\n\n### Types de bases de données :\n- 🔹 **Relationnelle (SQL)** : Structure sous forme de tables avec clés primaires et secondaires (ex: PostgreSQL, MySQL).\n- 🔹 **Non-relationnelle (NoSQL)** : Flexibilité sous forme de documents ou paires clé-valeur (ex: MongoDB, Redis)."
  } as Record<string, string>
};

export default function App() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const [isAvatarUploading, setIsAvatarUploading] = useState(false);
  const [currentView, setCurrentView] = useState<'landing' | 'auth' | 'chat'>('landing');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [status, setStatus] = useState<'idle' | 'loading'>('idle');
  const [loadingStartTime, setLoadingStartTime] = useState<number | null>(null);
  const [rewriteInput, setRewriteInput] = useState<string | null>(null);

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [showThemeSettings, setShowThemeSettings] = useState(false);
  const [theme, setTheme] = useState<'classic' | 'oled' | 'light'>(() => {
    return (localStorage.getItem('theme') as 'classic' | 'oled' | 'light') || 'classic';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const profileMenuRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isAvatarUploading) return;
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert("Veuillez choisir un fichier image valide (JPG, PNG, etc.).");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_DIM = 200;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_DIM) {
            height *= MAX_DIM / width;
            width = MAX_DIM;
          }
        } else {
          if (height > MAX_DIM) {
            width *= MAX_DIM / height;
            height = MAX_DIM;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.85);
          canvas.toBlob((blob) => {
            if (blob) {
              handleAvatarUpdate(compressedBase64, blob);
            }
          }, 'image/jpeg', 0.85);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // 3 Webhook Variables representing each profile
  const [webhookStudent, setWebhookStudent] = useState('');
  const [webhookProfessor, setWebhookProfessor] = useState('');
  const [webhookAdmin, setWebhookAdmin] = useState('');
  const [showWebhookUrl, setShowWebhookUrl] = useState(false);

  // Active role selected in the UI
  const [selectedRole, setSelectedRole] = useState<'student' | 'professor' | 'admin'>('student');

  const handleWebhookChange = (val: string) => {
    if (selectedRole === 'student') {
      setWebhookStudent(val);
    } else if (selectedRole === 'professor') {
      setWebhookProfessor(val);
    } else {
      setWebhookAdmin(val);
    }
  };

  const handleAvatarUpdate = async (avatarUrl: string, blob: Blob) => {
    // Immédiatement mettre à jour l'interface locale en local pour une fluidité maximale
    setUserAvatar(avatarUrl);
    localStorage.setItem('user_avatar', avatarUrl);

    if (isSupabaseConfigured) {
      const supabase = getSupabase();
      if (supabase) {
        setIsAvatarUploading(true);
        try {
          // get current integrated user
          const { data: { user }, error: userError } = await supabase.auth.getUser();
          if (userError || !user) {
            console.error("Aucun utilisateur connecté pour uploader la photo", userError);
            return;
          }

          // Generate a clean filename inside the public folder /user_avatars/
          const cleanEmail = user.email ? user.email.replace(/[^a-zA-Z0-9]/g, '_') : 'user';
          const filePath = `${user.id}/${cleanEmail}-${Date.now()}.jpg`;

          // 1. Upload du binaire (Blob) dans le bucket "avatars"
          const { error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(filePath, blob, {
              contentType: 'image/jpeg',
              upsert: true
            });

          if (uploadError) {
            console.error("Erreur d'upload dans le bucket 'avatars' de Supabase :", uploadError);
            alert("⚠️ Impossible d'uploader l'image dans Supabase.\nAvez-vous créé le bucket public nommé 'avatars' dans Supabase Storage et configuré les règles RLS ? (Voir les instructions détaillées ci-dessous)");
            return;
          }

          // 2. Récupérer l'URL publique de l'image
          const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
          const publicUrl = data.publicUrl;

          if (publicUrl) {
            // 3. Mettre à jour les métadonnées de l'utilisateur avec l'URL légère et propre
            const { error: updateError } = await supabase.auth.updateUser({
              data: { avatar_url: publicUrl }
            });

            if (updateError) {
              console.error("Erreur lors de la mise à jour des métadonnées Supabase :", updateError);
            } else {
              // Mettre à jour l'état final avec l'URL publique
              setUserAvatar(publicUrl);
              localStorage.setItem('user_avatar', publicUrl);
              console.log("Photo de profil mise à jour avec succès dans Supabase ! URL publique :", publicUrl);
            }
          }
        } catch (err) {
          console.error("Erreur générale lors de la sauvegarde de la photo dans Supabase :", err);
        } finally {
          setIsAvatarUploading(false);
        }
      }
    }
  };

  // Custom states for handling connection errors & proxy settings
  const [showConfigAlert, setShowConfigAlert] = useState(false);
  const [useFallbackMode, setUseFallbackMode] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 60);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, status]);

  // Synchronize on mount with Supabase Session
  useEffect(() => {
    const savedAvatar = localStorage.getItem('user_avatar');
    if (savedAvatar) {
      setUserAvatar(savedAvatar);
    }

    if (!isSupabaseConfigured) return;
    const supabase = getSupabase();
    if (!supabase) return;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUserEmail(session.user.email || null);
        if (session.user.user_metadata?.avatar_url) {
          setUserAvatar(session.user.user_metadata.avatar_url);
        }
        setCurrentView('chat');
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUserEmail(session.user.email || null);
        if (session.user.user_metadata?.avatar_url) {
          setUserAvatar(session.user.user_metadata.avatar_url);
        }
        setCurrentView('chat');
      } else {
        setUserEmail(null);
        setCurrentView('landing');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleNewChat = () => {
    setMessages([]);
    setStatus('idle');
    setIsSidebarOpen(false);
  };

  const handleLogout = async () => {
    if (isSupabaseConfigured) {
      const supabase = getSupabase();
      if (supabase) {
        await supabase.auth.signOut();
      }
    }
    setUserEmail(null);
    setCurrentView('landing');
    setMessages([]);
    setStatus('idle');
  };

  const handleSendMessage = async (
    content: string,
    isVoice: boolean = false,
    fileData: FileData | null = null,
    selectedRole: string = 'student'
  ) => {
    let displayContent = content;
    if (!content.trim() && fileData) {
      displayContent = 'Fichier envoyé.';
    }

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: displayContent,
      attachedFileName: fileData ? fileData.name : null,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMsg]);
    setStatus('loading');
    const startTime = Date.now();
    setLoadingStartTime(startTime);

    try {
      // Trigger Webhook API fetch through our backend proxy to avoid CORS and mixed-content blocking
      // URL is now securely managed by the server proxy via the 'role' parameter.
      const response = await fetch('/api/proxy-webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          role: selectedRole,
          params: {
            email: userEmail || ''
          },
          payload: {
            chatInput: content,
            email: userEmail,
            sessionId: 'local-test-session-' + userEmail,
            isVoice,
            role: selectedRole,
            hasFile: !!fileData,
            file: fileData ? { name: fileData.name, type: fileData.type, base64: fileData.base64 } : null
          }
        })
      });

      const responseTime = Date.now() - startTime;
      if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);

      const data = await response.json();
      let replyText = '';
      if (typeof data === 'string') replyText = data;
      else if (data.output) replyText = data.output;
      else if (data.text) replyText = data.text;
      else if (data.message) replyText = data.message;
      else if (Array.isArray(data) && data.length > 0 && data[0].output) replyText = data[0].output;
      else replyText = JSON.stringify(data);

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: replyText,
          timestamp: new Date(),
          shouldSpeak: isVoice,
          responseTime
        }
      ]);
      setStatus('idle');
      setLoadingStartTime(null);
    } catch (error: any) {
      console.warn('Webhook delivery failed, checking fallbacks:', error);

      const responseTime = Date.now() - startTime;

      // Let's create a beautiful localized smart response when webhook port is offline or unreachable
      setTimeout(() => {
        let fallbackReply = "Je n'ai pas pu joindre le serveur webhook local. Veuillez vérifier qu'il est bien démarré.";

        // Match standard preset questions
        const trimmedLow = content.trim();
        if (CONFIG.FALLBACK_ANSWERS[trimmedLow]) {
          fallbackReply = CONFIG.FALLBACK_ANSWERS[trimmedLow];
        } else {
          fallbackReply = `### Diagnostic du signal de connexion\n\nHélas ! Je n'ai pas réussi à joindre votre serveur webhook.\n\n**Explication :**\nSi vous développez localement, assurez-vous que votre instance **n8n / Node-RED / serveur webhook** externe écoute bien et est correctement configurée.\n\n---\n\n💡 *Note de l'assistant : J'ai reçu votre question concernant **"${content}"**. Pour que les requêtes fonctionnent en production, configurez une adresse de serveur accessible publiquement.*`;
        }

        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: fallbackReply,
            timestamp: new Date(),
            shouldSpeak: isVoice,
            responseTime
          }
        ]);

        // Show warning alert banner to developer
        setShowConfigAlert(true);
        setStatus('idle');
        setLoadingStartTime(null);
      }, 500);
    }
  };

  if (!userEmail) {
    if (currentView === 'auth') {
      return (
        <SupabaseAuth
          onAuthSuccess={(email) => {
            setUserEmail(email);
            setCurrentView('chat');
          }}
          onBack={() => setCurrentView('landing')}
        />
      );
    }
    return <LandingPage onStartAuth={() => setCurrentView('auth')} />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--bg-secondary)] text-[var(--text-foreground)] selection:bg-indigo-500/30 transition-colors duration-250">

      {/* Main chat center */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">

        {/* Connection Diagnostics Banner */}
        {showConfigAlert && (
          <div className="bg-indigo-950/90 border-b border-indigo-900 px-4 py-2.5 flex items-center justify-between text-xs z-10 animate-fade-in text-gray-300">
            <div className="flex items-center gap-2">
              <Cable className="h-4 w-4 text-indigo-400 shrink-0" />
              <span>
                Le webhook local est inaccessible. Modifiez le port ou servez-vous des suggestions d'aide autonome.
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowConfigAlert(false)}
                className="px-2 py-1 rounded bg-indigo-900/40 hover:bg-indigo-900 text-[10px] font-semibold text-indigo-300 hover:text-indigo-200 transition-all cursor-pointer"
              >
                Masquer
              </button>
            </div>
          </div>
        )}

        {/* Header toolbar */}
        <header
          className="shrink-0 p-3 md:p-4 flex items-center justify-between backdrop-blur-md bg-[var(--bg-header)]/90 border-b border-transparent transition-all duration-250 shadow-md relative z-40"
          style={{ paddingTop: `calc(env(safe-area-inset-top, 0px) + 8px)` }}
        >
          {/* Ambient subtle backdrop glow behind Logo section - pure premium aesthetic */}
          <div className="absolute left-6 top-1/2 -translate-y-1/2 w-32 h-6 bg-indigo-500/10 blur-[30px] rounded-full pointer-events-none" />

          <div className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl text-[var(--text-title)] hover:bg-[var(--bg-input)]/25 transition-all duration-200 select-none">
            <Logo size={25} className="text-indigo-400 hover:scale-105 transition-all duration-300" />
            <div className="flex items-baseline gap-1.5">
              <span className="font-bold text-lg tracking-tight">
                Esti<span className="text-indigo-400">Nova</span>
              </span>
            </div>
          </div>

          {/* Active Mode status visualizer (Tactile interface state indicator) */}
          <div className="hidden md:flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-[var(--bg-input)]/50 select-none shadow-sm transition-all duration-250">
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${selectedRole === 'student' ? 'bg-indigo-400' :
                selectedRole === 'professor' ? 'bg-emerald-400' : 'bg-rose-400'
                }`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${selectedRole === 'student' ? 'bg-indigo-500' :
                selectedRole === 'professor' ? 'bg-emerald-500' : 'bg-rose-500'
                }`}></span>
            </span>
            <span className="text-xs font-semibold text-[var(--text-muted)] tracking-wide">
              Mode actif :{' '}
              <span className={`font-mono font-extrabold transition-all ${selectedRole === 'student' ? 'text-indigo-300' :
                selectedRole === 'professor' ? 'text-emerald-300' : 'text-rose-300'
                }`}>
                {selectedRole === 'student' ? '🎓 ÉTUDIANT' :
                  selectedRole === 'professor' ? '💼 ENSEIGNANT' : '⚙️ ADMIN'}
              </span>
            </span>
          </div>

          <div className="flex items-center gap-3 relative z-50">
            {/* Direct Theme Switcher Button - cycles classic -> oled -> light with custom animations */}
            <button
              onClick={() => {
                const themeCycle: ('classic' | 'oled' | 'light')[] = ['classic', 'oled', 'light'];
                const nextIndex = (themeCycle.indexOf(theme) + 1) % themeCycle.length;
                setTheme(themeCycle[nextIndex]);
              }}
              className="p-2 rounded-xl text-[var(--text-muted)] hover:text-indigo-400 bg-[var(--bg-input)]/50 hover:bg-[var(--bg-input)] transition-all duration-150 cursor-pointer active:scale-95 flex items-center justify-center group"
              title="Changer de thème rapidement"
            >
              {theme === 'classic' && <Sparkles className="w-4 h-4 text-indigo-400 group-hover:rotate-12 transition-transform" />}
              {theme === 'oled' && <Moon className="w-4 h-4 text-purple-400 group-hover:-translate-y-0.5 transition-transform" />}
              {theme === 'light' && <Sun className="w-4 h-4 text-amber-500 group-hover:rotate-45 transition-transform" />}
            </button>

            {/* Nouveau Chat button */}
            <button
              onClick={handleNewChat}
              className="flex items-center gap-1.5 px-3.5 py-2 transition-all rounded-xl text-xs font-semibold bg-indigo-500 hover:bg-indigo-600 text-white shadow-md cursor-pointer active:scale-95 active:translate-y-[1px] touch-target"
            >
              <Plus className="w-3.5 h-3.5 text-white/90 shrink-0" />
              <span className="hidden sm:inline">Nouveau chat</span>
              <span className="inline sm:hidden">Nouveau</span>
            </button>

            {/* Profile Dropdown widget */}
            <div className="relative" ref={profileMenuRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 p-1.5 rounded-xl bg-[var(--bg-input)]/40 hover:bg-[var(--bg-input)]/85 transition-all duration-150 cursor-pointer text-left focus:outline-none"
              >
                {userAvatar ? (
                  <div className="relative w-8 h-8 rounded-lg overflow-hidden shadow-md">
                    <img
                      src={userAvatar}
                      alt="Photo de profil"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    {isAvatarUploading && (
                      <div className="absolute inset-0 bg-indigo-950/80 flex items-center justify-center">
                        <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="relative w-8 h-8 rounded-lg bg-[var(--bg-input)] flex items-center justify-center text-[var(--text-muted)]">
                    <User className="w-4 h-4" />
                    {isAvatarUploading && (
                      <div className="absolute inset-0 bg-indigo-950/80 flex items-center justify-center">
                        <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
                      </div>
                    )}
                  </div>
                )}
                <span className="hidden md:inline text-xs font-semibold text-[var(--text-title)] font-mono pr-1 select-none">
                  {userEmail ? userEmail.split('@')[0] : 'Invité'}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-[var(--text-muted)] hidden md:block transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-xl pb-2 bg-[var(--bg-card)] border border-[var(--border-color)]/80 shadow-2xl shadow-black/85 z-50 animate-fade-in flex flex-col font-sans overflow-hidden">
                  {/* User Profile Info Header */}
                  <div className="p-4 border-b border-[var(--border-color)]/40 bg-[var(--bg-secondary)] flex flex-col">
                    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest leading-none mb-1">
                      Mon Profil
                    </span>
                    <span className="text-xs text-[var(--text-title)] truncate font-semibold font-mono" title={userEmail || 'Utilisateur Invité'}>
                      {userEmail || 'Invité'}
                    </span>

                    {/* Changer photo button inside the menu */}
                    <div className="mt-3 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 bg-[var(--bg-input)] hover:bg-[var(--bg-input)]/80 border border-[var(--border-color)]/55 rounded-lg text-[11px] font-medium text-[var(--text-foreground)] hover:text-indigo-400 transition-all cursor-pointer focus:outline-none"
                        disabled={isAvatarUploading}
                      >
                        <Camera className="w-3.5 h-3.5 shrink-0 text-indigo-400" />
                        {isAvatarUploading ? "Mise à jour..." : "Changer de photo"}
                      </button>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleAvatarChange}
                        accept="image/*"
                        className="hidden"
                        disabled={isAvatarUploading}
                      />
                    </div>
                  </div>

                  {/* Menu options mimicking the sidebar */}
                  <div className="p-2 space-y-0.5">
                    <button
                      onClick={() => {
                        setIsHelpOpen(true);
                        setIsProfileOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-[var(--text-muted)] hover:text-[var(--text-foreground)] hover:bg-[var(--bg-secondary)] transition-colors cursor-pointer text-left font-semibold"
                    >
                      <HelpCircle className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      <span>Aide & FAQ</span>
                    </button>

                    <div>
                      <button
                        onClick={() => setShowThemeSettings(!showThemeSettings)}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs text-[var(--text-muted)] hover:text-[var(--text-foreground)] hover:bg-[var(--bg-secondary)] transition-colors cursor-pointer text-left"
                      >
                        <div className="flex items-center gap-2.5">
                          <Settings className="w-3.5 h-3.5 text-[var(--text-muted)] shrink-0" />
                          <span>Paramètres (Thèmes)</span>
                        </div>
                        <ChevronDown className={`w-3.5 h-3.5 text-[var(--text-muted)] transition-transform duration-200 ${showThemeSettings ? 'rotate-180' : ''}`} />
                      </button>

                      {showThemeSettings && (
                        <div className="mt-1 ml-6 pl-2.5 border-l border-[var(--border-color)]/50 space-y-1 py-1 animate-fade-in">
                          <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-1">
                            Choisir un Thème
                          </span>
                          <button
                            onClick={() => setTheme('classic')}
                            className={`w-full text-left text-xs px-2 py-1.5 rounded-lg transition-colors cursor-pointer ${theme === 'classic' ? 'bg-indigo-500/15 border border-indigo-500/25 text-indigo-200 font-semibold' : 'text-[var(--text-muted)] hover:text-[var(--text-foreground)] hover:bg-[var(--bg-secondary)]'}`}
                          >
                            🌌 EstiNova Sombre (Classic)
                          </button>
                          <button
                            onClick={() => setTheme('oled')}
                            className={`w-full text-left text-xs px-2 py-1.5 rounded-lg transition-colors cursor-pointer ${theme === 'oled' ? 'bg-indigo-500/15 border border-indigo-500/25 text-indigo-200 font-semibold' : 'text-[var(--text-muted)] hover:text-[var(--text-foreground)] hover:bg-[var(--bg-secondary)]'}`}
                          >
                            🖤 OLED Pitch Black
                          </button>
                          <button
                            onClick={() => setTheme('light')}
                            className={`w-full text-left text-xs px-2 py-1.5 rounded-lg transition-colors cursor-pointer ${theme === 'light' ? 'bg-indigo-500/15 border border-indigo-400/25 text-indigo-700 font-semibold' : 'text-[var(--text-muted)] hover:text-[var(--text-foreground)] hover:bg-[var(--bg-secondary)]'}`}
                          >
                            ☀️ EstiNova Clair (Light)
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Se déconnecter */}
                    <div className="border-t border-[var(--border-color)]/40 my-1 pt-1.5">
                      <button
                        onClick={() => {
                          setIsProfileOpen(false);
                          handleLogout();
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-colors cursor-pointer text-left font-semibold"
                      >
                        <LogOut className="w-3.5 h-3.5 text-red-400 shrink-0" />
                        <span>Se déconnecter</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Messages list context */}
        <div className="flex-1 overflow-y-auto min-h-0 scrollbar-none bg-[var(--bg-main)]">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center p-6 text-center animate-fade-in max-w-2xl mx-auto">
              <div className="mb-6 flex justify-center hover:scale-105 transition-transform duration-300 animate-float">
                <Logo size={64} variant="emblem" />
              </div>
              <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight mb-2.5 text-[var(--text-title)] select-none">
                {CONFIG.WELCOME_HEADER}
              </h1>
              <p className="text-sm md:text-base max-w-md mx-auto mb-10 text-[var(--text-muted)] leading-relaxed font-medium">
                {CONFIG.WELCOME_SUBHEADER}
              </p>

              {/* Grid suggestions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                {CONFIG.SUGGESTIONS.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSendMessage(suggestion)}
                    className="text-left p-4 rounded-xl transition-all border border-[var(--border-color)]/60 bg-[var(--bg-card)] text-[var(--text-muted)] hover:border-indigo-500 hover:bg-indigo-500/5 hover:text-[var(--text-title)] active:scale-[0.99] cursor-pointer shadow-md shadow-black/10"
                  >
                    <span className="text-sm font-semibold">{suggestion}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="py-4">
              {messages.map((msg, index) => (
                <ChatMessage
                  key={msg.id}
                  message={msg}
                  isLastMessage={index === messages.length - 1}
                  onRewrite={(text) => setRewriteInput(text)}
                  userAvatar={userAvatar}
                />
              ))}

              {status === 'loading' && loadingStartTime && (
                <div className="max-w-3xl mx-auto px-4 md:px-6 py-4 md:py-5 flex gap-3.5 md:gap-5 animate-fade-in border-b border-indigo-950/20 last:border-0">
                  <div className="w-9 h-9 flex items-center justify-center shrink-0">
                    <Logo size={36} variant="emblem" isAnswering={true} className="text-indigo-400" />
                  </div>
                  <div className="flex flex-col justify-center">
                    <div className="text-xs font-semibold text-gray-500 select-none">
                      EstiNova recherche…
                    </div>
                    <LiveTimer startTime={loadingStartTime} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} className="h-4" />
            </div>
          )}
        </div>

        {/* Input box */}
        <ChatInput
          onSend={handleSendMessage}
          isLoading={status === 'loading'}
          externalInput={rewriteInput}
          onExternalInputConsumed={() => setRewriteInput(null)}
          selectedRole={selectedRole}
          onRoleChange={setSelectedRole}
        />
      </div>

      {/* Help & FAQ modal */}
      {isHelpOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-black/60 backdrop-blur-md animate-fade-in">
          {/* Backdrop absolute click handler */}
          <div className="absolute inset-0 cursor-pointer" onClick={() => setIsHelpOpen(false)} />

          {/* Modal Container */}
          <div className="relative w-full max-w-2xl bg-[var(--bg-card)] border border-[var(--border-color)]/70 rounded-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden animate-zoom-in">
            {/* Header section */}
            <div className="p-5 border-b border-[var(--border-color)]/50 bg-[var(--bg-secondary)] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/25 flex items-center justify-center text-indigo-400">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-[var(--text-title)]">Aide & FAQ</h3>
                  <p className="text-[11px] text-[var(--text-muted)] font-mono">Assistance autonome de la plateforme EstiNova</p>
                </div>
              </div>
              <button
                onClick={() => setIsHelpOpen(false)}
                className="p-1.5 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-title)] bg-red-500/0 hover:bg-red-500/10 cursor-pointer transition-colors active:scale-95"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Help Content body with search and accordions */}
            <HelpModalBody />

            {/* Footer */}
            <div className="p-4 border-t border-[var(--border-color)]/40 bg-[var(--bg-secondary)] flex items-center justify-between">
              <span className="text-[10px] font-mono text-[var(--text-muted)]">
                ESTIN © 2026 — EstiNova
              </span>
              <button
                onClick={() => setIsHelpOpen(false)}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-500 text-white hover:bg-indigo-600 transition-all cursor-pointer shadow-md active:translate-y-[1px]"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function HelpModalBody() {
  const [searchQuery, setSearchQuery] = useState('');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqItems = [
    {
      question: "Qu'est-ce qu'EstiNova ?",
      answer: "EstiNova est le portail d'orientation académique officiel dédié à la communauté ESTIN (École Supérieure en Sciences et Technologies de l’Information et du Numérique). Il est conçu pour répondre à vos questions pédagogiques, administratives ou techniques de façon instantanée."
    },
    {
      question: "Comment alterner entre les différents profils ?",
      answer: "Vous disposez d'un sélecteur dédié situé en bas (à droite de l'icône Fichier). Vous pouvez basculer entre :\n\n🎓 Étudiant (pour les cours, TD, et examens)\n💼 Enseignant (pour l'aide à la conception d'exercices)\n⚙️ Administrateur (pour l'administration ou des questions techniques de l'école)."
    },
    {
      question: "Comment associer des documents au chat ?",
      answer: "Cliquez sur l'icône trombone 📎 de la barre de message, importez vos énoncés de TD, examens ou résumés de cours. L'image ou le document texte sera alors traité et son nom apparaîtra au-dessus des messages."
    },
    {
      question: "Quels sont les thèmes d'affichage disponibles ?",
      answer: "EstiNova propose 3 thèmes distincts :\n\n🌌 EstiNova Sombre (Classic) : Le confort visuel par excellence avec des nuances bleutées.\n🖤 OLED Pitch Black : Noir absolu pour les écrans OLED, idéal pour préserver votre batterie.\n☀️ EstiNova Clair (Light) : Thème clair, élégant et lumineux pour une lecture optimale."
    },
    {
      question: "Comment fonctionne la synthèse vocale (Audio) ?",
      answer: "À côté du nom (EstiNova) s'affiche une icône de haut-parleur sur chaque message généré. Cliquez dessus pour écouter la réponse haute fidélité dictée automatiquement en français ou en anglais."
    },
    {
      question: "Les webhooks de redirection académique",
      answer: "Les requêtes de chaque profil sont envoyées dynamiquement aux webhooks configurés de l'ESTIN. Cela permet d'obtenir des données en temps réel directement à partir des bases de connaissances pédagogiques locales."
    }
  ];

  const filteredFaqs = faqItems.filter(
    item =>
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 overflow-y-auto p-5 space-y-4">
      {/* Search Input bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
        <input
          type="text"
          placeholder="Rechercher une question ou mot-clé..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs bg-[var(--bg-input)] border border-[var(--border-color)]/60 text-[var(--text-foreground)] placeholder-[var(--text-muted)] outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/20 transition-all font-sans"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-foreground)] cursor-pointer text-xs font-semibold"
          >
            Effacer
          </button>
        )}
      </div>

      {/* Accordions container */}
      <div className="space-y-2.5">
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-xl border border-[var(--border-color)]/50 overflow-hidden bg-[var(--bg-card)] transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full px-4 py-3 flex items-center justify-between text-left cursor-pointer hover:bg-[var(--bg-secondary)]/40 transition-colors focus:outline-none"
                >
                  <span className="font-semibold text-xs text-[var(--text-title)] block font-sans">
                    {item.question}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-indigo-400 transition-transform duration-250 shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {isOpen && (
                  <div className="px-4 pb-3 pt-1 border-t border-[var(--border-color)]/30 text-xs text-[var(--text-muted)] leading-relaxed whitespace-pre-wrap select-text animate-fade-in font-sans">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="py-8 text-center text-xs text-[var(--text-muted)] font-medium">
            Aucun résultat trouvé pour votre recherche. Essayez d'autres mots-clés.
          </div>
        )}
      </div>
    </div>
  );
}
