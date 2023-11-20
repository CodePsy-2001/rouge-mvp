import {
  Assets,
  extensions,
  ExtensionType,
  //  ResolverAssetsArray,
  resolveTextureUrl,
  ResolveURLParser,
  settings,
} from "pixi.js";

import manifest from "../src/manifest.json";

export const resolveJsonUrl = {
  extension: ExtensionType.ResolveParser,
  test: (value: string): boolean =>
    // needs type assertion
    // should be fixed in the next version of pixi (RETINA_PREFIX is of type RegEx)
    settings.RETINA_PREFIX!.test(value) && value.endsWith(".json"),
  parse: resolveTextureUrl.parse,
} as ResolveURLParser;

extensions.add(resolveJsonUrl);

export async function initAssets() {
  await Assets.init({ manifest });
  await Assets.loadBundle(["default"]);
  const allBundles = manifest.bundles.map((item) => item.name);
  await Assets.backgroundLoadBundle(allBundles);
}

export function isBundleLoaded(bundleName: string) {
  const bundleManifest = manifest.bundles.find((b) => b.name === bundleName);
  if (!bundleManifest) return false;

  return bundleManifest.assets.every((asset) => Assets.cache.has(asset.name as string));
}

export function areBundlesLoaded(bundles: string[]) {
  return bundles.every(isBundleLoaded);
}
