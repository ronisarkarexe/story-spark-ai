/* ═══════════════════════════════════════════════
   STORY SPARK AI AUTHENTICATION SCRIPT ACTIONS
   File: auth.js
   ═══════════════════════════════════════════════ */

let currentMode = 'signin';

// ── Google Identity Services (GIS) Client ID ──
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

let isSubmitting = false;

/* ── DOM Init & Global Handler Registrations ── */
document.addEventListener('DOMContentLoaded', () => {
    // 1. Detect initial auth page mode based on filename
    const isSignupPage = window.location.pathname.includes('signup.html');
    currentMode = isSignupPage ? 'signup' : 'signin';

    // 2. Initialize dynamic Google Sign-In text if present
    const googleBtnText = document.getElementById('google-btn-text');
    if (googleBtnText) {
        googleBtnText.innerText = currentMode === 'signup' ? 'sign in with Google' : 'Sign in with Google';
    }

    // 3. Initialize Particle Canvas System
    initParticleSystem();

    // 4. Form Submit Listener
    const authForm = document.getElementById('auth-form');
    if (authForm) {
        authForm.addEventListener('submit', handleFormSubmit);
    }

    // 4b. Input enhancements (inline validation + strength meter)
    initInlineValidation();

    // 5. Initialize Google Identity Services
    setTimeout(initGoogleAuth, 500);
});

function initInlineValidation() {
    const nameField = document.getElementById('name-field');
    const emailField = document.getElementById('email-field');
    const passwordField = document.getElementById('password-field');
    const confirmPasswordField = document.getElementById('confirm-password-field');

    if (nameField) {
        nameField.addEventListener('blur', () => validateName(true));
        nameField.addEventListener('input', () => {
            if (nameField.getAttribute('aria-invalid') === 'true') validateName(true);
        });
    }

    if (emailField) {
        emailField.addEventListener('blur', () => validateEmail(true));
        emailField.addEventListener('input', () => {
            if (emailField.getAttribute('aria-invalid') === 'true') validateEmail(true);
        });
    }

    if (passwordField) {
        passwordField.addEventListener('blur', () => validatePassword(true));
        passwordField.addEventListener('input', () => {
            updatePasswordStrengthUI(passwordField.value || '');
            if (passwordField.getAttribute('aria-invalid') === 'true') validatePassword(true);
            if (confirmPasswordField && confirmPasswordField.value) {
                validateConfirmPassword(false);
            }
        });
        updatePasswordStrengthUI(passwordField.value || '');
    }

    if (confirmPasswordField) {
        confirmPasswordField.addEventListener('blur', () => validateConfirmPassword(true));
        confirmPasswordField.addEventListener('input', () => {
            validateConfirmPassword(false);
        });
    }
}

function setAlert(variant, message) {
    const alertEl = document.getElementById('form-alert');
    if (!alertEl) return;

    if (!message) {
        alertEl.classList.add('hidden');
        alertEl.removeAttribute('data-variant');
        alertEl.textContent = '';
        return;
    }

    const iconClass = variant === 'success' ? 'fi fi-rr-check-circle text-green-400' : variant === 'error' ? 'fi fi-rr-cross-circle text-rose-400' : 'fi fi-rr-info text-blue-400';
    alertEl.setAttribute('data-variant', variant);
    alertEl.innerHTML = `
        <i class="${iconClass} text-[15px]" style="margin-top: 2px;"></i>
        <div class="text-[13px] leading-relaxed">${message}</div>
    `;
    alertEl.classList.remove('hidden');
}

function setFieldError(fieldId, errorId, message) {
    const field = document.getElementById(fieldId);
    const errorEl = document.getElementById(errorId);
    if (field) field.setAttribute('aria-invalid', message ? 'true' : 'false');
    if (!errorEl) return;

    if (!message) {
        errorEl.textContent = '';
        errorEl.classList.remove('is-visible');
        return;
    }
    errorEl.textContent = message;
    errorEl.classList.add('is-visible');
}

function validateName(showInline) {
    const nameField = document.getElementById('name-field');
    if (!nameField || currentMode !== 'signup') return true;

    const value = (nameField.value || '').trim();
    let message = '';
    if (!value) message = 'Please enter your name.';
    else if (value.length < 2) message = 'Name must be at least 2 characters.';

    if (showInline) setFieldError('name-field', 'name-error', message);
    return !message;
}

