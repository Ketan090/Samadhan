// Role-based notification feed helpers. ROLE_TYPES mirrors
// backend/src/models/Notification.ts ROLE_NOTIFICATION_TYPES —
// keep the two maps in sync when adding types.
export type Role = 'citizen' | 'university' | 'industry' | 'government' | 'expert' | 'admin';

export const ROLE_TYPES: Record<Role, string[]> = {
  citizen: ['challenge-approval', 'status-change', 'government-response', 'deadline'],
  university: ['challenge-approval', 'collaboration-request', 'solution-submission', 'task-assignment', 'deadline'],
  industry: ['collaboration-request', 'solution-submission', 'task-assignment', 'deadline'],
  government: ['challenge-approval', 'solution-submission', 'status-change', 'government-response', 'deadline'],
  expert: ['expert-evaluation', 'solution-submission', 'task-assignment', 'deadline'],
  admin: ['challenge-approval', 'collaboration-request', 'solution-submission', 'expert-evaluation', 'task-assignment', 'deadline', 'status-change', 'government-response'],
};

export const TYPE_META: Record<string, { label: string }> = {
  'challenge-approval': { label: 'Approval' },
  'collaboration-request': { label: 'Collaboration' },
  'solution-submission': { label: 'Solution' },
  'expert-evaluation': { label: 'Evaluation' },
  'task-assignment': { label: 'Task' },
  deadline: { label: 'Deadline' },
  'status-change': { label: 'Status' },
  'government-response': { label: 'Gov reply' },
};

export interface FeedItem {
  id: string;
  type: string;
  audience?: string;
  personal?: boolean;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

const ago = (mins: number) => new Date(Date.now() - mins * 60000).toISOString();

// Offline/demo fallback — shown when the backend is unreachable, filtered
// by the signed-in role exactly like the live feed.
export const DEMO_NOTIFICATIONS: Record<Role, FeedItem[]> = {
  citizen: [
    { id: 'd-c1', type: 'status-change', audience: 'citizen', title: 'Your ward report was verified', message: 'Overflowing waste bins near Main Road is now verified and queued for matching.', read: false, createdAt: ago(25) },
    { id: 'd-c2', type: 'government-response', audience: 'citizen', title: 'Municipality replied', message: 'Waterlogging at Station Road — cleanup crew assigned, ETA 48 hours.', read: false, createdAt: ago(180) },
    { id: 'd-c3', type: 'deadline', audience: 'all', title: 'Weekly civic digest is live', message: '156 challenges tracked, 12 pilots running. Open your dashboard.', read: true, createdAt: ago(1500) },
  ],
  university: [
    { id: 'd-u1', type: 'collaboration-request', audience: 'university', title: 'Invite from EcoTech Solutions', message: 'Co-develop the SmartBin pilot. Review and respond from Collaborate.', read: false, createdAt: ago(50) },
    { id: 'd-u2', type: 'task-assignment', audience: 'university', title: 'Pilot milestone due Friday', message: 'SmartBin ward-5 sensor deployment milestone is due this Friday.', read: false, createdAt: ago(400) },
    { id: 'd-u3', type: 'solution-submission', audience: 'university', title: 'Student team submitted AquaGuard', message: 'A 4-member team submitted a water-quality solution for review.', read: true, createdAt: ago(1400) },
  ],
  industry: [
    { id: 'd-i1', type: 'solution-submission', audience: 'industry', title: 'TrafficPulse pilot results are in', message: '80% efficiency, 500K commuters impacted. Review before scale-up.', read: false, createdAt: ago(90) },
    { id: 'd-i2', type: 'collaboration-request', audience: 'industry', title: 'IIT Bombay seeks pilot partner', message: 'AquaGuard needs an industry partner for manufacturing scale-up.', read: false, createdAt: ago(700) },
    { id: 'd-i3', type: 'deadline', audience: 'all', title: 'Weekly civic digest is live', message: '156 challenges tracked, 12 pilots running. Open your dashboard.', read: true, createdAt: ago(1500) },
  ],
  government: [
    { id: 'd-g1', type: 'challenge-approval', audience: 'government', title: '12 reports awaiting verification', message: 'Ranchi zone has 12 citizen reports pending, 3 marked critical.', read: false, createdAt: ago(35) },
    { id: 'd-g2', type: 'solution-submission', audience: 'government', title: 'SmartBin ready for pilot sign-off', message: 'University + industry partners request government pilot approval.', read: false, createdAt: ago(500) },
    { id: 'd-g3', type: 'government-response', audience: 'government', title: 'Response SLA report', message: 'Ward-5 avg response time improved to 36 hours this week.', read: true, createdAt: ago(1600) },
  ],
  expert: [
    { id: 'd-e1', type: 'expert-evaluation', audience: 'expert', title: '3 solutions need your scores', message: 'SmartBin, TrafficPulse and AquaGuard await impact/feasibility scores.', read: false, createdAt: ago(65) },
    { id: 'd-e2', type: 'task-assignment', audience: 'expert', title: 'Review panel on Thursday', message: 'You are on the review panel for 2 pilot evaluations, 11 AM.', read: false, createdAt: ago(900) },
    { id: 'd-e3', type: 'solution-submission', audience: 'expert', title: 'New solution in your domain', message: 'A waste-management solution matching your expertise was submitted.', read: true, createdAt: ago(1300) },
  ],
  admin: [
    { id: 'd-a1', type: 'status-change', audience: 'admin', title: 'Nightly audit completed', message: 'All queues healthy. 2 challenges auto-escalated on SLA breach.', read: false, createdAt: ago(20) },
    { id: 'd-a2', type: 'challenge-approval', audience: 'admin', title: '5 challenges need moderation', message: 'Flagged duplicates awaiting admin review before publishing.', read: false, createdAt: ago(300) },
    { id: 'd-a3', type: 'deadline', audience: 'all', title: 'Weekly civic digest is live', message: '156 challenges tracked, 12 pilots running across zones.', read: true, createdAt: ago(1500) },
  ],
};

export function timeAgo(iso: string): string {
  const mins = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.round(hrs / 24)}d ago`;
}
