# Figma Integration Guide

## Overview

This document describes how to integrate Figma designs with the Digital Gift Card Platform codebase.

## Figma File Information

- **File Name**: ThxGPT
- **File URL**: https://www.figma.com/design/pX3IcAalsJ3TVTP51de8PX/ThxGPT?node-id=0-1&t=c6aOi84bjBsSMI6D-1
- **File Key**: `pX3IcAalsJ3TVTP51de8PX`
- **MCP Connection**: Configured in `.kiro/settings/mcp.json`

## Workflow

### 1. Design Phase (Current)
- Create UI designs in Figma following the specifications in `design.md`
- Organize screens by user flow (Authentication, Card Creation, Editor, Checkout, etc.)
- Define component library for reusable UI elements
- Establish design tokens (colors, typography, spacing, shadows)

### 2. Figma Make Export (Future)
When designs are ready:
1. Use Figma's "Dev Mode" or Figma Make to generate code
2. Export the Figma Make file to `design/figma/figma-make/`
3. Review generated components and adapt to our React/Next.js structure
4. Extract design tokens to `design/figma/tokens/`

### 3. Integration with Codebase
- Map Figma components to React components in `packages/frontend-web/src/components/`
- Import design tokens into Tailwind CSS configuration
- Use exported assets (icons, images) in the application

## Key Screens to Design

Based on the requirements and design documents, focus on these screens:

### Authentication Flow
- [ ] Phone number login screen
- [ ] SMS verification screen
- [ ] Social login (Apple/Google) buttons
- [ ] Contact permission modal

### Card Creation Flow
- [ ] Madlib prompt input screen
- [ ] Template gallery view
- [ ] Design preview grid (3 options)
- [ ] Refinement prompt interface

### Advanced Editor
- [ ] Main canvas with layer rendering
- [ ] Top sub-navigation (Edit, Effects, Animation, Buy, Schedule)
- [ ] Left contextual toolbar
- [ ] Right panel (Layer tree + AI prompt)
- [ ] Text editing toolbar
- [ ] Effects panel
- [ ] Animation timeline

### Gift Card Selection
- [ ] Gift card recommendations (3 cards)
- [ ] Catalog search sidebar
- [ ] Product search modal (Amazon/Walmart)
- [ ] Value input interface

### Checkout
- [ ] Cart breakdown display
- [ ] Payment form (Stripe Elements)
- [ ] Apple Pay / Google Pay buttons
- [ ] Signature input

### Group Gifting
- [ ] Contact selector
- [ ] Date/time picker
- [ ] Invitation text display
- [ ] Party page (viewer perspective)
- [ ] Sticker pack selector

### Recipient Experience
- [ ] Animated card reveal (full-screen)
- [ ] Wallet download button
- [ ] Card opened confirmation

## Design System Requirements

### Colors
Define primary, secondary, accent, neutral, and semantic colors (success, error, warning, info)

### Typography
- Font families
- Font sizes (mobile-first scale)
- Font weights
- Line heights
- Letter spacing

### Spacing
Consistent spacing scale (4px, 8px, 16px, 24px, 32px, 48px, 64px)

### Components
- Buttons (primary, secondary, tertiary, icon)
- Input fields (text, phone, date/time)
- Cards and containers
- Modals and overlays
- Navigation elements
- Loading states
- Error states

### Animations
- Transitions (duration, easing)
- Card reveal animations
- Micro-interactions
- Loading indicators

## Export Guidelines

### When exporting from Figma:

1. **Images/Icons**
   - Export as SVG for icons
   - Export as WebP for photos/illustrations
   - Use 2x resolution for retina displays
   - Optimize file sizes

2. **Components**
   - Use semantic naming (e.g., `Button/Primary`, `Input/Phone`)
   - Include all states (default, hover, active, disabled, error)
   - Document component props and variants

3. **Design Tokens**
   - Export as JSON or CSS variables
   - Follow naming convention: `--color-primary-500`, `--spacing-md`
   - Include dark mode variants if applicable

4. **Spacing/Layout**
   - Use Auto Layout in Figma for responsive designs
   - Document breakpoints (mobile: 375px, tablet: 768px, desktop: 1024px+)
   - Specify max-widths for content containers

## File Structure (After Export)

```
design/figma/
├── README.md
├── figma-integration.md (this file)
├── figma-make/
│   ├── components/          # Figma Make generated components
│   ├── screens/             # Full screen exports
│   └── figma-make.json      # Figma Make configuration
├── tokens/
│   ├── colors.json
│   ├── typography.json
│   ├── spacing.json
│   └── shadows.json
├── assets/
│   ├── icons/
│   ├── images/
│   └── illustrations/
└── specs/
    ├── component-specs.md   # Detailed component specifications
    └── interaction-specs.md # Animation and interaction details
```

## Next Steps

1. ✅ MCP Figma connection configured
2. ✅ Directory structure created
3. ⏳ Design screens in Figma
4. ⏳ Generate Figma Make file
5. ⏳ Export design tokens
6. ⏳ Integrate with React/Next.js codebase

## Notes

- The MCP Figma server allows programmatic access to Figma files
- Once designs are ready, we can automate asset exports
- Design tokens can be automatically synced to the codebase
- Component code from Figma Make will need adaptation to match our architecture
