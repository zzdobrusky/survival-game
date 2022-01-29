import { TiledResource } from '../Types/TiledResource';

export function extractPropertyFromTile<Type>(
  tiledResource: TiledResource,
  propName: string,
  propType: string,
  defaultPropValue: Type,
): Type {
  const foundDrops = tiledResource.properties.find((p) => p.name === propName);
  return foundDrops && typeof foundDrops.value === propType ? JSON.parse(foundDrops.value) : defaultPropValue;
}
