---
subject: "Day 4: forty pages in three minutes — and how to check it"
preheader: "A summary with page references. And three questions that expose plausible nonsense."
---

Today has two halves, and they belong together. The first is the fastest win AI offers. The second is the one skill in the whole course you can't afford to skip.

## Today's idea

Reading forty pages start to finish is often the wrong order. You need a map first, then the terrain.

But “summarize this document for me” is the weakest prompt you can write — you'll get a generic paragraph that doesn't tell you what to actually do. A good summary needs to know **who's reading it and why**, and above all it needs to say, for every point, **exactly where in the document it comes from**. Not for form's sake — that's what lets you check the summary in a minute.

Which brings us to the second half. A language model is a machine for generating the most probable continuation of text. When it doesn't know an answer, it won't produce “I don't know” — it'll produce something that looks like a correct answer. A made-up citation gets a credible author; a made-up section gets a credible number. The danger isn't that the model gets things wrong — it's that it gets things wrong in **the exact same tone** it uses when it's right.

So ask yourself three questions about every answer:

1. **Could the model actually have known this?** It doesn't know things about your company, your client, or yesterday's prices unless you told it. If they show up anyway, they're invented.
2. **Is this verifiable, or just well phrased?** The model is good at phrasing. Numbers, names, section references, and citations need to be checked.
3. **What would it cost if this were wrong?** A bad brainstorm costs nothing. A wrong number in a client proposal can cost you the deal.

## Today's prompt

Take a document you have to read today anyway — a contract, a report, minutes, a study.

```
I'm attaching a document called [name].
Reader: [who will read this]. Purpose: [why they're reading it].

Output structure, follow it exactly:
1. What the document is about — 3 sentences, no generalities
2. Ten main points. For each: a one-sentence claim, and in
   parentheses the page or section where it appears in the
   document
3. Numbers and dates worth remembering: value, what it
   means, page
4. Deadlines and dates, sorted chronologically
5. Three passages I should read in the original, and why
6. What the document does NOT address, even though you'd
   expect it to

Don't add anything from general knowledge, even if it happens
to be correct. Where you're not sure of the location in the
text, write "location not determined" instead of guessing.
```

Then spot-check three bullet points against the original file. If they hold up, the rest usually does too. If one points to a passage that isn't there, stop trusting the whole summary. And if “location not determined” shows up next to most points, the model isn't reading the text reliably — split the document into parts.

Point 6 is usually the most valuable one. Documents are often better identified by what's missing from them.

## Full articles

[Long document? Extract it with page numbers](https://productive.tips/tipy/ai-shrnuti-dokumentu) and [AI makes things up with total confidence](https://productive.tips/tipy/ai-overovani-faktu)

## Today's mini-task

Summarize one real document and **verify three points against the original**. That check is the whole task today — it's the habit that will save you someday.

Tomorrow, numbers: why AI shouldn't do math in chat.

Josef
