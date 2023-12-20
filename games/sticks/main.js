var choosecontainer = document.getElementById('choose-sticks-container');
var allinstructionsticks = document.querySelectorAll(".allinstructionssticks");
var sticks = null;
var allsticks = ManageSticks.gamecontainer.querySelector("#allsticks");
var sticks = null;
var AI_Mode = null;
/* Passer au tour suivant */
const goNextTurn = (game) => {
    if(!ManageSticks.goNextTurnButton.disabled) {
        ManageSticks.goNextSound.play();
        sticks.bot.play();
    }
}

/* Fonction principale qui démarre le jeu */
var isStarted = false;
const startSticksGame = () => {
    ManageSticks.isInGame = true;
    // On désactive le bouton principal
    ManageSticks.goNextTurnButton.disabled = true;
    isStarted = true;

    // On affiche le container du jeu
    choosecontainer.style.display = "none";
    ManageSticks.gamecontainer.removeAttribute("style");

    // On crée l'instance de ManageSticks et on démarre le jeu
    sticks = new ManageSticks(nbSticks, starting, AI_Mode);

    // On appelle la méthode resize pour que les confettis s'adapte à la taille de l'écran
    window.onresize = confetti.resize;
}

/* On fait apperaitre les instructions dans l'ordre */
var indexInstruction = 0; 
var indexLimit = allinstructionsticks.length;
var nbSticks = null;

// Remettre à null
var starting = null;

var canStart = false;
var reDisplay = false;
const appearSticksInstructions = () => {
    ManageSticks.goNextSound.play();

    //On cache toutes les instructions
    for(var i = 0; i < allinstructionsticks.length; i++)
        allinstructionsticks[i].style.display = "none";

    // On recupere les informations de chaque instruction
    switch(indexInstruction){
        case 0:
            if(allinstructionsticks[0].querySelector("select").value == "hard")
                AI_Mode = "hard";
            else if (allinstructionsticks[0].querySelector("select").value == "easy")
                AI_Mode = "easy";
            else if (allinstructionsticks[0].querySelector("select").value == "medium")
                AI_Mode = "medium";
            indexInstruction++;
            break;
        case 1:
            if(parseInt(allinstructionsticks[1].querySelector("select").value) == 1)
                indexInstruction=2;
            else
                indexInstruction=3;
            break;
        case 2:
            if(reDisplay){
                reDisplay = false;
                allinstructionsticks[2].style.display = "flex";
                return;
            }
                
            // Si l'utilisateur n'a rien mit on met 30 par defaut
            if(allinstructionsticks[2].querySelector("input").value == ""){
                nbSticks = 20;
            // Sinon on regarde si il a mis un nombre entre 10 et 50
            } else {
                nbSticks = parseInt(allinstructionsticks[2].querySelector("input").value);
                if(nbSticks < 12 || nbSticks > 50){
                    alert("Le nombre de batons doit etre compris entre 12 et 50");
                    indexInstruction = 2;
                    allinstructionsticks[2].querySelector("input").value = "";
                    reDisplay = true;
                    return appearSticksInstructions();
                }
            }
            canStart = true;
       break;
        case 3:
            if(allinstructionsticks[3].querySelector("select").value == "bot")
                starting = true;
            else
                starting = false;
            canStart = true;
            break;
        default:
            break;
    }

    // Si la limite d'index est atteinte, on arrete
    
    if(canStart){
        // On remet les instructions correctement
        for(var i = 0; i < allinstructionsticks.length; i++)
            allinstructionsticks[i].style.display = "none";
        indexInstruction = 0;
        startSticksGame();
        return;
    }

    // On affiche l'instruction suivante en désaffichant celle d'avant
    allinstructionsticks[indexInstruction].removeAttribute("style");
    allinstructionsticks[indexInstruction-1].style.display = "none";
}

var sticksGameLaunched = false;
addEventListener("keydown", (event) => {
    if(event.key == "Enter" && sticksGameLaunched){
        console.log("enter");
        if(!isStarted) {
            appearSticksInstructions();
            console.log("appearSticksInstructions");
        } else if (isStarted && ManageSticks.isInGame) {
            console.log("go next turn");
            goNextTurn();
        }
    }
});

document.querySelectorAll("select").forEach((select) => {
    select.addEventListener("change", (event) => {
        ManageSticks.goNextSound.play();
    });
});

var load = document.querySelectorAll("#bot p");
var intervalLoad = null;
// Fonction qui s'occupe de l'animation des points (bot)
const animateLoadBot = (color) => {
    var index = 3;
    intervalLoad = setInterval(() => {
        load[(index-1)%3].removeAttribute("style");
        load[index%3].style.color = color;
        index++;
    },300);
}
animateLoadBot("white");

// Fonction qui s'occupe de l'animation des points (joueur)
var pointsPlayerLoad = document.querySelectorAll("#player p:not(#player p:first-child)");
const animateLoadPlayer = () => {
    var index = 4;
    intervalLoad = setInterval(() => {
        switch(index%4){
            case 0:
                pointsPlayerLoad[0].removeAttribute("style");
                break;
            case 1:
                pointsPlayerLoad[1].removeAttribute("style");
                break;
            case 2:
                pointsPlayerLoad[2].removeAttribute("style");
                break;
            case 3:
                pointsPlayerLoad.forEach((point) => {
                    point.style.opacity = "0";
                });
                break;
        }
        index++;
    },700);
}
animateLoadPlayer();

let boolScaleImgWin = false;
const animateImgWin = () => {
    let winnerImg = ManageSticks.winnerContent.querySelector("img");
    let rotate = parseInt(winnerImg.style.getPropertyValue("transform").split(" ")[0].split("(")[1].split(")")[0].replace("deg", ""));
    let scale = parseFloat(winnerImg.style.getPropertyValue("transform").split(" ")[1].split("(")[1].split(")")[0]);

    switch (boolScaleImgWin) {
        case false :
            rotate += 7
            scale += 0.1;
            winnerImg.style.transform = "rotate("+rotate+"deg) scale("+scale+")";
            break;
        case true : 
            rotate -= 7;
            scale -= 0.1;
            winnerImg.style.transform = "rotate("+rotate+"deg) scale("+scale+")";
            break;
    }
    boolScaleImgWin = !boolScaleImgWin;
}
setInterval(animateImgWin, 2000);

// Fonction qui s'occupe du restart
const restartSticksGame = () => {
    ManageSticks.goNextSound.play();
    ManageSticks.isInGame = true;
    this.sticks.resetGame();
}

// Fonction qui s'occupe du retour aux paramètres
const goToSettingsSticksGame = () => {
    canStart = false;
    isStarted = false;
    ManageSticks.goNextSound.play();
    ManageSticks.isInGame = false;

    // Modifications nécéssaires pour revenir au début
    allinstructionsticks[2].querySelector("input").value = "";
    allinstructionsticks[3].querySelector("select").selectedIndex = 0;
    this.sticks.deleteAllHtmlSticks();
    indexInstruction = 0;

    // On remet les instructions correctement
    ManageSticks.winnerContent.style.opacity = 0;

    setTimeout(() => {
        ManageSticks.winnerContent.style.display = "none";
        ManageSticks.gamecontainer.style.display = "none";
        choosecontainer.style.display = "block";

        // On réaffiche les instructions
        allinstructionsticks[0].style.display = "flex";
    }, 300);
}