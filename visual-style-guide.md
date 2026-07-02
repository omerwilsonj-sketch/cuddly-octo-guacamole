# FluentPath Spanish — Visual Style Guide
## Colourful & Appealing Redesign

> **Version:** 2.0  
> **Status:** Ratified design direction  
> **Purpose:** Guide the developer to implement a more colourful, vibrant, and engaging visual identity while maintaining professional credibility for intermediate-to-advanced learners.

---

## 1. Design Philosophy

**"Warm Professionalism with Latin Energy"**

The visual redesign balances professional trustworthiness (our learners are career-driven adults) with the warmth and vibrancy of Spanish-speaking cultures. We move from a "corporate teal" feel toward a more energetic, inviting, and personality-driven aesthetic.

| Before (Current) | After (Redesign) |
|---|---|
| Flat, muted teal + white | Gradient-rich, layered colour |
| Corporate/serious | Warm/inviting + professional |
| Minimal use of accent colours | Bold, confident colour blocking |
| White cards with gray borders | Tinted cards with coloured accents |
| Single-colour buttons | Gradient buttons with depth |
| Static hero (solid bg) | Gradient hero with overlay texture |

---

## 2. Vibrant Colour Palette

### 2.1 Primary Palette

| Role | Hex | Name | Usage |
|---|---|---|---|
| **Primary Deep** | `#0B3B4C` | Deep Teal | Headings, nav bar bg, footer bg, hero bg gradient stop |
| **Primary Mid** | `#1A6B7A` | Ocean Teal | Buttons, interactive elements, section accents |
| **Primary Light** | `#E8F4F5` | Mist Teal | Background tints, card backgrounds, hover states |

### 2.2 Warm Secondary Palette (NEW — Expanded)

| Role | Hex | Name | Usage |
|---|---|---|---|
| **Secondary** | `#E8612B` | Coral Orange | CTA buttons, highlights, "Book Now", price emphasis |
| **Secondary Light** | `#FDF0EA` | Coral Tint | Background behind secondary elements, testimonial cards |
| **Accent Gold** | `#F0B429` | Golden Sun | Badges, "Most Popular" tag, star ratings, celebratory elements |
| **Accent Gold Light** | `#FFF8E0` | Golden Glow | Background tint for accent areas |

### 2.3 Vivid Accent Palette (NEW)

| Hex | Name | Usage |
|---|---|---|
| `#D94564` | Flamenco Pink | Sale tags, special offers, limited-time banners |
| `#4CAF50` | Verde Alegre | Success states, progress bars, "complete" badges |
| `#8B5CF6` | Jacaranda Purple | Dialect-specific accent (European/Castilian identity), creative elements |
| `#F59E0B` | Amber | Warning states, "almost there" progress indicators |

### 2.4 Neutrals

| Hex | Name | Usage |
|---|---|---|
| `#FAFAFA` | Off-White | Page background |
| `#F3F4F6` | Light Gray | Alternate section backgrounds, card backgrounds |
| `#E5E7EB` | Border Gray | Borders, dividers |
| `#6B7280` | Mid Gray | Secondary text, captions |
| `#374151` | Dark Gray | Body text |
| `#111827` | Near Black | Headings (on light backgrounds) |

---

## 3. Gradients (KEY VISUAL UPGRADE)

Gradients are the **single biggest visual upgrade** — they replace flat backgrounds with depth and energy.

### 3.1 Hero Gradient
```css
background: linear-gradient(135deg, #0B3B4C 0%, #1A6B7A 50%, #E8612B 100%);
```
This creates a teal-to-warm-coral transition — professional on the left, warm on the right.

### 3.2 CTA Button Gradient
```css
background: linear-gradient(135deg, #E8612B 0%, #D94564 100%);
```
For primary calls-to-action: "Book a Session", "Start Your Journey"

### 3.3 Card Accent Gradient
```css
/* Subtle top-to-bottom warm gradient on card accents */
background: linear-gradient(180deg, #FDF0EA 0%, transparent 100%);
```

