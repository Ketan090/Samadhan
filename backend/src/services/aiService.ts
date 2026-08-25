/**
 * AI Service Abstraction
 * Provides an interface for AI analysis that can later connect to an LLM/API.
 * Currently includes a mock/demo implementation for demonstration purposes.
 */

export interface AIAnalysisResult {
  summary: string;
  classification: string;
  impactScore: number;
  urgencyScore: number;
  requiredExpertise: string[];
  similarChallengeKeywords: string[];
  recommendedCollaboratorTypes: string[];
}

export interface CollaborationMatch {
  organizationId: string;
  organizationName: string;
  organizationType: string;
  matchScore: number;
  matchReason: string;
  role: string;
  expertiseMatch: string[];
  locationMatch: boolean;
}

export interface ChallengeInput {
  title: string;
  description: string;
  category: string;
  location: { city: string; state: string };
  affectedPopulation: number;
  urgency: string;
  currentConsequences?: string;
  existingAttempts?: string;
}

/**
 * Mock AI implementation for demo.
 * In production, replace with actual LLM API calls (OpenAI, etc.)
 */
export class AIService {
  private static instance: AIService;
  
  static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  async analyzeChallenge(input: ChallengeInput): Promise<AIAnalysisResult> {
    // Mock AI analysis based on keywords and patterns
    const text = `${input.title} ${input.description} ${input.category}`.toLowerCase();
    
    const summary = this.generateSummary(input);
    const classification = this.classifyChallenge(input.category, text);
    const impactScore = this.calculateImpactScore(input);
    const urgencyScore = this.calculateUrgencyScore(input);
    const requiredExpertise = this.extractExpertise(text);
    const similarChallengeKeywords = this.findSimilarKeywords(text);
    const recommendedCollaboratorTypes = this.recommendCollaborators(input.category);

    return {
      summary,
      classification,
      impactScore,
      urgencyScore,
      requiredExpertise,
      similarChallengeKeywords,
      recommendedCollaboratorTypes
    };
  }

  async matchCollaborators(challengeInput: ChallengeInput, organizations: any[]): Promise<CollaborationMatch[]> {
    const matches: CollaborationMatch[] = [];
    
    for (const org of organizations) {
      const score = this.calculateMatchScore(challengeInput, org);
      if (score > 40) {
        matches.push({
          organizationId: org._id.toString(),
          organizationName: org.name,
          organizationType: org.type,
          matchScore: score,
          matchReason: this.generateMatchReason(challengeInput, org, score),
          role: this.suggestRole(org.type, challengeInput.category),
          expertiseMatch: this.findExpertiseOverlap(challengeInput, org),
          locationMatch: org.address?.state === challengeInput.location.state
        });
      }
    }

    return matches.sort((a, b) => b.matchScore - a.matchScore).slice(0, 10);
  }

  private generateSummary(input: ChallengeInput): string {
    const severityWord = input.urgency === 'critical' ? 'A critical' : input.urgency === 'high' ? 'An urgent' : 'A significant';
    return `${severityWord} challenge regarding ${input.title.toLowerCase()} has been identified in ${input.location.city}, ${input.location.state}. ` +
      `This issue affects approximately ${input.affectedPopulation.toLocaleString()} people and requires immediate collaborative attention. ` +
      `The challenge falls within the ${input.category} domain and demands multi-stakeholder coordination for effective resolution.`;
  }

