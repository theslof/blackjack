/*

  Hello!

  These are the unit tests used to test that each function has been implemented correctly.

 */

const {JSDOM} = require('jsdom')
global.window = new JSDOM(`<div id="board">
  <header>
    <h1>Blackjack</h1>
  </header>

  <section id="play-area">
  </section>

  <section id="message-area">
    Press "Deal" to deal a new hand
  </section>

  <section class="buttons">
    <div id="button__reset" class="button hidden">Reset</div>
    <div id="button__deal" class="button">Deal</div>
    <div id="button__hit" class="button hidden">Hit</div>
    <div id="button__stand" class="button hidden">Stand</div>
  </section>
</div>`).window
global.document = global.window.document

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
      deck.push({suit, value: value + 1})
    })
  })
  return deck
}

function getCard() {
  return {
    suit: Object.keys(suits)[Math.floor(Math.random() * 4)],
    value: Math.ceil(Math.random() * 13)
  }
}

function isCard(card) {
  return typeof card.suit === 'string' && typeof card.value === 'number' && suits[card.suit] && card.value > 0 && card.value < 14
}

function resetGame() {
  blackjack.onReset()
  blackjack.gameData.deck = getDeck()
  blackjack.buttonReset.classList.add('hidden')
  blackjack.buttonDeal.classList.add('hidden')
  blackjack.buttonHit.classList.remove('hidden')
  blackjack.buttonStand.classList.remove('hidden')
  blackjack.messageArea.innerText = 'test'
}

