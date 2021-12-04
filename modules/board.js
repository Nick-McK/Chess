import {Tile} from './Tile.js';
import {Piece, pawn, rook, knight, bishop, queen, king, wR, wN, wB, wK, wQ, wP, bR, bN, bB, bK, bQ, bP} from './Piece.js';

const canvas = document.getElementById("canvas");
const FILE = ["A", "B", "C", "D", "E", "F", "G", "H"];
const RANK = [1, 2, 3, 4, 5, 6, 7, 8];
const BOARD = [];
let pieces = [];

class Board {
    constructor() {

    }
    // Creates the board in a 2d array and draws the board onto our canvas
// TODO: Move creating the tile out of here so we can call this when drawing the scene for movement -> create a method drawBoard() to be called when we want to draw the board
    initBoard() {
        // const canvas = document.getElementById("canvas");

        const ctx = canvas.getContext("2d");

        let clientRect = canvas.getBoundingClientRect();
        let offsetX = clientRect.left;
        let offsetY = clientRect.top;


        for (let i = 0; i < FILE.length; i++) {
            BOARD[i] = [];
            for (let j = 0; j < RANK.length; j++) {
                // If the first number of i and j are either even/odd OR odd/even then make the square white
                // Default fill is black
                if ((i % 2 && !(j % 2)) || (!(i % 2) && (j % 2))) {
                    let tile = new Tile(FILE[i], RANK[j], true, false, i * 100, ((RANK.length - 1) - j) * 100);
                    BOARD[i][j] = tile;
                }
                else if ((i % 2 && j % 2) || (!(i % 2) && !(j % 2))) {
                    let tile = new Tile(FILE[i], RANK[j], true, true, i * 100, ((RANK.length - 1) - j) * 100);
                    BOARD[i][j] = tile;
                }
                console.log(BOARD[i][j]);
            }
            
        }

    }


    drawBoard() {
        const ctx = canvas.getContext("2d");
        for (let i = 0; i < FILE.length; i++) {
            for (let j = 0; j < RANK.length; j++) {
                // If the first number of i and j are either even/odd OR odd/even then make the square white
                // Default fill is black
                if ((i % 2 && !(j % 2)) || (!(i % 2) && (j % 2))) {
                    ctx.fillStyle = "#e3ac8a";
                    ctx.fillRect(i * 100, j * 100, 100, 100);
                }
                else if ((i % 2 && j % 2) || (!(i % 2) && !(j % 2))) {
                    ctx.fillStyle = "#8c4b23";
                    ctx.fillRect(i * 100, j * 100, 100, 100);
                }
            }
        }
    }

// TODO: Populate the table with pieces visually and in the board array
    populate() {

// TODO: change this       // Crude method of placeing pieces at start of game

/* Populates the BOARD array with the special pieces. This works by assuming white is playing at the bottom of the board therefore, we can assume that when x and y are at specified values, that is also where the piece should be on the board and in the array. To do this however, we need to set the coords of the piece to be the same X coord as the x counter x100 (we haven't flipped the board horizontally) and set the Y coord to be the opposite of the y counter x100. To do this we take the final row and set the coord to be the BOARD length (8) minus 1 as we are counting from 0, and then multiply by 100 for the final Y coord.

Set the isEmpty value to false for all the tiles we have put pieces on
    
    TODO: This is a very poor method of placing pieces as we need to loop through all 64 squares, when we only need 32.

*/
        for (let x = 0; x < BOARD.length; x++) {
            for (let y = 0; y < BOARD[0].length; y++) {

                if ((x < BOARD.length) && y == 1) {
                    let p = new Piece(x * 100, (BOARD.length - 2) * 100, 100, 100, wP, BOARD[x][y], true, pawn);
                    pieces.push({p, isDragging: false});
                    BOARD[x][y].isEmpty= false;
                }
                else if ((x <= BOARD.length) && y == 6) {
                    let p = new Piece(x * 100, y + 95, 100, 100, bP, BOARD[x][y], false, pawn);
                    pieces.push({p, isDragging: false});
                    BOARD[x][y].isEmpty = false;
                }





                if ((x == 0 && y == 0) || (x == 7 && y == 0)) {
                    let p = new Piece(x * 100, (BOARD.length - 1) * 100, 100, 100, wR, BOARD[x][y], true, rook);
                    pieces.push({p, isDragging: false});
                    BOARD[x][y].isEmpty = false;

                }
                else if ((x == 0 && y == 7) || (x == 7 && y == 7)) {
                    let p = new Piece(x * 100, 0, 100, 100, bR, BOARD[x][y], false, rook);
                    pieces.push({p, isDragging: false});
                    BOARD[x][y].isEmpty = false;
                }

                else if ((x == 1 && y == 0) || (x == 6 && y == 0)) {
                    let p = new Piece(x * 100, (BOARD.length - 1) * 100, 100, 100, wN, BOARD[x][y], true, knight);
                    pieces.push({p, isDragging: false});
                    BOARD[x][y].isEmpty = false;
                }
                else if ((x == 1 && y == 7) || (x == 6 && y == 7)) {
                    let p = new Piece(x * 100, 0, 100, 100, bN, BOARD[x][y], false, knight);
                    pieces.push({p, isDragging: false});
                    BOARD[x][y].isEmpty = false;
                }

                else if ((x == 2 && y == 0) || (x == 5 && y == 0)) {
                    let p = new Piece(x * 100, (BOARD.length - 1) * 100, 100, 100, wB, BOARD[x][y], true, bishop);
                    pieces.push({p, isDragging: false});
                    BOARD[x][y].isEmpty = false;
                }
                else if ((x == 2 && y == 7) || (x == 5 && y == 7)) {
                    let p = new Piece(x * 100, 0, 100, 100, bB, BOARD[x][y], false, bishop);
                    pieces.push({p, isDragging: false});
                    BOARD[x][y].isEmpty = false;
                }

                else if ((x == 3 && y == 0)) {
                    let p = new Piece(x * 100, (BOARD.length - 1) * 100, 100, 100, wQ, BOARD[x][y], true, queen);
                    pieces.push({p, isDragging: false});
                    BOARD[x][y].isEmpty = false;
                }
                else if ((x == 3 && y == 7)) {
                    let p = new Piece(x * 100, 0, 100, 100, bQ, BOARD[x][y], false, queen);
                    pieces.push({p, isDragging: false});
                    BOARD[x][y].isEmpty = false;
                }

                else if ((x == 4 && y == 0)) {
                    let p = new Piece(x * 100, (BOARD.length - 1) * 100, 100, 100, wK, BOARD[x][y], true, king);
                    pieces.push({p, isDragging: false});
                    BOARD[x][y].isEmpty = false;
                }
                else if ((x == 4 && y == 7)) {
                    let p = new Piece(x * 100, 0, 100, 100, bK, BOARD[x][y], false, king);
                    pieces.push({p, isDragging: false});
                    BOARD[x][y].isEmpty = false;
                }
            }
        }
    }





}

export {Board, FILE, RANK, BOARD, canvas, pieces};


