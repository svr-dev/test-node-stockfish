import { Module } from '@nestjs/common';
import { DumpService } from './dump.service.js';
import { DbModule } from "../db/db.module.js";
import { SequelizeModule } from "@nestjs/sequelize";
import { GameLogModel } from "../db/game_log.model.js";

@Module({
  providers: [DumpService],
  imports: [
    SequelizeModule.forFeature([GameLogModel]),
    DbModule
  ],
  exports: [
    DumpService
  ]
})
export class DumpModule {}