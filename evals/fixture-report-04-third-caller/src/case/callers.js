import { normalizeType, recordChange } from './activity.js';
export function editName(group, events) { recordChange(normalizeType(group.type), normalizeType(group.type), events); }
export function removeMember(group, events) { recordChange(normalizeType(group.type), normalizeType(group.type), events); }
export function addMember(group, events) { recordChange(group.type, normalizeType(group.type), events); }
