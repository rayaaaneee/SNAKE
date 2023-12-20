class snake {
    // L'ensemble des attributs du serpent
    constructor(world) {
        this.body = [new cell(0, 0), new cell(1, 0), new cell(2, 0)];
        this.direction = null;

        this.worldLength = world.length;
        this.world = world;

        // Permet d'éviter que le serpent ne change de direction plusieurs fois dans la même boucle
        this.canChangeDirection = true;

        this.deathSound = useful.openSound("endgame", 0.07);
        /* this.winSound = new useful().openSound("wingame", 0.1); */
        this.winSound = useful.openSound("espana", 1);
        this.isDead = false;
        this.winGame = false;
    }
    
    // Fonction qui fait avancer le serpent
    move() {
        // Variable qui permet de savoiir si le jeu peut continuer (plateau plein ou serpent mort)
        let keepGame = true;

        // On vérifie si le plateau est plein
        if(this.world.isFull()) {
            keepGame = false;
            this.winGame = true;
            this.winSound.play();
            this.direction = null;
        // Changement de la direction du serpent et gestion des collisions avec les bords
        } else if(this.direction == "right" && this.body[this.body.length-1].x < this.worldLength-1 && !this.#bodyCollision() && !this.#wallCollision()) {
            this.#advanceBody();
            this.body[this.body.length-1].x++;
        } else if(this.direction == "left" && this.body[this.body.length-1].x > 0 && !this.#bodyCollision() && !this.#wallCollision()) {
            this.#advanceBody();
            this.body[this.body.length-1].x--;
        } else if(this.direction == "up" && this.body[this.body.length-1].y > 0 && !this.#bodyCollision() && !this.#wallCollision()) {
            this.#advanceBody();
            this.body[this.body.length-1].y--;
        } else if(this.direction == "down" && this.body[this.body.length-1].y < this.worldLength-1 && !this.#bodyCollision() && !this.#wallCollision()) {
            this.#advanceBody();
            this.body[this.body.length-1].y++;
        } else{
            // Direction = null => le serpent n'a pas encore bougé
            if(this.direction != null) {
                // regler bug de la tete qui disparait quand on perd
                this.deathSound.play();
                this.direction = null;
                this.isDead = true;
                keepGame = false;
            }
        }
        return keepGame;
    }

    // Fonction privée qui fait avancer le corps du serpent (sauf la tête)
    #advanceBody() {
        for(let i = 0; i < this.body.length-1; i++) {
            this.body[i].x = this.body[i+1].x;
            this.body[i].y = this.body[i+1].y;
        } 
    }

    // Fonction qui change la direction du serpent
    changeDirection(newDirection) {
        if(this.canChangeDirection && this.direction != newDirection) {
            if(this.direction == "right" && newDirection == "left") {
                return;
            } else if(this.direction == "left" && newDirection == "right") {
                return;
            } else if(this.direction == "up" && newDirection == "down") {
                return;
            } else if(this.direction == "down" && newDirection == "up") {
                return;
            }
            this.direction = newDirection;
            this.canChangeDirection = false;
        }  
    }

    // Fonction qui vérifie si la tete du serpent a touché son corps
    #bodyCollision() {
        let result = false;
        // On recupere la position initiale de la tete du serpent
        let positionX = this.body[this.body.length-1].x;
        let positionY = this.body[this.body.length-1].y;
        // Selon la direction du serpent, on change le tmp de la future position de la tete
        if(this.direction == "right") {
            positionX++;
        } else if(this.direction == "left") {
            positionX--;
        } else if(this.direction == "up") {
            positionY--;
        } else if(this.direction == "down") {
            positionY++;
        }
        /* On verifie si la future position de la tete du serpent est la meme que celle d'un autre element du corps
        a part la queue qui est censée se deplacer */
        for(let i = 1; i < this.body.length-1; i++) {
            if(this.body[i].x == positionX && this.body[i].y == positionY) {
                result = true;
            }
        }
        return result;
    }

    #wallCollision() {
        let result = false;
        // On recupere la position initiale de la tete du serpent
        let positionX = this.body[this.body.length-1].x;
        let positionY = this.body[this.body.length-1].y;
        // Selon la direction du serpent, on change le tmp de la future position de la tete
        if(this.direction == "right") {
            positionX++;
        } else if(this.direction == "left") {
            positionX--;
        } else if(this.direction == "up") {
            positionY--;
        } else if(this.direction == "down") {
            positionY++;
        }
        /* On verifie si la future position de la tete du serpent est la meme que celle d'un mur */
        if (this.world.array[positionX][positionY] == -3){
            result = true;
        } 
        return result;
    }

    // Fonction qui fait grandir le serpent
    growSnake() {
        this.body.unshift(new cell(this.body[0].x, this.body[0].y));
    }

    // Fonction qui retrecit le serpent (si il a plus de 1 cellule)
    shrinkSnake() {
        if(this.body.length > 3) {
            this.body.shift();
        }
    }
}