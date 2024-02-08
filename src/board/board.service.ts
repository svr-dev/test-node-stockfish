import { Injectable } from '@nestjs/common';
import { FenArgs, BoardContent, CastlingRights } from 'chess-fen';
import { Fen } from "chess-fen/dist/Fen.js";

@Injectable()
export class BoardService {
  updateFen(currentFen: Fen, move: string): Fen {
    const sourceSquare = move.substring(0, 2);
    const destinationSquare = move.substring(2, 4);
    const movingPiece = currentFen.get(sourceSquare);

    if (!movingPiece) {
      console.error(`No piece at source square: ${sourceSquare}`);
      return currentFen; // Early return to prevent updates for invalid moves
    }

    let updatedFen = currentFen.clear(sourceSquare).update(destinationSquare, movingPiece);
    let castlingRights = this.updateCastlingRights(currentFen.castlingRights, movingPiece, sourceSquare, destinationSquare, updatedFen);

    const fenArgs: FenArgs = {
      board: updatedFen.board,
      toMove: this.toggleToMove(currentFen.toMove),
      castlingRights: castlingRights,
      enPassantSquare: this.determineEnPassantSquare(destinationSquare, movingPiece),
      halfMoves: this.calculateHalfMoves(updatedFen, destinationSquare, movingPiece),
      fullMoves: currentFen.toMove === 'black' ? currentFen.fullMoves + 1 : currentFen.fullMoves,
    };

    return new Fen(fenArgs);
  }

  private updateCastlingRights(castlingRights: CastlingRights, movingPiece: BoardContent, sourceSquare: string, destinationSquare: string, fen: Fen): CastlingRights {
    if (movingPiece.toUpperCase() === 'K') {
      // If the king moves, remove all castling rights for that color
      const color = movingPiece === 'K' ? 'white' : 'black';
      castlingRights[color] = { queenside: false, kingside: false };
    } else if (movingPiece.toUpperCase() === 'R' && ['a1', 'h1', 'a8', 'h8'].includes(sourceSquare)) {
      // If a rook moves from its initial position, update castling rights
      if (sourceSquare === 'a1' || sourceSquare === 'h1') {
        castlingRights.white[sourceSquare === 'a1' ? 'queenside' : 'kingside'] = false;
      } else {
        castlingRights.black[sourceSquare === 'a8' ? 'queenside' : 'kingside'] = false;
      }
    }

    // Check if the move captures a rook on its initial position
    const capturedPiece = fen.get(destinationSquare);
    if (capturedPiece && capturedPiece.toUpperCase() === 'R' && ['a1', 'h1', 'a8', 'h8'].includes(destinationSquare)) {
      if (destinationSquare === 'a1' || destinationSquare === 'h1') {
        castlingRights.white[destinationSquare === 'a1' ? 'queenside' : 'kingside'] = false;
      } else {
        castlingRights.black[destinationSquare === 'a8' ? 'queenside' : 'kingside'] = false;
      }
    }

    return castlingRights;
  }

  private toggleToMove(currentTurn: 'white' | 'black'): 'white' | 'black' {
    return currentTurn === 'white' ? 'black' : 'white';
  }

  private determineEnPassantSquare(destinationSquare: string, movingPiece: BoardContent): string {
    // Placeholder logic for determining the en passant target square
    return '-';
  }

  private calculateHalfMoves(fen: Fen, destinationSquare: string, movingPiece: BoardContent): number {
    // Placeholder logic to calculate half moves based on pawn moves and captures
    return 0;
  }
}
