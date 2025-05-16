import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Query,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { CvsService } from './cvs.service';
import { CreateCvDto } from './dto/create-cv.dto';
import { UpdateCvDto } from './dto/update-cv.dto';
import { GetCvQueryDto } from './dto/get-cv-query.dto';
import { ImageValidationPipe } from '../file-upload/pipes/image_validation.pipe';
import { FileInterceptor } from '@nestjs/platform-express';
import { GenericService } from 'src/common/services/generic.service';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { JWTAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from '@prisma/client';
import { CvEventsService } from 'src/cv-events/cv-events.service';
import { AdminGuard } from 'src/auth/guards/admin.guard';

@Controller('cvs')
export class CvsController {
  constructor(
    private readonly cvsService: CvsService,
    private readonly genericService: GenericService,
    private readonly cvEventsService: CvEventsService,
  ) {}

  @Get('all')
  @UseGuards(JWTAuthGuard)
  getAllCvs(@Query() query: PaginationQueryDto, @GetUser() user: User) {
    return this.genericService.getAll('cv', user, {
      skip: query.skip,
      take: query.take,
    });
  }

  @Get()
  @UseGuards(JWTAuthGuard)
  getCV(@Query() query: GetCvQueryDto) {
    return this.cvsService.findByQuery(query);
  }

  @Get(':id')
  @UseGuards(JWTAuthGuard)
  getCVById(@Param('id') id: string) {
    return this.cvsService.findOne(id);
  }

  @Post()
  @UseGuards(JWTAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async createCV(
    @Body() createCvDto: CreateCvDto,
    @UploadedFile(new ImageValidationPipe()) file: Express.Multer.File,
    @GetUser() user: User,
  ) {
    const cv = await this.cvsService.create(createCvDto, file, user.id);
    await this.cvEventsService.logEvent(cv.id, user.id, 'CREATE');
    return cv;
  }

  @Put(':id')
  @UseGuards(JWTAuthGuard)
  async updateCV(
    @Param('id') id: string,
    @Body() updateCvDto: UpdateCvDto,
    @GetUser() user: User,
  ) {
    const updated = await this.cvsService.update(id, updateCvDto, user.id);
    await this.cvEventsService.logEvent(id, user.id, 'UPDATE');
    return updated;
  }

  @Delete(':id')
  @UseGuards(JWTAuthGuard)
  async deleteCV(@Param('id') id: string, @GetUser() user: User) {
    const deleted = await this.cvsService.remove(id, user.id);
    await this.cvEventsService.logEvent(id, user.id, 'DELETE');
    return deleted;
  }

  @Get(':id/history-cv')
  @UseGuards(AdminGuard)
  async getCVHistory(@Param('id') id: string) {
    return this.cvEventsService.getHistoryForCv(id);
  }

  @Get(':userId/history-user')
  @UseGuards(JWTAuthGuard)
  async getUserCVHistory(@Param('userId') userId: string) {
    return this.cvEventsService.getHistoryForUser(userId);
  }
}
