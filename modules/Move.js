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
        function draw() {
            // Draw the board
            self.board.drawBoard();

            // redraw each piece in the pieces[] array
            for (var i = 0; i < pieces.length; i++) {
                var piece = pieces[i];

                if (piece.p.image) {
                    ctx.drawImage(piece.p.image, piece.p.x, piece.p.y);
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

            // clear all the dragging flags
            dragok = false;
            for (let i = 0; i < pieces.length; i++) {
                if (pieces[i].isDragging) {
                    pieces[i].isDragging = false;

                    let closest = getClosestTile(pieces[i].p);

                    // pieces[i].x = closest.screenX;
                    // pieces[i].y = closest.screenY;
                    console.log("This is the closest tile: ", closest);

                    console.log("The x coord for the piece: ", pieces[i].p.x, " and the Y coord: ", pieces[i].p.y);
                    if (self.inTile(pieces[i].p)) {
                        // TODO: Some code that places the piece we moved to exactly the middle of the tile


                    }
                }
            }
        }

        function getClosestTile(piece) {

            let curr = BOARD[4][5];
            console.log("current tile = ", curr);
            console.log("piece = ", piece);
            console.log("piece x = ", piece.x);
            
            let diffX = Math.abs(piece.x - curr.screenX);
            let diffY = Math.abs(piece.y - curr.screenY);

            console.log("diffX = ", diffX);
            console.log("diffY = ", diffY);
            console.log("BOARD Length = ", BOARD.length);
            console.log("BOARD Length = ", BOARD[0].length);

            for (let i = 0; i < BOARD.length; i++) {
                for (let j = 0; j < BOARD[0].length; j++) {
                    const tileX = self.tile.screenX;
                    const tileY = self.tile.screenY;

                    let newDiffX = Math.abs(piece.x - BOARD[i][j].screenX);
                    let newDiffY = Math.abs(piece.y - BOARD[i][j].screenY);

                    console.log("newDiffX = ", newDiffX);
                    console.log("current tile = ", BOARD[i][j]);

                    if (newDiffX < diffX) {
                        diffX = newDiffX;
                        curr = BOARD[i][j];
                    }
                    if (newDiffY < diffY) {
                        diffY = newDiffY;
                        curr = BOARD[i][j];
                    }
                    return curr;
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

// TODO: Possibly move this to be just a function rather than a method, 
    inTile(piece) {
        let stringX = piece.x.toString();
        let stringY = piece.y.toString();

        if (stringX.charAt(1) >= 5) {
            return true;
        }
        else {
            return false;
        }
    }



}



export {Move};