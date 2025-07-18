# D&D 5e Experience Calculator

A modern, medieval fantasy-themed web application for calculating experience points using a custom D&D 5e experience system. Built with React, TypeScript, and Vite.

## ✨ Features

- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Party Management**: Support for 1-20 players with shared or individual character tracking
- **Dynamic Calculations**: Automatic XP calculation and division among party members
- **Custom Experience System**: Based on character development and meaningful gameplay moments
- **Interactive UI**: Medieval fantasy theme with smooth animations and hover effects
- **Flexible Events**: Support for multiple occurrences of the same event type
- **Custom Modifiers**: Add your own custom achievements and XP multipliers

## 🎯 Experience System Overview

This calculator implements a custom D&D 5e experience system focused on character development and meaningful gameplay rather than just combat encounters. The system rewards:

### Base Experience
- **Session Completion**: Level × 100 XP (automatically awarded)
- **Encounters**: DM-determined XP for overcome challenges
- **Short-term Goals**: Level × 200 XP when at least one character completes a goal

### Character Development (Level × 25 XP each)
- Attuning to new magic items
- Invoking Bond, Ideal, or Flaw meaningfully during gameplay
- Developing relationships in meaningful ways (NPC or PC)
- Discovering interesting, useful, or secret lore
- Using skills/spells creatively to solve problems
- Undertaking perilous journeys
- Experiencing significant failures with consequences
- Making major impacts in the world or local area

### Session Discussion
At the end of each session, the group should discuss these achievements together. The DM guides players to explain their reasoning, and players should be honest about their character's growth. When in doubt, the group majority decides.

## 🛠️ Installation & Setup

### Prerequisites
Make sure you have Node.js (v16 or higher) and npm installed:
```bash
node --version
npm --version
```

### Step 1: Create the Project
```bash
# Create a new Vite project with React and TypeScript
npm create vite@latest dnd-xp-calculator -- --template react-ts
cd dnd-xp-calculator
```

### Step 2: Install Dependencies
```bash
# Install base dependencies
npm install

# Install Lucide React for icons
npm install lucide-react
```

### Step 3: Run the Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 📁 Project Structure
```
dnd-xp-calculator/
├── public/
│   └── vite.svg
├── src/
│   ├── App.tsx     # Main application component
│   ├── App.css     # Application styles
│   └── main.tsx    # React entry point
├── index.html
├── package.json
└── vite.config.ts
```

## 🎮 Usage Guide

### Party Setup
1. **Number of Players**: Set the total number of party members (1-20)
2. **Shared Party Level**: Toggle between shared party level or individual character tracking
   - **Shared**: All characters are the same level
   - **Individual**: Each character has their own name and level

### Session Events
Check off events that occurred during the session:
- **Session Completion**: Always check this at the end
- **Encounters**: Enter the total XP from combat/challenges
- **Short-term Goals**: Check if any character completed a goal
- **Character Development**: Check events that occurred, set count for multiple occurrences

### Custom Modifiers
Add your own custom achievements:
- Enter a description of the achievement
- Set the level multiplier (0-10)
- Set the count for multiple occurrences

### Results
The calculator automatically:
- Calculates total XP earned
- Divides by the number of party members
- Shows XP per player (shared mode) or individual totals

## 🎨 Customization

### Styling
The app uses custom CSS with a medieval fantasy theme:
- **Colors**: Amber/orange palette for warmth
- **Effects**: Glassmorphism with backdrop blur
- **Icons**: Lucide React icons for medieval theme

### Adding New Events
To add new event types, update the `eventDescriptions` array in the component:
```typescript
{ 
  key: 'newEvent', 
  icon: <IconComponent className="event-icon" />, 
  text: 'Description (Level × X XP)', 
  multiplier: 25, 
  allowMultiple: true 
}
```

## 🚀 Build for Production

```bash
# Build the application
npm run build

# Preview the production build
npm run preview
```

The built files will be in the `dist/` directory, ready for deployment.

## 📱 Browser Support

- Chrome/Edge: 90+
- Firefox: 88+
- Safari: 14+
- Mobile browsers: iOS Safari 14+, Chrome Mobile 90+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🎲 About the Experience System

This experience system encourages:
- **Character Development**: Rewarding growth beyond just combat
- **Meaningful Roleplay**: Invoking character traits and developing relationships
- **Creative Problem Solving**: Using skills and spells in interesting ways
- **Collaborative Storytelling**: Group discussion about achievements
- **Risk-Taking**: Rewarding both success and meaningful failure

The system promotes a more narrative-focused D&D experience where character growth comes from engaging with the world and developing as a person, not just defeating monsters.

## 🔧 Troubleshooting

### Common Issues
1. **Styles not loading**: Ensure `src/App.css` is imported in `App.tsx`
2. **Icons not displaying**: Check that `lucide-react` is properly installed
3. **TypeScript errors**: Ensure all dependencies are installed and tsconfig.json is properly configured

### Development Tools
- **VS Code Extensions**: ES7+ React/Redux/React-Native snippets
- **Browser DevTools**: React Developer Tools extension for debugging

---

*May your adventures be legendary and your experience points well-earned!* ⚔️✨