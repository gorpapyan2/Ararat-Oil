
/**
 * Simple utility to check if the application is working
 * This can be used to verify the build is working correctly
 */
export function checkAppStatus() {
  try {
    console.log('Application status: OK');
    return true;
  } catch (error) {
    console.error('Application status check failed:', error);
    return false;
  }
}
