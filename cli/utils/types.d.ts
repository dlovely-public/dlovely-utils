export interface PackageJson {
  private?: boolean;
  name: string;
  version: string;
  description?: string;
  private?: true;
  main: string;
  types?: string;
  type?: "module" | "commonjs";
  scripts?: Record<string, string>;
  keywords?: string[];
  authors?: string[];
  license?: string;
  devDependencies?: Record<string, string>;
  dependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
}

export interface PackageInfo {
  name: string;
  path: string;
  pkg: string;
}
