import Card, {SUITS} from "./card.js";

/**
 * A standard deck of playing cards, four suits of 13 cards, for a total of 52 unique cards
 * @class Deck
 */
export default class Deck {
  /**
   * @private {Card[]} _card
   */
  _cards

  /**
   * @return {Card[]}
   * @private
   */
  static _generateDeck() {
    const cards = []
    SUITS.forEach(suit => {
      for (let value = 1; value < 14; value++) {
        cards.push(new Card(value, suit))
      }
    })
    return cards
  }

  /**
   * Create a deck of cards
   */
  constructor() {
    this._cards = Deck._generateDeck()
  }

  /**
   * Return the size of the deck
   * @return {number}
   */
  size() {
    return this._cards.length
  }

  setCards(cards) {
    this._cards = [...cards]
  }

  /**
   * Get an array of all cards in the deck
   * @return {Card[]}
   */
  getCards() {
    return [...this._cards]
  }

  /**
   * Take one card from the deck
   * @return {Card}
   */
  deal() {
    if (this.size() === 0) {
      this._cards = Deck._generateDeck()
      this.shuffle()
    }
    return this._cards.pop()
  }

  /**
   * Shuffles the order of the cards in the deck
   * @return {Deck}
   */
  shuffle() {
    const cards = this.getCards()
    const shuffled = []
    while(cards.length) {
      shuffled.push(cards.splice(Math.floor(Math.random() * cards.length), 1)[0])
    }
    this.setCards(shuffled)
    return this
  }
}
