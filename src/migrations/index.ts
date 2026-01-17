import * as migration_20251030_154608 from './20251030_154608';
import * as migration_20251114_231544 from './20251114_231544';
import * as migration_20251116_161250 from './20251116_161250';
import * as migration_20260117_075704 from './20260117_075704';
import * as migration_20260117_180933 from './20260117_180933';

export const migrations = [
  {
    up: migration_20251030_154608.up,
    down: migration_20251030_154608.down,
    name: '20251030_154608',
  },
  {
    up: migration_20251114_231544.up,
    down: migration_20251114_231544.down,
    name: '20251114_231544',
  },
  {
    up: migration_20251116_161250.up,
    down: migration_20251116_161250.down,
    name: '20251116_161250',
  },
  {
    up: migration_20260117_075704.up,
    down: migration_20260117_075704.down,
    name: '20260117_075704',
  },
  {
    up: migration_20260117_180933.up,
    down: migration_20260117_180933.down,
    name: '20260117_180933'
  },
];
