import React, { useState, useEffect, useRef } from "react";
import jsPDF from "jspdf";
import StoriesViewComponent, { IStories } from "./stories.view.component";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  HelpCircle, 
  Trash2, 
  Plus, 
  ChevronRight, 
  Eye, 
  Edit3, 
  Languages, 
  Gauge, 
  Music,
  Compass
} from "lucide-react";

import { getUserInfo, isLoggedIn } from "../../services/auth.service";
import { getRequestLimit, prompts } from "./stories.utils";
import {
  useGenerateFreeModelMutation,
  useGenerateModelMutation,
} from "../../redux/apis/ai.model.api";
import { useGetProfileInfoQuery } from "../../redux/apis/user.api";
import { getErrorMessage } from "../../error/error.message";
import useKeyboardShortcuts from "../../hooks/useKeyboardShortcuts";

import StoriesViewComponent, { IStories } from "./stories.view.component";
import SkeletonLoader from "./SkeletonLoader";
import EmptyStoriesState from "./EmptyStoriesState";

const soundtrackMap: Record<string, string> = {
  "🧙 Fantasy": "/audio/fantasy.mp3",
  "😱 Horror": "/audio/horror.mp3",
  "💕 Romance": "/audio/romance.mp3",
  "🎭 Drama": "/audio/drama.mp3",
  "😂 Comedy": "/audio/comedy.mp3",
  "🚀 Sci-Fi": "/audio/sci-fi.mp3",
  "🔍 Mystery": "/audio/mystery.mp3",
  "🌟 Adventure": "/audio/adventure.mp3",
  "🗺️ Adventurous": "/audio/adventure.mp3",
  "🤖 Tech / Sci-Fi": "/audio/sci-fi.mp3",
  "💖 Romance / Love": "/audio/romance.mp3",
};

type Inputs = {
  prompt: string;
};

interface ICharacter {
  id: string;
  name: string;
  role: string;
  personality: string;
}

const MAX_PROMPT_LENGTH = 2000;
const WARN_THRESHOLD = 0.8;
const DANGER_THRESHOLD = 0.95;

const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "hi", name: "Hindi" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "pt", name: "Portuguese" },
  { code: "de", name: "German" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
  { code: "bn", name: "Bengali" },
  { code: "ta", name: "Tamil" },
  { code: "te", name: "Telugu" },
  { code: "mr", name: "Marathi" },
];

const GENRES = [
  { value: "🎭 Drama", icon: "🎭", name: "Drama" },
  { value: "😂 Comedy", icon: "😂", name: "Comedy" },
  { value: "😱 Horror", icon: "😱", name: "Horror" },
  { value: "💕 Romance", icon: "💕", name: "Romance" },
  { value: "🚀 Sci-Fi", icon: "🚀", name: "Sci-Fi" },
  { value: "🧙 Fantasy", icon: "🧙", name: "Fantasy" },
  { value: "🔍 Mystery", icon: "🔍", name: "Mystery" },
  { value: "🌟 Adventure", icon: "🌟", name: "Adventure" },

  // New premium genres
  { value: "🗺️ Adventurous", icon: "🗺️", name: "Adventurous" },
  { value: "🤖 Tech / Sci-Fi", icon: "🤖", name: "Tech / Sci-Fi" },
  { value: "💖 Romance / Love", icon: "💖", name: "Romance / Love" },
] as const;


type GenreName = (typeof GENRES)[number]["name"];

const GENRE_LABELS: Record<string, Record<GenreName, string>> = {
  English: {
    Drama: "Drama", Comedy: "Comedy", Horror: "Horror", Romance: "Romance",
    "Sci-Fi": "Sci-Fi", Fantasy: "Fantasy", Mystery: "Mystery", Adventure: "Adventure",
    Adventurous: "Adventurous",
    "Tech / Sci-Fi": "Tech / Sci-Fi",
    "Romance / Love": "Romance / Love",
  },
  Spanish: {
    Drama: "Drama", Comedy: "Comedia", Horror: "Terror", Romance: "Romance",
    "Sci-Fi": "Ciencia ficcion", Fantasy: "Fantasia", Mystery: "Misterio", Adventure: "Aventura",
    Adventurous: "Adventurous",
    "Tech / Sci-Fi": "Tech / Sci-Fi",
    "Romance / Love": "Romance / Love",
  },
  French: {
    Drama: "Drame", Comedy: "Comedie", Horror: "Horreur", Romance: "Romance",
    "Sci-Fi": "Science-fiction", Fantasy: "Fantastique", Mystery: "Mystere", Adventure: "Aventure",
    Adventurous: "Adventurous",
    "Tech / Sci-Fi": "Tech / Sci-Fi",
    "Romance / Love": "Romance / Love",
  },
  Portuguese: {
    Drama: "Drama", Comedy: "Comedia", Horror: "Terror", Romance: "Romance",
    "Sci-Fi": "Ficcao cientifica", Fantasy: "Fantasia", Mystery: "Misterio", Adventure: "Aventura",
    Adventurous: "Adventurous",
    "Tech / Sci-Fi": "Tech / Sci-Fi",
    "Romance / Love": "Romance / Love",
  },
  Hindi: {
    Drama: "नाटक", Comedy: "à¤¹à¤¾à¤¸à¥à¤¯", Horror: "डरावनी", Romance: "à¤ªà¥à¤°à¥‡à¤®",
    "Sci-Fi": "à¤µà¤¿à¤œà¥à¤žà¤¾à¤¨ à¤•à¤¥à¤¾", Fantasy: "à¤•à¤²à¥à¤ªà¤¨à¤¾", Mystery: "à¤°à¤¹à¤¸à¥à¤¯", Adventure: "रोमांच",
    Adventurous: "Adventurous",
    "Tech / Sci-Fi": "Tech / Sci-Fi",
    "Romance / Love": "Romance / Love",
  },
  German: {
    Drama: "Drama", Comedy: "Komodie", Horror: "Horror", Romance: "Romanze",
    "Sci-Fi": "Science-Fiction", Fantasy: "Fantasy", Mystery: "Mysterie", Adventure: "Abenteuer",
    Adventurous: "Adventurous",
    "Tech / Sci-Fi": "Tech / Sci-Fi",
    "Romance / Love": "Romance / Love",
  },
  Japanese: {
    Drama: "ãƒ‰ãƒ©ãƒž", Comedy: "ã‚³ãƒ¡ãƒ‡ã‚£", Horror: "ãƒ›ãƒ©ãƒ¼", Romance: "ãƒ­ãƒžãƒ³ã‚¹",
    "Sci-Fi": "SF", Fantasy: "ãƒ•ã‚¡ãƒ³ã‚¿ã‚¸ãƒ¼", Mystery: "ãƒŸã‚¹ãƒ†ãƒªãƒ¼", Adventure: "å†’é™º",
    Adventurous: "Adventurous",
    "Tech / Sci-Fi": "Tech / Sci-Fi",
    "Romance / Love": "Romance / Love",
  },
  Korean: {
    Drama: "ë“œë¼ë§ˆ", Comedy: "ì½”ë¯¸ë””", Horror: "ê³µí¬", Romance: "ë¡œë§¨ìŠ¤",
    "Sci-Fi": "SF", Fantasy: "íŒíƒ€ì§€", Mystery: "ë¯¸ìŠ¤í„°ë¦¬", Adventure: "ëª¨í—˜",
    Adventurous: "Adventurous",
    "Tech / Sci-Fi": "Tech / Sci-Fi",
    "Romance / Love": "Romance / Love",
  },
  Bengali: {

    Drama: "à¦¨à¦¾à¦Ÿà¦•", Comedy: "à¦•à§Œà¦¤à§à¦•", Horror: "à¦­à§Œà¦¤à¦¿à¦•", Romance: "à¦ªà§à¦°à§‡à¦®",
    "Sci-Fi": "à¦¬à¦¿à¦œà§à¦žà¦¾à¦¨ à¦•à¦²à§à¦ªà¦•à¦¾à¦¹à¦¿à¦¨à¦¿", Fantasy: "à¦•à¦²à§à¦ªà¦¨à¦¾", Mystery: "à¦°à¦¹à¦¸à§à¦¯", Adventure: "à¦…à¦­à¦¿à¦¯à¦¾à¦¨",
    Adventurous: "Adventurous",
    "Tech / Sci-Fi": "Tech / Sci-Fi",
    "Romance / Love": "Romance / Love",
  },
  Tamil: {
    Drama: "à®¨à®¾à®Ÿà®•à®®à¯", Comedy: "à®¨à®•à¯ˆà®šà¯à®šà¯à®µà¯ˆ", Horror: "à®¤à®¿à®•à®¿à®²à¯", Romance: "à®•à®¾à®¤à®²à¯",
    "Sci-Fi": "à®…à®±à®¿à®µà®¿à®¯à®²à¯ à®ªà¯à®©à¯ˆà®µà¯", Fantasy: "à®•à®±à¯à®ªà®©à¯ˆ", Mystery: "à®®à®°à¯à®®à®®à¯", Adventure: "à®šà®¾à®•à®šà®®à¯",
    Adventurous: "Adventurous",
    "Tech / Sci-Fi": "Tech / Sci-Fi",
    "Romance / Love": "Romance / Love",
  },
  Telugu: {
    Drama: "à°¨à°¾à°Ÿà°•à°‚", Comedy: "à°¹à°¾à°¸à±à°¯à°‚", Horror: "à°­à°¯à°¾à°¨à°•à°‚", Romance: "à°ªà±à°°à±‡à°®",
    "Sci-Fi": "à°µà°¿à°œà±à°žà°¾à°¨ à°•à°¥", Fantasy: "à°•à°¾à°²à±à°ªà°¨à°¿à°•à°‚", Mystery: "à°°à°¹à°¸à±à°¯à°‚", Adventure: "à°¸à°¾à°¹à°¸à°‚",
    Adventurous: "Adventurous",
    "Tech / Sci-Fi": "Tech / Sci-Fi",
    "Romance / Love": "Romance / Love",
  },
  Marathi: {

    Drama: "नाटक", Comedy: "विनोद", Horror: "भयकथा", Romance: "à¤ªà¥à¤°à¥‡à¤®à¤•à¤¥à¤¾",
    "Sci-Fi": "à¤µà¤¿à¤œà¥à¤žà¤¾à¤¨à¤•à¤¥à¤¾", Fantasy: "à¤•à¤²à¥à¤ªà¤¨à¤¾à¤°à¤®à¥à¤¯", Mystery: "à¤°à¤¹à¤¸à¥à¤¯", Adventure: "साहस",
    Adventurous: "Adventurous",
    "Tech / Sci-Fi": "Tech / Sci-Fi",
    "Romance / Love": "Romance / Love",

  },
};

type UiText = {
  back: string;
  freeAccess: string;
  login: string;
  forMore: string;
  perMonth: string;
  upgrade: string;
  monthlyRequests: string;
  totalPosts: string;
  titleStart: string;
  titleAccent: string;
  length: string;
  language: string;
  short: string;
  medium: string;
  long: string;
  promptPlaceholder: string;
  keyboardTip: string;
  press: string;
  toGenerate: string;
  alsoWorks: string;
  forNewLine: string;
  generating: string;
  generate: string;
  examples: string;
  selectPrompt: string;
  characterLimit: string;
  charactersRemaining: string;
  shortcuts: string;
  openHelp: string;
  closeHelp: string;
  focusPrompt: string;
  generateStory: string;
  publishStory: string;
  close: string;
  freeLimitReached: string;
  freeLimitMessage: string;
  continueBrowsing: string;
  recentPrompts: string;
  usePrompt: string;
  delete: string;
  clearAll: string;
  noRecentPrompts: string;
};

