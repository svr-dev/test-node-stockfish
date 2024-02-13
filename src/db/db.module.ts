import { Module } from '@nestjs/common';
import { DbService } from './db.service.js';
import { SequelizeModule } from "@nestjs/sequelize";
import { GameLogModel } from "./game_log.model.js";

@Module({
  providers: [DbService],
  imports: [
    SequelizeModule.forFeature([GameLogModel]),
  ],
  exports: [DbService],
})
export class DbModule {}
