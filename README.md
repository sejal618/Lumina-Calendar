# Lumina Calendar - My Frontend Challenge Implementation

I built this production-level, visually stunning, and highly interactive Wall Calendar component using React, TypeScript, and Tailwind CSS. My goal was to create a digital experience that honors the tactile feel of a physical calendar while providing modern utility.

## 🚀 Features I Implemented

- **Wall Calendar Aesthetic**: I designed the UI to mimic a physical calendar, complete with custom spiral binding, dynamic hero imagery, and paper-like textures.
- **Dynamic Theming**: I created a system where the UI theme (colors, accents, imagery) automatically adapts based on the current month to reflect the season.
- **Interactive Range Selection**: I implemented a robust date range selector with smooth visual feedback and comprehensive edge-case handling.
- **Color-Coded Notes**: I implemented a dynamic color palette system for notes. Each month features a unique, curated set of 5 colors that harmonize with the month's hero image (e.g., wintry blues for January, harvest oranges for October).
- **Differentiated Markers**: I designed unique visual signatures for different types of information:
  - **Holidays**: Represented by a **diamond** marker in the top-right, with distinct colors for public holidays (Indigo) and festivals (Cyan).
  - **Notes**: Represented by a **circular** marker at the bottom, using the user's selected category color.
- **Enhanced Tooltips**: I improved the hover feedback to display both holiday and note content simultaneously, ensuring no data is hidden.
- **Download Functionality**: I integrated `html-to-image` to allow users to capture and download their customized calendar as a high-quality PNG.
- **Persistence**: I used `localStorage` to ensure all notes, selected colors, and theme preferences are saved between sessions.
- **Responsive Design**: I engineered a flawless transition from a sophisticated side-by-side desktop layout to a clean, functional mobile view.
- **Advanced UX Details**:
  - **3D Page Flip**: Realistic paper-flipping animations with depth and shadow transitions using Framer Motion.
  - **Stencil Effect**: A sophisticated "cut-out" digit effect for selected dates that matches the range background tone.
  - **Mobile Gestures**: Full swipe-to-navigate and long-press-to-drag range selection support.
  - **Dynamic Theme Extraction**: Real-time color palette generation from hero images using `chroma-js`.
  - Holiday markers with interactive tooltips.
  - Full Dark Mode support.

## 🛠 My Tech Stack

- **Framework**: React (Vite) / Next.js compatible
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Date Logic**: date-fns
- **Icons**: Lucide React

## 📦 Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## 📐 My Project Structure

```
src/
├── components/
│   └── calendar/
│       ├── Calendar.tsx        # Main Orchestrator
│       ├── HeroSection.tsx     # Dynamic Imagery & Typography
│       ├── CalendarGrid.tsx    # Grid Logic
│       ├── DayCell.tsx         # Individual Day Logic
│       ├── NotesPanel.tsx      # Persistence & Note UI
│       └── SpiralBinding.tsx   # Aesthetic Detail
├── hooks/
│   └── useCalendar.ts          # Core State & Logic Hook
├── constants/
│   └── calendar.ts             # Themes & Holidays
├── types/
│   └── calendar.ts             # Type Definitions
└── lib/
    └── utils.ts                # Tailwind Class Merger
```

## 💡 My Implementation Logic

- **Range Selection**: I managed this in `useCalendar.ts`. I wrote the logic to set the start date on the first click and either reset or set the end date on the second click, ensuring the start date is always chronologically before the end date.
- **Theme Adaptation**: I created a mapping in `constants/calendar.ts` that links each month index to a specific Tailwind color palette and Unsplash image. This is reactively applied to the UI via the `theme` object I designed.
- **Animations & Gestures**: I used `AnimatePresence` and `@use-gesture/react` to create a tactile experience. The 3D flip responds to swipe velocity, and long-pressing a date triggers a haptic pulse before entering "drag-to-select" mode.
- **Theme Extraction**: I implemented a `themeService` that uses `chroma-js` to extract dominant colors from the month's hero image, dynamically generating a cohesive palette (primary, range background, and high-contrast foregrounds) for every month.

## 🚀 Deployment & Export

1. **GitHub Export**: You can easily export this project to your own GitHub repository. Click on the **Settings** menu in the AI Studio interface and select **Export to GitHub**. This will create a public repository with the full source code.
2. **Vercel Deployment**: Once exported to GitHub, go to [Vercel](https://vercel.com) and import the repository. Vercel will automatically detect the Vite framework and deploy. Ensure `NODE_VERSION` is set to 18 or higher.

## 🎥 My Demo Script

"Hi, I'm [Name]. Today I'm showcasing the Interactive Wall Calendar component I built. 

I wanted to bridge the gap between physical aesthetics and digital utility. You'll notice the **Spiral Binding** and **Hero Imagery** I added to give it that classic wall-calendar feel. 

One of the features I'm most proud of is the **Dynamic Theme Extraction**—notice how the entire color palette, including the **Stencil Effect** on selected dates, shifts as I navigate between months.

The **Mobile Gestures** I implemented make the experience feel native. I can swipe to flip pages or long-press and drag to select a date range with haptic feedback.

The **Range Selection** I implemented is highly intuitive. I can click a start and end date, and the UI provides clear feedback. I can then add **Range-specific notes** which I've ensured are persisted locally. 

I've also implemented **Holiday Markers** and a **Dark Mode** toggle to ensure a premium user experience across all devices. 

Technically, I focused on clean state management using a custom hook and ensured the UI is fully responsive and accessible. Thank you!"
