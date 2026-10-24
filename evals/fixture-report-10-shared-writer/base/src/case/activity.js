export function addActivity(group, message, now) {
  group.lastActivity = { messageId: message.id, timestamp: message.createdAt };
}
