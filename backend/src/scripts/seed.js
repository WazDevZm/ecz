import dotenv from 'dotenv';
import connectDB from '../config/database.js';
import User from '../models/User.model.js';
import Party from '../models/Party.model.js';
import Candidate from '../models/Candidate.model.js';
import Province from '../models/Province.model.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    await connectDB();

    console.log('🌱 Seeding database...');

    // Clear existing data
    await User.deleteMany({});
    await Party.deleteMany({});
    await Candidate.deleteMany({});
    await Province.deleteMany({});

    // Create admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@zedpulse.zm',
      password: 'Admin@2026',
      role: 'admin'
    });
    console.log('✅ Admin user created');

    // Create parties
    const parties = await Party.create([
      {
        name: 'United Party for National Development',
        abbreviation: 'UPND',
        color: '#dc2626',
        keywords: ['upnd', 'united party', 'hh', 'hakainde'],
        leader: 'Hakainde Hichilema',
        isActive: true
      },
      {
        name: 'Patriotic Front',
        abbreviation: 'PF',
        color: '#16a34a',
        keywords: ['pf', 'patriotic front', 'ecl', 'lungu'],
        leader: 'Edgar Lungu',
        isActive: true
      },
      {
        name: 'Socialist Party',
        abbreviation: 'SP',
        color: '#f59e0b',
        keywords: ['socialist party', 'sp', 'fred'],
        leader: 'Fred M\'membe',
        isActive: true
      },
      {
        name: 'United Kwacha Alliance',
        abbreviation: 'UKA',
        color: '#3b82f6',
        keywords: ['uka', 'united kwacha', 'alliance'],
        isActive: true
      }
    ]);
    console.log('✅ Parties created');

    // Create candidates
    const candidates = await Candidate.create([
      {
        name: 'Hakainde Hichilema',
        party: parties[0]._id,
        position: 'president',
        keywords: ['hh', 'hakainde', 'hichilema', 'bally'],
        isActive: true
      },
      {
        name: 'Edgar Lungu',
        party: parties[1]._id,
        position: 'president',
        keywords: ['ecl', 'edgar', 'lungu'],
        isActive: true
      },
      {
        name: 'Fred M\'membe',
        party: parties[2]._id,
        position: 'president',
        keywords: ['fred', 'mmembe', 'dr fred'],
        isActive: true
      }
    ]);
    console.log('✅ Candidates created');

    // Create provinces
    const provinces = await Province.create([
      { name: 'Lusaka', code: 'LSK', capital: 'Lusaka' },
      { name: 'Copperbelt', code: 'CPB', capital: 'Ndola' },
      { name: 'Southern', code: 'STH', capital: 'Choma' },
      { name: 'Eastern', code: 'EST', capital: 'Chipata' },
      { name: 'Northern', code: 'NTH', capital: 'Kasama' },
      { name: 'Luapula', code: 'LUA', capital: 'Mansa' },
      { name: 'North-Western', code: 'NWE', capital: 'Solwezi' },
      { name: 'Western', code: 'WST', capital: 'Mongu' },
      { name: 'Central', code: 'CTR', capital: 'Kabwe' },
      { name: 'Muchinga', code: 'MCH', capital: 'Chinsali' }
    ]);
    console.log('✅ Provinces created');

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📝 Admin credentials:');
    console.log('Email: admin@zedpulse.zm');
    console.log('Password: Admin@2026');
    console.log('\n⚠️  Please change the admin password after first login!\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();
