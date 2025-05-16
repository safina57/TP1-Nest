import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { configSchema } from './config-schema';
import { CvsModule } from './cvs/cvs.module';
import { FileUploadModule } from './file-upload/file-upload.module';
import { CvEventsModule } from './cv-events/cv-events.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validationSchema: configSchema,
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    CvsModule,
    FileUploadModule,
    CvEventsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
