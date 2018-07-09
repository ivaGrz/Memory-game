const cardsArray = ['A', 'A', 'B', 'B', 'C', 'C', 'D', 'D', 'E', 'E', 'F', 'F', 'G', 'G', 'H', 'H'];
let gameState = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
let movesCounter = 1;
let win = false;
let timerOn = false;
let timeCounter = 0;
let timeHighscore = 99999;
let movesHighscore = 99999;

///// shuffle cards
const shuffleCards = () => {
  let remainingCards = cardsArray.slice();
  for (let i = 0; i < cardsArray.length; i ++) {
    let randomNum = Math.floor(Math.random() * remainingCards.length);
    $('#' + i).html(remainingCards[randomNum]);
    $('#' + i).addClass(remainingCards[randomNum]);
    remainingCards.splice(randomNum, 1);
  }
};
shuffleCards();

//// timer
function startTimer() {
  timerOn = true;
  function countingTime() {
      timeCounter ++;
      $('.time').html(timeCounter);
  }
  timer = setInterval(countingTime, 1000);
  return timer;
}

function stopTimer(){
  timerOn = false;
  clearInterval(timer);
}


///// render view
function renderView() {
  for (let i = 0; i < gameState.length; i++) {
    if (gameState[i] == 0) {
      $('#' + i).removeClass('open').addClass('closed');
    }
    if (gameState[i] == 2 | gameState[i] == 1) {
      $('#' + i).addClass('open').removeClass('closed');
    }
  }
  $('.moves').html(movesCounter);
}

/// check for win
function checkForWin() {
  function checkState(element) {
    return element === 2;
  }
  let win = gameState.every(checkState);
  if (win === true) {
    checkForHighscore();
    stopTimer();
    $('.overlay').removeClass('hidden');
    $('.cardBoard').addClass('mask');
  }
}

// RESET game
$('.refreshButton').on('click', (event) => {
  $('.card').removeClass('A B C D E F G H');
  $('.cardBoard').removeClass('mask');
  gameState = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  renderView();
  shuffleCards();
  movesCounter = 0;
  timeCounter = 0;
  $('.moves').html(0);
  stopTimer();
  $('.time').html(0);
  $('.overlay').addClass('hidden');
});

/// Highscore
function checkForHighscore() {
  if (movesCounter < movesHighscore) {
    movesHighscore = movesCounter;
    $('.movesHighscore').html(movesHighscore)
  }
  if (timeCounter < timeHighscore) {
    timeHighscore = timeCounter;
    $('.timeHighscore').html(timeHighscore)
  }
}

//// GAME
let firstCard;
let secondCard;
let firstCardCheck = true;
$('.closed').on('click', (event) => {
  if (timerOn === false) {
    startTimer();
  }
  if (gameState[event.currentTarget.id] === 0) {
    gameState[event.currentTarget.id] = 1;
    renderView();
    if (firstCardCheck === true) {
      firstCard = event.currentTarget;
      firstCardCheck = false;
    } else {
      secondCard = event.currentTarget;
      $('button').prop('disabled', true);
      if ($(firstCard).html() != $(secondCard).html()) {
        gameState[firstCard.id] = 0;
        gameState[secondCard.id] = 0;
        setTimeout(function(){
          $(firstCard).removeClass('open').addClass('closed');
          $(secondCard).removeClass('open').addClass('closed');
          $('button').prop('disabled', false);
        }, 600);
      } else {
        gameState[firstCard.id] = 2;
        gameState[secondCard.id] = 2;
        $('button').prop('disabled', false);
      }
      firstCardCheck = true;
      checkForWin();
      movesCounter += 1;
    }
  }
});
