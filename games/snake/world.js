// Importer un fichier externe
class world {
    constructor(canvas, nbGame,length, nbrApples, nbrPoisonApples, nbrWalls, sprite) {

        this.length = length;
        this.nbGame = nbGame;

        // On initialise la variable qui contiendra toutes les images du theme classic
        this.sprite = sprite;
        // On initialise le contexte du canvas
        this.ctx = canvas.getContext("2d");
        this.unit = canvas.width / this.length;
        this.canvaWidth = canvas.width;
        this.canvaHeight = canvas.height;

        // On initialise le tableau qui représente le plateau
        this.snake = new snake(this);
        this.array = Array.from(Array(length), () => new Array(length));
        this.#initWorld();
        this.#placeInitialSnakeOnArrayBeforeCreateApple();

        // On déclare les pommes, les pommes empoisonnées et les murs
        this.apples = this.#initApples(nbrApples);
        this.poisonedApples = this.#initPoisonedApples(nbrPoisonApples);
        this.walls = this.#initWalls(nbrWalls);
        
        // On initialise le score maximum et le score de chaque partie
        this.displayHighScore = false;
        this.score = document.getElementById("snake-score-number");
        this.highScore = document.getElementById("snake-high-score-number");
        this.#appearHighScore();

        // On initialise les sons
        this.eatSound = useful.openSound("eat", 0.2);
        this.eatPoisonSound = useful.openSound("eat", 0.2);
    }

    // Fonction qui met à jour le plateau
    updateWorld() {
        this.#initWorld(this.array);
        /* Le numero de la tête du serpent change en fonction du theme, or la fonction
        hasEatenApple a besoin de ce numero pour fonctionner correctement */
        let headNumber = null;
        if(this.sprite.url == undefined){
            for(let i = 0; i < this.snake.body.length-1; i++) {
                this.array[this.snake.body[i].x][this.snake.body[i].y] = 1;
            }
            headNumber = 2;
            this.array[this.snake.body[this.snake.body.length-1].x][this.snake.body[this.snake.body.length-1].y] = 2; 
        } else {
            if (this.sprite.corners) {
                // Head : 10 // Tail : 0,1,2,3 // Body : 4,5 // Body Corner : 6,7,8,9
                //Corps
                for(let i = 1; i < this.snake.body.length-1; i++) {
                    if (this.snake.body[i].x == this.snake.body[i+1].x) {
                        this.array[this.snake.body[i].x][this.snake.body[i].y] = 4;
                    } else if (this.snake.body[i].y == this.snake.body[i+1].y) {
                        this.array[this.snake.body[i].x][this.snake.body[i].y] = 5;
                    }
                }
                // Queue
                if (this.snake.body[0].x == this.snake.body[1].x) {
                    if (this.snake.body[0].y < this.snake.body[1].y) {
                        this.array[this.snake.body[0].x][this.snake.body[0].y] = 0;
                    } else if (this.snake.body[0].y > this.snake.body[1].y) {
                        this.array[this.snake.body[0].x][this.snake.body[0].y] = 1;
                    }
                } else if (this.snake.body[0].y == this.snake.body[1].y) {
                    if (this.snake.body[0].x < this.snake.body[1].x) {
                        this.array[this.snake.body[0].x][this.snake.body[0].y] = 2;
                    } else if (this.snake.body[0].x > this.snake.body[1].x) {
                        this.array[this.snake.body[0].x][this.snake.body[0].y] = 3;
                    }
                }
                // Corps quand le serpent tourne
                let ipositionX = null;
                let ipositionY = null;
                for(let i = 1; i < this.snake.body.length-1; i++) {
                    ipositionX = this.snake.body[i].x;
                    ipositionY = this.snake.body[i].y;
                    if (this.snake.body[i].x == this.snake.body[i+1].x) {
                        if (this.snake.body[i].y < this.snake.body[i+1].y) {
                            if (this.snake.body[i].x < this.snake.body[i-1].x) {
                                this.array[ipositionX][ipositionY] = 6;
                            } else if (this.snake.body[i].x > this.snake.body[i-1].x) {
                                this.array[ipositionX][ipositionY] = 7;
                            }
                        } else if (this.snake.body[i].y > this.snake.body[i+1].y) {
                            if (this.snake.body[i].x < this.snake.body[i-1].x) {
                                this.array[ipositionX][ipositionY] = 8;
                            } else if (this.snake.body[i].x > this.snake.body[i-1].x) {
                                this.array[ipositionX][ipositionY] = 9;
                            }
                        }
                    } else if (this.snake.body[i].y == this.snake.body[i+1].y) {
                        if (this.snake.body[i].x < this.snake.body[i+1].x) {
                            if (this.snake.body[i].y < this.snake.body[i-1].y) {
                                this.array[ipositionX][ipositionY] = 6;
                            } else if (this.snake.body[i].y > this.snake.body[i-1].y) {
                                this.array[ipositionX][ipositionY] = 8;
                            }
                        } else if (this.snake.body[i].x > this.snake.body[i+1].x) {
                            if (this.snake.body[i].y < this.snake.body[i-1].y) {
                                this.array[ipositionX][ipositionY] = 7;
                            } else if (this.snake.body[i].y > this.snake.body[i-1].y) {
                                this.array[ipositionX][ipositionY] = 9;
                            }
                        }
                    }
                }
                // Tête du serpent
                headNumber = 10;
                this.array[this.snake.body[this.snake.body.length-1].x][this.snake.body[this.snake.body.length-1].y] = 10; 
            } else if (!this.sprite.corners) {
                // Tail : 0 // Body : 1 // Head : 2 
                for(let i = 1; i < this.snake.body.length-1; i++) {
                    this.array[this.snake.body[i].x][this.snake.body[i].y] = 1;
                } 
                headNumber = 2;
                this.array[this.snake.body[this.snake.body.length-1].x][this.snake.body[this.snake.body.length-1].y] = 2;
                this.array[this.snake.body[0].x][this.snake.body[0].y] = 0;
            }
        }

        // Pommes et pommes emmpoisonnées
        this.apples.forEach((apple) => {
            this.array[apple.x][apple.y] = -1;
        });
        this.poisonedApples.forEach((apple) => {
            this.array[apple.x][apple.y] = -2;
        });
        this.walls.forEach((wall) => {
            this.array[wall.x][wall.y] = -3;
        });
        this.hasEatenPoisonedApple(headNumber);
        this.hasEatenApple(headNumber);
    }

