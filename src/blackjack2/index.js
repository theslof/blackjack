import Deck from "./deck.js";
import Player from "./player.js";
import PlayArea from "./playArea.js";

const GAME_STATES = {
  DEAL: 0,
  HIT: 1,
  BUST: 2,
  BLACKJACK: 3,
  STAND: 4,
}

/**
 * The main play area where cards are dealt
 * @type {HTMLElement}
 */
const playAreaElement = document.querySelector('#play-area')

/**
 * The area where messages are displayed
 * @type {HTMLElement}
 */
const messageAreaElement = document.querySelector('#message-area')

/**
 * Reset button
 * @type {HTMLDivElement}
 */
const buttonReset = document.querySelector('#button__reset')

/**
 * Deal button
 * @type {HTMLDivElement}
 */
const buttonDeal = document.querySelector('#button__deal')

/**
 * Hit button
 * @type {HTMLDivElement}
 */
const buttonHit = document.querySelector('#button__hit')

/**
 * Stand button
 * @type {HTMLDivElement}
 */
const buttonStand = document.querySelector('#button__stand')

/**
 * Score element
 * @type {HTMLSpanElement}
 */
const scoreElement = document.querySelector('#score')

const playArea = new PlayArea(playAreaElement)
const deck = new Deck().shuffle()
const player = new Player()

buttonReset.addEventListener('click', resetGame)
buttonDeal.addEventListener('click', deal)
buttonHit.addEventListener('click', addCard)
buttonStand.addEventListener('click', stand)

setState(GAME_STATES.DEAL)

function deal() {
  const card = deck.deal()
  player.addCardToHand(card)
  playArea.addCard(card)
  messageAreaElement.innerText = 'Deal or stand'
  setState(GAME_STATES.HIT)
  addCard()
}

function addCard() {
  const card = deck.deal()
  player.addCardToHand(card)
  playArea.addCard(card)

  if (player.isBust()) {
    document.querySelector('#message-area').innerText = 'Bust!'
    player.increaseScore(-1)
    setState(GAME_STATES.BUST)
  } else if (player.hasBlackjack()) {
    document.querySelector('#message-area').innerText = 'Blackjack!'
    player.increaseScore(1)
    setState(GAME_STATES.BLACKJACK)
  }
}

function resetGame() {
  playArea.clear()
  player.clearHand()
  messageAreaElement.innerText = 'Press "Deal" to deal a new hand'
  setState(GAME_STATES.DEAL)
}

function stand() {
  messageAreaElement.innerText = `You got ${player.countHand()}`
  player.increaseScore(player.countHand() >= 17 ? 1 : -1)
  setState(GAME_STATES.STAND)
}

/**
 * @param {number} state
 */
function setState(state) {
  switch (state) {
    case GAME_STATES.DEAL:
      showButton(buttonDeal)
      hideButton(buttonHit)
      showButton(buttonStand)
      hideButton(buttonReset)
      break
    case GAME_STATES.HIT:
      hideButton(buttonDeal)
      showButton(buttonHit)
      showButton(buttonStand)
      hideButton(buttonReset)
      break
    case GAME_STATES.BUST:
    case GAME_STATES.BLACKJACK:
    case GAME_STATES.STAND:
      hideButton(buttonDeal)
      hideButton(buttonHit)
      hideButton(buttonStand)
      showButton(buttonReset)
  }

  updateScore()
}

function updateScore() {
  scoreElement.innerText = player.getScore().toString()
}

/**
 * Show button by removing the 'hidden' class
 * @param {HTMLElement} button
 */
function showButton(button) {
  button.classList.remove('hidden')
}

/**
 * Hide button by adding the 'hidden' class
 * @param {HTMLElement} button
 */
function hideButton(button) {
  button.classList.add('hidden')
}
