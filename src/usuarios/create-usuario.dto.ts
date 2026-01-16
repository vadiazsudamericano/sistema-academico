import { IsString, IsEmail, MinLength, IsNotEmpty } from 'class-validator';

export class CreateUsuarioDto {
  @IsString()
  username!: string

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6)
  password!: string;
  @IsString()    
  @IsNotEmpty()  
  role!: string;
}
