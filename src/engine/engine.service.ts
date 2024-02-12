import { Injectable } from '@nestjs/common';
import { StockfishInstance, StockfishAnalysis } from 'node-stockfish';

type SkillLevel = {
  level: string;
  depth: number;
};

@Injectable()
export class EngineService {
  private readonly stockfishWhite: StockfishInstance;
  private readonly stockfishBlack: StockfishInstance;
  private readonly skillLevels: SkillLevel[] = [
    { level: 'easy', depth: 1 },
    { level: 'medium', depth: 5 },
    { level: 'hard', depth: 20 }
  ];
  private readonly playerLevels: { w: SkillLevel; b: SkillLevel };

  constructor() {
    this.stockfishWhite = StockfishInstance.getInstance();
    this.stockfishBlack = StockfishInstance.getInstance();
    // Randomly assign difficulty levels for white and black
    this.playerLevels = {
      w: this.skillLevels[Math.floor(Math.random() * this.skillLevels.length)],
      b: this.skillLevels[Math.floor(Math.random() * this.skillLevels.length)]
    };
    // Info message with timeout to appear after project initialization
    setTimeout(() => {
      console.log(`White will play at level "${this.playerLevels.w.level}" with depth ${this.playerLevels.w.depth}, ` +
        `Black at level "${this.playerLevels.b.level}" with depth ${this.playerLevels.b.depth}.`);
    },500)
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
          console.log('No legal moves available - game ended.');
          reject('noLegalMoves');
        } else if (
          analysis.lines.length > 0 &&
          stockfish.currentDepth === this.playerLevels[player].depth - 1
        ) {
          console.log('analysis: ', analysis);
          console.log('analysis lines: ');
          console.log(analysis.lines[0]);
          resolve(analysis.lines[0].moves[0]);

          // Cleanup listener to avoid memory leak
          stockfish.stopAnalysing();
          stockfish.onAnalysisData(null);
        }
      };
      stockfish.onAnalysisData(onAnalysis);
    });
  }
}
