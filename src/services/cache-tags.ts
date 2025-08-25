export type ServiceName =
  | 'talents'
  | 'technicalReference'
  | 'interactions'
  | 'users';

export const CACHE_TAGS = {
  talents: {
    all: 'talents',
  },
  technicalReference: {
    all: 'technicalReference',
  },
  interactions: {
    all: 'interactions',
  },
  users: {
    all: 'users',
  }
} as const;

export const getCacheTag = <T extends ServiceName>(
  service: T,
  tag: keyof (typeof CACHE_TAGS)[T],
  ...params: string[]
): string => {
  const cacheTag = CACHE_TAGS[service][tag];
  if (typeof cacheTag === 'function') {
    return cacheTag(...params);
  }
  return cacheTag as string;
};
