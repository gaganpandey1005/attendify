const cron = require("node-cron");
const teacherModel = require("../model/teacherModel");

cron.schedule("* * * * *", async () => {
  

  try {
    
    
    
    // Find unverified teachers before deletion
    const teachersToDelete = await teacherModel.find({
      isVerified: false,
      
    });

    

    if (teachersToDelete.length === 0) {
      
      return;
    }

    // Delete unverified teachers who are older than 1 minute
    const result = await teacherModel.deleteMany({
      isVerified: false,
      
    });

    
  } catch (error) {
    console.error("Error deleting unverified teachers:", error);
  }

  
});
