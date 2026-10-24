export interface Marker { id: string; before: string }
export interface Writer { update(marker: Marker): Promise<void> }

export async function restore(markers: Marker[], writer: Writer): Promise<void> {
  await Promise.all(markers.map((marker) => writer.update(marker)));
}
