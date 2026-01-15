import { PartialType } from '@nestjs/mapped-types';
import { CreateManifestDto } from './create-manifest.dto';

export class UpdateManifestInfoDto extends PartialType(CreateManifestDto) {
  id: number;
}

export class UpdateManifestDto extends UpdateManifestInfoDto {
  jsonID: string;

  manifestMedias: any[];

  thumbnailUrl: string;

  processedManifest: any[];
}