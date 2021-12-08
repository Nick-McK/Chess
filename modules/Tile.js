class Tile {
    constructor(x, y, isEmpty, isSqWhite, screenX, screenY) {
        this.x = x;
        this.y = y;
        this.isEmpty = isEmpty;
        this.isSqWhite = isSqWhite;
        this.screenX = screenX;
        this.screenY = screenY;
    };

    get _x() {
        return this.x;
    }

    set _x(newX) {
        this.x = newX;
    }

    get _y() {
        return this.y;
    }

    // set _y(newY) {
    //     this.y = newY;
    // }
    get _isEmpty() {
        return this.isEmpty;
    }

    set _isEmpty(newEmpty) {
        this.isEmpty = newEmpty;
    }

    get _isSqWhite() {
        return this.isSqWhite;
    }

    get _screenX() {
        return this.screenX;
    }

    get _screenY() {
        return this.screenY;
    }
    

};

export {Tile};


// Possibly use hashmap where to find if a tile has a piece on it we use the tile as a key and then the piece as a value



