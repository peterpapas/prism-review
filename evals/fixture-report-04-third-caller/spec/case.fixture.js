import { addMember } from '../src/case/callers.js';
const events = [];
addMember({ type: undefined }, events);
if (events[0] !== 'group type changed to standard') throw new Error('unexpected message');
