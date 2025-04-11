import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDTO, RegisterDTO, LoginResponseDto, RegisterResponseDto } from './dto';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    login: jest.fn(),
    register: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('login', () => {
    it('should call authService.login and return result', async () => {
      const dto: LoginDTO = { email: 'test@example.com', password: 'password123' };
      const result: LoginResponseDto = { access_token: 'fake-jwt-token' };

      mockAuthService.login.mockResolvedValue(result);

      expect(await authController.login(dto)).toEqual(result);
      expect(authService.login).toHaveBeenCalledWith(dto);
    });
  });

  describe('register', () => {
    it('should call authService.register and return result', async () => {
      const dto: RegisterDTO = {
        email: 'new@example.com',
        password: 'pass123',
        username: 'New User',
      };
      const result: RegisterResponseDto = { message: 'User registered successfully', data :  {  username: 'New User', email: 'new@example.com' } };

      mockAuthService.register.mockResolvedValue(result);

      expect(await authController.register(dto)).toEqual(result);
      expect(authService.register).toHaveBeenCalledWith(dto);
    });
  });
});
