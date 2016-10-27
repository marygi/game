var HangMan = (function () {
    var alphabet = {
            'lang_ru' : [ 'а', 'б', 'в', 'г', 'д', 'е', 'ё', 'ж', 'з', 'и', 'й', 'к', 'л', 'м', 'н', 'о', 'п', 'р', 'с', 'т', 'у', 'ф', 'х', 'ц', 'ч', 'ш', 'щ', 'ъ', 'ы', 'ь', 'э', 'ю', 'я'],
            'lang_en' : [ 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
        },
        wordsObj = {},
        currentLang = 'lang_ru',
        currentCategory = 0,
        sourceWord = '',
        displayedWord = '',
        sourceWordLen,
        canvas,
        attempt = 6,
        wordContainer,
        alphabetContainer,
        messageContainer,
        hintContainer,
        attemptContainer,
        messages = {
            'loss' : '<span class="text-red">Sorry, but you have not guessed the word!</span><br><span data-action="restart" class="hangman-btn">Restart</span><span data-action="show-word" class="hangman-btn">Show word</span>',
            'win' : '<span class="text-green">Congratulations! You guessed the word!</span>'
        };

    function startNewGame(restart) {
        resetValues();
        if(!restart) {
            getRandomWord();
            updateHint();
        }
        displayHiddenWord();
        displayAlphabet();
        updateAttemptsNumber();
    }

    function getRandomWord() {
        var max = wordsObj[currentLang][currentCategory].total,
            index = CommonGameObj.getRandomNum(0, max);

        sourceWord = wordsObj[currentLang][currentCategory].words[index];
        sourceWordLen = sourceWord.length;
    }

    function displayAlphabet() {
        var fragment = document.createDocumentFragment(),
            currentAlphabet = alphabet[currentLang],
            len = currentAlphabet.length;

        for (var i = 0; i < len; i++) {

            var item = document.createElement('span');

            item.innerHTML = currentAlphabet[i];
            item.className = 'item';
            item.setAttribute('data-index', i);

            fragment.appendChild(item);
        }

        alphabetContainer.appendChild(fragment);
    }

    function displayHiddenWord() {
        var i = 1;

        displayedWord += sourceWord[0];

        while (i < sourceWordLen - 1) {
            displayedWord += '–';
            i++;
        }

        displayedWord += sourceWord[sourceWordLen - 1];
        wordContainer.innerHTML = displayedWord;
    }


    function gameStep(index) {
        var letter = alphabet[currentLang][index],
            letterIsGuessed = findLetterInSourceWord(letter);

        if(displayedWord === sourceWord) {
            showMessage('win');
        }

        if(!letterIsGuessed) {
            hangManCanvas.drawBodyPart(attempt);
            reduceAttemptsNumber();
            updateAttemptsNumber();
        }

        if (attempt === 0) {
            showMessage('loss');
        }
    }

    function findLetterInSourceWord(letter, index) {
        var i = index ? index : 0,
            position = sourceWord.indexOf(letter, i),
            isGuessed = false;

        if (position > 0){
            isGuessed = true;
            displayGuessedLetter(position);
            findLetterInSourceWord(letter, position + 1);
        }

        return isGuessed;
    }

    function displayGuessedLetter(index) {
        displayedWord = displayedWord.slice(0,index) + sourceWord[index] + displayedWord.slice(index + 1);
        wordContainer.innerHTML = displayedWord;
    }

    function updateCurrentCategory() {
        if (currentCategory === (wordsObj[currentLang].length - 1)) {
            currentCategory = 0;
        } else {
            currentCategory++;
        }
    }

    function resetValues() {
        alphabetContainer.innerHTML = null;
        wordContainer.innerHTML = null;
        messageContainer.innerHTML = null;
        attempt = 6,
        displayedWord = '';
        hangManCanvas.eraseHuman();
    }

    function showSourceWord() {
        var temp = '';
        for (var i = 0; i < sourceWordLen; i++) {
            if(displayedWord[i] !== sourceWord[i]) {
                temp += '<span class="text-red">' + sourceWord[i] + '</span>';
            } else {
                temp += sourceWord[i];
            }
        }
        displayedWord = temp;
        wordContainer.innerHTML = displayedWord;
    }

    function updateHint() {
        hintContainer.innerHTML = wordsObj[currentLang][currentCategory].category;
    }

    function updateAttemptsNumber() {
        attemptContainer.innerHTML = attempt;
        if(attempt === 0) {
            attemptContainer.classList.add('text-red');
        } else {
            attemptContainer.classList.remove('text-red');
        }
    }

    function reduceAttemptsNumber() {
        if (attempt > 0) attempt -= 1;
    }

    function showMessage(outcome) {
        messageContainer.innerHTML = messages[outcome];
    }

    function switchLanguage(lang) {
        currentLang = lang;
    }

    var hangManCanvas = {
        'ctx' : undefined,
        '6' : function () {
            var _self = this;

            _self.ctx.beginPath();
            _self.ctx.arc(186,80,20,0,Math.PI*2,true);
            _self.ctx.closePath();
            _self.ctx.stroke();
        },
        '5' : function () {
            var _self = this;

            _self.ctx.fillRect (186, 100, 2, 70);
        },
        '4' : function () {
            var _self = this;

            _self.ctx.beginPath();
            _self.ctx.moveTo(186,120);
            _self.ctx.lineTo(150,95);
            _self.ctx.closePath();
            _self.ctx.stroke();
        },
        '3' : function() {
            var _self = this;

            _self.ctx.beginPath();
            _self.ctx.moveTo(188,120);
            _self.ctx.lineTo(224,95);
            _self.ctx.closePath();
            _self.ctx.stroke();
        },
        '2' : function () {
            var _self = this;

            _self.ctx.beginPath();
            _self.ctx.moveTo(186,170);
            _self.ctx.lineTo(150,195);
            _self.ctx.closePath();
            _self.ctx.stroke();
        },
        '1' : function() {
            var _self = this;

            _self.ctx.beginPath();
            _self.ctx.moveTo(188,170);
            _self.ctx.lineTo(224,195);
            _self.ctx.closePath();
            _self.ctx.stroke();
        },
        'eraseHuman': function() {
            var _self = this;

            _self.ctx.clearRect(150, 59, 90, 195);
        },
        'drawScaffold' : function() {
            var _self = this;

            _self.ctx.fillStyle = "rgb(0,0,0)";
            _self.ctx.fillRect (70, 20, 8, 200);
            _self.ctx.fillRect (30, 220, 100, 8);
            _self.ctx.fillRect (70, 20, 120, 8);
            _self.ctx.fillRect (182, 20, 8, 40);
            _self.ctx.beginPath();
            _self.ctx.lineWidth = 8;
            _self.ctx.moveTo(75,100);
            _self.ctx.lineTo(130,25);
            _self.ctx.closePath();
            _self.ctx.stroke();
        },
        'drawBodyPart' : function (part) {
            var _self = this;

            if (_self.ctx) {
                _self.ctx.fillStyle = "rgb(0,0,0)";
                _self.ctx.lineWidth = 2;
                _self[part]();
            }
        },
        'init' : function () {
            var _self = this;

            if (canvas.getContext) {
                _self.ctx = canvas.getContext('2d');
                _self.drawScaffold();
            }
        }
    };

    return {
        init: function () {

            alphabetContainer = document.querySelector('.js-alphabet-container');
            wordContainer = document.querySelector('.js-word-container');
            messageContainer = document.querySelector('.js-message-container');
            attemptContainer = document.querySelector('.js-attempt-container');
            hintContainer = document.querySelector('.js-hint-container');
            canvas = document.querySelector('.js-hangman-canvas');

            var newGameBtn = document.querySelector('.js-new-game-btn'),
                langSwitcher = document.querySelector('.js-language-switcher'),
                backHomeBtn = document.querySelector('.js-back-home-btn');

            CommonGameObj.fetchData('json/words.json',{},function(data) {
                wordsObj = JSON.parse(data);

                hangManCanvas.init();
                startNewGame();
            });

            alphabetContainer.addEventListener('click', function(event) {
                var target = event.target,
                    classes = target.classList,
                    index = parseInt(target.getAttribute('data-index'));

                if(!classes.contains('-selected') && attempt > 0) {
                    target.classList.add('-selected');

                    gameStep(index);
                }
            });

            newGameBtn.addEventListener('click', function(event) {
                updateCurrentCategory();
                startNewGame();
            });

            langSwitcher.addEventListener('click', function(event) {
                var target = event.target,
                    lang = target.getAttribute('data-lang');

                switchLanguage(lang);
                updateCurrentCategory();
                startNewGame();
            });

            messageContainer.addEventListener('click', function(event) {
                var target = event.target,
                    action = target.getAttribute('data-action');

                if(action === 'restart') {
                    startNewGame(true);
                } else {
                    showSourceWord();
                }
            });

            backHomeBtn.addEventListener('click', function() {
                CommonGameObj.loadHomePage();
            });
        }
    }
})();