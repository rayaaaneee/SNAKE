//Fonctions qui ensemble permettent de lancer les jeux demandées lorqu'on clique sur le boutons Play

/*Fonction qui prend en paramètre quel jeu on lance et qui lance le jeu en question en gerant les animations et modifs 
nécéssaires au reste */
var startToPlay = false;
var gobacknewid = null;

const startGame = (index) => {

    startToPlay = true;

    //Définition des variables globales
    let id = null;
    let imageId = null;
    let volume = null;
    let backgroundColor = null;
    let loadersound = null;

    // On définit les variables selon le jeu choisit
    switch(index){
        case 0:
            loadersound = "loadersticks"
            gobacknewid = "gobacksticks";
            id="borderstick";
            imageId = "stick-image";
            volume = 0.01;
            backgroundColor = "rgb(235 230 238)";
            break;
        case 1:
            loadersound = "loadersnake"
            gobacknewid = "gobacksnake";
            id="bordersnake";
            imageId="snake-image";
            volume = 0.01;
            backgroundColor = "rgb(239, 245, 239)";
            break;
        default:
            return;
    }   
    //On change la couleur de la fleche selon le jeu
    goback.id = gobacknewid;

    //On lance la musique du jeu
    playSound(loadersound, volume);

    // On change l'appel de fonction du Boutton retour et on supprime les attributs du Hover JS du bloc 
    document.getElementById(gobacknewid).setAttribute("onclick", "areYouSureToQuit("+index+");");
    let blocToRemove = document.getElementById(id);
    blocToRemove.removeAttribute("onmouseleave");
    blocToRemove.removeAttribute("onmouseover");
    toggleId(id);
    toggleId(imageId);
    //Faire disparaitre le conteneur des jeux
    setTimeout(function(){
        document.getElementById(toggleIdString(id)).style.display = "none";
    }, 300);

    toggleId(gobacknewid);
    loader = document.getElementById("loader-main");
    toggleId("loader-main");
    fadeIn(loader);

    //Modifie la couleur du background selon le jeu choisi
    switch(index){
        case 0:
            let colorSticks = "rgb(59 42 137)";
            document.getElementById("loader-mainv2").style.border = "10px solid "+colorSticks;
            document.getElementById("loader-inner").style.backgroundColor = colorSticks;
            break;
        case 1:
            let colorSnake = "rgb(120, 170, 127)";
            document.getElementById("loader-mainv2").style.border = "10px solid "+colorSnake;
            document.getElementById("loader-inner").style.backgroundColor = colorSnake;
            break;
        default:
            break;
    }

    /* Faire disparaitre progressivement le loader au bout de 4s et lui redonner son id initial et
    réafficher la fleche de retour à la fin du chargement du loader et lance l'affichage du conteneur du jeu et
    des instructions */
    setTimeout(() => {
        let loader = document.getElementById("loader-mainv2");
        fadeOut(loader);
        loader.display = "flex";
        loader.opacity = 1;
    }, 4000);
    setTimeout(() => {
        toggleId("loader-main");
        toggleId(gobacknewid);
        toggleId("game");
        appearInstructions(index);
    }, 4300);

    //Changer le background selon le jeu choisi
    document.getElementById("background").style.backgroundColor = backgroundColor;
}


// Fonction qui fait apparaitre les instructions de chaque jeux
var passbutton = document.getElementById("passbutton");
var instructions = document.getElementById("instructions");
var instructionsText = document.querySelector("#instructions p");
var jsonInstructions = openJSON("datas/instructions.json");
var jsonArrayName = null;

const appearInstructions = (index) => {
    switch(index){
        case 0:
            jsonArrayName = 'instructionssticks';
            break;
        case 1:
            jsonArrayName = 'instructionssnake';
            break;
        default:
            return;
    }
    // On affiche les instructions
    passbutton.style.display = "none";

    //On affiche la première instruction
    fadeIn(instructions);
    typeWriter(instructionsText, jsonInstructions[jsonArrayName][0], 5, 40);
    numberInstruction++;
}

/*Fonction qui display none les réponses oui et non et qui affiche la prochaine instruction
et créer un action listener sur le bouton entrée*/
const secondInstruction = () => {
    document.querySelectorAll(".answers").forEach(element => {
        element.style.display = "none";
    });
    goNextInstruction();
}

//Fonction qui passe à l'instruction suivante si l'event renvoie que l'utilisateur a appuyé sur la touche entrée
const enterPressed = (event) =>{
    if (event.keyCode === 13) {
        goNextInstruction();
    }
}

//Fonction qui passe automatiquement à l'instruction suivante
const goNextInstruction = () => {
    if(numberInstruction < jsonInstructions[jsonArrayName].length){
        //On fait disparaitre les instructions précédentes et on affiche les suivantes
        document.removeEventListener("keyup", enterPressed);
        playSound("passinstructions", 0.07);
        fadeOut(instructions);
        setTimeout(() => {
            fadeIn(instructions, "flex");

            //Si l'utilisateur a passé l'instruction, on affiche le bouton passer
            if(numberInstruction == 1 || numberInstruction == jsonInstructions[jsonArrayName].length-1) passbutton.removeAttribute("style");
            
            typeWriter(instructionsText, jsonInstructions[jsonArrayName][numberInstruction], 5, 40);
            numberInstruction++;
            //On active l'event listener sur le bouton entrée
            document.addEventListener("keyup", enterPressed);   
        }, 500);
    } else {
        //On fait disparaitre les instructions et on lance le jeu choisi
        document.removeEventListener("keyup", enterPressed);
        disappearInstructions();
        if(jsonArrayName == "instructionssticks"){
            appearSticksGame();
        } else if(jsonArrayName == "instructionssnake"){
            appearSnakeGame();
        }
        //On enleve l'evenement listener sur le bouton entrée
        setTimeout(() => {
            document.removeEventListener("keyup", enterPressed);
        }, 200);
    }
}

//Fonction qui fait disparaitre les instructions
const disappearInstructions = () => {
    playSound("woosh", 0.1);
    fadeOut(instructions);
}

//Si l'utilisateur clique sur le bouton passer, on passe à la dernière instruction
const goToLastInstruction = () => {
    numberInstruction = jsonInstructions[jsonArrayName].length-1;
    secondInstruction();
}

//Fonction qui fait apparaitre le snake à l'écran
const appearSnakeGame = () =>{
    ostsnake = repeatSound("snakeost", 0.02);
    document.getElementById("choice-container-snake").style.display = "block";
    // On change le background 
    document.getElementById("background").style.backgroundImage = "url(backgrounds/forest.jpg)";
    document.getElementById("background").style.backgroundSize = "cover";
}

//Fonction qui fait apparaitre le jeu des batons à l'écran
const appearSticksGame = () => {
    sticksGameLaunched = true;
    oststicks = repeatSound("sticksost", 0.01);
    document.getElementById("background").style.backgroundImage = "url(backgrounds/sticks.jpg)";
    document.getElementById("background").style.filter = "blur(2px)";
    document.getElementById("background").style.backgroundSize = "cover";
    document.getElementById("background").style.removeProperty("background-color");

    // Appaaitre le jeu
    document.getElementById("all-sticks-game-container").style.display = "block";
    setTimeout(() => {
        document.getElementById("all-sticks-game-container").style.opacity = 1;
    }, 200);
}

/* Fonction qui demandera a l'utilisateur s'il est sur de vouloir quitter le jeu lorsqu'il clique sur le
bouton goback */
const areYouSureToQuit = (index) => {
    goBackFromGames(index);
}