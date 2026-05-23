import React, { useState, useEffect } from 'react';
import { Message } from '../types';
import RenderedMessage from './RenderedMessage';
import Logo from './Logo';
import { Bot, User, AlertTriangle, Volume2, Clock, FileText, RefreshCw, VolumeX, Copy, Check } from 'lucide-react';

interface ChatMessageProps {
  key?: string;
  message: Message;
  isLastMessage: boolean;
  onRewrite: (text: string) => void;
  userAvatar?: string | null;
}

export default function ChatMessage({ message, isLastMessage, onRewrite, userAvatar }: ChatMessageProps) {
  const isAssistant = message.role === 'assistant';
  const isError = message.isError;
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Erreur lors de la copie', err);
    }
  };

  const handlePlayAudio = async () => {
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    setIsPlaying(true);
    let cleanText = message.content
      .replace(/[*#_`~]/g, '')
      .replace(/\\[[\s\S]*?\\]/g, ' Formule mathématique ')
      .replace(/\$\$[\s\S]*?\$\$/g, ' Formule mathématique ')
      .replace(/\\/g, '');

    // Standard Azure keys (or custom text-to-speech fallback)
    const AZURE_KEY = 'TA_CLE_AZURE_ICI';
    const AZURE_REGION = 'francecentral';
    const url = `https://${AZURE_REGION}.tts.speech.microsoft.com/cognitiveservices/v1`;
    const ssml = `<speak version='1.0' xml:lang='fr-FR'><voice xml:lang='fr-FR' name='fr-FR-DeniseNeural'>${cleanText}</voice></speak>`;

    try {
      if (AZURE_KEY === 'TA_CLE_AZURE_ICI') {
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.lang = 'fr-FR';
        utterance.onend = () => setIsPlaying(false);
        utterance.onerror = () => setIsPlaying(false);
        window.speechSynthesis.speak(utterance);
        return;
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Ocp-Apim-Subscription-Key': AZURE_KEY,
          'Content-Type': 'application/ssml+xml',
          'X-Microsoft-OutputFormat': 'audio-16khz-128kbitrate-mono-mp3',
        },
        body: ssml,
      });

      if (!response.ok) throw new Error('Erreur avec Azure TTS');
      const blob = await response.blob();
      const audio = new Audio(window.URL.createObjectURL(blob));
      audio.onended = () => setIsPlaying(false);
      audio.onerror = () => setIsPlaying(false);
      audio.play();
    } catch (error) {
      console.error('Erreur de lecture TTS, essai du fallback Synthesizer:', error);
      try {
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.lang = 'fr-FR';
        utterance.onend = () => setIsPlaying(false);
        utterance.onerror = () => setIsPlaying(false);
        window.speechSynthesis.speak(utterance);
      } catch (err) {
        setIsPlaying(false);
      }
    }
  };

  useEffect(() => {
    if (isAssistant && !isError && isLastMessage && !hasPlayed && message.shouldSpeak) {
      setHasPlayed(true);
      handlePlayAudio();
    }
  }, [isAssistant, isError, isLastMessage, message.shouldSpeak]);

  // Clean-up speech synthesis on unmount to prevent lingering audio loops
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const formatTime = (ms?: number) => {
    if (!ms) return null;
    return ms < 1000 ? `${ms}ms` : `${(ms / 1000).toFixed(1)}s`;
  };

  return (
    <div className="w-full py-4 md:py-5 animate-fade-in border-b border-[var(--border-color)]/25 last:border-0 hover:bg-white/[0.01] transition-all">
      <div className="max-w-3xl mx-auto px-4 md:px-6 flex gap-3.5 md:gap-5">
        <div className="w-9 h-9 flex items-center justify-center shrink-0 mt-0.5">
          {isError ? (
            <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-red-500/10 text-red-500 border border-red-500/20">
              <AlertTriangle className="w-5 h-5 shrink-0" />
            </div>
          ) : isAssistant ? (
            <Logo size={36} variant="emblem" />
          ) : userAvatar ? (
            <img
              src={userAvatar}
              alt="Profile"
              className="w-9 h-9 rounded-xl object-cover border border-indigo-500/25 shadow-md shadow-indigo-500/10 select-none animate-fade-in"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-[var(--bg-input)] text-[var(--text-muted)] border border-[var(--border-color)]/40">
              <User className="w-5 h-5 shrink-0" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="font-semibold text-sm text-[var(--text-title)]">
              {isAssistant ? 'EstiNova' : 'Vous'}
            </div>

            {isAssistant && !isError && (
              <button
                onClick={handlePlayAudio}
                className="p-1 rounded-lg hover:bg-white/5 transition-colors flex items-center gap-1 cursor-pointer"
                style={isPlaying ? { backgroundColor: 'rgba(79,70,229,0.2)', color: '#818cf8' } : { color: 'var(--text-muted)' }}
                title={isPlaying ? "Arrêter la lecture" : "Lire à voix haute"}
              >
                {isPlaying ? (
                  <VolumeX className="w-4 h-4 animate-pulse text-indigo-400" />
                ) : (
                  <Volume2 className="w-4 h-4 text-[var(--text-muted)]" />
                )}
              </button>
            )}

            {isAssistant && !isError && message.responseTime && (
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[var(--bg-input)] text-[10px] font-semibold text-[var(--text-muted)] border border-[var(--border-color)]/30 font-mono">
                <Clock className="w-3 h-3 text-[var(--text-muted)]" />
                <span>{formatTime(message.responseTime)}</span>
              </div>
            )}
          </div>

          {!isAssistant && message.attachedFileName && (
            <div className="flex items-center gap-2.5 mt-2.5 mb-2.5 p-3 rounded-xl w-fit max-w-full overflow-hidden bg-[var(--bg-card)] border border-[var(--border-color)]/60">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-indigo-500/10">
                <FileText className="w-4.5 h-4.5 text-indigo-400" />
              </div>
              <span className="text-sm font-medium text-[var(--text-foreground)] truncate max-w-[250px] font-mono">
                {message.attachedFileName}
              </span>
            </div>
          )}

          <div className="overflow-hidden" style={{ wordBreak: 'break-word' }}>
            {isAssistant && !isError ? (
              <RenderedMessage content={message.content} />
            ) : (
              <div
                className={`text-[15px] leading-relaxed whitespace-pre-wrap font-medium ${
                  isError ? 'text-red-400' : 'text-[var(--text-foreground)]'
                }`}
              >
                {message.content}
              </div>
            )}
          </div>

          {!isAssistant && !isError && (
            <div className="flex items-center gap-1.5 mt-3">
              {message.content !== 'Fichier envoyé.' && (
                <button
                  onClick={() => onRewrite(message.content)}
                  className="flex items-center justify-center p-1.5 rounded-lg border border-[var(--border-color)] text-[var(--text-muted)] hover:text-indigo-400 hover:bg-indigo-500/10 transition-all cursor-pointer active:scale-95"
                  title="Saisir à nouveau ce message pour réécriture"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              )}

              <button
                onClick={handleCopy}
                className="flex items-center justify-center p-1.5 rounded-lg border border-[var(--border-color)] text-[var(--text-muted)] hover:text-indigo-400 hover:bg-indigo-500/10 transition-all cursor-pointer active:scale-95"
                title="Copier le message"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          )}

          {isAssistant && !isError && (
            <div className="flex items-center gap-1.5 mt-3">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-[var(--border-color)] text-[var(--text-muted)] hover:text-indigo-400 hover:bg-indigo-500/10 transition-all cursor-pointer active:scale-95 text-xs font-semibold"
                title="Copier la réponse"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-mono text-[10px]">Copié !</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span className="text-[var(--text-muted)] font-mono text-[10px]">Copier</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