### 3.4 Section Divider Gradient
```css
/* A subtle visual divider between sections */
background: linear-gradient(90deg, transparent 0%, #E8F4F5 50%, transparent 100%);
height: 4px;
```

### 3.5 Feature Card Gradient Accents
Each feature card gets a subtle accent border along its left side instead of a flat border-all-around:
```css
border-left: 4px solid;
border-left-color: #E8612B;
/* OR use one of the vivid accent colours per card */
```

---

## 4. Typography

Keep the existing font stack but add display weights and refinements:

| Element | Font | Weight | Size | Colour |
|---|---|---|---|---|
| **Hero H1** | Montserrat | 800 (ExtraBold) | 3.5rem-4.5rem | White |
| **Section H2** | Montserrat | 700 (Bold) | 2.25rem-2.75rem | `#111827` |
| **Card H3** | Montserrat | 600 (SemiBold) | 1.25rem-1.5rem | `#111827` |
| **Body** | Inter | 400 (Regular) | 1rem-1.125rem | `#374151` |
| **Small/Caption** | Inter | 500 (Medium) | 0.75rem-0.875rem | `#6B7280` |
| **CTA/Button** | Montserrat | 700 (Bold) | 0.9375rem-1.125rem | White |

### Line Spacing
- Body text: `1.625` (26px on 16px)
- Headings: `1.2`

### Letter Spacing
- Headings: `-0.02em` (tight)
- Buttons/CTAs: `0.05em` (slight tracking)
- Captions/tags: `0.08em` (more spacing)

---

## 5. Component Styles

### 5.1 Buttons

**Primary CTA (Gradient)**
```css
/* Coral-to-Pink gradient */
background: linear-gradient(135deg, #E8612B 0%, #D94564 100%);
color: white;
padding: 14px 32px;
border-radius: 12px;
font-family: 'Montserrat', sans-serif;
font-weight: 700;
letter-spacing: 0.05em;
box-shadow: 0 4px 12px rgba(232, 97, 43, 0.3);
transition: all 0.3s ease;
/* Hover: lift + intensify shadow */
&:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(232, 97, 43, 0.4);
}
```

**Secondary Button (Outline)**
```css
border: 2px solid #1A6B7A;
color: #1A6B7A;
background: transparent;
padding: 12px 28px;
border-radius: 12px;
font-family: 'Montserrat', sans-serif;
font-weight: 700;
transition: all 0.3s ease;
/* Hover: fill with light tint */
&:hover {
    background: #E8F4F5;
    border-color: #0B3B4C;
    color: #0B3B4C;
}
```

**Text Button (Subtle)**
```css
color: #1A6B7A;
font-weight: 600;
text-decoration: underline 2px transparent;
text-underline-offset: 4px;
transition: all 0.2s;
&:hover {
    color: #E8612B;
    text-decoration-color: #E8612B;
}
```

### 5.2 Cards

**Standard Feature Card**
```css
background: white;
border-radius: 16px;
padding: 32px;
box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
border-left: 4px solid;
border-left-color: #1A6B7A; /* or accent colour per card */
transition: all 0.3s ease;
&:hover {
    box-shadow: 0 10px 25px rgba(0,0,0,0.08);
    transform: translateY(-4px);
}
```

**Pricing Card (Standard)**
```css
background: white;
border-radius: 20px;
padding: 40px 32px;
border: 1px solid #E5E7EB;
box-shadow: 0 1px 3px rgba(0,0,0,0.06);
transition: all 0.3s ease;
&:hover {
    box-shadow: 0 10px 30px rgba(0,0,0,0.08);
    transform: translateY(-4px);
}
```

**Pricing Card (Featured — "Most Popular")**
```css
/* Same as standard + : */
border: 2px solid #F0B429;
box-shadow: 0 4px 16px rgba(240, 180, 41, 0.15);
transform: translateY(-8px);
/* Badge: */
.badge {
    background: linear-gradient(135deg, #F0B429 0%, #F59E0B 100%);
    color: #111827;
    /* centered above card */
}
```

**Testimonial Card**
```css
background: linear-gradient(135deg, #FDF0EA 0%, #E8F4F5 100%);
/* Warm coral-to-teal subtle gradient */
border-radius: 16px;
padding: 32px;
border: 1px solid rgba(232, 97, 43, 0.1);
```

