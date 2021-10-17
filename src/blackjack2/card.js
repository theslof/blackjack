/**
 * The suit of the card
 * @typedef {'HEARTS'|'CLUBS'|'SPADES'|'DIAMONDS'} Suit
 */

/**
 * The value of the card, ranging from 1 (Ace) to 13 (King)
 * @typedef {number} Value
 */

/**
 * @type {Suit[]}
 */
export const SUITS = ['HEARTS', 'CLUBS', 'SPADES', 'DIAMONDS']

const UNICODE_CARD_BASES = {
  SPADES: 0x1F0A0,
  HEARTS: 0x1F0B0,
  DIAMONDS: 0x1F0C0,
  CLUBS: 0x1F0D0,
}

/**
 * A standard playing card, with a suit and a value
 * @class Card
 */
export default class Card {

  /**
   * @private {Suit}
   */
  _suit
  /**
   * @private {Value}
   */
  _value

  /**
   * Create a card
   * @constructor
   * @param {Value} value
   * @param {Suit} suit
   */
  constructor(value, suit) {
    this.setSuit(suit)
    this.setValue(value)
  }

  /**
   * Set the suit parameter
   * @param {Suit} suit
   */
  setSuit(suit) {
    if (!(typeof suit === 'string' && SUITS.includes(suit))) {
      throw new Error('Invalid value for suit')
    }
    this._suit = suit
  }

  /**
   * Get the suit parameter
   * @return {Suit}
   */
  getSuit() {
    return this._suit
  }

  /**
   * Set the value parameter
   * @param {Value} value
   */
  setValue(value) {
    if (!(typeof value === 'number' && value >= 1 && value <= 13)) {
      throw new Error('Value is outside valid range')
    }
    this._value = value
  }

  /**
   * Get the suit parameter
   * @return {Value}
   */
  getValue() {
    return this._value
  }

  /**
   * Return a string that only contains the unicode character for the card suit: ♣ ♥ ♦ ♠
   * @return {string}
   */
  getSuitAsString() {
    switch (this.getSuit()) {
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

  /**
   * Return a string that only contains the card value text: A, 2-10, J, Q, K
   * @return {string}
   */
  getValueAsString() {
    switch (this.getValue()) {
      case 1:
        return 'A'
      case 11:
        return 'J'
      case 12:
        return 'Q'
      case 13:
        return 'K'
      default:
        return this.getValue().toString()
    }
  }

  /**
   * Return a string that is humanly readable for a card, using the format "5♣", "Q♥", "10♦" and "A♠"
   * @return {string}
   */
  toString() {
    return `${this.getValueAsString()}${this.getSuitAsString()}`
  }

  toUnicodeCard() {
    return eval(`'\\u{${Number(UNICODE_CARD_BASES[this.getSuit()] + this.getValue()).toString(16)}}'`)
  }
}
