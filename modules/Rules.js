import {BOARD, Board, FILE, RANK, table} from "./Board.js";
import {Piece, wP, pawn, rook} from "./Piece.js";
import {Tile} from "./Tile.js";
import {Move, getPieceMap} from "../Move.js";

class Rules {
    constructor() {
    }
    
    getPieceRules(piece) {
        switch(piece.type) {
            case "pawn":
                return this.pawnRules(piece); 
            case "rook":
                return this.rookRules(piece);
            case "knight":
                return this.knightRules(piece);
            case "bishop":
                return this.bishopRules(piece);
            case "queen":
                return this.queenRules(piece);
            case "king":
                return this.kingRules(piece);
        }
    }
    /**
     * Gets a key with the given x and y values. We can use this to easily look up our target tile without having to write out loops everywhere
     * 
     * @param {Char} x the x value of our tile that we want to find
     * @param {Integer} y the y value of the tile that we want to find
     * @returns a tile object with the given x and y values. The x,y pair is unique so it will give a unique tile
     */
    getKey(x, y) {
        if (typeof x == "string") {
            let xCode = convertToCode(x);
            for (let key of table.keys()) {
                let objCode = convertToCode(Object.entries(key)[0][1])
                if (objCode == xCode && Object.entries(key)[1][1] == y) {
                    return key;
                }
            }        
        }
    }
    

// TODO: Possible loop to do this(somehow), cause its a lot of code and quite messy
/**
 * Defines the rules for pawns, both white and black. We stop moving if there is a piece in front of us. 
 * We can also capture pieces if they are 1 tile diagonally from our current position (as long as it is 
 * moving forward either up the ranks or down depending on what colour is moving)
 * @param {Piece} piece the piece that we wish to find out rules for
 * @returns a set of moves for the given piece
 */
    pawnRules(piece) {
        let moves = new Set();
        let inFrontW = this.getKey(piece.tile.x, piece.tile.y + 1);
        let twoInFrontW = this.getKey(piece.tile.x, piece.tile.y + 2);
        let inFrontB = this.getKey(piece.tile.x, piece.tile.y - 1);
        let twoInFrontB = this.getKey(piece.tile.x, piece.tile.y - 2)
        let currentTileXCode = convertToCode(piece.tile.x);

        let left = currentTileXCode - 1;
        let right = currentTileXCode + 1
        // Get the tile whose x is one left of our current tile(capture) and one right of our current tile(captureR) and y is 1 rank above our current tile
        let capture = this.getKey(convertToChar(currentTileXCode - 1), piece.tile.y + 1);
        let captureR = this.getKey(convertToChar(currentTileXCode + 1), piece.tile.y + 1);
        // Get the tile whose x is one left and one right of our current tile(captureB and captureRB) and y is 1 rank below our current tile to deal with black
        let captureB = this.getKey(convertToChar(currentTileXCode - 1), piece.tile.y - 1);
        let captureRB = this.getKey(convertToChar(currentTileXCode + 1), piece.tile.y - 1);

        if (piece.isWhite) {
            if (piece.tile.y == 2) {
                switch(inFrontW.isEmpty && twoInFrontW.isEmpty) {
                case true:
                    moves.add(inFrontW);
                    moves.add(twoInFrontW);
                case false:
                    if (inFrontW.isEmpty) {
                        moves.add(inFrontW);
                    }
                }
            }else if (inFrontW.isEmpty){
                moves.add(inFrontW);
            }

            switch(!(piece.tile.x == "A" || piece.tile.x == "H")) {
                case true:
                    if (!capture.isEmpty) {
                        moves.add(capture);
                    }
                    if (!captureR.isEmpty) {
                        moves.add(captureR);
                    }
                case false:
                    if (piece.tile.x == "A" && !captureR.isEmpty) {
                        moves.add(captureR);
                    }else if(piece.tile.x == "H" && !capture.isEmpty) {
                        moves.add(capture);
                    }
            }

        }else if (!(piece.isWhite)) {
            if (piece.tile.y == 7) {
                switch(inFrontB.isEmpty && twoInFrontB.isEmpty) {
                    case true:
                        moves.add(inFrontB);
                        moves.add(twoInFrontB);
                    case false:
                        if (inFrontB.isEmpty) {
                            moves.add(inFrontB);
                        }
                }
            }else if (inFrontB.isEmpty){
                moves.add(inFrontB);
            }
            switch(!(piece.tile.x == "A" || piece.tile.x == "H")) {
                case true:
                    if (!captureRB.isEmpty) {
                        moves.add(captureRB);
                    }
                    if (!captureB.isEmpty) {
                        moves.add(captureB);
                    }
                case false:
                    if (piece.tile.x == "A" && !captureRB.isEmpty) {
                        moves.add(captureRB);
                    }else if(piece.tile.x == "H" && !captureB.isEmpty) {
                        moves.add(captureB);
                    }
            }

            
        }
        return moves;
    }
    // TODO: Implement rules for each piece type

