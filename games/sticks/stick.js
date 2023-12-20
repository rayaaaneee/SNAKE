class stick{
    static lastNbr = 0;

    constructor(){
        this.id = stick.lastNbr++;
        this.deleted = false;
    }

    delete(){
        this.deleted = true;
    }

    isDeleted(){
        return this.deleted;
    }

    static reset(){
        stick.lastNbr = 0;
    }
}