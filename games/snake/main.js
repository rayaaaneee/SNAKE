// On recupere le snake container choice et le snake game container
var snakeContainerChoice = document.getElementById("choice-container-snake");
var snakeContainerGame = document.getElementById("snake-page");

// Fonction qui relance le jeu quand on appuie sur la touche entrée ou qu'on clique sur la touche Entrée
const restartGame = (event = null) => {
    displayingReplayButton = false;
    if(event == null || event.key == "Enter"){
        replayButton.removeAttribute("style");
        restartSound.play();
        WORLD.clearCanvas();
        WORLD.resetScore();
        initSnakeGame();
        removeEventListener("keydown", restartGame);
        addEventListener("keydown", startWithDirection);
    }
};


// Fonction qui initialise le jeu
const initSnakeGame = () => {
    nbGame++;
    WORLD = new world(canvas, nbGame, size, nbrApples, nbrPoisonedApples, nbrWalls, themeSprite);
    SNAKE = WORLD.snake;
    WORLD.updateWorld();
    WORLD.drawWorld();
};

/* Fonction qui prend en paramètre l'evenement et qui demarre le jeu si le joueur appuie sur la touche fleche de droite
ou flèche du haut */
const startWithDirection = (event) => {
    if (event.key == "ArrowRight") {
        SNAKE.direction = "right";
    } else if (event.key == "ArrowDown") {
        SNAKE.direction = "down";
    } else {
        return;
    }
    removeEventListener("keydown", startWithDirection);
    intervalAdvance = setInterval(forAnimate, speed);
    addEventListener("keydown", changeDirection);
}

// Fonction qui remet tous les paramètres par défaut quand le serpent meurt
var displayingReplayButton = false;
const gameOver = () => {
    displayingReplayButton = true;
    clearInterval(intervalAdvance);
    removeEventListener("keydown", changeDirection);
    replayButton.style.display = "flex"; 
    addEventListener("keydown", restartGame);
};

// Fonction qui permet de changer la direction du serpent
const changeDirection = (event) => {
    if(event.key == "ArrowRight"){
        SNAKE.changeDirection("right");
    } else if(event.key == "ArrowLeft"){
        SNAKE.changeDirection("left");
    } else if(event.key == "ArrowUp"){
        SNAKE.changeDirection("up");
    } else if(event.key == "ArrowDown"){
        SNAKE.changeDirection("down");
    }
};

// Fonction qui fait avancer le serpent et qui met à jour le score
const forAnimate = () => {
    WORLD.clearCanvas();
    if(SNAKE.move() == false){ //Essayer avec SNAKE.isDead
        WORLD.drawWorld();
        gameOver();
    } else {
        WORLD.updateWorld();
        WORLD.drawWorld();
        SNAKE.canChangeDirection = true;
    }
}

// Fonction qui permet de mettre en pause le jeu
const pauseGame = (event = null) => {
    if(SNAKE.direction != null){
        if(event == null || event.key == " "){
            // Actions quand il met le jeu sur pause
            if(paused){
                addEventListener("keydown", changeDirection);
                canvas.style.backgroundColor = background;
                intervalAdvance = setInterval( forAnimate, speed);
            } else {
            // Actions quand il reprend le jeu
                removeEventListener("keydown", changeDirection);
                canvas.style.backgroundColor = pausedBackground;
                clearInterval(intervalAdvance);
            }
            paused = !paused;
        }
    }
    return;
}

// Fonction principale, on l'appelle pour lancer le jeu une fois toutes les variables principales initialisées
const main = () => {
    
    initSnakeGame();

    addEventListener("keydown", startWithDirection);

    addEventListener("keydown", pauseGame);

};

// Variable qui compte le nombre de parties jouées
var nbGame = 0;

// Fonction qui initialise le snake
var WORLD = null;
var SNAKE = null;

// Variables à initialiser
var paused = false;
var intervalAdvance = null;