function validateEmail(showInline) {
    const emailField = document.getElementById('email-field');
    if (!emailField) return true;

    const value = (emailField.value || '').trim();
    let message = '';
    if (!value) message = 'Please enter your email address.';
    else if (!emailField.checkValidity()) message = 'Enter a valid email address (e.g., name@example.com).';

    if (showInline) setFieldError('email-field', 'email-error', message);
    return !message;
}

function getPasswordScore(password) {
    const value = password || '';
    let score = 0;
    if (value.length >= 8) score++;
    if (/[a-z]/.test(value) && /[A-Z]/.test(value)) score++;
    if (/\d/.test(value)) score++;
    if (/[^A-Za-z0-9]/.test(value)) score++;
    return Math.min(score, 4);
}

function updatePasswordStrengthUI(password) {
    const bar = document.getElementById('password-meter-bar');
    const strength = document.getElementById('password-strength');
    if (!bar && !strength) return;

    const score = getPasswordScore(password);
    const pct = Math.round((score / 4) * 100);
    if (bar) bar.style.width = `${pct}%`;

    if (strength) {
        if (!password) {
            strength.textContent = '';
        } else if (score <= 1) {
            strength.textContent = 'Strength: weak';
        } else if (score === 2) {
            strength.textContent = 'Strength: fair';
        } else if (score === 3) {
            strength.textContent = 'Strength: good';
        } else {
            strength.textContent = 'Strength: strong';
        }
    }
}

function validatePassword(showInline) {
    const passwordField = document.getElementById('password-field');
    if (!passwordField) return true;

    const value = passwordField.value || '';
    let message = '';
    if (!value) message = 'Please enter your password.';
    else if (value.length < 8) message = 'Password must be at least 8 characters.';
    else if (!/[A-Za-z]/.test(value) || !/\d/.test(value)) message = 'Use a mix of letters and numbers.';

    if (showInline) setFieldError('password-field', 'password-error', message);
    return !message;
}

function validateConfirmPassword(showInline) {
    const passwordField = document.getElementById('password-field');
    const confirmPasswordField = document.getElementById('confirm-password-field');
    if (!confirmPasswordField || currentMode !== 'signup') return true;

    const password = (passwordField && passwordField.value) || '';
    const confirmPassword = confirmPasswordField.value || '';
    const feedbackEl = document.getElementById('confirm-password-feedback');
    let message = '';
    let isMatch = false;

    if (!confirmPassword) {
        message = '';
    } else if (password !== confirmPassword) {
        message = 'Passwords do not match';
    } else {
        message = 'Passwords match';
        isMatch = true;
    }

    if (feedbackEl) {
        if (!message) {
            feedbackEl.classList.remove('is-visible', 'match', 'mismatch');
            feedbackEl.textContent = '';
        } else {
            feedbackEl.classList.add('is-visible');
            feedbackEl.textContent = message;
            feedbackEl.classList.remove('match', 'mismatch');
            feedbackEl.classList.add(isMatch ? 'match' : 'mismatch');
        }
    }

    if (showInline) {
        setFieldError('confirm-password-field', 'confirm-password-error', isMatch ? '' : message);
    }

    return isMatch || !confirmPassword;
}

function setSubmitting(submitting) {
    isSubmitting = submitting;
    const submitBtn = document.getElementById('submit-btn');
    const spinner = document.getElementById('submit-btn-spinner');
    const emailField = document.getElementById('email-field');
    const nameField = document.getElementById('name-field');
    const passwordField = document.getElementById('password-field');
    const confirmPasswordField = document.getElementById('confirm-password-field');

    if (submitBtn) submitBtn.disabled = submitting;
    if (spinner) spinner.classList.toggle('hidden', !submitting);
    if (emailField) emailField.disabled = submitting;
    if (nameField) nameField.disabled = submitting;
    if (passwordField) passwordField.disabled = submitting;
    if (confirmPasswordField) confirmPasswordField.disabled = submitting;
}

