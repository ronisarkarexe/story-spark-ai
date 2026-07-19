import React, { useCallback, useState, useEffect, useRef } from "react";
import jsPDF from "jspdf";
import StoriesViewComponent, { IStories } from "./stories.view.component";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getUserInfo, isLoggedIn } from "../../services/auth.service";
import { getRequestLimit, getWordCount, prompts, STORY_TEMPLATES } from "./stories.utils";
import {
  useGenerateFreeModelMutation,
  useGenerateModelMutation,
  useGetUsageQuery,
} from "../../redux/apis/ai.model.api";
import { UpgradeModal } from "./UpgradeModal";
import toast, { Toaster } from "react-hot-toast";
import { SubmitHandler, useForm } from "react-hook-form";
import { useGetProfileInfoQuery } from "../../redux/apis/user.api";
import { useGetCharactersQuery, useSaveCharacterMutation } from "../../redux/apis/character.api";
import { getErrorMessage } from "../../error/error.message";
import useKeyboardShortcuts from "../../hooks/useKeyboardShortcuts";
import StoryGeneratingAnimation from "../loading/story-generating-animation.component";
import { useDebounce } from "../../hooks/useDebounce";
import ConfirmDialog from "./ConfirmDialog";
import {
  clearStoryDraft,
  loadStoryDraft,
  saveStoryDraft,
  type StoryDraftData,
} from "../../utils/story-draft";

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
const lengths = ["short", "medium", "long"] as const;

