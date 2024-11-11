import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Userprofile } from './userprofiles.entity';
import { User } from 'src/users/users.entity';
import { CreateProfileDto } from 'src/userprofiles/dto/create-profile.dto';
import { UpdateProfileDto } from 'src/userprofiles/dto/update-profile.dto';

@Injectable()
export class UserprofilesService {
  constructor(
    @InjectRepository(Userprofile)
    private readonly profileRepository: Repository<Userprofile>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createProfile(profileData: CreateProfileDto) {
    // Promise<Userprofile>
    // 이미 프로필이 있는지 확인

    const {userId} = profileData

    const existingProfile = await this.profileRepository.findOne({ where: { user: { id: userId } } });
    if (existingProfile) {
      throw new ConflictException('This user already has a profile');
    }

    // 사용자 확인
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    // 프로필 생성
    const profile = this.profileRepository.create(profileData);
    profile.user = user;

    return this.profileRepository.save(profile);
  }

  async getProfile(userId: number): Promise<Userprofile> {
    const profile = await this.profileRepository.findOne({
      where: { user: { id: userId } },
    });
    if (!profile) throw new NotFoundException('Profile not found');
    return profile;
  }

  async updateProfile(
    userId: number,
    profileData: UpdateProfileDto,
  ): Promise<Userprofile> {
    const profile = await this.getProfile(userId);
    if (!profile) throw new NotFoundException('Profile not found');

    Object.assign(profile, profileData);
    return this.profileRepository.save(profile);
  }
}
