import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

const mockAuthService = {
  login: jest.fn().mockResolvedValue({ access_token: 'token' }),
  register: jest.fn().mockResolvedValue({ message: 'registered', data: {} }),
};

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should login', async () => {
    const result = await controller.login({ email: 'test@test.com', password: '123' });
    expect(result).toEqual({ access_token: 'token' });
  });

  it('should register', async () => {
    const result = await controller.register({ email: 'test@test.com', password: '123', username: 'test' });
    expect(result.message).toBe('registered');
  });
});
