import dbConnect from '../lib/db';
import AdminUser from '../models/AdminUser';
import Inquiry from '../models/Inquiry';
import PasswordResetToken from '../models/PasswordResetToken';

async function reset() {
  try {
    console.log('🗑️ Starting database reset...');

    // Connect to database
    await dbConnect();
    console.log('✅ Connected to database');

    // Clear all collections
    await AdminUser.deleteMany({});
    await Inquiry.deleteMany({});
    await PasswordResetToken.deleteMany({});

    console.log('🧹 Cleared all data from database');
    console.log('✅ Database reset completed successfully!');
  } catch (error) {
    console.error('❌ Reset failed:', error);
    process.exit(1);
  }
}

// Run reset if called directly
if (require.main === module) {
  reset()
    .then(() => {
      console.log('✅ Reset script finished');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Reset script failed:', error);
      process.exit(1);
    });
}

export default reset;
