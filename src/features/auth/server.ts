import "server-only";

/** Server-only public API of the auth feature. */
export { auth, type Session } from "./services/auth";
export { verifyOwnPassword } from "./services/password-check";
export {
  authorize,
  getSession,
  requireAdmin,
  requireOwner,
  requireSession,
} from "./services/session";
export { findPendingInvitation, sendInvitation } from "./services/invitations";
export { account, invitation, user } from "./db/schema";
