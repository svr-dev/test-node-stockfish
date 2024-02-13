import { Column, DataType, Model, PrimaryKey, Table } from "sequelize-typescript";
import { GameMode, GameResult } from "../types/types.js";

export interface GameLogModelCreationAttrs {
  id: number;
  game_mode: GameMode;
  player1_id: string;
  player1_skill_level: string;
  player2_id: string;
  player2_skill_level: string;
  moves?: string[] | null;
  game_result?: GameResult | null
}

@Table({ tableName: 'game_logs' })
export class GameLogModel extends Model<GameLogModel, GameLogModelCreationAttrs> {
  @PrimaryKey
  @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
  id: number;

  @Column({ type: DataType.ENUM(...Object.values(GameMode)), allowNull: false })
  game_mode: GameMode;

  @Column({ type: DataType.STRING, allowNull: false })
  player1_id: string;

  @Column({ type: DataType.STRING, allowNull: false })
  player1_skill_level: string;

  @Column({ type: DataType.STRING, allowNull: false })
  player2_id: string;

  @Column({ type: DataType.STRING, allowNull: false })
  player2_skill_level: string;

  @Column({ type: DataType.ARRAY(DataType.STRING), allowNull: true })
  moves: string[];

  @Column({ type: DataType.ENUM(...Object.values(GameResult)), allowNull: true })
  game_result: GameResult | null;
}
