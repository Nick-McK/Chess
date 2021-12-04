import {Tile} from "./Tile.js";

const pawn = "pawn",
      rook = "rook",
      knight = "knight",
      bishop = "bishop",
      queen = "queen",
      king = "king";



const wR = new Image(),
      wN = new Image(),
      wB = new Image(),
      wK = new Image(),
      wQ = new Image(),
      wP = new Image(),

      bR = new Image(),
      bN = new Image(),
      bB = new Image(),
      bK = new Image(),
      bQ = new Image(),
      bP = new Image();

wR.src = "../assets/wRook.svg",
wN.src = "../assets/wKnight.svg",
wB.src = "../assets/wBishop.svg",
wQ.src = "../assets/wQueen.svg",
wK.src = "../assets/wKing.svg",
wP.src = "../assets/wPawn.svg",

bR.src = "../assets/bRook.svg",
bN.src = "../assets/bKnight.svg",
bB.src = "../assets/bBishop.svg",
bQ.src = "../assets/bQueen.svg",
bK.src = "../assets/bKing.svg",
bP.src = "../assets/bPawn.svg";


class Piece {
    constructor(x, y, width, height, image, tile, isWhite, type) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.image = image;
        this.tile = tile;
        this.isWhite = isWhite;
        this.type = type;
    }

    getX() {
        return this.x;
    }

    getY() {
        return this.y;
    }

    // returns the tile that the piece is on
    getTile() {
        return this.tile;
    }

    getColour() {
        return this.isWhite;
    }

    getType() {
        return this.type;
    }

}

export {Piece, pawn, rook, knight, bishop, queen, king, wR, wN, wB, wK, wQ, wP, bR, bN, bB, bK, bQ, bP};