import { Module } from '@nestjs/common';
import { GameService } from "./game.service.js";
import { EngineModule } from "../engine/engine.module.js";
import { BoardModule } from "../board/board.module.js";
import { DbModule } from "../db/db.module.js";
import { DumpModule } from "../dump/dump.module.js";

@Module({
  providers: [GameService],
  imports: [
    EngineModule,
    BoardModule,
    DbModule,
    DumpModule
  ],
  exports: [
    GameService
  ]
})
export class GameModule {}
