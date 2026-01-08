/**
 * Google Sheets Integration via Google Apps Script Web App
 * This replaces the direct Google Sheets API approach with a simpler Web App method
 * 
 * Note: Mobile number normalization (comparing last 10 digits) is handled in Google Apps Script
 */

export interface UserData {
  mobile: string;
  name?: string;
  nid?: string;
  address?: string;
  pollingCenter?: string;
  video1Completed?: boolean;
  video2Completed?: boolean;
  registrationTime?: string;
  video1CompletedTime?: string;
  video2CompletedTime?: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
  timestamp?: string;
}

/**
 * Get the Google Apps Script Web App URL from environment variables
 */
function getWebAppUrl(): string {
  const url = process.env.GOOGLE_APPS_SCRIPT_URL;
  if (!url) {
    throw new Error('GOOGLE_APPS_SCRIPT_URL is not set in environment variables');
  }
  return url;
}

/**
 * Make a request to the Google Apps Script Web App
 */
async function makeRequest(action: string, data: any): Promise<ApiResponse> {
  const url = getWebAppUrl();
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action,
        ...data,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error making request to Google Apps Script:', error);
    throw error;
  }
}

/**
 * Check if a user exists by mobile number
 * Normalizes mobile number before sending to ensure proper matching
 */
export async function checkUserExists(mobile: string): Promise<UserData | null> {
  try {
    // Normalize mobile number for comparison (last 10 digits)
    // The Google Apps Script will handle the comparison properly
    console.log('Making request to Google Apps Script with mobile:', mobile);
    const response = await makeRequest('checkUser', { mobile });
    console.log('Google Apps Script response:', JSON.stringify(response, null, 2));
    
    if (response.success && response.data?.exists) {
      console.log('User exists, returning user data');
      return response.data.user;
    }
    
    console.log('User does not exist or response indicates no match');
    return null;
  } catch (error) {
    console.error('Error checking user:', error);
    throw error;
  }
}

/**
 * Register a new user
 */
export async function registerUser(userData: UserData): Promise<void> {
  try {
    const response = await makeRequest('register', { userData });
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to register user');
    }
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
}

/**
 * Update video completion status
 * Normalizes mobile number before sending to ensure proper matching
 */
export async function updateVideoCompletion(
  mobile: string,
  videoNumber: 1 | 2
): Promise<void> {
  try {
    // Mobile number is normalized in Google Apps Script for comparison
    const response = await makeRequest('completeVideo', {
      mobile,
      videoNumber,
    });
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to update video completion');
    }
  } catch (error) {
    console.error('Error updating video completion:', error);
    throw error;
  }
}
