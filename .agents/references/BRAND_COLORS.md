# Dr.Mac Brand Guide

## Color Palette

### Core Palette

| Name  | Hex       | Usage                                  |
|-------|-----------|----------------------------------------|
| Navy  | `#202940` | Primary dark background, sidebar       |
| Brown | `#4B4038` | Secondary warm accent                  |
| Taupe | `#9A8678` | Neutral muted text, borders            |
| Rose  | `#CAAA98` | Primary accent, CTAs, highlight        |

### Extended Palette

| Name          | Hex       | Usage                                    |
|---------------|-----------|------------------------------------------|
| Navy Light    | `#2A3655` | Card/panel backgrounds (dark mode)       |
| Brown Light   | `#5F5248` | Hover states for brown elements          |
| Taupe Light   | `#B3A294` | Disabled text, subtle borders            |
| Rose Light    | `#DBC0B0` | Hover state for rose/gold elements       |
| Rose Dark     | `#B8927E` | Pressed/active state for rose accents    |

### Tailwind CSS Classes

All colors are defined in `@theme inline` in `globals.css`:

#### Custom classes:
- `bg-navy` / `text-navy` / `border-navy`
- `bg-brown` / `text-brown` / `border-brown`
- `bg-taupe` / `text-taupe` / `border-taupe`
- `bg-rose` / `text-rose` / `border-rose`

#### Legacy aliases (mapped to new palette):
- `bg-charcoal` → `#202940` (was `#121212`)
- `bg-charcoal-light` → `#2A3655` (was `#1E1E1E`)
- `text-gold` / `bg-gold` → `#CAAA98` (was `#D4AF37`)
- `bg-gold-light` → `#DBC0B0` (was `#F3E5AB`)
- `bg-gold-dark` → `#B8927E` (was `#996515`)

These aliases ensure backward compatibility — existing code using `text-gold` or `bg-charcoal` will continue to work with the new palette.

### Light Mode
- Background: `#F7F5F2` (warm off-white)
- Foreground: `#202940`

### Dark Mode
- Background: `#202940`
- Foreground: `#F7F5F2`

---

## Typography

### Font Stack

| Role    | Font              | Class              | Weights Used         |
|---------|-------------------|--------------------|----------------------|
| Body    | Inter             | `font-body`        | 400, 500, 600, 700   |
| Display | Playfair Display  | `font-display`     | 600, 700 (headings)  |

### Implementation

Defined in `globals.css` via `@theme inline`:

