import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  randEmail,
  randFirstName,
  randLastName,
  randNumber,
  randJobTitle,
  randFilePath,
  randSkill,
  randPassword,
} from '@ngneat/falso';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { Role } from '@prisma/client';

@Injectable()
export class SeedService {
  private readonly saltRounds: number;

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {
    this.saltRounds = parseInt(config.get<string>('SALT_ROUNDS', '10'), 10);
  }

  async seed() {
    await this.clearDatabase();
    const users = await this.seedUsers();
    const skills = await this.seedSkills();
    await this.seedCVs(users, skills);
  }

  private async clearDatabase() {
    await this.prisma.cv.deleteMany();
    await this.prisma.skill.deleteMany();
    await this.prisma.user.deleteMany();
  }

  private async seedUsers(): Promise<{ id: string }[]> {
    const usersData = await Promise.all(
      Array(20)
        .fill(null)
        .map(async () => ({
          email: randEmail(),
          username: `${randFirstName().toLowerCase()}_${randLastName().toLowerCase()}`,
          password: await this.hashPassword(
            randPassword({
              length: 16,
              numbers: true,
              symbols: true,
              uppercase: true,
            }).toString(),
          ),
          role: Role.USER,
        })),
    );

    return this.prisma.$transaction(
      usersData.map((user) => this.prisma.user.create({ data: user })),
    );
  }

  private async seedSkills(): Promise<{ id: string }[]> {
    const skillsData = Array(20)
      .fill(null)
      .map(() => ({
        designation: randSkill(),
      }));

    return this.prisma.$transaction(
      skillsData.map((skill) => this.prisma.skill.create({ data: skill })),
    );
  }

  private async seedCVs(users: { id: string }[], skills: { id: string }[]) {
    const cvData = Array(50)
      .fill(null)
      .map(() => {
        const randomUser = users[Math.floor(Math.random() * users.length)];
        const randomSkills = this.getRandomSkills(skills, 3, 5);

        return {
          name: randJobTitle(),
          firstName: randFirstName(),
          age: randNumber({ min: 18, max: 65 }),
          cin: randNumber({ min: 10000000, max: 99999999 }).toString(),
          job: randJobTitle(),
          path: randFilePath(),
          userId: randomUser.id,
          skills: {
            connect: randomSkills.map((skill) => ({ id: skill.id })),
          },
        };
      });

    await this.prisma.$transaction(
      cvData.map((cv) => this.prisma.cv.create({ data: cv })),
    );
  }

  private getRandomSkills<T>(array: T[], min: number, max: number): T[] {
    const count = Math.floor(Math.random() * (max - min + 1)) + min;
    return Array.from(
      { length: count },
      () => array[Math.floor(Math.random() * array.length)],
    );
  }

  private async hashPassword(password: string): Promise<string> {
    const hashedPassword = await bcrypt.hash(password, this.saltRounds);
    return hashedPassword;
  }
}
