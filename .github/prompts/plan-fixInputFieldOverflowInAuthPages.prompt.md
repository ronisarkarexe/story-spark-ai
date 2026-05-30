# Plan: Fix Input Field Overflow in Auth Pages

## Problem
Input fields on signin/signup pages are overflowing their containers due to conflicting padding values and excessive horizontal spacing on mobile devices.

### Root Causes
1. **Conflicting padding**: auth.css defines global `padding: 0 16px` but HTML uses Tailwind's `pl-11`/`pr-11` (44px each side)
2. **Excessive icon spacing**: Input icons positioned absolutely require 44px left padding + 44px right padding (for password toggle) = 88px total
3. **Mobile constraints**: On small screens with `p-4` (16px) container padding, the input wraps create overflow
4. **Inconsistent sizing**: Login uses implicit max-width while signup explicitly uses `max-w-[400px]`

### Affected Files
- auth.css — Global input styling rules
- login.html — Uses inline Tailwind `pl-11`/`pr-11`
- signup.html — Same overflow pattern

## Solution

**TL;DR**: Normalize input padding in auth.css to use consistent box-sizing with reduced padding on mobile, and ensure icon positioning doesn't force excessive horizontal padding.

### Steps

1. **Add responsive padding override in auth.css**
   - On mobile: reduce padding to `0 12px` (or adjust based on icon size)
   - On desktop: maintain design system padding of `0 16px`
   - Use `@media (max-width: 640px)` breakpoint

2. **Adjust icon positioning to reduce required padding**
   - Review icon size (currently `16px`) and position offset
   - If icons can be slightly smaller or closer to edge, reduce padding requirement
   - Consider using `padding-left: 36px` on mobile vs `44px` on desktop

3. **Ensure input height and padding alignment**
   - Verify `--ds-input-height: 50px` + padding = appropriate visual proportions
   - Confirm `box-sizing: border-box` is applied consistently

4. **Verify form container constraints**
   - Confirm max-width is respected on all screen sizes
   - Check that parent section padding (`p-4 md:p-10`) doesn't conflict

5. **Test responsive behavior**
   - Mobile: test at 320px, 375px, 425px viewports
   - Tablet: test at 768px
   - Desktop: test at 1024px+
   - Verify no horizontal scrolling appears

## Relevant Files
- auth.css — Lines 125–142 (input styling) — needs responsive padding rules
- login.html — Input markup with `pl-11`/`pr-11` classes
- signup.html — Input markup with `pl-11`/`pr-11` classes

## Verification
1. Open both pages at 320px mobile width — inputs should not overflow
2. Inspect computed padding/margin on inputs using DevTools
3. Confirm icons remain properly positioned after changes
4. Verify `box-sizing: border-box` is applied to all input types
5. Test focus states and transitions still work smoothly

## Decisions
- **Mobile breakpoint**: Using `max-width: 640px` (Tailwind's `sm` breakpoint)
- **Icon approach**: Adjust CSS padding rather than HTML structure to minimize changes
- **Backward compatibility**: Changes should not affect already-styled form elements elsewhere in app
