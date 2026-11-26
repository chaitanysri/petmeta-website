export function authErrorMessage(error: unknown): string {
  const code = (error as { code?: string })?.code;
  switch (code) {
    case 'auth/account-exists-with-different-credential': return 'This email already uses a different sign-in method. Sign in with your existing password to connect Google, then try Google again if needed.';
    case 'auth/email-already-in-use': return 'This email already has an account. Choose Sign In, or reset your password.';
    case 'auth/invalid-credential':
    case 'auth/user-not-found':
    case 'auth/wrong-password': return 'Email or password is incorrect. Try again, or choose Forgot password.';
    case 'auth/invalid-email': return 'Enter a valid email address.';
    case 'auth/weak-password': return 'Choose a stronger password with at least 8 characters.';
    case 'auth/operation-not-allowed': return 'This sign-in method is not enabled yet. Use email and password.';
    case 'auth/unauthorized-domain': return 'This website address is not authorized for social sign-in yet. Use email and password.';
    case 'auth/popup-closed-by-user': return 'The sign-in window was closed. Please try again.';
    case 'auth/popup-blocked': return 'Allow pop-ups for this website, then try again.';
    case 'auth/network-request-failed': return 'Unable to connect. Check your internet connection and try again.';
    case 'auth/too-many-requests': return 'Too many attempts. Please wait before trying again.';
    case 'auth/user-disabled': return 'This account has been disabled. Please contact support.';
    case 'auth/expired-action-code': return 'This reset link has expired. Request a new one to continue.';
    case 'auth/invalid-action-code': return 'This reset link is invalid or has already been used. Request a new one to continue.';
    case 'auth/requires-recent-login': return 'For your security, please sign in again and retry.';
    default: return 'Sign-in could not finish. Please try again.';
  }
}
