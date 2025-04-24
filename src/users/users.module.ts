import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { CvsService } from 'src/cvs/cvs.service';

@Module({
  providers: [UsersResolver, UsersService, CvsService],
})
export class UsersModule {}
