/*

  Hello!

  These are the unit tests used to test that each function has been implemented correctly.



 */









const assert = require('assert')
const blackjack = require('../src/blackjack.js')

// ♣ ♥ ♦ ♠
const suits = {
  CLUBS: '♣',
  HEARTS: '♥',
  DIAMONDS: '♦',
  SPADES: '♠',
}

const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']

function getDeck() {
  const deck = []
  Object.keys(suits).forEach(suit => {
    values.forEach((text, value) => {
      deck.push({ suit, value: value + 1 })
    })
  })
  return deck
}

function isCard(card) {
  return typeof card.suit === 'string' && typeof card.value === 'number' && suits[card.suit] && card.value > 0 && card.value < 14
}

describe('Blackjack', function () {
  describe('getSuitFromCard', function() {
    it('should return the correct unicode character for each suit', function () {
      Object.keys(suits).forEach(suit => assert.equal(blackjack.getSuitFromCard({ suit, value: 1 }), suits[suit]))
    })
  })

  describe('getValueFromCard', function() {
    it('should return the correct value string for each value', function () {
      values.forEach((text, value) => assert.equal(blackjack.getValueFromCard({ suit: "CLUBS", value: value + 1 }), text))
    })
  })

  describe('cardToString', function() {
    it('should convert each card to the correct string', function () {
      getDeck().forEach(card => {
        assert.equal(blackjack.cardToString(card), `${values[card.value - 1]}${suits[card.suit]}`)
      })
    })
  })

  describe('generateDeck', function() {
    it('should return a deck containing one copy of each card', function () {
      const deck = blackjack.generateDeck()
      let err
      assert(deck.every(isCard), 'generateDeck created invalid cards')
      assert(getDeck().every(card => {
        return deck.find(c => {
          if (c.suit === card.suit && c.value === card.value) return true
          err = card
        })
      }), `Did not find card ${values[err.value - 1]}${suits[err.suit]}`)
    })
  })

  describe('shuffleDeck', function() {
    it('should shuffle the order of the cards in a deck', function () {
      const deck = getDeck()
      const copy = deck.map(card => ({...card}))
      blackjack.shuffleDeck(deck)
      copy.forEach(card => {
        assert(deck.find(c => card.value === c.value && card.suit === c.suit), 'Some cards are missing after shuffling')
      })
      assert(!deck.every((card, index) => {
        const c = copy[index]
        return card.value === c.value && card.suit === c.suit
      }), 'Cards have not been shuffled')
    })
  })

  describe('takeCard', function() {
    it('should remove and return the top card of the deck', function () {
      const deck = getDeck()
      const first = deck[0]
      const last = deck[deck.length - 1]
      const card = blackjack.takeCard(deck)
      assert(deck.length === 51, 'Deck has the incorrect number of cards')
      assert(card === last || card === first, 'Didn\'t remove the top card of the deck')
    })
  })

  describe('countHand', function() {
    it('should return the correct value for a hand', function () {
      const hand = [
        { suit: 'CLUBS', value: 2 },
        { suit: 'CLUBS', value: 5 },
        { suit: 'CLUBS', value: 6 },
      ]
      assert.equal(blackjack.countHand(hand), 13)
    })

    it('should return the correct value for face cards', function () {
      assert.equal(blackjack.countHand([{ suit: 'CLUBS', value: 11 }]), 10)
      assert.equal(blackjack.countHand([{ suit: 'CLUBS', value: 12 }]), 10)
      assert.equal(blackjack.countHand([{ suit: 'CLUBS', value: 13 }]), 10)
    })

    it('should return the correct value for aces', function () {
      assert.equal(blackjack.countHand([{ suit: 'CLUBS', value: 1 }]), 11)
      assert.equal(blackjack.countHand([{ suit: 'CLUBS', value: 1 }, { suit: 'HEARTS', value: 13 }]), 21)
      assert.equal(blackjack.countHand([{ suit: 'CLUBS', value: 1 }, { suit: 'HEARTS', value: 1 }]), 12)
      assert.equal(blackjack.countHand([{ suit: 'CLUBS', value: 1 }, { suit: 'HEARTS', value: 13 }, { suit: 'HEARTS', value: 10 }]), 21)
      assert.equal(blackjack.countHand([{ suit: 'CLUBS', value: 1 }, { suit: 'HEARTS', value: 13 }, { suit: 'HEARTS', value: 10 }, { suit: 'HEARTS', value: 1 }]), 22)
    })
  })

  describe('isBust', function() {
    it('should correctly check if a hand has gone bust or not', function () {
      assert.equal(blackjack.isBust([{ suit: 'CLUBS', value: 2 }, { suit: 'HEARTS', value: 4 }, { suit: 'HEARTS', value: 5 }, { suit: 'HEARTS', value: 6 }]), false, '17')
      assert.equal(blackjack.isBust([{ suit: 'CLUBS', value: 1 }, { suit: 'HEARTS', value: 13 }]), false, '21')
      assert.equal(blackjack.isBust([{ suit: 'CLUBS', value: 1 }, { suit: 'HEARTS', value: 1 }]), false, '12')
      assert.equal(blackjack.isBust([{ suit: 'CLUBS', value: 10 }, { suit: 'HEARTS', value: 3 }, { suit: 'HEARTS', value: 12 }]), true, '23')
    })
  })
})
