/**
 * A player in a game of Blackjack
 * @class Player
 */
export default class Player {
  /**
   * @private {Card[]}
   */
  _hand

  /**
   * @private {number}
   */
  _score

  /**
   * Return a new Blackjack Player
   */
  constructor() {
    this._hand = []
    this._score = 0
  }

  /**
   * Get the current hand of the player
   * @return {Card[]}
   */
  getHand() {
    return [...this._hand]
  }

  /**
   * Empty the player's hand and return the cards that were removed
   * @return {Card[]}
   */
  clearHand() {
    const hand = this._hand
    this._hand = []
    return hand
  }

  /**
   * Add a card to the player's hand
   * @param {Card} card
   */
  addCardToHand(card) {
    this._hand.push(card)
  }

  /**
   * Count the value of the player's hand
   * @return {number}
   */
  countHand() {
    let sum = 0
    let aces = 0

    this._hand.forEach(card => {
      if (card.getValue() === 1) {
        sum += 11
        aces++
      } else if (card.getValue() > 10) {
        sum += 10
      } else {
        sum += card.getValue()
      }
    })

    while(sum > 21 && aces > 0) {
      sum -= 10
      aces--
    }

    return sum
  }

  /**
   * Check if the player is bust
   * @return {boolean}
   */
  isBust() {
    return this.countHand() > 21
  }

  /**
   * Check if the player has Blackjack
   * @return {boolean}
   */
  hasBlackjack() {
    return this.countHand() === 21
  }

  /**
   * Get the player's score
   * @return {number}
   */
  getScore() {
    return this._score
  }

  /**
   * Modify the player's score by the specified value
   * @param value
   */
  increaseScore(value) {
    this._score += value
  }
}
