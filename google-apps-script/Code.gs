/**
 * Polling Agent Training - Google Apps Script Backend
 * Deploy this as a Web App to handle all Google Sheets operations
 * 
 * Deployment Instructions:
 * 1. Open your Google Sheet
 * 2. Extensions > Apps Script
 * 3. Copy this entire code
 * 4. Save the project
 * 5. Deploy > New deployment
 * 6. Type: Web app
 * 7. Execute as: Me
 * 8. Who has access: Anyone
 * 9. Deploy and copy the Web App URL
 */

// Configuration - Edit this with your sheet details
const CONFIG = {
  SHEET_NAME: 'Sheet1', // Name of your sheet tab
  HEADERS: [
    'Mobile',
    'Name', 
    'NID',
    'Address',
    'Polling Center',
    'Video 1 Completed',
    'Video 2 Completed',
    'Registration Time',
    'Video 1 Completed Time',
    'Video 2 Completed Time'
  ]
};

/**
 * Main function that handles all HTTP requests
 */
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action;
    
    // Route to appropriate function based on action
    switch(action) {
      case 'checkUser':
        return checkUser(data.mobile);
      
      case 'register':
        return registerUser(data.userData);
      
      case 'completeVideo':
        return completeVideo(data.mobile, data.videoNumber);
      
      default:
        return createResponse(false, 'Invalid action');
    }
  } catch (error) {
    Logger.log('Error in doPost: ' + error.toString());
    return createResponse(false, 'Server error: ' + error.toString());
  }
}

/**
 * Handle GET requests (for testing)
 */
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({
      status: 'success',
      message: 'Polling Agent Training API is running',
      version: '1.0',
      timestamp: new Date().toISOString()
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Get the active spreadsheet
 */
function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(CONFIG.SHEET_NAME);
  
  // Create sheet if it doesn't exist
  if (!sheet) {
    sheet = ss.insertSheet(CONFIG.SHEET_NAME);
  }
  
  // Add headers if sheet is empty
  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, CONFIG.HEADERS.length).setValues([CONFIG.HEADERS]);
    sheet.getRange(1, 1, 1, CONFIG.HEADERS.length).setFontWeight('bold');
  }
  
  return sheet;
}

/**
 * Normalize mobile number for comparison (get last 10 digits)
 * Google Sheets automatically removes leading 0, so we compare last 10 digits
 */
function normalizeMobile(mobile) {
  if (mobile === null || mobile === undefined || mobile === '') return '';
  
  // Handle number type - convert to string without scientific notation
  var cleaned;
  if (typeof mobile === 'number') {
    // For large numbers, use toFixed(0) to avoid scientific notation
    cleaned = mobile.toFixed(0);
  } else {
    cleaned = String(mobile).trim();
  }
  
  // Remove any non-digit characters (spaces, dashes, etc.)
  cleaned = cleaned.replace(/\D/g, '');
  
  // If empty after cleaning, return empty string
  if (!cleaned || cleaned === '') return '';
  
  // If it's 11 digits starting with 0, return last 10 digits
  if (cleaned.length === 11 && cleaned.charAt(0) === '0') {
    return cleaned.substring(1);
  }
  
  // If it's already 10 digits, return as is
  if (cleaned.length === 10) {
    return cleaned;
  }
  
  // If it's more than 10 digits, return last 10 digits
  if (cleaned.length > 10) {
    return cleaned.substring(cleaned.length - 10);
  }
  
  // If it's less than 10 digits, pad with leading zeros
  // (This handles edge cases, but shouldn't normally happen)
  while (cleaned.length < 10) {
    cleaned = '0' + cleaned;
  }
  return cleaned;
}

/**
 * Check if a user exists by mobile number
 * Compares last 10 digits since Google Sheets removes leading 0
 */
