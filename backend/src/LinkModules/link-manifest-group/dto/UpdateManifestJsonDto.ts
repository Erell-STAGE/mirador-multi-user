import { ManifestJSON } from 'src/utils/Custom_pipes/manifest-creation.pipe';
import { manifestOrigin } from '../../../enum/origins';

export class UpdateManifestJsonDto {
  id: number;

  json: ManifestJSON;

  origin: manifestOrigin;

  path: string;

  hash: string;
}
