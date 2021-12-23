import {BOARD, Board, FILE, RANK, table} from "./board.js";
import {Piece, wP, pawn} from "./Piece.js";
import {Tile} from "./Tile.js";
import {Move, getPieceMap} from "../Move.js";

class Rules {
    constructor() {
    }
    
    getPieceRules(piece) {
        switch(piece.type) {
            case "pawn":
                this.pawnRules(piece);
            // case "rook":
            //     this.rookRules(piece);
            // case "knight":
            //     this.knightRules(piece);
            // case "bishop":
            //     this.bishopRules(piece);
            // case "queen":
            //     this.queenRules(piece);
            // case "king":
            //     this.kingRules(piece);
        }
    }


    pawnRules(piece) {
        let moves = new Set();
        let pieceTile;
        // If we have moved then we can only move forward by 1
        // If we have not moved then we can move forward by 1 or 2

        let pieceMap = getPieceMap(table);
        

    
    
    
        
        // for (let i of BOARD) {
        //     pieceTile = i.find(t => {return t == piece.tile});
        // }
        // console.log("Piece tile: ", pieceTile);
        // console.log("piece y: ", piece.tile.y);
        
        // // If the piece hasn't moved -> using array numbers as we primarly need to calculate moves in the array maybe?
        // if (piece.tile.y == 2 || piece.tile.y == 7) { 
        //     console.log("we havent moved yet so add 2 to moves list");
        //     // Add the tile as a potential move
        //     moves.add(BOARD.find(t => {return t == piece.tile.y + 2}));
        //     console.log("Moves: ", moves);
        // }
        // else {
        //     console.log("We have moved so its just one move");
        //     // moves.add(pieceTile.y + 1);
        //     // moves.add(BOARD[i][j + 1]);
        // }
    
        return moves;
    }
    // TODO: Implement rules for each piece type
    rookRules(piece) {}

    knightRules(piece) {}

    bishopRules(piece) {}

    queenRules(piece) {}

    kingRules(piece) {}


   
}



/*
    Do lookup in pieces array using the x,y coords of the piece on the board visualy not in our array (avoids looping through all our pieces)
     
    

*/




export {Rules};