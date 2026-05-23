import React, { useState, useEffect, useRef } from 'react';
import { FileData } from '../types';
import { Paperclip, Mic, Send, FileText, X, ChevronDown } from 'lucide-react';

interface ChatInputProps {
  onSend: (content: string, isVoice?: boolean, fileData?: FileData | null, selectedRole?: string) => void;
  isLoading: boolean;
  externalInput: string | null;
  onExternalInputConsumed: () => void;
  selectedRole: 'student' | 'professor' | 'admin';
  onRoleChange: (role: 'student' | 'professor' | 'admin') => void;
}

export default function ChatInput({
  onSend,
  isLoading,
  externalInput,
  onExternalInputConsumed,
  selectedRole,
  onRoleChange,
}: ChatInputProps) {
  const [input, setInput] = useState('');
  const [file, setFile] = useState<FileData | null>(null);
  const [isListening, setIsListening] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  const selectedRoleRef = useRef(selectedRole);
  useEffect(() => {
    selectedRoleRef.current = selectedRole;
  }, [selectedRole]);

  useEffect(() => {
    if (externalInput !== null && externalInput !== undefined) {
      setInput(externalInput);
      onExternalInputConsumed();
      setTimeout(() => textareaRef.current?.focus(), 50);
    }
  }, [externalInput, onExternalInputConsumed]);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'fr-FR';

      recognitionRef.current.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setInput(transcript);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
        setTimeout(() => {
          const val = textareaRef.current?.value;
          if (val && val.trim()) {
            onSend(val, true, file, selectedRoleRef.current);
            setInput('');
            setFile(null);
          }
        }, 500);
      };

      recognitionRef.current.onerror = (e: any) => {
        console.warn('Speech recognition error:', e);
        setIsListening(false);
      };
    }
  }, [onSend, file]);

  const toggleMicrophone = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      setInput('');
      try {
        recognitionRef.current?.start();
        setIsListening(true);
      } catch (err) {
        console.error('Failed to start speech recognition:', err);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const f = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setFile({
          name: f.name,
          type: f.type,
          base64: reader.result as string,
        });
      };
      reader.readAsDataURL(f);
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const maxH = window.innerWidth < 768 ? 120 : 200;
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, maxH) + 'px';
    }
  }, [input]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if ((!input.trim() && !file) || isLoading) return;

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    }

    onSend(input, false, file, selectedRole);
    setInput('');
    setFile(null);

    if (fileInputRef.current) fileInputRef.current.value = '';
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && window.innerWidth >= 768) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const canSend = (input.trim() || file) && !isLoading;
  const hasMicSupport = !!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);

  return (
    <div className="input-bar px-3 md:px-6 pt-2 pb-5 text-gray-200 font-sans">
      <div className="max-w-3xl mx-auto">
        {/* File Preview Pill */}
        {file && (
          <div className="mb-2.5 mx-1 flex items-center gap-2.5 px-3 py-2 rounded-2xl animate-fade-in w-fit max-w-full bg-indigo-500/10 border border-indigo-500/30">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 bg-indigo-500/20">
              <FileText className="w-4 h-4 text-indigo-300" />
            </div>
            <span className="text-sm font-medium truncate max-w-[200px] text-indigo-100 font-mono">
              {file.name}
            </span>
            <button
              onClick={() => {
                setFile(null);
                if (fileInputRef.current) fileInputRef.current.value = '';
              }}
              className="ml-1 p-0.5 rounded-full text-indigo-400 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Action input box container */}
        <div
          className="rounded-2xl transition-all duration-200"
          style={{
            backgroundColor: 'var(--bg-input)',
            border: isListening
              ? '1px solid rgba(239, 68, 68, 0.5)'
              : '1px solid var(--border-color)',
            boxShadow: isListening ? '0 0 15px rgba(239, 68, 68, 0.1)' : 'none',
          }}
        >
          {/* Text input area */}
          <div className="flex items-end px-3 pt-3 pb-1 gap-2">
            <textarea
              ref={textareaRef}
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isListening ? '🎙 Je vous écoute...' : 'Message pour EstiNova...'}
              className="flex-1 border-0 focus:ring-0 resize-none scrollbar-none outline-none leading-relaxed bg-transparent"
              style={{
                minHeight: '28px',
                maxHeight: window.innerWidth < 768 ? '120px' : '180px',
                color: isListening ? '#fca5a5' : 'var(--text-foreground)',
                fontSize: '16px',
                paddingTop: '2px',
              }}
            />
          </div>

          {/* Input tools bar */}
          <div className="flex items-center justify-between px-2 pb-2 pt-0.5">
            {/* Left side attachment upload */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-[var(--text-foreground)] hover:text-indigo-400 bg-[var(--bg-card)] hover:bg-[var(--bg-secondary)] border border-[var(--border-color)]/60 transition-all duration-250 cursor-pointer shadow-sm select-none h-9 hover:translate-y-[-1px] active:translate-y-0"
              >
                <Paperclip className="w-4 h-4 text-indigo-400 shrink-0" />
                <span className="hidden sm:inline">Fichier</span>
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="*/*"
              />

              {/* Profile/Role selector dropdown */}
              <div className="relative flex items-center">
                <select
                  value={selectedRole}
                  onChange={(e) => onRoleChange(e.target.value as 'student' | 'professor' | 'admin')}
                  disabled={isLoading}
                  className="appearance-none bg-[var(--bg-card)] hover:bg-[var(--bg-secondary)] text-xs text-[var(--text-foreground)] font-semibold pl-3 pr-8 py-2 rounded-xl border border-[var(--border-color)]/60 transition-all duration-250 outline-none cursor-pointer focus:border-indigo-500/40 focus:ring-1 focus:ring-indigo-500/20 font-sans h-9 shadow-md flex items-center select-none hover:translate-y-[-1px] active:translate-y-0"
                >
                  <option value="student" className="bg-[var(--bg-card)] text-[var(--text-foreground)]">🎓 Étudiant</option>
                  <option value="professor" className="bg-[var(--bg-card)] text-[var(--text-foreground)]">💼 Enseignant</option>
                  <option value="admin" className="bg-[var(--bg-card)] text-[var(--text-foreground)]">⚙️ Administrateur</option>
                </select>
                <div className="absolute right-2.5 pointer-events-none text-indigo-400/80">
                  <ChevronDown className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>

            {/* Right side speech record and submit send */}
            <div className="flex items-center gap-2">
              {hasMicSupport && (
                <button
                  type="button"
                  onClick={toggleMicrophone}
                  disabled={isLoading}
                  className="p-2 rounded-xl transition-all duration-250 cursor-pointer"
                  style={
                    isListening
                      ? {
                          backgroundColor: 'rgba(239, 68, 68, 0.2)',
                          color: '#f87171',
                          border: '1px solid rgba(239, 68, 68, 0.4)',
                        }
                      : { color: 'var(--text-muted)', backgroundColor: 'rgba(255,255,255,0.03)' }
                  }
                  title="Dicter votre message"
                >
                  <Mic className="w-4.5 h-4.5" />
                </button>
              )}

              <button
                type="button"
                onClick={() => handleSubmit()}
                disabled={!canSend}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer"
                style={
                  canSend
                    ? {
                        background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                        color: 'white',
                        boxShadow: '0 4px 14px rgba(79,70,229,0.3)',
                      }
                    : {
                        backgroundColor: 'rgba(255, 255, 255, 0.03)',
                        color: '#4b5563',
                        cursor: 'not-allowed',
                      }
                }
              >
                {isLoading ? (
                  <div className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin border-indigo-400" />
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span className="hidden sm:inline">Envoyer</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-[11px] mt-2.5 text-gray-600 select-none">
          Le système EstiNova peut parfois formuler des réponses erronées. Veuillez vérifier les informations importantes.
        </p>
      </div>
    </div>
  );
}
