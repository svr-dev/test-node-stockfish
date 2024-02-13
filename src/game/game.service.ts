import { Injectable } from '@nestjs/common';
import { EngineService } from '../engine/engine.service.js';
import { Fen } from 'chess-fen/dist/Fen.js';
import { BoardService } from '../board/board.service.js';
import { DbService } from '../db/db.service.js';
import { ICreateGameAttrs } from '../interfaces/interfaces.js';
import { GameMode, GameResult } from '../types/types.js';

@Injectable()
export class GameService {
  private gameId: number | undefined;
  constructor(
    private engineService: EngineService,
    private boardService: BoardService,
    private dbService: DbService,
  ) {}

  async playGame(gameMode: string) {
    if (gameMode === 'demo') {
      return this.playDemoGame();
    }
  }

  private async playDemoGame(): Promise<string> {
    let fen = new Fen();
    const playerSkillLevels = this.engineService.getSkillLevels();
    const gameData: ICreateGameAttrs = {
      game_mode: GameMode.Demo,
      player1_id: 'bot1',
      player1_skill_level: playerSkillLevels.w.level,
      player2_id: 'bot2',
      player2_skill_level: playerSkillLevels.b.level,
    };
    const createdGame = await this.dbService.createGame(gameData);
    this.gameId = createdGame.id;
    let gameResult = null;
    console.log('[GameService] Game started.')
    
    try {
      while (true) {
        const move = await this.engineService.getBestMove(fen.toString());
        if (typeof move === 'string') {
          fen = this.boardService.makeMove(fen, move);
          
          const player = fen.toString().split(' ')[1];
          console.log(`[GameService] ${player === 'w' ? 'White' : 'Black'} move: ${move}`)
          await this.dbService.updateGame(this.gameId, { move: move });
        }

        if (this.boardService.checkFiftyMoveRule(fen)) {
          console.log('Game result: Draw due to 50-move rule.');
          fen.printBoard();
          await this.dbService.updateGame(this.gameId, {
            game_result: GameResult.DrawFiftyMoveRule,
          });
          gameResult = GameResult.DrawFiftyMoveRule
          break;
        }

        if (this.boardService.checkThreefoldRepetition()) {
          console.log('Game result: Draw due to threefold repetition.');
          fen.printBoard();
          await this.dbService.updateGame(this.gameId, {
            game_result: GameResult.DrawThreefoldRepetition,
          });
          gameResult = GameResult.DrawThreefoldRepetition
          break;
        }
      }
    } catch (error) {
      if (error === 'noLegalMoves') {
        const player = fen.toString().split(' ')[1];
        gameResult = player === 'w' ? GameResult.BlackWins : GameResult.WhiteWins
        console.log(
          `Game result: ${gameResult}`,
        );
        fen.printBoard();
        await this.dbService.updateGame(this.gameId, {
          game_result:
            gameResult,
        });
      }
    }

    return gameResult;
  }
}