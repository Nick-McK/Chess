import {Board, BOARD, canvas, pieces, table} from "./modules/board.js";
import {bishop, Piece, wP} from "./modules/Piece.js";
import {Tile} from "./modules/Tile.js";
import {Rules} from "./modules/Rules.js";




class Move {
    constructor() {
        this.board = new Board();
        this.tile = new Tile();
        this.piece = new Piece();
        this.rules = new Rules();
        // this.game = new Game();
    }

    // Moves a piece on the canvas by listening to 3 mouse events: mousedown, mouseup and mousemove
    movePieceUI() {
        
        // const canvas = document.getElementById("canvas");
        const ctx = canvas.getContext("2d");

        let clientRect = canvas.getBoundingClientRect();
        let offsetX = clientRect.left;
        let offsetY = clientRect.top;
        
        let dragok = false;
        let startX;
        let startY;
        
        // Rebinds the this keyword so that we can use it in our other functions as when "this" is used inside a function it refers to the object window (in this case the canvas). We can still use "this" after it has been bound to self in our methods within the class
        let self = this;

         // Listen for mouse events
        canvas.onmousedown = myDown;
        canvas.onmouseup = myUp;
        canvas.onmousemove = myMove;

        // call to draw the scene
        draw();

        // redraw the scene
        function draw(newX, newY) {
            // Draw the board
            self.board.drawBoard();
            let pieceMap = getPieceMap(table);

            // redraw each piece in the pieces[] array
            for (let piece of pieceMap.values()) {
                // if the piece has an image and has NOT moved coords then draw it onto the canvas with the same coords
                if (piece.x != newX && piece.image || piece.y != newY && piece.image) {
                    ctx.drawImage(piece.image, piece.x, piece.y);
                }
                // If the piece has moved and has an image then we draw it onto the canvas with the NEW coords which are set to the centre of the closest tile
                else if (piece.image && piece.x == newX || piece.image && piece.y == newY) {
                    ctx.drawImage(piece.image, newX, newY);
                }
            }
        }
// TODO: Move this to be its own method along with myUp and myMove
        // handle mousedown events
        function myDown(e) {

            // tell the browser we're handling this mouse event
            e.preventDefault();
            e.stopPropagation();

            // get the current mouse position
            let mx = parseInt(e.clientX - offsetX);
            let my = parseInt(e.clientY - offsetY);

            // test each rect to see if mouse is inside
            dragok = false;
            // We get the piece map so we are only dealing with a map that has a value for every key, this saves us from having to deal with 0 values or undefined
            let pieceMap = getPieceMap(table);
            
            for (let piece of pieceMap.values()) {
                // if (piece === undefined) continue;
                // If the mouse is inside the piece when we click then set dragging properties to be true
                if (mx > piece.x && mx < piece.x + piece.width && my > piece.y && my < piece.y + piece.height) {
                    // if yes, set that pieces isDragging=true
                    dragok = true;
                    piece.isDragging = true;
                    console.log("The x coord for the piece: ", piece.x, " and the Y coord: ", piece.y);

                    let pieceType = piece._type;
                    let pieceColour = piece._isWhite;
                    console.log("I am a: ", pieceColour, " ", pieceType);
                    // If the piece is a pawn then draw valid moves
                    switch(pieceType) {
                        case "pawn":
                            if (pieceColour) {
                                self.drawValid(piece);
                            } else {
                                self.drawValid(piece)
                                }
                    }
                }
            }
            // save the current mouse position
            startX = mx;
            startY = my;
        }

// TODO: Move this to be its own method along with myDown and myMove
        // handle mouseup events
        function myUp(e) {  
            // tell the browser we're handling this mouse event
            e.preventDefault();
            e.stopPropagation();

            // this.game = new Game();

            let closest;
            let values = table.values();

            // clear all the dragging flags
            dragok = false;

            let pieceMap = getPieceMap(table);

            for (let piece of pieceMap.values()) {
                if (piece.isDragging) {
                    piece.isDragging = false;

                    // Calls to the method getClosestTile which will find the closest tile for the given piece
                    closest = self.getClosestTile(piece);
                    
                    // Saves the x and y for the piece we have moved
                    const oldX = piece.x;
                    const oldY = piece.y;
                    // Sets the new x and y for the piece we have moved
                    piece.x = closest.screenX;
                    piece.y = closest.screenY;
                    // If the piece has moved then draw the piece with the new x and y coords
                    if (piece.x != oldX || piece.y != oldY) {
                        draw(piece.x, piece.y);
                        self.playMoveSound();   

                        let target;
                        for (let f of BOARD) {
                            target = f.filter(t => {return t.screenX == closest.screenX && t.screenY == closest.screenY})
                            // console.log("This is the target, ", target);
                        }
                        self.playMove(piece, target);

                        // Collision for taking pieces
                        if (!(piece.tile.isEmpty)) {
                            //TODO: Remove the piece that is on the board and keep the piece we have just placed
                            
                        }
                    }
                }
            }
        }
// TODO: Move this to be its own method along with myUp and myDown

        // handle mouse moves
        function myMove(e) {
            // if we're dragging anything...
            if (dragok) {

                // tell the browser we're handling this mouse event
                e.preventDefault();
                e.stopPropagation();

                // get the current mouse position
                let mx = parseInt(e.clientX - offsetX);
                let my = parseInt(e.clientY - offsetY);

                // calculate the distance the mouse has moved
                // since the last mousemove
                let dx = mx - startX;
                let dy = my - startY;

                let pieceMoves;
                let pieceMap = getPieceMap(table);

                // move each piece that isDragging is true for
                // by the distance the mouse has moved
                // since the last mousemove
                for (let piece of pieceMap.values()) {
                    if (piece.isDragging) {
                        piece.x += dx;
                        piece.y += dy;
                        pieceMoves = piece;
                    }
                }
                // redraw the scene with any updates to the piece positions
                draw();
                // Draws the valid moves for the piece we are moving
                self.drawValid(pieceMoves);

                // reset the starting mouse position for the next mousemove
                startX = mx;
                startY = my;
            }
        } 
    }

/**
 * Gets a map of tiles(keys) and pieces(values). This is different from our
 * main table map as it only includes tiles that have pieces on them.
 * 
 * @param {Map} map the hashmap of tile piece pairs 
 * @returns a set containing all pieces on the table
 */
    // getPieceMap(map) {
    //     let pieceMap = new Map();
    //     for (let i = 0; i < map.size; i++) {
    //         let entry = Array.from(map.keys())[i];
    //         if (map.get(entry) != 0) {
    //             pieceMap.set(entry, map.get(entry));
    //         }
    //     }
    //     return pieceMap;
    // }

/**
 * Takes in the piece we are moving and when placed down will check what tile 
 * is closest to the piece so we can adjust where it is placed
 * 
 * 
 * @param {Piece} piece the current piece we are moving 
 * @returns the tile that is closest to the piece we are moving
 */
    getClosestTile(piece) {
        let tiles = table.keys();

        for (let tile of tiles) {
            let difX = Math.abs(piece.x - tile.screenX);
            let difY = Math.abs(piece.y - tile.screenY);

            if (difX <= 50 && difY <= 50) {
                return tile;
            }
        }
    }
/**
 * This method will take in a given piece on the board and highlight or show all the available moves for it.
 * 
 * @param {Piece} piece the given piece that we need to draw available moves for on the board
 */
    drawValid(piece) {
        const ctx = canvas.getContext("2d");
        let validMoves = new Set();
        validMoves = this.getPossibleMoves(piece);
        // console.log("valid moves: ", validMoves);
        for (let move of validMoves) {
            ctx.lineWidth = 5;
            ctx.strokeStyle = "black";
            ctx.strokeRect(move.screenX, move.screenY, 100, 100);
        } 
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
        // Create a new rules object and pass in the piece that we are finding rules for
    
        this.rules.getPieceRules(piece);

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
   // TODO: Implement execute move in our map
     playMove(piece, target) {
        

    }


    run() {
        // this.board.initBoard();
        // this.board.populate();
        // this.movePieceUI();
        this.board.createBoardHash();
        this.board.populateHash();
        this.movePieceUI();
        getPieceMap(table);
    }



    playMoveSound() {
        let audio = new Audio("../assets/move.mp3");
        return audio.play();
    }

    playCaptureSound() {
        let audio = new Audio("../assets/capture.mp3");
        return audio.play();
    }

}

/**
 * Gets a map of tiles(keys) and pieces(values). This is different from our
 * main table map as it only includes tiles that have pieces on them.
 * We keep this as a function because we need to use it in our Rules class, and we cannot instantiate a new move in rules and have a new rules in move (This could probably be avoided entirely by just making rules a function and not a class but I'm keeping everything in classes for this)
 * 
 * @param {Map} map the hashmap of tile piece pairs 
 * @returns a set containing all pieces on the table
 */
function getPieceMap(map) {
    let pieceMap = new Map();
    for (let i = 0; i < map.size; i++) {
        let entry = Array.from(map.keys())[i];
        if (map.get(entry) != 0) {
            pieceMap.set(entry, map.get(entry));
        }
    }
    return pieceMap;
}


const start = new Move();

start.run();





export {Move, getPieceMap};