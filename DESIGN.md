---
name: Maison Rose Editorial System
colors:
  surface: '#fff8f4'
  surface-dim: '#e1d8d3'
  surface-bright: '#fff8f4'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fbf2ec'
  surface-container: '#f5ece6'
  surface-container-high: '#efe7e1'
  surface-container-highest: '#eae1db'
  on-surface: '#1f1b17'
  on-surface-variant: '#524345'
  inverse-surface: '#34302c'
  inverse-on-surface: '#f8efe9'
  outline: '#847375'
  outline-variant: '#d6c1c4'
  surface-tint: '#8a4c5a'
  primary: '#8a4c5a'
  on-primary: '#ffffff'
  primary-container: '#d68c9c'
  on-primary-container: '#5c2634'
  inverse-primary: '#ffb1c1'
  secondary: '#675b5d'
  on-secondary: '#ffffff'
  secondary-container: '#efdee0'
  on-secondary-container: '#6e6163'
  tertiary: '#9f3c55'
  on-tertiary: '#ffffff'
  tertiary-container: '#f17c96'
  on-tertiary-container: '#6c132f'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffd9df'
  primary-fixed-dim: '#ffb1c1'
  on-primary-fixed: '#380919'
  on-primary-fixed-variant: '#6e3543'
  secondary-fixed: '#efdee0'
  secondary-fixed-dim: '#d3c3c5'
  on-secondary-fixed: '#22191b'
  on-secondary-fixed-variant: '#4f4446'
  tertiary-fixed: '#ffd9de'
  tertiary-fixed-dim: '#ffb2bf'
  on-tertiary-fixed: '#3f0016'
  on-tertiary-fixed-variant: '#80243e'
  background: '#fff8f4'
  on-background: '#1f1b17'
  surface-variant: '#eae1db'
typography:
  headline-xl:
    fontFamily: EB Garamond
    fontSize: 64px
    fontWeight: '400'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: EB Garamond
    fontSize: 48px
    fontWeight: '400'
    lineHeight: '1.2'
  headline-lg-mobile:
    fontFamily: EB Garamond
    fontSize: 32px
    fontWeight: '400'
    lineHeight: '1.2'
  headline-md:
    fontFamily: EB Garamond
    fontSize: 32px
    fontWeight: '500'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-caps:
    fontFamily: Hanken Grotesk
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.0'
    letterSpacing: 0.1em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1280px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 20px
---

## Brand & Style
The design system embodies a high-end editorial aesthetic, blending classical sophistication with a contemporary, airy lightness. It is designed for luxury lifestyle, fashion, and cultural publications where white space, delicate color transitions, and impeccable typography are paramount. 

The visual style is **Minimalist with a touch of Glassmorphism**. It prioritizes a sense of "quiet luxury"—using expansive margins and subtle translucent layers to create a multi-dimensional, ethereal reading experience. The emotional response should be one of calm, intellectual curiosity, and refined taste.

## Colors
The palette is centered on a series of sophisticated pinks balanced against a warm, organic neutral base.

- **Primary (Soft Rose - #D68C9C):** A lightened, airy evolution of Rosewood. Use for primary actions, decorative accents, and key brand moments.
- **Secondary (Pale Blush - #F7E6E8):** A translucent-feeling accent pink. Use for large surface areas, subtle hover states, and background tints.
- **Tertiary (Deep Berry - #B54D66):** A more vibrant yet deep tone for high-emphasis elements, active states, and critical information.
- **Neutral (Bone - #F6EDE7):** The foundational background color, providing a warm, paper-like quality that avoids the harshness of pure white.
- **Text (Ink Plum - #241019):** A high-contrast, near-black plum used for all primary communication to ensure maximum legibility and a sense of gravity.

## Typography
This design system utilizes a classical serif and modern sans-serif pairing to create structural tension.

**EB Garamond** is used for all headlines. It should be set with tight leading and slight negative tracking in larger sizes to mimic traditional typesetting. **Hanken Grotesk** provides a clean, contemporary counterpoint for body text and functional labels, ensuring high readability across digital interfaces. 

For mobile, headlines must scale down aggressively to prevent awkward line breaks, while body text remains generous (16px minimum) to maintain accessibility.

## Layout & Spacing
The layout follows a **Fixed Grid** philosophy on desktop to preserve editorial intent, transitioning to a fluid model on mobile.

- **Grid:** 12-column symmetrical grid on desktop; 4-column grid on mobile.
- **Rhythm:** An 8px baseline grid governs all vertical spacing. 
- **White Space:** Use generous margins (64px+) to isolate content and create a premium, unhurried feel. 
- **Breakpoints:** 
  - Desktop: 1024px+ (12 columns)
  - Tablet: 768px - 1023px (8 columns)
  - Mobile: <767px (4 columns)

## Elevation & Depth
Depth is communicated through **Tonal Layering and Glassmorphism** rather than traditional shadows.

1. **Surface Tiers:** Use the Secondary Pink (#F7E6E8) as a "Container" color over the Bone (#F6EDE7) background to create a first level of elevation.
2. **Glass Effect:** Modals and navigation bars should use a 20% opacity white fill with a 24px backdrop blur to create a soft, translucent feel.
3. **Shadows:** If required for utility (e.g., floating buttons), use an extremely diffused, low-opacity shadow tinted with the primary rose: `0 8px 32px rgba(214, 140, 156, 0.1)`.
4. **Outlines:** Use 1px solid borders in a slightly darker tint of the background color for subtle definition without adding visual weight.

## Shapes
The shape language is **Soft and geometric**. 

Edges are slightly rounded (0.25rem) to remove the harshness of a pure grid while maintaining the structured feel of a printed magazine. Interactive components like buttons use the `rounded-lg` (0.5rem) token to feel more tactile and approachable, whereas large layout containers should remain at the base `rounded` (0.25rem) or sharp.

## Components
- **Buttons:** Primary buttons use the Tertiary color (#B54D66) with white text for maximum impact. Secondary buttons use a Rose outline (#D68C9C) with transparent fills.
- **Input Fields:** Use a simple bottom-border only approach (1px, Ink Plum) to maintain the editorial look.
- **Chips/Tags:** Small, pill-shaped elements using the Secondary color (#F7E6E8) and Label Caps typography.
- **Cards:** Borderless with a light Secondary Pink background or a very thin Bone-tinted border.
- **Lists:** Separated by thin 1px rules using a 10% opacity version of Ink Plum.
- **Featured Articles:** Should utilize large-scale EB Garamond typography and a 2:3 aspect ratio for imagery to reinforce the magazine aesthetic.