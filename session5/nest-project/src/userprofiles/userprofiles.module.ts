// src/userprofiles/userprofiles.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserprofilesService } from './userprofiles.service';
import { Userprofile } from './userprofiles.entity';
import { User } from 'src/users/users.entity';
import { UserProfileController } from './userprofiles.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Userprofile, User])],
  providers: [UserprofilesService],       // UserprofilesService를 providers에 등록
  controllers: [UserProfileController],   // UserProfileController를 controllers에 등록
  exports: [UserprofilesService],         // 다른 모듈에서 사용할 수 있도록 exports에 추가
})
export class UserprofilesModule {}