const StoriesComponent = () => {
const WARN_THRESHOLD = 0.85;
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
    Drama: "αñ¿αñ╛αñƒαñò", Comedy: "├á┬ñ┬╣├á┬ñ┬╛├á┬ñ┬╕├á┬Ñ┬ì├á┬ñ┬»", Horror: "αñíαñ░αñ╛αñ╡αñ¿αÑÇ", Romance: "├á┬ñ┬¬├á┬Ñ┬ì├á┬ñ┬░├á┬ÑΓÇí├á┬ñ┬«",
    "Sci-Fi": "├á┬ñ┬╡├á┬ñ┬┐├á┬ñ┼ô├á┬Ñ┬ì├á┬ñ┼╛├á┬ñ┬╛├á┬ñ┬¿ ├á┬ñΓÇó├á┬ñ┬Ñ├á┬ñ┬╛", Fantasy: "├á┬ñΓÇó├á┬ñ┬▓├á┬Ñ┬ì├á┬ñ┬¬├á┬ñ┬¿├á┬ñ┬╛", Mystery: "├á┬ñ┬░├á┬ñ┬╣├á┬ñ┬╕├á┬Ñ┬ì├á┬ñ┬»", Adventure: "αñ░αÑïαñ«αñ╛αñéαñÜ",
  },
  German: {
    Drama: "Drama", Comedy: "Komodie", Horror: "Horror", Romance: "Romanze",
    "Sci-Fi": "Science-Fiction", Fantasy: "Fantasy", Mystery: "Mysterie", Adventure: "Abenteuer",
  },
  Japanese: {
    Drama: "├ú╞ÆΓÇ░├ú╞Æ┬⌐├ú╞Æ┼╛", Comedy: "├úΓÇÜ┬│├ú╞Æ┬í├ú╞ÆΓÇí├úΓÇÜ┬ú", Horror: "├ú╞ÆΓÇ║├ú╞Æ┬⌐├ú╞Æ┬╝", Romance: "├ú╞Æ┬¡├ú╞Æ┼╛├ú╞Æ┬│├úΓÇÜ┬╣",
    "Sci-Fi": "SF", Fantasy: "├ú╞ÆΓÇó├úΓÇÜ┬í├ú╞Æ┬│├úΓÇÜ┬┐├úΓÇÜ┬╕├ú╞Æ┬╝", Mystery: "├ú╞Æ┼╕├úΓÇÜ┬╣├ú╞ÆΓÇá├ú╞Æ┬¬├ú╞Æ┬╝", Adventure: "├ÑΓÇáΓÇÖ├⌐Γäó┬║",
  },
  Korean: {
    Drama: "├½ΓÇ£┼ô├½┬¥┬╝├½┬º╦å", Comedy: "├¼┬╜ΓÇ¥├½┬»┬╕├½ΓÇ¥ΓÇ¥", Horror: "├¬┬│┬╡├¡┬Å┬¼", Romance: "├½┬í┼ô├½┬º┬¿├¼┼á┬ñ",
    "Sci-Fi": "SF", Fantasy: "├¡┼Æ┬É├¡╞ÆΓé¼├¼┬ºΓé¼", Mystery: "├½┬»┬╕├¼┼á┬ñ├¡ΓÇ₧┬░├½┬ª┬¼", Adventure: "├½┬¬┬¿├¡ΓÇö╦£",
  },
  Bengali: {

    Drama: "├á┬ª┬¿├á┬ª┬╛├á┬ª┼╕├á┬ªΓÇó", Comedy: "├á┬ªΓÇó├á┬º┼Æ├á┬ª┬ñ├á┬º┬ü├á┬ªΓÇó", Horror: "├á┬ª┬¡├á┬º┼Æ├á┬ª┬ñ├á┬ª┬┐├á┬ªΓÇó", Romance: "├á┬ª┬¬├á┬º┬ì├á┬ª┬░├á┬ºΓÇí├á┬ª┬«",
    "Sci-Fi": "├á┬ª┬¼├á┬ª┬┐├á┬ª┼ô├á┬º┬ì├á┬ª┼╛├á┬ª┬╛├á┬ª┬¿ ├á┬ªΓÇó├á┬ª┬▓├á┬º┬ì├á┬ª┬¬├á┬ªΓÇó├á┬ª┬╛├á┬ª┬╣├á┬ª┬┐├á┬ª┬¿├á┬ª┬┐", Fantasy: "├á┬ªΓÇó├á┬ª┬▓├á┬º┬ì├á┬ª┬¬├á┬ª┬¿├á┬ª┬╛", Mystery: "├á┬ª┬░├á┬ª┬╣├á┬ª┬╕├á┬º┬ì├á┬ª┬»", Adventure: "├á┬ªΓÇª├á┬ª┬¡├á┬ª┬┐├á┬ª┬»├á┬ª┬╛├á┬ª┬¿",

  },
  Tamil: {
    Drama: "├á┬«┬¿├á┬«┬╛├á┬«┼╕├á┬«ΓÇó├á┬«┬«├á┬»┬ì", Comedy: "├á┬«┬¿├á┬«ΓÇó├á┬»╦å├á┬«┼í├á┬»┬ì├á┬«┼í├á┬»┬ü├á┬«┬╡├á┬»╦å", Horror: "├á┬«┬ñ├á┬«┬┐├á┬«ΓÇó├á┬«┬┐├á┬«┬▓├á┬»┬ì", Romance: "├á┬«ΓÇó├á┬«┬╛├á┬«┬ñ├á┬«┬▓├á┬»┬ì",
    "Sci-Fi": "├á┬«ΓÇª├á┬«┬▒├á┬«┬┐├á┬«┬╡├á┬«┬┐├á┬«┬»├á┬«┬▓├á┬»┬ì ├á┬«┬¬├á┬»┬ü├á┬«┬⌐├á┬»╦å├á┬«┬╡├á┬»┬ü", Fantasy: "├á┬«ΓÇó├á┬«┬▒├á┬»┬ì├á┬«┬¬├á┬«┬⌐├á┬»╦å", Mystery: "├á┬«┬«├á┬«┬░├á┬»┬ì├á┬«┬«├á┬«┬«├á┬»┬ì", Adventure: "├á┬«┼í├á┬«┬╛├á┬«ΓÇó├á┬«┼í├á┬«┬«├á┬»┬ì",
  },
  Telugu: {
    Drama: "├á┬░┬¿├á┬░┬╛├á┬░┼╕├á┬░ΓÇó├á┬░ΓÇÜ", Comedy: "├á┬░┬╣├á┬░┬╛├á┬░┬╕├á┬▒┬ì├á┬░┬»├á┬░ΓÇÜ", Horror: "├á┬░┬¡├á┬░┬»├á┬░┬╛├á┬░┬¿├á┬░ΓÇó├á┬░ΓÇÜ", Romance: "├á┬░┬¬├á┬▒┬ì├á┬░┬░├á┬▒ΓÇí├á┬░┬«",
    "Sci-Fi": "├á┬░┬╡├á┬░┬┐├á┬░┼ô├á┬▒┬ì├á┬░┼╛├á┬░┬╛├á┬░┬¿ ├á┬░ΓÇó├á┬░┬Ñ", Fantasy: "├á┬░ΓÇó├á┬░┬╛├á┬░┬▓├á┬▒┬ì├á┬░┬¬├á┬░┬¿├á┬░┬┐├á┬░ΓÇó├á┬░ΓÇÜ", Mystery: "├á┬░┬░├á┬░┬╣├á┬░┬╕├á┬▒┬ì├á┬░┬»├á┬░ΓÇÜ", Adventure: "├á┬░┬╕├á┬░┬╛├á┬░┬╣├á┬░┬╕├á┬░ΓÇÜ",
  },
  Marathi: {

    Drama: "αñ¿αñ╛αñƒαñò", Comedy: "αñ╡αñ┐αñ¿αÑïαñª", Horror: "αñ¡αñ»αñòαñÑαñ╛", Romance: "├á┬ñ┬¬├á┬Ñ┬ì├á┬ñ┬░├á┬ÑΓÇí├á┬ñ┬«├á┬ñΓÇó├á┬ñ┬Ñ├á┬ñ┬╛",
    "Sci-Fi": "├á┬ñ┬╡├á┬ñ┬┐├á┬ñ┼ô├á┬Ñ┬ì├á┬ñ┼╛├á┬ñ┬╛├á┬ñ┬¿├á┬ñΓÇó├á┬ñ┬Ñ├á┬ñ┬╛", Fantasy: "├á┬ñΓÇó├á┬ñ┬▓├á┬Ñ┬ì├á┬ñ┬¬├á┬ñ┬¿├á┬ñ┬╛├á┬ñ┬░├á┬ñ┬«├á┬Ñ┬ì├á┬ñ┬»", Mystery: "├á┬ñ┬░├á┬ñ┬╣├á┬ñ┬╕├á┬Ñ┬ì├á┬ñ┬»", Adventure: "αñ╕αñ╛αñ╣αñ╕",

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

    back: "├á┬ñ┬╡├á┬ñ┬╛├á┬ñ┬¬├á┬ñ┬╕", freeAccess: "3 ├á┬ñΓÇª├á┬ñ┬¿├á┬Ñ┬ü├á┬ñ┬░├á┬ÑΓÇ╣├á┬ñ┬º├á┬ÑΓÇ╣├á┬ñΓÇÜ ├á┬ñΓÇó├á┬ÑΓÇí ├á┬ñ┬▓├á┬ñ┬┐├á┬ñ┬Å ├á┬ñ┬«├á┬Ñ┬ü├á┬ñ┬½├á┬Ñ┬ì├á┬ñ┬ñ ├á┬ñΓÇ░├á┬ñ┬¬├á┬ñ┬»├á┬ÑΓÇ╣├á┬ñΓÇö", login: "├á┬ñ┬▓├á┬ÑΓÇ░├á┬ñΓÇö ├á┬ñΓÇí├á┬ñ┬¿", forMore: "├á┬ñΓÇ¥├á┬ñ┬░ ├á┬ñ┬¬├á┬ñ┬╛├á┬ñ┬¿├á┬ÑΓÇí ├á┬ñΓÇó├á┬ÑΓÇí ├á┬ñ┬▓├á┬ñ┬┐├á┬ñ┬Å!",
    perMonth: "├á┬ñ┬¬├á┬Ñ┬ì├á┬ñ┬░├á┬ñ┬ñ├á┬ñ┬┐ ├á┬ñ┬«├á┬ñ┬╛├á┬ñ┬╣", upgrade: "├á┬ñΓÇª├á┬ñ┬¬├á┬ñΓÇö├á┬Ñ┬ì├á┬ñ┬░├á┬ÑΓÇí├á┬ñ┬í", monthlyRequests: "├á┬ñΓÇí├á┬ñ┬╕ ├á┬ñ┬«├á┬ñ┬╛├á┬ñ┬╣ ├á┬ñΓÇó├á┬ÑΓÇí ├á┬ñΓÇª├á┬ñ┬¿├á┬Ñ┬ü├á┬ñ┬░├á┬ÑΓÇ╣├á┬ñ┬º", totalPosts: "├á┬ñΓÇó├á┬Ñ┬ü├á┬ñ┬▓ ├á┬ñ┬¬├á┬ÑΓÇ╣├á┬ñ┬╕├á┬Ñ┬ì├á┬ñ┼╕",
    titleStart: "├á┬ñΓÇª├á┬ñ┬¬├á┬ñ┬¿├á┬ÑΓÇí ├á┬ñ┬╡├á┬ñ┬┐├á┬ñ┼í├á┬ñ┬╛├á┬ñ┬░├á┬ÑΓÇ╣├á┬ñΓÇÜ ├á┬ñΓÇó├á┬ÑΓÇ╣ ├á┬ñ┬¼├á┬ñ┬ª├á┬ñ┬▓├á┬ÑΓÇí├á┬ñΓÇÜ", titleAccent: "├á┬ñΓÇª├á┬ñ┬ª├á┬Ñ┬ì├á┬ñ┬¡├á┬Ñ┬ü├á┬ñ┬ñ ├á┬ñΓÇó├á┬ñ┬╣├á┬ñ┬╛├á┬ñ┬¿├á┬ñ┬┐├á┬ñ┬»├á┬ÑΓÇ╣├á┬ñΓÇÜ ├á┬ñ┬«├á┬ÑΓÇí├á┬ñΓÇÜ!", length: "├á┬ñ┬▓├á┬ñΓÇÜ├á┬ñ┬¼├á┬ñ┬╛├á┬ñ╦å", language: "├á┬ñ┬¡├á┬ñ┬╛├á┬ñ┬╖├á┬ñ┬╛",
    short: "├á┬ñΓÇ║├á┬ÑΓÇ╣├á┬ñ┼╕├á┬ÑΓé¼", medium: "├á┬ñ┬«├á┬ñ┬º├á┬Ñ┬ì├á┬ñ┬»├á┬ñ┬«", long: "├á┬ñ┬▓├á┬ñΓÇÜ├á┬ñ┬¼├á┬ÑΓé¼", promptPlaceholder: "├á┬ñ┬╣├á┬ñ┬░ ├á┬ñ┬«├á┬ñ┬╣├á┬ñ┬╛├á┬ñ┬¿ ├á┬ñΓÇó├á┬ñ┬╣├á┬ñ┬╛├á┬ñ┬¿├á┬ÑΓé¼ ├á┬ñ┬Å├á┬ñΓÇó ├á┬ñ┬╡├á┬ñ┬┐├á┬ñ┼í├á┬ñ┬╛├á┬ñ┬░ ├á┬ñ┬╕├á┬ÑΓÇí ├á┬ñ┬╢├á┬Ñ┬ü├á┬ñ┬░├á┬ÑΓÇÜ ├á┬ñ┬╣├á┬ÑΓÇ╣├á┬ñ┬ñ├á┬ÑΓé¼ ├á┬ñ┬╣├á┬Ñ╦å├á┬Ñ┬ñ ├á┬ñΓÇá├á┬ñ┬¬├á┬ñΓÇó├á┬ñ┬╛ ├á┬ñ┬╡├á┬ñ┬┐├á┬ñ┼í├á┬ñ┬╛├á┬ñ┬░ ├á┬ñΓÇó├á┬Ñ┬ì├á┬ñ┬»├á┬ñ┬╛ ├á┬ñ┬╣├á┬Ñ╦å?",
    keyboardTip: "├á┬ñΓÇó├á┬ÑΓé¼├á┬ñ┬¼├á┬ÑΓÇ╣├á┬ñ┬░├á┬Ñ┬ì├á┬ñ┬í ├á┬ñ┬╕├á┬Ñ┬ü├á┬ñ┬¥├á┬ñ┬╛├á┬ñ┬╡:", press: "├á┬ñ┬ª├á┬ñ┬¼├á┬ñ┬╛├á┬ñ┬Å├á┬ñΓÇÜ", toGenerate: "├á┬ñ┬¼├á┬ñ┬¿├á┬ñ┬╛├á┬ñ┬¿├á┬ÑΓÇí ├á┬ñΓÇó├á┬ÑΓÇí ├á┬ñ┬▓├á┬ñ┬┐├á┬ñ┬Å", alsoWorks: "├á┬ñ┬¡├á┬ÑΓé¼ ├á┬ñΓÇó├á┬ñ┬╛├á┬ñ┬« ├á┬ñΓÇó├á┬ñ┬░├á┬ñ┬ñ├á┬ñ┬╛ ├á┬ñ┬╣├á┬Ñ╦å", forNewLine: "├á┬ñ┬¿├á┬ñ╦å ├á┬ñ┬¬├á┬ñΓÇÜ├á┬ñΓÇó├á┬Ñ┬ì├á┬ñ┬ñ├á┬ñ┬┐ ├á┬ñΓÇó├á┬ÑΓÇí ├á┬ñ┬▓├á┬ñ┬┐├á┬ñ┬Å",
    generating: "├á┬ñ┬¼├á┬ñ┬¿ ├á┬ñ┬░├á┬ñ┬╣├á┬ÑΓé¼ ├á┬ñ┬╣├á┬Ñ╦å...", generate: "├á┬ñ┬¼├á┬ñ┬¿├á┬ñ┬╛├á┬ñ┬Å├á┬ñΓÇÜ", examples: "├á┬ñΓÇí├á┬ñ┬¿ ├á┬ñΓÇ░├á┬ñ┬ª├á┬ñ┬╛├á┬ñ┬╣├á┬ñ┬░├á┬ñ┬ú ├á┬ñ┬╕├á┬ñΓÇÜ├á┬ñΓÇó├á┬ÑΓÇí├á┬ñ┬ñ├á┬ÑΓÇ╣├á┬ñΓÇÜ ├á┬ñΓÇó├á┬ñ┬╛ ├á┬ñΓÇ░├á┬ñ┬¬├á┬ñ┬»├á┬ÑΓÇ╣├á┬ñΓÇö ├á┬ñΓÇó├á┬ñ┬░├á┬ÑΓÇí├á┬ñΓÇÜ:",
    selectPrompt: "├á┬ñ┬Å├á┬ñΓÇó ├á┬ñ┬╕├á┬ñΓÇÜ├á┬ñΓÇó├á┬ÑΓÇí├á┬ñ┬ñ ├á┬ñ┼í├á┬Ñ┬ü├á┬ñ┬¿├á┬ÑΓÇí├á┬ñΓÇÜ", characterLimit: "├á┬ñΓÇª├á┬ñΓÇó├á┬Ñ┬ì├á┬ñ┬╖├á┬ñ┬░ ├á┬ñ┬╕├á┬ÑΓé¼├á┬ñ┬«├á┬ñ┬╛ ├á┬ñ┬¬├á┬ÑΓÇÜ├á┬ñ┬░├á┬ÑΓé¼ - ├á┬ñ┬¿├á┬ñ┬┐├á┬ñ┬░├á┬Ñ┬ì├á┬ñ┬«├á┬ñ┬╛├á┬ñ┬ú ├á┬ñΓÇª├á┬ñΓÇó├á┬Ñ┬ì├á┬ñ┬╖├á┬ñ┬« ├á┬ñ┬╣├á┬Ñ╦å", charactersRemaining: "├á┬ñΓÇª├á┬ñΓÇó├á┬Ñ┬ì├á┬ñ┬╖├á┬ñ┬░ ├á┬ñ┬╢├á┬ÑΓÇí├á┬ñ┬╖",
    shortcuts: "├á┬ñΓÇó├á┬ÑΓé¼├á┬ñ┬¼├á┬ÑΓÇ╣├á┬ñ┬░├á┬Ñ┬ì├á┬ñ┬í ├á┬ñ┬╢├á┬ÑΓÇ░├á┬ñ┬░├á┬Ñ┬ì├á┬ñ┼╕├á┬ñΓÇó├á┬ñ┼╕", openHelp: "├á┬ñ┬╕├á┬ñ┬╣├á┬ñ┬╛├á┬ñ┬»├á┬ñ┬ñ├á┬ñ┬╛ ├á┬ñΓÇô├á┬ÑΓÇ╣├á┬ñ┬▓├á┬ÑΓÇí├á┬ñΓÇÜ", closeHelp: "├á┬ñ┬╕├á┬ñ┬╣├á┬ñ┬╛├á┬ñ┬»├á┬ñ┬ñ├á┬ñ┬╛ ├á┬ñ┬¼├á┬ñΓÇÜ├á┬ñ┬ª ├á┬ñΓÇó├á┬ñ┬░├á┬ÑΓÇí├á┬ñΓÇÜ", focusPrompt: "├á┬ñ┬╕├á┬ñΓÇÜ├á┬ñΓÇó├á┬ÑΓÇí├á┬ñ┬ñ ├á┬ñ┬¬├á┬ñ┬░ ├á┬ñ┼ô├á┬ñ┬╛├á┬ñ┬Å├á┬ñΓÇÜ",
    generateStory: "├á┬ñΓÇó├á┬ñ┬╣├á┬ñ┬╛├á┬ñ┬¿├á┬ÑΓé¼ ├á┬ñ┬¼├á┬ñ┬¿├á┬ñ┬╛├á┬ñ┬Å├á┬ñΓÇÜ", publishStory: "├á┬ñΓÇó├á┬ñ┬╣├á┬ñ┬╛├á┬ñ┬¿├á┬ÑΓé¼ ├á┬ñ┬¬├á┬Ñ┬ì├á┬ñ┬░├á┬ñΓÇó├á┬ñ┬╛├á┬ñ┬╢├á┬ñ┬┐├á┬ñ┬ñ ├á┬ñΓÇó├á┬ñ┬░├á┬ÑΓÇí├á┬ñΓÇÜ", close: "├á┬ñ┬¼├á┬ñΓÇÜ├á┬ñ┬ª ├á┬ñΓÇó├á┬ñ┬░├á┬ÑΓÇí├á┬ñΓÇÜ", freeLimitReached: "├á┬ñ┬«├á┬Ñ┬ü├á┬ñ┬½├á┬Ñ┬ì├á┬ñ┬ñ ├á┬ñ┬╕├á┬ÑΓé¼├á┬ñ┬«├á┬ñ┬╛ ├á┬ñ┬¬├á┬ÑΓÇÜ├á┬ñ┬░├á┬ÑΓé¼",
    freeLimitMessage: "├á┬ñΓÇá├á┬ñ┬¬├á┬ñ┬¿├á┬ÑΓÇí ├á┬ñ┬╕├á┬ñ┬¡├á┬ÑΓé¼ 3 ├á┬ñ┬«├á┬Ñ┬ü├á┬ñ┬½├á┬Ñ┬ì├á┬ñ┬ñ ├á┬ñΓÇó├á┬ñ┬╣├á┬ñ┬╛├á┬ñ┬¿├á┬ÑΓé¼ ├á┬ñ┬¿├á┬ñ┬┐├á┬ñ┬░├á┬Ñ┬ì├á┬ñ┬«├á┬ñ┬╛├á┬ñ┬ú ├á┬ñΓÇ░├á┬ñ┬¬├á┬ñ┬»├á┬ÑΓÇ╣├á┬ñΓÇö ├á┬ñΓÇó├á┬ñ┬░ ├á┬ñ┬▓├á┬ñ┬┐├á┬ñ┬Å ├á┬ñ┬╣├á┬Ñ╦å├á┬ñΓÇÜ├á┬Ñ┬ñ ├á┬ñΓÇá├á┬ñΓÇö├á┬ÑΓÇí ├á┬ñ┼ô├á┬ñ┬╛├á┬ñ┬░├á┬ÑΓé¼ ├á┬ñ┬░├á┬ñΓÇô├á┬ñ┬¿├á┬ÑΓÇí ├á┬ñΓÇó├á┬ÑΓÇí ├á┬ñ┬▓├á┬ñ┬┐├á┬ñ┬Å ├á┬ñ┬▓├á┬ÑΓÇ░├á┬ñΓÇö ├á┬ñΓÇí├á┬ñ┬¿ ├á┬ñΓÇó├á┬ñ┬░├á┬ÑΓÇí├á┬ñΓÇÜ├á┬Ñ┬ñ", continueBrowsing: "├á┬ñ┬¼├á┬Ñ┬ì├á┬ñ┬░├á┬ñ┬╛├á┬ñΓÇ░├á┬ñ┼ô├á┬ñ┬╝ ├á┬ñΓÇó├á┬ñ┬░├á┬ñ┬¿├á┬ñ┬╛ ├á┬ñ┼ô├á┬ñ┬╛├á┬ñ┬░├á┬ÑΓé¼ ├á┬ñ┬░├á┬ñΓÇô├á┬ÑΓÇí├á┬ñΓÇÜ", recentPrompts: "├á┬ñ┬╣├á┬ñ┬╛├á┬ñ┬▓ ├á┬ñΓÇó├á┬ÑΓÇí ├á┬ñ┬╕├á┬ñΓÇÜ├á┬ñΓÇó├á┬ÑΓÇí├á┬ñ┬ñ", usePrompt: "├á┬ñΓÇ░├á┬ñ┬¬├á┬ñ┬»├á┬ÑΓÇ╣├á┬ñΓÇö ├á┬ñΓÇó├á┬ñ┬░├á┬ÑΓÇí├á┬ñΓÇÜ", delete: "├á┬ñ┬╣├á┬ñ┼╕├á┬ñ┬╛├á┬ñ┬Å├á┬ñΓÇÜ", clearAll: "├á┬ñ┬╕├á┬ñ┬¼ ├á┬ñ┬╕├á┬ñ┬╛├á┬ñ┬½ ├á┬ñΓÇó├á┬ñ┬░├á┬ÑΓÇí├á┬ñΓÇÜ", noRecentPrompts: "├á┬ñΓÇó├á┬ÑΓÇ╣├á┬ñ╦å ├á┬ñ┬╣├á┬ñ┬╛├á┬ñ┬▓ ├á┬ñΓÇó├á┬ÑΓÇí ├á┬ñ┬╕├á┬ñΓÇÜ├á┬ñΓÇó├á┬ÑΓÇí├á┬ñ┬ñ ├á┬ñ┬¿├á┬ñ┬╣├á┬ÑΓé¼├á┬ñΓÇÜ",

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
    back: "├ª╦å┬╗├úΓÇÜΓÇ╣", freeAccess: "3├ÑΓÇ║┼╛├ú┬ü┬╛├ú┬ü┬º├ºΓÇ₧┬í├ªΓÇôΓäó├ú┬ü┬º├Ñ╦å┬⌐├ºΓÇ¥┬¿├ú┬ü┬º├ú┬ü┬ì├ú┬ü┬╛├ú┬üΓäó", login: "├ú╞Æ┬¡├úΓÇÜ┬░├úΓÇÜ┬ñ├ú╞Æ┬│", forMore: "├ú┬üΓÇö├ú┬ü┬ª├ú┬üΓÇó├úΓÇÜΓÇ░├ú┬ü┬½├Ñ╦å┬⌐├ºΓÇ¥┬¿├»┬╝┬ü",
    perMonth: "├ª┼ô╦å├ú┬üΓÇ¥├ú┬ü┬¿", upgrade: "├úΓÇÜ┬ó├ú╞Æ╞Æ├ú╞ÆΓÇö├úΓÇÜ┬░├ú╞Æ┬¼├ú╞Æ┬╝├ú╞ÆΓÇ░", monthlyRequests: "├ñ┬╗┼á├ª┼ô╦å├ú┬ü┬«├ú╞Æ┬¬├úΓÇÜ┬»├úΓÇÜ┬¿├úΓÇÜ┬╣├ú╞Æ╦å", totalPosts: "├ª┼áΓÇó├º┬¿┬┐├ªΓÇó┬░",
    titleStart: "├úΓÇÜ┬ó├úΓÇÜ┬ñ├ú╞ÆΓÇí├úΓÇÜ┬ó├úΓÇÜΓÇÖ", titleAccent: "├ú┬üΓäó├ú┬ü┬░├úΓÇÜΓÇ░├ú┬üΓÇö├ú┬üΓÇ₧├ºΓÇ░┬⌐├¿┬¬┼╛├ú┬ü┬½├»┬╝┬ü", length: "├⌐ΓÇó┬╖├ú┬üΓÇó", language: "├¿┬¿Γé¼├¿┬¬┼╛",
    short: "├º┼╕┬¡├ú┬üΓÇ₧", medium: "├ñ┬╕┬¡├º┬¿ΓÇ╣├Ñ┬║┬ª", long: "├⌐ΓÇó┬╖├ú┬üΓÇ₧", promptPlaceholder: "├ú┬üΓäó├ú┬ü┬╣├ú┬ü┬ª├ú┬ü┬«├ºΓÇ░┬⌐├¿┬¬┼╛├ú┬ü┬»├ñ┬╕Γé¼├ú┬ü┬ñ├ú┬ü┬«├úΓÇÜ┬ó├úΓÇÜ┬ñ├ú╞ÆΓÇí├úΓÇÜ┬ó├ú┬üΓÇ╣├úΓÇÜΓÇ░├Ñ┬ºΓÇ╣├ú┬ü┬╛├úΓÇÜ┼á├ú┬ü┬╛├ú┬üΓäó├úΓé¼ΓÇÜ├ú┬üΓÇÜ├ú┬ü┬¬├ú┬ü┼╕├ú┬ü┬«├úΓÇÜ┬ó├úΓÇÜ┬ñ├ú╞ÆΓÇí├úΓÇÜ┬ó├ú┬ü┬»├»┬╝┼╕",
    keyboardTip: "├úΓÇÜ┬¡├ú╞Æ┬╝├ú╞Æ┼ô├ú╞Æ┬╝├ú╞ÆΓÇ░├ú┬ü┬«├ú╞ÆΓÇÖ├ú╞Æ┬│├ú╞Æ╦å:", press: "├ª┼á┬╝├ú┬üΓäó", toGenerate: "├ú┬ü┬º├ºΓÇ¥┼╕├ª╦å┬É", alsoWorks: "├úΓÇÜΓÇÜ├ñ┬╜┬┐├ºΓÇ¥┬¿├Ñ┬Å┬»├¿╞Æ┬╜", forNewLine: "├ú┬ü┬º├ªΓÇ¥┬╣├¿┬í┼Æ",
    generating: "├ºΓÇ¥┼╕├ª╦å┬É├ñ┬╕┬¡...", generate: "├ºΓÇ¥┼╕├ª╦å┬É", examples: "├Ñ┬ÅΓÇÜ├¿Γé¼╞Æ├ú┬ü┬½├ú┬ü┬º├ú┬ü┬ì├úΓÇÜΓÇ╣├ú╞ÆΓÇö├ú╞Æ┬¡├ú╞Æ┬│├ú╞ÆΓÇö├ú╞Æ╦å├ñ┬╛ΓÇ╣:",
    selectPrompt: "├ú╞ÆΓÇö├ú╞Æ┬¡├ú╞Æ┬│├ú╞ÆΓÇö├ú╞Æ╦å├úΓÇÜΓÇÖ├⌐┬ü┬╕├ª┼á┼╛", characterLimit: "├ªΓÇôΓÇí├Ñ┬¡ΓÇö├ªΓÇó┬░├ú┬ü┬«├ñ┬╕┼á├⌐Γäó┬É├ú┬ü┬½├⌐┬üΓÇ¥├ú┬üΓÇö├ú┬ü┬╛├ú┬üΓÇö├ú┬ü┼╕ - ├ºΓÇ¥┼╕├ª╦å┬É├ú┬ü┬º├ú┬ü┬ì├ú┬ü┬╛├ú┬üΓÇ║├úΓÇÜΓÇ£", charactersRemaining: "├ªΓÇôΓÇí├Ñ┬¡ΓÇö├ª┬«ΓÇ╣├úΓÇÜ┼á",
    shortcuts: "├úΓÇÜ┬¡├ú╞Æ┬╝├ú╞Æ┼ô├ú╞Æ┬╝├ú╞ÆΓÇ░├úΓÇÜ┬╖├ú╞Æ┬º├ú╞Æ┬╝├ú╞Æ╦å├úΓÇÜ┬½├ú╞Æ╞Æ├ú╞Æ╦å", openHelp: "├ú╞Æ╦£├ú╞Æ┬½├ú╞ÆΓÇö├úΓÇÜΓÇÖ├⌐ΓÇôΓÇ╣├ú┬ü┬Å", closeHelp: "├ú╞Æ╦£├ú╞Æ┬½├ú╞ÆΓÇö├úΓÇÜΓÇÖ├⌐ΓÇôΓÇ░├ú┬ü╦£├úΓÇÜΓÇ╣", focusPrompt: "├ú╞ÆΓÇö├ú╞Æ┬¡├ú╞Æ┬│├ú╞ÆΓÇö├ú╞Æ╦å├ú┬ü┬½├º┬º┬╗├ÑΓÇ╣ΓÇó",
    generateStory: "├ºΓÇ░┬⌐├¿┬¬┼╛├úΓÇÜΓÇÖ├ºΓÇ¥┼╕├ª╦å┬É", publishStory: "├ºΓÇ░┬⌐├¿┬¬┼╛├úΓÇÜΓÇÖ├ÑΓÇª┬¼├⌐ΓÇôΓÇ╣", close: "├⌐ΓÇôΓÇ░├ú┬ü╦£├úΓÇÜΓÇ╣", freeLimitReached: "├ºΓÇ₧┬í├ªΓÇôΓäó├ñ┬╕┼á├⌐Γäó┬É├ú┬ü┬½├⌐┬üΓÇ¥├ú┬üΓÇö├ú┬ü┬╛├ú┬üΓÇö├ú┬ü┼╕",
    freeLimitMessage: "├ºΓÇ₧┬í├ªΓÇôΓäó├ú┬ü┬«├ºΓÇ░┬⌐├¿┬¬┼╛├ºΓÇ¥┼╕├ª╦å┬É├úΓÇÜΓÇÖ3├ÑΓÇ║┼╛├ú┬üΓäó├ú┬ü┬╣├ú┬ü┬ª├ñ┬╜┬┐├ºΓÇ¥┬¿├ú┬üΓÇö├ú┬ü┬╛├ú┬üΓÇö├ú┬ü┼╕├úΓé¼ΓÇÜ├º┬╢┼í├ú┬üΓÇÿ├úΓÇÜΓÇ╣├ú┬ü┬½├ú┬ü┬»├ú╞Æ┬¡├úΓÇÜ┬░├úΓÇÜ┬ñ├ú╞Æ┬│├ú┬üΓÇö├ú┬ü┬ª├ú┬ü┬Å├ú┬ü┬á├ú┬üΓÇó├ú┬üΓÇ₧├úΓé¼ΓÇÜ", continueBrowsing: "├⌐ΓÇô┬▓├¿┬ª┬º├úΓÇÜΓÇÖ├º┬╢┼í├ú┬üΓÇÿ├úΓÇÜΓÇ╣", recentPrompts: "├ª┼ôΓé¼├¿┬┐ΓÇÿ├ú┬ü┬«├ú╞ÆΓÇö├ú╞Æ┬¡├ú╞Æ┬│├ú╞ÆΓÇö├ú╞Æ╦å", usePrompt: "├ñ┬╜┬┐├ºΓÇ¥┬¿", delete: "├ÑΓÇ░┼á├⌐Γäó┬ñ", clearAll: "├ú┬üΓäó├ú┬ü┬╣├ú┬ü┬ª├úΓÇÜ┬»├ú╞Æ┬¬├úΓÇÜ┬ó", noRecentPrompts: "├ª┼ôΓé¼├¿┬┐ΓÇÿ├ú┬ü┬«├ú╞ÆΓÇö├ú╞Æ┬¡├ú╞Æ┬│├ú╞ÆΓÇö├ú╞Æ╦å├ú┬ü┬»├ú┬üΓÇÜ├úΓÇÜ┼á├ú┬ü┬╛├ú┬üΓÇ║├úΓÇÜΓÇ£",
  },
  Korean: {

    back: "├½ΓÇÖ┬ñ├½┬í┼ô", freeAccess: "├¼┼íΓÇ¥├¼┬▓┬¡ 3├¡┼í┼Æ ├½┬¼┬┤├½┬ú┼Æ ├¼┬¥┬┤├¼┼í┬⌐", login: "├½┬í┼ô├¬┬╖┬╕├¼┬¥┬╕", forMore: "├¡ΓÇó╦£├¬┬│┬á ├½┬ìΓÇ¥ ├¼┬¥┬┤├¼┼í┬⌐├¡ΓÇó╦£├¼ΓÇ₧┬╕├¼┼íΓÇ¥!",
    perMonth: "├¼ΓÇ║ΓÇ¥├½┬│ΓÇ₧", upgrade: "├¼ΓÇöΓÇª├¬┬╖┬╕├½┬á╦å├¼┬¥┬┤├½ΓÇ£┼ô", monthlyRequests: "├¼┬¥┬┤├½┬▓╦å ├½ΓÇ╣┬¼ ├¼┼íΓÇ¥├¼┬▓┬¡", totalPosts: "├¼┬áΓÇ₧├¼┬▓┬┤ ├¬┬▓┼Æ├¼ΓÇ╣┼ô├½┬¼┬╝",
    titleStart: "├¼ΓÇóΓÇ₧├¼┬¥┬┤├½ΓÇ¥ΓÇ¥├¼ΓÇô┬┤├½┬Ñ┬╝", titleAccent: "├½┬⌐ΓÇ╣├¼┬ºΓÇ₧ ├¼┬¥┬┤├¼ΓÇó┬╝├¬┬╕┬░├½┬í┼ô!", length: "├¬┬╕┬╕├¼┬¥┬┤", language: "├¼ΓÇô┬╕├¼ΓÇô┬┤",
    short: "├¼┬º┬º├¬┬▓┼Æ", medium: "├¼┬ñΓÇÿ├¬┬░ΓÇ₧", long: "├¬┬╕┬╕├¬┬▓┼Æ", promptPlaceholder: "├½┬¬┬¿├½ΓÇ£┬á ├¡ΓÇ║┼Æ├½┬Ñ┬¡├¡ΓÇó┼ô ├¼┬¥┬┤├¼ΓÇó┬╝├¬┬╕┬░├½┼áΓÇ¥ ├¡ΓÇó╦£├½ΓÇÜ╦£├¼┬¥╦£ ├¼ΓÇóΓÇ₧├¼┬¥┬┤├½ΓÇ¥ΓÇ¥├¼ΓÇô┬┤├¼ΓÇö┬É├¼ΓÇ₧┼ô ├¼ΓÇ╣┼ô├¼┼╛ΓÇÿ├½┬É┬⌐├½ΓÇ╣╦å├½ΓÇ╣┬ñ. ├½ΓÇ╣┬╣├¼ΓÇ╣┬á├¼┬¥╦£ ├¼ΓÇóΓÇ₧├¼┬¥┬┤├½ΓÇ¥ΓÇ¥├¼ΓÇô┬┤├½┼áΓÇ¥?",
    keyboardTip: "├¡ΓÇÜ┬ñ├½┬│┬┤├½ΓÇ£┼ô ├¡┼Æ┬ü:", press: "├½╦åΓÇ₧├½┬Ñ┬┤├¬┬╕┬░", toGenerate: "├¼╞Æ┬¥├¼ΓÇ₧┬▒", alsoWorks: "├½┬ÅΓÇ₧ ├¬┬░Γé¼├½┼á┬Ñ", forNewLine: "├¼╞Æ╦å ├¼┬ñΓÇ₧",
    generating: "├¼╞Æ┬¥├¼ΓÇ₧┬▒ ├¼┬ñΓÇÿ...", generate: "├¼╞Æ┬¥├¼ΓÇ₧┬▒", examples: "├¼┬░┬╕├¬┬│┬á├¡ΓÇó┬á ├¼╦å╦£ ├¼┼╛╦å├½┼áΓÇ¥ ├¡ΓÇ¥ΓÇ₧├½┬í┬¼├¡ΓÇ¥ΓÇ₧├¡┼á┬╕ ├¼╦£╦å├¼ΓÇ╣┼ô:",
    selectPrompt: "├¡ΓÇ¥ΓÇ₧├½┬í┬¼├¡ΓÇ¥ΓÇ₧├¡┼á┬╕ ├¼ΓÇ₧┬á├¡╞Æ┬¥", characterLimit: "├¬┬╕Γé¼├¼┼╛┬É ├¼╦å╦£ ├¼┬á┼ô├¡ΓÇó┼ô ├½┬ÅΓÇ₧├½ΓÇ╣┬¼ - ├¼╞Æ┬¥├¼ΓÇ₧┬▒├¡ΓÇó┬á ├¼╦å╦£ ├¼ΓÇöΓÇá├¼┼á┬╡├½ΓÇ╣╦å├½ΓÇ╣┬ñ", charactersRemaining: "├¬┬╕Γé¼├¼┼╛┬É ├½ΓÇÜ┬¿├¼┬¥┼Æ",
    shortcuts: "├¡ΓÇÜ┬ñ├½┬│┬┤├½ΓÇ£┼ô ├½ΓÇ╣┬¿├¼┬╢ΓÇó├¡ΓÇÜ┬ñ", openHelp: "├½┬ÅΓÇ₧├¼ΓÇ║Γé¼├½┬º┬É ├¼ΓÇö┬┤├¬┬╕┬░", closeHelp: "├½┬ÅΓÇ₧├¼ΓÇ║Γé¼├½┬º┬É ├½ΓÇ╣┬½├¬┬╕┬░", focusPrompt: "├¡ΓÇ¥ΓÇ₧├½┬í┬¼├¡ΓÇ¥ΓÇ₧├¡┼á┬╕├¼ΓÇö┬É ├¼┬┤╦å├¼┬á┬É",
    generateStory: "├¼┬¥┬┤├¼ΓÇó┬╝├¬┬╕┬░ ├¼╞Æ┬¥├¼ΓÇ₧┬▒", publishStory: "├¼┬¥┬┤├¼ΓÇó┬╝├¬┬╕┬░ ├¬┬▓┼Æ├¼ΓÇ╣┼ô", close: "├½ΓÇ╣┬½├¬┬╕┬░", freeLimitReached: "├½┬¼┬┤├½┬ú┼Æ ├¡ΓÇó┼ô├½┬ÅΓÇ₧ ├½┬ÅΓÇ₧├½ΓÇ╣┬¼",
    freeLimitMessage: "├½┬¼┬┤├½┬ú┼Æ ├¼┬¥┬┤├¼ΓÇó┬╝├¬┬╕┬░ ├¼╞Æ┬¥├¼ΓÇ₧┬▒ 3├¡┼í┼Æ├½┬Ñ┬╝ ├½┬¬┬¿├½ΓÇÿ┬É ├¼ΓÇÜ┬¼├¼┼í┬⌐├¡ΓÇô╦å├¼┼á┬╡├½ΓÇ╣╦å├½ΓÇ╣┬ñ. ├¬┬│ΓÇ₧├¼ΓÇá┬ì├¡ΓÇó╦£├½┬á┬ñ├½┬⌐┬┤ ├½┬í┼ô├¬┬╖┬╕├¼┬¥┬╕├¡ΓÇó╦£├¼ΓÇ₧┬╕├¼┼íΓÇ¥.", continueBrowsing: "├¬┬│ΓÇ₧├¼ΓÇá┬ì ├½ΓÇÿ╦£├½┼╕┬¼├½┬│┬┤├¬┬╕┬░", recentPrompts: "├¼┬╡┼ô├¬┬╖┬╝ ├¡ΓÇ¥ΓÇ₧├½┬í┬¼├¡ΓÇ¥ΓÇ₧├¡┼á┬╕", usePrompt: "├¼ΓÇÜ┬¼├¼┼í┬⌐", delete: "├¼ΓÇÜ┬¡├¼┬á┼ô", clearAll: "├½┬¬┬¿├½ΓÇÿ┬É ├¼┬ºΓé¼├¼┼í┬░├¬┬╕┬░", noRecentPrompts: "├¼┬╡┼ô├¬┬╖┬╝ ├¡ΓÇ¥ΓÇ₧├½┬í┬¼├¡ΓÇ¥ΓÇ₧├¡┼á┬╕├¬┬░Γé¼ ├¼ΓÇöΓÇá├¼┼á┬╡├½ΓÇ╣╦å├½ΓÇ╣┬ñ",
  },
  Bengali: {
    back: "├á┬ª┬½├á┬ª┬┐├á┬ª┬░├á┬ºΓÇí ├á┬ª┬»├á┬ª┬╛├á┬ª┬¿", freeAccess: "├á┬º┬⌐├á┬ª┼╕├á┬ª┬┐ ├á┬ªΓÇª├á┬ª┬¿├á┬º┬ü├á┬ª┬░├á┬ºΓÇ╣├á┬ª┬º├á┬ºΓÇí├á┬ª┬░ ├á┬ª┼ô├á┬ª┬¿├á┬º┬ì├á┬ª┬» ├á┬ª┬¼├á┬ª┬┐├á┬ª┬¿├á┬ª┬╛├á┬ª┬«├á┬ºΓÇÜ├á┬ª┬▓├á┬º┬ì├á┬ª┬»├á┬ºΓÇí ├á┬ª┬¼├á┬º┬ì├á┬ª┬»├á┬ª┬¼├á┬ª┬╣├á┬ª┬╛├á┬ª┬░", login: "├á┬ª┬▓├á┬ªΓÇö ├á┬ªΓÇí├á┬ª┬¿", forMore: "├á┬ªΓÇó├á┬ª┬░├á┬ºΓÇí ├á┬ªΓÇá├á┬ª┬░├á┬ªΓÇ£ ├á┬ª┬¬├á┬ª┬╛├á┬ª┬¿!",
    perMonth: "├á┬ª┬¬├á┬º┬ì├á┬ª┬░├á┬ª┬ñ├á┬ª┬┐ ├á┬ª┬«├á┬ª┬╛├á┬ª┬╕├á┬ºΓÇí", upgrade: "├á┬ªΓÇá├á┬ª┬¬├á┬ªΓÇö├á┬º┬ì├á┬ª┬░├á┬ºΓÇí├á┬ª┬í", monthlyRequests: "├á┬ª┬Å├á┬ªΓÇí ├á┬ª┬«├á┬ª┬╛├á┬ª┬╕├á┬ºΓÇí├á┬ª┬░ ├á┬ªΓÇª├á┬ª┬¿├á┬º┬ü├á┬ª┬░├á┬ºΓÇ╣├á┬ª┬º", totalPosts: "├á┬ª┬«├á┬ºΓÇ╣├á┬ª┼╕ ├á┬ª┬¬├á┬ºΓÇ╣├á┬ª┬╕├á┬º┬ì├á┬ª┼╕",
    titleStart: "├á┬ªΓÇá├á┬ª┬¬├á┬ª┬¿├á┬ª┬╛├á┬ª┬░ ├á┬ª┬¡├á┬ª┬╛├á┬ª┬¼├á┬ª┬¿├á┬ª┬╛├á┬ªΓÇó├á┬ºΓÇí ├á┬ª┬¼├á┬ª┬ª├á┬ª┬▓├á┬ºΓÇí ├á┬ª┬ª├á┬ª┬┐├á┬ª┬¿", titleAccent: "├á┬ªΓÇª├á┬ª┬╕├á┬ª┬╛├á┬ª┬º├á┬ª┬╛├á┬ª┬░├á┬ª┬ú ├á┬ªΓÇö├á┬ª┬▓├á┬º┬ì├á┬ª┬¬├á┬ºΓÇí!", length: "├á┬ª┬ª├á┬º╦å├á┬ª┬░├á┬º┬ì├á┬ª╦£├á┬º┬ì├á┬ª┬»", language: "├á┬ª┬¡├á┬ª┬╛├á┬ª┬╖├á┬ª┬╛",
    short: "├á┬ªΓÇ║├á┬ºΓÇ╣├á┬ª┼╕", medium: "├á┬ª┬«├á┬ª┬╛├á┬ª┬¥├á┬ª┬╛├á┬ª┬░├á┬ª┬┐", long: "├á┬ª┬▓├á┬ª┬«├á┬º┬ì├á┬ª┬¼├á┬ª┬╛", promptPlaceholder: "├á┬ª┬¬├á┬º┬ì├á┬ª┬░├á┬ª┬ñ├á┬ª┬┐├á┬ª┼╕├á┬ª┬┐ ├á┬ª┬«├á┬ª┬╣├á┬ª┬╛├á┬ª┬¿ ├á┬ªΓÇö├á┬ª┬▓├á┬º┬ì├á┬ª┬¬ ├á┬ª┬Å├á┬ªΓÇó├á┬ª┼╕├á┬ª┬┐ ├á┬ª┬¡├á┬ª┬╛├á┬ª┬¼├á┬ª┬¿├á┬ª┬╛ ├á┬ª┬ª├á┬ª┬┐├á┬ª┬»├á┬ª┬╝├á┬ºΓÇí ├á┬ª┬╢├á┬º┬ü├á┬ª┬░├á┬º┬ü ├á┬ª┬╣├á┬ª┬»├á┬ª┬╝├á┬Ñ┬ñ ├á┬ªΓÇá├á┬ª┬¬├á┬ª┬¿├á┬ª┬╛├á┬ª┬░├á┬ª┼╕├á┬ª┬┐ ├á┬ªΓÇó├á┬ºΓé¼?",
    keyboardTip: "├á┬ªΓÇó├á┬ºΓé¼├á┬ª┬¼├á┬ºΓÇ╣├á┬ª┬░├á┬º┬ì├á┬ª┬í ├á┬ª┼╕├á┬ª┬┐├á┬ª┬¬:", press: "├á┬ª┼í├á┬ª┬╛├á┬ª┬¬├á┬º┬ü├á┬ª┬¿", toGenerate: "├á┬ª┬ñ├á┬º╦å├á┬ª┬░├á┬ª┬┐ ├á┬ªΓÇó├á┬ª┬░├á┬ª┬ñ├á┬ºΓÇí", alsoWorks: "├á┬ª┬Å├á┬ª┼╕├á┬ª┬┐├á┬ªΓÇ£ ├á┬ªΓÇó├á┬ª┬╛├á┬ª┼ô ├á┬ªΓÇó├á┬ª┬░├á┬ºΓÇí", forNewLine: "├á┬ª┬¿├á┬ª┬ñ├á┬º┬ü├á┬ª┬¿ ├á┬ª┬▓├á┬ª┬╛├á┬ªΓÇí├á┬ª┬¿├á┬ºΓÇí├á┬ª┬░ ├á┬ª┼ô├á┬ª┬¿├á┬º┬ì├á┬ª┬»",
    generating: "├á┬ª┬ñ├á┬º╦å├á┬ª┬░├á┬ª┬┐ ├á┬ª┬╣├á┬ª┼í├á┬º┬ì├á┬ªΓÇ║├á┬ºΓÇí...", generate: "├á┬ª┬ñ├á┬º╦å├á┬ª┬░├á┬ª┬┐ ├á┬ªΓÇó├á┬ª┬░├á┬º┬ü├á┬ª┬¿", examples: "├á┬ªΓÇó├á┬ª┬┐├á┬ªΓÇ║├á┬º┬ü ├á┬ªΓÇ░├á┬ª┬ª├á┬ª┬╛├á┬ª┬╣├á┬ª┬░├á┬ª┬ú ├á┬ª┬¬├á┬º┬ì├á┬ª┬░├á┬ª┬«├á┬º┬ì├á┬ª┬¬├á┬ª┼╕:",
    selectPrompt: "├á┬ª┬Å├á┬ªΓÇó├á┬ª┼╕├á┬ª┬┐ ├á┬ª┬¬├á┬º┬ì├á┬ª┬░├á┬ª┬«├á┬º┬ì├á┬ª┬¬├á┬ª┼╕ ├á┬ª┬¼├á┬ºΓÇí├á┬ªΓÇ║├á┬ºΓÇí ├á┬ª┬¿├á┬ª┬┐├á┬ª┬¿", characterLimit: "├á┬ªΓÇª├á┬ªΓÇó├á┬º┬ì├á┬ª┬╖├á┬ª┬░├á┬ºΓÇí├á┬ª┬░ ├á┬ª┬╕├á┬ºΓé¼├á┬ª┬«├á┬ª┬╛ ├á┬ª┬¬├á┬ºΓÇÜ├á┬ª┬░├á┬º┬ì├á┬ª┬ú - ├á┬ª┬ñ├á┬º╦å├á┬ª┬░├á┬ª┬┐ ├á┬ª┬¼├á┬ª┬¿├á┬º┬ì├á┬ª┬º", charactersRemaining: "├á┬ªΓÇª├á┬ªΓÇó├á┬º┬ì├á┬ª┬╖├á┬ª┬░ ├á┬ª┬¼├á┬ª┬╛├á┬ªΓÇó├á┬ª┬┐",
    shortcuts: "├á┬ªΓÇó├á┬ºΓé¼├á┬ª┬¼├á┬ºΓÇ╣├á┬ª┬░├á┬º┬ì├á┬ª┬í ├á┬ª┬╢├á┬ª┬░├á┬º┬ì├á┬ª┼╕├á┬ªΓÇó├á┬ª┬╛├á┬ª┼╕", openHelp: "├á┬ª┬╕├á┬ª┬╣├á┬ª┬╛├á┬ª┬»├á┬ª┬╝├á┬ª┬ñ├á┬ª┬╛ ├á┬ªΓÇô├á┬º┬ü├á┬ª┬▓├á┬º┬ü├á┬ª┬¿", closeHelp: "├á┬ª┬╕├á┬ª┬╣├á┬ª┬╛├á┬ª┬»├á┬ª┬╝├á┬ª┬ñ├á┬ª┬╛ ├á┬ª┬¼├á┬ª┬¿├á┬º┬ì├á┬ª┬º ├á┬ªΓÇó├á┬ª┬░├á┬º┬ü├á┬ª┬¿", focusPrompt: "├á┬ª┬¬├á┬º┬ì├á┬ª┬░├á┬ª┬«├á┬º┬ì├á┬ª┬¬├á┬ª┼╕├á┬ºΓÇí ├á┬ª┬»├á┬ª┬╛├á┬ª┬¿",
    generateStory: "├á┬ªΓÇö├á┬ª┬▓├á┬º┬ì├á┬ª┬¬ ├á┬ª┬ñ├á┬º╦å├á┬ª┬░├á┬ª┬┐ ├á┬ªΓÇó├á┬ª┬░├á┬º┬ü├á┬ª┬¿", publishStory: "├á┬ªΓÇö├á┬ª┬▓├á┬º┬ì├á┬ª┬¬ ├á┬ª┬¬├á┬º┬ì├á┬ª┬░├á┬ªΓÇó├á┬ª┬╛├á┬ª┬╢ ├á┬ªΓÇó├á┬ª┬░├á┬º┬ü├á┬ª┬¿", close: "├á┬ª┬¼├á┬ª┬¿├á┬º┬ì├á┬ª┬º ├á┬ªΓÇó├á┬ª┬░├á┬º┬ü├á┬ª┬¿", freeLimitReached: "├á┬ª┬¼├á┬ª┬┐├á┬ª┬¿├á┬ª┬╛├á┬ª┬«├á┬ºΓÇÜ├á┬ª┬▓├á┬º┬ì├á┬ª┬»├á┬ºΓÇí├á┬ª┬░ ├á┬ª┬╕├á┬ºΓé¼├á┬ª┬«├á┬ª┬╛ ├á┬ª┬¬├á┬ºΓÇÜ├á┬ª┬░├á┬º┬ì├á┬ª┬ú",
    freeLimitMessage: "├á┬ªΓÇá├á┬ª┬¬├á┬ª┬¿├á┬ª┬┐ ├á┬º┬⌐├á┬ª┼╕├á┬ª┬┐ ├á┬ª┬¼├á┬ª┬┐├á┬ª┬¿├á┬ª┬╛├á┬ª┬«├á┬ºΓÇÜ├á┬ª┬▓├á┬º┬ì├á┬ª┬»├á┬ºΓÇí├á┬ª┬░ ├á┬ªΓÇö├á┬ª┬▓├á┬º┬ì├á┬ª┬¬ ├á┬ª┬ñ├á┬º╦å├á┬ª┬░├á┬ª┬┐ ├á┬ª┬¼├á┬º┬ì├á┬ª┬»├á┬ª┬¼├á┬ª┬╣├á┬ª┬╛├á┬ª┬░ ├á┬ªΓÇó├á┬ª┬░├á┬ºΓÇí├á┬ªΓÇ║├á┬ºΓÇí├á┬ª┬¿├á┬Ñ┬ñ ├á┬ª┼í├á┬ª┬╛├á┬ª┬▓├á┬ª┬┐├á┬ª┬»├á┬ª┬╝├á┬ºΓÇí ├á┬ª┬»├á┬ºΓÇí├á┬ª┬ñ├á┬ºΓÇí ├á┬ª┬▓├á┬ªΓÇö ├á┬ªΓÇí├á┬ª┬¿ ├á┬ªΓÇó├á┬ª┬░├á┬º┬ü├á┬ª┬¿├á┬Ñ┬ñ", continueBrowsing: "├á┬ª┬¼├á┬º┬ì├á┬ª┬░├á┬ª┬╛├á┬ªΓÇ░├á┬ª┼ô ├á┬ª┼í├á┬ª┬╛├á┬ª┬▓├á┬ª┬┐├á┬ª┬»├á┬ª┬╝├á┬ºΓÇí ├á┬ª┬»├á┬ª┬╛├á┬ª┬¿", recentPrompts: "├á┬ª┬╕├á┬ª┬«├á┬º┬ì├á┬ª┬¬├á┬º┬ì├á┬ª┬░├á┬ª┬ñ├á┬ª┬┐ ├á┬ª┬¼├á┬º┬ì├á┬ª┬»├á┬ª┬¼├á┬ª┬╣├á┬º╞Æ├á┬ª┬ñ ├á┬ª┬¬├á┬º┬ì├á┬ª┬░├á┬ª┬«├á┬º┬ì├á┬ª┬¬├á┬ª┼╕", usePrompt: "├á┬ª┬¼├á┬º┬ì├á┬ª┬»├á┬ª┬¼├á┬ª┬╣├á┬ª┬╛├á┬ª┬░ ├á┬ªΓÇó├á┬ª┬░├á┬º┬ü├á┬ª┬¿", delete: "├á┬ª┬«├á┬º┬ü├á┬ªΓÇ║├á┬ºΓÇí ├á┬ª┬½├á┬ºΓÇí├á┬ª┬▓├á┬º┬ü├á┬ª┬¿", clearAll: "├á┬ª┬╕├á┬ª┬¼ ├á┬ª┬«├á┬º┬ü├á┬ªΓÇ║├á┬ºΓÇí ├á┬ª┬ª├á┬ª┬┐├á┬ª┬¿", noRecentPrompts: "├á┬ªΓÇó├á┬ºΓÇ╣├á┬ª┬¿├á┬ºΓÇ╣ ├á┬ª┬╕├á┬ª┬«├á┬º┬ì├á┬ª┬¬├á┬º┬ì├á┬ª┬░├á┬ª┬ñ├á┬ª┬┐ ├á┬ª┬¼├á┬º┬ì├á┬ª┬»├á┬ª┬¼├á┬ª┬╣├á┬º╞Æ├á┬ª┬ñ ├á┬ª┬¬├á┬º┬ì├á┬ª┬░├á┬ª┬«├á┬º┬ì├á┬ª┬¬├á┬ª┼╕ ├á┬ª┬¿├á┬ºΓÇí├á┬ªΓÇí",
  },
  Tamil: {
    back: "├á┬«┬ñ├á┬«┬┐├á┬«┬░├á┬»┬ü├á┬«┬«├á┬»┬ì├á┬«┬¬├á┬»┬ü", freeAccess: "3 ├á┬«ΓÇó├á┬»ΓÇ╣├á┬«┬░├á┬«┬┐├á┬«ΓÇó├á┬»┬ì├á┬«ΓÇó├á┬»╦å├á┬«ΓÇó├á┬«┬│├á┬»┬ü├á┬«ΓÇó├á┬»┬ì├á┬«ΓÇó├á┬»┬ü ├á┬«ΓÇí├á┬«┬▓├á┬«┬╡├á┬«┼í ├á┬«ΓÇª├á┬«┬ú├á┬»┬ü├á┬«ΓÇó├á┬«┬▓├á┬»┬ì", login: "├á┬«ΓÇ░├á┬«┬│├á┬»┬ì├á┬«┬¿├á┬»┬ü├á┬«┬┤├á┬»╦å", forMore: "├á┬«┼í├á┬»ΓÇá├á┬«┬»├á┬»┬ì├á┬«┬ñ├á┬»┬ü ├á┬«┬«├á┬»ΓÇí├á┬«┬▓├á┬»┬ü├á┬«┬«├á┬»┬ì ├á┬«┬¬├á┬»ΓÇá├á┬«┬▒├á┬»┬ü├á┬«Γäó├á┬»┬ì├á┬«ΓÇó├á┬«┬│├á┬»┬ì!",
    perMonth: "├á┬«┬«├á┬«┬╛├á┬«┬ñ├á┬«┬ñ├á┬»┬ì├á┬«┬ñ├á┬«┬┐├á┬«┬▒├á┬»┬ì├á┬«ΓÇó├á┬»┬ü", upgrade: "├á┬«┬«├á┬»ΓÇí├á┬«┬«├á┬»┬ì├á┬«┬¬├á┬«┼╕├á┬»┬ü├á┬«┬ñ├á┬»┬ì├á┬«┬ñ├á┬»┬ü", monthlyRequests: "├á┬«ΓÇí├á┬«┬¿├á┬»┬ì├á┬«┬ñ ├á┬«┬«├á┬«┬╛├á┬«┬ñ ├á┬«ΓÇó├á┬»ΓÇ╣├á┬«┬░├á┬«┬┐├á┬«ΓÇó├á┬»┬ì├á┬«ΓÇó├á┬»╦å├á┬«ΓÇó├á┬«┬│├á┬»┬ì", totalPosts: "├á┬«┬«├á┬»┼á├á┬«┬ñ├á┬»┬ì├á┬«┬ñ ├á┬«┬¬├á┬«┬ñ├á┬«┬┐├á┬«┬╡├á┬»┬ü├á┬«ΓÇó├á┬«┬│├á┬»┬ì",
    titleStart: "├á┬«ΓÇ░├á┬«Γäó├á┬»┬ì├á┬«ΓÇó├á┬«┬│├á┬»┬ì ├á┬«┼╜├á┬«┬ú├á┬»┬ì├á┬«┬ú├á┬«Γäó├á┬»┬ì├á┬«ΓÇó├á┬«┬│├á┬»╦å", titleAccent: "├á┬«ΓÇª├á┬«┬▒├á┬»┬ì├á┬«┬¬├á┬»┬ü├á┬«┬ñ ├á┬«ΓÇó├á┬«┬ñ├á┬»╦å├á┬«ΓÇó├á┬«┬│├á┬«┬╛├á┬«ΓÇó ├á┬«┬«├á┬«┬╛├á┬«┬▒├á┬»┬ì├á┬«┬▒├á┬»┬ü├á┬«Γäó├á┬»┬ì├á┬«ΓÇó├á┬«┬│├á┬»┬ì!", length: "├á┬«┬¿├á┬»Γé¼├á┬«┬│├á┬«┬«├á┬»┬ì", language: "├á┬«┬«├á┬»┼á├á┬«┬┤├á┬«┬┐",
    short: "├á┬«┼í├á┬«┬┐├á┬«┬▒├á┬«┬┐├á┬«┬»├á┬«┬ñ├á┬»┬ü", medium: "├á┬«┬¿├á┬«┼╕├á┬»┬ü├á┬«┬ñ├á┬»┬ì├á┬«┬ñ├á┬«┬░├á┬«┬«├á┬»┬ì", long: "├á┬«┬¿├á┬»Γé¼├á┬«┬│├á┬«┬«├á┬«┬╛├á┬«┬⌐├á┬«┬ñ├á┬»┬ü", promptPlaceholder: "├á┬«ΓÇÖ├á┬«┬╡├á┬»┬ì├á┬«┬╡├á┬»┼á├á┬«┬░├á┬»┬ü ├á┬«┼í├á┬«┬┐├á┬«┬▒├á┬«┬¿├á┬»┬ì├á┬«┬ñ ├á┬«ΓÇó├á┬«┬ñ├á┬»╦å├á┬«┬»├á┬»┬ü├á┬«┬«├á┬»┬ì ├á┬«ΓÇÖ├á┬«┬░├á┬»┬ü ├á┬«┼╜├á┬«┬ú├á┬»┬ì├á┬«┬ú├á┬«┬ñ├á┬»┬ì├á┬«┬ñ├á┬«┬┐├á┬«┬▓├á┬»┬ì ├á┬«┬ñ├á┬»┼á├á┬«┼╕├á┬«Γäó├á┬»┬ì├á┬«ΓÇó├á┬»┬ü├á┬«ΓÇó├á┬«┬┐├á┬«┬▒├á┬«┬ñ├á┬»┬ü. ├á┬«ΓÇ░├á┬«Γäó├á┬»┬ì├á┬«ΓÇó├á┬«┬│├á┬»┬ü├á┬«┼╕├á┬»╦å├á┬«┬»├á┬«┬ñ├á┬»┬ü ├á┬«┼╜├á┬«┬⌐├á┬»┬ì├á┬«┬⌐?",
    keyboardTip: "├á┬«┬╡├á┬«┬┐├á┬«┼í├á┬»╦å├á┬«┬¬├á┬»┬ì├á┬«┬¬├á┬«┬▓├á┬«ΓÇó├á┬»╦å ├á┬«ΓÇó├á┬»┬ü├á┬«┬▒├á┬«┬┐├á┬«┬¬├á┬»┬ì├á┬«┬¬├á┬»┬ü:", press: "├á┬«ΓÇª├á┬«┬┤├á┬»┬ü├á┬«┬ñ├á┬»┬ì├á┬«┬ñ├á┬«┬╡├á┬»┬ü├á┬«┬«├á┬»┬ì", toGenerate: "├á┬«ΓÇ░├á┬«┬░├á┬»┬ü├á┬«┬╡├á┬«┬╛├á┬«ΓÇó├á┬»┬ì├á┬«ΓÇó", alsoWorks: "├á┬«ΓÇí├á┬«┬ñ├á┬»┬ü├á┬«┬╡├á┬»┬ü├á┬«┬«├á┬»┬ì ├á┬«┼í├á┬»ΓÇá├á┬«┬»├á┬«┬▓├á┬»┬ì├á┬«┬¬├á┬«┼╕├á┬»┬ü├á┬«┬«├á┬»┬ì", forNewLine: "├á┬«┬¬├á┬»┬ü├á┬«┬ñ├á┬«┬┐├á┬«┬» ├á┬«┬╡├á┬«┬░├á┬«┬┐├á┬«ΓÇó├á┬»┬ì├á┬«ΓÇó├á┬»┬ü",
    generating: "├á┬«ΓÇ░├á┬«┬░├á┬»┬ü├á┬«┬╡├á┬«┬╛├á┬«ΓÇó├á┬»┬ì├á┬«ΓÇó├á┬»┬ü├á┬«ΓÇó├á┬«┬┐├á┬«┬▒├á┬«┬ñ├á┬»┬ü...", generate: "├á┬«ΓÇ░├á┬«┬░├á┬»┬ü├á┬«┬╡├á┬«┬╛├á┬«ΓÇó├á┬»┬ì├á┬«ΓÇó├á┬»┬ü", examples: "├á┬«┼í├á┬«┬┐├á┬«┬▓ ├á┬«┼╜├á┬«┼╕├á┬»┬ü├á┬«┬ñ├á┬»┬ì├á┬«┬ñ├á┬»┬ü├á┬«ΓÇó├á┬»┬ì├á┬«ΓÇó├á┬«┬╛├á┬«┼╕├á┬»┬ì├á┬«┼╕├á┬»┬ü ├á┬«ΓÇó├á┬»┬ü├á┬«┬▒├á┬«┬┐├á┬«┬¬├á┬»┬ì├á┬«┬¬├á┬»┬ü├á┬«ΓÇó├á┬«┬│├á┬»┬ì:",
    selectPrompt: "├á┬«ΓÇÖ├á┬«┬░├á┬»┬ü ├á┬«ΓÇó├á┬»┬ü├á┬«┬▒├á┬«┬┐├á┬«┬¬├á┬»┬ì├á┬«┬¬├á┬»╦å ├á┬«┬ñ├á┬»ΓÇí├á┬«┬░├á┬»┬ì├á┬«┬╡├á┬»┬ü ├á┬«┼í├á┬»ΓÇá├á┬«┬»├á┬»┬ì├á┬«ΓÇó", characterLimit: "├á┬«┼╜├á┬«┬┤├á┬»┬ü├á┬«┬ñ├á┬»┬ì├á┬«┬ñ├á┬»┬ü ├á┬«┬╡├á┬«┬░├á┬«┬«├á┬»┬ì├á┬«┬¬├á┬»┬ü ├á┬«ΓÇª├á┬«┼╕├á┬»╦å├á┬«┬¿├á┬»┬ì├á┬«┬ñ├á┬«┬ñ├á┬»┬ü - ├á┬«ΓÇ░├á┬«┬░├á┬»┬ü├á┬«┬╡├á┬«┬╛├á┬«ΓÇó├á┬»┬ì├á┬«ΓÇó├á┬«┬«├á┬»┬ì ├á┬«┬«├á┬»┬ü├á┬«┼╕├á┬«ΓÇó├á┬»┬ì├á┬«ΓÇó├á┬«┬¬├á┬»┬ì├á┬«┬¬├á┬«┼╕├á┬»┬ì├á┬«┼╕├á┬«┬ñ├á┬»┬ü", charactersRemaining: "├á┬«┼╜├á┬«┬┤├á┬»┬ü├á┬«┬ñ├á┬»┬ì├á┬«┬ñ├á┬»┬ü├á┬«ΓÇó├á┬«┬│├á┬»┬ì ├á┬«┬«├á┬»Γé¼├á┬«┬ñ├á┬«┬«├á┬»┬ì",
    shortcuts: "├á┬«┬╡├á┬«┬┐├á┬«┼í├á┬»╦å├á┬«┬¬├á┬»┬ì├á┬«┬¬├á┬«┬▓├á┬«ΓÇó├á┬»╦å ├á┬«ΓÇó├á┬»┬ü├á┬«┬▒├á┬»┬ü├á┬«ΓÇó├á┬»┬ì├á┬«ΓÇó├á┬»┬ü├á┬«┬╡├á┬«┬┤├á┬«┬┐├á┬«ΓÇó├á┬«┬│├á┬»┬ì", openHelp: "├á┬«ΓÇ░├á┬«┬ñ├á┬«┬╡├á┬«┬┐ ├á┬«┬ñ├á┬«┬┐├á┬«┬▒", closeHelp: "├á┬«ΓÇ░├á┬«┬ñ├á┬«┬╡├á┬«┬┐ ├á┬«┬«├á┬»ΓÇÜ├á┬«┼╕├á┬»┬ü", focusPrompt: "├á┬«ΓÇó├á┬»┬ü├á┬«┬▒├á┬«┬┐├á┬«┬¬├á┬»┬ì├á┬«┬¬├á┬«┬┐├á┬«┬▓├á┬»┬ì ├á┬«ΓÇó├á┬«┬╡├á┬«┬⌐├á┬«┬«├á┬»┬ì",
    generateStory: "├á┬«ΓÇó├á┬«┬ñ├á┬»╦å ├á┬«ΓÇ░├á┬«┬░├á┬»┬ü├á┬«┬╡├á┬«┬╛├á┬«ΓÇó├á┬»┬ì├á┬«ΓÇó├á┬»┬ü", publishStory: "├á┬«ΓÇó├á┬«┬ñ├á┬»╦å ├á┬«┬╡├á┬»ΓÇá├á┬«┬│├á┬«┬┐├á┬«┬»├á┬«┬┐├á┬«┼╕├á┬»┬ü", close: "├á┬«┬«├á┬»ΓÇÜ├á┬«┼╕├á┬»┬ü", freeLimitReached: "├á┬«ΓÇí├á┬«┬▓├á┬«┬╡├á┬«┼í ├á┬«┬╡├á┬«┬░├á┬«┬«├á┬»┬ì├á┬«┬¬├á┬»┬ü ├á┬«ΓÇª├á┬«┼╕├á┬»╦å├á┬«┬¿├á┬»┬ì├á┬«┬ñ├á┬«┬ñ├á┬»┬ü",
    freeLimitMessage: "3 ├á┬«ΓÇí├á┬«┬▓├á┬«┬╡├á┬«┼í ├á┬«ΓÇó├á┬«┬ñ├á┬»╦å ├á┬«ΓÇ░├á┬«┬░├á┬»┬ü├á┬«┬╡├á┬«┬╛├á┬«ΓÇó├á┬»┬ì├á┬«ΓÇó├á┬«Γäó├á┬»┬ì├á┬«ΓÇó├á┬«┬│├á┬»╦å├á┬«┬»├á┬»┬ü├á┬«┬«├á┬»┬ì ├á┬«┬¬├á┬«┬»├á┬«┬⌐├á┬»┬ì├á┬«┬¬├á┬«┼╕├á┬»┬ü├á┬«┬ñ├á┬»┬ì├á┬«┬ñ├á┬«┬┐├á┬«┬╡├á┬«┬┐├á┬«┼╕├á┬»┬ì├á┬«┼╕├á┬»Γé¼├á┬«┬░├á┬»┬ì├á┬«ΓÇó├á┬«┬│├á┬»┬ì. ├á┬«┬ñ├á┬»┼á├á┬«┼╕├á┬«┬░ ├á┬«ΓÇ░├á┬«┬│├á┬»┬ì├á┬«┬¿├á┬»┬ü├á┬«┬┤├á┬»╦å├á┬«┬»├á┬«┬╡├á┬»┬ü├á┬«┬«├á┬»┬ì.", continueBrowsing: "├á┬«┬ñ├á┬»┼á├á┬«┼╕├á┬«┬░├á┬»┬ì├á┬«┬¿├á┬»┬ì├á┬«┬ñ├á┬»┬ü ├á┬«┬¬├á┬«┬╛├á┬«┬░├á┬»┬ì├á┬«┬╡├á┬»╦å├á┬«┬»├á┬«┬┐├á┬«┼╕├á┬»┬ü", recentPrompts: "├á┬«┼í├á┬«┬«├á┬»Γé¼├á┬«┬¬├á┬«┬ñ├á┬»┬ì├á┬«┬ñ├á┬«┬┐├á┬«┬» ├á┬«ΓÇó├á┬»┬ü├á┬«┬▒├á┬«┬┐├á┬«┬¬├á┬»┬ì├á┬«┬¬├á┬»┬ü├á┬«ΓÇó├á┬«┬│├á┬»┬ì", usePrompt: "├á┬«┬¬├á┬«┬»├á┬«┬⌐├á┬»┬ì├á┬«┬¬├á┬«┼╕├á┬»┬ü├á┬«┬ñ├á┬»┬ì├á┬«┬ñ├á┬»┬ü", delete: "├á┬«┬¿├á┬»Γé¼├á┬«ΓÇó├á┬»┬ì├á┬«ΓÇó├á┬»┬ü", clearAll: "├á┬«ΓÇª├á┬«┬⌐├á┬»╦å├á┬«┬ñ├á┬»┬ì├á┬«┬ñ├á┬»╦å├á┬«┬»├á┬»┬ü├á┬«┬«├á┬»┬ì ├á┬«┬¿├á┬»Γé¼├á┬«ΓÇó├á┬»┬ì├á┬«ΓÇó├á┬»┬ü", noRecentPrompts: "├á┬«┼í├á┬«┬«├á┬»Γé¼├á┬«┬¬├á┬«┬ñ├á┬»┬ì├á┬«┬ñ├á┬«┬┐├á┬«┬» ├á┬«ΓÇó├á┬»┬ü├á┬«┬▒├á┬«┬┐├á┬«┬¬├á┬»┬ì├á┬«┬¬├á┬»┬ü├á┬«ΓÇó├á┬«┬│├á┬»┬ì ├á┬«ΓÇí├á┬«┬▓├á┬»┬ì├á┬«┬▓├á┬»╦å",
  },
  Telugu: {
    back: "├á┬░┬╡├á┬▒ΓÇá├á┬░┬¿├á┬▒┬ü├á┬░ΓÇó├á┬░ΓÇó├á┬▒┬ü", freeAccess: "3 ├á┬░ΓÇª├á┬░┬¡├á┬▒┬ì├á┬░┬»├á┬░┬░├á┬▒┬ì├á┬░┬Ñ├á┬░┬¿├á┬░┬▓├á┬░ΓÇó├á┬▒┬ü ├á┬░ΓÇ░├á┬░┼í├á┬░┬┐├á┬░┬ñ ├á┬░┬¬├á┬▒┬ì├á┬░┬░├á┬░┬╡├á┬▒ΓÇí├á┬░┬╢├á┬░ΓÇÜ", login: "├á┬░┬▓├á┬░┬╛├á┬░ΓÇö├á┬░┬┐├á┬░┬¿├á┬▒┬ì", forMore: "├á┬░┼í├á┬▒ΓÇí├á┬░┬╕├á┬░┬┐ ├á┬░┬«├á┬░┬░├á┬░┬┐├á┬░┬¿├á┬▒┬ì├á┬░┬¿├á┬░┬┐ ├á┬░┬¬├á┬▒┼á├á┬░ΓÇÜ├á┬░┬ª├á┬░ΓÇÜ├á┬░┬í├á┬░┬┐!",
    perMonth: "├á┬░┬¿├á┬▒ΓÇá├á┬░┬▓├á┬░ΓÇó├á┬▒┬ü", upgrade: "├á┬░ΓÇª├á┬░┬¬├á┬▒┬ì├óΓé¼┼Æ├á┬░ΓÇö├á┬▒┬ì├á┬░┬░├á┬▒ΓÇí├á┬░┬í├á┬▒┬ì", monthlyRequests: "├á┬░╦å ├á┬░┬¿├á┬▒ΓÇá├á┬░┬▓ ├á┬░ΓÇª├á┬░┬¡├á┬▒┬ì├á┬░┬»├á┬░┬░├á┬▒┬ì├á┬░┬Ñ├á┬░┬¿├á┬░┬▓├á┬▒┬ü", totalPosts: "├á┬░┬«├á┬▒┼á├á┬░┬ñ├á┬▒┬ì├á┬░┬ñ├á┬░ΓÇÜ ├á┬░┬¬├á┬▒ΓÇ╣├á┬░┬╕├á┬▒┬ì├á┬░┼╕├á┬▒┬ü├á┬░┬▓├á┬▒┬ü",
    titleStart: "├á┬░┬«├á┬▒Γé¼ ├á┬░ΓÇá├á┬░┬▓├á┬▒ΓÇ╣├á┬░┼í├á┬░┬¿├á┬░┬▓├á┬░┬¿├á┬▒┬ü", titleAccent: "├á┬░ΓÇª├á┬░┬ª├á┬▒┬ì├á┬░┬¡├á┬▒┬ü├á┬░┬ñ ├á┬░ΓÇó├á┬░┬Ñ├á┬░┬▓├á┬▒┬ü├á┬░ΓÇö├á┬░┬╛ ├á┬░┬«├á┬░┬╛├á┬░┬░├á┬▒┬ì├á┬░┼í├á┬░ΓÇÜ├á┬░┬í├á┬░┬┐!", length: "├á┬░┬¬├á┬▒┼á├á┬░┬í├á┬░┬╡├á┬▒┬ü", language: "├á┬░┬¡├á┬░┬╛├á┬░┬╖",
    short: "├á┬░┼í├á┬░┬┐├á┬░┬¿├á┬▒┬ì├á┬░┬¿├á┬░┬ª├á┬░┬┐", medium: "├á┬░┬«├á┬░┬º├á┬▒┬ì├á┬░┬»├á┬░┬╕├á┬▒┬ì├á┬░┬Ñ├á┬░ΓÇÜ", long: "├á┬░┬¬├á┬▒┼á├á┬░┬í├á┬░┬╡├á┬▒╦å├á┬░┬¿├á┬░┬ª├á┬░┬┐", promptPlaceholder: "├á┬░┬¬├á┬▒┬ì├á┬░┬░├á┬░┬ñ├á┬░┬┐ ├á┬░ΓÇö├á┬▒┼á├á┬░┬¬├á┬▒┬ì├á┬░┬¬ ├á┬░ΓÇó├á┬░┬Ñ ├á┬░ΓÇÖ├á┬░ΓÇó ├á┬░ΓÇá├á┬░┬▓├á┬▒ΓÇ╣├á┬░┼í├á┬░┬¿├á┬░┬ñ├á┬▒ΓÇ╣ ├á┬░┬«├á┬▒┼á├á┬░┬ª├á┬░┬▓├á┬░┬╡├á┬▒┬ü├á┬░┬ñ├á┬▒┬ü├á┬░ΓÇÜ├á┬░┬ª├á┬░┬┐. ├á┬░┬«├á┬▒Γé¼├á┬░┬ª├á┬░┬┐ ├á┬░┬Å├á┬░┬«├á┬░┬┐├á┬░┼╕├á┬░┬┐?",
    keyboardTip: "├á┬░ΓÇó├á┬▒Γé¼├á┬░┬¼├á┬▒ΓÇ╣├á┬░┬░├á┬▒┬ì├á┬░┬í├á┬▒┬ì ├á┬░┼í├á┬░┬┐├á┬░┼╕├á┬▒┬ì├á┬░ΓÇó├á┬░┬╛:", press: "├á┬░┬¿├á┬▒┼á├á┬░ΓÇó├á┬▒┬ì├á┬░ΓÇó├á┬░ΓÇÜ├á┬░┬í├á┬░┬┐", toGenerate: "├á┬░┬░├á┬▒ΓÇÜ├á┬░┬¬├á┬▒┼á├á┬░ΓÇÜ├á┬░┬ª├á┬░┬┐├á┬░ΓÇÜ├á┬░┼í├á┬░┬í├á┬░┬╛├á┬░┬¿├á┬░┬┐├á┬░ΓÇó├á┬░┬┐", alsoWorks: "├á┬░ΓÇó├á┬▒ΓÇÜ├á┬░┬í├á┬░┬╛ ├á┬░┬¬├á┬░┬¿├á┬░┬┐├á┬░┼í├á┬▒ΓÇí├á┬░┬╕├á┬▒┬ì├á┬░┬ñ├á┬▒┬ü├á┬░ΓÇÜ├á┬░┬ª├á┬░┬┐", forNewLine: "├á┬░ΓÇó├á┬▒┼á├á┬░┬ñ├á┬▒┬ì├á┬░┬ñ ├á┬░┬▓├á┬▒╦å├á┬░┬¿├á┬▒┬ì ├á┬░ΓÇó├á┬▒ΓÇ╣├á┬░┬╕├á┬░ΓÇÜ",
    generating: "├á┬░┬░├á┬▒ΓÇÜ├á┬░┬¬├á┬▒┼á├á┬░ΓÇÜ├á┬░┬ª├á┬░┬┐├á┬░┬╕├á┬▒┬ì├á┬░┬ñ├á┬▒ΓÇ╣├á┬░ΓÇÜ├á┬░┬ª├á┬░┬┐...", generate: "├á┬░┬░├á┬▒ΓÇÜ├á┬░┬¬├á┬▒┼á├á┬░ΓÇÜ├á┬░┬ª├á┬░┬┐├á┬░ΓÇÜ├á┬░┼í├á┬▒┬ü", examples: "├á┬░ΓÇó├á┬▒┼á├á┬░┬¿├á┬▒┬ì├á┬░┬¿├á┬░┬┐ ├á┬░ΓÇ░├á┬░┬ª├á┬░┬╛├á┬░┬╣├á┬░┬░├á┬░┬ú ├á┬░┬¬├á┬▒┬ì├á┬░┬░├á┬░┬╛├á┬░ΓÇÜ├á┬░┬¬├á┬▒┬ì├á┬░┼╕├á┬▒┬ì├óΓé¼┼Æ├á┬░┬▓├á┬▒┬ü:",
    selectPrompt: "├á┬░┬¬├á┬▒┬ì├á┬░┬░├á┬░┬╛├á┬░ΓÇÜ├á┬░┬¬├á┬▒┬ì├á┬░┼╕├á┬▒┬ì ├á┬░┼╜├á┬░ΓÇÜ├á┬░┼í├á┬▒┬ü├á┬░ΓÇó├á┬▒ΓÇ╣├á┬░ΓÇÜ├á┬░┬í├á┬░┬┐", characterLimit: "├á┬░ΓÇª├á┬░ΓÇó├á┬▒┬ì├á┬░┬╖├á┬░┬░ ├á┬░┬¬├á┬░┬░├á┬░┬┐├á┬░┬«├á┬░┬┐├á┬░┬ñ├á┬░┬┐ ├á┬░┼í├á┬▒ΓÇí├á┬░┬░├á┬░┬┐├á┬░ΓÇÜ├á┬░┬ª├á┬░┬┐ - ├á┬░┬░├á┬▒ΓÇÜ├á┬░┬¬├á┬▒┼á├á┬░ΓÇÜ├á┬░┬ª├á┬░┬┐├á┬░ΓÇÜ├á┬░┬¬├á┬▒┬ü ├á┬░┬¿├á┬░┬┐├á┬░┬▓├á┬░┬┐├á┬░┬¬├á┬░┬┐├á┬░┬╡├á┬▒ΓÇí├á┬░┬»├á┬░┬¼├á┬░┬í├á┬░┬┐├á┬░ΓÇÜ├á┬░┬ª├á┬░┬┐", charactersRemaining: "├á┬░ΓÇª├á┬░ΓÇó├á┬▒┬ì├á┬░┬╖├á┬░┬░├á┬░┬╛├á┬░┬▓├á┬▒┬ü ├á┬░┬«├á┬░┬┐├á┬░ΓÇö├á┬░┬┐├á┬░┬▓├á┬░┬╛├á┬░┬»├á┬░┬┐",
    shortcuts: "├á┬░ΓÇó├á┬▒Γé¼├á┬░┬¼├á┬▒ΓÇ╣├á┬░┬░├á┬▒┬ì├á┬░┬í├á┬▒┬ì ├á┬░┬╕├á┬░┬ñ├á┬▒┬ì├á┬░┬╡├á┬░┬░├á┬░┬«├á┬░┬╛├á┬░┬░├á┬▒┬ì├á┬░ΓÇö├á┬░┬╛├á┬░┬▓├á┬▒┬ü", openHelp: "├á┬░┬╕├á┬░┬╣├á┬░┬╛├á┬░┬»├á┬░ΓÇÜ ├á┬░┬ñ├á┬▒ΓÇá├á┬░┬░├á┬░┬╡├á┬░ΓÇÜ├á┬░┬í├á┬░┬┐", closeHelp: "├á┬░┬╕├á┬░┬╣├á┬░┬╛├á┬░┬»├á┬░ΓÇÜ ├á┬░┬«├á┬▒ΓÇÜ├á┬░┬╕├á┬░┬┐├á┬░┬╡├á┬▒ΓÇí├á┬░┬»├á┬░ΓÇÜ├á┬░┬í├á┬░┬┐", focusPrompt: "├á┬░┬¬├á┬▒┬ì├á┬░┬░├á┬░┬╛├á┬░ΓÇÜ├á┬░┬¬├á┬▒┬ì├á┬░┼╕├á┬▒┬ì├óΓé¼┼Æ├á┬░┬¬├á┬▒╦å ├á┬░┬ª├á┬▒╞Æ├á┬░┬╖├á┬▒┬ì├á┬░┼╕├á┬░┬┐",
    generateStory: "├á┬░ΓÇó├á┬░┬Ñ ├á┬░┬░├á┬▒ΓÇÜ├á┬░┬¬├á┬▒┼á├á┬░ΓÇÜ├á┬░┬ª├á┬░┬┐├á┬░ΓÇÜ├á┬░┼í├á┬▒┬ü", publishStory: "├á┬░ΓÇó├á┬░┬Ñ ├á┬░┬¬├á┬▒┬ì├á┬░┬░├á┬░┼í├á┬▒┬ü├á┬░┬░├á┬░┬┐├á┬░ΓÇÜ├á┬░┼í├á┬▒┬ü", close: "├á┬░┬«├á┬▒ΓÇÜ├á┬░┬╕├á┬░┬┐├á┬░┬╡├á┬▒ΓÇí├á┬░┬»├á┬░┬┐", freeLimitReached: "├á┬░ΓÇ░├á┬░┼í├á┬░┬┐├á┬░┬ñ ├á┬░┬¬├á┬░┬░├á┬░┬┐├á┬░┬«├á┬░┬┐├á┬░┬ñ├á┬░┬┐ ├á┬░┼í├á┬▒ΓÇí├á┬░┬░├á┬░┬┐├á┬░ΓÇÜ├á┬░┬ª├á┬░┬┐",
    freeLimitMessage: "├á┬░┬«├á┬▒Γé¼├á┬░┬░├á┬▒┬ü 3 ├á┬░ΓÇ░├á┬░┼í├á┬░┬┐├á┬░┬ñ ├á┬░ΓÇó├á┬░┬Ñ├á┬░┬╛ ├á┬░┬░├á┬▒ΓÇÜ├á┬░┬¬├á┬▒┼á├á┬░ΓÇÜ├á┬░┬ª├á┬░┬┐├á┬░ΓÇÜ├á┬░┬¬├á┬▒┬ü├á┬░┬▓├á┬░┬¿├á┬▒┬ü ├á┬░ΓÇ░├á┬░┬¬├á┬░┬»├á┬▒ΓÇ╣├á┬░ΓÇö├á┬░┬┐├á┬░ΓÇÜ├á┬░┼í├á┬░┬╛├á┬░┬░├á┬▒┬ü. ├á┬░ΓÇó├á┬▒┼á├á┬░┬¿├á┬░┬╕├á┬░┬╛├á┬░ΓÇö├á┬░┬í├á┬░┬╛├á┬░┬¿├á┬░┬┐├á┬░ΓÇó├á┬░┬┐ ├á┬░┬▓├á┬░┬╛├á┬░ΓÇö├á┬░┬┐├á┬░┬¿├á┬▒┬ì ├á┬░┼í├á┬▒ΓÇí├á┬░┬»├á┬░ΓÇÜ├á┬░┬í├á┬░┬┐.", continueBrowsing: "├á┬░┬¼├á┬▒┬ì├á┬░┬░├á┬▒┼Æ├á┬░┼ô├á┬░┬┐├á┬░ΓÇÜ├á┬░ΓÇö├á┬▒┬ì ├á┬░ΓÇó├á┬▒┼á├á┬░┬¿├á┬░┬╕├á┬░┬╛├á┬░ΓÇö├á┬░┬┐├á┬░ΓÇÜ├á┬░┼í├á┬▒┬ü", recentPrompts: "├á┬░ΓÇí├á┬░┼╕├á┬▒Γé¼├á┬░┬╡├á┬░┬▓ ├á┬░┬¬├á┬▒┬ì├á┬░┬░├á┬░┬╛├á┬░ΓÇÜ├á┬░┬¬├á┬▒┬ì├á┬░┼╕├á┬▒┬ì├óΓé¼┼Æ├á┬░┬▓├á┬▒┬ü", usePrompt: "├á┬░ΓÇ░├á┬░┬¬├á┬░┬»├á┬▒ΓÇ╣├á┬░ΓÇö├á┬░┬┐├á┬░ΓÇÜ├á┬░┼í├á┬▒┬ü", delete: "├á┬░┬ñ├á┬▒┼á├á┬░┬▓├á┬░ΓÇö├á┬░┬┐├á┬░ΓÇÜ├á┬░┼í├á┬▒┬ü", clearAll: "├á┬░ΓÇª├á┬░┬¿├á┬▒┬ì├á┬░┬¿├á┬░┬┐├á┬░ΓÇÜ├á┬░┼╕├á┬░┬┐├á┬░┬¿├á┬░┬┐ ├á┬░┬ñ├á┬▒┼á├á┬░┬▓├á┬░ΓÇö├á┬░┬┐├á┬░ΓÇÜ├á┬░┼í├á┬▒┬ü", noRecentPrompts: "├á┬░ΓÇí├á┬░┼╕├á┬▒Γé¼├á┬░┬╡├á┬░┬▓ ├á┬░┬¬├á┬▒┬ì├á┬░┬░├á┬░┬╛├á┬░ΓÇÜ├á┬░┬¬├á┬▒┬ì├á┬░┼╕├á┬▒┬ì├óΓé¼┼Æ├á┬░┬▓├á┬▒┬ü ├á┬░┬▓├á┬▒ΓÇí├á┬░┬╡├á┬▒┬ü",
  },
  Marathi: {
    back: "├á┬ñ┬«├á┬ñ┬╛├á┬ñΓÇö├á┬ÑΓÇí", freeAccess: "3 ├á┬ñ┬╡├á┬ñ┬┐├á┬ñ┬¿├á┬ñΓÇÜ├á┬ñ┬ñ├á┬Ñ┬ì├á┬ñ┬»├á┬ñ┬╛├á┬ñΓÇÜ├á┬ñ┬╕├á┬ñ┬╛├á┬ñ┬á├á┬ÑΓé¼ ├á┬ñ┬«├á┬ÑΓÇ╣├á┬ñ┬½├á┬ñ┬ñ ├á┬ñ┬¬├á┬Ñ┬ì├á┬ñ┬░├á┬ñ┬╡├á┬ÑΓÇí├á┬ñ┬╢", login: "├á┬ñ┬▓├á┬ÑΓÇ░├á┬ñΓÇö ├á┬ñΓÇí├á┬ñ┬¿", forMore: "├á┬ñΓÇó├á┬ñ┬░├á┬ÑΓÇÜ├á┬ñ┬¿ ├á┬ñΓÇª├á┬ñ┬º├á┬ñ┬┐├á┬ñΓÇó ├á┬ñ┬«├á┬ñ┬┐├á┬ñ┬│├á┬ñ┬╡├á┬ñ┬╛!",
    perMonth: "├á┬ñ┬ª├á┬ñ┬░ ├á┬ñ┬«├á┬ñ┬╣├á┬ñ┬┐├á┬ñ┬¿├á┬ñ┬╛", upgrade: "├á┬ñΓÇª├á┬ñ┬¬├á┬ñΓÇö├á┬Ñ┬ì├á┬ñ┬░├á┬ÑΓÇí├á┬ñ┬í", monthlyRequests: "├á┬ñ┬»├á┬ñ┬╛ ├á┬ñ┬«├á┬ñ┬╣├á┬ñ┬┐├á┬ñ┬¿├á┬Ñ┬ì├á┬ñ┬»├á┬ñ┬╛├á┬ñ┬ñ├á┬ÑΓé¼├á┬ñ┬▓ ├á┬ñ┬╡├á┬ñ┬┐├á┬ñ┬¿├á┬ñΓÇÜ├á┬ñ┬ñ├á┬Ñ┬ì├á┬ñ┬»├á┬ñ┬╛", totalPosts: "├á┬ñ┬Å├á┬ñΓÇó├á┬ÑΓÇÜ├á┬ñ┬ú ├á┬ñ┬¬├á┬ÑΓÇ╣├á┬ñ┬╕├á┬Ñ┬ì├á┬ñ┼╕",
    titleStart: "├á┬ñ┬ñ├á┬Ñ┬ü├á┬ñ┬«├á┬ñ┼í├á┬Ñ┬ì├á┬ñ┬»├á┬ñ┬╛ ├á┬ñΓÇó├á┬ñ┬▓├á┬Ñ┬ì├á┬ñ┬¬├á┬ñ┬¿├á┬ñ┬╛ ├á┬ñ┬¼├á┬ñ┬ª├á┬ñ┬▓├á┬ñ┬╛", titleAccent: "├á┬ñΓÇª├á┬ñ┬ª├á┬Ñ┬ì├á┬ñ┬¡├á┬Ñ┬ü├á┬ñ┬ñ ├á┬ñΓÇó├á┬ñ┬Ñ├á┬ñ┬╛├á┬ñΓÇÜ├á┬ñ┬«├á┬ñ┬º├á┬Ñ┬ì├á┬ñ┬»├á┬ÑΓÇí!", length: "├á┬ñ┬▓├á┬ñ┬╛├á┬ñΓÇÜ├á┬ñ┬¼├á┬ÑΓé¼", language: "├á┬ñ┬¡├á┬ñ┬╛├á┬ñ┬╖├á┬ñ┬╛",
    short: "├á┬ñ┬▓├á┬ñ┬╣├á┬ñ┬╛├á┬ñ┬¿", medium: "├á┬ñ┬«├á┬ñ┬º├á┬Ñ┬ì├á┬ñ┬»├á┬ñ┬«", long: "├á┬ñ┬▓├á┬ñ┬╛├á┬ñΓÇÜ├á┬ñ┬¼", promptPlaceholder: "├á┬ñ┬¬├á┬Ñ┬ì├á┬ñ┬░├á┬ñ┬ñ├á┬Ñ┬ì├á┬ñ┬»├á┬ÑΓÇí├á┬ñΓÇó ├á┬ñ┬«├á┬ñ┬╣├á┬ñ┬╛├á┬ñ┬¿ ├á┬ñΓÇó├á┬ñ┬Ñ├á┬ñ┬╛ ├á┬ñ┬Å├á┬ñΓÇó├á┬ñ┬╛ ├á┬ñΓÇó├á┬ñ┬▓├á┬Ñ┬ì├á┬ñ┬¬├á┬ñ┬¿├á┬ÑΓÇí├á┬ñ┬¬├á┬ñ┬╛├á┬ñ┬╕├á┬ÑΓÇÜ├á┬ñ┬¿ ├á┬ñ┬╕├á┬Ñ┬ü├á┬ñ┬░├á┬ÑΓÇÜ ├á┬ñ┬╣├á┬ÑΓÇ╣├á┬ñ┬ñ├á┬ÑΓÇí. ├á┬ñ┬ñ├á┬Ñ┬ü├á┬ñ┬«├á┬ñ┼í├á┬ÑΓé¼ ├á┬ñΓÇó├á┬ñ┬▓├á┬Ñ┬ì├á┬ñ┬¬├á┬ñ┬¿├á┬ñ┬╛ ├á┬ñΓÇó├á┬ñ┬╛├á┬ñ┬» ├á┬ñΓÇá├á┬ñ┬╣├á┬ÑΓÇí?",
    keyboardTip: "├á┬ñΓÇó├á┬ÑΓé¼├á┬ñ┬¼├á┬ÑΓÇ╣├á┬ñ┬░├á┬Ñ┬ì├á┬ñ┬í ├á┬ñ┬╕├á┬ÑΓÇÜ├á┬ñ┼í├á┬ñ┬¿├á┬ñ┬╛:", press: "├á┬ñ┬ª├á┬ñ┬╛├á┬ñ┬¼├á┬ñ┬╛", toGenerate: "├á┬ñ┬ñ├á┬ñ┬»├á┬ñ┬╛├á┬ñ┬░ ├á┬ñΓÇó├á┬ñ┬░├á┬ñ┬ú├á┬Ñ┬ì├á┬ñ┬»├á┬ñ┬╛├á┬ñ┬╕├á┬ñ┬╛├á┬ñ┬á├á┬ÑΓé¼", alsoWorks: "├á┬ñ┬╣├á┬ÑΓÇí├á┬ñ┬╣├á┬ÑΓé¼ ├á┬ñ┼í├á┬ñ┬╛├á┬ñ┬▓├á┬ñ┬ñ├á┬ÑΓÇí", forNewLine: "├á┬ñ┬¿├á┬ñ┬╡├á┬ÑΓé¼├á┬ñ┬¿ ├á┬ñΓÇ£├á┬ñ┬│├á┬ÑΓé¼├á┬ñ┬╕├á┬ñ┬╛├á┬ñ┬á├á┬ÑΓé¼",
    generating: "├á┬ñ┬ñ├á┬ñ┬»├á┬ñ┬╛├á┬ñ┬░ ├á┬ñ┬╣├á┬ÑΓÇ╣├á┬ñ┬ñ ├á┬ñΓÇá├á┬ñ┬╣├á┬ÑΓÇí...", generate: "├á┬ñ┬ñ├á┬ñ┬»├á┬ñ┬╛├á┬ñ┬░ ├á┬ñΓÇó├á┬ñ┬░├á┬ñ┬╛", examples: "├á┬ñΓÇó├á┬ñ┬╛├á┬ñ┬╣├á┬ÑΓé¼ ├á┬ñΓÇ░├á┬ñ┬ª├á┬ñ┬╛├á┬ñ┬╣├á┬ñ┬░├á┬ñ┬ú ├á┬ñ┬¬├á┬Ñ┬ì├á┬ñ┬░├á┬ÑΓÇ░├á┬ñ┬«├á┬Ñ┬ì├á┬ñ┬¬├á┬Ñ┬ì├á┬ñ┼╕:",
    selectPrompt: "├á┬ñ┬¬├á┬Ñ┬ì├á┬ñ┬░├á┬ÑΓÇ░├á┬ñ┬«├á┬Ñ┬ì├á┬ñ┬¬├á┬Ñ┬ì├á┬ñ┼╕ ├á┬ñ┬¿├á┬ñ┬┐├á┬ñ┬╡├á┬ñ┬í├á┬ñ┬╛", characterLimit: "├á┬ñΓÇª├á┬ñΓÇó├á┬Ñ┬ì├á┬ñ┬╖├á┬ñ┬░ ├á┬ñ┬«├á┬ñ┬░├á┬Ñ┬ì├á┬ñ┬»├á┬ñ┬╛├á┬ñ┬ª├á┬ñ┬╛ ├á┬ñ┬¬├á┬ÑΓÇÜ├á┬ñ┬░├á┬Ñ┬ì├á┬ñ┬ú - ├á┬ñ┬¿├á┬ñ┬┐├á┬ñ┬░├á┬Ñ┬ì├á┬ñ┬«├á┬ñ┬┐├á┬ñ┬ñ├á┬ÑΓé¼ ├á┬ñ┬¼├á┬ñΓÇÜ├á┬ñ┬ª ├á┬ñΓÇá├á┬ñ┬╣├á┬ÑΓÇí", charactersRemaining: "├á┬ñΓÇª├á┬ñΓÇó├á┬Ñ┬ì├á┬ñ┬╖├á┬ñ┬░├á┬ÑΓÇí ├á┬ñ┬¼├á┬ñ┬╛├á┬ñΓÇó├á┬ÑΓé¼",
    shortcuts: "├á┬ñΓÇó├á┬ÑΓé¼├á┬ñ┬¼├á┬ÑΓÇ╣├á┬ñ┬░├á┬Ñ┬ì├á┬ñ┬í ├á┬ñ┬╢├á┬ÑΓÇ░├á┬ñ┬░├á┬Ñ┬ì├á┬ñ┼╕├á┬ñΓÇó├á┬ñ┼╕", openHelp: "├á┬ñ┬«├á┬ñ┬ª├á┬ñ┬ñ ├á┬ñΓÇ░├á┬ñ╦£├á┬ñ┬í├á┬ñ┬╛", closeHelp: "├á┬ñ┬«├á┬ñ┬ª├á┬ñ┬ñ ├á┬ñ┬¼├á┬ñΓÇÜ├á┬ñ┬ª ├á┬ñΓÇó├á┬ñ┬░├á┬ñ┬╛", focusPrompt: "├á┬ñ┬¬├á┬Ñ┬ì├á┬ñ┬░├á┬ÑΓÇ░├á┬ñ┬«├á┬Ñ┬ì├á┬ñ┬¬├á┬Ñ┬ì├á┬ñ┼╕├á┬ñ┬╡├á┬ñ┬░ ├á┬ñ┬▓├á┬ñΓÇó├á┬Ñ┬ì├á┬ñ┬╖",
    generateStory: "├á┬ñΓÇó├á┬ñ┬Ñ├á┬ñ┬╛ ├á┬ñ┬ñ├á┬ñ┬»├á┬ñ┬╛├á┬ñ┬░ ├á┬ñΓÇó├á┬ñ┬░├á┬ñ┬╛", publishStory: "├á┬ñΓÇó├á┬ñ┬Ñ├á┬ñ┬╛ ├á┬ñ┬¬├á┬Ñ┬ì├á┬ñ┬░├á┬ñΓÇó├á┬ñ┬╛├á┬ñ┬╢├á┬ñ┬┐├á┬ñ┬ñ ├á┬ñΓÇó├á┬ñ┬░├á┬ñ┬╛", close: "├á┬ñ┬¼├á┬ñΓÇÜ├á┬ñ┬ª ├á┬ñΓÇó├á┬ñ┬░├á┬ñ┬╛", freeLimitReached: "├á┬ñ┬«├á┬ÑΓÇ╣├á┬ñ┬½├á┬ñ┬ñ ├á┬ñ┬«├á┬ñ┬░├á┬Ñ┬ì├á┬ñ┬»├á┬ñ┬╛├á┬ñ┬ª├á┬ñ┬╛ ├á┬ñ┬¬├á┬ÑΓÇÜ├á┬ñ┬░├á┬Ñ┬ì├á┬ñ┬ú",
    freeLimitMessage: "├á┬ñ┬ñ├á┬Ñ┬ü├á┬ñ┬«├á┬Ñ┬ì├á┬ñ┬╣├á┬ÑΓé¼ ├á┬ñ┬╕├á┬ñ┬░├á┬Ñ┬ì├á┬ñ┬╡ 3 ├á┬ñ┬«├á┬ÑΓÇ╣├á┬ñ┬½├á┬ñ┬ñ ├á┬ñΓÇó├á┬ñ┬Ñ├á┬ñ┬╛ ├á┬ñ┬¿├á┬ñ┬┐├á┬ñ┬░├á┬Ñ┬ì├á┬ñ┬«├á┬ñ┬┐├á┬ñ┬ñ├á┬ÑΓé¼ ├á┬ñ┬╡├á┬ñ┬╛├á┬ñ┬¬├á┬ñ┬░├á┬ñ┬▓├á┬Ñ┬ì├á┬ñ┬»├á┬ñ┬╛ ├á┬ñΓÇá├á┬ñ┬╣├á┬ÑΓÇí├á┬ñ┬ñ. ├á┬ñ┬¬├á┬Ñ┬ü├á┬ñ┬ó├á┬ÑΓÇí ├á┬ñ┬╕├á┬Ñ┬ü├á┬ñ┬░├á┬ÑΓÇÜ ├á┬ñ┬á├á┬ÑΓÇí├á┬ñ┬╡├á┬ñ┬ú├á┬Ñ┬ì├á┬ñ┬»├á┬ñ┬╛├á┬ñ┬╕├á┬ñ┬╛├á┬ñ┬á├á┬ÑΓé¼ ├á┬ñ┬▓├á┬ÑΓÇ░├á┬ñΓÇö ├á┬ñΓÇí├á┬ñ┬¿ ├á┬ñΓÇó├á┬ñ┬░├á┬ñ┬╛.", continueBrowsing: "├á┬ñ┬¼├á┬Ñ┬ì├á┬ñ┬░├á┬ñ┬╛├á┬ñΓÇ░├á┬ñ┬¥├á┬ñ┬┐├á┬ñΓÇÜ├á┬ñΓÇö ├á┬ñ┬╕├á┬Ñ┬ü├á┬ñ┬░├á┬ÑΓÇÜ ├á┬ñ┬á├á┬ÑΓÇí├á┬ñ┬╡├á┬ñ┬╛", recentPrompts: "├á┬ñΓÇª├á┬ñ┬▓├á┬ÑΓé¼├á┬ñΓÇó├á┬ñ┬í├á┬ÑΓé¼├á┬ñ┬▓ ├á┬ñ┬¬├á┬Ñ┬ì├á┬ñ┬░├á┬ÑΓÇ░├á┬ñ┬«├á┬Ñ┬ì├á┬ñ┬¬├á┬Ñ┬ì├á┬ñ┼╕", usePrompt: "├á┬ñ┬╡├á┬ñ┬╛├á┬ñ┬¬├á┬ñ┬░├á┬ñ┬╛", delete: "├á┬ñ┬╣├á┬ñ┼╕├á┬ñ┬╡├á┬ñ┬╛", clearAll: "├á┬ñ┬╕├á┬ñ┬░├á┬Ñ┬ì├á┬ñ┬╡ ├á┬ñ┬«├á┬Ñ┬ü├á┬ñ┬í├á┬ÑΓÇÜ├á┬ñ┬¿ ├á┬ñ┼╕├á┬ñ┬╛├á┬ñΓÇó├á┬ñ┬╛", noRecentPrompts: "├á┬ñΓÇª├á┬ñ┬▓├á┬ÑΓé¼├á┬ñΓÇó├á┬ñ┬í├á┬ÑΓé¼├á┬ñ┬▓ ├á┬ñ┬¬├á┬Ñ┬ì├á┬ñ┬░├á┬ÑΓÇ░├á┬ñ┬«├á┬Ñ┬ì├á┬ñ┬¬├á┬Ñ┬ì├á┬ñ┼╕ ├á┬ñ┬¿├á┬ñ┬╛├á┬ñ┬╣├á┬ÑΓé¼├á┬ñ┬ñ",

  },
};

