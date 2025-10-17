# TorneoLive Design Guidelines

## Design Approach: Material Design System
**Rationale:** TorneoLive is a data-intensive sports management platform requiring clear information hierarchy, efficient data tables, and real-time updates. Material Design provides robust patterns for dashboards, tables, and form-heavy interfaces while allowing sporty energy through color.

## Core Design Principles
1. **Data Clarity First:** Information density balanced with readability
2. **Live Energy:** Convey excitement of live football through strategic color and motion
3. **Role-Based Design:** Clear visual distinction between admin and user interfaces
4. **Performance Visibility:** Real-time updates feel immediate and responsive

---

## Color Palette

### Primary Colors (Football Energy)
- **Primary Brand:** 142 85% 45% (vibrant football green for CTAs, active states)
- **Primary Variant:** 142 70% 38% (darker green for hover states)
- **Dark Mode Primary:** 142 75% 55% (lighter for dark backgrounds)

### Functional Colors
- **Admin Zone:** 25 95% 53% (energetic orange for admin sections, badges)
- **Success/Goal:** 142 70% 45% (green for goals, wins)
- **Warning:** 45 93% 47% (yellow for draws, pending)
- **Error/Loss:** 0 84% 60% (red for losses, errors)
- **Info:** 217 91% 60% (blue for stats, information)

### Neutral Palette
- **Dark Mode Background:** 220 13% 9% (very dark blue-gray)
- **Dark Mode Surface:** 220 10% 14% (card backgrounds)
- **Dark Mode Border:** 220 10% 25% (subtle dividers)
- **Text Primary:** 0 0% 98% (high contrast white)
- **Text Secondary:** 220 10% 70% (muted text)

---

## Typography

### Font Families
- **Primary:** "Inter" (Google Fonts) - clean, readable for data
- **Display/Headlines:** "Montserrat" (Google Fonts) - bold, sporty energy
- **Monospace Data:** "JetBrains Mono" (Google Fonts) - scores, statistics

### Type Scale
- **Hero/Display:** text-5xl/text-6xl font-bold (Montserrat)
- **Page Headers:** text-3xl/text-4xl font-bold (Montserrat)
- **Section Headers:** text-xl/text-2xl font-semibold (Inter)
- **Body Text:** text-base/text-lg font-normal (Inter)
- **Captions/Meta:** text-sm/text-xs font-medium (Inter)
- **Data/Scores:** text-2xl/text-3xl font-bold (JetBrains Mono)

---

## Layout System

### Spacing Primitives
**Core Units:** 2, 4, 6, 8, 12, 16, 24 (Tailwind units)
- Tight spacing: p-2, gap-2 (dense data tables)
- Standard spacing: p-4, gap-4 (cards, forms)
- Generous spacing: p-8, gap-8 (section breaks)
- Large spacing: py-16, py-24 (page sections)

### Grid System
- **Dashboard Layout:** 12-column grid (lg:grid-cols-12)
- **Tournament Cards:** grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- **Data Tables:** Full-width with horizontal scroll on mobile
- **Match Cards:** grid-cols-1 md:grid-cols-2 gap-6

### Container Widths
- **Full App Container:** max-w-7xl mx-auto px-4
- **Content Sections:** max-w-6xl
- **Forms:** max-w-2xl
- **Data Tables:** w-full with overflow-x-auto

---

## Component Library

### Navigation
- **Top Navigation Bar:** Sticky header, dark surface (220 10% 14%), h-16, primary brand logo left, navigation center, user menu right
- **Admin Toggle:** Prominent badge/pill in header showing admin mode with orange accent
- **Mobile Menu:** Slide-out drawer from left with backdrop

### Data Display

**Tournament Cards:**
- Surface background (220 10% 14%), rounded-xl, p-6
- Tournament name (text-2xl font-bold Montserrat)
- Date range and status badge (top-right corner)
- Team count, match count as meta info (text-sm text-secondary)
- Hover: subtle scale (scale-105) and border glow (primary color)

**Match Result Cards:**
- Two-column layout: Team A vs Team B
- Large centered score (text-4xl JetBrains Mono, primary color)
- Team names (text-lg font-semibold)
- Goal scorers list below each team
- Status indicator: Live (pulsing red dot), Final (green check), Scheduled (gray)

**Rankings Table:**
- Striped rows (even rows: 220 10% 16%)
- Sticky header with sort indicators
- Position number in colored circle (gold/silver/bronze for top 3)
- Team name bold, stats in monospace
- Highlight row on hover (subtle primary tint)

**Top Scorers Leaderboard:**
- Card-based layout for top 3 with larger styling
- Remaining players in compact table
- Player photo placeholder (circular, 48px)
- Goals count in large primary-colored numbers
- Team badge/name as secondary info

### Forms & Inputs

**Admin Forms:**
- Labeled inputs with floating labels
- Input fields: bg (220 10% 18%), border (220 10% 30%), rounded-lg, p-3
- Focus state: primary color border, outline ring
- Select dropdowns: Custom styled with chevron icon
- Date pickers: Calendar icon prefix
- Submit buttons: Full-width lg:w-auto, primary background, font-semibold

**Quick Action Buttons:**
- Floating Action Button (FAB): Fixed bottom-right, primary color, rounded-full, shadow-lg
- "Add Match", "Record Result" quick actions in admin view

### Stats Dashboard

**Stat Cards:**
- Grid of 4 cards (grid-cols-2 lg:grid-cols-4)
- Icon + Label + Large Number layout
- Icons from Heroicons (trophy, users, calendar, chart-bar)
- Accent color borders (top-2 or left-4 border with category color)

**Charts/Graphs:**
- Use placeholder for chart.js integration
- Goals per matchday line chart
- Team performance bar chart
- Responsive, max height 400px

### Overlays

**Modals:**
- Dark backdrop (bg-black/60)
- Content card: bg (220 10% 14%), max-w-2xl, rounded-2xl, p-8
- Close button top-right (X icon from Heroicons)
- Actions footer with Cancel + Confirm buttons

**Toast Notifications:**
- Slide in from top-right
- Success: green accent, check icon
- Error: red accent, X icon
- 4-second auto-dismiss with progress bar

---

## Images

### Hero Section
**Large Hero Image:** Yes - use football stadium action shot or tournament celebration scene
- Full-width hero: min-h-[60vh] lg:min-h-[70vh]
- Gradient overlay: dark gradient from bottom (220 13% 9% → transparent)
- Hero content positioned bottom-left with z-index layering
- Responsive: Mobile shows cropped version focusing on action

### Additional Images
- **Tournament Banners:** 16:9 ratio placeholder images at top of tournament detail pages
- **Team Logos:** Circular 64px placeholders in match cards and rankings
- **Empty States:** Illustrated graphics for "No tournaments yet", "No matches scheduled"

---

## Admin vs. User Interface

### Admin View
- Orange accent badge in navigation: "Admin Mode"
- Additional action buttons visible (Create, Edit, Delete)
- Forms and data entry prominent
- FAB for quick actions
- Full CRUD operations visible

### User View  
- Clean, read-only presentation
- Focus on browsing and viewing data
- Simplified navigation
- Share/export actions only
- Emphasis on live updates and statistics

---

## Accessibility & Dark Mode

- Full dark mode implementation (default)
- WCAG AA contrast ratios maintained
- Focus indicators: 2px primary color ring
- Keyboard navigation fully supported
- Screen reader labels on all interactive elements
- Consistent spacing for touch targets (min 44px)