describe('Blackjack', function () {
  describe('Utility functions', function () {
    describe('getSuitFromCard', function () {
      it('should return the correct unicode character for each suit', function () {
        Object.keys(suits).forEach(suit => assert.equal(blackjack.getSuitFromCard({suit, value: 1}), suits[suit]))
      })
    })

    describe('getValueFromCard', function () {
      it('should return the correct value string for each value', function () {
        values.forEach((text, value) => assert.equal(blackjack.getValueFromCard({
          suit: "CLUBS",
          value: value + 1
        }), text))
      })
    })

    describe('cardToString', function () {
      it('should convert each card to the correct string', function () {
        getDeck().forEach(card => {
          assert.equal(blackjack.cardToString(card), `${values[card.value - 1]}${suits[card.suit]}`)
        })
      })
    })

    describe('generateDeck', function () {
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

    describe('shuffleDeck', function () {
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

    describe('takeCard', function () {
      it('should remove and return the top card of the deck', function () {
        const deck = getDeck()
        const last = deck[deck.length - 1]
        const card = blackjack.takeCard(deck)
        assert(deck.length === 51, 'Deck has the incorrect number of cards')
        assert(card === last, 'Didn\'t remove the last card of the deck')
      })
    })

    describe('countHand', function () {
      it('should return the correct value for a hand', function () {
        const hand = [
          {suit: 'CLUBS', value: 2},
          {suit: 'CLUBS', value: 5},
          {suit: 'CLUBS', value: 6},
        ]
        assert.equal(blackjack.countHand(hand), 13)
      })

      it('should return the correct value for face cards', function () {
        assert.equal(blackjack.countHand([{suit: 'CLUBS', value: 11}]), 10)
        assert.equal(blackjack.countHand([{suit: 'CLUBS', value: 12}]), 10)
        assert.equal(blackjack.countHand([{suit: 'CLUBS', value: 13}]), 10)
      })

      it('should return the correct value for aces', function () {
        assert.equal(blackjack.countHand([{suit: 'CLUBS', value: 1}]), 11)
        assert.equal(blackjack.countHand([{suit: 'CLUBS', value: 1}, {suit: 'HEARTS', value: 13}]), 21)
        assert.equal(blackjack.countHand([{suit: 'CLUBS', value: 1}, {suit: 'HEARTS', value: 1}]), 12)
        assert.equal(blackjack.countHand([{suit: 'CLUBS', value: 1}, {suit: 'HEARTS', value: 13}, {
          suit: 'HEARTS',
          value: 10
        }]), 21)
        assert.equal(blackjack.countHand([{suit: 'CLUBS', value: 1}, {suit: 'HEARTS', value: 13}, {
          suit: 'HEARTS',
          value: 10
        }, {suit: 'HEARTS', value: 1}]), 22)
      })
    })

    describe('isBust', function () {
      it('should correctly check if a hand has not gone bust', function () {
        assert.equal(blackjack.isBust([
          {suit: 'CLUBS', value: 2},
          {suit: 'HEARTS', value: 4},
          {suit: 'HEARTS', value: 5},
          {suit: 'HEARTS', value: 6}
        ]), false, '17')
        assert.equal(blackjack.isBust([{suit: 'CLUBS', value: 1}, {suit: 'HEARTS', value: 13}]), false, '21')
        assert.equal(blackjack.isBust([{suit: 'CLUBS', value: 1}, {suit: 'HEARTS', value: 1}]), false, '12')
      })
      it('should correctly check if a hand has gone bust', function () {
        assert.equal(blackjack.isBust([
          {suit: 'CLUBS', value: 10},
          {suit: 'HEARTS', value: 2},
          {suit: 'HEARTS', value: 12}
        ]), true, '22')
        assert.equal(blackjack.isBust([
          {suit: 'CLUBS', value: 1},
          {suit: 'HEARTS', value: 13},
          {suit: 'SPADES', value: 2},
          {suit: 'HEARTS', value: 12}
        ]), true, '23')
      })
    })
  })

  describe('Gameplay functions', function () {
    describe('createCardElement', function () {
      it('should create a new HTML element with the card data', function () {
        const card = getCard()
        const cardElement = blackjack.createCardElement(card)
        assert.equal(cardElement.innerText, `${values[card.value - 1]}${suits[card.suit]}`, 'Card is missing the correct text')
        assert(cardElement.classList.contains('card'), 'Card is missing "card" class')
        assert(cardElement.classList.contains(card.suit.toLowerCase()), 'Card is missing the suit class: ' + card.suit.toLowerCase())
      })
    })

    describe('clearPlayArea', function () {
      it('should remove everything inside the play area', function () {
        blackjack.playArea.append(document.createElement('div'), document.createElement('div'), document.createElement('div'))
        blackjack.clearPlayArea()
        assert.equal(blackjack.playArea.childNodes.length, 0, 'The play area is not empty')
      })
    })

    describe('addCardToPlayArea', function () {
      it('should add the newly created card to the play area', function () {
        Array.from(blackjack.playArea.childNodes).forEach(n => n.remove())

        const card = getCard()
        blackjack.addCardToPlayArea(card)
        assert(blackjack.playArea.childNodes[0], 'The play area is empty')
        assert.equal(blackjack.playArea.childNodes[0].innerText, `${values[card.value - 1]}${suits[card.suit]}`, 'Could not find the correct card in the play area')
      })
    })

    describe('showButton', function () {
      it('should show a previously hidden button', function () {
        blackjack.buttonDeal.classList.add('hidden')

        blackjack.showButton(blackjack.buttonDeal)
        assert(!blackjack.buttonDeal.classList.contains('hidden'), 'The button is not visible')
      })

      it('should not hide a previously visible button', function () {
        blackjack.buttonDeal.classList.remove('hidden')

        blackjack.showButton(blackjack.buttonDeal)
        assert(!blackjack.buttonDeal.classList.contains('hidden'), 'The button is not visible')
      })
    })

    describe('hideButton', function () {
      it('should hide a previously visible button', function () {
        blackjack.buttonDeal.classList.remove('hidden')

        blackjack.hideButton(blackjack.buttonDeal)
        assert(blackjack.buttonDeal.classList.contains('hidden'), 'The button is visible')
      })

      it('should not show a previously hidden button', function () {
        blackjack.buttonDeal.classList.add('hidden')

        blackjack.hideButton(blackjack.buttonDeal)
        assert(blackjack.buttonDeal.classList.contains('hidden'), 'The button is visible')
      })
    })

    describe('onReset', function () {
      it('should reset the game', function () {
        blackjack.gameData.playerHand.push(getCard(), getCard(), getCard())
        blackjack.playArea.append(document.createElement('div'), document.createElement('div'), document.createElement('div'))

        blackjack.onReset()

        assert.equal(blackjack.messageArea.innerText, 'Press "Deal" to deal a new hand')
        assert.equal(blackjack.playArea.childNodes.length, 0, 'Play area was not emptied')
        assert(blackjack.buttonReset.classList.contains('hidden'), 'The "Reset" button is visible')
        assert(blackjack.buttonHit.classList.contains('hidden'), 'The "Hit" button is visible')
        assert(blackjack.buttonStand.classList.contains('hidden'), 'The "Stand" button is visible')
        assert(!blackjack.buttonDeal.classList.contains('hidden'), 'The "Deal" button is not visible')
      })
    })

    describe('checkForBust', function () {
      beforeEach(function () { resetGame() })

      it('should not do anything if hand is not bust', function () {
        blackjack.gameData.playerHand = [
          {suit: 'CLUBS', value: 2},
          {suit: 'HEARTS', value: 4},
          {suit: 'HEARTS', value: 5},
          {suit: 'HEARTS', value: 6}
        ]

        blackjack.checkForBust()

        assert.equal(blackjack.messageArea.innerText, 'test')
        assert(blackjack.buttonReset.classList.contains('hidden'))
        assert(!blackjack.buttonHit.classList.contains('hidden'))
        assert(!blackjack.buttonStand.classList.contains('hidden'))
        assert(blackjack.buttonDeal.classList.contains('hidden'))
      })

      it('should end the game if hand is bust', function () {
        blackjack.gameData.playerHand = [
          {suit: 'CLUBS', value: 12},
          {suit: 'HEARTS', value: 4},
          {suit: 'HEARTS', value: 5},
          {suit: 'HEARTS', value: 6}
        ]

        blackjack.checkForBust()

        assert.equal(blackjack.messageArea.innerText, `You went bust! Total hand was 25`)
        assert(!blackjack.buttonReset.classList.contains('hidden'))
        assert(blackjack.buttonHit.classList.contains('hidden'))
        assert(blackjack.buttonStand.classList.contains('hidden'))
        assert(blackjack.buttonDeal.classList.contains('hidden'))
      })
    })

    describe('checkFor21', function () {
      beforeEach(function () { resetGame() })


      it('should not do anything if hand is not 21', function () {
        blackjack.gameData.playerHand = [
          {suit: 'CLUBS', value: 2},
          {suit: 'HEARTS', value: 4},
          {suit: 'HEARTS', value: 5},
          {suit: 'HEARTS', value: 6}
        ]

        blackjack.checkFor21()

        assert.equal(blackjack.messageArea.innerText, 'test')
        assert(blackjack.buttonReset.classList.contains('hidden'))
        assert(!blackjack.buttonHit.classList.contains('hidden'))
        assert(!blackjack.buttonStand.classList.contains('hidden'))
        assert(blackjack.buttonDeal.classList.contains('hidden'))
      })

      it('should end the game if hand is 21', function () {
        blackjack.gameData.playerHand = [
          {suit: 'CLUBS', value: 12},
          {suit: 'HEARTS', value: 1},
        ]

        blackjack.checkFor21()

        assert.equal(blackjack.messageArea.innerText, 'Blackjack! 🎉')
        assert(!blackjack.buttonReset.classList.contains('hidden'))
        assert(blackjack.buttonHit.classList.contains('hidden'))
        assert(blackjack.buttonStand.classList.contains('hidden'))
        assert(blackjack.buttonDeal.classList.contains('hidden'))
      })
    })

    describe('onDeal', function () {
      beforeEach(function () { resetGame() })

      it('should correctly deal two cards', function () {
        blackjack.onDeal()

        assert.equal(blackjack.gameData.deck.length, 50, 'Cards were not removed from deck')
        let card = blackjack.gameData.playerHand[0]
        assert.equal(`${values[card.value - 1]}${suits[card.suit]}`, 'K♠')
        card = blackjack.gameData.playerHand[1]
        assert.equal(`${values[card.value - 1]}${suits[card.suit]}`, 'Q♠')
        assert(blackjack.buttonReset.classList.contains('hidden'))
        assert(blackjack.buttonDeal.classList.contains('hidden'))
        assert(!blackjack.buttonHit.classList.contains('hidden'))
        assert(!blackjack.buttonStand.classList.contains('hidden'))
        assert.equal(blackjack.messageArea.innerText, 'Press "Hit" to deal a new card, or "Stand" to stop')
      })
    })

    describe('onHit', function () {
      beforeEach(function () { resetGame() })

      it('should correctly deal one card', function () {
        blackjack.onHit()

        assert.equal(blackjack.gameData.deck.length, 51, 'Card was not removed from deck')
        let card = blackjack.gameData.playerHand[0]
        assert.equal(`${values[card.value - 1]}${suits[card.suit]}`, 'K♠')
        assert(blackjack.buttonReset.classList.contains('hidden'))
        assert(blackjack.buttonDeal.classList.contains('hidden'))
        assert(!blackjack.buttonHit.classList.contains('hidden'))
        assert(!blackjack.buttonStand.classList.contains('hidden'))
        assert.equal(blackjack.messageArea.innerText, 'Press "Hit" to deal a new card, or "Stand" to stop')
      })
    })

    describe('onStand', function () {
      beforeEach(function () { resetGame() })

      it('should stop game and display hand value', function () {
        blackjack.gameData.playerHand = [
          {suit: 'CLUBS', value: 2},
          {suit: 'HEARTS', value: 4},
          {suit: 'HEARTS', value: 5},
          {suit: 'HEARTS', value: 6}
        ]

        blackjack.onStand()

        assert.equal(blackjack.messageArea.innerText, `You stopped! Total hand value is 17`)
        assert(!blackjack.buttonReset.classList.contains('hidden'))
        assert(blackjack.buttonDeal.classList.contains('hidden'))
        assert(blackjack.buttonHit.classList.contains('hidden'))
        assert(blackjack.buttonStand.classList.contains('hidden'))
      })
    })
  })
})

// ♣ ♥ ♦ ♠
