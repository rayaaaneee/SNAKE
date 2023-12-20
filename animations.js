//Fonction qui fait clignoter le texte à allure régulière et qui gère sa disparition quand on clique sur une case
const blinkText = () => {
    // L'id du goBack change si on choisit un jeu, il faut donc le vérifier
    let gobackid = "goback";
    if(idExists("gobacksnake")) {
        gobackid = "gobacksnake";
    } else if(idExists("gobacksticks")) {
        gobackid = "gobacksticks";
    }
    setInterval(function(){
        if(document.getElementById(gobackid).style.display != "block"){
            document.getElementById("blinkingtext").style.display = "none";
            setTimeout(function(){
                document.getElementById("blinkingtext").style.display = "block";
            }, 300);
        } else{
            document.getElementById("blinkingtext").style.display = "none";
        }
    }, 600);
}
blinkText();

/* Les back-ground image mettent du temps à charger, le code ici permet de cacher les images qui sont
de base cachées derrrière celles ci */
setTimeout(() => {
    document.querySelectorAll(".game-image").forEach(function(element){
        element.style.display = "block";
    });
}, 400);

// Fonction qui vérifie si une classe ou un id est présent dans le document
const verifyClassOrId = (name, type) =>{
    let result = false;
    if(type === "id")
        if(document.getElementById(name) == null)
            result = false;
        else
            result = true;
    else if(type === "class")
        if(document.getElementsByClassName(name) == null)
            result = false;
        else
            result = true;
    return result;
}

// Variables qui recupereront la position initiale des backgrounnds-images de chaque bloc

// Fonctions qui prennent en compte le bouton "Play" dans le hover et qui lancent le hover sur le bloc
// et l'enlevent si la souris quitte l'item 
const specialHover = (index) => {
    fixTextDecalage(index);
    let bloc = null;
    let tmp = null;
    let border = null;
        if(index == 0){
            border = document.getElementById("borderstick");
            bloc = document.getElementById("stick-bloc");
            bloc.style.backgroundSize = "150% 130%"
        } else if(index == 1){
            border = document.getElementById("bordersnake");
            bloc = document.getElementById("snake-bloc");
            bloc.style.backgroundSize = "220% 140%";
        } else {
            return;
        }
        border.style.scale = 1.1;
        border.style.transform = "rotate(2deg)";
        border.style.boxShadow = "0 0 20px 5px #ffffff";
}

const undoSpecialHover = (index) =>{
    hover = false;
    let bloc = null;
    let border = null;
    if(index == 0){
        border = document.getElementById("borderstick");
        bloc = document.getElementById("stick-bloc");
        bloc.style.backgroundSize = "120% 100%";
    } else if(index == 1){
        border = document.getElementById("bordersnake");
        bloc = document.getElementById("snake-bloc");
        bloc.style.backgroundSize = "150% 100%";
    } else{
        return;
    }
    border.style.scale = 1;
    border.style.transform = "rotate(0deg)";
    border.style.boxShadow = "none";
}

// Fonctions qui gèrent le hover des boutons (qui faisait n'importe quoi de base)
const specialButtonHover = (index) => {
    let border = null;
    let tmp = null;
    switch(index){
        case 0:
            border = document.getElementById("borderstick");
            bloc = document.getElementById("stick-bloc");
            bloc.style.backgroundSize = "210% 180%";
            break;
        case 1:
            border = document.getElementById("bordersnake");
            bloc = document.getElementById("snake-bloc");
            bloc.style.backgroundSize = "300% 210%";
            break;
        default:
            return;
    }
    border.style.scale = 1.1;
    border.style.transform = "rotate(2deg)";
    border.style.boxShadow = "0 0 20px 5px #ffffff";
}

