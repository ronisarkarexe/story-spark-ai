import React, { useState, useEffect, useRef, useMemo } from "react";
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
    Drama: "αª¿αª╛αªƒαªò", Comedy: "αªòαºîαªñαºüαªò", Horror: "αª¡αºîαªñαª┐αªò", Romance: "αª¬αºìαª░αºçαª«",
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
    "Sci-Fi": "αñ╡αñ┐αñ£αÑìαñ₧αñ╛αñ¿αñòαñÑαñ╛", Fantasy: "αñòαñ▓αÑìαñ¬αñ¿αñ╛αñ░αñ«αÑìαñ»", Mystery: "αñ░αñ╣αñ╕αÑìαñ»", Adventure: "αñ╕αñ╛αñ╣αñ╕",
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
    freeLimitReached: "Limite gratuito alcanzado", freeLimitMessage: "Has usado las 3 generaciones gratuitas. Inicia sesion para continuar creando historias.",
    continueBrowsing: "Continuar navegando", recentPrompts: "Indicaciones recientes", usePrompt: "Usar", delete: "Eliminar", clearAll: "Limpiar todo", noRecentPrompts: "Sin indicaciones recientes",
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
    selectPrompt: "αñÅαñò αñ╕αñéαñòαÑçαññ αñÜαÑüαñ¿αÑçαñé", characterLimit: "αñàαñòαÑìαñ╖αñ░ αñ╕αÑÇαñ«αñ╛ αñ¬αÑéαñ░αÑÇ - αñ¿αñ┐αñ░αÑìαñ«αñ╛αñú αñàαñòαÑìαñ╖αñ« αñ╣αÑê", charactersRemaining: "αñàαñòαÑìαñ╖αñ░ αñ╢αÑçαñ╖",
    shortcuts: "αñòαÑÇαñ¼αÑïαñ░αÑìαñí αñ╢αÑëαñ░αÑìαñƒαñòαñƒ", openHelp: "αñ╕αñ╣αñ╛αñ»αññαñ╛ αñûαÑïαñ▓αÑçαñé", closeHelp: "αñ╕αñ╣αñ╛αñ»αññαñ╛ αñ¼αñéαñª αñòαñ░αÑçαñé", focusPrompt: "αñ╕αñéαñòαÑçαññ αñ¬αñ░ αñ£αñ╛αñÅαñé",
    generateStory: "αñòαñ╣αñ╛αñ¿αÑÇ αñ¼αñ¿αñ╛αñÅαñé", publishStory: "αñòαñ╣αñ╛αñ¿αÑÇ αñ¬αÑìαñ░αñòαñ╛αñ╢αñ┐αññ αñòαñ░αÑçαñé", close: "αñ¼αñéαñª αñòαñ░αÑçαñé", freeLimitReached: "αñ«αÑüαñ½αÑìαññ αñ╕αÑÇαñ«αñ╛ αñ¬αÑéαñ░αÑÇ",
    freeLimitMessage: "αñåαñ¬αñ¿αÑç αñ╕αñ¡αÑÇ 3 αñ«αÑüαñ½αÑìαññ αñòαñ╣αñ╛αñ¿αÑÇ αñ¿αñ┐αñ░αÑìαñ«αñ╛αñú αñëαñ¬αñ»αÑïαñù αñòαñ░ αñ▓αñ┐αñÅ αñ╣αÑêαñéαÑñ αñåαñùαÑç αñ£αñ╛αñ░αÑÇ αñ░αñûαñ¿αÑç αñòαÑç αñ▓αñ┐αñÅ αñ▓αÑëαñù αñçαñ¿ αñòαñ░αÑçαñéαÑñ", continueBrowsing: "αñ¼αÑìαñ░αñ╛αñëαñ£αñ╝ αñòαñ░αñ¿αñ╛ αñ£αñ╛αñ░αÑÇ αñ░αñûαÑçαñé", recentPrompts: "αñ╣αñ╛αñ▓ αñòαÑç αñ╕αñéαñòαÑçαññ", usePrompt: "αñëαñ¬αñ»αÑïαñù αñòαñ░αÑçαñé", delete: "αñ╣αñƒαñ╛αñÅαñé", clearAll: "αñ╕αñ¼ αñ╕αñ╛αñ½ αñòαñ░αÑçαñé", noRecentPrompts: "αñòαÑïαñê αñ╣αñ╛αñ▓ αñòαÑç αñ╕αñéαñòαÑçαññ αñ¿αñ╣αÑÇαñé",
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
    freeLimitMessage: "δ¼┤δúî ∞¥┤∞ò╝Ω╕░ ∞â¥∞ä▒ 3φÜîδÑ╝ δ¬¿δæÉ ∞é¼∞Ü⌐φûê∞è╡δïêδïñ. Ω│ä∞åìφòÿδáñδ⌐┤ δí£Ω╖╕∞¥╕φòÿ∞ä╕∞Üö.", continueBrowsing: "Ω│ä∞åì δæÿδƒ¼δ│┤Ω╕░", recentPrompts: "∞╡£Ω╖╝ φöäδí¼φöäφè╕", usePrompt: "∞é¼∞Ü⌐", delete: "∞é¡∞á£", clearAll: "δ¬¿δæÉ ∞ºÇ∞Ü░Ω╕░", noRecentPrompts: "∞╡£Ω╖╝ φöäδí¼φöäφè╕Ω░Ç ∞ùå∞è╡δïêδïñ",
  },
  Bengali: {
    back: "αª½αª┐αª░αºç αª»αª╛αª¿", freeAccess: "αº⌐αªƒαª┐ αªàαª¿αºüαª░αºïαªºαºçαª░ αª£αª¿αºìαª» αª¼αª┐αª¿αª╛αª«αºéαª▓αºìαª»αºç αª¼αºìαª»αª¼αª╣αª╛αª░", login: "αª▓αªù αªçαª¿", forMore: "αªòαª░αºç αªåαª░αªô αª¬αª╛αª¿!",
    perMonth: "αª¬αºìαª░αªñαª┐ αª«αª╛αª╕αºç", upgrade: "αªåαª¬αªùαºìαª░αºçαªí", monthlyRequests: "αªÅαªç αª«αª╛αª╕αºçαª░ αªàαª¿αºüαª░αºïαªº", totalPosts: "αª«αºïαªƒ αª¬αºïαª╕αºìαªƒ",
    titleStart: "αªåαª¬αª¿αª╛αª░ αª¡αª╛αª¼αª¿αª╛αªòαºç αª¼αªªαª▓αºç αªªαª┐αª¿", titleAccent: "αªàαª╕αª╛αªºαª╛αª░αªú αªùαª▓αºìαª¬αºç!", length: "αªªαºêαª░αºìαªÿαºìαª»", language: "αª¡αª╛αª╖αª╛",
    short: "αª¢αºïαªƒ", medium: "αª«αª╛αª¥αª╛αª░αª┐", long: "αª▓αª«αºìαª¼αª╛", promptPlaceholder: "αª¬αºìαª░αªñαª┐αªƒαª┐ αª«αª╣αª╛αª¿ αªùαª▓αºìαª¬ αªÅαªòαªƒαª┐ αª¡αª╛αª¼αª¿αª╛ αªªαª┐αª»αª╝αºç αª╢αºüαª░αºü αª╣αª»αª╝αÑñ αªåαª¬αª¿αª╛αª░αªƒαª┐ αªòαºÇ?",
    keyboardTip: "αªòαºÇαª¼αºïαª░αºìαªí αªƒαª┐αª¬:", press: "αªÜαª╛αª¬αºüαª¿", toGenerate: "αªñαºêαª░αª┐ αªòαª░αªñαºç", alsoWorks: "αªÅαªƒαª┐αªô αªòαª╛αª£ αªòαª░αºç", forNewLine: "αª¿αªñαºüαª¿ αª▓αª╛αªçαª¿αºçαª░ αª£αª¿αºìαª»",
    generating: "αªñαºêαª░αª┐ αª╣αªÜαºìαª¢αºç...", generate: "αªñαºêαª░αª┐ αªòαª░αºüαª¿", examples: "αªòαª┐αª¢αºü αªëαªªαª╛αª╣αª░αªú αª¬αºìαª░αª«αºìαª¬αªƒ:",
    selectPrompt: "αªÅαªòαªƒαª┐ αª¬αºìαª░αª«αºìαª¬αªƒ αª¼αºçαª¢αºç αª¿αª┐αª¿", characterLimit: "αªàαªòαºìαª╖αª░αºçαª░ αª╕αºÇαª«αª╛ αª¬αºéαª░αºìαªú - αªñαºêαª░αª┐ αª¼αª¿αºìαªº", charactersRemaining: "αªàαªòαºìαª╖αª░ αª¼αª╛αªòαª┐",
    shortcuts: "αªòαºÇαª¼αºïαª░αºìαªí αª╢αª░αºìαªƒαªòαª╛αªƒ", openHelp: "αª╕αª╣αª╛αª»αª╝αªñαª╛ αªûαºüαª▓αºüαª¿", closeHelp: "αª╕αª╣αª╛αª»αª╝αªñαª╛ αª¼αª¿αºìαªº αªòαª░αºüαª¿", focusPrompt: "αª¬αºìαª░αª«αºìαª¬αªƒαºç αª»αª╛αª¿",
    generateStory: "αªùαª▓αºìαª¬ αªñαºêαª░αª┐ αªòαª░αºüαª¿", publishStory: "αªùαª▓αºìαª¬ αª¬αºìαª░αªòαª╛αª╢ αªòαª░αºüαª¿", close: "αª¼αª¿αºìαªº αªòαª░αºüαª¿", freeLimitReached: "αª¼αª┐αª¿αª╛αª«αºéαª▓αºìαª»αºçαª░ αª╕αºÇαª«αª╛ αª¬αºéαª░αºìαªú",
    freeLimitMessage: "αªåαª¬αª¿αª┐ αº⌐αªƒαª┐ αª¼αª┐αª¿αª╛αª«αºéαª▓αºìαª»αºçαª░ αªùαª▓αºìαª¬ αªñαºêαª░αª┐ αª¼αºìαª»αª¼αª╣αª╛αª░ αªòαª░αºçαª¢αºçαª¿αÑñ αªÜαª╛αª▓αª┐αª»αª╝αºç αª»αºçαªñαºç αª▓αªù αªçαª¿ αªòαª░αºüαª¿αÑñ", continueBrowsing: "αª¼αºìαª░αª╛αªëαª£ αªÜαª╛αª▓αª┐αª»αª╝αºç αª»αª╛αª¿", recentPrompts: "αª╕αª«αºìαª¬αºìαª░αªñαª┐ αª¼αºìαª»αª¼αª╣αºâαªñ αª¬αºìαª░αª«αºìαª¬αªƒ", usePrompt: "αª¼αºìαª»αª¼αª╣αª╛αª░ αªòαª░αºüαª¿", delete: "αª«αºüαª¢αºç αª½αºçαª▓αºüαª¿", clearAll: "αª╕αª¼ αª«αºüαª¢αºç αªªαª┐αª¿", noRecentPrompts: "αªòαºïαª¿αºï αª╕αª«αºìαª¬αºìαª░αªñαª┐ αª¼αºìαª»αª¼αª╣αºâαªñ αª¬αºìαª░αª«αºìαª¬αªƒ αª¿αºçαªç",
  },
  Tamil: {
    back: "α«ñα«┐α«░α»üα««α»ìα«¬α»ü", freeAccess: "3 α«òα»ïα«░α«┐α«òα»ìα«òα»êα«òα«│α»üα«òα»ìα«òα»ü α«çα«▓α«╡α«Ü α«àα«úα»üα«òα«▓α»ì", login: "α«ëα«│α»ìα«¿α»üα«┤α»ê", forMore: "α«Üα»åα«»α»ìα«ñα»ü α««α»çα«▓α»üα««α»ì α«¬α»åα«▒α»üα«Öα»ìα«òα«│α»ì!",
    perMonth: "α««α«╛α«ñα«ñα»ìα«ñα«┐α«▒α»ìα«òα»ü", upgrade: "α««α»çα««α»ìα«¬α«ƒα»üα«ñα»ìα«ñα»ü", monthlyRequests: "α«çα«¿α»ìα«ñ α««α«╛α«ñ α«òα»ïα«░α«┐α«òα»ìα«òα»êα«òα«│α»ì", totalPosts: "α««α»èα«ñα»ìα«ñ α«¬α«ñα«┐α«╡α»üα«òα«│α»ì",
    titleStart: "α«ëα«Öα»ìα«òα«│α»ì α«Äα«úα»ìα«úα«Öα»ìα«òα«│α»ê", titleAccent: "α«àα«▒α»ìα«¬α»üα«ñ α«òα«ñα»êα«òα«│α«╛α«ò α««α«╛α«▒α»ìα«▒α»üα«Öα»ìα«òα«│α»ì!", length: "α«¿α»Çα«│α««α»ì", language: "α««α»èα«┤α«┐",
    short: "α«Üα«┐α«▒α«┐α«»α«ñα»ü", medium: "α«¿α«ƒα»üα«ñα»ìα«ñα«░α««α»ì", long: "α«¿α»Çα«│α««α«╛α«⌐α«ñα»ü", promptPlaceholder: "α«Æα«╡α»ìα«╡α»èα«░α»ü α«Üα«┐α«▒α«¿α»ìα«ñ α«òα«ñα»êα«»α»üα««α»ì α«Æα«░α»ü α«Äα«úα»ìα«úα«ñα»ìα«ñα«┐α«▓α»ì α«ñα»èα«ƒα«Öα»ìα«òα»üα«òα«┐α«▒α«ñα»ü. α«ëα«Öα»ìα«òα«│α»üα«ƒα»êα«»α«ñα»ü α«Äα«⌐α»ìα«⌐?",
    keyboardTip: "α«╡α«┐α«Üα»êα«¬α»ìα«¬α«▓α«òα»ê α«òα»üα«▒α«┐α«¬α»ìα«¬α»ü:", press: "α«àα«┤α»üα«ñα»ìα«ñα«╡α»üα««α»ì", toGenerate: "α«ëα«░α»üα«╡α«╛α«òα»ìα«ò", alsoWorks: "α«çα«ñα»üα«╡α»üα««α»ì α«Üα»åα«»α«▓α»ìα«¬α«ƒα»üα««α»ì", forNewLine: "α«¬α»üα«ñα«┐α«» α«╡α«░α«┐α«òα»ìα«òα»ü",
    generating: "α«ëα«░α»üα«╡α«╛α«òα»ìα«òα»üα«òα«┐α«▒α«ñα»ü...", generate: "α«ëα«░α»üα«╡α«╛α«òα»ìα«òα»ü", examples: "α«Üα«┐α«▓ α«Äα«ƒα»üα«ñα»ìα«ñα»üα«òα»ìα«òα«╛α«ƒα»ìα«ƒα»ü α«òα»üα«▒α«┐α«¬α»ìα«¬α»üα«òα«│α»ì:",
    selectPrompt: "α«Æα«░α»ü α«òα»üα«▒α«┐α«¬α»ìα«¬α»ê α«ñα»çα«░α»ìα«╡α»ü α«Üα»åα«»α»ìα«ò", characterLimit: "α«Äα«┤α»üα«ñα»ìα«ñα»ü α«╡α«░α««α»ìα«¬α»ü α«àα«ƒα»êα«¿α»ìα«ñα«ñα»ü - α«ëα«░α»üα«╡α«╛α«òα»ìα«òα««α»ì α««α»üα«ƒα«òα»ìα«òα«¬α»ìα«¬α«ƒα»ìα«ƒα«ñα»ü", charactersRemaining: "α«Äα«┤α»üα«ñα»ìα«ñα»üα«òα«│α»ì α««α»Çα«ñα««α»ì",
    shortcuts: "α«╡α«┐α«Üα»êα«¬α»ìα«¬α«▓α«òα»ê α«òα»üα«▒α»üα«òα»ìα«òα»üα«╡α«┤α«┐α«òα«│α»ì", openHelp: "α«ëα«ñα«╡α«┐ α«ñα«┐α«▒", closeHelp: "α«ëα«ñα«╡α«┐ α««α»éα«ƒα»ü", focusPrompt: "α«òα»üα«▒α«┐α«¬α»ìα«¬α«┐α«▓α»ì α«òα«╡α«⌐α««α»ì",
    generateStory: "α«òα«ñα»ê α«ëα«░α»üα«╡α«╛α«òα»ìα«òα»ü", publishStory: "α«òα«ñα»ê α«╡α»åα«│α«┐α«»α«┐α«ƒα»ü", close: "α««α»éα«ƒα»ü", freeLimitReached: "α«çα«▓α«╡α«Ü α«╡α«░α««α»ìα«¬α»ü α«àα«ƒα»êα«¿α»ìα«ñα«ñα»ü",
    freeLimitMessage: "3 α«çα«▓α«╡α«Ü α«òα«ñα»ê α«ëα«░α»üα«╡α«╛α«òα»ìα«òα«Öα»ìα«òα«│α»êα«»α»üα««α»ì α«¬α«»α«⌐α»ìα«¬α«ƒα»üα«ñα»ìα«ñα«┐α«╡α«┐α«ƒα»ìα«ƒα»Çα«░α»ìα«òα«│α»ì. α«ñα»èα«ƒα«░ α«ëα«│α»ìα«¿α»üα«┤α»êα«»α«╡α»üα««α»ì.", continueBrowsing: "α«ñα»èα«ƒα«░α»ìα«¿α»ìα«ñα»ü α«¬α«╛α«░α»ìα«╡α»êα«»α«┐α«ƒα»ü", recentPrompts: "α«Üα««α»Çα«¬α«ñα»ìα«ñα«┐α«» α«òα»üα«▒α«┐α«¬α»ìα«¬α»üα«òα«│α»ì", usePrompt: "α«¬α«»α«⌐α»ìα«¬α«ƒα»üα«ñα»ìα«ñα»ü", delete: "α«¿α»Çα«òα»ìα«òα»ü", clearAll: "α«àα«⌐α»êα«ñα»ìα«ñα»êα«»α»üα««α»ì α«¿α»Çα«òα»ìα«òα»ü", noRecentPrompts: "α«Üα««α»Çα«¬α«ñα»ìα«ñα«┐α«» α«òα»üα«▒α«┐α«¬α»ìα«¬α»üα«òα«│α»ì α«çα«▓α»ìα«▓α»ê",
  },
  Telugu: {
    back: "α░╡α▒åα░¿α▒üα░òα░òα▒ü", freeAccess: "3 α░àα░¡α▒ìα░»α░░α▒ìα░Ñα░¿α░▓α░òα▒ü α░ëα░Üα░┐α░ñ α░¬α▒ìα░░α░╡α▒çα░╢α░é", login: "α░▓α░╛α░ùα░┐α░¿α▒ì", forMore: "α░Üα▒çα░╕α░┐ α░«α░░α░┐α░¿α▒ìα░¿α░┐ α░¬α▒èα░éα░ªα░éα░íα░┐!",
    perMonth: "α░¿α▒åα░▓α░òα▒ü", upgrade: "α░àα░¬α▒ìΓÇîα░ùα▒ìα░░α▒çα░íα▒ì", monthlyRequests: "α░ê α░¿α▒åα░▓ α░àα░¡α▒ìα░»α░░α▒ìα░Ñα░¿α░▓α▒ü", totalPosts: "α░«α▒èα░ñα▒ìα░ñα░é α░¬α▒ïα░╕α▒ìα░ƒα▒üα░▓α▒ü",
    titleStart: "α░«α▒Ç α░åα░▓α▒ïα░Üα░¿α░▓α░¿α▒ü", titleAccent: "α░àα░ªα▒ìα░¡α▒üα░ñ α░òα░Ñα░▓α▒üα░ùα░╛ α░«α░╛α░░α▒ìα░Üα░éα░íα░┐!", length: "α░¬α▒èα░íα░╡α▒ü", language: "α░¡α░╛α░╖",
    short: "α░Üα░┐α░¿α▒ìα░¿α░ªα░┐", medium: "α░«α░ºα▒ìα░»α░╕α▒ìα░Ñα░é", long: "α░¬α▒èα░íα░╡α▒êα░¿α░ªα░┐", promptPlaceholder: "α░¬α▒ìα░░α░ñα░┐ α░ùα▒èα░¬α▒ìα░¬ α░òα░Ñ α░Æα░ò α░åα░▓α▒ïα░Üα░¿α░ñα▒ï α░«α▒èα░ªα░▓α░╡α▒üα░ñα▒üα░éα░ªα░┐. α░«α▒Çα░ªα░┐ α░Åα░«α░┐α░ƒα░┐?",
    keyboardTip: "α░òα▒Çα░¼α▒ïα░░α▒ìα░íα▒ì α░Üα░┐α░ƒα▒ìα░òα░╛:", press: "α░¿α▒èα░òα▒ìα░òα░éα░íα░┐", toGenerate: "α░░α▒éα░¬α▒èα░éα░ªα░┐α░éα░Üα░íα░╛α░¿α░┐α░òα░┐", alsoWorks: "α░òα▒éα░íα░╛ α░¬α░¿α░┐α░Üα▒çα░╕α▒ìα░ñα▒üα░éα░ªα░┐", forNewLine: "α░òα▒èα░ñα▒ìα░ñ α░▓α▒êα░¿α▒ì α░òα▒ïα░╕α░é",
    generating: "α░░α▒éα░¬α▒èα░éα░ªα░┐α░╕α▒ìα░ñα▒ïα░éα░ªα░┐...", generate: "α░░α▒éα░¬α▒èα░éα░ªα░┐α░éα░Üα▒ü", examples: "α░òα▒èα░¿α▒ìα░¿α░┐ α░ëα░ªα░╛α░╣α░░α░ú α░¬α▒ìα░░α░╛α░éα░¬α▒ìα░ƒα▒ìΓÇîα░▓α▒ü:",
    selectPrompt: "α░¬α▒ìα░░α░╛α░éα░¬α▒ìα░ƒα▒ì α░Äα░éα░Üα▒üα░òα▒ïα░éα░íα░┐", characterLimit: "α░àα░òα▒ìα░╖α░░ α░¬α░░α░┐α░«α░┐α░ñα░┐ α░Üα▒çα░░α░┐α░éα░ªα░┐ - α░░α▒éα░¬α▒èα░éα░ªα░┐α░éα░¬α▒ü α░¿α░┐α░▓α░┐α░¬α░┐α░╡α▒çα░»α░¼α░íα░┐α░éα░ªα░┐", charactersRemaining: "α░àα░òα▒ìα░╖α░░α░╛α░▓α▒ü α░«α░┐α░ùα░┐α░▓α░╛α░»α░┐",
    shortcuts: "α░òα▒Çα░¼α▒ïα░░α▒ìα░íα▒ì α░╕α░ñα▒ìα░╡α░░α░«α░╛α░░α▒ìα░ùα░╛α░▓α▒ü", openHelp: "α░╕α░╣α░╛α░»α░é α░ñα▒åα░░α░╡α░éα░íα░┐", closeHelp: "α░╕α░╣α░╛α░»α░é α░«α▒éα░╕α░┐α░╡α▒çα░»α░éα░íα░┐", focusPrompt: "α░¬α▒ìα░░α░╛α░éα░¬α▒ìα░ƒα▒ìΓÇîα░¬α▒ê α░ªα▒âα░╖α▒ìα░ƒα░┐",
    generateStory: "α░òα░Ñ α░░α▒éα░¬α▒èα░éα░ªα░┐α░éα░Üα▒ü", publishStory: "α░òα░Ñ α░¬α▒ìα░░α░Üα▒üα░░α░┐α░éα░Üα▒ü", close: "α░«α▒éα░╕α░┐α░╡α▒çα░»α░┐", freeLimitReached: "α░ëα░Üα░┐α░ñ α░¬α░░α░┐α░«α░┐α░ñα░┐ α░Üα▒çα░░α░┐α░éα░ªα░┐",
    freeLimitMessage: "α░«α▒Çα░░α▒ü 3 α░ëα░Üα░┐α░ñ α░òα░Ñα░╛ α░░α▒éα░¬α▒èα░éα░ªα░┐α░éα░¬α▒üα░▓α░¿α▒ü α░ëα░¬α░»α▒ïα░ùα░┐α░éα░Üα░╛α░░α▒ü. α░òα▒èα░¿α░╕α░╛α░ùα░íα░╛α░¿α░┐α░òα░┐ α░▓α░╛α░ùα░┐α░¿α▒ì α░Üα▒çα░»α░éα░íα░┐.", continueBrowsing: "α░¼α▒ìα░░α▒îα░£α░┐α░éα░ùα▒ì α░òα▒èα░¿α░╕α░╛α░ùα░┐α░éα░Üα▒ü", recentPrompts: "α░çα░ƒα▒Çα░╡α░▓ α░¬α▒ìα░░α░╛α░éα░¬α▒ìα░ƒα▒ìΓÇîα░▓α▒ü", usePrompt: "α░ëα░¬α░»α▒ïα░ùα░┐α░éα░Üα▒ü", delete: "α░ñα▒èα░▓α░ùα░┐α░éα░Üα▒ü", clearAll: "α░àα░¿α▒ìα░¿α░┐α░éα░ƒα░┐α░¿α░┐ α░ñα▒èα░▓α░ùα░┐α░éα░Üα▒ü", noRecentPrompts: "α░çα░ƒα▒Çα░╡α░▓ α░¬α▒ìα░░α░╛α░éα░¬α▒ìα░ƒα▒ìΓÇîα░▓α▒ü α░▓α▒çα░╡α▒ü",
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
    freeLimitMessage: "αññαÑüαñ«αÑìαñ╣αÑÇ αñ╕αñ░αÑìαñ╡ 3 αñ«αÑïαñ½αññ αñòαñÑαñ╛ αñ¿αñ┐αñ░αÑìαñ«αñ┐αññαÑÇ αñ╡αñ╛αñ¬αñ░αñ▓αÑìαñ»αñ╛ αñåαñ╣αÑçαññ. αñ¬αÑüαñóαÑç αñ╕αÑüαñ░αÑé αñáαÑçαñ╡αñúαÑìαñ»αñ╛αñ╕αñ╛αñáαÑÇ αñ▓αÑëαñù αñçαñ¿ αñòαñ░αñ╛.", continueBrowsing: "αñ¼αÑìαñ░αñ╛αñëαñ¥αñ┐αñéαñù αñ╕αÑüαñ░αÑé αñáαÑçαñ╡αñ╛", recentPrompts: "αñàαñ▓αÑÇαñòαñíαÑÇαñ▓ αñ¬αÑìαñ░αÑëαñ«αÑìαñ¬αÑìαñƒ", usePrompt: "αñ╡αñ╛αñ¬αñ░αñ╛", delete: "αñ╣αñƒαñ╡αñ╛", clearAll: "αñ╕αñ░αÑìαñ╡ αñ«αÑüαñíαÑéαñ¿ αñƒαñ╛αñòαñ╛", noRecentPrompts: "αñàαñ▓αÑÇαñòαñíαÑÇαñ▓ αñ¬αÑìαñ░αÑëαñ«αÑìαñ¬αÑìαñƒ αñ¿αñ╛αñ╣αÑÇαññ",
  },
};

