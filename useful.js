// Ce fichier contient toutes les fonctions pratiques à utiliser pour faciliter le code

// Fonction qui permet de récupérer la valeur d'une propriété CSS d'un élément
const getStyle = (a, b) =>{
    return window.getComputedStyle(b, null)[a];
}

/* Fonction qui permet de toggle l'id d'un élément juste en entrant le préfixe en paramètre, marche aussi si
 on rentre le suffixe en paramètre (tous mes toggles se font avec le suffixe "v2") */
const toggleId = (id) => {
    if(id.substring(id.length-2, id.length) === "v2"){
        id = id.substring(0,id.length-2);
    }
    let newId = null;
    // Si on rentre l'id correct, on rentre dans le if
    if(document.getElementById(id)!=null){
        if(id.substring(id.length-2, id.length)==="v2"){
            newId = id.substring(0, id.length-2);
        } else {
            newId = id+"v2";
        }
    // Si on rentre l'id incorrect, on définit le nouvel id par l'id de base + "v2"
    } else if (document.getElementById(id+"v2")!=null){
        newId = id;
        id = id+"v2";
    //Sinon il s'agirait de rentrer un id correct, je peut pas tout faire non plus
    } else {
        console.log("This id : "+id+" doesn't exist\n");
    }
    // On applique le nouvel id
    document.getElementById(id).id = newId;
    return newId;
}

const toggleIdString = (oldId) =>{
    //Réciupérer les deux derniers caractères de l'id
    let lastTwo = oldId.substring(oldId.length - 2, oldId.length);
    let newId = null;
    if(lastTwo === "v2"){
        newId = oldId.substring(0, oldId.length - 2);
    } else{
        newId = oldId + "v2";
    }
    return newId;
}

// Fonction qui permet de toggle la classe d'un élément
const toggleClass = (oldClass) => {
    //Réciupérer les deux derniers caractères de la classe
    let lastTwo = oldClass.substring(oldClass.length - 2, oldClass.length);
    if(lastTwo === "v2"){
        let newClass = oldClass.substring(0, oldClass.length - 2);
        document.querySelectorAll("."+oldClass).forEach((element) =>{
            element.className = newClass;
        });
    } else{
        document.querySelectorAll("."+oldClass).forEach((element) =>{
            element.className = oldClass + "v2";
        });
    }
}

// Fonction qui prend en paramètre le nom de la musique et le volume et joue le son automatiquement
const playSound = (file, volume) => {
    let audio = new Audio("sounds/"+file+".mp3");
    audio.volume = volume;
    audio.play();
    return audio;
}

// Fonction qui prend en parametre le nom de la musique et le volume et repete le son automatiquement 
const repeatSound = (file, volume) => {
    let audio = new Audio("sounds/"+file+".mp3");
    audio.volume = volume;
    audio.loop = true; 
    audio.play();
    return audio;
}

//Fonction qui prend en paramètre un audio et qui le fait diminuer progressivement jusqu'à 0
const fadeOutSound = (audio) =>{
    let interval = setInterval(() => {
        if(audio.volume > 0){
            audio.volume -= 0.01;
        } else {
            audio.pause();
            audio.volume = 0;
            clearInterval(interval);
        }
    }, 10); 
}

//Fonction qui prend un element en parametre et qui diminue son opacité progressement jusqu'à 0
const fadeOut = (element) => {
    let opacity = 1;
    let interval = setInterval(() =>{
        if(opacity <= 0.1){
            element.style.opacity = 0;
            element.style.display = "none";
            window.clearInterval(interval);
        }
        element.style.opacity = opacity;
        opacity -= opacity * 0.1;
    }, 5);
}

// Fonction qui prend un element en parametre et qui augmente son opacité progressement jusqu'à 1
const fadeIn = (element, display = "block") => { 
    let opacity = 0.1;
    element.style.display = display;
    let interval = setInterval(() => {
        if(opacity >= 0.9){
            opacity = 1;
            element.style.opacity = opacity;
            window.clearInterval(interval);
        } else{
            opacity += opacity * 0.1;
            element.style.opacity = opacity;
        }
    }, 7);
}
        
//Fonction qui enleve tous les attributs demandés d'un tableau d'éléments, l'attribut style par défaut
const removeAttribute = (tabElement, attr = "style") =>{
    tabElement.forEach((element) => {
        element.removeAttribute(attr);
    });
}

// Les id changent ("v2"), on doit pour retrouver un element peu importe si son id contient "v2" ou pas
const findElement = (id) => {
    if(document.getElementById(id) != null){
        return document.getElementById(id);
    } else if (document.getElementById(id+"v2") != null){
        return document.getElementById(id+"v2");
    } else{
        console.log("This id : "+id+" doesn't exist\n");
    }
    return null;
}

// Fonction qui vérifie si un id existe
const idExists = (id) =>{
    let result = false;
    if(document.getElementById(id) != null){
        result = true;
    } else if (document.getElementById(id+"v2") != null){
        result = true;
    }
    return result;
}

// Fonction qui ouvre un fichier JSON et qui le retourne
const openJSON = (url) => {
    let request = new XMLHttpRequest();
    request.open("GET", url, false);
    request.send(null);
    return JSON.parse(request.responseText);
}

//Fonction qui prend en parametre un element texte et qui le fait apparaitre lettre par lettre
const typeWriter = (element, text, speed, size) =>{
    element.style.fontSize = size+"px";
    element.innerHTML = "";
    let i = 0;
    let interval = setInterval(() =>{
        if(i < text.length){
            element.innerHTML += text.charAt(i);
            i++;
        } else{
            window.clearInterval(interval);
        }
    }, speed);
}