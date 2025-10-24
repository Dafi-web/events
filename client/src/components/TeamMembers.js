import React, { useState, useEffect } from 'react';
import { GraduationCap, Globe, Mail, Linkedin, Award, Users, BookOpen } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import api from '../utils/api';

const TeamMembers = ({ showInstructorsOnly = false }) => {
  const { t, language } = useLanguage();
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const endpoint = showInstructorsOnly ? '/team/instructors' : '/team';
        const response = await api.get(endpoint);
        setTeamMembers(response.data);
      } catch (error) {
        console.error('Error fetching team members:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamMembers();
  }, [showInstructorsOnly]);

  const getBio = (member) => {
    return language === 'am' ? member.bioAmharic : member.bio;
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-gray-100 animate-pulse rounded-lg p-6 h-96"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {teamMembers.map((member) => (
        <div key={member._id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
          {/* Profile Image */}
          <div className="relative h-48 bg-gradient-to-br from-primary-500 to-primary-700">
            {member.profileImage ? (
              <img 
                src={member.profileImage} 
                alt={member.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Users className="w-16 h-16 text-white opacity-50" />
              </div>
            )}
            
            {/* Top University Badge */}
            {member.education?.some(edu => edu.isTopUniversity) && (
              <div className="absolute top-4 right-4 bg-amber-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center">
                <Award className="w-3 h-3 mr-1" />
                Top 10 University
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Name and Position */}
            <div className="mb-4">
              <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
              <p className="text-primary-600 font-semibold">{member.position}</p>
            </div>

            {/* Bio */}
            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
              {getBio(member)}
            </p>

            {/* Education */}
            {member.education && member.education.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
                  <GraduationCap className="w-4 h-4 mr-2 text-primary-600" />
                  Education
                </h4>
                <div className="space-y-1">
                  {member.education.map((edu, index) => (
                    <div key={index} className="text-xs text-gray-600">
                      <div className="font-medium">{edu.degree} in {edu.field}</div>
                      <div className="text-gray-500">{edu.institution}</div>
                      {edu.year && <div className="text-gray-400">{edu.year}</div>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Expertise */}
            {member.expertise && member.expertise.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
                  <BookOpen className="w-4 h-4 mr-2 text-primary-600" />
                  Expertise
                </h4>
                <div className="flex flex-wrap gap-1">
                  {member.expertise.map((skill, index) => (
                    <span 
                      key={index}
                      className="bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Languages */}
            {member.languages && member.languages.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
                  <Globe className="w-4 h-4 mr-2 text-primary-600" />
                  Languages
                </h4>
                <div className="flex flex-wrap gap-1">
                  {member.languages.map((lang, index) => (
                    <span 
                      key={index}
                      className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full"
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Social Links */}
            {member.socialLinks && (
              <div className="flex space-x-3 pt-4 border-t border-gray-200">
                {member.socialLinks.linkedin && (
                  <a 
                    href={member.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                )}
                {member.socialLinks.email && (
                  <a 
                    href={`mailto:${member.socialLinks.email}`}
                    className="text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    <Mail className="w-5 h-5" />
                  </a>
                )}
                {member.socialLinks.website && (
                  <a 
                    href={member.socialLinks.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    <Globe className="w-5 h-5" />
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TeamMembers;
