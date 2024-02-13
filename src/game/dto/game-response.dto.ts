import { IsString } from "class-validator";
import { IPlayedGame } from "../../interfaces/interfaces.js";

export class GameResponseDTO {
  @IsString()
  game_result: IPlayedGame;

  constructor(game_result: IPlayedGame) {
    this.game_result = game_result;
  }
}