import {Board, BOARD, canvas, pieces} from "./board.js";
import {bishop, Piece, wP} from "./Piece.js";
import {Tile} from "./Tile.js";
import {Game} from "../Game.js";



class Move {
    constructor() {
        this.board = new Board();
        this.tile = new Tile();
        this.piece = new Piece();
        // this.game = new Game();
    }

    // Moves a piece on the canvas by listening to 3 mouse events: mousedown, mouseup and mousemove
    movePieceUI() {
        
        canvas.onmousedown = myDown;
        canvas.onmouseup = myUp;
        canvas.onmousemove = myMove;



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

            // redraw each piece in the pieces[] array
            for (let i = 0; i < pieces.length; i++) {
                let piece = pieces[i];
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
            for (let i = 0; i < pieces.length; i++) {
                let piece = pieces[i];
                // If the mouse is inside the piece when we click then set dragging properties to be true
                if (mx > piece.x && mx < piece.x + piece.width && my > piece.y && my < piece.y + piece.height) {
                    // if yes, set that pieces isDragging=true
                    dragok = true;
                    piece.isDragging = true;
                    console.log("The x coord for the piece: ", piece.x, " and the Y coord: ", piece.y);

                    let pieceType = piece._type;
                    let pieceColour = piece._isWhite;
                    console.log("I am a: ", pieceColour, " ", pieceType);

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

            this.game = new Game();

            let closest;

            // clear all the dragging flags
            dragok = false;
            for (let i = 0; i < pieces.length; i++) {
                if (pieces[i].isDragging) {
                    pieces[i].isDragging = false;

                    // Calls to the method getClosestTile which will find the closest tile for the given piece
                    closest = self.getClosestTile(pieces[i]);
                    
                    // Saves the x and y for the piece we have moved
                    const oldX = pieces[i].x;
                    const oldY = pieces[i].y;
                    // Sets the new x and y for the piece we have moved
                    pieces[i].x = closest.screenX;
                    pieces[i].y = closest.screenY;
                    // If the piece has moved then draw the piece with the new x and y coords
                    if (pieces[i].x != oldX || pieces[i].y != oldY) {
                        draw(pieces[i].x, pieces[i].y);
                        self.playMoveSound();   

                        let target;
                        for (let f of BOARD) {
                            target = f.filter(t => {return t.screenX == closest.screenX && t.screenY == closest.screenY})
                            // console.log("This is the target, ", target);
                        }
                        this.game.playMove(pieces[i], target);






                        // // Loop through each element of our boards FILE and RANK 
                        // for (let file of BOARD) {
                        //     for (let rank of file) {
                        //         // If the current tile is the same as the tile we have placed our piece on then set our target piece to be the current tile
                        //         if (rank.screenX == closest.screenX && rank.screenY == closest.screenY) {
                        //             this.game.playMove(pieces[i], rank);
                        //             // console.log("this is our target tile: ", target);
                        //         }
                        //     }
                        // }
                        
                    }
                    // console.log("This is the end X coord: ", pieces[i].x, " and the end Y coord: ", pieces[i].y);
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

                // move each piece that isDragging is true for
                // by the distance the mouse has moved
                // since the last mousemove
                for (let i = 0; i < pieces.length; i++) {
                    let piece = pieces[i];
                    if (piece.isDragging) {
                        piece.x += dx;
                        piece.y += dy;

                        pieceMoves = piece;


                    }
                }
                // redraw the scene with any updates to the piece positions
                draw();
// TODO: Think of a better way to do this
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

                

        for (let i = 0; i < BOARD.length; i++) {
            for (let j = 0; j < BOARD[0].length; j++) {

                let diffX = Math.abs(piece.x - BOARD[i][j].screenX);
                let diffY = Math.abs(piece.y - BOARD[i][j].screenY);

                // console.log("newDiffX = ", newDiffX);
                // console.log("current tile = ", BOARD[i][j]);

                if (diffX <= 50 && diffY <= 50) {
                    // console.log("We need to be on FILE: ", BOARD[i][j].x);
                    // console.log("We need to be on RANK: ", BOARD[i][j].y);
                    return BOARD[i][j];
                }
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


        this.game = new Game();

        let validMoves = new Set();
        validMoves = this.game.getPossibleMoves(piece);
        // console.log("valid moves: ", validMoves);
        for (let move of validMoves) {
            // ctx.fillStyle = "red";
            // ctx.fillRect(move.screenX, move.screenY, 100, 100);
            ctx.lineWidth = 5;
            ctx.strokeStyle = "green";
            ctx.strokeRect(move.screenX, move.screenY, 100, 100);
           
            
        }
        
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



export {Move};