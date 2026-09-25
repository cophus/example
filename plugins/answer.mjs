// MyST plugin: {answer} blocks for worked problems.
//
// {answer} directive: an instructor solution or answer key. On the website it
// renders as plain visible text under a bold "Solution" label, because this is
// an instructor site and nothing needs hiding. In Typst exports it becomes
// tipBlock(heading: [Solution]), which handouts/templates/template.typ keeps
// when the export sets `show_solutions: true` and drops otherwise, so one source
// file produces both the student PDF and the solutions PDF.
//
// Usage:
//   :::{answer}
//   Worked solution, with math and figures as needed.
//   :::
//
// The directive is named {answer} because MyST reserves {solution} for its
// built-in exercise/solution pair, which requires an exercise label and renders
// as a floating box in Typst.
//
// The node stays an admonition so the Typst export keeps working. style.css
// strips the admonition's box, background, and icon down to plain text.

const answerDirective = {
  name: "answer",
  doc: "Instructor solution. Plain text on the site, hidden in student PDFs, shown in solutions PDFs.",
  arg: { type: String, doc: "Optional heading override (default: Solution)", required: false },
  body: { type: "myst", required: true },
  run(data) {
    const title = data.arg ? String(data.arg) : "Solution";
    return [
      {
        type: "admonition",
        kind: "tip",
        class: "msc-answer",
        children: [
          { type: "admonitionTitle", children: [{ type: "text", value: title }] },
          ...data.body,
        ],
      },
    ];
  },
};

const plugin = {
  name: "Answer blocks",
  directives: [answerDirective],
};

export default plugin;
