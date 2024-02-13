import { Module } from '@nestjs/common';
import { SequelizeModule } from "@nestjs/sequelize";
import { ConfigModule } from "@nestjs/config";
import { GameModule } from "./game/game.module.js";
import { EngineModule } from "./engine/engine.module.js";
import { BoardModule } from './board/board.module.js';
import { DbModule } from './db/db.module.js';
import { DumpModule } from './dump/dump.module.js';
import { AppService } from './app.service.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env`
    }),
    SequelizeModule.forRootAsync({
      useFactory: () => ({
        dialect: 'postgres',
        host: process.env.POSTGRES_HOST,
        port: Number(process.env.POSTGRES_PORT),
        username: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_DB,
        autoLoadModels: true,
        logging: (msg) => {
          if (msg.includes('Error')) {
            console.error(msg);
          }
        }
      })
    }),
    GameModule,
    EngineModule,
    BoardModule,
    DbModule,
    DumpModule,
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
