import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common'; // <-- Importar UseGuards
import { AuthGuard } from '@nestjs/passport'; // <-- Importar AuthGuard
import { EstudiantesService } from './estudiantes.service';
import { CreateEstudianteDto } from './dto/create-estudiante.dto';
import { UpdateEstudianteDto } from './dto/update-estudiante.dto';

// Define el guard de JWT. 'jwt' es el nombre de la estrategia.
const JwtAuthGuard = AuthGuard('jwt');

@Controller('estudiantes') // ruta base en plural
export class EstudiantesController {
  constructor(private readonly estudiantesService: EstudiantesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() data: CreateEstudianteDto) {
    return this.estudiantesService.create(data);
  }

  // 2. Proteger GET (Listar todos los estudiantes)
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.estudiantesService.findAll();
  }

  // 3. Proteger GET (Buscar por ID)
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.estudiantesService.findOne(+id);
  }

  // 4. Proteger PUT (Actualizar estudiante)
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() data: UpdateEstudianteDto) {
    return this.estudiantesService.update(+id, data);
  }

  // 5. Proteger DELETE (Eliminar estudiante)
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.estudiantesService.remove(+id);
  }
}