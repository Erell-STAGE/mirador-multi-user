import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  UnsupportedMediaTypeException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import * as sharp from 'sharp';
import {
  getPeerTubeVideoDetails,
  getPeerTubeVideoID,
  getVideoDuration,
  getYoutubeJson,
  getYouTubeVideoID,
  isImage,
  isPeerTubeVideo,
  isVideo,
  isYouTubeVideo,
} from './utils';
import { generateAlphanumericSHA1Hash } from '../hashGenerator';
import { serializeToValidUrl } from '../serializeToValideUrl';


export type ManifestJSON = {
  '@context': string,
  id: string,
  type: string,
  label: {
    en: any[],
  },
  items: ManifestItem[],
  thumbnail: {
    '@id': string,
    service: {
      "@context": string,
      "@id": string,
      profile: string
    }
  } | {};
}

export type ManifestItem = {
  id: string;
  type: string;
  height: number;
  width: number;
  duration?: number;
  label: { en: string[] };
  items: {
    id: string,
    type: string,
    items: ManifestSubItem[],
  }[];
};

export type ManifestSubItem = {
  id: string;
  type: string;
  motivation: string;
  target: string;
  body: {
    id: string;
    type: string;
    format: string;
    height: number;
    width: number;
    duration?: number,
  };
};

const fetchMediaForItem = async (media, id: string) => {
  try {
    const url = media.value.replace(
      /^(http|https):\/\/localhost:\d+\//,
      '$1://caddy/',
    );

    const timeStamp = Date.now();
    const timeStamp2 = Date.now();
    const timeStamp3 = Date.now();

    let videoId: string | null = null;
    let youtubeJson = null;
    let peertubeVideoJson = null;

    let mediaJSON: ManifestItem;

    switch (true) {
      case isVideo(url): {
        const width = media.width;
        const height = media.height;
        const duration = Math.round(media.duration);
        const mediaFormat = media.value.split('.').pop();
        mediaJSON = {
          id: `${id}${timeStamp}/canvas/${timeStamp2}`,
          type: 'Canvas',
          height,
          width,
          duration,
          label: { en: ['Raw Item'] },
          items: [
            {
              id: `${id}${timeStamp}/canvas/${timeStamp2}/annotation-page/${timeStamp3}`,
              type: 'AnnotationPage',
              items: [
                {
                  id: `${id}${timeStamp}/annotation/${Date.now()}`,
                  type: 'Annotation',
                  motivation: 'painting',
                  target: `${id}${timeStamp}/canvas/${timeStamp2}`,
                  body: {
                    id: media.value,
                    type: 'Video',
                    format: `Video/${mediaFormat}`,
                    height,
                    width,
                    duration,
                  },
                },
              ],
            },
          ],
        };
      }
      case isYouTubeVideo(url): {
        videoId = getYouTubeVideoID(url);
        if (videoId) {
          youtubeJson = await getYoutubeJson(url);
          const videoDuration = await getVideoDuration(url);
          let height: number;
          let width: number;
          if (youtubeJson.width >= youtubeJson.height) {
            height = 1500;
            width = (1500 * youtubeJson.width) / youtubeJson.height;
          } else {
            height = 1500;
            width = (1500 * youtubeJson.height) / youtubeJson.width;
          }
          const duration = videoDuration;

          mediaJSON = {
            id: `${id}${timeStamp}/canvas/${timeStamp2}`,
            type: 'Canvas',
            height,
            width,
            duration,
            label: { en: ['Youtube Item'] },
            items: [
              {
                id: `${id}${timeStamp}/canvas/${timeStamp2}/annotation-page/${timeStamp3}`,
                type: 'AnnotationPage',
                items: [
                  {
                    id: `${id}${timeStamp}/annotation/${Date.now()}`,
                    type: 'Annotation',
                    motivation: 'painting',
                    target: `${id}${timeStamp}/canvas/${timeStamp2}`,
                    body: {
                      id: media.value,
                      type: 'Video',
                      format: `Video/MPG`,
                      height,
                      width,
                      duration,
                    },
                  },
                ],
              },
            ],
          };
        }
      }
      case await isPeerTubeVideo(url): {
        videoId = getPeerTubeVideoID(url);
        if (videoId) {
          peertubeVideoJson = await getPeerTubeVideoDetails(url, videoId);

          const defaultHeight = 480;
          const defaultWidth = 854;

          const height =
            peertubeVideoJson.streamingPlaylists?.[0]?.files?.[0]?.height ||
            defaultHeight;
          const width =
            peertubeVideoJson.streamingPlaylists?.[0]?.files?.[0]?.width ||
            defaultWidth;

          const duration = peertubeVideoJson.duration;

          mediaJSON = {
            id: `${id}${timeStamp}/canvas/${timeStamp2}`,
            type: 'Canvas',
            height,
            width,
            duration,
            label: { en: ['Peertube Item'] },
            items: [
              {
                id: `${id}${timeStamp}/canvas/${timeStamp2}/annotation-page/${timeStamp3}`,
                type: 'AnnotationPage',
                items: [
                  {
                    id: `${id}${timeStamp}/annotation/${Date.now()}`,
                    type: 'Annotation',
                    motivation: 'painting',
                    target: `${id}${timeStamp}/canvas/${timeStamp2}`,
                    body: {
                      id: media.value,
                      type: 'Video',
                      format: `Video/MPG`,
                      height,
                      width,
                      duration,
                    },
                  },
                ],
              },
            ],
          };
        }
      }
      case await isImage(url): {
        const response = await fetch(`${url}`, { method: 'GET' });
        const arrayBuffer = await response.arrayBuffer();
        const mediaBuffer = Buffer.from(arrayBuffer);
        const contentType = response.headers.get('Content-Type');
        const imageMetadata = await sharp(mediaBuffer).metadata();
        const { width, height } = imageMetadata;

        mediaJSON =
        {
          id: `${id}${timeStamp}/canvas/${timeStamp2}`,
          type: 'Canvas',
          height,
          width,
          label: { en: ['Image Item'] },
          items: [
            {
              id: `${id}${timeStamp}/canvas/${timeStamp2}/annotation-page/${timeStamp3}`,
              type: 'AnnotationPage',
              items: [
                {
                  id: `${id}${timeStamp}/annotation/${Date.now()}`,
                  type: 'Annotation',
                  motivation: 'painting',
                  target: `${id}${timeStamp}/canvas/${timeStamp2}`,
                  body: {
                    id: media.value,
                    type: 'Image',
                    format: `Image/${contentType}`,
                    height,
                    width,
                  },
                },
              ],
            },
          ],
        };
      }
      default:
        if (mediaJSON) return mediaJSON;
        throw new UnsupportedMediaTypeException(
          'media type is not supported',
        );
    }
  } catch (error) {
    console.error('error details:', error);
    throw new BadRequestException(`Error fetching media: ${error.message}`);
  }
}

