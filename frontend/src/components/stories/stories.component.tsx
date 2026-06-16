import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import StoriesViewComponent, { IStories } from "./stories.view.component";
import RecentPromptsPanel from "./RecentPromptsPanel";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getUserInfo, isLoggedIn } from "../../services/auth.service";
import { getRequestLimit, getWordCount, prompts } from "./stories.utils";
import {
  useGenerateFreeModelMutation,
  useGenerateModelMutation,
} from "../../redux/apis/ai.model.api";
import toast, { Toaster } from "react-hot-toast";
import { SubmitHandler, useForm } from "react-hook-form";
import { useGetProfileInfoQuery } from "../../redux/apis/user.api";
import { getErrorMessage } from "../../error/error.message";
import useKeyboardShortcuts from "../../hooks/useKeyboardShortcuts";
import { useRecentPrompts } from "../../hooks/useRecentPrompts";
import StoryGeneratingAnimation from "../loading/story-generating-animation.component";
import { useDebounce } from "../../hooks/useDebounce";

const soundtrackMap: Record<string, string> = {
  "ðŸ§™ Fantasy": "/audio/fantasy.mp3",
  "ðŸ˜± Horror": "/audio/horror.mp3",
  "ðŸ’• Romance": "/audio/romance.mp3",
  "ðŸŽ­ Drama": "/audio/drama.mp3", 
  "ðŸ˜‚ Comedy": "/audio/comedy.mp3", 
  "ðŸš€ Sci-Fi": "/audio/sci-fi.mp3", 
  "ðŸ” Mystery": "/audio/mystery.mp3", 
  "ðŸŒŸ Adventure": "/audio/adventure.mp3"
};

type Inputs = {
  prompt: string;
};

const MAX_PROMPT_LENGTH = 2000;
const WARN_THRESHOLD = 0.85;

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
  { value: "ðŸŽ­ Drama", icon: "ðŸŽ­", name: "Drama" },
  { value: "ðŸ˜‚ Comedy", icon: "ðŸ˜‚", name: "Comedy" },
  { value: "ðŸ˜± Horror", icon: "ðŸ˜±", name: "Horror" },
  { value: "ðŸ’• Romance", icon: "ðŸ’•", name: "Romance" },
  { value: "ðŸš€ Sci-Fi", icon: "ðŸš€", name: "Sci-Fi" },
  { value: "ðŸ§™ Fantasy", icon: "ðŸ§™", name: "Fantasy" },
  { value: "ðŸ” Mystery", icon: "ðŸ”", name: "Mystery" },
  { value: "ðŸŒŸ Adventure", icon: "ðŸŒŸ", name: "Adventure" },
] as const;

type GenreName = (typeof GENRES)[number]["name"];

