import React, { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { getShortenedText, ITopicData, topicsData, getWordCount, SELECTED_TOPIC_CLASSES } from "./stories.utils";
import { formatReadingStats } from "../../utils/story-utils";
import toast, { Toaster } from "react-hot-toast";
import { useCreatePostMutation, useDeletePostMutation } from "../../redux/apis/post.api";
import { useGetProfileInfoQuery } from "../../redux/apis/user.api";
import jsPDF from "jspdf";
import StoryWorldMap from "../story-map/StoryWorldMap";
import BookmarkButton from "../BookmarkButton";
import logo from "../../assets/logoNew.png";
import StoryGeneratingAnimation from "../loading/story-generating-animation.component";
import { useDebounce } from "../../hooks/useDebounce";
import ConfirmDialog from "./ConfirmDialog";

const soundtrackMap: Record<string, string> = {
  "≡ƒºÖ Fantasy": "/audio/fantasy.mp3",
  "≡ƒÿ▒ Horror": "/audio/horror.mp3",
  "≡ƒÆò Romance": "/audio/romance.mp3",
  "≡ƒÄ¡ Drama": "/audio/drama.mp3", 
  "≡ƒÿé Comedy": "/audio/comedy.mp3", 
  "≡ƒÜÇ Sci-Fi": "/audio/sci-fi.mp3", 
  "≡ƒöì Mystery": "/audio/mystery.mp3", 
  "≡ƒîƒ Adventure": "/audio/adventure.mp3"
};

type Inputs = {
  prompt: string;
};

const MAX_PROMPT_LENGTH = 2000;
const WARN_THRESHOLD = 0.85;
const lengths = ["short", "medium", "long"] as const;
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
  { value: "≡ƒÄ¡ Drama", icon: "≡ƒÄ¡", name: "Drama" },
  { value: "≡ƒÿé Comedy", icon: "≡ƒÿé", name: "Comedy" },
  { value: "≡ƒÿ▒ Horror", icon: "≡ƒÿ▒", name: "Horror" },
  { value: "≡ƒÆò Romance", icon: "≡ƒÆò", name: "Romance" },
  { value: "≡ƒÜÇ Sci-Fi", icon: "≡ƒÜÇ", name: "Sci-Fi" },
  { value: "≡ƒºÖ Fantasy", icon: "≡ƒºÖ", name: "Fantasy" },
  { value: "≡ƒöì Mystery", icon: "≡ƒöì", name: "Mystery" },
  { value: "≡ƒîƒ Adventure", icon: "≡ƒîƒ", name: "Adventure" },
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
    Drama: "αñ¿αñ╛αñƒαñò", Comedy: "αñ╣αñ╛αñ╕αÑìαñ»", Horror: "αñíαñ░αñ╛αñ╡αñ¿αÑÇ", Romance: "αñ¬αÑìαñ░αÑçαñ«",
    "Sci-Fi": "αñ╡αñ┐αñ£αÑìαñ₧αñ╛αñ¿ αñòαñÑαñ╛", Fantasy: "αñòαñ▓αÑìαñ¬αñ¿αñ╛", Mystery: "αñ░αñ╣αñ╕αÑìαñ»", Adventure: "αñ░αÑïαñ«αñ╛αñéαñÜ",
  },
  German: {
    Drama: "Drama", Comedy: "Komodie", Horror: "Horror", Romance: "Romanze",
    "Sci-Fi": "Science-Fiction", Fantasy: "Fantasy", Mystery: "Mysterie", Adventure: "Abenteuer",
  },
  Japanese: {
    Drama: "πâëπâ⌐πâ₧", Comedy: "πé│πâíπâçπéú", Horror: "πâ¢πâ⌐πâ╝", Romance: "πâ¡πâ₧πâ│πé╣",
    "Sci-Fi": "SF", Fantasy: "πâòπéíπâ│πé┐πé╕πâ╝", Mystery: "πâƒπé╣πâåπâ¬πâ╝", Adventure: "σåÆΘÖ║",
  },
  Korean: {
    Drama: "δô£δ¥╝δºê", Comedy: "∞╜öδ»╕δöö", Horror: "Ω│╡φÅ¼", Romance: "δí£δº¿∞èñ",
    "Sci-Fi": "SF", Fantasy: "φîÉφâÇ∞ºÇ", Mystery: "δ»╕∞èñφä░δª¼", Adventure: "δ¬¿φùÿ",
  },
  Bengali: {
    Drama: "αª¿αª╛αªƒαªò", Comedy: "αªòαºîαªñαÑüαñò", Horror: "αª¡αºîαªñαª┐αªò", Romance: "αª¬αºìαª░αºçαª«",
    "Sci-Fi": "αª¼αª┐αª£αºìαª₧αª╛αª¿ αªòαª▓αºìαª¬αªòαª╛αª╣αª┐αª¿αª┐", Fantasy: "αªòαª▓αºìαª¬αª¿αª╛", Mystery: "αª░αª╣αª╕αºìαª»", Adventure: "αªàαª¡αª┐αª»αª╛αª¿",
  },
  Tamil: {
    Drama: "α«¿α«╛α«ƒα«òα««α»ì", Comedy: "α«¿α«òα»êα«Üα»ìα«Üα»üα«╡α»ê", Horror: "α«ñα«┐α«òα«┐α«▓α»ì", Romance: "α«òα«╛α«ñα«▓α»ì",
    "Sci-Fi": "α«àα«▒α«┐α«╡α«┐α«»α«▓α»ì α«¬α»üα«⌐α»êα«╡α»ü", Fantasy: "α«òα«▒α»ìα«¬α«⌐α»ê", Mystery: "α««α«░α»ìα««α««α»ì", Adventure: "α«Üα«╛α«òα«Üα««α»ì",
  },
  Telugu: {
    Drama: "α░¿α░╛α░ƒα░òα░é", Comedy: "α░╣α░╛α░╕α▒ìα░»α░é", Horror: "α░¡α░»α░╛α░¿α░òα░é", Romance: "α░¬α▒ìα░░α▒çα░«",
    "Sci-Fi": "α░╡α░┐α░£α▒ìα░₧α░╛α░¿ α░òα░Ñ", Fantasy: "α░òα░╛α░▓α▒ìα░¬α░¿α░┐α░òα░é", Mystery: "α░░α░╣α░╕α▒ìα░»α░é", Adventure: "α░╕α░╛α░╣α░╕α░é",
  },
  Marathi: {
    Drama: "αñ¿αñ╛αñƒαñò", Comedy: "αñ╡αñ┐αñ¿αÑïαñª", Horror: "αñ¡αñ»αñòαñÑαñ╛", Romance: "αñ¬αÑìαñ░αÑçαñ«αñòαñÑαñ╛",
    "Sci-Fi": "αñ╡αñ┐αñ£αÑìαñ₧αñ╛αñ¿αñòαñÑαñ╛", Fantasy: "αñòαñ▓αÑìαñ¬αñ¿αñ╛αñªαñ«αÑìαñ»", Mystery: "αñ░αñ╣αñ╕αÑìαñ»", Adventure: "αñ╕αñ╛αñ╣αñ╕",
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
    back: "αñ╡αñ╛αñ¬αñ╕", freeAccess: "3 αñàαñ¿αÑüαñ░αÑïαñºαÑïαñé αñòαÑç αñ▓αñ┐αñÅ αñ«αÑüαñ½αÑìαññ αñëαñ¬αñ»αÑïαñù", login: "αñ▓αÑëαñù αñçαñ¿", forMore: "αñöαñ░ αñ¬αñ╛αñ¿αÑç αñòαÑç αñ▓αñ┐αñÅ!",
    perMonth: "αñ¬αÑìαñ░αññαñ┐ αñ«αñ╛αñ╣", upgrade: "αñàαñ¬αñùαÑìαñ░αÑçαñí", monthlyRequests: "αñçαñ╕ αñ«αñ╛αñ╣ αñòαÑç αñàαñ¿αÑüαñ░αÑïαñº", totalPosts: "αñòαÑüαñ▓ αñ¬αÑïαñ╕αÑìαñƒ",
    titleStart: "αñàαñ¬αñ¿αÑç αñ╡αñ┐αñÜαñ╛αñ░αÑïαñé αñòαÑï αñ¼αñªαñ▓αÑçαñé", titleAccent: "αñàαñªαÑìαñ¡αÑüαññ αñòαñ╣αñ╛αñ¿αñ┐αñ»αÑïαñé αñ«αÑçαñé!", length: "αñ▓αñéαñ¼αñ╛αñê", language: "αñ¡αñ╛αñ╖αñ╛",
    short: "αñ¢αÑïαñƒαÑÇ", medium: "αñ«αñºαÑìαñ»αñ«", long: "αñ▓αñéαñ¼αÑÇ", promptPlaceholder: "αñ╣αñ░ αñ«αñ╣αñ╛αñ¿ αñòαñ╣αñ╛αñ¿αÑÇ αñÅαñò αñ╡αñ┐αñÜαñ╛αñ░ αñ╕αÑç αñ╢αÑüαñ░αÑé αñ╣αÑïαññαÑÇ αñ╣αÑêαÑñ αñåαñ¬αñòαñ╛ αñ╡αñ┐αñÜαñ╛αñ░ αñòαÑìαñ»αñ╛ αñ╣αÑê?",
    keyboardTip: "αñòαÑÇαñ¼αÑïαñ░αÑìαñí αñ╕αÑüαñ¥αñ╛αñ╡:", press: "αñªαñ¼αñ╛αñÅαñé", toGenerate: "αñ¼αñ¿αñ╛αñ¿αÑç αñòαÑç αñ▓αñ┐αñÅ", alsoWorks: "αñ¡αÑÇ αñòαñ╛αñ« αñòαñ░αññαñ╛ αñ╣αÑê", forNewLine: "αñ¿αñê αñ¬αñéαñòαÑìαññαñ┐ αñòαÑç αñ▓αñ┐αñÅ",
    generating: "αñ¼αñ¿ αñ░αñ╣αÑÇ αñ╣αÑê...", generate: "αñ¼αñ¿αñ╛αñÅαñé", examples: "αñçαñ¿ αñëαñªαñ╛αñ╣αñ░αñú αñ╕αñéαñòαÑçαññαÑïαñé αñòαñ╛ αñëαñ¬αñ»αÑïαñù αñòαñ░αÑçαñé:",
    selectPrompt: "αñÅαñò αñ╕αñéαñòαÑçαññ αñ╕αñéαñòαÑçαññ αñÜαÑüαñ¿αÑçαñé", characterLimit: "αñàαñòαÑìαñ╖αñ░ αñ╕αÑÇαñ«αñ╛ αñ¬αÑéαñ░αÑÇ - αñ¿αñ┐αñ░αÑìαñ«αñ╛αñú αñàαñòαÑìαñ╖αñ« αñ╣αÑê", charactersRemaining: "αñàαñòαÑìαñ╖αñ░ αñ╢αÑçαñ╖",
    shortcuts: "αñòαÑÇαñ¼αÑïαñ░αÑìαñí αñ╢αÑëαñ░αÑìαñƒαñòαñƒ", openHelp: "αñ╕αñ╣αñ╛αñ»αññαñ╛ αñûαÑïαñ▓αÑçαñé", closeHelp: "αñ╕αñ╣αñ╛αñ»αññαñ╛ αñ¼αñéαñª αñòαñ░αÑçαñé", focusPrompt: "αñ╕αñéαñòαÑçαññ αñ¬αñ░ αñ£αñ╛αñÅαñé",
    generateStory: "αñòαñ╣αñ╛αñ¿αÑÇ αñ¼αñ¿αñ╛αñÅαñé", publishStory: "αñòαñ╣αñ╛αñ¿αÑÇ αñ¬αÑìαñ░αñòαñ╛αñ╢αñ┐αññ αñòαñ░αÑçαñé", close: "αñ¼αñéαñª αñòαñ░αÑçαñé", freeLimitReached: "αñ«αÑüαñ½αÑìαññ αñ╕αÑÇαñ«αñ╛ αñ¬αÑéαñ░αÑÇ",
    freeLimitMessage: "αñåαñ¬αñ¿αÑç αñ╕αñ¡αÑÇ 3 αñ«αÑüαñ½αÑìαññ αñòαñ╣αñ╛αñ¿αÑÇ αñ¿αñ┐αñ░αÑìαñ«αñ╛αñú αñëαñ¬αñ»αÑïαñù αñòαñ░ αñ▓αñ┐αñÅ αñ╣αÑêαñéαÑñ αñåαñùαÑç αñ£αñ╛αñ░αÑÇ αñ░αñûαñ¿αÑç αñòαÑç αñ▓αñ┐αñÅ αñ▓αÑëαñù αñçαñ¿ αñòαñ░αÑçαñéαÑñ", continueBrowsing: "αñ¼αÑìαñ░αñ╛αñëαÑ¢ αñòαñ░αñ¿αñ╛ αñ£αñ╛αñ░αÑÇ αñ░αñûαÑçαñé", recentPrompts: "αñ╣αñ╛αñ▓ αñòαÑç αñ╕αñéαñòαÑçαññ", usePrompt: "αñëαñ¬αñ»αÑïαñù αñòαñ░αÑçαñé", delete: "αñ╣αñƒαñ╛αñÅαñé", clearAll: "αñ╕αñ¼ αñ╕αñ╛αñ½ αñòαñ░αÑçαñé", noRecentPrompts: "αñòαÑïαñê αñ╣αñ╛αñ▓ αñòαÑç αñ╕αñéαñòαÑçαññ αñ¿αñ╣αÑÇαñé",
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
    back: "µê╗πéï", freeAccess: "3σ¢₧πü╛πüºτäíµûÖπüºσê⌐τö¿πüºπüìπü╛πüÖ", login: "πâ¡πé░πéñπâ│", forMore: "πüùπüªπüòπéëπü½σê⌐τö¿∩╝ü",
    perMonth: "µ£êπüöπü¿", upgrade: "πéóπââπâùπé░πâ¼πâ╝πâë", monthlyRequests: "Σ╗èµ£êπü«πâ¬πé»πé¿πé╣πâê", totalPosts: "µèòτ¿┐µò░",
    titleStart: "πéóπéñπâçπéóπéÆ", titleAccent: "πüÖπü░πéëπüùπüäτë⌐Φ¬₧πü½∩╝ü", length: "Θò╖πüò", language: "Φ¿ÇΦ¬₧",
    short: "τƒ¡πüä", medium: "Σ╕¡τ¿ïσ║ª", long: "Θò╖πüä", promptPlaceholder: "πüÖπü╣πüªπü«τë⌐Φ¬₧πü»Σ╕Çπüñπü«πéóπéñπâçπéóπüïπéëσºïπü╛πéèπü╛πüÖπÇéπüéπü¬πüƒπü«πéóπéñπâçπéóπü»∩╝ƒ",
    keyboardTip: "πé¡πâ╝πâ£πâ╝πâëπü«πâÆπâ│πâê:", press: "µè╝πüÖ", toGenerate: "πüºτöƒµêÉ", alsoWorks: "πééΣ╜┐τö¿σÅ»Φâ╜", forNewLine: "πüºµö╣Φíî",
    generating: "τöƒµêÉΣ╕¡...", generate: "τöƒµêÉ", examples: "σÅéΦÇâπü½πüºπüìπéïπâùπâ¡πâ│πâùπâêΣ╛ï:",
    selectPrompt: "πâùπâ¡πâ│πâùπâêπéÆΘü╕µè₧", characterLimit: "µûçσ¡ùµò░πü«Σ╕èΘÖÉπü½Θüöπüùπü╛πüùπüƒ - τöƒµêÉπüºπüìπü╛πü¢πéô", charactersRemaining: "µûçσ¡ùµ«ïπéè",
    shortcuts: "πé¡πâ╝πâ£πâ╝πâëπé╖πâºπâ╝πâêπé½πââπâê", openHelp: "πâÿπâ½πâùπéÆΘûïπüÅ", closeHelp: "πâÿπâ½πâùπéÆΘûëπüÿπéï", focusPrompt: "πâùπâ¡πâ│πâùπâêπü½τº╗σïò",
    generateStory: "τë⌐Φ¬₧πéÆτöƒµêÉ", publishStory: "τë⌐Φ¬₧πéÆσà¼Θûï", close: "Θûëπüÿπéï", freeLimitReached: "τäíµûÖΣ╕èΘÖÉπü½Θüöπüùπü╛πüùπüƒ",
    freeLimitMessage: "τäíµûÖπü«τë⌐Φ¬₧τöƒµêÉπéÆ3σ¢₧πüÖπü╣πüªΣ╜┐τö¿πüùπü╛πüùπüƒπÇéτ╢Üπüæπéïπü½πü»πâ¡πé░πéñπâ│πüùπüªπüÅπüáπüòπüäπÇé", continueBrowsing: "Θû▓ΦªºπéÆτ╢Üπüæπéï", recentPrompts: "µ£ÇΦ┐æπü«πâùπâ¡πâ│πâùπâê", usePrompt: "Σ╜┐τö¿", delete: "σëèΘÖñ", clearAll: "πüÖπü╣πüªπé»πâ¬πéó", noRecentPrompts: "µ£ÇΦ┐æπü«πâùπâ¡πâ│πâùπâêπü»πüéπéèπü╛πü¢πéô",
  },
  Korean: {
    back: "δÆñδí£", freeAccess: "∞Üö∞▓¡ 3φÜî δ¼┤δúî ∞¥┤∞Ü⌐", login: "δí£Ω╖╕∞¥╕", forMore: "φòÿΩ│á δìö ∞¥┤∞Ü⌐φòÿ∞ä╕∞Üö!",
    perMonth: "∞¢öδ│ä", upgrade: "∞ùàΩ╖╕δáê∞¥┤δô£", monthlyRequests: "∞¥┤δ▓ê δï¼ ∞Üö∞▓¡", totalPosts: "∞áä∞▓┤ Ω▓î∞ï£δ¼╝",
    titleStart: "∞òä∞¥┤δöö∞û┤δÑ╝", titleAccent: "δ⌐ï∞ºä ∞¥┤∞ò╝Ω╕░δí£!", length: "Ω╕╕∞¥┤", language: "∞û╕∞û┤",
    short: "∞ººΩ▓î", medium: "∞ñæΩ░ä", long: "Ω╕╕Ω▓î", promptPlaceholder: "δ¬¿δôá φ¢îδÑ¡φò£ ∞¥┤∞ò╝Ω╕░δèö φòÿδéÿ∞¥ÿ ∞òä∞¥┤δöö∞û┤∞ùÉ∞ä£ ∞ï£∞₧æδÉ⌐δïêδïñ. δï╣∞ïá∞¥ÿ ∞òä∞¥┤δöö∞û┤δèö?",
    keyboardTip: "φéñδ│┤δô£ φîü:", press: "δêäδÑ┤Ω╕░", toGenerate: "∞â¥∞ä▒", alsoWorks: "δÅä Ω░ÇδèÑ", forNewLine: "∞âê ∞ñä",
    generating: "∞â¥∞ä▒ ∞ñæ...", generate: "∞â¥∞ä▒", examples: "∞░╕Ω│áφòá ∞êÿ ∞₧êδèö φöäδí¼φöäφè╕ ∞ÿê∞ï£:",
    selectPrompt: "φöäδí¼φöäφè╕ ∞äáφâ¥", characterLimit: "Ω╕Ç∞₧É ∞êÿ ∞á£φò£ δÅäδï¼ - ∞â¥∞ä▒φòá ∞êÿ ∞ùå∞è╡δïêδïñ", charactersRemaining: "Ω╕Ç∞₧É δé¿∞¥î",
    shortcuts: "φéñδ│┤δô£ δï¿∞╢òφéñ", openHelp: "δÅä∞¢ÇδºÉ ∞ù┤Ω╕░", closeHelp: "δÅä∞¢ÇδºÉ δï½Ω╕░", focusPrompt: "φöäδí¼φöäφè╕∞ùÉ ∞┤ê∞áÉ",
    generateStory: "∞¥┤∞ò╝Ω╕░ ∞â¥∞ä▒", publishStory: "∞¥┤∞ò╝Ω╕░ Ω▓î∞ï£", close: "δï½Ω╕░", freeLimitReached: "δ¼┤δúî φò£δÅä δÅäδï¼",
    freeLimitMessage: "δ¼┤δúî ∞¥┤∞ò╝Ω╕░ ∞â¥∞ä▒∞¥ä 3φÜî δ¬¿δæÉ ∞é¼∞Ü⌐φûê∞è╡δïêδïñ. Ω│ä∞åìφòÿδáñδ⌐┤ δí£Ω╖╕∞¥╕φòÿ∞ä╕∞Üö.", continueBrowsing: "Ω│ä∞åì δæÿδƒ¼δ│┤Ω╕░", recentPrompts: "∞╡£Ω╖╝ φöäδí¼φöäφè╕", usePrompt: "∞é¼∞Ü⌐", delete: "∞é¡∞á£", clearAll: "δ¬¿δæÉ ∞ºÇ∞Ü░Ω╕░", noRecentPrompts: "∞╡£Ω╖╝ φöäδí¼φöäφè╕Ω░Ç ∞ùå∞è╡δïêδïñ",
  },
  Bengali: {
    back: "αª½αª┐αª░αºç αª»αª╛αª¿", freeAccess: "αº⌐αªƒαª┐ αªàαª¿αºüαª░αºïαªºαºçαª░ αª£αª¿αºìαª» αª¼αª┐αª¿αª╛αª«αºéαª▓αºìαª»αºç αª¼αºìαª»αª¼αª╣αª╛αª░", login: "αª▓αªù αªçαª¿", forMore: "αªòαª░αºç αªåαª░αªô αª¬αª╛αª¿!",
    perMonth: "αª¬αºìαª░αªñαª┐ αª«αª╛αª╕αºç", upgrade: "αªåαª¬αªùαºìαª░αºçαªí", monthlyRequests: "αªÅαªç αª«αª╛αª╕αºçαª░ αªàαª¿αºüαª░αºïαªº", totalPosts: "αª«αºïαªƒ αª¬αºïαª╕αºìαªƒ",
    titleStart: "αªåαª¬αª¿αª╛αª░ αª¡αª╛αª¼αª¿αª╛αªòαºç αª¼αªªαª▓αºç αªªαª┐αª¿", titleAccent: "αªàαª╕αª╛αªºαª╛αª░αªú αªùαª▓αºìαª¬αºç!", length: "αªªαºêαª░αºìαªÿαºìαª»", language: "αª¡αª╛αª╖αª╛",
    short: "αª¢αºïαªƒ", medium: "αª«αª╛αª¥αª╛αª░αª┐", long: "αª▓αª«αºìαª¼αª╛", promptPlaceholder: "αª¬αºìαª░αªñαª┐αªƒαª┐ αª«αª╣αª╛αª¿ αªùαª▓αºìαª¬ αªÅαªòαªƒαª┐ αª¡αª╛αª¼αª¿αª╛ αªªαª┐αºƒαºç αª╢αºüαª░αºü αª╣αºƒαÑñ αªåαª¬αª¿αª╛αª░αªƒαª┐ αªòαºÇ?",
    keyboardTip: "αªòαºÇαª¼αºïαª░αºìαªí αªƒαª┐αª¬:", press: "αªÜαª╛αª¬αºüαª¿", toGenerate: "αªñαºêαª░αª┐ αªòαª░αªñαºç", alsoWorks: "αªÅαªƒαª┐αªô αªòαª╛αª£ αªòαª░αºç", forNewLine: "αª¿αªñαºüαª¿ αª▓αª╛αªçαª¿αºçαª░ αª£αª¿αºìαª»",
    generating: "αªñαºêαª░αª┐ αª╣αªÜαºìαª¢αºç...", generate: "αªñαºêαª░αª┐ αªòαª░αºüαª¿", examples: "αªòαª┐αª¢αºü αªëαªªαª╛αª╣αª░αªú αª¬αºìαª░αª«αºìαª¬αªƒ:",
    selectPrompt: "αªÅαªòαªƒαª┐ αª¬αºìαª░αª«αºìαª¬αªƒ αª¼αºçαª¢αºç αª¿αª┐αª¿", characterLimit: "αªàαªòαºìαª╖αª░αºçαª░ αª╕αºÇαª«αª╛ αª¬αºéαª░αºìαªú - αªñαºêαª░αª┐ αª¼αª¿αºìαªº", charactersRemaining: "αªàαªòαºìαª╖αª░ αª¼αª╛αªòαª┐",
    shortcuts: "αªòαºÇαª¼αºïαª░αºìαªí αª╢αª░αºìαªƒαªòαª╛αªƒ", openHelp: "αª╕αª╣αª╛αºƒαªñαª╛ αªûαºüαª▓αºüαª¿", closeHelp: "αª╕αª╣αª╛αºƒαªñαª╛ αª¼αª¿αºìαªº αªòαª░αºüαª¿", focusPrompt: "αª¬αºìαª░αª«αºìαª¬αªƒαºç αª»αª╛αª¿",
    generateStory: "αªùαª▓αºìαª¬ αªñαºêαª░αª┐ αªòαª░αºüαª¿", publishStory: "αªùαª▓αºìαª¬ αª¬αºìαª░αªòαª╛αª╢ αªòαª░αºüαª¿", close: "αª¼αª¿αºìαªº αªòαª░αºüαª¿", freeLimitReached: "αª¼αª┐αª¿αª╛αª«αºéαª▓αºìαª»αºçαª░ αª╕αºÇαª«αª╛ αª¬αºéαª░αºìαªú",
    freeLimitMessage: "αªåαª¬αª¿αª┐ αº⌐αªƒαª┐ αª¼αª┐αª¿αª╛αª«αºéαª▓αºìαª»αºçαª░ αªùαª▓αºìαª¬ αªñαºêαª░αª┐ αª¼αºìαª»αª¼αª╣αª╛αª░ αªòαª░αºçαª¢αºçαª¿αÑñ αªÜαª╛αª▓αª┐αºƒαºç αª»αºçαªñαºç αª▓αªù αªçαª¿ αªòαª░αºüαª¿αÑñ", continueBrowsing: "αª¼αºìαª░αª╛αªëαª£ αªÜαª╛αª▓αª┐αºƒαºç αª»αª╛αª¿", recentPrompts: "αª╕αª«αºìαª¬αºìαª░αªñαª┐ αª¼αºìαª»αª¼αª╣αºâαªñ αª¬αºìαª░αª«αºìαª¬αªƒ", usePrompt: "αª¼αºìαª»αª¼αª╣αª╛αª░ αªòαª░αºüαª¿", delete: "αª«αºüαª¢αºç αª½αºçαª▓αºüαª¿", clearAll: "αª╕αª¼ αª«αºüαª¢αºç αªªαª┐αª¿", noRecentPrompts: "αªòαºïαª¿αºï αª╕αª«αºìαª¬αºìαª░αªñαª┐ αª¼αºìαª»αª¼αª╣αºâαªñ αª¬αºìαª░αª«αºìαª¬αªƒ αª¿αºçαªç",
  },
  Tamil: {
    back: "α«ñα«┐α«░α»üα««α»ìα«¬α»üα«ò", freeAccess: "3 α«òα»ïα«░α«┐α«òα»ìα«òα»êα«òα«│α»üα«òα»ìα«òα»ü α«çα«▓α«╡α«Ü α«àα«úα»üα«òα«▓α»ì", login: "α«ëα«│α»ìα«¿α»üα«┤α»ê", forMore: "α«Üα»åα«»α»ìα«ñα»ü α««α»çα«▓α»üα««α»ì α«¬α»åα«▒α»üα«Öα»ìα«òα«│α»ì!",
    perMonth: "α««α«╛α«ñα«ñα»ìα«ñα«┐α«▒α»ìα«òα»ü", upgrade: "α««α»çα««α»ìα«¬α«ƒα»üα«ñα»ìα«ñα»ü", monthlyRequests: "α«çα«¿α»ìα«ñ α««α«╛α«ñ α«òα»ïα«░α«┐α«òα»ìα«òα»êα«òα«│α»ì", totalPosts: "α««α»èα«ñα»ìα«ñ α«¬α«ñα«┐α«╡α»üα«òα«│α»ì",
    titleStart: "α«ëα«Öα»ìα«òα«│α»ì α«Äα«úα»ìα«úα«Öα»ìα«òα«│α»ê", titleAccent: "α«àα«▒α»ìα«¬α»üα«ñ α«òα«ñα»êα«òα«│α«╛α«ò α««α«╛α«▒α»ìα«▒α»üα«Öα»ìα«òα«│α»ì!", length: "α«¿α»Çα«│α««α»ì", language: "α««α»èα«┤α«┐",
    short: "α«Üα«┐α«▒α«┐α«»α«ñα»ü", medium: "α«¿α«ƒα»üα«ñα»ìα«ñα«░α««α»ì", long: "α«¿α»Çα«│α««α«╛α«⌐α«ñα»ü", promptPlaceholder: "α«Æα«╡α»ìα«╡α»èα«░α»ü α«Üα«┐α«▒α«¿α»ìα«ñ α«òα«ñα»êα«»α»üα««α»ì α«Æα«░α»ü α«Äα«úα»ìα«úα«ñα»ìα«ñα«┐α«▓α»ì α«ñα»èα«ƒα«Öα»ìα«òα»üα«òα«┐α«▒α«ñα»ü. α«ëα«Öα»ìα«òα«│α»üα«ƒα»êα«»α«ñα»ü α«Äα«⌐α»ìα«⌐?",
    keyboardTip: "α«╡α«┐α«Üα»êα«¬α»ìα«¬α«▓α«òα»ê α«òα»üα«▒α«┐α«¬α»ìα«¬α»ü:", press: "α«àα«┤α»üα«ñα»ìα«ñα«╡α»üα««α»ì", toGenerate: "α«ëα«░α»üα«╡α«╛α«òα»ìα«ò", alsoWorks: "α«çα«ñα»üα«╡α»üα««α»ì α«Üα»åα«»α«▓α»ìα«¬α«ƒα»üα««α»ì", forNewLine: "α«¬α»üα«ñα«┐α«» α«╡α«░α«┐α«òα»ìα«òα»ü",
    generating: "α«ëα«░α»üα«╡α«╛α«òα»ìα«òα»üα«òα«┐α«▒α«ñα»ü...", generate: "α«ëα«░α»üα«╡α«╛α«òα»ìα«òα»ü", examples: "α«Üα«┐α«▓ α«Äα«ƒα»üα«ñα»ìα«ñα»üα«òα»ìα«òα«╛α«ƒα»ìα«ƒα»ü α«òα»üα«▒α«┐α«¬α»ìα«¬α»üα«òα«│α»ì:",
    selectPrompt: "α«Æα«░α»ü α«òα»üα«▒α«┐α«¬α»ìα«¬α»ê α«ñα»çα«░α»ìα«╡α»ü α«Üα»åα«»α»ìα«ò", characterLimit: "α«Äα«┤α»üα«ñα»ìα«ñα»ü α«╡α«░α««α»ìα«¬α»ü α«àα«ƒα»êα«¿α»ìα«ñα«ñα»ü - α«ëα«░α»üα«╡α«╛α«òα»ìα«òα««α»ì α««α»üα«ƒα«òα»ìα«òα«¬α»ìα«¬α«ƒα»ìα«ƒα«ñα»ü", charactersRemaining: "α«Äα«┤α»üα«ñα»ìα«ñα»üα«òα»ìα«òα«│α»ì α««α»Çα«ñα««α»ì",
    shortcuts: "α«╡α«┐α«Üα»êα«¬α»ìα«¬α«▓α«òα»ê α«òα»üα«▒α»üα«òα»ìα«òα»üα«╡α«┤α«┐α«òα«│α»ì", openHelp: "α«ëα«ñα«╡α«┐ α«ñα«┐α«▒", closeHelp: "α«ëα«ñα«╡α«┐ α««α»éα«ƒα»ü", focusPrompt: "α«òα»üα«▒α«┐α«¬α»ìα«¬α«┐α«▓α»ì α«òα«╡α«⌐α««α»ì",
    generateStory: "α«òα«ñα»ê α«ëα«░α»üα«╡α«╛α«òα»ìα«òα»ü", publishStory: "α«òα«ñα»ê α«╡α»åα«│α«┐α«»α«┐α«ƒα»ü", close: "α««α»éα«ƒα»ü", freeLimitReached: "α«çα«▓α«╡α«Ü α«╡α«░α««α»ìα«¬α»ü α«àα«ƒα»êα«¿α»ìα«ñα«ñα»ü",
    freeLimitMessage: "3 α«çα«▓α«╡α«Ü α«òα«ñα»ê α«ëα«░α»üα«╡α«╛α«òα»ìα«òα«Öα»ìα«òα«│α»êα«»α»üα««α»ì α«¬α«»α«⌐α»ìα«¬α«ƒα»üα«ñα»ìα«ñα«┐α«╡α«┐α«ƒα»ìα«ƒα»Çα«░α»ìα«òα«│α»ì. α«ñα»èα«ƒα«░ α«ëα«│α»ìα«¿α»üα«┤α»êα«»α«╡α»üα««α»ì.", continueBrowsing: "α«ñα»èα«ƒα«░α»ìα«¿α»ìα«ñα»ü α«¬α«╛α«░α»ìα«╡α»êα«»α«┐α«ƒα«╡α»üα««α»ì", recentPrompts: "α«Üα««α»Çα«¬α«ñα»ìα«ñα«┐α«» α«òα»üα«▒α«┐α«¬α»ìα«¬α»üα«òα«│α»ì", usePrompt: "α«¬α«»α«⌐α»ìα«¬α«ƒα»üα«ñα»ìα«ñα»ü", delete: "α«¿α»Çα«òα»ìα«òα»ü", clearAll: "α«àα«⌐α»êα«ñα»ìα«ñα»êα«»α»üα««α»ì α«¿α»Çα«òα»ìα«òα»ü", noRecentPrompts: "α«Üα««α»Çα«¬α«ñα»ìα«ñα«┐α«» α«òα»üα«▒α«┐α«¬α»ìα«¬α»üα«òα«│α»ì α«çα«▓α»ìα«▓α»ê",
  },
  Telugu: {
    back: "α░╡α▒åα░¿α▒üα░òα░òα▒ü", freeAccess: "3 α░àα░¡α▒ìα░»α░░α▒ìα░Ñα░¿α░▓α░òα▒ü α░ëα░Üα░┐α░ñ α░¬α▒ìα░░α░╡α▒çα░╢α░é", login: "α░▓α░╛α░ùα░┐α░¿α▒ì", forMore: "α░Üα▒çα░╕α░┐ α░«α░░α░┐α░¿α▒ìα░¿α░┐ α░¬α▒èα░éα░ªα░éα░íα░┐!",
    perMonth: "α░¿α▒åα░▓α░òα▒ü", upgrade: "α░àα░¬α▒ìα░ùα▒ìα░░α▒çα░íα▒ì", monthlyRequests: "α░ê α░¿α▒åα░▓ α░àα░¡α▒ìα░»α░░α▒ìα░Ñα░¿α░▓α▒ü", totalPosts: "α░«α▒èα░ñα▒ìα░ñα░é α░¬α▒ïα░╕α▒ìα░ƒα▒üα░▓α▒ü",
    titleStart: "α░«α▒Ç α░åα░▓α▒ïα░Üα░¿α░▓α░¿α▒ü", titleAccent: "α░àα░ªα▒ìα░¡α▒üα░ñ α░òα░Ñα░▓α▒üα░ùα░╛ α░«α░╛α░░α▒ìα░Üα░éα░íα░┐!", length: "α░¬α▒èα░íα░╡α▒ü", language: "α░¡α░╛α░╖",
    short: "α░Üα░┐α░¿α▒ìα░¿α░ªα░┐", medium: "α░«α░ºα▒ìα░»α░╕α▒ìα░Ñα░é", long: "α░¬α▒èα░íα░╡α▒êα░¿α░ªα░┐", promptPlaceholder: "α░¬α▒ìα░░α░ñα░┐ α░ùα▒èα░¬α▒ìα░¬ α░òα░Ñ α░Æα░ò α░åα░▓α▒ïα░Üα░¿α░ñα▒ï α░«α▒èα░ªα░▓α░╡α▒üα░ñα▒üα░éα░ªα░┐. α░«α▒Çα░ªα░┐ α░Åα░«α░┐α░ƒα░┐?",
    keyboardTip: "α░òα▒Çα░¼α▒ïα░░α▒ìα░íα▒ì α░Üα░┐α░ƒα▒ìα░òα░╛:", press: "α░¿α▒èα░òα▒ìα░òα░éα░íα░┐", toGenerate: "α░░α▒éα░¬α▒èα░éα░ªα░┐α░éα░Üα░íα░╛α░¿α░┐α░òα░┐", alsoWorks: "α░òα▒éα░íα░╛ α░¬α░¿α░┐α░Üα▒çα░╕α▒ìα░ñα▒üα░éα░ªα░┐", forNewLine: "α░òα▒èα░ñα▒ìα░ñ α░▓α▒êα░¿α▒ì α░òα▒ïα░╕α░é",
    generating: "α░░α▒éα░¬α▒èα░éα░ªα░┐α░╕α▒ìα░ñα▒ïα░éα░ªα░┐...", generate: "α░░α▒éα░¬α▒èα░éα░ªα░┐α░éα░Üα▒ü", examples: "α░òα▒èα░¿α▒ìα░¿α░┐ α░ëα░ªα░╛α░╣α░░α░ú α░¬α▒ìα░░α░╛α░éα░¬α▒ìα░ƒα▒ìΓÇîα░▓α▒ü:",
    selectPrompt: "α░¬α▒ìα░░α░╛α░éα░¬α▒ìα░ƒα▒ì α░Äα░éα░Üα▒üα░òα▒ïα░éα░íα░┐", characterLimit: "α░àα░òα▒ìα░╖α░░ α░¬α░░α░┐α░«α░┐α░ñα░┐ α░Üα▒çα░░α░┐α░éα░ªα░┐ - α░░α▒éα░¬α▒èα░éα░ªα░┐α░éα░¬α▒ü α░¿α░┐α░▓α░┐α░¬α░┐α░╡α▒çα░»α░¼α░íα░┐α░éα░ªα░┐", charactersRemaining: "α░àα░òα▒ìα░╖α░░α░╛α░▓α▒ü α░«α░┐α░ùα░┐α░▓α░╛α░»α░┐",
    shortcuts: "α░òα▒Çα░¼α▒ïα░░α▒ìαñí α░╖α░╛α░░α▒ìα░ƒα▒ìΓÇîα░òα░ƒα▒ìΓÇîα░▓α▒ü", openHelp: "α░╕α░╣α░╛α░»α░é α░ñα▒åα░░α░╡α░éα░íα░┐", closeHelp: "α░╕α░╣α░╛α░»α░é α░«α▒éα░╕α░┐α░╡α▒çα░»α░éα░íα░┐", focusPrompt: "α░¬α▒ìα░░α░╛α░éα░¬α▒ìα░ƒα▒ìΓÇîα░¬α▒ê α░ªα▒âα░╖α▒ìα░ƒα░┐",
    generateStory: "α░òα░Ñ α░░α▒éα░¬α▒èα░éα░ªα░┐α░éα░Üα▒ü", publishStory: "α░òα░Ñ α░¬α▒ìα░░α░Üα▒üα░░α░┐α░éα░Üα▒ü", close: "α░«α▒éα░╕α░┐α░╡α▒çα░»α░┐", freeLimitReached: "α░ëα░Üα░┐α░ñ α░¬α░░α░┐α░«α░┐α░ñα░┐ α░Üα▒çα░░α░┐α░éα░ªα░┐",
    freeLimitMessage: "α░«α▒Çα░░α▒ü 3 α░ëα░Üα░┐α░ñ α░òα░Ñα░╛ α░░α▒éα░¬α▒èα░éα░ªα░┐α░éα░¬α▒üα░▓α░¿α▒ü α░ëα░¬α░»α▒ïα░ùα░┐α░éα░Üα░╛α░░α▒ü. α░òα▒èα░¿α░╕α░╛α░ùα░íα░╛α░¿α░┐α░òα░┐ α░▓α░╛α░ùα░┐α░¿α▒ì α░Üα▒çα░»α░éα░íα░┐.", continueBrowsing: "α░¼α▒ìα░░α▒îα░£α░┐α░éα░ùα▒ì α░òα▒èα░¿α░╕α░╛α░ùα░┐α░éα░Üα▒ü", recentPrompts: "α░çα░ƒα▒Çα░╡α░▓ α░¬α▒ìα░░α░╛α░éα░¬α▒ìα░ƒα▒ìΓÇîα░▓α▒ü", usePrompt: "α░ëα░¬α░»α▒ïα░ùα░┐α░éα░Üα▒ü", delete: "α░ñα▒èα░▓α░ùα░┐α░éα░Üα▒ü", clearAll: "α░àα░¿α▒ìα░¿α░┐α░éα░ƒα░┐α░¿α░┐ α░ñα▒èα░▓α░ùα░┐α░éα░Üα▒ü", noRecentPrompts: "α░çα░ƒα▒Çα░╡α░▓ α░¬α▒ìα░░α░╛αñéα░¬α▒ìα░ƒα▒ìΓÇîα░▓α▒ü α░▓α▒çα░╡α▒ü",
  },
  Marathi: {
    back: "αñ«αñ╛αñùαÑç", freeAccess: "3 αñ╡αñ┐αñ¿αñéαññαÑìαñ»αñ╛αñéαñ╕αñ╛αñáαÑÇ αñ«αÑïαñ½αññ αñ¬αÑìαñ░αñ╡αÑçαñ╢", login: "αñ▓αÑëαñù αñçαñ¿", forMore: "αñòαñ░αÑéαñ¿ αñàαñºαñ┐αñò αñ«αñ┐αñ│αñ╡αñ╛!",
    perMonth: "αñªαñ░ αñ«αñ╣αñ┐αñ¿αñ╛", upgrade: "αñàαñ¬αñùαÑìαñ░αÑçαñí", monthlyRequests: "αñ»αñ╛ αñ«αñ╣αñ┐αñ¿αÑìαñ»αñ╛αññαÑÇαñ▓ αñ╡αñ┐αñ¿αñéαññαÑìαñ»αñ╛", totalPosts: "αñÅαñòαÑéαñú αñ¬αÑïαñ╕αÑìαñƒ",
    titleStart: "αññαÑüαñ«αñÜαÑìαñ»αñ╛ αñòαñ▓αÑìαñ¬αñ¿αñ╛ αñ¼αñªαñ▓αñ╛", titleAccent: "αñàαñªαÑìαñ¡αÑüαññ αñòαñÑαñ╛αñéαñ«αñºαÑìαñ»αÑç!", length: "αñ▓αñ╛αñéαñ¼αÑÇ", language: "αñ¡αñ╛αñ╖αñ╛",
    short: "αñ▓αñ╣αñ╛αñ¿", medium: "αñ«αñºαÑìαñ»αñ«", long: "αñ▓αñ╛αñéαñ¼", promptPlaceholder: "αñ¬αÑìαñ░αññαÑìαñ»αÑçαñò αñ«αñ╣αñ╛αñ¿ αñòαñÑαñ╛ αñÅαñòαñ╛ αñòαñ▓αÑìαñ¬αñ¿αÑçαñ¬αñ╛αñ╕αÑéαñ¿ αñ╕αÑüαñ░αÑé αñ╣αÑïαññαÑç. αññαÑüαñ«αñÜαÑÇ αñòαñ▓αÑìαñ¬αñ¿αñ╛ αñòαñ╛αñ» αñåαñ╣αÑç?",
    keyboardTip: "αñòαÑÇαñ¼αÑïαñ░αÑìαñí αñ╕αÑéαñÜαñ¿αñ╛:", press: "αñªαñ╛αñ¼αñ╛", toGenerate: "αññαñ»αñ╛αñ░ αñòαñ░αñúαÑìαñ»αñ╛αñ╕αñ╛αñáαÑÇ", alsoWorks: "αñ╣αÑçαñ╣αÑÇ αñÜαñ╛αñ▓αññαÑç", forNewLine: "αñ¿αñ╡αÑÇαñ¿ αñôαñ│αÑÇαñ╕αñ╛αñáαÑÇ",
    generating: "αññαñ»αñ╛αñ░ αñ╣αÑïαññ αñåαñ╣αÑç...", generate: "αññαñ»αñ╛αñ░ αñòαñ░αñ╛", examples: "αñòαñ╛αñ╣αÑÇ αñëαñªαñ╛αñ╣αñ░αñú αñ¬αÑìαñ░αÑëαñ«αÑìαñ¬αÑìαñƒ:",
    selectPrompt: "αñ¬αÑìαñ░αÑëαñ«αÑìαñ¬αÑìαñƒ αñ¿αñ┐αñ╡αñíαñ╛", characterLimit: "αñàαñòαÑìαñ╖αñ░ αñ«αñ░αÑìαñ»αñ╛αñªαñ╛ αñ¬αÑéαñ░αÑìαñú - αñ¿αñ┐αñ░αÑìαñ«αñ┐αññαÑÇ αñ¼αñéαñª αñåαñ╣αÑç", charactersRemaining: "αñàαñòαÑìαñ╖αñ░αÑç αñ¼αñ╛αñòαÑÇ",
    shortcuts: "αñòαÑÇαñ¼αÑïαñ░αÑìαñí αñ╢αÑëαñ░αÑìαñƒαñòαñƒ", openHelp: "αñ«αñªαññ αñëαñÿαñíαñ╛", closeHelp: "αñ«αñªαññ αñ¼αñéαñª αñòαñ░αñ╛", focusPrompt: "αñ¬αÑìαñ░αÑëαñ«αÑìαñ¬αÑìαñƒαñ╡αñ░ αñ▓αñòαÑìαñ╖",
    generateStory: "αñòαñÑαñ╛ αññαñ»αñ╛αñ░ αñòαñ░αñ╛", publishStory: "αñòαñÑαñ╛ αñ¬αÑìαñ░αñòαñ╛αñ╢αñ┐αññ αñòαñ░αñ╛", close: "αñ¼αñéαñª αñòαñ░αñ╛", freeLimitReached: "αñ«αÑïαñ½αññ αñ«αñ░αÑìαñ»αñ╛αñªαñ╛ αñ¬αÑéαñ░αÑìαñú",
    freeLimitMessage: "αññαÑüαñ«αÑìαñ╣αÑÇ αñ╕αñ░αÑìαñ╡ 3 αñ«αÑïαñ½αññ αñòαñÑαñ╛ αñ¿αñ┐αñ░αÑìαñ«αñ┐αññαÑÇ αñ╡αñ╛αñ¬αñ░αñ▓αÑìαñ»αñ╛ αñåαñ╣αÑçαññ. αñ¬αÑüαñóαÑç αñ╕αÑüαñ░αÑé αñáαÑçαñ╡αñúαÑìαñ»αñ╛αñ╕αñ╛αñáαÑÇ αñ▓αÑëαñù αñçαñ¿ αñòαñ░αñ╛.", continueBrowsing: "αñ¼αÑìαñ░αñ╛αñëαñ¥αñ┐αñéαñù αñ╕αÑüαñ░αÑé αñáαÑçαñ╡αñ╛", recentPrompts: "αñàαñ▓αÑÇαñòαñíαÑÇαñ▓ αñ¬αÑìαñ░αÑëαñ«αÑìαñ¬αÑìαñƒ", usePrompt: "αñ╡αñ╛αñ¬αñ░αñ╛", delete: "αñ╣αñƒαñ╡αñ╛", clearAll: "αñ╕αñ░αÑìαñ╡ αñ«αñ┐αñ│αÑéαñ¿ αñƒαñ╛αñòαñ╛", noRecentPrompts: "αñàαñ▓αÑÇαñòαñíαÑÇαñ▓ αñ¬αÑìαñ░αÑëαñ«αÑìαñ¬αÑìαñƒ αñ¿αñ╛αñ╣αÑÇαññ",
  },
};

