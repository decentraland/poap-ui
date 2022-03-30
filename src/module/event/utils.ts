function unique<T>(arr: T[]): T[] {
  return Array.from(new Set(arr).values())
}

export function parseCoordinates(rawCoordinates: string[]): string[] {
  return unique(rawCoordinates
    .map(function (rawCoordinates) {
      return rawCoordinates
        .split(/[\s;]+/gi)
        .map(function (coordinate) {
          const [x, y] = coordinate.split(',').map(Number)

          if (
            typeof x === 'number' &&
            typeof y === 'number' &&
            Number.isFinite(x) &&
            Number.isFinite(y)
          ) {
            return [x, y].join(',')
          }

          return null
        })
        .filter(Boolean)
        .sort() as string[]
    })
    .reduce(function (coordinates, current) {
      return [...coordinates, ...current]
    }, [] as string[]))
}