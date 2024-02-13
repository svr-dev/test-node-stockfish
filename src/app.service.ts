import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { GameService } from './game/game.service.js';
import { DumpService } from './dump/dump.service.js';
import { EngineService } from "./engine/engine.service.js";
import { Sequelize } from 'sequelize-typescript';
import * as process from "process";

@Injectable()
export class AppService implements OnApplicationBootstrap {
  constructor(
    private readonly gameService: GameService,
    private readonly dumpService: DumpService,
    private readonly engineService: EngineService,
    private readonly sequelize: Sequelize, // Inject Sequelize instance
  ) {}

  async onApplicationBootstrap() {
    const playerLevels = this.engineService.getSkillLevels();
    // Info message with timeout to appear after project initialization
      console.log(
        `[AppService] White will play at level "${playerLevels.w.level}" with depth ${playerLevels.w.depth},\n` +
        `[AppService] Black at level "${playerLevels.b.level}" with depth ${playerLevels.b.depth}.`
      );
    console.log('[AppService] Starting game in 3 seconds...');
    await new Promise(resolve => setTimeout(resolve, 3000));

    console.log('[AppService] Starting game now.');
    // Start the game with the desired mode (e.g., 'demo')
    await this.startGame()
  }
  
  private async startGame() {
    const playedGame = await this.gameService.playGame('demo');

    // Log the game result to a file and dump the database
    await this.dumpService.writeGameResultToFile(playedGame);
    await this.dumpService.dumpDatabase();
    
    console.log('[AppService] Game ended. Shutting down.');
    await this.shutdown().then(() =>{
      process.kill(process.pid, 'SIGTERM')
    });
  }

  async shutdown() {
    console.log('[AppService] Terminating Stockfish instances.');
    this.engineService.terminateAllInstances();
    try {
      console.log('[AppService] Closing database connections...');
      await this.sequelize.close().then(() => {
        console.log('[AppService] Database connections closed.');
      });
    } catch (error) {
      console.error('[AppService] Error during cleanup:', error);
    } finally {
      console.log('[AppService] Exiting application...');
    }
  }
}
