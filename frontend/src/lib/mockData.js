// Mock data for demo mode (no backend required)

export const mockOverview = {
  totalMentions: 15847,
  sentiment: {
    positive: '45.2',
    negative: '28.7',
    neutral: '26.1'
  },
  trendingHashtags: [
    { tag: 'zambiadecides', count: 3421 },
    { tag: 'elections2026', count: 2876 },
    { tag: 'economy', count: 2134 },
    { tag: 'jobs', count: 1987 },
    { tag: 'youth', count: 1654 }
  ],
  mostDiscussedParty: {
    name: 'United Party for National Development',
    abbreviation: 'UPND',
    color: '#dc2626'
  }
};

export const mockSentimentTrends = [
  { time: 1, sentiment: 'positive', count: 120, avgScore: 0.7 },
  { time: 2, sentiment: 'positive', count: 145, avgScore: 0.65 },
  { time: 3, sentiment: 'positive', count: 167, avgScore: 0.72 },
  { time: 4, sentiment: 'positive', count: 189, avgScore: 0.68 },
  { time: 5, sentiment: 'positive', count: 201, avgScore: 0.75 },
  { time: 6, sentiment: 'positive', count: 234, avgScore: 0.71 },
  { time: 7, sentiment: 'positive', count: 256, avgScore: 0.69 },
];

export const mockPartyComparison = [
  {
    party: { id: '1', name: 'UPND', abbreviation: 'UPND', color: '#dc2626' },
    mentions: 5432,
    engagement: 12876,
    sentiment: { positive: '48.5', negative: '26.3', neutral: '25.2', netScore: '22.2' }
  },
  {
    party: { id: '2', name: 'PF', abbreviation: 'PF', color: '#16a34a' },
    mentions: 4321,
    engagement: 10234,
    sentiment: { positive: '42.1', negative: '31.2', neutral: '26.7', netScore: '10.9' }
  },
  {
    party: { id: '3', name: 'SP', abbreviation: 'SP', color: '#f59e0b' },
    mentions: 2876,
    engagement: 6543,
    sentiment: { positive: '45.8', negative: '28.9', neutral: '25.3', netScore: '16.9' }
  },
  {
    party: { id: '4', name: 'UKA', abbreviation: 'UKA', color: '#3b82f6' },
    mentions: 1987,
    engagement: 4321,
    sentiment: { positive: '41.2', negative: '32.1', neutral: '26.7', netScore: '9.1' }
  }
];

export const mockCandidateLeaderboard = [
  {
    candidate: {
      id: '1',
      name: 'Hakainde Hichilema',
      photo: null,
      party: { name: 'UPND', abbreviation: 'UPND', color: '#dc2626' }
    },
    mentions: 3421,
    positivePercent: '52.3',
    negativePercent: '24.1',
    netSentiment: '28.2'
  },
  {
    candidate: {
      id: '2',
      name: 'Edgar Lungu',
      photo: null,
      party: { name: 'PF', abbreviation: 'PF', color: '#16a34a' }
    },
    mentions: 2876,
    positivePercent: '38.7',
    negativePercent: '35.2',
    netSentiment: '3.5'
  },
  {
    candidate: {
      id: '3',
      name: "Fred M'membe",
      photo: null,
      party: { name: 'SP', abbreviation: 'SP', color: '#f59e0b' }
    },
    mentions: 1654,
    positivePercent: '46.8',
    negativePercent: '28.3',
    netSentiment: '18.5'
  }
];

export const mockRecentPosts = [
  {
    _id: '1',
    content: 'The economy needs urgent attention from our leaders. Youth unemployment is at an all-time high.',
    source: 'twitter',
    sentiment: { label: 'negative', score: -0.6 },
    publishedAt: new Date(Date.now() - 5 * 60000).toISOString(),
    author: { username: 'zambian_voice' }
  },
  {
    _id: '2',
    content: 'Great progress on infrastructure development in Lusaka. The new roads are making a difference!',
    source: 'facebook',
    sentiment: { label: 'positive', score: 0.8 },
    publishedAt: new Date(Date.now() - 15 * 60000).toISOString(),
    author: { username: 'lusaka_resident' }
  },
  {
    _id: '3',
    content: 'Education reforms are essential for our future. We need more investment in schools.',
    source: 'twitter',
    sentiment: { label: 'neutral', score: 0.1 },
    publishedAt: new Date(Date.now() - 25 * 60000).toISOString(),
    author: { username: 'edu_advocate' }
  },
  {
    _id: '4',
    content: 'Healthcare accessibility should be a priority for all political parties.',
    source: 'news',
    sentiment: { label: 'neutral', score: 0.0 },
    publishedAt: new Date(Date.now() - 35 * 60000).toISOString(),
    author: { username: 'health_watch' }
  },
  {
    _id: '5',
    content: 'Corruption must be fought at all levels. We demand transparency and accountability!',
    source: 'twitter',
    sentiment: { label: 'negative', score: -0.7 },
    publishedAt: new Date(Date.now() - 45 * 60000).toISOString(),
    author: { username: 'anti_corruption' }
  }
];

