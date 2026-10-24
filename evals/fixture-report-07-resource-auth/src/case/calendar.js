export async function syncMeeting(user, meetingId, db, calendar) {
  if (!user) throw new Error('login required');
  const meeting = await db.getMeeting(meetingId);
  await db.assertCanEdit(user, meeting);
  await calendar.push(meeting.ownerCalendar, meeting);
}