  private classifyChallenge(category: string, text: string): string {
    const categories: Record<string, Record<string, string[]>> = {
      'Environment': {
        'Waste Management': ['waste', 'garbage', 'trash', 'recycling', 'disposal', 'landfill'],
        'Water Management': ['water', 'drainage', 'flood', 'sewage'],
        'Air Quality': ['air', 'pollution', 'emission', 'smoke'],
        'Climate Action': ['climate', 'carbon', 'temperature', 'renewable']
      },
      'Healthcare': {
        'Rural Healthcare': ['rural', 'village', 'primary health'],
        'Mental Health': ['mental', 'psychological', 'counseling'],
        'Disease Prevention': ['disease', 'prevention', 'vaccination', 'epidemic'],
        'Healthcare Access': ['hospital', 'clinic', 'doctor', 'medicine']
      },
      'Education': {
        'Digital Education': ['digital', 'online', 'e-learning', 'internet'],
        'Rural Education': ['rural', 'school', 'student', 'teacher'],
        'Skill Development': ['skill', 'training', 'vocational']
      },
      'Transportation': {
        'Traffic Management': ['traffic', 'congestion', 'signal', 'road'],
        'Public Transport': ['bus', 'metro', 'transport', 'commute'],
        'Road Safety': ['accident', 'safety', 'helmet', 'speed']
      },
      'Agriculture': {
        'Crop Management': ['crop', 'farming', 'harvest', 'yield'],
        'Supply Chain': ['supply', 'chain', 'market', 'price', 'mandi'],
        'Irrigation': ['irrigation', 'water', 'drip', 'pump']
      },
      'Infrastructure': {
        'Urban Infrastructure': ['building', 'housing', 'urban', 'city'],
        'Rural Infrastructure': ['road', 'bridge', 'electricity', 'village'],
        'Smart City': ['smart', 'iot', 'sensor', 'monitoring']
      },
      'Social Welfare': {
        'Women Safety': ['women', 'safety', 'harassment', 'empowerment'],
        'Child Welfare': ['child', 'education', 'nutrition', 'abuse'],
        'Elderly Care': ['elderly', 'senior', 'ageing', 'care']
      }
    };

    const catCategories = categories[category] || {};
    for (const [subcat, keywords] of Object.entries(catCategories)) {
      if (keywords.some(k => text.includes(k))) {
        return `${category} → ${subcat}`;
      }
    }
    return `${category} → General`;
  }

  private calculateImpactScore(input: ChallengeInput): number {
    let score = 50;
    if (input.affectedPopulation > 100000) score += 20;
    else if (input.affectedPopulation > 50000) score += 15;
    else if (input.affectedPopulation > 10000) score += 10;
    else if (input.affectedPopulation > 1000) score += 5;

    if (input.urgency === 'critical') score += 15;
    else if (input.urgency === 'high') score += 10;
    else if (input.urgency === 'medium') score += 5;

    if (input.currentConsequences && input.currentConsequences.length > 100) score += 5;
    
    return Math.min(100, Math.max(0, score));
  }

  private calculateUrgencyScore(input: ChallengeInput): number {
    let score = 30;
    if (input.urgency === 'critical') score += 40;
    else if (input.urgency === 'high') score += 25;
    else if (input.urgency === 'medium') score += 10;
    
    if (input.affectedPopulation > 50000) score += 15;
    else if (input.affectedPopulation > 10000) score += 10;
    
    return Math.min(100, Math.max(0, score));
  }

  private extractExpertise(text: string): string[] {
    const expertiseMap: Record<string, string[]> = {
      'iot': ['IoT', 'Sensors', 'Embedded Systems'],
      'sensor': ['IoT', 'Sensors'],
      'data': ['Data Science', 'Analytics', 'Machine Learning'],
      'ai': ['Artificial Intelligence', 'Machine Learning', 'Deep Learning'],
      'machine learning': ['Machine Learning', 'AI'],
      'web': ['Web Development', 'Frontend', 'Backend'],
      'mobile': ['Mobile Development', 'App Development'],
      'cloud': ['Cloud Computing', 'AWS', 'DevOps'],
      'blockchain': ['Blockchain', 'Smart Contracts'],
      'gis': ['GIS', 'Remote Sensing', 'Geospatial Analysis'],
      'water': ['Environmental Engineering', 'Water Treatment'],
      'energy': ['Renewable Energy', 'Electrical Engineering'],
      'medical': ['Healthcare', 'Medical Technology', 'Biomedical Engineering'],
      'education': ['Education Technology', 'Instructional Design'],
      'transport': ['Transportation Planning', 'Traffic Engineering'],
      'waste': ['Environmental Engineering', 'Waste Management'],
      'agriculture': ['Agricultural Engineering', 'Agronomy'],
      'construction': ['Civil Engineering', 'Construction Management'],
      'network': ['Networking', 'Telecommunications'],
      'security': ['Cybersecurity', 'Information Security'],
      'finance': ['Financial Analysis', 'Economics'],
      'social': ['Social Work', 'Community Development'],
      'urban': ['Urban Planning', 'City Design']
    };

    const found: string[] = [];
    for (const [keyword, expertise] of Object.entries(expertiseMap)) {
      if (text.includes(keyword)) {
        found.push(...expertise);
      }
    }
    return [...new Set(found)].slice(0, 6) || ['General Problem Solving', 'Project Management'];
  }

