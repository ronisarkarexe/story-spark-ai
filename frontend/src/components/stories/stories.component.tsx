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
  "🧙 Fantasy": "/audio/fantasy.mp3",
  "😱 Horror": "/audio/horror.mp3",
  "💕 Romance": "/audio/romance.mp3",
  "🎭 Drama": "/audio/drama.mp3",
  "😂 Comedy": "/audio/comedy.mp3",
  "🚀 Sci-Fi": "/audio/sci-fi.mp3",
  "🔍 Mystery": "/audio/mystery.mp3",
  "🌟 Adventure": "/audio/adventure.mp3",
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
  { value: "🎭 Drama", icon: "🎭", name: "Drama" },
  { value: "😂 Comedy", icon: "😂", name: "Comedy" },
  { value: "😱 Horror", icon: "😱", name: "Horror" },
  { value: "ðŸ'• Romance", icon: "ðŸ'•", name: "Romance" },
  { value: "🚀 Sci-Fi", icon: "🚀", name: "Sci-Fi" },
  { value: "🧙 Fantasy", icon: "🧙", name: "Fantasy" },
  { value: "🔍 Mystery", icon: "🔍", name: "Mystery" },
  { value: "🌟 Adventure", icon: "🌟", name: "Adventure" },
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
    Drama: "नाटक", Comedy: "हासà¥à¤¯", Horror: "डरावनी", Romance: "पà¥à¤°à¥‡à¤®",
    "Sci-Fi": "विजà¥à¤žà¤¾à¤¨ कथा", Fantasy: "कलà¥à¤ªà¤¨à¤¾", Mystery: "रहसà¥à¤¯", Adventure: "रोमांच",
  },
  German: {
    Drama: "Drama", Comedy: "Komodie", Horror: "Horror", Romance: "Romanze",
    "Sci-Fi": "Science-Fiction", Fantasy: "Fantasy", Mystery: "Mysterie", Adventure: "Abenteuer",
  },
  Japanese: {
    Drama: "ドラマ", Comedy: "コメディ", Horror: "ホラー", Romance: "ロマンス",
    "Sci-Fi": "SF", Fantasy: "ファンタジー", Mystery: "ミステリー", Adventure: "冒険",
  },
  Korean: {
    Drama: "드라마", Comedy: "코미디", Horror: "공포", Romance: "로맨스",
    "Sci-Fi": "SF", Fantasy: "판타지", Mystery: "미스터리", Adventure: "모험",
  },
  Bengali: {
    Drama: "নাটক", Comedy: "কৌতুক", Horror: "ভৌতিক", Romance: "প্রেম",
    "Sci-Fi": "বিজ্ঞান কল্পকাহিনি", Fantasy: "কল্পনা", Mystery: "রহস্য", Adventure: "অভিযান",
  },
  Tamil: {
    Drama: "நாடகம்", Comedy: "நகைச்சுவை", Horror: "திகில்", Romance: "காதல்",
    "Sci-Fi": "அறிவியல் புனைவு", Fantasy: "கற்பனை", Mystery: "மர்மம்", Adventure: "சாகசம்",
  },
  Telugu: {
    Drama: "నాటకం", Comedy: "హాస్యం", Horror: "భయానకం", Romance: "ప్రేమ",
    "Sci-Fi": "విజ్ఞాన కథ", Fantasy: "కాల్పనికం", Mystery: "రహస్యం", Adventure: "సాహసం",
  },
  Marathi: {
    Drama: "नाटक", Comedy: "विनोद", Horror: "भयकथा", Romance: "प्रेमकथा",
    "Sci-Fi": "विजà¥à¤žà¤¾à¤¨à¤•था", Fantasy: "कलà¥à¤ªà¤¨à¤¾à¤°à¤®à¥à¤¯", Mystery: "रहसà¥à¤¯", Adventure: "साहस",
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
    short: "Short", medium: "Medium", long: "Long", promptPlaceholder: "प्रत्येक महान कथा एका कल्पनेपासून सुरू होते. तुमची कल्पना काय आहे?",
    keyboardTip: "कीबोर्ड सूचना:", press: "Press", toGenerate: "तयार करण्यासाठी", alsoWorks: "also works", forNewLine: "नवीन ओळीसाठी",
    generating: "Generating...", generate: "Generate", examples: "काही उदाहरण प्रॉम्प्ट:",
    selectPrompt: "प्रॉम्प्ट निवडा", characterLimit: "अक्षर मर्यादा पूर्ण - निर्मिती बंद आहे",
    charactersRemaining: "अक्षरे बाकी", shortcuts: "कीबोर्ड शॉर्टकट", openHelp: "Open help", closeHelp: "Close help",
    focusPrompt: "प्रॉम्प्टवर लक्ष", generateStory: "Generate story", publishStory: "कथा प्रकाशित करा", close: "Close",
    freeLimitReached: "मोफत मर्यादा पूर्ण", freeLimitMessage: "तुम्ही सर्व 3 मोफत कथा निर्मिती वापरल्या आहेत. पुढे सुरू ठेवण्यासाठी लॉग इन करा.",
    continueBrowsing: "ब्राउझिंग सुरू ठेवा", recentPrompts: "अलीकडील प्रॉम्प्ट", usePrompt: "Use", delete: "Delete", clearAll: "सर्व मुडून टाका", noRecentPrompts: "अलीकडील प्रॉम्प्ट नाहीत",
  },
  Spanish: {
    back: "VOLVER", freeAccess: "Acceso gratis para 3 solicitudes", login: "Iniciar sesion", forMore: "para obtener mas!",
    perMonth: "Por mes", upgrade: "Mejorar", monthlyRequests: "Solicitudes este mes", totalPosts: "Publicaciones totales",
    titleStart: "Convierte tus ideas en", titleAccent: "historias increibles!", length: "Longitud", language: "Idioma",
    short: "Corta", medium: "Media", long: "Larga", promptPlaceholder: "प्रत्येक महान कथा एका कल्पनेपासून सुरू होते. तुमची कल्पना काय आहे?",
    keyboardTip: "कीबोर्ड सूचना:", press: "Pulsa", toGenerate: "तयार करण्यासाठी", alsoWorks: "tambien funciona", forNewLine: "नवीन ओळीसाठी",
    generating: "Generando...", generate: "Generar", examples: "काही उदाहरण प्रॉम्प्ट:",
    selectPrompt: "प्रॉम्प्ट निवडा", characterLimit: "अक्षर मर्यादा पूर्ण - निर्मिती बंद आहे",
    charactersRemaining: "अक्षरे बाकी", shortcuts: "कीबोर्ड शॉर्टकट", openHelp: "Abrir ayuda", closeHelp: "Cerrar ayuda",
    focusPrompt: "प्रॉम्प्टवर लक्ष", generateStory: "Generar historia", publishStory: "कथा प्रकाशित करा", close: "Cerrar",
    freeLimitReached: "मोफत मर्यादा पूर्ण", freeLimitMessage: "तुम्ही सर्व 3 मोफत कथा निर्मिती वापरल्या आहेत. पुढे सुरू ठेवण्यासाठी लॉग इन करा.",
    continueBrowsing: "ब्राउझिंग सुरू ठेवा", recentPrompts: "अलीकडील प्रॉम्प्ट", usePrompt: "Usar", delete: "Eliminar", clearAll: "सर्व मुडून टाका", noRecentPrompts: "अलीकडील प्रॉम्प्ट नाहीत",
  },
  French: {
    back: "RETOUR", freeAccess: "Acces gratuit pour 3 demandes", login: "Connexion", forMore: "pour en obtenir plus !",
    perMonth: "Par mois", upgrade: "Mettre a niveau", monthlyRequests: "Demandes ce mois-ci", totalPosts: "Publications totales",
    titleStart: "Transformez vos idees en", titleAccent: "histoires incroyables !", length: "Longueur", language: "Langue",
    short: "Courte", medium: "Moyenne", long: "Longue", promptPlaceholder: "प्रत्येक महान कथा एका कल्पनेपासून सुरू होते. तुमची कल्पना काय आहे?",
    keyboardTip: "कीबोर्ड सूचना:", press: "Appuyez sur", toGenerate: "तयार करण्यासाठी", alsoWorks: "fonctionne aussi", forNewLine: "नवीन ओळीसाठी",
    generating: "Generation...", generate: "Generer", examples: "काही उदाहरण प्रॉम्प्ट:",
    selectPrompt: "प्रॉम्प्ट निवडा", characterLimit: "अक्षर मर्यादा पूर्ण - निर्मिती बंद आहे",
    charactersRemaining: "अक्षरे बाकी", shortcuts: "कीबोर्ड शॉर्टकट", openHelp: "Ouvrir l'aide", closeHelp: "Fermer l'aide",
    focusPrompt: "प्रॉम्प्टवर लक्ष", generateStory: "Generer une histoire", publishStory: "कथा प्रकाशित करा", close: "Fermer",
    freeLimitReached: "मोफत मर्यादा पूर्ण", freeLimitMessage: "तुम्ही सर्व 3 मोफत कथा निर्मिती वापरल्या आहेत. पुढे सुरू ठेवण्यासाठी लॉग इन करा.",
    continueBrowsing: "ब्राउझिंग सुरू ठेवा", recentPrompts: "अलीकडील प्रॉम्प्ट", usePrompt: "Utiliser", delete: "Supprimer", clearAll: "सर्व मुडून टाका", noRecentPrompts: "अलीकडील प्रॉम्प्ट नाहीत",
  },
  Portuguese: {
    back: "VOLTAR", freeAccess: "Acesso gratuito para 3 solicitacoes", login: "Entrar", forMore: "para ter mais!",
    perMonth: "Por mes", upgrade: "Atualizar", monthlyRequests: "Solicitacoes neste mes", totalPosts: "Total de publicacoes",
    titleStart: "Transforme suas ideias em", titleAccent: "historias incriveis!", length: "Comprimento", language: "Idioma",
    short: "Curta", medium: "Media", long: "Longa", promptPlaceholder: "प्रत्येक महान कथा एका कल्पनेपासून सुरू होते. तुमची कल्पना काय आहे?",
    keyboardTip: "कीबोर्ड सूचना:", press: "Pressione", toGenerate: "तयार करण्यासाठी", alsoWorks: "tambem funciona", forNewLine: "नवीन ओळीसाठी",
    generating: "Gerando...", generate: "Gerar", examples: "काही उदाहरण प्रॉम्प्ट:",
    selectPrompt: "प्रॉम्प्ट निवडा", characterLimit: "अक्षर मर्यादा पूर्ण - निर्मिती बंद आहे",
    charactersRemaining: "अक्षरे बाकी", shortcuts: "कीबोर्ड शॉर्टकट", openHelp: "Abrir ajuda", closeHelp: "Fechar ajuda",
    focusPrompt: "प्रॉम्प्टवर लक्ष", generateStory: "Gerar historia", publishStory: "कथा प्रकाशित करा", close: "Fechar",
    freeLimitReached: "मोफत मर्यादा पूर्ण", freeLimitMessage: "तुम्ही सर्व 3 मोफत कथा निर्मिती वापरल्या आहेत. पुढे सुरू ठेवण्यासाठी लॉग इन करा.",
    continueBrowsing: "ब्राउझिंग सुरू ठेवा", recentPrompts: "अलीकडील प्रॉम्प्ट", usePrompt: "Usar", delete: "Deletar", clearAll: "सर्व मुडून टाका", noRecentPrompts: "अलीकडील प्रॉम्प्ट नाहीत",
  },
  Hindi: {
    back: "वापस", freeAccess: "3 अनुरोधों के लिए मुफ्त उपयोग", login: "लॉग इन", forMore: "और पाने के लिए!",
    perMonth: "प्रति माह", upgrade: "अपग्रेड", monthlyRequests: "इस माह के अनुरोध", totalPosts: "कुल पोस्ट",
    titleStart: "अपने विचारों को बदलें", titleAccent: "अद्भुत कथांमध्ये!", length: "लांबी", language: "भाषा",
    short: "छोटी", medium: "मध्यम", long: "लंबी", promptPlaceholder: "प्रत्येक महान कथा एका कल्पनेपासून सुरू होते. तुमची कल्पना काय आहे?",
    keyboardTip: "कीबोर्ड सूचना:", press: "दबाएं", toGenerate: "तयार करण्यासाठी", alsoWorks: "भी काम करता है", forNewLine: "नवीन ओळीसाठी",
    generating: "बन रही है...", generate: "बनाएं", examples: "काही उदाहरण प्रॉम्प्ट:",
    selectPrompt: "प्रॉम्प्ट निवडा", characterLimit: "अक्षर मर्यादा पूर्ण - निर्मिती बंद आहे", charactersRemaining: "अक्षरे बाकी",
    shortcuts: "कीबोर्ड शॉर्टकट", openHelp: "सहायता खोलें", closeHelp: "सहायता बंद करें", focusPrompt: "प्रॉम्प्टवर लक्ष",
    generateStory: "कहानी बनाएं", publishStory: "कथा प्रकाशित करा", close: "बंद करें", freeLimitReached: "मोफत मर्यादा पूर्ण",
    freeLimitMessage: "तुम्ही सर्व 3 मोफत कथा निर्मिती वापरल्या आहेत. पुढे सुरू ठेवण्यासाठी लॉग इन करा.",
    continueBrowsing: "ब्राउझिंग सुरू ठेवा", recentPrompts: "अलीकडील प्रॉम्प्ट", usePrompt: "उपयोग करें", delete: "हटाएं", clearAll: "सर्व मुडून टाका", noRecentPrompts: "अलीकडील प्रॉम्प्ट नाहीत",
  },
  German: {
    back: "ZURUCK", freeAccess: "Kostenloser Zugang fur 3 Anfragen", login: "Anmelden", forMore: "fur mehr!",
    perMonth: "Pro Monat", upgrade: "Upgrade", monthlyRequests: "Anfragen in diesem Monat", totalPosts: "Beitrage insgesamt",
    titleStart: "Verwandle deine Ideen in", titleAccent: "erstaunliche Geschichten!", length: "Lange", language: "Sprache",
    short: "Kurz", medium: "Mittel", long: "Lang", promptPlaceholder: "प्रत्येक महान कथा एका कल्पनेपासून सुरू होते. तुमची कल्पना काय आहे?",
    keyboardTip: "कीबोर्ड सूचना:", press: "Drucke", toGenerate: "तयार करण्यासाठी", alsoWorks: "funktioniert ebenfalls", forNewLine: "नवीन ओळीसाठी",
    generating: "Wird erstellt...", generate: "Erstellen", examples: "काही उदाहरण प्रॉम्प्ट:",
    selectPrompt: "प्रॉम्प्ट निवडा", characterLimit: "अक्षर मर्यादा पूर्ण - निर्मिती बंद आहे", charactersRemaining: "अक्षरे बाकी",
    shortcuts: "कीबोर्ड शॉर्टकट", openHelp: "Hilfe offnen", closeHelp: "Hilfe schliessen", focusPrompt: "प्रॉम्प्टवर लक्ष",
    generateStory: "Geschichte erstellen", publishStory: "कथा प्रकाशित करा", close: "Schliessen", freeLimitReached: "मोफत मर्यादा पूर्ण",
    freeLimitMessage: "तुम्ही सर्व 3 मोफत कथा निर्मिती वापरल्या आहेत. पुढे सुरू ठेवण्यासाठी लॉग इन करा.",
    continueBrowsing: "ब्राउझिंग सुरू ठेवा", recentPrompts: "अलीकडील प्रॉम्प्ट", usePrompt: "Verwenden", delete: "Loschen", clearAll: "सर्व मुडून टाका", noRecentPrompts: "अलीकडील प्रॉम्प्ट नाहीत",
  },
  Japanese: {
    back: "戻る", freeAccess: "3回まで無料で利用できます", login: "ログイン", forMore: "してさらに利用！",
    perMonth: "月ごと", upgrade: "アップグレード", monthlyRequests: "今月のリクエスト", totalPosts: "投稿数",
    titleStart: "アイデアを", titleAccent: "すばらしい物語に！", length: "長さ", language: "言語",
    short: "短め", medium: "中程度", long: "長め", promptPlaceholder: "प्रत्येक महान कथा एका कल्पनेपासून सुरू होते. तुमची कल्पना काय आहे?",
    keyboardTip: "कीबोर्ड सूचना:", press: "押す", toGenerate: "तयार करण्यासाठी", alsoWorks: "も使用可能", forNewLine: "नवीन ओळीसाठी",
    generating: "生成中...", generate: "生成", examples: "काही उदाहरण प्रॉम्प्ट:",
    selectPrompt: "प्रॉम्प्ट निवडा", characterLimit: "अक्षर मर्यादा पूर्ण - निर्मिती बंद आहे", charactersRemaining: "अक्षरे बाकी",
    shortcuts: "कीबोर्ड शॉर्टकट", openHelp: "ヘルプを開く", closeHelp: "ヘルプを閉じる", focusPrompt: "प्रॉम्प्टवर लक्ष",
    generateStory: "物語を生成", publishStory: "कथा प्रकाशित करा", close: "閉じる", freeLimitReached: "मोफत मर्यादा पूर्ण",
    freeLimitMessage: "तुम्ही सर्व 3 मोफत कथा निर्मिती वापरल्या आहेत. पुढे सुरू ठेवण्यासाठी लॉग इन करा.",
    continueBrowsing: "ब्राउझिंग सुरू ठेवा", recentPrompts: "अलीकडील प्रॉम्प्ट", usePrompt: "使用", delete: "削除", clearAll: "सर्व मुडून टाका", noRecentPrompts: "अलीकडील प्रॉम्प्ट नाहीत",
  },
  Korean: {
    back: "뒤로", freeAccess: "요청 3회 무료 이용", login: "로그인", forMore: "하고 더 이용하세요!",
    perMonth: "월별", upgrade: "업그레이드", monthlyRequests: "이번 달 요청", totalPosts: "전체 게시물",
    titleStart: "아이디어를", titleAccent: "멋진 이야기로!", length: "길이", language: "언어",
    short: "짧게", medium: "중간", long: "길게", promptPlaceholder: "प्रत्येक महान कथा एका कल्पनेपासून सुरू होते. तुमची कल्पना काय आहे?",
    keyboardTip: "कीबोर्ड सूचना:", press: "누르기", toGenerate: "तयार करण्यासाठी", alsoWorks: "도 가능", forNewLine: "नवीन ओळीसाठी",
    generating: "생성 중...", generate: "생성", examples: "काही उदाहरण प्रॉम्प्ट:",
    selectPrompt: "प्रॉम्प्ट निवडा", characterLimit: "अक्षर मर्यादा पूर्ण - निर्मिती बंद आहे", charactersRemaining: "अक्षरे बाकी",
    shortcuts: "कीबोर्ड शॉर्टकट", openHelp: "도움말 열기", closeHelp: "도움말 닫기", focusPrompt: "प्रॉम्प्टवर लक्ष",
    generateStory: "이야기 생성", publishStory: "कथा प्रकाशित करा", close: "닫기", freeLimitReached: "मोफत मर्यादा पूर्ण",
    freeLimitMessage: "तुम्ही सर्व 3 मोफत कथा निर्मिती वापरल्या आहेत. पुढे सुरू ठेवण्यासाठी लॉग इन करा.",
    continueBrowsing: "ब्राउझिंग सुरू ठेवा", recentPrompts: "अलीकडील प्रॉम्प्ट", usePrompt: "사용", delete: "삭제", clearAll: "सर्व मुडून टाका", noRecentPrompts: "अलीकडील प्रॉम्प्ट नाहीत",
  },
  Bengali: {
    back: "ফিরে যান", freeAccess: "৩টি অনুরোধের জন্য বিনামূল্যে ব্যবহার", login: "লগ ইন", forMore: "করে আরও পান!",
    perMonth: "প্রতি মাসে", upgrade: "আপগ্রেড", monthlyRequests: "এই মাসের অনুরোধ", totalPosts: "মোট পোস্ট",
    titleStart: "আপনার ভাবনাকে বদলে দিন", titleAccent: "অসাধারণ গল্পে!", length: "দৈর্ঘ্য", language: "ভাষা",
    short: "ছোট", medium: "মাঝারি", long: "লম্বা", promptPlaceholder: "प्रत्येक महान कथा एका कल्पनेपासून सुरू होते. तुमची कल्पना काय आहे?",
    keyboardTip: "कीबोर्ड सूचना:", press: "চাপুন", toGenerate: "तयार करण्यासाठी", alsoWorks: "এটিও কাজ করে", forNewLine: "नवीन ओळीसाठी",
    generating: "তৈরি হচ্ছে...", generate: "তৈরি করুন", examples: "काही उदाहरण प्रॉम्प्ट:",
    selectPrompt: "प्रॉम्प्ट निवडा", characterLimit: "अक्षर मर्यादा पूर्ण - निर्मिती बंद आहे", charactersRemaining: "अक्षरे बाकी",
    shortcuts: "कीबोर्ड शॉर्टकट", openHelp: "সহায়তা খুলুন", closeHelp: "সহায়তা বন্ধ করুন", focusPrompt: "प्रॉम्प्टवर लक्ष",
    generateStory: "গল্প তৈরি করুন", publishStory: "कथा प्रकाशित करा", close: "বন্ধ করুন", freeLimitReached: "मोफत मर्यादा पूर्ण",
    freeLimitMessage: "तुम्ही सर्व 3 मोफत कथा निर्मिती वापरल्या आहेत. पुढे सुरू ठेवण्यासाठी लॉग इन करा.",
    continueBrowsing: "ब्राउझिंग सुरू ठेवा", recentPrompts: "अलीकडील प्रॉम्प्ट", usePrompt: "ব্যবহার করুন", delete: "মুছে ফেলুন", clearAll: "सर्व मुडून टाका", noRecentPrompts: "अलीकडील प्रॉम्प्ट नाहीत",
  },
  Tamil: {
    back: "திரà¯à®®à¯à®ªà¯", freeAccess: "3 கோரிகà¯à®•ைகளà¯à®•à¯à®•௠இலவச அணà¯à®•லà¯", login: "உளà¯à®¨à¯à®´à¯ˆ", forMore: "செயà¯à®¤à¯ மேலà¯à®®à¯ பெறà¯à®™à¯à®•ளà¯!",
    perMonth: "மாததà¯à®¤à®¿à®±à¯à®•à¯", upgrade: "மேமà¯à®ªà®Ÿà¯à®¤à¯à®¤à¯", monthlyRequests: "இநà¯à®¤ மாத கோரிகà¯à®•ைகளà¯", totalPosts: "மொதà¯à®¤ பதிவà¯à®•ளà¯",
    titleStart: "உஙà¯à®•ள௠எணà¯à®£à®™à¯à®•ளை", titleAccent: "à®…à®±à¯à®ªà¯à®¤ கதைகளாக மாறà¯à®±à¯à®™à¯à®•ளà¯!", length: "நீளமà¯", language: "மொழி",
    short: "சிறியதà¯", medium: "நடà¯à®¤à¯à®¤à®°à®®à¯", long: "நீளமானதà¯", promptPlaceholder: "प्रत्येक महान कथा एका कल्पनेपासून सुरू होते. तुमची कल्पना काय आहे?",
    keyboardTip: "कीबोर्ड सूचना:", press: "à®…à®´à¯à®¤à¯à®¤à®µà¯à®®à¯", toGenerate: "तयार करण्यासाठी", alsoWorks: "இதà¯à®µà¯à®®à¯ செயலà¯à®ªà®Ÿà¯à®®à¯", forNewLine: "नवीन ओळीसाठी",
    generating: "உரà¯à®µà®¾à®•à¯à®•à¯à®•ிறதà¯...", generate: "உரà¯à®µà®¾à®•à¯à®•à¯", examples: "काही उदाहरण प्रॉम्प्ट:",
    selectPrompt: "प्रॉम्प्ट निवडा", characterLimit: "अक्षर मर्यादा पूर्ण - निर्मिती बंद आहे", charactersRemaining: "अक्षरे बाकी",
    shortcuts: "कीबोर्ड शॉर्टकट", openHelp: "உதவி திற", closeHelp: "உதவி மூடà¯", focusPrompt: "प्रॉम्प्टवर लक्ष",
    generateStory: "கதை உரà¯à®µà®¾à®•à¯à®•à¯", publishStory: "कथा प्रकाशित करा", close: "மூடà¯", freeLimitReached: "मोफत मर्यादा पूर्ण",
    freeLimitMessage: "तुम्ही सर्व 3 मोफत कथा निर्मिती वापरल्या आहेत. पुढे सुरू ठेवण्यासाठी लॉग इन करा.",
    continueBrowsing: "ब्राउझिंग सुरू ठेवा", recentPrompts: "अलीकडील प्रॉम्प्ट", usePrompt: "பயனà¯à®ªà®Ÿà¯à®¤à¯à®¤à¯", delete: "நீகà¯à®•à¯", clearAll: "सर्व मुडून टाका", noRecentPrompts: "अलीकडील प्रॉम्प्ट नाहीत",
  },
  Telugu: {
    back: "వెనుకకు", freeAccess: "3 అభ్యర్థనలకు ఉచిత ప్రవేశం", login: "లాగిన్", forMore: "చేసి మరిన్ని పొందండి!",
    perMonth: "నెలకు", upgrade: "అప్‌గ్రేడ్", monthlyRequests: "ఈ నెల అభ్యర్థనలు", totalPosts: "మొత్తం పోస్టులు",
    titleStart: "మీ ఆలోచనలను", titleAccent: "అద్భుత కథలుగా మార్చండి!", length: "పొడవు", language: "భాష",
    short: "చిన్నది", medium: "మధ్యస్థం", long: "పొడవైనది", promptPlaceholder: "प्रत्येक महान कथा एका कल्पनेपासून सुरू होते. तुमची कल्पना काय आहे?",
    keyboardTip: "कीबोर्ड सूचना:", press: "నొక్కండి", toGenerate: "तयार करण्यासाठी", alsoWorks: "కూడా పనిచేస్తుంది", forNewLine: "नवीन ओळीसाठी",
    generating: "రూపొందిస్తోంది...", generate: "రూపొందించు", examples: "काही उदाहरण प्रॉम्प्ट:",
    selectPrompt: "प्रॉम्प्ट निवडा", characterLimit: "अक्षर मर्यादा पूर्ण - निर्मिती बंद आहे", charactersRemaining: "अक्षरे बाकी",
    shortcuts: "कीबोर्ड शॉर्टकट", openHelp: "సహాయం తెరవండి", closeHelp: "సహాయం మూసివేయండి", focusPrompt: "प्रॉम्प्टवर लक्ष",
    generateStory: "కథ రూపొందించు", publishStory: "कथा प्रकाशित करा", close: "మూసివేయి", freeLimitReached: "मोफत मर्यादा पूर्ण",
    freeLimitMessage: "तुम्ही सर्व 3 मोफत कथा निर्मिती वापरल्या आहेत. पुढे सुरू ठेवण्यासाठी लॉग इन करा.",
    continueBrowsing: "ब्राउझिंग सुरू ठेवा", recentPrompts: "अलीकडील प्रॉम्प्ट", usePrompt: "ఉపయోగించు", delete: "తొలగించు", clearAll: "सर्व मुडून टाका", noRecentPrompts: "अलीकडील प्रॉम्प्ट नाहीत",
  },
  Marathi: {
    back: "मागे", freeAccess: "3 विनंतà¥à¤¯à¤¾à¤'साठी मोफत पà¥à¤°à¤µà¥‡à¤¶", login: "लॉग इन", forMore: "करून अधिक मिळवा!",
    perMonth: "दर महिना", upgrade: "अपगà¥à¤°à¥‡à¤¡", monthlyRequests: "या महिनà¥à¤¯à¤¾à¤¤à¥€à¤² विनंतà¥à¤¯à¤¾", totalPosts: "à¤à¤•ूण पोसà¥à¤Ÿ",
    titleStart: "तुमच्या कल्पना बदला", titleAccent: "अद्भुत कथांमध्ये!", length: "लांबी", language: "भाषा",
    short: "लहान", medium: "मध्यम", long: "लांब", promptPlaceholder: "प्रत्येक महान कथा एका कल्पनेपासून सुरू होते. तुमची कल्पना काय आहे?",
    keyboardTip: "कीबोर्ड सूचना:", press: "दाबा", toGenerate: "तयार करण्यासाठी", alsoWorks: "हेही चालते", forNewLine: "नवीन ओळीसाठी",
    generating: "तयार होत आहे...", generate: "तयार करा", examples: "काही उदाहरण प्रॉम्प्ट:",
    selectPrompt: "प्रॉम्प्ट निवडा", characterLimit: "अक्षर मर्यादा पूर्ण - निर्मिती बंद आहे", charactersRemaining: "अक्षरे बाकी",
    shortcuts: "कीबोर्ड शॉर्टकट", openHelp: "मदत उघडा", closeHelp: "मदत बंद करा", focusPrompt: "प्रॉम्प्टवर लक्ष",
    generateStory: "कथा तयार करा", publishStory: "कथा प्रकाशित करा", close: "बंद करा", freeLimitReached: "मोफत मर्यादा पूर्ण",
    freeLimitMessage: "तुम्ही सर्व 3 मोफत कथा निर्मिती वापरल्या आहेत. पुढे सुरू ठेवण्यासाठी लॉग इन करा.",
    continueBrowsing: "ब्राउझिंग सुरू ठेवा", recentPrompts: "अलीकडील प्रॉम्प्ट", usePrompt: "वापरा", delete: "हटवा", clearAll: "सर्व मुडून टाका", noRecentPrompts: "अलीकडील प्रॉम्प्ट नाहीत",
  },
};

