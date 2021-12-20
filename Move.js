import {Board, BOARD, canvas, pieces, table} from "./modules/board.js";
import {bishop, Piece, wP} from "./modules/Piece.js";
import {Tile} from "./modules/Tile.js";
// import {Game} from "./Game.js";




class Move {
    constructor() {
        this.board = new Board();
        this.tile = new Tile();
        this.piece = new Piece();
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
            // Get all the values from the hashmap
            let values = table.values();
            // redraw each piece in the pieces[] array
            for (let piece of values) {
                // If we are dealing with 0's or undefined then move to the next value in the map
                if (piece === undefined) continue;
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

            let values = table.values();
            // test each rect to see if mouse is inside
            dragok = false;
            for (let piece of values) {
                if (piece === undefined) continue;
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
            for (let piece of values) {
                if (piece === undefined) break;

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
                        // self.playMove(piece, target);

                        // Collision for taking pieces
                        if (!(piece.tile.isEmpty)) {
                            // Remove the piece that is on the board and keep the piece we have just placed
                            
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
                let values = table.values();

                // move each piece that isDragging is true for
                // by the distance the mouse has moved
                // since the last mousemove
                for (let piece of values) {
                    if (piece === undefined) continue;

                    if (piece.isDragging) {
                        piece.x += dx;
                        piece.y += dy;

                        pieceMoves = piece;
                    }
                }
                // redraw the scene with any updates to the piece positions
                draw();
// TODO: Think of a better way to do this
                // Draws the valid moves for the piece we are moving
                self.drawValid(pieceMoves);

                // reset the starting mouse position for the next mousemove
                startX = mx;
                startY = my;
            }
        } 
    }

/**
 * Takes in the piece we are moving and when placed down will check what tile is closest to the piece so we can adjust where it is placed
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
 * TODO: Look at if this is the correct way to create a new game object as it will call a new game every time we pick up a piece
 * 
 * 
 * 
 * @param {Piece} piece the given piece that we need to draw available moves for on the board
 */
    drawValid(piece) {
        const ctx = canvas.getContext("2d");


        // this.game = new Game();

        let validMoves = new Set();
        validMoves = this.getPossibleMoves(piece);
        // console.log("valid moves: ", validMoves);
        for (let move of validMoves) {
            // ctx.fillStyle = "red";
            // ctx.fillRect(move.screenX, move.screenY, 100, 100);
            ctx.lineWidth = 5;
            ctx.strokeStyle = "green";
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
    // Possibly move this to Move.js
    getPossibleMoves(piece) {

        let moveSet = new Set();

        if (piece.type == "pawn") {

            // moveSet.add(pawnRules(piece));



    //             let tile = piece.tile;
    //             // console.log("current tile: ", tile);
    //             // Using _y here to ensure that we dont change the property as there is no setter it will give an error if the property is changed
    //             if (piece.tile._y == 2) {

    // // TODO: Look at how to make this dynamic and not hard coded with the + 1 and + 2 -> probably going to need maths to find a formula for the moves for each piece 
    //                 for (let i = 0; i < BOARD.length; i++) {
    //                     for (let j = 0; j < BOARD[0].length; j++) {
    //                         if (BOARD[i][j] == tile) {
    //                             moveSet.add(BOARD[i][j + 1]);
    //                             moveSet.add(BOARD[i][j + 2]);
    //                             // console.log("We just added moves: ", moveSet, " for piece: ", piece.p);
    //                         }
    //                     }
    //                 }
    //             }
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
    //  playMove(piece, target) {
    //     let startTile = piece.getTile;

        

    //     console.log("Start tile before any changes: ", piece.tile);

    //     piece._isEmpty = true;; // Set the tile we have moved from to be true

    //     target._isEmpty = false; // Setting the target tile to having a piece on it

    //     piece._tile = target; // Update our piece to be on our new tile

    //      console.log("Target tile after changes: ", target);
    //      console.log("Start tile after changes: ", piece.tile);
    //      console.log("This is our piece we have moved: ", piece);
    //      console.log("to tile: ", piece.tile);

    // }


    run() {
        // this.board.initBoard();
        // this.board.populate();
        // this.movePieceUI();
        this.board.createBoardHash();
        this.board.populateHash();
        this.movePieceUI();
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

const start = new Move();

start.run();



export {Move};