  private findSimilarKeywords(text: string): string[] {
    const keywords = text.split(/\s+/).filter(w => w.length > 4);
    return [...new Set(keywords)].slice(0, 5);
  }

  private recommendCollaborators(category: string): string[] {
    const recommendations: Record<string, string[]> = {
      'Environment': ['Environmental NGOs', 'Green Technology Companies', 'Environmental Science Departments'],
      'Healthcare': ['Medical Colleges', 'Healthcare Startups', 'Public Health Organizations'],
      'Education': ['Education Technology Companies', 'Teacher Training Institutes', 'EdTech Startups'],
      'Transportation': ['Traffic Management Authorities', 'Automotive Companies', 'Civil Engineering Departments'],
      'Agriculture': ['Agricultural Universities', 'AgriTech Startups', 'Farmer Cooperatives'],
      'Infrastructure': ['Construction Companies', 'Civil Engineering Departments', 'Urban Planning Bodies'],
      'Social Welfare': ['Social Welfare NGOs', 'Women\'s Organizations', 'Child Rights Organizations']
    };
    return recommendations[category] || ['General Consulting Firms', 'Social Impact Organizations'];
  }

  private calculateMatchScore(challenge: ChallengeInput, org: any): number {
    let score = 50;
    
    // Location match
    if (org.address?.state === challenge.location.state) score += 15;
    
    // Type relevance
    const typeRelevance: Record<string, number> = {
      university: 15,
      industry: 12,
      ngo: 10,
      government: 8
    };
    score += typeRelevance[org.type] || 5;

    // Expertise match
    const orgText = `${(org.researchAreas || []).join(' ')} ${(org.capabilities || []).join(' ')} ${(org.technologies || []).join(' ')}`.toLowerCase();
    const challengeText = `${challenge.title} ${challenge.description} ${challenge.category}`.toLowerCase();
    
    const challengeWords = challengeText.split(/\s+/);
    let matchCount = 0;
    for (const word of challengeWords) {
      if (word.length > 3 && orgText.includes(word)) matchCount++;
    }
    score += Math.min(20, (matchCount / Math.max(1, challengeWords.length)) * 40);

    return Math.min(99, Math.max(0, Math.round(score)));
  }

  private generateMatchReason(challenge: ChallengeInput, org: any, score: number): string {
    const reasons: string[] = [];
    if (org.address?.state === challenge.location.state) {
      reasons.push(`Located in the same state (${challenge.location.state})`);
    }
    if (org.researchAreas?.length) {
      reasons.push(`Has relevant research areas: ${org.researchAreas.slice(0, 2).join(', ')}`);
    }
    if (org.technologies?.length) {
      reasons.push(`Offers technology expertise: ${org.technologies.slice(0, 2).join(', ')}`);
    }
    if (org.type === 'university') {
      reasons.push('Academic institution with research capabilities');
    } else if (org.type === 'industry') {
      reasons.push('Industry partner with implementation experience');
    }
    return reasons.join('. ') || `Strong overall compatibility (${score}% match)`;
  }

  private suggestRole(orgType: string, category: string): string {
    const roleMap: Record<string, string> = {
      university: 'research-partner',
      industry: 'technology-partner',
      ngo: 'mentor',
      government: 'pilot-partner'
    };
    return roleMap[orgType] || 'member';
  }

  private findExpertiseOverlap(challenge: ChallengeInput, org: any): string[] {
    const orgExpertise = [...(org.researchAreas || []), ...(org.capabilities || []), ...(org.technologies || [])];
    const challengeText = `${challenge.title} ${challenge.description}`.toLowerCase();
    return orgExpertise.filter(exp => challengeText.includes(exp.toLowerCase().split(' ')[0])).slice(0, 3);
  }
}

export default AIService;
