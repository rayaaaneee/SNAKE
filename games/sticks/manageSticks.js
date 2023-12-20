class ManageSticks{

    static goNextSound = usefulClassSticks.openSound("ok", 0.05);
    static goNextTurnButton = document.getElementById("gonextturn");
    static absoluteContent = document.querySelector("#iconplayerandtext");
    static winnerContent = document.querySelector("#printwinner");
    static confetti = new confetti();
    static gamestate = document.getElementById("gamestate");
    static gamecontainer = document.getElementById('sticks-game-container');
    static destroySound = usefulClassSticks.openSound("woosh", 0.05);
    static initialNbSticks = null;
    static initialStarting = null;
    static nbGames = 0;
    static isInGame = false;

    constructor(nbsticks, starting, gamemode){
        // On incrémente le nombre de games
        ManageSticks.nbGames++;
        ManageSticks.initialNbSticks = nbsticks;
        ManageSticks.initialStarting = starting;
        ManageSticks.isInGame = true;

        // Initialisation des attributs
        this.tab = [];
        this.hasRemoved = null;
        this.nbTurns = 0;
        this.winner = null;
        this.canAdd = true;

        // Attributs HTML
        this.container = document.getElementById('game');
        this.allstickshtml = document.getElementById('allsticks');

        this.sticksRemaininghtml = document.getElementById('sticksremaining').querySelectorAll("p")[1];

        this.htmlstick = document.createElement('div');
        
        // IA
        this.bot = new AI(this, gamemode);
        
        
        // Animations
        this.addSticks(ManageSticks.initialNbSticks);
        
        this.#initAttributes();
    }

    #initAttributes(){
        this.htmlstick.classList.add('stick');
        this.htmlstick.setAttribute("draggable", "false");
        this.htmlstick.setAttribute("onclick", this.animationForEachStick);
        this.sticksRemaininghtml.innerHTML = ManageSticks.initialNbSticks;
    }

    // Fonction qui ajoute des sticks
    addSticks(number){
        if(this.canAdd){
            for (let i = 0; i < number; i++){
                this.tab.push(new stick());
            }
        }
        this.canAdd = false;
    }

    // Fonction qui supprime des sticks
    removeSticks(nbrSticks){
        var random = null;
        var i = 0;
        let intervalDelete = setInterval(() => {
            i++;
            let stickDeleted = null;
            setTimeout(() => {
                do {
                    if(this.getNumberOfSticks() == 0) return clearInterval(intervalDelete);
                    random = Math.floor(Math.random() * ManageSticks.initialNbSticks);
                    stickDeleted = this.tab[random].isDeleted();
                    if(!stickDeleted){
                        this.tab[random].delete();
                        this.allstickshtml.querySelectorAll(".stick")[random].style.transform = "scale(0.5) rotate(3deg)";
                        this.allstickshtml.querySelectorAll(".stick")[random].style.cursor = "default";
                        setTimeout(() => {
                            this.allstickshtml.querySelectorAll(".stick")[random].style.opacity = 0;
                        }, 100);
                        ManageSticks.destroySound.play();
                        this.updateSticksRemaining();
                    }
                } while(stickDeleted);
            }, 400);
            if(i == nbrSticks){
                clearInterval(intervalDelete);
                setTimeout(() => {
                    setTimeout(() => {
                        usefulClassSticks.printLoading("player");
                    }, 300);
                    ManageSticks.goNextTurnButton.disabled = true;
                    
                    // Une fois que le bot a joué on fait jouer directement le joueur
                    if(this.getNumberOfSticks() > 0){
                        this.bot.play();
                    } else if(this.bot.canStop()){
                        return;
                    }
                }, 1000);
            }
        } , 500);
    }

    // Pour chaque baton on lui donne une animation
    #giveAnimation(){
        var allsticks = this.allstickshtml.querySelectorAll(".stick");
        allsticks.forEach((element) => {
            element.style.cursor = "pointer";
            element.addEventListener("mouseover", () => {
                element.style.transform = "scale(1.1) rotate(3deg)";
                if(!this.tab[element.id].isDeleted() && this.bot.playing){
                    element.style.cursor = "pointer";
                } else 
                    element.style.removeProperty("cursor");

                if(!this.bot.playing)
                    element.style.cursor = "default";
            });
            element.addEventListener("mouseout", () => {
                element.style.transform = "scale(1) rotate(0deg)";
            });
            element.addEventListener("click", () => {
                if(!this.tab[element.id].isDeleted() && this.bot.playing && this.hasRemoved != null){
                    this.hasRemoved++;
                    this.bot.toRemove = this.hasRemoved;

                    ManageSticks.goNextTurnButton.disabled = false;

                    element.style.opacity = 0;
                    element.style.transform = "scale(0.5) rotate(0deg)";
                    element.style.cursor = "default";
                    element.style.removeProperty("cursor");

                    ManageSticks.destroySound.play();
                    this.tab[element.id].delete();
                    this.updateSticksRemaining();

                    if(this.bot.canStop()) return;

                    if(this.hasRemoved == 3){
                        this.hasRemoved = null;
                        this.bot.play();
                        ManageSticks.goNextSound.play();
                    }
                }
            });
        });  
    }

    updateSticksRemaining(){
        let sticksRemaining = 0;
        this.tab.forEach((element) => {
            if(!element.isDeleted())
                sticksRemaining++;
        });
        this.sticksRemaininghtml.innerHTML = sticksRemaining;
    }

    displaySticks(){
        let index = 0;
        let intervalappear = setInterval(() => {
            this.#appearSticks(index, intervalappear);
            index++;
        }, 50);
    }

    #appearSticks(i, interval){
        if(i >= ManageSticks.initialNbSticks){
            if(i == ManageSticks.initialNbSticks+2){
                clearInterval(interval);
                this.#giveAnimation();
                // Quand tout est correctement affiché on lance la partie
                setTimeout(() => {
                    this.bot.play();
                }, 100);
            }
        } else {
            let newnode = this.htmlstick.cloneNode(true);
            this.allstickshtml.appendChild(newnode);
            newnode.id = i;
            newnode.style.transform = "scale(1.1) rotate(-3deg)";
        }
        if(i > 1 && i < ManageSticks.initialNbSticks+2)
            this.allstickshtml.querySelectorAll(".stick")[i-2].removeAttribute("style");
    }

    toString(){
        if(ManageSticks.initialNbSticks == 0)
            console.log("No sticks");
        else {
            this.tab.forEach((element) => {
                console.log("stick no "+element.id);
            });
        }
    }

    play(){
        this.hasRemoved = 0;
        ManageSticks.goNextTurnButton.disabled = true;
    }

    getNumberOfSticks(){
        let i = 0;
        this.tab.forEach((element) => {
            if(!element.isDeleted())
                i++;
        });
        return i;
    }

    gameEnded(){
        if(this.getNumberOfSticks() == 0){
            return true;
        } else {
            return false;
        }
    }

    resetGame(){
        // On met les attributs à la valeur nécéssaire
        ManageSticks.nbGames++;
        ManageSticks.isInGame = true;
        stick.reset();
        this.#resetAttributes();

        // On cache le message de victoire
        ManageSticks.winnerContent.style.opacity = 0;
        setTimeout(() => {
            ManageSticks.winnerContent.style.display = "none";
            confetti.stopConfetti();

            // On reinitialise le bot
            this.bot.reset();
        }, 500);
    }

    #resetAttributes(){
        //Supprimer tous les enfants de allstickshtml
        this.deleteAllHtmlSticks();
        
        // Initialisation des attributs
        this.#initAttributes();
        this.tab = new Array();
        this.canAdd = true;
        this.addSticks(ManageSticks.initialNbSticks);

        this.hasRemoved = null;
        this.nbTurns = 0;
        this.winner = null;
    }
    
    deleteAllHtmlSticks(){
        while (this.allstickshtml.firstChild) {
            this.allstickshtml.removeChild(this.allstickshtml.firstChild);
        }
    }
}