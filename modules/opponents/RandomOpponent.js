import {Move, getPieceMap, Game} from "../../Move.js";
import {table} from "../Board.js";

class RandomOpponent {
    constructor() {
    }
    // Even though let is used throughout this method variable names are still changed 
    // To be sure that there are no overwrites of data / wrong data being entered

    // TODO: DEAL WITH PAWN PROMOTION
    // TODO: If there is a double pawn at the opposite end of the board and we then take the pawn that is second ie on y=7 or y=2 then both pawns are removed
    static randomOpponent() {
        Move.draw();
        let resolve = false;
        if (Game.whiteToMove) {

            let pieces = getPieceMap(table);
            // Gets white pieces
            for (let [tile, piece] of pieces) {
                if (piece.isWhite != true) {
                    pieces.delete(tile);
                }
            }

            // Solve our check before making any more moves

            if (Game.wCheck) {
                alert("CHECK WHITE");

                let piecesWithResolution = Move.getPiecesWithResolveCheckMoves(true);
                // Use length because its an arry
                let rand = Math.floor(Math.random() * piecesWithResolution.length);

                // Gets a random move from the pieces with a resolution
                let randomPieceWithLegalMoves = piecesWithResolution.at(rand);

                let possibleMoves = Move.getResolveCheckMoves(randomPieceWithLegalMoves);

                // Now get random move as long as it resolves the check
                let possibleMovesArray = Array.from(possibleMoves);

                let randTwo = Math.floor(Math.random() * possibleMoves.size);

                let randomMoveCheck = possibleMovesArray.at(randTwo);


                console.log("PLAYING MOVE FROM", randomPieceWithLegalMoves.tile, "TO TILE", randomMoveCheck);
                console.log("ALL OF THE RESOLUTION MOVES", possibleMoves);


                // Play our random move
                Move.playMove(randomPieceWithLegalMoves, randomPieceWithLegalMoves.tile, randomMoveCheck);

                randomPieceWithLegalMoves.x = randomMoveCheck.screenX;
                randomPieceWithLegalMoves.y = randomMoveCheck.screenY;

                Game.whiteToMove = false;

                resolve = true; // prevents double moves
                
            }
            // Implement pinned piece situation


            if (Game.wCheck == false && resolve == false) {
                let randomNumber = Math.floor(Math.random() * pieces.size);

                // Create an array from the map to pick a random piece
                let mapArray = Array.from(pieces);
            
                let playingPiece = mapArray.at(randomNumber);

                let pieceMoves = Move.getPossibleMoves(playingPiece[1]); // this may not always return a piece with valid moves

                if (pieceMoves.size != 0) {
                    let randomMove = Array.from(pieceMoves);
                
                    let rand = Math.floor(Math.random() * pieceMoves.size);

                    let moveWeArePlaying = randomMove.at(rand);


                    
                    // console.log("------------------------", playingPiece[1]);
                    // console.log("------------------------");

                    
                    console.log("PLAYING MOVE FROM", playingPiece[1].tile, "TO TILE", moveWeArePlaying);
                    console.log("ALL OF THIS PIECES MOVES", pieceMoves);

                    Move.playMove(playingPiece[1], playingPiece[1].tile, moveWeArePlaying);
                    
                    // Update x and y positions
                    playingPiece[1].x = moveWeArePlaying.screenX;
                    playingPiece[1].y = moveWeArePlaying.screenY;

                    // console.log("");
                    // console.log("THIS IS OUR NEW BOARD", table);
                    // console.log("");

                    Game.whiteToMove = false;
                    

                    Move.draw();

                } else {
                    // If we pick a random piece that does not have any legal moves
                    // Call the method again and since it's still whites turn it will try again
                    this.randomOpponent();
                }
            }
            
            
        } else {

            if (Game.bCheck) {
                alert("CHECK BLACK");

                let piecesWithResolutionB = Move.getPiecesWithResolveCheckMoves(false);
                // Length because its an array
                let randB = Math.floor(Math.random() * piecesWithResolutionB.length);

                // Gets a random move from the pieces with a resolution
                let randomPieceWithLegalMovesB = piecesWithResolutionB.at(randB);

                let possibleMovesB = Move.getResolveCheckMoves(randomPieceWithLegalMovesB);

                // Now get random move as long as it resolves the check
                let possibleMovesArrayB = Array.from(possibleMovesB);

                let randTwoB = Math.floor(Math.random() * possibleMovesB.size);

                let randomMoveCheckB = possibleMovesArrayB.at(randTwoB);


                console.log("PLAYING MOVE FROM", randomPieceWithLegalMovesB.tile, "TO TILE", randomMoveCheckB);
                console.log("ALL OF THE RESOLUTION MOVES", possibleMovesB);



                // Play our random move
                Move.playMove(randomPieceWithLegalMovesB, randomPieceWithLegalMovesB.tile, randomMoveCheckB);

                randomPieceWithLegalMovesB.x = randomMoveCheckB.screenX;
                randomPieceWithLegalMovesB.y = randomMoveCheckB.screenY;

                Game.whiteToMove = true;

                resolve = true;

            } 
            if (!Game.bCheck && !resolve) {
                let blackPieces = getPieceMap(table);
                let randomNumber
    
                for (let [tile, piece] of blackPieces) {
                    if (piece.isWhite != false) {
                        blackPieces.delete(tile);
                    }
                }
                randomNumber = Math.floor(Math.random() * blackPieces.size);
    
                let mapArray = Array.from(blackPieces);
    
                let playPiece = mapArray.at(randomNumber);
    
                let pieceMoves = Move.getPossibleMoves(playPiece[1]);
    
                if (pieceMoves.size != 0) {
                    let randomMove = Array.from(pieceMoves);
                    let rand = Math.floor(Math.random() * pieceMoves.size);
                    let moveToPlay = randomMove.at(rand);
    
                    // console.log("------------------------", playPiece[1]);
                    // console.log("------------------------", playPiece[0]);
                    // console.log("------------------------", table);

                    console.log("PLAYING MOVE FROM", playPiece[1].tile, "TO TILE", moveToPlay);
                    console.log("ALL OF THIS PIECES MOVES", pieceMoves);
    
                    Move.playMove(playPiece[1], playPiece[1].tile, moveToPlay);
    
                    
                    playPiece[1].x = moveToPlay.screenX;
                    playPiece[1].y = moveToPlay.screenY;
                    
                    Game.whiteToMove = true;
                    Move.draw();
                } else {
                    this.randomOpponent();
                }
            }
        }
    }
}

export {RandomOpponent};