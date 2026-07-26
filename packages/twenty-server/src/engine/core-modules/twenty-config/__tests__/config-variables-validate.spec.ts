import { StorageDriverType } from 'src/engine/core-modules/file-storage/interfaces/file-storage.interface';
import { validate } from 'src/engine/core-modules/twenty-config/config-variables';
import { ConfigVariableException } from 'src/engine/core-modules/twenty-config/twenty-config.exception';

describe('config variables validate', () => {
  it('applies valid values', () => {
    expect(validate({ STORAGE_TYPE: 's3' }).STORAGE_TYPE).toBe(
      StorageDriverType.S_3,
    );
  });

  it('treats empty-string env vars as unset and applies defaults', () => {
    // compose resolves unset `VAR: ${VAR}` lines to '' (#21035)
    const config = validate({
      STORAGE_TYPE: '',
      STORAGE_S3_REGION: '',
      STORAGE_S3_NAME: '',
      FALLBACK_ENCRYPTION_KEY: '',
    });

    expect(config.STORAGE_TYPE).toBe(StorageDriverType.LOCAL);
    expect(config.STORAGE_LOCAL_PATH).toBe('.local-storage');
  });

  it('still rejects invalid non-empty values', () => {
    expect(() => validate({ STORAGE_TYPE: 'floppy-disk' })).toThrow(
      ConfigVariableException,
    );
  });
});
