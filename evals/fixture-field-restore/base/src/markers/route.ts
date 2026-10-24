import { restore, type Marker, type Writer } from './restore.ts';

export interface Database { transaction<T>(work: (writer: Writer) => Promise<T>): Promise<T> }

export async function handleRestore(markers: Marker[], db: Database): Promise<void> {
  await db.transaction((writer) => restore(markers, writer));
}
