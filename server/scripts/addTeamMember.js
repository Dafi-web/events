const mongoose = require('mongoose');
const TeamMember = require('../models/TeamMember');
require('dotenv').config({ path: '../.env' });

const addFikaduShewit = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected...');

    // Check if Fikadu already exists
    const existingMember = await TeamMember.findOne({ name: 'Fikadu Shewit' });
    if (existingMember) {
      console.log('Fikadu Shewit already exists in the database');
      return;
    }

    // Create Fikadu Shewit's profile
    const fikaduProfile = {
      name: 'Fikadu Shewit',
      position: 'Program Manager',
      bio: 'M.A. in English Literature, University lecturer with expertise in program development and educational management. M.Sc. in Telecommunications from a top 10 world university.',
      bioAmharic: 'በእንግሊዝኛ ስነ-ጽሁፍ M.A.፣ የዩኒቨርሲቲ አስተማሪ በፕሮግራም ልማት እና በትምህርት አያያዝ ሙያዊ። በቴሌኮሚዩኒኬሽን ውስጥ M.Sc. ከዓለም አቀፍ የታዋቂ ዩኒቨርሲቲ።',
      education: [
        {
          degree: 'M.A.',
          field: 'English Literature',
          institution: 'University',
          year: 'Recent',
          isTopUniversity: false
        },
        {
          degree: 'M.Sc.',
          field: 'Telecommunications',
          institution: 'Top 10 World University',
          year: 'Recent',
          isTopUniversity: true
        }
      ],
      expertise: [
        'Program Development',
        'Educational Management',
        'English Literature',
        'Telecommunications',
        'University Teaching',
        'Project Management'
      ],
      languages: ['English', 'Amharic'],
      isInstructor: true,
      isActive: true,
      order: 2,
      socialLinks: {
        email: 'fikadu.shewit@dafitech.org',
        linkedin: 'https://linkedin.com/in/fikadu-shewit'
      }
    };

    const teamMember = new TeamMember(fikaduProfile);
    await teamMember.save();

    console.log('✅ Fikadu Shewit added successfully to the team!');
    console.log('Profile details:', {
      name: teamMember.name,
      position: teamMember.position,
      education: teamMember.education.length,
      expertise: teamMember.expertise.length,
      isInstructor: teamMember.isInstructor
    });

  } catch (err) {
    console.error('Error adding team member:', err.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('MongoDB Disconnected.');
  }
};

addFikaduShewit();
