class sprite{
    constructor(){
        // Tableau qui contiendra tous les sprites
        this.array = new Array();

        // On définit tous les sprites et on les ajoute à l'array
        this.pixelSprite = this.#initAndPush(this.pixelSprite);
        this.pacmanSprite = this.#initAndPush(this.pacmanSprite);
        this.redPacmanSprite = this.#initAndPush(this.redPacmanSprite);
        this.classicSprite = this.#initAndPush(this.classicSprite);
        this.purpleClassicSprite = this.#initAndPush(this.purpleClassicSprite);
        this.googleSprite = this.#initAndPush(this.googleSprite);
        this.purpleGoogleSprite = this.#initAndPush(this.purpleGoogleSprite); 
        this.chromeSprite = this.#initAndPush(this.chromeSprite);
        this.purpleChromeSprite = this.#initAndPush(this.purpleChromeSprite);
        
        // On initialise les URLs, les types et on affecte toutes les images à chaque objet
        this.#initTypes();
        this.#initURLs();
        this.#initSprite();
    }

    #initSprite () {
        this.array.forEach((element) => {
            if (element.url != undefined) {
                if (element.corners) {
                    element.cornerUpLeft = useful.openImage("theme/"+element.url+"_sprite/corner_up_left");
                    element.cornerUpRight = useful.openImage("theme/"+element.url+"_sprite/corner_up_right");
                    element.cornerDownLeft = useful.openImage("theme/"+element.url+"_sprite/corner_down_left");
                    element.cornerDownRight = useful.openImage("theme/"+element.url+"_sprite/corner_down_right");
                }

                if(element.rotations) {
                    element.tailUp = useful.openImage("theme/"+ element.url + "_sprite/tail_up");
                    element.tailDown = useful.openImage("theme/"+ element.url + "_sprite/tail_down");
                    element.tailLeft = useful.openImage("theme/"+ element.url + "_sprite/tail_left");
                    element.tailRight = useful.openImage("theme/"+ element.url + "_sprite/tail_right");
                    element.verticalBody = useful.openImage("theme/"+ element.url + "_sprite/vertical_body");
                    element.horizontalBody = useful.openImage("theme/"+ element.url + "_sprite/horizontal_body");
                } else {
                    element.tail = useful.openImage("theme/"+ element.url + "_sprite/tail");
                    element.body = useful.openImage("theme/"+ element.url + "_sprite/body");
                }

                element.appleImage = useful.openImage("theme/"+element.url+"_sprite/apple");
                element.poisonedAppleImage = useful.openImage("theme/"+element.url+"_sprite/poisoned_apple");
                element.headUp = useful.openImage("theme/"+element.url+"_sprite/head_up");
                element.headDown = useful.openImage("theme/"+element.url+"_sprite/head_down");
                element.headLeft = useful.openImage("theme/"+element.url+"_sprite/head_left");
                element.headRight = useful.openImage("theme/"+element.url+"_sprite/head_right");
            } 
            element.wallImage = useful.openImage("wall");
        });
    }

    #initURLs () {
        this.pacmanSprite.url = "pacman";
        this.redPacmanSprite.url = "red_pacman";
        this.classicSprite.url = "classic";
        this.purpleClassicSprite.url = "purple_classic";
        this.googleSprite.url = "google";
        this.purpleGoogleSprite.url = "purple_google";
        this.chromeSprite.url = "chrome";
        this.purpleChromeSprite.url = "purple_chrome";
    }

    #initTypes () {
        // true : with corners // false : without corners
        this.pixelSprite.corners = false;
        this.pacmanSprite.corners = false;
        this.redPacmanSprite.corners = false;
        this.classicSprite.corners = true;
        this.purpleClassicSprite.corners = true;
        this.googleSprite.corners = true;
        this.purpleGoogleSprite.corners = true;
        this.purpleGoogleSprite.corners = true;
        this.chromeSprite.corners = true;
        this.purpleChromeSprite.corners = true;

        // true : with rotation of tail // false : without rotation of tail
        this.pixelSprite.rotations = false;
        this.pacmanSprite.rotations = false;
        this.redPacmanSprite.rotations = false;
        this.classicSprite.rotations = true;
        this.purpleClassicSprite.rotations = true;
        this.googleSprite.rotations = true;
        this.purpleGoogleSprite.rotations = true;
        this.chromeSprite.rotations = true;
        this.purpleChromeSprite.rotations = true;
    }

    #initAndPush (sprite) {
        sprite = new Object();
        this.array.push(sprite);
        return sprite;
    }
}