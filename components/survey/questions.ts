export type QuestionOption = { label: string; value: string };
export type Question = {
  id: string;
  question: string;
  subtext?: string;
  options: QuestionOption[];
};

export const questions: Question[] = [
  {
    id: "revenue",
    question: "Where's your business at right now, revenue-wise?",
    options: [
      { label: "Just getting started (under R20k/mo)", value: "under_20k" },
      { label: "Building momentum (R20k – R60k/mo)", value: "20k_60k" },
      { label: "Scaling (R60k – R150k/mo)", value: "60k_150k" },
      { label: "Established (R150k+/mo)", value: "150k_plus" },
    ],
  },
  {
    id: "adSpend",
    question: "What kind of media budget are you working with?",
    subtext: "This funds the ads themselves, paid directly by you to the platform.",
    options: [
      { label: "Not running paid ads yet", value: "not_running" },
      { label: "Under R10k/month", value: "under_10k" },
      { label: "R10k – R15k/month", value: "10k_15k" },
      { label: "R15k+/month", value: "15k_plus" },
    ],
  },
  {
    id: "store",
    question: "Tell us about your online store.",
    options: [
      { label: "Live on Shopify, taking orders", value: "shopify" },
      { label: "Live on another platform, taking orders", value: "other_platform" },
      { label: "Still building, pre-launch", value: "pre_launch" },
    ],
  },
  {
    id: "content",
    question: "How much creative can you help us work with each month?",
    subtext: "Photos, video, UGC, whatever you've got access to.",
    options: [
      { label: "Not much right now", value: "low" },
      { label: "A handful (1–5/month)", value: "handful" },
      { label: "A steady supply (10–15+/month)", value: "steady" },
      { label: "We've got a full content engine", value: "engine" },
    ],
  },
  {
    id: "workingStyle",
    question: "How do you like to work with a growth partner?",
    options: [
      { label: "Brief us, trust us to execute", value: "trust" },
      { label: "Want to review before anything goes live", value: "review" },
      { label: "Need someone to dream up all the creative from scratch", value: "from_scratch" },
    ],
  },
];

export type ContactDetails = {
  name: string;
  email: string;
  company: string;
};

export type Answers = Record<string, string>;
