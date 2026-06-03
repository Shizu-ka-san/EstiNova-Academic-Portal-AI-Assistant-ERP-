import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, Menu, ArrowRight, Bot, Send, Calendar, GraduationCap, 
  FileText, Users, Mail, BookOpen, Shield, Globe, Zap, Briefcase, 
  Settings, Check, AlertTriangle, BarChart3, Database, Github, 
  Linkedin, Palette, Server, X, Activity, Cpu, ChevronRight
} from 'lucide-react';
import Logo from './Logo';
import Aurora from './Aurora';

interface LandingPageProps {
  onStartAuth: () => void;
}

interface DemoMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
}

const USER_TABS_DATA = {
  student: {
    title: "Étudiants",
    subtitle: "1CP, 2CP & 1CS",
    description: "Accédez à vos notes, emplois du temps, règlements et bénéficiez d'une aide pédagogique personnalisée.",
    features: [
      "Consultation des notes et moyennes",
      "Emploi du temps en temps réel",
      "Aide sur les exercices et devoirs",
      "Annuaire des camarades et enseignants",
      "Envoi d'emails aux professeurs",
      "Documentation officielle"
    ],
    query: "\"Quel est mon emploi du temps demain ?\"",
    reply: "Demain, vous avez Analyse 2 de 8h à 10h en salle A12, puis TP Programmation de 10h15 à 12h15 en salle Info-3...",
    access: "Personnel"
  },
  professor: {
    title: "Professeurs",
    subtitle: "Corps Enseignant",
    description: "Gérez vos modules, communiquez avec vos étudiants et accédez aux outils pédagogiques adaptés.",
    features: [
      "Liste des groupes et sections",
      "Emplois du temps des modules",
      "Communication ciblée aux étudiants",
      "Signalement des absences de cours",
      "Accès aux contacts étudiants",
      "Documents pédagogiques"
    ],
    query: "\"Envoyer une annonce au groupe 2CP-A\"",
    reply: "Annonce envoyée avec succès à 32 étudiants du groupe 2CP-A. Un récapitulatif a été enregistré dans votre historique.",
    access: "Module"
  },
  admin: {
    title: "Administration",
    subtitle: "Personnel Administratif",
    description: "Supervisez l'activité, gerez les données de scolarité et diffusez les annonces officielles.",
    features: [
      "Tableau de bord de supervision",
      "Mise à jour des données scolarité",
      "Diffusion d'annonces officielles",
      "Gestion documentaire",
      "Logs d'utilisation",
      "Contrôle des accès"
    ],
    query: "\"Afficher les statistiques d'utilisation\"",
    reply: "Cette semaine : 1,247 requêtes traitées, 98.5% de satisfaction, 12 sujets non couverts identifiés. Voir le rapport.",
    access: "Complet"
  }
};

