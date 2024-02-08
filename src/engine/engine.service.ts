import { Injectable } from '@nestjs/common';
import { StockfishInstance } from 'node-stockfish';

@Injectable()
export class EngineService {
 
  private stockfish: StockfishInstance;
  constructor() {
    this.stockfish = StockfishInstance.getInstance()
  }

  async getBestMove(fen: string, depth: number = 5): Promise<string> {
    return new Promise((resolve, reject) => {
      this.stockfish.setBoardstateByFen(fen);
      this.stockfish.startAnalysing({ lines: 1 });

      const onAnalysis = (analysis: { lines: string | any[] }) => {
        if (analysis.lines.length > 0) {
          const bestMove = analysis.lines[0].moves[0];
          console.log('resolved line: ', analysis)
          console.log('resolved score: ', analysis.lines[0].score)
          resolve(bestMove);
          this.stockfish.stopAnalysing();
          this.stockfish.onAnalysisData(null); // Remove listener to prevent memory leaks
        }
      };

      this.stockfish.onAnalysisData(onAnalysis);
    });
  }
}