const UI_TEXT: Record<string, UiText> = {
  English: {
    back: "BACK", freeAccess: "Free access for 3 requests", login: "Login", forMore: "for more!",
    perMonth: "Per Month", upgrade: "Upgrade", monthlyRequests: "This month request", totalPosts: "Total posts",
    titleStart: "Turn Your Ideas Into", titleAccent: "Amazing Stories!", length: "Length", language: "Language",
    short: "Short", medium: "Medium", long: "Long", promptPlaceholder: "Every great story begins with a single idea. What's yours?",
    keyboardTip: "Keyboard tip:", press: "Press", toGenerate: "to generate", alsoWorks: "also works", forNewLine: "for new line",
    generating: "Generating...", generate: "Generate", examples: "Here are some example prompts you can refer to:-",
    selectPrompt: "Select a prompt", characterLimit: "Character limit reached - generate is disabled",
    charactersRemaining: "characters remaining", shortcuts: "Keyboard Shortcuts", openHelp: "Open help", closeHelp: "Close help",
    focusPrompt: "Focus prompt", generateStory: "Generate story", publishStory: "Publish story", close: "Close",
    freeLimitReached: "Free Limit Reached", freeLimitMessage: "You've used all 3 free story generations. Login to continue creating more stories.",
    continueBrowsing: "Continue Browsing", recentPrompts: "Recent Prompts", usePrompt: "Use", delete: "Delete", clearAll: "Clear All", noRecentPrompts: "No recent prompts yet",
  },
  Spanish: {
    back: "VOLVER", freeAccess: "Acceso gratis para 3 solicitudes", login: "Iniciar sesion", forMore: "para obtener mas!",
    perMonth: "Por mes", upgrade: "Mejorar", monthlyRequests: "Solicitudes este mes", totalPosts: "Publicaciones totales",
    titleStart: "Convierte tus ideas en", titleAccent: "historias increibles!", length: "Longitud", language: "Idioma",
    short: "Corta", medium: "Media", long: "Larga", promptPlaceholder: "Toda gran historia comienza con una sola idea. Cual es la tuya?",
    keyboardTip: "Consejo de teclado:", press: "Pulsa", toGenerate: "para generar", alsoWorks: "tambien funciona", forNewLine: "para una nueva linea",
    generating: "Generando...", generate: "Generar", examples: "Aqui tienes algunos ejemplos de indicaciones:",
    selectPrompt: "Selecciona una indicacion", characterLimit: "Limite de caracteres alcanzado - la generacion esta deshabilitada",
    charactersRemaining: "caracteres restantes", shortcuts: "Atajos de teclado", openHelp: "Abrir ayuda", closeHelp: "Cerrar ayuda",
    focusPrompt: "Enfocar indicacion", generateStory: "Generar historia", publishStory: "Publicar historia", close: "Cerrar",
    freeLimitReached: "Limite gratuito alcanzado", freeLimitMessage: "Has usado las 3 generations gratuitas. Inicia sesion para continuar creando historias.",
    continueBrowsing: "Continuar navegando", recentPrompts: "Indicaciones recentes", usePrompt: "Usar", delete: "Eliminar", clearAll: "Limpiar todo", noRecentPrompts: "Sin indicaciones recientes",
  },
  French: {
    back: "RETOUR", freeAccess: "Acces gratuit pour 3 demandes", login: "Connexion", forMore: "pour en obtenir plus !",
    perMonth: "Par mois", upgrade: "Mettre a niveau", monthlyRequests: "Demandes ce mois-ci", totalPosts: "Publications totales",
    titleStart: "Transformez vos idees en", titleAccent: "histoires incroyables !", length: "Longueur", language: "Langue",
    short: "Courte", medium: "Moyenne", long: "Longue", promptPlaceholder: "Chaque grande histoire commence par une seule idee. Quelle est la votre ?",
    keyboardTip: "Astuce clavier :", press: "Appuyez sur", toGenerate: "pour generer", alsoWorks: "fonctionne aussi", forNewLine: "pour une nouvelle ligne",
    generating: "Generation...", generate: "Generer", examples: "Voici quelques exemples d'invites :",
    selectPrompt: "Selectionner une invite", characterLimit: "Limite de caracteres atteinte - generation desactivee",
    charactersRemaining: "caracteres restants", shortcuts: "Raccourcis clavier", openHelp: "Ouvrir l'aide", closeHelp: "Fermer l'aide",
    focusPrompt: "Cibler l'invite", generateStory: "Generer une histoire", publishStory: "Publier l'histoire", close: "Fermer",
    freeLimitReached: "Limite gratuite atteinte", freeLimitMessage: "Vous avez utilise les 3 generations gratuites. Connectez-vous pour continuer a creer des histoires.",
    continueBrowsing: "Continuer la navigation", recentPrompts: "Invites recentes", usePrompt: "Utiliser", delete: "Supprimer", clearAll: "Effacer tout", noRecentPrompts: "Pas d'invites recentes",
  },
  Portuguese: {
    back: "VOLTAR", freeAccess: "Acesso gratuito para 3 solicitacoes", login: "Entrar", forMore: "para ter mais!",
    perMonth: "Por mes", upgrade: "Atualizar", monthlyRequests: "Solicitacoes neste mes", totalPosts: "Total de publicacoes",
    titleStart: "Transforme suas ideias em", titleAccent: "historias incriveis!", length: "Comprimento", language: "Idioma",
    short: "Curta", medium: "Media", long: "Longa", promptPlaceholder: "Toda grande historia comeca com uma unica ideia. Qual e a sua?",
    keyboardTip: "Dica de teclado:", press: "Pressione", toGenerate: "para gerar", alsoWorks: "tambem funciona", forNewLine: "para nova linha",
    generating: "Gerando...", generate: "Gerar", examples: "Aqui estao alguns exemplos de instrucoes:",
    selectPrompt: "Selecione uma instrucao", characterLimit: "Limite de caracteres atingido - geracao desativada",
    charactersRemaining: "caracteres restantes", shortcuts: "Atalhos de teclado", openHelp: "Abrir ajuda", closeHelp: "Fechar ajuda",
    focusPrompt: "Focar instrucao", generateStory: "Gerar historia", publishStory: "Publicar historia", close: "Fechar",
    freeLimitReached: "Limite gratuito atingido", freeLimitMessage: "Voce usou as 3 geracoes gratuitas. Entre para continuar criando historias.",
    continueBrowsing: "Continuar navegando", recentPrompts: "Instrucoes recentes", usePrompt: "Usar", delete: "Deletar", clearAll: "Limpar tudo", noRecentPrompts: "Sem instrucoes recentes",
  },
  Hindi: {

    back: "à¤µà¤¾à¤ªà¤¸", freeAccess: "3 à¤…à¤¨à¥à¤°à¥‹à¤§à¥‹à¤‚ à¤•à¥‡ à¤²à¤¿à¤ à¤®à¥à¤«à¥à¤¤ à¤‰à¤ªà¤¯à¥‹à¤—", login: "à¤²à¥‰à¤— à¤‡à¤¨", forMore: "à¤”à¤° à¤ªà¤¾à¤¨à¥‡ à¤•à¥‡ à¤²à¤¿à¤!",
    perMonth: "à¤ªà¥à¤°à¤¤à¤¿ à¤®à¤¾à¤¹", upgrade: "à¤…à¤ªà¤—à¥à¤°à¥‡à¤¡", monthlyRequests: "à¤‡à¤¸ à¤®à¤¾à¤¹ à¤•à¥‡ à¤…à¤¨à¥à¤°à¥‹à¤§", totalPosts: "à¤•à¥à¤² à¤ªà¥‹à¤¸à¥à¤Ÿ",
    titleStart: "à¤…à¤ªà¤¨à¥‡ à¤µà¤¿à¤šà¤¾à¤°à¥‹à¤‚ à¤•à¥‹ à¤¬à¤¦à¤²à¥‡à¤‚", titleAccent: "à¤…à¤¦à¥à¤­à¥à¤¤ à¤•à¤¹à¤¾à¤¨à¤¿à¤¯à¥‹à¤‚ à¤®à¥‡à¤‚!", length: "à¤²à¤‚à¤¬à¤¾à¤ˆ", language: "à¤­à¤¾à¤·à¤¾",
    short: "à¤›à¥‹à¤Ÿà¥€", medium: "à¤®à¤§à¥à¤¯à¤®", long: "à¤²à¤‚à¤¬à¥€", promptPlaceholder: "à¤¹à¤° à¤®à¤¹à¤¾à¤¨ à¤•à¤¹à¤¾à¤¨à¥€ à¤à¤• à¤µà¤¿à¤šà¤¾à¤° à¤¸à¥‡ à¤¶à¥à¤°à¥‚ à¤¹à¥‹à¤¤à¥€ à¤¹à¥ˆà¥¤ à¤†à¤ªà¤•à¤¾ à¤µà¤¿à¤šà¤¾à¤° à¤•à¥à¤¯à¤¾ à¤¹à¥ˆ?",
    keyboardTip: "à¤•à¥€à¤¬à¥‹à¤°à¥à¤¡ à¤¸à¥à¤à¤¾à¤µ:", press: "à¤¦à¤¬à¤¾à¤à¤‚", toGenerate: "à¤¬à¤¨à¤¾à¤¨à¥‡ à¤•à¥‡ à¤²à¤¿à¤", alsoWorks: "à¤­à¥€ à¤•à¤¾à¤® à¤•à¤°à¤¤à¤¾ à¤¹à¥ˆ", forNewLine: "à¤¨à¤ˆ à¤ªà¤‚à¤•à¥à¤¤à¤¿ à¤•à¥‡ à¤²à¤¿à¤",
    generating: "à¤¬à¤¨ à¤°à¤¹à¥€ à¤¹à¥ˆ...", generate: "à¤¬à¤¨à¤¾à¤à¤‚", examples: "à¤‡à¤¨ à¤‰à¤¦à¤¾à¤¹à¤°à¤£ à¤¸à¤‚à¤•à¥‡à¤¤à¥‹à¤‚ à¤•à¤¾ à¤‰à¤ªà¤¯à¥‹à¤— à¤•à¤°à¥‡à¤‚:",
    selectPrompt: "à¤à¤• à¤¸à¤‚à¤•à¥‡à¤¤ à¤šà¥à¤¨à¥‡à¤‚", characterLimit: "à¤…à¤•à¥à¤·à¤° à¤¸à¥€à¤®à¤¾ à¤ªà¥‚à¤°à¥€ - à¤¨à¤¿à¤°à¥à¤®à¤¾à¤£ à¤…à¤•à¥à¤·à¤® à¤¹à¥ˆ", charactersRemaining: "à¤…à¤•à¥à¤·à¤° à¤¶à¥‡à¤·",
    shortcuts: "à¤•à¥€à¤¬à¥‹à¤°à¥à¤¡ à¤¶à¥‰à¤°à¥à¤Ÿà¤•à¤Ÿ", openHelp: "à¤¸à¤¹à¤¾à¤¯à¤¤à¤¾ à¤–à¥‹à¤²à¥‡à¤‚", closeHelp: "à¤¸à¤¹à¤¾à¤¯à¤¤à¤¾ à¤¬à¤‚à¤¦ à¤•à¤°à¥‡à¤‚", focusPrompt: "à¤¸à¤‚à¤•à¥‡à¤¤ à¤ªà¤° à¤œà¤¾à¤à¤‚",
    generateStory: "à¤•à¤¹à¤¾à¤¨à¥€ à¤¬à¤¨à¤¾à¤à¤‚", publishStory: "à¤•à¤¹à¤¾à¤¨à¥€ à¤ªà¥à¤°à¤•à¤¾à¤¶à¤¿à¤¤ à¤•à¤°à¥‡à¤‚", close: "à¤¬à¤‚à¤¦ à¤•à¤°à¥‡à¤‚", freeLimitReached: "à¤®à¥à¤«à¥à¤¤ à¤¸à¥€à¤®à¤¾ à¤ªà¥‚à¤°à¥€",
    freeLimitMessage: "à¤†à¤ªà¤¨à¥‡ à¤¸à¤­à¥€ 3 à¤®à¥à¤«à¥à¤¤ à¤•à¤¹à¤¾à¤¨à¥€ à¤¨à¤¿à¤°à¥à¤®à¤¾à¤£ à¤‰à¤ªà¤¯à¥‹à¤— à¤•à¤° à¤²à¤¿à¤ à¤¹à¥ˆà¤‚à¥¤ à¤†à¤—à¥‡ à¤œà¤¾à¤°à¥€ à¤°à¤–à¤¨à¥‡ à¤•à¥‡ à¤²à¤¿à¤ à¤²à¥‰à¤— à¤‡à¤¨ à¤•à¤°à¥‡à¤‚à¥¤", continueBrowsing: "à¤¬à¥à¤°à¤¾à¤‰à¤œà¤¼ à¤•à¤°à¤¨à¤¾ à¤œà¤¾à¤°à¥€ à¤°à¤–à¥‡à¤‚", recentPrompts: "à¤¹à¤¾à¤² à¤•à¥‡ à¤¸à¤‚à¤•à¥‡à¤¤", usePrompt: "à¤‰à¤ªà¤¯à¥‹à¤— à¤•à¤°à¥‡à¤‚", delete: "à¤¹à¤Ÿà¤¾à¤à¤‚", clearAll: "à¤¸à¤¬ à¤¸à¤¾à¤« à¤•à¤°à¥‡à¤‚", noRecentPrompts: "à¤•à¥‹à¤ˆ à¤¹à¤¾à¤² à¤•à¥‡ à¤¸à¤‚à¤•à¥‡à¤¤ à¤¨à¤¹à¥€à¤‚",

  },
  German: {
    back: "ZURUCK", freeAccess: "Kostenloser Zugang fur 3 Anfragen", login: "Anmelden", forMore: "fur mehr!",
    perMonth: "Pro Monat", upgrade: "Upgrade", monthlyRequests: "Anfragen in diesem Monat", totalPosts: "Beitrage insgesamt",
    titleStart: "Verwandle deine Ideen in", titleAccent: "erstaunliche Geschichten!", length: "Lange", language: "Sprache",
    short: "Kurz", medium: "Mittel", long: "Lang", promptPlaceholder: "Jede grossartige Geschichte beginnt mit einer Idee. Was ist deine?",
    keyboardTip: "Tastaturtipp:", press: "Drucke", toGenerate: "zum Erstellen", alsoWorks: "funktioniert ebenfalls", forNewLine: "fur eine neue Zeile",
    generating: "Wird erstellt...", generate: "Erstellen", examples: "Hier sind einige Beispielvorgaben:",
    selectPrompt: "Vorgabe auswahlen", characterLimit: "Zeichenlimit erreicht - Erstellung deaktiviert", charactersRemaining: "Zeichen ubrig",
    shortcuts: "Tastaturkurzel", openHelp: "Hilfe offnen", closeHelp: "Hilfe schliessen", focusPrompt: "Vorgabe fokussieren",
    generateStory: "Geschichte erstellen", publishStory: "Geschichte veroffentlichen", close: "Schliessen", freeLimitReached: "Kostenloses Limit erreicht",
    freeLimitMessage: "Du hast alle 3 kostenlosen Erstellungen genutzt. Melde dich an, um weiterzumachen.", continueBrowsing: "Weiter ansehen", recentPrompts: "Aktuelle Vorgaben", usePrompt: "Verwenden", delete: "Loschen", clearAll: "Alles loschen", noRecentPrompts: "Keine aktuellen Vorgaben",
  },
  Japanese: {
    back: "æˆ»ã‚‹", freeAccess: "3å›žã¾ã§ç„¡æ–™ã§åˆ©ç”¨ã§ãã¾ã™", login: "ãƒ­ã‚°ã‚¤ãƒ³", forMore: "ã—ã¦ã•ã‚‰ã«åˆ©ç”¨ï¼",
    perMonth: "æœˆã”ã¨", upgrade: "ã‚¢ãƒƒãƒ—ã‚°ãƒ¬ãƒ¼ãƒ‰", monthlyRequests: "ä»Šæœˆã®ãƒªã‚¯ã‚¨ã‚¹ãƒˆ", totalPosts: "æŠ•ç¨¿æ•°",
    titleStart: "ã‚¢ã‚¤ãƒ‡ã‚¢ã‚’", titleAccent: "ã™ã°ã‚‰ã—ã„ç‰©èªžã«ï¼", length: "é•·ã•", language: "è¨€èªž",
    short: "çŸ­ã„", medium: "ä¸­ç¨‹åº¦", long: "é•·ã„", promptPlaceholder: "ã™ã¹ã¦ã®ç‰©èªžã¯ä¸€ã¤ã®ã‚¢ã‚¤ãƒ‡ã‚¢ã‹ã‚‰å§‹ã¾ã‚Šã¾ã™ã€‚ã‚ãªãŸã®ã‚¢ã‚¤ãƒ‡ã‚¢ã¯ï¼Ÿ",
    keyboardTip: "ã‚­ãƒ¼ãƒœãƒ¼ãƒ‰ã®ãƒ’ãƒ³ãƒˆ:", press: "æŠ¼ã™", toGenerate: "ã§ç”Ÿæˆ", alsoWorks: "ã‚‚ä½¿ç”¨å¯èƒ½", forNewLine: "ã§æ”¹è¡Œ",
    generating: "ç”Ÿæˆä¸­...", generate: "ç”Ÿæˆ", examples: "å‚è€ƒã«ã§ãã‚‹ãƒ—ãƒ­ãƒ³ãƒ—ãƒˆä¾‹:",
    selectPrompt: "ãƒ—ãƒ­ãƒ³ãƒ—ãƒˆã‚’é¸æŠž", characterLimit: "æ–‡å­—æ•°ã®ä¸Šé™ã«é”ã—ã¾ã—ãŸ - ç”Ÿæˆã§ãã¾ã›ã‚“", charactersRemaining: "æ–‡å­—æ®‹ã‚Š",
    shortcuts: "ã‚­ãƒ¼ãƒœãƒ¼ãƒ‰ã‚·ãƒ§ãƒ¼ãƒˆã‚«ãƒƒãƒˆ", openHelp: "ãƒ˜ãƒ«ãƒ—ã‚’é–‹ã", closeHelp: "ãƒ˜ãƒ«ãƒ—ã‚’é–‰ã˜ã‚‹", focusPrompt: "ãƒ—ãƒ­ãƒ³ãƒ—ãƒˆã«ç§»å‹•",
    generateStory: "ç‰©èªžã‚’ç”Ÿæˆ", publishStory: "ç‰©èªžã‚’å…¬é–‹", close: "é–‰ã˜ã‚‹", freeLimitReached: "ç„¡æ–™ä¸Šé™ã«é”ã—ã¾ã—ãŸ",
    freeLimitMessage: "ç„¡æ–™ã®ç‰©èªžç”Ÿæˆã‚’3å›žã™ã¹ã¦ä½¿ç”¨ã—ã¾ã—ãŸã€‚ç¶šã‘ã‚‹ã«ã¯ãƒ­ã‚°ã‚¤ãƒ³ã—ã¦ãã ã•ã„ã€‚", continueBrowsing: "é–²è¦§ã‚’ç¶šã‘ã‚‹", recentPrompts: "æœ€è¿‘ã®ãƒ—ãƒ­ãƒ³ãƒ—ãƒˆ", usePrompt: "ä½¿ç”¨", delete: "å‰Šé™¤", clearAll: "ã™ã¹ã¦ã‚¯ãƒªã‚¢", noRecentPrompts: "æœ€è¿‘ã®ãƒ—ãƒ­ãƒ³ãƒ—ãƒˆã¯ã‚ã‚Šã¾ã›ã‚“",
  },
  Korean: {

    back: "ë’¤ë¡œ", freeAccess: "ìš”ì²­ 3íšŒ ë¬´ë£Œ ì´ìš©", login: "ë¡œê·¸ì¸", forMore: "í•˜ê³  ë” ì´ìš©í•˜ì„¸ìš”!",
    perMonth: "ì›”ë³„", upgrade: "ì—…ê·¸ë ˆì´ë“œ", monthlyRequests: "ì´ë²ˆ ë‹¬ ìš”ì²­", totalPosts: "ì „ì²´ ê²Œì‹œë¬¼",
    titleStart: "ì•„ì´ë””ì–´ë¥¼", titleAccent: "ë©‹ì§„ ì´ì•¼ê¸°ë¡œ!", length: "ê¸¸ì´", language: "ì–¸ì–´",
    short: "ì§§ê²Œ", medium: "ì¤‘ê°„", long: "ê¸¸ê²Œ", promptPlaceholder: "ëª¨ë“  í›Œë¥­í•œ ì´ì•¼ê¸°ëŠ” í•˜ë‚˜ì˜ ì•„ì´ë””ì–´ì—ì„œ ì‹œìž‘ë©ë‹ˆë‹¤. ë‹¹ì‹ ì˜ ì•„ì´ë””ì–´ëŠ”?",
    keyboardTip: "í‚¤ë³´ë“œ íŒ:", press: "ëˆ„ë¥´ê¸°", toGenerate: "ìƒì„±", alsoWorks: "ë„ ê°€ëŠ¥", forNewLine: "ìƒˆ ì¤„",
    generating: "ìƒì„± ì¤‘...", generate: "ìƒì„±", examples: "ì°¸ê³ í•  ìˆ˜ ìžˆëŠ” í”„ë¡¬í”„íŠ¸ ì˜ˆì‹œ:",
    selectPrompt: "í”„ë¡¬í”„íŠ¸ ì„ íƒ", characterLimit: "ê¸€ìž ìˆ˜ ì œí•œ ë„ë‹¬ - ìƒì„±í•  ìˆ˜ ì—†ìŠµë‹ˆë‹¤", charactersRemaining: "ê¸€ìž ë‚¨ìŒ",
    shortcuts: "í‚¤ë³´ë“œ ë‹¨ì¶•í‚¤", openHelp: "ë„ì›€ë§ ì—´ê¸°", closeHelp: "ë„ì›€ë§ ë‹«ê¸°", focusPrompt: "í”„ë¡¬í”„íŠ¸ì— ì´ˆì ",
    generateStory: "ì´ì•¼ê¸° ìƒì„±", publishStory: "ì´ì•¼ê¸° ê²Œì‹œ", close: "ë‹«ê¸°", freeLimitReached: "ë¬´ë£Œ í•œë„ ë„ë‹¬",
    freeLimitMessage: "ë¬´ë£Œ ì´ì•¼ê¸° ìƒì„± 3íšŒë¥¼ ëª¨ë‘ ì‚¬ìš©í–ˆìŠµë‹ˆë‹¤. ê³„ì†í•˜ë ¤ë©´ ë¡œê·¸ì¸í•˜ì„¸ìš”.", continueBrowsing: "ê³„ì† ë‘˜ëŸ¬ë³´ê¸°", recentPrompts: "ìµœê·¼ í”„ë¡¬í”„íŠ¸", usePrompt: "ì‚¬ìš©", delete: "ì‚­ì œ", clearAll: "ëª¨ë‘ ì§€ìš°ê¸°", noRecentPrompts: "ìµœê·¼ í”„ë¡¬í”„íŠ¸ê°€ ì—†ìŠµë‹ˆë‹¤",
  },
  Bengali: {
    back: "à¦«à¦¿à¦°à§‡ à¦¯à¦¾à¦¨", freeAccess: "à§©à¦Ÿà¦¿ à¦…à¦¨à§à¦°à§‹à¦§à§‡à¦° à¦œà¦¨à§à¦¯ à¦¬à¦¿à¦¨à¦¾à¦®à§‚à¦²à§à¦¯à§‡ à¦¬à§à¦¯à¦¬à¦¹à¦¾à¦°", login: "à¦²à¦— à¦‡à¦¨", forMore: "à¦•à¦°à§‡ à¦†à¦°à¦“ à¦ªà¦¾à¦¨!",
    perMonth: "à¦ªà§à¦°à¦¤à¦¿ à¦®à¦¾à¦¸à§‡", upgrade: "à¦†à¦ªà¦—à§à¦°à§‡à¦¡", monthlyRequests: "à¦à¦‡ à¦®à¦¾à¦¸à§‡à¦° à¦…à¦¨à§à¦°à§‹à¦§", totalPosts: "à¦®à§‹à¦Ÿ à¦ªà§‹à¦¸à§à¦Ÿ",
    titleStart: "à¦†à¦ªà¦¨à¦¾à¦° à¦­à¦¾à¦¬à¦¨à¦¾à¦•à§‡ à¦¬à¦¦à¦²à§‡ à¦¦à¦¿à¦¨", titleAccent: "à¦…à¦¸à¦¾à¦§à¦¾à¦°à¦£ à¦—à¦²à§à¦ªà§‡!", length: "à¦¦à§ˆà¦°à§à¦˜à§à¦¯", language: "à¦­à¦¾à¦·à¦¾",
    short: "à¦›à§‹à¦Ÿ", medium: "à¦®à¦¾à¦à¦¾à¦°à¦¿", long: "à¦²à¦®à§à¦¬à¦¾", promptPlaceholder: "à¦ªà§à¦°à¦¤à¦¿à¦Ÿà¦¿ à¦®à¦¹à¦¾à¦¨ à¦—à¦²à§à¦ª à¦à¦•à¦Ÿà¦¿ à¦­à¦¾à¦¬à¦¨à¦¾ à¦¦à¦¿à¦¯à¦¼à§‡ à¦¶à§à¦°à§ à¦¹à¦¯à¦¼à¥¤ à¦†à¦ªà¦¨à¦¾à¦°à¦Ÿà¦¿ à¦•à§€?",
    keyboardTip: "à¦•à§€à¦¬à§‹à¦°à§à¦¡ à¦Ÿà¦¿à¦ª:", press: "à¦šà¦¾à¦ªà§à¦¨", toGenerate: "à¦¤à§ˆà¦°à¦¿ à¦•à¦°à¦¤à§‡", alsoWorks: "à¦à¦Ÿà¦¿à¦“ à¦•à¦¾à¦œ à¦•à¦°à§‡", forNewLine: "à¦¨à¦¤à§à¦¨ à¦²à¦¾à¦‡à¦¨à§‡à¦° à¦œà¦¨à§à¦¯",
    generating: "à¦¤à§ˆà¦°à¦¿ à¦¹à¦šà§à¦›à§‡...", generate: "à¦¤à§ˆà¦°à¦¿ à¦•à¦°à§à¦¨", examples: "à¦•à¦¿à¦›à§ à¦‰à¦¦à¦¾à¦¹à¦°à¦£ à¦ªà§à¦°à¦®à§à¦ªà¦Ÿ:",
    selectPrompt: "à¦à¦•à¦Ÿà¦¿ à¦ªà§à¦°à¦®à§à¦ªà¦Ÿ à¦¬à§‡à¦›à§‡ à¦¨à¦¿à¦¨", characterLimit: "à¦…à¦•à§à¦·à¦°à§‡à¦° à¦¸à§€à¦®à¦¾ à¦ªà§‚à¦°à§à¦£ - à¦¤à§ˆà¦°à¦¿ à¦¬à¦¨à§à¦§", charactersRemaining: "à¦…à¦•à§à¦·à¦° à¦¬à¦¾à¦•à¦¿",
    shortcuts: "à¦•à§€à¦¬à§‹à¦°à§à¦¡ à¦¶à¦°à§à¦Ÿà¦•à¦¾à¦Ÿ", openHelp: "à¦¸à¦¹à¦¾à¦¯à¦¼à¦¤à¦¾ à¦–à§à¦²à§à¦¨", closeHelp: "à¦¸à¦¹à¦¾à¦¯à¦¼à¦¤à¦¾ à¦¬à¦¨à§à¦§ à¦•à¦°à§à¦¨", focusPrompt: "à¦ªà§à¦°à¦®à§à¦ªà¦Ÿà§‡ à¦¯à¦¾à¦¨",
    generateStory: "à¦—à¦²à§à¦ª à¦¤à§ˆà¦°à¦¿ à¦•à¦°à§à¦¨", publishStory: "à¦—à¦²à§à¦ª à¦ªà§à¦°à¦•à¦¾à¦¶ à¦•à¦°à§à¦¨", close: "à¦¬à¦¨à§à¦§ à¦•à¦°à§à¦¨", freeLimitReached: "à¦¬à¦¿à¦¨à¦¾à¦®à§‚à¦²à§à¦¯à§‡à¦° à¦¸à§€à¦®à¦¾ à¦ªà§‚à¦°à§à¦£",
    freeLimitMessage: "à¦†à¦ªà¦¨à¦¿ à§©à¦Ÿà¦¿ à¦¬à¦¿à¦¨à¦¾à¦®à§‚à¦²à§à¦¯à§‡à¦° à¦—à¦²à§à¦ª à¦¤à§ˆà¦°à¦¿ à¦¬à§à¦¯à¦¬à¦¹à¦¾à¦° à¦•à¦°à§‡à¦›à§‡à¦¨à¥¤ à¦šà¦¾à¦²à¦¿à¦¯à¦¼à§‡ à¦¯à§‡à¦¤à§‡ à¦²à¦— à¦‡à¦¨ à¦•à¦°à§à¦¨à¥¤", continueBrowsing: "à¦¬à§à¦°à¦¾à¦‰à¦œ à¦šà¦¾à¦²à¦¿à¦¯à¦¼à§‡ à¦¯à¦¾à¦¨", recentPrompts: "à¦¸à¦®à§à¦ªà§à¦°à¦¤à¦¿ à¦¬à§à¦¯à¦¬à¦¹à§ƒà¦¤ à¦ªà§à¦°à¦®à§à¦ªà¦Ÿ", usePrompt: "à¦¬à§à¦¯à¦¬à¦¹à¦¾à¦° à¦•à¦°à§à¦¨", delete: "à¦®à§à¦›à§‡ à¦«à§‡à¦²à§à¦¨", clearAll: "à¦¸à¦¬ à¦®à§à¦›à§‡ à¦¦à¦¿à¦¨", noRecentPrompts: "à¦•à§‹à¦¨à§‹ à¦¸à¦®à§à¦ªà§à¦°à¦¤à¦¿ à¦¬à§à¦¯à¦¬à¦¹à§ƒà¦¤ à¦ªà§à¦°à¦®à§à¦ªà¦Ÿ à¦¨à§‡à¦‡",
  },
  Tamil: {
    back: "à®¤à®¿à®°à¯à®®à¯à®ªà¯", freeAccess: "3 à®•à¯‹à®°à®¿à®•à¯à®•à¯ˆà®•à®³à¯à®•à¯à®•à¯ à®‡à®²à®µà®š à®…à®£à¯à®•à®²à¯", login: "à®‰à®³à¯à®¨à¯à®´à¯ˆ", forMore: "à®šà¯†à®¯à¯à®¤à¯ à®®à¯‡à®²à¯à®®à¯ à®ªà¯†à®±à¯à®™à¯à®•à®³à¯!",
    perMonth: "à®®à®¾à®¤à®¤à¯à®¤à®¿à®±à¯à®•à¯", upgrade: "à®®à¯‡à®®à¯à®ªà®Ÿà¯à®¤à¯à®¤à¯", monthlyRequests: "à®‡à®¨à¯à®¤ à®®à®¾à®¤ à®•à¯‹à®°à®¿à®•à¯à®•à¯ˆà®•à®³à¯", totalPosts: "à®®à¯Šà®¤à¯à®¤ à®ªà®¤à®¿à®µà¯à®•à®³à¯",
    titleStart: "à®‰à®™à¯à®•à®³à¯ à®Žà®£à¯à®£à®™à¯à®•à®³à¯ˆ", titleAccent: "à®…à®±à¯à®ªà¯à®¤ à®•à®¤à¯ˆà®•à®³à®¾à®• à®®à®¾à®±à¯à®±à¯à®™à¯à®•à®³à¯!", length: "à®¨à¯€à®³à®®à¯", language: "à®®à¯Šà®´à®¿",
    short: "à®šà®¿à®±à®¿à®¯à®¤à¯", medium: "à®¨à®Ÿà¯à®¤à¯à®¤à®°à®®à¯", long: "à®¨à¯€à®³à®®à®¾à®©à®¤à¯", promptPlaceholder: "à®’à®µà¯à®µà¯Šà®°à¯ à®šà®¿à®±à®¨à¯à®¤ à®•à®¤à¯ˆà®¯à¯à®®à¯ à®’à®°à¯ à®Žà®£à¯à®£à®¤à¯à®¤à®¿à®²à¯ à®¤à¯Šà®Ÿà®™à¯à®•à¯à®•à®¿à®±à®¤à¯. à®‰à®™à¯à®•à®³à¯à®Ÿà¯ˆà®¯à®¤à¯ à®Žà®©à¯à®©?",
    keyboardTip: "à®µà®¿à®šà¯ˆà®ªà¯à®ªà®²à®•à¯ˆ à®•à¯à®±à®¿à®ªà¯à®ªà¯:", press: "à®…à®´à¯à®¤à¯à®¤à®µà¯à®®à¯", toGenerate: "à®‰à®°à¯à®µà®¾à®•à¯à®•", alsoWorks: "à®‡à®¤à¯à®µà¯à®®à¯ à®šà¯†à®¯à®²à¯à®ªà®Ÿà¯à®®à¯", forNewLine: "à®ªà¯à®¤à®¿à®¯ à®µà®°à®¿à®•à¯à®•à¯",
    generating: "à®‰à®°à¯à®µà®¾à®•à¯à®•à¯à®•à®¿à®±à®¤à¯...", generate: "à®‰à®°à¯à®µà®¾à®•à¯à®•à¯", examples: "à®šà®¿à®² à®Žà®Ÿà¯à®¤à¯à®¤à¯à®•à¯à®•à®¾à®Ÿà¯à®Ÿà¯ à®•à¯à®±à®¿à®ªà¯à®ªà¯à®•à®³à¯:",
    selectPrompt: "à®’à®°à¯ à®•à¯à®±à®¿à®ªà¯à®ªà¯ˆ à®¤à¯‡à®°à¯à®µà¯ à®šà¯†à®¯à¯à®•", characterLimit: "à®Žà®´à¯à®¤à¯à®¤à¯ à®µà®°à®®à¯à®ªà¯ à®…à®Ÿà¯ˆà®¨à¯à®¤à®¤à¯ - à®‰à®°à¯à®µà®¾à®•à¯à®•à®®à¯ à®®à¯à®Ÿà®•à¯à®•à®ªà¯à®ªà®Ÿà¯à®Ÿà®¤à¯", charactersRemaining: "à®Žà®´à¯à®¤à¯à®¤à¯à®•à®³à¯ à®®à¯€à®¤à®®à¯",
    shortcuts: "à®µà®¿à®šà¯ˆà®ªà¯à®ªà®²à®•à¯ˆ à®•à¯à®±à¯à®•à¯à®•à¯à®µà®´à®¿à®•à®³à¯", openHelp: "à®‰à®¤à®µà®¿ à®¤à®¿à®±", closeHelp: "à®‰à®¤à®µà®¿ à®®à¯‚à®Ÿà¯", focusPrompt: "à®•à¯à®±à®¿à®ªà¯à®ªà®¿à®²à¯ à®•à®µà®©à®®à¯",
    generateStory: "à®•à®¤à¯ˆ à®‰à®°à¯à®µà®¾à®•à¯à®•à¯", publishStory: "à®•à®¤à¯ˆ à®µà¯†à®³à®¿à®¯à®¿à®Ÿà¯", close: "à®®à¯‚à®Ÿà¯", freeLimitReached: "à®‡à®²à®µà®š à®µà®°à®®à¯à®ªà¯ à®…à®Ÿà¯ˆà®¨à¯à®¤à®¤à¯",
    freeLimitMessage: "3 à®‡à®²à®µà®š à®•à®¤à¯ˆ à®‰à®°à¯à®µà®¾à®•à¯à®•à®™à¯à®•à®³à¯ˆà®¯à¯à®®à¯ à®ªà®¯à®©à¯à®ªà®Ÿà¯à®¤à¯à®¤à®¿à®µà®¿à®Ÿà¯à®Ÿà¯€à®°à¯à®•à®³à¯. à®¤à¯Šà®Ÿà®° à®‰à®³à¯à®¨à¯à®´à¯ˆà®¯à®µà¯à®®à¯.", continueBrowsing: "à®¤à¯Šà®Ÿà®°à¯à®¨à¯à®¤à¯ à®ªà®¾à®°à¯à®µà¯ˆà®¯à®¿à®Ÿà¯", recentPrompts: "à®šà®®à¯€à®ªà®¤à¯à®¤à®¿à®¯ à®•à¯à®±à®¿à®ªà¯à®ªà¯à®•à®³à¯", usePrompt: "à®ªà®¯à®©à¯à®ªà®Ÿà¯à®¤à¯à®¤à¯", delete: "à®¨à¯€à®•à¯à®•à¯", clearAll: "à®…à®©à¯ˆà®¤à¯à®¤à¯ˆà®¯à¯à®®à¯ à®¨à¯€à®•à¯à®•à¯", noRecentPrompts: "à®šà®®à¯€à®ªà®¤à¯à®¤à®¿à®¯ à®•à¯à®±à®¿à®ªà¯à®ªà¯à®•à®³à¯ à®‡à®²à¯à®²à¯ˆ",
  },
  Telugu: {
    back: "à°µà±†à°¨à±à°•à°•à±", freeAccess: "3 à°…à°­à±à°¯à°°à±à°¥à°¨à°²à°•à± à°‰à°šà°¿à°¤ à°ªà±à°°à°µà±‡à°¶à°‚", login: "à°²à°¾à°—à°¿à°¨à±", forMore: "à°šà±‡à°¸à°¿ à°®à°°à°¿à°¨à±à°¨à°¿ à°ªà±Šà°‚à°¦à°‚à°¡à°¿!",
    perMonth: "à°¨à±†à°²à°•à±", upgrade: "à°…à°ªà±â€Œà°—à±à°°à±‡à°¡à±", monthlyRequests: "à°ˆ à°¨à±†à°² à°…à°­à±à°¯à°°à±à°¥à°¨à°²à±", totalPosts: "à°®à±Šà°¤à±à°¤à°‚ à°ªà±‹à°¸à±à°Ÿà±à°²à±",
    titleStart: "à°®à±€ à°†à°²à±‹à°šà°¨à°²à°¨à±", titleAccent: "à°…à°¦à±à°­à±à°¤ à°•à°¥à°²à±à°—à°¾ à°®à°¾à°°à±à°šà°‚à°¡à°¿!", length: "à°ªà±Šà°¡à°µà±", language: "à°­à°¾à°·",
    short: "à°šà°¿à°¨à±à°¨à°¦à°¿", medium: "à°®à°§à±à°¯à°¸à±à°¥à°‚", long: "à°ªà±Šà°¡à°µà±ˆà°¨à°¦à°¿", promptPlaceholder: "à°ªà±à°°à°¤à°¿ à°—à±Šà°ªà±à°ª à°•à°¥ à°’à°• à°†à°²à±‹à°šà°¨à°¤à±‹ à°®à±Šà°¦à°²à°µà±à°¤à±à°‚à°¦à°¿. à°®à±€à°¦à°¿ à°à°®à°¿à°Ÿà°¿?",
    keyboardTip: "à°•à±€à°¬à±‹à°°à±à°¡à± à°šà°¿à°Ÿà±à°•à°¾:", press: "à°¨à±Šà°•à±à°•à°‚à°¡à°¿", toGenerate: "à°°à±‚à°ªà±Šà°‚à°¦à°¿à°‚à°šà°¡à°¾à°¨à°¿à°•à°¿", alsoWorks: "à°•à±‚à°¡à°¾ à°ªà°¨à°¿à°šà±‡à°¸à±à°¤à±à°‚à°¦à°¿", forNewLine: "à°•à±Šà°¤à±à°¤ à°²à±ˆà°¨à± à°•à±‹à°¸à°‚",
    generating: "à°°à±‚à°ªà±Šà°‚à°¦à°¿à°¸à±à°¤à±‹à°‚à°¦à°¿...", generate: "à°°à±‚à°ªà±Šà°‚à°¦à°¿à°‚à°šà±", examples: "à°•à±Šà°¨à±à°¨à°¿ à°‰à°¦à°¾à°¹à°°à°£ à°ªà±à°°à°¾à°‚à°ªà±à°Ÿà±â€Œà°²à±:",
    selectPrompt: "à°ªà±à°°à°¾à°‚à°ªà±à°Ÿà± à°Žà°‚à°šà±à°•à±‹à°‚à°¡à°¿", characterLimit: "à°…à°•à±à°·à°° à°ªà°°à°¿à°®à°¿à°¤à°¿ à°šà±‡à°°à°¿à°‚à°¦à°¿ - à°°à±‚à°ªà±Šà°‚à°¦à°¿à°‚à°ªà± à°¨à°¿à°²à°¿à°ªà°¿à°µà±‡à°¯à°¬à°¡à°¿à°‚à°¦à°¿", charactersRemaining: "à°…à°•à±à°·à°°à°¾à°²à± à°®à°¿à°—à°¿à°²à°¾à°¯à°¿",
    shortcuts: "à°•à±€à°¬à±‹à°°à±à°¡à± à°¸à°¤à±à°µà°°à°®à°¾à°°à±à°—à°¾à°²à±", openHelp: "à°¸à°¹à°¾à°¯à°‚ à°¤à±†à°°à°µà°‚à°¡à°¿", closeHelp: "à°¸à°¹à°¾à°¯à°‚ à°®à±‚à°¸à°¿à°µà±‡à°¯à°‚à°¡à°¿", focusPrompt: "à°ªà±à°°à°¾à°‚à°ªà±à°Ÿà±â€Œà°ªà±ˆ à°¦à±ƒà°·à±à°Ÿà°¿",
    generateStory: "à°•à°¥ à°°à±‚à°ªà±Šà°‚à°¦à°¿à°‚à°šà±", publishStory: "à°•à°¥ à°ªà±à°°à°šà±à°°à°¿à°‚à°šà±", close: "à°®à±‚à°¸à°¿à°µà±‡à°¯à°¿", freeLimitReached: "à°‰à°šà°¿à°¤ à°ªà°°à°¿à°®à°¿à°¤à°¿ à°šà±‡à°°à°¿à°‚à°¦à°¿",
    freeLimitMessage: "à°®à±€à°°à± 3 à°‰à°šà°¿à°¤ à°•à°¥à°¾ à°°à±‚à°ªà±Šà°‚à°¦à°¿à°‚à°ªà±à°²à°¨à± à°‰à°ªà°¯à±‹à°—à°¿à°‚à°šà°¾à°°à±. à°•à±Šà°¨à°¸à°¾à°—à°¡à°¾à°¨à°¿à°•à°¿ à°²à°¾à°—à°¿à°¨à± à°šà±‡à°¯à°‚à°¡à°¿.", continueBrowsing: "à°¬à±à°°à±Œà°œà°¿à°‚à°—à± à°•à±Šà°¨à°¸à°¾à°—à°¿à°‚à°šà±", recentPrompts: "à°‡à°Ÿà±€à°µà°² à°ªà±à°°à°¾à°‚à°ªà±à°Ÿà±â€Œà°²à±", usePrompt: "à°‰à°ªà°¯à±‹à°—à°¿à°‚à°šà±", delete: "à°¤à±Šà°²à°—à°¿à°‚à°šà±", clearAll: "à°…à°¨à±à°¨à°¿à°‚à°Ÿà°¿à°¨à°¿ à°¤à±Šà°²à°—à°¿à°‚à°šà±", noRecentPrompts: "à°‡à°Ÿà±€à°µà°² à°ªà±à°°à°¾à°‚à°ªà±à°Ÿà±â€Œà°²à± à°²à±‡à°µà±",
  },
  Marathi: {
    back: "à¤®à¤¾à¤—à¥‡", freeAccess: "3 à¤µà¤¿à¤¨à¤‚à¤¤à¥à¤¯à¤¾à¤‚à¤¸à¤¾à¤ à¥€ à¤®à¥‹à¤«à¤¤ à¤ªà¥à¤°à¤µà¥‡à¤¶", login: "à¤²à¥‰à¤— à¤‡à¤¨", forMore: "à¤•à¤°à¥‚à¤¨ à¤…à¤§à¤¿à¤• à¤®à¤¿à¤³à¤µà¤¾!",
    perMonth: "à¤¦à¤° à¤®à¤¹à¤¿à¤¨à¤¾", upgrade: "à¤…à¤ªà¤—à¥à¤°à¥‡à¤¡", monthlyRequests: "à¤¯à¤¾ à¤®à¤¹à¤¿à¤¨à¥à¤¯à¤¾à¤¤à¥€à¤² à¤µà¤¿à¤¨à¤‚à¤¤à¥à¤¯à¤¾", totalPosts: "à¤à¤•à¥‚à¤£ à¤ªà¥‹à¤¸à¥à¤Ÿ",
    titleStart: "à¤¤à¥à¤®à¤šà¥à¤¯à¤¾ à¤•à¤²à¥à¤ªà¤¨à¤¾ à¤¬à¤¦à¤²à¤¾", titleAccent: "à¤…à¤¦à¥à¤­à¥à¤¤ à¤•à¤¥à¤¾à¤‚à¤®à¤§à¥à¤¯à¥‡!", length: "à¤²à¤¾à¤‚à¤¬à¥€", language: "à¤­à¤¾à¤·à¤¾",
    short: "à¤²à¤¹à¤¾à¤¨", medium: "à¤®à¤§à¥à¤¯à¤®", long: "à¤²à¤¾à¤‚à¤¬", promptPlaceholder: "à¤ªà¥à¤°à¤¤à¥à¤¯à¥‡à¤• à¤®à¤¹à¤¾à¤¨ à¤•à¤¥à¤¾ à¤à¤•à¤¾ à¤•à¤²à¥à¤ªà¤¨à¥‡à¤ªà¤¾à¤¸à¥‚à¤¨ à¤¸à¥à¤°à¥‚ à¤¹à¥‹à¤¤à¥‡. à¤¤à¥à¤®à¤šà¥€ à¤•à¤²à¥à¤ªà¤¨à¤¾ à¤•à¤¾à¤¯ à¤†à¤¹à¥‡?",
    keyboardTip: "à¤•à¥€à¤¬à¥‹à¤°à¥à¤¡ à¤¸à¥‚à¤šà¤¨à¤¾:", press: "à¤¦à¤¾à¤¬à¤¾", toGenerate: "à¤¤à¤¯à¤¾à¤° à¤•à¤°à¤£à¥à¤¯à¤¾à¤¸à¤¾à¤ à¥€", alsoWorks: "à¤¹à¥‡à¤¹à¥€ à¤šà¤¾à¤²à¤¤à¥‡", forNewLine: "à¤¨à¤µà¥€à¤¨ à¤“à¤³à¥€à¤¸à¤¾à¤ à¥€",
    generating: "à¤¤à¤¯à¤¾à¤° à¤¹à¥‹à¤¤ à¤†à¤¹à¥‡...", generate: "à¤¤à¤¯à¤¾à¤° à¤•à¤°à¤¾", examples: "à¤•à¤¾à¤¹à¥€ à¤‰à¤¦à¤¾à¤¹à¤°à¤£ à¤ªà¥à¤°à¥‰à¤®à¥à¤ªà¥à¤Ÿ:",
    selectPrompt: "à¤ªà¥à¤°à¥‰à¤®à¥à¤ªà¥à¤Ÿ à¤¨à¤¿à¤µà¤¡à¤¾", characterLimit: "à¤…à¤•à¥à¤·à¤° à¤®à¤°à¥à¤¯à¤¾à¤¦à¤¾ à¤ªà¥‚à¤°à¥à¤£ - à¤¨à¤¿à¤°à¥à¤®à¤¿à¤¤à¥€ à¤¬à¤‚à¤¦ à¤†à¤¹à¥‡", charactersRemaining: "à¤…à¤•à¥à¤·à¤°à¥‡ à¤¬à¤¾à¤•à¥€",
    shortcuts: "à¤•à¥€à¤¬à¥‹à¤°à¥à¤¡ à¤¶à¥‰à¤°à¥à¤Ÿà¤•à¤Ÿ", openHelp: "à¤®à¤¦à¤¤ à¤‰à¤˜à¤¡à¤¾", closeHelp: "à¤®à¤¦à¤¤ à¤¬à¤‚à¤¦ à¤•à¤°à¤¾", focusPrompt: "à¤ªà¥à¤°à¥‰à¤®à¥à¤ªà¥à¤Ÿà¤µà¤° à¤²à¤•à¥à¤·",
    generateStory: "à¤•à¤¥à¤¾ à¤¤à¤¯à¤¾à¤° à¤•à¤°à¤¾", publishStory: "à¤•à¤¥à¤¾ à¤ªà¥à¤°à¤•à¤¾à¤¶à¤¿à¤¤ à¤•à¤°à¤¾", close: "à¤¬à¤‚à¤¦ à¤•à¤°à¤¾", freeLimitReached: "à¤®à¥‹à¤«à¤¤ à¤®à¤°à¥à¤¯à¤¾à¤¦à¤¾ à¤ªà¥‚à¤°à¥à¤£",
    freeLimitMessage: "à¤¤à¥à¤®à¥à¤¹à¥€ à¤¸à¤°à¥à¤µ 3 à¤®à¥‹à¤«à¤¤ à¤•à¤¥à¤¾ à¤¨à¤¿à¤°à¥à¤®à¤¿à¤¤à¥€ à¤µà¤¾à¤ªà¤°à¤²à¥à¤¯à¤¾ à¤†à¤¹à¥‡à¤¤. à¤ªà¥à¤¢à¥‡ à¤¸à¥à¤°à¥‚ à¤ à¥‡à¤µà¤£à¥à¤¯à¤¾à¤¸à¤¾à¤ à¥€ à¤²à¥‰à¤— à¤‡à¤¨ à¤•à¤°à¤¾.", continueBrowsing: "à¤¬à¥à¤°à¤¾à¤‰à¤à¤¿à¤‚à¤— à¤¸à¥à¤°à¥‚ à¤ à¥‡à¤µà¤¾", recentPrompts: "à¤…à¤²à¥€à¤•à¤¡à¥€à¤² à¤ªà¥à¤°à¥‰à¤®à¥à¤ªà¥à¤Ÿ", usePrompt: "à¤µà¤¾à¤ªà¤°à¤¾", delete: "à¤¹à¤Ÿà¤µà¤¾", clearAll: "à¤¸à¤°à¥à¤µ à¤®à¥à¤¡à¥‚à¤¨ à¤Ÿà¤¾à¤•à¤¾", noRecentPrompts: "à¤…à¤²à¥€à¤•à¤¡à¥€à¤² à¤ªà¥à¤°à¥‰à¤®à¥à¤ªà¥à¤Ÿ à¤¨à¤¾à¤¹à¥€à¤¤",

  },
};

