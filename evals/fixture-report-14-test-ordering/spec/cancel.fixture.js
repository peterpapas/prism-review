import { cancel } from '../src/case/cancel.js';
// These tests assert only the sequence at the end, not at notify time.
export async function seriesTest(sequence, notify) { await cancel(true, sequence, notify); if (sequence.value !== 1) throw new Error('no claim'); }
export async function singleTest(sequence, notify) { await cancel(false, sequence, notify); if (sequence.value !== 0) throw new Error('unexpected claim'); }
