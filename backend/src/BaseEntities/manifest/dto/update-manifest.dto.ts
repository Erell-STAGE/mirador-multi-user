import { PartialType } from '@nestjs/mapped-types';
import { CreateManifestDto } from './create-manifest.dto';
import { ManifestJSON } from 'src/utils/Custom_pipes/manifest-creation.pipe';

export class UpdateManifestInfoDto extends PartialType(CreateManifestDto) {
  id: number;
  thumbnailUrl: string;
}

export class UpdateManifestDto extends UpdateManifestInfoDto {
  jsonID: string;
  manifestMedias: any[];
  processedManifest: ManifestJSON;
}