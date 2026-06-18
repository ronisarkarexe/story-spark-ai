import React, { useEffect, useState, useRef, useMemo } from "react";
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

const soundtrackMap: Record<string, string> = {
  "🧙 Fantasy": "/audio/fantasy.mp3",
  "😱 Horror": "/audio/horror.mp3",
  "💕 Romance": "/audio/romance.mp3",
  "🎭 Drama": "/audio/drama.mp3", 
  "😂 Comedy": "/audio/comedy.mp3", 
  "🚀 Sci-Fi": "/audio/sci-fi.mp3", 
  "🔍 Mystery": "/audio/mystery.mp3", 
  "🌟 Adventure": "/audio/adventure.mp3"
};

type Inputs = {
  prompt: string;
};

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
    Drama: "नाटक", Comedy: "हास्य", Horror: "डरावनी", Romance: "प्रेम",
    "Sci-Fi": "विज्ञान कथा", Fantasy: "कल्पना", Mystery: "रहस्य", Adventure: "रोमांच",
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
    Drama: "নাটক", Comedy: "কৌতुक", Horror: "ভৌতিক", Romance: "প্রেম",
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
    "Sci-Fi": "विज्ञानकथा", Fantasy: "कल्पनादम्य", Mystery: "रहस्य", Adventure: "साहस",
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
    back: "वापस", freeAccess: "3 अनुरोधों के लिए मुफ्त उपयोग", login: "लॉग इन", forMore: "और पाने के लिए!",
    perMonth: "प्रति माह", upgrade: "अपग्रेड", monthlyRequests: "इस माह के अनुरोध", totalPosts: "कुल पोस्ट",
    titleStart: "अपने विचारों को बदलें", titleAccent: "अद्भुत कहानियों में!", length: "लंबाई", language: "भाषा",
    short: "छोटी", medium: "मध्यम", long: "लंबी", promptPlaceholder: "हर महान कहानी एक विचार से शुरू होती है। आपका विचार क्या है?",
    keyboardTip: "कीबोर्ड सुझाव:", press: "दबाएं", toGenerate: "बनाने के लिए", alsoWorks: "भी काम करता है", forNewLine: "नई पंक्ति के लिए",
    generating: "बन रही है...", generate: "बनाएं", examples: "इन उदाहरण संकेतों का उपयोग करें:",
    selectPrompt: "एक संकेत संकेत चुनें", characterLimit: "अक्षर सीमा पूरी - निर्माण अक्षम है", charactersRemaining: "अक्षर शेष",
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
    back: "戻る", freeAccess: "3回まで無料で利用できます", login: "ログイン", forMore: "してさらに利用！",
    perMonth: "月ごと", upgrade: "アップグレード", monthlyRequests: "今月のリクエスト", totalPosts: "投稿数",
    titleStart: "アイデアを", titleAccent: "すばらしい物語に！", length: "長さ", language: "言語",
    short: "短い", medium: "中程度", long: "長い", promptPlaceholder: "すべての物語は一つのアイデアから始まります。あなたのアイデアは？",
    keyboardTip: "キーボードのヒント:", press: "押す", toGenerate: "で生成", alsoWorks: "も使用可能", forNewLine: "で改行",
    generating: "生成中...", generate: "生成", examples: "参考にできるプロンプト例:",
    selectPrompt: "プロンプトを選択", characterLimit: "文字数の上限に達しました - 生成できません", charactersRemaining: "文字残り",
    shortcuts: "キーボードショートカット", openHelp: "ヘルプを開く", closeHelp: "ヘルプを閉じる", focusPrompt: "プロンプトに移動",
    generateStory: "物語を生成", publishStory: "物語を公開", close: "閉じる", freeLimitReached: "無料上限に達しました",
    freeLimitMessage: "無料の物語生成を3回すべて使用しました。続けるにはログインしてください。", continueBrowsing: "閲覧を続ける", recentPrompts: "最近のプロンプト", usePrompt: "使用", delete: "削除", clearAll: "すべてクリア", noRecentPrompts: "最近のプロンプトはありません",
  },
  Korean: {
    back: "뒤로", freeAccess: "요청 3회 무료 이용", login: "로그인", forMore: "하고 더 이용하세요!",
    perMonth: "월별", upgrade: "업그레이드", monthlyRequests: "이번 달 요청", totalPosts: "전체 게시물",
    titleStart: "아이디어를", titleAccent: "멋진 이야기로!", length: "길이", language: "언어",
    short: "짧게", medium: "중간", long: "길게", promptPlaceholder: "모든 훌륭한 이야기는 하나의 아이디어에서 시작됩니다. 당신의 아이디어는?",
    keyboardTip: "키보드 팁:", press: "누르기", toGenerate: "생성", alsoWorks: "도 가능", forNewLine: "새 줄",
    generating: "생성 중...", generate: "생성", examples: "참고할 수 있는 프롬프트 예시:",
    selectPrompt: "프롬프트 선택", characterLimit: "글자 수 제한 도달 - 생성할 수 없습니다", charactersRemaining: "글자 남음",
    shortcuts: "키보드 단축키", openHelp: "도움말 열기", closeHelp: "도움말 닫기", focusPrompt: "프롬프트에 초점",
    generateStory: "이야기 생성", publishStory: "이야기 게시", close: "닫기", freeLimitReached: "무료 한도 도달",
    freeLimitMessage: "무료 이야기 생성을 3회 모두 사용했습니다. 계속하려면 로그인하세요.", continueBrowsing: "계속 둘러보기", recentPrompts: "최근 프롬프트", usePrompt: "사용", delete: "삭제", clearAll: "모두 지우기", noRecentPrompts: "최근 프롬프트가 없습니다",
  },
  Bengali: {
    back: "ফিরে যান", freeAccess: "৩টি অনুরোধের জন্য বিনামূল্যে ব্যবহার", login: "লগ ইন", forMore: "করে আরও পান!",
    perMonth: "প্রতি মাসে", upgrade: "আপগ্রেড", monthlyRequests: "এই মাসের অনুরোধ", totalPosts: "মোট পোস্ট",
    titleStart: "আপনার ভাবনাকে বদলে দিন", titleAccent: "অসাধারণ গল্পে!", length: "দৈর্ঘ্য", language: "ভাষা",
    short: "ছোট", medium: "মাঝারি", long: "লম্বা", promptPlaceholder: "প্রতিটি মহান গল্প একটি ভাবনা দিয়ে শুরু হয়। আপনারটি কী?",
    keyboardTip: "কীবোর্ড টিপ:", press: "চাপুন", toGenerate: "তৈরি করতে", alsoWorks: "এটিও কাজ করে", forNewLine: "নতুন লাইনের জন্য",
    generating: "তৈরি হচ্ছে...", generate: "তৈরি করুন", examples: "কিছু উদাহরণ প্রম্পট:",
    selectPrompt: "একটি প্রম্পট বেছে নিন", characterLimit: "অক্ষরের সীমা পূর্ণ - তৈরি বন্ধ", charactersRemaining: "অক্ষর বাকি",
    shortcuts: "কীবোর্ড শর্টকাট", openHelp: "সহায়তা খুলুন", closeHelp: "সহায়তা বন্ধ করুন", focusPrompt: "প্রম্পটে যান",
    generateStory: "গল্প তৈরি করুন", publishStory: "গল্প প্রকাশ করুন", close: "বন্ধ করুন", freeLimitReached: "বিনামূল্যের সীমা পূর্ণ",
    freeLimitMessage: "আপনি ৩টি বিনামূল্যের গল্প তৈরি ব্যবহার করেছেন। চালিয়ে যেতে লগ ইন করুন।", continueBrowsing: "ব্রাউজ চালিয়ে যান", recentPrompts: "সম্প্রতি ব্যবহৃত প্রম্পট", usePrompt: "ব্যবহার করুন", delete: "মুছে ফেলুন", clearAll: "সব মুছে দিন", noRecentPrompts: "কোনো সম্প্রতি ব্যবহৃত প্রম্পট নেই",
  },
  Tamil: {
    back: "திரும்புக", freeAccess: "3 கோரிக்கைகளுக்கு இலவச அணுகல்", login: "உள்நுழை", forMore: "செய்து மேலும் பெறுங்கள்!",
    perMonth: "மாதத்திற்கு", upgrade: "மேம்படுத்து", monthlyRequests: "இந்த மாத கோரிக்கைகள்", totalPosts: "மொத்த பதிவுகள்",
    titleStart: "உங்கள் எண்ணங்களை", titleAccent: "அற்புத கதைகளாக மாற்றுங்கள்!", length: "நீளம்", language: "மொழி",
    short: "சிறியது", medium: "நடுத்தரம்", long: "நீளமானது", promptPlaceholder: "ஒவ்வொரு சிறந்த கதையும் ஒரு எண்ணத்தில் தொடங்குகிறது. உங்களுடையது என்ன?",
    keyboardTip: "விசைப்பலகை குறிப்பு:", press: "அழுத்தவும்", toGenerate: "உருவாக்க", alsoWorks: "இதுவும் செயல்படும்", forNewLine: "புதிய வரிக்கு",
    generating: "உருவாக்குகிறது...", generate: "உருவாக்கு", examples: "சில எடுத்துக்காட்டு குறிப்புகள்:",
    selectPrompt: "ஒரு குறிப்பை தேர்வு செய்க", characterLimit: "எழுத்து வரம்பு அடைந்தது - உருவாக்கம் முடக்கப்பட்டது", charactersRemaining: "எழுத்துக்கள் மீதம்",
    shortcuts: "விசைப்பலகை குறுக்குவழிகள்", openHelp: "உதவி திற", closeHelp: "உதவி மூடு", focusPrompt: "குறிப்பில் கவனம்",
    generateStory: "கதை உருவாக்கு", publishStory: "கதை வெளியிடு", close: "மூடு", freeLimitReached: "இலவச வரம்பு அடைந்தது",
    freeLimitMessage: "3 இலவச கதை உருவாக்கங்களையும் பயன்படுத்திவிட்டீர்கள். தொடர உள்நுழையவும்.", continueBrowsing: "தொடர்ந்து பார்வையிடவும்", recentPrompts: "சமீபத்திய குறிப்புகள்", usePrompt: "பயன்படுத்து", delete: "நீக்கு", clearAll: "அனைத்தையும் நீக்கு", noRecentPrompts: "சமீபத்திய குறிப்புகள் இல்லை",
  },
  Telugu: {
    back: "వెనుకకు", freeAccess: "3 అభ్యర్థనలకు ఉచిత ప్రవేశం", login: "లాగిన్", forMore: "చేసి మరిన్ని పొందండి!",
    perMonth: "నెలకు", upgrade: "అప్గ్రేడ్", monthlyRequests: "ఈ నెల అభ్యర్థనలు", totalPosts: "మొత్తం పోస్టులు",
    titleStart: "మీ ఆలోచనలను", titleAccent: "అద్భుత కథలుగా మార్చండి!", length: "పొడవు", language: "భాష",
    short: "చిన్నది", medium: "మధ్యస్థం", long: "పొడవైనది", promptPlaceholder: "ప్రతి గొప్ప కథ ఒక ఆలోచనతో మొదలవుతుంది. మీది ఏమిటి?",
    keyboardTip: "కీబోర్డ్ చిట్కా:", press: "నొక్కండి", toGenerate: "రూపొందించడానికి", alsoWorks: "కూడా పనిచేస్తుంది", forNewLine: "కొత్త లైన్ కోసం",
    generating: "రూపొందిస్తోంది...", generate: "రూపొందించు", examples: "కొన్ని ఉదాహరణ ప్రాంప్ట్‌లు:",
    selectPrompt: "ప్రాంప్ట్ ఎంచుకోండి", characterLimit: "అక్షర పరిమితి చేరింది - రూపొందింపు నిలిపివేయబడింది", charactersRemaining: "అక్షరాలు మిగిలాయి",
    shortcuts: "కీబోర్ड షార్ట్‌కట్‌లు", openHelp: "సహాయం తెరవండి", closeHelp: "సహాయం మూసివేయండి", focusPrompt: "ప్రాంప్ట్‌పై దృష్టి",
    generateStory: "కథ రూపొందించు", publishStory: "కథ ప్రచురించు", close: "మూసివేయి", freeLimitReached: "ఉచిత పరిమితి చేరింది",
    freeLimitMessage: "మీరు 3 ఉచిత కథా రూపొందింపులను ఉపయోగించారు. కొనసాగడానికి లాగిన్ చేయండి.", continueBrowsing: "బ్రౌజింగ్ కొనసాగించు", recentPrompts: "ఇటీవల ప్రాంప్ట్‌లు", usePrompt: "ఉపయోగించు", delete: "తొలగించు", clearAll: "అన్నింటిని తొలగించు", noRecentPrompts: "ఇటీవల ప్రాंప్ట్‌లు లేవు",
  },
  Marathi: {
    back: "मागे", freeAccess: "3 विनंत्यांसाठी मोफत प्रवेश", login: "लॉग इन", forMore: "करून अधिक मिळवा!",
    perMonth: "दर महिना", upgrade: "अपग्रेड", monthlyRequests: "या महिन्यातील विनंत्या", totalPosts: "एकूण पोस्ट",
    titleStart: "तुमच्या कल्पना बदला", titleAccent: "अद्भुत कथांमध्ये!", length: "लांबी", language: "भाषा",
    short: "लहान", medium: "मध्यम", long: "लांब", promptPlaceholder: "प्रत्येक महान कथा एका कल्पनेपासून सुरू होते. तुमची कल्पना काय आहे?",
    keyboardTip: "कीबोर्ड सूचना:", press: "दाबा", toGenerate: "तयार करण्यासाठी", alsoWorks: "हेही चालते", forNewLine: "नवीन ओळीसाठी",
    generating: "तयार होत आहे...", generate: "तयार करा", examples: "काही उदाहरण प्रॉम्प्ट:",
    selectPrompt: "प्रॉम्प्ट निवडा", characterLimit: "अक्षर मर्यादा पूर्ण - निर्मिती बंद आहे", charactersRemaining: "अक्षरे बाकी",
    shortcuts: "कीबोर्ड शॉर्टकट", openHelp: "मदत उघडा", closeHelp: "मदत बंद करा", focusPrompt: "प्रॉम्प्टवर लक्ष",
    generateStory: "कथा तयार करा", publishStory: "कथा प्रकाशित करा", close: "बंद करा", freeLimitReached: "मोफत मर्यादा पूर्ण",
    freeLimitMessage: "तुम्ही सर्व 3 मोफत कथा निर्मिती वापरल्या आहेत. पुढे सुरू ठेवण्यासाठी लॉग इन करा.", continueBrowsing: "ब्राउझिंग सुरू ठेवा", recentPrompts: "अलीकडील प्रॉम्प्ट", usePrompt: "वापरा", delete: "हटवा", clearAll: "सर्व मिळून टाका", noRecentPrompts: "अलीकडील प्रॉम्प्ट नाहीत",
  },
};

