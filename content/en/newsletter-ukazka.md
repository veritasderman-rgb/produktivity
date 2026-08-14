---
subject: "Meeting notes with tasks in a minute — and you can tell what's a commitment"
preheader: "One tip in depth, three links worth a click and a prompt to copy. Two minutes to read."
---

Good morning,

you know the drill: the meeting ends, everyone scatters, and the notes you promised “later today” get written the next evening — from memory, when nobody remembers who committed to what. So this week, one big topic: how to have AI sort a meeting transcript so the notes show the difference between “we decided” and “we talked about it”.

## Tip of the week: from a meeting recording to notes with tasks in a minute

Meeting notes are exactly the kind of work a machine should do — and exactly why people put them off. The result isn't a missing document, it's missing work: a task nobody logged doesn't get done.

The key idea: **AI shouldn't write the meeting notes — it should sort the transcript.** A generic “summarize this meeting” returns paragraphs like “the team agreed on the need for next steps”, which tell you nothing about who has to do what. The notes have to be structured by type of content, split hard into three categories:

- **Decisions** — things that are closed; each comes with who decided and which options were considered.
- **Tasks** — actions with a single owner and a deadline. Not “the team will look at costs”, but “Petr calculates the costs of option B by May 15”.
- **Open items** — discussed, not decided. The category most notes keep quiet about, and the most valuable one: loose ends come back as problems a month later.

Always check two things. Models like to promote discussion to a decision because it sounds more finished — so demand a verbatim quote from the transcript for every decision, and when the quote is missing, move the item to open items. And names, numbers and deadlines: a misheard number is the quietest mistake, nobody notices until someone acts on it. Send the finished notes within thirty minutes of the meeting — while everyone still remembers the context, they'll correct a mistake right in their reply.

One rule sits above everything: **record only with participants' consent**, and a sensitive meeting belongs only in a paid account with contractual data protection.

The full guide has seven phases, from recording consent to a searchable archive — with every prompt ready to copy: [From a meeting recording to notes with tasks in a minute](/tipy/ai-zapis-z-porady) (saves ~30 min per meeting).

## Worth a click

- [No agenda, no meeting](/tipy/manazer-porada-agenda) — one simple rule that erases half your meetings: whoever calls the meeting sends an agenda and expected outcome in advance. Saves ~3 hours a week.
- [The follow-up watchdog: AI remembers who never replied](/tipy/ai-follow-up-hlidac) — a routine finds unanswered threads, tracks deadlines and drafts polite reminders. AI writes the draft — you always send.
- [A second brain that talks back](/tipy/druhy-mozek-ktery-odpovida) — connect AI to Notion or a notes folder, ask questions in your own words, and have the archive fill itself in every week.

## A prompt to copy

It pulls just the tasks out of finished notes (or straight from a transcript) in a who-what-by-when format — a list you can paste directly into your task tracker:

```text
From these notes (or this transcript), pull out ONLY the tasks
and rewrite them in a single format I can work with directly.

One line per task:
[owner] — [action starting with a verb] — by [date as MM/DD]

Rules:
- one task = one action = one owner; split up compound tasks
- convert relative deadlines to actual dates; today is [date],
  “by end of week” = [Friday's date], “next week” = [date]
- when no deadline was stated at all, write “by ??” and add
  a note on the line saying I should ask about it
- leave out anything that was just an idea, a suggestion, or a
  conditional statement (“if we had time, we could…”) — list
  those separately under a heading called UNCOMMITTED IDEAS
- sort by deadline, soonest first

At the end, write a total: how many tasks each person has.
```

Have a fast week,

Josef

*You're getting this email because you signed up at productive.tips. [Unsubscribe](#) in one click, any time, no questions asked.*
