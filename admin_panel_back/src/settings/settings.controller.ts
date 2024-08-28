import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { SettingsDto } from './dto/settings.dto';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Auth('ADMIN')
  @Get('key')
  getSettingsKey(@Param('key') key: string) {
    return this.settingsService.getSettingByKey(key);
  }

  @Auth('ADMIN')
  @Post()
  setSetting(@Body() settingData: SettingsDto) {
    return this.settingsService.setSetting(settingData.key, settingData.value);
  }
}
