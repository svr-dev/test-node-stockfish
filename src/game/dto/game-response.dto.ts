import { IsString } from "class-validator";

export class GameResponseDTO {
  @IsString()
  game_result: string;

  constructor(game_result: string) {
    this.game_result = game_result;
  }
}