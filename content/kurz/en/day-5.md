---
subject: "Day 5: AI doesn't calculate, AI writes the calculation"
preheader: "A number from a chat window must never drive a decision. Here's what to do with a spreadsheet instead."
---

Today is short, but it'll save you from the most embarrassing mistake you can make with AI: presenting a number the model made up.

## Today's idea

You ask for the average order value, get “$1,847,” it looks plausible, you put it in a presentation. Except the model never calculated that number. **It generated it as text** — a word that made sense in that sentence.

There are two reasons a number from a chat window must never drive a decision. First, a language model isn't a calculator; it generates a plausible continuation, not the result of an operation. Second, with a longer spreadsheet it **doesn't see all the data** — it works from a slice and estimates the rest.

The fix is simple and it always works: **AI shouldn't calculate — AI should write the procedure that does the calculating.** A spreadsheet formula, or a short script. That returns the same number every time, can be checked, and above all can be run again when new data comes in. The difference between “AI told me $1,847” and “I have a formula that computes $1,847” is the entire difference between guessing and analysis.

There is an exception: tools that actually execute code (data analysis in ChatGPT, Claude with a code environment). There, the number is the result of a real computation — but even then, ask to see the code and check what it's actually computing.

And one more thing before you upload anything: **strip names, national ID numbers, addresses, and emails from any export.** For analysis you need amounts, dates, and categories — not customer identities. When you can't do without an identifier, replace it with a sequence number.

## Today's prompt

Before you calculate anything, have it profile the data first. This is the step people skip, and then build conclusions on a hole in the data.

```
Write me a formula for Excel / Google Sheets (with a brief
explanation of what it does) that answers this question:

QUESTION: [e.g. what is the average number of days between
order and payment for customers in category X]

MY SPREADSHEET:
- columns and what's in them: [A: order date, B: payment
  date, C: customer category, ...]
- number of rows: [roughly]
- known issues: [e.g. payment date is missing for some rows,
  there are cancellations with negative amounts]

I want:
1. a formula I can copy in,
2. a step-by-step explanation so I know what it's computing,
3. a list of rows/cases the formula excludes or that skew it,
4. one sanity check I can use to confirm the result makes
   sense.

Don't calculate or estimate any number yourself.
```

That last line is the whole point of today. And point 4 will teach you more than everything else combined — a good sanity check is something like “the subgroup totals must add up to the whole.”

## Full article

In detail, including exploring an unfamiliar dataset, spotting trends, and six ways to get burned on numbers that look right: [Data analysis with AI: from CSV to a conclusion you can defend](https://productive.tips/tipy/ai-analyza-dat)

## Today's mini-task

Take one spreadsheet you already have and ask it one question using the prompt above. Paste in the formula, check the result with the sanity check from point 4.

If you don't work with spreadsheets, keep today as a rule in your back pocket: **no number from a chat window without a procedure for how it was produced.**

Tomorrow we'll look at what happens once AI stops waiting for your question.

Josef