/* On déclare la mathode de la classe useful qui nous servira à ouvrir différents fichiers et on déclare tout ce qu'on 
a à déclarer avec cette classe */
const informations = useful.openJSON('games/snake/datas/levels.json');
const restartSound = useful.openSound('restart', 0.05);
const changeGameMode = useful.openSound('changeGameMode', 0.13);
const backToChoicesSound = useful.openSound('woosh', 0.1);

//On récupère les élemenents HTML qu'on utilisera
const canvas = document.getElementById("snake-canva");
const scoreText = document.getElementById("snake-score-number");
const replayButton = document.getElementById("snake-restart-button");

// On initialise la taille du canvas et la position initiale du serpent
var size = null;
const position = 0;

// On déclare la vitesse du serpent
var speed = null

// On déclare le nombre de pommes / murs
var nbrApples = null;
var nbrPoisonedApples = null;
var nbrWalls = null;

// On déclare le theme et background
var theme = null;
var background = null;
var pausedBackground = null;

// On initialise l'objet qui contient toutes les images
var allSprites = new sprite();
var themeSprite = null;

// On crée l'instance de la classe cookies
let allSelects = document.querySelectorAll("choice-snake-select");
const cookie = new cookies(allSelects);
const loadingSnake = () => {
    // On initialise le theme et les sprites qui vont avec
    theme = document.getElementById("select-theme").value;
    if(theme == "pixel"){
        themeSprite = allSprites.pixelSprite;
    } else if (theme == "classic"){
        themeSprite = allSprites.classicSprite;
    }  else if (theme == "pacman"){
        themeSprite = allSprites.pacmanSprite;
    }  else if (theme == "redpacman"){
        themeSprite = allSprites.redPacmanSprite;
    }  else if (theme == "google"){
        themeSprite = allSprites.googleSprite;
    }  else if (theme == "chrome"){
        themeSprite = allSprites.chromeSprite;
    } else if (theme == "purplegoogle"){
        themeSprite = allSprites.purpleGoogleSprite;
    } else if (theme == "purplechrome"){
        themeSprite = allSprites.purpleChromeSprite;
    } else if (theme == "purpleclassic"){
        themeSprite = allSprites.purpleClassicSprite;
    }

    // On récupère les valeurs des différents choix
    let sizeSelect = parseInt(document.getElementById("select-size").value);
    switch (sizeSelect) {
        case 5 :
            size = informations["dimensions"][0];
            break;
        case 10 :
            size = informations["dimensions"][1];
            break;
        case 20 :
            size = informations["dimensions"][2];
            break;
        case 30 :
            size = informations["dimensions"][3];
            break;
        case 50 :
            size = informations["dimensions"][4];
            break;
        case 75 :
            size = informations["dimensions"][5];
            break;
        case 100 :
            size = informations["dimensions"][6];
            break;
    }

    let speedSelect = document.getElementById("select-speed").value;
    if (speedSelect == "50") {
        speed = informations["speed"][0];
    } else if (speedSelect == "30"){
        speed = informations["speed"][1];
    } else if (speedSelect == "20"){
        speed = informations["speed"][2];
    } else if (speedSelect == "15"){
        speed = informations["speed"][3];
    } else if (speedSelect == "10"){
        speed = informations["speed"][4];
    } else if (speedSelect == "5"){
        speed = informations["speed"][5];
    } else if (speedSelect == "3"){
        speed = informations["speed"][6];
    } else if (speedSelect == "2"){
        speed = informations["speed"][7];
    } else if (speedSelect == "1"){
        speed = informations["speed"][8];
    }

    let nbrApplesSelect = document.getElementById("select-nbr-apples").value;
    if (nbrApplesSelect == "1") {
        nbrApples = informations["numberapples"][0];
    } else if (nbrApplesSelect == "2"){
        nbrApples = informations["numberapples"][1];
    } else if (nbrApplesSelect == "3"){
        nbrApples = informations["numberapples"][2];
    } else if (nbrApplesSelect == "4"){
        nbrApples = informations["numberapples"][3];
    } else if (nbrApplesSelect == "5"){
        nbrApples = informations["numberapples"][4];
    } else if (nbrApplesSelect == "10"){
        nbrApples = informations["numberapples"][5];
    } else if (nbrApplesSelect == "20"){
        nbrApples = informations["numberapples"][6];
    } else if (nbrApplesSelect == "50"){
        nbrApples = informations["numberapples"][7];
    } else if (nbrApplesSelect == "75"){
        nbrApples = informations["numberapples"][8];
    } else if (nbrApplesSelect == "100"){
        nbrApples = informations["numberapples"][9];
    } else if (nbrApplesSelect == "200"){
        nbrApples = informations["numberapples"][10];
    }

    let nbrPoisonApplesSelect = document.getElementById("select-nbr-poison-apples").value;
    if (nbrPoisonApplesSelect == "0") {
        nbrPoisonedApples = informations["numberpoisonedapples"][0];
    } else if (nbrPoisonApplesSelect == "1"){
        nbrPoisonedApples = informations["numberpoisonedapples"][1];
    } else if (nbrPoisonApplesSelect == "2"){
        nbrPoisonedApples = informations["numberpoisonedapples"][2];
    } else if (nbrPoisonApplesSelect == "3"){
        nbrPoisonedApples = informations["numberpoisonedapples"][3];
    } else if (nbrPoisonApplesSelect == "4"){
        nbrPoisonedApples = informations["numberpoisonedapples"][4];
    } else if (nbrPoisonApplesSelect == "5"){
        nbrPoisonedApples = informations["numberpoisonedapples"][5];
    } else if (nbrPoisonApplesSelect == "10"){
        nbrPoisonedApples = informations["numberpoisonedapples"][6];
    } else if (nbrPoisonApplesSelect == "20"){
        nbrPoisonedApples = informations["numberpoisonedapples"][7];
    } else if (nbrPoisonApplesSelect == "50"){
        nbrPoisonedApples = informations["numberpoisonedapples"][8];
    } else if (nbrPoisonApplesSelect == "75"){
        nbrPoisonedApples = informations["numberpoisonedapples"][9];
    } else if (nbrPoisonApplesSelect == "100"){
        nbrPoisonedApples = informations["numberpoisonedapples"][10];
    }

    let nbrWallsSelect = document.getElementById("select-nbr-walls").value;
    if (nbrWallsSelect == "0") {
        nbrWalls = informations["numberwalls"][0];
    } else if (nbrWallsSelect == "3"){
        nbrWalls = informations["numberwalls"][1];
    } else if (nbrWallsSelect == "5"){
        nbrWalls = informations["numberwalls"][2];
    } else if (nbrWallsSelect == "10"){
        nbrWalls = informations["numberwalls"][3];
    } else if (nbrWallsSelect == "15"){
        nbrWalls = informations["numberwalls"][4];
    } else if (nbrWallsSelect == "20"){
        nbrWalls = informations["numberwalls"][5];
    } else if (nbrWallsSelect == "30"){
        nbrWalls = informations["numberwalls"][6];
    } else if (nbrWallsSelect == "50"){
        nbrWalls = informations["numberwalls"][7];
    } else if (nbrWallsSelect == "75"){
        nbrWalls = informations["numberwalls"][8];
    } else if (nbrWallsSelect == "100"){
        nbrWalls = informations["numberwalls"][9];
    }

    let backgroundSelect = document.getElementById("select-background").value;
    canvas.removeAttribute("style");
    if (backgroundSelect == "light_blue") {
        background = informations["background"][0][0];
        pausedBackground = informations["background"][0][1];
    } else if (backgroundSelect == "dark_blue"){
        background = informations["background"][1][0];
        pausedBackground = informations["background"][1][1];
    } else if (backgroundSelect == "orange"){
        background = informations["background"][2][0];
        console.log("Background : " + background);
        pausedBackground = informations["background"][2][1];
    } else if (backgroundSelect == "violet"){
        background = informations["background"][3][0];
        pausedBackground = informations["background"][3][1];
    } else if (backgroundSelect == "pink"){
        background = informations["background"][4][0];
        pausedBackground = informations["background"][4][1];
    } else if (backgroundSelect == "green"){
        background = informations["background"][5][0];
        pausedBackground = informations["background"][5][1];
    } else if (backgroundSelect == "white"){
        background = informations["background"][6][0];
        pausedBackground = informations["background"][6][1];
    } else if (backgroundSelect == "black"){
        background = informations["background"][7][0];
        pausedBackground = informations["background"][7][1];
    } else if (backgroundSelect == "transparent"){
        background = informations["background"][8][0];
        pausedBackground = informations["background"][8][1];
    }
    canvas.style.backgroundColor = background;

    total = nbrPoisonedApples + nbrApples + nbrWalls;
    if(total > size*size-4){
        alert("Vous ne pouvez pas avoir plus d'élements que de cases sur le plateau, veuillez en choisir moins ou augmenter la taille du plateau.");
        alert("Rappel : il y a "+size+" x "+size+" = "+ (size*size) + " cases sur le plateau et vous avez en tout " + total + " élements en comptant tout, le serpent prend initialement 3 cases, il vous faut donc "+ size*size + " - 3 = " + (size*size-3) + " éléments au maximum.");
    } else {     
        // On désaffiche le menu de choix et on affiche le jeu
        snakeContainerChoice.style.display = "none";
        snakeContainerGame.style.display = "block";
        document.getElementById("go-to-choices").style.display = "block";
        // On lance le jeu
        main();
    }
}

