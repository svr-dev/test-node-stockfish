import { Module } from '@nestjs/common';
import { GameController } from "./game.controller.js";
import { GameService } from "./game.service.js";
import { EngineModule } from "../engine/engine.module.js";
import { BoardModule } from "../board/board.module.js";
import { DbModule } from "../db/db.module.js";

@Module({
  controllers: [GameController],
  providers: [GameService],
  imports: [
    EngineModule,
    BoardModule,
    DbModule
  ]
})
export class GameModule {}
