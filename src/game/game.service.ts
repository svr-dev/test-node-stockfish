import { Injectable } from '@nestjs/common';

@Injectable()
export class GameService {
  async playGame(params) {
    const game_result = 'game played successfully'
    return game_result
  }
}
