import {Tile} from "./modules/Tile.js";
import {Board, FILE, RANK, BOARD, pieces} from "./modules/board.js";
import {Piece} from "./modules/Piece.js";
import {Move} from "./modules/Move.js";

// TODO: Move this to be a module and the Move.js file to be the main file as we need to call to our "Rules" when we make moves in the UI

class Game {
    constructor() {
        this.board = new Board();
        this.move = new Move();
        this.piece = new Piece();

        let isWhiteCheck = false;
        let isBlackCheck = false;
    }

/**
    Pawns can ONLY move +- 1 on the Y axis
    Rooks can move +- 7 on X and Y axis

     Gets all the possible moves for a given piece
     TODO: Finish implementing this -> currently only hard coded the pawns first 2 moves


    @param {Piece} piece a given piece on the chess board that we will return all the possible moves for
    @returns  a set of all possible moves for a given piece

**/ 
 getPossibleMoves(piece) {

        let moveSet = new Set();

        if (piece.type == "pawn") {
            let tile = piece.tile;
            // console.log("current tile: ", tile);
            // Using _y here to ensure that we dont change the property as there is no setter it will give an error if the property is changed
            if (piece.tile._y == 2) {

// TODO: Look at how to make this dynamic and not hard coded with the + 1 and + 2 -> probably going to need maths to find a formula for the moves for each piece 
                for (let i = 0; i < BOARD.length; i++) {
                    for (let j = 0; j < BOARD[0].length; j++) {
                        if (BOARD[i][j] == tile) {
                            moveSet.add(BOARD[i][j + 1]);
                            moveSet.add(BOARD[i][j + 2]);
                            // console.log("We just added moves: ", moveSet, " for piece: ", piece.p);
                        }
                    }
                }
            }
        }
        return moveSet;
    }


/** 
 * Plays a move in our array board and updates all the associated values "behind the scenes".
 * 
 * 
 * 
 * @param {Piece} piece the piece we are moving from one tile to another 
 * @param {Tile} target the target tile we are moving our piece to
 */
    playMove(piece, target) {
        let startTile = piece.getTile;

        

        console.log("Start tile before any changes: ", piece.tile);

        piece._isEmpty = true;; // Set the tile we have moved from to be true

        target._isEmpty = false; // Setting the target tile to having a piece on it

        piece._tile = target; // Update our piece to be on our new tile

         console.log("Target tile after changes: ", target);
         console.log("Start tile after changes: ", piece.tile);
         console.log("This is our piece we have moved: ", piece);
         console.log("to tile: ", piece.tile);

    }



    

    run() {
        this.board.initBoard();
        this.board.populate();
        this.move.movePieceUI();

        

        // this.getPossibleMoves(pieces[5]);

        // console.log("This is the pieces array: ", pieces);
    }

}


const start = new Game();

start.run();


export {Game};