const undoSpecialButtonHover = (index) => {
    let button = null;
    let bloc = null;
    if(index == 0){
        button = document.getElementById("stick-button");
        bloc = document.getElementById("stick-bloc");
    } else if(index == 1){
        button = document.getElementById("snake-button");
        bloc = document.getElementById("snake-bloc");
    } else{
        return;
    }
    button.style.transform = "scale(1)";
    button.style.boxShadow = "none";
} 

/* Fonctions qui lancent l'animation des images de chaque bloc en cliquant dessus */

var enterplay = false;
const printSticks = () => {
    fadeIn(document.getElementById("goback"));
    if(!enterplay){
        centerBlocs();
        deactivateCursorPointer();
        playSound("sticksnoise", 0.4);
        enterplay = true;
        toggleId("stick-image");
        let bloc=document.getElementById("bordersnake");
        bloc.style.display = "none";
        toggleClass("play-button");
    }
}

const printSnake = () =>{
    fadeIn(document.getElementById("goback"));
    if(!enterplay){
        centerBlocs();
        deactivateCursorPointer();
        playSound("rattlesnake", 0.07);
        enterplay = true;
        toggleId("snake-image");
        let bloc=document.getElementById("borderstick");
        let main=document.getElementById("bordersnake");
        main.style.transform = "rotate(-3deg)";
        bloc.style.display = "none";
        toggleClass("play-button");
    }
}

/* Fonction qui permet au bouton de Retour de bien revenir à la page d'accueil à partir de la page d'affichage
du bouton "Play" en faisant les modifs nécéssaires au reste (désafficher les éléments) */
const goBackFromBorders = () =>{
    decenterBlocs();
    activateCursorPointer();
    let bloc1=document.getElementById("borderstick");
    let bloc2=document.getElementById("bordersnake");
    bloc1.style.display = "block";
    bloc2.style.display = "block";

    if(verifyClassOrId("stick-imagev2", "id")){
        toggleId("stick-imagev2")
    } else if(verifyClassOrId("snake-imagev2", "id")){
        toggleId("snake-imagev2");
    }

    fadeOut(document.getElementById("goback"));
    enterplay=false;
    playSound("woosh", 0.15);
    toggleClass("play-buttonv2");   
    toggleId("game");
}

