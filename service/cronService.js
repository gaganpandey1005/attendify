const cron = require("node-cron");
const teacherModel = require("../model/teacherModel");

cron.schedule("0 * * * *", async () => {
  console.log("Cron job started: Checking and deleting unverified teachers...");

  try {
    
    
    
    // Find unverified teachers before deletion
    const teachersToDelete = await teacherModel.find({
      isVerified: false,
      
    });

    // console.log(
    //   `Found ${teachersToDelete} unverified teachers for deletion.`
    // );

    if (teachersToDelete.length === 0) {
      console.log("No unverified teachers found for deletion.");
      return;
    }

    // Delete unverified teachers who are older than 1 minute
    const result = await teacherModel.deleteMany({
      isVerified: false,
      
    });

    console.log(`Deleted ${result.deletedCount} unverified teachers.`);
  } catch (error) {
    console.error("Error deleting unverified teachers:", error);
  }

  console.log("Cron job completed.");
});
