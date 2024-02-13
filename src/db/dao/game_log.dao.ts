import { ICreateGameAttrs } from '../../interfaces/interfaces.js';
import { GameMode } from "../../types/types.js";

export class GameLogDao {
  game_mode: GameMode;
  player1_id: string;
  player1_skill_level: string;
  player2_id: string;
  player2_skill_level: string;

  constructor(createGameAttrs: ICreateGameAttrs) {
    this.game_mode = createGameAttrs.game_mode;
    this.player1_id = createGameAttrs.player1_id;
    this.player1_skill_level = createGameAttrs.player1_skill_level;
    this.player2_id = createGameAttrs.player2_id;
    this.player2_skill_level = createGameAttrs.player2_skill_level;
  }
}