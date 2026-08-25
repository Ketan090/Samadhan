import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/User';
import Organization from '../models/Organization';
import Challenge from '../models/Challenge';
import Solution from '../models/Solution';
import Team from '../models/Team';
import Collaboration from '../models/Collaboration';
import ExpertEvaluation from '../models/ExpertEvaluation';
import ImpactMetric from '../models/ImpactMetric';
import Notification from '../models/Notification';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/samadhanhub';

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Organization.deleteMany({}),
      Challenge.deleteMany({}),
      Solution.deleteMany({}),
      Team.deleteMany({}),
      Collaboration.deleteMany({}),
      ExpertEvaluation.deleteMany({}),
      ImpactMetric.deleteMany({}),
      Notification.deleteMany({})
    ]);
    console.log('Cleared existing data');

    const password = await bcrypt.hash('password123', 10);

    // Create Users
    const users = await User.insertMany([
      { email: 'admin@samadhanhub.gov.in', password, name: 'System Admin', role: 'admin', phone: '+91-9876543210', location: { city: 'New Delhi', state: 'Delhi' } },
      { email: 'priya.sharma@gov.in', password, name: 'Priya Sharma', role: 'government', phone: '+91-9876543211', location: { city: 'New Delhi', state: 'Delhi' }, bio: 'Director, Ministry of Electronics and Information Technology' },
      { email: 'rajesh.kumar@gov.in', password, name: 'Rajesh Kumar', role: 'government', phone: '+91-9876543212', location: { city: 'Ranchi', state: 'Jharkhand' }, bio: 'District Collector, Ranchi' },
      { email: 'amit.verma@iitb.ac.in', password, name: 'Prof. Amit Verma', role: 'university', phone: '+91-9876543213', location: { city: 'Mumbai', state: 'Maharashtra' }, expertise: ['IoT', 'AI', 'Electronics'], bio: 'Professor of Electronics Engineering, IIT Bombay' },
      { email: 'sunita.reddy@vit.ac.in', password, name: 'Dr. Sunita Reddy', role: 'university', phone: '+91-9876543214', location: { city: 'Chennai', state: 'Tamil Nadu' }, expertise: ['Environmental Science', 'Water Treatment', 'Data Analytics'], bio: 'Head of Environmental Engineering, VIT Chennai' },
      { email: 'vikram.patel@techcorp.in', password, name: 'Vikram Patel', role: 'industry', phone: '+91-9876543215', location: { city: 'Bangalore', state: 'Karnataka' }, expertise: ['Cloud Computing', 'AI', 'IoT'], bio: 'CTO, TechCorp Solutions' },
      { email: 'meena.joshi@earthwatch.org', password, name: 'Meena Joshi', role: 'expert', phone: '+91-9876543216', location: { city: 'Pune', state: 'Maharashtra' }, expertise: ['Environmental Engineering', 'Sustainability', 'Policy'], bio: 'Environmental Policy Expert, 15 years experience' },
      { email: 'citizen1@gmail.com', password, name: 'Rahul Singh', role: 'citizen', phone: '+91-9876543217', location: { city: 'Ranchi', state: 'Jharkhand' }, bio: 'Resident of Ranchi, concerned about waste management' },
      { email: 'citizen2@gmail.com', password, name: 'Anita Devi', role: 'citizen', phone: '+91-9876543218', location: { city: 'Patna', state: 'Bihar' }, bio: 'Community leader advocating for clean water access' },
      { email: 'dr.kumar@aiims.edu', password, name: 'Dr. Sanjay Kumar', role: 'expert', phone: '+91-9876543219', location: { city: 'New Delhi', state: 'Delhi' }, expertise: ['Healthcare', 'Telemedicine', 'Public Health'], bio: 'Professor of Community Medicine, AIIMS Delhi' },
      { email: 'greenearth@ngo.in', password, name: 'Green Earth Foundation', role: 'citizen', phone: '+91-9876543220', location: { city: 'Kolkata', state: 'West Bengal' }, bio: 'NGO working on environmental sustainability' },
      { email: 'student1@iitb.ac.in', password, name: 'Aditya Mehta', role: 'university', phone: '+91-9876543221', location: { city: 'Mumbai', state: 'Maharashtra' }, expertise: ['IoT', 'Embedded Systems'], bio: 'B.Tech Student, IIT Bombay' }
    ]);
    console.log(`Created ${users.length} users`);

    // Create Organizations
    const organizations = await Organization.insertMany([
      {
        name: 'IIT Bombay', type: 'university', contactEmail: 'admin@iitb.ac.in',
        address: { city: 'Mumbai', state: 'Maharashtra', coordinates: { lat: 19.1334, lng: 72.9133 } },
        departments: ['Electronics Engineering', 'Computer Science', 'Environmental Engineering', 'Mechanical Engineering', 'Civil Engineering'],
        researchAreas: ['IoT', 'AI/ML', 'Smart Cities', 'Environmental Monitoring', 'Renewable Energy', 'Water Treatment'],
        faculty: [
          { name: 'Prof. Amit Verma', department: 'Electronics Engineering', expertise: ['IoT', 'Sensors', 'AI'] },
          { name: 'Prof. Nandini Sharma', department: 'Environmental Engineering', expertise: ['Water Treatment', 'Waste Management'] },
          { name: 'Prof. Rajesh Gupta', department: 'Computer Science', expertise: ['AI/ML', 'Data Science'] }
        ],
        technologies: ['IoT', 'Python', 'TensorFlow', 'Cloud Computing', 'Edge Computing', 'Raspberry Pi'],
        previousProjects: [
          { title: 'Smart Water Quality Monitor', year: 2023, description: 'IoT-based water quality monitoring system deployed in rural Maharashtra' },
          { title: 'Traffic Flow Optimization', year: 2022, description: 'AI-based traffic signal optimization for Mumbai suburbs' }
        ],
        isVerified: true, verifiedByGovernment: true, rating: 4.8, totalChallenges: 12, totalSolutions: 8
      },
      {
        name: 'VIT Chennai', type: 'university', contactEmail: 'admin@vit.ac.in',
        address: { city: 'Chennai', state: 'Tamil Nadu', coordinates: { lat: 12.9716, lng: 80.2086 } },
        departments: ['Environmental Engineering', 'Biotechnology', 'Computer Science', 'Electrical Engineering'],
        researchAreas: ['Environmental Science', 'Biotechnology', 'Water Treatment', 'Air Quality Monitoring'],
        faculty: [
          { name: 'Dr. Sunita Reddy', department: 'Environmental Engineering', expertise: ['Water Treatment', 'Environmental Monitoring'] },
          { name: 'Dr. Karthik Menon', department: 'Biotechnology', expertise: ['Bioremediation', 'Waste Processing'] }
        ],
        technologies: ['Environmental Sensors', 'GIS', 'Remote Sensing', 'Data Analytics'],
        isVerified: true, rating: 4.5, totalChallenges: 8, totalSolutions: 5
      },
      {
        name: 'TechCorp Solutions', type: 'industry', contactEmail: 'partnerships@techcorp.in',
        address: { city: 'Bangalore', state: 'Karnataka', coordinates: { lat: 12.9716, lng: 77.5946 } },
        industryType: 'Information Technology',
        companySize: '1000-5000',
        capabilities: ['Cloud Computing', 'AI/ML', 'IoT Solutions', 'Mobile App Development', 'Data Analytics', 'Blockchain'],
        fundingAvailable: true, mentorshipAvailable: true,
        technologies: ['AWS', 'Azure', 'Python', 'React', 'Node.js', 'TensorFlow'],
        isVerified: true, rating: 4.6, totalChallenges: 15, totalSolutions: 10
      },
      {
        name: 'GreenTech Innovations Pvt Ltd', type: 'industry', contactEmail: 'hello@greentech.in',
        address: { city: 'Pune', state: 'Maharashtra', coordinates: { lat: 18.5204, lng: 73.8567 } },
        industryType: 'Clean Technology',
        companySize: '100-500',
        capabilities: ['Waste Management Technology', 'Water Treatment', 'Solar Energy', 'Environmental Monitoring'],
        fundingAvailable: true, mentorshipAvailable: true,
        technologies: ['IoT Sensors', 'Solar Panels', 'Water Purification', 'Waste Processing'],
        isVerified: true, rating: 4.4, totalChallenges: 6, totalSolutions: 4
      },
      {
        name: 'Ministry of Electronics and Information Technology', type: 'government', contactEmail: 'connect@meity.gov.in',
        address: { city: 'New Delhi', state: 'Delhi', coordinates: { lat: 28.6139, lng: 77.2090 } },
        department: 'MeitY', jurisdiction: 'National',
        isVerified: true, verifiedByGovernment: true, rating: 5.0, totalChallenges: 50, totalSolutions: 20
      },
      {
        name: 'District Administration Ranchi', type: 'government', contactEmail: 'dc@ranchi.nic.in',
        address: { city: 'Ranchi', state: 'Jharkhand', coordinates: { lat: 23.3441, lng: 85.3096 } },
        department: 'District Administration', jurisdiction: 'District',
        isVerified: true, verifiedByGovernment: true, rating: 4.2, totalChallenges: 15, totalSolutions: 5
      },
      {
        name: 'EarthWatch Foundation', type: 'ngo', contactEmail: 'info@earthwatch.org',
        address: { city: 'Kolkata', state: 'West Bengal', coordinates: { lat: 22.5726, lng: 88.3639 } },
        focusAreas: ['Environmental Conservation', 'Climate Action', 'Water Conservation', 'Biodiversity'],
        technologies: ['GIS Mapping', 'Satellite Imagery', 'Community Surveys'],
        isVerified: true, rating: 4.3, totalChallenges: 10, totalSolutions: 6
      },
      {
        name: 'NIT Patna', type: 'university', contactEmail: 'admin@nitp.ac.in',
        address: { city: 'Patna', state: 'Bihar', coordinates: { lat: 25.6093, lng: 85.1376 } },
        departments: ['Civil Engineering', 'Computer Science', 'Electrical Engineering', 'Mechanical Engineering'],
        researchAreas: ['Water Resources', 'Flood Management', 'Smart Infrastructure', 'Renewable Energy'],
        faculty: [
          { name: 'Prof. Ashish Ranjan', department: 'Civil Engineering', expertise: ['Water Resources', 'Flood Management'] }
        ],
        technologies: ['Hydrological Modeling', 'GIS', 'Remote Sensing', 'IoT'],
        isVerified: true, rating: 4.1, totalChallenges: 5, totalSolutions: 3
      },
      {
        name: 'HealthBridge Foundation', type: 'ngo', contactEmail: 'contact@healthbridge.in',
        address: { city: 'Hyderabad', state: 'Telangana', coordinates: { lat: 17.3850, lng: 78.4867 } },
        focusAreas: ['Rural Healthcare', 'Telemedicine', 'Maternal Health', 'Child Nutrition'],
        technologies: ['Telemedicine Platforms', 'Mobile Health Apps', 'Health Data Analytics'],
        isVerified: true, rating: 4.5, totalChallenges: 8, totalSolutions: 5
      },
      {
        name: 'IIT Delhi', type: 'university', contactEmail: 'admin@iitd.ac.in',
        address: { city: 'New Delhi', state: 'Delhi', coordinates: { lat: 28.5459, lng: 77.1921 } },
        departments: ['Computer Science', 'Electrical Engineering', 'Transportation', 'Energy'],
        researchAreas: ['Smart Transportation', 'Energy Systems', 'Urban Planning', 'AI/ML'],
        faculty: [
          { name: 'Prof. Manoj Goyal', department: 'Transportation', expertise: ['Traffic Management', 'Urban Mobility'] }
        ],
        technologies: ['AI/ML', 'Computer Vision', 'Sensor Networks', 'Smart Grids'],
        isVerified: true, rating: 4.7, totalChallenges: 18, totalSolutions: 12
      }
    ]);
    console.log(`Created ${organizations.length} organizations`);

    // Create Challenges
    const challenges = await Challenge.insertMany([
      {
        title: 'Smart Waste Collection for Urban Wards',
        description: 'Ranchi city generates approximately 450 tonnes of municipal solid waste daily, but the current collection efficiency is only about 40%. Many wards, especially in peripheral areas, have irregular waste pickup leading to unhygienic conditions, disease outbreaks, and environmental degradation. We need an intelligent waste management system that can optimize collection routes, predict waste generation patterns, and enable real-time tracking of waste collection vehicles.',
        category: 'Environment',
        subcategory: 'Waste Management',
        location: { city: 'Ranchi', state: 'Jharkhand', pincode: '834001', coordinates: { lat: 23.3441, lng: 85.3096 } },
        submittedBy: users[7]._id,
        affectedPopulation: 25000,
        urgency: 'high',
        severity: 'high',
        currentConsequences: 'Open dumping, water contamination, air pollution from burning waste, spread of vector-borne diseases, unpleasant living conditions for residents in multiple wards',
        existingAttempts: 'Basic door-to-door collection exists but is irregular. Waste segregation at source is minimal. No real-time tracking of collection vehicles.',
        desiredOutcome: 'An integrated smart waste management system with IoT-enabled bins, optimized collection routes, real-time tracking, and a mobile app for citizen reporting',
        constraints: 'Budget constraints in municipal corporation. Limited technical expertise among waste workers. Diverse waste types from different areas.',
        availableResources: 'Existing waste collection fleet of 25 vehicles. Municipal land for waste processing. Some budget allocation under Swachh Bharat Mission.',
        suggestedExpertise: ['IoT', 'AI', 'Data Science', 'Operations Research', 'Environmental Engineering'],
        status: 'open',
        verificationStatus: 'verified',
        verifiedBy: users[1]._id,
        verifiedAt: new Date('2024-01-15'),
        aiAnalysis: {
          summary: 'A critical urban waste management challenge affecting 25,000+ residents in Ranchi. Current collection efficiency is only 40% with no route optimization or real-time monitoring.',
          classification: 'Environment → Waste Management → Urban Waste Collection',
          impactScore: 78,
          urgencyScore: 82,
          requiredExpertise: ['IoT', 'Data Science', 'Environmental Engineering', 'Operations Research'],
          similarChallenges: [],
          recommendedCollaborators: [organizations[0]._id, organizations[3]._id]
        },
        numberOfTeams: 3,
        numberOfSolutions: 2,
        participatingOrganizations: [organizations[0]._id, organizations[3]._id],
        tags: ['waste-management', 'smart-city', 'iot', 'urban', 'environment'],
        isDemoData: true
      },
      {
        title: 'Rural Water Quality Monitoring System',
        description: 'Over 200 villages in rural Bihar rely on groundwater sources that are increasingly contaminated with arsenic, fluoride, and bacterial pathogens. Current testing is sporadic and lab-based, leaving communities unaware of water quality issues for weeks or months. We need a continuous, affordable, and scalable water quality monitoring solution that can provide real-time alerts to both communities and administrators.',
        category: 'Healthcare',
        subcategory: 'Water Quality',
        location: { city: 'Patna', state: 'Bihar', pincode: '800001', coordinates: { lat: 25.6093, lng: 85.1376 } },
        submittedBy: users[8]._id,
        affectedPopulation: 150000,
        urgency: 'critical',
        severity: 'critical',
        currentConsequences: 'Waterborne diseases affecting thousands annually, arsenic-related health issues including skin lesions and cancer, fluoride causing skeletal fluorosis, children suffering from chronic gastrointestinal illnesses',
        existingAttempts: 'Periodic manual testing by PHED. Some RO plants installed but maintenance is poor. No real-time monitoring infrastructure.',
        desiredOutcome: 'Deploy IoT-based water quality sensors at key water sources providing continuous monitoring, automated alerts when contamination exceeds safe limits, and a dashboard for administration',
        constraints: 'Remote locations with poor internet connectivity. Extreme weather conditions. Power supply issues in many villages.',
        availableResources: 'Existing hand pump infrastructure. Some solar panels available through government schemes. Mobile network coverage in most areas.',
        suggestedExpertise: ['IoT', 'Environmental Engineering', 'Data Science', 'Mobile Development'],
        status: 'open',
        verificationStatus: 'verified',
        verifiedBy: users[2]._id,
        verifiedAt: new Date('2024-01-20'),
        aiAnalysis: {
          summary: 'Critical water quality crisis in rural Bihar affecting 150,000+ people. Arsenic and fluoride contamination requires continuous monitoring.',
          classification: 'Healthcare → Water Quality → Rural Water Monitoring',
          impactScore: 92,
          urgencyScore: 95,
          requiredExpertise: ['IoT', 'Environmental Engineering', 'Sensor Technology', 'Data Analytics'],
          similarChallenges: [],
          recommendedCollaborators: [organizations[1]._id, organizations[7]._id]
        },
        numberOfTeams: 2,
        numberOfSolutions: 1,
        participatingOrganizations: [organizations[1]._id, organizations[7]._id, organizations[6]._id],
        tags: ['water-quality', 'rural', 'health', 'iot', 'monitoring'],
        isDemoData: true
      },
      {
        title: 'Traffic Congestion Prediction in Smart Cities',
        description: 'Mumbai experiences severe traffic congestion during peak hours, resulting in an average commute time increase of 200%. This leads to significant economic losses, increased fuel consumption, higher air pollution, and reduced quality of life. Current traffic management relies on fixed-timing signals that cannot adapt to real-time conditions. We need an AI-powered traffic prediction and management system.',
        category: 'Transportation',
        subcategory: 'Traffic Management',
        location: { city: 'Mumbai', state: 'Maharashtra', pincode: '400001', coordinates: { lat: 19.0760, lng: 72.8777 } },
        submittedBy: users[3]._id,
        affectedPopulation: 500000,
        urgency: 'high',
        severity: 'high',
        currentConsequences: 'Economic losses estimated at ₹19,000 crore annually. Average commuter loses 2+ hours daily. Air quality deterioration. Increased accident rates.',
        existingAttempts: 'Mumbai Traffic Police manages signals. Some CCTV cameras deployed. Limited adaptive signal control at major junctions.',
        desiredOutcome: 'An AI-powered system that predicts congestion 30 minutes in advance, dynamically adjusts signal timings, and provides route recommendations to commuters',
        constraints: 'Diverse vehicle types. Complex road network. High population density. Limited space for additional infrastructure.',
        availableResources: 'Existing CCTV network. Traffic police data. Public transport GPS data. Mobile app usage data.',
        suggestedExpertise: ['AI/ML', 'Computer Vision', 'Data Science', 'Urban Planning', 'IoT'],
        status: 'open',
        verificationStatus: 'verified',
        verifiedBy: users[1]._id,
        verifiedAt: new Date('2024-02-01'),
        aiAnalysis: {
          summary: 'Major urban traffic challenge affecting 500,000+ daily commuters in Mumbai with significant economic impact.',
          classification: 'Transportation → Traffic Management → AI Traffic Prediction',
          impactScore: 88,
          urgencyScore: 85,
          requiredExpertise: ['AI/ML', 'Computer Vision', 'Data Science', 'IoT', 'Urban Planning'],
          similarChallenges: [],
          recommendedCollaborators: [organizations[0]._id, organizations[9]._id]
        },
        numberOfTeams: 4,
        numberOfSolutions: 3,
        participatingOrganizations: [organizations[0]._id, organizations[9]._id, organizations[2]._id],
        tags: ['traffic', 'smart-city', 'ai', 'urban', 'prediction'],
        isDemoData: true
      },
      {
        title: 'Telemedicine for Remote Healthcare Access',
        description: 'Remote villages in Telangana have limited access to healthcare facilities. The nearest primary health center is 15-30 km away for many villages. This leads to delayed treatment, preventable complications, and maternal mortality. Community health workers (ASHAs) lack diagnostic tools and specialist consultations. We need a comprehensive telemedicine solution that works with limited connectivity.',
        category: 'Healthcare',
        subcategory: 'Healthcare Access',
        location: { city: 'Hyderabad', state: 'Telangana', pincode: '500001', coordinates: { lat: 17.3850, lng: 78.4867 } },
        submittedBy: users[9]._id,
        affectedPopulation: 75000,
        urgency: 'critical',
        severity: 'critical',
        currentConsequences: 'Maternal mortality rate 3x higher than urban areas. Child mortality from preventable diseases. Chronic disease management gaps. Mental health issues going unaddressed.',
        existingAttempts: 'Some telemedicine centers established but underutilized. Poor internet connectivity. Lack of training for health workers on digital tools.',
        desiredOutcome: 'An offline-capable telemedicine platform for ASHA workers with AI-assisted diagnosis, specialist video consultation, medicine delivery tracking, and health records management',
        constraints: 'Poor internet connectivity in remote areas. Limited power supply. Low digital literacy among health workers and patients.',
        availableResources: 'ASHA worker network. Primary health centers. Mobile phone penetration. Government health schemes.',
        suggestedExpertise: ['Healthcare', 'Mobile Development', 'AI/ML', 'IoT', 'UX Design'],
        status: 'open',
        verificationStatus: 'verified',
        verifiedBy: users[1]._id,
        verifiedAt: new Date('2024-02-10'),
        aiAnalysis: {
          summary: 'Critical healthcare access challenge in rural Telangana affecting 75,000+ people with elevated mortality rates.',
          classification: 'Healthcare → Healthcare Access → Telemedicine',
          impactScore: 95,
          urgencyScore: 93,
          requiredExpertise: ['Healthcare', 'Mobile Development', 'AI/ML', 'IoT', 'UX Design'],
          similarChallenges: [],
          recommendedCollaborators: [organizations[8]._id, organizations[4]._id]
        },
        numberOfTeams: 2,
        numberOfSolutions: 1,
        participatingOrganizations: [organizations[8]._id, organizations[2]._id],
        tags: ['telemedicine', 'rural-health', 'mobile', 'ai', 'healthcare'],
        isDemoData: true
      },
      {
        title: 'Urban Flood Prevention Using IoT and AI',
        description: 'Chennai faces recurring urban floods during monsoon seasons. In 2015 and 2023, devastating floods caused massive damage. Current drainage systems are inadequate and poorly maintained. There is no early warning system for flood-prone areas. We need an integrated flood prevention and early warning system using IoT sensors and predictive AI.',
        category: 'Infrastructure',
        subcategory: 'Flood Prevention',
        location: { city: 'Chennai', state: 'Tamil Nadu', pincode: '600001', coordinates: { lat: 13.0827, lng: 80.2707 } },
        submittedBy: users[4]._id,
        affectedPopulation: 300000,
        urgency: 'critical',
        severity: 'critical',
        currentConsequences: 'Property damage worth hundreds of crores. Displacement of thousands. Loss of life. Infrastructure damage. Economic disruption lasting months.',
        existingAttempts: 'Chennai Corporation has some drainage improvement plans. Weather forecasts available but not actionable at ward level. No IoT-based monitoring.',
        desiredOutcome: 'A comprehensive flood management system with IoT sensors monitoring water levels, rainfall prediction, drainage status, and automated early warnings to citizens and authorities',
        constraints: 'Vast area to cover. Budget limitations. Existing infrastructure is aging. Coordination between multiple agencies required.',
        availableResources: 'Weather department data. Municipal drainage maps. Cellular network infrastructure. Some CCTV coverage.',
        suggestedExpertise: ['IoT', 'AI/ML', 'GIS', 'Civil Engineering', 'Data Analytics'],
        status: 'open',
        verificationStatus: 'verified',
        verifiedBy: users[1]._id,
        verifiedAt: new Date('2024-02-15'),
        aiAnalysis: {
          summary: 'Critical flood management challenge affecting 300,000+ people in Chennai requiring integrated IoT and AI solution.',
          classification: 'Infrastructure → Flood Prevention → IoT-based Warning System',
          impactScore: 94,
          urgencyScore: 96,
          requiredExpertise: ['IoT', 'AI/ML', 'GIS', 'Civil Engineering', 'Hydrology'],
          similarChallenges: [],
          recommendedCollaborators: [organizations[1]._id, organizations[9]._id]
        },
        numberOfTeams: 3,
        numberOfSolutions: 2,
        participatingOrganizations: [organizations[1]._id, organizations[9]._id, organizations[6]._id],
        tags: ['flood', 'iot', 'ai', 'disaster-management', 'urban'],
        isDemoData: true
      },
      {
        title: 'Digital Education Access for Underprivileged Students',
        description: 'Millions of students in rural and semi-urban areas lack access to quality digital education resources. During and after the pandemic, the digital divide became starkly evident. Schools lack computers, internet, and trained teachers for digital content delivery. We need an offline-first digital education platform that can work on low-cost devices and provide curriculum-aligned content in regional languages.',
        category: 'Education',
        subcategory: 'Digital Education',
        location: { city: 'Patna', state: 'Bihar', coordinates: { lat: 25.6093, lng: 85.1376 } },
        submittedBy: users[8]._id,
        affectedPopulation: 500000,
        urgency: 'high',
        severity: 'high',
        currentConsequences: 'Learning loss estimated at 2+ years for many students. Low literacy rates. Digital skill gap widening. Limited future employment opportunities.',
        existingAttempts: 'DIKSHA platform exists but requires internet. Some state initiatives but limited reach. Content available mainly in English and Hindi.',
        desiredOutcome: 'An offline-first education platform with curriculum-aligned content in regional languages, progress tracking, teacher dashboards, and adaptive learning',
        constraints: 'Low-cost devices with limited storage. No reliable internet. Diverse curriculum across states. Limited teacher training.',
        availableResources: 'Existing school infrastructure. Government education schemes. NGO partnerships. Mobile phone penetration among parents.',
        suggestedExpertise: ['EdTech', 'Mobile Development', 'Content Design', 'UX Design', 'AI/ML'],
        status: 'open',
        verificationStatus: 'verified',
        verifiedBy: users[1]._id,
        verifiedAt: new Date('2024-02-20'),
        numberOfTeams: 5,
        numberOfSolutions: 4,
        participatingOrganizations: [organizations[0]._id, organizations[7]._id, organizations[2]._id],
        tags: ['education', 'digital-divide', 'offline', 'rural', 'edtech'],
        isDemoData: true
      },
      {
        title: 'Agricultural Supply Chain Optimization',
        description: 'Farmers in Jharkhand lose 25-40% of their produce due to inefficient supply chains, lack of market information, and poor post-harvest infrastructure. Middlemen capture most of the value. There is no transparent price discovery mechanism. Perishable goods especially suffer from high wastage rates. We need a digital platform connecting farmers directly to markets.',
        category: 'Agriculture',
        subcategory: 'Supply Chain',
        location: { city: 'Ranchi', state: 'Jharkhand', coordinates: { lat: 23.3441, lng: 85.3096 } },
        submittedBy: users[7]._id,
        affectedPopulation: 200000,
        urgency: 'high',
        severity: 'high',
        currentConsequences: 'Farmer income loss of 25-40%. Food wastage. Consumer prices inflated. Supply-demand mismatch leading to price crashes.',
        existingAttempts: 'eNAM exists but adoption is low. Some FPOs formed but lack digital infrastructure. Limited cold chain facilities.',
        desiredOutcome: 'A farmer-centric platform with real-time price information, direct market access, supply chain tracking, cold chain management, and AI-based demand prediction',
        constraints: 'Low digital literacy among farmers. Limited smartphone penetration. Diverse crop types. Seasonal variations.',
        availableResources: 'FPO networks. Government agriculture schemes. Mobile network coverage. Existing mandi infrastructure.',
        suggestedExpertise: ['Supply Chain', 'Mobile Development', 'AI/ML', 'Blockchain', 'Agriculture'],
        status: 'open',
        verificationStatus: 'verified',
        verifiedBy: users[2]._id,
        verifiedAt: new Date('2024-03-01'),
        numberOfTeams: 2,
        numberOfSolutions: 1,
        participatingOrganizations: [organizations[7]._id, organizations[3]._id],
        tags: ['agriculture', 'supply-chain', 'farmers', 'market', 'digital'],
        isDemoData: true
      },
      {
        title: 'Public Transport Route Optimization',
        description: 'The public bus transport system in Kolkata suffers from poorly optimized routes, overcrowding on some routes, and near-empty buses on others. Average wait times exceed 30 minutes. Commuters prefer private vehicles due to unreliability. We need data-driven route optimization to improve service quality and ridership.',
        category: 'Transportation',
        subcategory: 'Public Transport',
        location: { city: 'Kolkata', state: 'West Bengal', coordinates: { lat: 22.5726, lng: 88.3639 } },
        submittedBy: users[10]._id,
        affectedPopulation: 1000000,
        urgency: 'medium',
        severity: 'high',
        currentConsequences: 'Increased traffic congestion from private vehicles. Air pollution. Social equity issues for those dependent on public transport. Economic losses.',
        existingAttempts: 'Some GPS tracking of buses implemented. Route planning based on outdated surveys. Limited real-time passenger information.',
        desiredOutcome: 'An AI-optimized public transport system with dynamic routing, real-time passenger information, demand-responsive scheduling, and a user-friendly mobile app',
        constraints: 'Large fleet to manage. Political sensitivities around route changes. Limited budget for infrastructure. Driver union considerations.',
        availableResources: 'Bus fleet with GPS. Passenger data from ticketing. Road network data. Demographic data.',
        suggestedExpertise: ['Data Science', 'AI/ML', 'Mobile Development', 'Urban Planning', 'Operations Research'],
        status: 'open',
        verificationStatus: 'verified',
        verifiedBy: users[1]._id,
        verifiedAt: new Date('2024-03-05'),
        numberOfTeams: 1,
        numberOfSolutions: 0,
        participatingOrganizations: [organizations[9]._id],
        tags: ['transport', 'optimization', 'ai', 'urban', 'public-transit'],
        isDemoData: true
      }
    ]);
    console.log(`Created ${challenges.length} challenges`);

    // Create Teams
    const teams = await Team.insertMany([
      {
        name: 'EcoTech Solutions',
        challenge: challenges[0]._id,
        leader: users[3]._id,
        members: [
          { user: users[3]._id, role: 'leader', joinedAt: new Date('2024-02-01') },
          { user: users[11]._id, role: 'member', joinedAt: new Date('2024-02-05') }
        ],
        university: organizations[0]._id,
        industryMentor: organizations[3]._id,
        status: 'active',
        progress: 45,
        isDemoData: true
      },
      {
        name: 'WaterGuard India',
        challenge: challenges[1]._id,
        leader: users[4]._id,
        members: [
          { user: users[4]._id, role: 'leader', joinedAt: new Date('2024-02-10') }
        ],
        university: organizations[1]._id,
        status: 'active',
        progress: 30,
        isDemoData: true
      },
      {
        name: 'TrafficAI Labs',
        challenge: challenges[2]._id,
        leader: users[3]._id,
        members: [
          { user: users[3]._id, role: 'leader', joinedAt: new Date('2024-02-15') },
          { user: users[11]._id, role: 'member', joinedAt: new Date('2024-02-18') }
        ],
        university: organizations[0]._id,
        industryMentor: organizations[2]._id,
        status: 'active',
        progress: 60,
        isDemoData: true
      }
    ]);
    console.log(`Created ${teams.length} teams`);

    // Create Solutions
    const solutions = await Solution.insertMany([
      {
        challenge: challenges[0]._id,
        team: teams[0]._id,
        submittedBy: users[3]._id,
        title: 'SmartBin: IoT-Enabled Waste Collection Optimization System',
        problemAddressed: 'Low waste collection efficiency of 40% in Ranchi urban wards',
        proposedApproach: 'Deploy IoT sensors in waste bins across all wards. Use AI to optimize collection routes in real-time. Provide a mobile app for citizens to report issues and track collection. Dashboard for ward administrators.',
        technology: ['IoT Sensors', 'Machine Learning', 'Mobile App', 'Cloud Platform', 'GPS Tracking'],
        architecture: 'Three-tier architecture: IoT layer (sensors + gateways), Cloud layer (data processing + AI), Application layer (mobile + web dashboards)',
        expectedImpact: 'Increase waste collection efficiency from 40% to 85%. Reduce fuel costs by 30%. Improve citizen satisfaction by 60%.',
        estimatedCost: 2500000,
        implementationTimeline: '6 months pilot in 5 wards, 12 months full deployment',
        scalability: 'Easily scalable to other cities. Modular design allows adding new sensor types and features.',
        status: 'under-review',
        scorecard: { impact: 8, feasibility: 8, scalability: 9, innovation: 7, costEffectiveness: 7, totalScore: 7.85 },
        isDemoData: true
      },
      {
        challenge: challenges[1]._id,
        team: teams[1]._id,
        submittedBy: users[4]._id,
        title: 'AquaSense: Continuous Rural Water Quality Monitor',
        problemAddressed: 'Lack of continuous water quality monitoring in rural Bihar villages',
        proposedApproach: 'Solar-powered IoT sensors deployed at key water sources measuring pH, turbidity, arsenic, fluoride, and bacterial contamination. Low-power LoRaWAN communication. Mobile app for health workers. Dashboard for PHED.',
        technology: ['IoT Sensors', 'LoRaWAN', 'Solar Power', 'Mobile App', 'Cloud Analytics'],
        expectedImpact: 'Enable real-time water quality alerts. Reduce waterborne diseases by 50%. Provide data for policy decisions.',
        estimatedCost: 1800000,
        implementationTimeline: '3 months pilot in 10 villages, 9 months scale to 200 villages',
        scalability: 'Designed for rural deployment. Solar-powered, low maintenance. Can be replicated across states.',
        status: 'submitted',
        isDemoData: true
      },
      {
        challenge: challenges[2]._id,
        team: teams[2]._id,
        submittedBy: users[3]._id,
        title: 'TrafficPulse: AI-Powered Adaptive Traffic Management',
        problemAddressed: 'Severe traffic congestion in Mumbai with 200% increased commute times',
        proposedApproach: 'Computer vision-based traffic analysis using existing CCTV. Predictive AI model for congestion forecasting. Adaptive signal control system. Public-facing traffic prediction app.',
        technology: ['Computer Vision', 'Deep Learning', 'Real-time Processing', 'Mobile App', 'Edge Computing'],
        expectedImpact: 'Reduce average commute time by 25%. Improve traffic flow efficiency by 35%. Reduce emissions by 20%.',
        estimatedCost: 5000000,
        implementationTimeline: '4 months proof of concept, 8 months pilot at 50 junctions, 12 months city-wide',
        scalability: 'Uses existing infrastructure (CCTV). Edge computing reduces bandwidth needs. Model transferable to other cities.',
        status: 'pilot',
        scorecard: { impact: 9, feasibility: 7, scalability: 8, innovation: 9, costEffectiveness: 6, totalScore: 8.05 },
        isDemoData: true
      }
    ]);
    console.log(`Created ${solutions.length} solutions`);

    // Create Collaborations
    const collaborations = await Collaboration.insertMany([
      {
        challenge: challenges[0]._id,
        initiator: users[3]._id,
        initiatorOrganization: organizations[0]._id,
        partner: users[5]._id,
        partnerOrganization: organizations[2]._id,
        type: 'university-industry',
        role: 'technology-partner',
        matchScore: 94,
        status: 'active',
        matchReason: 'IIT Bombay has strong IoT expertise and TechCorp provides cloud infrastructure and AI capabilities. Geographic proximity enables close collaboration.',
        isDemoData: true
      },
      {
        challenge: challenges[1]._id,
        initiator: users[4]._id,
        initiatorOrganization: organizations[1]._id,
        partner: users[8]._id,
        partnerOrganization: organizations[6]._id,
        type: 'ngo-government',
        role: 'mentor',
        matchScore: 88,
        status: 'active',
        matchReason: 'EarthWatch Foundation has field experience in rural Bihar. VIT Chennai brings technical expertise in environmental monitoring.',
        isDemoData: true
      },
      {
        challenge: challenges[2]._id,
        initiator: users[3]._id,
        initiatorOrganization: organizations[0]._id,
        partner: users[5]._id,
        partnerOrganization: organizations[2]._id,
        type: 'university-industry',
        role: 'research-partner',
        matchScore: 91,
        status: 'active',
        matchReason: 'IIT Bombay has published research on traffic AI and TechCorp has experience with computer vision at scale.',
        isDemoData: true
      }
    ]);
    console.log(`Created ${collaborations.length} collaborations`);

    // Create Expert Evaluations
    const evaluations = await ExpertEvaluation.insertMany([
      {
        solution: solutions[0]._id,
        evaluator: users[6]._id,
        challenge: challenges[0]._id,
        scores: { impact: 8, feasibility: 8, scalability: 9, innovation: 7, costEffectiveness: 7 },
        weightedScore: 7.85,
        comments: 'Strong solution with practical IoT implementation. Good scalability potential.',
        strengths: ['Uses existing infrastructure', 'Modular design', 'Clear impact metrics'],
        weaknesses: ['Requires maintenance training', 'Initial deployment cost is high'],
        recommendations: ['Start with pilot in 2 wards', 'Develop training program for workers'],
        recommendation: 'approve',
        status: 'submitted',
        isDemoData: true
      },
      {
        solution: solutions[2]._id,
        evaluator: users[9]._id,
        challenge: challenges[2]._id,
        scores: { impact: 9, feasibility: 7, scalability: 8, innovation: 9, costEffectiveness: 6 },
        weightedScore: 8.05,
        comments: 'Innovative approach using existing CCTV infrastructure. Edge computing is smart. Need more details on scalability costs.',
        strengths: ['Leverages existing CCTV network', 'Real-time processing', 'Strong AI model'],
        weaknesses: ['High initial computation cost', 'Privacy concerns need addressing'],
        recommendations: ['Address data privacy compliance', 'Provide cost breakdown for full deployment'],
        recommendation: 'approve-with-conditions',
        status: 'submitted',
        isDemoData: true
      }
    ]);
    console.log(`Created ${evaluations.length} evaluations`);

    // Create Impact Metrics
    const impactMetrics = await ImpactMetric.insertMany([
      {
        challenge: challenges[2]._id,
        solution: solutions[2]._id,
        team: teams[2]._id,
        metric: 'Average Commute Time',
        category: 'time-saved',
        unit: 'minutes',
        beforeValue: 90,
        afterValue: 67,
        improvement: -23,
        improvementPercent: -25.6,
        description: 'Average commute time reduced by 23 minutes during pilot phase',
        verified: true,
        measuredAt: new Date('2024-06-01'),
        isDemoData: true
      },
      {
        challenge: challenges[2]._id,
        solution: solutions[2]._id,
        team: teams[2]._id,
        metric: 'Traffic Flow Efficiency',
        category: 'problems-resolved',
        unit: 'percentage',
        beforeValue: 45,
        afterValue: 80,
        improvement: 35,
        improvementPercent: 77.8,
        description: 'Traffic flow efficiency improved from 45% to 80% at pilot junctions',
        verified: true,
        measuredAt: new Date('2024-06-01'),
        isDemoData: true
      },
      {
        challenge: challenges[0]._id,
        solution: solutions[0]._id,
        team: teams[0]._id,
        metric: 'Waste Collection Efficiency',
        category: 'problems-resolved',
        unit: 'percentage',
        beforeValue: 40,
        afterValue: 82,
        improvement: 42,
        improvementPercent: 105,
        description: 'Waste collection efficiency improved from 40% to 82% in pilot wards',
        verified: true,
        measuredAt: new Date('2024-05-15'),
        isDemoData: true
      },
      {
        challenge: challenges[0]._id,
        solution: solutions[0]._id,
        team: teams[0]._id,
        metric: 'People Benefited',
        category: 'people-benefited',
        unit: 'people',
        beforeValue: 0,
        afterValue: 25000,
        improvement: 25000,
        improvementPercent: 100,
        description: '25,000 residents in pilot wards now receive regular waste collection',
        verified: true,
        measuredAt: new Date('2024-05-15'),
        isDemoData: true
      },
      {
        challenge: challenges[2]._id,
        solution: solutions[2]._id,
        team: teams[2]._id,
        metric: 'CO2 Reduction',
        category: 'environmental',
        unit: 'tonnes/year',
        beforeValue: 500,
        afterValue: 380,
        improvement: -120,
        improvementPercent: -24,
        description: 'Estimated 120 tonnes annual CO2 reduction due to improved traffic flow',
        verified: false,
        measuredAt: new Date('2024-06-01'),
        isDemoData: true
      }
    ]);
    console.log(`Created ${impactMetrics.length} impact metrics`);

    console.log('\n✅ Seed data created successfully!');
    console.log('\n📋 Demo Credentials:');
    console.log('Admin: admin@samadhanhub.gov.in / password123');
    console.log('Government: priya.sharma@gov.in / password123');
    console.log('University: amit.verma@iitb.ac.in / password123');
    console.log('Industry: vikram.patel@techcorp.in / password123');
    console.log('Expert: meena.joshi@earthwatch.org / password123');
    console.log('Citizen: citizen1@gmail.com / password123');

    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
}

seed();
