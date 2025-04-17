import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AuthMiddleware } from 'src/auth/auth.middleware';
import { CommonModule } from 'src/common/common.module';

@Module({
  providers: [UserService],
  controllers: [UserController],
  imports: [CommonModule],
})
export class UserModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes({ path: 'user/current', method: RequestMethod.GET });
  }
}
