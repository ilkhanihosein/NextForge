/** Every action the log knows; messages: admin.activity.actions.<key>. */
export const AUDIT_ACTIONS = [
  "userInvite",
  "userRole",
  "userSuspend",
  "userReactivate",
  "userDelete",
  "passwordCheckFailed",
] as const;
export type AuditAction = (typeof AUDIT_ACTIONS)[number];

/** Actions that touch admin rights: the owners get an email for each. */
export const ALERT_ACTIONS: AuditAction[] = [
  "userInvite",
  "userRole",
  "userSuspend",
  "userDelete",
  "passwordCheckFailed",
];
