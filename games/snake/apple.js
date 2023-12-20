class apple {
    constructor(array) {
        this.array = array;
        this.x = null;
        this.y = null;
        // On donne initialement une position à la pomme
        this.#getNewPosition();
    }

    // La pomme n'apparait pas à un endroit ou le serpent est déjà + la pomme n'apparait pas à la même position qu'avant
    #getNewPosition() {
        let newX = null;
        let newY = null;
        do {
            newX = Math.floor(Math.random() * this.array.length);
            newY = Math.floor(Math.random() * this.array.length);
        } while (this.array[newX][newY] != null);
        this.x = newX;
        this.y = newY;
    }

    // Si une pomme est mangée on la supprime et on en crée une nouvelle
    wasEaten() {
        this.#getNewPosition();
    }
}