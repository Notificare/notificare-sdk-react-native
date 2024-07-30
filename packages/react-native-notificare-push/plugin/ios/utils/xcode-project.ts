export function getConfigReferences(proj: any, name: string): string[] {
  const references = [];
  const config = proj.hash.project.objects['XCBuildConfiguration'];

  for (const ref in config) {
    if (
      config[ref].buildSettings &&
      config[ref].buildSettings.PRODUCT_NAME &&
      config[ref].buildSettings.PRODUCT_NAME.includes(name)
    ) {
      references.push(ref);
    }
  }

  return references;
}
