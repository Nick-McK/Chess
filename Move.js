import {Board, BOARD, canvas, pieces, table, updateTable, FILE, RANK} from "./modules/Board.js";
import {bishop, Piece, wP} from "./modules/Piece.js";
import {Tile} from "./modules/Tile.js";
import {Rules} from "./modules/Rules.js";

import {RandomOpponent} from "./modules/RandomOpponent.js";

let tableCopy = new Map();

class Move {
    constructor() {
        this.board = new Board();
        this.tile = new Tile();
        this.piece = new Piece();
        // this.rules = new Rules();

        this.randomOpponent = new RandomOpponent();

        this.whiteToMove = true;
        this.wCheck = false;
        this.bCheck = false;
        this.MATE = false;
        this.counter = 0;

    }

    static draw() {
        const ctx = canvas.getContext("2d");
        // Draw the board
        Board.drawBoard();
        let pieceMap = getPieceMap(table);
        // redraw each piece in the pieces[] array
        for (let piece of pieceMap.values()) {
            // if the piece has an image then draw it onto the canvas with the piece coords
            
            // console.log("PIECE Y COORD", piece.y);
            if (piece.image) {
                ctx.drawImage(piece.image, piece.x, piece.y);
            }
        }
        
        
    }

    // Moves a piece on the canvas by listening to 3 mouse events: mousedown, mouseup and mousemove
    static movePieceUI() {
        
        // const canvas = document.getElementById("canvas");
        const ctx = canvas.getContext("2d");

        let clientRect = canvas.getBoundingClientRect();
        let offsetX = clientRect.left;
        let offsetY = clientRect.top;
        
        let dragok = false;
        let startX;
        let startY;
        let pieceHeld;

        

        let pieceMoves = new Set();
        
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
            Board.drawBoard();
            let pieceMap = getPieceMap(table);
            // redraw each piece in the pieces[] array
            for (let piece of pieceMap.values()) {
                // if the piece has an image then draw it onto the canvas with the piece coords
                if (piece.image) {
                    ctx.drawImage(piece.image, piece.x, piece.y);
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
                    pieceHeld = piece;

                    
                    // Check the pieces colour, and then pass it to the draw valid method to draw its moves accordingly
                    // If the piece is white then moves are drawn normally
                    // If the piece is black then the moves are drawn inversly

                    

                    // if (self.isPinned(piece)) {
                    //     console.log("PINNING FUCKER");
                    // }


                    Move.drawValid(piece);
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

            let closest;
            // clear all the dragging flags
            dragok = false;

            let pieceMap = getPieceMap(table);

            for (let piece of pieceMap.values()) {
                if (piece.isDragging) {
                    piece.isDragging = false;

                    if (Game.whiteToMove) {
                        if (!piece.isWhite) {
                            piece.x = piece.tile.screenX;
                            piece.y = piece.tile.screenY;
                            draw();
                        }
                    } else {
                        if (piece.isWhite) {
                            piece.x = piece.tile.screenX;
                            piece.y = piece.tile.screenY;
                            draw();
                        }
                    }
                    
                    // Calls to the method getClosestTile which will find the closest tile for the given piece after we have dropped it onto the board
                    closest = Move.getClosestTile(piece);
                    
                    // Sets the new x and y for the piece we have moved
                    piece.x = closest.screenX;
                    piece.y = closest.screenY;
                    
                    // If the piece has moved then draw the piece with the new x and y coords

                    let startTileX = piece.tile.screenX;
                    let startTileY = piece.tile.screenY;

                    let toTile;
                    let targetTileVal;
                    for (let [key, value] of table.entries()) {
                        if (key.screenX == closest.screenX && key.screenY == closest.screenY) {
                            toTile = key;
                            targetTileVal = value;
                        }   
                    }

                    // If the the tile that we drop our piece on is in the possible move list for our piece, then continue with executing a move. If not then move the piece back to the starting tile

                    if ((Move.getPossibleMoves(piece).has(closest))) {

                        console.log("FHSUJDHFKJSDHFKJSDF", Move.isCheck(piece.isWhite))

                        // If we are in check dont let us move until we resolve check
                        if (Move.isCheck(piece.isWhite)) {
                            draw();
                            console.log("WHAT HAVE WE HERE");

                            if (Move.getResolveCheckMoves(piece).size == 0) {
                                console.log("THERE IS A CHECK THAT YOU NEED TO SOLVE!");
                                piece.x = piece.tile.screenX;
                                piece.y = piece.tile.screenY;
                                draw();
                                continue;
                            } else {
                                let resolveMoves = Move.getResolveCheckMoves(piece);
                                let pieceMoves = Move.getPossibleMoves(piece);
                                let playableMoves = new Set();

                                for (let move of resolveMoves) {
                                    for (let m of pieceMoves) {
                                        if (move == m) {
                                            playableMoves.add(move);
                                        }
                                    }
                                }

                                if (playableMoves.has(toTile)) {
                                    Move.playMove(piece, piece.tile, toTile);
                                } else {
                                    console.log("THERE IS A CHECK THAT YOU NEED TO SOLVE!");
                                    piece.x = piece.tile.screenX;
                                    piece.y = piece.tile.screenY;
                                    draw();
                                    continue;
                                }
                                
                            }

                            Move.playMoveSound();
                            // Determines whose turn it is
                            if (Game.whiteToMove) {
                                Game.whiteToMove = false;
                            }else{
                                Game.whiteToMove = true;
                            }
   
                            // piece.x = piece.tile.screenX;
                            // piece.y = piece.tile.screenY;
                            // draw();
                            continue;
                        }

                        let pinnedPieceMap = Move.isPinned(piece)
                        // Keeps track of if we have tried to move the pinned piece to a tile that is not a legal move
                        // WITHOUT THIS WE CAN JUST MOVE A PINNED PIECE AND CHECK OURSELVES
                        let pinnedPieceMove = false;
                        
                        if (Move.isPinned(piece).size == 1) {
                            for (const [key, value] of pinnedPieceMap) {
                                if (key == piece) {
                                    
                                    let possibleMoves = Move.getPossibleMoves(piece);
                                    let legalMoves = Move.isPinned(piece);
                                    let playableMoves = new Set();

                                    // We can move while pinned only if we are capturing the piece that is pinning us
                                    // So, check if we have a possible move that also resolves the pin if we do then those are our playable moves
                                    for (let move of possibleMoves) {
                                        for (let [p,m] of legalMoves) {
                                            console.log("move", move);
                                            if (m == move) {
                                                playableMoves.add(m);
                                            }
                                        }
                                        
                                    }
                                    // If the move is both in the pieces move list
                                    // And the move is legal then we can play it
                                    if (playableMoves.has(toTile)) {
                                        Move.playMove(piece, piece.tile, toTile);
                                        Move.playCaptureSound();
                                        if (Game.whiteToMove) {
                                            Game.whiteToMove = false;
                                        }else{
                                            Game.whiteToMove = true;
                                        }
                                        draw();
                                    } else {
                                        console.log("WE ARE PINNED, CANNOT MOVE PIECE", key, "piece", piece);
                                        piece.x = piece.tile.screenX;
                                        piece.y = piece.tile.screenY;
                                        draw();
                                        pinnedPieceMove = true;
                                        break;
                                    }
                                } else {
                                    // If we are not holding a pinned piece then stop
                                    // Looping through pinned pieces
                                    break;  
                                }
                            }
                        } 
                        // As long as we have not tried to move a pinned piece into a tile that is not a legal move then we can play our move as normal
                        if (!pinnedPieceMove) {
                            draw();
                            console.log("PLAYING THIS HSIT")
                            Move.playMove(piece, piece.tile, toTile);
                            Move.playMoveSound();
                            // Determines whose turn it is
                            if (Game.whiteToMove) {
                                Game.whiteToMove = false;
                            }else{
                                Game.whiteToMove = true;
                            }
                            // If we are moving onto a tile that has a piece on it
                            // Play capturing sounds
                            if (targetTileVal != 0) {                            
                                // If we dont have else draw() then when we capture on blacks turn white needs to move before the piece is removed
                                // If we dont have this if statement then we can capture and then move twice in one turn
                                if (Game.whiteToMove) {
                                    draw();
                                    Move.playCaptureSound();
                                } 
                                else {
                                    draw();
                                    Move.playCaptureSound();
                                }
                            }
                            draw();
                            continue;
                        }
                    } else {
                        piece.x = startTileX;
                        piece.y = startTileY;
                        draw();
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

                // Move the piece we are dragging by the distance the mouse has moved for
                if (pieceHeld.isDragging) {
                    pieceHeld.x += dx;
                    pieceHeld.y += dy;
                }

                // redraw the scene with any updates to the piece positions
                draw();
                // Draws the valid moves for the piece we are moving
                Move.drawValid(pieceHeld);
                Move.drawAttacked(pieceHeld);
                // console.log("PieceHeld: ", pieceHeld);

                // reset the starting mouse position for the next mousemove
                startX = mx;
                startY = my;
            }
        } 
    }

/**
 * Takes in the piece we are moving and when placed down will check what tile 
 * is closest to the piece so we can adjust where it is placed
 * 
 * 
 * @param {Piece} piece the current piece we are moving 
 * @returns the tile that is closest to the piece we are moving
 */
    static getClosestTile(piece) {
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


// TODO: REDO PINNED AND CHECKED VALID MOVES
    static drawValid(piece) {
        const ctx = canvas.getContext("2d");
        let validMoves = new Set();
        validMoves = Move.getPossibleMoves(piece);
        // validMoves = this.findPieceMoves(piece);

        if (Game.bCheck || Game.wCheck) {
            let resolveMoves = Move.getResolveCheckMoves(piece);
            let playableMoves = new Set();

            for (let move of resolveMoves) {
                for (let m of validMoves) {
                    if (move == m) {
                        ctx.lineWidth = 5;
                        ctx.strokeStyle = "black";
                        ctx.strokeRect(move.screenX, move.screenY, 97, 99);
                        playableMoves.add(move);
                    }
                }
            }
        }

        if (Move.isPinned(piece).size == 1) {
            let legalMoves = Move.isPinned(piece);

            for (let [p, move] of legalMoves) {
                if (p != piece) break;
                for (let m of validMoves) {
                    if (m == move) {
                        ctx.lineWidth = 5;
                        ctx.strokeStyle = "black";
                        ctx.strokeRect(move.screenX, move.screenY, 97, 99);
                    }
                }
            }
            return
        }

        

        for (let move of validMoves) {
            ctx.lineWidth = 5;
            ctx.strokeStyle = "black";
            ctx.strokeRect(move.screenX, move.screenY, 97, 99);
        } 
    }


    // Testing function to draw all the tiles that are under attack from both sides
    static drawAttacked(piece) {
        const ctx = canvas.getContext("2d");
        let attackedTiles = new Set();
        attackedTiles = Rules.getAttackedTiles(piece.isWhite);

        
        for (let tiles of attackedTiles) {
              
            if (tiles instanceof Tile) {   
                ctx.fillStyle = "rgba(255, 0, 0, 0.2)";
                ctx.fillRect(tiles.screenX, tiles.screenY, 100,100);
            } else {
                for (let tile of tiles) {
                    ctx.fillStyle = "rgba(255,0,0,0.2)";
                    ctx.fillRect(tile.screenX, tile.screenY, 100,100);
                
                }
            }
        }
    }

    static isPinned(piece) {
        return Rules.getPin(piece);
    }

    static getPinnedMoves(piece) {
        let possibleMoves = Move.getPossibleMoves(piece);
        let legalMoves = new Set();
        let previousTile = piece.tile;
        

        return legalMoves;
    }

    // Gets all the moves that resolve the check

    // When we let go of a piece store the tile we place it on and then get all the tiles from that tile to the king - needs to be called when we set the check to true, or when we let go of a piece in myUp


    // Get the tiles between the last piece held
    static getResolveCheckMoves(piece) {
        let resolveMoves = new Set();
        let possibleMoves = Move.getPossibleMoves(piece);
        let previousTile = piece.tile;

        // console.log("PREVIOSU TILE", previousTile)

        // console.log("OUR LEGALMOVES", possibleMoves, "FOR PIECE", piece);
        // console.log("OUR ATTACKED TILES", attackedTiles);
        
        // console.log("POSSIBLE MOVES", possibleMoves, "FOR PIECE", piece);

        for (let move of possibleMoves) {
            Move.playTestMove(piece, piece.tile, move);
            // console.log("MAKING MOVE", move);
            // console.log("NEW CHECK STATE", Game.wCheck);
            if (!Move.isCheck(piece.isWhite)) {
                console.log("ADDING MOVE");
                resolveMoves.add(move);
            }
            Move.unplayTestMove(piece, move, previousTile)

        }
        return resolveMoves;
    }

    static getResponse(colour) {
        return Rules.getAllMoves(colour)
    }
    
    /**
    @param {Piece} piece a given piece on the chess board that we will return all the possible moves for
    @returns  a set of all possible moves for a given piece

    **/ 
    static getPossibleMoves(piece) {

        let possibleMoves = Rules.getPieceRules(piece);

        // Stops the king from moving into check
        if (piece.type == "king") {
            let attackedTiles = Rules.getAttackedTiles(piece.isWhite);
            for (let move of possibleMoves) {
                for (let tile of attackedTiles) {
                    // If the tile is not in a set in the attackedTiles set then check if its legal
                    if (tile instanceof Tile) {
                        if (move == tile) {
                            possibleMoves.delete(move);
                        }
                    // If the tile is in a set in attacked tiles then loop through the set then check if its legal
                    } else {
                        for (let tileSet of tile) {
                            if (move == tileSet) {
                                possibleMoves.delete(move);
                            }
                        }
                    } 
                }
            }
        }
        // console.log("GETTING POSSIBLE MOVES IN POSSIBLE MOVES", possibleMoves);
        return possibleMoves;
    }

    /** 
     * Plays a move in our array board and updates all the associated values "behind the scenes".
     * 
     * 
     * 
     * @param {Piece} piece the piece we are moving from one tile to another 
     * @param {Tile} fromTile the tile the piece is moving from
     * @param {Tile} toTile the target tile we are moving our piece to
    */
  
     static playMove(piece, fromTile, toTile) {
        
        tableCopy = table; // Make a copy of the table so we can revert the move if we want
        if (!(fromTile == toTile)) {
            fromTile.isEmpty = true;
            
            piece.tile = toTile;
            piece.tile.isEmpty = false;
            // toTile.isEmpty = false;
            let cloneTable = new Map(table).set(toTile, piece) 
                                        .set(fromTile, 0);
            updateTable(cloneTable);
            // console.log("Moved from ", fromTile, " to ", toTile, ". Here is our new map: ", table);
        }
        // This checks to see if we put the other player in check, so we can look for black's check on whites moves
        let attackingTiles = new Set();
        // This lets us check for a check resolution
        let attackedTiles = new Set();
        // By giving this the opposite colour of the piece we are moving, we can get the tiles that we are attacking, so we can check for any checks after a move and before the checked player can make any moves - IMPORTANT
        attackingTiles = Rules.getAttackedTiles(!piece.isWhite);
        // console.log("attacked:" , attackedTiles);

        attackedTiles = Rules.getAttackedTiles(piece.isWhite);

        let pieceMap = getPieceMap(table)
        let wK, bK;
        // Finding the tile the king is on so we can calculate check
        for (let piece of pieceMap.values()) {
            if (piece.type == "king" && piece.isWhite) {
                wK = piece.tile;
            }
            if (piece.type == "king" && !piece.isWhite) {
                bK = piece.tile;
            }
        }


        for (let tile of attackedTiles) {
            // Create a variable that lets us know if we have found a check, if we have then set this to true and break out again
            let broke = false;
            if (tile instanceof Tile) {
                // Checks to see if the tile in the attacked tiles list is the tile the king is on for black and white
                if (tile != wK) {
                    Game.wCheck = false;
                }
                if (tile != bK && Game.bCheck) {
                    
                    Game.bCheck = false;
                }
                // If the king is on these tiles then set the check for that colour to true and break out of the loop, dont need the broke variable since we are in the first loop
                // Need to also check for the piece we are moving as we don't want
                // Blacks attacked tiles to cause the white king to be in check
                // This stops white's pieces from checking it's own king and black's 
                // Checking their own king
                if (!piece.isWhite && tile == bK) {
                    Game.bCheck = true;
                    break;
                }
                if (piece.isWhite && tile == wK) {
                    Game.wCheck = true;
                    break;
                }
            } else {
                for (let t of tile) {
                    
                    if (t != wK) {
                        Game.wCheck = false;         
                    }
                    if (t != bK && Game.bCheck) {
                        
                        Game.bCheck = false;        
                    }
                    // Same as above but use the broke variable to let us know we have found a check and break out of the outer loop
                    // Also uses the same check as above to stop white and black from
                    // Checking their own pieces
                    if (!piece.isWhite && t == bK) {
                        Game.bCheck = true;
                        broke = true;
                        break;
                    }
                    if (piece.isWhite && t == wK) {
                        Game.wCheck = true;
                        broke = true;
                        break;
                    }
                }
            }
            // If we have broke out of the inner loop then break out of the outer loop
            if (broke) {
                break;
            }
        }


        // Used to check if when we move a piece and we are moving into a checking
        // Position we want the opponent to know they are in check without having to
        // Touch any of their pieces
        for (let tile of attackingTiles) {
            if (tile instanceof Tile) {
                // Need to check the piece we are moving as well, if we don't then whites pieces can check white
                if (!piece.isWhite && tile == wK) {
                    console.log("SETTING TRUE");
                    Game.wCheck = true;
                }
                if (piece.isWhite && tile == bK) {
                    Game.bCheck = true;
                }
            } else {
                // This loops through any sets of tiles that may be in our move list
                for (let t of tile) {
                    // Implements the same check as above making sure white cannot
                    // Check its own pieces and black its own pieces
                    if (!piece.isWhite && t == wK) {
                        console.log("SETTING TRUE 2");
                        Game.wCheck = true;
                    }
                    if (piece.isWhite && t == bK) {
                        Game.bCheck = true;
                    } 
                 }
            }    
        }
        // If either colour is in check then we check for a checkmate
        if (Game.wCheck || Game.bCheck) {
            // We want to find the opposite of the colour we have just moved
            // If we move white into a check position on black then we want to check if
            // Black has any moves to resolve the check
            // If there are no moves (size 0) then we have checkmate!

            console.log("WHAT IS OIR PIECE COLOUR", piece.isWhite, "SO OPPOSITE IS", !piece.isWhite)
            if (Move.getCheckMate(!piece.isWhite).size == 0) {
                Game.MATE = true;
                if (Game.wCheck) {
                    alert("BLACK WON");
                }
                if (Game.bCheck) {
                    alert("WHITE WON");
                }
            }
        }

        console.log("black check state:", Game.bCheck);
        console.log("white check state:", Game.wCheck);
        console.log("CHECKMATE:", Game.MATE);
        console.log("");
        // console.log("------------------------------------------------")
        if (piece.isWhite) {
            console.log("BLACK TO MOVE");
        } else {
            console.log("WHITE TO MOVE")
        }
        
    }

    // MAYBE GET RID OF THE TRUE CHECK AS IF WE ARE USING THIS WE ARE ALREADY IN CHECK AND WE CAN ONLY MOVE OUT OF CHECK WE CANNOT DOUBLE CHECK
    static playTestMove(piece, fromTile, toTile) {

        let pieceCopy = Object.assign({}, piece);
        
        tableCopy = new Map(table); // Make a copy of the table so we can revert the move if we want
        if (!(fromTile == toTile)) {
            fromTile.isEmpty = true;
            // console.log("SETTING TESTING TILE TO", toTile);
            pieceCopy.tile = toTile;
            pieceCopy.tile.isEmpty = false;
            let cloneTable = new Map(table).set(toTile, pieceCopy) 
                                        .set(fromTile, 0);
            updateTable(cloneTable);
            // console.log("TESTING FROM ", fromTile, " to ", toTile, ". Here is our new map: ", table);
            // console.log("");
            // console.log("tableCopy", tableCopy);
        }
        // This checks to see if we put the other player in check, so we can look for black's check on whites moves
        let attackingTiles = new Set();
        // This lets us check for a check resolution
        let attackedTiles = new Set();
        // By giving this the opposite colour of the piece we are moving, we can get the tiles that we are attacking, so we can check for any checks after a move and before the checked player can make any moves - IMPORTANT
        attackingTiles = Rules.getAttackedTiles(!pieceCopy.isWhite);
        // console.log("attacked:" , attackedTiles);

        attackedTiles = Rules.getAttackedTiles(pieceCopy.isWhite);

        let pieceMap = getPieceMap(table)
        let wK, bK;
        // Finding the tile the king is on so we can calculate check
        for (let p of pieceMap.values()) {
            if (p.type == "king" && p.isWhite) {
                wK = p.tile;
            }
            if (p.type == "king" && !p.isWhite) {
                bK = p.tile;
            }
        }



        for (let tile of attackedTiles) {
            // Create a variable that lets us know if we have found a check, if we have then set this to true and break out again
            let broke = false;
            if (tile instanceof Tile) {
                // Checks to see if the tile in the attacked tiles list is the tile the king is on for black and white
                if (tile != wK && Game.wCheck) {
                    // console.log("false 1", tile);
                    Game.wCheck = false;
                }
                if (tile != bK && Game.bCheck) {
                    // console.log("false 1", tile);
                    Game.bCheck = false;
                }
                // If the king is on these tiles then set the check for that colour to true and break out of the loop, dont need the broke variable since we are in the first loop
                if (!pieceCopy.isWhite && tile == bK) {
                    Game.bCheck = true;
                    break;
                }
                if (pieceCopy.isWhite && tile == wK) {
                    Game.wCheck = true;
                    break;
                }
            } else {
                for (let t of tile) {
                    
                    if (t != wK && Game.wCheck) {
                        // console.log("false 2");
                        Game.wCheck = false;         
                    }
                    if (t != bK && Game.bCheck) {
                        // console.log("false 2");
                        Game.bCheck = false;        
                    }
                    // Same as above but use the broke variable to let us know we have found a check and break out of the outer loop
                    if (!pieceCopy.isWhite && t == bK) {
                        Game.bCheck = true;
                        broke = true;
                        break;
                    }
                    if (pieceCopy.isWhite && t == wK) {
                        Game.wCheck = true;
                        broke = true;
                        break;
                    }
                }
            }
            // If we have broke out of the inner loop then break out of the outer loop
            if (broke) {
                break;
            }
        }
        // Dont even know if this is used anymore
        for (let tile of attackingTiles) {
            
            if (tile instanceof Tile) {
                if (!pieceCopy.isWhite && tile == wK) {
                    Game.wCheck = true;
                }
                if (pieceCopy.isWhite && tile == bK) {
                    Game.bCheck = true;
                }
            } else {
                // This loops through any sets of tiles that may be in our move list
                for (let t of tile) {
                    if (!pieceCopy.isWhite && t == wK) {
                        Game.wCheck = true; 
                    }
                    if (pieceCopy.isWhite && t == bK) {
                        Game.bCheck = true;
                    } 
                 }
            }    
        }

        console.log("testing black check state:", Game.bCheck);
        console.log("testing white check state:", Game.wCheck);
    }

    // Method that will let us undo a move which helps us look for checks
    static unplayTestMove(piece, fromTile, toTile) {

        let pieceCopy = Object.assign({}, piece);

        if (!(fromTile == toTile)) {
            fromTile.isEmpty = true;
            pieceCopy.tile = toTile;
            pieceCopy.tile.isEmpty = false;
            

            updateTable(tableCopy);
            console.log("table reverted");
            
        }

        let attackingTiles = new Set();
        let attackedTiles = new Set();

        attackingTiles = Rules.getAttackedTiles(!piece.isWhite);
        // console.log("attacked:" , attackedTiles);

        attackedTiles = Rules.getAttackedTiles(piece.isWhite);

        let pieceMap = getPieceMap(table)
        let wK, bK;
        // Finding the tile the king is on so we can calculate check
        for (let piece of pieceMap.values()) {
            if (piece.type == "king" && piece.isWhite) {
                wK = piece.tile;
            }
            if (piece.type == "king" && !piece.isWhite) {
                bK = piece.tile;
            }
        }

        for (let tile of attackedTiles) {
            // Create a variable that lets us know if we have found a check, if we have then set this to true and break out again
            let broke = false;
            if (tile instanceof Tile) {
                // Checks to see if the tile in the attacked tiles list is the tile the king is on for black and white
                if (tile != wK && Game.wCheck) {
                    console.log("FALSE 1");
                    Game.wCheck = false;
                }
                if (tile != bK && Game.bCheck) {
                    Game.bCheck = false;
                }
                // If the king is on these tiles then set the check for that colour to true and break out of the loop, dont need the broke variable since we are in the first loop
                if (tile == bK) {
                    Game.bCheck = true;
                    break;
                }
                if (tile == wK) {
                    Game.wCheck = true;
                    break;
                }
            } else {
                for (let t of tile) {
                    
                    if (t != wK && Game.wCheck) {
                        console.log("FALSE 2");
                        Game.wCheck = false;         
                    }
                    if (t != bK) {
                        Game.bCheck = false;        
                    }
                    // Same as above but use the broke variable to let us know we have found a check and break out of the outer loop
                    if (t == bK) {
                        Game.bCheck = true;
                        broke = true;
                        break;
                    }
                    if (t == wK && !Game.wCheck) {
                        Game.wCheck = true;
                        broke = true;
                        break;
                    }
                }
            }
            // If we have broke out of the inner loop then break out of the outer loop
            if (broke) {
                break;
            }
        }

        // This is needed as if we click on a white piece when its blacks turn it will try play resolve moves, and uncheck black
        for (let tile of attackingTiles) {
            if (tile instanceof Tile) {
                if (tile == wK && !piece.isWhite) {
                    Game.wCheck = true;
                }
                if (tile == bK && piece.isWhite) {
                    Game.bCheck = true;
                }
                // if (tile != wK && Game.wCheck) {
                //     console.log("FALSE 3");
                //     Game.wCheck = false;
                // }
                // if (tile != bK && Game.bCheck) {
                //     Game.bCheck = false;
                // }
            } else {
                // This loops through any sets of tiles that may be in our move list
                for (let t of tile) {
                    if (t == wK && !piece.isWhite) {
                        Game.wCheck = true;       
                    }
                    if (t == bK && piece.isWhite) {
                        Game.bCheck = true;        
                    }
                    if (tile != wK && !piece.isWhite) {
                        console.log("FALSE 4");
                        Game.wCheck = false;
                    }
                    if (tile != bK && piece.isWhite) {
                        Game.bCheck = false;
                    } 
                 }
            }    
        }

        console.log("reverting black check state to:", Game.bCheck);
        console.log("reverting white check state to:", Game.wCheck);
    }

    static getCheckMate(colour) {
        let resolveMoves = Move.getAllResolveCheckMoves(colour)

        // console.log("RESOLVING MOVES", resolveMoves, "FOR COLOUR", colour);

        return resolveMoves;
    }

    static getAllResolveCheckMoves(colour) {
        let allMoves = new Set();


        for (let value of table.values()) {
            if (value == 0) continue;

            // console.log("VALUE", value, "value colour", value.isWhite,"colour we are checking", colour);
            if (value.isWhite == colour) {
                let getMoves = Move.getResolveCheckMoves(value);
                getMoves.forEach(move => allMoves.add(move));
            }
        }
        // console.log("HDSFJKHSDFJKHSDFJHSDF", allMoves);
        return allMoves;
    }

    static isCheck(colour) {
        if (colour) {
            return Game.wCheck;
        } else {
            return Game.bCheck;
        }
    }

    // randomOpponent() {
    //     this.draw();
    //     if (this.whiteToMove) {
    //         let randomNumber;

    //         let pieces = getPieceMap(table);
    //         // Gets white pieces
    //         for (let [tile, piece] of pieces) {
    //             if (piece.isWhite != true) {
    //                 pieces.delete(tile);
    //             }
    //         }

    //         randomNumber = Math.floor(Math.random() * pieces.size);

    //         // Create an array from the map to pick a random piece
    //         let mapArray = Array.from(pieces);
        
    //         let playingPiece = mapArray.at(randomNumber);

    //         let pieceMoves = this.getPossibleMoves(playingPiece[1]); // this may not always return a piece with valid moves

    //         if (pieceMoves.size != 0) {
    //             let randomMove = Array.from(pieceMoves);
            
    //             let rand = Math.floor(Math.random() * pieceMoves.size);

    //             let moveWeArePlaying = randomMove.at(rand);


    //             // playingMove[1] will always be our tile

    //             // console.log("PLAYING PEICE", playingPiece[1]);
    //             // console.log("PLAYING PEICE TILE", playingPiece[1].tile);
    //             // console.log("MOVE WE ARE PLAYING", moveWeArePlaying);
                
    //             console.log("------------------------", playingPiece[1]);
    //             console.log("------------------------")

    //             this.playMove(playingPiece[1], playingPiece[1].tile, moveWeArePlaying);
                
    //             // Update x and y positions
    //             playingPiece[1].x = moveWeArePlaying.screenX;
    //             playingPiece[1].y = moveWeArePlaying.screenY;

    //             // console.log("");
    //             // console.log("THIS IS OUR NEW BOARD", table);
    //             // console.log("");

    //             this.whiteToMove = false;
                

    //             this.draw();

    //         } else {
    //             // If we pick a random piece that does not have any legal moves
    //             // Call the method again and since it's still whites turn it will try again
    //             this.randomOpponent();
    //         }
            
    //     } else {
    //         let blackPieces = getPieceMap(table);
    //         let randomNumber

    //         for (let [tile, piece] of blackPieces) {
    //             if (piece.isWhite != false) {
    //                 blackPieces.delete(tile);
    //             }
    //         }
    //         randomNumber = Math.floor(Math.random() * blackPieces.size);

    //         let mapArray = Array.from(blackPieces);
    //         let playingPiece = mapArray.at(randomNumber);
    //         let pieceMoves = this.getPossibleMoves(playingPiece[1]);

    //         if (pieceMoves.size != 0) {
    //             let randomMove = Array.from(pieceMoves);
    //             let rand = Math.floor(Math.random() * pieceMoves.size);
    //             let moveWeArePlaying = randomMove.at(rand);

    //             console.log("------------------------", playingPiece[1]);
    //             console.log("------------------------")

    //             this.playMove(playingPiece[1], playingPiece[1].tile, moveWeArePlaying);

    //             playingPiece[1].x = moveWeArePlaying.screenX;
    //             playingPiece[1].y = moveWeArePlaying.screenY;
                
    //             this.whiteToMove = true;
    //             this.draw();
    //         } else {
    //             this.randomOpponent();
    //         }
    //     }
    // }

    run() {
        // this.board.initBoard();
        // this.board.populate();
        // this.movePieceUI();
        // this.board.initialDraw();
        // this.board.drawBoard();
        Board.createBoardHash();
        Board.populateHash();

        Move.movePieceUI();
        getPieceMap(table);

        let self = this; // needed as we use a function to loop until we have checkmate

        // console.log("WHITE TO MOVE OR SOMETIHNNG", this.whiteToMove)

        // RandomOpponent.randomOpponent();
        // let interval = setInterval(function() { 
            
        // if (self.MATE == false) { 
        //     RandomOpponent.randomOpponent();
        // } else { 
        //     alert("STOP");
        //     clearInterval(interval);
        // }
        // }, 100);
        
    }

    static playMoveSound() {
        let audio = new Audio("../assets/move.mp3");
        return audio.play();
    }

    static playCaptureSound() {
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
 * @returns a map containing only all pieces on the table
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




const Game = new Move();

console.log("WHITE TO MOVE", Game.wCheck);

Game.run();

export {Move, getPieceMap, Game};