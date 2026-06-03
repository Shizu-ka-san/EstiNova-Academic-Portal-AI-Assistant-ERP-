# 🚀 EstiNova — Portail Académique & Assistant IA (ERP)

![EstiNova Hero Banner](./assets/hero_banner_1780527687088.png)

> **Projet Pluridisciplinaire · ESTIN (Amizour, Béjaïa, Algérie) 2025/2026**  
> ⚠️ **Statut : En cours de développement (Prototype)**

---

## 🧠 Présentation Générale

**EstiNova** est une plateforme moderne pour la gestion académique de l'ESTIN Béjaïa. Elle centralise les emplois du temps, les résultats des examens et les documents administratifs sous une interface fluide et unifiée, pilotée par un assistant IA intelligent.

Au lieu de naviguer entre plusieurs fichiers PDF, emails ou groupes de communication, les étudiants et enseignants peuvent simplement interagir en langage naturel pour obtenir des informations personnalisées et sécurisées selon leur rôle.

### 💬 Interface Chat & Sélection de Rôle Dynamique
L'utilisateur, une fois connecté sur le portail EstiNova, fait face à l'assistant IA et choisit activement le **rôle/workflow** (Étudiant, Enseignant, Administrateur) auquel envoyer sa requête directement via le sélecteur intégré dans la barre de saisie de l'interface de chat. Cela permet d'adapter instantanément les réponses de l'IA et de garantir une sécurité forte et ciblée.

![EstiNova Chat Interface](./assets/chat_interface_1780527707757.png)

---


## 🏗️ Architecture Globale & Flux de Communication

Le système repose sur une architecture modulaire découplée, où le **Frontend** joue le rôle de coordinateur entre l'orchestrateur IA (**n8n**) et les services d'authentification/stockage (**Supabase**).

### Diagramme d'Architecture

```mermaid
graph TD
    %% Frontend & Clients
    subgraph Client [Interface Client]
        FE[Frontend - HTML/CSS/JS]
    end

    %% API Proxy & Backend
    subgraph Vercel [Hébergement & Proxy Vercel]
        PX[API Proxy - api/proxy-webhook.js]
    end

    %% Supabase
    subgraph Supa [Base de données & Auth]
        SB[Supabase Auth & Storage]
    end

    %% n8n
    subgraph n8n_Engine [Orchestration IA]
        N8N[Workflow n8n]
        Orch[Agent Orchestrateur]
        T_Agent[Agent Emploi du Temps]
        G_Agent[Agent Notes/Grades]
        D_Agent[Agent RAG - Documentation]
    end

    %% Google Workspace & Services
    subgraph Services [Sources de données / API]
        GS[Google Sheets]
        GD[Google Drive]
        GM[Gmail API]
    end

    %% Flux
    FE -->|1. Auth / Profil / Avatars| SB
    FE -->|2. Requêtes IA POST /api/proxy-webhook| PX
    PX -->|3. Forward Payload sécurisé| N8N
    N8N -->|4. Orchestration| Orch
    Orch --> T_Agent
    Orch --> G_Agent
    Orch --> D_Agent
    T_Agent & G_Agent & D_Agent -->|5. Données / Outils| Services
```

![EstiNova Architecture Globale](./assets/architecture_diagram_1780527695973.png)

### 🔗 Fonctionnement des Connexions

