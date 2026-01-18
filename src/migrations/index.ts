import * as migration_20260118_010053 from './20260118_010053';
import * as migration_20260118_215758 from './20260118_215758';

export const migrations = [
  {
    up: migration_20260118_010053.up,
    down: migration_20260118_010053.down,
    name: '20260118_010053',
  },
  {
    up: migration_20260118_215758.up,
    down: migration_20260118_215758.down,
    name: '20260118_215758'
  },
];
