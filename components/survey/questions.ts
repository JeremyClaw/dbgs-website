export type QuestionOption = { label: string; value: string };
export type Question = {
  id: string;
  question: string;
  subtext?: string;
  options: QuestionOption[];
};

export const questions: Question[] = [
  {
    id: "category",
    question: "What type of brand are you building?",
    subtext: "This helps us tailor the strategy to your kind of product.",
    options: [
      { label: "Jewellery", value: "jewellery" },
      { label: "Clothing / apparel", value: "apparel" },
      { label: "Beauty / skincare", value: "beauty" },
      { label: "Accessories", value: "accessories" },
      { label: "Home / lifestyle", value: "home_lifestyle" },
      { label: "Problem-solving product", value: "problem_product" },
      { label: "Other", value: "other" },
    ],
  },
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
    question: "Tell us about your store.",
    options: [
      { label: "Live on Shopify, taking orders", value: "shopify" },
      { label: "Live on another platform, taking orders", value: "other_platform" },
      { label: "Still building, pre-launch", value: "pre_launch" },
    ],
  },
  {
    id: "demandSignal",
    question: "Are people already buying from you?",
    subtext: "Online sales count, but markets, wholesale, pop-ups and stockists count too.",
    options: [
      { label: "We are pre-launch or still building the first collection", value: "pre_launch" },
      { label: "Sales are mostly friends, family or occasional DMs", value: "early_signal" },
      {
        label: "We sell well through markets, wholesale, pop-ups or stockists, but online is underdeveloped",
        value: "offline_signal",
      },
      { label: "We get consistent sales through the online store or Instagram", value: "online_consistent" },
      { label: "We have clear bestsellers, repeat customers and steady demand", value: "repeat_bestsellers" },
    ],
  },
  {
    id: "bottleneck",
    question: "What is the biggest thing you want fixed right now?",
    subtext: "This helps us route you to the right kind of call.",
    options: [
      { label: "I need more profitable sales from paid ads", value: "scale_ads" },
      { label: "My store is getting traffic, but not enough sales", value: "cro" },
      { label: "Tracking, pixels or reporting are messy", value: "tracking" },
      { label: "I need help figuring out what to do first", value: "direction" },
    ],
  },
  {
    id: "helpNeeded",
    question: "What kind of help are you looking for?",
    options: [
      { label: "Someone to manage and improve paid media", value: "management" },
      { label: "A paid audit, website fixes, or setup project", value: "audit_setup" },
      { label: "A quick expert opinion before I decide", value: "quick_opinion" },
      { label: "I am mainly gathering ideas for now", value: "free_advice" },
    ],
  },
  {
    id: "urgency",
    question: "How soon do you want to act on this?",
    options: [
      { label: "This month", value: "this_month" },
      { label: "In the next 30-60 days", value: "30_60" },
      { label: "Later, I am still researching", value: "researching" },
    ],
  },
  {
    id: "budgetExpectation",
    question: "How are you thinking about budget and results?",
    subtext:
      "Think total monthly growth budget: ad spend, management, and any creative or setup work.",
    options: [
      { label: "I need help working out the right budget before I spend", value: "needs_budget_guidance" },
      {
        label: "Lean test: up to R15k/month total, mainly learning and setup",
        value: "lean_test",
      },
      {
        label: "Growth push: R15k-R40k/month total, want steady improvement over 60-90 days",
        value: "growth_push",
      },
      {
        label: "Scale push: R40k+/month total, ready to fund ads, management and creative properly",
        value: "scale_push",
      },
      {
        label: "Small budget, but I need a big sales jump quickly",
        value: "small_budget_big_jump",
      },
    ],
  },
  {
    id: "investment",
    question: "If there is a clear plan, are you ready to invest in getting this fixed?",
    options: [
      { label: "Yes, I have budget for the right help", value: "ready" },
      { label: "Maybe, if the first step is clear", value: "maybe" },
      { label: "Not yet, I am not ready to invest", value: "not_ready" },
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
  storeUrl: string;
  instagram: string;
};

export type Answers = Record<string, string>;

export function getQuestionLabel(questionId: string) {
  return questions.find((question) => question.id === questionId)?.question ?? questionId;
}

export function getAnswerLabel(questionId: string, value: string) {
  return (
    questions
      .find((question) => question.id === questionId)
      ?.options.find((option) => option.value === value)?.label ?? value
  );
}