1. **Frontend ↔ Proxy API** : Le Frontend communique avec l'API Serverless déployée sur Vercel (`api/proxy-webhook.js`) pour toutes les requêtes de chat. Cela protège les adresses réelles des serveurs n8n contre les attaques directes et ajoute une couche de protection contre le SSRF (Server-Side Request Forgery).
2. **Proxy API ↔ Webhooks n8n** : Le Proxy transmet de manière sécurisée les payloads d'interaction utilisateur aux Webhooks n8n correspondants (`WEBHOOK_STUDENT`, `WEBHOOK_PROFESSOR`, `WEBHOOK_ADMIN`) en fonction du rôle activement sélectionné par l'utilisateur directement depuis l'interface de chat (Étudiant, Enseignant ou Administrateur).
3. **Le rôle de n8n (Le Cerveau IA)** : 
   - n8n héberge l'orchestrateur d'agents IA et les sous-agents spécialisés (résolution d'emplois du temps, recherche documentaire RAG, etc.).
   - Il se connecte de manière autonome aux bases de données administratives (Google Sheets, Google Drive, Gmail API) pour récupérer et mettre à jour les données métiers en temps réel.
4. **Le rôle de Supabase (Gestion Utilisateur & Profils)** : 
   - Supabase est utilisé de manière autonome pour authentifier les sessions utilisateurs (adresse `@estin.dz`) et stocker les métadonnées de profil ainsi que les avatars.
5. **Indépendance Supabase & n8n** : 
   * **Important** : Supabase et n8n ne sont **pas connectés directement**. 
   * C'est le **Frontend** qui fait le lien : il valide la session utilisateur auprès de Supabase, puis injecte le contexte de session sécurisé (Prénom, Nom, Rôle, Promotion, Section, Groupe) ainsi que le rôle sélectionné dans l'interface par l'utilisateur dans le payload envoyé au Proxy API pour n8n. Cela garantit un cloisonnement fort des responsabilités et une sécurité maximale.

### 📂 Choix de Google Workspace & Google Sheets
Pour stocker et manipuler les plannings, les notes et les structures administratives, nous avons choisi d'intégrer **Google Sheets** via l'API Google Workspace. Ce choix est guidé par le fait que l'**ESTIN utilise déjà la suite Google Workspace** au quotidien. Utiliser Google Sheets comme référentiel de données permet aux équipes pédagogiques et administratives de modifier les données scolaires directement dans un outil collaboratif familier, évitant ainsi toute formation complexe ou friction technique liée à un nouvel outil de gestion de bases de données.

---

## 📖 Fonctionnement du RAG (Retrieval-Augmented Generation)

Pour répondre de manière fiable et précise aux questions des étudiants et des enseignants sur les règlements intérieurs, les chartes de l'école et la scolarité, EstiNova intègre un pipeline RAG (Génération Augmentée par Récupération) :

1. **Indexation & Stockage Vectoriel** : Les documents administratifs et académiques officiels (PDF, règlements) sont découpés en blocs de texte (chunking), convertis en vecteurs d'embeddings avec des modèles de HuggingFace, puis stockés localement dans la base de données vectorielle **Qdrant**.
2. **Recherche Sémantique** : Lorsqu'un utilisateur pose une question (ex: *"Quel est le barème d'absence éliminatoire ?"*), le système recherche sémantiquement les passages textuels les plus pertinents dans Qdrant.
3. **Génération Enrichie** : Le contexte extrait est fusionné avec la question initiale de l'utilisateur pour être soumis au LLM local, garantissant une réponse précise sans hallucinations, strictement ancrée dans la documentation officielle.

![EstiNova RAG Pipeline](./assets/rag_pipeline_1780527716891.png)

---


## 🐳 Hébergement, Souveraineté & Mode Offline

Afin de garantir une **confidentialité et une souveraineté totale** des données académiques et personnelles de l'ESTIN, le projet adopte une philosophie d'hébergement local robuste :

* **Conteneurisation Docker** : L'ensemble des briques technologiques du projet (l'application web, l'orchestrateur **n8n**, et la base de données vectorielle **Qdrant**) tourne localement au sein de conteneurs Docker pour simplifier le déploiement et assurer l'isolation.
* **Exposition via ngrok** : Pour les phases de développement ou de test à distance, un tunnel sécurisé **ngrok** est configuré pour rendre l'application locale et ses webhooks visibles sur Internet.
* **Déploiement sur site (On-Premise)** : En situation nominale, le projet est déployé localement sur les **serveurs physiques de l'ESTIN**.
* **LLM Local (Contrôle Total)** : Pour le traitement intelligent, un modèle de langage (LLM) tourne en local sur les serveurs de l'ESTIN, garantissant un contrôle absolu des flux de données et une sécurité maximale sans dépendance externe.
* **Validation & Tests** : Des tests approfondis ont été effectués directement sur les infrastructures de l'ESTIN, et les résultats obtenus ont été **plus que satisfaisants** (temps de latence réduit, résilience et précision du RAG).

---

## 🛠️ Stack Technique

| Composant | Technologie | Rôle / Description |
| :--- | :--- | :--- |
| **Frontend** | HTML, Vanilla CSS, Vite, TypeScript | Interface utilisateur moderne, réactive et animée |
| **Authentification** | Supabase Auth (Silent Auth) | Restriction d'accès aux emails `@estin.dz` |
| **Stockage** | Supabase Storage (avatars) | Hébergement sécurisé des photos de profil |
| **API Proxy** | Vercel Serverless Function (Node.js) | Proxy sécurisé avec protection SSRF intégrée |
| **Orchestration IA** | n8n (Self-hosted / Cloud) | Moteur d'agents, workflows et routage intelligent |
| **Modèles LLM** | Stepfun 3.5 Flash / Gemini 2.0 | Génération de réponses et raisonnement d'agents |
| **RAG (Documentation)** | HuggingFace API + Vector Store (n8n) | Recherche sémantique dans les règlements intérieurs |
| **Bases de données Métier** | Google Sheets / SQL Supabase | Stockage des notes, des plannings et des structures |

---

## ⚙️ Installation & Démarrage en local

### Prérequis
- **Node.js** (version 18 ou supérieure)
- **npm** (inclus avec Node.js)
- Une instance **n8n** (locale ou cloud) avec les workflows importés.
- Un projet **Supabase** configuré.

### Lancement étape par étape

1. **Cloner le projet** et se placer à la racine :
   ```bash
   git clone <url-du-depot>
   cd EstiNova
   ```

2. **Configurer l'application web** :
   Allez dans le dossier `webapp` :
   ```bash
   cd webapp
   ```
   Créez un fichier `.env.local` en vous basant sur `.env.example` et complétez les variables :
   ```env
   VITE_SUPABASE_URL=https://votre-projet.supabase.co
   VITE_SUPABASE_ANON_KEY=votre-cle-anon-supabase
   ```

3. **Installer les dépendances et démarrer** :
   ```bash
   npm install
   # Lancer en mode développement
   npm run dev
   ```
   L'application sera disponible sur [http://localhost:3000](http://localhost:3000).

---

## 🔐 Sécurité & Bonnes Pratiques

- **Contrôle d'accès basé sur les rôles (RBAC)** : Les requêtes n8n injectent dynamiquement le profil utilisateur authentifié par Supabase. Un étudiant ne peut pas appeler les outils d'un professeur.
- **SSRF Blocklist** : L'API proxy bloque toutes les requêtes vers des adresses IP locales (`127.0.0.1`, `localhost`, plages d'IP privées) pour interdire le scan de ports internes.
- **Zéro Secret Commité** : Tous les secrets de production et clés d'API privées sont configurés sur les environnements de déploiement (Vercel, variables d'environnement de n8n) et exclus de Git via `.gitignore`.

---

## 👨‍💻 Équipe Projet

- **Boudjaoui Badis** — Chef de Projet & Ingénieur IA  
- **Chiheb Israa** — Ingénieur IA (Prompting & RAG)  
