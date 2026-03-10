import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsageResetService } from './usage-reset.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, UsageResetService],
  exports: [UsersService],
})
export class UsersModule {}