const LANGUAGE_STORAGE_KEY = "storySparkLanguage";

// NEW: Tone definitions ├óΓé¼ΓÇ¥ each has a label, emoji, and Tailwind colour classes
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
const StoriesComponent = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const storiesPerPage = 10;
  const location = useLocation();
  const navigate = useNavigate();
  const { register, handleSubmit, reset, setValue } = useForm<Inputs>();


  const sentenceMatches = content.match(/[^.!?]+[.!?]*\s*/g) ?? [content];
  const segments: StorySentenceSegment[] = [];
  let wordCursor = 0;

  sentenceMatches.forEach((sentence, index) => {
    const trimmedSentence = sentence.trim();
    if (!trimmedSentence) {
      return;
    }


  const [stories, setStories] = useState<IStories[]>(
    draft?.stories?.length ? getUniqueStories(draft.stories) : [{ uuid: "test-1", title: "The Wizard's Journey", content: "Merlin walked through the forest toward the castle. The village was far behind him. He crossed the bridge over the river and entered the dungeon beneath the tower. Dragons guarded the mountain beyond the valley. Elena watched from the palace window as Merlin approached the cave near the ocean shore.", tag: "Fantasy", imageURL: "" }]
  );

  const [loading, setLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchFilter, setSearchFilter] = useState<string>("all");

  const uniqueStories = useMemo(() => getUniqueStories(stories), [stories]);

  const filteredStories = useMemo(() => {
    if (!searchQuery.trim()) return uniqueStories;

    const query = searchQuery.toLowerCase();

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
  }, [uniqueStories, searchQuery, searchFilter]);
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



    wordCursor += wordsInSentence;
  });

  return segments;
};

