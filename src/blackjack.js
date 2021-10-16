/*
  Welcome!

  Please fill in the functions you find in here to build the blackjack game. This is intended both as an exercise in
  programming as well as game development, so many of the functions are designed to use earlier functions. Due to this
  it is recommended that you start from the top and work your way down.

  If you would like the unicode characters for playing card, have a look here:
  https://en.wikipedia.org/wiki/Playing_cards_in_Unicode
  Using these you could expand upon this project to include visuals using the full cards, without relying on images.


  The rules for Blackjack are fairly simple:
    * The goal is to get a higher valued Hand than the Dealer without going Bust
    * Each player draws one card at a time until they get Blackjack (21), decide to Stand or they go Bust
    * You go Bust when the total value of your hand is more than 21
    * Numbered cards are worth the same as their number
    * Face cards -- Jack(11), Queen(12), King(13) -- are worth 10
    * Ace(1) is worth 1 or 11 depending on what is more beneficial
    * There is only one player and no Dealer for this implementation, but feel free to expand on the project

  A Card is represented by a JavaScript object with two properties, suit and value.
  The Seven of Clubs, or 7♣:
  {
    suit: 'CLUBS',
    value: 7,
  }

  A Deck is an array of Cards, and a new deck will contain one copy of all 52 cards.
  A Hand is also an array of Cards, but representing the cards a player is currently holding.
 */


/* **************** *
 *  JSDOC comments  *
 * **************** *

   These are used by many editors to give code hints and auto-completions. If your editor supports it they can be very
   helpful. You will see these before each function containing what parameters the function expects, as well as a short
   description of how they should work.

 */

/**
 * A standard playing card, with a suit and a value
 * @typedef Card
 * @property {number} value The value of the card, ranging from 1 (Ace) to 13 (King)
 * @property {'HEARTS'|'CLUBS'|'SPADES'|'DIAMONDS'} suit The suit of the card
 */

/**
 * A deck of cards
 * @typedef {Card[]} Deck
 */

/**
 * A hand of cards
 * @typedef {Card[]} Hand
 */


/* *********** *
 *  Variables  *
 * *********** */
/**
 * The game data, held in an object to simplify testing
 * @property {Hand} gameData.playerHand The player's hand
 * @property {Deck} gameData.deck The deck used by the Dealer to draw cards
 */
const gameData = {
  playerHand: [],
  deck: [],
}

/**
 * The main play area where cards are dealt
 * @type {HTMLElement}
 */
const playArea = document.querySelector('#play-area')

/**
 * The area where messages are displayed
 * @type {HTMLElement}
 */
const messageArea = document.querySelector('#message-area')

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

// Event listeners for all buttons
buttonReset.addEventListener('click', onReset)
buttonDeal.addEventListener('click', onDeal)
buttonHit.addEventListener('click', onHit)
buttonStand.addEventListener('click', onStand)

/* *********** *
 *  Functions  *
 * *********** */

/**
 * Return a string that only contains the unicode character for the card suit: ♣ ♥ ♦ ♠
 * @param {Card} card
 * @return {string}
 */
function getSuitFromCard(card) {
}

/**
 * Return a string that only contains the card value text: A, 2-10, J, Q, K
 * @param {Card} card
 * @return {string}
 */
function getValueFromCard(card) {
}

/**
 * Return a string that is humanly readable for a card, using the format "5♣", "Q♥", "10♦" and "A♠"
 * @param {Card} card
 * @return {string}
 */
function cardToString(card) {
}

/**
 * Create a new deck containing one copy of each card, total of 52 cards
 * @return {Deck}
 */
function generateDeck() {
}

/**
 * Shuffles the cards in a deck
 * @param {Deck} deck
 */
function shuffleDeck(deck) {
}

/**
 * If the deck is empty, generate and shuffle a new deck.
 * Take the last card from the deck, remove it from the deck and return it.
 * @param {Deck} deck
 * @return {Card}
 */
function takeCard(deck) {
}

/**
 * Count the value of the whole hand. An Ace(1) can be worth either 1 or 11, depending on what gives the highest total value for the hand without going Bust.
 * @param {Hand} hand
 * @return {number}
 */
function countHand(hand) {
}

/**
 * Check if the hand has gone Bust
 * @param {Hand} hand
 * @return {boolean}
 */
function isBust(hand) {
}

/* ******************** *
 *  Gameplay functions  *
 * ******************** *

   The following functions are used to control the flow of gameplay. Due to limitations in my test framework and the
   various ways of solving each step it's very difficult to test that these are correctly implemented.
 */

/**
 * Set the text inside the message area to 'Press "Deal" to deal a new hand'
 */
function setMessageDeal() {
  messageArea.innerText = 'Press "Deal" to deal a new hand'
}

/**
 * Set the text inside the message area to 'Press "Hit" to deal a new card, or "Stand" to stop'
 */
function setMessageHitOrStand() {
  messageArea.innerText = 'Press "Hit" to deal a new card, or "Stand" to stop'
}

/**
 * Set the text inside the message area to 'You went bust! Total hand value was [value of hand]'
 */
function setMessageBust() {
  messageArea.innerText = `You went bust! Total hand was ${countHand(gameData.playerHand)}`
}

/**
 * Set the text inside the message area to 'Blackjack! 🎉'
 */
function setMessage21() {
  messageArea.innerText = 'Blackjack! 🎉'
}

/**
 * Set the text inside the message area to 'You stopped! Total hand value is [value of hand]'
 */
function setMessageStand() {
  messageArea.innerText = `You stopped! Total hand value is ${countHand(gameData.playerHand)}`
}

/**
 * Create and return a new card element, based on the suit and value of the card. <div class="card hearts">7♣</div>
 * @param {Card} card
 * @return {HTMLDivElement}
 */
function createCardElement(card) {
}

/**
 * Clear the play area
 */
function clearPlayArea() {
}

/**
 * Add a card to the play area
 * @param {Card} card
 */
function addCardToPlayArea(card) {
}

/**
 * Show button by removing the 'hidden' class
 * @param {HTMLElement} button
 */
function showButton(button) {
}

/**
 * Hide button by adding the 'hidden' class
 * @param {HTMLElement} button
 */
function hideButton(button) {
}

/**
 * Check if the player has gone bust. If they have, stop the game and show the bust message
 */
function checkForBust() {
}

/**
 * Check if the player got 21. If they have, stop the game and show the celebration message
 */
function checkFor21() {
}

/**
 * Reset game board:
 * Empty play area
 * Empty player hand
 * Display "Deal" message
 */
function onReset() {
}

/**
 * Deal a card to the player and then check for Blackjack or Bust
 */
function onHit() {
}

/**
 * Deal two cards to the player
 */
function onDeal() {
}

/**
 * Stop playing and display the stand message
 */
function onStand() {
}

// Here we simply export all of our functions so that they are available for testing.
module.exports = {
  getSuitFromCard,
  getValueFromCard,
  cardToString,
  generateDeck,
  shuffleDeck,
  takeCard,
  countHand,
  isBust,

  createCardElement,
  clearPlayArea,
  addCardToPlayArea,
  showButton,
  hideButton,

  checkForBust,
  checkFor21,
  onReset,
  onDeal,
  onHit,
  onStand,

  buttonStand,
  buttonHit,
  buttonReset,
  buttonDeal,

  messageArea,
  playArea,
  gameData,
}
