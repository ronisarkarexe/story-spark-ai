import React, { useState, useEffect, useRef } from "react";
import StoriesViewComponent, { IStories } from "./stories.view.component";
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
import StoryGeneratingAnimation from "../loading/story-generating-animation.component";
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
  { code: "mr", name: "Marathi" }
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
    "Sci-Fi": "विज्ञानकथा", Fantasy: "कल्पनारम्य", Mystery: "रहस्य", Adventure: "साहस",
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
    continueBrowsing: "Continue Browsing",
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
    continueBrowsing: "Continuar navegando",
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
    continueBrowsing: "Continuer la navigation",
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
    continueBrowsing: "Continuar navegando",
  },
  Hindi: {
    back: "वापस", freeAccess: "3 अनुरोधों के लिए मुफ्त उपयोग", login: "लॉग इन", forMore: "और पाने के लिए!",
    perMonth: "प्रति माह", upgrade: "अपग्रेड", monthlyRequests: "इस माह के अनुरोध", totalPosts: "कुल पोस्ट",
    titleStart: "अपने विचारों को बदलें", titleAccent: "अद्भुत कहानियों में!", length: "लंबाई", language: "भाषा",
    short: "छोटी", medium: "मध्यम", long: "लंबी", promptPlaceholder: "हर महान कहानी एक विचार से शुरू होती है। आपका विचार क्या है?",
    keyboardTip: "कीबोर्ड सुझाव:", press: "दबाएं", toGenerate: "बनाने के लिए", alsoWorks: "भी काम करता है", forNewLine: "नई पंक्ति के लिए",
    generating: "बन रही है...", generate: "बनाएं", examples: "इन उदाहरण संकेतों का उपयोग करें:",
    selectPrompt: "एक संकेत चुनें", characterLimit: "अक्षर सीमा पूरी - निर्माण अक्षम है", charactersRemaining: "अक्षर शेष",
    shortcuts: "कीबोर्ड शॉर्टकट", openHelp: "सहायता खोलें", closeHelp: "सहायता बंद करें", focusPrompt: "संकेत पर जाएं",
    generateStory: "कहानी बनाएं", publishStory: "कहानी प्रकाशित करें", close: "बंद करें", freeLimitReached: "मुफ्त सीमा पूरी",
    freeLimitMessage: "आपने सभी 3 मुफ्त कहानी निर्माण उपयोग कर लिए हैं। आगे जारी रखने के लिए लॉग इन करें।", continueBrowsing: "ब्राउज़ करना जारी रखें",
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
    freeLimitMessage: "Du hast alle 3 kostenlosen Erstellungen genutzt. Melde dich an, um weiterzumachen.", continueBrowsing: "Weiter ansehen",
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
    freeLimitMessage: "無料の物語生成を3回すべて使用しました。続けるにはログインしてください。", continueBrowsing: "閲覧を続ける",
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
    freeLimitMessage: "무료 이야기 생성 3회를 모두 사용했습니다. 계속하려면 로그인하세요.", continueBrowsing: "계속 둘러보기",
  },
  Bengali: {
    back: "ফিরে যান", freeAccess: "৩টি অনুরোধের জন্য বিনামূল্যে ব্যবহার", login: "লগ ইন", forMore: "করে আরও পান!",
    perMonth: "প্রতি মাসে", upgrade: "আপগ্রেড", monthlyRequests: "এই মাসের অনুরোধ", totalPosts: "মোট পোস্ট",
    titleStart: "আপনার ভাবনাকে বদলে দিন", titleAccent: "অসাধারণ গল্পে!", length: "দৈর্ঘ্য", language: "ভাষা",
    short: "ছোট", medium: "মাঝারি", long: "লম্বা", promptPlaceholder: "প্রতিটি মহান গল্প একটি ভাবনা দিয়ে শুরু হয়। আপনারটি কী?",
    keyboardTip: "কীবোর্ড টিপ:", press: "চাপুন", toGenerate: "তৈরি করতে", alsoWorks: "এটিও কাজ করে", forNewLine: "নতুন লাইনের জন্য",
    generating: "তৈরি হচ্ছে...", generate: "তৈরি করুন", examples: "কিছু উদাহরণ প্রম্পট:",
    selectPrompt: "একটি প্রম্পট বেছে নিন", characterLimit: "অক্ষরের সীমা পূর্ণ - তৈরি বন্ধ", charactersRemaining: "অক্ষর বাকি",
    shortcuts: "কীবোর্ড শর্টকাট", openHelp: "সহায়তা খুলুন", closeHelp: "সহায়তা বন্ধ করুন", focusPrompt: "প্রম্পটে যান",
    generateStory: "গল্প তৈরি করুন", publishStory: "গল্প প্রকাশ করুন", close: "বন্ধ করুন", freeLimitReached: "বিনামূল্যের সীমা পূর্ণ",
    freeLimitMessage: "আপনি ৩টি বিনামূল্যের গল্প তৈরি ব্যবহার করেছেন। চালিয়ে যেতে লগ ইন করুন।", continueBrowsing: "ব্রাউজ চালিয়ে যান",
  },
  Tamil: {
    back: "திரும்பு", freeAccess: "3 கோரிக்கைகளுக்கு இலவச அணுகல்", login: "உள்நுழை", forMore: "செய்து மேலும் பெறுங்கள்!",
    perMonth: "மாதத்திற்கு", upgrade: "மேம்படுத்து", monthlyRequests: "இந்த மாத கோரிக்கைகள்", totalPosts: "மொத்த பதிவுகள்",
    titleStart: "உங்கள் எண்ணங்களை", titleAccent: "அற்புத கதைகளாக மாற்றுங்கள்!", length: "நீளம்", language: "மொழி",
    short: "சிறியது", medium: "நடுத்தரம்", long: "நீளமானது", promptPlaceholder: "ஒவ்வொரு சிறந்த கதையும் ஒரு எண்ணத்தில் தொடங்குகிறது. உங்களுடையது என்ன?",
    keyboardTip: "விசைப்பலகை குறிப்பு:", press: "அழுத்தவும்", toGenerate: "உருவாக்க", alsoWorks: "இதுவும் செயல்படும்", forNewLine: "புதிய வரிக்கு",
    generating: "உருவாக்குகிறது...", generate: "உருவாக்கு", examples: "சில எடுத்துக்காட்டு குறிப்புகள்:",
    selectPrompt: "ஒரு குறிப்பை தேர்வு செய்க", characterLimit: "எழுத்து வரம்பு அடைந்தது - உருவாக்கம் முடக்கப்பட்டது", charactersRemaining: "எழுத்துகள் மீதம்",
    shortcuts: "விசைப்பலகை குறுக்குவழிகள்", openHelp: "உதவி திற", closeHelp: "உதவி மூடு", focusPrompt: "குறிப்பில் கவனம்",
    generateStory: "கதை உருவாக்கு", publishStory: "கதை வெளியிடு", close: "மூடு", freeLimitReached: "இலவச வரம்பு அடைந்தது",
    freeLimitMessage: "3 இலவச கதை உருவாக்கங்களையும் பயன்படுத்திவிட்டீர்கள். தொடர உள்நுழையவும்.", continueBrowsing: "தொடர்ந்து பார்வையிடு",
  },
  Telugu: {
    back: "వెనుకకు", freeAccess: "3 అభ్యర్థనలకు ఉచిత ప్రవేశం", login: "లాగిన్", forMore: "చేసి మరిన్ని పొందండి!",
    perMonth: "నెలకు", upgrade: "అప్‌గ్రేడ్", monthlyRequests: "ఈ నెల అభ్యర్థనలు", totalPosts: "మొత్తం పోస్టులు",
    titleStart: "మీ ఆలోచనలను", titleAccent: "అద్భుత కథలుగా మార్చండి!", length: "పొడవు", language: "భాష",
    short: "చిన్నది", medium: "మధ్యస్థం", long: "పొడవైనది", promptPlaceholder: "ప్రతి గొప్ప కథ ఒక ఆలోచనతో మొదలవుతుంది. మీది ఏమిటి?",
    keyboardTip: "కీబోర్డ్ చిట్కా:", press: "నొక్కండి", toGenerate: "రూపొందించడానికి", alsoWorks: "కూడా పనిచేస్తుంది", forNewLine: "కొత్త లైన్ కోసం",
    generating: "రూపొందిస్తోంది...", generate: "రూపొందించు", examples: "కొన్ని ఉదాహరణ ప్రాంప్ట్‌లు:",
    selectPrompt: "ప్రాంప్ట్ ఎంచుకోండి", characterLimit: "అక్షర పరిమితి చేరింది - రూపొందింపు నిలిపివేయబడింది", charactersRemaining: "అక్షరాలు మిగిలాయి",
    shortcuts: "కీబోర్డ్ సత్వరమార్గాలు", openHelp: "సహాయం తెరవండి", closeHelp: "సహాయం మూసివేయండి", focusPrompt: "ప్రాంప్ట్‌పై దృష్టి",
    generateStory: "కథ రూపొందించు", publishStory: "కథ ప్రచురించు", close: "మూసివేయి", freeLimitReached: "ఉచిత పరిమితి చేరింది",
    freeLimitMessage: "మీరు 3 ఉచిత కథా రూపొందింపులను ఉపయోగించారు. కొనసాగడానికి లాగిన్ చేయండి.", continueBrowsing: "బ్రౌజింగ్ కొనసాగించు",
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
    freeLimitMessage: "तुम्ही सर्व 3 मोफत कथा निर्मिती वापरल्या आहेत. पुढे सुरू ठेवण्यासाठी लॉग इन करा.", continueBrowsing: "ब्राउझिंग सुरू ठेवा",
  },
};

