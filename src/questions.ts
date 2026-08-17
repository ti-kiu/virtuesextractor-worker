// 66 Scenario-based questions for Soul Virtues Extractor
// Each question measures 1-3 virtues with weighted scores

export interface Question {
  id: number;
  scenario: string;
  options: {
    text: string;
    scores: Record<string, number>; // virtue -> score (1-5)
  }[];
}

export const questions: Question[] = [
  // Determination questions (1-10)
  {
    id: 1,
    scenario: "You've been working on a project for weeks. The deadline is tomorrow and you're only 60% done. What do you do?",
    options: [
      { text: "Work through the night to finish as much as possible", scores: { determination: 5, perseverance: 4 } },
      { text: "Ask for an extension and explain the situation", scores: { determination: 3, integrity: 4 } },
      { text: "Submit what you have and accept the consequences", scores: { determination: 2, patience: 3 } },
      { text: "Give up and start something new", scores: { determination: 1 } }
    ]
  },
  {
    id: 2,
    scenario: "You're learning a new skill and hit a plateau. Progress has stalled for weeks. What's your approach?",
    options: [
      { text: "Double your practice time and push through", scores: { determination: 5, perseverance: 5 } },
      { text: "Try a completely different learning method", scores: { determination: 4, bravery: 3 } },
      { text: "Take a break and come back refreshed", scores: { patience: 4, determination: 2 } },
      { text: "Accept that this skill isn't for you", scores: { determination: 1 } }
    ]
  },
  {
    id: 3,
    scenario: "Your team wants to quit a project halfway through. You believe in it. What do you do?",
    options: [
      { text: "Convince them to continue with a new plan", scores: { determination: 5, bravery: 4 } },
      { text: "Offer to finish it yourself", scores: { determination: 5, perseverance: 5 } },
      { text: "Listen to their concerns and compromise", scores: { patience: 4, kindness: 3 } },
      { text: "Accept the team's decision", scores: { patience: 3, justice: 3 } }
    ]
  },
  {
    id: 4,
    scenario: "You set a personal goal to exercise daily. After 3 weeks, you miss a day. What happens next?",
    options: [
      { text: "Resume immediately the next day", scores: { determination: 5, perseverance: 4 } },
      { text: "Forgive yourself and adjust the goal", scores: { patience: 4, kindness: 3 } },
      { text: "Feel guilty but continue", scores: { determination: 3, integrity: 3 } },
      { text: "Use it as an excuse to stop entirely", scores: { determination: 1 } }
    ]
  },
  {
    id: 5,
    scenario: "You're applying for jobs and keep getting rejected. How do you handle it?",
    options: [
      { text: "Keep applying and improve your approach each time", scores: { determination: 5, perseverance: 5 } },
      { text: "Ask for feedback and use it to grow", scores: { determination: 4, integrity: 4 } },
      { text: "Take a break to rebuild confidence", scores: { patience: 4, kindness: 3 } },
      { text: "Consider a different career path", scores: { determination: 2, bravery: 3 } }
    ]
  },
  {
    id: 6,
    scenario: "You're saving money for something important. Friends invite you on an expensive trip. What do you do?",
    options: [
      { text: "Decline and stay focused on your goal", scores: { determination: 5, integrity: 4 } },
      { text: "Go but budget carefully", scores: { determination: 3, kindness: 3 } },
      { text: "Postpone your savings goal temporarily", scores: { determination: 2, patience: 3 } },
      { text: "Go and worry about money later", scores: { determination: 1 } }
    ]
  },
  {
    id: 7,
    scenario: "You're cooking a complex recipe and it's going wrong. What do you do?",
    options: [
      { text: "Try to salvage it with creative adjustments", scores: { determination: 4, bravery: 3 } },
      { text: "Start over from scratch", scores: { determination: 5, perseverance: 4 } },
      { text: "Order takeout and try again tomorrow", scores: { patience: 4, determination: 2 } },
      { text: "Give up on cooking for now", scores: { determination: 1 } }
    ]
  },
  {
    id: 8,
    scenario: "You're writing a book and feel uninspired. The words aren't flowing. What's your move?",
    options: [
      { text: "Write through the block, even if it's bad", scores: { determination: 5, perseverance: 5 } },
      { text: "Change your environment to spark creativity", scores: { determination: 4, bravery: 3 } },
      { text: "Take a walk and clear your mind", scores: { patience: 4, determination: 2 } },
      { text: "Set it aside indefinitely", scores: { determination: 1 } }
    ]
  },
  {
    id: 9,
    scenario: "You're training for a marathon. Halfway through training, you get a minor injury. What do you do?",
    options: [
      { text: "Modify your training to work around it", scores: { determination: 5, patience: 4 } },
      { text: "Push through the pain", scores: { determination: 4, bravery: 3 } },
      { text: "Rest until healed, then resume", scores: { patience: 5, determination: 3 } },
      { text: "Quit the marathon plan", scores: { determination: 1 } }
    ]
  },
  {
    id: 10,
    scenario: "You're building a side project that's not gaining traction. What keeps you going?",
    options: [
      { text: "Belief in the long-term vision", scores: { determination: 5, perseverance: 5 } },
      { text: "The joy of building itself", scores: { determination: 4, kindness: 3 } },
      { text: "Feedback from the few users you have", scores: { determination: 3, justice: 3 } },
      { text: "Nothing—I'd probably move on", scores: { determination: 1 } }
    ]
  },

  // Bravery questions (11-20)
  {
    id: 11,
    scenario: "You see someone being treated unfairly in public. What do you do?",
    options: [
      { text: "Step in and speak up immediately", scores: { bravery: 5, justice: 5 } },
      { text: "Approach the person being treated unfairly privately", scores: { bravery: 4, kindness: 4 } },
      { text: "Report it to authorities", scores: { bravery: 3, justice: 4 } },
      { text: "Walk away—it's not your business", scores: { bravery: 1 } }
    ]
  },
  {
    id: 12,
    scenario: "Your boss asks you to do something that goes against your values. What's your response?",
    options: [
      { text: "Refuse directly and explain why", scores: { bravery: 5, integrity: 5 } },
      { text: "Suggest an alternative approach", scores: { bravery: 4, integrity: 4 } },
      { text: "Do it but express your discomfort", scores: { bravery: 2, integrity: 3 } },
      { text: "Do it without question", scores: { bravery: 1, integrity: 1 } }
    ]
  },
  {
    id: 13,
    scenario: "You have a great idea in a meeting but everyone else seems to disagree. What do you do?",
    options: [
      { text: "Present your idea with confidence", scores: { bravery: 5, determination: 4 } },
      { text: "Wait for a better moment to bring it up", scores: { bravery: 3, patience: 4 } },
      { text: "Mention it briefly to test the waters", scores: { bravery: 3, integrity: 3 } },
      { text: "Stay silent to avoid conflict", scores: { bravery: 1 } }
    ]
  },
  {
    id: 14,
    scenario: "You need to have a difficult conversation with a friend about something they did. How do you approach it?",
    options: [
      { text: "Be direct but kind about the issue", scores: { bravery: 5, kindness: 4, integrity: 4 } },
      { text: "Write down your thoughts first, then talk", scores: { bravery: 4, integrity: 4 } },
      { text: "Wait for them to bring it up", scores: { bravery: 2, patience: 3 } },
      { text: "Avoid the conversation entirely", scores: { bravery: 1 } }
    ]
  },
  {
    id: 15,
    scenario: "You're offered a promotion that requires relocating to a new city. What do you do?",
    options: [
      { text: "Accept—new challenges excite you", scores: { bravery: 5, determination: 4 } },
      { text: "Research thoroughly before deciding", scores: { bravery: 3, patience: 4 } },
      { text: "Discuss with family first", scores: { bravery: 3, kindness: 4 } },
      { text: "Decline—comfort zone is safer", scores: { bravery: 1, patience: 3 } }
    ]
  },
  {
    id: 16,
    scenario: "You're at a party and someone makes a joke that's offensive to a group. What do you do?",
    options: [
      { text: "Call it out immediately", scores: { bravery: 5, justice: 5 } },
      { text: "Make a counter-joke to shift the mood", scores: { bravery: 4, kindness: 3 } },
      { text: "Talk to the person privately later", scores: { bravery: 3, kindness: 4 } },
      { text: "Ignore it to avoid awkwardness", scores: { bravery: 1 } }
    ]
  },
  {
    id: 17,
    scenario: "You discover a colleague is taking credit for your work. What do you do?",
    options: [
      { text: "Address it directly with them", scores: { bravery: 5, integrity: 4 } },
      { text: "Document your contributions and present them", scores: { bravery: 4, integrity: 4 } },
      { text: "Talk to your manager privately", scores: { bravery: 3, justice: 4 } },
      { text: "Let it go—it's not worth the conflict", scores: { bravery: 1, patience: 3 } }
    ]
  },
  {
    id: 18,
    scenario: "You're scared of public speaking but need to present to a large audience. What do you do?",
    options: [
      { text: "Practice relentlessly and face the fear", scores: { bravery: 5, determination: 5 } },
      { text: "Prepare thoroughly to build confidence", scores: { bravery: 4, determination: 4 } },
      { text: "Ask someone else to present", scores: { bravery: 1 } },
      { text: "Cancel the presentation", scores: { bravery: 1 } }
    ]
  },
  {
    id: 19,
    scenario: "You witness a car accident. What's your first instinct?",
    options: [
      { text: "Run to help immediately", scores: { bravery: 5, kindness: 5 } },
      { text: "Call emergency services first", scores: { bravery: 4, justice: 4 } },
      { text: "Check if others are helping", scores: { bravery: 3, patience: 3 } },
      { text: "Drive by—others will help", scores: { bravery: 1 } }
    ]
  },
  {
    id: 20,
    scenario: "You have to choose between a safe option and a risky one that could change your life. What do you do?",
    options: [
      { text: "Take the risk—you only live once", scores: { bravery: 5, determination: 4 } },
      { text: "Calculate the risks and make an informed choice", scores: { bravery: 4, patience: 4 } },
      { text: "Choose safety but plan for future risks", scores: { bravery: 2, patience: 4 } },
      { text: "Always choose safety", scores: { bravery: 1 } }
    ]
  },

  // Justice questions (21-30)
  {
    id: 21,
    scenario: "You find a wallet with $500 and an ID. What do you do?",
    options: [
      { text: "Return it immediately with all contents", scores: { justice: 5, integrity: 5 } },
      { text: "Return it but keep the cash as a 'finder's fee'", scores: { justice: 2, integrity: 2 } },
      { text: "Turn it in to the police", scores: { justice: 4, integrity: 4 } },
      { text: "Keep it—finders keepers", scores: { justice: 1, integrity: 1 } }
    ]
  },
  {
    id: 22,
    scenario: "A friend tells you a secret that could hurt someone else. What do you do?",
    options: [
      { text: "Encourage your friend to come forward", scores: { justice: 5, integrity: 4 } },
      { text: "Keep the secret but monitor the situation", scores: { justice: 3, kindness: 3 } },
      { text: "Tell the person who could be hurt", scores: { justice: 5, bravery: 4 } },
      { text: "Stay out of it entirely", scores: { justice: 1 } }
    ]
  },
  {
    id: 23,
    scenario: "You're in a group project and one person isn't contributing. How do you handle it?",
    options: [
      { text: "Address it directly with the group", scores: { justice: 5, bravery: 4 } },
      { text: "Talk to the person privately first", scores: { justice: 4, kindness: 4 } },
      { text: "Do their work to keep peace", scores: { justice: 1, kindness: 3 } },
      { text: "Report them to the teacher/manager", scores: { justice: 4, bravery: 3 } }
    ]
  },
  {
    id: 24,
    scenario: "You see someone cheating on an exam. What do you do?",
    options: [
      { text: "Report it to the teacher", scores: { justice: 5, integrity: 5 } },
      { text: "Confront the person directly", scores: { justice: 4, bravery: 4 } },
      { text: "Ignore it—not your problem", scores: { justice: 1 } },
      { text: "Consider cheating too since they're getting away with it", scores: { justice: 1, integrity: 1 } }
    ]
  },
  {
    id: 25,
    scenario: "Your company is laying people off and you have insider information. What do you do?",
    options: [
      { text: "Keep it confidential as required", scores: { justice: 3, integrity: 5 } },
      { text: "Warn close friends privately", scores: { justice: 3, kindness: 4 } },
      { text: "Use it to protect yourself", scores: { justice: 2, integrity: 2 } },
      { text: "Share it with everyone", scores: { justice: 2, bravery: 3 } }
    ]
  },
  {
    id: 26,
    scenario: "A cashier gives you too much change. What do you do?",
    options: [
      { text: "Return the extra immediately", scores: { justice: 5, integrity: 5 } },
      { text: "Return it only if you notice right away", scores: { justice: 3, integrity: 3 } },
      { text: "Keep it—their mistake", scores: { justice: 1, integrity: 1 } },
      { text: "Donate it to charity", scores: { justice: 3, kindness: 4 } }
    ]
  },
  {
    id: 27,
    scenario: "Two friends are in a conflict and both want you on their side. What do you do?",
    options: [
      { text: "Listen to both sides objectively", scores: { justice: 5, patience: 4 } },
      { text: "Support the one who's right", scores: { justice: 5, bravery: 4 } },
      { text: "Stay neutral to preserve both friendships", scores: { justice: 3, kindness: 3 } },
      { text: "Avoid the situation entirely", scores: { justice: 1 } }
    ]
  },
  {
    id: 28,
    scenario: "You're judging a competition and your friend is a contestant. What do you do?",
    options: [
      { text: "Recuse yourself to avoid bias", scores: { justice: 5, integrity: 5 } },
      { text: "Judge objectively despite the friendship", scores: { justice: 5, integrity: 4 } },
      { text: "Give your friend a slight advantage", scores: { justice: 1, integrity: 1 } },
      { text: "Ask someone else to judge instead", scores: { justice: 4, integrity: 4 } }
    ]
  },
  {
    id: 29,
    scenario: "You discover your favorite company uses unethical labor practices. What do you do?",
    options: [
      { text: "Stop buying from them immediately", scores: { justice: 5, integrity: 5 } },
      { text: "Research alternatives before switching", scores: { justice: 4, patience: 4 } },
      { text: "Continue buying but feel guilty", scores: { justice: 2, integrity: 2 } },
      { text: "Ignore it—everything is unethical anyway", scores: { justice: 1, integrity: 1 } }
    ]
  },
  {
    id: 30,
    scenario: "You're given more responsibility at work but no raise. What do you do?",
    options: [
      { text: "Ask for fair compensation", scores: { justice: 5, bravery: 4 } },
      { text: "Do the work and negotiate later", scores: { justice: 3, patience: 4 } },
      { text: "Refuse until you get a raise", scores: { justice: 4, bravery: 3 } },
      { text: "Accept without complaint", scores: { justice: 1, patience: 3 } }
    ]
  },

  // Kindness questions (31-40)
  {
    id: 31,
    scenario: "A stranger drops their groceries in the parking lot. What do you do?",
    options: [
      { text: "Help pick everything up", scores: { kindness: 5, justice: 3 } },
      { text: "Hold the door open for them", scores: { kindness: 3 } },
      { text: "Continue on your way", scores: { kindness: 1 } },
      { text: "Help and offer to carry bags to their car", scores: { kindness: 5, bravery: 3 } }
    ]
  },
  {
    id: 32,
    scenario: "A friend is going through a tough time and needs to talk. You're exhausted. What do you do?",
    options: [
      { text: "Listen with full attention", scores: { kindness: 5, patience: 4 } },
      { text: "Listen but set a time limit", scores: { kindness: 4, integrity: 3 } },
      { text: "Suggest talking tomorrow", scores: { kindness: 3, patience: 3 } },
      { text: "Tell them you can't deal with it right now", scores: { kindness: 1 } }
    ]
  },
  {
    id: 33,
    scenario: "You see a stray animal that looks lost. What do you do?",
    options: [
      { text: "Take it home and try to find its owner", scores: { kindness: 5, determination: 4 } },
      { text: "Call animal control", scores: { kindness: 4, justice: 3 } },
      { text: "Leave food and water", scores: { kindness: 4 } },
      { text: "Walk by—someone else will help", scores: { kindness: 1 } }
    ]
  },
  {
    id: 34,
    scenario: "A coworker is struggling with a task you've mastered. What do you do?",
    options: [
      { text: "Offer to teach them patiently", scores: { kindness: 5, patience: 5 } },
      { text: "Do it for them to save time", scores: { kindness: 4, patience: 3 } },
      { text: "Point them to a tutorial", scores: { kindness: 3 } },
      { text: "Let them figure it out themselves", scores: { kindness: 1 } }
    ]
  },
  {
    id: 35,
    scenario: "You have extra tickets to a concert. Who do you invite?",
    options: [
      { text: "The friend who's been having a hard time", scores: { kindness: 5 } },
      { text: "The friend who would enjoy it most", scores: { kindness: 4, justice: 3 } },
      { text: "Whoever can pay for their ticket", scores: { kindness: 2 } },
      { text: "Sell them for profit", scores: { kindness: 1 } }
    ]
  },
  {
    id: 36,
    scenario: "Someone cuts you off in traffic. What's your reaction?",
    options: [
      { text: "Assume they're in a hurry and let it go", scores: { kindness: 5, patience: 5 } },
      { text: "Honk to express your frustration", scores: { kindness: 2, patience: 2 } },
      { text: "Feel angry but don't react", scores: { kindness: 3, patience: 3 } },
      { text: "Cut them off back", scores: { kindness: 1, patience: 1 } }
    ]
  },
  {
    id: 37,
    scenario: "A new person joins your social group and seems shy. What do you do?",
    options: [
      { text: "Make an effort to include them in conversations", scores: { kindness: 5, bravery: 3 } },
      { text: "Introduce them to others", scores: { kindness: 4 } },
      { text: "Smile and say hi", scores: { kindness: 3 } },
      { text: "Wait for them to approach you", scores: { kindness: 2 } }
    ]
  },
  {
    id: 38,
    scenario: "You receive a gift you don't like. How do you respond?",
    options: [
      { text: "Show genuine appreciation for the thought", scores: { kindness: 5, integrity: 3 } },
      { text: "Thank them warmly", scores: { kindness: 4 } },
      { text: "Be polite but honest about your preference", scores: { kindness: 3, integrity: 4 } },
      { text: "Show your disappointment", scores: { kindness: 1 } }
    ]
  },
  {
    id: 39,
    scenario: "You're in a rush and someone asks for directions. What do you do?",
    options: [
      { text: "Stop and give detailed directions", scores: { kindness: 5, patience: 4 } },
      { text: "Point them in the right direction quickly", scores: { kindness: 4 } },
      { text: "Say sorry and keep walking", scores: { kindness: 2 } },
      { text: "Ignore them", scores: { kindness: 1 } }
    ]
  },
  {
    id: 40,
    scenario: "A family member asks for help with something you find boring. What do you do?",
    options: [
      { text: "Help enthusiastically because they need you", scores: { kindness: 5, patience: 5 } },
      { text: "Help but set a time limit", scores: { kindness: 4, patience: 3 } },
      { text: "Suggest they hire someone", scores: { kindness: 2 } },
      { text: "Make an excuse to avoid it", scores: { kindness: 1 } }
    ]
  },

  // Patience questions (41-50)
  {
    id: 41,
    scenario: "You're waiting in a long line that's barely moving. How do you feel?",
    options: [
      { text: "Stay calm and use the time productively", scores: { patience: 5 } },
      { text: "Feel frustrated but don't show it", scores: { patience: 3 } },
      { text: "Complain to others in line", scores: { patience: 1 } },
      { text: "Leave and come back later", scores: { patience: 2 } }
    ]
  },
  {
    id: 42,
    scenario: "Your child is learning to tie their shoes and keeps failing. What do you do?",
    options: [
      { text: "Encourage them and show them again", scores: { patience: 5, kindness: 5 } },
      { text: "Let them keep trying until they get it", scores: { patience: 4, determination: 3 } },
      { text: "Do it for them to save time", scores: { patience: 2, kindness: 3 } },
      { text: "Get frustrated and raise your voice", scores: { patience: 1 } }
    ]
  },
  {
    id: 43,
    scenario: "Someone is explaining something you already know. What do you do?",
    options: [
      { text: "Listen attentively until they finish", scores: { patience: 5, kindness: 4 } },
      { text: "Politely let them know you understand", scores: { patience: 4, integrity: 3 } },
      { text: "Interrupt to show you know", scores: { patience: 1 } },
      { text: "Zone out but pretend to listen", scores: { patience: 2 } }
    ]
  },
  {
    id: 44,
    scenario: "You're stuck in traffic and late for an appointment. What's your reaction?",
    options: [
      { text: "Accept it and call ahead to explain", scores: { patience: 5, integrity: 4 } },
      { text: "Stay calm but stressed inside", scores: { patience: 3 } },
      { text: "Get angry at other drivers", scores: { patience: 1 } },
      { text: "Try dangerous maneuvers to get ahead", scores: { patience: 1, bravery: 2 } }
    ]
  },
  {
    id: 45,
    scenario: "You're teaching someone and they keep making the same mistake. What do you do?",
    options: [
      { text: "Find a different way to explain it", scores: { patience: 5, kindness: 5, determination: 4 } },
      { text: "Repeat the same explanation louder", scores: { patience: 2 } },
      { text: "Give up and do it yourself", scores: { patience: 1, kindness: 1 } },
      { text: "Take a break and try again later", scores: { patience: 4, kindness: 3 } }
    ]
  },
  {
    id: 46,
    scenario: "Your internet is down when you need to work. What do you do?",
    options: [
      { text: "Find offline work to do while waiting", scores: { patience: 5, determination: 4 } },
      { text: "Call your provider and wait calmly", scores: { patience: 4 } },
      { text: "Try to fix it yourself", scores: { patience: 3, determination: 4 } },
      { text: "Slam your desk in frustration", scores: { patience: 1 } }
    ]
  },
  {
    id: 47,
    scenario: "A restaurant takes 45 minutes to bring your food. What do you do?",
    options: [
      { text: "Wait patiently—they're probably busy", scores: { patience: 5, kindness: 4 } },
      { text: "Ask politely about the delay", scores: { patience: 4, bravery: 3 } },
      { text: "Leave a bad review", scores: { patience: 1 } },
      { text: "Make a scene", scores: { patience: 1, kindness: 1 } }
    ]
  },
  {
    id: 48,
    scenario: "You're meditating and your mind keeps wandering. What do you do?",
    options: [
      { text: "Gently bring your focus back each time", scores: { patience: 5, determination: 4 } },
      { text: "Accept the wandering as part of the process", scores: { patience: 5, kindness: 3 } },
      { text: "Get frustrated and stop", scores: { patience: 1 } },
      { text: "Try a different relaxation method", scores: { patience: 3, bravery: 3 } }
    ]
  },
  {
    id: 49,
    scenario: "You're waiting for an important email that hasn't arrived. What do you do?",
    options: [
      { text: "Check once and then focus on other tasks", scores: { patience: 5, determination: 3 } },
      { text: "Check every hour", scores: { patience: 2 } },
      { text: "Send a follow-up immediately", scores: { patience: 1, bravery: 3 } },
      { text: "Assume the worst and panic", scores: { patience: 1 } }
    ]
  },
  {
    id: 50,
    scenario: "Someone cuts in front of you in line. What do you do?",
    options: [
      { text: "Let it go—it's not worth the conflict", scores: { patience: 5, kindness: 4 } },
      { text: "Politely point out the line", scores: { patience: 4, bravery: 4 } },
      { text: "Give them a dirty look", scores: { patience: 2 } },
      { text: "Confront them aggressively", scores: { patience: 1, bravery: 3 } }
    ]
  },

  // Integrity questions (51-60)
  {
    id: 51,
    scenario: "You find out a company sent you two of an item you only ordered one. What do you do?",
    options: [
      { text: "Contact them and return the extra", scores: { integrity: 5, justice: 5 } },
      { text: "Keep it—lucky you", scores: { integrity: 1, justice: 1 } },
      { text: "Donate the extra to charity", scores: { integrity: 3, kindness: 4 } },
      { text: "Wait to see if they notice", scores: { integrity: 2 } }
    ]
  },
  {
    id: 52,
    scenario: "You make a mistake at work that no one noticed. What do you do?",
    options: [
      { text: "Report it immediately and fix it", scores: { integrity: 5, bravery: 4 } },
      { text: "Fix it quietly without telling anyone", scores: { integrity: 3, determination: 3 } },
      { text: "Hope no one finds out", scores: { integrity: 1 } },
      { text: "Blame it on someone else", scores: { integrity: 1, justice: 1 } }
    ]
  },
  {
    id: 53,
    scenario: "You promised to help a friend move, but something better came up. What do you do?",
    options: [
      { text: "Honor your promise", scores: { integrity: 5, determination: 4 } },
      { text: "Help them find someone else", scores: { integrity: 3, kindness: 3 } },
      { text: "Cancel last minute with an excuse", scores: { integrity: 1 } },
      { text: "Show up but leave early", scores: { integrity: 2 } }
    ]
  },
  {
    id: 54,
    scenario: "You're selling something online and there's a hidden defect. What do you do?",
    options: [
      { text: "Disclose the defect in the listing", scores: { integrity: 5, justice: 5 } },
      { text: "Mention it if asked", scores: { integrity: 3 } },
      { text: "Let the buyer discover it", scores: { integrity: 1 } },
      { text: "Reduce the price without explaining why", scores: { integrity: 3, justice: 3 } }
    ]
  },
  {
    id: 55,
    scenario: "Your friend asks if you like their new haircut. You hate it. What do you say?",
    options: [
      { text: "Find something genuine to compliment", scores: { integrity: 4, kindness: 5 } },
      { text: "Be honest but kind", scores: { integrity: 5, kindness: 4 } },
      { text: "Lie to spare their feelings", scores: { integrity: 1, kindness: 3 } },
      { text: "Tell them it looks terrible", scores: { integrity: 4, kindness: 1 } }
    ]
  },
  {
    id: 56,
    scenario: "You're filling out a form and could exaggerate to get a benefit. What do you do?",
    options: [
      { text: "Fill it out honestly", scores: { integrity: 5, justice: 4 } },
      { text: "Slightly exaggerate but nothing major", scores: { integrity: 2 } },
      { text: "Exaggerate significantly", scores: { integrity: 1, justice: 1 } },
      { text: "Ask if the benefit applies to you as-is", scores: { integrity: 4, bravery: 3 } }
    ]
  },
  {
    id: 57,
    scenario: "You overhear confidential information that could help you. What do you do?",
    options: [
      { text: "Pretend you didn't hear it", scores: { integrity: 5, justice: 4 } },
      { text: "Use it to your advantage", scores: { integrity: 1, justice: 1 } },
      { text: "Tell the person you overheard", scores: { integrity: 5, bravery: 4 } },
      { text: "Think about it but don't act", scores: { integrity: 3 } }
    ]
  },
  {
    id: 58,
    scenario: "You're late to an appointment. What do you tell the other person?",
    options: [
      { text: "Apologize and tell the real reason", scores: { integrity: 5, bravery: 3 } },
      { text: "Blame traffic or external factors", scores: { integrity: 2 } },
      { text: "Make up an elaborate excuse", scores: { integrity: 1 } },
      { text: "Apologize without explanation", scores: { integrity: 3, kindness: 3 } }
    ]
  },
  {
    id: 59,
    scenario: "A friend asks for your honest opinion on their business idea. You think it's bad. What do you say?",
    options: [
      { text: "Give constructive honest feedback", scores: { integrity: 5, kindness: 4, bravery: 4 } },
      { text: "Highlight the positives only", scores: { integrity: 2, kindness: 4 } },
      { text: "Lie to encourage them", scores: { integrity: 1, kindness: 3 } },
      { text: "Tell them it's terrible", scores: { integrity: 4, kindness: 1 } }
    ]
  },
  {
    id: 60,
    scenario: "You realize you've been spreading misinformation about something. What do you do?",
    options: [
      { text: "Publicly correct yourself", scores: { integrity: 5, bravery: 5 } },
      { text: "Quietly stop spreading it", scores: { integrity: 3 } },
      { text: "Hope no one remembers", scores: { integrity: 1 } },
      { text: "Double down to save face", scores: { integrity: 1, bravery: 2 } }
    ]
  },

  // Perseverance questions (61-66)
  {
    id: 61,
    scenario: "You've been rejected from 10 job applications. What do you do?",
    options: [
      { text: "Apply to 10 more with improved materials", scores: { perseverance: 5, determination: 5 } },
      { text: "Take a break but plan to continue", scores: { perseverance: 3, patience: 4 } },
      { text: "Lower your standards", scores: { perseverance: 2 } },
      { text: "Give up job hunting", scores: { perseverance: 1 } }
    ]
  },
  {
    id: 62,
    scenario: "Your startup failed. What's your next move?",
    options: [
      { text: "Learn from it and start another", scores: { perseverance: 5, bravery: 5 } },
      { text: "Take time to recover, then try again", scores: { perseverance: 4, patience: 4 } },
      { text: "Get a stable job instead", scores: { perseverance: 2, patience: 3 } },
      { text: "Never take that risk again", scores: { perseverance: 1 } }
    ]
  },
  {
    id: 63,
    scenario: "You're learning a language and feel like you're not improving. What do you do?",
    options: [
      { text: "Practice daily regardless of progress", scores: { perseverance: 5, determination: 5 } },
      { text: "Change your learning approach", scores: { perseverance: 4, bravery: 3 } },
      { text: "Take a break from learning", scores: { perseverance: 2, patience: 3 } },
      { text: "Accept you'll never be fluent", scores: { perseverance: 1 } }
    ]
  },
  {
    id: 64,
    scenario: "Your creative work keeps getting rejected by publishers/platforms. What do you do?",
    options: [
      { text: "Keep creating and submitting", scores: { perseverance: 5, determination: 5 } },
      { text: "Get feedback and improve", scores: { perseverance: 4, integrity: 4 } },
      { text: "Self-publish instead", scores: { perseverance: 3, bravery: 4 } },
      { text: "Stop creating altogether", scores: { perseverance: 1 } }
    ]
  },
  {
    id: 65,
    scenario: "You're training for a sport and keep losing competitions. What do you do?",
    options: [
      { text: "Train harder and analyze your weaknesses", scores: { perseverance: 5, determination: 5 } },
      { text: "Find a coach or mentor", scores: { perseverance: 4, bravery: 3 } },
      { text: "Lower your competitive goals", scores: { perseverance: 2, patience: 3 } },
      { text: "Quit the sport", scores: { perseverance: 1 } }
    ]
  },
  {
    id: 66,
    scenario: "Life keeps throwing obstacles at you—health issues, financial problems, relationship stress. How do you respond?",
    options: [
      { text: "Face each challenge one at a time", scores: { perseverance: 5, determination: 5, patience: 4 } },
      { text: "Seek support from loved ones", scores: { perseverance: 4, kindness: 4, bravery: 3 } },
      { text: "Focus on what you can control", scores: { perseverance: 4, patience: 5 } },
      { text: "Feel overwhelmed and give up", scores: { perseverance: 1 } }
    ]
  }
];

export const virtueNames = {
  determination: "Determination",
  bravery: "Bravery",
  justice: "Justice",
  kindness: "Kindness",
  patience: "Patience",
  integrity: "Integrity",
  perseverance: "Perseverance"
};

export const virtueDescriptions = {
  determination: "The drive to achieve your goals despite obstacles",
  bravery: "The courage to face fear and take action",
  justice: "The commitment to fairness and doing what's right",
  kindness: "The compassion to help others and show empathy",
  patience: "The ability to wait and endure without frustration",
  integrity: "The adherence to moral and ethical principles",
  perseverance: "The persistence to continue despite difficulties"
};
