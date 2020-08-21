import * as semver from 'semver';
import * as io from '@actions/io';
import * as execm from './exec';

export const isECR = async (registry: string): Promise<boolean> => {
  return registry.includes('amazonaws');
};

export const getCLI = async (): Promise<string> => {
  return io.which('aws', true);
};

export const getCLIVersion = async (): Promise<string | undefined> => {
  return execm.exec('aws', ['--version'], true).then(res => {
    if (res.stderr != '' && !res.success) {
      throw new Error(res.stderr);
    }
    return parseCLIVersion(res.stdout);
  });
};

export const parseCLIVersion = async (stdout: string): Promise<string | undefined> => {
  const matches = /aws-cli\/([0-9.]+)/.exec(stdout);
  if (matches) {
    return semver.clean(matches[1]);
  }
  return undefined;
};

export const getRegion = async (registry: string): Promise<string> => {
  return registry.substring(registry.indexOf('ecr.') + 4, registry.indexOf('.amazonaws'));
};
