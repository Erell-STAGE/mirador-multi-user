import { IsEmail, IsNotEmpty, IsOptional, Matches } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateProjectDto } from '../../project/dto/create-project.dto';
import { Language } from '../../../utils/email/utils';
import { PASSWORD_MINIMUM_LENGTH } from 'src/auth/utils';

export class CreateUserDto {
  @IsEmail()
  mail: string;

  @IsNotEmpty()
  name: string;

  // @IsNotEmpty()
  password: string;

  @Matches(new RegExp("^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\d\s:]).{" + PASSWORD_MINIMUM_LENGTH + ",}$"))
  newPassword: string;

  @Type(() => CreateProjectDto)
  @IsOptional()
  Projects?: CreateProjectDto[];

  preferredLanguage: Language;
}
