class AI {

    constructor(managesticks, gamemode) {

        // Déclaration des attributs
        this.managesticks = managesticks;
        this.playing = ManageSticks.initialStarting;
        this.toRemove = null;
        this.gamemode = gamemode;

        // On initialise le jeu
        this.#initGame();
    }

    #initGame() {
        // Si il a choisi qui commence on choisit le nombre de batons
        if (ManageSticks.nbGames == 1){
            // On regarde le choix du joueur
            let choice = this.playing == null ? "sticks" : "start";
            if (choice == "start") {
                let player = this.playing == true ? "bot" : "player";
                let newNbr = null;
                if (this.gamemode =="easy"){
                    do {
                        newNbr = parseInt(Math.floor(Math.random() * 40));
                    } while (newNbr <= 10 || newNbr >= 40);
                } else {
                    do {
                        newNbr = parseInt(Math.floor(Math.random() * 40));
                    } while (newNbr % 4 == 0 || newNbr <= 10 || newNbr >= 40);
                }
                // Si c'est le bot qui commence on ajoute 1, 2 ou 3 batons
                if(player == "bot"){
                    // Nombre random entre 1 et 3
                    let toAdd = null;
                    do {
                        toAdd = Math.floor(Math.random() * 3) + 1;
                    } while (toAdd == 0);
                    newNbr +=  toAdd;
                }
                ManageSticks.initialNbSticks = newNbr;
            // Si il a choisi le nombre de batons on choisit qui commence
            } else if (choice == "sticks") {
                // Si le niveau est medium ou easy
                if (this.gamemode == "easy" || this.gamemode == "medium"){
                    let rand = Math.floor(Math.random() * 2);

                    // Si le niveau est medium on choisit au hasard ou on applique la stratégie (1 chance sur 2)
                    if (this.gamemode == "medium"){
                        if (rand == 0) {
                            rand = Math.floor(Math.random() * 2);
                            if (rand == 0)
                                this.playing = true;
                            else if (rand == 1)
                                this.playing = false;
                        } else {
                            if ((ManageSticks.initialNbSticks-1)%4 != 0 ){
                                this.playing = true;
                            } else {
                                this.playing = false;
                            }
                        }
                    // Si le niveau est easy on choisit au hasard
                    } else {
                        if (rand == 0)
                            this.playing = true;
                        else if (rand == 1)
                            this.playing = false;
                    }
                // Si le niveau est hard
                } else {
                    if ((ManageSticks.initialNbSticks-1)%4 != 0 ){
                        this.playing = true;
                    } else {
                        this.playing = false;
                    }
                }
            }
            this.managesticks.addSticks(ManageSticks.initialNbSticks);
            ManageSticks.initialStarting = this.playing;
        } else {
            this.playing = ManageSticks.initialStarting;
        }
        this.managesticks.updateSticksRemaining();
        this.startGame();
    }

    startGame() {
        // Selon qui commence on affiche le bon texte
        if (this.playing) {
            usefulClassSticks.printLoading("bot");
        } else {
            usefulClassSticks.printLoading("player");
        }

        // On lance le jeu
        this.#initPresentationText();
    }

    #initPresentationText(){
        let content = document.querySelector("#presentation");
        let startingPlayerContainerText = content.querySelector("#startingplayer");
        let nbSticksContainerText = content.querySelector("#nbsticks");

        let startingPlayerText = startingPlayerContainerText.querySelectorAll(".modify");
        let nbSticksText = nbSticksContainerText.querySelectorAll(".modify");

        if(this.playing){
            startingPlayerText[0].innerHTML = "Bot";
            startingPlayerText[0].style.color = "rgb(81, 71, 75)";
        } else {
            startingPlayerText[0].innerHTML = "You";
            startingPlayerText[0].style.color = "rgb(77, 55, 74)";
        }

        nbSticksText[0].innerHTML = ManageSticks.initialNbSticks;
        
        this.#giveAnimationToPresentationText(content);
    }

    #giveAnimationToPresentationText(content){
        document.getElementById("sticks-game-container").style.display = "none";
        document.getElementById("sticks-game-container").style.opacity = 0;
        document.getElementById("sticks-game-container").style.display = "flex";
        content.style.display = "flex";
        content.style.opacity = 0;
        setTimeout(() => {
            content.style.opacity = 1;
            setTimeout(() => {
                content.style.opacity = 0;
                setTimeout(() => {
                    content.style.display = "none";
                    document.getElementById("sticks-game-container").style.opacity = 1;
                    this.managesticks.displaySticks();
                }, 200);
            }, 1400);
        }, 100);
    }

    play() {
        this.managesticks.nbTurns++;

        if(this.managesticks.nbTurns > 1){
            // On cache le texte
            document.getElementById("sticks-game-container").style.opacity = 0;
            ManageSticks.gamestate.style.display = "flex";

            // On affiche le texte
            setTimeout(() => {
                // Initialiser le texte
                ManageSticks.gamestate.querySelector("#turn").querySelectorAll(".modify")[0].innerHTML = this.playing ? "Bot" : "Your";
                ManageSticks.gamestate.querySelector("#nbsticks").querySelectorAll(".modify")[0].innerHTML = !this.playing ? "Bot" : "You";
                ManageSticks.gamestate.querySelector("#nbsticks").querySelectorAll(".modify")[1].innerHTML = this.toRemove;
                ManageSticks.gamestate.querySelector("#nbsticks").querySelectorAll(".modify")[2].innerHTML = this.toRemove == 1 ? "stick" : "sticks";

                if(this.playing) {
                    ManageSticks.gamestate.querySelector("#turn").style.color = "rgb(81, 71, 75)"
                    ManageSticks.gamestate.querySelector("#nbsticks").querySelectorAll(".modify")[0].style.color = "rgb(77, 55, 74)"
                } else {
                    ManageSticks.gamestate.querySelector("#turn").style.color = "rgb(77, 55, 74)"
                    ManageSticks.gamestate.querySelector("#nbsticks").querySelectorAll(".modify")[0].style.color = "rgb(81, 71, 75)"
                }

                // Afficher le texte
                ManageSticks.gamestate.style.opacity = 1;
                setTimeout(() => {
                    ManageSticks.gamestate.style.opacity = 0;
                    setTimeout(() => {
                        ManageSticks.gamestate.style.display = "none";
                        document.getElementById("sticks-game-container").style.opacity = 1;
                        // On relance le jeu
                        this.#autoRemoveSticks();
                    }, 300);
                }, 1700);

            }, 150);
        } else {
            this.#autoRemoveSticks();
        }
    }

    #autoRemoveSticks(){
        if (this.playing) {
            usefulClassSticks.printLoading("bot");

            ManageSticks.goNextTurnButton.disabled = true;

            if(this.gamemode == "hard"){
                switch ((this.managesticks.getNumberOfSticks()-1) % 4) {
                    case 1:
                        this.toRemove = 1;
                        break;
                    case 2:
                        this.toRemove = 2;
                        break;
                    case 3:
                        this.toRemove = 3;
                        break;
                    default:
                        this.toRemove = Math.floor(Math.random() * 3)+1;
                        break;
                }
            } else if (this.gamemode == "medium") {
                let rand = Math.floor(Math.random() * 2);
                if(rand == 0){ 
                    switch ((this.managesticks.getNumberOfSticks()-1) % 4) {
                        case 1:
                            this.toRemove = 1;
                            break;
                        case 2:
                            this.toRemove = 2;
                            break;
                        case 3:
                            this.toRemove = 3;
                            break;
                        default:
                            this.toRemove = Math.floor(Math.random() * 3)+1;
                            break;
                    }
                } else {
                    this.toRemove = Math.floor(Math.random() * 3)+1;
                }
                this.toWin();
            } else if (this.gamemode == "easy") {
                // Sinon on prend au hasard
                this.toRemove = Math.floor(Math.random() * 3)+1;
            }

            if(this.managesticks.getNumberOfSticks() == 1){
                this.toRemove = 1;
            }

            this.managesticks.removeSticks(this.toRemove);  
        } else {
            this.managesticks.play();
        }
        this.playing = !this.playing;
    }

    canStop(){
        if(this.managesticks.gameEnded()) {
            this.stop();
        }
        return this.managesticks.gameEnded();
    }

    toWin(){
        // Si il reste 4 batons ou moins on ne prend pas au hasard
        if(this.managesticks.getNumberOfSticks() <= 4){
            switch (this.managesticks.getNumberOfSticks()) {
                case 1:
                    this.toRemove = 1;
                    break;
                case 2:
                    this.toRemove = 1;
                    break;
                case 3:
                    this.toRemove = 2;
                    break;
                case 4:
                    this.toRemove = 3;
            }
        }
    }

    stop(){
        ManageSticks.isInGame = false;
        document.getElementById('sticks-game-container').style.opacity = 0;

        let winner = null;
 
        let textContent = ManageSticks.winnerContent.querySelector(".modify");
        switch(this.playing){
            case true:
                winner = "Bot";
                textContent.style.color = "rgb(81, 71, 75)";
                ManageSticks.winnerContent.querySelector("img").src = "games/sticks/images/bot.png";
                break;
            case false:
                winner = "You";
                ManageSticks.winnerContent.querySelector("img").src = "games/sticks/images/player.png";
                textContent.style.color = "rgb(77, 55, 74)";
                break;
        }

        textContent.innerHTML = winner;

        if(this.playing) {
            ManageSticks.gamestate.querySelector("#turn").style.color = "rgb(81, 71, 75)"
            ManageSticks.gamestate.querySelector("#nbsticks").querySelectorAll(".modify")[0].style.color = "rgb(77, 55, 74)"
        } else {
            ManageSticks.gamestate.querySelector("#turn").style.color = "rgb(77, 55, 74)"
            ManageSticks.gamestate.querySelector("#nbsticks").querySelectorAll(".modify")[0].style.color = "rgb(81, 71, 75)"
        }

        this.#startWinningAnimation();
    }

    #startWinningAnimation(){
        ManageSticks.gamecontainer.style.opacity = 0;
        
        ManageSticks.winnerContent.style.removeProperty("display");

        confetti.startConfetti();
        setTimeout(() => {
            ManageSticks.winnerContent.style.opacity = 1;
        }, 200);
    }

    reset(){
        this.playing = ManageSticks.initialStarting;
        this.toRemove = null;
        this.#initGame();
    }
}        