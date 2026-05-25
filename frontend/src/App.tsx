import { useState, useEffect, useRef } from 'react';
import {
  LogIn,
  UserPlus,
  Sparkles,
  Menu,
  X,
  BookOpen,
  PenTool,
  Globe,
  Layers,
  ShieldCheck,
  Moon,
  Sun,
  Mail,
  Lock,
  User,
  Users,
  Phone,
  Clock,
  ArrowRight
} from 'lucide-react';
import BoomerangVideoBg from './BoomerangVideoBg';
import PlatformHub from './PlatformHub';

const BG_VIDEO =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260511_131941_d136af49-e243-493a-be14-6ff3f24e09e6.mp4';

type ScrollRevealProps = {
  children: React.ReactNode;
  className?: string;
  activeClass: string;
  inactiveClass: string;
  threshold?: number;
};

function ScrollReveal({
  children,
  className = '',
  activeClass,
  inactiveClass,
  threshold = 0.15,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          if (ref.current) {
            observer.unobserve(ref.current);
          }
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [threshold]);

  return (
    <div
      ref={ref}
      className={`${className} ${isIntersecting ? activeClass : inactiveClass}`}
    >
      {children}
    </div>
  );
}

const COUNTRY_CODES = [
  { name: "Afghanistan", code: "+93", flag: "🇦🇫" },
  { name: "Albania", code: "+355", flag: "🇦🇱" },
  { name: "Algeria", code: "+213", flag: "🇩🇿" },
  { name: "American Samoa", code: "+1-684", flag: "🇦🇸" },
  { name: "Andorra", code: "+376", flag: "🇦🇩" },
  { name: "Angola", code: "+244", flag: "🇦🇴" },
  { name: "Anguilla", code: "+1-264", flag: "🇦🇮" },
  { name: "Antarctica", code: "+672", flag: "🇦🇶" },
  { name: "Antigua and Barbuda", code: "+1-268", flag: "🇦🇬" },
  { name: "Argentina", code: "+54", flag: "🇦🇷" },
  { name: "Armenia", code: "+374", flag: "🇦🇲" },
  { name: "Aruba", code: "+297", flag: "🇦🇼" },
  { name: "Australia", code: "+61", flag: "🇦🇺" },
  { name: "Austria", code: "+43", flag: "🇦🇹" },
  { name: "Azerbaijan", code: "+994", flag: "🇦🇿" },
  { name: "Bahamas", code: "+1-242", flag: "🇧🇸" },
  { name: "Bahrain", code: "+973", flag: "🇧🇭" },
  { name: "Bangladesh", code: "+880", flag: "🇧🇩" },
  { name: "Barbados", code: "+1-246", flag: "🇧🇧" },
  { name: "Belarus", code: "+375", flag: "🇧🇾" },
  { name: "Belgium", code: "+32", flag: "🇧🇪" },
  { name: "Belize", code: "+501", flag: "🇧🇿" },
  { name: "Benin", code: "+229", flag: "🇧🇯" },
  { name: "Bermuda", code: "+1-441", flag: "🇧🇲" },
  { name: "Bhutan", code: "+975", flag: "🇧🇹" },
  { name: "Bolivia", code: "+591", flag: "🇧🇴" },
  { name: "Bosnia and Herzegovina", code: "+387", flag: "🇧🇦" },
  { name: "Botswana", code: "+267", flag: "🇧🇼" },
  { name: "Brazil", code: "+55", flag: "🇧🇷" },
  { name: "British Indian Ocean Territory", code: "+246", flag: "🇮🇴" },
  { name: "British Virgin Islands", code: "+1-284", flag: "🇻🇬" },
  { name: "Brunei", code: "+673", flag: "🇧🇳" },
  { name: "Bulgaria", code: "+359", flag: "🇧🇬" },
  { name: "Burkina Faso", code: "+226", flag: "🇧🇫" },
  { name: "Burundi", code: "+257", flag: "🇧🇮" },
  { name: "Cambodia", code: "+855", flag: "🇰🇭" },
  { name: "Cameroon", code: "+237", flag: "🇨🇲" },
  { name: "Canada", code: "+1", flag: "🇨🇦" },
  { name: "Cape Verde", code: "+238", flag: "🇨🇻" },
  { name: "Cayman Islands", code: "+1-345", flag: "🇰🇾" },
  { name: "Central African Republic", code: "+236", flag: "🇨🇫" },
  { name: "Chad", code: "+235", flag: "🇹🇩" },
  { name: "Chile", code: "+56", flag: "🇨🇱" },
  { name: "China", code: "+86", flag: "🇨🇳" },
  { name: "Christmas Island", code: "+61", flag: "🇨🇽" },
  { name: "Cocos Islands", code: "+61", flag: "🇨🇨" },
  { name: "Colombia", code: "+57", flag: "🇨🇴" },
  { name: "Comoros", code: "+269", flag: "🇰🇲" },
  { name: "Cook Islands", code: "+682", flag: "🇨🇰" },
  { name: "Costa Rica", code: "+506", flag: "🇨🇷" },
  { name: "Croatia", code: "+385", flag: "🇭🇷" },
  { name: "Cuba", code: "+53", flag: "🇨🇺" },
  { name: "Curacao", code: "+599", flag: "🇨🇼" },
  { name: "Cyprus", code: "+357", flag: "🇨🇾" },
  { name: "Czech Republic", code: "+420", flag: "🇨🇿" },
  { name: "Democratic Republic of the Congo", code: "+243", flag: "🇨🇩" },
  { name: "Denmark", code: "+45", flag: "🇩🇰" },
  { name: "Djibouti", code: "+253", flag: "🇩🇯" },
  { name: "Dominica", code: "+1-767", flag: "🇩🇲" },
  { name: "Dominican Republic", code: "+1-809", flag: "🇩🇴" },
  { name: "East Timor", code: "+670", flag: "🇹🇱" },
  { name: "Ecuador", code: "+593", flag: "🇪🇨" },
  { name: "Egypt", code: "+20", flag: "🇪🇬" },
  { name: "El Salvador", code: "+503", flag: "🇸🇻" },
  { name: "Equatorial Guinea", code: "+240", flag: "🇬🇶" },
  { name: "Eritrea", code: "+291", flag: "🇪🇷" },
  { name: "Estonia", code: "+372", flag: "🇪🇪" },
  { name: "Ethiopia", code: "+251", flag: "🇪🇹" },
  { name: "Falkland Islands", code: "+500", flag: "🇫🇰" },
  { name: "Faroe Islands", code: "+298", flag: "🇫🇴" },
  { name: "Fiji", code: "+679", flag: "🇫🇯" },
  { name: "Finland", code: "+358", flag: "🇫🇮" },
  { name: "France", code: "+33", flag: "🇫🇷" },
  { name: "French Guiana", code: "+594", flag: "🇬🇫" },
  { name: "French Polynesia", code: "+689", flag: "🇵🇫" },
  { name: "Gabon", code: "+241", flag: "🇬🇦" },
  { name: "Gambia", code: "+220", flag: "🇬🇲" },
  { name: "Georgia", code: "+995", flag: "🇬🇪" },
  { name: "Germany", code: "+49", flag: "🇩🇪" },
  { name: "Ghana", code: "+233", flag: "🇬🇭" },
  { name: "Gibraltar", code: "+350", flag: "🇬🇮" },
  { name: "Greece", code: "+30", flag: "🇬🇷" },
  { name: "Greenland", code: "+299", flag: "🇬🇱" },
  { name: "Grenada", code: "+1-473", flag: "🇬🇩" },
  { name: "Guadeloupe", code: "+590", flag: "🇬🇵" },
  { name: "Guam", code: "+1-671", flag: "🇬🇺" },
  { name: "Guatemala", code: "+502", flag: "🇬🇹" },
  { name: "Guernsey", code: "+44", flag: "🇬🇬" },
  { name: "Guinea", code: "+224", flag: "🇬🇳" },
  { name: "Guinea-Bissau", code: "+245", flag: "🇬🇼" },
  { name: "Guyana", code: "+592", flag: "🇬🇾" },
  { name: "Haiti", code: "+509", flag: "🇭🇹" },
  { name: "Honduras", code: "+504", flag: "🇭🇳" },
  { name: "Hong Kong", code: "+852", flag: "🇭🇰" },
  { name: "Hungary", code: "+36", flag: "🇭🇺" },
  { name: "Iceland", code: "+354", flag: "🇮🇸" },
  { name: "India", code: "+91", flag: "🇮🇳" },
  { name: "Indonesia", code: "+62", flag: "🇮🇩" },
  { name: "Iran", code: "+98", flag: "🇮🇷" },
  { name: "Iraq", code: "+964", flag: "🇮🇶" },
  { name: "Ireland", code: "+353", flag: "🇮🇪" },
  { name: "Isle of Man", code: "+44", flag: "🇮🇲" },
  { name: "Israel", code: "+972", flag: "🇮🇱" },
  { name: "Italy", code: "+39", flag: "🇮🇹" },
  { name: "Ivory Coast", code: "+225", flag: "🇨🇮" },
  { name: "Jamaica", code: "+1-876", flag: "🇯🇲" },
  { name: "Japan", code: "+81", flag: "🇯🇵" },
  { name: "Jersey", code: "+44", flag: "🇯🇪" },
  { name: "Jordan", code: "+962", flag: "🇯🇴" },
  { name: "Kazakhstan", code: "+7", flag: "🇰🇿" },
  { name: "Kenya", code: "+254", flag: "🇰🇪" },
  { name: "Kiribati", code: "+686", flag: "🇰🇮" },
  { name: "Kosovo", code: "+383", flag: "🇽🇰" },
  { name: "Kuwait", code: "+965", flag: "🇰🇼" },
  { name: "Kyrgyzstan", code: "+996", flag: "🇰🇬" },
  { name: "Laos", code: "+856", flag: "🇱🇦" },
  { name: "Latvia", code: "+371", flag: "🇱🇻" },
  { name: "Lebanon", code: "+961", flag: "🇱🇧" },
  { name: "Lesotho", code: "+266", flag: "🇱🇸" },
  { name: "Liberia", code: "+231", flag: "🇱🇷" },
  { name: "Libya", code: "+218", flag: "🇱🇾" },
  { name: "Liechtenstein", code: "+423", flag: "🇱🇮" },
  { name: "Lithuania", code: "+370", flag: "🇱🇹" },
  { name: "Luxembourg", code: "+352", flag: "🇱🇺" },
  { name: "Macau", code: "+853", flag: "🇲🇴" },
  { name: "Macedonia", code: "+389", flag: "🇲🇰" },
  { name: "Madagascar", code: "+261", flag: "🇲🇬" },
  { name: "Malawi", code: "+265", flag: "🇲🇼" },
  { name: "Malaysia", code: "+60", flag: "🇲🇾" },
  { name: "Maldives", code: "+960", flag: "🇲🇻" },
  { name: "Mali", code: "+223", flag: "🇲🇱" },
  { name: "Malta", code: "+356", flag: "🇲🇹" },
  { name: "Marshall Islands", code: "+692", flag: "🇲🇭" },
  { name: "Martinique", code: "+596", flag: "🇲🇶" },
  { name: "Mauritania", code: "+222", flag: "🇲🇷" },
  { name: "Mauritius", code: "+230", flag: "🇲🇺" },
  { name: "Mayotte", code: "+262", flag: "🇾🇹" },
  { name: "Mexico", code: "+52", flag: "🇲🇽" },
  { name: "Micronesia", code: "+691", flag: "🇫🇲" },
  { name: "Moldova", code: "+373", flag: "🇲🇩" },
  { name: "Monaco", code: "+377", flag: "🇲🇨" },
  { name: "Mongolia", code: "+976", flag: "🇲🇳" },
  { name: "Montenegro", code: "+382", flag: "🇲🇪" },
  { name: "Montserrat", code: "+1-664", flag: "🇲🇸" },
  { name: "Morocco", code: "+212", flag: "🇲🇦" },
  { name: "Mozambique", code: "+258", flag: "🇲🇿" },
  { name: "Myanmar", code: "+95", flag: "🇲🇲" },
  { name: "Namibia", code: "+264", flag: "🇳🇦" },
  { name: "Nauru", code: "+674", flag: "🇳🇷" },
  { name: "Nepal", code: "+977", flag: "🇳🇵" },
  { name: "Netherlands", code: "+31", flag: "🇳🇱" },
  { name: "Netherlands Antilles", code: "+599", flag: "🇦🇳" },
  { name: "New Caledonia", code: "+687", flag: "🇳🇨" },
  { name: "New Zealand", code: "+64", flag: "🇳🇿" },
  { name: "Nicaragua", code: "+505", flag: "🇳🇮" },
  { name: "Niger", code: "+227", flag: "🇳🇪" },
  { name: "Nigeria", code: "+234", flag: "🇳🇬" },
  { name: "Niue", code: "+683", flag: "🇳🇺" },
  { name: "North Korea", code: "+850", flag: "🇰🇵" },
  { name: "Northern Mariana Islands", code: "+1-670", flag: "🇲🇵" },
  { name: "Norway", code: "+47", flag: "🇳🇴" },
  { name: "Oman", code: "+968", flag: "🇴🇲" },
  { name: "Pakistan", code: "+92", flag: "🇵🇰" },
  { name: "Palau", code: "+680", flag: "🇵🇼" },
  { name: "Palestine", code: "+970", flag: "🇵🇸" },
  { name: "Panama", code: "+507", flag: "🇵🇦" },
  { name: "Papua New Guinea", code: "+675", flag: "🇵🇬" },
  { name: "Paraguay", code: "+595", flag: "🇵🇾" },
  { name: "Peru", code: "+51", flag: "🇵🇪" },
  { name: "Philippines", code: "+63", flag: "🇵🇭" },
  { name: "Poland", code: "+48", flag: "🇵🇱" },
  { name: "Portugal", code: "+351", flag: "🇵🇹" },
  { name: "Puerto Rico", code: "+1-787", flag: "🇵🇷" },
  { name: "Qatar", code: "+974", flag: "🇶🇦" },
  { name: "Republic of the Congo", code: "+242", flag: "🇨🇬" },
  { name: "Reunion", code: "+262", flag: "🇷🇪" },
  { name: "Romania", code: "+40", flag: "🇷🇴" },
  { name: "Russia", code: "+7", flag: "🇷🇺" },
  { name: "Rwanda", code: "+250", flag: "🇷🇼" },
  { name: "Saint Barthelemy", code: "+590", flag: "🇧🇱" },
  { name: "Saint Helena", code: "+290", flag: "🇸🇭" },
  { name: "Saint Kitts and Nevis", code: "+1-869", flag: "🇰🇳" },
  { name: "Saint Lucia", code: "+1-758", flag: "🇱🇨" },
  { name: "Saint Martin", code: "+590", flag: "🇲🇫" },
  { name: "Saint Pierre and Miquelon", code: "+508", flag: "🇵🇲" },
  { name: "Saint Vincent and the Grenadines", code: "+1-784", flag: "🇻🇨" },
  { name: "Samoa", code: "+685", flag: "🇼🇸" },
  { name: "San Marino", code: "+378", flag: "🇸🇲" },
  { name: "Sao Tome and Principe", code: "+239", flag: "🇸🇹" },
  { name: "Saudi Arabia", code: "+966", flag: "🇸🇦" },
  { name: "Senegal", code: "+221", flag: "🇸🇳" },
  { name: "Serbia", code: "+381", flag: "🇷🇸" },
  { name: "Seychelles", code: "+248", flag: "🇸🇨" },
  { name: "Sierra Leone", code: "+232", flag: "🇸🇱" },
  { name: "Singapore", code: "+65", flag: "🇸🇬" },
  { name: "Sint Maarten", code: "+1-721", flag: "🇸🇽" },
  { name: "Slovakia", code: "+421", flag: "🇸🇰" },
  { name: "Slovenia", code: "+386", flag: "🇸🇮" },
  { name: "Solomon Islands", code: "+677", flag: "🇸🇧" },
  { name: "Somalia", code: "+252", flag: "🇸🇴" },
  { name: "South Africa", code: "+27", flag: "🇿🇦" },
  { name: "South Korea", code: "+82", flag: "🇰🇷" },
  { name: "South Sudan", code: "+211", flag: "🇸🇸" },
  { name: "Spain", code: "+34", flag: "🇪🇸" },
  { name: "Sri Lanka", code: "+94", flag: "🇱🇰" },
  { name: "Sudan", code: "+249", flag: "🇸🇩" },
  { name: "Suriname", code: "+597", flag: "🇸🇷" },
  { name: "Svalbard and Jan Mayen", code: "+47", flag: "🇸🇯" },
  { name: "Swaziland", code: "+268", flag: "🇸🇿" },
  { name: "Sweden", code: "+46", flag: "🇸🇪" },
  { name: "Switzerland", code: "+41", flag: "🇨🇭" },
  { name: "Syria", code: "+963", flag: "🇸🇾" },
  { name: "Taiwan", code: "+886", flag: "🇹🇼" },
  { name: "Tajikistan", code: "+992", flag: "🇹🇯" },
  { name: "Tanzania", code: "+255", flag: "🇹🇿" },
  { name: "Thailand", code: "+66", flag: "🇹🇭" },
  { name: "Togo", code: "+228", flag: "🇹🇬" },
  { name: "Tokelau", code: "+690", flag: "🇹🇰" },
  { name: "Tonga", code: "+676", flag: "🇹🇴" },
  { name: "Trinidad and Tobago", code: "+1-868", flag: "🇹🇹" },
  { name: "Tunisia", code: "+216", flag: "🇹🇳" },
  { name: "Turkey", code: "+90", flag: "🇹🇷" },
  { name: "Turkmenistan", code: "+993", flag: "🇹🇲" },
  { name: "Turks and Caicos Islands", code: "+1-649", flag: "🇹🇨" },
  { name: "Tuvalu", code: "+688", flag: "🇹🇻" },
  { name: "U.S. Virgin Islands", code: "+1-340", flag: "🇻🇮" },
  { name: "Uganda", code: "+256", flag: "🇺🇬" },
  { name: "Ukraine", code: "+380", flag: "🇺🇦" },
  { name: "United Arab Emirates", code: "+971", flag: "🇦🇪" },
  { name: "United Kingdom", code: "+44", flag: "🇬🇧" },
  { name: "United States", code: "+1", flag: "🇺🇸" },
  { name: "Uruguay", code: "+598", flag: "🇺🇾" },
  { name: "Uzbekistan", code: "+998", flag: "🇺🇿" },
  { name: "Vanuatu", code: "+678", flag: "🇻🇺" },
  { name: "Vatican City", code: "+379", flag: "🇻🇦" },
  { name: "Venezuela", code: "+58", flag: "🇻🇪" },
  { name: "Vietnam", code: "+84", flag: "🇻🇳" },
  { name: "Wallis and Futuna", code: "+681", flag: "🇼🇫" },
  { name: "Western Sahara", code: "+212", flag: "🇪🇭" },
  { name: "Yemen", code: "+967", flag: "🇾🇪" },
  { name: "Zambia", code: "+260", flag: "🇿🇲" },
  { name: "Zimbabwe", code: "+263", flag: "🇿🇼" }
];

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : true; // Default to dark mode for high-end look
  });
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authTab, setAuthTab] = useState<'login' | 'signup'>('login');
  const [showPlatform, setShowPlatform] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [pendingPlatform, setPendingPlatform] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [selectedCountry, setSelectedCountry] = useState({ name: 'United States', code: '+1', flag: '🇺🇸' });
  const [countrySearchQuery, setCountrySearchQuery] = useState('');
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
  const phoneInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fullPhone = `${selectedCountry.code} ${formData.phone}`;
    console.log('Submitting Contact Form Data:', {
      ...formData,
      phone: fullPhone
    });
    alert(`Thank you ${formData.name}! Your message has been sent successfully (Phone: ${fullPhone}).`);
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const navLinks = [
    { href: '#mission', label: 'Publishing Tracks' },
    { href: '#pricing', label: 'Creator Pricing' },
    { href: '#community', label: 'Community Hub' },
    { href: '#contact', label: 'Contact Us' },
  ];

  const handleOpenAuth = (tab: 'login' | 'signup') => {
    setAuthTab(tab);
    setAuthModalOpen(true);
    setMenuOpen(false);
  };

  const handleEnterPlatform = () => {
    if (isLoggedIn) {
      setShowPlatform(true);
      setMenuOpen(false);
    } else {
      setPendingPlatform(true);
      handleOpenAuth('signup');
    }
  };

  const handleAuthComplete = () => {
    setIsLoggedIn(true);
    setAuthModalOpen(false);
    if (pendingPlatform) {
      setShowPlatform(true);
      setPendingPlatform(false);
    }
  };

  const googleIcon = (
    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
    </svg>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-spark-dark-green dark:bg-[#0F111A] dark:text-[#dfe2f1] transition-colors duration-500 font-sans selection:bg-spark-heading-accent/30">
      
      {/* Navbar Container */}
      <nav className="fixed top-0 left-0 right-0 h-[72px] z-50 flex items-center justify-between px-4 sm:px-6 md:px-10 py-4 border-b border-white/10 bg-white/70 dark:bg-[#0F111A]/80 backdrop-blur-md transition-colors duration-300">
        {/* Logo Left */}
        <div className="flex items-center gap-2">
          <a href="#" onClick={() => setShowPlatform(false)} className="flex items-center gap-2 group">
            <Sparkles className="w-5 h-5 text-spark-heading-primary dark:text-spark-heading-accent transition-transform duration-300 group-hover:rotate-12" />
            <span className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-spark-heading-primary dark:text-white">
              Story Spark AI<sup className="text-[10px] sm:text-xs font-semibold">™</sup>
            </span>
          </a>
        </div>

        {/* Pill Navigation Menu Center */}
        <div className="hidden lg:flex items-center gap-1 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md rounded-full pl-6 pr-1 py-1 shadow-sm border border-white/60 dark:border-slate-800/60">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setShowPlatform(false)}
              className="text-sm font-medium px-4 py-2 text-spark-text-green dark:text-slate-300 hover:text-spark-heading-primary dark:hover:text-white transition-colors duration-200"
            >
              {link.label}
            </a>
          ))}
          
          {/* Dark Mode Toggle Button */}
          <button
            id="dark_mode_toggle"
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 ml-2 rounded-full text-spark-dark-green hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle Theme"
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          
          <button
            id="try_it_live_navbar"
            onClick={handleEnterPlatform}
            className="ml-2 bg-spark-dark-green hover:bg-spark-button-hover dark:bg-[#336443] dark:hover:bg-[#2a5237] text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-all duration-300 shadow-sm"
          >
            Try it Live
          </button>
        </div>

        {/* Action Links Right */}
        <div className="flex items-center gap-3 sm:gap-6">
          <a
            id="signup_navbar"
            href="#signup"
            onClick={(e) => { e.preventDefault(); handleOpenAuth('signup'); }}
            className="hidden sm:flex items-center gap-2 text-sm font-semibold text-spark-medium-green dark:text-slate-300 hover:text-spark-heading-primary dark:hover:text-white transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            Sign Me Up!
          </a>
          <a
            id="enter_login_navbar"
            href="#login"
            onClick={(e) => { e.preventDefault(); handleOpenAuth('login'); }}
            className="hidden sm:flex items-center gap-2 text-sm font-semibold text-spark-medium-green dark:text-slate-300 hover:text-spark-heading-primary dark:hover:text-white transition-colors"
          >
            <LogIn className="w-4 h-4" />
            Enter
          </a>
          
          {/* Mobile Theme and Menu Toggle */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-full text-spark-dark-green hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle Theme"
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              id="mobile_menu_btn"
              onClick={() => setMenuOpen((v) => !v)}
              className="relative flex items-center justify-center w-10 h-10 rounded-full bg-white/70 dark:bg-slate-900/60 backdrop-blur-md border border-white/60 dark:border-slate-800/60 text-spark-dark-green dark:text-white transition-all duration-300 hover:bg-white/90"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
            >
              <Menu
                className={`w-5 h-5 absolute transition-all duration-300 ${
                  menuOpen ? 'opacity-0 rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'
                }`}
              />
              <X
                className={`w-5 h-5 absolute transition-all duration-300 ${
                  menuOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50'
                }`}
              />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      <div
        className={`lg:hidden fixed inset-0 z-40 transition-opacity duration-300 ${
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMenuOpen(false)}
      >
        <div className="absolute inset-0 bg-spark-dark-green/40 dark:bg-black/60 backdrop-blur-sm" />
      </div>

      {/* Mobile menu drawer */}
      <div
        className={`lg:hidden fixed top-0 right-0 bottom-0 z-40 w-[85%] max-w-sm bg-white/95 dark:bg-[#0F111A]/95 backdrop-blur-xl shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          menuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full pt-24 px-8 pb-8">
          <div className="flex flex-col gap-1">
            {navLinks.map((link, i) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => { setMenuOpen(false); setShowPlatform(false); }}
                className={`text-2xl font-bold text-spark-dark-green dark:text-white py-4 border-b border-spark-dark-green/10 dark:border-white/10 transition-all duration-500 ${
                  menuOpen ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'
                }`}
                style={{ transitionDelay: menuOpen ? `${150 + i * 70}ms` : '0ms' }}
              >
                {link.label}
              </a>
            ))}
          </div>

          <div
            className={`mt-8 flex flex-col gap-4 transition-all duration-500 ${
              menuOpen ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'
            }`}
            style={{ transitionDelay: menuOpen ? '400ms' : '0ms' }}
          >
            <a
              href="#signup"
              onClick={(e) => { e.preventDefault(); handleOpenAuth('signup'); }}
              className="flex items-center gap-2 text-sm font-semibold text-spark-medium-green dark:text-slate-300"
            >
              <UserPlus className="w-4 h-4" />
              Sign Me Up!
            </a>
            <a
              href="#login"
              onClick={(e) => { e.preventDefault(); handleOpenAuth('login'); }}
              className="flex items-center gap-2 text-sm font-semibold text-spark-medium-green dark:text-slate-300"
            >
              <LogIn className="w-4 h-4" />
              Enter
            </a>
            <button
              onClick={handleEnterPlatform}
              className="mt-2 bg-spark-dark-green hover:bg-spark-button-hover dark:bg-[#336443] dark:hover:bg-[#2a5237] text-white text-sm font-bold px-5 py-3 rounded-full transition-colors"
            >
              Try it Live
            </button>
          </div>
        </div>
      </div>

      {showPlatform ? (
        <PlatformHub onBack={() => setShowPlatform(false)} />
      ) : (
      <>
      {/* Main Hero Container Section */}
      <section className="relative w-full h-[95vh] sm:h-screen overflow-hidden flex flex-col justify-between">
        
        {/* Boomerang Canvas engine - isolated in back stack */}
        <BoomerangVideoBg src={BG_VIDEO} className="absolute inset-0 w-full h-full z-0" />
        
        {/* Soft radial overlay gradient for contrast overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-white/60 dark:from-black/40 dark:via-transparent dark:to-[#0F111A] z-0 pointer-events-none" />

        {/* Hero copy - cleanly layered on top */}
        <div className="relative z-10 flex flex-col items-center text-center pt-28 sm:pt-32 md:pt-36 px-4 sm:px-6">
          <h1
            className="font-normal leading-[0.95] text-spark-heading-primary dark:text-white text-[2.25rem] sm:text-5xl md:text-6xl lg:text-[4.75rem] xl:text-[5.25rem] max-w-5xl"
            style={{ letterSpacing: '-0.035em' }}
          >
            Your stories deserve an
            <span className="block">
              elegant space to <span className="text-[#336443] dark:text-emerald-300">grow.</span>
            </span>
          </h1>
          <p className="mt-6 sm:mt-8 text-spark-text-green dark:text-[#9ea2b8] text-base sm:text-lg md:text-xl leading-relaxed max-w-2xl px-2 font-medium">
            Draft immersive serial fiction, host your independent blog, or build a dedicated audience. Start writing on a distraction-free digital canvas equipped with intuitive, creative design tools.
          </p>
        </div>

        {/* Bottom CTA and info panel container */}
        <div className="relative z-10 w-full px-4 sm:px-10 pb-10 flex flex-col sm:flex-row items-end justify-between gap-8 mt-auto">
          
          {/* Bottom-left SparkEngine CTA Block */}
          <div className="max-w-sm bg-white/80 dark:bg-slate-900/85 backdrop-blur-md rounded-2xl p-6 border border-white/60 dark:border-slate-800/60 shadow-lg">
            <div className="flex items-center gap-2 text-spark-bottom-text dark:text-spark-heading-accent mb-2">
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span className="text-sm font-bold">
                SparkEngine™
              </span>
            </div>
            <p className="text-spark-text-green dark:text-slate-300 text-xs leading-relaxed mb-4">
              SparkEngine™: Beautiful text layout rendering, automatic formatting constraints, and cross-platform publishing built entirely for independent storytellers.
            </p>
            <div className="flex items-center gap-4 flex-wrap">
              <button
                onClick={handleEnterPlatform}
                className="bg-spark-bottom-btn-bg hover:bg-spark-bottom-btn-hover dark:bg-[#336443] dark:hover:bg-[#2a5237] text-white text-xs font-semibold px-5 py-2.5 rounded-full transition-colors shadow-sm"
              >
                Try it Live
              </button>
              <a
                href="#mission"
                className="text-spark-bottom-text dark:text-slate-300 text-xs font-semibold hover:underline"
              >
                Know More.
              </a>
            </div>
          </div>


        </div>
      </section>

      {/* Features grid section (Purpose / Process) */}
      <section id="mission" className="py-20 sm:py-28 px-4 sm:px-6 md:px-10 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0A0C14] overflow-hidden">
        <div className="max-w-[1200px] mx-auto">
          <ScrollReveal
            activeClass="opacity-100 translate-y-0"
            inactiveClass="opacity-0 translate-y-12"
            className="transition-all duration-1000 ease-out"
          >
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-sm font-bold tracking-wider text-spark-heading-accent uppercase mb-3">Publishing Tracks</h2>
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-spark-heading-primary dark:text-white mb-6">
                Built For Every Type of Creator
              </h3>
              <p className="text-spark-text-green dark:text-slate-400 text-base sm:text-lg">
                Co-write with a tailored intelligence designed to fill planning voids, expand plot lines, and map out paths.
              </p>
            </div>
          </ScrollReveal>

          {/* 3-column features grid container with 1px border and blur */}
          <ScrollReveal
            activeClass="opacity-100 translate-y-0"
            inactiveClass="opacity-0 translate-y-12"
            className="transition-all duration-1000 ease-out"
          >
            <div className="grid md:grid-cols-3 gap-1 overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/20">
              
              {/* Feature 1 */}
              <ScrollReveal
                activeClass="opacity-100 translate-y-0"
                inactiveClass="opacity-0 translate-y-12"
                className="p-8 sm:p-10 bg-white/40 dark:bg-[#161b2e]/40 backdrop-blur-sm hover:bg-white/60 dark:hover:bg-[#1c223a]/50 transition-all duration-1000 ease-out delay-0 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-[#336443]/10 flex items-center justify-center mb-8 border border-emerald-100 dark:border-[#336443]/20">
                    <Globe className="w-5 h-5 text-[#336443]" />
                  </div>
                  <h4 className="text-xl font-bold text-spark-dark-green dark:text-white mb-4">Serial Fiction & Novels</h4>
                  <p className="text-spark-text-green dark:text-slate-400 text-sm leading-relaxed">
                    Publish your stories chapter-by-chapter. Perfect for fantasy, sci-fi, or mystery writers building multi-part universes with automated chapter indexing.
                  </p>
                </div>
                <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800/50">
                  <span className="text-xs font-semibold text-spark-heading-accent">SPARKENGINE ROUTER</span>
                </div>
              </ScrollReveal>

              {/* Feature 2 */}
              <ScrollReveal
                activeClass="opacity-100 translate-y-0"
                inactiveClass="opacity-0 translate-y-12"
                className="p-8 sm:p-10 bg-white/40 dark:bg-[#161b2e]/40 backdrop-blur-sm hover:bg-white/60 dark:hover:bg-[#1c223a]/50 transition-all duration-1000 ease-out delay-150 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-[#336443]/10 flex items-center justify-center mb-8 border border-emerald-100 dark:border-[#336443]/20">
                    <Sparkles className="w-5 h-5 text-[#336443]" />
                  </div>
                  <h4 className="text-xl font-bold text-spark-dark-green dark:text-white mb-4">Independent Blogs</h4>
                  <p className="text-spark-text-green dark:text-slate-400 text-sm leading-relaxed">
                    Launch a clean, beautiful personal journal or thought space. Share essays, hypothetical theories, or daily notes on a highly legible, human-friendly interface.
                  </p>
                </div>
                <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800/50">
                  <span className="text-xs font-semibold text-spark-heading-accent">LLM COLLABORATION</span>
                </div>
              </ScrollReveal>

              {/* Feature 3 */}
              <ScrollReveal
                activeClass="opacity-100 translate-y-0"
                inactiveClass="opacity-0 translate-y-12"
                className="p-8 sm:p-10 bg-white/40 dark:bg-[#161b2e]/40 backdrop-blur-sm hover:bg-white/60 dark:hover:bg-[#1c223a]/50 transition-all duration-1000 ease-out delay-300 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-[#336443]/10 flex items-center justify-center mb-8 border border-emerald-100 dark:border-[#336443]/20">
                    <PenTool className="w-5 h-5 text-[#336443]" />
                  </div>
                  <h4 className="text-xl font-bold text-spark-dark-green dark:text-white mb-4">Collaborative Chronicles</h4>
                  <p className="text-spark-text-green dark:text-slate-400 text-sm leading-relaxed">
                    Invite co-authors, friends, or writing groups to collaborate on shared lorebooks and dynamic story arcs in real-time.
                  </p>
                </div>
                <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800/50">
                  <span className="text-xs font-semibold text-spark-heading-accent">NARRATIVE PLANNING</span>
                </div>
              </ScrollReveal>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* The Process Section */}
      <section id="how" className="py-20 sm:py-28 px-4 sm:px-6 md:px-10 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0F111A] overflow-hidden">
        <div className="max-w-[1200px] mx-auto">
          <ScrollReveal
            activeClass="opacity-100 translate-y-0"
            inactiveClass="opacity-0 translate-y-12"
            className="transition-all duration-1000 ease-out"
          >
            <div className="text-center max-w-3xl mx-auto mb-20">
              <h2 className="text-sm font-bold tracking-wider text-spark-heading-accent uppercase mb-3">The Process</h2>
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-spark-heading-primary dark:text-white mb-6">
                Write with speed, publish with pride.
              </h3>
              <p className="text-spark-text-green dark:text-slate-400 text-base">
                Three simple phases to transition concepts from isolated drafts to breathtaking literary projects.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal
            activeClass="opacity-100 translate-y-0"
            inactiveClass="opacity-0 translate-y-12"
            className="transition-all duration-1000 ease-out"
          >
            <div className="grid md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <ScrollReveal
                activeClass="opacity-100 translate-y-0"
                inactiveClass="opacity-0 translate-y-12"
                className="relative p-8 bg-white dark:bg-[#161b2e]/60 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-1000 ease-out delay-0 flex flex-col justify-between"
              >
                <div>
                  <span className="absolute -top-6 left-6 text-5xl font-extrabold text-slate-100 dark:text-slate-800 select-none">01</span>
                  <div className="flex items-center gap-2 mb-6">
                    <BookOpen className="w-5 h-5 text-spark-heading-accent" />
                    <h4 className="text-lg font-bold text-spark-dark-green dark:text-white">Seed Spark</h4>
                  </div>
                  <p className="text-spark-text-green dark:text-slate-400 text-sm leading-relaxed">
                    Enter a loose outline, seed dialogue, or character traits into the workspace. SparkEngine™ analyzes the draft and begins indexing context.
                  </p>
                </div>
              </ScrollReveal>

              {/* Step 2 */}
              <ScrollReveal
                activeClass="opacity-100 translate-y-0"
                inactiveClass="opacity-0 translate-y-12"
                className="relative p-8 bg-white dark:bg-[#161b2e]/60 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-1000 ease-out delay-150 flex flex-col justify-between"
              >
                <div>
                  <span className="absolute -top-6 left-6 text-5xl font-extrabold text-slate-100 dark:text-slate-800 select-none">02</span>
                  <div className="flex items-center gap-2 mb-6">
                    <Layers className="w-5 h-5 text-spark-heading-accent" />
                    <h4 className="text-lg font-bold text-spark-dark-green dark:text-white">Collaborative Shape</h4>
                  </div>
                  <p className="text-spark-text-green dark:text-slate-400 text-sm leading-relaxed">
                    Generate chapters, expand plot boards, and design outlines collaboratively. The AI suggests plot fixes, checks timelines, and fixes pacing issues.
                  </p>
                </div>
              </ScrollReveal>

              {/* Step 3 */}
              <ScrollReveal
                activeClass="opacity-100 translate-y-0"
                inactiveClass="opacity-0 translate-y-12"
                className="relative p-8 bg-white dark:bg-[#161b2e]/60 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-1000 ease-out delay-300 flex flex-col justify-between"
              >
                <div>
                  <span className="absolute -top-6 left-6 text-5xl font-extrabold text-slate-100 dark:text-slate-800 select-none">03</span>
                  <div className="flex items-center gap-2 mb-6">
                    <ShieldCheck className="w-5 h-5 text-spark-heading-accent" />
                    <h4 className="text-lg font-bold text-spark-dark-green dark:text-white">Dynamic Saga</h4>
                  </div>
                  <p className="text-spark-text-green dark:text-slate-400 text-sm leading-relaxed">
                    Compile your work into formatted ebooks, printable drafts, or interactive branching logs. Distribute directly to readers with built-in export presets.
                  </p>
                </div>
              </ScrollReveal>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Pricing Grid Section (Tariffs) */}
      <section id="pricing" className="py-20 sm:py-28 px-4 sm:px-6 md:px-10 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0A0C14] overflow-hidden">
        <div className="max-w-[1200px] mx-auto">
          <ScrollReveal
            activeClass="opacity-100 scale-100"
            inactiveClass="opacity-0 scale-95"
            className="transition-all duration-700 ease-out"
          >
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-sm font-bold tracking-wider text-spark-heading-accent uppercase mb-3">Creator Pricing</h2>
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-spark-heading-primary dark:text-white mb-6">
                Choose Your Access Level
              </h3>
              <p className="text-spark-text-green dark:text-slate-400 text-base">
                Choose the right tier to match your writing productivity and collaboration limits.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Starter Plan */}
            <ScrollReveal
              activeClass="opacity-100 scale-100 translate-y-0"
              inactiveClass="opacity-0 scale-95 translate-y-0"
              className="flex flex-col justify-between bg-white dark:bg-[#161b2e]/30 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 hover:-translate-y-2 hover:shadow-xl hover:border-spark-heading-accent dark:hover:border-spark-heading-accent transition-all duration-700 ease-out delay-0"
            >
              <div>
                <h4 className="text-lg font-bold text-spark-dark-green dark:text-white mb-2">Starter Plan</h4>
                <p className="text-xs text-spark-text-green dark:text-slate-400 mb-6">For hobbyists and debut creators.</p>
                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-4xl font-extrabold text-spark-heading-primary dark:text-white">$0</span>
                  <span className="text-sm text-spark-text-green dark:text-slate-400">/mo</span>
                </div>
                <ul className="space-y-4 text-sm text-spark-text-green dark:text-slate-300">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-spark-heading-accent" />
                    Host and publish up to 5 stories per month
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-spark-heading-accent" />
                    Access the core distraction-free writing canvas
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-spark-heading-accent" />
                    Receive basic visitor analytics
                  </li>
                </ul>
              </div>
              <button
                onClick={handleEnterPlatform}
                className="mt-8 w-full bg-slate-100 hover:bg-slate-200 text-spark-dark-green dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-white text-sm font-semibold py-3 rounded-xl transition-colors"
              >
                Start Writing Free
              </button>
            </ScrollReveal>

            {/* Pro Plan */}
            <ScrollReveal
              activeClass="opacity-100 scale-100 -translate-y-2"
              inactiveClass="opacity-0 scale-95 translate-y-0"
              className="relative flex flex-col justify-between bg-white dark:bg-[#161b2e]/50 rounded-2xl border-2 border-[#336443] dark:border-spark-heading-accent p-8 hover:-translate-y-4 hover:shadow-2xl transition-all duration-700 ease-out delay-150"
            >
              <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-spark-heading-primary dark:bg-spark-heading-accent text-white dark:text-spark-dark-green text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full">
                Most Popular
              </span>
              <div>
                <h4 className="text-lg font-bold text-spark-dark-green dark:text-white mb-2">Pro Plan</h4>
                <p className="text-xs text-spark-text-green dark:text-slate-400 mb-6">For career writers and novelists.</p>
                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-4xl font-extrabold text-spark-heading-primary dark:text-white">$19</span>
                  <span className="text-sm text-spark-text-green dark:text-slate-400">/mo</span>
                </div>
                <ul className="space-y-4 text-sm text-spark-text-green dark:text-slate-300">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-spark-heading-accent" />
                    Publish unlimited stories and blog posts
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-spark-heading-accent" />
                    Unlock advanced formatting styles
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-spark-heading-accent" />
                    Utilize the AI co-pilot brainstorming assistant
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-spark-heading-accent" />
                    Activate subscriber newsletters
                  </li>
                </ul>
              </div>
              <button
                onClick={handleEnterPlatform}
                className="mt-8 w-full bg-spark-heading-primary hover:bg-[#284e34] dark:bg-spark-heading-accent dark:hover:bg-[#6c9072] text-white dark:text-spark-dark-green text-sm font-semibold py-3 rounded-xl transition-colors shadow-md"
              >
                Go Pro Creator
              </button>
            </ScrollReveal>

            {/* Enterprise Plan */}
            <ScrollReveal
              activeClass="opacity-100 scale-100 translate-y-0"
              inactiveClass="opacity-0 scale-95 translate-y-0"
              className="flex flex-col justify-between bg-white dark:bg-[#161b2e]/30 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 hover:-translate-y-2 hover:shadow-xl hover:border-spark-heading-accent dark:hover:border-spark-heading-accent transition-all duration-700 ease-out delay-300"
            >
              <div>
                <h4 className="text-lg font-bold text-spark-dark-green dark:text-white mb-2">Enterprise Plan</h4>
                <p className="text-xs text-spark-text-green dark:text-slate-400 mb-6">For writing teams, digital magazines, or indie publishing houses.</p>
                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-4xl font-extrabold text-spark-heading-primary dark:text-white">$49</span>
                  <span className="text-sm text-spark-text-green dark:text-slate-400">/mo</span>
                </div>
                <ul className="space-y-4 text-sm text-spark-text-green dark:text-slate-300">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-spark-heading-accent" />
                    Shared studio workspaces
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-spark-heading-accent" />
                    Custom domain hosting
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-spark-heading-accent" />
                    Priority support channels
                  </li>
                </ul>
              </div>
              <button
                onClick={handleEnterPlatform}
                className="mt-8 w-full bg-slate-100 hover:bg-slate-200 text-spark-dark-green dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-white text-sm font-semibold py-3 rounded-xl transition-colors"
              >
                Launch Studio
              </button>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section id="community" className="py-20 sm:py-28 px-4 sm:px-6 md:px-10 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0F111A] overflow-hidden">
        <div className="max-w-[1200px] mx-auto">
          <ScrollReveal
            activeClass="opacity-100 translate-y-0"
            inactiveClass="opacity-0 translate-y-12"
            className="transition-all duration-700 ease-out"
          >
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Column (Copy) */}
              <div className="space-y-6">
                <h2 className="text-sm font-bold tracking-wider text-spark-heading-accent uppercase">Community Hub</h2>
                <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-spark-heading-primary dark:text-white">
                  Join a Global Network of Creators
                </h3>
                <p className="text-spark-text-green dark:text-slate-300 text-base sm:text-lg leading-relaxed">
                  Step into our shared storytelling ecosystem. Collaborating writers use Story Spark AI™ workspaces to review notes, co-author books, run writing sprints, and host live reading workshops. Unleash your collective imagination.
                </p>
              </div>

              {/* Right Column (Interactive Cards) */}
              <div className="grid sm:grid-cols-2 gap-6">
                {/* Card A: Discord */}
                <div className="p-6 bg-white dark:bg-[#161b2e]/40 backdrop-blur-sm rounded-2xl border border-slate-200 dark:border-slate-800 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-48">
                  <div>
                    <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-[#336443]/10 flex items-center justify-center mb-4 border border-emerald-100 dark:border-[#336443]/20">
                      <Users className="w-5 h-5 text-spark-heading-primary dark:text-spark-heading-accent" />
                    </div>
                    <h4 className="font-bold text-spark-dark-green dark:text-white mb-1">Discord Server Access</h4>
                    <p className="text-xs text-spark-text-green dark:text-slate-400">Interact with over 10,000 global writers, prompt creators, and narrators in real time.</p>
                  </div>
                  <a href="#discord" className="text-xs font-bold text-spark-heading-primary dark:text-spark-heading-accent hover:underline inline-flex items-center gap-1 mt-2">
                    Join Discord &rarr;
                  </a>
                </div>

                {/* Card B: Sprints */}
                <div className="p-6 bg-white dark:bg-[#161b2e]/40 backdrop-blur-sm rounded-2xl border border-slate-200 dark:border-slate-800 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-48">
                  <div>
                    <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-[#336443]/10 flex items-center justify-center mb-4 border border-emerald-100 dark:border-[#336443]/20">
                      <Sparkles className="w-5 h-5 text-spark-heading-primary dark:text-spark-heading-accent" />
                    </div>
                    <h4 className="font-bold text-spark-dark-green dark:text-white mb-1">Weekly Writing Arenas</h4>
                    <p className="text-xs text-spark-text-green dark:text-slate-400">Join our weekly community sprints, co-author challenges, and claim exclusive arena awards.</p>
                  </div>
                  <a href="#arenas" className="text-xs font-bold text-spark-heading-primary dark:text-spark-heading-accent hover:underline inline-flex items-center gap-1 mt-2">
                    Explore Arenas &rarr;
                  </a>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Contact Us Section */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 md:px-10 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0A0C14] overflow-hidden">
        <div id="contact" className="max-w-[1100px] mx-auto">
          <ScrollReveal
            activeClass="opacity-100 translate-y-0"
            inactiveClass="opacity-0 translate-y-8"
            className="transition-all duration-1000 ease-out"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 sm:gap-16">
              
              {/* Left Column (The Aesthetic Typography Anchor - 4 Columns) */}
              <div className="lg:col-span-4 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-semibold tracking-widest text-[#85AB8B] uppercase block mb-3">
                    CORRESPONDENCE
                  </span>
                  <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#336443] dark:text-emerald-400 mb-6 leading-tight font-sans">
                    Let’s bring your saga to life.
                  </h3>
                  <p className="text-[#4b5b47] dark:text-slate-300 text-sm leading-relaxed mb-8">
                    Our editorial support and platform curation teams are always listening. Reach out for publishing assistance, workspace customization, or general inquiries.
                  </p>
                </div>
                
                <div className="flex flex-col gap-4 pt-8 border-t border-[#336443]/10 dark:border-white/10 mt-auto">
                  <div className="flex items-center gap-3 text-sm text-[#4b5b47]/80 dark:text-slate-400">
                    <Mail className="w-4 h-4 text-[#336443]" />
                    <a href="mailto:editorial@storysparkai.com" className="hover:underline">
                      editorial@storysparkai.com
                    </a>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-[#4b5b47]/80 dark:text-slate-400">
                    <Clock className="w-4 h-4 text-[#336443]" />
                    <span>Average response: under 12 hours</span>
                  </div>
                </div>
              </div>

              {/* Right Column (The Premium Minimalist Form - 8 Columns) */}
              <div className="lg:col-span-8 bg-white/40 dark:bg-[#121826]/40 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-white/40 dark:border-white/5">
                <form onSubmit={handleFormSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Field 1: Name */}
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4b5b47]/60" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Full Name"
                        className="w-full h-12 pl-11 pr-4 bg-transparent border-t-0 border-l-0 border-r-0 border-b-2 border-[#4b5b47]/20 focus:border-[#336443] focus:ring-0 text-sm transition-all duration-300 text-spark-dark-green dark:text-white placeholder:text-[#4b5b47]/40"
                        required
                      />
                    </div>

                    {/* Field 2: Email */}
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4b5b47]/60" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Email Address"
                        className="w-full h-12 pl-11 pr-4 bg-transparent border-t-0 border-l-0 border-r-0 border-b-2 border-[#4b5b47]/20 focus:border-[#336443] focus:ring-0 text-sm transition-all duration-300 text-spark-dark-green dark:text-white placeholder:text-[#4b5b47]/40"
                        required
                      />
                    </div>

                    {/* Field 3: Phone */}
                    <div className="relative flex items-center border-b-2 border-[#4b5b47]/20 focus-within:border-[#336443] transition-all duration-300 bg-transparent">
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setCountryDropdownOpen(!countryDropdownOpen)}
                          className="h-12 px-3 flex items-center gap-1.5 bg-transparent text-sm font-semibold hover:bg-slate-100/10 transition-colors text-spark-dark-green dark:text-white"
                          id="country_selector_btn"
                        >
                          <span className="text-base mr-0.5">{selectedCountry.flag}</span>
                          <span className="text-slate-500 dark:text-slate-400 font-normal">
                            {selectedCountry.code}
                          </span>
                          <span className="text-[10px] text-slate-400 ml-0.5">▼</span>
                        </button>
                        
                        {countryDropdownOpen && (
                          <>
                            <div className="fixed inset-0 z-40" onClick={() => setCountryDropdownOpen(false)} />
                            <div className="absolute top-14 left-0 w-64 max-h-60 overflow-y-auto bg-white dark:bg-[#161b2e] border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-50 p-2 space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
                              <div className="relative">
                                <input
                                  type="text"
                                  placeholder="Search country..."
                                  value={countrySearchQuery}
                                  onChange={(e) => setCountrySearchQuery(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      e.preventDefault();
                                      const filtered = COUNTRY_CODES.filter((c) =>
                                        c.name.toLowerCase().includes(countrySearchQuery.toLowerCase()) ||
                                        c.code.includes(countrySearchQuery)
                                      );
                                      if (filtered.length > 0) {
                                        setSelectedCountry(filtered[0]);
                                        setCountryDropdownOpen(false);
                                        setCountrySearchQuery('');
                                        setTimeout(() => {
                                          phoneInputRef.current?.focus();
                                        }, 50);
                                      }
                                    }
                                  }}
                                  className="w-full h-9 px-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs focus:outline-none focus:border-[#336443] dark:focus:border-spark-heading-accent text-spark-dark-green dark:text-white"
                                  autoFocus
                                />
                              </div>
                              <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
                                {COUNTRY_CODES.filter((c) =>
                                  c.name.toLowerCase().includes(countrySearchQuery.toLowerCase()) ||
                                  c.code.includes(countrySearchQuery)
                                ).length > 0 ? (
                                  COUNTRY_CODES.filter((c) =>
                                    c.name.toLowerCase().includes(countrySearchQuery.toLowerCase()) ||
                                    c.code.includes(countrySearchQuery)
                                  ).map((c) => (
                                    <button
                                      key={c.name}
                                      type="button"
                                      onClick={() => {
                                        setSelectedCountry(c);
                                        setCountryDropdownOpen(false);
                                        setCountrySearchQuery('');
                                        setTimeout(() => {
                                          phoneInputRef.current?.focus();
                                        }, 50);
                                      }}
                                      className="w-full text-left px-2 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded text-xs flex justify-between items-center transition-colors text-spark-dark-green dark:text-slate-300"
                                    >
                                      <span className="truncate mr-2 font-medium flex items-center gap-1.5">
                                        <span className="text-sm">{c.flag}</span>
                                        <span className="truncate">{c.name}</span>
                                      </span>
                                      <span className="text-slate-400 font-semibold">{c.code}</span>
                                    </button>
                                  ))
                                ) : (
                                  <div className="text-[10px] text-slate-400 text-center py-2">No matching country</div>
                                )}
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                      
                      <div className="relative flex-1">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4b5b47]/60" />
                        <input
                          ref={phoneInputRef}
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="Contact Number"
                          className="w-full h-12 pl-11 pr-4 bg-transparent border-none focus:outline-none focus:ring-0 text-sm text-spark-dark-green dark:text-white placeholder:text-[#4b5b47]/40"
                          required
                        />
                      </div>
                    </div>

                    {/* Field 4: Message */}
                    <div className="relative sm:col-span-2">
                      <PenTool className="absolute left-4 top-4 w-4 h-4 text-[#4b5b47]/60" />
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="How can we help shape your narratives?"
                        className="w-full h-[120px] pl-11 pr-4 py-3.5 bg-transparent border-t-0 border-l-0 border-r-0 border-b-2 border-[#4b5b47]/20 focus:border-[#336443] focus:ring-0 text-sm transition-all duration-300 resize-none text-spark-dark-green dark:text-white placeholder:text-[#4b5b47]/40"
                        required
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4 flex justify-end">
                    <button
                      type="submit"
                      className="group bg-[#1f2a1d] hover:bg-[#2a3827] text-white font-medium text-sm px-6 py-3 rounded-full transition-all duration-300 flex items-center justify-center"
                    >
                      Send Message
                      <ArrowRight className="w-4 h-4 ml-2 inline-block transition-transform duration-300 group-hover:translate-x-1" />
                    </button>
                  </div>
                </form>
              </div>

            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Footer Section */}
      <ScrollReveal
        activeClass="opacity-100"
        inactiveClass="opacity-0"
        className="transition-opacity duration-500 ease-out"
      >
        <footer className="py-12 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0a0c14] text-center text-xs text-spark-text-green dark:text-slate-400">
          <div className="max-w-[1200px] mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-spark-heading-accent" />
              <span className="font-bold text-spark-dark-green dark:text-white">Story Spark AI™</span>
            </div>
            <p>© {new Date().getFullYear()} Story Spark AI™. All rights reserved. Creative collaborative workflows built for storytelling.</p>
            <div className="flex gap-4">
              <a href="#" className="hover:underline">Privacy Policy</a>
              <a href="#" className="hover:underline">Terms of Service</a>
            </div>
          </div>
        </footer>
      </ScrollReveal>
      </>
      )}

      {/* Authentication views - Centered overlay modals */}
      {authModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-all duration-300">
          <div
            className="w-full max-w-md bg-white dark:bg-[#161b2e] rounded-3xl border border-slate-200 dark:border-slate-800/80 shadow-2xl p-8 relative mx-4 animate-in fade-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              id="auth_modal_close"
              onClick={() => setAuthModalOpen(false)}
              className="absolute top-5 right-5 p-1 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Close authentication panel"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Headings / Tabs */}
            <div className="flex border-b border-slate-100 dark:border-slate-800 mb-6">
              <button
                id="login_tab_btn"
                onClick={() => setAuthTab('login')}
                className={`flex-1 pb-4 text-base font-bold transition-colors ${
                  authTab === 'login'
                    ? 'text-spark-heading-primary dark:text-spark-heading-accent border-b-2 border-[#336443] dark:border-spark-heading-accent'
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                }`}
              >
                Log In
              </button>
              <button
                id="signup_tab_btn"
                onClick={() => setAuthTab('signup')}
                className={`flex-1 pb-4 text-base font-bold transition-colors ${
                  authTab === 'signup'
                    ? 'text-spark-heading-primary dark:text-spark-heading-accent border-b-2 border-[#336443] dark:border-spark-heading-accent'
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Modal Body */}
            {authTab === 'login' ? (
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <h4 className="text-xl font-extrabold text-spark-dark-green dark:text-white">Welcome back</h4>
                  <p className="text-xs text-spark-text-green dark:text-slate-400 mt-1">Access your saved storyboards and drafts.</p>
                </div>

                <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleAuthComplete(); }}>
                  {/* Email Input */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block pl-1">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="email"
                        placeholder="name@domain.com"
                        className="w-full h-12 pl-11 pr-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-[#336443] dark:focus:border-spark-heading-accent transition-colors"
                        required
                      />
                    </div>
                  </div>

                  {/* Password Input */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block pl-1">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="password"
                        placeholder="••••••••"
                        className="w-full h-12 pl-11 pr-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-[#336443] dark:focus:border-spark-heading-accent transition-colors"
                        required
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full h-12 bg-spark-dark-green hover:bg-spark-button-hover dark:bg-[#336443] dark:hover:bg-[#2a5237] text-white font-bold rounded-xl text-sm transition-colors shadow-md mt-6"
                  >
                    Log In
                  </button>
                </form>

                {/* Google Button */}
                <div className="relative my-6 flex items-center justify-center">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100 dark:border-slate-800" /></div>
                  <span className="relative bg-white dark:bg-[#161b2e] px-3 text-[10px] uppercase font-bold text-slate-400 tracking-widest">or</span>
                </div>

                <button
                  type="button"
                  onClick={handleAuthComplete}
                  className="w-full h-12 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900 flex items-center justify-center text-sm font-semibold transition-colors"
                >
                  {googleIcon}
                  Sign in with Google
                </button>

                {/* Toggle tab trigger */}
                <div className="text-center mt-6">
                  <button
                    onClick={() => setAuthTab('signup')}
                    className="text-xs text-spark-heading-primary dark:text-spark-heading-accent font-semibold hover:underline"
                  >
                    New to Story Spark AI? Create Account
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <h4 className="text-xl font-extrabold text-spark-dark-green dark:text-white">Create Account</h4>
                  <p className="text-xs text-spark-text-green dark:text-slate-400 mt-1">Begin writing interactive collaborative story sagas.</p>
                </div>

                <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); handleAuthComplete(); }}>
                  {/* Name Input */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block pl-1">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="John Doe"
                        className="w-full h-12 pl-11 pr-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-[#336443] dark:focus:border-spark-heading-accent transition-colors"
                        required
                      />
                    </div>
                  </div>

                  {/* Email Input */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block pl-1">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="email"
                        placeholder="name@domain.com"
                        className="w-full h-12 pl-11 pr-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-[#336443] dark:focus:border-spark-heading-accent transition-colors"
                        required
                      />
                    </div>
                  </div>

                  {/* Password Input */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block pl-1">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="password"
                        placeholder="Min. 8 characters"
                        className="w-full h-12 pl-11 pr-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-[#336443] dark:focus:border-spark-heading-accent transition-colors"
                        required
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full h-12 bg-spark-dark-green hover:bg-spark-button-hover dark:bg-[#336443] dark:hover:bg-[#2a5237] text-white font-bold rounded-xl text-sm transition-colors shadow-md mt-6"
                  >
                    Register
                  </button>
                </form>

                {/* Google Button */}
                <div className="relative my-6 flex items-center justify-center">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100 dark:border-slate-800" /></div>
                  <span className="relative bg-white dark:bg-[#161b2e] px-3 text-[10px] uppercase font-bold text-slate-400 tracking-widest">or</span>
                </div>

                <button
                  type="button"
                  onClick={handleAuthComplete}
                  className="w-full h-12 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900 flex items-center justify-center text-sm font-semibold transition-colors"
                >
                  {googleIcon}
                  Sign up with Google
                </button>

                {/* Toggle tab trigger */}
                <div className="text-center mt-6">
                  <button
                    id="registration_toggle_tab"
                    onClick={() => setAuthTab('login')}
                    className="text-xs text-spark-heading-primary dark:text-spark-heading-accent font-semibold hover:underline"
                  >
                    Already have an account? Log In
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
