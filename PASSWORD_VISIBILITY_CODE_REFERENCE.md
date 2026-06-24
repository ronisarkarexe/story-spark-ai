# Password Visibility Toggle - Complete Code Reference

## Table of Contents
1. [React Component](#react-component)
2. [HTML Implementation](#html-implementation)
3. [JavaScript Functions](#javascript-functions)
4. [CSS/Tailwind Classes](#css-tailwind-classes)

---

## React Component

### File: `frontend/src/components/ui-component/ss-input/ss-input.tsx`

```tsx
import { useState, useRef } from "react";
import {
  UseFormRegister,
  FieldValues,
  Path,
  RegisterOptions,
  FieldError,
} from "react-hook-form";

interface SSInputProps<T extends FieldValues> {
  label: string;
  name: Path<T>;
  type?: string;
  placeholder?: string;
  required?: boolean;
  icon?: string;
  register: UseFormRegister<T>;
  validation?: RegisterOptions<T>;
  error?: FieldError;
  autoComplete?: string;
  autoFocus?: boolean;
}

const SSInput = <T extends FieldValues>({
  label,
  name,
  type = "text",
  placeholder,
  required,
  icon,
  register,
  validation,
  error,
  autoComplete,
  autoFocus
}: SSInputProps<T>) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipTimeoutRef = useRef<NodeJS.Timeout>();

  const inputType =
    type === "password" ? (showPassword ? "text" : "password") : type;

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handlePasswordToggleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    // Allow Space and Enter keys to activate the button
    if (e.code === "Space" || e.code === "Enter") {
      e.preventDefault();
      togglePasswordVisibility();
    }
  };

  const handleMouseEnter = () => {
    tooltipTimeoutRef.current = setTimeout(() => {
      setShowTooltip(true);
    }, 300); // Show tooltip after 300ms
  };

  const handleMouseLeave = () => {
    if (tooltipTimeoutRef.current) {
      clearTimeout(tooltipTimeoutRef.current);
    }
    setShowTooltip(false);
  };

  return (
    <div className="w-full max-w-full flex flex-col box-border">
      <label 
        htmlFor={name} 
        className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2 text-left"
      >
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      
      <div className="relative w-full max-w-full flex items-center box-border">
        {icon && (
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 dark:text-gray-400">
            <i className={icon}></i>
          </span>
        )}

        <input
          type={inputType}
          id={name}
          className={`block w-full max-w-full box-border pl-8 ${
            type === "password" ? "pr-12" : "pr-3"
          } py-1.5 text-base text-gray-900 dark:text-gray-200 bg-white dark:bg-slate-800 border rounded-md sm:text-sm transition-colors ${
            error
              ? "border-red-500 focus:outline-red-500"
              : "border-gray-300 dark:border-gray-600 focus:outline-indigo-600 dark:focus:outline-indigo-400"
          }`}
          placeholder={placeholder}
          autoComplete={autoComplete}
          {...register(name, validation)}
        />

        {type === "password" && (
          <div className="absolute inset-y-0 right-2 flex items-center">
            {/* Tooltip */}
            {showTooltip && (
              <div 
                className="absolute bottom-full right-0 mb-2 px-3 py-1.5 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs font-medium rounded shadow-lg whitespace-nowrap z-50 pointer-events-none"
                role="tooltip"
              >
                {showPassword ? "Hide password (Space/Enter)" : "Show password (Space/Enter)"}
                <div className="absolute top-full right-2 -mt-1 border-4 border-transparent border-t-gray-900 dark:border-t-gray-100"></div>
              </div>
            )}

            {/* Password Visibility Toggle Button */}
            <button
              type="button"
              onClick={togglePasswordVisibility}
              onKeyDown={handlePasswordToggleKeyDown}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onFocus={handleMouseEnter}
              onBlur={handleMouseLeave}
              className="p-2 rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:ring-offset-2 dark:focus:ring-offset-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700"
              aria-label={showPassword ? `Hide ${name} password. Press Space or Enter to toggle.` : `Show ${name} password. Press Space or Enter to toggle.`}
              aria-pressed={showPassword}
              title={showPassword ? "Hide password (Space/Enter)" : "Show password (Space/Enter)"}
            >
              <i 
                className={`text-lg transition-colors ${
                  showPassword 
                    ? "fi fi-rr-eye text-indigo-600 dark:text-indigo-400" 
                    : "fi fi-rr-eye-crossed text-gray-600 dark:text-gray-300"
                }`}
                aria-hidden="true"
              ></i>
            </button>
          </div>
        )}
      </div>

      {error && (
        <p className="text-xs font-medium text-rose-500 mt-1.5 text-left w-full break-words overflow-hidden">
          {error.message}
        </p>
      )}
    </div>
  );
};

export default SSInput;
```

---

## HTML Implementation

### Login Form: `login.html`

```html
<div>
    <div class="flex justify-between mb-1.5">
        <label class="field-label" for="password-field">Password</label>
        <a class="text-[12px] text-primary hover:text-secondary transition-colors font-semibold cursor-pointer" id="forgot-password-link" href="/forgot-password">Forgot Password?</a>
    </div>
    <div class="input-icon-wrapper">
        <i class="fi fi-rr-lock input-icon text-[16px] absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/80"></i>
        <input class="auth-field w-full bg-surface-container-high border border-white/10 text-on-surface placeholder:text-outline focus:border-primary transition-all pl-11 pr-11" id="password-field" placeholder="••••••••"  required autocomplete="current-password"/>
        <button 
          class="password-toggle-btn absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-indigo-400 transition-colors duration-200 p-1.5 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-indigo-400 focus:ring-offset-2 dark:focus:ring-offset-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700" 
          onclick="togglePasswordVisibility(event)" 
          type="button" 
          aria-label="Show password. Press Space or Enter to toggle."
          aria-pressed="false"
          title="Show password (Space/Enter)">
            <i class="fi fi-rr-eye-crossed text-[16px]" id="eye-icon" aria-hidden="true"></i>
            <div class="password-tooltip hidden absolute bottom-full right-0 mb-2 px-3 py-1.5 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs font-medium rounded shadow-lg whitespace-nowrap z-50 pointer-events-none" role="tooltip">
              <span id="tooltip-text">Show password (Space/Enter)</span>
              <div class="absolute top-full right-2 -mt-1 border-4 border-transparent border-t-gray-900 dark:border-t-gray-100"></div>
            </div>
        </button>
    </div>
    <span class="field-error-msg" id="password-error">Password must be at least 8 characters.</span>
    <p 
       id="login-caps-lock-warning" 
      class="hidden text-yellow-400 text-sm mt-2"
     >
      Caps Lock is ON
     </p>
</div>
```

### Signup Form: `signup.html` (Password Field)

```html
<div class="ds-field">
    <label class="block text-label-caps text-on-surface-variant mb-2" for="password-field">PASSWORD</label>
    <div class="ds-input-group has-action">
        <i class="fi fi-rr-lock ds-input-icon text-[16px] absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/80"></i>
        <input class="auth-field w-full ds-input with-icon pl-11 pr-11" id="password-field" name="password" autocomplete="new-password" placeholder="At least 8 characters" type="password" required aria-describedby="password-help password-error password-strength" aria-invalid="false"/>
        <button 
          class="password-toggle-btn ds-input-action flex items-center justify-center text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-indigo-400 transition-colors duration-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-indigo-400 focus:ring-offset-2 dark:focus:ring-offset-slate-800" 
          onclick="togglePasswordVisibility(event)" 
          type="button" 
          aria-label="Show password. Press Space or Enter to toggle."
          aria-pressed="false"
          title="Show password (Space/Enter)">
            <i class="fi fi-rr-eye-crossed text-[16px]" id="eye-icon" aria-hidden="true"></i>
            <div class="password-tooltip hidden absolute bottom-full right-0 mb-2 px-3 py-1.5 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs font-medium rounded shadow-lg whitespace-nowrap z-50 pointer-events-none" role="tooltip">
              <span id="tooltip-text">Show password (Space/Enter)</span>
              <div class="absolute top-full right-2 -mt-1 border-4 border-transparent border-t-gray-900 dark:border-t-gray-100"></div>
            </div>
        </button>
    </div>
    <div class="ds-meter" aria-hidden="true"><div class="ds-meter-bar" id="password-meter-bar"></div></div>
    <p class="ds-help" id="password-help">Use 8+ characters with a mix of letters and numbers.</p>
    <p class="ds-help" id="password-strength"></p>
    <p class="ds-error" id="password-error" role="alert" aria-live="polite"></p>
    <p 
     id="signup-caps-lock-warning" 
     class="hidden text-yellow-400 text-sm mt-2"
     >
     Caps Lock is ON
    </p>
</div>
```

### Signup Form: `signup.html` (Confirm Password Field)

```html
<div class="ds-field">
    <label class="block text-label-caps text-on-surface-variant mb-2" for="confirm-password-field">CONFIRM PASSWORD</label>
    <div class="ds-input-group has-action">
        <i class="fi fi-rr-lock ds-input-icon text-[16px] absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/80"></i>
        <input class="w-full ds-input with-icon pl-11 pr-11" id="confirm-password-field" name="confirmPassword" autocomplete="new-password" placeholder="Re-enter your password" type="password" required aria-describedby="confirm-password-help confirm-password-error confirm-password-feedback" aria-invalid="false"/>
        <button 
          class="password-toggle-btn ds-input-action flex items-center justify-center text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-indigo-400 transition-colors duration-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-indigo-400 focus:ring-offset-2 dark:focus:ring-offset-slate-800" 
          onclick="toggleConfirmPasswordVisibility(event)" 
          type="button" 
          aria-label="Show confirm password. Press Space or Enter to toggle."
          aria-pressed="false"
          title="Show confirm password (Space/Enter)">
            <i class="fi fi-rr-eye-crossed text-[16px]" id="confirm-eye-icon" aria-hidden="true"></i>
            <div class="password-tooltip hidden absolute bottom-full right-0 mb-2 px-3 py-1.5 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs font-medium rounded shadow-lg whitespace-nowrap z-50 pointer-events-none" role="tooltip">
              <span id="confirm-tooltip-text">Show password (Space/Enter)</span>
              <div class="absolute top-full right-2 -mt-1 border-4 border-transparent border-t-gray-900 dark:border-t-gray-100"></div>
            </div>
        </button>
    </div>
    <p class="ds-help" id="confirm-password-help">Passwords must match to create your account.</p>
    <p class="ds-feedback password-match-feedback" id="confirm-password-feedback" role="status" aria-live="polite"></p>
    <p class="ds-error" id="confirm-password-error" role="alert" aria-live="polite"></p>
    <p
        id="confirm-caps-lock-warning"
        class="hidden text-yellow-400 text-sm mt-2">
        Caps Lock is ON
    </p>
</div>
```

---

## JavaScript Functions

### File: `auth.js` (Enhanced Toggle Functions)

```javascript
/* ── Password Visibility Toggling with Enhanced Accessibility ── */

/**
 * Enhanced password visibility toggle with:
 * - Keyboard support (Space/Enter)
 * - Tooltip display on hover/focus
 * - Better icon contrast for light/dark themes
 * - ARIA attributes for screen readers
 */
function togglePasswordVisibility(event) {
    event?.preventDefault?.();
    
    const field = document.getElementById('password-field');
    const button = event?.currentTarget || document.querySelector('[onclick*="togglePasswordVisibility"]');
    const icon = document.getElementById('eye-icon');
    const tooltip = button?.querySelector('.password-tooltip');
    const tooltipText = button?.querySelector('#tooltip-text');
    
    if (!field || !icon || !button) return;

    const isVisible = field.type === 'text';
    
    // Toggle field type
    field.type = isVisible ? 'password' : 'text';
    
    // Update icon with better contrast
    if (isVisible) {
        // Password hidden
        icon.className = 'fi fi-rr-eye-crossed text-[16px]';
        button.setAttribute('aria-label', 'Show password. Press Space or Enter to toggle.');
        button.setAttribute('aria-pressed', 'false');
        button.setAttribute('title', 'Show password (Space/Enter)');
        if (tooltipText) tooltipText.textContent = 'Show password (Space/Enter)';
    } else {
        // Password visible
        icon.className = 'fi fi-rr-eye text-[16px]';
        button.setAttribute('aria-label', 'Hide password. Press Space or Enter to toggle.');
        button.setAttribute('aria-pressed', 'true');
        button.setAttribute('title', 'Hide password (Space/Enter)');
        if (tooltipText) tooltipText.textContent = 'Hide password (Space/Enter)';
    }
    
    // Show tooltip briefly on toggle
    if (tooltip) {
        tooltip.classList.remove('hidden');
        setTimeout(() => {
            if (tooltip && !button.matches(':focus')) {
                tooltip.classList.add('hidden');
            }
        }, 1500);
    }
}

function toggleConfirmPasswordVisibility(event) {
    event?.preventDefault?.();
    
    const field = document.getElementById('confirm-password-field');
    const button = event?.currentTarget || document.querySelector('[onclick*="toggleConfirmPasswordVisibility"]');
    const icon = document.getElementById('confirm-eye-icon');
    const tooltip = button?.querySelector('.password-tooltip');
    const tooltipText = button?.querySelector('#confirm-tooltip-text');
    
    if (!field || !icon || !button) return;

    const isVisible = field.type === 'text';
    
    // Toggle field type
    field.type = isVisible ? 'password' : 'text';
    
    // Update icon with better contrast
    if (isVisible) {
        // Password hidden
        icon.className = 'fi fi-rr-eye-crossed text-[16px]';
        button.setAttribute('aria-label', 'Show confirm password. Press Space or Enter to toggle.');
        button.setAttribute('aria-pressed', 'false');
        button.setAttribute('title', 'Show password (Space/Enter)');
        if (tooltipText) tooltipText.textContent = 'Show password (Space/Enter)';
    } else {
        // Password visible
        icon.className = 'fi fi-rr-eye text-[16px]';
        button.setAttribute('aria-label', 'Hide confirm password. Press Space or Enter to toggle.');
        button.setAttribute('aria-pressed', 'true');
        button.setAttribute('title', 'Hide password (Space/Enter)');
        if (tooltipText) tooltipText.textContent = 'Hide password (Space/Enter)';
    }
    
    // Show tooltip briefly on toggle
    if (tooltip) {
        tooltip.classList.remove('hidden');
        setTimeout(() => {
            if (tooltip && !button.matches(':focus')) {
                tooltip.classList.add('hidden');
            }
        }, 1500);
    }
}

// Add keyboard support and tooltip interactions
document.addEventListener('DOMContentLoaded', () => {
    const passwordButtons = document.querySelectorAll('.password-toggle-btn');
    
    passwordButtons.forEach(button => {
        const tooltip = button.querySelector('.password-tooltip');
        let tooltipTimeout;
        
        // Keyboard support (Space and Enter keys)
        button.addEventListener('keydown', (e) => {
            if (e.code === 'Space' || e.code === 'Enter') {
                e.preventDefault();
                // Determine which toggle function to call based on the button's onclick
                if (button.getAttribute('onclick').includes('toggleConfirmPasswordVisibility')) {
                    toggleConfirmPasswordVisibility({ currentTarget: button });
                } else {
                    togglePasswordVisibility({ currentTarget: button });
                }
            }
        });
        
        // Tooltip show/hide on hover
        button.addEventListener('mouseenter', () => {
            tooltipTimeout = setTimeout(() => {
                if (tooltip) tooltip.classList.remove('hidden');
            }, 300);
        });
        
        button.addEventListener('mouseleave', () => {
            clearTimeout(tooltipTimeout);
            if (tooltip) tooltip.classList.add('hidden');
        });
        
        // Show tooltip on focus
        button.addEventListener('focus', () => {
            if (tooltip) tooltip.classList.remove('hidden');
        });
        
        // Hide tooltip on blur
        button.addEventListener('blur', () => {
            if (tooltip) tooltip.classList.add('hidden');
        });
    });
});
```

---

## CSS/Tailwind Classes

### Button Styling Classes

```css
/* Base button styling */
class="password-toggle-btn absolute right-3 top-1/2 -translate-y-1/2 
       text-gray-600 hover:text-primary dark:text-gray-300 
       dark:hover:text-indigo-400 transition-colors duration-200 
       p-1.5 rounded-md focus:outline-none focus:ring-2 
       focus:ring-primary dark:focus:ring-indigo-400 
       focus:ring-offset-2 dark:focus:ring-offset-slate-800 
       hover:bg-gray-100 dark:hover:bg-slate-700"
```

### Icon Styling Classes

```css
/* Icon when password is HIDDEN */
class="fi fi-rr-eye-crossed text-[16px]"

/* Icon when password is VISIBLE (with color) */
class="fi fi-rr-eye text-indigo-600 dark:text-indigo-400 text-[16px]"

/* Icon with screen reader hiding */
aria-hidden="true"
```

### Tooltip Styling Classes

```css
/* Base tooltip (hidden by default) */
class="password-tooltip hidden absolute bottom-full right-0 mb-2 
       px-3 py-1.5 bg-gray-900 dark:bg-gray-100 
       text-white dark:text-gray-900 text-xs font-medium 
       rounded shadow-lg whitespace-nowrap z-50 pointer-events-none"

/* Tooltip arrow indicator */
class="absolute top-full right-2 -mt-1 border-4 
       border-transparent border-t-gray-900 
       dark:border-t-gray-100"
```

### Color Reference

| State | Light Mode | Dark Mode |
|-------|-----------|-----------|
| Icon (Hidden) | `text-gray-600` | `text-gray-300` |
| Icon (Visible) | `text-indigo-600` | `text-indigo-400` |
| Icon (Hover) | `text-primary` | `text-indigo-400` |
| Button Background (Hover) | `hover:bg-gray-100` | `dark:hover:bg-slate-700` |
| Focus Ring | `focus:ring-primary` | `dark:focus:ring-indigo-400` |
| Tooltip Background | `bg-gray-900` | `dark:bg-gray-100` |
| Tooltip Text | `text-white` | `dark:text-gray-900` |

---

## Usage Examples

### In React Form
```tsx
<SSInput
  label="Password"
  name="password"
  type="password"
  placeholder="Enter your password"
  register={register}
  validation={{ required: "Password is required" }}
  error={errors.password}
  autoComplete="current-password"
  icon="fi fi-rr-lock"
/>
```

### Keyboard Shortcuts
- **Tab**: Navigate to password toggle button
- **Space or Enter**: Toggle password visibility
- **Tab**: Move to next field

---

## Accessibility Features Summary

| Feature | Implementation | Benefit |
|---------|-----------------|---------|
| **aria-label** | Descriptive, includes keyboard hints | Screen reader users know how to use button |
| **aria-pressed** | Toggles between true/false | Indicates button state to assistive tech |
| **aria-hidden** | Applied to icon | Prevents duplication in screen readers |
| **role="tooltip"** | On tooltip div | Identifies tooltip to screen readers |
| **Keyboard Support** | Space/Enter keys | Full keyboard navigation support |
| **Focus Ring** | Visible focus indicator | Clear focus indication for keyboard users |
| **Color Contrast** | WCAG AA compliant | Visible for users with color blindness |
| **Dark Mode** | Tailwind dark: prefix | Works in all visual environments |

---

## Version History

- **v1.0** - Initial implementation with all accessibility features
  - Added keyboard support (Space/Enter)
  - Added styled tooltips with focus management
  - Added ARIA attributes
  - Added dark mode support
  - Added visual contrast improvements

---

## Support & Maintenance

For questions or improvements:
1. Test in multiple browsers
2. Validate with accessibility tools (axe DevTools, WAVE)
3. Test with screen readers (NVDA, JAWS, VoiceOver)
4. Check keyboard navigation
5. Verify in light and dark modes