const LANGUAGE_STORAGE_KEY = "storySparkLanguage";

const TONES = [
  {
    label: "Dark",
    emoji: "🌑",
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
    emoji: "😨",
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
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchFilter, setSearchFilter] = useState<string>("all");

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
  const [draftStatus, setDraftStatus] = useState("");
  const DRAFT_KEY = "storyspark_story_draft_v1";

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
          toast.error("Couldn't autosave draft — storage limit reached.");
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
                  Γëí╞Æ├ä┬í {selectedStory.tag}
                </span>
                <span className="inline-flex items-center rounded-full bg-blue-900/60 text-blue-300 border border-blue-700/50 py-1 px-3 text-xs font-semibold">
                  Γëí╞Æ├«├ë {selectedStory.language || "English"}
                </span>
                {selectedStory.emotions && selectedStory.emotions.length > 0 && (
                  <span className="inline-flex items-center rounded-full bg-emerald-900/60 text-emerald-300 border border-emerald-700/50 py-1 px-3 text-xs font-semibold">
                    Γëí╞Æ├┐├¿ {selectedStory.emotions.join(", ")}
                  </span>
                )}
              </div>
            </div>
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
            ✨ {text.titleStart}{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
              {text.titleAccent}
            </span>{" "}
            ✨
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
                  {isCopied ? "Γ£ô Copied" : "≡ƒôï Copy"}
                </button>
                <button
                  type="button"
                  className="rounded-lg px-4 py-2 bg-purple-700 text-slate-200 font-semibold cursor-pointer hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleExportPDF}
                  disabled={!selectedStory}
                >
                  ≡ƒôä Export PDF
                </button>
                <button
                  type="button"
                  className="rounded-lg px-4 py-2 bg-indigo-700 text-slate-200 font-semibold cursor-pointer hover:bg-indigo-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleExportMarkdown}
                  disabled={!selectedStory}
                >
                  Γ¼ç∩╕Å Export as Markdown
                </button>
                <button
                  type="button"
                  className="rounded-lg px-4 py-2 bg-violet-700 text-slate-200 font-semibold cursor-pointer hover:bg-violet-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => setShowWorldMap(true)}
                  disabled={!selectedStory}
                >
                  Γëí╞Æ├╣ΓòæΓê⌐Γòò├à World Map
                </button>
                <button
                  type="button"
                  className="rounded-lg px-4 py-2 bg-fuchsia-700 text-slate-200 font-semibold cursor-pointer hover:bg-fuchsia-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => setShowRemix(true)}
                  disabled={!selectedStory}
                >
                  Γëí╞Æ├╢├ç Remix
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
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mr-1">🌐 {text.language}:</span>
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

                          // Reuse the same generation flow as clicking the Generate button
                          const form = e.currentTarget.closest("form");
                          form?.requestSubmit();
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
                            <span>⚠</span> {text.characterLimit}
                          </p>
                        ) : isNearLimit ? (
                          <p className="text-[11px] font-semibold text-amber-500 dark:text-amber-400 flex items-center gap-1 truncate m-0">
                            <span>⚠</span> {MAX_PROMPT_LENGTH - textareaValue.length} {text.charactersRemaining}
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
                    💡 <span className="font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mr-1">{text.keyboardTip}</span>
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
                      <span>Next: Cast of Characters ➡️</span>
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
                                  <span className="transition-transform duration-200 group-open:rotate-180">Γû╝</span>
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
            const form = e.currentTarget.closest("form");
            if (form) form.requestSubmit();
          }
        }}
        />


      <div className="flex items-center justify-between mt-1 px-1">
        {validationError ? (
          <p className="text-xs text-red-400 flex items-center gap-1">
            <span>⚠</span> {validationError}
          </p>
        ) : isOverLimit ? (
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
                onClick={handleToggleDropdown}
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
                      Γëí╞Æ├«├ë {(selectedStory.language || "English").toUpperCase()}
                    </div>
                    <div className="inline-flex items-center rounded-full bg-slate-700 py-1 px-2.5 text-xs font-medium text-slate-300 shadow-sm gap-1">
                      ╬ô├àΓûÆΓê⌐Γòò├à {calculateReadingTime(selectedStory.content)} min read
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
