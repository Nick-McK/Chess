import {BOARD, Board, FILE, RANK, table} from "./Board.js";
import {Piece, wP, pawn, rook} from "./Piece.js";
import {Tile} from "./Tile.js";
import {Move, getPieceMap} from "../Move.js";
// let bCheck = false, wCheck = false;
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

    // Used to handle checkmate by getting all the moves our opponent can make and playing them.
    getAllMoves(colour) {
        let moves = new Set();
        for (let value of table.values()) {
            if (value == 0) continue;
            if (value.isWhite == colour) {
                moves.add(this.getPieceRules(value));
            }
        }
        return moves;
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
 * 
 * TODO: enpassant
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
                    if (!capture.isEmpty && table.get(capture).isWhite != piece.isWhite) {
                        moves.add(capture);
                    }
                    if (!captureR.isEmpty && table.get(captureR).isWhite != piece.isWhite) {
                        moves.add(captureR);
                    }
                case false:
                    if (piece.tile.x == "A" && !captureR.isEmpty && table.get(captureR).isWhite != piece.isWhite) {
                        moves.add(captureR);
                    }else if(piece.tile.x == "H" && !capture.isEmpty && table.get(capture).isWhite != piece.isWhite) {
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

    // We want to add every tile from the rooks starting tile to the end of the board as a move
    /**
     * Looks at all the tiles in our map and if the tile has the same x or y value as the tile our piece is on then it is in a straight line with our tile and we can move rooks to it
     * 
     * To remove the squares with pieces on them we split the loops into 2 one for x and another for y. If the tiles Y value is less than the piece we are moving's then we want to skip this square as there could be more moveable tiles after it
     * If we see a tile that is ONLY the same colour as the piece we are moving then we can stop looping as we cannot move past that piece
     * This is the same for black, but the break and continue statements are flipped to account for the flipped board
     * 
     * TODO: Castling
     * 
     * @param {Piece} piece 
     * @returns a set of moves for the rooks
     */
    rookRules(piece) {
        let moves = new Set();
        let movesToCheck = new Set();
        let keepMoves = new Set();
        let finalMoves = new Set();

        for (let key of table.keys()) {
            if (compareFile(piece.tile, key) == 0 || compareRank(piece.tile, key) == 0) {
                moves.add(key);
            }
        }
        for (let move of moves) {
            if (move.x == "A" || move.x == "H" || move.y == 1 || move.y == 8) {
                movesToCheck = this.getTilesBetween(piece.tile, move);

                for (let moveCheck of movesToCheck) {
                    if (moveCheck === undefined) continue;
                    if (table.get(moveCheck).isWhite == piece.isWhite && moveCheck != piece.tile) {
                        keepMoves = this.getTilesBetween(piece.tile, moveCheck);

                        // Removing the move with a white piece on it
                        if (keepMoves.has(moveCheck)) {
                            keepMoves.delete(moveCheck);
                            // Insert moves into returned moves set
                            keepMoves.forEach(m => {
                                return finalMoves.add(m);
                            })
                        }
                        break;
                    }
                    // If we find a different colour piece than the one we are moving then remove all moves after that
                    if (moveCheck.isEmpty == false && table.get(moveCheck).isWhite != piece.isWhite) {
                        finalMoves.add(moveCheck);
                        break;
                    }
                    // If there are no pieces between our piece and the edge then add this move
                    finalMoves.add(moveCheck);
                }
            }
        }
        return finalMoves;
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
 * We then check to all of our diagonal moves, and if there is a move available on the edge of the board, then get all the moves between this tile and the piece we are moving.
 * When we check these moves, if there is no other white piece on any of these tiles, then add all of these tiles to the moves list
 * If there is a white piece on the one of these tiles then only add the moves that appear between this piece and the piece we are moving 
 * 
 * NOTE: THIS ONLY WORKS BECAUSE WE ARE CHECKING THE MOVES FROM THE PIECE TO THE EDGE OF THE BOARD NOT FROM THE EDGE TO THE PIECE
 * eg: if we have a white bishop that can see to A6 and a pawn blocking on C4 then when we check the square A6, we start checking E2 then D3, then C4 and since there is a pawn on C4 we only include those squares then break out of the loop
 * 
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
        for (let move of moves) {
            // If a move is on the edge of the board
            if (move.x == "A" || move.x == "H" || move.y == 1 || move.y == 8) {
                movesToCheck = this.getTilesBetweenDiag(piece.tile, move);
                
                for (let moveCheck of movesToCheck) {
                    
                    if (moveCheck === undefined) continue;
                    if (moveCheck != piece.tile && table.get(moveCheck).isWhite == piece.isWhite) {
                        keepMoves = this.getTilesBetweenDiag(piece.tile, moveCheck);
                        // Removing the move with a white piece on it
                        if (keepMoves.has(moveCheck)) {
                            keepMoves.delete(moveCheck);
                            
                            // Insert moves into returned moves set
                            keepMoves.forEach(m => {
                                return finalMoves.add(m);
                            })
                        }
                        break;
                    }
                    // If we find a different colour piece than the one we are moving then remove all moves after that
                    if (moveCheck.isEmpty == false && table.get(moveCheck).isWhite != piece.isWhite) {
                        finalMoves.add(moveCheck);
                        break;
                    }
                    // If there are no pieces between our piece and the edge then add this move
                    finalMoves.add(moveCheck);
                }
            }
        }
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
 * 
 * TODO: Check + checkmate
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
            // Remove all tiles that are being attacked from the kings move list
            // MOve this to be global so we cannot move any piece if we are in check except to resolve the check
            // let attackedTiles = new Set();
            // attackedTiles = this.getAttackedTiles(piece.isWhite);

            // for (let tile of attackedTiles) {
            //     console.log("tiles", tile);
            //     if (table.get(tile).type == "king") {
            //         return check = true;
            //     }
            // }


        }
        // console.log("checkStatus:", check);
        return moves;
    }

    // This only works for diagonals
    getTilesBetweenDiag(startTile, endTile) {
        let tileBetween = new Set();
        let rankDif = compareRank(startTile, endTile);
        let fileDif = compareFile(startTile, endTile);
        let loop = Math.abs(rankDif);
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

    getTilesBetween(startTile, endTile) {
        let tileBetween = new Set();
        let rankDif = compareRank(startTile, endTile);
        let fileDif = compareFile(startTile, endTile);
        let startTileCode = convertToCode(startTile.x);
        let fileLoop = Math.abs(fileDif);
        let rankLoop = Math.abs(rankDif);

        if (rankDif == 0 && fileDif > 0) { // Moving left
            for (let i = 1; i < fileLoop + 1; i++) {
                tileBetween.add(
                    getKey(convertToChar(startTileCode - i), startTile.y)
                );
            }
        } else if (rankDif == 0 && fileDif < 0) { // Move right
            for (let i = 1; i < fileLoop + 1; i++) {
                tileBetween.add(
                    getKey(convertToChar(startTileCode + i), startTile.y)
                );
            }
        } else if (fileDif == 0 && rankDif < 0) { // Move up
            for (let i = 1; i < rankLoop + 1; i++) {
                tileBetween.add(
                    getKey(startTile.x, startTile.y + i)
                );
            }
        } else if (fileDif == 0 && rankDif > 0) { // Move down
            for (let i = 1; i < rankLoop + 1; i++) {
                tileBetween.add(
                    getKey(startTile.x, startTile.y - i)
                );
            }
        }
        return tileBetween;
    }
    
    /**
     * Gets all the tiles that are being attacked on the board for a given colour so we can find checks
     * 
     * @param {Boolean} colour is the isWhite value for the piece we are moving 
     */
    getAttackedTiles(colour) {
        let attackedTiles = new Set();
        for (let piece of table.values()) {
            if (piece != 0) {
                if (piece.isWhite != colour && piece.type == "pawn") {
                    let currentTileXCode = convertToCode(piece.tile.x);
                    let capture = this.getKey(convertToChar(currentTileXCode - 1), piece.tile.y + 1);
                    let captureR = this.getKey(convertToChar(currentTileXCode + 1), piece.tile.y + 1);
                    // Get the tile whose x is one left and one right of our current tile(captureB and captureRB) and y is 1 rank below our current tile to deal with black
                    let captureB = this.getKey(convertToChar(currentTileXCode - 1), piece.tile.y - 1);
                    let captureRB = this.getKey(convertToChar(currentTileXCode + 1), piece.tile.y - 1);

                    if (piece.isWhite) {
                        switch(!(piece.tile.x == "A" || piece.tile.x == "H")) {
                            case true:
                                if (capture != undefined) {
                                    attackedTiles.add(capture);    
                                }
                                if (captureR != undefined) {
                                    attackedTiles.add(captureR);
                                }
                            case false:
                                if (captureR != undefined) {
                                    attackedTiles.add(captureR);
                                }
                                if (capture != undefined) {
                                    attackedTiles.add(capture);    
                                }
                                
                        }
                    } else if (!piece.isWhite) {
                        switch(!(piece.tile.x == "A" || piece.tile.x == "H")) {
                            case true:
                                if (captureRB != undefined) {
                                    attackedTiles.add(captureRB);
                                }
                                
                                if (captureB != undefined) {
                                    attackedTiles.add(captureB);    
                                }
                                
                            case false:
                                if (captureRB != undefined) {
                                    attackedTiles.add(captureRB);
                                }
                            
                                if (captureB != undefined) {
                                    attackedTiles.add(captureB);    
                                }
                                
                        }
                    }
                    continue;
                } else if (piece.isWhite != colour) {
                    attackedTiles.add(this.getPieceRules(piece));
                }
                // if (piece.isWhite != colour) {
                //     attackedTiles.add(this.getPieceRules(piece));
                // }
            }
        }
        return attackedTiles;
    }

    /**
     * Gets all the attacks that can be revealed by moving a piece
     * Eg.
     * King E4 pawn F4 and bQueen G4
     * 
     * In this case moving our F4 pawn would reveal a check on the white king so we
     * cannot let the player move our F4 pawn
     * 
     * @param {Boolean} colour the isWhite value assigned to each piece to determine which colour they are (black or white)
     */
    getPotentialAttacks(colour) {
        let potentialAttacks = new Set();
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