const LANGUAGE_STORAGE_KEY = "storySparkLanguage";

const TONES = [
  {
    label: "Dark",
    emoji: "ðŸŒ'",
    activeClass: "bg-gray-700 text-gray-100 border-gray-500 shadow-gray-700/40",
    inactiveClass: "bg-white/5 text-gray-400 border-transparent hover:bg-white/10 hover:text-gray-200",
  },
  {
    label: "Whimsical",
    emoji: "🌈",
    activeClass: "bg-sky-500/20 text-sky-300 border-sky-500/60 shadow-sky-500/20",
    inactiveClass: "bg-white/5 text-gray-400 border-transparent hover:bg-white/10 hover:text-gray-200",
  },
  {
    label: "Dramatic",
    emoji: "🎬",
    activeClass: "bg-red-500/20 text-red-300 border-red-500/60 shadow-red-500/20",
    inactiveClass: "bg-white/5 text-gray-400 border-transparent hover:bg-white/10 hover:text-gray-200",
  },
  {
    label: "Humorous",
    emoji: "😄",
    activeClass: "bg-yellow-500/20 text-yellow-300 border-yellow-500/60 shadow-yellow-500/20",
    inactiveClass: "bg-white/5 text-gray-400 border-transparent hover:bg-white/10 hover:text-gray-200",
  },
  {
    label: "Suspenseful",
    emoji: "😰",
    activeClass: "bg-orange-500/20 text-orange-300 border-orange-500/60 shadow-orange-500/20",
    inactiveClass: "bg-white/5 text-gray-400 border-transparent hover:bg-white/10 hover:text-gray-200",
  },
  {
    label: "Heartwarming",
    emoji: "🥰",
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
      <span className="w-full text-xs text-gray-400 mb-1">🎭 Tone:</span>
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
// Character types
// ---------------------------------------------------------------------------
interface ICharacter {
  id: string;
  name: string;
  role: string;
  personality: string;
}

const DRAFT_KEY = "story_spark_draft";

// ---------------------------------------------------------------------------
// Main StoriesComponent
// ---------------------------------------------------------------------------
const StoriesComponent = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const storiesPerPage = 10;
  const location = useLocation();
  const navigate = useNavigate();
  const { register, handleSubmit, reset, setValue } = useForm<Inputs>();

  // ---------------------------------------------------------------------------
  // Draft restore state (stubbed — UI wired, logic pending full implementation)
  // ---------------------------------------------------------------------------
  const [draftStatus, setDraftStatus] = useState<string>("");
  const [showRestorePrompt, setShowRestorePrompt] = useState<boolean>(false);

  const draft = useMemo(() => {
    try {
      const saved = localStorage.getItem(DRAFT_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  }, []);

  // Show restore prompt once on mount if a draft exists
  useEffect(() => {
    if (draft && (draft.prompt || draft.genre)) {
      setShowRestorePrompt(true);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleRestoreDraft = useCallback(() => {
    if (!draft) return;
    if (draft.prompt) {
      setTextareaValue(draft.prompt);
      setValue("prompt", draft.prompt);
    }
    if (draft.genre) {
      const matched = GENRES.find((g) => g.name === draft.genre || g.value === draft.genre);
      if (matched) setSelectedGenre(matched.value);
    }
    if (draft.length) setSelectedLength(draft.length);
    if (draft.language) setSelectedLanguage(draft.language);
    if (draft.tone) setSelectedTone(draft.tone as ToneLabel | "");
    setShowRestorePrompt(false);
    setDraftStatus("Draft restored.");
  }, [draft, setValue]);

  const handleDiscardDraft = useCallback(() => {
    localStorage.removeItem(DRAFT_KEY);
    setShowRestorePrompt(false);
    setDraftStatus("");
  }, []);

  // ---------------------------------------------------------------------------
  // Stories state
  // ---------------------------------------------------------------------------
  const [stories, setStories] = useState<IStories[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchFilter, setSearchFilter] = useState<string>("all");

  const debouncedSearchQuery = useDebounce(searchQuery, 350);

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

  const currentStories = useMemo(
    () => filteredStories.slice(indexOfFirstStory, indexOfLastStory),
    [filteredStories, indexOfFirstStory, indexOfLastStory]
  );

  const totalPages = useMemo(
    () => Math.ceil(filteredStories.length / storiesPerPage),
    [filteredStories.length, storiesPerPage]
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchQuery, searchFilter]);

  // ---------------------------------------------------------------------------
  // Auth / API
  // ---------------------------------------------------------------------------
  const { data } = useGetProfileInfoQuery(undefined);
  const userRole = getUserInfo();
  const login = isLoggedIn();
  const [generateModel] = useGenerateModelMutation();
  const [generateFreeModel] = useGenerateFreeModelMutation();

  // ---------------------------------------------------------------------------
  // Form / UI state
  // ---------------------------------------------------------------------------
  const [selectedPrompt, setSelectedPrompt] = useState<string>("");
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState<string>("🧙 Fantasy");
  const [selectedLength, setSelectedLength] = useState<string>("medium");
  const [selectedTone, setSelectedTone] = useState<ToneLabel | "">("Dramatic");
  const [textareaValue, setTextareaValue] = useState<string>(
    location.state?.prompt ?? ""
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("English");
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [characters, setCharacters] = useState<ICharacter[]>([]);
  const [isHighLatency, setIsHighLatency] = useState<boolean>(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const languageDropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
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

  const debouncedPrompt = useDebounce(textareaValue, 500);

  // ---------------------------------------------------------------------------
  // Effects
  // ---------------------------------------------------------------------------
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Autosave draft
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
        setDraftStatus("Draft saved.");
      } catch (err) {
        if (err instanceof DOMException && err.name === "QuotaExceededError") {
          toast.error("Couldn't autosave draft — storage limit reached.");
        }
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [textareaValue, selectedGenre, selectedLength, selectedLanguage, selectedTone]);

  // Sync lang to html[lang]
  useEffect(() => {
    const selectedLocale =
      LANGUAGES.find((l) => l.name === selectedLanguage)?.code ?? "en";
    localStorage.setItem(LANGUAGE_STORAGE_KEY, selectedLanguage);
    document.documentElement.lang = selectedLocale;
  }, [selectedLanguage]);

  // Close dropdowns on outside click or Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (languageDropdownRef.current && !languageDropdownRef.current.contains(event.target as Node)) {
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

  // Apply location state prompt/genre then clear state
  useEffect(() => {
    if (location.state) {
      if (location.state.prompt) setTextareaValue(location.state.prompt);
      if (location.state.genre) {
        const matched = GENRES.find((g) => g.name === location.state.genre)?.value ?? "";
        setSelectedGenre(matched);
      }
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  // Sync debounced prompt to RHF
  useEffect(() => {
    setValue("prompt", debouncedPrompt);
  }, [debouncedPrompt, setValue]);

  // Abort generation on unmount
  useEffect(() => {
    return () => {
      activeGenerationRef.current?.abort();
    };
  }, []);

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------
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
    audio.play().catch((err) => console.log("Audio playback failed:", err));
    audioRef.current = audio;
  }, []);

  const handleCancelGeneration = useCallback((isTimeout = false) => {
    activeGenerationRef.current?.abort();
    activeGenerationRef.current = null;
    isGenerationInProgressRef.current = false;
    setLoading(false);
    if (!isTimeout) toast("Story generation cancelled.");
  }, []);

  const handleClearPrompt = useCallback(() => {
    setTextareaValue("");
    setSelectedPrompt("");
    setValue("prompt", "");
    inputRef.current?.focus();
  }, [setValue]);

  const handlePublishSuccess = useCallback(() => {
    setTextareaValue("");
    setSelectedPrompt("");
    setValue("prompt", "");
    setCharacters([]);
    setCurrentStep(1);
    reset();
  }, [setValue, reset]);

  const isOverLimit = textareaValue.length >= MAX_PROMPT_LENGTH;
  const isNearLimit = textareaValue.length >= MAX_PROMPT_LENGTH * WARN_THRESHOLD;
  const isGenerateDisabled = loading || isOverLimit || !textareaValue.trim();

  const handleNextStep = useCallback(() => {
    if (!textareaValue.trim()) {
      toast.error("Please enter a prompt to generate a story.");
      return;
    }
    if (getWordCount(textareaValue) < 10) {
      toast.error("Please enter a prompt with at least 10 words to generate a story.");
      return;
    }
    setCurrentStep(2);
  }, [textareaValue]);

  const onSubmit: SubmitHandler<Inputs> = useCallback(
    async (data) => {
      if (isGenerationInProgressRef.current) return;
      if (!login && guestRequestCount >= 3) {
        setShowLimitModal(true);
        return;
      }
      if (!data.prompt.trim()) {
        toast.error("Please enter a prompt to generate a story.");
        return;
      }
      if (getWordCount(data.prompt) < 10) {
        toast.error("Please enter a prompt with at least 10 words to generate a story.");
        return;
      }
      for (const char of characters) {
        if (!char.name.trim()) { toast.error("Please provide a name for all characters."); return; }
        if (!char.role.trim()) { toast.error("Please select a role for all characters."); return; }
        if (!char.personality.trim()) { toast.error("Please describe the personality/traits for all characters."); return; }
      }

      isGenerationInProgressRef.current = true;
      setLoading(true);
      setIsHighLatency(false);

      let timeoutId: NodeJS.Timeout | null = null;
      let latencyTimeoutId: NodeJS.Timeout | null = null;

      try {
        timeoutId = setTimeout(() => {
          if (isGenerationInProgressRef.current) {
            toast.error("Story generation timed out. Please try again.");
            handleCancelGeneration(true);
          }
        }, 60000);

        latencyTimeoutId = setTimeout(() => {
          if (isGenerationInProgressRef.current) setIsHighLatency(true);
        }, 10000);

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
          localStorage.removeItem(DRAFT_KEY);
          setDraftStatus("");
          reset();
          setCharacters([]);
          setCurrentStep(1);
          if (selectedGenre) playSoundtrack(selectedGenre);
          if (!login) {
            const newCount = guestRequestCount + 1;
            setGuestRequestCount(newCount);
            localStorage.setItem("guestRequestCount", String(newCount));
          }
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      } catch (error: unknown) {
        const message = getErrorMessage(error);
        if (message !== "Story generation was cancelled.") toast.error(message);
      } finally {
        if (timeoutId) clearTimeout(timeoutId);
        if (latencyTimeoutId) clearTimeout(latencyTimeoutId);
        activeGenerationRef.current = null;
        isGenerationInProgressRef.current = false;
        setLoading(false);
        setIsHighLatency(false);
      }
    },
    [
      login, guestRequestCount, selectedGenre, selectedLength, selectedLanguage,
      selectedTone, characters, generateModel, generateFreeModel, addPrompt,
      setValue, reset, playSoundtrack, handleCancelGeneration,
    ]
  );

  const handleOpenHelp = useCallback(() => setShowHelpModal(true), []);
  const handleCloseHelp = useCallback(() => setShowHelpModal(false), []);

  const handleGenerateShortcut = useCallback(() => {
    if (isGenerateDisabled) return;
    if (currentStep === 1) {
      handleNextStep();
    } else {
      const form = inputRef.current?.closest("form");
      if (form) form.requestSubmit();
    }
  }, [isGenerateDisabled, currentStep, handleNextStep]);

  const handlePublishShortcut = useCallback(() => {
    document.getElementById("publish-story-btn")?.click();
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
    hasStory: stories.length > 0,
  });

  const generateId = () => Math.random().toString(36).substring(2, 9);

  const handleAddCharacter = useCallback(() => {
    setCharacters((prev) => [
      ...prev,
      { id: generateId(), name: "", role: "Protagonist", personality: "" },
    ]);
  }, []);

  const handleCharacterChange = useCallback(
    (id: string, field: keyof Omit<ICharacter, "id">, value: string) => {
      setCharacters((prev) =>
        prev.map((char) => (char.id === id ? { ...char, [field]: value } : char))
      );
    },
    []
  );

  const handleRemoveCharacter = useCallback((id: string) => {
    setCharacters((prev) => prev.filter((char) => char.id !== id));
  }, []);

  const handleSelectRecentPrompt = useCallback(
    (prompt: string) => {
      setTextareaValue(prompt);
      setValue("prompt", prompt);
      setIsRecentPromptsOpen(false);
    },
    [setValue]
  );

  const handleToggleRecentPrompts = useCallback(() => {
    setIsRecentPromptsOpen((prev) => !prev);
  }, []);

  const handleToggleDropdown = useCallback(() => {
    setIsDropdownOpen((prev) => !prev);
  }, []);

  const recentPromptsText = useMemo(
    () => ({
      recentPrompts: text.recentPrompts,
      usePrompt: text.usePrompt,
      delete: text.delete,
      clearAll: text.clearAll,
      noRecentPrompts: text.noRecentPrompts,
      close: text.close,
    }),
    [text]
  );

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-white text-slate-900 animate-gradient-slow transition-colors duration-300 dark:bg-[#0b1329] dark:text-white">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">

        {/* Top nav bar */}
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
                    <span className="text-indigo-400 underline font-semibold">{text.login}</span>
                  </Link>{" "}
                  {text.forMore}
                </span>
              </div>
            </div>
          )}

          <div className="flex flex-col items-center md:items-end pt-2 w-full md:w-auto">
            <button className="!rounded-button bg-gray-100/80 hover:bg-gray-200/80 text-slate-900 dark:bg-white/20 dark:hover:bg-white/30 dark:text-gray-300 px-3 py-2 flex items-center gap-2 transition-all duration-300 rounded whitespace-nowrap border border-gray-200 dark:border-white/10">
              <span>
                <span className="text-gray-400 text-xs">{text.perMonth}</span>{" "}
                {getRequestLimit(userRole?.subscriptionType as string)}
              </span>
              <Link to="/pricing" className="border-1 border-white/20 pl-2 text-gray-300">
                {text.upgrade}
              </Link>
              <i className="fas fa-bolt text-yellow-400"></i>
            </button>
            <div className="mt-2.5 text-[11px] font-semibold tracking-wide text-slate-400 dark:text-slate-500 text-center sm:text-right uppercase space-y-0.5">
              <div>{text.monthlyRequests}: {login ? (data?.requestsThisMonth ?? 0) : guestRequestCount}</div>
              <div>{text.totalPosts}: {login ? (data?.postsCount ?? 0) : 0}</div>
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="mb-12 max-w-3xl mx-auto text-center select-none">
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            ✨ {text.titleStart}{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
              {text.titleAccent}
            </span>
          </h1>
        </div>

        {/* Main form card */}
        <div className="max-w-3xl mx-auto w-full box-border space-y-6">
          <div className="bg-white dark:bg-[#111827]/40 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-sm hover:shadow-xl transition-shadow duration-300 w-full box-border">
            <form className="space-y-6 w-full box-border" onSubmit={handleSubmit(onSubmit)}>
              {currentStep === 1 ? (
                <>
                  {/* Genre chips */}
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

                  {/* Tone picker */}
                  <div className="pt-2 border-t border-slate-100 dark:border-white/5 select-none">
                    <TonePicker selected={selectedTone} onChange={setSelectedTone} />
                  </div>

                  {/* Length + Language */}
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

                    <div className="flex items-center gap-2" ref={languageDropdownRef}>
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mr-1">🌐 {text.language}:</span>
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                          className="flex items-center gap-2 px-3.5 py-1.5 bg-slate-50 text-slate-600 border border-slate-200 dark:bg-white/5 dark:border-white/5 dark:text-slate-300 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-slate-100 dark:hover:bg-white/10 transition-all duration-150 cursor-pointer select-none"
                        >
                          <span>{LANGUAGES.find((l) => l.name === selectedLanguage)?.name || "English"}</span>
                          <span className="text-slate-400 dark:text-slate-500 text-[9px]">â–¼</span>
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

                  {/* Draft restore prompt */}
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

                  {/* Prompt textarea */}
                  <div className="relative border border-slate-200/80 dark:border-white/10 bg-slate-50/50 dark:bg-slate-950/30 rounded-2xl p-4 transition-all focus-within:border-blue-500/30 focus-within:bg-white dark:focus-within:bg-[#111827]/20 w-full box-border">
                    <textarea
                      {...register("prompt")}
                      ref={(el) => {
                        register("prompt").ref(el);
                        inputRef.current = el;
                      }}
                      className={`w-full h-32 sm:h-40 resize-none border-none outline-none bg-transparent text-slate-800 dark:text-slate-200 focus:ring-0 text-sm sm:text-base leading-relaxed placeholder:italic placeholder:text-slate-400 dark:placeholder:text-slate-500 pr-12 transition-colors duration-200 ${
                        isOverLimit
                          ? "ring-1 ring-red-500 rounded-lg p-2"
                          : isNearLimit
                          ? "ring-1 ring-yellow-400 rounded-lg p-2"
                          : ""
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
                        onClick={handleToggleRecentPrompts}
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
                            <span>âš </span> {text.characterLimit}
                          </p>
                        ) : isNearLimit ? (
                          <p className="text-[11px] font-semibold text-amber-500 dark:text-amber-400 flex items-center gap-1 truncate m-0">
                            <span>âš </span> {MAX_PROMPT_LENGTH - textareaValue.length} {text.charactersRemaining}
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

                  {draftStatus && (
                    <p className="text-xs text-green-500 px-1">💾 {draftStatus}</p>
                  )}

                  {/* Keyboard tip */}
                  <div className="text-[11px] font-medium leading-relaxed text-slate-400 dark:text-slate-500 select-none w-full box-border">
                    💡 <span className="font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mr-1">{text.keyboardTip}</span>
                    {text.press}{" "}
                    <kbd className="px-1.5 py-0.5 text-[10px] font-bold bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/10 rounded-md text-slate-700 dark:text-slate-300 mx-0.5 shadow-sm">Enter</kbd>
                    {" "}to continue &bull;{" "}
                    <kbd className="px-1.5 py-0.5 text-[10px] font-bold bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/10 rounded-md text-slate-700 dark:text-slate-300 mx-0.5 shadow-sm">Ctrl + Enter</kbd>
                    {" "}{text.alsoWorks} &bull;{" "}
                    <kbd className="px-1.5 py-0.5 text-[10px] font-bold bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/10 rounded-md text-slate-700 dark:text-slate-300 mx-0.5 shadow-sm">Shift + Enter</kbd>
                    {" "}{text.forNewLine}
                  </div>

                  {/* Next step button */}
                  <div className="flex justify-end pt-2 w-full box-border">
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-bold py-3 px-6 rounded-xl shadow-md shadow-blue-500/10 transition-all duration-150 active:scale-[0.98] select-none uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Next: Cast of Characters ➡️</span>
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {/* Step 2: Cast of Characters */}
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

                  <div className="space-y-2 select-none">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Cast of Characters</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      Define custom characters to ensure Gemini maintains character roles, personality traits, and dynamic relationships consistently throughout the story.
                    </p>
                  </div>

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

                  {/* Generate button */}
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
                </>
              )}
            </form>
          </div>

          {/* Example prompts dropdown */}
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
                <span className="truncate pr-4">{selectedPrompt || text.selectPrompt}</span>
                <span className={`text-slate-400 dark:text-slate-500 text-[9px] transition-transform duration-150 shrink-0 ${isDropdownOpen ? "rotate-180" : ""}`}>
                  â–¼
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

        {/* Help modal */}
        {showHelpModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
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
                className="mt-6 w-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase tracking-wider py-2.5 rounded-xl transition-colors shadow-sm select-none cursor-pointer"
              >
                {text.close}
              </button>
            </div>
          </div>
        )}

        {/* Generation animation */}
        {loading && (
          <StoryGeneratingAnimation onCancel={handleCancelGeneration} isHighLatency={isHighLatency} />
        )}

        {/* Search UI */}
        {stories.length > 0 && (
          <div className="mb-6 mt-6 bg-slate-800/80 backdrop-blur-xl border border-slate-700/50 p-4 rounded-2xl">
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
                Found {filteredStories.length} {filteredStories.length === 1 ? "story" : "stories"}
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-6">
            <button
              onClick={() => setCurrentPage((p) => p - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded bg-slate-700 text-white disabled:opacity-50 cursor-pointer"
            >
              Previous
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button
              onClick={() => setCurrentPage((p) => p + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded bg-slate-700 text-white disabled:opacity-50 cursor-pointer"
            >
              Next
            </button>
          </div>
        )}

        {/* Limit modal */}
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

        <Toaster position="top-right" reverseOrder={false} />
      </div>
    </div>
  );
};

export default StoriesComponent;