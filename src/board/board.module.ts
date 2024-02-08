import { Module } from '@nestjs/common';
import { BoardService } from './board.service.js';

@Module({
  providers: [BoardService],
  exports: [BoardService]
})
export class BoardModule {}
