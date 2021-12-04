import {Tile} from "./modules/Tile.js";
import {Board, FILE, RANK, BOARD, pieces} from "./modules/board.js";
import {Piece} from "./modules/Piece.js";
import {Move} from "./modules/Move.js";


class Game {
    constructor() {
        this.board = new Board();
        this.move = new Move();
    }

    

    run() {
        this.board.initBoard();
        this.board.populate();
        this.move.movePieceUI();

        console.log("This is the pieces array: ", pieces);
    }

}


const start = new Game();

start.run();

