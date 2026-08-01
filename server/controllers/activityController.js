// ============================================
// Activity Controller
// ============================================

// GET /api/activity/git
export const getGitStatus = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      changedFiles: 3,
      branch: "main",
      commitsAhead: 1,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET /api/activity/notifications
export const getNotifications = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      count: 5,
      notifications: [
        {
          id: 1,
          title: "Welcome to SyncSpace",
        },
        {
          id: 2,
          title: "Room synchronized",
        },
      ],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};