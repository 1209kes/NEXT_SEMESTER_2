import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardsModule } from './boards/boards.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { UserprofilesModule } from './userprofiles/userprofiles.module';
import { UserProfileController } from './userprofiles/userprofiles.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '1325',
      database: 'nestdb',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // 개발 환경에서만 true로 설정하여 테이블 자동 생성
    }),
    BoardsModule,
    UsersModule,
    AuthModule,
    UserprofilesModule,
  ],
  controllers: [UserProfileController],
})
export class AppModule {}
