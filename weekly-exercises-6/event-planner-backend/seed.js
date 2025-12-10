import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import { connectDB } from './config/db.js';
import Event from './models/Event.js';
import User from './models/User.js';

dotenv.config();

const seedData = async () => {
    try {
        // Connect to database
        await connectDB();

        // Clear existing data (optional - comment out if you want to keep existing data)
        console.log('🗑️  Clearing existing data...');
        await Event.deleteMany({});
        await User.deleteMany({});
        console.log('✅ Existing data cleared');

        // Create sample users
        console.log('👤 Creating users...');
        const users = [
            {
                username: 'admin',
                password: 'admin123',
                role: 'admin'
            },
            {
                username: 'john',
                password: 'user123',
                role: 'user'
            },
            {
                username: 'sarah',
                password: 'user123',
                role: 'user'
            },
            {
                username: 'mike',
                password: 'user123',
                role: 'user'
            }
        ];

        const createdUsers = [];
        for (const userData of users) {
            const passwordHash = await bcrypt.hash(userData.password, 10);
            const user = await User.create({
                username: userData.username,
                passwordHash,
                role: userData.role
            });
            createdUsers.push(user);
            console.log(`✅ Created user: ${user.username} (${user.role})`);
        }

        // Create sample events
        console.log('📅 Creating events...');
        const events = [
            {
                title: 'Team Meeting',
                date: new Date('2025-01-15T10:00:00Z'),
                location: 'Conference Room A',
                type: 'meeting'
            },
            {
                title: 'Project Deadline',
                date: new Date('2025-01-20T17:00:00Z'),
                location: 'Office',
                type: 'meeting'
            },
            {
                title: 'Sarah\'s Birthday Party',
                date: new Date('2025-01-25T18:00:00Z'),
                location: 'Restaurant Downtown',
                type: 'birthday'
            },
            {
                title: 'Final Exam - Web Development',
                date: new Date('2025-02-01T09:00:00Z'),
                location: 'TAMK A123',
                type: 'exam'
            },
            {
                title: 'Midterm Exam - Database Systems',
                date: new Date('2025-01-28T14:00:00Z'),
                location: 'TAMK B456',
                type: 'exam'
            },
            {
                title: 'Client Presentation',
                date: new Date('2025-01-18T13:00:00Z'),
                location: 'Virtual Meeting',
                type: 'meeting'
            },
            {
                title: 'John\'s Birthday',
                date: new Date('2025-02-05T12:00:00Z'),
                location: 'Home',
                type: 'birthday'
            },
            {
                title: 'Workshop: React Advanced',
                date: new Date('2025-01-22T10:00:00Z'),
                location: 'Training Center',
                type: 'other'
            },
            {
                title: 'Code Review Session',
                date: new Date('2025-01-17T15:00:00Z'),
                location: 'Development Room',
                type: 'meeting'
            },
            {
                title: 'Quarterly Exam',
                date: new Date('2025-02-10T09:00:00Z'),
                location: 'Main Hall',
                type: 'exam'
            }
        ];

        const createdEvents = await Event.insertMany(events);
        console.log(`✅ Created ${createdEvents.length} events`);

        // Display summary
        console.log('\n📊 Database Seeding Summary:');
        console.log(`   Users: ${createdUsers.length}`);
        console.log(`   Events: ${createdEvents.length}`);
        console.log('\n✨ Seeding completed successfully!');
        console.log('\n💡 Test credentials:');
        console.log('   Admin: username="admin", password="admin123"');
        console.log('   User:  username="john", password="user123"');

        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding error:', error);
        process.exit(1);
    }
};

seedData();

