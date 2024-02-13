import { Injectable } from '@nestjs/common';
import { EngineService } from "../engine/engine.service.js";
import { Fen } from "chess-fen/dist/Fen.js";
import { BoardService } from "../board/board.service.js";
import { GameRequestDTO } from './dto/game-request.dto.js';

@Injectable()
export class GameService {
  constructor(
    private engineService: EngineService,
    private boardService: BoardService,
  ) {}

  async playGame(params: GameRequestDTO) {
    if (params.mode === 'demo') {
      return this.playDemoGame();
    }
  }

  private async playDemoGame(): Promise<string> {
    let fen = new Fen();
    console.log('Game started: ', fen.toString());

    try {
      while (true) {
        console.log('---');
        const move = await this.engineService.getBestMove(fen.toString());
        if (typeof move === 'string') {
          fen = this.boardService.updateFen(fen, move);
          console.log(
            `[GameService] Updated FEN according to best move: ${move}`,
          );
          console.log(fen.toString());
          fen.printBoard();
          console.log('-----');
        }

        if (this.boardService.checkFiftyMoveRule(fen)) {
          console.log('Game result: Draw due to 50-move rule.');
        if (this.boardService.checkThreefoldRepetition()) {
          console.log('Game result: Draw due to threefold repetition.');
          break;
        }
      }
    } catch (error) {
      if (error === 'noLegalMoves') {
        const player = fen.toString().split(' ')[1];
        console.log(`Game finished: ${player === 'w' ? 'Black' : 'White'} delivered mate.`);
      }
    }

    return 'Demo game played successfully.';
  }
}