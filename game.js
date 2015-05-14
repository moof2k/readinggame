
function speak(str) {
    
    var msg = new SpeechSynthesisUtterance(str);
    
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(msg);
}

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex ;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function GameCntl($scope, $timeout) {

    $scope.fact = {};
    $scope.question = 0;
    $scope.answer = 0;
    
    $scope.right_indicator = false;
    $scope.wrong_indicator = false;
    $scope.number_right = 0;
    $scope.timeout = 0;
    
    $scope.setmode = function(m) {
        $scope.next();
    };

    $scope.nextFact = function() {
        // Select a random fact
        $scope.fact = facts[Math.floor(Math.random() * facts.length)];

        // Randomize the order of questions for this fact
        $scope.fact.questions = shuffle($scope.fact.questions);

        // Initialize to the first question
        $scope.question = -1;

        $scope.nextQuestion();
    };
    
    $scope.nextQuestion = function() {
        
        $scope.timeout = 0;

        // Pick the next question
        $scope.question = $scope.question + 1;

        if ($scope.question < $scope.fact.questions.length) {
            // Randomize the order of the answers
            $scope.fact.questions[$scope.question].a = shuffle($scope.fact.questions[$scope.question].a);

            // Determine the answer (1-indexed)
            var i = 0;
            for (i = 0; i < $scope.fact.questions[$scope.question].a.length; i++) {
                if ($scope.fact.questions[$scope.question].a[i][1] == 1) {
                    $scope.answer = i + 1;
                }
            }
            
            $scope.resetclue();
        } else {
            $scope.nextFact();
        }
    };
    
    $scope.resetclue = function() {
        $scope.timeout = 0;
        $scope.right_indicator = false;
        $scope.wrong_indicator = false;
        
        var speaktext = $scope.fact.questions[$scope.question].q.replace(/_/g, "");
        speak(speaktext);
    };
    
    $scope.keyup = function(e) {
        // If they already got it right, ignore input
        if($scope.right_indicator) {
            return;
        }
        
        c = String.fromCharCode(e.keyCode);

        if(c == ' ') {
            $scope.next();
        }
        
        // Ignore key presses outside of 0-9
        if(c < '0' || c > '9') {
            return;
        }

        c = parseInt(c);
        
        if(c == $scope.answer) {
            $scope.correct();
        } else {
            $scope.incorrect(c);
        }
    };
    
    $scope.correct = function() {
        
        $scope.number_right += 1;
        
        $scope.right_indicator = true;
        $scope.wrong_indicator = false;
        
        if($scope.timeout !== 0) {
            $timeout.cancel($scope.timeout);
        }
        $scope.timeout = $timeout($scope.nextQuestion, 2000);
        
        $('#jpId_correct').jPlayer("play");
    };
    
    $scope.incorrect = function(c) {
        $scope.right_indicator = false;
        $scope.wrong_indicator = true;
        
        if($scope.timeout !== 0) {
            $timeout.cancel($scope.timeout);
        }
        $scope.timeout = $timeout($scope.nextQuestion, 2000);
      
        $('#jpId_incorrect').jPlayer("play");  
    };
    
    $scope.nextFact();
}