function checkUser(mobile) {
  try {
    const sheet = getSheet();
    const data = sheet.getDataRange().getValues();
    
    // Normalize the input mobile number (get last 10 digits)
    const normalizedInput = normalizeMobile(mobile);
    
    // Debug logging
    Logger.log('Checking user with mobile: ' + mobile);
    Logger.log('Normalized input: ' + normalizedInput);
    
    // Skip header row
    for (let i = 1; i < data.length; i++) {
      // Normalize the stored mobile number (get last 10 digits)
      const storedValue = data[i][0];
      
      // Skip if stored value is null, undefined, or empty string
      if (storedValue === null || storedValue === undefined || storedValue === '') {
        continue;
      }
      
      const normalizedStored = normalizeMobile(storedValue);
      
      // Skip if normalization resulted in empty string
      if (!normalizedStored || normalizedStored === '') {
        continue;
      }
      
      // Debug logging for all rows (to help troubleshoot)
      Logger.log('Row ' + i + ' - Stored value: ' + storedValue + ' (type: ' + typeof storedValue + ')');
      Logger.log('Row ' + i + ' - Normalized stored: ' + normalizedStored);
      Logger.log('Row ' + i + ' - Normalized input: ' + normalizedInput);
      Logger.log('Row ' + i + ' - Match: ' + (String(normalizedStored) === String(normalizedInput)));
      
      // Compare last 10 digits (ensure both are strings for comparison)
      if (String(normalizedStored) === String(normalizedInput)) {
        // User found
        Logger.log('Match found at row ' + i);
        const userData = {
          mobile: String(data[i][0]), // Ensure mobile is returned as string
          name: data[i][1],
          nid: data[i][2],
          address: data[i][3],
          pollingCenter: data[i][4],
          video1Completed: data[i][5] === 'TRUE' || data[i][5] === true,
          video2Completed: data[i][6] === 'TRUE' || data[i][6] === true,
          registrationTime: data[i][7],
          video1CompletedTime: data[i][8],
          video2CompletedTime: data[i][9]
        };
        
        Logger.log('Returning success response with user data');
        return createResponse(true, 'User found', {
          exists: true,
          user: userData,
          debug: {
            inputMobile: mobile,
            normalizedInput: normalizedInput,
            matchedRow: i,
            matchedStoredValue: String(storedValue),
            normalizedStored: normalizedStored
          }
        });
      }
    }
    
    // User not found
    Logger.log('User not found after checking ' + (data.length - 1) + ' rows');
    Logger.log('Final normalized input was: ' + normalizedInput);
    return createResponse(true, 'User not found', {
      exists: false,
      user: null,
      debug: {
        inputMobile: mobile,
        normalizedInput: normalizedInput,
        totalRowsChecked: data.length - 1
      }
    });
    
  } catch (error) {
    Logger.log('Error in checkUser: ' + error.toString());
    return createResponse(false, 'Error checking user: ' + error.toString());
  }
}

/**
 * Register a new user
 */
function registerUser(userData) {
  try {
    const sheet = getSheet();
    
    // Check if user already exists
    const existingUser = checkUserExists(sheet, userData.mobile);
    if (existingUser) {
      return createResponse(false, 'User already exists');
    }
    
    // Prepare row data
    const timestamp = new Date().toISOString();
    const rowData = [
      userData.mobile,
      userData.name || '',
      userData.nid || '',
      userData.address || '',
      userData.pollingCenter || '',
      'FALSE',
      'FALSE',
      timestamp,
      '',
      ''
    ];
    
    // Append the new row
    sheet.appendRow(rowData);
    
    return createResponse(true, 'User registered successfully', {
      mobile: userData.mobile,
      registrationTime: timestamp
    });
    
  } catch (error) {
    Logger.log('Error in registerUser: ' + error.toString());
    return createResponse(false, 'Error registering user: ' + error.toString());
  }
}

/**
 * Mark video as completed
 */
