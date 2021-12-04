import {Board, BOARD, canvas, pieces} from "./board.js";
import {Piece, wP} from "./Piece.js";
import {Tile} from "./Tile.js";



class Move {
    constructor() {
        this.board = new Board();
        this.tile = new Tile();
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
                if (piece.p.x != newX && piece.p.image || piece.p.y != newY && piece.p.image) {
                    ctx.drawImage(piece.p.image, piece.p.x, piece.p.y);
                }
                // If the piece has moved and has an image then we draw it onto the canvas with the NEW coords which are set to the centre of the closest tile
                else if (piece.p.image && piece.p.x == newX || piece.p.image && piece.p.y == newY) {
                    ctx.drawImage(piece.p.image, newX, newY);
                }
            }
        }

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
                if (mx > piece.p.x && mx < piece.p.x + piece.p.width && my > piece.p.y && my < piece.p.y + piece.p.height) {
                    // if yes, set that pieces isDragging=true
                    dragok = true;
                    piece.isDragging = true;
                    console.log("The x coord for the piece: ", piece.p.x, " and the Y coord: ", piece.p.y);
                }
            }
            // save the current mouse position
            startX = mx;
            startY = my;
        }


        // handle mouseup events
        function myUp(e) {  
            // tell the browser we're handling this mouse event
            e.preventDefault();
            e.stopPropagation();

            let closest;

            // clear all the dragging flags
            dragok = false;
            for (let i = 0; i < pieces.length; i++) {
                if (pieces[i].isDragging) {
                    pieces[i].isDragging = false;

                    // Calls to the method getClosestTile which will find the closest tile for the given piece
                    closest = self.getClosestTile(pieces[i].p);
                    
                    // Saves the x and y for the piece we have moved
                    const oldX = pieces[i].p.x;
                    const oldY = pieces[i].p.y;
                    // Sets the new x and y for the piece we have moved
                    pieces[i].p.x = closest.screenX;
                    pieces[i].p.y = closest.screenY;
                    // If the piece has moved then draw the piece with the new x and y coords
                    if (pieces[i].p.x != oldX || pieces[i].p.y != oldY) {
                        draw(pieces[i].p.x, pieces[i].p.y);     
                    }
                    console.log("This is the end X coord: ", pieces[i].p.x, " and the end Y coord: ", pieces[i].p.y);
                }
            }
        }

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

                // move each rect that isDragging 
                // by the distance the mouse has moved
                // since the last mousemove
                for (let i = 0; i < pieces.length; i++) {
                    let piece = pieces[i];
                    if (piece.isDragging) {
                        piece.p.x += dx;
                        piece.p.y += dy;  
                    }
                }

                // redraw the scene with any updates to the piece positions
                draw();

                // reset the starting mouse position for the next mousemove
                startX = mx;
                startY = my;
            }
        } 
    }

// Finds the closest tile for a given piece
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



}



export {Move};