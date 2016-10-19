/*Jacks or Better*/
var VideoPoker = (function () {
    var deck = [],
        deckLen = 52,
        cardsInHand = [],
        heldCards = [],
        cardsInHandLimit = 5,
        suitCardsLen = 13, /* each suit contains 13 cards */
        AceStepPosition = 13, /* ace is every 13 cards */
        credit,
        win,
        bet,
        maxBet = 5,
        winningCombination = 0,
        cardCombinations = {
            '_9': {
                'title' : 'Royal Flush',
                'rate' : 250
            },
            '_8': {
                'title' : 'Straight Flush',
                'rate' : 40
            },
            '_7' : {
                'title' : 'Four of a Kind',
                'rate' : 20
            },
            '_6': {
                'title' : 'Full House',
                'rate' : 9
            },
            '_5' : {
                'title' : 'Flush',
                'rate' : 6
            },
            '_4' : {
                'title' : 'Straight',
                'rate' : 5
            },
            '_3' : {
                'title' : 'Three of a Kind',
                'rate' : 3
            },
            '_2' : {
                'title' : 'Two Pair',
                'rate' : 2
            },
            '_1' : {
                'title' : 'Pair',
                'rate' : 1
            }
        },
        combinationTable,
        cardsContainer,
        betContainer,
        winContainer,
        creditContainer,
        messageContainer;

    function startNewGame() {
        setGameValues();
        createDeck();
        fillCombinationTable();
        displayCards();
        displayCreditValue();
        displayWinValue();
        displayBetValue();
    }

    function endGameActions() {
        showEndGameMessage();
        updateWinValue();
        displayWinValue();
        updateCreditValue();
        displayCreditValue();
    }

    function createDeck() {
        for ( var i = 1; i <= deckLen; i++ ) {
            deck.push(i);
        }
    }

    function setGameValues() {
        bet = 1;
        win = 0;
        credit = 100;
    }

    function dealCards() {
        if(cardsInHand.length) {
            getCardsToLimit();
            findWinningCombination();
            foldCards();
            setTimeout(endGameActions,500);
        } else {
            fillCardsInHandArr();
            displayCards();
        }
    }

    function getCardsToLimit() {
        if(heldCards.length) {
            for (var i = 0; i < cardsInHandLimit; i++) {
                var held = heldCards.indexOf(cardsInHand[i]);

                if(held === -1) {
                    cardsInHand[i] = getCardFromDeck();
                }
            }
        }

        displayCards();
    }

    function fillCardsInHandArr() {
        var i = 0;

        while (i < cardsInHandLimit) {
            var card = getCardFromDeck();
            cardsInHand.push(card);
            i++;
        }
    }

    function displayCards() {
        clearCardsContainer();

        if(cardsInHand.length) {
            cardsInHand.forEach(function(card) {
                createCard(card);
            });
        } else {
            var i = 0;
            while(i < cardsInHandLimit) {
                createCard();
                i++;
            }
        };
    }

    function createCard(card) {
        var img = document.createElement('img'),
            div = document.createElement('div');

        img.setAttribute('src', '../dist/images/cards/' + (card ? deck[card - 1] : 'back') + '.png');
        img.classList.add('pic');
        if(card) {
            div.setAttribute('data-card', card);
        }
        div.classList.add('video-poker-card');
        div.appendChild(img);

        cardsContainer.appendChild(div);
    }

    function getCardFromDeck() {
        var newCard = false;

        do {
            var index = CommonGameObj.getRandomNum(0,deckLen),
                card = index + 1;

            if (cardsInHand.indexOf(card) === -1) {
                newCard = true;

                return card;
            }

        } while(!newCard);

        newCard = false;
    }

    function keepCard(card,remove) {
        if(cardsInHand.length) {
            if(remove) {
                heldCards = heldCards.filter(function(item) {
                    return card !== item;
                });
            } else {
                heldCards.push(card);
            }
        }
    }

    function fillCombinationTable() {
        var fragment = document.createDocumentFragment();

        for (var combination in cardCombinations) {

            var item = document.createElement('div'),
                title = document.createElement('div'),
                i = 1;

            title.innerHTML = cardCombinations[combination].title;
            title.classList.add('title');
            item.classList.add('combination');
            item.appendChild(title);

            while (i <= maxBet) {
                var winAmount = document.createElement('div');
                winAmount.innerHTML = cardCombinations[combination].rate * i;
                winAmount.classList.add('win');
                item.appendChild(winAmount);
                i++;
            }

            fragment.appendChild(item);
        }
        combinationTable.appendChild(fragment);
    }

    function showEndGameMessage() {
        messageContainer.innerHTML = null;

        if (winningCombination > 0) {
            var el = cardCombinations['_' + winningCombination];
            messageContainer.innerHTML = el.title + '!<br> You win ' + (bet * el.rate) + '!';
        } else {
            messageContainer.innerHTML = credit > 0 ? 'Try Again!<br>Your Credit is ' + (credit - bet) : 'Your Credit is 0!<br><span class="text-underline js-poker-restart">Start again?</span>';
        }

        messageContainer.classList.add('-show');
        setTimeout(hideEndGameMessage,2000);
    }

    function hideEndGameMessage() {
        messageContainer.classList.remove('-show');
        messageContainer.innerHTML = null;
        cardsContainer.classList.add('translucent');
    }

    function clearCardsContainer() {
        cardsContainer.innerHTML = null;
        cardsContainer.classList.remove('translucent');
    }

    function foldCards() {
        cardsInHand = [];
        heldCards = [];
    }

    function checkForStraightFlush() {
        var temp = false,
            i,
            len = cardsInHandLimit -1;

        for (i = 0; i < len; i++) {
            if (cardsInHand[i] + 1 === cardsInHand[i+1]) {
                temp = true;
            } else {
                temp = false;
                break;
            }
        }

        return temp;

    }

    function checkForRoyalFlush() {
        var temp = false,
            j = 1,
            aces = [];

        while (j <= 4) {
            aces.push(AceStepPosition*j);
            j++;
        }

        if(aces.indexOf(cardsInHand[cardsInHandLimit-1]) > -1) {
            temp = true;
        }

        return temp;
    }

    function checkForFlush() {
        var temp = false,
            max = getMaxValue(cardsInHand[cardsInHandLimit-1]),
            min = max - suitCardsLen,
            i;

        for (i = 0; i < cardsInHandLimit; i++) {
            if(cardsInHand[i] > min && cardsInHand[i] <= max) {
                temp = true;
            } else {
                temp = false;
                break;
            }
        }

        return temp;
    }

    function checkForStraight() {
        var temp = false,
            i,
            len = cardsInHandLimit - 1;

        for (i = 0; i < len; i++) {
            var j = 0,
                tempArr = [],
                nextCard = cardsInHand[i] + 1; /* define position of first next-card in deck*/

            while (j < 4) {
                var card = (nextCard % suitCardsLen) + suitCardsLen * j;
                tempArr.push(card);
                j++;
            }

            if (tempArr.indexOf(nextCard) > -1) {
                temp = true;
            } else {
                temp = false;
               break;
            }
        }

        return temp;
    }

    function findSameRankCards() {
        var temp = 0,
            i,
            len = cardsInHandLimit - 1;

        for (i = 0; i < len; i++) {
            var j = 0,
                card = cardsInHand[i],
                cloneArr = cardsInHand.slice(i+1);

            while (j < 4) {
                var sameRankCard = (card % suitCardsLen) + suitCardsLen * j;  /* define position first same-card in deck */

                if (cloneArr.indexOf(sameRankCard) > -1) {
                    temp++;
                }
                j++;
            }
        }

        return temp;
    }

    function findWinningCombination() {

        cardsInHand.sort(compareNum);

        var sameRankCards = findSameRankCards();

        if (sameRankCards == 1) {
            winningCombination = 1; /* Pair */

        } else if (sameRankCards == 2) {
            winningCombination = 2; /* Two Pair */

        } else if (sameRankCards == 3) {
            winningCombination = 3; /* Three of a Kind */

        } else if (sameRankCards == 4) {
            winningCombination = 6; /* Full House*/

        } else if (sameRankCards == 6) {
            winningCombination = 7; /* Four of a Kind */

        } else if (checkForStraightFlush()) {
            winningCombination = 8; /* Straight Flush */
            if(checkForRoyalFlush()) {
                winningCombination = 9; /* Royal Flush */
            }
        } else if(checkForFlush()) {
            winningCombination = 5; /* Flush */

        } else if(checkForStraight()) {
            winningCombination = 4; /* Straight */
        }
    }

    function getMaxValue(val) {
        var temp = val + suitCardsLen - 1; /* in one suit - 13 cards */

        if(val !== deckLen) {
            while(temp % suitCardsLen) {
                temp--;
            }
        }

        return temp;
    }

    function updateCreditValue() {
        if(winningCombination > 0) {
            credit = credit + bet * cardCombinations['_' + winningCombination].rate;
        } else {
            credit = credit - bet;
        }
    }

    function updateWinValue() {
        if( winningCombination > 0) {
            win = win + bet * cardCombinations['_' + winningCombination].rate;
        } else {
            win = win - bet;
            if(win < 0) {
                win = 0;
            }
        }
    }

    function setMaxGameBet() {
        bet = maxBet;
    }

    function changeGameBet() {
        var diff = credit - bet;
        if(diff < 0) {
            bet = bet - diff;
        } else if(bet === 5) {
            bet = 1;
        } else {
            bet++;
        }
    }

    function displayCreditValue() {
        creditContainer.innerHTML = credit;
    }
    function displayWinValue() {
        winContainer.innerHTML = win;
    }
    function displayBetValue() {
        betContainer.innerHTML = bet;
        combinationTable.setAttribute('data-bet', bet);
    }
    function compareNum (a, b) {
        return a - b;
    }

    return {
        init: function () {
            combinationTable = document.querySelector('.js-poker-combination-table');
            cardsContainer = document.querySelector('.js-poker-cards-container');
            betContainer = document.querySelector('.js-poker-bet-container');
            winContainer = document.querySelector('.js-poker-win-container');
            creditContainer = document.querySelector('.js-poker-credit-container');
            messageContainer = document.querySelector('.js-poker-message-container');

            var btnIsBlocked = false,
                betBtn = document.querySelector('.js-poker-bet-btn'),
                betMaxBtn = document.querySelector('.js-poker-bet-max-btn'),
                dealBtn = document.querySelector('.js-poker-deal-btn'),
                backHomeBtn = document.querySelector('.js-back-home-btn');

            startNewGame();

            dealBtn.addEventListener('click', function () {
                if(!btnIsBlocked) {
                    dealCards();
                    btnIsBlocked = true; /* to prevent double click*/
                    setTimeout(function(){
                        btnIsBlocked = false;
                    },1000);
                }
            });

            betBtn.addEventListener('click', function () {
                if(!cardsInHand.length) {
                    changeGameBet();
                    displayBetValue();
                }
            });

            betMaxBtn.addEventListener('click', function () {
                if(!cardsInHand.length) {
                    setMaxGameBet();
                    displayBetValue();
                }
            });

            cardsContainer.addEventListener('click', function (event) {
                var target = event.target,
                    parent = target.parentNode,
                    card = parseInt(parent.getAttribute('data-card'));

                if(cardsInHand.length && !isNaN(card)) {
                    if(parent.classList.contains('-held')) {
                        keepCard(card,true);
                        parent.classList.remove('-held');
                    } else {
                        keepCard(card);
                        parent.classList.add('-held');
                    }
                }
            });

            backHomeBtn.addEventListener('click', function() {
                CommonGameObj.loadHomePage();
            });
        }
    }
})();