### 5.3 Navigation Bar
```css
background: rgba(255,255,255,0.92);
backdrop-filter: blur(12px);
-webkit-backdrop-filter: blur(12px);
border-bottom: 1px solid rgba(229,231,235,0.5);
/* Subtle glass-morphism effect */
```

### 5.4 Section Backgrounds
Alternate between these 3 backgrounds for visual rhythm:

| Section | Background |
|---|---|
| Odd sections | `white` (`#FAFAFA`) |
| Even sections | `#F3F4F6` (light gray) |
| Accent sections | `#E8F4F5` (Mist Teal) or `#FDF0EA` (Coral Tint) |

**NEW: Gradient Section Dividers**
Between each major section, add a subtle divider:
```css
<div style="height: 4px; background: linear-gradient(90deg, transparent 0%, #E8612B 50%, transparent 100%); opacity: 0.3;"></div>
```

### 5.5 Hero Section (REDESIGNED)
```css
background: linear-gradient(135deg, #0B3B4C 0%, #1A6B7A 50%, #E8612B 100%);
position: relative;
overflow: hidden;
/* Add subtle decorative pattern overlay */
&::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml,..."); /* subtle geometric pattern */
    opacity: 0.06;
    background-size: 60px 60px;
}
```

### 5.6 Form Inputs
```css
padding: 12px 16px;
border: 2px solid #E5E7EB;
border-radius: 12px;
background: white;
transition: all 0.2s;
font-family: 'Inter', sans-serif;
font-size: 1rem;
&:focus {
    border-color: #1A6B7A;
    box-shadow: 0 0 0 3px rgba(26,107,122,0.15);
    outline: none;
}
```

---

## 6. Colour Usage Rules

### 6.1 Do's
- ✅ Use Coral Orange (`#E8612B`) for ALL primary CTAs
- ✅ Use Golden Sun (`#F0B429`) for badges, "popular" tags, star icons
- ✅ Use the **Hero Gradient** on the main hero section
- ✅ Use **Mist Teal** (`#E8F4F5`) as background for alternating sections
- ✅ Use coloured left-borders on cards for visual variety
- ✅ Apply accent gradient dividers between major sections
- ✅ Use glass-morphism nav bar (blur + transparency)

### 6.2 Don'ts
- ❌ Don't use pure black (`#000000`) — always use the defined neutrals
- ❌ Don't use flat teal for CTAs — always use the Coral Orange gradient
- ❌ Don't over-saturate — use vivid accents sparingly (max 2 per page view)
- ❌ Don't use the old teal-only flat buttons
- ❌ Don't use thick full borders on cards — prefer left-border accent or shadow

### 6.3 Accessibility
- All text on accent/primary backgrounds must maintain WCAG AA contrast
- Coral Orange on white: passes at 16px+ text
- Coral Orange on white: **do not use for body text** (only buttons/badges)
- Golden Sun on dark backgrounds: passes
- Always test contrast before finalizing

---

## 7. Visual Mockups

### 7.1 Heading Style (Example)
```
┌─────────────────────────────────────────┐
│  [Gold Badge ★] MOST POPULAR            │
│                                         │
│  1-on-1 Coaching                        │  ← Montserrat 800
│  £40-£80 / hour                        │  ← Coral Orange price
│                                         │
│  • 100% customized curriculum           │  ← Inter 400
│  • Flexible scheduling                  │
│  • Industry-specific vocabulary         │
│                                         │
│  [ START YOUR JOURNEY → ]              │  ← Coral-Pink gradient btn
└─────────────────────────────────────────┘
```

### 7.2 Card Grid Layout
```
┌─── [4px coral left border] ─────────────┐
│  🗣️                                     │
│  Conversational Fluency                 │  ← Montserrat 600
│  Speak naturally from day one...        │  ← Inter 400
│                                         │
│  [Learn More →]                        │  ← Teal text button
└─────────────────────────────────────────┘
```

