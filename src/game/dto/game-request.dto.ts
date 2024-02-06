import { IsOptional, IsString } from "class-validator";

export class GameRequestDTO {
  @IsString()
  mode: string;

  @IsOptional()
  @IsString()
  difficulty?: string;
}