const GENRE_LABELS: Record<string, Record<GenreName, string>> = {
  English: {
    Drama: "Drama", Comedy: "Comedy", Horror: "Horror", Romance: "Romance",
    "Sci-Fi": "Sci-Fi", Fantasy: "Fantasy", Mystery: "Mystery", Adventure: "Adventure",
  },
  Spanish: {
    Drama: "Drama", Comedy: "Comedia", Horror: "Terror", Romance: "Romance",
    "Sci-Fi": "Ciencia ficcion", Fantasy: "Fantasia", Mystery: "Misterio", Adventure: "Aventura",
  },
  French: {
    Drama: "Drame", Comedy: "Comedie", Horror: "Horreur", Romance: "Romance",
    "Sci-Fi": "Science-fiction", Fantasy: "Fantastique", Mystery: "Mystere", Adventure: "Aventure",
  },
  Portuguese: {
    Drama: "Drama", Comedy: "Comedia", Horror: "Terror", Romance: "Romance",
    "Sci-Fi": "Ficcao cientifica", Fantasy: "Fantasia", Mystery: "Misterio", Adventure: "Aventura",
  },
  Hindi: {
    Drama: "à¤¨à¤¾à¤Ÿà¤•", Comedy: "à¤¹à¤¾à¤¸à¥à¤¯", Horror: "à¤¡à¤°à¤¾à¤µà¤¨à¥€", Romance: "à¤ªà¥à¤°à¥‡à¤®",
    "Sci-Fi": "à¤µà¤¿à¤œà¥à¤žà¤¾à¤¨ à¤•à¤¥à¤¾", Fantasy: "à¤•à¤²à¥à¤ªà¤¨à¤¾", Mystery: "à¤°à¤¹à¤¸à¥à¤¯", Adventure: "à¤°à¥‹à¤®à¤¾à¤‚à¤š",
  },
  German: {
    Drama: "Drama", Comedy: "Komodie", Horror: "Horror", Romance: "Romanze",
    "Sci-Fi": "Science-Fiction", Fantasy: "Fantasy", Mystery: "Mysterie", Adventure: "Abenteuer",
  },
  Japanese: {
    Drama: "ãƒ‰ãƒ©ãƒž", Comedy: "ã‚³ãƒ¡ãƒ‡ã‚£", Horror: "ãƒ›ãƒ©ãƒ¼", Romance: "ãƒ­ãƒžãƒ³ã‚¹",
    "Sci-Fi": "SF", Fantasy: "ãƒ•ã‚¡ãƒ³ã‚¿ã‚¸ãƒ¼", Mystery: "ãƒŸã‚¹ãƒ†ãƒªãƒ¼", Adventure: "å†’é™º",
  },
  Korean: {
    Drama: "ë“œë¼ë§ˆ", Comedy: "ì½”ë¯¸ë””", Horror: "ê³µí¬", Romance: "ë¡œë§¨ìŠ¤",
    "Sci-Fi": "SF", Fantasy: "íŒíƒ€ì§€", Mystery: "ë¯¸ìŠ¤í„°ë¦¬", Adventure: "ëª¨í—˜",
  },
  Bengali: {
    Drama: "à¦¨à¦¾à¦Ÿà¦•", Comedy: "à¦•à§Œà¦¤à§à¦•", Horror: "à¦­à§Œà¦¤à¦¿à¦•", Romance: "à¦ªà§à¦°à§‡à¦®",
    "Sci-Fi": "à¦¬à¦¿à¦œà§à¦žà¦¾à¦¨ à¦•à¦²à§à¦ªà¦•à¦¾à¦¹à¦¿à¦¨à¦¿", Fantasy: "à¦•à¦²à§à¦ªà¦¨à¦¾", Mystery: "à¦°à¦¹à¦¸à§à¦¯", Adventure: "à¦…à¦­à¦¿à¦¯à¦¾à¦¨",
    Drama: "नाटक", Comedy: "কৌতুক", Horror: "ভৌতিক", Romance: "প্রেম",
    "Sci-Fi": "বিজ্ঞান কল্পকাহিনি", Fantasy: "কল্পনা", Mystery: "রহস্য", Adventure: "অভিযান",
  },
  Tamil: {
    Drama: "à®¨à®¾à®Ÿà®•à®®à¯", Comedy: "à®¨à®•à¯ˆà®šà¯à®šà¯à®µà¯ˆ", Horror: "à®¤à®¿à®•à®¿à®²à¯", Romance: "à®•à®¾à®¤à®²à¯",
    "Sci-Fi": "à®…à®±à®¿à®µà®¿à®¯à®²à¯ à®ªà¯à®©à¯ˆà®µà¯", Fantasy: "à®•à®±à¯à®ªà®©à¯ˆ", Mystery: "à®®à®°à¯à®®à®®à¯", Adventure: "à®šà®¾à®•à®šà®®à¯",
  },
  Telugu: {
    Drama: "à°¨à°¾à°Ÿà°•à°‚", Comedy: "à°¹à°¾à°¸à±à°¯à°‚", Horror: "à°­à°¯à°¾à°¨à°•à°‚", Romance: "à°ªà±à°°à±‡à°®",
    "Sci-Fi": "à°µà°¿à°œà±à°žà°¾à°¨ à°•à°¥", Fantasy: "à°•à°¾à°²à±à°ªà°¨à°¿à°•à°‚", Mystery: "à°°à°¹à°¸à±à°¯à°‚", Adventure: "à°¸à°¾à°¹à°¸à°‚",
    Drama: "నాటకం", Comedy: "హాస్యం", Horror: "భయానకం", Romance: "ప్రేమ",
    "Sci-Fi": "విజ్ఞాన కథ", Fantasy: "கాల్పనికం", Mystery: "రహస్యం", Adventure: "సాహసం",
  },
  Marathi: {
    Drama: "à¤¨à¤¾à¤Ÿà¤•", Comedy: "à¤µà¤¿à¤¨à¥‹à¤¦", Horror: "à¤­à¤¯à¤•à¤¥à¤¾", Romance: "à¤ªà¥à¤°à¥‡à¤®à¤•à¤¥à¤¾",
    "Sci-Fi": "à¤µà¤¿à¤œà¥à¤žà¤¾à¤¨à¤•à¤¥à¤¾", Fantasy: "à¤•à¤²à¥à¤ªà¤¨à¤¾à¤°à¤®à¥à¤¯", Mystery: "à¤°à¤¹à¤¸à¥à¤¯", Adventure: "à¤¸à¤¾à¤¹à¤¸",
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
    back: "वापस", freeAccess: "3 अनुरोधों के लिए मुफ्त उपयोग", login: "लॉग इन", forMore: "और पाने के लिए!",
    perMonth: "प्रति माह", upgrade: "अपग्रेड", monthlyRequests: "इस माह के अनुरोध", totalPosts: "कुल पोस्ट",
    titleStart: "अपने विचारों को बदलें", titleAccent: "अद्भुत कहानियों में!", length: "लंबाई", language: "भाषा",
    short: "छोटी", medium: "मध्यम", long: "लंबी", promptPlaceholder: "हर महान कहानी एक विचार से शुरू होती है। आपका विचार क्या है?",
    keyboardTip: "कीबोर्ड सुझाव:", press: "दबाएं", toGenerate: "बनाने के लिए", alsoWorks: "भी काम करता है", forNewLine: "नई पंक्ति के लिए",
    generating: "बन रही है...", generate: "बनाएं", examples: "इन उदाहरण संकेतों का उपयोग करें:",
    selectPrompt: "एक संकेत चुनें", characterLimit: "अक्षर सीमा पूरी - निर्माण अक्षम है", charactersRemaining: "अक्षर शेष",
    shortcuts: "कीबोर्ड शॉर्टकट", openHelp: "सहायता खोलें", closeHelp: "सहायता बंद करें", focusPrompt: "संकेत पर जाएं",
    generateStory: "कहानी बनाएं", publishStory: "कहानी प्रकाशित करें", close: "बंद करें", freeLimitReached: "मुफ्त सीमा पूरी",
    freeLimitMessage: "आपने सभी 3 मुफ्त कहानी निर्माण उपयोग कर लिए हैं। आगे जारी रखने के लिए लॉग इन करें।", continueBrowsing: "ब्राउज़ करना जारी रखें", recentPrompts: "हाल के संकेत", usePrompt: "उपयोग करें", delete: "हटाएं", clearAll: "सब साफ करें", noRecentPrompts: "कोई हाल के संकेत नहीं",
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
    back: "ফিরে যান", freeAccess: "৩টি অনুরোধের জন্য বিনামূল্যে ব্যবহার", login: "লগ ইন", forMore: "করে আরও পান!",
    perMonth: "প্রতি মাসে", upgrade: "আপগ্রেড", monthlyRequests: "এই মাসের অনুরোধ", totalPosts: "মোট পোস্ট",
    titleStart: "আপনার ভাবনাকে বদলে দিন", titleAccent: "অসাধারণ গল্পে!", length: "দৈর্ঘ্য", language: "ভাষা",
    short: "ছোট", medium: "মাঝারি", long: "লম্বা", promptPlaceholder: "প্রতিটি মহান গল্প একটি ভাবনা দিয়ে শুরু হয়। আপনারটি কী?",
    keyboardTip: "কীবোর্ড টিপ:", press: "চাপুন", toGenerate: "তৈরি করতে", alsoWorks: "এটিও কাজ করে", forNewLine: "নতুন লাইনের জন্য",
    generating: "তৈরি হচ্ছে...", generate: "তৈরি করুন", examples: "কিছু উদাহরণ প্রম্পট:",
    selectPrompt: "একটি প্রম্পট বেছে নিন", characterLimit: "অক্ষরের সীমা পূর্ণ - তৈরি বন্ধ", charactersRemaining: "অক্ষর বাকি",
    shortcuts: "কীবোর্ড শর্টকাট", openHelp: "সহায়তা খুলুন", closeHelp: "সহায়ता বন্ধ করুন", focusPrompt: "প্রম্পটে যান",
    generateStory: "গল্প তৈরি করুন", publishStory: "গল্প প্রকাশ করুন", close: "বন্ধ করুন", freeLimitReached: "বিনামূল্যের সীমা পূর্ণ",
    freeLimitMessage: "আপনি ৩টি বিনামূল্যের গল্প তৈরি ব্যবহার করেছেন। চালিয়ে যেতে লগ ইন করুন।", continueBrowsing: "ব্রাউজ চালিয়ে যান", recentPrompts: "সম্প্রতি ব্যবহৃত প্রম্পট", usePrompt: "ব্যবহার করুন", delete: "মুছে ফেলুন", clearAll: "সব মুছে দিন", noRecentPrompts: "কোনো সম্প্রতি ব্যবহৃত প্রম্পট নেই",
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
    back: "వెనుకకు", freeAccess: "3 అభ్యర్థనలకు ఉచిత ప్రవేశం", login: "లాగిన్", forMore: "చేసి మరిన్ని పొందండి!",
    perMonth: "నెలకు", upgrade: "అప్‌గ్రేడ్", monthlyRequests: "ఈ నెల అభ్యర్థనలు", totalPosts: "మొత్తం పోస్టులు",
    titleStart: "మీ ఆలోచనలను", titleAccent: "అద్భుత కథలుగా మార్చండి!", length: "పొడవు", language: "భాష",
    short: "చిన్నది", medium: "మధ్యస్థం", long: "పొడవైనది", promptPlaceholder: "ప్రతి గొప్ప కథ ఒక ఆలోచనతో మొదలవుతుంది. మీది ఏమిటి?",
    keyboardTip: "కీబోర్డ్ చిట్కా:", press: "నొక్కండి", toGenerate: "రూపొందించడానికి", alsoWorks: "కూడా పనిచేస్తుంది", forNewLine: "కొత్త లైన్ కోసం",
    generating: "రూపొందిస్తోంది...", generate: "రూపొందించు", examples: "కొన్ని ఉదాహरण ప్రాంప్ట్‌లు:",
    selectPrompt: "ప్రాంప్ట్ ఎంచుకోండి", characterLimit: "అక్షర పరిమితి చేరింది - రూపొందింపు నిలిపివేయబడింది", charactersRemaining: "అక్షరాలు మిగిలాయి",
    shortcuts: "キーボードショートカット", openHelp: "సహాయం తెరవండి", closeHelp: "సహాయం మూసివేయండి", focusPrompt: "ప్రాంप्ట్‌పై దృష్టి",
    generateStory: "కథ రూపొందించు", publishStory: "కథ ప్రచురించు", close: "మూసివేయి", freeLimitReached: "ఉచిత పరిమితి చేరింది",
    freeLimitMessage: "మీరు 3 ఉచిత కథా రూపొందింపులను ఉపయోగించారు. కొనసాగడానికి లాగిన్ చేయండి.", continueBrowsing: "బ్రౌజింగ్ కొనసాగించు", recentPrompts: "ఇటీవల ప్రాంప్ట్‌లు", usePrompt: "ఉపయోగించు", delete: "తొలగించు", clearAll: "అన్నింటిని తొలగించు", noRecentPrompts: "ఇటీవల ప్రాంప్ట్‌లు లేవు",
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
  {
    label: "Dark",
    emoji: "ðŸŒ‘",
    activeClass: "bg-gray-700 text-gray-100 border-gray-500 shadow-gray-700/40",
    inactiveClass: "bg-white/5 text-gray-400 border-transparent hover:bg-white/10 hover:text-gray-200",
  },
  {
    label: "Whimsical",
    emoji: "ðŸŒˆ",
    activeClass: "bg-sky-500/20 text-sky-300 border-sky-500/60 shadow-sky-500/20",
    inactiveClass: "bg-white/5 text-gray-400 border-transparent hover:bg-white/10 hover:text-gray-200",
  },
  {
    label: "Dramatic",
    emoji: "ðŸŽ¬",
    activeClass: "bg-red-500/20 text-red-300 border-red-500/60 shadow-red-500/20",
    inactiveClass: "bg-white/5 text-gray-400 border-transparent hover:bg-white/10 hover:text-gray-200",
  },
  {
    label: "Humorous",
    emoji: "ðŸ˜„",
    activeClass: "bg-yellow-500/20 text-yellow-300 border-yellow-500/60 shadow-yellow-500/20",
    inactiveClass: "bg-white/5 text-gray-400 border-transparent hover:bg-white/10 hover:text-gray-200",
  },
  {
    label: "Suspenseful",
    emoji: "ðŸ˜°",
    activeClass: "bg-orange-500/20 text-orange-300 border-orange-500/60 shadow-orange-500/20",
    inactiveClass: "bg-white/5 text-gray-400 border-transparent hover:bg-white/10 hover:text-gray-200",
  },
  {
    label: "Heartwarming",
    emoji: "ðŸ¥°",
    activeClass: "bg-pink-500/20 text-pink-300 border-pink-500/60 shadow-pink-500/20",
    inactiveClass: "bg-white/5 text-gray-400 border-transparent hover:bg-white/10 hover:text-gray-200",
  },
] as const;

type ToneLabel = (typeof TONES)[number]["label"];

interface TonePickerProps {
  selected: ToneLabel | "";
  onChange: (tone: ToneLabel | "") => void;
}

const TonePicker: React.FC<TonePickerProps> = React.memo(({ selected, onChange }) => {
  return (
    <div className="flex flex-wrap gap-2 mb-3">
      <span className="w-full text-xs text-gray-400 mb-1">ðŸŽ­ Tone:</span>
      {TONES.map((tone) => {
        const isActive = selected === tone.label;
        return (
          <button
            key={tone.label}
            type="button"
            onClick={() => onChange(isActive ? "" : tone.label)}
            aria-pressed={isActive}
            title={isActive ? `Remove "${tone.label}" tone` : `Set tone to "${tone.label}"`}
            className={`
              px-3 py-1 rounded-full text-xs font-medium border transition-all duration-200
              ${isActive
                ? `${tone.activeClass} shadow-md scale-105`
                : tone.inactiveClass
              }
            `}
          >
            {tone.emoji} {tone.label}
          </button>
        );
      })}
    </div>
  );
});

const getStoryDedupKey = (story: IStories) => {
  const storyData = story as Partial<IStories> & {
    id?: string;
    _id?: string;
    uuid?: string;
  };
  const title = String(storyData.title ?? "").trim().toLowerCase();
  const content = String(storyData.content ?? "").trim().toLowerCase();
  const tag = String(storyData.tag ?? "").trim().toLowerCase();

  return title || content || tag
    ? `${title}-${content}-${tag}`
    : String(storyData.uuid ?? storyData._id ?? storyData.id ?? "");
};

const getUniqueStories = (storyList: IStories[]) => {
  const seenStories = new Set<string>();

  return storyList.filter((story) => {
    const dedupKey = getStoryDedupKey(story);

    if (!dedupKey) return true;
    if (seenStories.has(dedupKey)) return false;

    seenStories.add(dedupKey);
    return true;
  });
};
// ---------------------------------------------------------------------------
// Main StoriesComponent
// ---------------------------------------------------------------------------
import { useDebounce } from "../../hooks/useDebounce";
interface ICharacter {
  id: string;
  name: string;
  role: string;
  personality: string;
}

const DRAFT_KEY = "story_spark_draft";

const StoriesComponent = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const storiesPerPage = 10;
  const location = useLocation();
  const navigate = useNavigate();
  const { register, handleSubmit, reset, setValue } = useForm<Inputs>();

  const draft = useMemo(() => {
    try {
      const saved = localStorage.getItem(DRAFT_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  }, []);

  const [stories, setStories] = useState<IStories[]>(
    draft?.stories?.length ? getUniqueStories(draft.stories) : []
  );
  
  const [loading, setLoading] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchFilter, setSearchFilter] = useState<string>("all");

  const uniqueStories = useMemo(() => getUniqueStories(stories), [stories]);

  const filteredStories = useMemo(() => {
    if (!searchQuery.trim()) return uniqueStories;
  const debouncedSearchQuery = useDebounce(searchQuery, 350);
  const debouncedPrompt = useDebounce(textareaValue, 500);


  const filteredStories = useMemo(() => {
    if (!debouncedSearchQuery.trim()) return stories;
    const query = debouncedSearchQuery.toLowerCase();
    
    return uniqueStories.filter((story) => {
    return stories.filter((story) => {
      switch (searchFilter) {
        case "title":
          return story.title?.toLowerCase().includes(query);
        case "content":
          return story.content?.toLowerCase().includes(query);
        case "genre":
          return story.tag?.toLowerCase().includes(query);
        case "all":
        default:
          return (
            story.title?.toLowerCase().includes(query) ||
            story.content?.toLowerCase().includes(query) ||
            story.tag?.toLowerCase().includes(query)
          );
      }
    });
  }, [uniqueStories, searchQuery, searchFilter]);
  }, [stories, debouncedSearchQuery, searchFilter]);
  const indexOfLastStory = currentPage * storiesPerPage;
  const indexOfFirstStory = indexOfLastStory - storiesPerPage;

  const currentStories = useMemo(() => {
    return filteredStories.slice(indexOfFirstStory, indexOfLastStory);
  }, [filteredStories, indexOfFirstStory, indexOfLastStory]);

  const totalPages = useMemo(() => {
    return Math.ceil(filteredStories.length / storiesPerPage);
  }, [filteredStories.length, storiesPerPage]);
useEffect(() => {
  setCurrentPage(1);
}, [debouncedSearchQuery, searchFilter]);

  const indexOfLastStory = currentPage * storiesPerPage;
  const indexOfFirstStory = indexOfLastStory - storiesPerPage;
  const currentStories = filteredStories.slice(indexOfFirstStory, indexOfLastStory);
  const totalPages = Math.ceil(filteredStories.length / storiesPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchQuery, searchFilter]);

  const { data } = useGetProfileInfoQuery(undefined);
  const userRole = getUserInfo();
  const login = isLoggedIn();
  const [generateModel] = useGenerateModelMutation();
  const [generateFreeModel] = useGenerateFreeModelMutation();
  const [selectedPrompt, setSelectedPrompt] = useState<string>("");
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState<string>(
  draft?.genre
    ? (GENRES.find((g) => g.name === draft.genre || g.value === draft.genre)?.value ?? "ðŸ§™ Fantasy")
    : "ðŸ§™ Fantasy",
);
  const [selectedLength, setSelectedLength] = useState<string>(draft?.length || "medium");
  const [selectedTone, setSelectedTone] = useState<ToneLabel | "">(draft?.tone || "Dramatic");
  const [textareaValue, setTextareaValue] = useState<string>(() => {
    return location.state?.prompt || draft?.prompt || "";
  });
  const [selectedGenre, setSelectedGenre] = useState<string>("");
  const [selectedLength, setSelectedLength] = useState<string>("medium");
  const [textareaValue, setTextareaValue] = useState<string>("");

  
  const [selectedGenre, setSelectedGenre] = useState<string>(
    draft?.genre
      ? (GENRES.find((g) => g.name === draft.genre || g.value === draft.genre)?.value ?? "🧙 Fantasy")
      : "🧙 Fantasy"
  );
  const [selectedLength, setSelectedLength] = useState<string>(draft?.length || "medium");
  const [selectedTone, setSelectedTone] = useState<ToneLabel | "">(draft?.tone || "Dramatic");
  const [textareaValue, setTextareaValue] = useState<string>(location.state?.prompt || draft?.prompt || "");
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string>(draft?.language || "English");
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState<boolean>(false);
  
  // Custom characters cast setup states:
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [characters, setCharacters] = useState<ICharacter[]>([]);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const languageDropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const playSoundtrack = useCallback((genre: string) => {
    const soundtrack = soundtrackMap[genre];

    if (!soundtrack) return;

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    const audio = new Audio(soundtrack);
    audio.loop = true;
    audio.volume = 0.3;

    audio.play().catch((err) => {
      console.log("Audio playback failed:", err);
    });

    audioRef.current = audio;
  }, []);

  const activeGenerationRef = useRef<{ abort: () => void } | null>(null);
  const isGenerationInProgressRef = useRef(false);
  const [guestRequestCount, setGuestRequestCount] = useState<number>(() =>
    parseInt(localStorage.getItem("guestRequestCount") || "0", 10)
  );
  const [showLimitModal, setShowLimitModal] = useState<boolean>(false);
  const [isRecentPromptsOpen, setIsRecentPromptsOpen] = useState<boolean>(false);
  const { recentPrompts, addPrompt, removePrompt, clearAll } = useRecentPrompts();
  const text = UI_TEXT[selectedLanguage] ?? UI_TEXT.English;
  const genreLabels = GENRE_LABELS[selectedLanguage] ?? GENRE_LABELS.English;

  const activeGenerationRef = useRef<{ abort: () => void } | null>(null);
  const isGenerationInProgressRef = useRef(false);
  
  const [guestRequestCount, setGuestRequestCount] = useState<number>(() =>
    parseInt(localStorage.getItem("guestRequestCount") || "0", 10)
  );
  const [showLimitModal, setShowLimitModal] = useState<boolean>(false);
  const [isRecentPromptsOpen, setIsRecentPromptsOpen] = useState<boolean>(false);
  const [isHighLatency, setIsHighLatency] = useState<boolean>(false);
  const { recentPrompts, addPrompt, removePrompt, clearAll } = useRecentPrompts();
  
  const text = UI_TEXT[selectedLanguage] ?? UI_TEXT.English;
  const genreLabels = GENRE_LABELS[selectedLanguage] ?? GENRE_LABELS.English;

  const playSoundtrack = (genre: string) => {
    const soundtrack = soundtrackMap[genre];
    if (!soundtrack) return;

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    const audio = new Audio(soundtrack);
    audio.loop = true;
    audio.volume = 0.3;
    audio.play().catch((err) => {
      console.log("Audio playback failed:", err);
    });
    audioRef.current = audio;
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Autosave Draft
  


  useEffect(() => {
    const timer = setTimeout(() => {
      const draftData = {
        prompt: textareaValue,
        genre: selectedGenre,
        length: selectedLength,
        language: selectedLanguage,
        tone: selectedTone,
      };
      try {
        localStorage.setItem(DRAFT_KEY, JSON.stringify(draftData));
      } catch (err) {
        if (err instanceof DOMException && err.name === "QuotaExceededError") {
          toast.error("Couldn't autosave draft â€” storage limit reached.");
        }
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [textareaValue, selectedGenre, selectedLength, selectedLanguage, selectedTone]);

  useEffect(() => {
    const selectedLocale =
      LANGUAGES.find((language) => language.name === selectedLanguage)?.code ?? "en";
    localStorage.setItem(LANGUAGE_STORAGE_KEY, selectedLanguage);
    document.documentElement.lang = selectedLocale;
  }, [selectedLanguage]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
      if (
        languageDropdownRef.current &&
        !languageDropdownRef.current.contains(event.target as Node)
      ) {
        setIsLanguageDropdownOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsDropdownOpen(false);
        setIsLanguageDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (location.state) {
      if (location.state.prompt) {
        setTextareaValue(location.state.prompt);
      }
      if (location.state.genre) {
        const matchedGenre = GENRES.find((g) => g.name === location.state.genre)?.value ?? "";
        setSelectedGenre(matchedGenre);
      }
      navigate(location.pathname, {
        replace: true,
        state: {},
      });
    }
  }, [location, navigate, setSelectedGenre, setTextareaValue]);

  useEffect(() => {
  setValue("prompt", debouncedPrompt);
}, [debouncedPrompt, setValue]);

  useEffect(() => {
    return () => {
      activeGenerationRef.current?.abort();
    };
  }, []);

  const handleCancelGeneration = useCallback((isTimeout = false) => {
    activeGenerationRef.current?.abort();
    activeGenerationRef.current = null;
    isGenerationInProgressRef.current = false;
    setLoading(false);
    if (!isTimeout) {
      toast("Story generation cancelled.");
    }
  }, []);

  const handleClearPrompt = useCallback(() => {
    setTextareaValue("");
    setSelectedPrompt("");
    setValue("prompt", "");

    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [setValue]);

  const handlePublishSuccess = useCallback(() => {
    setTextareaValue("");
    setSelectedPrompt("");
    setValue("prompt", "");
    reset();
  }, [setValue, reset]);

  const onSubmit: SubmitHandler<Inputs> = useCallback(async (data) => {
    if (isGenerationInProgressRef.current) {
      return;
    }

    if (!login && guestRequestCount >= 3) {
      setShowLimitModal(true);
      return;
    }

    if (!data.prompt.trim()) {
      toast.error("Please enter a prompt to generate a story.");
      return;
    }

    if (getWordCount(data.prompt) < 10) {
      toast.error(
        "Please enter a prompt with at least 10 words to generate a story."
      );
      return;
    }
      toast.error("Please enter a prompt with at least 10 words to generate a story.");
      return;
    }

    // Validate characters array
    for (const char of characters) {
      if (!char.name.trim()) {
        toast.error("Please provide a name for all characters.");
        return;
      }
      if (!char.role.trim()) {
        toast.error("Please select a role for all characters.");
        return;
      }
      if (!char.personality.trim()) {
        toast.error("Please describe the personality/traits for all characters.");
        return;
      }
    }

    isGenerationInProgressRef.current = true;
    setLoading(true);
    setIsHighLatency(false);

    let timeoutId: NodeJS.Timeout | null = null;
    let latencyTimeoutId: NodeJS.Timeout | null = null;

    try {
      // 60-second client-side request timeout safeguard
      timeoutId = setTimeout(() => {
        if (isGenerationInProgressRef.current) {
          toast.error("Story generation timed out. Please try again.");
          handleCancelGeneration(true);
        }
      }, 60000);

      // 10-second high latency warning (for fallback/backoff cases)
      latencyTimeoutId = setTimeout(() => {
        if (isGenerationInProgressRef.current) {
          setIsHighLatency(true);
        }
      }, 10000);

      const payload = {
        prompt: selectedGenre
          ? `[Genre: ${selectedGenre}] ${data.prompt}`
          : data.prompt,
        wordLength:
          selectedLength === "short"
            ? 175
            : selectedLength === "long"
            ? 800
            : 450,
        prompt: selectedGenre ? `[Genre: ${selectedGenre}] ${data.prompt}` : data.prompt,
        wordLength: selectedLength === "short" ? 175 : selectedLength === "long" ? 800 : 450,
        language: selectedLanguage,
        tone: selectedTone || undefined,
        characters: characters.map(({ name, role, personality }) => ({ name, role, personality })),
      };
      const generationRequest = login
        ? generateModel(payload)
        : generateFreeModel(payload);

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
        if (!login) {
          const newCount = guestRequestCount + 1;
          setGuestRequestCount(newCount);
          localStorage.setItem("guestRequestCount", String(newCount));
        }
        // Scroll back to top after story generation
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
  };

  const handleCancelGeneration = (isTimeout = false) => {
    activeGenerationRef.current?.abort();
    activeGenerationRef.current = null;
    isGenerationInProgressRef.current = false;
    setLoading(false);
    if (!isTimeout) {
      toast("Story generation cancelled.");
    }
  };

  const handleClearPrompt = () => {
    setTextareaValue("");
    setSelectedPrompt("");
    setValue("prompt", "");
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handlePublishSuccess = () => {
    setTextareaValue("");
    setSelectedPrompt("");
    setValue("prompt", "");
    setCharacters([]);
    setCurrentStep(1);
    reset();
  };
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
  ]);

  const isOverLimit = textareaValue.length >= MAX_PROMPT_LENGTH;
  const isNearLimit = textareaValue.length >= MAX_PROMPT_LENGTH * WARN_THRESHOLD;
  const isGenerateDisabled = loading || isOverLimit || !textareaValue.trim();

  const handleOpenHelp = useCallback(() => setShowHelpModal(true), []);
  const handleCloseHelp = useCallback(() => setShowHelpModal(false), []);
  const handleGenerateShortcut = useCallback(() => {
    if (isGenerateDisabled) {
      return;
    }
    if (inputRef.current) {
      const form = inputRef.current.closest("form");
      if (form) form.requestSubmit();
    }
  }, [isGenerateDisabled]);
  const handlePublishShortcut = useCallback(() => {
    const publishBtn = document.getElementById("publish-story-btn");
    publishBtn?.click();
  }, []);
  const handleFocusPrompt = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  useKeyboardShortcuts({
    onOpenHelp: handleOpenHelp,
    onCloseHelp: handleCloseHelp,
    onGenerate: handleGenerateShortcut,
    onPublish: handlePublishShortcut,
    focusPrompt: handleFocusPrompt,
  const generateId = () => Math.random().toString(36).substring(2, 9);

  const handleAddCharacter = () => {
    setCharacters([
      ...characters,
      { id: generateId(), name: "", role: "Protagonist", personality: "" },
    ]);
  };

  const handleCharacterChange = (id: string, field: keyof Omit<ICharacter, "id">, value: string) => {
    setCharacters(
      characters.map((char) => (char.id === id ? { ...char, [field]: value } : char))
    );
  };

  const handleRemoveCharacter = (id: string) => {
    setCharacters(characters.filter((char) => char.id !== id));
  };

  const handleNextStep = () => {
    if (!textareaValue.trim()) {
      toast.error("Please enter a prompt to generate a story.");
      return;
    }
    if (getWordCount(textareaValue) < 10) {
      toast.error("Please enter a prompt with at least 10 words to generate a story.");
      return;
    }
    setCurrentStep(2);
  };

  useKeyboardShortcuts({
    onOpenHelp: () => setShowHelpModal(true),
    onCloseHelp: () => setShowHelpModal(false),
    onGenerate: () => {
      if (isGenerateDisabled) {
        return;
      }
      if (currentStep === 1) {
        handleNextStep();
      } else {
        if (inputRef.current) {
          const form = inputRef.current.closest("form");
          if (form) form.requestSubmit();
        }
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

  const handleSelectRecentPrompt = useCallback((prompt: string) => {
    setTextareaValue(prompt);
    setValue("prompt", prompt);
    setIsRecentPromptsOpen(false);
  }, [setValue]);

  const handleToggleRecentPrompts = useCallback(() => {
    setIsRecentPromptsOpen((prev) => !prev);
  }, []);

  const handleToggleDropdown = useCallback(() => {
    setIsDropdownOpen((prev) => !prev);
  }, []);

  const recentPromptsText = useMemo(() => ({
    recentPrompts: text.recentPrompts,
    usePrompt: text.usePrompt,
    delete: text.delete,
    clearAll: text.clearAll,
    noRecentPrompts: text.noRecentPrompts,
    close: text.close,
  }), [text]);

  return (
    <div className="min-h-screen bg-white text-slate-900 animate-gradient-slow transition-colors duration-300 dark:bg-[#0b1329] dark:text-white">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
        <div className="py-6 flex flex-col md:flex-row items-center md:items-start justify-between gap-4">
          <div className="pt-2 w-full md:w-auto flex justify-start">
            <Link to="/">
              <div className="!rounded-button bg-gray-100/80 hover:bg-gray-200/80 text-slate-900 dark:bg-white/20 dark:hover:bg-white/30 dark:text-gray-300 px-3 py-2 flex items-center gap-2 transition-all duration-300 rounded whitespace-nowrap border border-gray-200 dark:border-white/10">
                <i className="fa-solid fa-left-long"></i> {text.back}
              </div>
            </Link>
          </div>

          {!login && (
            <div className="pt-2 text-center">
              <div className="!rounded-button bg-gray-100/80 text-slate-600 px-3 py-2 flex items-center gap-2 transition-all duration-300 rounded text-sm whitespace-normal md:whitespace-nowrap leading-relaxed border border-gray-200 dark:bg-white/20 dark:text-gray-400 dark:border-white/10">
                <span>
                  {text.freeAccess} -{" "}
                  <Link to="/login">
                    <span className="text-indigo-400 underline font-semibold">
                      {text.login}
                    </span>
                  </Link>{" "}
                  {text.forMore}
                </span>
              </div>
            </div>
          )}

          <div className="flex flex-col items-center md:items-end pt-2 w-full md:w-auto">
            <button className="!rounded-button bg-gray-100/80 hover:bg-gray-200/80 text-slate-900 dark:bg-white/20 dark:hover:bg-white/30 dark:text-gray-300 px-3 py-2 flex items-center gap-2 transition-all duration-300 rounded whitespace-nowrap border border-gray-200 dark:border-white/10">
              <span>
                {" "}
                <span className="text-gray-400 text-xs">{text.perMonth}</span>{" "}
                {getRequestLimit(userRole?.subscriptionType as string)}
              </span>
              <Link to="/pricing" className="border-1 border-white/20 pl-2 text-gray-300">
                {text.upgrade}
              </Link>
              <i className="fas fa-bolt text-yellow-400"></i>
            </button>
            <div className="mt-3 text-slate-500 text-xs text-center md:text-right dark:text-gray-500">
              <span>
                {text.monthlyRequests}:{" "}
                {login ? (data?.requestsThisMonth ?? 0) : guestRequestCount}
              </span>
              <br />
              <span>{text.totalPosts}: {login ? (data?.postsCount ?? 0) : 0}</span>

              <span className="h-3.5 w-px bg-slate-200 dark:bg-white/10" />
              <Link to="/pricing" className="text-blue-600 dark:text-blue-400 hover:text-blue-500 flex items-center gap-1.5">
                <span>{text.upgrade}</span>
                <i className="fas fa-bolt text-amber-400 text-[11px]" />
              </Link>
            </div>
            <div className="mt-2.5 text-[11px] font-semibold tracking-wide text-slate-400 dark:text-slate-500 text-center sm:text-right uppercase space-y-0.5">
              <div>{text.monthlyRequests}: {login ? (data?.requestsThisMonth ?? 0) : guestRequestCount}</div>
              <div>{text.totalPosts}: {login ? (data?.postsCount ?? 0) : 0}</div>
            </div>
          </div>
        </div>

        <div className="mt-11">
          <h1 className="text-slate-900 dark:text-gray-300 text-2xl sm:text-3xl md:text-4xl font-extrabold text-center mb-12">
            âœ¨ {text.titleStart}{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-blue-400">
        <div className="mb-12 max-w-3xl mx-auto text-center select-none">
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            ✨ {text.titleStart}{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
              {text.titleAccent}
            </span>{" "}
            âœ¨
          </h1>

          <div className="max-w-3xl mx-auto px-4 sm:px-0">
            <div className="bg-gray-50 rounded-md p-4 border border-gray-200 text-slate-900 dark:bg-blue-500/10 dark:border-gray-400 dark:text-white overflow-hidden">
              <div className="relative w-full">
                <form className="space-y-4 w-full" onSubmit={handleSubmit(onSubmit)}>
                  
                  {/* â”€â”€ Genre chips â”€â”€ */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {GENRES.map((genre) => (
                      <button
                        key={genre.value}
                        type="button"
                        disabled={loading}
                        onClick={() => {
                          if (loading) return;
                          const newGenre = selectedGenre === genre.value ? "" : genre.value;
                          setSelectedGenre(newGenre);
                          if (newGenre) {
                            playSoundtrack(newGenre);
                          } else if (audioRef.current) {
                            audioRef.current.pause();
                            audioRef.current.currentTime = 0;
                          }
                        }}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                          selectedGenre === genre.value
                            ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/30"
                            : "bg-white/10 text-gray-400 hover:bg-white/20 hover:text-gray-200"
                        } ${loading ? "cursor-not-allowed opacity-50" : ""}`}
                      >
                        {genre.icon} {genreLabels[genre.name]}
                      </button>
                    ))}
                  </div>

                  {/* â”€â”€ NEW: Tone picker â”€â”€ */}
                  <TonePicker selected={selectedTone} onChange={setSelectedTone} />

                  {/* â”€â”€ Length + Language row â”€â”€ */}
                  <div className="flex flex-wrap items-center gap-4 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400 mr-1">ðŸ“ {text.length}:</span>

        </div>

        <div className="max-w-3xl mx-auto w-full box-border space-y-6">
          <div className="bg-white dark:bg-[#111827]/40 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-sm hover:shadow-xl transition-shadow duration-300 w-full box-border">
            <form className="space-y-6 w-full box-border" onSubmit={handleSubmit(onSubmit)}>
              {currentStep === 1 ? (
                <>
                  {/* Step 1 Content */}
                  <div className="w-full box-border select-none">
                    <div className="flex flex-wrap gap-2">
                      {GENRES.map((genre) => (
                        <button
                          key={genre.value}
                          type="button"
                          onClick={() => {
                            const newGenre = selectedGenre === genre.value ? "" : genre.value;
                            setSelectedGenre(newGenre);
                            if (newGenre) {
                              playSoundtrack(newGenre);
                            } else if (audioRef.current) {
                              audioRef.current.pause();
                              audioRef.current.currentTime = 0;
                            }
                          }}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold tracking-wide uppercase border transition-all duration-150 cursor-pointer active:scale-[0.97] ${
                            selectedGenre === genre.value
                              ? "bg-gradient-to-r from-blue-600 to-indigo-600 border-transparent text-white shadow-md shadow-blue-500/10"
                              : "bg-slate-50 border-slate-200/60 text-slate-600 hover:bg-slate-100 dark:bg-white/5 dark:border-white/5 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-slate-200"
                          }`}
                        >
                          <span className="mr-1">{genre.icon}</span>
                          <span>{genreLabels[genre.name]}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Tone picker row */}
                  <div className="pt-2 border-t border-slate-100 dark:border-white/5 select-none">
                    <TonePicker selected={selectedTone} onChange={setSelectedTone} />
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-slate-100 dark:border-white/5 w-full box-border select-none">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mr-1">📏 {text.length}:</span>
                      {(["short", "medium", "long"] as const).map((length) => (
                        <button
                          key={length}
                          type="button"
                          onClick={() => setSelectedLength(length)}
                          className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wide border transition-all duration-150 cursor-pointer ${
                            selectedLength === length
                              ? "bg-blue-600 border-transparent text-white shadow-sm"
                              : "bg-slate-50 border-slate-200/60 text-slate-500 hover:bg-slate-100 dark:bg-white/5 dark:border-white/5 dark:text-slate-400 dark:hover:bg-white/10"
                          }`}
                        >
                          {text[length]}
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 ml-0 sm:ml-auto">
                      <span className="text-xs text-gray-400 mr-1">ðŸŒ {text.language}:</span>
                      <div className="relative" ref={languageDropdownRef}>
                    <div className="flex items-center gap-2" ref={languageDropdownRef}>
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mr-1">🌐 {text.language}:</span>
                      <div className="relative">
                        <button
                          key="lang-selector-btn"
                          type="button"
                          onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                          className="flex items-center gap-2 px-3.5 py-1.5 bg-slate-50 text-slate-600 border border-slate-200 dark:bg-white/5 dark:border-white/5 dark:text-slate-300 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-slate-100 dark:hover:bg-white/10 transition-all duration-150 cursor-pointer select-none"
                        >
                          <span>{LANGUAGES.find(l => l.name === selectedLanguage)?.name || "English"}</span>
                          <span className="text-gray-400 text-[10px]">â–¼</span>
                          <span className="text-slate-400 dark:text-slate-500 text-[9px]">▼</span>
                        </button>

                        {isLanguageDropdownOpen && (
                          <ul className="absolute right-0 z-20 mt-1.5 max-h-48 w-40 overflow-y-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl shadow-xl focus:outline-none divide-y divide-slate-100 dark:divide-white/5 p-1 box-border list-none m-0">
                            {LANGUAGES.map((lang) => (
                              <li key={lang.code} className="p-0 m-0 list-none">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedLanguage(lang.name);
                                    setIsLanguageDropdownOpen(false);
                                  }}
                                  className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-lg transition-colors duration-150 cursor-pointer ${
                                    selectedLanguage === lang.name
                                      ? "bg-blue-600 text-white font-bold"
                                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white"
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

                  {/* â”€â”€ Prompt textarea â”€â”€ */}
                  <div className="relative w-full">
                  <div className="relative border border-slate-200/80 dark:border-white/10 bg-slate-50/50 dark:bg-slate-950/30 rounded-2xl p-4 transition-all focus-within:border-blue-500/30 focus-within:bg-white dark:focus-within:bg-[#111827]/20 w-full box-border">
                    <textarea
                      {...register("prompt")}
                      ref={(el) => {
                        register("prompt").ref(el);
                        inputRef.current = el;
                      }}
                      className={`w-full h-32 sm:h-40 resize-none border-none outline-none bg-transparent text-slate-800 dark:text-slate-200 focus:ring-0 text-sm sm:text-base leading-relaxed placeholder:italic placeholder:text-slate-400 dark:placeholder:text-slate-500 pr-12 transition-colors duration-200 ${
                        isOverLimit ? "ring-1 ring-red-500 rounded-lg p-2" : isNearLimit ? "ring-1 ring-yellow-400 rounded-lg p-2" : ""
                      }`}
                      placeholder={text.promptPlaceholder}
                      value={textareaValue}
                      maxLength={MAX_PROMPT_LENGTH}
                      onChange={(e) => setTextareaValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleNextStep();
                        }
                      }}
                    />

                    <div className="absolute right-3.5 top-3.5 flex flex-col gap-2.5">
                      {textareaValue.length > 0 && (
                        <button
                          type="button"
                          onClick={handleClearPrompt}
                          className="w-7 h-7 flex items-center justify-center rounded-lg bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-400 hover:text-red-500 dark:hover:text-red-400 shadow-sm transition-colors duration-150 cursor-pointer"
                          aria-label={text.close}
                          title={text.close}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => setIsRecentPromptsOpen(!isRecentPromptsOpen)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm hover:bg-blue-500 transition-colors duration-150 cursor-pointer"
                        aria-label={text.recentPrompts}
                        title={text.recentPrompts}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-200/40 dark:border-white/5 select-none w-full box-border">
                      <div className="flex-1 min-w-0 pr-4">
                        {isOverLimit ? (
                          <p className="text-[11px] font-semibold text-red-500 dark:text-red-400 flex items-center gap-1 truncate m-0">
                            <span>⚠</span> {text.characterLimit}
                          </p>
                        ) : isNearLimit ? (
                          <p className="text-[11px] font-semibold text-amber-500 dark:text-amber-400 flex items-center gap-1 truncate m-0">
                            <span>⚠</span> {MAX_PROMPT_LENGTH - textareaValue.length} {text.charactersRemaining}
                          </p>
                        ) : null}
                      </div>

                      <span className={`text-[11px] font-bold tabular-nums shrink-0 ml-auto ${
                        isOverLimit ? "text-red-500 dark:text-red-400" : isNearLimit ? "text-amber-500" : "text-slate-400"
                      }`}>
                        {textareaValue.length} / {MAX_PROMPT_LENGTH}
                      </span>
                    </div>
                  </div>

                  <div className="text-[11px] font-medium leading-relaxed text-slate-400 dark:text-slate-500 select-none w-full box-border">
                    💡 <span className="font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mr-1">{text.keyboardTip}</span>
                    {text.press} <kbd className="px-1.5 py-0.5 text-[10px] font-bold bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/10 rounded-md text-slate-700 dark:text-slate-300 mx-0.5 shadow-sm">Enter</kbd> to continue &bull;{" "}
                    <kbd className="px-1.5 py-0.5 text-[10px] font-bold bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/10 rounded-md text-slate-700 dark:text-slate-300 mx-0.5 shadow-sm">Ctrl + Enter</kbd> also works &bull;{" "}
                    <kbd className="px-1.5 py-0.5 text-[10px] font-bold bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/10 rounded-md text-slate-700 dark:text-slate-300 mx-0.5 shadow-sm">Shift + Enter</kbd> {text.forNewLine}
                  </div>

                  <div className="flex justify-end pt-2 w-full box-border">
                    <button
                      type="button"
                      disabled={loading}
                      onClick={handleToggleRecentPrompts}
                      className={`absolute right-2 top-12 bg-indigo-600 text-white px-3 py-2 rounded-lg text-sm transition-colors duration-200 flex items-center gap-2 ${
                        loading
                          ? "cursor-not-allowed opacity-60"
                          : "hover:bg-indigo-700"
                      }`}
                      aria-label={text.recentPrompts}
                      title={text.recentPrompts}
                      onClick={handleNextStep}
                      className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-bold py-3 px-6 rounded-xl shadow-md shadow-blue-500/10 transition-all duration-150 active:scale-[0.98] select-none uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Next: Cast of Characters ➡️</span>
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {/* Step 2 Content: Cast of Characters */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/5 select-none w-full">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                    >
                      ⬅️ Back to Story Details
                    </button>
                    <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Step 2 of 2</span>
                  </div>

                    <div className="flex items-center justify-between mt-1 px-1">
                      {isOverLimit ? (
                        <p className="text-xs text-red-400 flex items-center gap-1">
                          <span>âš </span> {text.characterLimit}
                        </p>
                      ) : isNearLimit ? (
                        <p className="text-xs text-yellow-400 flex items-center gap-1">
                          <span>âš </span>{" "}
                          {MAX_PROMPT_LENGTH - textareaValue.length} {text.charactersRemaining}
                        </p>
                      ) : (
                        <span />
                      )}
                  <div className="space-y-2 select-none">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Cast of Characters</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      Define custom characters to ensure Gemini maintains character roles, personality traits, and dynamic relationships consistently throughout the story.
                    </p>
                  </div>

                      <span
  className={`text-xs tabular-nums ml-auto flex gap-2 ${
    isOverLimit
      ? "text-red-400 font-medium"
      : isNearLimit
      ? "text-yellow-400"
      : "text-gray-500"
  }`}
>
  <span>
    {textareaValue.trim() === "" ? 0 : textareaValue.trim().split(/\s+/).length} words
  </span>
  <span className="opacity-40">·</span>
  <span>{textareaValue.length} / {MAX_PROMPT_LENGTH} chars</span>
</span>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {characters.map((char, index) => (
                        <div
                          key={char.id}
                          className="p-4 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 rounded-2xl space-y-4 relative"
                        >
                          <div className="flex items-center justify-between select-none">
                            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                              👤 Character #{index + 1}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleRemoveCharacter(char.id)}
                              className="text-xs font-bold text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 hover:underline cursor-pointer"
                            >
                              Remove
                            </button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Name</label>
                              <input
                                type="text"
                                value={char.name}
                                onChange={(e) => handleCharacterChange(char.id, "name", e.target.value)}
                                placeholder="e.g. Leo, Sir Cedric, Bella"
                                className="w-full px-3 py-2 text-xs sm:text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl outline-none focus:border-blue-500/40 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 placeholder:italic"
                              />
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Role</label>
                              <select
                                value={char.role}
                                onChange={(e) => handleCharacterChange(char.id, "role", e.target.value)}
                                className="w-full px-3 py-2 text-xs sm:text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl outline-none focus:border-blue-500/40 text-slate-800 dark:text-slate-200"
                              >
                                <option value="Protagonist">Protagonist (Hero/Main Character)</option>
                                <option value="Companion">Companion (Sidekick/Friend)</option>
                                <option value="Rival">Rival (Competitor)</option>
                                <option value="Antagonist">Antagonist (Villain/Obstacle)</option>
                              </select>
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Personality & Traits</label>
                            <textarea
                              value={char.personality}
                              onChange={(e) => handleCharacterChange(char.id, "personality", e.target.value)}
                              placeholder="e.g. Brave but clumsy, loves eating carrots, afraid of the dark..."
                              rows={2}
                              className="w-full px-3 py-2 text-xs sm:text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl outline-none resize-none focus:border-blue-500/40 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 placeholder:italic"
                            />
                          </div>
                        </div>
                      ))}

                  <p className="text-xs text-gray-500 mt-1 px-1">
                    ðŸ’¡ <span className="font-medium">{text.keyboardTip}</span> {text.press}{" "}
                    <kbd className="px-1 py-0.5 text-xs bg-gray-700 rounded border border-gray-600">
                      Enter
                    </kbd>{" "}
                    {text.toGenerate} &bull;{" "}
                    <kbd className="px-1 py-0.5 text-xs bg-gray-700 rounded border border-gray-600">
                      Ctrl + Enter
                    </kbd>{" "}
                    {text.alsoWorks} &bull;{" "}
                    <kbd className="px-1 py-0.5 text-xs bg-gray-700 rounded border border-gray-600">
                      Shift + Enter
                    </kbd>{" "}
                    {text.forNewLine}
                  </p>

                  {/* â”€â”€ Generate button row â”€â”€ */}
                  <div className="flex items-center justify-between mt-2 w-full">
                    {/* Active tone badge */}
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      {selectedTone && (
                        <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-white/10 border border-white/10">
                          {TONES.find((t) => t.label === selectedTone)?.emoji}{" "}
                          <span className="font-medium">{selectedTone}</span>
                          <button
                            type="button"
                            disabled={loading}
                            onClick={() => setSelectedTone("")}
                            className={`ml-1 text-gray-500 transition-colors ${
                              loading
                                ? "cursor-not-allowed opacity-50"
                                : "hover:text-red-400"
                            }`}
                            aria-label="Remove tone"
                          >
                            Ã—
                          </button>
                        </span>
                      )}
                      <div className="flex justify-start select-none">
                        <button
                          type="button"
                          onClick={handleAddCharacter}
                          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold uppercase tracking-wider bg-slate-50 border border-slate-200/80 text-slate-600 hover:bg-slate-100 dark:bg-white/5 dark:border-white/5 dark:text-slate-400 dark:hover:bg-white/10 rounded-xl transition-all cursor-pointer"
                        >
                          <i className="fas fa-plus" />
                          <span>Add Another Character</span>
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-white/5 w-full box-border select-none">
                    <button
                      type="submit"
                      disabled={loading || isOverLimit}
                      aria-busy={loading}
                      aria-disabled={loading || isOverLimit}
                      className={`w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-bold py-3 px-6 rounded-xl shadow-md shadow-blue-500/10 transition-all duration-150 active:scale-[0.98] select-none uppercase tracking-wider flex items-center justify-center gap-2 ${
                        loading || isOverLimit ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                      } group`}
                    >
                      {loading ? (
                        <i className="fas fa-circle-notch text-sm animate-spin" />
                      ) : (
                        <i className="fas fa-wand-magic-sparkles text-sm group-hover:scale-110 transition-transform duration-200" />
                      )}
                      <span>{loading ? text.generating : text.generate}</span>
                    </button>
                  </div>
                  {loading && (
                    <p className="text-sm text-indigo-300 mt-3 text-right" aria-live="polite">
                      Your story is being generated. You can cancel the request if it takes too long.
                    </p>
                  )}
                </form>
              </div>
            </div>

            <div className="w-full max-w-2xl m-auto mt-4">
              <h1 className="text-sm text-slate-500 mb-1 dark:text-gray-500">
                {text.examples}
              </h1>

              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={handleToggleDropdown}
                  className="w-full p-3 bg-slate-800 text-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 flex items-center justify-between text-sm text-left transition-all duration-200"
                >
                  <span className="truncate pr-4">
                    {selectedPrompt || text.selectPrompt}
                  </span>
                  <span
                    className={`text-gray-300 transition-transform duration-200 ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                  >

                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>

                </div>

                <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-200/40 dark:border-white/5 select-none w-full box-border">
                  <div className="flex-1 min-w-0 pr-4">
                    {isOverLimit ? (
                      <p className="text-[11px] font-semibold text-red-500 dark:text-red-400 flex items-center gap-1 truncate m-0">
                        <span>⚠</span> {text.characterLimit}
                      </p>
                    ) : isNearLimit ? (
                      <p className="text-[11px] font-semibold text-amber-500 dark:text-amber-400 flex items-center gap-1 truncate m-0">
                        <span>⚠</span> {MAX_PROMPT_LENGTH - textareaValue.length} {text.charactersRemaining}
                      </p>
                    ) : null}
                  </div>

                  <span className={`text-[11px] font-bold tabular-nums shrink-0 ml-auto ${
                    isOverLimit ? "text-red-500 dark:text-red-400" : isNearLimit ? "text-amber-500" : "text-slate-400"
                  }`}>
                    {textareaValue.length} / {MAX_PROMPT_LENGTH}
                  </span>
                </div>
              </div>

                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Clear prompt button - next to language selector */}
      {textareaValue.length > 0 && (
        <button
          type="button"
          onClick={handleClearPrompt}
          className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-all duration-200 border border-red-500/20"
          aria-label={text.close}
          title="Clear prompt"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          Clear
        </button>
      )}
    </div>
    {showRestorePrompt && (
  <div className="mb-3 p-3 rounded-lg border border-indigo-500/40 bg-indigo-500/10">
    <p className="text-sm text-gray-300 mb-2">
      📄 A previously saved draft was found. Restore it?
    </p>

    <div className="flex gap-2">
      <button
        type="button"
        onClick={handleRestoreDraft}
        className="px-3 py-1 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-sm"
      >
        Restore
      </button>

      <button
        type="button"
        onClick={handleDiscardDraft}
        className="px-3 py-1 rounded-md bg-red-600 hover:bg-red-700 text-white text-sm"
      >
        Discard
      </button>
    </div>
  </div>
)}
    <div className="relative">
      <textarea
  {...register("prompt")}
  ref={(el) => {
    register("prompt").ref(el);
    inputRef.current = el;
  }}
        className={`w-full h-32 sm:h-40 resize-none border-none outline-none bg-transparent text-gray-800 dark:text-gray-200 focus:ring-0 text-lg leading-relaxed tracking-wide placeholder:italic placeholder:text-gray-500 dark:placeholder:text-gray-400 pr-4 transition-colors duration-200 ${
          isOverLimit
            ? "ring-1 ring-red-500 rounded"
            : isNearLimit
            ? "ring-1 ring-yellow-400 rounded"
            : ""
        }`}
        placeholder={text.promptPlaceholder}
        value={textareaValue}
        maxLength={MAX_PROMPT_LENGTH}
        onChange={(e) => {
          setTextareaValue(e.target.value);
    }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            const form = e.currentTarget.closest("form");
            if (form) form.requestSubmit();
          }
        }}
        />


      <div className="flex items-center justify-between mt-1 px-1">
        {isOverLimit ? (
          <p className="text-xs text-red-400 flex items-center gap-1">
            <span>⚠</span> Character limit reached — generate is disabled
          </p>
        ) : isNearLimit ? (
          <p className="text-xs text-yellow-400 flex items-center gap-1">
            <span>⚠</span>{" "}
            {MAX_PROMPT_LENGTH - textareaValue.length} characters remaining
          </p>
        ) : (
          <span />
        )}

        <span
          className={`text-xs tabular-nums ml-auto ${
            isOverLimit
              ? "text-red-400 font-medium"
              : isNearLimit
              ? "text-yellow-400"
              : "text-gray-500"
          }`}
        >
          {textareaValue.length} / {MAX_PROMPT_LENGTH}
        </span>
      </div>
    </div>
    

{draftStatus && (
   <p className="text-xs text-green-500 mt-2 px-1">
    💾 {draftStatus}
   </p>
)}
    
    <p className="text-xs text-gray-500 mt-1 px-1">
      💡  <span className="font-medium">Keyboard tip:</span> Press{" "}
      <kbd className="px-1 py-0.5 text-xs bg-gray-700 rounded border border-gray-600">
        Enter
      </kbd>{" "}
      to generate &bull;{" "}
      <kbd className="px-1 py-0.5 text-xs bg-gray-700 rounded border border-gray-600">
        Ctrl + Enter
      </kbd>{" "}
      also works &bull;{" "}
      <kbd className="px-1 py-0.5 text-xs bg-gray-700 rounded border border-gray-600">
        Shift + Enter
      </kbd>{" "}
      for new line
    </p>

    <div className="flex justify-end mt-2 w-full">
      <button
        type="submit"
        disabled={loading || isOverLimit}
        aria-busy={loading}
        aria-disabled={loading || isOverLimit}
        className={`rounded-lg bg-gradient-to-r from-blue-400 to-indigo-500 text-gray-200 px-6 py-3 font-semibold ${
          loading || isOverLimit
            ? "opacity-50 cursor-not-allowed"
            : "cursor-pointer hover:shadow-lg hover:shadow-indigo-500/50 hover:scale-105"
        } transition-all duration-300 transform flex items-center space-x-2 group`}
      >
        <i className="fas fa-wand-magic-sparkles text-xl transition-transform duration-300 group-hover:animate-wiggle"></i>
        {loading ? "Generating..." : "Generate"}
      </button>
    </div>
  </form>
</div>
            </div>

              <div className="text-[11px] font-medium leading-relaxed text-slate-400 dark:text-slate-500 select-none w-full box-border">
                💡 <span className="font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mr-1">{text.keyboardTip}</span>
                {text.press} <kbd className="px-1.5 py-0.5 text-[10px] font-bold bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/10 rounded-md text-slate-700 dark:text-slate-300 mx-0.5 shadow-sm">Enter</kbd> {text.toGenerate} &bull;{" "}
                <kbd className="px-1.5 py-0.5 text-[10px] font-bold bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/10 rounded-md text-slate-700 dark:text-slate-300 mx-0.5 shadow-sm">Ctrl + Enter</kbd> {text.alsoWorks} &bull;{" "}
                <kbd className="px-1.5 py-0.5 text-[10px] font-bold bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/10 rounded-md text-slate-700 dark:text-slate-300 mx-0.5 shadow-sm">Shift + Enter</kbd> {text.forNewLine}
              </div>

              <div className="flex justify-end pt-2 w-full box-border">
                <button
                  type="submit"
                  disabled={loading || isOverLimit}
                  aria-busy={loading}
                  aria-disabled={loading || isOverLimit}
                  className={`w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-bold py-3 px-6 rounded-xl shadow-md shadow-blue-500/10 transition-all duration-150 active:scale-[0.98] select-none uppercase tracking-wider flex items-center justify-center gap-2 ${
                    loading || isOverLimit ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                  } group`}
                >
                  <i className="fas fa-wand-magic-sparkles text-sm group-hover:scale-110 transition-transform duration-200" />
                  <span>{loading ? text.generating : text.generate}</span>
                </button>
              </div>
                </>
              )}
            </form>
          </div>

          <div className="w-full text-left box-border">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 select-none px-0.5">
              {text.examples}
            </h3>

            <div className="relative w-full" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full p-3.5 bg-white dark:bg-[#111827]/40 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-blue-500/30 flex items-center justify-between text-xs sm:text-sm font-medium text-left transition-all duration-150 cursor-pointer select-none shadow-sm"
              >
                <span className="truncate pr-4">
                  {selectedPrompt || text.selectPrompt}
                </span>
                <span className={`text-slate-400 dark:text-slate-500 text-[9px] transition-transform duration-150 shrink-0 ${isDropdownOpen ? "rotate-180" : ""}`}>
                  ▼
                </span>
              </button>

              {isDropdownOpen && (
                <ul className="absolute z-30 w-full mt-1.5 max-h-60 overflow-y-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl shadow-xl focus:outline-none divide-y divide-slate-100 dark:divide-white/5 p-1 box-border list-none m-0">
                  {prompts.map((item) => (
                    <li key={item.id} className="p-0 m-0 list-none">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedPrompt(item.prompt);
                          setTextareaValue(item.prompt);
                          setIsDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-3 text-xs sm:text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white rounded-lg transition-colors duration-150 whitespace-normal break-words leading-relaxed font-medium cursor-pointer"
                      >
                        {item.prompt}
                      </button>
                    </li>
                  ))}
                </ul>
              )}


                    â–¼
                  </span>
                </button>
                {isDropdownOpen && (
                  <ul className="relative z-10 w-full mt-1 max-h-60 overflow-y-auto bg-slate-800 border border-slate-700/50 rounded-lg shadow-xl focus:outline-none divide-y divide-slate-700/30">
                    {prompts.map((item) => (
                      <li key={item.id}>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedPrompt(item.prompt);
                            setTextareaValue(item.prompt);
                            setIsDropdownOpen(false);
                          }}
                          className="w-full text-left px-4 py-3 text-sm text-gray-400 hover:bg-indigo-600 hover:text-white transition-colors duration-150 whitespace-normal break-words leading-relaxed"
                        >
                          {item.prompt}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Prompts Panel */}
      <RecentPromptsPanel
        recentPrompts={recentPrompts}
        onSelectPrompt={handleSelectRecentPrompt}
        onRemovePrompt={removePrompt}
        onClearAll={clearAll}
        isOpen={isRecentPromptsOpen}
        onToggle={handleToggleRecentPrompts}
        text={recentPromptsText}
      />

      {showHelpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 max-w-md w-full text-slate-900 dark:bg-slate-900 dark:border-slate-700 dark:text-white">
            <h2 className="text-xl font-bold text-slate-900 mb-4 dark:text-white">
          <div className="bg-white border border-slate-200 dark:border-white/10 rounded-2xl p-6 max-w-md w-full text-slate-900 dark:bg-slate-900 dark:text-white shadow-xl">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 tracking-tight select-none border-b border-slate-100 dark:border-white/5 pb-2.5">
              {text.shortcuts}
            </h2>

            <div className="space-y-3 text-slate-600 text-sm dark:text-gray-300">
              <div><kbd>?</kbd> {text.openHelp}</div>
              <div><kbd>Esc</kbd> {text.closeHelp}</div>
              <div><kbd>/</kbd> {text.focusPrompt}</div>
              <div><kbd>Ctrl + Enter</kbd> {text.generateStory}</div>
              <div><kbd>Ctrl + S</kbd> {text.publishStory}</div>
            </div>

        <button
        onClick={handleCloseHelp}
        className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg"
      >
        {text.close}
      </button>
            <button
              onClick={() => setShowHelpModal(false)}
              className="mt-6 w-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase tracking-wider py-2.5 rounded-xl transition-colors shadow-sm select-none cursor-pointer"
            >
              {text.close}
            </button>
          </div>
        </div>
      )}

      {loading && <StoryGeneratingAnimation onCancel={handleCancelGeneration} isHighLatency={isHighLatency} />}

      {/* Search UI */}
      {stories.length > 0 && (
        <div className="mb-6 bg-slate-800/80 backdrop-blur-xl border border-slate-700/50 p-4 rounded-2xl">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search stories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <select
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Fields</option>
              <option value="title">Title</option>
              <option value="content">Content</option>
              <option value="genre">Genre</option>
            </select>
          </div>
          {searchQuery && (
            <div className="mt-2 text-sm text-slate-400">
              Found {filteredStories.length} {filteredStories.length === 1 ? 'story' : 'stories'}
            </div>
          )}
        </div>
      )}

      <StoriesViewComponent
        stories={currentStories}
        isLogin={login}
        setStories={setStories}
        onPublishSuccess={handlePublishSuccess}
        isLoading={loading}
      />

      <div className="fixed top-[-200px] left-[250px] w-[800px] h-[350px] bg-blue-500/20 rounded-full blur-3xl -z-10"></div>
      {showLimitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white border border-gray-200 rounded-2xl shadow-[0_0_15px_rgba(59,130,246,0.15)] max-w-md w-full p-6 transform transition-all text-slate-900 dark:bg-[#0f172a] dark:border-white/10 dark:text-white dark:shadow-[0_0_15px_rgba(59,130,246,0.5)]">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-lock text-2xl text-blue-400"></i>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2 dark:text-gray-200">
                {text.freeLimitReached}
              </h3>
              <p className="text-slate-600 mb-6 leading-relaxed dark:text-gray-400">
                {text.freeLimitMessage}
              </p>
              <div className="flex flex-col gap-3">
                <Link
                  to="/login"
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-3 px-4 rounded-xl transition-all shadow-lg hover:shadow-indigo-500/25"
                >
                  {text.login}
                </Link>
                <button
                  onClick={() => setShowLimitModal(false)}
                  className="w-full bg-transparent hover:bg-slate-100 text-slate-600 hover:text-slate-900 font-medium py-3 px-4 rounded-xl transition-all dark:hover:bg-white/5 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  {text.continueBrowsing}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
     
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            onClick={() => setCurrentPage((p) => p - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded bg-slate-700 text-white disabled:opacity-50 cursor-pointer"
          >
            Previous
          </button>

          <span>
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage((p) => p + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded bg-slate-700 text-white disabled:opacity-50 cursor-pointer"
          >
            Next
          </button>
        </div>
      )}

      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
};

export default StoriesComponent;

