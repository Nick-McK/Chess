import {Tile} from './Tile.js';
import {Piece, pawn, rook, knight, bishop, queen, king, wR, wN, wB, wK, wQ, wP, bR, bN, bB, bK, bQ, bP} from './Piece.js';

const canvas = document.getElementById("canvas");
const FILE = ["A", "B", "C", "D", "E", "F", "G", "H"];
const RANK = [1, 2, 3, 4, 5, 6, 7, 8];
const BOARD = [];
let pieces = [];
const table = new Map();

class Board {
    constructor() {

    }
    // Creates the board in a 2d array and draws the board onto our canvas
    initBoard() {
        // const canvas = document.getElementById("canvas");

        const ctx = canvas.getContext("2d");

        let clientRect = canvas.getBoundingClientRect();


        for (let i = 0; i < FILE.length; i++) {
            BOARD[i] = [];
            for (let j = 0; j < RANK.length; j++) {
                if ((i % 2 && !(j % 2)) || (!(i % 2) && (j % 2))) {
                    let tile = new Tile(FILE[i], RANK[j], true, false, i * 100, ((RANK.length - 1) - j) * 100);
                    BOARD[i][j] = tile;
                }
                else if ((i % 2 && j % 2) || (!(i % 2) && !(j % 2))) {
                    let tile = new Tile(FILE[i], RANK[j], true, true, i * 100, ((RANK.length - 1) - j) * 100);
                    BOARD[i][j] = tile;
                }
                // console.log(BOARD[i][j]);
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

    populate() {
        
// TODO: change this crude method of placeing pieces at start of game

/* Populates the BOARD array with the special pieces. This works by assuming white is playing at the bottom of the board therefore, we can assume that when x and y are at specified values, that is also where the piece should be on the board and in the array. To do this however, we need to set the coords of the piece to be the same X coord as the x counter x100 (we haven't flipped the board horizontally) and set the Y coord to be the opposite of the y counter x100. To do this we take the final row and set the coord to be the BOARD length (8) minus 1 as we are counting from 0, and then multiply by 100 for the final Y coord.

Set the isEmpty value to false for all the tiles we have put pieces on
    
    TODO: This is a very poor method of placing pieces as we need to loop through all 64 squares, when we only need 32.

*/
        for (let x = 0; x < BOARD.length; x++) {
            for (let y = 0; y < BOARD[0].length; y++) {

                if ((x < BOARD.length) && y == 1) {
                    let p = new Piece(x * 100, (BOARD.length - 2) * 100, 100, 100, wP, BOARD[x][y], true, pawn, false);
                    pieces.push(p);
                    BOARD[x][y].isEmpty= false;
                }
                else if ((x <= BOARD.length) && y == 6) {
                    let p = new Piece(x * 100, y + 95, 100, 100, bP, BOARD[x][y], false, pawn, false);
                    pieces.push(p);
                    BOARD[x][y].isEmpty = false;
                }





                if ((x == 0 && y == 0) || (x == 7 && y == 0)) {
                    let p = new Piece(x * 100, (BOARD.length - 1) * 100, 100, 100, wR, BOARD[x][y], true, rook, false);
                    pieces.push(p);
                    BOARD[x][y].isEmpty = false;

                }
                else if ((x == 0 && y == 7) || (x == 7 && y == 7)) {
                    let p = new Piece(x * 100, 0, 100, 100, bR, BOARD[x][y], false, rook, false);
                    pieces.push(p);
                    BOARD[x][y].isEmpty = false;
                }

                else if ((x == 1 && y == 0) || (x == 6 && y == 0)) {
                    let p = new Piece(x * 100, (BOARD.length - 1) * 100, 100, 100, wN, BOARD[x][y], true, knight, false);
                    pieces.push(p);
                    BOARD[x][y].isEmpty = false;
                }
                else if ((x == 1 && y == 7) || (x == 6 && y == 7)) {
                    let p = new Piece(x * 100, 0, 100, 100, bN, BOARD[x][y], false, knight, false);
                    pieces.push(p);
                    BOARD[x][y].isEmpty = false;
                }

                else if ((x == 2 && y == 0) || (x == 5 && y == 0)) {
                    let p = new Piece(x * 100, (BOARD.length - 1) * 100, 100, 100, wB, BOARD[x][y], true, bishop, false);
                    pieces.push(p);
                    BOARD[x][y].isEmpty = false;
                }
                else if ((x == 2 && y == 7) || (x == 5 && y == 7)) {
                    let p = new Piece(x * 100, 0, 100, 100, bB, BOARD[x][y], false, bishop, false);
                    pieces.push(p);
                    BOARD[x][y].isEmpty = false;
                }

                else if ((x == 3 && y == 0)) {
                    let p = new Piece(x * 100, (BOARD.length - 1) * 100, 100, 100, wQ, BOARD[x][y], true, queen, false);
                    pieces.push(p);
                    BOARD[x][y].isEmpty = false;
                }
                else if ((x == 3 && y == 7)) {
                    let p = new Piece(x * 100, 0, 100, 100, bQ, BOARD[x][y], false, queen, false);
                    pieces.push(p);
                    BOARD[x][y].isEmpty = false;
                }

                else if ((x == 4 && y == 0)) {
                    let p = new Piece(x * 100, (BOARD.length - 1) * 100, 100, 100, wK, BOARD[x][y], true, king, false);
                    pieces.push(p);
                    BOARD[x][y].isEmpty = false;
                }
                else if ((x == 4 && y == 7)) {
                    let p = new Piece(x * 100, 0, 100, 100, bK, BOARD[x][y], false, king, false);
                    pieces.push(p);
                    BOARD[x][y].isEmpty = false;
                }
            }
        }
    }

     //TODO: Potential hashtable implementation of the board with the tiles as keys and the pieces as values
    // Not all tiles need to have a piece so keys do not always need values
    // Would allow for looking up easily with key lookups and wouldnt need to use 2d array

    createBoardHash() {
        // Loop through the file first then the ranks
        // Doing this we go through all A values then B values etc..
        for (let i = 0; i < FILE.length; i++) {
            for (let j = 0; j < RANK.length; j++) {
                // If the tile is even then its white
                if (i + j % 2) {
                    table.set(
                        new Tile(
                            FILE[i],
                            RANK[j],
                            true,
                            false,
                            i * 100,
                            ((RANK.length - 1) - j) * 100), 0);
                }
                else if (!(i + j % 2)) {
                    table.set(
                        new Tile(
                            FILE[i],
                            RANK[j],
                            true,
                            true,
                            i * 100,
                            ((RANK.length - 1) - j) * 100), 0);
                }
            }
        }
        console.log("Our hash implementation: ", table);
    }

    populateHash() {
        let tile =  table.keys();
        let i = 0;
        for (tile of table.keys()) {
            if (tile.y == 2 || tile.y == 7) {
                switch(tile.y) {
                    case 2:
                        table.set(tile, new Piece(i * 100, (RANK.length - 2) * 100, 100, 100, wP, tile, true, pawn, false));
                        tile._isEmpty = false;
                        continue;
                    case 7:
                        table.set(tile, new Piece(i * 100, 100, 100, 100, bP, tile, false, pawn, false));
                        tile._isEmpty = false;
                        i++;
                        continue;
                }
            } else if (tile.x == "A") {
                console.log("tileX: ", tile.x)
                switch(tile.y) {
                    case 1:
                        table.set(tile, new Piece(0, (RANK.length - 1) * 100, 100, 100, wR, tile, true, rook, false));
                        tile._isEmpty = false;
                        continue;
                    case 8:
                        table.set(tile, new Piece(0, 0, 100, 100, bR, tile, false, rook, false));
                        tile._isEmpty = false;
                        continue;
                    default:
                        continue;
                }
            } else if (tile.x == "B") {
                switch(tile.y) {
                    case 1:
                        table.set(tile, new Piece(100, (RANK.length - 1) * 100, 100, 100, wN, tile, true, knight, false));
                        tile._isEmpty = false;
                        continue;
                    case 8:
                        table.set(tile, new Piece(100, 0, 100, 100, bN, tile, false, knight, false));
                        tile._isEmpty = false;
                        continue;
                    default:
                        continue;
                }
            } else if (tile.x == "C") {
                switch(tile.y) {
                    case 1:
                        table.set(tile, new Piece(200, (RANK.length - 1) * 100, 100, 100, wB, tile, true, bishop, false));
                        tile._isEmpty = false;
                        continue;
                    case 8:
                        table.set(tile, new Piece(200, 0, 100, 100, bB, tile, false, bishop, false));
                        tile._isEmpty = false;
                        continue;
                    default:
                        continue;
                }
            } else if (tile.x == "D") {
                switch(tile.y) {
                    case 1:
                        table.set(tile, new Piece(300, (RANK.length - 1) * 100, 100, 100, wQ, tile, true, queen, false));
                        tile._isEmpty = false;
                        continue;
                    case 8:
                        table.set(tile, new Piece(300, 0, 100, 100, bQ, tile, false, queen, false));
                        tile._isEmpty = false;
                        continue;
                    default:
                        continue;
                }
            } else if (tile.x == "E") {
                switch(tile.y) {
                    case 1:
                        table.set(tile, new Piece(400, (RANK.length - 1) * 100, 100, 100, wK, tile, true, king, false));
                        tile._isEmpty = false;
                        continue;
                    case 8:
                        table.set(tile, new Piece(400, 0, 100, 100, bK, tile, false, king, false));
                        tile._isEmpty = false;
                        continue;
                    default:
                        continue;
                }
            } else if (tile.x == "F") {
                switch(tile.y) {
                    case 1:
                        table.set(tile, new Piece(500, (RANK.length - 1) * 100, 100, 100, wB, tile, true, bishop, false));
                        tile._isEmpty = false;
                        continue;
                    case 8:
                        table.set(tile, new Piece(500, 0, 100, 100, bK, tile, false, bishop, false));
                        tile._isEmpty = false;
                        continue;
                    default:
                        continue;
                }
            } else if (tile.x == "G") {
                switch(tile.y) {
                    case 1:
                        table.set(tile, new Piece(600, (RANK.length - 1) * 100, 100, 100, wN, tile, true, knight, false));
                        tile._isEmpty = false;
                        continue;
                    case 8:
                        table.set(tile, new Piece(600, 0, 100, 100, bN, tile, false, knight, false));
                        tile._isEmpty = false;
                        continue;
                    default:
                        continue;
                }
            } else if (tile.x == "H") {
                switch(tile.y) {
                    case 1:
                        table.set(tile, new Piece(700, (RANK.length - 1) * 100, 100, 100, wR, tile, true, rook, false));
                        tile._isEmpty = false;
                        continue;
                    case 8:
                        table.set(tile, new Piece(700, 0, 100, 100, bR, tile, false, rook, false));
                        tile._isEmpty = false;
                        continue;
                    default:
                        continue;
                }
            }
        }
        console.log("========", table);
    }


}

export {Board, FILE, RANK, BOARD, canvas, pieces, table};


