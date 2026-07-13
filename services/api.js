/**
 * Mock API service for EduPlay Kids Phase 1 MVP
 */

// Dummy User Profile Data
export const getUserProfile = async () => {
  return {
    id: "child-123",
    name: "Leo",
    currentModule: "shapes",
    currentLevel: 1,
  };
};

/**
 * Endpoint to trigger Parent App dashboard sync, anti-gravity logic, and PDF report generation.
 * 
 * @param {string} childId 
 * @param {number} loopLevel (1, 2, or 3 max scaffolding)
 * @param {number} accuracy (0-100)
 */
export const syncGameLoopData = async (childId, loopLevel, accuracy) => {
  console.log(`[API MOCK] syncGameLoopData called:
    Child ID: ${childId}
    Loop Fallback Level: ${loopLevel}
    Accuracy: ${accuracy}%
    ...This data will trigger the Parent App Dashboard sync and Red Flag/PDF generation in Phase 2.
  `);

  // Simulate network delay
  return new Promise((resolve) => setTimeout(resolve, 500));
};
