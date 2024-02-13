import { GameMode, GameResult } from "../types/types.js";

export interface ICreateGameAttrs {
  game_mode: GameMode;
  player1_id: string;
  player1_skill_level: string;
  player2_id: string;
  player2_skill_level: string;
}

export interface IUpdateGameAttrs {
  id: number;
  move?: string;
  game_result?: GameResult;
}

export interface IPlayedGame {
  id: number;
  game_result: GameResult;
}