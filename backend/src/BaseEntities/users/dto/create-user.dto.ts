import { IsEmail, IsNotEmpty, IsOptional, Matches } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateProjectDto } from '../../project/dto/create-project.dto';
import { Language } from '../../../utils/email/utils';
import { PASSWORD_ALL_CONDITIONS_FOR_REGEX, PASSWORD_ALL_CONDITIONS_FOR_USER } from 'src/auth/utils';

export class CreateUserDto {
  @IsEmail()
  mail: string;

  @IsNotEmpty()
  name: string;

  // @IsNotEmpty()
  password: string;

  @Matches(new RegExp(PASSWORD_ALL_CONDITIONS_FOR_REGEX), {
    message: PASSWORD_ALL_CONDITIONS_FOR_USER
  })
  newPassword: string;

  @Type(() => CreateProjectDto)
  @IsOptional()
  Projects?: CreateProjectDto[];

  preferredLanguage: Language;
}