const LANGUAGE_STORAGE_KEY = "storySparkLanguage";

// NEW: Tone definitions â€” each has a label, emoji, and Tailwind colour classes
// for the active/inactive pill states.

const TONES = [
  { label: "Dark", emoji: "🌑" },
  { label: "Whimsical", emoji: "🌈" },
  { label: "Dramatic", emoji: "🎬" },
  { label: "Humorous", emoji: "😄" },
  { label: "Suspenseful", emoji: "😨" },
  { label: "Heartwarming", emoji: "🥰" },
] as const;

const StoriesComponent: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { register, handleSubmit, reset, setValue } = useForm<Inputs>();

  // Fetch initial draft from LocalStorage
  const draft = useMemo(() => {
    try {
      const draftJson = localStorage.getItem("story_spark_draft");
      return draftJson ? JSON.parse(draftJson) : null;
    } catch {
      return null;
    }
  }, []);

  // Shared States
  const [stories, setStories] = useState<IStories[]>(() => {
    return draft?.stories?.length ? draft.stories : [];
  });
  const [selectedStory, setSelectedStory] = useState<IStories | null>(() => {
    return draft?.stories?.length ? draft.stories[0] : null;
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [selectedGenre, setSelectedGenre] = useState<string>(() => {
    return draft?.genre || "🧙 Fantasy";
  });
  const [selectedLength, setSelectedLength] = useState<string>(() => {
    return draft?.length || "medium";
  });
  const [selectedTone, setSelectedTone] = useState<string>(() => {
    return draft?.tone || "Dramatic";
  });
  const [selectedLanguage, setSelectedLanguage] = useState<string>(() => {
    return draft?.language || "English";
  });
  const [textareaValue, setTextareaValue] = useState<string>(() => {
    return location.state?.prompt || draft?.prompt || "";
  });
  const [characters, setCharacters] = useState<ICharacter[]>(() => {
    return draft?.characters || [];
  });

  // UI state variables
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState<boolean>(false);
  const [showHelpModal, setShowHelpModal] = useState<boolean>(false);
  const [showLimitModal, setShowLimitModal] = useState<boolean>(false);
  const [activeMobileTab, setActiveMobileTab] = useState<"create" | "read">("create");

  // Refs & Soundtracks
  const dropdownRef = useRef<HTMLDivElement>(null);
  const languageDropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const login = isLoggedIn();
  const { data: userProfile } = useGetProfileInfoQuery(undefined, { skip: !login });
  const subscriptionType = (getUserInfo()?.subscriptionType as string) || "free";

  const [guestRequestCount, setGuestRequestCount] = useState<number>(() =>
    parseInt(localStorage.getItem("guestRequestCount") || "0", 10)
  );

  const [generateModel] = useGenerateModelMutation();
  const [generateFreeModel] = useGenerateFreeModelMutation();

  // Genre Soundtrack Manager
  const playSoundtrack = (genre: string) => {
    const soundtrack = soundtrackMap[genre];
    if (!soundtrack) return;
    if (audioRef.current) {
      try {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current.src = soundtrack;
        audioRef.current.play().catch(() => {
          /* browser autoplay blocking compatibility */
        });
      } catch (err) {
        console.error("Audio error", err);
      }
    }
  };

  // Autosave story inputs draft
  useEffect(() => {
    const draftData = {
      prompt: textareaValue,
      genre: selectedGenre,
      length: selectedLength,
      language: selectedLanguage,
      tone: selectedTone,
      characters,
      stories,
    };
    const timer = setTimeout(() => {
      localStorage.setItem("story_spark_draft", JSON.stringify(draftData));
    }, 1000);
    return () => clearTimeout(timer);
  }, [textareaValue, selectedGenre, selectedLength, selectedLanguage, selectedTone, characters, stories]);

  // Sync route context parameters
  useEffect(() => {
    if (location.state && location.state.prompt) {
      setTextareaValue(location.state.prompt);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  useEffect(() => {
    setValue("prompt", textareaValue);
  }, [textareaValue, setValue]);

  // Keyboard accessibility triggers
  useKeyboardShortcuts({
    onOpenHelp: () => setShowHelpModal(true),
    onCloseHelp: () => setShowHelpModal(false),
    onGenerate: () => {
      if (inputRef.current) {
        const form = inputRef.current.closest("form");
        if (form) form.requestSubmit();
      }
    },
    onPublish: () => {
      const publishBtn = document.getElementById("publish-story-btn");
      publishBtn?.click();
    },
    focusPrompt: () => {
      inputRef.current?.focus();
    },
    hasStory: stories.length > 0,
  });

  const generateId = () => Math.random().toString(36).substring(2, 9);

  // Character customizer CRUD
  const handleAddCharacter = () => {
    setCharacters((prev) => [
      ...prev,
      {
        id: generateId(),
        name: "",
        role: "Protagonist",
        personality: "",
      },
    ]);
  };

  const handleRemoveCharacter = (id: string) => {
    setCharacters((prev) => prev.filter((char) => char.id !== id));
  };

  const handleCharacterChange = (id: string, field: keyof ICharacter, value: string) => {
    setCharacters((prev) =>
      prev.map((char) => (char.id === id ? { ...char, [field]: value } : char))
    );
  };

  const handleClearPrompt = () => {
    setTextareaValue("");
    setValue("prompt", "");
    if (inputRef.current) inputRef.current.focus();
  };

const onSubmit: SubmitHandler<Inputs> = useCallback(async (data) => {
    if (isGenerationInProgressRef.current) return;
    
    if (getWordCount(data.prompt) < 10) {
      toast.error("Please enter a prompt with at least 10 words to generate a story.");
      return;
    }

    setLoading(true);
    setIsHighLatency(false);
    isGenerationInProgressRef.current = true;

    // Timeout to simulate high latency state if generation takes more than 5s
    let latencyTimeoutId: ReturnType<typeof setTimeout> | null = setTimeout(() => {
      setIsHighLatency(true);
    }, 5000);

    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    try {
      timeoutId = setTimeout(() => {
        if (isGenerationInProgressRef.current) {
          toast.error("Story generation timed out. Please try again.");
          handleCancelGeneration(true);
        }
      }, 60000);

      const payload = {
        prompt: selectedGenre ? `[Genre: ${selectedGenre}] ${data.prompt}` : data.prompt,
        wordLength: selectedLength === "short" ? 175 : selectedLength === "long" ? 800 : 450,
        language: selectedLanguage,
        tone: selectedTone || undefined,
        characters: characters.map(({ name, role, personality }) => ({ name, role, personality })),
      };

      const generationRequest = login ? generateModel(payload) : generateFreeModel(payload);
      activeGenerationRef.current = generationRequest;
      const res = await generationRequest.unwrap();
      
      if (res) {
        toast.success(res.message);
        addPrompt(data.prompt);
        setStories(getUniqueStories(res.data as IStories[]));
        setTextareaValue("");
        setSelectedPrompt("");
        setValue("prompt", "");
        // Clear draft after successful generation
        localStorage.removeItem(DRAFT_KEY);
        setDraftStatus("");
        reset();
        setCharacters([]);
        setCurrentStep(1);
        if (selectedGenre) {
          playSoundtrack(selectedGenre);
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      if (message !== "Story generation was cancelled.") {
        toast.error(message);
      }
    } finally {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      if (latencyTimeoutId) {
        clearTimeout(latencyTimeoutId);
      }
      activeGenerationRef.current = null;
      isGenerationInProgressRef.current = false;
      setLoading(false);
      setIsHighLatency(false);
    }
  }, [
    login,
    guestRequestCount,
    selectedGenre,
    selectedLength,
    selectedLanguage,
    selectedTone,
    generateModel,
    generateFreeModel,
    addPrompt,
    setValue,
    playSoundtrack,
    handleCancelGeneration,
    characters,
    reset,
  ]);

  const handleAddTopic = () => {
    const title = newTopicTitle.trim();
    if (!title) {
      toast.error("Please enter a topic.");
      return;
    }

    const normalizedTitle = title.startsWith("#") ? title : `#${title}`;
    const topicExists = topics.some(
      (topic) => topic.title.toLowerCase() === normalizedTitle.toLowerCase()
    );

    if (topicExists) {
      toast.error("This topic already exists.");
      return;
    }

    setTopics((currentTopics) => [
      ...currentTopics,
      {
        title: normalizedTitle,
        className: SELECTED_TOPIC_CLASSES,
        color: SELECTED_TOPIC_CLASSES,
        selected: true,
      },
    ]);
    setNewTopicTitle("");
  };

  const handleRemoveTopic = (index: number) => {
    if (topics.length <= 2) {
      toast.error("At least 2 topics are required.");
      return;
    }

    setTopics((currentTopics) =>
      currentTopics.filter((_, topicIndex) => topicIndex !== index)
    );
  };

  const handleCopyStory = async () => {
    if (selectedStory?.content) {
      await navigator.clipboard.writeText(selectedStory.content);
      setIsCopied(true);
      toast.success("Story copied!");
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleExportPDF = async () => {
    if (!selectedStory) { toast.error("No story available to export."); return; }
    if (!selectedStory.content?.trim()) {toast.error("Story content is empty. Cannot export.");return;}
    const toastId = toast.loading("Preparing your premium PDF...");

    try {
      // Helper to load image assets asynchronously with a safe timeout
      const loadImageWithTimeout = (src: string, timeoutMs: number = 3000): Promise<HTMLImageElement> => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.crossOrigin = "anonymous";
          const timeout = setTimeout(() => {
            img.src = ""; // stop loading
            reject(new Error(`Timeout loading image: ${src}`));
          }, timeoutMs);

          img.onload = () => {
            clearTimeout(timeout);
            resolve(img);
          };
          img.onerror = (e) => {
            clearTimeout(timeout);
            reject(e);
          };
          img.src = src;
        });
      };

      let logoImg: HTMLImageElement | null = null;
      let storyImg: HTMLImageElement | null = null;

      try {
        logoImg = await loadImageWithTimeout(logo);
      } catch (err) {
        console.warn("Failed to load StorySparkAI logo for PDF", err);
      }

      if (selectedStory.imageURL) {
        try {
          storyImg = await loadImageWithTimeout(selectedStory.imageURL);
        } catch (err) {
          console.warn("Failed to load story banner image for PDF", err);
        }
      }

      // Initialize A4 PDF document (210mm x 297mm)
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const title = selectedStory.title || "Untitled Story";
      const content = selectedStory.content || "";
      const tag = (selectedStory.tag || "STORY").toUpperCase();

      const leftMargin = 20;
      const rightMargin = 20;
      const topMargin = 20;
      const bottomMargin = 20;
      const printableWidth = 210 - leftMargin - rightMargin; // 170 mm
      const maxY = 297 - bottomMargin - 10; // Bottom boundary (267mm) leaving room for footer

      let yCursor = topMargin;

      // 1. Header (Logo & Sub-header)
      if (logoImg) {
        const logoHeight = 8;
        const logoWidth = (logoImg.width / logoImg.height) * logoHeight;
        doc.addImage(logoImg, "PNG", leftMargin, yCursor, logoWidth, logoHeight);
      } else {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.setTextColor(99, 102, 241); // Brand Indigo
        doc.text("StorySparkAI", leftMargin, yCursor + 6);
      }

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184); // Slate 400
      doc.text("PREMIUM AI GENERATED STORY", 190, yCursor + 5, { align: "right" });

      yCursor += 10;

      // Header Divider Line
      doc.setDrawColor(99, 102, 241); // Brand Indigo
      doc.setLineWidth(0.5);
      doc.line(leftMargin, yCursor, 190, yCursor);

      yCursor += 8;

      // 2. Story Banner Image (only on Page 1)
      if (storyImg) {
        const bannerHeight = 55;
        doc.addImage(storyImg, "JPEG", leftMargin, yCursor, printableWidth, bannerHeight);
        yCursor += bannerHeight + 8;
      }

      // 3. Story Title
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.setTextColor(30, 41, 59); // Slate 800
      const splitTitle = doc.splitTextToSize(title, printableWidth);
      splitTitle.forEach((line: string) => {
        doc.text(line, leftMargin, yCursor);
        yCursor += 9;
      });

      yCursor += 1;

      // 4. Meta Row (Generated Date & Genre Pill Badge)
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139); // Slate 500
      const formattedDate = new Date().toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      doc.text(`Generated on ${formattedDate}`, leftMargin, yCursor);

      // Genre pill badge on the right
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      const tagWidth = doc.getTextWidth(tag);
      const chipWidth = tagWidth + 5;
      const chipHeight = 5;
      const chipX = 190 - chipWidth;
      const chipY = yCursor - 3.8;

      doc.setFillColor(99, 102, 241); // Brand Indigo background
      doc.roundedRect(chipX, chipY, chipWidth, chipHeight, 1, 1, "F");

      doc.setTextColor(255, 255, 255); // White text inside pill
      doc.text(tag, chipX + 2.5, chipY + 3.5);

      yCursor += 4.5;

      // Meta row bottom line
      doc.setDrawColor(226, 232, 240); // Slate 200
      doc.setLineWidth(0.2);
      doc.line(leftMargin, yCursor, 190, yCursor);

      yCursor += 10;

      // 5. Story Paragraphs Flowing
      const paragraphs = content.split(/\n+/);
      const lineHeight = 6.5;
      const paragraphSpacing = 4.5;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.setTextColor(30, 41, 59); // Slate 800

      paragraphs.forEach((para: string, pIdx: number) => {
        const cleanPara = para.trim();
        if (!cleanPara) return;

        const lines = doc.splitTextToSize(cleanPara, printableWidth);
        lines.forEach((line: string) => {
          if (yCursor > maxY) {
            doc.addPage();
            yCursor = 30; // Top padding for subsequent pages
          }
          doc.setFont("helvetica", "normal");
          doc.setFontSize(11);
          doc.setTextColor(30, 41, 59); // Slate 800
          doc.text(line, leftMargin, yCursor);
          yCursor += lineHeight;
        });

        if (pIdx < paragraphs.length - 1) {
          yCursor += paragraphSpacing;
        }
      });

      // 6. Running Header and Footer generation
      const totalPages = doc.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);

        // Footer line
        doc.setDrawColor(241, 245, 249);
        doc.setLineWidth(0.25);
        doc.line(leftMargin, 280, 190, 280);

        // Footer Text
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(100, 116, 139); // Slate 500
        doc.text("Generated with StorySparkAI", leftMargin, 285);
        doc.text(`Page ${i} of ${totalPages}`, 190, 285, { align: "right" });

        // Header on pages 2+
        if (i > 1) {
          doc.setFont("helvetica", "bold");
          doc.setFontSize(8);
          doc.setTextColor(99, 102, 241); // Brand Indigo
          doc.text("StorySparkAI", leftMargin, 14);

          doc.setFont("helvetica", "normal");
          doc.setFontSize(8);
          doc.setTextColor(148, 163, 184); // Slate 400
          const headerTitle = title.length > 50 ? title.substring(0, 50) + "..." : title;
          doc.text(headerTitle, 190, 14, { align: "right" });

          doc.setDrawColor(241, 245, 249);
          doc.setLineWidth(0.2);
          doc.line(leftMargin, 17, 190, 17);
        }
      }

      // Save PDF with sanitized name
      const safeTitle = title.replace(/[^a-z0-9]/gi, "_").toLowerCase();
      doc.save(`storyspark_${safeTitle}.pdf`);
      toast.dismiss(toastId);
      toast.success("PDF generated successfully!");
    } catch (err) {
      console.error("PDF generation error:", err);
      toast.dismiss(toastId);
      toast.error("Failed to generate PDF. Please try again.");
    }
  };

  const isOverLimit = textareaValue.length >= MAX_PROMPT_LENGTH;
  const isNearLimit = textareaValue.length >= MAX_PROMPT_LENGTH * WARN_THRESHOLD;
  const isDangerLimit = textareaValue.length >= MAX_PROMPT_LENGTH * DANGER_THRESHOLD;

  // Pre-load prompt triggers
  const handleExampleSelect = (promptText: string) => {
    setTextareaValue(promptText);
    setValue("prompt", promptText);
    setIsDropdownOpen(false);
  };

  // Close dropdown helpers on outside click
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (languageDropdownRef.current && !languageDropdownRef.current.contains(event.target as Node)) {
        setIsLanguageDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <div className="min-h-screen bg-[#070b13] text-slate-100 relative overflow-hidden font-sans pb-10">
      <audio ref={audioRef} className="hidden" />
      <Toaster position="top-right" reverseOrder={false} />

      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-[-300px] left-[-100px] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-[-200px] right-[-100px] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[160px] pointer-events-none" />

      {/* Main Header / Status Row */}
      <header className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between border-b border-white/5 relative z-25 bg-[#070b13]/85 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-xs font-semibold tracking-wider text-slate-300"
          >
            ← BACK
          </Link>
        </div>

        {!login && (
          <div className="hidden md:flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 px-4 py-1.5 rounded-full text-xs text-indigo-300">
            <span>Free access for 3 requests — <Link to="/login" className="underline font-bold text-indigo-200">Login</Link> for unlimited!</span>
          </div>
        )}

        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end text-xs text-slate-400">
            <span>Requests this month: {login ? (userProfile?.requestsThisMonth ?? 0) : guestRequestCount} / {getRequestLimit(subscriptionType)}</span>
            <span className="text-[10px] text-slate-500">Total Published Posts: {login ? (userProfile?.postsCount ?? 0) : 0}</span>
          </div>
          <Link
            to="/pricing"
            className="px-4 py-1.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-full text-xs font-bold transition-all shadow-lg hover:shadow-orange-500/10 flex items-center gap-1 cursor-pointer"
          >
            Upgrade Plan ⚡
          </Link>
        </div>
      </header>

      {/* Main Split Screen Area */}
      <main className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 relative z-10">
        
        {/* Mobile Navigation Tabs */}
        <div className="flex lg:hidden w-full bg-slate-900/60 border border-white/5 p-1 rounded-xl mb-6">
          <button
            onClick={() => setActiveMobileTab("create")}
            className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${
              activeMobileTab === "create"
                ? "bg-indigo-600 text-white shadow-md"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Edit3 className="w-4 h-4" /> Define Settings
          </button>
          <button
            onClick={() => setActiveMobileTab("read")}
            className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${
              activeMobileTab === "read"
                ? "bg-indigo-600 text-white shadow-md"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Eye className="w-4 h-4" /> Workspace Canvas
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Panel (AI Input form controls) */}
          <div className={`lg:col-span-4 flex flex-col gap-6 ${activeMobileTab !== "create" ? "hidden lg:flex" : "flex"}`}>
            
            {/* Main Creative Form Card */}
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
              
              {/* Settings Card */}
              <div className="bg-slate-900/40 border border-white/5 rounded-3xl p-6 backdrop-blur-xl flex flex-col gap-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-bold tracking-wider text-slate-400 uppercase flex items-center gap-1.5">
                    <Gauge className="w-4 h-4 text-indigo-400" /> Story Settings
                  </h2>
                  <button
                    type="button"
                    onClick={() => setShowHelpModal(true)}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    <HelpCircle className="w-4 h-4" />
                  </button>
                </div>

                {/* Genre chips selection */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Genre Category</label>
                  <div className="flex flex-wrap gap-2">
                    {GENRES.map((genre) => (
                      <button
                        key={genre.value}
                        type="button"
                        onClick={() => setSelectedGenre(genre.value)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border cursor-pointer ${
                          selectedGenre === genre.value
                            ? "bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/20"
                            : "bg-white/5 border-transparent text-slate-400 hover:bg-white/10 hover:text-slate-200"
                        }`}
                      >
                        {genre.icon} {genre.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tone picker pills */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Story Tone</label>
                  <div className="flex flex-wrap gap-2">
                    {TONES.map((tone) => (
                      <button
                        key={tone.label}
                        type="button"
                        onClick={() => setSelectedTone(tone.label)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border cursor-pointer ${
                          selectedTone === tone.label
                            ? "bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-600/20"
                            : "bg-white/5 border-transparent text-slate-400 hover:bg-white/10 hover:text-slate-200"
                        }`}
                      >
                        {tone.emoji} {tone.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Length & Language row */}
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Length</label>
                    <div className="flex bg-[#0b0e14] border border-white/5 p-1 rounded-full">
                      {["short", "medium", "long"].map((len) => (
                        <button
                          key={len}
                          type="button"
                          onClick={() => setSelectedLength(len)}
                          className={`flex-1 py-1 rounded-full text-[10px] font-bold uppercase transition-all cursor-pointer ${
                            selectedLength === len
                              ? "bg-indigo-600 text-white"
                              : "text-slate-400 hover:text-slate-200"
                          }`}
                        >
                          {len}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2" ref={languageDropdownRef}>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Language</label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                        className="w-full py-2 px-4 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-bold flex items-center justify-between text-slate-300 transition-colors cursor-pointer"
                      >
                        <span className="flex items-center gap-1.5"><Languages className="w-3.5 h-3.5 text-indigo-400" /> {selectedLanguage}</span>
                        <span>▼</span>
                      </button>

                      {isLanguageDropdownOpen && (
                        <ul className="absolute left-0 right-0 z-30 mt-2 bg-slate-900 border border-white/10 rounded-2xl max-h-48 overflow-y-auto shadow-2xl p-1.5 focus:outline-none list-none m-0 divide-y divide-white/5">
                          {LANGUAGES.map((lang) => (
                            <li key={lang.code} className="p-0 m-0">
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedLanguage(lang.name);
                                  setIsLanguageDropdownOpen(false);
                                }}
                                className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-colors cursor-pointer ${
                                  selectedLanguage === lang.name
                                    ? "bg-indigo-600 text-white font-bold"
                                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                                }`}
                              >
                                {lang.name}
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>

              </div>

              {/* Characters Accordion */}
              <div className="bg-slate-900/40 border border-white/5 rounded-3xl p-6 backdrop-blur-xl flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold tracking-wider text-slate-400 uppercase flex items-center gap-1.5">
                    👥 Cast of Characters
                  </h3>
                  <button
                    type="button"
                    onClick={handleAddCharacter}
                    className="p-1.5 hover:bg-white/5 rounded-full border border-white/10 transition-colors text-xs font-bold flex items-center gap-1 text-slate-300 hover:text-white cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add
                  </button>
                </div>
                
                {characters.length === 0 ? (
                  <p className="text-xs text-slate-500 italic text-center py-2">
                    Define custom character details to guide story generation.
                  </p>
                ) : (
                  <div className="flex flex-col gap-4 max-h-64 overflow-y-auto pr-1">
                    {characters.map((char, index) => (
                      <div
                        key={char.id}
                        className="bg-slate-950/60 p-4 border border-white/5 rounded-2xl flex flex-col gap-3 relative group"
                      >
                        <button
                          type="button"
                          onClick={() => handleRemoveCharacter(char.id)}
                          className="absolute right-3 top-3 text-slate-500 hover:text-red-400 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <span className="text-[10px] font-bold text-slate-500 uppercase">Character #{index + 1}</span>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-semibold text-slate-400 uppercase">Name</label>
                            <input
                              type="text"
                              value={char.name}
                              onChange={(e) => handleCharacterChange(char.id, "name", e.target.value)}
                              placeholder="e.g. Merlin"
                              className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500/50 outline-none text-xs text-white"
                            />
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-semibold text-slate-400 uppercase">Role</label>
                            <select
                              value={char.role}
                              onChange={(e) => handleCharacterChange(char.id, "role", e.target.value)}
                              className="px-2 py-1.5 rounded-xl bg-slate-900 border border-white/10 focus:border-indigo-500/50 outline-none text-xs text-slate-300"
                            >
                              <option value="Protagonist">Protagonist</option>
                              <option value="Companion">Companion</option>
                              <option value="Rival">Rival</option>
                              <option value="Antagonist">Antagonist</option>
                            </select>
                          </div>
                        </div>

                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-semibold text-slate-400 uppercase">Personality</label>
                          <textarea
                            value={char.personality}
                            onChange={(e) => handleCharacterChange(char.id, "personality", e.target.value)}
                            placeholder="e.g. Brave, clumsy, afraid of water"
                            rows={2}
                            className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500/50 outline-none text-xs text-white resize-none"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Prompt Input Area */}
              <div className="bg-slate-900/40 border border-white/5 rounded-3xl p-6 backdrop-blur-xl flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Enter Prompt Idea</label>
                  <div className="relative">
                    <textarea
                      {...register("prompt")}
                      ref={(el) => {
                        register("prompt").ref(el);
                        inputRef.current = el;
                      }}
                      value={textareaValue}
                      onChange={(e) => setTextareaValue(e.target.value)}
                      maxLength={MAX_PROMPT_LENGTH}
                      placeholder="Every great story begins with a single idea. What's yours?"
                      rows={5}
                      className={`w-full p-4 rounded-2xl bg-white/5 border border-white/10 outline-none focus:border-indigo-500 text-sm leading-relaxed text-white placeholder:text-slate-500 resize-none transition-colors pr-10 ${
                        isOverLimit
                          ? "border-red-500 focus:border-red-500"
                          : isNearLimit
                          ? "border-yellow-500 focus:border-yellow-500"
                          : ""
                      }`}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          const form = e.currentTarget.closest("form");
                          if (form) form.requestSubmit();
                        }
                      }}
                    />
                    {textareaValue.length > 0 && (
                      <button
                        type="button"
                        onClick={handleClearPrompt}
                        className="absolute right-3 top-3 text-slate-500 hover:text-red-400 transition-colors cursor-pointer"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                  
                  {/* Character Counter */}
                  <div className="flex justify-between items-center text-[10px] text-slate-500 font-semibold px-1 mt-1">
                    {isOverLimit ? (
                      <span className="text-red-400">⚠️ Character limit reached</span>
                    ) : isNearLimit ? (
                      <span className="text-yellow-400">⚠️ {MAX_PROMPT_LENGTH - textareaValue.length} characters left</span>
                    ) : (
                      <span />
                    )}
                    <span className={isOverLimit ? "text-red-400" : isNearLimit ? "text-yellow-400" : "text-slate-500"}>
                      {textareaValue.length} / {MAX_PROMPT_LENGTH}
                    </span>
                  </div>
                </div>

                {/* Predefined prompt dropdown */}
                <div className="flex flex-col gap-2" ref={dropdownRef}>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">💡 Select Predefined Prompt</label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="w-full p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-xs text-left text-slate-300 flex items-center justify-between transition-colors cursor-pointer"
                    >
                      <span className="truncate pr-4">Select an example idea...</span>
                      <span>▼</span>
                    </button>

                    {isDropdownOpen && (
                      <ul className="absolute left-0 right-0 z-30 mt-2 bg-slate-900 border border-white/10 rounded-2xl max-h-56 overflow-y-auto shadow-2xl p-1.5 focus:outline-none list-none m-0 divide-y divide-white/5">
                        {prompts.map((item) => (
                          <li key={item.id} className="p-0 m-0">
                            <button
                              type="button"
                              onClick={() => handleExampleSelect(item.prompt)}
                              className="w-full text-left px-3 py-2.5 rounded-xl text-xs text-slate-400 hover:bg-white/5 hover:text-white transition-colors duration-150 break-words leading-relaxed cursor-pointer"
                            >
                              {item.prompt}
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={loading || isOverLimit || !textareaValue.trim()}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold text-sm tracking-wide transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  <Sparkles className="w-4 h-4 animate-pulse" />
                  {loading ? "Wielding magic..." : "Generate AI Story"}
                </button>
              </div>

            </form>
          </div>

          {/* Right Panel (Story Reading area & Workspace) */}
          <div className={`lg:col-span-8 flex flex-col h-[calc(100vh-170px)] bg-slate-900/20 dark:bg-slate-950/20 border border-slate-200/50 dark:border-white/5 rounded-3xl ${activeMobileTab !== "read" ? "hidden lg:flex" : "flex"}`}>
            
            {/* Version Selection Header */}
            {stories.length > 0 && selectedStory && (
              <div className="px-6 py-4 border-b border-slate-200 dark:border-white/5 flex items-center justify-between flex-wrap gap-4 z-20">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-pulse" />
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Generated Variations</h3>
                </div>
                <div className="flex items-center gap-1.5">
                  {stories.map((story, index) => (
                    <button
                      key={story.uuid}
                      onClick={() => setSelectedStory(story)}
                      className={`relative w-8 h-8 rounded-full border-2 transition-all flex items-center justify-center text-[10px] font-extrabold cursor-pointer ${
                        selectedStory.uuid === story.uuid
                          ? "border-indigo-500 bg-indigo-600/20 text-indigo-300 scale-110 shadow"
                          : "border-slate-700 hover:border-slate-500 text-slate-400"
                      }`}
                    >
                      v{index + 1}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Content Renders */}
            <div className="flex-1 min-h-0 relative">
              <AnimatePresence mode="wait">
                {loading ? (
                  <SkeletonLoader key="skeleton" />
                ) : selectedStory ? (
                  <motion.div
                    key={selectedStory.uuid}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-full"
                  >
                    <StoriesViewComponent
                      stories={stories}
                      selectedStory={selectedStory}
                      setSelectedStory={setSelectedStory}
                      setStories={setStories}
                      isLogin={login}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="h-full flex items-center justify-center p-6"
                  >
                    <div className="text-center flex flex-col items-center gap-4 max-w-sm">
                      <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-2xl shadow-inner">
                        📖
                      </div>
                      <h3 className="text-lg font-bold text-slate-200">Your next story starts here</h3>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Enter a creative prompt or pick one of our reference suggestions on the left, then click Generate to let AI bring your thoughts to life.
                      </p>
                      <button
                        onClick={() => {
                          setActiveMobileTab("create");
                          if (inputRef.current) inputRef.current.focus();
                        }}
                        className="mt-2 px-5 py-2 bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-indigo-300 hover:text-white rounded-full text-xs font-bold transition-all cursor-pointer"
                      >
                        Enter Prompt
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>

        </div>

      </main>

      {/* Auxiliary Shortcut Modals */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-900 border border-white/10 rounded-3xl max-w-md w-full p-6 relative">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-1.5">
              ⌨️ Keyboard Shortcuts
            </h2>
            <div className="flex flex-col gap-3 text-slate-300 text-xs">
              <div className="flex justify-between py-1 border-b border-white/5">
                <span>Focus Prompt Input</span>
                <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-[10px]">/</kbd>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span>Submit & Generate Story</span>
                <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-[10px]">Ctrl + Enter</kbd>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span>Publish Selected Story</span>
                <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-[10px]">Ctrl + S</kbd>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span>Open Keyboard Shortcuts Help</span>
                <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-[10px]">?</kbd>
              </div>
              <div className="flex justify-between py-1">
                <span>Close Active Dialogs</span>
                <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-[10px]">Esc</kbd>
              </div>
            </div>
            <button
              onClick={() => setShowHelpModal(false)}
              className="mt-6 w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-bold text-white transition-colors cursor-pointer"
            >
              Close Help
            </button>
          </div>
        </div>
      )}

      {/* Guest Limit reached modal */}
      {showLimitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#0b0e14] border border-white/10 rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl relative">
            <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-full flex items-center justify-center mx-auto mb-4 text-xl">
              ⚠️
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Free Request Limit Reached</h3>
            <p className="text-xs text-slate-400 mb-6 leading-relaxed">
              You have completed 3 free generations. Register or login to your StorySparkAI profile to continue.
            </p>
            <div className="flex flex-col gap-2">
              <Link
                to="/login"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold text-xs"
              >
                Login to Profile
              </Link>
              <button
                onClick={() => setShowLimitModal(false)}
                className="w-full py-2.5 rounded-xl bg-transparent hover:bg-white/5 text-slate-400 hover:text-slate-300 text-xs font-semibold"
              >
                Continue Browsing
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default StoriesComponent;
