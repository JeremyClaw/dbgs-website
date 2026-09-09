export type FluentQuestionOption = {
  label: string;
  value: string;
};

export type FluentQuestion = {
  id: string;
  question: string;
  kind: "single" | "multiple" | "text";
  options?: FluentQuestionOption[];
  optional?: boolean;
  maxLength?: number;
};

export type FluentQuestionScreen = {
  id: string;
  title: string;
  intro?: string;
  questions: FluentQuestion[];
};

export type FluentAnswer = string | string[];
export type FluentAnswers = Record<string, FluentAnswer>;
export type FluentContactDetails = {
  name: string;
  email: string;
  mobile: string;
};

export const questionScreens: FluentQuestionScreen[] = [
  {
    id: "starting-point",
    title: "Where you are starting",
    questions: [
      {
        id: "device",
        question: "What do you mainly work on?",
        kind: "single",
        options: [
          { label: "Windows laptop", value: "windows" },
          { label: "Mac", value: "mac" },
          { label: "iPad", value: "ipad" },
          { label: "Mostly my phone", value: "phone" },
        ],
      },
      {
        id: "tried",
        question: "Which of these AI tools have you used?",
        kind: "multiple",
        options: [
          { label: "ChatGPT", value: "chatgpt" },
          { label: "Claude", value: "claude" },
          { label: "Gemini", value: "gemini" },
          { label: "Copilot", value: "copilot" },
          { label: "Meta AI in WhatsApp", value: "whatsapp" },
          { label: "None yet", value: "none" },
        ],
      },
      {
        id: "paying",
        question: "Do you pay for any of them?",
        kind: "single",
        options: [
          { label: "Yes", value: "yes" },
          { label: "No", value: "no" },
          { label: "Not sure", value: "not_sure" },
        ],
      },
    ],
  },
  {
    id: "mechanics",
    title: "So we start in the right place",
    intro: "People use their devices in different ways. These answers help me prepare for the way you already work.",
    questions: [
      {
        id: "copyPaste",
        question: "When you need to move text from one place to another, what do you usually do?",
        kind: "single",
        options: [
          { label: "Copy and paste it", value: "easy" },
          { label: "I can do it when needed", value: "know_how" },
          { label: "I usually retype it", value: "avoid" },
        ],
      },
      {
        id: "screenshot",
        question: "How do you usually share something you can see on your screen?",
        kind: "single",
        options: [
          { label: "I send a screenshot", value: "yes" },
          { label: "I use another way", value: "not_sure" },
        ],
      },
      {
        id: "files",
        question: "When you download a file, what normally happens next?",
        kind: "single",
        options: [
          { label: "I open it from my downloads", value: "yes" },
          { label: "I usually find it", value: "usually" },
          { label: "I ask someone where it went", value: "no" },
        ],
      },
      {
        id: "passwords",
        question: "Where do you normally keep your passwords?",
        kind: "single",
        options: [
          { label: "In a password manager", value: "manager" },
          { label: "Saved on my device", value: "browser" },
          { label: "In my own written list", value: "written" },
        ],
      },
    ],
  },
  {
    id: "goals",
    title: "What you want help with",
    questions: [
      {
        id: "context",
        question: "Where would this help most?",
        kind: "single",
        options: [
          { label: "Work", value: "work" },
          { label: "Personal", value: "personal" },
          { label: "Both", value: "both" },
        ],
      },
      {
        id: "useCase",
        question: "What would you most like AI to help with first?",
        kind: "single",
        options: [
          { label: "Writing", value: "writing" },
          { label: "Research", value: "research" },
          { label: "Admin", value: "admin" },
          { label: "Documents and contracts", value: "documents_contracts" },
          { label: "Learning something new", value: "learning" },
          { label: "Planning", value: "planning" },
          { label: "Images", value: "images" },
          { label: "Not sure yet", value: "not_sure" },
        ],
      },
      {
        id: "timeSink",
        question: "What takes up too much time in your week?",
        kind: "text",
        optional: true,
        maxLength: 200,
      },
    ],
  },
  {
    id: "fit",
    title: "What gets in the way",
    questions: [
      {
        id: "blocker",
        question: "What has stopped you so far?",
        kind: "single",
        options: [
          { label: "Too technical", value: "too_technical" },
          { label: "I do not trust it", value: "distrust" },
          { label: "Privacy concerns", value: "privacy" },
          { label: "Tried it and it was rubbish", value: "tried_bad" },
          { label: "No time", value: "no_time" },
          { label: "I do not know what to ask it", value: "dont_know_what_to_ask" },
        ],
      },
      {
        id: "hourlyValue",
        question: "Roughly what would you value an hour of your time at?",
        kind: "single",
        options: [
          { label: "Under R500", value: "under_500" },
          { label: "R500 to R1,500", value: "500_1500" },
          { label: "R1,500 to R3,000", value: "1500_3000" },
          { label: "R3,000+", value: "3000_plus" },
          { label: "Rather not say", value: "rather_not_say" },
        ],
      },
    ],
  },
];

export const questions = questionScreens.flatMap((screen) => screen.questions);

export function getFluentQuestionLabel(questionId: string) {
  return questions.find((question) => question.id === questionId)?.question ?? questionId;
}

export function getFluentAnswerLabel(questionId: string, answer: FluentAnswer): string {
  if (Array.isArray(answer)) {
    return answer.map((value) => getFluentAnswerLabel(questionId, value)).join(", ");
  }

  const question = questions.find((item) => item.id === questionId);
  return question?.options?.find((option) => option.value === answer)?.label ?? answer;
}