const LANGUAGE_STORAGE_KEY = "storySparkLanguage";

const StoriesComponent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { register, handleSubmit, reset, setValue } = useForm<Inputs>();
  const [stories, setStories] = useState<IStories[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { data } = useGetProfileInfoQuery(undefined);
  const userRole = getUserInfo();
  const login = isLoggedIn();
  const [generateModel] = useGenerateModelMutation();
  const [generateFreeModel] = useGenerateFreeModelMutation();
  const [selectedPrompt, setSelectedPrompt] = useState<string>("");
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState<string>("");
  const [selectedLength, setSelectedLength] = useState<string>("medium");
  const [textareaValue, setTextareaValue] = useState<string>("");
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string>(() => {
    const storedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return LANGUAGES.some((language) => language.name === storedLanguage)
      ? storedLanguage as string
      : "English";
  });
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const languageDropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const activeGenerationRef = useRef<{ abort: () => void } | null>(null);
  const isGenerationInProgressRef = useRef(false);
  const [guestRequestCount, setGuestRequestCount] = useState<number>(() =>
    parseInt(localStorage.getItem("guestRequestCount") || "0", 10),
  );
  const [showLimitModal, setShowLimitModal] = useState<boolean>(false);
  const text = UI_TEXT[selectedLanguage] ?? UI_TEXT.English;
  const genreLabels = GENRE_LABELS[selectedLanguage] ?? GENRE_LABELS.English;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

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
    if (location.state && location.state.prompt) {
      setTextareaValue(location.state.prompt);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

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

    if (data.prompt === "") {
      toast.error("Please enter a prompt to generate a story.");
      return;
    }
    if (getWordCount(data.prompt) < 10) {
      toast.error(
        "Please enter a prompt with at least 10 words to generate a story.",
      );
      return;
    }
    isGenerationInProgressRef.current = true;
    setLoading(true);

    try {
      const payload = {
        prompt: selectedGenre
          ? `[Genre: ${selectedGenre}] ${data.prompt}`
          : data.prompt,
        wordLength:
          selectedLength === "short" ? 150
          : selectedLength === "long" ? 500
          : 250,
        language: selectedLanguage,
      };
      const generationRequest = login
        ? generateModel(payload)
        : generateFreeModel(payload);
      activeGenerationRef.current = generationRequest;
      const res = await generationRequest.unwrap();
      if (res) {
        toast.success(res.message);
        setStories(res.data as IStories[]);
        setSelectedPrompt("");
        setValue("prompt", "");
        reset();
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
      activeGenerationRef.current = null;
      isGenerationInProgressRef.current = false;
      setLoading(false);
    }
  };

  const handleCancelGeneration = () => {
    activeGenerationRef.current?.abort();
    activeGenerationRef.current = null;
    isGenerationInProgressRef.current = false;
    setLoading(false);
    toast("Story generation cancelled.");
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
            ✨ {text.titleStart}{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-blue-400">
              {text.titleAccent}
            </span>{" "}
            ✨
          </h1>

          <div className="max-w-3xl mx-auto px-4 sm:px-0">
            <div className="bg-gray-50 rounded-md p-4 border border-gray-200 text-slate-900 dark:bg-blue-500/10 dark:border-gray-400 dark:text-white">
<div className="relative">
  <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
    <div className="flex flex-wrap gap-2 mb-3">
      {GENRES.map((genre) => (
        <button
          key={genre.value}
          type="button"
          onClick={() =>
            setSelectedGenre(selectedGenre === genre.value ? "" : genre.value)
          }
          className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
            selectedGenre === genre.value
              ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/30"
              : "bg-white/10 text-gray-400 hover:bg-white/20 hover:text-gray-200"
          }`}
        >
          {genre.icon} {genreLabels[genre.name]}
        </button>
      ))}
    </div>

    <div className="flex flex-wrap items-center gap-4 mb-3">
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-400 mr-1">📏 {text.length}:</span>

        {(["short", "medium", "long"] as const).map((length) => (
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
            {text[length]}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2 ml-0 sm:ml-auto">
        <span className="text-xs text-gray-400 mr-1">🌐 {text.language}:</span>
        <div className="relative" ref={languageDropdownRef}>
          <button
            key="lang-selector-btn"
            type="button"
            onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
            className="flex items-center gap-2 px-3 py-1 bg-white/10 text-gray-300 border border-slate-700/50 rounded-full text-xs font-semibold hover:bg-white/20 transition-all duration-200 cursor-pointer"
          >
            <span>{LANGUAGES.find(l => l.name === selectedLanguage)?.name || "English"}</span>
            <span className="text-gray-400 text-[10px]">▼</span>
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

    <div className="relative">
      <textarea
  {...register("prompt")}
  ref={(el) => {
    register("prompt").ref(el);
    inputRef.current = el;
  }}
        className={`w-full h-32 sm:h-40 resize-none border-none outline-none bg-transparent text-gray-800 dark:text-gray-200 focus:ring-0 text-lg leading-relaxed tracking-wide placeholder:italic placeholder:text-gray-500 dark:placeholder:text-gray-400 pr-10 transition-colors duration-200 ${
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

      <div className="flex items-center justify-between mt-1 px-1">
        {isOverLimit ? (
          <p className="text-xs text-red-400 flex items-center gap-1">
            <span>⚠</span> {text.characterLimit}
          </p>
        ) : isNearLimit ? (
          <p className="text-xs text-yellow-400 flex items-center gap-1">
            <span>⚠</span>{" "}
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
      💡  <span className="font-medium">{text.keyboardTip}</span> {text.press}{" "}
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
        {loading ? text.generating : text.generate}
      </button>
    </div>
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
        ▼
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
      <StoriesViewComponent
        stories={stories}
        isLogin={login}
        setStories={setStories}
        onPublishSuccess={handlePublishSuccess}
        isLoading={loading}
      />
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

      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
};

export default StoriesComponent;
