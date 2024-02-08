import { Module } from '@nestjs/common';
import { GameController } from "./game.controller.js";
import { GameService } from "./game.service.js";
import { EngineModule } from "../engine/engine.module.js";
import { BoardModule } from "../board/board.module.js";

@Module({
  controllers: [GameController],
  providers: [GameService],
  imports: [
    EngineModule,
    BoardModule
  ]
})
export class GameModule {}
