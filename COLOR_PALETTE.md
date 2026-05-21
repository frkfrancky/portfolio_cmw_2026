# 🎨 Design Color Palette

Palette de couleurs complète pour le portfolio Francky Rasataharisoa

## Primary Colors

### Vert Lime
- **Hex**: `#CCFF00`
- **Usage**: Hero section background, accents primaires
- **Utilisé pour**: Fond hero, highlights importants

### Violet Primaire
- **Hex**: `#7C3AED`
- **Usage**: Boutons actifs, hover states, accents
- **Utilisé pour**: Boutons de langue, hover effects, underlines

### Violet Clair
- **Hex**: `#A855F7`
- **Usage**: Gradients, secondary accents
- **Utilisé pour**: Dégradés, effets lumineux

---

## Neutral Colors

### Dark Background
- **Hex**: `#1F1F27`
- **Usage**: Dark mode background, text on light
- **Utilisé pour**: Bande noire hero, dark mode

### Dark Secondary
- **Hex**: `#2D2D35`
- **Usage**: Secondary dark elements

### Light Background
- **Hex**: `#FFFFFF`
- **Usage**: Light mode background

### Grays (100-600)
- **Gray 100**: `#F3F4F6`
- **Gray 200**: `#E5E7EB` (Borders)
- **Gray 300**: `#D1D5DB`
- **Gray 400**: `#9CA3AF`
- **Gray 500**: `#6B7280`
- **Gray 600**: `#4B5563`

---

## Text Colors

- **Dark Text**: `#1F1F27`
- **Light Text**: `#FFFFFF`
- **Muted Text**: `#9CA3AF`

---

## Mode Specific

### Light Mode
- Background Primary: `#FFFFFF`
- Background Secondary: `#F9FAFB`
- Text Primary: `#1F1F27`
- Text Secondary: `#6B7280`
- Border: `#E5E7EB`

### Dark Mode
- Background Primary: `#1F1F27`
- Background Secondary: `#2D2D35`
- Text Primary: `#F3F4F6`
- Text Secondary: `#D1D5DB`
- Border: `#4B5563`

---

## Semantic Colors

- **Success**: `#10B981`
- **Warning**: `#F59E0B`
- **Error**: `#EF4444`

---

## How to Use

### As CSS Variables
```css
background-color: var(--primary-lime);
color: var(--primary-violet);
border: 2px solid var(--primary-violet);
```

### In Dark/Light Mode
```css
background: var(--bg-primary);
color: var(--text-primary);
border-color: var(--border);
```

---

## Design Elements Using Colors

### Hero Section
- **Background**: Vert Lime (`#CCFF00`)
- **Main Text**: Noir (`#1F1F27`)
- **Black Band**: Dark (`#1F1F27`)
- **Text on Band**: Blanc (`#FFFFFF`)

### Cards (Skills, Projects)
- **Border**: Violet on hover
- **Background**: Light gray secondary
- **Shadow**: Violet glow on hover

### Timeline Items
- **Left Border**: Violet (`#7C3AED`)
- **Hover**: Violet shadow glow

### Buttons
- **Active/Hover**: Violet with glow effect
- **Default**: Transparent with border

### Section Titles
- **Underline Gradient**: Violet → Lime

---

## CSS Variables Reference

```css
:root {
    --primary-lime: #CCFF00;
    --primary-violet: #7C3AED;
    --primary-violet-light: #A855F7;
    
    --dark-bg: #1F1F27;
    --dark-secondary: #2D2D35;
    --light-bg: #FFFFFF;
    
    /* Light Mode */
    --bg-primary: #FFFFFF;
    --bg-secondary: #F9FAFB;
    --text-primary: #1F1F27;
    --text-secondary: #6B7280;
    --border: #E5E7EB;
}

body.dark {
    --bg-primary: #1F1F27;
    --bg-secondary: #2D2D35;
    --text-primary: #F3F4F6;
    --text-secondary: #D1D5DB;
    --border: #4B5563;
}
```
