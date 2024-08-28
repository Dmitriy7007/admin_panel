import { IsString } from 'class-validator';

export class SettingsDto {
  @IsString()
  key: string;

  @IsString()
  value: string;
}
