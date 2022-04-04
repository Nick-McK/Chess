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
     * To remove the squares with pieces on them we split the loops into 2 one for x and another for y. If the tiles Y value is less than the piece we are moving's then we want to skip this square as there could be more moveable tiles after it
     * If we see a tile that is ONLY the same colour as the piece we are moving then we can stop looping as we cannot move past that piece
     * This is the same for black, but the break and continue statements are flipped to account for the flipped board
     * 
     * @param {Piece} piece 
     * @returns a set of moves for the rooks
     */
    rookRules(piece) {
        let tileSkip
        let moves = new Set();
        let movesX = new Set();

        for (let key of table.keys()) {
            // If the tile is on the same x axis as us and not our current tile then add to list
            // Controls FILE
            if (Object.entries(key)[0][1] == piece.tile.x && Object.entries(key)[1][1] != piece.tile.y) {

                if (piece.isWhite == true) {
                    // IF a piece is behind us and its white then skip
                    if (key.y < piece.tile.y && table.get(key).isWhite == piece.isWhite) {
                        // moves.add(key);
                        continue;
                    }
                    if (table.get(key).isWhite == piece.isWhite) {
                        break;
                    }
                } 
                if (piece.isWhite == false) {
                    // IF a piece is behind us and its white then skip
                    if (key.y < piece.tile.y && table.get(key).isWhite == piece.isWhite) {
                        moves.clear();
                        continue;
                    }
                    if (table.get(key).isWhite == piece.isWhite) {
                        break;
                    }
                }
                moves.add(key);
            }
        }
        for (let key of table.keys()) {
            // If the y value is the same as our current tile and is not the tile that our piece is on then add to moves
            // Controls RANK
            if (Object.entries(key)[1][1] == piece.tile.y && Object.entries(key)[0][1] != piece.tile.x) {
                if (piece.isWhite == true) {
                    // Get all the tiles after this piece
                    if (key.x < piece.tile.x && table.get(key).isWhite == piece.isWhite) {
                        movesX.clear();
                        continue;
                    }
                }
                if (piece.isWhite == false) {
                    if (key.x < piece.tile.x && table.get(key).isWhite == piece.isWhite) {
                        movesX.clear();
                        continue;
                    }
                    
                }
                // Stop if we have not met above condition as we cannot move piece past another one of our own
                if (table.get(key).isWhite == piece.isWhite) {
                    break;
                }
                movesX.add(key);
            }
        }
        movesX.forEach(move => {
            return moves.add(move);
        })
        return moves;
    }

    knightRules(piece) {
        let moves = new Set();
        for (let key of table.keys()) {
            let fileDif = Math.abs(compareFile(piece.tile, key));
            let rankDif = Math.abs(compareRank(piece.tile, key));
            // the && condition means we cant place a knight on top of another piece that is the same colour as us
            if ((fileDif == 1 && rankDif == 2) && table.get(key).isWhite != piece.isWhite || (fileDif == 2 && rankDif == 1) && table.get(key).isWhite != piece.isWhite) {
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
        let prevWhite;
        let moves = new Set();
        let movesToCheck = new Set();
        let removeMoves;
        let keepMoves = new Set();
        let finalMoves = new Set();

            
        // get diagonals of our piece
        for (let key of table.keys()) {
            if (diagTile(piece.tile, key)) {
                moves.add(key);
            }
        }
        console.log("movomvomvomvomv", moves);
        for (let move of moves) {
            console.log("move", move)
            // If a move is on the edge of the board
            if (move.x == "A" || move.x == "H" || move.y == 1 || move.y == 8) {
                console.log("checking this move", move);
                movesToCheck = this.getTilesBetweenDiag(piece.tile, move);
                console.log("movesToCheck", movesToCheck)

                for (let moveCheck of movesToCheck) {
                    if (moveCheck === undefined) continue;
                    console.log("moveCheck", moveCheck);
                    console.log("pieceeeeeeeeeee", piece.isWhite);
                    if (moveCheck != piece.tile && table.get(moveCheck).isWhite == piece.isWhite) {
                        console.log("keep moves from this piece to bishop", moveCheck);
                        keepMoves = this.getTilesBetweenDiag(piece.tile, moveCheck);
                        console.log("keepMoves", keepMoves);
                        if (keepMoves.has(moveCheck)) {
                            keepMoves.delete(moveCheck);
                            // finalMoves.clear();
                            keepMoves.forEach(m => {
                                return finalMoves.add(m);
                            })
                            console.log("finally", finalMoves);
                        }
                        break;
                    }
                    finalMoves.add(moveCheck);
                }
            }
        }
       
        

        console.log("bvlah blah", finalMoves);



        // return keepMoves;
        return finalMoves;
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
            let fileDif = Math.abs(compareFile(piece.tile, key));
            let rankDif = Math.abs(compareRank(piece.tile, key));
            if (((fileDif == 1 && rankDif == 1) || (fileDif == 0 && rankDif == 1) || (fileDif == 1 && rankDif == 0)) && table.get(key).isWhite != piece.isWhite) {
                moves.add(key)
            }
        }
        return moves;
    }

    // This only works for diagonals
    getTilesBetweenDiag(startTile, endTile) {
        let tileBetween = new Set();
        
        console.log("startTile", startTile);
        console.log("endTile", endTile);

        let rankDif = compareRank(startTile, endTile);
        let fileDif = compareFile(startTile, endTile);
        let loop = Math.abs(rankDif);

        console.log("rankDif", rankDif);
        console.log("fileDif", fileDif);


        let startTileCode = convertToCode(startTile.x);

        

        if (rankDif < 0 && fileDif > 0) { // Going up left for white
            // Loop for +1 to include the last tile
            for (let i=1; i< loop+1;i++) {
                tileBetween.add(
                    getKey(convertToChar(startTileCode - i), startTile.y + i)
                );
            }
        } else if (rankDif < 0 && fileDif < 0) { // Going up right for white
            for (let i=1; i< loop+1;i++) {
                tileBetween.add(
                    getKey(convertToChar(startTileCode + i), startTile.y + i)
                );
            }
        } else if (rankDif > 0 && fileDif < 0) { // back right for white
            for (let i=1; i< loop + 1; i++) {
                tileBetween.add(
                    getKey(convertToChar(startTileCode + i), startTile.y - i)
                );
            }
        } else if (rankDif > 0 && fileDif > 0) { // back left for white
            for (let i=1; i< loop + 1; i++) {
                tileBetween.add(
                    getKey(convertToChar(startTileCode - i), startTile.y - i)
                );
            }
        }
        return tileBetween;
    }
}


// Finds the difference between the rank and file of 2 tiles. If the difference between each of these is the same then its on a diagonal
function diagTile(startTile, endTile) {
    return Math.abs(compareRank(startTile, endTile)) == Math.abs(compareFile(startTile, endTile));
}

// Compares the x(FILE) values of 2 tiles by converting them to numbers
function compareFile(startTile, endTile) {
    return startTile.x.charCodeAt() - endTile.x.charCodeAt();
}
// Compares the y(RANK) values of 2 tiles
function compareRank(startTile, endTile) {
    // console.log(startTile.y, " - ", endTile.y);
    return startTile.y - endTile.y;
}

function convertToCode(tileX) {
    return tileX.charCodeAt();
}

function convertToChar(tileX) {
    return String.fromCharCode(tileX);
}
// Checks if a piece is blocked in by other pieces
function checkBlock(piece, moves) {
    

    return moves;


}

function getKey(x, y) {
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




export {Rules};