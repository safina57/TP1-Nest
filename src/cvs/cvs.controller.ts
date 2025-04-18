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
import { FileUploadService } from '../file-upload/file-upload.service';
import { ImageValidationPipe } from '../file-upload/pipes/image_validation.pipe';
import { FileInterceptor } from '@nestjs/platform-express';
import { GenericService } from 'src/common/services/generic.service';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { JWTAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from '@prisma/client';

@Controller('cvs')
export class CvsController {
  constructor(
    private readonly cvsService: CvsService,
    private readonly fileUploadService: FileUploadService,
    private readonly genericService: GenericService,
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
    return this.cvsService.create(createCvDto, file, user.id);
  }

  @Put(':id')
  @UseGuards(JWTAuthGuard)
  updateCV(
    @Param('id') id: string,
    @Body() updateCvDto: UpdateCvDto,
    @GetUser() user: User,
  ) {
    return this.cvsService.update(id, updateCvDto, user.id);
  }

  @Delete(':id')
  @UseGuards(JWTAuthGuard)
  deleteCV(@Param('id') id: string, @GetUser() user: User) {
    return this.cvsService.remove(id, user.id);
  }
}
