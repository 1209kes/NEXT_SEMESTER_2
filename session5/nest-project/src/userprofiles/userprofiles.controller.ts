import { Controller, Post, Get, Patch, Body, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserprofilesService } from './userprofiles.service';
import { CreateProfileDto } from 'src/userprofiles/dto/create-profile.dto';
import { UpdateProfileDto } from 'src/userprofiles/dto/update-profile.dto';

@Controller('profile')
export class UserProfileController {
  constructor(private readonly profileService: UserprofilesService) {}

  // 프로필 생성 엔드포인트
  @UseGuards(AuthGuard('jwt'))
  @Post()
  async createProfile(@Request() req, @Body() profileData: CreateProfileDto) {
    // 인증된 사용자 ID로 프로필 생성
    return this.profileService.createProfile(profileData);
  }

  // 프로필 조회 엔드포인트
  @UseGuards(AuthGuard('jwt'))
  @Get()
  async getProfile(@Request() req) {
    // 인증된 사용자 ID로 프로필 조회
    return this.profileService.getProfile(req.user.id);
  }

  // 프로필 업데이트 엔드포인트
  @UseGuards(AuthGuard('jwt'))
  @Patch()
  async updateProfile(@Request() req, @Body() profileData: UpdateProfileDto) {
    // 인증된 사용자 ID로 프로필 업데이트
    return this.profileService.updateProfile(req.user.id, profileData);
  }
}
