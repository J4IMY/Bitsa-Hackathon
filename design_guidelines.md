# BITSA Website Design Guidelines

## Design Approach
**Hybrid Approach**: Combining Material Design's structured components with modern student-focused platforms (Discord, Notion, Linear) for engagement. The design balances institutional credibility with youthful energy.

## Core Design Principles
1. **Student-First**: Accessible, intuitive navigation prioritizing quick access to events and announcements
2. **Community Feel**: Warm, welcoming aesthetic that encourages participation
3. **Information Clarity**: Clear hierarchy for important dates, contacts, and updates

## Typography

**Font Stack** (Google Fonts):
- **Primary**: Inter (headings, UI elements) - weights: 400, 600, 700
- **Secondary**: Source Sans Pro (body text, descriptions) - weights: 400, 600

**Type Scale**:
- Hero Headline: text-5xl md:text-7xl font-bold
- Section Headers: text-3xl md:text-4xl font-bold
- Card Titles: text-xl font-semibold
- Body Text: text-base leading-relaxed
- Small Text/Meta: text-sm

## Layout System

**Spacing Primitives**: Use Tailwind units of 2, 4, 8, 12, and 16 consistently
- Component padding: p-4 to p-8
- Section spacing: py-12 md:py-20
- Card gaps: gap-6 to gap-8
- Container max-width: max-w-7xl

**Grid System**:
- Desktop: 3-column grids for events/blog cards (grid-cols-1 md:grid-cols-2 lg:grid-cols-3)
- Tablet: 2-column for most content
- Mobile: Single column stack

## Dark/Light Mode Implementation

**Mode Toggle**: Persistent toggle in header (moon/sun icon from Heroicons)

**Dark Mode Palette References**:
- Background: Deep charcoal (#0f172a equivalent)
- Surface: Elevated gray (#1e293b equivalent)
- Text: High contrast white/light gray
- Accents: Vibrant blues/purples for CTAs

**Light Mode Palette References**:
- Background: Clean white/off-white
- Surface: Subtle gray (#f8fafc equivalent)
- Text: Dark charcoal for readability
- Accents: Bold primary colors

**Dev Outlines**: All divs have visible borders (border border-red-500 or similar) for development clarity - remove for production

## Component Library

### Navigation
- **Header**: Sticky top navigation with BITSA logo (left), main nav links (center), dark mode toggle + user profile/login (right)
- **Mobile**: Hamburger menu with slide-in drawer
- **Footer**: 4-column layout (About BITSA, Quick Links, Contact, Social Media)

### Hero Section
- **Large Hero Image**: Full-width hero showcasing BITSA community/campus activity
- **Overlay**: Dark gradient overlay (bottom to top) for text readability
- **Content**: Centered text with headline "Bachelor of IT Students Association", subheading, and dual CTAs ("Register Now" + "View Events") with blurred button backgrounds (backdrop-blur-md)
- **Height**: min-h-[60vh] md:min-h-[70vh]

### Cards
- **Blog Cards**: Featured image (16:9 ratio), category tag, title, excerpt, author avatar + name, date, "Read More" link
- **Event Cards**: Date badge (large day/month), event title, time + location, registration button, attendee count
- **Gallery Cards**: Image with hover overlay showing caption and date

### Forms
- **Registration/Login**: Clean, centered forms with floating labels, validation states, social login options
- **Admin Dashboard**: Sidebar navigation (left), data tables with actions, modal overlays for create/edit operations

### Sections Layout

**Homepage** (6 sections):
1. Hero with CTA
2. Upcoming Events (3-card preview)
3. Latest Blog Posts (3-card grid)
4. Gallery Highlight (masonry grid, 6 photos)
5. Membership Benefits (icon + text cards)
6. Newsletter Signup + Contact Quick Links

**Blog Page**: Featured post hero + grid of posts with pagination
**Events Page**: Calendar view toggle + card grid of upcoming/past events
**Gallery**: Filterable masonry grid with lightbox
**Contact**: 2-column (form + info with map placeholder)

## Icons
**Library**: Heroicons (outline style for light mode, solid for dark mode accents)
- Use for: navigation, card metadata, form inputs, admin actions

## Images

**Hero Image**: Campus/student collaboration scene - vibrant, energetic, 1920x1080px minimum
**Blog Thumbnails**: 800x450px, tech/student life related
**Gallery Photos**: Variable sizes, BITSA events and activities
**Placeholder**: Use https://placehold.co with appropriate dimensions and BITSA brand color hints

## Animations
**Minimal Approach**: 
- Smooth page transitions (150-200ms)
- Hover states on cards (subtle scale: hover:scale-[1.02])
- Dark mode toggle transition (transition-colors duration-200)
No scroll animations or complex interactions

## Accessibility
- High contrast ratios in both modes (WCAG AA minimum)
- Focus states visible with ring-2 ring-offset-2
- Semantic HTML throughout
- Alt text for all images
- ARIA labels for icon-only buttons

This creates a modern, professional student association website that balances functionality with visual appeal while maintaining excellent usability across all devices and modes.