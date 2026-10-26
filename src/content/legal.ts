import { footage } from "./footage";

// TODO: privacy, terms and safeguarding text to be finalised with a solicitor before launch.

export type LegalDoc = { slug: string; title: string; status?: string; sections: { heading: string; body: string[] }[] };

export const legal: LegalDoc[] = [
  {
    slug: "privacy",
    title: "Privacy notice",
    status: "Draft. Being finalised with legal advice.",
    sections: [
      {
        heading: "Who we are",
        body: ["MotionPlay Labs Ltd, registered in England and Wales, company number 17304660. Questions about your data: hello@motionplaylabs.com."],
      },
      {
        heading: "What this site collects",
        body: [
          "Only what you type into the enquiry form: your name, email, organisation and the details of the job. We use it to reply to you.",
          "The form sends your message to our inbox through our email provider, Resend.",
          "This site does not use advertising or tracking cookies.",
        ],
      },
      {
        heading: "The Build Session",
        body: ["Applications and payments for The Build Session are handled on workshop.motionplaylabs.com, which explains what it collects when you apply."],
      },
      {
        heading: "Your rights",
        body: ["You can ask to see, correct or delete the details we hold about you. Email hello@motionplaylabs.com."],
      },
    ],
  },
  {
    slug: "cookies",
    title: "Cookies",
    sections: [
      {
        heading: "What we set",
        body: [
          "This site sets no cookies.",
          "If you press Pause motion, your browser remembers that choice in its own local storage on your device. Nothing is sent to us.",
        ],
      },
    ],
  },
  {
    slug: "terms",
    title: "Website terms",
    status: "Draft. Being finalised with legal advice.",
    sections: [
      {
        heading: "Content",
        body: ["Words, images and footage on this site belong to MotionPlay Labs Ltd or are used with permission. Ask before reusing them."],
      },
      {
        heading: "Products",
        body: ["Each product has its own terms on its own site. These website terms do not cover them."],
      },
    ],
  },
  {
    slug: "accessibility",
    title: "Accessibility",
    sections: [
      {
        heading: "Our aim",
        body: ["This site aims to meet WCAG 2.2 at level AA."],
      },
      {
        heading: "Moving footage",
        body: [
          "Every page has a Pause motion button that stops all moving footage. If your device asks for reduced motion, footage starts paused.",
          "Every word in the homepage film is real text, read in order by screen readers. A Skip the film link jumps to the end.",
        ],
      },
      {
        heading: "Tell us about a problem",
        body: ["If something does not work for you, email hello@motionplaylabs.com with the page and what happened."],
      },
    ],
  },
  {
    slug: "safeguarding",
    title: "Safeguarding",
    status: "Draft. A full safeguarding policy is being written.",
    sections: [
      {
        heading: "Children",
        body: [
          "Draw in the Air is used by children aged 3 to 7. We do not film or publish children's faces in our marketing.",
          "Anyone working in schools on our behalf will hold an enhanced DBS check.",
        ],
      },
      {
        heading: "Report a concern",
        body: ["Email hello@motionplaylabs.com. If a child is in immediate danger, call 999 in the UK or 112 in Nigeria."],
      },
    ],
  },
  {
    slug: "credits",
    title: "Credits",
    sections: [
      {
        heading: "Footage",
        body: Object.values(footage).map((c) => `${c.caption}. ${c.credit.by ? `${c.credit.by}, ` : ""}${c.credit.source}. ${c.credit.url}`),
      },
      {
        heading: "Licences",
        body: [
          "The clips are used under the free licences of the sites they come from, which allow commercial use. They are placeholders for footage we shoot ourselves and will be replaced clip by clip.",
        ],
      },
      {
        heading: "Type",
        body: ["Mona Sans, designed by GitHub with Degarism Studio, under the SIL Open Font License."],
      },
    ],
  },
];

export const footageSources = [...new Set(Object.values(footage).map((c) => c.credit.source))].filter((s) => s !== "MotionPlay Labs");

export const legalBySlug = (slug: string) => legal.find((d) => d.slug === slug);