/* ── Advanced Particle System (Canvas + Mouse Interactions) ── */
function initParticleSystem() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const section = canvas.parentElement;
    const PARTICLE_COUNT = 120;
    const MOUSE_RADIUS = 140;
    const REPEL_STRENGTH = 0.06;
    const COLORS = [
        'rgba(208,188,255,', // primary / lavender
        'rgba(251,171,255,', // secondary / magenta
        'rgba(160,120,255,', // electric purple
        'rgba(100,220,255,', // cyan
        'rgba(236,106,6,'   // tertiary / orange spark
    ];
    let mouse = { x: -9999, y: -9999 };
    let particles = [];

    function resize() {
        if (!section) return;
        canvas.width = section.offsetWidth;
        canvas.height = section.offsetHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    section.addEventListener('mousemove', e => {
        const rect = section.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });
    
    section.addEventListener('mouseleave', () => {
        mouse.x = -9999;
        mouse.y = -9999;
    });

    class Particle {
        constructor() { this.reset(true); }
        reset(init) {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 1.5 + 0.5;
            this.baseAlpha = Math.random() * 0.45 + 0.15;
            this.alpha = this.baseAlpha;
            this.vx = (Math.random() - 0.5) * 0.4;
            this.vy = (Math.random() - 0.5) * 0.4;
            this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
            this.pulseSpeed = Math.random() * 0.02 + 0.008;
            this.pulsePhase = Math.random() * Math.PI * 2;
        }
        update(t) {
            this.x += this.vx;
            this.y += this.vy;
            this.alpha = this.baseAlpha + Math.sin(t * this.pulseSpeed + this.pulsePhase) * 0.2;
            
            const dx = this.x - mouse.x;
            const dy = this.y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < MOUSE_RADIUS && dist > 0) {
                const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS * REPEL_STRENGTH;
                this.vx += (dx / dist) * force * 3;
                this.vy += (dy / dist) * force * 3;
                this.alpha = Math.min(1, this.alpha + 0.3);
                this.size = Math.min(this.size + 0.2, 3.0);
            } else {
                this.size += (Math.random() * 1.5 + 0.5 - this.size) * 0.02;
            }
            this.vx *= 0.985;
            this.vy *= 0.985;

            if (this.x < -10) this.x = canvas.width + 10;
            if (this.x > canvas.width + 10) this.x = -10;
            if (this.y < -10) this.y = canvas.height + 10;
            if (this.y > canvas.height + 10) this.y = -10;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color + this.alpha + ')';
            ctx.shadowColor = this.color + '0.6)';
            ctx.shadowBlur = this.size * 4;
            ctx.fill();
            ctx.shadowBlur = 0;
        }
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

    let frame = 0;
    function animate() {
        frame++;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(frame); p.draw(); });
        requestAnimationFrame(animate);
    }
    animate();
}

/* ── Auth State & Tab Toggling (Smooth in-page transitions) ── */
function toggleAuthMode(mode) {
    if (currentMode === mode) return;
    currentMode = mode;

    const form = document.getElementById('auth-form');
    if (!form) return;

    form.classList.add('form-transitioning');

    setTimeout(() => {
        const signupFields = document.getElementById('signup-fields');
        const nameField = document.getElementById('name-field');
        const submitBtn = document.getElementById('submit-btn');
        const submitBtnText = document.getElementById('submit-btn-text');
        const tabSignin = document.getElementById('tab-signin');
        const tabSignup = document.getElementById('tab-signup');
        const forgotPass = document.getElementById('forgot-password-link') || document.querySelector('a[href="#"]');
        const navToggle = document.getElementById('nav-toggle');
        const googleBtnText = document.getElementById('google-btn-text');

        if (mode === 'signup') {
            if (signupFields) signupFields.classList.remove('hidden');
            if (nameField) nameField.required = true;
            if (forgotPass) forgotPass.classList.add('invisible');
            if (submitBtnText) submitBtnText.innerText = 'Create Account';
            else if (submitBtn) submitBtn.innerText = 'Create Account';
            if (googleBtnText) googleBtnText.innerText = 'sign in with Google';
            
            // Tabs styling
            if (tabSignup) tabSignup.className = "flex-1 pb-3 font-label-caps text-label-caps text-primary border-b-2 border-primary transition-all duration-300";
            if (tabSignin) tabSignin.className = "flex-1 pb-3 font-label-caps text-label-caps text-on-surface-variant border-b-2 border-transparent hover:text-on-surface transition-all duration-300";
            
            // Bottom link toggle content
            if (navToggle) {
                navToggle.innerHTML = `Already have an account? <a class="text-primary hover:text-secondary transition-colors font-semibold" href="login.html">Log In</a>`;
            }
            
            // Push address bar quietly without reload
            window.history.replaceState(null, '', 'signup.html');
        } else {
            if (signupFields) signupFields.classList.add('hidden');
            if (nameField) nameField.required = false;
            if (forgotPass) forgotPass.classList.remove('invisible');
            if (submitBtnText) submitBtnText.innerText = 'Log In to Story Spark';
            else if (submitBtn) submitBtn.innerText = 'Log In to Story Spark';
            if (googleBtnText) googleBtnText.innerText = 'Sign in with Google';
            
            // Tabs styling
            if (tabSignin) tabSignin.className = "flex-1 pb-3 font-label-caps text-label-caps text-primary border-b-2 border-primary transition-all duration-300";
            if (tabSignup) tabSignup.className = "flex-1 pb-3 font-label-caps text-label-caps text-on-surface-variant border-b-2 border-transparent hover:text-on-surface transition-all duration-300";
            
            // Bottom link toggle content
            if (navToggle) {
                navToggle.innerHTML = `Don't have an account? <a class="text-primary hover:text-secondary transition-colors font-semibold" href="signup.html">Sign Up</a>`;
            }
            
            // Push address bar quietly without reload
            window.history.replaceState(null, '', 'login.html');
        }

        setAlert('', '');
        setFieldError('name-field', 'name-error', '');
        setFieldError('email-field', 'email-error', '');
        setFieldError('password-field', 'password-error', '');
        setFieldError('confirm-password-field', 'confirm-password-error', '');
        const feedbackEl = document.getElementById('confirm-password-feedback');
        if (feedbackEl) {
            feedbackEl.classList.remove('is-visible', 'match', 'mismatch');
            feedbackEl.textContent = '';
        }
        setSubmitting(false);

        form.classList.remove('form-transitioning');
    }, 380);
}

