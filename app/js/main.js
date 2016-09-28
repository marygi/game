document.addEventListener('DOMContentLoaded', function(){
    var GemPuzzle = (function () {

        var gemPuzzle = [],
            clonedPuzzle = [],
            zero,
            timer,
            itemsNumber = 16,
            counter = 0,
            minutes = 0,
            seconds = 0,
            puzzleContainer,
            timerContainer,
            counterContainer;

        function startNewGame(restart) {

            resetGameValues();

            if (restart) {
                gemPuzzle = clonePuzzleSet(clonedPuzzle);
            } else {
                createPuzzle();
                clonedPuzzle = clonePuzzleSet(gemPuzzle);
            }

            setGameValues();
        }

        function setGameValues() {
            setZeroValue();
            createPuzzleMarkUp();
            updateCounter();
            updateTimer();
        }

        function resetGameValues() {
            gemPuzzle = [];
            counter = 0;
            puzzleContainer.innerHTML = '';
            stopTimer();
        }

        function createPuzzle() {
            for (var i = 0; i < itemsNumber; i++) {
                gemPuzzle.push(i);
            }

            gemPuzzle.sort(function() {
                return getRandomNum(0, itemsNumber);
            });
        }

        function clonePuzzleSet(arrFrom) {
            return arrFrom.slice();
        }

        function setZeroValue(index) {
            zero = index ? index : gemPuzzle.indexOf(0);
        }

        function createPuzzleMarkUp() {
            var fragment = document.createDocumentFragment();

            for (var i = 0; i < itemsNumber; i++) {

                var item = document.createElement('span');

                item.innerHTML = gemPuzzle[i];
                item.className = 'item';
                item.setAttribute('data-index', i);

                if (i === zero) {
                    item.className = 'item -empty';
                }

                fragment.appendChild(item);
            }

            puzzleContainer.appendChild(fragment);
        }

        function swapPuzzles(index) {
            var value = gemPuzzle.splice(index, 1, gemPuzzle[zero]);
            gemPuzzle.splice(zero, 1, value[0]);
        }

        function checkPuzzleIsSolved () {
            var puzzleIsCollect = false,
                i,
                len = itemsNumber - 1;

            for (i = 1; i < len; i++) {
                // each next element in array should be larger than previous, except the last, the last should be zero
                if ( gemPuzzle[len] === 0 && gemPuzzle[i] > gemPuzzle[i-1] ) {
                    puzzleIsCollect = true;
                } else {
                    puzzleIsCollect = false;
                    break;
                }
            }

            if(puzzleIsCollect) {
                return true;
            }

            return false;
        }

        function checkForClickableArea(index) {
            // get amount of elements in row
            var j = Math.sqrt(itemsNumber);
            // check position of element relative to empty cell
            if (index === zero + 1 || index === zero - 1 || index === zero + j || index === zero - j) {
                return true;
            }

            return false;
        }

        function updateCounter() {
            counterContainer.innerHTML = counter;
        }

        function updateTimer () {
            timerContainer.innerHTML = formatNumber(minutes) + ':' + formatNumber(seconds);
        }

        function stopTimer () {
            clearInterval(timer);
            minutes = 0;
            seconds = 0;
        }

        function showCongratulatoryMessage () {
            var div = document.createElement('div');

            div.className = 'message';
            div.innerHTML = 'Congratulations! You have successfully finished the puzzle!';

            puzzleContainer.appendChild(div);

            setTimeout(function() {
                puzzleContainer.removeChild(div);
            }, 3000);

        }

        function formatNumber(number) {
            return (number < 10 ? '0' : '') + number;
        }

        function getRandomNum(min, max) {
            return Math.floor(Math.random() * (max - min)) + min;
        }

        return {
            init: function () {

                puzzleContainer = document.querySelector('.js-puzzle-container');
                timerContainer = document.querySelector('.js-time-counter');
                counterContainer = document.querySelector('.js-step-counter');

                var restartGame = document.querySelector('.js-restart-game'),
                    newGame = document.querySelector('.js-new-game'),
                    puzzleTypes = document.querySelector('.js-puzzle-types');

                startNewGame();

                puzzleContainer.addEventListener('click', function(event){
                    var target = event.target,
                        index = parseInt(target.getAttribute('data-index'));

                    if (checkForClickableArea(index)) {

                        swapPuzzles(index);
                        setZeroValue(index);

                        counter++;
                        if (counter === 1) {
                            timer = setInterval(function() {
                                seconds++;
                                if(!(seconds % 60)) {
                                    seconds = 0;
                                    minutes++;
                                }
                                updateTimer();
                            }, 1000);
                        }

                        puzzleContainer.innerHTML = '';
                        createPuzzleMarkUp();
                        updateCounter();

                        if (checkPuzzleIsSolved()) {
                            stopTimer();
                            showCongratulatoryMessage();
                        }
                    }
                });

                restartGame.addEventListener('click', function(){
                    startNewGame(true);
                });

                newGame.addEventListener('click', function(){
                    startNewGame();
                });

                puzzleTypes.addEventListener('click', function(event){
                    var target = event.target,
                        classes = target.classList,
                        type = parseInt(target.getAttribute('data-type'));

                    if(!classes.contains('-selected')) {
                        target.parentNode.querySelector('.type.-selected').classList.remove('-selected');
                        classes.add('-selected');
                        puzzleContainer.classList.remove('-type' + itemsNumber);
                        puzzleContainer.classList.add('-type' + type);

                        itemsNumber = type;
                        startNewGame();
                    }
                });

            }
        };
    })();

    GemPuzzle.init();
});