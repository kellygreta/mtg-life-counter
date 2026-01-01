# Magic: The Gathering – Life Counter ⚡

A modern, responsive life counter app for Magic: The Gathering games, built with React + Vite and styled with Tailwind CSS.

Perfect for tracking life totals during MTG games with 2-4 players, featuring an intuitive interface optimized for tablet play and cross-table visibility.

## 🚀 Features

- **Configurable Setup Screen**

  - Choose number of players: 2, 3, or 4
  - Select starting life total: 20, 25, 30, or 40 (for Standard, Commander, etc.)

- **Adaptive Responsive Layouts**

  - **2 Players**: Split-screen with 180° rotation for opposite player
  - **3 Players**: Asymmetric layout (one player full-height, two split)
  - **4 Players**: Four-quadrant grid with top players rotated

- **Intuitive Life Tracking**

  - Large, readable life totals
  - Quick increment/decrement buttons (+1/-1)
  - Color-coded player zones (yellow, pink, purple, blue)
  - Central menu button for easy access

- **Touch-Optimized UI**
  - Large tap targets for easy interaction
  - Responsive design works on phones, tablets, and desktop
  - Smooth animations and visual feedback

## 🛠️ Technologies

- **React** – Component-based UI
- **Vite** – Fast build tool and dev server
- **Tailwind CSS** – Utility-first styling
- **Lucide React** – Icon library

## 🎯 Usage

1. Open the app and configure your game:
   - Select number of players (2-4)
   - Choose starting life total (20, 25, 30, 40)
2. Click "Start Game"
3. Use the + and - buttons to adjust life totals
4. Click the center menu button to return to setup

## 📱 Recommended Setup

For the best experience:

- Use on a tablet placed in the center of the table
- Enable auto-rotate lock for stable orientation
- Each player can easily read their counter from their seat

## 🔮 Future Enhancements

- [ ] Commander damage tracking
- [ ] Poison counter support
- [ ] Game history and statistics
- [ ] Custom player names and colors
- [ ] Energy counter tracking
- [ ] Dice roller integration

## 📚 Notes

- The app uses in-memory state management (no backend required)
- All data resets when returning to setup screen

---

<sub> This project is unofficial Fan Content permitted under the Fan Content Policy. Not approved/endorsed by Wizards. Portions of the materials used are property of Wizards of the Coast. ©Wizards of the Coast LLC. </sub>
