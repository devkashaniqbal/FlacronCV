import {
  Controller,
  Get,
  Put,
  Patch,
  Delete,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { FirebaseAuthGuard } from '../../common/guards/firebase-auth.guard';
import { CurrentUser, FirebaseUser } from '../../common/decorators/current-user.decorator';
import { UpdateUserData } from '@flacroncv/shared-types';

@ApiTags('users')
@Controller('users')
@UseGuards(FirebaseAuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getProfile(@CurrentUser() user: FirebaseUser) {
    return this.usersService.findByIdOrThrow(user.uid);
  }

  @Put('me')
  async updateProfile(@CurrentUser() user: FirebaseUser, @Body() data: UpdateUserData) {
    return this.usersService.update(user.uid, data);
  }

  @Patch('me/preferences')
  async updatePreferences(
    @CurrentUser() user: FirebaseUser,
    @Body() preferences: Record<string, unknown>,
  ) {
    return this.usersService.update(user.uid, { preferences: preferences as any });
  }

  @Get('me/usage')
  async getUsage(@CurrentUser() user: FirebaseUser) {
    const userData = await this.usersService.findByIdOrThrow(user.uid);
    return userData.usage;
  }

  @Delete('me')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAccount(@CurrentUser() user: FirebaseUser) {
    await this.usersService.softDelete(user.uid);
  }
}
