export const fluentCopy = {
  brand: {
    name: "Fluent",
    descriptor: "AI, made useful",
  },
  nav: {
    cta: "Take the assessment",
  },
  hero: {
    eyebrow: "Personal AI coaching for adults 50+",
    headline: ["Make AI useful in", "your everyday life."],
    body:
      "Learn how to use AI to write, plan, research and solve everyday problems, with patient one-to-one guidance.",
    cta: "Take the 2-minute assessment",
    note: "Free assessment. If it looks useful, book a free 15-minute introduction.",
    sessionLabel: "A private working session",
    sessionDetails: ["Your work", "Your laptop", "A useful result before you leave"],
  },
  belief: {
    eyebrow: "The real problem",
    headline: "You do not need to be technically minded.",
    paragraphs: [
      "You do not. You need someone to show you what it is actually for, in the context of your own work, and then get out of the way.",
      "The people getting the most out of these tools are not engineers. They are people who have learned to ask better questions.",
    ],
  },
  format: {
    eyebrow: "What this actually is",
    statement: "Not a course. Not a webinar. Not a video library you will never open.",
    body:
      "One-to-one, on your work, on your machine. At your office if you are in Cape Town, over a call if you are not.",
  },
  outcomes: {
    eyebrow: "What changes",
    headline: "Useful work, done properly.",
    items: [
      "Read a forty page contract and get the real risks back in a page",
      "Turn a messy call recording into proper notes and a list of actions",
      "Argue with your own writing until it is sharper, instead of accepting the first draft it hands you",
      "Research something properly, and know when it is confidently wrong",
      "Build a repeatable way of doing the admin task you hate most",
    ],
  },
  audience: {
    eyebrow: "Who this is for",
    professions: [
      "Attorneys",
      "Accountants",
      "Estate agents",
      "Consultants",
      "Doctors in private practice",
      "Business owners",
    ],
    body:
      "People whose hour is worth considerably more than the hour they are currently spending on admin.",
  },
  assessment: {
    eyebrow: "The assessment",
    headline: "Four short sections. About two minutes.",
    body:
      "It shows me what you already know and what you want help with, so your coaching starts at the right level. Your recommendation appears on screen straight away.",
    cta: "Start the assessment",
    note: "No cost. No obligation. No score shown to anyone but you.",
  },
  booking: {
    resultEyebrow: "Your starting point",
    recommendationLabel: "My recommendation",
    formatLegend: "How would you like to meet?",
    inPersonLabel: "In person",
    inPersonNote: "At your Cape Town office",
    remoteLabel: "Remote",
    remoteNote: "By private video call",
    addressLabel: "Where in Cape Town should we meet?",
    addressPlaceholder: "Office address",
    addressNote: "I will confirm the location with you before the call.",
    addressPrompt: "Add your office address before choosing an in-person time.",
    pickATime: "Choose a time for your free 15-minute call",
    selectTimeNote: "Select a time below. Nothing will be booked until you confirm.",
    selectedTimeLabel: "Your selected time",
    confirmTime: "Confirm this time",
    confirmingTime: "Confirming your booking...",
    loadingSlots: "Finding available times...",
    noSlots: "There are no times showing right now. Please check again shortly.",
    availabilityError: "I could not load the calendar. Refresh the page and try again.",
    slotTaken: "That time has just been taken. Please choose another.",
    bookingError: "Something went wrong booking that time. Please try another.",
    confirmedEyebrow: "You are booked",
    confirmedHeadline: "Good. We have a time.",
    confirmedBody: "The calendar invitation and details are on their way to your inbox.",
  },
  pricing: {
    eyebrow: "Sessions",
    headline: "Choose the amount of help that fits.",
    intro: "Every session lasts 60 minutes. Most people start with three.",
    tiers: [
      { name: "One session", price: "R2,000", detail: "R2,000 per session", saving: "", featured: false },
      { name: "Two sessions", price: "R3,600", detail: "R1,800 per session", saving: "Save R400 · 10%", featured: false },
      { name: "Three sessions", price: "R4,500", detail: "R1,500 per session", saving: "Save R1,500 · 25%", featured: true },
    ],
    upgrade:
      "Book a single session first if you would rather. If you carry on within thirty days, R1,500 of it comes off the package.",
    returning: "Past clients can book individual follow-up sessions at R1,500.",
  },
  founder: {
    eyebrow: "Your coach",
    name: "Deej Burke",
    title: "Founder, DB Growth Solutions and co-founder, ThirstyBird",
    body: [
      "I run AI across two businesses every day: a performance marketing studio and a hospitality technology startup. Everything I teach is something I use on my own operation that morning.",
      "This is not theory, and it is not a course I bought and repackaged.",
    ],
    photo: "/founder/deej.png",
  },
  faq: {
    eyebrow: "Questions worth asking",
    headline: "Before you book.",
    items: [
      {
        question: "Is the first coaching session free?",
        answer:
          "The 15-minute introduction is free. Your first 60-minute coaching session is paid. You can choose one session or a package above.",
      },
      {
        question: "What if I have already used AI?",
        answer:
          "That is useful. The short assessment shows me what you already know, so we can skip the basics and work on the places where better questions, refinement or checking will help.",
      },
      {
        question: "What could we work on?",
        answer:
          "Emails, research, documents, meeting notes, repeatable admin and any other real task that is taking more time than it should. Bring your own work and your own laptop.",
      },
      {
        question: "Is what I put into AI private?",
        answer:
          "We set clear boundaries before opening anything sensitive. I show you what should never go into a public tool, how to remove identifying detail, and which privacy settings matter for the work you do.",
      },
      {
        question: "What if I have forgotten it all by the following week?",
        answer:
          "You leave with the examples we built together and a repeatable way to use them. The next session starts with your real attempts, so anything that did not stick gets fixed in context.",
      },
      {
        question: "Can you do this for my whole team?",
        answer:
          "Yes. Team sessions need a shared use case and a little preparation, so start with the assessment and choose ‘My team’ or ‘Both’. We will scope it on the intro call.",
      },
    ],
  },
  finalCta: {
    eyebrow: "Start where you actually are",
    headline: "Find out what would make the biggest difference to your work.",
    cta: "Take the 2-minute assessment",
    note: "Your result appears straight away.",
  },
  footer: {
    legal: "© 2026 Fluent. A Deej Burke coaching practice.",
    location: "Cape Town, South Africa",
  },
} as const;
