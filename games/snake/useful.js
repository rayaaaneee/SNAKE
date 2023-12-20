class useful{
    constructor(){}

    // Fonction qui prend en paramètre le nom du fichier image et qui retourne l'image
    static openImage(url){
        let img = new Image();
        img.src = "games/snake/images/"+url+".png";
        return img;
    }

    // Fonction qui prend en paramètre le nom du fichier audio et qui retourne l'audio
    static openSound (file, volume){
        let audio = new Audio("games/snake/sounds/"+file+".mp3");
        audio.volume = volume;
        return audio;
    }

    // Fonction qui prend en paramètre l'url du fichier json et qui retourne sa réponse 
    static openJSON (url) {
        var request = new XMLHttpRequest();
        request.open('GET', url, false);
        request.send(null);
        return JSON.parse(request.responseText);
    }
}