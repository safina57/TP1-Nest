import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;

  const mockPrisma = {
    user: {
      create: jest.fn(),
      findUnique: jest.fn(),
    },
  };

  const mockJwt = {
    signAsync: jest.fn().mockResolvedValue('mock_token'),
  };

  const mockConfig = {
    get: jest.fn().mockReturnValue('10'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: JwtService, useValue: mockJwt },
        { provide: ConfigService, useValue: mockConfig },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should register a user', async () => {
    const dto = { username: 'john', email: 'john@example.com', password: '123' };
    mockPrisma.user.create.mockResolvedValue({ ...dto, id: '1' });
    const result = await service.register(dto);
    expect(result.data).toHaveProperty('username', 'john');
  });

  it('should login and return access_token', async () => {
    const dto = { email: 'john@example.com', password: '123' };
    mockPrisma.user.findUnique.mockResolvedValue({ id: '1', password: await bcrypt.hash('123', 10) });
    const result = await service.login(dto);
    expect(result).toEqual({ access_token: 'mock_token' });
  });
});