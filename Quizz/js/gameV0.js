let config = {
    type: Phaser.AUTO,
    width: 600,
    height: 640,
    physics: {
        default: 'arcade'
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    autoCenter: true
};

let game = new Phaser.Game(config);
let backgroundImage;
let answerImage = [];
let answerText = [];
let answerNumber = 3;
let questionImage;
let playImage;
let playOffImage;
let currentQuestionIndex = 0;
let starImage = [];
let goodSound, wrongSound;

let welcome, quizText, menu, welcomeText;
let score = 0;

let quizzString ; // = '{ "questions": [ { "title": "Quel célèbre dictateur dirigea l’URSS du milieu des années 1920 à 1953 ?", "answers": ["Lenine", "Staline", "Molotov"], "goodAnswerIndex" : 1 }, {"title": "Ma deuxième question", "answers": ["Réponse 0", "Réponse 1", "Réponse 2"],"goodAnswerIndex" : 0}]}';
let quizz; // = JSON.parse(quizzString);



function preload() {
    this.load.image('background', './assets/Sprites/background.png');
    this.load.image('labelquestion', './assets/Sprites/label1.png');
    this.load.image('labelanswer', './assets/Sprites/label2.png');
    this.load.image('playimg', './assets/Sprites/play.png');
    this.load.image('playOFFimg', './assets/Sprites/playOFF.png');
    this.load.image('starImage', './assets/Sprites/Star.png');
    this.load.json('questions', './assets/data/Questions.json');
    this.load.audio('goodSound', './assets/Sound/good.wav');
    this.load.audio('wrongSound', './assets/Sound/wrong.wav');

    this.load.image('welcomeImage', './assets/Sprites/Windows3.png');
    this.load.image('menuImage', './assets/Sprites/Menu.png');
    this.load.image('restartImage', './assets/Sprites/Restart.png');
}


function create() {
    quizz = this.cache.json.get('questions');
    backgroundImage = this.add.image(0, 0, 'background'); 
    backgroundImage.setOrigin(0, 0); 
    backgroundImage.setScale(0.5);
    questionImage = this.add.image(300, 100, 'labelquestion');
    questionImage.setScale(0.5);
    questionImage.setVisible(false);
    
    playOffImage = this.add.image(300, 540, 'playOFFimg');
    playOffImage.setScale(0.4);
    playOffImage.setVisible(false);

    playImage = this.add.image(300, 540, 'playimg').setInteractive();
    playImage.on('pointerdown', displayNextQuestion)
    playImage.setScale(0.4);
    playImage.alpha=0;
    goodSound = this.sound.add('goodSound');
    wrongSound = this.sound.add('wrongSound');


    //build welcome screen
    welcome = this.add.image(300, 300, 'welcomeImage');
    welcome.setScale(0.7);
    welcome.alpha=1;

    menu = this.add.image(300, 350, 'menuImage').setInteractive();
    menu.on('pointerdown', displayGameScreen)
    menu.setScale(0.4);

    restart = this.add.image(300, 350, 'restartImage').setInteractive();
    restart.setVisible(false);
    restart.setScale(0.4);
    restart.on('pointerdown', restartGame)


    quizText = this.add.text(140,260, "poussez le bouton pour commencer");



    for (let i=0; i<10; i++){
        starImage[i] = this.add.image(50 + i*55,610, 'starImage');
        starImage[i].setScale(0.2);
        starImage[i].alpha = 0.5;
    }

    for(let i=0; i<answerNumber; i++) {
        answerImage[i] = this.add.image(300, 220 + i*110 , 'labelanswer').setInteractive();
        answerImage[i].on('pointerdown',  () => {checkAnswer(i)});
        answerImage[i].setScale(1.0);
        answerImage[i].setVisible(false);
    }
    questionText = this.add.text(155, 75, quizz.questions[0].title, { fontFamily: 'Arial', fontSize: 18, color: '#00ff00' });
    for(let i=0; i<answerNumber; i++) {
        answerText[i] = this.add.text(190, 210+i*110, quizz.questions[0].answers[i], { fontFamily: 'Arial', fontSize: 18, color: '#00ff00' });
        answerText[i].setVisible(false);
    }
    questionText.setVisible(false);
}

function update() {
}

function checkAnswer(answerIndex){
    if (answerIndex==quizz.questions[currentQuestionIndex].goodAnswerIndex) {
        //alert("OK");
        goodSound.play();
        starImage[currentQuestionIndex].alpha = 1;
        score++;       
    }
    else {
        wrongSound.play();
        //alert("Pas OK");
        starImage[currentQuestionIndex].tint = 0xff0000;
    }
    
    playImage.alpha=1;
    for (let i=0; i<3; i++) {
        answerImage[i].disableInteractive();
        if (i==quizz.questions[currentQuestionIndex].goodAnswerIndex) answerText[i].setColor('#00ff00');
        else answerText[i].setColor('#ff0000');
    }
}

    function displayNextQuestion(){
        currentQuestionIndex ++;
        if (currentQuestionIndex > 9){
            //alert("Vous avez " + score + " sur 10!")
            displayGameOver();

        } 
        else {
            questionText.text = quizz.questions[currentQuestionIndex].title;
            for(let i=0; i<3; i++){
                answerText[i].text = quizz.questions[currentQuestionIndex].answers[i];
                answerText[i].setColor('#000000');
            }
        playImage.alpha = 0;
        for(let i=0; i<3; i++) answerImage[i].setInteractive();
        }
    }

    function displayGameScreen(){
        welcome.setVisible(false);
        quizText.setVisible(false);
        welcome.setVisible(false);
        menu.setVisible(false);

        questionImage.setVisible(true);
        questionText.setVisible(true);

        for (let i=0; i<3; i++){
            answerImage[i].setVisible(true);
            answerText[i].setVisible(true);

        }
        for(let i=0; i<10; i++){
            starImage[i].alpha = 0.5;
            starImage[i].tint = 0xffffff;
        }
    }
    function displayGameOver(){
        welcome.setVisible(true);
        quizText.setVisible(false);
        welcome.setVisible(true);
        welcome.text="Vous avez un score de "+ score + "/10\nPresser le bouton pour recommencer";
        restart.setVisible(true);

        playImage.setVisible(false);
        questionImage.setVisible(false);
        questionText.setVisible(false);
        for(let i=0; i<3; i++){
            answerImage[i].setVisible(false);
            answerText[i].setVisible(false);
        }
    }

    function restartGame(){
        currentQuestionIndex = -1;
        displayNextQuestion();

        restart.setVisible(false);
        displayGameScreen();
        score=0;
    }


/*

- quizz
    - question []
        -title (string)
        -answer [] (string)
        -goodAnswerIndex (int)

Implémentation dans :
    - une Base de données
    - CSV
    - XML
    - JSON
    - YAML

XML :
    <quizz>
        <question>
            <title>la première question ?</title>
            <answer i="0"> Réponse 0</answer>
            <answer i="1"> Réponse 1</answer>
            <answer i="2"> Réponse 2</answer>
            <goodAnswerIndex>1</goodAnswerIndex>
        </question>
    </quizz>

YAML :
    quizz :
        question :
            title : "La première question"
            answer : "Réponse 0"
            goodAnswerIndexAnswerIndex : 1
        question :
            title : "La première question"
            answer : "Réponse 0"
            goodAnswerIndexAnswerIndex : 0

JSON :
    {
        "questions":[
            {
                "title": "Ma premère question",
                "answer": ["réponse 0", "Réponse 1"],
                "goodAnswerIndex" : 1
            },
            {
                "title": "Ma deuxième question",
                "answer": ["réponse 0", "Réponse 1"],
                "goodAnswerIndex" : 0
            }
        ]
    }

    */