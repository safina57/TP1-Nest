import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { configSchema } from './config-schema';
import { FileUploadModule } from './file-upload/file-upload.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validationSchema: configSchema,
    }),
    PrismaModule,
    AuthModule,
    FileUploadModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