### 7.3 Hero Section Layout
```
┌─────────────────────────────────────────────────┐
│  [Gradient: Deep Teal → Ocean Teal → Coral]     │
│                                                 │
│  [subtle pattern overlay at 6% opacity]         │
│                                                 │
│         Real-world Spanish for                  │
│         Real-world Success                      │  ← White, Montserrat 800
│                                                 │
│  Master practical fluency and professional      │
│  communication. Skip the grammar drills and     │
│  start speaking with confidence.                │  ← White/light, Inter 400
│                                                 │
│   [Start Your Journey →]  [Learn More]         │
│    Coral-Pink gradient     White outline        │
└─────────────────────────────────────────────────┘
```

---

## 8. Quick-Start for Developer

### 8.1 Tailwind Config Updates

```javascript
// Add these colours to tailwind.config
colors: {
    primary: {
        50: '#E8F4F5',   // Mist Teal bg
        100: '#C5E3E6',
        200: '#8CC8CE',
        500: '#1A6B7A',   // Ocean Teal
        700: '#0F4F5C',
        900: '#0B3B4C',   // Deep Teal
    },
    coral: {
        50: '#FDF0EA',   // Coral Tint
        100: '#FADBCA',
        500: '#E8612B',   // Coral Orange
        700: '#C94D1E',
    },
    gold: {
        50: '#FFF8E0',   // Golden Glow
        500: '#F0B429',   // Golden Sun
        600: '#D4951A',
    },
    pink: {
        500: '#D94564',   // Flamenco Pink
    },
    purple: {
        500: '#8B5CF6',   // Jacaranda Purple
    },
    green: {
        500: '#4CAF50',   // Verde Alegre
    }
}
```

### 8.2 CSS Gradient Classes
```css
.gradient-hero {
    background: linear-gradient(135deg, #0B3B4C 0%, #1A6B7A 50%, #E8612B 100%);
}
.gradient-cta {
    background: linear-gradient(135deg, #E8612B 0%, #D94564 100%);
}
.gradient-card-accent {
    background: linear-gradient(180deg, #FDF0EA 0%, transparent 100%);
}
.gradient-divider {
    height: 4px;
    background: linear-gradient(90deg, transparent 0%, #E8612B 50%, transparent 100%);
    opacity: 0.3;
}
```

### 8.3 Implementation Priority

| Priority | Element | What to change |
|---|---|---|
| 🔴 P0 | Hero section | Apply hero gradient, add pattern overlay |
| 🔴 P0 | CTA buttons | Apply coral-pink gradient to primary CTAs |
| 🔴 P0 | Navigation bar | Add glass-morphism effect |
| 🟡 P1 | Section backgrounds | Alternate between white, gray, mist teal, coral tint |
| 🟡 P1 | Cards | Add 4px left-border accent, update shadows |
| 🟡 P1 | Section dividers | Add gradient dividers between sections |
| 🟢 P2 | Pricing cards | Update featured card with gold border/glow |
| 🟢 P2 | Tags/badges | Use Golden Sun for "Most Popular", badges |
| 🔵 P3 | Form inputs | Update to new border/focus styles |
| 🔵 P3 | Typography | Update letter-spacing, weights, sizes |

### 8.4 Key Spacing Rules
- Section padding: `py-20` (80px top/bottom)
- Card padding: `p-8` (32px)
- Grid gap (cards): `gap-8` (32px)
- Section max-width: `max-w-7xl` (1280px)

---

## 9. Visual Impact Summary

| Before | After |
|---|---|
| Dark teal hero (#1A5F7A solid) | Teal→Coral gradient hero (depth & energy) |
| Flat white nav | Glass-morphism nav (modern & sleek) |
| Single teal buttons | Coral-pink gradient buttons (inviting & urgent) |
| Uniform white cards | Left-border accent cards (personality) |
| White/gray sections only | Warm tinted sections (variety) |
| No dividers | Gradient section dividers (visual rhythm) |
| Teal "Most Popular" tag | Gold "Most Popular" badge (premium feel) |

---

*This guide supersedes the previous brand-guide.md. The developer should reference this document for all visual implementation decisions.*