const LANGUAGE_STORAGE_KEY = "storySparkLanguage";

const TONES = [
  {
    label: "Dark",
    emoji: "≡ƒîæ",
    activeClass: "bg-gray-700 text-gray-100 border-gray-500 shadow-gray-700/40",
    inactiveClass: "bg-white/5 text-gray-400 border-transparent hover:bg-white/10 hover:text-gray-200",
  },
  {
    label: "Whimsical",
    emoji: "≡ƒîê",
    activeClass: "bg-sky-500/20 text-sky-300 border-sky-500/60 shadow-sky-500/20",
    inactiveClass: "bg-white/5 text-gray-400 border-transparent hover:bg-white/10 hover:text-gray-200",
  },
  {
    label: "Dramatic",
    emoji: "≡ƒÄ¼",
    activeClass: "bg-red-500/20 text-red-300 border-red-500/60 shadow-red-500/20",
    inactiveClass: "bg-white/5 text-gray-400 border-transparent hover:bg-white/10 hover:text-gray-200",
  },
  {
    label: "Humorous",
    emoji: "≡ƒÿä",
    activeClass: "bg-yellow-500/20 text-yellow-300 border-yellow-500/60 shadow-yellow-500/20",
    inactiveClass: "bg-white/5 text-gray-400 border-transparent hover:bg-white/10 hover:text-gray-200",
  },
  {
    label: "Suspenseful",
    emoji: "≡ƒÿ¿",
    activeClass: "bg-orange-500/20 text-orange-300 border-orange-500/60 shadow-orange-500/20",
    inactiveClass: "bg-white/5 text-gray-400 border-transparent hover:bg-white/10 hover:text-gray-200",
  },
  {
    label: "Heartwarming",
    emoji: "≡ƒÑ░",
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
      <span className="w-full text-xs text-gray-400 mb-1">≡ƒÄ¡ Tone:</span>
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
import AudioPlayer, { type AudioPlayerHandle, type NarrationPlaybackState } from "../AudioPlayer";
import { useLocation } from "react-router-dom";
import {
  useGenerateAlternateEndingsMutation,
  useGenerateFreeAlternateEndingsMutation,
} from "../../redux/apis/ai.model.api";
import ImageFallback from "../ImageFallback";
import GeneratedStoryTimeline from "./GeneratedStoryTimeline";
export interface IStories {
  uuid: string;
  title: string;
  content: string;
  tag: string;
  emotions?: string[];
  enhancedPrompt?: string;
  imageURL: string;
  language?: string;
  genre?: string;
}

interface IPost extends IStories {
  topic: ITopicData[];
}

interface StoriesComponentProps {
  stories: IStories[];
  isLogin: boolean;
  setStories: (stories: IStories[]) => void;
  onPublishSuccess?: () => void;
}

type StorySentenceSegment = {
  id: string;
  text: string;
  startWordIndex: number;
  endWordIndex: number;
};

const buildSentenceSegments = (content: string): StorySentenceSegment[] => {
  if (!content.trim()) {
    return [];
  }

  const sentenceMatches = content.match(/[^.!?]+[.!?]*\s*/g) ?? [content];
  const segments: StorySentenceSegment[] = [];
  let wordCursor = 0;

  sentenceMatches.forEach((sentence, index) => {
    const trimmedSentence = sentence.trim();
    if (!trimmedSentence) {
      return;
    }

    const wordsInSentence = sentence.match(/\S+/g)?.length ?? 0;
    const startWordIndex = wordCursor;
    const endWordIndex =
      wordsInSentence > 0 ? wordCursor + wordsInSentence - 1 : wordCursor;

    segments.push({
      id: `${index}-${startWordIndex}-${endWordIndex}`,
      text: sentence,
      startWordIndex,
      endWordIndex,
    });

    wordCursor += wordsInSentence;
  });
};

interface ICharacter {
  id: string;
  name: string;
  role: string;
  personality: string;
}

  return segments;
};

const StoriesViewComponent: React.FC<StoriesComponentProps> = ({
  stories,
  isLogin,
  setStories,
  isLoading,
  onPublishSuccess,
}) => {
  const location = useLocation();
  const audioPlayerRef = useRef<AudioPlayerHandle>(null);

  // Start with a clean state that adapts dynamically
  const [selectedStory, setSelectedStory] = useState<IStories | null>(null);
  const [topics, setTopics] = useState<ITopicData[]>(topicsData);
  const [selectTopics, setSelectTopics] = useState<ITopicData[]>([]);
  const [newTopicTitle, setNewTopicTitle] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const { data } = useGetProfileInfoQuery(undefined);
  const userRole = getUserInfo();
  const subscriptionType = (userRole?.subscriptionType as string) || "free";
  const login = isLoggedIn();
  const [generateModel] = useGenerateModelMutation();
  const [generateFreeModel] = useGenerateFreeModelMutation();
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchFilter, setSearchFilter] = useState<string>("all");

  const [selectedPrompt, setSelectedPrompt] = useState<string>("");
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState<string>(
  draft?.genre
    ? (GENRES.find((g) => g.name === draft.genre || g.value === draft.genre)?.value ?? "├░┼╕┬ºΓäó Fantasy")
    : "├░┼╕┬ºΓäó Fantasy",
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
      ? (GENRES.find((g) => g.name === draft.genre || g.value === draft.genre)?.value ?? "≡ƒºÖ Fantasy")
      : "≡ƒºÖ Fantasy"
  );
  const [selectedLength, setSelectedLength] = useState<string>(draft?.length || "medium");
  const [selectedTone, setSelectedTone] = useState<ToneLabel | "">(draft?.tone || "Dramatic");
  const [textareaValue, setTextareaValue] = useState<string>(location.state?.prompt || draft?.prompt || "");
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string>(draft?.language || "English");
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState<boolean>(false);
  const [draftStatus, setDraftStatus] = useState("");
  const DRAFT_KEY = "storyspark_story_draft_v1";

  // Custom characters cast setup states:
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [characters, setCharacters] = useState<ICharacter[]>([]);
  const [showOverwriteConfirm, setShowOverwriteConfirm] = useState<boolean>(false);

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
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [showWorldMap, setShowWorldMap] = useState<boolean>(false);
const [, setShowRemix] = useState<boolean>(false);
  const [createPost] = useCreatePostMutation();
  const [deletePost] = useDeletePostMutation();
  const { data: profile } = useGetProfileInfoQuery(undefined, { skip: !isLogin });
  const lastSavedContentRef = useRef<string>("");
  const isSavingRef = useRef<boolean>(false);
  const hasSavedSessionRef = useRef<boolean>(false);
  const savedPostIdRef = useRef<string | null>(null);
  // Alternate ending state & hooks
  const [endingsCache, setEndingsCache] = useState<{
    [uuid: string]: { style: string; ending: string; fullStory: string }[];
  }>({});
  const [originalStoryContent, setOriginalStoryContent] = useState<{
    [uuid: string]: string;
  }>({});
  const [isGeneratingEndings, setIsGeneratingEndings] = useState<boolean>(false);
  const [activeEndingTab, setActiveEndingTab] = useState<string>("Happy Ending");
  const [narrationWordIndex, setNarrationWordIndex] = useState<number>(0);
  const [narrationState, setNarrationState] = useState<NarrationPlaybackState>("idle");

  const [generateAlternateEndings] = useGenerateAlternateEndingsMutation();
  const [generateFreeAlternateEndings] = useGenerateFreeAlternateEndingsMutation();

  useEffect(() => {
    if (selectedStory && !originalStoryContent[selectedStory.uuid]) {
      setOriginalStoryContent((prev) => ({
        ...prev,
        [selectedStory.uuid]: selectedStory.content,
      }));
    }
  }, [selectedStory, originalStoryContent]);

  useEffect(() => {
    if (narrationState === "playing") {
      const activeWordElement = document.querySelector('[data-active-word="true"]');
      if (activeWordElement) {
        activeWordElement.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "nearest"
        });
      }
    }
  }, [narrationWordIndex, narrationState]);

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

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleGenerateAlternateEndings = async () => {
    if (!selectedStory) return;
    setIsGeneratingEndings(true);
    const toastId = toast.loading("Generating alternate endings...");
    try {
      const payload = {
        title: selectedStory.title,
        content: originalStoryContent[selectedStory.uuid] || selectedStory.content,
        tag: selectedStory.tag,

        language: selectedStory.language || "English",

      };
      
      const generationRequest = isLogin
        ? generateAlternateEndings(payload)
        : generateFreeAlternateEndings(payload);
        
      const res = await generationRequest.unwrap();
      if (res && res.data) {
        setEndingsCache((prev) => ({
          ...prev,
          [selectedStory.uuid]: res.data,
        }));
        toast.success("Alternate endings generated successfully!");
      } else {
        toast.error("Failed to generate alternate endings.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate alternate endings. Please try again.");
    } finally {
      toast.dismiss(toastId);
      setIsGeneratingEndings(false);
    }
  };

  const handleApplyEnding = (endingData: { style: string; ending: string; fullStory: string }) => {
    if (!selectedStory) return;
    const updatedStory = {
      ...selectedStory,
      content: endingData.fullStory,
    };
    setSelectedStory(updatedStory);
    setStories(
      stories.map((s) => (s.uuid === selectedStory.uuid ? updatedStory : s))
    );
    toast.success(`${endingData.style} applied to story!`);
  };

  const handleResetEnding = () => {
    if (!selectedStory) return;
    const originalContent = originalStoryContent[selectedStory.uuid];
    if (!originalContent) return;
    const updatedStory = {
      ...selectedStory,
      content: originalContent,
    };
    setSelectedStory(updatedStory);
    setStories(
      stories.map((s) => (s.uuid === selectedStory.uuid ? updatedStory : s))
    );
    toast.success("Reverted to original story ending!");
  };

  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [isPausedAudio, setIsPausedAudio] = useState<boolean>(false);

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
          toast.error("Couldn't autosave draft ΓÇö storage limit reached.");
        }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleTextToSpeech = () => {
    if (!selectedStory?.content) return;

    if (!("speechSynthesis" in window)) {
      toast.error("Text-to-speech is not supported in this browser.");
      return;
    }

    if (isPlayingAudio) {
      if (isPausedAudio) {
        window.speechSynthesis.resume();
        setIsPausedAudio(false);
        toast.success("Resumed reading story");
      } else {
        window.speechSynthesis.pause();
        setIsPausedAudio(true);
        toast.success("Paused reading story");
      }
    } else {
      window.speechSynthesis.cancel();
      const cleanContent = selectedStory.content.replace(/<[^>]*>/g, "");
      const utterance = new SpeechSynthesisUtterance(cleanContent);
      
      utterance.onend = () => {
        setIsPlayingAudio(false);
        setIsPausedAudio(false);
      };

      utterance.onerror = (e) => {
        console.error("SpeechSynthesis error:", e);
        setIsPlayingAudio(false);
        setIsPausedAudio(false);
      };

      const voices = window.speechSynthesis.getVoices();
      const englishVoice = voices.find(
        (v) => v.lang.startsWith("en-") && v.name.includes("Google")
      ) || voices.find((v) => v.lang.startsWith("en-"));
      if (englishVoice) {
        utterance.voice = englishVoice;
      }

      window.speechSynthesis.speak(utterance);
      setIsPlayingAudio(true);
      setIsPausedAudio(false);
      toast.success("Playing story audio");
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleStopAudio = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlayingAudio(false);
    setIsPausedAudio(false);
    toast.success("Stopped audio playback");
  };

  useEffect(() => {
    return () => {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  useEffect(() => {
    setSelectTopics(topics.filter((topic) => topic.selected));
  }, [topics]);

  const debouncedSearchQuery = useDebounce(searchQuery, 350);
  const debouncedPrompt = useDebounce(textareaValue, 500);

  const debouncedSearchQuery = useDebounce(searchQuery, 350);
  const debouncedPrompt = useDebounce(textareaValue, 500);

  useEffect(() => {
    setValue("prompt", debouncedPrompt);
  }, [debouncedPrompt, setValue]);
    setNarrationWordIndex(0);
    setNarrationState("idle");
  }, [selectedStory?.uuid]);

  const sentenceSegments = useMemo(() => {
    return buildSentenceSegments(selectedStory?.content ?? "");
  }, [selectedStory?.content]);

  // Sync state instantly whenever a new template is submitted or selected
  useEffect(() => {
    if (stories && stories.length > 0) {
      setSelectedStory(stories[0]);
    } else {
      setSelectedStory(null);
    }
    // Reset auto-save status for new story session
    lastSavedContentRef.current = "";
    hasSavedSessionRef.current = false;
    savedPostIdRef.current = null;
  }, [stories]);

  useEffect(() => {
    const autoSaveStory = async () => {
      // 1. Prevent guest auto-save requests
      if (!isLogin || !selectedStory) return;

      // 2. Prevent duplicate auto-save requests for unchanged story content
      if (selectedStory.content === lastSavedContentRef.current) {
        return;
      }

      // 3. Only one draft/post is created per story session (prevent variation/topic duplicates)
      if (hasSavedSessionRef.current) {
        return;
      }

      // 4. Prevent duplicate network calls while a save is already running
      if (isSavingRef.current) return;

      isSavingRef.current = true;

      const post: IPost = {
        ...selectedStory,
        topic: selectTopics,
      };

      try {
        const result = await createPost(post).unwrap();
        if (result && result.data && result.data._id) {
          savedPostIdRef.current = result.data._id;
        }
        lastSavedContentRef.current = selectedStory.content;
        hasSavedSessionRef.current = true;
        toast.success("Story auto-saved!");
      } catch (error) {
        console.error("Auto-save failed", error);
      } finally {
        isSavingRef.current = false;
      }
    };

    // Debounce to prevent multiple immediate renders/rerenders from triggering save
    const timer = setTimeout(() => {
      autoSaveStory();
    }, 1000);

    return () => clearTimeout(timer);
  }, [selectedStory, selectedStory?.content, isLogin, selectTopics, createPost]);

  const handelStorySelection = (story: IStories) => {
    setSelectedStory(story);
  };

  const handleTopicClick = (index: number) => {
    setTopics((currentTopics) =>
      currentTopics.map((topic, topicIndex) =>
        topicIndex === index
          ? { ...topic, selected: !topic.selected }
          : topic
      )
    );
  };
  const handleAddTopic = () => {
    const title = newTopicTitle.trim();

  const [generateModel] = useGenerateModelMutation();
  const [generateFreeModel] = useGenerateFreeModelMutation();
  const { data } = useGetProfileInfoQuery(undefined);
  const userRole = getUserInfo();
  const login = isLoggedIn();

  const [generateModel] = useGenerateModelMutation();
  const [generateFreeModel] = useGenerateFreeModelMutation();
  const { data } = useGetProfileInfoQuery(undefined);
  const userRole = getUserInfo();
  const login = isLoggedIn();

  const handleGenerateClick = useCallback(() => {
    if (loading || isOverLimit || !textareaValue.trim()) return;
    if (stories && stories.length > 0) {
      setShowOverwriteConfirm(true);
      return;
    }
    const form = inputRef.current?.closest("form");
    if (form) form.requestSubmit();
  }, [loading, isOverLimit, textareaValue, stories]);

  const handleConfirmOverwrite = useCallback(() => {
    setShowOverwriteConfirm(false);
    const form = inputRef.current?.closest("form");
    if (form) form.requestSubmit();
  }, []);

  const handleCancelOverwrite = useCallback(() => {
    setShowOverwriteConfirm(false);
  }, []);

  const onSubmit: SubmitHandler<Inputs> = useCallback(async (data) => {
    if (isGenerationInProgressRef.current) {
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

    if (getWordCount(data.prompt) < 10) {
      toast.error("Please enter a prompt with at least 10 words to generate a story.");
      toast.error(
        "Please enter a prompt with at least 10 words to generate a story."
      );
      return;
    }
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

    try {
      timeoutId = setTimeout(() => {
        if (isGenerationInProgressRef.current) {
          toast.error("Story generation timed out. Please try again.");
          handleCancelGeneration(true);
        }
      }, 60000);
      // Header Divider Line
      doc.setDrawColor(99, 102, 241); // Brand Indigo
      doc.setLineWidth(0.5);
      doc.line(leftMargin, yCursor, 190, yCursor);

      yCursor += 8;

      const payload = {
        prompt: selectedGenre ? `[Genre: ${selectedGenre}] ${data.prompt}` : data.prompt,
        wordLength: selectedLength === "short" ? 175 : selectedLength === "long" ? 800 : 450,
        prompt: selectedGenre
          ? `[Genre: ${selectedGenre}] ${data.prompt}`
          : data.prompt,
        wordLength:
          selectedLength === "short"
            ? 175
            : selectedLength === "long"
            ? 800
            : 450,
        language: selectedLanguage,
        tone: selectedTone || undefined,
        characters: characters.map(({ name, role, personality }) => ({ name, role, personality })),
      };

      const generationRequest = login ? generateModel(payload) : generateFreeModel(payload);
      const generationRequest = login
        ? generateModel(payload)
        : generateFreeModel(payload);
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

  const isOverLimit = textareaValue.length >= MAX_PROMPT_LENGTH;
  const isDangerLimit = textareaValue.length >= MAX_PROMPT_LENGTH * DANGER_THRESHOLD;
  const isNearLimit = textareaValue.length >= MAX_PROMPT_LENGTH * WARN_THRESHOLD && !isDangerLimit;

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

  const generateId = () => Math.random().toString(36).substring(2, 9);
      }

      // Save PDF with sanitized name
      const safeTitle = title.replace(/[^a-z0-9]/gi, "_").toLowerCase();
      doc.save(`${safeTitle}.pdf`);
      toast.dismiss(toastId);
      toast.success("Premium PDF downloaded!");
    } catch (error) {
      console.error(error);
      toast.dismiss(toastId);
      toast.error("Failed to export PDF.");
    }
  };

  const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

const getSafeFileName = (title: string, ext: string) => {
  const cleanTitle = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  return `${cleanTitle || "story"}.${ext}`;
};

const handleExportMarkdown = () => {
    if (!selectedStory) { toast.error("No story available to export."); return; }
    if (!selectedStory.content?.trim()) {toast.error("Story content is empty. Cannot export.");return;}
    try {
      const title = selectedStory.title || "Story";
      const content = selectedStory.content || "";
      const tag = selectedStory.tag || "General";
      const authorName = isLogin && profile?.name ? profile.name : "Anonymous";
      const isoDate = new Date().toISOString().split("T")[0];
      const markdownContent = `---\ntitle: "${title.replace(/"/g, '\\"')}"\ntag: "${tag.replace(/"/g, '\\"')}"\nauthor: "${authorName.replace(/"/g, '\\"')}"\ndate: "${isoDate}"\n---\n\n# ${title}\n\n${content}\n`;
      const blob = new Blob([markdownContent], { type: "text/markdown;charset=utf-8;" });
      downloadBlob(blob, getSafeFileName(title, "md"));
      toast.success("Markdown downloaded!");
    } catch (error) { console.error(error); toast.error("Failed to export Markdown."); }
  };

  const handelPublishStory = async () => {
    if (!isLogin) {
      toast.error("Please login to publish the story.");
      return;
    }
    if (!selectedStory) {
      toast.error("No story available. Please generate a story first.");
      return;
    }
    if (selectTopics.length < 2) {
      toast.error("Please select at least 2 topics.");
      return;
    }
    const post: IPost = {
      ...selectedStory,
      topic: selectTopics,
    };
    setLoading(true);
    try {
      if (savedPostIdRef.current) {
        try {
          await deletePost(savedPostIdRef.current).unwrap();
        } catch (deleteError) {
          console.warn("Failed to delete auto-saved draft before publishing:", deleteError);
        }
      }
      const result = await createPost(post).unwrap();
      if (result) {
        toast.success("Story published successfully!");
        setStories([]);
        setSelectedStory(null);
        onPublishSuccess?.();
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const calculateReadingTime = (content: string): number => {
    const words = getWordCount(content);
    return Math.max(1, Math.ceil(words / 200));
  };

  const isNarrationActive = narrationState !== "idle";


  const uniqueStories = useMemo(() => getUniqueStories(stories), [stories]);

  const uniqueStories = useMemo(() => getUniqueStories(stories), [stories]);

  const filteredStories = useMemo(() => {
    if (!debouncedSearchQuery.trim()) return uniqueStories;
    const query = debouncedSearchQuery.toLowerCase();
    
    return uniqueStories.filter((story) => {
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
  }, [uniqueStories, debouncedSearchQuery, searchFilter]);

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

if (isLoading) {
  return (
    <div className="bg-gradient-to-br animate-gradient-slow min-h-screen relative overflow-x-hidden">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-6 flex flex-col md:flex-row items-center md:items-start justify-between gap-4">
          <div className="pt-2 w-full md:w-auto flex justify-start">
            <Link to="/">
              <div className="!rounded-button bg-gradient-to-r from-white/20 to-white/10 hover:from-white/30 hover:to-white/20 text-gray-300 px-3 py-2 flex items-center gap-2 transition-all duration-300 rounded whitespace-nowrap">
                <i className="fa-solid fa-left-long"></i> BACK
              </div>
            </Link>
          </div>

          {!login && (
            <div className="pt-2 text-center">
              <div className="!rounded-button bg-gradient-to-r from-white/20 to-white/10 text-gray-400 px-3 py-2 flex items-center gap-2 transition-all duration-300 rounded text-sm whitespace-normal md:whitespace-nowrap leading-relaxed">
                <span>
                  Free access for 3 requests ΓÇö <Link to="/login"><span className="text-indigo-400 underline font-semibold">Login</span></Link> for more!
    <div className="flex items-center justify-center py-20">
      <StoryGeneratingAnimation />
    </div>
  );
}
  if (!selectedStory) {
    return null;
  }

  return (
    <div className="mt-16 px-4 sm:px-6 lg:px-8 max-w-8xl mx-auto pb-10">
      <style>
        {`
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in-up {
            animation: fadeInUp 0.6s ease-out forwards;
          }
        `}
      </style>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in-up">
        <div className="col-span-1 lg:col-span-8 flex flex-col">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <div>
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-blue-400 mb-2">
                {selectedStory?.title}
              </h1>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center rounded-full bg-purple-900/60 text-purple-300 border border-purple-700/50 py-1 px-3 text-xs font-semibold">
                  ╬ô├½├¡Γò₧├åΓö£├ñΓö¼├¡ {selectedStory.tag}
                </span>
                <span className="inline-flex items-center rounded-full bg-blue-900/60 text-blue-300 border border-blue-700/50 py-1 px-3 text-xs font-semibold">
                  ╬ô├½├¡Γò₧├åΓö£┬½Γö£├½ {selectedStory.language || "English"}
                </span>
                {selectedStory.emotions && selectedStory.emotions.length > 0 && (
                  <span className="inline-flex items-center rounded-full bg-emerald-900/60 text-emerald-300 border border-emerald-700/50 py-1 px-3 text-xs font-semibold">
                    ╬ô├½├¡Γò₧├åΓö£ΓöÉΓö£┬┐ {selectedStory.emotions.join(", ")}
                  </span>
                )}
              </div>
            </div>
          )}

          <div className="flex flex-col items-center md:items-end pt-2 w-full md:w-auto">
            <button className="!rounded-button bg-gradient-to-r from-white/20 to-white/10 hover:from-white/30 hover:to-white/20 text-gray-300 px-3 py-2 flex items-center gap-2 transition-all duration-300 rounded whitespace-nowrap">
              <span>
                <span className="text-gray-400 text-xs mr-1">Per Month</span>
                {getRequestLimit(subscriptionType)}
              </span>
              <Link to="/pricing" className="border-1 border-white/20 pl-2 text-gray-300">
               Upgrade
              </Link>
              
              <i className="fas fa-bolt text-yellow-400"></i>
            </button>
            <div className="mt-3 text-gray-500 text-xs text-center md:text-right">
              <span>
                This month request:{" "}
                {login ? (data?.requestsThisMonth ?? 0) : guestRequestCount}
              </span>
              <br />
              <span>Total posts: {login ? (data?.postsCount ?? 0) : 0}</span>
            <div className="flex justify-start sm:justify-end">
              <div className="flex -space-x-5">
                {stories && stories.length > 0 && (
                  stories.map((story) => (
                    <button
                      key={story.uuid}
                      className={`relative w-16 h-16 rounded-full border-2 ${
                        selectedStory?.uuid === story.uuid
                          ? "border-blue-500 scale-110"
                          : "border-white"
                      } hover:scale-110 transition-transform duration-200 focus:outline-none`}
                      onClick={() => handelStorySelection(story)}
                    >
                      <img
                        src={story.imageURL}
                        alt={story.title}
                        className="w-full h-full object-cover rounded-full"
                      />
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>

        <div className="mb-12 max-w-3xl mx-auto text-center select-none mt-11">
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            Γ£¿ {text.titleStart}{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
              {text.titleAccent}
            </span>{" "}
            Γ£¿
          </h1>
        </div>
          <div className="bg-slate-800/80 backdrop-blur-xl border border-slate-700/50 p-8 rounded-2xl shadow-2xl relative overflow-hidden">
            <div className="absolute top-[-50px] right-[-50px] w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-[-50px] left-[-50px] w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <h3 className="text-xl font-bold text-slate-200 relative z-10">
                Generated Story
              </h3>
              <div className="flex flex-wrap items-center gap-2 relative z-10">
                <button
                  type="button"
                  className="rounded-lg px-4 py-2 bg-slate-700 text-slate-200 font-semibold cursor-pointer hover:bg-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleCopyStory}
                  disabled={!selectedStory}
                >
                  {isCopied ? "╬ô┬ú├┤ Copied" : "Γëí╞Æ├┤├» Copy"}
                </button>
                <button
                  type="button"
                  className="rounded-lg px-4 py-2 bg-purple-700 text-slate-200 font-semibold cursor-pointer hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleExportPDF}
                  disabled={!selectedStory}
                >
                  Γëí╞Æ├┤├ñ Export PDF
                </button>
                <button
                  type="button"
                  className="rounded-lg px-4 py-2 bg-indigo-700 text-slate-200 font-semibold cursor-pointer hover:bg-indigo-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleExportMarkdown}
                  disabled={!selectedStory}
                >
                  ╬ô┬╝├ºΓê⌐Γòò├à Export as Markdown
                </button>
                <button
                  type="button"
                  className="rounded-lg px-4 py-2 bg-violet-700 text-slate-200 font-semibold cursor-pointer hover:bg-violet-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => setShowWorldMap(true)}
                  disabled={!selectedStory}
                >
                  ╬ô├½├¡Γò₧├åΓö£Γòú╬ô├▓├ª╬ô├¬ΓîÉ╬ô├▓├▓Γö£├á World Map
                </button>
                <button
                  type="button"
                  className="rounded-lg px-4 py-2 bg-fuchsia-700 text-slate-200 font-semibold cursor-pointer hover:bg-fuchsia-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => setShowRemix(true)}
                  disabled={!selectedStory}
                >
                  ╬ô├½├¡Γò₧├åΓö£ΓòóΓö£├º Remix
                </button>
                <button
                  type="button"
                  id="publish-story-btn"
                  className={`rounded-lg px-5 py-2 font-semibold flex items-center space-x-2 cursor-pointer bg-blue-600 text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                    loading ? "" : "hover:bg-blue-500 hover:shadow-lg active:scale-95"
                  }`}
                  onClick={handelPublishStory}
                  disabled={loading || !selectedStory}
                >
                  {loading ? "Publishing..." : "Publish"}
                </button>
              </div>
            </div>

            {selectedStory.enhancedPrompt && (
              <div className="mb-6 p-4 bg-indigo-900/30 border border-indigo-700/50 rounded-xl relative z-10">
                <h4 className="text-sm font-semibold text-indigo-300 mb-2 flex items-center gap-2">
                  <i className="fas fa-wand-magic-sparkles"></i> AI Enhanced Prompt
                </h4>
                <p className="text-slate-300 text-sm italic break-words whitespace-pre-wrap">
                  {selectedStory.enhancedPrompt}
                </p>
              </div>
            )}

            <div id="story-content" className="prose prose-invert max-w-none text-slate-300 leading-relaxed tracking-wide relative z-10">
              <p className="break-words whitespace-pre-wrap">
                {sentenceSegments.length > 0 ? (
                  sentenceSegments.map((segment: StorySentenceSegment) => {
                    const isActiveSentence =
                      isNarrationActive &&
                      narrationWordIndex >= segment.startWordIndex &&
                      narrationWordIndex <= segment.endWordIndex;

                    const rawParts = segment.text.split(/(\s+)/);
                    let wordOffset = 0;

                    return (
                      <span
                        key={segment.id}
                        className={isActiveSentence ? "text-slate-100 font-medium transition-colors duration-300" : undefined}
                      >
                        {rawParts.map((part, partIdx) => {
                          if (part === "") return null;
                          if (/^\s+$/.test(part)) {
                            return part;
                          }

                          const absoluteWordIndex = segment.startWordIndex + wordOffset;
                          wordOffset++;

                          const isActiveWord = isNarrationActive && narrationWordIndex === absoluteWordIndex;

                          if (isActiveWord) {
                            return (
                              <span
                                key={partIdx}
                                className="bg-indigo-500/30 text-indigo-300 rounded px-1 transition-all duration-150 active-narrated-word"
                                data-active-word="true"
                              >
                                {part}
                              </span>
                            );
                          }

                          return (
                            <span key={partIdx}>
                              {part}
                            </span>
                          );
                        })}
                      </span>
                    );
                  })
                ) : (
                  (() => {
                    const rawParts = selectedStory.content.split(/(\s+)/);
                    let wordOffset = 0;
                    return rawParts.map((part, partIdx) => {
                      if (part === "") return null;
                      if (/^\s+$/.test(part)) {
                        return part;
                      }

                      const absoluteWordIndex = wordOffset;
                      wordOffset++;

                      const isActiveWord = isNarrationActive && narrationWordIndex === absoluteWordIndex;

                      if (isActiveWord) {
                        return (
                          <span
                            key={partIdx}
                            className="bg-indigo-500/30 text-indigo-300 rounded px-1 transition-all duration-150 active-narrated-word"
                            data-active-word="true"
                          >
                            {part}
                          </span>
                        );
                      }

                      return (
                        <span key={partIdx}>
                          {part}
                        </span>
                      );
                    });
                  })()
                )}
              </p>
            </div>

                    <div className="flex items-center gap-2" ref={languageDropdownRef}>
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mr-1">≡ƒîÉ {text.language}:</span>
                      <div className="relative">
            <div className="relative z-10 mt-6">
              <AudioPlayer
                ref={audioPlayerRef}
                text={selectedStory.content}
                title={selectedStory.title}
                onWordIndexChange={setNarrationWordIndex}
                onPlaybackStateChange={setNarrationState}
              />
            </div>
          </div>
          <div className="mt-7">
            <div className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-xl p-6 mb-8">
              <h3 className="text-lg font-bold text-slate-200 mb-4">
                Select Topics
              </h3>
              <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <input
                  type="text"
                  value={newTopicTitle}
                  onChange={(event) => setNewTopicTitle(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      handleAddTopic();
                    }
                  }}
                  placeholder="Add related topic"
                  className="flex-1 rounded-lg border border-slate-600 bg-slate-900/70 px-4 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                />
                <button
                  type="button"
                  className="rounded-lg px-4 py-2 bg-blue-600 text-white font-semibold cursor-pointer hover:bg-blue-500 transition-colors"
                  onClick={handleAddTopic}
                >
                  Add Topic
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedStory ? (
                  <>
                    {topics.map((topic, index) => (
                      <span
                        key={index}
                        className={`inline-flex items-center gap-2 px-4 py-1.5 ${topic.className} rounded-full text-sm font-medium transition-transform hover:scale-105 shadow-sm`}
                      >
                        <button
                          type="button"
                          className="cursor-pointer"
                          onClick={() => handleTopicClick(index)}
                        >
                          <span>{LANGUAGES.find(l => l.name === selectedLanguage)?.name || "English"}</span>
                          <span className="text-slate-400 dark:text-slate-500 text-[9px]">Γû╝</span>
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

                  <div className="relative border border-slate-200/80 dark:border-white/10 bg-slate-50/50 dark:bg-slate-950/30 rounded-2xl p-4 transition-all focus-within:border-blue-500/30 focus-within:bg-white dark:focus-within:bg-[#111827]/20 w-full box-border">
                    <textarea
                      {...register("prompt")}
                      ref={(el) => {
                        register("prompt").ref(el);
                        inputRef.current = el;
                      }}
                      className={`w-full h-32 sm:h-40 resize-none border-none outline-none bg-transparent text-slate-800 dark:text-slate-200 focus:ring-0 text-sm sm:text-base leading-relaxed placeholder:italic placeholder:text-slate-400 dark:placeholder:text-slate-500 pr-12 transition-colors duration-200 ${
                        isOverLimit || isDangerLimit ? "ring-1 ring-red-500 rounded-lg p-2" : isNearLimit ? "ring-1 ring-yellow-400 rounded-lg p-2" : ""
                      }`}
                      placeholder={text.promptPlaceholder}
                      value={textareaValue}
                      maxLength={MAX_PROMPT_LENGTH}
                      onChange={(e) => setTextareaValue(e.target.value)}
onKeyDown={(e) => {
                        // Keep existing behavior: Enter -> next step (unless Shift is held)
                        if (e.key === "Enter" && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
                          e.preventDefault();
                          handleNextStep();
                          return;
                        }

                        // Ctrl/Cmd + Enter -> generate story (only when prompt editor is focused)
                        const isMac =
                          typeof navigator !== "undefined" &&
                          navigator.platform.toUpperCase().includes("MAC");
                        const shouldTrigger = isMac ? e.metaKey : e.ctrlKey;

                        if (
                          e.key === "Enter" &&
                          shouldTrigger &&
                          !e.shiftKey &&
                          !loading &&
                          !isOverLimit &&
                          textareaValue.trim().length > 0
                        ) {
                          e.preventDefault();

                          // Prevent duplicate requests while generation is already in progress
                          if (isGenerationInProgressRef.current) return;

                          handleGenerateClick();
                        }
                      }}
                    />

                    <div className="absolute right-3.5 top-3.5 flex flex-col gap-2.5">
                      {textareaValue.length > 0 && (
                          {topic.selected ? (
                            <i className="fa-solid fa-check"></i>
                          ) : (
                            <i className="fa-solid fa-plus"></i>
                          )}{" "}
                          {topic.title}
                        </button>
                        <button
                          type="button"
                          className="cursor-pointer border-l border-current/30 pl-2 disabled:cursor-not-allowed disabled:opacity-40"
                          onClick={() => handleRemoveTopic(index)}
                          disabled={topics.length <= 2}
                          aria-label={`Remove ${topic.title}`}
                        >
                          <i className="fa-solid fa-xmark"></i>
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
                            <span>ΓÜá</span> {text.characterLimit}
                          </p>
                        ) : isNearLimit ? (
                          <p className="text-[11px] font-semibold text-amber-500 dark:text-amber-400 flex items-center gap-1 truncate m-0">
                            <span>ΓÜá</span> {MAX_PROMPT_LENGTH - textareaValue.length} {text.charactersRemaining}
                          </p>
                        ) : null}
                      </div>

                      <span className={`text-[11px] font-bold tabular-nums shrink-0 ml-auto ${
                        isOverLimit || isDangerLimit ? "text-red-500 dark:text-red-400" : isNearLimit ? "text-amber-500" : "text-slate-400"
                      }`}>
                        {textareaValue.length} / {MAX_PROMPT_LENGTH}

                      </span>
                    </div>
                  </div>

                  <div className="text-[11px] font-medium leading-relaxed text-slate-400 dark:text-slate-500 select-none w-full box-border">
                    ≡ƒÆí <span className="font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mr-1">{text.keyboardTip}</span>
                    {text.press} <kbd className="px-1.5 py-0.5 text-[10px] font-bold bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/10 rounded-md text-slate-700 dark:text-slate-300 mx-0.5 shadow-sm">Enter</kbd> to continue &bull;{" "}
                    Press <kbd className="px-1.5 py-0.5 text-[10px] font-bold bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/10 rounded-md text-slate-700 dark:text-slate-300 mx-0.5 shadow-sm">{typeof navigator !== "undefined" && navigator.platform.toUpperCase().includes("MAC") ? "Cmd" : "Ctrl"} + Enter</kbd> to generate &bull;{" "}
                    <kbd className="px-1.5 py-0.5 text-[10px] font-bold bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/10 rounded-md text-slate-700 dark:text-slate-300 mx-0.5 shadow-sm">Shift + Enter</kbd> {text.forNewLine}
                  </div>


                  <div className="flex justify-end pt-2 w-full box-border">
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-bold py-3 px-6 rounded-xl shadow-md shadow-blue-500/10 transition-all duration-150 active:scale-[0.98] select-none uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Next: Cast of Characters Γ₧í∩╕Å</span>
                    </button>
            {/* Alternate Endings Section */}
            {selectedStory && (
              <div className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-xl p-6 mt-8 relative overflow-hidden">
                <div className="absolute top-[-50px] right-[-50px] w-48 h-48 bg-purple-500/5 rounded-full blur-3xl pointer-events-none"></div>
                
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-slate-200 flex items-center gap-2">
                      Alternate Endings
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Explore alternate narrative styles for your story context.
                    </p>
                  </div>
                  {selectedStory.content !== originalStoryContent[selectedStory.uuid] && (
                    <button
                      type="button"
                      onClick={handleResetEnding}
                      className="rounded-lg px-4 py-2 bg-red-950/40 hover:bg-red-900/60 text-red-200 border border-red-700/50 font-semibold text-sm transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
                    >
                      <i className="fa-solid fa-rotate-left"></i> Reset to Original
                    </button>
                  )}
                </div>

                  <div className="space-y-2 select-none">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Cast of Characters</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      Define custom characters to ensure Gemini maintains character roles, personality traits, and dynamic relationships consistently throughout the story.
                    </p>
                  </div>


                      <span
  className={`text-xs tabular-nums ml-auto flex gap-2 ${
    isOverLimit || isDangerLimit
      ? "text-red-400 font-medium"
      : isNearLimit
      ? "text-yellow-400"
      : "text-gray-500"
  }`}
>
  <span>
    {textareaValue.trim() === "" ? 0 : textareaValue.trim().split(/\s+/).length} words
  </span>
  <span className="opacity-40">┬╖</span>
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
                              ≡ƒæñ Character #{index + 1}
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

                  <div className="space-y-4">
                    {characters.map((char, index) => (
                      <div
                        key={char.id}
                        className="p-4 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 rounded-2xl space-y-4 relative"
                      >
                        <div className="flex items-center justify-between select-none">
                          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            ≡ƒæñ Character #{index + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveCharacter(char.id)}
                            className="text-xs font-bold text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 hover:underline cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>

    <div className="flex flex-wrap items-center gap-2 mb-3">
      <span className="text-xs text-gray-400 mr-1">≡ƒôÅ Length:</span>

      {lengths.map((length) => (

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
                  </div>

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
                {isGeneratingEndings ? (
                  <div className="flex flex-col items-center justify-center py-10">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500 mb-4"></div>
                    <p className="text-slate-300 text-sm font-medium animate-pulse">
                      Generating alternate endings...
                    </p>
                  </div>
                ) : endingsCache[selectedStory.uuid]?.length > 0 ? (
                  <div>
                    {/* Tabs */}
                    <div className="flex border-b border-slate-700/50 mb-6 overflow-x-auto whitespace-nowrap scrollbar-none">
                      {[
                        { name: "Happy Ending" },
                        { name: "Dark Ending" },
                        { name: "Plot Twist Ending" },
                        { name: "Open Ending" },
                        { name: "Cliffhanger Ending" }
                      ].map((s) => {
                        const hasEndings = endingsCache[selectedStory.uuid] || [];
                        const endingData = hasEndings.find((e) => e.style === s.name);
                        const isApplied = endingData && selectedStory.content === endingData.fullStory;
                        
                        return (
                          <button
                            key={s.name}
                            type="button"
                            onClick={() => setActiveEndingTab(s.name)}
                            className={`px-5 py-3 font-semibold text-sm flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
                              activeEndingTab === s.name
                                ? "border-purple-500 text-purple-400 bg-purple-500/5"
                                : "border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-700"
                            }`}
                          >
                            <span>{s.name}</span>
                            {isApplied && (
                              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-ping"></span>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Tab content */}
                    {(() => {
                      const currentEndings = endingsCache[selectedStory.uuid] || [];
                      const currentEndingData = currentEndings.find((e) => e.style === activeEndingTab);
                      if (!currentEndingData) return null;
                      
                      const isCurrentlyApplied = selectedStory.content === currentEndingData.fullStory;
                      
                      return (
                        <div className="bg-slate-900/40 rounded-xl p-6 border border-slate-700/30">
                          <div className="flex justify-between items-center mb-4">
                            <h4 className="text-lg font-bold text-slate-200">
                              {activeEndingTab} Suggestion
                            </h4>
                            <div>
                              {isCurrentlyApplied ? (
                                <span className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-full font-semibold flex items-center gap-1.5">
                                  <i className="fa-solid fa-check"></i> Applied to Story
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleApplyEnding(currentEndingData)}
                                  className="rounded-lg px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-bold text-sm transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-md hover:shadow-purple-500/20"
                                >
                                  Apply to Story
                                </button>
                              )}
                            </div>
                          </div>
                          
                          <div className="space-y-4">
                            <div className="bg-slate-950/60 p-5 rounded-xl border border-slate-800 leading-relaxed text-slate-300 text-sm md:text-base italic shadow-inner whitespace-pre-wrap">
                              <p>{currentEndingData.ending}</p>
                            </div>
                            
                            <div>
                              <details className="group border border-slate-800 rounded-lg overflow-hidden bg-slate-950/20">
                                <summary className="list-none flex items-center justify-between p-3 text-xs font-bold text-slate-400 hover:text-slate-200 cursor-pointer select-none">
                                  <span>PREVIEW FULL STORY WITH THIS ENDING</span>
                                  <span className="transition-transform duration-200 group-open:rotate-180">╬ô├╗Γò¥</span>
                                </summary>
                                <div className="p-4 border-t border-slate-800/80 text-xs text-slate-400 leading-relaxed max-h-56 overflow-y-auto whitespace-pre-wrap">
                                  {currentEndingData.fullStory}
                                </div>
                              </details>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 bg-slate-900/20 border border-dashed border-slate-700/40 rounded-xl">
                    <button
                      type="button"
                      onClick={handleGenerateAlternateEndings}
                      className="rounded-xl px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/30 flex items-center gap-2 cursor-pointer"
                    >
                      Generate Alternate Endings
                    </button>
                    <p className="text-xs text-slate-400 mt-3 text-center max-w-sm px-4 leading-relaxed">
                      Uses the story context to produce 5 unique ending variations (Happy, Dark, Plot Twist, Open, Cliffhanger) for comparison.
                    </p>
                  </div>

                  <span className={`text-[11px] font-bold tabular-nums shrink-0 ml-auto ${
                    isOverLimit || isDangerLimit ? "text-red-500 dark:text-red-400" : isNearLimit ? "text-amber-500" : "text-slate-400"
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
      ≡ƒôä A previously saved draft was found. Restore it?
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
          isOverLimit || isDangerLimit
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
          if (validationError) {
            setValidationError("");
          }
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleGenerateClick();
          }
        }}
        />


      <div className="flex items-center justify-between mt-1 px-1">
        {validationError ? (
          <p className="text-xs text-red-400 flex items-center gap-1">
            <span>ΓÜá</span> {validationError}
          </p>
        ) : isOverLimit ? (
          <p className="text-xs text-red-400 flex items-center gap-1">
            <span>ΓÜá</span> Character limit reached ΓÇö generate is disabled
          </p>
        ) : isNearLimit ? (
          <p className="text-xs text-yellow-400 flex items-center gap-1">
            <span>ΓÜá</span>{" "}
            {MAX_PROMPT_LENGTH - textareaValue.length} characters remaining
          </p>
        ) : (
          <span />
        )}

        <span
          className={`text-xs tabular-nums ml-auto ${
            isOverLimit || isDangerLimit
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
    ≡ƒÆ╛ {draftStatus}
   </p>
)}
    
    <p className="text-xs text-gray-500 mt-1 px-1">
      ≡ƒÆí  <span className="font-medium">Keyboard tip:</span> Press{" "}
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
        disabled={isGenerateDisabled}
        disabled={loading || isOverLimit}
        className={`w-full sm:w-auto justify-center rounded-lg bg-gradient-to-r from-blue-400 to-indigo-500 text-gray-200 px-6 py-3 font-semibold ${
        aria-busy={loading}
        aria-disabled={loading || isOverLimit}
        onClick={handleGenerateClick}
        aria-disabled={isGenerateDisabled}
        className={`rounded-lg bg-gradient-to-r from-blue-400 to-indigo-500 text-gray-200 px-6 py-3 font-semibold ${
          isGenerateDisabled
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
                ≡ƒÆí <span className="font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mr-1">{text.keyboardTip}</span>
                {text.press} <kbd className="px-1.5 py-0.5 text-[10px] font-bold bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/10 rounded-md text-slate-700 dark:text-slate-300 mx-0.5 shadow-sm">Enter</kbd> {text.toGenerate} &bull;{" "}
                <kbd className="px-1.5 py-0.5 text-[10px] font-bold bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/10 rounded-md text-slate-700 dark:text-slate-300 mx-0.5 shadow-sm">Ctrl + Enter</kbd> {text.alsoWorks} &bull;{" "}
                <kbd className="px-1.5 py-0.5 text-[10px] font-bold bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/10 rounded-md text-slate-700 dark:text-slate-300 mx-0.5 shadow-sm">Shift + Enter</kbd> {text.forNewLine}
              </div>

              <div className="flex justify-end pt-2 w-full box-border">
                <button
                  type="button"
                  disabled={loading || isOverLimit}
                  aria-busy={loading}
                  aria-disabled={loading || isOverLimit}
                  onClick={handleGenerateClick}
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
                onClick={handleToggleDropdown}
                className="w-full p-3.5 bg-white dark:bg-[#111827]/40 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-blue-500/30 flex items-center justify-between text-xs sm:text-sm font-medium text-left transition-all duration-150 cursor-pointer select-none shadow-sm"
              >
                <span className="truncate pr-4">
                  {selectedPrompt || text.selectPrompt}
                </span>
                <span className={`text-slate-400 dark:text-slate-500 text-[9px] transition-transform duration-150 shrink-0 ${isDropdownOpen ? "rotate-180" : ""}`}>
                  Γû╝
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
            </div>
                )}
              </div>
            )}
          </div>
        </div>

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
          <div className="bg-white border border-slate-200 dark:border-white/10 rounded-2xl p-6 max-w-md w-full text-slate-900 dark:bg-slate-900 dark:border-slate-700 dark:text-white shadow-xl">
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
              className="mt-6 w-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase tracking-wider py-2.5 rounded-xl transition-colors shadow-sm select-none cursor-pointer"
            >
              {text.close}
            </button>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={showOverwriteConfirm}
        onConfirm={handleConfirmOverwrite}
        onCancel={handleCancelOverwrite}
        title="Overwrite existing stories?"
        message="You already have stories in your workspace. Generating a new story will replace them. Do you want to continue?"
        confirmLabel="Generate"
        cancelLabel="Cancel"
      />

      {loading && <StoryGeneratingAnimation onCancel={handleCancelGeneration} isHighLatency={isHighLatency} />}

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
        <div className="col-span-1 lg:col-span-4">
          <GeneratedStoryTimeline
            content={selectedStory.content}
            title={selectedStory.title}
            narrationState={narrationState}
            narrationWordIndex={narrationWordIndex}
          />

          <div className="mb-5">
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-blue-400">
              Preview
            </h1>
          </div>
          <div className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden group">
            <div className="relative flex flex-col rounded-lg">
              <div className="relative m-3 overflow-hidden text-white rounded-xl">
                <ImageFallback
                  src={selectedStory.imageURL}
                  alt="card-image"
                  className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="px-3 py-1">
                <div className="flex justify-between items-center mb-2 w-full">
                  <div className="flex items-center gap-2">
                    <div className="inline-flex items-center rounded-full bg-purple-600 py-1 px-3 text-xs font-semibold text-white shadow-sm">
                      {selectedStory.tag.toUpperCase()}
                    </div>
                    <div className="inline-flex items-center rounded-full bg-indigo-600 py-1 px-3 text-xs font-semibold text-white shadow-sm">
                      ╬ô├½├¡Γò₧├åΓö£┬½Γö£├½ {(selectedStory.language || "English").toUpperCase()}
                    </div>
                    <div className="inline-flex items-center rounded-full bg-slate-700 py-1 px-2.5 text-xs font-medium text-slate-300 shadow-sm gap-1">
                      Γò¼├┤Γö£├á╬ô├╗├å╬ô├¬ΓîÉ╬ô├▓├▓Γö£├á {calculateReadingTime(selectedStory.content)} min read
                    </div>
                  </div>
                  <div>
                    <BookmarkButton storyId={selectedStory.uuid} />
                  </div>
                </div>
                <h6 className="mb-1 text-gray-300 text-xl font-semibold">
                  {selectedStory.title}
                </h6>
                <p className="text-gray-400 font-light breakwords text-sm sm:text-base">
                  {getShortenedText(selectedStory.content)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showWorldMap && selectedStory && (
        <StoryWorldMap
          story={selectedStory.content}
          title={selectedStory.title}
          onClose={() => setShowWorldMap(false)}
        />
      )}
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
};

export default StoriesViewComponent;