interface ICharacter {
  id: string;
  name: string;
  role: string;
  personality: string;
}

const TemplateSelectionScreen: React.FC<{
  onSelectTemplate: (template: any) => void;
  onStartBlank: () => void;
}> = ({ onSelectTemplate, onStartBlank }) => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-extrabold text-slate-100 mb-4">Start from Template</h2>
        <p className="text-slate-400 max-w-2xl mx-auto">Choose a genre-specific template to kickstart your story, or start with a blank canvas.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {STORY_TEMPLATES.map((template) => (
          <div key={template.id} className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-indigo-500 transition-colors cursor-pointer" onClick={() => onSelectTemplate(template)}>
            <div className="text-sm text-indigo-400 font-semibold mb-2">{template.genre}</div>
            <h3 className="text-xl font-bold text-slate-200 mb-3">{template.templateName}</h3>
            <p className="text-slate-400 text-sm mb-4">{template.openingHook}</p>
            <div className="text-xs text-slate-500">
              Length: <span className="capitalize">{template.length}</span> &bull; {template.characters.length} characters
            </div>
          </div>
        ))}
      </div>
      <div className="text-center">
        <button onClick={onStartBlank} className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg font-semibold transition-colors">
          Start with Blank Canvas
        </button>
      </div>
    </div>
  );
};


