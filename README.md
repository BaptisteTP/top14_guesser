# 🏉 Top14dle

> Le jeu de devinettes quotidien façon **Wordle / Narutodle / Loldle** appliqué au championnat de **Top 14** de rugby !

![Top14dle Preview](public/favicon.svg)

---

## 🎯 Concept du jeu

Chaque jour (ou en mode entraînement illimité), un joueur mystère du **Top 14** est sélectionné.

À chaque essai (*guess*) :
1. Recherche un joueur parmi les effectifs des 14 clubs du championnat avec autocomplétion intelligente.
2. Une ligne d'indices se dévoile avec des cartes animées façon Wordle.
3. Compare les 8 attributs clés :
   - **Joueur** : Photo, nom et drapeau
   - **Club** : Club actuel en Top 14 (Stade Toulousain, UBB, La Rochelle, Toulon, Racing 92, etc.)
   - **Poste** : Poste exact (Pilier, Talonneur, 2e ligne, 3e ligne, Charnière, Centre, Ailier, Arrière)
   - **Nationalité** : Pays et drapeau
   - **Âge** : Âge du joueur avec flèches indicatrices
   - **Taille** : Taille en cm avec flèches indicatrices
   - **Poids** : Poids en kg avec flèches indicatrices
   - **Statut International** : Sélectionné en équipe nationale (oui/non + nb de sélections)

---

## 🎨 Code Couleur des Indices

* 🟩 **Vert** : Correspondance exacte
* 🟨 **Jaune** :
  - **Poste** : Même ligne (ex: *Charnière*, *1ère ligne*, *3e ligne*) ou même grande catégorie (*Avants* / *Arrières*)
  - **Âge / Taille / Poids** : Valeur très proche (±2 ans, ±3 cm, ±4 kg)
* 🟥 **Gris / Rouge** : Aucune correspondance
* ⬆️ **Flèche Haut** : La valeur du joueur mystère est **supérieure**
* ⬇️ **Flèche Bas** : La valeur du joueur mystère est **inférieure**

---

## 💡 Indices Déblocables

Pour éviter les blocages, 3 indices progressifs se débloquent :
- **Après 3 essais** : Première lettre du joueur ou son club formateur / précédent
- **Après 6 essais** : Son numéro de maillot habituel ou sa ligne
- **Après 8 essais** : Une anecdote ou fait d'arme marquant de sa carrière

---

## 🎮 Modes de Jeu

1. **Mode Quotidien (Daily)** :
   - Un même joueur mystère chaque jour pour tous les fans du monde entier (calculé par hash de la date du jour).
   - Sauvegarde automatique de la partie en cours dans le `localStorage`.
   - Compte à rebours jusqu'à minuit pour le prochain joueur.
2. **Mode Entraînement Illimité** :
   - Joue autant de parties que tu souhaites d'affilée pour t'entraîner !
3. **Partage des résultats** :
   - Grille d'emojis à copier/coller en un clic pour défier tes amis sur Discord, WhatsApp, X (Twitter) !

---

## 🏉 Les 14 Clubs Inclus

* 🔴⚫ **Stade Toulousain** (ST)
* 🍷⚪ **Union Bordeaux Bègles** (UBB)
* 🟡⚫ **Stade Rochelais** (SR)
* 🔴⚫ **RC Toulon** (RCT)
* 🩵⚪ **Racing 92** (R92)
* 🌸⚡ **Stade Français Paris** (SFP)
* 🟡🔵 **ASM Clermont Auvergne** (ASM)
* 🐺🔴 **LOU Rugby** (LOU)
* 🔵⚪ **Castres Olympique** (CO)
* 🔵🩵 **Montpellier HR** (MHR)
* 🟢⚪ **Section Paloise** (SP)
* 🩵⚪ **Aviron Bayonnais** (AB)
* 🔴🟡 **USA Perpignan** (USAP)
* 🔵⚪ **RC Vannes** (RCV)

---

## 🚀 Installation & Lancement local

### Prérequis
- **Node.js** (v18+)
- **npm** ou **pnpm**

```bash
# 1. Cloner ou ouvrir le dossier du projet
cd top14dle

# 2. Installer les dépendances
npm install

# 3. Lancer le serveur de développement local
npm run dev
```

Rendez-vous ensuite sur `http://localhost:5173/` !

---

## 📦 Déploiement en 1 clic (Gratuit)

Le projet est une Single Page Application ultra légère sans serveur requis. Il peut être déployé en 1 clic sur :
* **Vercel** : Importer le repo GitHub -> Deploy
* **Netlify** : Importer le repo GitHub -> Build command `npm run build`, Publish directory `dist`
* **GitHub Pages** : Via GitHub Actions

---

## 🛠️ Stack Technique

* **Framework** : React 19 + TypeScript + Vite
* **Styling** : Tailwind CSS v4
* **Icônes** : Lucide React
* **Effets** : canvas-confetti