export const mockParties = [
  {
    _id: '1',
    name: 'United Party for National Development',
    abbreviation: 'UPND',
    color: '#dc2626',
    leader: 'Hakainde Hichilema',
    description: 'A political party focused on economic development and democratic governance.'
  },
  {
    _id: '2',
    name: 'Patriotic Front',
    abbreviation: 'PF',
    color: '#16a34a',
    leader: 'Edgar Lungu',
    description: 'Former ruling party with focus on infrastructure and social programs.'
  },
  {
    _id: '3',
    name: 'Socialist Party',
    abbreviation: 'SP',
    color: '#f59e0b',
    leader: "Fred M'membe",
    description: 'Progressive party advocating for social justice and economic equality.'
  },
  {
    _id: '4',
    name: 'United Kwacha Alliance',
    abbreviation: 'UKA',
    color: '#3b82f6',
    leader: 'Various Leaders',
    description: 'Coalition of opposition parties united for democratic change.'
  }
];

export const mockCandidates = [
  {
    _id: '1',
    name: 'Hakainde Hichilema',
    party: {
      _id: '1',
      name: 'United Party for National Development',
      abbreviation: 'UPND',
      color: '#dc2626'
    },
    position: 'president',
    photo: null
  },
  {
    _id: '2',
    name: 'Edgar Lungu',
    party: {
      _id: '2',
      name: 'Patriotic Front',
      abbreviation: 'PF',
      color: '#16a34a'
    },
    position: 'president',
    photo: null
  },
  {
    _id: '3',
    name: "Fred M'membe",
    party: {
      _id: '3',
      name: 'Socialist Party',
      abbreviation: 'SP',
      color: '#f59e0b'
    },
    position: 'president',
    photo: null
  }
];

export const mockWordCloud = {
  hashtags: [
    { text: 'zambiadecides', value: 3421 },
    { text: 'elections2026', value: 2876 },
    { text: 'economy', value: 2134 },
    { text: 'jobs', value: 1987 },
    { text: 'youth', value: 1654 },
    { text: 'education', value: 1432 },
    { text: 'health', value: 1287 },
    { text: 'corruption', value: 1156 },
    { text: 'infrastructure', value: 987 },
    { text: 'democracy', value: 876 }
  ],
  topics: [
    { text: 'economy', value: 4532 },
    { text: 'jobs', value: 3876 },
    { text: 'education', value: 3421 },
    { text: 'health', value: 2987 },
    { text: 'corruption', value: 2654 },
    { text: 'infrastructure', value: 2341 },
    { text: 'agriculture', value: 1987 },
    { text: 'youth', value: 1765 }
  ]
};

export const mockProvinceAnalytics = [
  { _id: 'Lusaka', totalMentions: 4532, avgSentiment: 0.15 },
  { _id: 'Copperbelt', totalMentions: 3876, avgSentiment: 0.08 },
  { _id: 'Southern', totalMentions: 2341, avgSentiment: 0.22 },
  { _id: 'Eastern', totalMentions: 1987, avgSentiment: 0.12 },
  { _id: 'Northern', totalMentions: 1654, avgSentiment: -0.05 },
  { _id: 'Luapula', totalMentions: 1432, avgSentiment: 0.03 },
  { _id: 'North-Western', totalMentions: 1287, avgSentiment: 0.18 },
  { _id: 'Western', totalMentions: 1156, avgSentiment: 0.09 },
  { _id: 'Central', totalMentions: 987, avgSentiment: 0.14 },
  { _id: 'Muchinga', totalMentions: 876, avgSentiment: 0.06 }
];

export const mockAlerts = [
  {
    _id: '1',
    name: 'UPND Sentiment Spike',
    type: 'sentiment_spike',
    conditions: { threshold: 20, timeWindow: 24 },
    isActive: true,
    triggerCount: 3
  },
  {
    _id: '2',
    name: 'Economy Topic Surge',
    type: 'hashtag_trend',
    conditions: { threshold: 15, timeWindow: 12 },
    isActive: true,
    triggerCount: 7
  }
];

export const mockUsers = [
  {
    _id: '1',
    name: 'Admin User',
    email: 'admin@zedpulse.zm',
    role: 'admin',
    isActive: true
  },
  {
    _id: '2',
    name: 'Analyst User',
    email: 'analyst@zedpulse.zm',
    role: 'analyst',
    isActive: true
  },
  {
    _id: '3',
    name: 'Viewer User',
    email: 'viewer@zedpulse.zm',
    role: 'viewer',
    isActive: true
  }
];

export const mockUser = {
  id: '1',
  name: 'Demo User',
  email: 'demo@zedpulse.zm',
  role: 'admin'
};