// Fonction qui changera les images du menu choix selon ce qui est sélectionné
const changeImage = (event) => {
    changeGameMode.play();
    // On récupère l'id de l'élément sur lequel on a cliqué + sa valeur
    let id = event.target.id;
    let value = event.target.value;
    let img = null;
    if (id == "select-size"){
        img = document.getElementById("img-size");
        img.src = "games/snake/images/dimensions/" + value + ".png";
    } else if (id == "select-theme"){
        img = document.getElementById("img-theme");
        img.src = "games/snake/images/theme/" + value + ".png";
    } else if (id == "select-speed"){
        img = document.getElementById("img-speed");
        img.src = "games/snake/images/speed/" + value + ".png";
    } else if (id == "select-nbr-apples"){
        img = document.getElementById("img-nbr-apples");
        img.src = "games/snake/images/nbrapples/" + value + ".png";
    } else if (id == "select-nbr-poison-apples"){
        img = document.getElementById("img-nbr-poison-apples");
        img.src = "games/snake/images/nbrpoisonapples/" + value + ".png";
    } else if (id == "select-nbr-walls"){
        img = document.getElementById("img-nbr-walls");
        img.src = "games/snake/images/nbrwalls/" + value + ".png";
    } else if (id == "select-background"){
        img = document.getElementById("img-background");
        img.src = "games/snake/images/gamebackgrounds/" + value + ".png";
    }
}

const selects = document.querySelectorAll(".choice-snake-select");
selects.forEach(select => {
    select.addEventListener("change", changeImage);
});

// Fonction qui permet de retourner au menu de choix 
const backToChoices = () => {
    document.getElementById("go-to-choices").removeAttribute("style");

    backToChoicesSound.play();
    WORLD.clearCanvas();
    if (paused)
        pauseGame();
    replayButton.removeAttribute("style");
    clearInterval(intervalAdvance);
    WORLD.resetScore();
    removeEventListener("keydown", changeDirection);
    snakeContainerChoice.style.display = "block";
    snakeContainerGame.style.display = "none";
    WORLD.disappearHighScore();
    nbGame = 0;
}
    