/* ── Legal Modals Data & Triggers ── */
const LEGAL_CONTENT = {
    terms: {
        title: 'Terms of Service',
        text: `
            <p class="mb-3">Welcome to Story Spark AI. By accessing or using our platform, you agree to comply with and be bound by these Terms of Service.</p>
            <p class="mb-3"><strong>1. Use of Services:</strong> You must be at least 13 years old to use this platform. You agree to use the services only for lawful purposes and in accordance with these Terms.</p>
            <p class="mb-3"><strong>2. User Accounts:</strong> You are responsible for safeguarding the credentials you use to access Story Spark AI and for any activities or actions under your account.</p>
            <p class="mb-3"><strong>3. Content Generation:</strong> Story Spark AI generates stories and content using advanced AI algorithms. We do not guarantee the completeness, accuracy, or suitability of generated stories for any specific purpose.</p>
            <p><strong>4. Intellectual Property:</strong> All software, branding, technology, and designs related to Story Spark AI remain the exclusive intellectual property of Story Spark AI.</p>
        `
    },
    privacy: {
        title: 'Privacy Policy',
        text: `
            <p class="mb-3">At Story Spark AI, we value your privacy. This Privacy Policy details how we collect, use, and protect your personal information.</p>
            <p class="mb-3"><strong>1. Data Collection:</strong> We collect details you share directly with us, such as email addresses, account details, and generation prompts when creating stories.</p>
            <p class="mb-3"><strong>2. Data Usage:</strong> We utilize your information to support account authorization, secure login, personalize recommendations, and refine our AI generation systems.</p>
            <p class="mb-3"><strong>3. Cookies:</strong> Cookies are used to safely retain your login session token and custom styling preferences.</p>
            <p><strong>4. Security:</strong> We enforce high-grade security protocols to protect your personal details. We do not sell or lease user information to third-party advertisers.</p>
        `
    }
};

function openLegalModal(type) {
    const modal = document.getElementById('legal-modal');
    const title = document.getElementById('legal-modal-title');
    const text = document.getElementById('legal-modal-text');
    
    if (modal && title && text && LEGAL_CONTENT[type]) {
        title.innerText = LEGAL_CONTENT[type].title;
        text.innerHTML = LEGAL_CONTENT[type].text;
        modal.classList.add('show');
    }
}

function closeLegalModal() {
    const modal = document.getElementById('legal-modal');
    if (modal) modal.classList.remove('show');
}

/* ── Password Visibility Toggling ── */
function togglePasswordVisibility() {
    const field = document.getElementById('password-field');
    const icon = document.getElementById('eye-icon');
    if (!field || !icon) return;

    if (field.type === 'password') {
        field.type = 'text';
        icon.className = 'fi fi-rr-eye text-[16px]';
    } else {
        field.type = 'password';
        icon.className = 'fi fi-rr-eye-crossed text-[16px]';
    }
}

function toggleConfirmPasswordVisibility() {
    const field = document.getElementById('confirm-password-field');
    const icon = document.getElementById('confirm-eye-icon');
    if (!field || !icon) return;

    if (field.type === 'password') {
        field.type = 'text';
        icon.className = 'fi fi-rr-eye text-[16px]';
    } else {
        field.type = 'password';
        icon.className = 'fi fi-rr-eye-crossed text-[16px]';
    }
}

