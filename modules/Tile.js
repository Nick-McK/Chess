class Tile {
    constructor(x, y, isEmpty, isSqWhite, screenX, screenY) {
        this.x = x;
        this.y = y;
        this.isEmpty = isEmpty;
        this.isSqWhite = isSqWhite;
        this.screenX = screenX;
        this.screenY = screenY;
    };

    getTileCoords() {
        return [this.screenX, this.screenY];
    }

    isEmpty() {
        return this.isEmpty;
    }

    isWhite() {
        return isSqWhite;
    }
    getX() {
        return this.x;
    }
    getY() {
        return this.y;
    }

    

};

export {Tile};


// Possibly use hashmap where to find if a tile has a piece on it we use the tile as a key and then the piece as a value



