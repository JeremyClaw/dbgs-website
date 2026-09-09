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
    title: "Everyday computer skills",
    intro: "A few practical questions, so your coaching can start at the right level.",
    questions: [
      {
        id: "copyPaste",
        question: "How comfortable are you copying and pasting between two programs?",
        kind: "single",
        options: [
          { label: "Very comfortable", value: "easy" },
          { label: "I can manage", value: "know_how" },
          { label: "I avoid it", value: "avoid" },
        ],
      },
      {
        id: "screenshot",
        question: "Can you take a screenshot and send it to someone?",
        kind: "single",
        options: [
          { label: "Yes", value: "yes" },
          { label: "Not sure how", value: "not_sure" },
        ],
      },
      {
        id: "files",
        question: "When you download a file, do you know where it goes?",
        kind: "single",
        options: [
          { label: "Yes", value: "yes" },
          { label: "Usually", value: "usually" },
          { label: "No", value: "no" },
        ],
      },
      {
        id: "passwords",
        question: "How do you usually keep track of your passwords?",
        kind: "single",
        options: [
          { label: "Password manager", value: "manager" },
          { label: "Saved in my browser", value: "browser" },
          { label: "Written down somewhere", value: "written" },
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
      {
        id: "who",
        question: "Is this for you, or for your team?",
        kind: "single",
        options: [
          { label: "Me", value: "me" },
          { label: "My team", value: "team" },
          { label: "Both", value: "both" },
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
