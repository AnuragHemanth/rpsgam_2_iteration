// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// Import the Firebase module and Firestore
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, setDoc, doc, onSnapshot } from "firebase/firestore";

// Your Firebase project configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_M

const firebaseConfig = {
  apiKey: "AIzaSyA5_YqspIRzh_vTXmbhXEzEPDU_ghylvtc",
  authDomain: "game-4c5b9.firebaseapp.com",
  projectId: "game-4c5b9",
  storageBucket: "game-4c5b9.firebasestorage.app",
  messagingSenderId: "367522403546",
  appId: "1:367522403546:web:f3abba1d6cfb1ef7fa01e3",
  measurementId: "G-KLFE91QVJG"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const emotes = {
  rock: '<i class="fas fa-hand-rock"></i>',
  paper: '<i class="fas fa-hand-paper"></i>',
  scissors: '<i class="fas fa-hand-scissors"></i>',
  lizard: '<i class="fas fa-hand-lizard"></i>',
  spock: '<i class="fas fa-hand-spock"></i>'
};

let player1Score = 0;
let player2Score = 0;
let currentPlayer = Math.random() < 0.5 ? "player1" : "player2";
let gameId = prompt("Enter game ID to join or create a new one");

const RULES = {
  rock: ["scissors", "lizard"],
  paper: ["rock", "spock"],
  scissors: ["paper", "lizard"],
  lizard: ["spock", "paper"],
  spock: ["scissors", "rock"]
};

const moveSound = document.getElementById("move-sound");
const winSound = document.getElementById("win-sound");
const loseSound = document.getElementById("lose-sound");
const shieldSound = document.getElementById("shield-sound");

// Listen to game state changes in Firebase
db.collection("games").doc(gameId).onSnapshot(doc => {
  const gameData = doc.data();
  if (gameData) {
      // Display the opponent's move
      if (gameData.player1Move) document.getElementById("player1-emote").innerHTML = emotes[gameData.player1Move];
      if (gameData.player2Move) document.getElementById("player2-emote").innerHTML = emotes[gameData.player2Move];
      
      // Check if both moves are made
      if (gameData.player1Move && gameData.player2Move) {
          determineWinner(gameData.player1Move, gameData.player2Move);
          resetGame();
      }
  }
});

function chooseMove(move) {
  moveSound.play();

  // Store move to Firebase based on player
  if (currentPlayer === "player1") {
      db.collection("games").doc(gameId).set({ player1Move: move }, { merge: true });
  } else {
      db.collection("games").doc(gameId).set({ player2Move: move }, { merge: true });
  }

  document.getElementById(`${currentPlayer}-emote`).innerHTML = emotes[move];
}

function determineWinner(player1Move, player2Move) {
  let resultText;
  if (player1Move === player2Move) {
      shieldSound.play();
      resultText = "It's a tie!";
  } else if (RULES[player1Move].includes(player2Move)) {
      player1Score++;
      winSound.play();
      resultText = "Player 1 wins this round!";
  } else {
      player2Score++;
      loseSound.play();
      resultText = "Player 2 wins this round!";
  }

  updateScores(resultText);
}

function updateScores(resultText) {
  document.getElementById("player1-score").innerText = `Player 1 Score: ${player1Score}`;
  document.getElementById("player2-score").innerText = `Player 2 Score: ${player2Score}`;
  document.getElementById("result").innerText = resultText;
}

function resetGame() {
  db.collection("games").doc(gameId).update({ player1Move: null, player2Move: null });
}
