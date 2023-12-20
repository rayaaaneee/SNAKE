class cookies {
    constructor(allSelects) {
        this.selects = allSelects;
        this.#selectLastValue();
    }

    setCookie(name, value) {
        document.cookie = name;
    }

    getCookie(name) {
        let nameEQ = name + "=";
        let ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    #selectLastValue() {
        this.selects.forEach(select => {
            let value = this.getCookie(select.id);
            if (value != null) {
                select.value = value;
            }
        });
    }

    validateChanges(newAllSelects){
        let selects = newAllSelects;
        selects.forEach((select) => {
            this.setCookie(select.name, select.value);
        });
    }
}