    clearCanvas(){
        //On efface tout le contenu du canvas
        this.ctx.clearRect(0, 0, this.canvaWidth, this.canvaheight);
    }

    // Fonction qui dessine un carré de couleur color à la position x et y
    drawSquare(x, y, color, strokeColor = "black"){
        this.ctx.fillStyle = color;
        this.ctx.strokeStyle = strokeColor;
        this.ctx.fillRect(x*this.unit, y*this.unit, this.unit, this.unit);
        this.ctx.strokeRect(x*this.unit, y*this.unit, this.unit, this.unit);
    }

    //Fonction inverse de drawSquare qui efface un carré
    eraseSquare(x, y){
        this.ctx.clearRect(x*this.unit, y*this.unit, this.unit, this.unit);
    }

    // Fonction qui dessine l'image img à la position x et y
    drawImage(img, x, y){
        this.ctx.drawImage(img, x*this.unit, y*this.unit, this.unit, this.unit);
    }

    // Fonction qui dessine le plateau actuel
    drawWorld(){
        // Si le theme est le pixel (basique)
        if(this.sprite.url == undefined){
            this.array.forEach((element, i) => {
                element.forEach((element, j) => {
                    if(element == 1) {
                        this.drawSquare(i, j, "grey");
                    } else if(element == 2) {
                        this.drawSquare(i, j, "black");
                    } else if(element == -1) {
                        this.drawSquare(i, j, "red");
                    } else if(element == -2) {
                        this.drawSquare(i, j, "rgb(96, 0, 138)");
                    } else if(element == -3) {
                        this.drawSquare(i, j, "rgb(170, 150, 128)", "grey");
                    }
                });
            });
        } else {
            // Theme mur realiste
            this.walls.forEach((element) => {
                this.drawImage(this.sprite.wallImage, element.x, element.y);
            });
            // Si le theme est classique ou le theme google
            if (this.sprite.corners) {
                this.array.forEach((element, i) => {
                    element.forEach((element, j) => {
                        // Corps droit
                        if(element == 4) {
                            this.drawImage(this.sprite.verticalBody, i, j);
                        } else if(element == 5) {
                            this.drawImage(this.sprite.horizontalBody, i, j);
                        // Tête
                        } else if(element == 10) {
                            if(this.snake.direction == "right") {
                                this.drawImage(this.sprite.headRight, i, j);
                            } else if(this.snake.direction == "left") {
                                this.drawImage(this.sprite.headLeft, i, j);
                            } else if(this.snake.direction == "up") {
                                this.drawImage(this.sprite.headUp, i, j);
                            } else if(this.snake.direction == "down") {
                                this.drawImage(this.sprite.headDown, i, j);
                            // Si le serpent n'a pas encore bougé on affiche la tête vers la droite
                            } else if (this.direction == null && !this.snake.isDead && !this.snake.winGame) {
                                this.drawImage(this.sprite.headRight, i, j);
                            // Si le serpent est mort ou qu'il a fini la partie, on affiche la tête vers la dernière direction
                            } else if (this.snake.isDead || this.snake.winGame) {
                                if (this.snake.body[this.snake.body.length-1].x < this.snake.body[this.snake.body.length-2].x) {
                                    this.drawImage(this.sprite.headLeft, i, j);
                                } else if (this.snake.body[this.snake.body.length-1].x > this.snake.body[this.snake.body.length-2].x) {
                                    this.drawImage(this.sprite.headRight, i, j);
                                } else if (this.snake.body[this.snake.body.length-1].y < this.snake.body[this.snake.body.length-2].y) {
                                    this.drawImage(this.sprite.headUp, i, j);
                                } else if (this.snake.body[this.snake.body.length-1].y > this.snake.body[this.snake.body.length-2].y) {
                                    this.drawImage(this.sprite.headDown, i, j);
                                }
                            }
                        // Queue
                        } else if(element == 0) {
                            this.drawImage(this.sprite.tailDown, i, j);
                        } else if(element == 1) {
                            this.drawImage(this.sprite.tailUp, i, j);
                        } else if(element == 2) {
                            this.drawImage(this.sprite.tailRight, i, j);
                        } else if(element == 3) {
                            this.drawImage(this.sprite.tailLeft, i, j);
                        }

                        // Corps quand le serpent tourne
                        else if(element == 6) {
                            this.drawImage(this.sprite.cornerDownRight, i, j);
                        } else if(element == 7) {
                            this.drawImage(this.sprite.cornerDownLeft, i, j);
                        } else if(element == 8) {
                            this.drawImage(this.sprite.cornerUpRight, i, j);
                        } else if(element == 9) {
                            this.drawImage(this.sprite.cornerUpLeft, i, j);
                        }
                    });
                });
            // Si le theme est pacman ou le pacman rouge
            } else if (!this.sprite.corners) {
                this.array.forEach((element, i) => {
                    element.forEach((element, j) => {
                        if (element == 0) {
                            this.drawImage(this.sprite.tail, i, j);
                        } else if(element == 1) {
                            this.drawImage(this.sprite.body, i, j);
                        } else if(element == 2) {
                            if(this.snake.direction == "right") {
                                this.drawImage(this.sprite.headRight, i, j);
                            } else if(this.snake.direction == "left") {
                                this.drawImage(this.sprite.headLeft, i, j);
                            } else if(this.snake.direction == "up") {
                                this.drawImage(this.sprite.headUp, i, j);
                            } else if(this.snake.direction == "down") {
                                this.drawImage(this.sprite.headDown, i, j);
                             // Si le serpent n'a pas encore bougé on affiche la tête vers la droite
                            } else if (this.direction == null && !this.snake.isDead && !this.snake.winGame) {
                                this.drawImage(this.sprite.headRight, i, j);
                            // Si le serpent est mort ou a fini la partie on affiche la tête vers la dernière direction
                            } else if (this.snake.isDead || this.snake.winGame) {
                                if (this.snake.body[this.snake.body.length-1].x < this.snake.body[this.snake.body.length-2].x) {
                                    this.drawImage(this.sprite.headLeft, i, j);
                                } else if (this.snake.body[this.snake.body.length-1].x > this.snake.body[this.snake.body.length-2].x) {
                                    this.drawImage(this.sprite.headRight, i, j);
                                } else if (this.snake.body[this.snake.body.length-1].y < this.snake.body[this.snake.body.length-2].y) {
                                    this.drawImage(this.sprite.headUp, i, j);
                                } else if (this.snake.body[this.snake.body.length-1].y > this.snake.body[this.snake.body.length-2].y) {
                                    this.drawImage(this.sprite.headDown, i, j);
                                }
                            }
                        }
                    });
                });
            }
            this.apples.forEach((element) => {
                this.drawImage(this.sprite.appleImage, element.x, element.y);
            });
            this.poisonedApples.forEach((element) => {
                this.drawImage(this.sprite.poisonedAppleImage, element.x, element.y);
            });
        }
    }

