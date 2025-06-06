const { Sequelize } = require('sequelize');
require('dotenv').config();

// Create sequelize instance
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: console.log
  }
);

async function fixMigrationConflict() {
  try {
    console.log('🔧 Attempting to fix migration conflict...\n');
    
    // Test connection
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.\n');
    
    // Check if SequelizeMeta table exists
    console.log('1️⃣ Checking SequelizeMeta table...');
    try {
      const [metaExists] = await sequelize.query(`
        SELECT to_regclass('public."SequelizeMeta"') as table_exists;
      `);
      
      if (metaExists[0].table_exists) {
        console.log('✅ SequelizeMeta table exists');
        
        // Check current migrations
        const [migrations] = await sequelize.query(`
          SELECT name FROM "SequelizeMeta" ORDER BY name;
        `);
        
        console.log('📋 Recorded migrations:');
        migrations.forEach(row => {
          console.log(`   - ${row.name}`);
        });
        
        // Check if our problematic migration is recorded
        const membersMigrationExists = migrations.some(row => 
          row.name === '20250606045231-create-members.js'
        );
        
        if (membersMigrationExists) {
          console.log('✅ Members migration is already recorded as completed');
        } else {
          console.log('❌ Members migration is NOT recorded as completed');
          console.log('🔧 This explains the conflict - the table exists but migration is not recorded');
        }
        
      } else {
        console.log('❌ SequelizeMeta table does not exist');
        console.log('🔧 Need to create SequelizeMeta table first');
      }
    } catch (error) {
      console.log('❌ Error checking SequelizeMeta:', error.message);
    }
    
    // Check if members table exists
    console.log('\n2️⃣ Checking members table...');
    const [tablesResult] = await sequelize.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'members';
    `);
    
    const membersTableExists = tablesResult.length > 0;
    console.log(`   Members table exists: ${membersTableExists ? '✅ YES' : '❌ NO'}`);
    
    if (membersTableExists) {
      // Check indexes
      console.log('\n3️⃣ Checking existing indexes on members table...');
      const [indexesResult] = await sequelize.query(`
        SELECT 
          indexname,
          indexdef
        FROM pg_indexes 
        WHERE tablename = 'members' 
        ORDER BY indexname;
      `);
      
      console.log(`   Found ${indexesResult.length} indexes:`);
      indexesResult.forEach(row => {
        console.log(`   - ${row.indexname}`);
      });
      
      // Check specifically for the conflicting indexes
      const conflictingIndexes = indexesResult.filter(row => 
        row.indexname === 'members_dni' || 
        row.indexname.includes('members_') && row.indexname.includes('dni')
      );
      
      if (conflictingIndexes.length > 0) {
        console.log('\n🎯 Found conflicting indexes:');
        conflictingIndexes.forEach(row => {
          console.log(`   - ${row.indexname}: ${row.indexdef}`);
        });
      }
    }
    
    // Provide solutions
    console.log('\n🛠️  AUTOMATED SOLUTIONS:\n');
    
    if (membersTableExists) {
      console.log('Option 1: Mark migration as completed (recommended if table structure is correct)');
      console.log('   This will tell Sequelize that the migration has already been applied');
      
      const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
      });
      
      readline.question('Do you want to mark the members migration as completed? (y/N): ', async (answer) => {
        if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
          try {
            // Ensure SequelizeMeta table exists
            await sequelize.query(`
              CREATE TABLE IF NOT EXISTS "SequelizeMeta" (
                name VARCHAR(255) NOT NULL PRIMARY KEY
              );
            `);
            
            // Insert the migration record
            await sequelize.query(`
              INSERT INTO "SequelizeMeta" (name) 
              VALUES ('20250606045231-create-members.js')
              ON CONFLICT (name) DO NOTHING;
            `);
            
            console.log('✅ Migration marked as completed successfully!');
            console.log('   You can now run other migrations without conflicts');
            
          } catch (error) {
            console.log('❌ Error marking migration as completed:', error.message);
          }
        } else {
          console.log('\n📝 Manual solutions:');
          console.log('1. Drop the existing members table and run migration fresh:');
          console.log('   DROP TABLE IF EXISTS members CASCADE;');
          console.log('   Then run: npx sequelize-cli db:migrate');
          
          console.log('\n2. Or manually insert into SequelizeMeta:');
          console.log(`   INSERT INTO "SequelizeMeta" (name) VALUES ('20250606045231-create-members.js');`);
        }
        
        readline.close();
        await sequelize.close();
      });
      
    } else {
      console.log('❌ Members table does not exist - you can run the migration normally');
      await sequelize.close();
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.message.includes('ECONNREFUSED')) {
      console.log('\n💡 PostgreSQL is not running. Please start PostgreSQL service first:');
      console.log('   - Windows (WSL): sudo service postgresql start');
      console.log('   - Docker: docker start your-postgres-container');
      console.log('   - Native Windows: Start PostgreSQL service from Services');
    }
    await sequelize.close();
  }
}

fixMigrationConflict();