const LANGUAGE_STORAGE_KEY = "storySparkLanguage";

// NEW: Tone definitions ΓÇö each has a label, emoji, and Tailwind colour classes
// for the active/inactive pill states.
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
    emoji: "≡ƒÿ░",
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

// ---------------------------------------------------------------------------
// TonePicker sub-component
// ---------------------------------------------------------------------------
interface TonePickerProps {
  selected: ToneLabel | "";
  onChange: (tone: ToneLabel | "") => void;
}

const TonePicker: React.FC<TonePickerProps> = ({ selected, onChange }) => {
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
};

// ---------------------------------------------------------------------------
// Main StoriesComponent
// ---------------------------------------------------------------------------
const StoriesComponent = () => {
  const [currentPage, setCurrentPage] = useState(1);
const storiesPerPage = 10;
  const location = useLocation();
  const navigate = useNavigate();
  const { register, handleSubmit, reset, setValue } = useForm<Inputs>();

  const draft = useMemo(() => {
    try {
      const saved = localStorage.getItem("story_spark_draft");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  }, []);

  const [stories, setStories] = useState<IStories[]>(
    draft?.stories?.length ? draft.stories : [{uuid:"test-1",title:"The Wizard's Journey",content:"Merlin walked through the forest toward the castle. The village was far behind him. He crossed the bridge over the river and entered the dungeon beneath the tower. Dragons guarded the mountain beyond the valley. Elena watched from the palace window as Merlin approached the cave near the ocean shore.",tag:"Fantasy",imageURL:""}]
  );
  
  const [loading, setLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchFilter, setSearchFilter] = useState<string>("all");

  const filteredStories = useMemo(() => {
    if (!searchQuery.trim()) return stories;
    
    const query = searchQuery.toLowerCase();
    
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
  }, [stories, searchQuery, searchFilter]);
  const indexOfLastStory = currentPage * storiesPerPage;
const indexOfFirstStory = indexOfLastStory - storiesPerPage;

const currentStories = filteredStories.slice(
  indexOfFirstStory,
  indexOfLastStory
);

const totalPages = Math.ceil(
  filteredStories.length / storiesPerPage
);
useEffect(() => {
  setCurrentPage(1);
}, [searchQuery, searchFilter]);

  const { data } = useGetProfileInfoQuery(undefined);
  const userRole = getUserInfo();
  const login = isLoggedIn();
  const [generateModel] = useGenerateModelMutation();
  const [generateFreeModel] = useGenerateFreeModelMutation();
  const [selectedPrompt, setSelectedPrompt] = useState<string>("");
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState<string>(
  draft?.genre
    ? (GENRES.find((g) => g.name === draft.genre || g.value === draft.genre)?.value ?? "≡ƒºÖ Fantasy")
    : "≡ƒºÖ Fantasy",
);
  const [selectedLength, setSelectedLength] = useState<string>(draft?.length || "medium");
  const [selectedTone, setSelectedTone] = useState<ToneLabel | "">(draft?.tone || "Dramatic");
  const [textareaValue, setTextareaValue] = useState<string>(location.state?.prompt || draft?.prompt || "");
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string>(draft?.language || "English");
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState<boolean>(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const languageDropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
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

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Autosave Draft
  useEffect(() => {
    const timer = setTimeout(() => {
      // stories intentionally excluded ΓÇö API response, not user input
      // including stories risks hitting localStorage quota (~5MB) silently
      const draftData = {
        prompt: textareaValue,
        genre: selectedGenre,
        length: selectedLength,
        language: selectedLanguage,
        tone: selectedTone,
        stories: stories,
      };
      try {
        localStorage.setItem("story_spark_draft", JSON.stringify(draftData));
      } catch (err) {
        if (err instanceof DOMException && err.name === "QuotaExceededError") {
          toast.error("Couldn't autosave draft ΓÇö storage limit reached.");
        }
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [textareaValue, selectedGenre, selectedLength, selectedLanguage, selectedTone, stories]);

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
  const matchedGenre =
    GENRES.find((g) => g.name === location.state.genre)?.value ?? "";
  setSelectedGenre(matchedGenre);
}

    navigate(location.pathname, {
      replace: true,
      state: {},
    });
  }
}, [location, navigate, setSelectedGenre, setTextareaValue]);

  useEffect(() => {
    setValue("prompt", textareaValue);
  }, [textareaValue, setValue]);

  useEffect(() => {
    return () => {
      activeGenerationRef.current?.abort();
    };
  }, []);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
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
    isGenerationInProgressRef.current = true;
    setLoading(true);

    let timeoutId: NodeJS.Timeout | null = null;

    try {
      // 60-second client-side request timeout safeguard
      timeoutId = setTimeout(() => {
        if (isGenerationInProgressRef.current) {
          toast.error("Story generation timed out. Please try again.");
          handleCancelGeneration(true);
        }
      }, 60000);

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
        language: selectedLanguage,
        tone: selectedTone || undefined,
      };
      const generationRequest = login
        ? generateModel(payload)
        : generateFreeModel(payload);
      activeGenerationRef.current = generationRequest;
      const res = await generationRequest.unwrap();
      if (res) {
        toast.success(res.message);
        addPrompt(data.prompt);
        setStories(res.data as IStories[]);
        setTextareaValue("");
        setSelectedPrompt("");
        setValue("prompt", "");
        if (selectedGenre) {
          playSoundtrack(selectedGenre);
        }
        if (!login) {
          const newCount = guestRequestCount + 1;
          setGuestRequestCount(newCount);
          localStorage.setItem("guestRequestCount", String(newCount));
        }
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
      activeGenerationRef.current = null;
      isGenerationInProgressRef.current = false;
      setLoading(false);
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
    reset();
  };

  const isOverLimit = textareaValue.length >= MAX_PROMPT_LENGTH;
  const isNearLimit = textareaValue.length >= MAX_PROMPT_LENGTH * WARN_THRESHOLD;
  const isGenerateDisabled = loading || isOverLimit || !textareaValue.trim();

  useKeyboardShortcuts({
    onOpenHelp: () => setShowHelpModal(true),
    onCloseHelp: () => setShowHelpModal(false),
    onGenerate: () => {
      if (isGenerateDisabled) {
        return;
      }
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
            </div>
          </div>
        </div>

        <div className="mt-11">
          <h1 className="text-slate-900 dark:text-gray-300 text-2xl sm:text-3xl md:text-4xl font-extrabold text-center mb-12">
            Γ£¿ {text.titleStart}{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-blue-400">
              {text.titleAccent}
            </span>{" "}
            Γ£¿
          </h1>

          <div className="max-w-3xl mx-auto px-4 sm:px-0">
            <div className="bg-gray-50 rounded-md p-4 border border-gray-200 text-slate-900 dark:bg-blue-500/10 dark:border-gray-400 dark:text-white overflow-hidden">
              <div className="relative w-full">
                <form className="space-y-4 w-full" onSubmit={handleSubmit(onSubmit)}>
                  
                  {/* ΓöÇΓöÇ Genre chips ΓöÇΓöÇ */}
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

                  {/* ΓöÇΓöÇ NEW: Tone picker ΓöÇΓöÇ */}
                  <TonePicker selected={selectedTone} onChange={setSelectedTone} />

                  {/* ΓöÇΓöÇ Length + Language row ΓöÇΓöÇ */}
                  <div className="flex flex-wrap items-center gap-4 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400 mr-1">≡ƒôÅ {text.length}:</span>

                      {(["short", "medium", "long"] as const).map((length) => (
                        <button
                          key={length}
                          type="button"
                          disabled={loading}
                          onClick={() => setSelectedLength(length)}
                          className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                            selectedLength === length
                              ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/30"
                              : "bg-white/10 text-gray-400 hover:bg-white/20 hover:text-gray-200"
                          } ${loading ? "cursor-not-allowed opacity-50" : ""}`}
                        >
                          {text[length]}
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 ml-0 sm:ml-auto">
                      <span className="text-xs text-gray-400 mr-1">≡ƒîÉ {text.language}:</span>
                      <div className="relative" ref={languageDropdownRef}>
                        <button
                          key="lang-selector-btn"
                          type="button"
                          disabled={loading}
                          onClick={() => !loading && setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                          className={`flex items-center gap-2 px-3 py-1 bg-white/10 text-gray-300 border border-slate-700/50 rounded-full text-xs font-semibold hover:bg-white/20 transition-all duration-200 ${
                            loading ? "cursor-not-allowed opacity-50" : "cursor-pointer"
                          }`}
                        >
                          <span>{LANGUAGES.find(l => l.name === selectedLanguage)?.name || "English"}</span>
                          <span className="text-gray-400 text-[10px]">Γû╝</span>
                        </button>

                        {isLanguageDropdownOpen && (
                          <ul className="absolute right-0 z-20 mt-1 max-h-48 w-36 overflow-y-auto bg-slate-800 border border-slate-700/50 rounded-lg shadow-xl focus:outline-none divide-y divide-slate-700/30">
                            {LANGUAGES.map((lang) => (
                              <li key={lang.code}>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedLanguage(lang.name);
                                    setIsLanguageDropdownOpen(false);
                                  }}
                                  className={`w-full text-left px-3 py-2 text-xs transition-colors duration-150 cursor-pointer ${
                                    selectedLanguage === lang.name
                                      ? "bg-indigo-600 text-white font-bold"
                                      : "text-gray-400 hover:bg-indigo-600/50 hover:text-white"
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

                  {/* ΓöÇΓöÇ Prompt textarea ΓöÇΓöÇ */}
                  <div className="relative w-full">
                    <textarea
                      {...register("prompt")}
                      ref={(el) => {
                        register("prompt").ref(el);
                        inputRef.current = el;
                      }}
                      disabled={loading}
                      aria-busy={loading}
                      className={`w-full h-32 sm:h-40 resize-none border-none outline-none bg-transparent text-gray-800 dark:text-gray-200 focus:ring-0 text-lg leading-relaxed tracking-wide placeholder:italic placeholder:text-gray-500 dark:placeholder:text-gray-400 pr-12 transition-colors duration-200 box-border ${
                        isOverLimit
                          ? "ring-1 ring-red-500 rounded"
                          : isNearLimit
                          ? "ring-1 ring-yellow-400 rounded"
                          : ""
                      }`}
                      placeholder={text.promptPlaceholder}
                      value={textareaValue}
                      maxLength={MAX_PROMPT_LENGTH}
                      onChange={(e) => setTextareaValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          if (isGenerateDisabled) {
                            return;
                          }
                          const form = e.currentTarget.closest("form");
                          if (form) form.requestSubmit();
                        }
                      }}
                    />

                    {textareaValue.length > 0 && (
                      <button
                        type="button"
                        disabled={loading}
                        onClick={handleClearPrompt}
                        className={`absolute right-2 top-2 text-gray-400 transition-colors duration-200 ${
                          loading
                            ? "cursor-not-allowed opacity-50"
                            : "hover:text-red-500"
                        }`}
                        aria-label={text.close}
                        title={text.close}
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    )}

                    <button
                      type="button"
                      disabled={loading}
                      onClick={() => !loading && setIsRecentPromptsOpen(!isRecentPromptsOpen)}
                      className={`absolute right-2 top-12 bg-indigo-600 text-white px-3 py-2 rounded-lg text-sm transition-colors duration-200 flex items-center gap-2 ${
                        loading
                          ? "cursor-not-allowed opacity-60"
                          : "hover:bg-indigo-700"
                      }`}
                      aria-label={text.recentPrompts}
                      title={text.recentPrompts}
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {text.recentPrompts}
                    </button>

                    <div className="flex items-center justify-between mt-1 px-1">
                      {isOverLimit ? (
                        <p className="text-xs text-red-400 flex items-center gap-1">
                          <span>ΓÜá</span> {text.characterLimit}
                        </p>
                      ) : isNearLimit ? (
                        <p className="text-xs text-yellow-400 flex items-center gap-1">
                          <span>ΓÜá</span>{" "}
                          {MAX_PROMPT_LENGTH - textareaValue.length} {text.charactersRemaining}
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

                  <p className="text-xs text-gray-500 mt-1 px-1">
                    ≡ƒÆí <span className="font-medium">{text.keyboardTip}</span> {text.press}{" "}
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

                  {/* ΓöÇΓöÇ Generate button row ΓöÇΓöÇ */}
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
                            ├ù
                          </button>
                        </span>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={isGenerateDisabled}
                      aria-busy={loading}
                      aria-disabled={isGenerateDisabled}
                      className={`rounded-lg bg-gradient-to-r from-blue-400 to-indigo-500 text-gray-200 px-6 py-3 font-semibold ${
                        isGenerateDisabled
                          ? "opacity-50 cursor-not-allowed"
                          : "cursor-pointer hover:shadow-lg hover:shadow-indigo-500/50 hover:scale-105"
                      } transition-all duration-300 transform flex items-center space-x-2 group`}
                    >
                      {loading ? (
                        <i className="fas fa-circle-notch text-xl animate-spin"></i>
                      ) : (
                        <i className="fas fa-wand-magic-sparkles text-xl transition-transform duration-300 group-hover:animate-wiggle"></i>
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
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
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
                    Γû╝
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
        onSelectPrompt={(prompt) => {
          setTextareaValue(prompt);
          setValue("prompt", prompt);
          setIsRecentPromptsOpen(false);
        }}
        onRemovePrompt={removePrompt}
        onClearAll={clearAll}
        isOpen={isRecentPromptsOpen}
        onToggle={() => setIsRecentPromptsOpen(!isRecentPromptsOpen)}
        text={{
          recentPrompts: text.recentPrompts,
          usePrompt: text.usePrompt,
          delete: text.delete,
          clearAll: text.clearAll,
          noRecentPrompts: text.noRecentPrompts,
          close: text.close,
        }}
      />

      {showHelpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 max-w-md w-full text-slate-900 dark:bg-slate-900 dark:border-slate-700 dark:text-white">
            <h2 className="text-xl font-bold text-slate-900 mb-4 dark:text-white">
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
        onClick={() => setShowHelpModal(false)}
        className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg"
      >
        {text.close}
      </button>
        </div>
      </div>
      )}

      {loading && <StoryGeneratingAnimation onCancel={handleCancelGeneration} />}

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
      <div className="absolute top-[-200px] left-[250px] w-[800px] h-[350px] bg-blue-500/20 rounded-full blur-3xl -z-10"></div>
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
            className="px-4 py-2 rounded bg-slate-700 text-white disabled:opacity-50"
          >
            Previous
          </button>

          <span>
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage((p) => p + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded bg-slate-700 text-white disabled:opacity-50"
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