    // Fonction qui vérifie si le serpent a mangé la pomme et en place une nouvelle
    hasEatenApple(headNumber) {
        this.apples.forEach((apple) => {
            if(this.snake.body[this.snake.body.length-1].x == apple.x && this.snake.body[this.snake.body.length-1].y == apple.y) {
                this.#playEatSound();
                // Regler le bug de la tete du serpent qui passe dessous la pomme quand il la mange
                this.snake.justAteApple = true;
                this.snake.growSnake();
                this.array[apple.x][apple.y] = headNumber;
                this.eatSound.play();
                apple.wasEaten();
                this.#updateScore();
            }
        });
    }

    /* Fonction qui vérifie si le serpent a mangé la pomme et en place une nouvelle, il retrecit si 
    et seulement si si a plus de 1 de taille*/
    hasEatenPoisonedApple(headNumber) {
        this.poisonedApples.forEach((poisonedApple) => {
            if(this.snake.body[this.snake.body.length-1].x == poisonedApple.x && this.snake.body[this.snake.body.length-1].y == poisonedApple.y) {
                this.#playEatSound();
                this.eatPoisonSound.play();
                this.array[poisonedApple.x][poisonedApple.y] = headNumber;
                poisonedApple.wasEaten();
                this.snake.shrinkSnake();
                this.#updateScore();
            }
        });
    }

