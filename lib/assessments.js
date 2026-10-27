const banks = {
  data: {
    role: "Data Entry Specialist",
    questions: [
      {
        id: "q1",
        type: "mcq",
        prompt: "You are told to copy values exactly as shown. The amount in the source is 1,075.20. What do you enter?",
        options: [
          { id: "a", text: "1,075.20" },
          { id: "b", text: "1075.2" },
          { id: "c", text: "1.075.20" },
          { id: "d", text: "107520" },
        ],
        correct: "a",
      },
      {
        id: "q2",
        type: "mcq",
        prompt: "Dates must be entered as DD/MM/YYYY. The source shows 3 November 2026. What do you enter?",
        options: [
          { id: "a", text: "11/03/2026" },
          { id: "b", text: "03/11/2026" },
          { id: "c", text: "2026/11/03" },
          { id: "d", text: "November 3, 2026" },
        ],
        correct: "b",
      },
      {
        id: "q3",
        type: "mcq",
        prompt: "A customer ID on the form is INV-20481. Which entry is correct?",
        options: [
          { id: "a", text: "inv 20481" },
          { id: "b", text: "INV20481" },
          { id: "c", text: "INV-20481" },
          { id: "d", text: "INV-2048" },
        ],
        correct: "c",
      },
      {
        id: "q4",
        type: "mcq",
        prompt: "The source total and your spreadsheet total do not match. What should you do?",
        options: [
          { id: "a", text: "Change the spreadsheet total so it matches" },
          { id: "b", text: "Submit the sheet and mention the difference later" },
          { id: "c", text: "Delete the last row" },
          { id: "d", text: "Stop and compare each line with the source before you continue" },
        ],
        correct: "d",
      },
      {
        id: "q5",
        type: "mcq",
        prompt: "A required field is blank on the source document. What should you do?",
        options: [
          { id: "a", text: "Leave the field blank and flag it for review" },
          { id: "b", text: "Type N/A so the field is not empty" },
          { id: "c", text: "Guess the most likely value" },
          { id: "d", text: "Skip the whole record without a note" },
        ],
        correct: "a",
      },
      {
        id: "q6",
        type: "mcq",
        prompt: "Which habit reduces errors on a long list of records?",
        options: [
          { id: "a", text: "Enter every row quickly and check only the last row" },
          { id: "b", text: "Check each row against the source before moving on" },
          { id: "c", text: "Read the page once, then enter it from memory" },
          { id: "d", text: "Reuse a value when two rows look similar" },
        ],
        correct: "b",
      },
      {
        id: "q7",
        type: "mcq",
        prompt: "The reference line to copy is RS-4419 / PO-88B / NET-30. Which entry is exact?",
        options: [
          { id: "a", text: "RS-4419 / PO-88b / NET-30" },
          { id: "b", text: "RS-4419 / PO-88B / NET-30" },
          { id: "c", text: "RS4419 / PO88B / NET30" },
          { id: "d", text: "RS-4419, PO-88B, NET-30" },
        ],
        correct: "b",
      },
      {
        id: "q8",
        type: "mcq",
        prompt: "Why should the source document stay visible while you type?",
        options: [
          { id: "a", text: "So you can compare each value as you enter it" },
          { id: "b", text: "So you can close it after the first row" },
          { id: "c", text: "So the file date is saved into the sheet" },
          { id: "d", text: "So several people can edit the same cell together" },
        ],
        correct: "a",
      },
      {
        id: "q9",
        type: "mcq",
        prompt: "You finish a batch of records. What is the right next step?",
        options: [
          { id: "a", text: "Submit immediately to save time" },
          { id: "b", text: "Delete the source file" },
          { id: "c", text: "Review the entries against the source, then submit" },
          { id: "d", text: "Ask a colleague to retype the same batch" },
        ],
        correct: "c",
      },
      {
        id: "q10",
        type: "mcq",
        prompt: "The source writes a name as Sofia Reyes. What do you enter?",
        options: [
          { id: "a", text: "Sofia Reyes." },
          { id: "b", text: "SOFIA REYES" },
          { id: "c", text: "Sofia R." },
          { id: "d", text: "Sofia Reyes" },
        ],
        correct: "d",
      },
      {
        id: "s1",
        type: "text",
        prompt: "In 2–3 sentences, describe how you keep records accurate when the work is repetitive.",
      },
      {
        id: "s2",
        type: "text",
        prompt: "You cannot read one value on a source document. What do you do before entering that record?",
      },
    ],
  },
  transcription: {
    role: "Transcriptionist",
    questions: [
      {
        id: "q1",
        type: "mcq",
        prompt: "The style guide says to write spoken times as figures. The speaker says \"ten thirty.\" What do you write?",
        options: [
          { id: "a", text: "10:30" },
          { id: "b", text: "ten thirty" },
          { id: "c", text: "10.30 hours" },
          { id: "d", text: "ten-thirty" },
        ],
        correct: "a",
      },
      {
        id: "q2",
        type: "mcq",
        prompt: "You cannot hear one word clearly. What should you do?",
        options: [
          { id: "a", text: "Choose the word that sounds most likely" },
          { id: "b", text: "Mark the unclear word and replay that section before deciding" },
          { id: "c", text: "Leave a blank line for the whole sentence" },
          { id: "d", text: "Skip the rest of the clip" },
        ],
        correct: "b",
      },
      {
        id: "q3",
        type: "mcq",
        prompt: "Two speakers take turns. How should the transcript show this?",
        options: [
          { id: "a", text: "Put both speakers in one paragraph" },
          { id: "b", text: "Use all capital letters for the second speaker" },
          { id: "c", text: "Start a new line with each speaker's name" },
          { id: "d", text: "Write only the speaker who talks longer" },
        ],
        correct: "c",
      },
      {
        id: "q4",
        type: "mcq",
        prompt: "A speaker says \"Monday — sorry, Wednesday.\" The guide says to keep the corrected word only. What do you transcribe?",
        options: [
          { id: "a", text: "Monday Wednesday" },
          { id: "b", text: "Monday, sorry, Wednesday" },
          { id: "c", text: "Sorry" },
          { id: "d", text: "Wednesday" },
        ],
        correct: "d",
      },
      {
        id: "q5",
        type: "mcq",
        prompt: "The guide says to omit filler words such as \"um.\" The speaker says \"Um, please send the file.\" What do you write?",
        options: [
          { id: "a", text: "Please send the file." },
          { id: "b", text: "Um, please send the file." },
          { id: "c", text: "UM please send the file" },
          { id: "d", text: "Please, um, send the file." },
        ],
        correct: "a",
      },
      {
        id: "q6",
        type: "mcq",
        prompt: "A speaker spells a name \"N-O-R-A.\" What do you enter for the name?",
        options: [
          { id: "a", text: "N-O-R-A" },
          { id: "b", text: "Nora" },
          { id: "c", text: "NORA" },
          { id: "d", text: "N.O.R.A" },
        ],
        correct: "b",
      },
      {
        id: "q7",
        type: "mcq",
        prompt: "The speaker finishes one sentence and starts another. What punctuation do you use?",
        options: [
          { id: "a", text: "A comma for every pause" },
          { id: "b", text: "No punctuation until the clip ends" },
          { id: "c", text: "A full stop between the sentences" },
          { id: "d", text: "A question mark after every sentence" },
        ],
        correct: "c",
      },
      {
        id: "q8",
        type: "mcq",
        prompt: "Amounts spoken as words should be written as digits followed by the word dollars. The speaker says \"one hundred twenty-five dollars.\" What do you write?",
        options: [
          { id: "a", text: "one hundred twenty-five dollars" },
          { id: "b", text: "one hundred and twenty five" },
          { id: "c", text: "$ one hundred" },
          { id: "d", text: "125 dollars" },
        ],
        correct: "d",
      },
      {
        id: "q9",
        type: "mcq",
        prompt: "You have typed the full clip. What should you do before submitting?",
        options: [
          { id: "a", text: "Play it again and read your transcript against the audio" },
          { id: "b", text: "Submit as soon as the last word is typed" },
          { id: "c", text: "Delete any word you are unsure about" },
          { id: "d", text: "Send the audio file instead of the text" },
        ],
        correct: "a",
      },
      {
        id: "q10",
        type: "mcq",
        prompt: "Two people talk at the same time for a moment. What is the best approach?",
        options: [
          { id: "a", text: "Delete both lines" },
          { id: "b", text: "Keep only the louder speaker" },
          { id: "c", text: "Note the overlap and capture the words you can hear from each speaker" },
          { id: "d", text: "Stop the transcript at the overlap" },
        ],
        correct: "c",
      },
      {
        id: "s1",
        type: "text",
        prompt: "In 2–3 sentences, describe how you produce an accurate transcript when part of the audio is hard to hear.",
      },
      {
        id: "s2",
        type: "text",
        prompt: "What do you review before you submit a finished transcript?",
      },
    ],
  },
  assistant: {
    role: "Virtual Assistant",
    questions: [
      {
        id: "q1",
        type: "mcq",
        prompt: "A client asks to move a meeting that overlaps another call. What should you do first?",
        options: [
          { id: "a", text: "Check both calendars and offer two other times" },
          { id: "b", text: "Delete the original meeting" },
          { id: "c", text: "Wait until the day of the meeting to reply" },
          { id: "d", text: "Decline the request" },
        ],
        correct: "a",
      },
      {
        id: "q2",
        type: "mcq",
        prompt: "An invoice total does not match its line items. What is the best next step?",
        options: [
          { id: "a", text: "Change the total so the numbers match" },
          { id: "b", text: "Ask the sender to confirm the correct total before you process it" },
          { id: "c", text: "Pay the invoice" },
          { id: "d", text: "Delete the invoice" },
        ],
        correct: "b",
      },
      {
        id: "q3",
        type: "mcq",
        prompt: "Which reply is the most professional?",
        options: [
          { id: "a", text: "Yeah that's fine whatever." },
          { id: "b", text: "Busy. You pick." },
          { id: "c", text: "Thanks for the note. Thursday at 2:00 p.m. works, and I will send a calendar invite." },
          { id: "d", text: "Why did you ask me this?" },
        ],
        correct: "c",
      },
      {
        id: "q4",
        type: "mcq",
        prompt: "A client asks you to forward another client's invoice. What should you do?",
        options: [
          { id: "a", text: "Send it if they promise to delete it" },
          { id: "b", text: "Send it after removing the amounts" },
          { id: "c", text: "Post it in the team chat" },
          { id: "d", text: "Decline and explain that you cannot share another client's documents" },
        ],
        correct: "d",
      },
      {
        id: "q5",
        type: "mcq",
        prompt: "Three items arrive together: a meeting in 30 minutes with no agenda, a supplier asking for a missing invoice number, and a newsletter due tomorrow. What do you handle first?",
        options: [
          { id: "a", text: "The meeting in 30 minutes" },
          { id: "b", text: "The newsletter" },
          { id: "c", text: "The supplier request only" },
          { id: "d", text: "Whichever email arrived last" },
        ],
        correct: "a",
      },
      {
        id: "q6",
        type: "mcq",
        prompt: "You are unsure how a client wants a task done. What should you do?",
        options: [
          { id: "a", text: "Complete it in the way you prefer" },
          { id: "b", text: "Ask a short clarifying question before you start" },
          { id: "c", text: "Wait until the client writes again" },
          { id: "d", text: "Leave the task for the next day" },
        ],
        correct: "b",
      },
      {
        id: "q7",
        type: "mcq",
        prompt: "What should a calendar invite include?",
        options: [
          { id: "a", text: "Only the date" },
          { id: "b", text: "The client's home address" },
          { id: "c", text: "The title, date, time, and who is attending" },
          { id: "d", text: "A copy of every past email" },
        ],
        correct: "c",
      },
      {
        id: "q8",
        type: "mcq",
        prompt: "A client writes in a frustrated tone. How should you reply?",
        options: [
          { id: "a", text: "Reply with the same tone" },
          { id: "b", text: "Ignore the message until they calm down" },
          { id: "c", text: "Forward it to the whole company" },
          { id: "d", text: "Stay polite, acknowledge the issue, and state the next step" },
        ],
        correct: "d",
      },
      {
        id: "q9",
        type: "mcq",
        prompt: "You finish a task the client requested. What is the right follow-up?",
        options: [
          { id: "a", text: "Send a short confirmation of what you completed" },
          { id: "b", text: "Wait for the client to ask if it is done" },
          { id: "c", text: "Start a different task without telling them" },
          { id: "d", text: "Delete the original request" },
        ],
        correct: "a",
      },
      {
        id: "q10",
        type: "mcq",
        prompt: "A request is outside the instructions you were given. What should you do?",
        options: [
          { id: "a", text: "Do it so the client is not kept waiting" },
          { id: "b", text: "Pause and check with the client or your lead before acting" },
          { id: "c", text: "Refuse without an explanation" },
          { id: "d", text: "Ask another client how they handle it" },
        ],
        correct: "b",
      },
      {
        id: "s1",
        type: "text",
        prompt: "In 2–3 sentences, describe how you handle several requests that arrive at the same time.",
      },
      {
        id: "s2",
        type: "text",
        prompt: "A client needs a meeting moved. What information do you confirm before you send the new invite?",
      },
    ],
  },
};

function publicBank(job) {
  const bank = banks[job];
  if (!bank) return null;
  return {
    role: bank.role,
    durationSeconds: 20 * 60,
    questions: bank.questions.map((question) => ({
      id: question.id,
      type: question.type,
      prompt: question.prompt,
      options: question.options || null,
    })),
  };
}

function grade(job, answers) {
  const bank = banks[job];
  if (!bank || !answers || typeof answers !== "object") return null;
  let score = 0;
  bank.questions.forEach((question) => {
    const value = String(answers[question.id] ?? "").trim();
    if (question.type === "mcq" && value === question.correct) score += 1;
    if (question.type === "text" && value.length > 0) score += 1;
  });
  return { score, total: bank.questions.length };
}

module.exports = { banks, publicBank, grade };
