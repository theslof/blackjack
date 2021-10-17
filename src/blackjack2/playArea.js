export default class PlayArea {
  /**
   * @private {HTMLElement}
   */
  _playArea

  /**
   * Create a new PlayArea
   * @param {HTMLElement} element
   */
  constructor(element) {
    this._playArea = element
  }

  /**
   * Create a new DIV element based on a card
   * @param {Card} card
   * @return {HTMLDivElement}
   */
  static createCardElement(card) {
    const cardEl = document.createElement('div')
    cardEl.className = `card ${card.getSuit().toLowerCase()}`
    cardEl.innerText = card.toUnicodeCard()
    return cardEl
  }

  /**
   * Add a card to the PlayArea
   * @param {Card} card
   */
  addCard(card) {
    this._playArea.appendChild(PlayArea.createCardElement(card))
  }

  /**
   * Clear all cards from the PlayArea
   */
  clear() {
    Array.from(this._playArea.childNodes).forEach(node => node.remove())
  }
}
