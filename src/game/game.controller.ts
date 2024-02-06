import { Controller, Post, Query, UsePipes, ValidationPipe } from "@nestjs/common";
import { GameService } from "./game.service";
import { GameResponseDTO } from "./dto/game-response.dto";
import { GameRequestDTO } from "./dto/game-request.dto";

@Controller('/')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post('/game')
  @UsePipes(new ValidationPipe({ transform: true }))
  async playGame(@Query() params: GameRequestDTO): Promise<GameResponseDTO> {
    const gamePlayed = await this.gameService.playGame(params);
    return new GameResponseDTO(gamePlayed);
  }
}
