# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal portfolio website for Ronald Balza, a Data Analyst. The project is a static website built with HTML, CSS, and vanilla JavaScript. It features responsive design and includes sections for About, Experience, Projects, and Contact information.

## Tech Stack

- HTML5
- CSS3 (with CSS custom properties/variables)
- Vanilla JavaScript
- Google Fonts (Poppins)
- Static assets (images, PDF resume)

## Project Structure

```
personal-website/
├── index.html          # Main HTML file with all content sections
├── styles.css          # Main stylesheet with desktop styles
├── mediaqueries.css    # Responsive styles for tablets and mobile
├── script.js           # JavaScript for hamburger menu functionality
└── assets/             # Images, icons, and resume PDF
```

## Key Components

### Navigation
- Desktop navigation with fixed styling
- Mobile hamburger menu that toggles with JavaScript
- Smooth scrolling between sections using anchor links

### Sections
1. **Profile**: Hero section with name, title, and social links
2. **About**: Personal introduction with experience/education cards
3. **Experience**: Skills grid for Data Visualization and Data Analysis tools
4. **Projects**: Three Power BI project showcases with live demo links
5. **Contact**: Email and LinkedIn contact information

### Styling Approach
- CSS custom properties defined in `:root` for consistent theming
- Flexbox layouts throughout
- Responsive breakpoints at 1400px, 1200px, and 600px
- Smooth transitions on interactive elements

## Development Commands

Since this is a static website with no build process:
- Open `index.html` directly in a browser to preview
- Use a local server (e.g., Live Server VS Code extension) for development
- No npm/build commands required

## Important Notes

- The project links currently show placeholder Power BI dashboard embeds
- Resume is stored at `./assets/resume.pdf`
- All external links open in the same tab except Power BI demos (use `target="_blank"`)
- Logo is styled as a circular element with initials "RB"