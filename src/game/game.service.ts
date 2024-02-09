import { Injectable } from '@nestjs/common';
import { EngineService } from "../engine/engine.service.js";
import { Fen } from "chess-fen/dist/Fen.js";
import { BoardService } from "../board/board.service.js";

@Injectable()
export class GameService {
  constructor(
    private engineService: EngineService,
    private boardService: BoardService,
  ) {}

  async playGame(params) {
    if (params.mode === 'demo') {
      const gameResult = await this.playDemoGame();
      return gameResult;
    }
    // Handle other game modes as needed
  }

  private async playDemoGame(): Promise<string> {
    //let fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1\n'; // Starting position in FEN
    let fen = new Fen();
    let gameFinished = 0;
    console.log('Game started: ', fen.toString());

    while (gameFinished < 50) {
      if (this.boardService.checkFiftyMoveRule(fen)) return 'Game result: Draw (50 move-rule)'
      // Implement logic to make moves until the game is finished
      const move = await this.engineService.getBestMove(fen.toString(), 5);
      console.log('-----')
      console.log(`Move: ${move}`);
      console.log('-----')
      fen = this.boardService.updateFen(fen, move);
      console.log('[gameService] playDemoGame -> updatedFen: ')
      console.log(fen.toString());
      
      gameFinished = gameFinished + 1;
      console.log('gameFinished value: ', gameFinished)
    }

    return 'Demo game played successfully';
  }


  private isGameFinished(fen: string): boolean {
    // Implement logic to determine if the game is finished based on FEN or Stockfish analysis
    return false; // Placeholder
  }
}
