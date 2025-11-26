import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common'; // <-- Importar UseGuards
import { AuthGuard } from '@nestjs/passport';
import { EstudiantesService } from './estudiantes.service';
import { CreateEstudianteDto } from './dto/create-estudiante.dto';
import { UpdateEstudianteDto } from './dto/update-estudiante.dto';


const JwtAuthGuard = AuthGuard('jwt');

@Controller('estudiantes')
export class EstudiantesController {
  constructor(private readonly estudiantesService: EstudiantesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() data: CreateEstudianteDto) {
    return this.estudiantesService.create(data);
  }


  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.estudiantesService.findAll();
  }

  
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.estudiantesService.findOne(+id);
  }


  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() data: UpdateEstudianteDto) {
    return this.estudiantesService.update(+id, data);
  }


  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.estudiantesService.remove(+id);
  }
}