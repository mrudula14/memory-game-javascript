/*
 * Create a list that holds all of your cards
 */
let matchedCardsCount = 0;
let currentGameBoard = [];
let clickDisabled = false;
let firstCard = null,
    secondCard = null,
    moveCounter = 0,
    time = 0;
let Timer;

let listOfCards = ['fa-diamond', 'fa-paper-plane-o', 'fa-anchor', 'fa-bolt',
    'fa-cube', 'fa-anchor', 'fa-leaf', 'fa-bicycle', 'fa-diamond',
    'fa-bomb', 'fa-leaf', 'fa-bomb', 'fa-bolt', 'fa-bicycle', 'fa-paper-plane-o',
    'fa-cube'
]


/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

const deck = document.getElementById('mainCard');
const reset = document.getElementById('restart');
const starts = document.getElementById('starRating');
document.getElementById('noOfMoves').innerHTML = moveCounter;
reset.addEventListener('click', resetBoard, false);

function initBoard() {
    Timer = setInterval(incrementTime, 1000);
    setStars(3);
    shuffle(listOfCards).forEach(function(cardSymbol) {
        const elem = document.createElement("li");

        elem.className = 'card';
        elem.id = currentGameBoard.length;

        const i = document.createElement("i");
        elem.appendChild(i);
        i.className = 'fa' + " " + cardSymbol;
        deck.addEventListener('click', cardFlip, false);

        deck.appendChild(elem);
        currentGameBoard.push({
            'type': cardSymbol,
            'state': 'close'
        });
    });
}
/**
 * 
 * @param {object} cardUIElem 
 * cardFlip click only two cards at a time and update the state
 */
function cardFlip(cardUIElem) {

    if (!clickDisabled && cardUIElem.target.matches('li')) { // avoid other click and added event delegation toa avoid ul click

        let a = currentGameBoard[cardUIElem.path[0].id];
        updateCardState(a);
        if (firstCard === null) {
            firstCard = a;
            firstCard.elem = cardUIElem;
        } else if (a != firstCard) {
            secondCard = a;
            secondCard.elem = cardUIElem;
        }
        displayCardState(a, cardUIElem);

        if (firstCard != null && secondCard != null) {
            clickDisabled = true;
            setTimeout(function() {
                checkMatchCondition()
            }, 900)
        }

    }

};

/**
 * @param  {object} a
 * @param  {object} cardUIElem
 * cardUIElem is element which is clicked
 * displayCardState to show or close the card when clicked
 */
function displayCardState(a, cardUIElem) {
    if (a.state === 'close') {

        cardUIElem.srcElement.classList.remove('open', 'show');

    } else if (a.state === 'open') {

        cardUIElem.srcElement.classList.add('open', 'show');

    } else if (a.state === 'match') {

        cardUIElem.srcElement.classList.remove('open', 'show');

        cardUIElem.srcElement.classList.add('match');
    }
};
/**
 * @param  {object} a
 * To update the card state if it is match close or open
 */
function updateCardState(a) {

    if (a === undefined) {}

    if (a.state === 'close') {
        a.state = 'open';
    } else if (a.state === 'open') {
        a.state = 'close';
    } else if (a.state === 'match') {
        a.state = 'match';
    }

};

/**
 * To check if two cards are matching or not
 */
function checkMatchCondition() {

    if (firstCard != null && secondCard != null) {
        if (firstCard.type === secondCard.type) {
            firstCard.state = 'match';
            secondCard.state = 'match';
            matchedCardsCount += 2;
        } else {
            firstCard.state = 'close';
            secondCard.state = 'close';
        }
        moveCounter++;
        document.getElementById('noOfMoves').innerHTML = moveCounter;
        starRating();
        displayCardState(firstCard, firstCard.elem);
        displayCardState(secondCard, secondCard.elem);
        firstCard = null;
        secondCard = null;

    }
    clickDisabled = false;
    // to check the win condition
    if (matchedCardsCount === currentGameBoard.length) {
        // win condition
        clearInterval(Timer);
        $('#congratulateModal').modal('show');
        document.getElementsByClassName('final-time')[0].innerHTML = time;
        document.getElementsByClassName('final-star')[0].innerHTML = starts.innerHTML;
        document.getElementsByClassName('final-moves')[0].innerHTML = moveCounter;

    }
};

function starRating() {
    if (moveCounter === 30) {
        setStars(2);

    } else if (moveCounter === 40) {
        setStars(1);
    } else {}
};

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    let currentIndex = array.length,
        temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

/*
To reset the game 
*/
function resetBoard() {
    deck.innerHTML = "";
    currentGameBoard.length = 0;
    matchedCardsCount = 0;
    clickDisabled = false;
    firstCard = null;
    secondCard = null;
    moveCounter = 0;
    time = 0;
    setTime(0);
    setStars(3);
    clearInterval(Timer);
    document.getElementById('noOfMoves').innerHTML = moveCounter;
    initBoard();
}

function setStars(numOfStar) {
    const starLi = '<li><i class="fa fa-star"></i></li>';
    starts.innerHTML = starLi.repeat(numOfStar)

};

function setTime(seconds) {
    const d = document.getElementsByClassName("timer")[0];
    d.innerHTML = seconds;
};

function incrementTime() {
    time += 1;
    setTime(time);
}

function playAgain() {
    window.location.href = 'index.html';
    resetBoard();
}

initBoard();
/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */