import { Injectable } from '@nestjs/common';
import { InjectModel } from "@nestjs/sequelize";
import { GameLogModel } from "./game_log.model.js";
import { GameLogDao } from "./dao/game_log.dao.js";
import { ICreateGameAttrs, IUpdateGameAttrs } from "../interfaces/interfaces.js";

@Injectable()
export class DbService {
  constructor(
    @InjectModel(GameLogModel) private gameRepository: typeof GameLogModel
  ) {}
  
  async createGame(gameAttrs: ICreateGameAttrs) {
    const gameData = new GameLogDao(gameAttrs)
    const game = await this.gameRepository.create(gameData)
    return {
      id: game.id
    }
  }

  async updateGame(gameId: number, updateAttrs: Partial<IUpdateGameAttrs>) {
    const game = await this.gameRepository.findByPk(gameId);
    if (!game) {
      console.log(`[DBService] Game with ID ${gameId} not found`);
      return null;
    }
    if (updateAttrs.move) {
      const gameMoves = game.moves === null ? [] : [...game.moves];
      gameMoves.push(updateAttrs.move);
      game.moves = gameMoves;
    }
    if (updateAttrs.game_result) {
      game.game_result = updateAttrs.game_result
    }
    await game.save()
    return game;
  }
}