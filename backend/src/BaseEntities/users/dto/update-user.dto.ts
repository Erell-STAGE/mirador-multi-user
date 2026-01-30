import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { Language } from '../../../utils/email/utils';
import { Matches } from 'class-validator';
import { PASSWORD_ALL_CONDITIONS_FOR_REGEX, PASSWORD_ALL_CONDITIONS_FOR_USER } from 'src/auth/utils';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  password?: string;

  @Matches(new RegExp("^.{0}$|" + PASSWORD_ALL_CONDITIONS_FOR_REGEX), {
    message: PASSWORD_ALL_CONDITIONS_FOR_USER
  })
  newPassword?: string;
  confirmPassword?: string;
  resetToken?: string;
  lastConnectedAt?: Date;
  preferredLanguage?: Language;
  isEmailConfirmed?: boolean;
  termsValidatedAt?: Date;
}
