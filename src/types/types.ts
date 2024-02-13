export type SkillLevel = {
  level: string;
  depth: number;
};

export type MoveType = 'regular'|'double_pawn_push' | 'en_passant' | 'castling' | 'capture' | 'promotion';

export enum GameMode {
  PvP = 'pvp',
  PvE = 'pve',
  Demo = 'demo',
}

export enum GameResult {
  WhiteWins = 'white_wins',
  BlackWins = 'black_wins',
  DrawStalemate = 'draw_stalemate',
  DrawFiftyMoveRule = 'draw_fifty_move_rule',
  DrawThreefoldRepetition = 'draw_threefold_repetition',
  DrawInsufficientMaterial = 'draw_insufficient_material',
}