import * as migration_20260118_010053 from './20260118_010053';
import * as migration_20260118_215758 from './20260118_215758';
import * as migration_20260122_181931 from './20260122_181931';
import * as migration_20260125_024039 from './20260125_024039';
import * as migration_20260204_210220 from './20260204_210220';
import * as migration_20260205_022153 from './20260205_022153';

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
    name: '20260205_022153'
  },
];
