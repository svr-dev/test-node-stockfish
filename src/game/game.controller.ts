import { Controller, Post, Query, UsePipes, ValidationPipe } from "@nestjs/common";
import { GameService } from "./game.service.js";
import { GameRequestDTO } from "./dto/game-request.dto.js";
import { GameResponseDTO } from "./dto/game-response.dto.js";
import { ICreateGameAttrs } from "../interfaces/interfaces.js";
import { GameMode } from "../types/types.js";
import { DumpService } from "../dump/dump.service.js";
@Controller('/')
export class GameController {
  constructor(
    private readonly gameService: GameService,
    private readonly dumpService: DumpService
  ) {}

  @Post('/game')
  @UsePipes(new ValidationPipe({ transform: true }))
  async playGame(@Query() params: GameRequestDTO): Promise<GameResponseDTO> {
    const gamePlayed = await this.gameService.playGame(params.mode);
    await this.dumpService.writeGameResultToFile(gamePlayed);
    await this.dumpService.dumpDatabase();
    return new GameResponseDTO(gamePlayed);
  }
}