/* ── Form Submission handling ── */
function handleFormSubmit(e) {
    e.preventDefault();
    if (isSubmitting) return;

    const emailField = document.getElementById('email-field');
    const nameField = document.getElementById('name-field');
    const passwordField = document.getElementById('password-field');
    const confirmPasswordField = document.getElementById('confirm-password-field');
    if (!emailField) return;

    setAlert('', '');

    const okName = validateName(true);
    const okEmail = validateEmail(true);
    const okPassword = validatePassword(true);
    const okConfirmPassword = currentMode === 'signup' ? validateConfirmPassword(true) : true;

    const isValid = currentMode === 'signup' ? (okName && okEmail && okPassword && okConfirmPassword) : (okEmail && okPassword);
    if (!isValid) {
        setAlert('error', 'Please fix the highlighted fields and try again.');
        const firstInvalid =
            document.querySelector('[aria-invalid="true"]') ||
            document.querySelector('#auth-form input:invalid');
        if (firstInvalid && typeof firstInvalid.focus === 'function') firstInvalid.focus();
        return;
    }

    const email = (emailField.value || '').trim();
    const name = (nameField && nameField.value ? nameField.value.trim() : '');

    setSubmitting(true);
    setAlert('info', currentMode === 'signup' ? 'Creating your account…' : 'Signing you in…');

    window.setTimeout(() => {
        setSubmitting(false);
        if (currentMode === 'signin') {
            setAlert('success', `Signed in as <span class="font-semibold">${escapeHtml(email)}</span>.`);
        } else {
            const greeting = name ? `Welcome, <span class="font-semibold">${escapeHtml(name)}</span>!` : 'Welcome!';
            setAlert('success', `${greeting} Your account is ready. Redirecting to sign in…`);
            window.setTimeout(() => toggleAuthMode('signin'), 900);
        }
    }, 900);
}

function escapeHtml(text) {
    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

/* ── Google Identity Services (GIS) Sign-In Flows ── */
function initGoogleAuth() {
    if (typeof google === 'undefined' || !google.accounts) {
        console.warn('Google Identity Services library is not loaded yet.');
        return;
    }

    google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: true,
    });
}

function decodeJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        return JSON.parse(atob(base64));
    } catch (e) {
        return null;
    }
}

async function handleGoogleCredentialResponse(response) {
    try {
        const res = await fetch('/api/auth/google-login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: response.credential }),
        });

        const data = await res.json();

        if (!res.ok) {
            setAlert('error', data.message || 'Google login failed. Please try again.');
            return;
        }

        localStorage.setItem('accessToken', data.data.accessToken);
        setAlert('success', 'Signed in with Google successfully! Redirecting…');
        setTimeout(() => {
            window.location.href = '/dashboard';
        }, 1000);

    } catch (err) {
        setAlert('error', 'Something went wrong with Google Sign-In. Please try again.');
    }
}

function handleGoogleSignIn() {
    if (GOOGLE_CLIENT_ID === 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com') {
        alert(
            'Google Sign-In requires a Client ID.\n\n' +
            'To set it up:\n' +
            '1. Go to https://console.cloud.google.com/apis/credentials\n' +
            '2. Create an OAuth 2.0 Client ID (Web application)\n' +
            '3. Add http://localhost:8000 to Authorized JavaScript origins\n' +
            '4. Copy the Client ID and replace YOUR_GOOGLE_CLIENT_ID in the HTML file'
        );
        return;
    }

    if (typeof google === 'undefined' || !google.accounts) {
        alert('Google Sign-In library is still loading. Please try again in a moment.');
        return;
    }

    google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            const container = document.createElement('div');
            container.style.position = 'fixed';
            container.style.top = '50%';
            container.style.left = '50%';
            container.style.transform = 'translate(-50%, -50%)';
            container.style.zIndex = '9999';
            container.style.background = 'rgba(0,0,0,0.85)';
            container.style.padding = '32px';
            container.style.borderRadius = '16px';
            container.style.border = '1px solid rgba(255,255,255,0.1)';
            container.id = 'google-popup-fallback';
            document.body.appendChild(container);

            google.accounts.id.renderButton(container, {
                theme: 'filled_black',
                size: 'large',
                width: 300,
                text: 'signin_with',
            });
        }
    });
}
