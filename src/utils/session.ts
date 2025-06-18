
/**
 * Utility for session type checking.
 */

export const GUEST_KEY = "open_as_guest";

/**
 * Returns true if the app is in guest mode, i.e., localStorage has the guest flag.
 */
export function isGuestSession(): boolean {
  return typeof window !== "undefined" && localStorage.getItem(GUEST_KEY) === "true";
}
