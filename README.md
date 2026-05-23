<<<<<<< HEAD
# 🚀 EstiNova — Intelligent Centralized Assistant (AI ERP)

> Projet Pluridisciplinaire · ESTIN 2025/2026  
> ⚠️ Status: In Development

---

## 🧠 Overview

EstiNova is an AI-powered ERP system designed for ESTIN to centralize all academic and administrative information into a single intelligent assistant.

Instead of navigating PDFs, emails, or WhatsApp groups, users can simply ask questions in natural language and receive instant, contextual, and personalized answers.

The system uses a multi-agent architecture combined with a RAG (Retrieval-Augmented Generation) pipeline to provide accurate and secure responses.

---

## 🎯 Problem

ESTIN currently faces:

- Information fragmentation (PDFs, emails, drive, WhatsApp…)
- Slow access to information
- No personalization by user role

---

## 💡 Solution

EstiNova provides:

- Centralized AI interface (ERP-style)
- Context-aware responses (student / teacher / admin)
- Fast access to verified information
- Secure, role-based data access
- 24/7 availability

---

## 👥 Target Users

### 🎓 Students
- Timetable & modules
- Grades & averages
- Academic rules & documents
- Pedagogical help (code, math, writing)

### 👨‍🏫 Professors
- Manage courses & groups
- Communicate with students
- Declare absences
- Access teaching resources

### 🏢 Administration
- Manage academic data
- Publish announcements
- Monitor system activity
- Generate reports

---

## 🏗️ Architecture

### 🔁 System Flow

1. User sends a message via chatbot  
2. Frontend sends request via webhook  
3. User context is retrieved (role, group, etc.)  
4. Main AI Agent routes request  
5. Specialized agent processes it  
6. Response is generated and returned  

---

### 🤖 Multi-Agent System

- Main Orchestrator Agent
- Timetable Agent
- Grades Agent
- Documentation Agent (RAG)
- Email Agent
- Communication Agent
- Pedagogical Assistant

---

### 📚 RAG Pipeline

- Document ingestion (PDFs)
- Chunking & embedding
- Vector search
- Context-aware answer generation

---

## 🛠️ Tech Stack

| Component | Technology |
|----------|-----------|
| AI Orchestration | n8n (self-hosted) |
| LLM | Stepfun 3.5 Flash / Gemini 2.0 |
| Embeddings | HuggingFace API |
| Vector Store | In-memory (n8n) |
| Database | Google Sheets |
| Email | Gmail API |
| Frontend | HTML, CSS, JavaScript |
| Auth | Silent Authentication |
| Deployment | n8n Cloud / Self-hosted |

---

## 🔐 Security

- Role-based access control (RBAC)
- Protection against prompt injection
- No access to unauthorized data
- HTTPS encryption
- Anti-social engineering design

---

## ⚙️ Features

### Student Features
- View timetable
- Check grades & averages
- Ask about regulations
- Get academic help
- Send emails automatically

### Professor Features
- Manage groups & schedules
- Communicate with students
- Declare absences

### Admin Features
- Update academic data
- Manage documents
- Monitor system usage
- Publish announcements

---

## 📈 Performance

- Simple queries: ~15s  
- Complex queries: up to 90s  

(*Due to free-tier infrastructure limitations*)

---

## ⚠️ Limitations

- No real ESTIN data (simulation only)
- Free tools only (budget constraints)
- No dedicated servers
- No full cybersecurity audit
- Limited development time (8 weeks)

---

## 🚀 Roadmap

### Short Term
- Add more student levels (2CS, 3CS…)
- Persistent vector database
- Real data integration

### Mid Term
- Notifications system
- Admin dashboard
- Multimodal support (images)

### Long Term
- Mobile app (iOS / Android)
- Dedicated servers + local LLM
- Predictive analytics (student performance)

---

## 👨‍💻 Team

- Boudjaoui Badis — Project Manager & AI Engineer  
- Chiheb Israa — AI Engineer (Prompt & RAG)  
- Gougam Wiam — Frontend Developer  
- Mansouri Anias — Backend Developer  
- Hamadouche Axcel — Data Analyst  
- Naceri Walid — Data Analyst  

---

## 📊 Success Metrics

- 100% use cases covered  
- 0 data leaks in tests  
- UI rating ≥ 4/5  
- ≥ 85% correct responses  

---

## 📌 Status

🚧 Currently in development (Prototype stage)  
🎯 Designed to scale into a production-ready ERP AI system
=======
# EstiNova - Portail Académique

EstiNova est une application moderne et réactive pour la gestion académique de l'ESTIN Béjaïa. Elle centralise les emplois du temps, les résultats des examens et les documents administratifs sous une interface fluide et unifiée.

## Installation et Développement

### Prérequis
- Node.js (version 18+)
- Compte Supabase (optionnel, pour l'authentification des utilisateurs)

### Procédure de lancement local

1. Installez les dépendances du projet :
   ```bash
   npm install
   ```

2. Créez un fichier `.env.local` à la racine (en vous basant sur `.env.example`) et renseignez vos variables d'accès Supabase si nécessaire.

3. Lancez le serveur de développement :
   ```bash
   npm run dev
   ```

Le portail sera disponible à l'adresse [http://localhost:3000](http://localhost:3000).

## Déploiement

Ce projet est configuré pour être déployé directement sur **Vercel** :
- Les en-têtes de sécurité (CSP, HSTS, protection Clickjacking) sont configurés dans le fichier [vercel.json](./vercel.json).
- Le proxy d'API sécurisé est déployé automatiquement via la fonction serverless dans [api/proxy-webhook.js](./api/proxy-webhook.js).
>>>>>>> 9dd2532 (Update)
