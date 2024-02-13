import { Injectable } from '@nestjs/common';
import { StockfishInstance } from 'node-stockfish';
import { SkillLevel } from "../types/types.js";

@Injectable()
export class EngineService {
  private readonly stockfishInstances: StockfishInstance[] = [];
  private readonly stockfishWhite: StockfishInstance;
  private readonly stockfishBlack: StockfishInstance;
  private readonly skillLevels: SkillLevel[] = [
    { level: 'easy', depth: 1 },
    { level: 'medium', depth: 3 },
    { level: 'hard', depth: 20 }
  ];
  private readonly playerLevels: { w: SkillLevel; b: SkillLevel };

  constructor() {
    this.stockfishWhite = StockfishInstance.getInstance();
    this.stockfishBlack = StockfishInstance.getInstance();
    this.stockfishInstances.push(this.stockfishWhite, this.stockfishBlack);
    // Randomly assign difficulty levels for white and black
    this.playerLevels = {
      w: this.skillLevels[Math.floor(Math.random() * this.skillLevels.length)],
      b: this.skillLevels[Math.floor(Math.random() * this.skillLevels.length)]
    };
  }
  async getBestMove(fen: string) {
    return new Promise((resolve, reject) => {
      const player = fen.toString().split(' ')[1];
      const stockfish =
        player === 'w' ? this.stockfishWhite : this.stockfishBlack;
      stockfish.setBoardstateByFen(fen);
      stockfish.startAnalysing({ lines: 1 });

      const onAnalysis = (analysis: { lines: string | any[] }) => {
        if (analysis['noLegalMoves'] === true) {
          reject('noLegalMoves');
        }
        else if (
          analysis.lines.length > 0 &&
          stockfish.currentDepth === this.playerLevels[player].depth - 1
        ) {
          resolve(analysis.lines[0].moves[0]);

          // Cleanup listener to avoid memory leak
          stockfish.stopAnalysing();
          stockfish.onAnalysisData(null);
        }
      };
      stockfish.onAnalysisData(onAnalysis);
    });
  }
  getSkillLevels(): { w: SkillLevel, b: SkillLevel } {
    return this.playerLevels
  }
  terminateAllInstances() {
    this.stockfishInstances.forEach((instance) => {
      instance.stopAnalysing();
      instance.stopUsing();
      instance.terminate();
    });
  }
}
