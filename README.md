# SOS Game – React Native

A simple SOS board game developed with **React Native and TypeScript**, featuring AI agents powered by the **Minimax algorithm with Alpha-Beta Pruning** and heuristic evaluation functions.

The project explores how different heuristic strategies affect AI decision-making in a turn-based game.

## Game Modes

The game offers three different modes:

- **Single Player (Human vs AI):** Play against an AI agent. Switch between two heuristic functions (H1 and H2) to change the AI's strategy.
- **Multiplayer (Human vs Human):** Play against another human player on the same device.
- **AI vs AI:** Watch two AI agents compete against each other. The first agent uses H1, while the second uses H2.

## Board Sizes

Choose between three board sizes:

- 3x3
- 4x4
- 5x5

## How to Play

SOS is a turn-based board game where players take turns selecting an empty cell and placing either **S** or **O**.

- A player earns one point for every SOS sequence formed.
- SOS sequences can be created horizontally, vertically, or diagonally.
- Multiple SOS sequences can be formed with a single move, earning multiple points.
- The game ends when all cells are filled.
- The player with the highest score wins. Equal scores result in a draw.

## AI Implementation

The AI agents use the **Minimax algorithm with Alpha-Beta Pruning** to evaluate possible moves and select the most promising one.

Two heuristic evaluation functions are implemented:

- **H1 – Score-Based Heuristic:** Evaluates a game state based on the difference between the AI's score and the opponent's score.

- **H2 – Strategic Heuristic:** Uses the score difference as its primary evaluation factor and additionally rewards placing the letter **S** in corners and edges of the board.

In AI vs AI mode, both heuristic strategies compete against each other, allowing their decision-making approaches to be compared.

The search depth is dynamically adjusted in AI vs AI mode depending on the number of empty cells remaining on the board.

## Technologies Used

- React Native
- TypeScript
- Redux
- React Navigation
- i18next (English and Turkish language support)
- Minimax Algorithm
- Alpha-Beta Pruning
- Heuristic Evaluation Functions

## Features

- Three game modes
- Three selectable board sizes
- Two interchangeable AI heuristic strategies
- AI vs AI gameplay
- Automatic SOS detection in all directions
- Score tracking and winner determination
- English and Turkish language support
- Game restart and main menu navigation

---

# Getting Started

Follow these instructions to set up and run the project locally.

## Prerequisites

Before running the project, make sure you have installed:

- [Node.js](https://nodejs.org/)
- npm (included with Node.js) or Yarn
- [React Native development environment](https://reactnative.dev/docs/set-up-your-environment)
- Android Studio and an Android Emulator (for Android)
- Xcode and CocoaPods (for iOS, macOS only)

## Installation

**1. Clone the repository**

```bash
git clone https://github.com/BetulAygunoglu/sosGame.git
```

**2. Navigate to the project directory**

```bash
cd sosGame
```

**3. Install dependencies**

Using npm:

```bash
npm install
```

Or using Yarn:

```bash
yarn install
```

## Running the Application

**1. Start Metro**

Open a terminal in the project root and run:

```bash
npm start
```

Or:

```bash
yarn start
```

**2. Run on Android**

Open another terminal in the project root and execute:

```bash
npm run android
```

Or:

```bash
yarn android
```

**3. Run on iOS**

First, install the CocoaPods dependencies:

```bash
cd ios
bundle install
bundle exec pod install
cd ..
```

Then run:

```bash
npm run ios
```

Or:

```bash
yarn ios
```

Make sure Metro is running before launching the application.

## Troubleshooting

If you encounter any problems during installation or execution, check the official [React Native Troubleshooting Guide](https://reactnative.dev/docs/troubleshooting).

---

## Project Purpose

The main purpose of this project is to implement and explore **AI decision-making using the Minimax algorithm and heuristic evaluation functions** in a simple board game environment.

By comparing two different heuristic strategies, the project demonstrates how evaluation functions can influence an AI agent's decisions and gameplay performance.