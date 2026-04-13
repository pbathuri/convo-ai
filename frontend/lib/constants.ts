export const DOMAINS = [
  {
    key: "business_communication",
    label: "Business Communication",
    icon: "\u{1F4BC}",
    color: "#4a90e2",
    subdomains: [
      { key: "networking", label: "Networking", learners: "12.4K" },
      { key: "persuasion", label: "Persuasion", learners: "8.9K" },
      { key: "elevator_pitch", label: "Elevator Pitch", learners: "15.2K" },
      { key: "negotiation", label: "Negotiation", learners: "22.1K" },
    ],
  },
  {
    key: "debate_simulation",
    label: "Debate & Argumentation",
    icon: "\u{2694}\u{FE0F}",
    color: "#e74c3c",
    subdomains: [
      { key: "formal_debate", label: "Formal Debate", learners: "6.7K" },
      { key: "persuasive_argument", label: "Persuasive Argument", learners: "9.1K" },
      { key: "cross_examination", label: "Cross-Examination", learners: "4.3K" },
    ],
  },
  {
    key: "sales_conversation",
    label: "Sales & Persuasion",
    icon: "\u{1F3AF}",
    color: "#f39c12",
    subdomains: [
      { key: "cold_calling", label: "Cold Calling", learners: "11.2K" },
      { key: "closing_deals", label: "Closing Deals", learners: "18.5K" },
      { key: "objection_handling", label: "Objection Handling", learners: "14.8K" },
    ],
  },
  {
    key: "emotional_intelligence",
    label: "Emotional Intelligence",
    icon: "\u{2764}\u{FE0F}",
    color: "#e91e63",
    subdomains: [
      { key: "active_listening", label: "Active Listening", learners: "20.3K" },
      { key: "empathy", label: "Empathy & Understanding", learners: "16.7K" },
      { key: "conflict_resolution", label: "Conflict Resolution", learners: "13.1K" },
    ],
  },
  {
    key: "philosophy",
    label: "Philosophy & Ethics",
    icon: "\u{1F4DA}",
    color: "#9b59b6",
    subdomains: [
      { key: "existentialism", label: "Existentialism", learners: "5.2K" },
      { key: "ethics", label: "Ethics & Morality", learners: "7.8K" },
      { key: "socratic_dialogue", label: "Socratic Dialogue", learners: "4.5K" },
    ],
  },
  {
    key: "political_conversation",
    label: "Political Science",
    icon: "\u{1F3DB}\u{FE0F}",
    color: "#2c3e50",
    subdomains: [
      { key: "policy_debate", label: "Policy Debate", learners: "8.4K" },
      { key: "diplomacy", label: "Diplomacy", learners: "6.2K" },
      { key: "civic_engagement", label: "Civic Engagement", learners: "5.9K" },
    ],
  },
  {
    key: "ai_society",
    label: "AI & Society",
    icon: "\u{1F916}",
    color: "#00bcd4",
    subdomains: [
      { key: "ai_ethics", label: "AI Ethics", learners: "9.6K" },
      { key: "tech_policy", label: "Tech Policy", learners: "7.1K" },
      { key: "future_of_work", label: "Future of Work", learners: "11.3K" },
    ],
  },
  {
    key: "satirical_political_commentary",
    label: "Satirical Commentary",
    icon: "\u{1F3AD}",
    color: "#ff5722",
    subdomains: [
      { key: "political_satire", label: "Political Satire", learners: "4.8K" },
      { key: "social_commentary", label: "Social Commentary", learners: "6.3K" },
      { key: "media_criticism", label: "Media Criticism", learners: "5.1K" },
    ],
  },
] as const;

export const EXPERIENCE_LEVELS = [
  {
    key: "complete_beginner",
    label: "Complete Beginner",
    description: "I've never practiced this formally",
    icon: "\u{1F331}",
  },
  {
    key: "some_exposure",
    label: "Some Exposure",
    description: "I know a few basic concepts",
    icon: "\u{1F33F}",
  },
  {
    key: "intermediate",
    label: "Intermediate",
    description: "I can hold a basic conversation on this topic",
    icon: "\u{1F333}",
  },
  {
    key: "advanced",
    label: "Advanced",
    description: "I can discuss this in depth and nuance",
    icon: "\u{1F3D4}\u{FE0F}",
  },
] as const;

export const DISCOVERY_SOURCES = [
  { key: "friends", label: "Friends or colleagues", icon: "\u{1F465}" },
  { key: "youtube", label: "YouTube video", icon: "\u{25B6}\u{FE0F}" },
  { key: "tiktok", label: "TikTok", icon: "\u{1F3B5}" },
  { key: "news", label: "News or articles", icon: "\u{1F4F0}" },
  { key: "google", label: "Google search", icon: "\u{1F50D}" },
  { key: "social", label: "Social media", icon: "\u{1F4F1}" },
  { key: "school", label: "School or university", icon: "\u{1F393}" },
  { key: "other", label: "Other", icon: "\u{2728}" },
] as const;

export const LEARNING_GOALS = [
  { key: "career", label: "Career growth", icon: "\u{1F4BC}" },
  { key: "hobby", label: "Useful hobby / self-improvement", icon: "\u{1F9E9}" },
  { key: "academic", label: "Academic requirement", icon: "\u{1F393}" },
  { key: "social", label: "Better social interactions", icon: "\u{1F465}" },
  { key: "confidence", label: "Build confidence", icon: "\u{1F4AA}" },
  { key: "leadership", label: "Leadership development", icon: "\u{1F3C6}" },
  { key: "just_fun", label: "Just for fun", icon: "\u{2728}" },
] as const;

export const SKILL_LEVELS = [
  { key: "none", label: "I have no background in this", bars: 1 },
  { key: "basics", label: "I know the basic concepts", bars: 2 },
  { key: "simple_convo", label: "I can hold a simple conversation", bars: 3 },
  { key: "various_topics", label: "I can discuss various topics", bars: 4 },
  { key: "detailed", label: "I can discuss most topics in detail", bars: 5 },
] as const;

export const DAILY_GOALS = [
  { minutes: 5, label: "5 minutes a day", tag: "Casual" },
  { minutes: 10, label: "10 minutes a day", tag: "Regular" },
  { minutes: 15, label: "15 minutes a day", tag: "Serious" },
  { minutes: 20, label: "20 minutes a day", tag: "Intensive" },
] as const;

export const STEP_PROGRESS_PCT: Record<number, number> = {
  1: 11,
  2: 22,
  3: 33,
  4: 44,
  5: 55,
  6: 66,
  7: 77,
  8: 88,
  9: 100,
};

export const ONBOARDING_ROUTES = [
  "domain",
  "subdomain",
  "experience",
  "discovery",
  "goal",
  "level",
  "daily",
  "path",
  "ready",
] as const;

export type OnboardingRoute = (typeof ONBOARDING_ROUTES)[number];

export function stepFromPathname(pathname: string): number {
  const seg = pathname.split("/").pop() || "";
  const idx = ONBOARDING_ROUTES.indexOf(seg as OnboardingRoute);
  return idx >= 0 ? idx + 1 : 1;
}

export const ONBOARDING_QUESTIONS: Record<OnboardingRoute, string> = {
  domain: "What would you like to practice?",
  subdomain: "Great choice! Now pick a focus area.",
  experience: "How much experience do you have in this area?",
  discovery: "How did you hear about Convo AI?",
  goal: "Why do you want to improve your communication?",
  level: "Let's gauge where you are right now!",
  daily: "What daily goal should we set?",
  path: "Now let's decide how to start!",
  ready: "",
};
