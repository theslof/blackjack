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
  switch (card.suit) {
    case 'SPADES':
      return '♠'
    case 'HEARTS':
      return '♥'
    case 'DIAMONDS':
      return '♦'
    case 'CLUBS':
      return '♣'
  }
}
// Hint: Use card.suit and if/else or switch/case

/**
 * Return a string that only contains the card value text: A, 2-10, J, Q, K
 * @param {Card} card
 * @return {string}
 */
function getValueFromCard(card) {
  switch (card.value) {
    case 1:
      return 'A'
    case 11:
      return 'J'
    case 12:
      return 'Q'
    case 13:
      return 'K'
    default:
      return card.value.toString()
  }
}
// Hint: Use card.value and if/else or switch/case. Remember that 1 is an Ace, 11-13 is a face card (J, Q, K),
// and every other value is unchanged.

/**
 * Return a string that is humanly readable for a card, using the format "5♣", "Q♥", "10♦" and "A♠"
 * @param {Card} card
 * @return {string}
 */
function cardToString(card) {
  return getValueFromCard(card) + getSuitFromCard(card)
}
// Hint: Use the two previous functions to get the string representations for value and suit.

/**
 * Create a new deck containing one copy of each card, total of 52 cards
 * @return {Deck}
 */
function generateDeck() {
  const deck = []
  let suits = [
    'HEARTS',
    'CLUBS',
    'SPADES',
    'DIAMONDS',
  ]
  suits.forEach(suit => {
    for (let value = 1; value < 14; value++) {
      deck.push({suit, value})
    }
  })
  return deck
}
// Hint: Use two for-loops to generate 13 cards for each suit.

/**
 * Shuffles the cards in a deck
 * @param {Deck} deck
 */
function shuffleDeck(deck) {
  // We need to change the original deck, not just replace 'deck' completely.
  // First we move all cards over from the deck to a temporary deck:
  const copy = deck.splice(0, deck.length)
  // deck is now empty, all the cards are in copy

  // Now we take a random card from the copy and place it back into the original deck.
  // We run the loop while copy still contains cards
  while(copy.length) {
    // Select a random card position from the remaining cards in copy
    const randomIndex = Math.floor(Math.random() * copy.length)
    // Remove that card from copy, splice returns it inside an array
    const temp = copy.splice(randomIndex, 1)
    // Take the card out of the array and add it to the original deck
    deck.push(temp[0])
  }

  /*
  // Another method
  const copy = [...deck]

  deck.forEach((_, index) => {
    deck[index] = copy.splice(Math.floor(Math.random() * copy.length), 1)[0]
  })
   */
}
// Hint: You can't change the deck content by using 'card = randomisedDeck', you need to switch the elements' position.

/**
 * If the deck is empty, generate and shuffle a new deck.
 * Take the last card from the deck, remove it from the deck and return it.
 * @param {Deck} deck
 * @return {Card}
 */
function takeCard(deck) {
  if (deck.length === 0) {
    deck.push(...generateDeck())
    shuffleDeck(deck)
  }
  return deck.pop()
}
// Hint: Use the previous two functions to generate and shuffle a new deck, remember to save it in gameData.deck

/**
 * Count the value of the whole hand. An Ace(1) can be worth either 1 or 11, depending on what gives the highest total value for the hand without going Bust.
 * @param {Hand} hand
 * @return {number}
 */
function countHand(hand) {
  let sum = 0
  let aces = 0

  hand.forEach(card => {
    if (card.value === 1) {
      sum += 11
      aces++
    } else if (card.value > 10) {
      sum += 10
    } else {
      sum += card.value
    }
  })

  while(sum > 21 && aces > 0) {
    sum -= 10
    aces--
  }

  return sum
}
// Hint: Count the aces as 11, then remove 10 for each ace as long as the total is over 21

/**
 * Check if the hand has gone Bust
 * @param {Hand} hand
 * @return {boolean}
 */
function isBust(hand) {
  return countHand(hand) > 21
}
// Hint: Use the previous function to get the total value of the hand

/* ******************** *
 *  Gameplay functions  *
 * ******************** *

   The following functions are used to control the flow of gameplay.

   Since the tests use the setMessage* functions to verify game flow changing them will break the tests, so please do
   not modify them if you still intend to run the tests. They should be used in the later functions, though!
 */

/**
 * Set the text inside the message area to 'Press "Deal" to deal a new hand'
 */
function setMessageDeal() {
  messageArea.innerText = 'Press "Deal" to deal a new hand'
}
// Hint: You do not need to modify this function.