function completeVideo(mobile, videoNumber) {
  try {
    const sheet = getSheet();
    const data = sheet.getDataRange().getValues();
    
    // Normalize the input mobile number (get last 10 digits)
    const normalizedInput = normalizeMobile(mobile);
    
    // Find user row
    let rowIndex = -1;
    for (let i = 1; i < data.length; i++) {
      // Normalize the stored mobile number (get last 10 digits)
      const normalizedStored = normalizeMobile(data[i][0]);
      
      // Compare last 10 digits
      if (normalizedStored === normalizedInput) {
        rowIndex = i + 1; // +1 because sheet rows are 1-indexed
        break;
      }
    }
    
    if (rowIndex === -1) {
      return createResponse(false, 'User not found');
    }
    
    const timestamp = new Date().toISOString();
    
    if (videoNumber === 1) {
      // Update Video 1 completion (column F = 6)
      sheet.getRange(rowIndex, 6).setValue('TRUE');
      // Update Video 1 completion time (column I = 9)
      sheet.getRange(rowIndex, 9).setValue(timestamp);
    } else if (videoNumber === 2) {
      // Update Video 2 completion (column G = 7)
      sheet.getRange(rowIndex, 7).setValue('TRUE');
      // Update Video 2 completion time (column J = 10)
      sheet.getRange(rowIndex, 10).setValue(timestamp);
    } else {
      return createResponse(false, 'Invalid video number');
    }
    
    return createResponse(true, `Video ${videoNumber} marked as completed`, {
      mobile: mobile,
      videoNumber: videoNumber,
      completionTime: timestamp
    });
    
  } catch (error) {
    Logger.log('Error in completeVideo: ' + error.toString());
    return createResponse(false, 'Error completing video: ' + error.toString());
  }
}

/**
 * Helper function to check if user exists (internal use)
 * Compares last 10 digits since Google Sheets removes leading 0
 */
function checkUserExists(sheet, mobile) {
  const data = sheet.getDataRange().getValues();
  
  // Normalize the input mobile number (get last 10 digits)
  const normalizedInput = normalizeMobile(mobile);
  
  for (let i = 1; i < data.length; i++) {
    // Normalize the stored mobile number (get last 10 digits)
    const normalizedStored = normalizeMobile(data[i][0]);
    
    // Compare last 10 digits
    if (normalizedStored === normalizedInput) {
      return true;
    }
  }
  return false;
}

/**
 * Create a standardized JSON response
 */
function createResponse(success, message, data = null) {
  const response = {
    success: success,
    message: message,
    timestamp: new Date().toISOString()
  };
  
  if (data) {
    response.data = data;
  }
  
  return ContentService
    .createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Test function - run this to verify your setup
 */
function testSetup() {
  Logger.log('Testing setup...');
  
  // Test 1: Check sheet access
  try {
    const sheet = getSheet();
    Logger.log('✓ Sheet access successful');
    Logger.log('Sheet name: ' + sheet.getName());
    Logger.log('Last row: ' + sheet.getLastRow());
  } catch (error) {
    Logger.log('✗ Sheet access failed: ' + error.toString());
    return;
  }
  
  // Test 2: Test user registration
  try {
    const testUser = {
      mobile: '01700000000',
      name: 'Test User',
      nid: '1234567890',
      address: 'Test Address',
      pollingCenter: 'Test Center'
    };
    
    const result = registerUser(testUser);
    Logger.log('✓ Registration test: ' + result.getContent());
  } catch (error) {
    Logger.log('✗ Registration test failed: ' + error.toString());
  }
  
  // Test 3: Test user check
  try {
    const checkResult = checkUser('01700000000');
    Logger.log('✓ Check user test: ' + checkResult.getContent());
  } catch (error) {
    Logger.log('✗ Check user test failed: ' + error.toString());
  }
  
  // Test 4: Test video completion
  try {
    const videoResult = completeVideo('01700000000', 1);
    Logger.log('✓ Video completion test: ' + videoResult.getContent());
  } catch (error) {
    Logger.log('✗ Video completion test failed: ' + error.toString());
  }
  
  Logger.log('Testing complete! Check the logs above.');
}

/**
 * Clean up test data - run this to remove test entries
 */
function cleanupTestData() {
  const sheet = getSheet();
  const data = sheet.getDataRange().getValues();
  
  // Find and delete test user rows
  for (let i = data.length - 1; i > 0; i--) {
    if (data[i][0] === '01700000000' || data[i][1] === 'Test User') {
      sheet.deleteRow(i + 1);
      Logger.log('Deleted test row ' + (i + 1));
    }
  }
  
  Logger.log('Cleanup complete!');
}