export const getManifestMediasJSON = async (manifestMedias, id: string) => {
  let medias: ManifestItem[] = [];

  for (const item of manifestMedias) {
    for (const media of item.media) {
      medias.push(await fetchMediaForItem(media, id));
    }
  }

  return medias;
};


async function createManifestFrame(id: string, manifestMedias: any[], title: string, thumbnailUrl: string) {

  if (!manifestMedias || !Array.isArray(manifestMedias)) {
    throw new BadRequestException(
      'Manifest media items are required and must be an array.',
    );
  }

  if (!title) {
    throw new BadRequestException('Manifest title is required.');
  }

  // Create the initial structure for the manifest
  let manifestToCreate: ManifestJSON = {
    '@context': 'https://iiif.io/api/presentation/3/context.json',
    id: id,
    type: 'Manifest',
    label: { en: [title] },
    items: [],
    thumbnail: {},
  };

  if (thumbnailUrl.length > 0) {
    manifestToCreate = {
      ...manifestToCreate,
      thumbnail: {
        ['@id']: thumbnailUrl,
        service: {
          ['@context']: thumbnailUrl,
          ['@id']: thumbnailUrl,
          profile: thumbnailUrl,
        },
      },
    };
  }

  manifestToCreate.items = await getManifestMediasJSON(manifestMedias, id);

  return manifestToCreate;
}

@Injectable()
export class MediaInterceptor implements NestInterceptor {
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const label = serializeToValidUrl(request.body.title);
    const hash = generateAlphanumericSHA1Hash(
      `${label}${Date.now().toString()}`,
    );
    const id = `${process.env.CADDY_URL}/${hash}/${label}.json/`;
    const { manifestMedias, title, manifestThumbnail } = request.body;

    const manifestToCreate = await createManifestFrame(id, manifestMedias, title, manifestThumbnail);

    request.body.processedManifest = manifestToCreate;
    request.body.hash = hash;

    return next.handle();
  }
}

@Injectable()
export class UpdateProcessedManifestInterceptor implements NestInterceptor {
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const id = request.body.jsonID;
    const { manifestMedias, title, thumbnailUrl } = request.body;

    const manifestToCreate = await createManifestFrame(id, manifestMedias, title, thumbnailUrl);

    request.body.processedManifest = manifestToCreate;

    return next.handle();
  }
}