/* Fonction qui permet au bouton de Retour de bien revenir à la page start à partir de la 
page du debut du jeu en faisant les modifs nécéssaires au reste */
var numberInstruction = 0;
var ostsnake = null;
var oststicks = null;
const goBackFromGames = (index) => {
    //On coupe le son qui a pu être lancé si les consignes ont été passées ou lues
    if(ostsnake != null){
        ostsnake.pause();
        ostsnake=null;
    } else if(oststicks != null){
        oststicks.pause();
        oststicks=null;
    } 
    
    playSound("woosh", 0.15);
    enterplay = false;
    let bloc1 = null;
    let bloc2 = null;
    let container = document.getElementById("container");
    let background = document.getElementById("background");
    //On initialise des valeurs selon le jeu qui a été lancé
    switch(index){
        case 0:
            gobacknewid = "gobacksticks";
            bloc1 = document.getElementById("borderstickv2");
            bloc2 = document.getElementById("bordersnake");
            bloc1.id = "borderstick";
            typeGame = "Sticks";
            break;
        case 1:
            gobacknewid = "gobacksnake";
            bloc1 = document.getElementById("bordersnakev2");
            bloc2 = document.getElementById("borderstick");
            bloc1.id = "bordersnake";
            typeGame = "Snake";
            break;
        default:
            break;
    }
    let goback = document.getElementById(gobacknewid);

    // On enleve le bouton retour en arrière et retour à la "page d'accueil"
    fadeOut(goback);
    fadeIn(container);

    //On remet la classe de base des boutons pour les enlever de la page d'accueil
    toggleClass("play-buttonv2");

    //On remet tout comme par défaut
    const forRemoveAttributes = [bloc1, bloc2, container, background];
    removeAttribute(forRemoveAttributes);
    setTimeout(function(){
        //Sauf goback et game-image
        let array = [];
        array.push = document.getElementById("container");
        array.push = document.getElementById("background"); 
        array.push = document.getElementById("borderstick"); 
        array.push = document.getElementById("bordersnake"); 
        array.push = document.getElementById("background"); 
        array.push = document.getElementById("title-sticks");
        removeAttribute(array);
    }, 500);

    //On remet les bons attributs pour les blocs de jeu 
    let i = 0;
    Array.from(document.getElementsByClassName("squares")).forEach(function(element){
        element.style.cursor = "pointer";
        element.setAttribute("onmouseover","specialHover("+i+")");
        element.setAttribute("onmouseleave","undoSpecialHover("+i+")");
        i++;
    });

    //On remet les bons attributs pour le bouton de retour
    goback.setAttribute("onclick","goBackFromBorders()");

    //On remet le boolean de lancement de jeux à faux
    startToPlay = false;

    //On remet la flèche de retour à la page d'accueil à la couleur de base
    goback.id="goback";

    //On fait disparaitre le jeu
    toggleId("game");
    findElement("instructions").style.display = "none";
    numberInstruction = 0;

    //On enleve les styles appliquées aux boutons oui et non de la premiere instruction
    document.querySelectorAll(".answers").forEach(function(element){
        element.removeAttribute("style");
    });

    /*Si la page des choix s'est affichée, on la fait disparaitre et si la page du jeu s'est affichée,
    on la fait disparaitre */
    console.log("sticksGameLaunched : " +sticksGameLaunched);
    if (sticksGameLaunched){
        document.querySelector("#all-sticks-game-container").style.display = "none";
        goToSettingsSticksGame();
        document.querySelector(".allinstructionssticks").style.display = "none";
        sticksGameLaunched = false;
    } else {
        document.getElementById("all-sticks-game-container").removeAttribute("style");
        document.getElementById("choice-container-snake").removeAttribute("style");
        document.getElementById("snake-page").removeAttribute("style");
        document.getElementById("go-to-choices").removeAttribute("style");
        WORLD.clearCanvas();
    }
}

//Fonctions qui centrent les blocs et qui les décentrent si on les appelle
const centerBlocs = () => {
    document.getElementById("container").style.marginTop = "50vh";
    document.getElementById("container").style.transform = "translateY(-50%)";
}

const decenterBlocs = () => {
    document.getElementById("container").style.marginTop = "65vh";
    document.getElementById("container").style.transform = "translateY(-60%)";
}

//Fonctions qui activent / désactivent le cursor pointer sur le bloc tel quel (sert à montrer qu'il faut cliquer sur PLAY)
const activateCursorPointer = () =>{
    document.querySelectorAll(".squares").forEach((element) => {
        element.style.cursor = "pointer";
    });
}

const deactivateCursorPointer = () => {
    document.querySelectorAll(".squares").forEach((element) => {
        element.style.cursor = "default";
    });
}

/* Regler bug decalage du texte pendant le hover des blocs non du au css ni au javascript (aucun margin ou padding en
rapport) avec les titres*/
var var1Fixed = false;
var var2Fixed = false;
const fixTextDecalage = (index) =>{
    let margin = null;
    if(index == 0 && !var1Fixed){
        title1 = document.getElementById("title-sticks");
        margin = getStyle("top",title1);
        margin = margin.substring(0, margin.length-2);
        margin = parseInt(margin)-10;
        document.getElementById("title-sticks").style.top = margin+"px";
        var1Fixed = true;
        return;
    } else if(index == 1 && !var2Fixed){
        title2 = document.getElementById("title-snake");
        margin = getStyle("top",title2);
        //Enlever les 2 derniers caractères de la string (px)
        margin = margin.substring(0, margin.length-2);
        margin = parseInt(margin)-10;
        document.getElementById("title-snake").style.top = margin+"px";
        var2Fixed = true;
        return;
    }
}