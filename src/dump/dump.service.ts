import { Injectable } from '@nestjs/common';
import { InjectModel } from "@nestjs/sequelize";
import { GameLogModel } from "../db/game_log.model.js";
import { writeFile } from 'fs/promises';
import * as fs from 'fs/promises';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import { fileURLToPath } from 'url';
import { IPlayedGame } from "../interfaces/interfaces.js";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const execAsync = promisify(exec);

@Injectable()
export class DumpService {
  constructor(
    @InjectModel(GameLogModel) private gameLogsRepository: typeof GameLogModel,
  ) {}

  async writeGameResultToFile(playedGame: IPlayedGame) {
    const logsDir = path.join(__dirname, '..', 'logs');

    try {
      await fs.mkdir(logsDir, { recursive: true });
      const game = await this.gameLogsRepository.findByPk(playedGame.id);
      if (!game) {
        console.error('Game not found');
        return;
      }
      const gameLog = this.createLogFile(game);
      const timestamp = this.getFormattedTimestamp();
      const fileName = `game_${game.id}_${timestamp}.txt`;
      const filePath = path.join(logsDir, fileName);

      await writeFile(filePath, gameLog);
      console.log(`[DumpService] Game result written to ${filePath}`);
    } catch (err) {
      console.error('Error writing game result to file:', err);
    }
  }

  private createLogFile(game: GameLogModel) {
    let log = `Game ID: ${game.id}\n`;
    log += `Game Mode: ${game.game_mode}\n`;
    log += `Player 1 ID: ${game.player1_id} (Skill Level: ${game.player1_skill_level})\n`;
    log += `Player 2 ID: ${game.player2_id} (Skill Level: ${game.player2_skill_level})\n`;
    log += `Game Result: ${game.game_result}\n`;
    log += `Moves History:\n`;

    const formattedMoves = game.moves
      .map((move, index) => {
        const moveNum = Math.floor(index / 2) + 1;
        return index % 2 === 0 ? `${moveNum}. ${move}` : `${move}`;
      })
      .join(' ');

    log += formattedMoves;

    return log;
  }

  async dumpDatabase() {
    const dumpDir = path.join(__dirname, '..', 'postgres_dumps');
    const timestamp = this.getFormattedTimestamp();
    const dumpFileName = `dump_${timestamp}.sql`;
    const dumpFilePath = path.join(dumpDir, dumpFileName);

    try {
      await fs.mkdir(dumpDir, { recursive: true });
      const command = `pg_dump -U ${process.env.POSTGRES_USER} ${process.env.POSTGRES_DB} > ${dumpFilePath}`;
      await execAsync(command).then(() =>{
        console.log(`[DumpService] Database dumped to ${dumpFilePath}`);
      });
    } catch (err) {
      console.error('Error dumping database:', err);
    }
  }
  
  private getFormattedTimestamp() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const year = now.getFullYear();
    return `${hours}${minutes}${seconds}_${day}${month}${year}`;
  }
}

