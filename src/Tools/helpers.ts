import { TileResource } from '../Types/TileResource';

export function extractPropertyFromTile<Type>(
  tile: TileResource,
  propName: string,
  propType: string,
  defaultPropValue: Type,
): Type {
  const foundDrops = tile.properties.find((p) => p.name === propName);
  return foundDrops && typeof foundDrops.value === propType ? JSON.parse(foundDrops.value) : defaultPropValue;
}
