import * as migration_20260118_010053 from './20260118_010053';
import * as migration_20260118_215758 from './20260118_215758';
import * as migration_20260122_181931 from './20260122_181931';
import * as migration_20260125_024039 from './20260125_024039';
import * as migration_20260204_210220 from './20260204_210220';
import * as migration_20260205_022153 from './20260205_022153';
import * as migration_20260207_234829 from './20260207_234829';
import * as migration_20260208_003954 from './20260208_003954';
import * as migration_20260211_210936 from './20260211_210936';
import * as migration_20260216_034511 from './20260216_034511';

export const migrations = [
  {
    up: migration_20260118_010053.up,
    down: migration_20260118_010053.down,
    name: '20260118_010053',
  },
  {
    up: migration_20260118_215758.up,
    down: migration_20260118_215758.down,
    name: '20260118_215758',
  },
  {
    up: migration_20260122_181931.up,
    down: migration_20260122_181931.down,
    name: '20260122_181931',
  },
  {
    up: migration_20260125_024039.up,
    down: migration_20260125_024039.down,
    name: '20260125_024039',
  },
  {
    up: migration_20260204_210220.up,
    down: migration_20260204_210220.down,
    name: '20260204_210220',
  },
  {
    up: migration_20260205_022153.up,
    down: migration_20260205_022153.down,
    name: '20260205_022153',
  },
  {
    up: migration_20260207_234829.up,
    down: migration_20260207_234829.down,
    name: '20260207_234829',
  },
  {
    up: migration_20260208_003954.up,
    down: migration_20260208_003954.down,
    name: '20260208_003954',
  },
  {
    up: migration_20260211_210936.up,
    down: migration_20260211_210936.down,
    name: '20260211_210936',
  },
  {
    up: migration_20260216_034511.up,
    down: migration_20260216_034511.down,
    name: '20260216_034511'
  },
];