export default function LandingPage({ onStartAuth }: LandingPageProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'student' | 'professor' | 'admin'>('student');
  
  // Demo Chatbot State
  const [demoMessages, setDemoMessages] = useState<DemoMessage[]>([
    {
      id: '1',
      sender: 'bot',
      text: "Bonjour ! Je suis EstiNova, votre portail académique. Comment puis-je vous aider aujourd'hui ?"
    }
  ]);
  const [demoInput, setDemoInput] = useState('');
  const [isDemoTyping, setIsDemoTyping] = useState(false);

  const handleSendDemoMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!demoInput.trim()) return;

    const userText = demoInput;
    const userMsg: DemoMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: userText
    };

    setDemoMessages(prev => [...prev, userMsg]);
    setDemoInput('');
    setIsDemoTyping(true);

    setTimeout(() => {
      setIsDemoTyping(false);
      let reply = "Dans la démo connectée, le portail vous renvoie vos plannings, vos notes ainsi que vos informations académiques personnalisées.";
      const low = userText.toLowerCase();

      if (low.includes('emploi') || low.includes('semaine') || low.includes('cours') || low.includes('planning')) {
        reply = "Demain, l'espace Étudiant indique que vous avez cours d'Analyse 2 de 8h à 10h en salle A12, suivi du TP d'ASD à 10h15. Connectez-vous pour voir l'emploi du temps complet !";
      } else if (low.includes('note') || low.includes('moyenne') || low.includes('résultat') || low.includes('semestre')) {
        reply = "En vous connectant avec votre compte étudiant, vous pouvez voir vos notes par matière (ex. Algorithmique: 16/20, Système d'Exploitation: 17/20) et votre moyenne générale calculée de 15.19/20.";
      } else if (low.includes('attestation') || low.includes('document')) {
        reply = "EstiNova vous aide à générer vos certificats de scolarité ou documents administratifs en un clic. Connectez-vous à votre espace ERP !";
      } else if (low.includes('absence') || low.includes('absent')) {
        reply = "L'espace étudiant comptabilise vos absences globales (ex: 2 justifiées, 1 non justifiée ce semestre). Saisissez vos identifiants pour voir l'historique.";
      }

      setDemoMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: reply
      }]);
    }, 850);
  };

  const handleScrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const selectedTabData = USER_TABS_DATA[activeTab];

  return (
    <div className="min-h-screen bg-[#0d0f1c] text-[#f9fafb] selection:bg-indigo-500/30 overflow-x-hidden relative flex flex-col font-sans">
      
      {/* Decorative Orbs */}
      <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-purple-500/5 blur-[120px] pointer-events-none" />
      
      {/* 1. Header Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-indigo-950 bg-[#0d0f1cc0] backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <a href="#" className="flex items-center gap-2">
            <Logo size={32} variant="emblem" className="transition-all duration-300" />
            <span className="text-xl font-bold text-white">Esti<span className="text-indigo-400">Nova</span></span>
          </a>

          {/* Desktop Navigation links */}
          <nav className="hidden items-center gap-8 md:flex">
            <a 
              href="#features" 
              onClick={(e) => handleScrollToSection(e, 'features')}
              className="relative text-sm text-gray-400 transition-colors hover:text-white group py-1"
            >
              Fonctionnalités
              <span className="absolute -bottom-0.5 left-0 h-0.5 w-0 bg-indigo-400 transition-all group-hover:w-full"></span>
            </a>
            <a 
              href="#users" 
              onClick={(e) => handleScrollToSection(e, 'users')}
              className="relative text-sm text-gray-400 transition-colors hover:text-white group py-1"
            >
              Utilisateurs
              <span className="absolute -bottom-0.5 left-0 h-0.5 w-0 bg-indigo-400 transition-all group-hover:w-full"></span>
            </a>
            <a 
              href="#architecture" 
              onClick={(e) => handleScrollToSection(e, 'architecture')}
              className="relative text-sm text-gray-400 transition-colors hover:text-white group py-1"
            >
              Architecture
              <span className="absolute -bottom-0.5 left-0 h-0.5 w-0 bg-indigo-400 transition-all group-hover:w-full"></span>
            </a>
            <a 
              href="#about" 
              onClick={(e) => handleScrollToSection(e, 'about')}
              className="relative text-sm text-gray-400 transition-colors hover:text-white group py-1"
            >
              À Propos
              <span className="absolute -bottom-0.5 left-0 h-0.5 w-0 bg-indigo-400 transition-all group-hover:w-full"></span>
            </a>
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <button 
              onClick={onStartAuth} 
              className="group flex items-center gap-0 hover:gap-2 px-3.5 py-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-indigo-950/40 transition-all duration-300 ease-in-out cursor-pointer"
            >
              <Users className="h-4.5 w-4.5 shrink-0" />
              <span className="max-w-0 opacity-0 overflow-hidden group-hover:max-w-[110px] group-hover:opacity-100 transition-all duration-300 ease-in-out whitespace-nowrap text-xs font-semibold">
                Se Connecter
              </span>
            </button>
            <button 
              onClick={onStartAuth} 
              className="group flex items-center gap-0 hover:gap-2 bg-indigo-500 text-[#0d0f1c] hover:bg-indigo-400 px-3.5 py-2.5 rounded-xl hover:scale-105 active:scale-95 transition-all duration-300 ease-in-out shadow-lg shadow-indigo-500/20 cursor-pointer"
            >
              <Sparkles className="h-4.5 w-4.5 shrink-0" />
              <span className="max-w-0 opacity-0 overflow-hidden group-hover:max-w-[100px] group-hover:opacity-100 transition-all duration-300 ease-in-out whitespace-nowrap text-xs font-bold">
                Commencer
              </span>
            </button>
          </div>

          {/* Mobile Menu Trigger Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-indigo-950/60"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation Panel */}
        {mobileMenuOpen && (
          <div className="border-t border-indigo-950 bg-[#0d0f1c] md:hidden">
            <nav className="flex flex-col px-4 py-4 space-y-3">
              <a 
                href="#features" 
                onClick={(e) => { handleScrollToSection(e, 'features'); setMobileMenuOpen(false); }} 
                className="block py-2 text-sm text-gray-400 hover:text-white"
              >
                Fonctionnalités
              </a>
              <a 
                href="#users" 
                onClick={(e) => { handleScrollToSection(e, 'users'); setMobileMenuOpen(false); }} 
                className="block py-2 text-sm text-gray-400 hover:text-white"
              >
                Utilisateurs
              </a>
              <a 
                href="#architecture" 
                onClick={(e) => { handleScrollToSection(e, 'architecture'); setMobileMenuOpen(false); }} 
                className="block py-2 text-sm text-gray-400 hover:text-white"
              >
                Architecture
              </a>
              <a 
                href="#about" 
                onClick={(e) => { handleScrollToSection(e, 'about'); setMobileMenuOpen(false); }} 
                className="block py-2 text-sm text-gray-400 hover:text-white"
              >
                À Propos
              </a>
              <div className="h-px bg-indigo-950 my-2"></div>
              <button 
                onClick={() => { onStartAuth(); setMobileMenuOpen(false); }} 
                className="w-full text-left py-2 text-sm text-gray-400 hover:text-white font-medium"
              >
                Se Connecter
              </button>
              <button 
                onClick={() => { onStartAuth(); setMobileMenuOpen(false); }} 
                className="w-full bg-indigo-500 text-[#0d0f1c] text-center py-2.5 rounded-xl hover:bg-indigo-400 font-bold transition-colors"
              >
                Commencer
              </button>
            </nav>
          </div>
        )}
      </header>

      {/* 2. Hero Section */}
      <section className="relative min-h-screen pt-24 sm:pt-32 flex items-center shrink-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent pointer-events-none z-10"></div>
        <Aurora colorStops={['#1e1b4b', '#4f46e5', '#312e81']} />
        
        {/* Ambient floating elements */}
        <div className="absolute -left-32 top-1/4 h-[400px] w-[400px] rounded-full bg-indigo-500/5 blur-3xl pointer-events-none animate-pulse"></div>
        <div className="absolute -right-32 bottom-1/4 h-[300px] w-[300px] rounded-full bg-violet-500/5 blur-3xl pointer-events-none animate-pulse"></div>
        
        <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 w-full z-10">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-8 items-center">
            
            {/* Left Column Content */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-center lg:text-left lg:col-span-7"
            >
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-950 bg-[#16192a]/80 px-4 py-1.5 text-xs text-indigo-400 font-semibold select-none">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-400"></span>
                </span>
                Système ERP Académique pour l'ESTIN
              </div>
              
              <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl leading-[1.15]">
                Le Portail Académique <span className="text-indigo-400 bg-gradient-to-r from-indigo-400 via-purple-300 to-fuchsia-400 bg-clip-text text-transparent">Centralisé</span>
              </h1>
              
              <p className="mt-6 text-base sm:text-lg leading-relaxed text-gray-400 max-w-2xl mx-auto lg:mx-0 font-medium">
                Accédez instantanément à vos emplois du temps, notes, documents officiels et plus encore. 
                Une interface conversationnelle unique adaptée à votre profil d'étudiant ou de professeur.
              </p>
              
              <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
                <button 
                  onClick={onStartAuth} 
                  className="bg-indigo-500 text-[#0d0f1c] hover:bg-indigo-400 px-6 py-3.5 rounded-xl font-bold hover:scale-105 active:scale-95 transition-all shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 cursor-pointer"
                >
                  Commencer Maintenant
                  <ArrowRight className="h-5 w-5" />
                </button>
                <a 
                  href="#features" 
                  className="border border-indigo-950/60 bg-[#131526] text-white hover:bg-indigo-950/30 px-6 py-3.5 rounded-xl font-bold transition-colors text-center"
                >
                  En Savoir Plus
                </a>
              </div>

              {/* Stats Grid */}
              <div className="mt-16 grid grid-cols-3 gap-8 border-t border-indigo-950 pt-8 max-w-md mx-auto lg:mx-0">
                <div>
                  <p className="text-3xl font-extrabold text-white">24/7</p>
                  <p className="mt-1 text-xs text-gray-500 font-semibold uppercase tracking-wider">Disponibilité</p>
                </div>
                <div>
                  <p className="text-3xl font-extrabold text-[#7c3aed]">3</p>
                  <p className="mt-1 text-xs text-gray-500 font-semibold uppercase tracking-wider">Profils Rôles</p>
                </div>
                <div>
                  <p className="text-3xl font-extrabold text-emerald-400">100%</p>
                  <p className="mt-1 text-xs text-gray-500 font-semibold uppercase tracking-wider">Sécurisé</p>
                </div>
              </div>
            </motion.div>

            {/* Right Column Content - Fully Interactive Mock-up Chat */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="relative w-full max-w-md mx-auto lg:max-w-none lg:col-span-5 relative mt-6 lg:mt-0"
            >
              <div className="relative rounded-2xl border border-indigo-950 bg-[#16192a]/95 p-1 shadow-2xl overflow-hidden backdrop-blur-md">
                <div className="rounded-xl bg-[#0d0f1c]/80 overflow-hidden">
                  
                  {/* Chat Head Header */}
                  <div className="flex items-center gap-3 border-b border-indigo-950 px-4 py-3 bg-[#111322]">
                    <div className="flex h-10 w-10 items-center justify-center shrink-0">
                      <Logo size={36} variant="emblem" />
                    </div>
                    <div>
                      <p className="font-bold text-white text-sm">EstiNova</p>
                      <p className="text-[10px] text-emerald-400 flex items-center gap-1 font-semibold">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        En ligne — Portail démo interactif
                      </p>
                    </div>
                  </div>

                  {/* Chat Messages list */}
                  <div className="h-[280px] overflow-y-auto p-4 space-y-4 text-xs scrollbar-none flex flex-col">
                    {demoMessages.map((msg) => (
                      <div 
                        key={msg.id} 
                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div 
                          className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-md font-medium leading-relaxed ${
                            msg.sender === 'user' 
                              ? 'bg-indigo-500 text-[#0d0f1c] rounded-tr-none' 
                              : 'bg-[#1e2238] text-gray-100 border border-indigo-950/40 rounded-tl-none'
                          }`}
                        >
                          {msg.text}
                        </div>
                      </div>
                    ))}
                    
                    {/* Simulated typing dot effect */}
                    {isDemoTyping && (
                      <div className="flex justify-start">
                        <div className="flex items-center gap-1.5 bg-[#1e2238] rounded-2xl px-4 py-3.5 border border-indigo-950/40">
                          <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Small preset suggestions tags to help the user click */}
                  <div className="px-4 pb-2 pt-1 flex flex-wrap gap-1.5 bg-[#0d0f1c]/40 border-t border-[#1e2238]">
                    <button 
                      onClick={() => setDemoInput("Mon emploi du temps")}
                      className="text-[10px] bg-[#161a2f] text-indigo-300 hover:bg-[#1e2238] px-2 py-1 rounded-md border border-[#1e2238] font-medium transition-all"
                    >
                      📅 Planning
                    </button>
                    <button 
                      onClick={() => setDemoInput("Mes notes")}
                      className="text-[10px] bg-[#161a2f] text-[#a78bfa] hover:bg-[#1e2238] px-2 py-1 rounded-md border border-[#1e2238] font-medium transition-all"
                    >
                      🎓 Notes
                    </button>
                    <button 
                      onClick={() => setDemoInput("absence")}
                      className="text-[10px] bg-[#161a2f] text-emerald-400 hover:bg-[#1e2238] px-2 py-1 rounded-md border border-[#1e2238] font-medium transition-all"
                    >
                      ⏱ Absences
                    </button>
                  </div>

                  {/* Interacted Form input */}
                  <form onSubmit={handleSendDemoMessage} className="border-t border-indigo-950 p-3.5 bg-[#111322]">
                    <div className="flex items-center gap-2">
                      <input
                        value={demoInput}
                        onChange={(e) => setDemoInput(e.target.value)}
                        type="text"
                        placeholder="Posez votre question de démo..."
                        className="flex-1 rounded-xl border border-indigo-950 bg-[#0d0f1c] px-4 py-2.5 text-xs text-[#f9fafb] placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                      <button 
                        type="submit" 
                        className="h-9 w-9 shrink-0 flex items-center justify-center rounded-xl bg-indigo-500 text-[#0d0f1c] hover:bg-indigo-400 transition-all active:scale-95 cursor-pointer"
                      >
                        <Send className="h-4 w-4" />
                      </button>
                    </div>
                  </form>

                </div>
              </div>
              
              {/* Decorative back framing shadow */}
              <div className="absolute -bottom-4 -left-4 -z-10 h-full w-full rounded-2xl border border-indigo-500/10 pointer-events-none"></div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 3. Features Section */}
      <section id="features" className="relative py-28 border-y border-indigo-950/40 scroll-mt-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-xs font-extrabold uppercase tracking-wider text-indigo-400">Fonctionnalités</p>
            <h2 className="mt-3 text-3xl font-extrabold text-white sm:text-4xl tracking-tight">Tout ce dont vous avez besoin, en un seul endroit</h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm md:text-base text-gray-400 font-medium">
              EstiNova centralise tous les flux d'informations pédagogiques et administratifs de l'ESTIN en un point d'entrée conversationnel unique.
            </p>
          </div>

          {/* Grid setup */}
          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            
            {/* Card 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.0, ease: "easeOut" }}
              className="group relative overflow-hidden rounded-2xl border border-indigo-950/80 bg-[#16192a]/60 p-6 transition-all hover:-translate-y-1 hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/5"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none"></div>
              <div className="relative">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#0f111c] border border-indigo-950 group-hover:rotate-6 transition-transform">
                  <Calendar className="h-6 w-6 text-indigo-400" />
                </div>
                <h3 className="mb-2 text-lg font-bold text-white">Emploi du Temps</h3>
                <p className="text-xs md:text-sm leading-relaxed text-gray-400 font-medium">Consultez votre emploi du temps pour n'importe quel jour, avec horaires et salles en temps réel.</p>
              </div>
            </motion.div>

            {/* Card 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
              className="group relative overflow-hidden rounded-2xl border border-indigo-950/80 bg-[#16192a]/60 p-6 transition-all hover:-translate-y-1 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/5"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none"></div>
              <div className="relative">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#0f111c] border border-indigo-950 group-hover:rotate-6 transition-transform">
                  <GraduationCap className="h-6 w-6 text-purple-400" />
                </div>
                <h3 className="mb-2 text-lg font-bold text-white">Résultats Académiques</h3>
                <p className="text-xs md:text-sm leading-relaxed text-gray-400 font-medium">Accédez à vos notes par matière et obtenez automatiquement le calcul de votre moyenne pondérée.</p>
              </div>
            </motion.div>

            {/* Card 3 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              className="group relative overflow-hidden rounded-2xl border border-indigo-950/80 bg-[#16192a]/60 p-6 transition-all hover:-translate-y-1 hover:border-[#a78bfa]/50 hover:shadow-lg hover:shadow-[#a78bfa]/5"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#a78bfa]/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none"></div>
              <div className="relative">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#0f111c] border border-indigo-950 group-hover:rotate-6 transition-transform">
                  <FileText className="h-6 w-6 text-[#a78bfa]" />
                </div>
                <h3 className="mb-2 text-lg font-bold text-white">Documentation</h3>
                <p className="text-xs md:text-sm leading-relaxed text-gray-400 font-medium">Posez des questions sur le règlement intérieur et obtenez des réponses extraites des documents officiels.</p>
              </div>
            </motion.div>

            {/* Card 4 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.0, ease: "easeOut" }}
              className="group relative overflow-hidden rounded-2xl border border-indigo-950/80 bg-[#16192a]/60 p-6 transition-all hover:-translate-y-1 hover:border-violet-500/50 hover:shadow-lg hover:shadow-violet-500/5"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none"></div>
              <div className="relative">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#0f111c] border border-indigo-950 group-hover:rotate-6 transition-transform">
                  <Users className="h-6 w-6 text-violet-400" />
                </div>
                <h3 className="mb-2 text-lg font-bold text-white">Annuaire</h3>
                <p className="text-xs md:text-sm leading-relaxed text-gray-400 font-medium">Trouvez le groupe et la section d'un camarade ou l'email de contact d'un enseignant.</p>
              </div>
            </motion.div>

            {/* Card 5 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
              className="group relative overflow-hidden rounded-2xl border border-indigo-950/80 bg-[#16192a]/60 p-6 transition-all hover:-translate-y-1 hover:border-[#6366f1]/50 hover:shadow-lg hover:shadow-[#6366f1]/5"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#6366f1]/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none"></div>
              <div className="relative">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#0f111c] border border-indigo-950 group-hover:rotate-6 transition-transform">
                  <Mail className="h-6 w-6 text-[#6366f1]" />
                </div>
                <h3 className="mb-2 text-lg font-bold text-white">Communication</h3>
                <p className="text-xs md:text-sm leading-relaxed text-gray-400 font-medium">Demandez la rédaction et l'envoi d'emails formels à vos enseignants directement via l'assistant.</p>
              </div>
            </motion.div>

            {/* Card 6 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              className="group relative overflow-hidden rounded-2xl border border-indigo-950/80 bg-[#16192a]/60 p-6 transition-all hover:-translate-y-1 hover:border-indigo-400/50 hover:shadow-lg hover:shadow-indigo-400/5"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-400/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none"></div>
              <div className="relative">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#0f111c] border border-indigo-950 group-hover:rotate-6 transition-transform">
                  <BookOpen className="h-6 w-6 text-indigo-400" />
                </div>
                <h3 className="mb-2 text-lg font-bold text-white">Aide Pédagogique</h3>
                <p className="text-xs md:text-sm leading-relaxed text-gray-400 font-medium">Obtenez de l'aide sur des exercices de programmation, des problèmes mathématiques ou la rédaction.</p>
              </div>
            </motion.div>

          </div>

          {/* Highlights Info Cards */}
          <div className="mt-20 rounded-2xl border border-indigo-950/80 bg-gradient-to-b from-[#16192a]/40 to-[#0d0f1c]/10 p-8 lg:p-12">
            <div className="grid gap-8 md:grid-cols-3">
              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 border border-indigo-950">
                  <Shield className="h-6 w-6 text-indigo-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Sécurité Maximale</h3>
                  <p className="mt-1.5 text-xs text-gray-400 leading-relaxed font-semibold">Matrice de contrôle d'accès stricte et protection contre le social engineering.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 border border-indigo-950">
                  <Globe className="h-6 w-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Multilingue</h3>
                  <p className="mt-1.5 text-xs text-gray-400 leading-relaxed font-semibold">Support du français, de la darija et de l'anglais avec détection automatique.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#7c3aed]/10 border border-indigo-950">
                  <Zap className="h-6 w-6 text-[#a78bfa]" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Réponse Instantanée</h3>
                  <p className="mt-1.5 text-xs text-gray-400 leading-relaxed font-semibold">Architecture RAG hybride pour des réponses précises et hautement contextuelles.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 4. Users Section */}
      <section id="users" className="relative py-28 bg-gradient-to-b from-[#0d0f1c] to-[#121424]/40 scroll-mt-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-xs font-extrabold uppercase tracking-wider text-[#a78bfa]">Utilisateurs</p>
            <h2 className="mt-3 text-3xl font-extrabold text-white sm:text-4xl tracking-tight">Une expérience adaptée à chaque profil</h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm md:text-base text-gray-400 font-medium font-medium">
              Grâce à l'authentification silencieuse, EstiNova reconnaît automatiquement votre rôle et adapte l'intégralité de ses réponses en conséquence.
            </p>
          </div>

          {/* User Type Tabs Switcher */}
          <div className="mt-12 flex justify-center">
            <div className="inline-flex rounded-xl border border-indigo-950 bg-[#111322] p-1">
              <button 
                onClick={() => setActiveTab('student')} 
                className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === 'student' 
                    ? 'bg-indigo-500 text-[#0d0f1c] shadow' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <GraduationCap className="h-4 w-4" />
                <span>Étudiants</span>
              </button>
              
              <button 
                onClick={() => setActiveTab('professor')} 
                className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === 'professor' 
                    ? 'bg-indigo-500 text-[#0d0f1c] shadow' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Briefcase className="h-4 w-4" />
                <span>Professeurs</span>
              </button>

              <button 
                onClick={() => setActiveTab('admin')} 
                className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === 'admin' 
                    ? 'bg-indigo-500 text-[#0d0f1c] shadow' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Settings className="h-4 w-4" />
                <span>Administration</span>
              </button>
            </div>
          </div>

          {/* User Details Tabs Container */}
          <div className="mt-12">
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
              
              {/* Left Column info details */}
              <div>
                <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-[#161a2f] border border-indigo-950/60 px-4 py-1.5">
                  {activeTab === 'student' && <GraduationCap className="h-5 w-5 text-indigo-400" />}
                  {activeTab === 'professor' && <Briefcase className="h-5 w-5 text-indigo-400" />}
                  {activeTab === 'admin' && <Settings className="h-5 w-5 text-indigo-400" />}
                  <span className="text-xs font-bold text-white">{selectedTabData.subtitle}</span>
                </div>
                
                <h3 className="text-2xl font-bold text-white sm:text-3xl">{selectedTabData.title}</h3>
                <p className="mt-4 text-sm md:text-base text-gray-400 leading-relaxed font-medium">{selectedTabData.description}</p>
                
                <ul className="mt-8 space-y-3">
                  {selectedTabData.features.map((feat, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-950">
                        <Check className="h-4 w-4" />
                      </div>
                      <span className="text-xs md:text-sm text-gray-300 font-medium">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Right Column visual demo code replies cards */}
              <div className="relative">
                <div className="rounded-2xl border border-indigo-950 bg-[#16192a]/95 p-6 lg:p-8 backdrop-blur-md">
                  <div className="space-y-4">
                    
                    <div className="rounded-xl bg-[#0d0f1c]/90 border border-indigo-950/50 p-4">
                      <p className="text-[10px] text-gray-500 font-extrabold uppercase tracking-widest mb-2">Exemple de requête</p>
                      <p className="text-[#f9fafb] font-semibold text-xs md:text-sm italic">{selectedTabData.query}</p>
                    </div>

                    <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-4">
                      <p className="text-[10px] text-indigo-400 font-extrabold uppercase tracking-widest mb-2">Réponse EstiNova</p>
                      <p className="text-xs text-gray-200 leading-relaxed font-medium">{selectedTabData.reply}</p>
                    </div>

                    <div className="flex items-center justify-between rounded-xl bg-[#0d0f1c]/40 border border-indigo-950/30 px-4 py-3">
                      <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Niveau d'accès</span>
                      <span className="text-xs font-extrabold text-indigo-400 uppercase tracking-widest px-2.5 py-1 bg-indigo-500/10 rounded-md border border-indigo-500/20">{selectedTabData.access}</span>
                    </div>

                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 5. Architecture Section */}
      <section id="architecture" className="relative py-28 scroll-mt-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-xs font-extrabold uppercase tracking-wider text-indigo-400">Architecture</p>
            <h2 className="mt-3 text-3xl font-extrabold text-white sm:text-4xl tracking-tight">Une architecture modulaire évolutive</h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm md:text-base text-gray-400 font-medium">
              Le cœur d'EstiNova repose sur une architecture modulaire orchestrée par un noyau central, conçue pour s'adapter à l'ajout de nouvelles fonctionnalités.
            </p>
          </div>

          {/* Step flow chart */}
          <div className="mt-16">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              
              {/* Step 1 */}
              <div className="relative rounded-2xl border border-indigo-950 bg-[#16192a]/50 p-6">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-xs font-extrabold text-indigo-400">01</span>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0d0f1c] border border-indigo-950">
                    <Globe className="h-5 w-5 text-indigo-400" />
                  </div>
                </div>
                <h3 className="mb-2 font-bold text-white text-sm md:text-base">Interface Utilisateur</h3>
                <p className="text-xs text-gray-400 leading-relaxed font-medium">L'utilisateur soumet un message via le widget chatbot intégré au portail web.</p>
              </div>

              {/* Step 2 */}
              <div className="relative rounded-2xl border border-indigo-950 bg-[#16192a]/50 p-6">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-xs font-extrabold text-indigo-400">02</span>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0d0f1c] border border-indigo-950">
                    <Shield className="h-5 w-5 text-indigo-400" />
                  </div>
                </div>
                <h3 className="mb-2 font-bold text-white text-sm md:text-base">Authentification</h3>
                <p className="text-xs text-gray-400 leading-relaxed font-medium">Le système récupère automatiquement le profil complet via l'authentification.</p>
              </div>

              {/* Step 3 */}
              <div className="relative rounded-2xl border border-indigo-950 bg-[#16192a]/50 p-6">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-xs font-extrabold text-[#7c3aed]">03</span>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0d0f1c] border border-indigo-950">
                    <Activity className="h-5 w-5 text-[#a78bfa]" />
                  </div>
                </div>
                <h3 className="mb-2 font-bold text-white text-sm md:text-base">Orchestrateur Central</h3>
                <p className="text-xs text-gray-400 leading-relaxed font-medium">L'orchestrateur principal détermine quel module spécialisé appeler selon le profil.</p>
              </div>

              {/* Step 4 */}
              <div className="relative rounded-2xl border border-indigo-950 bg-[#16192a]/50 p-6">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-xs font-extrabold text-[#7c3aed]">04</span>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0d0f1c] border border-indigo-950">
                    <Database className="h-5 w-5 text-[#a78bfa]" />
                  </div>
                </div>
                <h3 className="mb-2 font-bold text-white text-sm md:text-base">Retrieval de Données</h3>
                <p className="text-xs text-gray-400 leading-relaxed font-medium">Le système interroge les sources adaptées : base documentaire ou bases scolaires.</p>
              </div>

            </div>
          </div>

          {/* Tech Stack Breakdown */}
          <div className="mt-20">
            <h3 className="text-center text-lg md:text-xl font-bold text-white mb-8">Stack Technologique du Projet</h3>
            <div className="grid gap-6 md:grid-cols-3">
              
              {/* Card 1 */}
              <div className="rounded-2xl border border-indigo-950 bg-[#16192a]/40 p-6">
                <div className="mb-4 flex items-center gap-3">
                  <Cpu className="h-5 w-5 text-indigo-400" />
                  <h4 className="font-bold text-white text-sm md:text-base">Traitement & Langage</h4>
                </div>
                <div className="space-y-3 text-xs md:text-sm">
                  <div className="flex items-center justify-between rounded-lg bg-[#0d0f1c]/60 border border-indigo-950/40 px-4 py-2.5">
                    <span className="font-medium text-gray-200">n8n Workflow</span>
                    <span className="text-xs text-gray-500 font-semibold">Orchestration</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-[#0d0f1c]/60 border border-indigo-950/40 px-4 py-2.5">
                    <span className="font-medium text-gray-200">Moteur de Traitement</span>
                    <span className="text-xs text-gray-500 font-semibold">Analyse de Requête</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-[#0d0f1c]/60 border border-indigo-950/40 px-4 py-2.5">
                    <span className="font-medium text-gray-200">Moteur de Recherche</span>
                    <span className="text-xs text-gray-500 font-semibold">Retrieval</span>
                  </div>
                </div>
              </div>

              {/* Card 2 */}
              <div className="rounded-2xl border border-indigo-950 bg-[#16192a]/40 p-6">
                <div className="mb-4 flex items-center gap-3">
                  <Database className="h-5 w-5 text-purple-400" />
                  <h4 className="font-bold text-white text-sm md:text-base">Données & Base</h4>
                </div>
                <div className="space-y-3 text-xs md:text-sm">
                  <div className="flex items-center justify-between rounded-lg bg-[#0d0f1c]/60 border border-indigo-950/40 px-4 py-2.5">
                    <span className="font-medium text-gray-200">Base Documentaire</span>
                    <span className="text-xs text-gray-500 font-semibold">Documents PDF</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-[#0d0f1c]/60 border border-indigo-950/40 px-4 py-2.5">
                    <span className="font-medium text-gray-200">Google Sheets API</span>
                    <span className="text-xs text-gray-500 font-semibold">Données ERP</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-[#0d0f1c]/60 border border-indigo-950/40 px-4 py-2.5">
                    <span className="font-medium text-gray-200">Supabase DB</span>
                    <span className="text-xs text-gray-500 font-semibold">Profiles & Auth</span>
                  </div>
                </div>
              </div>

              {/* Card 3 */}
              <div className="rounded-2xl border border-indigo-950 bg-[#16192a]/40 p-6">
                <div className="mb-4 flex items-center gap-3">
                  <Server className="h-5 w-5 text-[#a78bfa]" />
                  <h4 className="font-bold text-white text-sm md:text-base">Sécurité & API</h4>
                </div>
                <div className="space-y-3 text-xs md:text-sm">
                  <div className="flex items-center justify-between rounded-lg bg-[#0d0f1c]/60 border border-indigo-950/40 px-4 py-2.5">
                    <span className="font-medium text-gray-200">HTTPS SSL/TLS</span>
                    <span className="text-xs text-gray-500 font-semibold">Chiffrement</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-[#0d0f1c]/60 border border-indigo-950/40 px-4 py-2.5">
                    <span className="font-medium text-gray-200">Supabase Auth</span>
                    <span className="text-xs text-gray-500 font-semibold">Silencieux & Sécurisé</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-[#0d0f1c]/60 border border-indigo-950/40 px-4 py-2.5">
                    <span className="font-medium text-gray-200">RBAC Controls</span>
                    <span className="text-xs text-gray-500 font-semibold">Permissions</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* RAG pipeline custom info block */}
          <div className="mt-20 rounded-2xl border border-indigo-505/20 bg-indigo-500/5 p-8 lg:p-12">
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-white">Pipeline de Recherche Documentaire Hybride</h3>
                <p className="mt-4 text-xs md:text-sm text-gray-400 leading-relaxed font-medium">
                  Le pipeline de recherche documentaire d'EstiNova permet d'interroger les documents de l'ESTIN en langage naturel avec une précision maximale et une intégrité totale.
                </p>
                <ul className="mt-6 space-y-3.5 text-xs md:text-sm">
                  <li className="flex items-start gap-3">
                    <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-indigo-400 shrink-0"></div>
                    <span className="text-gray-300 font-medium"><strong>Indexation automatique :</strong> Tout nouveau document déposé est indexé et découpé en morceaux sémantiques hautement précis.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-indigo-400 shrink-0"></div>
                    <span className="text-gray-300 font-medium"><strong>Recherche sémantique :</strong> Les passages de règlements ou calendriers les plus pertinents sont indexés et transférés aux modules.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-indigo-400 shrink-0"></div>
                    <span className="text-gray-300 font-medium"><strong>Intégrité des réponses :</strong> Si aucune information n'est recensée dans les ressources fournies, le système l'indique explicitement.</span>
                  </li>
                </ul>
              </div>

              <div className="relative">
                <div className="rounded-xl border border-indigo-950 bg-[#0d0f1c]/80 p-6 shadow-md">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-[10px] font-extrabold justify-center select-none uppercase tracking-widest text-indigo-400">
                      <div className="h-8 w-12 rounded bg-[#16192a] flex items-center justify-center border border-indigo-950">
                        <span>PDF</span>
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-600" />
                      <div className="h-8 w-12 rounded bg-[#16192a] flex items-center justify-center border border-indigo-950">
                        <span>IDX</span>
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-600" />
                      <div className="h-8 w-12 rounded bg-[#16192a] flex items-center justify-center border border-indigo-950">
                        <span>DB</span>
                      </div>
                    </div>
                    <div className="h-px bg-indigo-950/60" />
                    <div className="text-xs text-gray-400 font-medium text-center">
                      Documents officiels indexés : Règlement d'études intérieure, Calendrier des examens, Programmes scolaires 2CP/CS.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 6. Team Section ("À propos") */}
      <section id="about" className="relative py-28 bg-gradient-to-b from-transparent to-[#101221]/50 border-t border-indigo-950/40 scroll-mt-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="text-center">
            <p className="text-xs font-extrabold uppercase tracking-wider text-indigo-400">L'Équipe</p>
            <h2 className="mt-3 text-3xl font-extrabold text-white sm:text-4xl tracking-tight">Les esprits derrière EstiNova</h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm md:text-base text-gray-400 font-medium">
              Un projet pluridisciplinaire de portail académique intégré développé avec dévouement par les étudiants de la promotion 2CP de l'ESTIN Béjaïa.
            </p>
          </div>

          {/* Core Members Grid Cards */}
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            
            {/* Member 1: Badis */}
            <div className="group rounded-2xl border border-indigo-950/65 bg-[#161a2f]/40 p-6 transition-all hover:border-indigo-500/40 hover:shadow-lg hover:shadow-indigo-500/5">
              <div className="mb-4 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500/20 transition-colors">
                  <Bot className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm md:text-base">Boudjaoui Badis</h3>
                  <p className="text-[10px] md:text-xs text-indigo-400 font-bold uppercase tracking-widest">Chef de Projet & Ingénieur Logiciel</p>
                </div>
              </div>
              <p className="text-xs md:text-sm text-gray-400 leading-relaxed min-h-[48px] font-medium">
                Concepteur principal, orchestration du système et des modules intégrés, architecture ERP et supervision générale.
              </p>
              <div className="mt-4 flex gap-3 pt-3 border-t border-indigo-950/30">
                <a href="https://github.com/Badis-Boudjaoui" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors">
                  <Github className="h-4.5 w-4.5" />
                </a>
                <a href="https://linkedin.com/in/badis" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors">
                  <Linkedin className="h-4.5 w-4.5" />
                </a>
              </div>
            </div>

            {/* Member 2: Israa */}
            <div className="group rounded-2xl border border-indigo-950/65 bg-[#161a2f]/40 p-6 transition-all hover:border-indigo-500/40 hover:shadow-lg hover:shadow-indigo-500/5">
              <div className="mb-4 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500/20 transition-colors">
                  <Bot className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm md:text-base">Chiheb Israa</h3>
                  <p className="text-[10px] md:text-xs text-indigo-400 font-bold uppercase tracking-widest">Ingénieur R&D</p>
                </div>
              </div>
              <p className="text-xs md:text-sm text-gray-400 leading-relaxed min-h-[48px] font-medium">
                Développement backend avancé, configuration de l'indexation sémantique, optimisation de la base documentaire.
              </p>
              <div className="mt-4 flex gap-3 pt-3 border-t border-indigo-950/30">
                <a href="https://github.com/itsmeisraa" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors">
                  <Github className="h-4.5 w-4.5" />
                </a>
                <a href="https://www.linkedin.com/in/israa-chiheb-aaa3b837a/" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors">
                  <Linkedin className="h-4.5 w-4.5" />
                </a>
              </div>
            </div>

            {/* Member 3: Wiam */}
            <div className="group rounded-2xl border border-indigo-950/65 bg-[#161a2f]/40 p-6 transition-all hover:border-indigo-500/40 hover:shadow-lg hover:shadow-indigo-500/5">
              <div className="mb-4 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500/20 transition-colors">
                  <Palette className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm md:text-base">Gougam Wiam</h3>
                  <p className="text-[10px] md:text-xs text-indigo-400 font-bold uppercase tracking-widest">Frontend Developer</p>
                </div>
              </div>
              <p className="text-xs md:text-sm text-gray-400 leading-relaxed min-h-[48px] font-medium">
                Développement du portail et intégrations Web, maquettage UI/UX, structures adaptatives et réactives des interfaces.
              </p>
              <div className="mt-4 flex gap-3 pt-3 border-t border-indigo-950/30">
                <a href="https://github.com/wiam-gm" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors">
                  <Github className="h-4.5 w-4.5" />
                </a>
                <a href="https://linkedin.com/in/wiam" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors">
                  <Linkedin className="h-4.5 w-4.5" />
                </a>
              </div>
            </div>

            {/* Member 4: Anias */}
            <div className="group rounded-2xl border border-indigo-950/65 bg-[#161a2f]/40 p-6 transition-all hover:border-indigo-500/40 hover:shadow-lg hover:shadow-indigo-500/5">
              <div className="mb-4 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500/20 transition-colors">
                  <Server className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm md:text-base">Mansouri Anias</h3>
                  <p className="text-[10px] md:text-xs text-indigo-400 font-bold uppercase tracking-widest">Backend Developer</p>
                </div>
              </div>
              <p className="text-xs md:text-sm text-gray-400 leading-relaxed min-h-[48px] font-medium">
                Gestion de l'authentification silencieuse, conception des APIs, Webhooks, et sécurisation des protocoles d'échanges.
              </p>
              <div className="mt-4 flex gap-3 pt-3 border-t border-indigo-950/30">
                <a href="https://github.com/anias" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors">
                  <Github className="h-4.5 w-4.5" />
                </a>
                <a href="https://linkedin.com/in/anias" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors">
                  <Linkedin className="h-4.5 w-4.5" />
                </a>
              </div>
            </div>

            {/* Member 5: Axcel */}
            <div className="group rounded-2xl border border-indigo-950/65 bg-[#161a2f]/40 p-6 transition-all hover:border-indigo-500/40 hover:shadow-lg hover:shadow-indigo-500/5">
              <div className="mb-4 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500/20 transition-colors">
                  <Database className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm md:text-base">Hamadouche Axcel</h3>
                  <p className="text-[10px] md:text-xs text-indigo-400 font-bold uppercase tracking-widest">Data Analyst</p>
                </div>
              </div>
              <p className="text-xs md:text-sm text-gray-400 leading-relaxed min-h-[48px] font-medium">
                Nettoyage des tables de scolarité, restructuration de la base de données relationnelle, et intégrité des données d'études.
              </p>
              <div className="mt-4 flex gap-3 pt-3 border-t border-indigo-950/30">
                <a href="https://github.com/Axcelcr7" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors">
                  <Github className="h-4.5 w-4.5" />
                </a>
                <a href="https://linkedin.com/in/axcel" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors">
                  <Linkedin className="h-4.5 w-4.5" />
                </a>
              </div>
            </div>

            {/* Member 6: Walid */}
            <div className="group rounded-2xl border border-indigo-950/65 bg-[#161a2f]/40 p-6 transition-all hover:border-indigo-500/40 hover:shadow-lg hover:shadow-indigo-500/5">
              <div className="mb-4 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500/20 transition-colors">
                  <Shield className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm md:text-base">Naceri Walid</h3>
                  <p className="text-[10px] md:text-xs text-indigo-400 font-bold uppercase tracking-widest">Data Analyst</p>
                </div>
              </div>
              <p className="text-xs md:text-sm text-gray-400 leading-relaxed min-h-[48px] font-medium">
                Alimentation et gestion fine du Vector Store, conformité RGPD, et analyse analytique des logs d'utilisation.
              </p>
              <div className="mt-4 flex gap-3 pt-3 border-t border-indigo-950/30">
                <a href="https://github.com/walid" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors">
                  <Github className="h-4.5 w-4.5" />
                </a>
                <a href="https://linkedin.com/in/walid" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors">
                  <Linkedin className="h-4.5 w-4.5" />
                </a>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 7. Footer */}
      <footer className="border-t border-indigo-950 bg-[#0d0f1c] shrink-0">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-4">
            
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2">
                <Logo size={32} variant="emblem" />
                <span className="text-xl font-bold text-white">Esti<span className="text-indigo-400">Nova</span></span>
              </div>
              <p className="mt-4 max-w-md text-xs md:text-sm text-gray-400 leading-relaxed font-semibold">
                Le Portail Académique Centralisé de l'ESTIN Béjaïa. Un système ERP conçu pour unifier tous les flux d'informations pédagogiques et administratives.
              </p>
              <p className="mt-4 text-xs text-gray-500 font-bold uppercase tracking-wider">
                École Supérieure en Sciences et Technologies de l'Informatique - ESTIN
              </p>
            </div>

            <div>
              <h4 className="font-bold text-white text-xs md:text-sm uppercase tracking-wider">Navigation</h4>
              <ul className="mt-4 space-y-3 text-xs md:text-sm">
                <li><a href="#features" className="text-gray-400 hover:text-white transition-colors">Fonctionnalités</a></li>
                <li><a href="#users" className="text-gray-400 hover:text-white transition-colors">Utilisateurs</a></li>
                <li><a href="#architecture" className="text-gray-400 hover:text-white transition-colors">Architecture</a></li>
                <li><a href="#about" className="text-gray-400 hover:text-white transition-colors">À Propos</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white text-xs md:text-sm uppercase tracking-wider font-semibold">Projet Académique</h4>
              <ul className="mt-4 space-y-3 text-xs text-gray-400 font-semibold">
                <li>Module : Projets Pluridisciplinaires</li>
                <li>Niveau : 2ème Année CP</li>
                <li>Année Académique : 2025/2026</li>
              </ul>
            </div>

          </div>

          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-indigo-950 pt-8 sm:flex-row text-[11px] text-gray-500 select-none">
            <p>© 2026 EstiNova • Projet promotionnel 2CP ESTIN Béjaïa</p>
            <p>Développé avec ❤️ pour l'ESTIN</p>
          </div>
        </div>
      </footer>

    </div>
  );
}