const StoriesViewComponent: React.FC<StoriesComponentProps> = ({
  stories,
  isLogin,
  setStories,
  isLoading,
  onPublishSuccess,
}) => {
  const location = useLocation();
const navigate = useNavigate();
const { register, handleSubmit, reset, setValue } = useForm<Inputs>();
  const [stories, setStories] = useState<IStories[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { data } = useGetProfileInfoQuery(undefined);
  const userRole = getUserInfo();
  const subscriptionType = (userRole?.subscriptionType as string) || "free";
  const login = isLoggedIn();
  const [showUpgradeModal, setShowUpgradeModal] = useState<boolean>(false);
  const { data: usageData, refetch: refetchUsage } = useGetUsageQuery(undefined, { skip: !login });
  const [generateModel] = useGenerateModelMutation();
  const [generateFreeModel] = useGenerateFreeModelMutation();
  const [selectedPrompt, setSelectedPrompt] = useState<string>("");
  const [showHelpModal, setShowHelpModal] = useState(false);
const [selectedGenre, setSelectedGenre] = useState<string>("");
const [selectedLength, setSelectedLength] = useState<string>("medium");
const [textareaValue, setTextareaValue] = useState<string>("");
const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
const { data: rosterData } = useGetCharactersQuery(undefined, { skip: !login });
const rosterCharacters = rosterData?.data || [];
const [saveCharacter, { isLoading: isSavingCharacter }] = useSaveCharacterMutation();

const handleSaveToRoster = async (char: ICharacter) => {
  try {
    await saveCharacter({
      name: char.name,
      role: char.role,
      personality: char.personality
    }).unwrap();
    toast.success("Character saved to roster!");
  } catch (error) {
    toast.error("Failed to save character.");
  }
};

const handleLoadFromRoster = (charId: string, rosterCharId: string) => {
  const rosterChar = rosterCharacters.find((c: any) => c._id === rosterCharId);
  if (!rosterChar) return;
  // Use a direct DOM update or form update depending on how characters are managed,
  // Assuming setCharacters is available globally or we simulate the change:
  if (typeof setCharacters === 'function') {
    setCharacters((prev: ICharacter[]) => prev.map(c => c.id === charId ? { ...c, name: rosterChar.name, role: rosterChar.role || "", personality: rosterChar.personality } : c));
  }
};
const dropdownRef = useRef<HTMLDivElement>(null);
const inputRef = useRef<HTMLTextAreaElement>(null);
const [guestRequestCount, setGuestRequestCount] = useState<number>(() =>
  parseInt(localStorage.getItem("guestRequestCount") || "0", 10),
);
const [showLimitModal, setShowLimitModal] = useState<boolean>(false);

useEffect(() => {
  window.scrollTo({ top: 0, behavior: "smooth" });
}, []);

useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsDropdownOpen(false);
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      setIsDropdownOpen(false);

  const [selectedGenre, setSelectedGenre] = useState<string>(

    draft?.genre
      ? (GENRES.find((g) => g.name === draft.genre || g.value === draft.genre)?.value ?? "≡ƒºÖ Fantasy")
      : "≡ƒºÖ Fantasy",
  );

  const [selectedLength, setSelectedLength] = useState<string>(draft?.length || "medium");
  const [selectedTone, setSelectedTone] = useState<ToneLabel | "">(draft?.tone || "Dramatic");
  const [selectedAudience, setSelectedAudience] = useState<string>("General Audience");
  const [textareaValue, setTextareaValue] = useState<string>(() => {
    return location.state?.prompt || draft?.prompt || "";
  });

  const [showTemplateScreen, setShowTemplateScreen] = useState<boolean>(() => {
    return !location.state?.prompt && !draft?.prompt;
  });

  const handleSelectTemplate = (template: any) => {
    const fullPremise = `${template.premise}\n\nSuggested Plot Points:\n- ${template.plotPoints.join('\n- ')}`;
    setTextareaValue(fullPremise);
    setSelectedGenre(template.genre);
    setSelectedLength(template.length);
    setCharacters(template.characters);
    setShowTemplateScreen(false);
  };

  const handleStartBlank = () => {
    setShowTemplateScreen(false);
  };


  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("English");
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
      audioRef.current.src = soundtrack;
      audioRef.current.play().catch(() => {
        /* ignore autoplay restrictions */
      });
    }
  }, []);

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

  // Draft restore + autosave
  useEffect(() => {
    if (!textareaValue.trim()) {
      return;
    }

    const timer = setTimeout(() => {
      const draftData: StoryDraftData = {
        prompt: textareaValue,
        genre: selectedGenre,
        length: selectedLength,
        language: selectedLanguage,
        tone: selectedTone,
        savedAt: new Date().toISOString(),
      };

      try {
        saveStoryDraft(draftData);
        setDraftStatus(`Draft saved ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`);
      } catch (err) {
        if (err instanceof DOMException && err.name === "QuotaExceededError") {

          toast.error("Couldn't autosave draft ├óΓé¼ΓÇ¥ storage limit reached.");
        }

      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [textareaValue, selectedGenre, selectedLength, selectedLanguage, selectedTone]);



    if (!("speechSynthesis" in window)) {
      toast.error("Text-to-speech is not supported in this browser.");
      return;
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
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
    setValue("prompt", debouncedPrompt);
  }, [debouncedPrompt, setValue]);

  useEffect(() => {
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

useEffect(() => {
  if (location.state && location.state.prompt) {
    setTextareaValue(location.state.prompt);
    navigate(location.pathname, { replace: true, state: {} });
  }
}, [location, navigate]);

useEffect(() => {
  setValue("prompt", textareaValue);
}, [textareaValue, setValue]);

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
        targetAudience: selectedAudience,
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
        reset();
        if (login) {
          refetchUsage();
        }
        if (!login) {
          const newCount = guestRequestCount + 1;
          setGuestRequestCount(newCount);
          localStorage.setItem("guestRequestCount", String(newCount));
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
      }
    } catch (error: any) {
      if (
        error?.status === 429 ||
        error?.status === "429" ||
        error?.data?.error === "QUOTA_EXCEEDED" ||
        (typeof error?.data?.message === "string" && error.data.message.includes("limit exceeded"))
      ) {
        setShowUpgradeModal(true);
      } else {
        toast.error(getErrorMessage(error));
      }
    } finally {
      if (timeoutId) {
        clearTimeout(timeoutId);
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


  const isOverLimit = textareaValue.length >= MAX_PROMPT_LENGTH;
  const isNearLimit = textareaValue.length >= MAX_PROMPT_LENGTH * WARN_THRESHOLD;
  const isGenerateDisabled = loading || isOverLimit || !textareaValue.trim();

  useKeyboardShortcuts({
    onOpenHelp: () => setShowHelpModal(true),
    onCloseHelp: () => setShowHelpModal(false),
    onGenerate: () => {
      if (isGenerateDisabled) return;
      if (inputRef.current) {
        const form = inputRef.current.closest("form");
        if (form) form.requestSubmit();
      }
    },
    onPublish: () => {
      const btn = document.getElementById("publish-story-btn");
      btn?.click();
    },
    focusPrompt: () => inputRef.current?.focus(),
    hasStory: stories.length > 0,
  });

  const handelPublishStory = useCallback(async () => {
    if (!isLogin) {
      toast.error("Please login to publish the story.");
      return;
    }
    if (!selectedStory) {
      toast.error("No story available. Please generate a story first.");
      return;
    }

    const post: IPost = {
      ...selectedStory,
      topic: selectTopics,
    };

    setLoading(true);
    try {
      const result = await createPost(post).unwrap();
      if (result) {
        toast.success("Story published successfully!");
        setStories([]);
        setSelectedStory(null);
        onPublishSuccess?.();
      }
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [isLogin, selectedStory, selectTopics, createPost, setStories, setSelectedStory, onPublishSuccess]);

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
                  </span>
                </div>
              </div>
            )}

            <div className="flex items-center justify-center py-20">
              <StoryGeneratingAnimation />
            </div>
          </div>
        </div>
      </div>
    );
  }

          {!login && (
            <div className="pt-2 text-center">
              <div className="!rounded-button bg-gradient-to-r from-white/20 to-white/10 text-gray-400 px-3 py-2 flex items-center gap-2 transition-all duration-300 rounded text-sm whitespace-normal md:whitespace-nowrap leading-relaxed">
                <span>
                  Free access for 3 requests ΓÇö <Link to="/login"><span className="text-indigo-400 underline font-semibold">Login</span></Link> for more!
                </span>
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
            </div>
          </div>
        </div>

        <div className="mt-11">
          <h1 className="text-gray-300 text-2xl sm:text-3xl md:text-4xl font-extrabold text-center mb-12">
            Γ£¿ Turn Your Ideas Into{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-blue-400">
              Amazing Stories!
          <h1 className="text-slate-900 dark:text-gray-300 text-2xl sm:text-3xl md:text-4xl font-extrabold text-center mb-12">
            ├ó┼ô┬¿ {text.titleStart}{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-blue-400">

              {text.titleAccent}
            </span>{" "}
            ├ó┼ô┬¿
          </h1>

          {showTemplateScreen ? (
            <TemplateSelectionScreen onSelectTemplate={handleSelectTemplate} onStartBlank={handleStartBlank} />
          ) : (
          <div className="max-w-3xl mx-auto px-4 sm:px-0">
            <div className="bg-blue-500/10 rounded-md p-4 border border-gray-400">
<div className="relative">
  <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
    <div className="flex flex-wrap gap-2 mb-3">
      {[
        "≡ƒÄ¡ Drama",
        "≡ƒÿé Comedy",
        "≡ƒÿ▒ Horror",
        "≡ƒÆò Romance",
        "≡ƒÜÇ Sci-Fi",
        "≡ƒºÖ Fantasy",
        "≡ƒöì Mystery",
        "≡ƒîƒ Adventure",
      ].map((genre) => (
        <button
          key={genre}
          type="button"
          onClick={() =>
            setSelectedGenre(selectedGenre === genre ? "" : genre)
          }
          className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
            selectedGenre === genre
              ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/30"
              : "bg-white/10 text-gray-400 hover:bg-white/20 hover:text-gray-200"
          }`}
        >
          {genre}
        </button>
      ))}
    </div>
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

          <div className="max-w-3xl mx-auto px-4 sm:px-0">
            <div className="bg-gray-50 rounded-md p-4 border border-gray-200 text-slate-900 dark:bg-blue-500/10 dark:border-gray-400 dark:text-white overflow-hidden">
              <div className="relative w-full">
                <form className="space-y-4 w-full" onSubmit={handleSubmit(onSubmit)}>

                  {/* ├óΓÇ¥Γé¼├óΓÇ¥Γé¼ Genre chips ├óΓÇ¥Γé¼├óΓÇ¥Γé¼ */}
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
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${selectedGenre === genre.value
                            ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/30"
                            : "bg-white/10 text-gray-400 hover:bg-white/20 hover:text-gray-200"
                          } ${loading ? "cursor-not-allowed opacity-50" : ""}`}
                      >
                        {genre.icon} {genreLabels[genre.name]}
                      </button>
                    ))}
                  </div>

                  {/* ├óΓÇ¥Γé¼├óΓÇ¥Γé¼ NEW: Tone picker ├óΓÇ¥Γé¼├óΓÇ¥Γé¼ */}
                  {/* ΓöÇΓöÇ NEW: Tone picker ΓöÇΓöÇ */}
                  <TonePicker selected={selectedTone} onChange={setSelectedTone} />


                    const rawParts = segment.text.split(/(\s+)/);
                    let wordOffset = 0;


                      {(["short", "medium", "long"] as const).map((length) => (
                        <button
                          key={length}
                          type="button"
                          disabled={loading}
                          onClick={() => setSelectedLength(length)}
                          className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${selectedLength === length
                              ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/30"
                              : "bg-white/10 text-gray-400 hover:bg-white/20 hover:text-gray-200"
                            } ${loading ? "cursor-not-allowed opacity-50" : ""}`}
                        >
                          {text[length]}
                        </button>
                      ))}
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

                          disabled={loading}
                          onClick={() => !loading && setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                          className={`flex items-center gap-2 px-3 py-1 bg-white/10 text-gray-300 border border-slate-700/50 rounded-full text-xs font-semibold hover:bg-white/20 transition-all duration-200 ${loading ? "cursor-not-allowed opacity-50" : "cursor-pointer"
                            }`}
                        >
                          <span>{LANGUAGES.find(l => l.name === selectedLanguage)?.name || "English"}</span>
                          <span className="text-gray-400 text-[10px]">├óΓÇô┬╝</span>

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

                                  className={`w-full text-left px-3 py-2 text-xs transition-colors duration-150 cursor-pointer ${selectedLanguage === lang.name
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


                  {/* ├óΓÇ¥Γé¼├óΓÇ¥Γé¼ Prompt textarea ├óΓÇ¥Γé¼├óΓÇ¥Γé¼ */}
                  <div className="relative w-full">

                    <textarea
                      {...register("prompt")}
                      ref={(el) => {
                        register("prompt").ref(el);
                        inputRef.current = el;
                      }}

                      disabled={loading}
                      aria-busy={loading}
                      className={`w-full h-32 sm:h-40 resize-none border-none outline-none bg-transparent text-gray-800 dark:text-gray-200 focus:ring-0 text-lg leading-relaxed tracking-wide placeholder:italic placeholder:text-gray-500 dark:placeholder:text-gray-400 pr-12 transition-colors duration-200 box-border ${isOverLimit
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
                        // Keep existing behavior: Enter -> next step (unless Shift is held)
                        if (e.key === "Enter" && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
                          e.preventDefault();

                          if (isGenerateDisabled) {
                            return;
                          }
                          const form = e.currentTarget.closest("form");
                          if (form) form.requestSubmit();

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

                        disabled={loading}
                        onClick={handleClearPrompt}
                        className={`absolute right-2 top-2 text-gray-400 transition-colors duration-200 ${loading
                            ? "cursor-not-allowed opacity-50"
                            : "hover:text-red-500"
                          }`}
                        aria-label={text.close}
                        title={text.close}

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

                      <span
  aria-live="polite"
  className={`text-[11px] font-bold tabular-nums shrink-0 ml-auto ${
    isOverLimit || isDangerLimit
      ? "text-red-500 dark:text-red-400"
      : isNearLimit
      ? "text-amber-500"
      : "text-slate-400"
  }`}
>
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

                      disabled={loading}
                      onClick={() => !loading && setIsRecentPromptsOpen(!isRecentPromptsOpen)}
                      className={`absolute right-2 top-12 bg-indigo-600 text-white px-3 py-2 rounded-lg text-sm transition-colors duration-200 flex items-center gap-2 ${loading
                          ? "cursor-not-allowed opacity-60"
                          : "hover:bg-indigo-700"
                        }`}
                      aria-label={text.recentPrompts}
                      title={text.recentPrompts}

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


                    <div className="flex items-center justify-between mt-1 px-1">
                      {isOverLimit ? (
                        <p className="text-xs text-red-400 flex items-center gap-1">
                          <span>ΓÜá∩╕Å</span> {text.characterLimit}
                        </p>
                      ) : isNearLimit ? (
                        <p className="text-xs text-yellow-400 flex items-center gap-1">
                          <span>ΓÜá∩╕Å</span>{" "}
                          {MAX_PROMPT_LENGTH - textareaValue.length} {text.charactersRemaining}
                        </p>
                      ) : (
                        <span />
                      )}

                      <span
                        className={`text-xs tabular-nums ml-auto ${isOverLimit
                            ? "text-red-400 font-medium"
                            : isNearLimit
                              ? "text-yellow-400"
                              : "text-gray-500"
                          }`}
                      >
                        {textareaValue.length} / {MAX_PROMPT_LENGTH}
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
                            <div className="flex gap-2">
                              {login && (
                                <>
                                  <select 
                                    className="text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded px-2"
                                    onChange={(e) => {
                                      if (e.target.value) handleLoadFromRoster(char.id, e.target.value);
                                    }}
                                  >
                                    <option value="">Load from Roster...</option>
                                    {rosterCharacters.map((rc: any) => (
                                      <option key={rc._id} value={rc._id}>{rc.name} ({rc.role})</option>
                                    ))}
                                  </select>
                                  <button
                                    type="button"
                                    onClick={() => handleSaveToRoster(char)}
                                    disabled={isSavingCharacter}
                                    className="text-xs font-bold text-indigo-500 hover:text-indigo-600 dark:text-indigo-400 cursor-pointer"
                                  >
                                    Save
                                  </button>
                                </>
                              )}
                              <button
                                type="button"
                                onClick={() => handleRemoveCharacter(char.id)}
                                className="text-xs font-bold text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 hover:underline cursor-pointer"
                              >
                                Remove
                              </button>
                            </div>
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
                          <div className="flex gap-2">
                            {login && (
                              <>
                                <select 
                                  className="text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded px-2"
                                  onChange={(e) => {
                                    if (e.target.value) handleLoadFromRoster(char.id, e.target.value);
                                  }}
                                >
                                  <option value="">Load from Roster...</option>
                                  {rosterCharacters.map((rc: any) => (
                                    <option key={rc._id} value={rc._id}>{rc.name} ({rc.role})</option>
                                  ))}
                                </select>
                                <button
                                  type="button"
                                  onClick={() => handleSaveToRoster(char)}
                                  disabled={isSavingCharacter}
                                  className="text-xs font-bold text-indigo-500 hover:text-indigo-600 dark:text-indigo-400 cursor-pointer"
                                >
                                  Save
                                </button>
                              </>
                            )}
                            <button
                              type="button"
                              onClick={() => handleRemoveCharacter(char.id)}
                              className="text-xs font-bold text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 hover:underline cursor-pointer"
                            >
                              Remove
                            </button>
                          </div>
                        </div>

    <div className="flex flex-wrap items-center gap-2 mb-3">
      <span className="text-xs text-gray-400 mr-1">≡ƒôÅ Length:</span>

      {lengths.map((length) => (
        <button
          key={length}
          type="button"
          onClick={() => setSelectedLength(length)}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
            selectedLength === length
              ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/30"
              : "bg-white/10 text-gray-400 hover:bg-white/20 hover:text-gray-200"
          }`}
        >
          {length.charAt(0).toUpperCase() + length.slice(1)}
        </button>
      ))}
    </div>

    <div className="flex flex-wrap items-center gap-2 mb-3">
      <span className="text-xs text-gray-400 mr-1">👥 Audience:</span>
      {["Children (5-10)", "Young Adult (12-18)", "General Audience", "Professionals"].map((audience) => (
        <button
          key={audience}
          type="button"
          onClick={() => setSelectedAudience(audience)}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
            selectedAudience === audience
              ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/30"
              : "bg-white/10 text-gray-400 hover:bg-white/20 hover:text-gray-200"
          }`}
        >
          {audience}
        </button>
      ))}
    </div>

    <div className="relative">
      <textarea
  {...register("prompt")}
  ref={(el) => {
    register("prompt").ref(el);
    inputRef.current = el;
  }}
        className={`w-full h-32 sm:h-40 resize-none border-none outline-none bg-transparent text-gray-300 focus:ring-0 text-lg leading-relaxed tracking-wide placeholder:italic placeholder:text-gray-500 pr-10 transition-colors duration-200 ${
          isOverLimit
            ? "ring-1 ring-red-500 rounded"
            : isNearLimit
            ? "ring-1 ring-yellow-400 rounded"
            : ""
        }`}
        placeholder="Every great story begins with a single idea. What's yours?"
        value={textareaValue}
        maxLength={MAX_PROMPT_LENGTH}
        onChange={(e) => setTextareaValue(e.target.value)}
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
          className="absolute right-2 top-2 text-gray-400 hover:text-red-500 transition-colors duration-200"
          aria-label="Clear prompt"
          title="Clear prompt"
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

      <div className="flex items-center justify-between mt-1 px-1">
        {isOverLimit ? (
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
        disabled={loading || isOverLimit}
        className={`w-full sm:w-auto justify-center rounded-lg bg-gradient-to-r from-blue-400 to-indigo-500 text-gray-200 px-6 py-3 font-semibold ${
          loading || isOverLimit
            ? "opacity-50 cursor-not-allowed"
            : "hover:shadow-lg hover:shadow-indigo-500/50"
        } transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 group cursor-pointer`}
      >
        <i className="fas fa-wand-magic-sparkles text-xl transition-transform duration-300 group-hover:animate-wiggle"></i>
        {loading ? "Generating..." : "Generate"}
      </button>
    </div>
  </form>
</div>
            </div>

            <div className="w-full max-w-2xl m-auto mt-4">
  <h1 className="text-sm text-gray-500 mb-1">
    Here are some example prompts you can refer to:-
  </h1>

  <div className="relative" ref={dropdownRef}>
    <button
      type="button"
      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      className="w-full p-3 bg-slate-800 text-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 flex items-center justify-between text-sm text-left transition-all duration-200"
    >
      <span className="truncate pr-4">
        {selectedPrompt || "Select a prompt"}
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
      <ul className="absolute z-10 w-full mt-1 max-h-60 overflow-y-auto bg-slate-800 border border-slate-700/50 rounded-lg shadow-xl focus:outline-none divide-y divide-slate-700/30">
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

                  {/* ├óΓÇ¥Γé¼├óΓÇ¥Γé¼ Generate button row ├óΓÇ¥Γé¼├óΓÇ¥Γé¼ */}
                  <div className="flex items-center justify-between mt-2 w-full">
                    {/* Active tone badge */}
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      {selectedTone && (
                        <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-white/10 border border-white/10">
                          {TONES.find((t) => t.label === selectedTone)?.emoji}{" "}
                          <span className="font-medium">{selectedTone}</span>

                          <button
                            key={s.name}
                            type="button"

                            disabled={loading}
                            onClick={() => setSelectedTone("")}
                            className={`ml-1 text-gray-500 transition-colors ${loading
                                ? "cursor-not-allowed opacity-50"
                                : "hover:text-red-400"
                              }`}
                            aria-label="Remove tone"
                          >
                            ├âΓÇö

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

                      type="submit"
                      disabled={isGenerateDisabled}
                      aria-busy={loading}
                      aria-disabled={isGenerateDisabled}
                      className={`rounded-lg bg-gradient-to-r from-blue-400 to-indigo-500 text-gray-200 px-6 py-3 font-semibold ${isGenerateDisabled
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
                    <p className="text-xs text-slate-400 mt-3 text-center max-w-sm px-4 leading-relaxed">
                      Uses the story context to produce 5 unique ending variations (Happy, Dark, Plot Twist, Open, Cliffhanger) for comparison.
                    </p>
                  </div>

                  {loading && (
                    <p className="text-sm text-indigo-300 mt-3 text-right" aria-live="polite">
                      Your story is being generated. You can cancel the request if it takes too long.
                    </p>
                  )}
                </form>
              </div>
            </div>


                  <span className={`text-[11px] font-bold tabular-nums shrink-0 ml-auto ${
                    isOverLimit || isDangerLimit ? "text-red-500 dark:text-red-400" : isNearLimit ? "text-amber-500" : "text-slate-400"
                  }`}>
                    {textareaValue.length} / {MAX_PROMPT_LENGTH}
                  </span>

                  <span
                    className={`text-gray-300 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""
                      }`}
                  >
                    ├óΓÇô┬╝
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

              {/* Quota Progress Bar */}
              {login && usageData && (
                <div className="w-full mb-4 p-4 rounded-xl border bg-slate-900/50 border-slate-800/80 backdrop-blur-md text-left box-border">
                  <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-1.5 select-none">
                    <i className="fas fa-chart-pie text-indigo-400" />
                    Monthly Quota Limits ({usageData.plan.toUpperCase()})
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Story Generations */}
                    <div>
                      <div className="flex justify-between text-xs mb-1 select-none">
                        <span className="text-slate-400 font-medium">Story Generations</span>
                        <span className="text-slate-300 font-bold">
                          {usageData.usage.story_generate.used} / {usageData.usage.story_generate.limit === null || usageData.usage.story_generate.limit === Infinity ? "∞" : usageData.usage.story_generate.limit}
                        </span>
                      </div>
                      <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-indigo-500 h-1.5 rounded-full transition-all duration-500"
                          style={{
                            width: `${usageData.usage.story_generate.limit === null || usageData.usage.story_generate.limit === Infinity ? 0 : Math.min(100, (usageData.usage.story_generate.used / (usageData.usage.story_generate.limit || 1)) * 100)}%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* Story Continuations */}
                    <div>
                      <div className="flex justify-between text-xs mb-1 select-none">
                        <span className="text-slate-400 font-medium">Story Continuations</span>
                        <span className="text-slate-300 font-bold">
                          {usageData.usage.story_continue.used} / {usageData.usage.story_continue.limit === null || usageData.usage.story_continue.limit === Infinity ? "∞" : usageData.usage.story_continue.limit}
                        </span>
                      </div>
                      <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-purple-500 h-1.5 rounded-full transition-all duration-500"
                          style={{
                            width: `${usageData.usage.story_continue.limit === null || usageData.usage.story_continue.limit === Infinity ? 0 : Math.min(100, (usageData.usage.story_continue.used / (usageData.usage.story_continue.limit || 1)) * 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  
                  {usageData.plan === "free" && (
                    <p className="text-[10px] text-indigo-400/80 mt-3 flex items-center gap-1 select-none">
                      <i className="fas fa-info-circle" />
                      Free quota resets on {new Date(usageData.resetsAt).toLocaleDateString()}.
                    </p>
                  )}
                </div>
              )}

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
      </div>
      )}

      {showHelpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-md w-full">
            <h2 className="text-xl font-bold text-white mb-4">
              Keyboard Shortcuts
            </h2>

            <div className="space-y-3 text-gray-300 text-sm">
              <div><kbd>?</kbd> Open help</div>
              <div><kbd>Esc</kbd> Close help</div>
              <div><kbd>/</kbd> Focus prompt</div>
              <div><kbd>Ctrl + Enter</kbd> Generate story</div>
              <div><kbd>Ctrl + S</kbd> Publish story</div>
            </div>

            <button
              onClick={() => setShowHelpModal(false)}
              className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg"

            >
              Close
            </button>
          </div>
        </div>
      )}

      {loading && <StoryGeneratingAnimation />}
      <StoriesViewComponent
        stories={stories}
        isLogin={login}
        setStories={setStories}
      />
      <div className="absolute top-[-200px] left-[250px] w-[800px] h-[350px] bg-blue-500/20 rounded-full blur-3xl -z-10"></div>

      <div className="fixed top-[-200px] left-[250px] w-[800px] h-[350px] bg-blue-500/20 rounded-full blur-3xl -z-10"></div>

      <div className="absolute top-[-200px] left-[250px] w-[800px] h-[350px] bg-blue-500/20 rounded-full blur-3xl -z-10"></div>

      {showLimitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#0f172a] border border-white/10 rounded-2xl shadow-[0_0_15px_rgba(59,130,246,0.5)] max-w-md w-full p-6 transform transition-all">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-lock text-2xl text-blue-400"></i>
              </div>
              <h3 className="text-2xl font-bold text-gray-200 mb-2">
                Free Limit Reached
              </h3>
              <p className="text-gray-400 mb-6 leading-relaxed">
                You've used all 3 free story generations. Login to continue
                creating more stories.
              </p>
              <div className="flex flex-col gap-3">
                <Link
                  to="/login"
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-3 px-4 rounded-xl transition-all shadow-lg hover:shadow-indigo-500/25"
                >
                  Login
                </Link>
                <button
                  onClick={() => setShowLimitModal(false)}
                  className="w-full bg-transparent hover:bg-white/5 text-gray-400 hover:text-gray-300 font-medium py-3 px-4 rounded-xl transition-all"
                >
                  Continue Browsing
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


      <UpgradeModal isOpen={showUpgradeModal} onClose={() => setShowUpgradeModal(false)} plan={usageData?.plan || "free"} />
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
};

export default StoriesComponent;


