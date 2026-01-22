import { IsNumber, IsObject, IsString } from 'class-validator';

export class manifestCreationDto {
  @IsNumber()
  idCreator: number;
  @IsString()
  thumbnailUrl: string;
  @IsObject()
  processedManifest: any;
  @IsString()
  title: string;
  hash: string;
}
