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
    constructor(x, y, width, height, image, tile, isWhite, type, isDragging) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.image = image;
        this.tile = tile;
        this.isWhite = isWhite;
        this.type = type;
        this.isDragging = isDragging;
    }


    get _tile() {
        return this.tile;
    }

    set _tile(newTile) {
        this.tile = newTile;
    }

    get _isWhite() {
        return this.isWhite;
    }

    set _isWhite(newWhite) {
        this.isWhite = newWhite;
    }

    get _x() {
        return this.x;
    }

    set _x(newX) {
        this.x = newX;
    }

    get _y() {
        return this.y;
    }

    set _y(newY) {
        this.y = newY;
    }

    get _type() {
        return this.type;
    }

    set _type(newType) {
        this.type = newType;
    }

    get _isDragging() {
        return this.isDragging;
    }

    set _isDragging(newDragging) {
        this.isDragging = newDragging;
    }



}

export {Piece, pawn, rook, knight, bishop, queen, king, wR, wN, wB, wK, wQ, wP, bR, bN, bB, bK, bQ, bP};