    // Si le son est encore en train d'être joué on le joue sans couper le son précédent
    #playEatSound() {
        if(this.eatSound.currentTime != 0) {
            this.eatSound.pause();
            this.eatSound.currentTime = 0;
        }
    }

    // Fonction qui met à jour le score
    #updateScore() {
        let newScore = this.snake.body.length-3;
        if (this.snake.body.length <= 3) {
            this.score.textContent = "0";
        } else {
            this.score.textContent = newScore;
        }
        this.#updateHighScore();
    }

    // Fonction qui met à jour le high score
    #updateHighScore() {
        let newScore = parseInt(this.score.textContent);
        let highScore = parseInt(this.highScore.textContent);
        if (newScore > highScore) {
            this.highScore.textContent = newScore;
        }
    }

    // Fonction qui fait apparaitre le high score
    #appearHighScore() {
        // Si score undisplayed vaut null on ne bloque pas a lerreur
        if(this.nbGame >= 2 && parseInt(this.highScore.textContent) > 0 && document.getElementById("high-score") != null)
            document.getElementById("high-score").id = "high-scorev2";
    }

    disappearHighScore() {
        if(this.nbGame > 1)
            document.getElementById("high-scorev2").id = "high-score";
        this.#resetHighScore();
    }
    // Fonction qui remet le score à 0
    resetScore() {
        this.score.textContent = 0;
    }

    // Fonction qui remet le high score à 0
    #resetHighScore() {
        this.highScore.textContent = 0;
    }
     
    // Remplir le tableau avec des null sauf pour la position initiale
    #initWorld() {
        this.array.forEach(element => {
            element.fill(null);
        });
    }

    /* Fonction utile qu'à l'initialisation de l'objet world, elle place le serpent sur le tableau avant de
    placer la pomme : sans ca la pomme peut apparaitre sur le serpent (seulement au tout début du jeu) */
    #placeInitialSnakeOnArrayBeforeCreateApple() {
        this.snake.body.forEach(element => {
            this.array[element.x][element.y] = 1;
        });
    }

    // Fonction qui initialise le plateau
    clearWorld() {
        this.array.forEach(element => {
            this.element.forEach(element => {
                this.eraseSquare(element.x, element.y);
            });
        });
    }

    // Fonction qui vide le canvas de tous les elements qui lui ont été rajoutés
    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvaWidth, this.canvaWidth);
    }

    #initApples(nbrApples){
        let tmp = [];
        for (let i = 0; i < nbrApples; i++) {
            tmp.push(new apple(this.array));
            this.array[tmp[i].x][tmp[i].y] = -1;
        }
        return tmp;
    }

    #initPoisonedApples(nbrPoisonedApples){
        let tmp = [];
        for (let i = 0; i < nbrPoisonedApples; i++) {
            tmp.push(new apple(this.array));
            this.array[tmp[i].x][tmp[i].y] = -2;
        }
        return tmp;
    }

    #initWalls(nbrWalls){
        let tmp = [];
        let positionX = null, positionY = null;
        for (let i = 0; i < nbrWalls; i++) {
            do {
                positionX = Math.floor(Math.random() * this.array.length);
                positionY = Math.floor(Math.random() * this.array[0].length);
            } while (this.array[positionX][positionY] != null);
            tmp.push(new cell(positionX, positionY));
        }
        return tmp;
    }

    isFull() {
        let isFull = false;
        let world_length = this.array.length * this.array[0].length;
        let total_length = this.snake.body.length + this.apples.length + this.walls.length + this.poisonedApples.length -1;
        if (world_length ==  total_length) {
            isFull = true;
        }
        return isFull;
    }
}