/**
 * Set the text inside the message area to 'Press "Hit" to deal a new card, or "Stand" to stop'
 */
function setMessageHitOrStand() {
  messageArea.innerText = 'Press "Hit" to deal a new card, or "Stand" to stop'
}
// Hint: You do not need to modify this function.

/**
 * Set the text inside the message area to 'You went bust! Total hand value was [value of hand]'
 */
function setMessageBust() {
  messageArea.innerText = `You went bust! Total hand was ${countHand(gameData.playerHand)}`
}
// Hint: You do not need to modify this function.

/**
 * Set the text inside the message area to 'Blackjack! 🎉'
 */
function setMessage21() {
  messageArea.innerText = 'Blackjack! 🎉'
}
// Hint: You do not need to modify this function.

/**
 * Set the text inside the message area to 'You stopped! Total hand value is [value of hand]'
 */
function setMessageStand() {
  messageArea.innerText = `You stopped! Total hand value is ${countHand(gameData.playerHand)}`
}
// Hint: You do not need to modify this function.

/**
 * Create and return a new card element, based on the suit and value of the card. <div class="card hearts">7♣</div>
 * @param {Card} card
 * @return {HTMLDivElement}
 */
function createCardElement(card) {
  const cardEl = document.createElement('div')
  cardEl.innerText = cardToString(card)
  cardEl.classList.add('card', card.suit.toLowerCase())
  return cardEl
}
// Hint: Use the document.createElement-function

/**
 * Add a card to the play area
 * @param {Card} card
 */
function addCardToPlayArea(card) {
  playArea.appendChild(createCardElement(card))
}
// Hint: Use the previous function to create the card element

/**
 * Clear the play area
 */
function clearPlayArea() {
  Array.from(playArea.childNodes).forEach(card => card.remove())
}
// Hint: All cards are childNodes of the play area element

/**
 * Show button by removing the 'hidden' class
 * @param {HTMLElement} button
 */
function showButton(button) {
  button.classList.remove('hidden')
}
// Hint: All elements have a classList

/**
 * Hide button by adding the 'hidden' class
 * @param {HTMLElement} button
 */
function hideButton(button) {
  button.classList.add('hidden')
}
// Hint: Same as the previous, but opposite

/**
 * Reset game board:
 * Clear play area, empty player hand and display "Deal" message. Only the Deal button should be visible.
 */
function onReset() {
  hideButton(buttonReset)
  hideButton(buttonHit)
  hideButton(buttonStand)
  showButton(buttonDeal)
  clearPlayArea()
  gameData.playerHand = []
  setMessageDeal()
}
// Hint: Use several previously defined functions

/**
 * Check if the player has gone bust. If they have, stop the game and show the bust message, only show Reset button.
 */
function checkForBust() {
  if (isBust(gameData.playerHand)) {
    hideButton(buttonHit)
    hideButton(buttonStand)
    showButton(buttonReset)
    setMessageBust()
  }
}
// Hint: Re-use the count function

/**
 * Check if the player got 21. If they have, stop the game and show the celebration message, only show the Reset button.
 */
function checkFor21() {
  if (countHand(gameData.playerHand) === 21) {
    hideButton(buttonHit)
    hideButton(buttonStand)
    showButton(buttonReset)
    setMessage21()
  }
}
// Hint: Similar to Bust

/**
 * Deal a card to the player. Display the hitOrStand message, only show the Hit and Stand buttons.
 * Check for 21 or Bust
 */
function onHit() {
  showButton(buttonHit)
  showButton(buttonStand)
  hideButton(buttonDeal)
  setMessageHitOrStand()
  const card = takeCard(gameData.deck)
  gameData.playerHand.push(card)
  addCardToPlayArea(card)
  checkFor21()
  checkForBust()
}
// Hint: Use the takeCard function and add the card to gameData.playerHand. Check for 21 and Bust at the very end

/**
 * Deal two cards to the player, display the hitOrStand message, only show the Hit and Stand buttons.
 * Check for 21 or Bust
 */
function onDeal() {
  const card = takeCard(gameData.deck)
  gameData.playerHand.push(card)
  addCardToPlayArea(card)
  onHit()
}
// Hint: onDeal is identical to onHit, but you draw one more card at the start

/**
 * Stop playing and display the stand message. Only show the reset button.
 */
function onStand() {
  hideButton(buttonHit)
  hideButton(buttonStand)
  showButton(buttonReset)
  setMessageStand()
}

// Here we simply export all of our functions so that they are available for testing. If you have filled in all
// functions so far correctly you should have a playable, although very basic, Blackjack game.

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
