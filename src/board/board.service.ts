import { Injectable } from '@nestjs/common';
import { FenArgs, BoardContent, CastlingRights, BOARD_CONTENT } from 'chess-fen';
import { Fen } from 'chess-fen/dist/Fen.js';
import { MoveType } from "../types/types.js";

@Injectable()
export class BoardService {
  private positionsHistory: Map<string, number> = new Map();
  private readonly initialRookPositions = ['a1', 'h1', 'a8', 'h8'];
  private readonly kingCastleMoves = {
    'e1g1': { kingTo: 'g1', rookFrom: 'h1', rookTo: 'f1' },
    'e1c1': { kingTo: 'c1', rookFrom: 'a1', rookTo: 'd1' },
    'e8g8': { kingTo: 'g8', rookFrom: 'h8', rookTo: 'f8' },
    'e8c8': { kingTo: 'c8', rookFrom: 'a8', rookTo: 'd8' }
  };

  makeMove(currentFen: Fen, move: string): Fen {
    const sourceSquare = move.substring(0, 2);
    const destinationSquare = move.substring(2, 4);
    const movingPiece = currentFen.get(sourceSquare);

    if (!movingPiece) {
      console.error(`No piece at source square: ${sourceSquare}`);
      return currentFen; // Early return to prevent updates for invalid moves
    }
    
    const moveType: MoveType = this.setMoveType(move, movingPiece, currentFen, sourceSquare, destinationSquare);
    
    const updatedFen = this.updateFen(currentFen, move, movingPiece, moveType, sourceSquare, destinationSquare);
    // Update position history for threefold repetition detection later
    this.updatePositionHistory(updatedFen.toString());
    
    return updatedFen
  }

  private setMoveType(move: string,
                        movingPiece: BoardContent,
                        currentFen: Fen,
                        sourceSquare: string,
                        destinationSquare: string): MoveType {
    if (movingPiece.toUpperCase() === 'P' && move.length === 5) {
      console.log('[PROMOTION]')
      return 'promotion';
    }
    else if (movingPiece.toUpperCase() === 'P' && Math.abs(parseInt(sourceSquare[1]) - parseInt(destinationSquare[1])) === 2) {
      console.log('[DOUBLE_PAWN_PUSH]')
      return 'double_pawn_push';
    }
    else if (movingPiece.toUpperCase() === 'P' && destinationSquare === currentFen.enPassantSquare) {
      console.log('[EN_PASSANT]')
      return 'en_passant';
    }
    else if (Object.keys(this.kingCastleMoves).includes(move) && ['K', 'k'].includes(movingPiece)) {
      console.log('[CASTLE]')
      return 'castling';
    }
    else if (currentFen.isOccupied(destinationSquare)) {
      console.log('[CAPTURE]')
      return 'capture';
    }
    console.log('[REGULAR]')
    return 'regular';
  }

  private makeMove(currentFen: Fen,
                   move: string,
                   movingPiece: BoardContent,
                   moveType: MoveType,
                   sourceSquare: string,
                   destinationSquare: string): Fen {
    
    let updatedFen: Fen = currentFen;
    switch (moveType) {
      case 'regular':
      case 'double_pawn_push':
      case 'capture':
        updatedFen = currentFen
          .clear(sourceSquare)
          .update(destinationSquare, movingPiece);
        break;

      case 'en_passant':
        updatedFen = currentFen
          .clear(sourceSquare)
          .update(destinationSquare, movingPiece)
          // Remove the captured pawn
          .clear(
            this.getEnPassantCaptureSquare(
              destinationSquare,
              currentFen.toMove,
            ),
          );
        break;

      case 'castling':
        const { kingTo, rookFrom, rookTo } = this.kingCastleMoves[move];
        updatedFen = currentFen
          .clear(sourceSquare)
          .clear(rookFrom)
          .update(kingTo, movingPiece)
          .update(rookTo, currentFen.get(rookFrom));
        break;
        
      case 'promotion':
        const promotionPiece = BOARD_CONTENT[move.charAt(move.length - 1)]
        updatedFen = currentFen
          .clear(sourceSquare)
          .update(destinationSquare, promotionPiece);
    }

    // Update castling rights and other FenArgs based on the move
    const fenArgs: FenArgs = {
      board: updatedFen.board,
      toMove: this.toggleToMove(currentFen.toMove),
      castlingRights: this.updateCastlingRights(
        currentFen.castlingRights,
        movingPiece, sourceSquare,
        destinationSquare, updatedFen
      ),
      enPassantSquare: moveType === 'double_pawn_push' ? this.setEnPassantSquare(sourceSquare, destinationSquare) : '-',
      halfMoves: this.calculateHalfMoves(currentFen.halfMoves, movingPiece, moveType),
      fullMoves: currentFen.toMove === 'black' ? currentFen.fullMoves + 1 : currentFen.fullMoves,
    };

    return new Fen(fenArgs);
  }
  
