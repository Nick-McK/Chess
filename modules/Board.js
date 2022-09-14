import {Tile} from './Tile.js';
import {Piece, pawn, rook, knight, bishop, queen, king, wR, wN, wB, wK, wQ, wP, bR, bN, bB, bK, bQ, bP} from './Piece.js';

const canvas = document.getElementById("canvas");
const FILE = ["A", "B", "C", "D", "E", "F", "G", "H"];
const RANK = [1, 2, 3, 4, 5, 6, 7, 8];
const BOARD = [];
let pieces = [];
var table = new Map();
// Function to update our board with a new board after a piece move
const updateTable =  (newTable) => {
    table = newTable;
}

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


    static drawBoard() {
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

    // Not all tiles need to have a piece so keys do not always need values
    // Would allow for looking up easily with key lookups and wouldnt need to use 2d array

    static createBoardHash() {
        // Loop through the file first then the ranks
        // Doing this we go through all A values then B values etc..
        for (let i = 0; i < FILE.length; i++) {
            for (let j = 0; j < RANK.length; j++) {
                // If the tile is even then its white
                if ((i % 2 && !(j % 2)) || (!(i % 2) && (j % 2))) {
                    table.set(
                        new Tile(
                            FILE[i],
                            RANK[j],
                            true,
                            false,
                            i * 100,
                            ((RANK.length - 1) - j) * 100), 0);
                }
                else if ((i % 2 && j % 2) || (!(i % 2) && !(j % 2))) {
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
        console.log("Starting Board: ", table);
    }

    static populateHash() {
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
                        table.set(tile, new Piece(500, 0, 100, 100, bB, tile, false, bishop, false));
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
        // console.log("========", table);
    }


}

export {Board, FILE, RANK, BOARD, canvas, pieces, table, updateTable};


