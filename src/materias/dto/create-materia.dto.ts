import { IsString, IsInt, IsOptional, Min } from 'class-validator';

export class CreateMateriaDto {
  @IsString({ message: 'El nombre debe ser un texto' })
  nombre!: string;

  @IsInt({ message: 'Los cupos deben ser un número entero' })
  @Min(1)
  @IsOptional() // Es opcional porque en Prisma pusiste @default(30)
  cupos?: number;

  @IsInt({ message: 'El carreraId debe ser un número entero' })
  carreraId!: number; // Campo obligatorio según tu modelo

  @IsInt({ message: 'El maestroId debe ser un número entero' })
  @IsOptional() // Es opcional porque en Prisma pusiste Int?
  maestroId?: number;
}