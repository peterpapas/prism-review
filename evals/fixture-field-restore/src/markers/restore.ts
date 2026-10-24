export interface Marker { id: string; before: string; expected: string }
export interface Writer { updateIfUnchanged(marker: Marker): Promise<{ count: number }> }
export class MarkerConflict extends Error {}

export async function restore(markers: Marker[], writer: Writer): Promise<void> {
  const ordered = [...markers].sort((a, b) => a.id.localeCompare(b.id));
  for (const marker of ordered) {
    const result = await writer.updateIfUnchanged(marker);
    if (result.count !== 1) throw new MarkerConflict('marker changed');
  }
}