  private updateCastlingRights(
    castlingRights: CastlingRights,
    movingPiece: BoardContent,
    sourceSquare: string,
    destinationSquare: string,
    fen: Fen): CastlingRights {
    if (movingPiece.toUpperCase() === 'K') {
      // If the king moves, remove all castling rights for that color
      const color = movingPiece === 'K' ? 'white' : 'black';
      castlingRights[color] = { queenside: false, kingside: false };
    } else if (movingPiece.toUpperCase() === 'R' && this.initialRookPositions.includes(sourceSquare)) {
      // If a rook moves from its initial position, update castling rights
      if (sourceSquare === 'a1' || sourceSquare === 'h1') {
        castlingRights.white[sourceSquare === 'a1' ? 'queenside' : 'kingside'] = false;
      } else {
        castlingRights.black[sourceSquare === 'a8' ? 'queenside' : 'kingside'] = false;
      }
    }

    // Check if the move captures a rook on its initial position
    const capturedPiece = fen.get(destinationSquare);
    if (capturedPiece && capturedPiece.toUpperCase() === 'R' && this.initialRookPositions.includes(destinationSquare)) {
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

  private getEnPassantCaptureSquare(destinationSquare: string, color: 'white' | 'black'): string {
    // Determine the direction of the capture based on the pawn's color
    // Pawns move up (from a lower to a higher rank) for white, and down for black.
    const direction = color === 'black' ? 1 : -1;

    // The rank of the captured pawn is one rank away from the destination square towards the source square
    const capturedRank = parseInt(destinationSquare[1]) - direction;
    const capturedFile = destinationSquare[0];

    // Construct the square notation of the captured pawn
    return `${capturedFile}${capturedRank}`;
  }


  private setEnPassantSquare(sourceSquare: string, destinationSquare: string): string {
    // Calculate the rank of the en passant target square
    const enPassantRank = (parseInt(sourceSquare[1]) + parseInt(destinationSquare[1])) / 2;
    // The file of the en passant target square is the same as the source and destination squares
    const enPassantFile = sourceSquare[0];
    // Construct the en passant target square notation
    return `${enPassantFile}${enPassantRank}`;
  }

  private calculateHalfMoves(halfMovesCount: number, movingPiece: BoardContent, moveType: MoveType): number {
    if (movingPiece.toUpperCase() === 'P' || moveType === 'capture') return 0;
    return halfMovesCount + 1;
  }

  checkFiftyMoveRule(currentFen: Fen): boolean {
    return currentFen.halfMoves >= 100;
  }

  checkThreefoldRepetition(): boolean {
    for (const [, count] of this.positionsHistory) {
      if (count >= 3) {
        return true;
      }
    }
    return false;
  }

  private updatePositionHistory(fenString: string): void {
    // Cut out moves/half moves
    const normalizedFen = fenString.split(' ').slice(0, -2).join(' ');
    // Determine the count of position repeats
    const currentCount = (this.positionsHistory.get(normalizedFen) || 0) + 1;

    this.positionsHistory.set(normalizedFen, currentCount);
  }
}