    // We want to add every tile from the rooks starting tile to the end of the board as a move
    /**
     * Looks at all the tiles in our map and if the tile has the same x or y value as the tile our piece is on then it is in a straight line with our tile and we can move rooks to it
     * 
     * @param {Piece} piece 
     * @returns a set of moves for the rooks
     */
    rookRules(piece) {
        let moves = new Set();
        for (let key of table.keys()) {
            if (Object.entries(key)[1][1] == piece.tile.y && Object.entries(key)[0][1] != piece.tile.x) {
                moves.add(key);
            }
            if (Object.entries(key)[0][1] == piece.tile.x && Object.entries(key)[1][1] != piece.tile.y) {
                moves.add(key);
            }
        }
        return moves;
    }

    knightRules(piece) {
        let moves = new Set();
        for (let key of table.keys()) {
            let fileDif = compareFile(piece.tile, key);
            let rankDif = compareRank(piece.tile, key);

            if ((fileDif == 1 && rankDif == 2) || (fileDif == 2 && rankDif == 1)) {
                moves.add(key);
            }
        }
        return moves;
    }

/**
 * Check to see if any of the tiles in the map are diagonals to the tile our piece is on. We do this by comparing the distance between the x and y of the two tiles and if they are the same then they must be diagonals
 * 
 * @param {Piece} piece 
 * @returns a set of moves for the bishop
 */
    bishopRules(piece) {
        let moves = new Set();
        for (let key of table.keys()) {
            if (diagTile(piece.tile, key)) {
                // Need this otherwise bishops that are placed on the tile they are already on will count as a move and then can move twice.
                if (piece.tile == key) continue;
                moves.add(key);
            }
        }
        return moves;
    }
/**
 * Queens move using rook rules and bishop rules combined, so just call these two methods and merge the two sets together to get our new set.
 * @param {Piece} piece The piece we want to find moves for
 * @returns a set of moves for the given piece
 */
    queenRules(piece) {
        let rookMoves = new Set(this.rookRules(piece));
        let bishopMoves = new Set(this.bishopRules(piece));
        let moves = new Set();
        rookMoves.forEach(move => moves.add(move));
        bishopMoves.forEach(move => moves.add(move));
        return moves;
    }
/**
 * Find all the tiles that are at most 1 away in any direction from our current tile and add it to the moves set.
 * @param {Piece} piece The piece we want to find moves for
 * @returns a set of moves for the given piece
 */
    kingRules(piece) {
        let moves = new Set();
        for (let key of table.keys()) {
            let fileDif = compareFile(piece.tile, key);
            let rankDif = compareRank(piece.tile, key);
            if ((fileDif == 1 && rankDif == 1) || (fileDif == 0 && rankDif == 1) || (fileDif == 1 && rankDif == 0)) {
                moves.add(key)
            }
        }
        return moves;
    }
}


// Finds the difference between the rank and file of 2 tiles. If the difference between each of these is the same then its on a diagonal
function diagTile(startTile, endTile) {
    return compareRank(startTile, endTile) == compareFile(startTile, endTile);
}

// Compares the x(FILE) values of 2 tiles by converting them to numbers
function compareFile(startTile, endTile) {
    return Math.abs(startTile.x.charCodeAt() - endTile.x.charCodeAt());
}
// Compares the y(RANK) values of 2 tiles
function compareRank(startTile, endTile) {
    return Math.abs(startTile.y - endTile.y);
}

function convertToCode(tileX) {
    return tileX.charCodeAt();
}

function convertToChar(tileX) {
    return String.fromCharCode(tileX);
}




export {Rules};