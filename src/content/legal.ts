import { festivalTownStock } from "./festival-town";
import { footage } from "./footage";

// TODO: privacy, terms and safeguarding text to be finalised with a solicitor before launch.

export type LegalDoc = { slug: string; title: string; status?: string; sections: { heading: string; body: string[] }[] };

export const legal: LegalDoc[] = [
  {
    "slug": "festival-town-privacy",
    "title": "Festival Town Privacy Policy",
    "sections": [
      {
        "heading": "Last updated: 30 October 2026",
        "body": [
          "Festival Town is an educational game from MotionPlay Labs Ltd, registered in England and Wales, company number 17304660. This policy covers our Android game, package com.motionplaylabs.festivaltown. For privacy questions, parents and guardians can contact hello@motionplaylabs.com."
        ]
      },
      {
        "heading": "Playing the game",
        "body": [
          "Festival Town works without an online account. It has no advertising, in-app purchases, analytics SDKs or social messaging. The Android app does not request permission to access the internet, your camera, microphone, contacts or location. MotionPlay Labs does not receive children's profiles or gameplay records from the game."
        ]
      },
      {
        "heading": "Information saved on your device",
        "body": [
          "The game saves player profiles, an optional nickname, a locally generated profile identifier, character and colour choices, settings, activity progress, activity history, play time and related timestamps. This information enables saved progress, personalisation and the parent progress view. It stays in the app's local storage unless it is copied through the export or device-backup features described below. You can use an invented nickname; a child's real name is not required."
        ]
      },
      {
        "heading": "Export, backup and voice services",
        "body": [
          "The parent area can export progress as a text code and import it on another installation. The code contains profile and progress information; it is encoded, not encrypted. Anyone with the code may be able to read or restore that information. Share it only with someone you trust and remove copies when no longer needed.",
          "Android may back up or transfer app data according to your device settings and backup provider. Those services are operated by the device or account provider, not by MotionPlay Labs. Check your device settings to manage or delete backups.",
          "The game includes recorded narration and may use your device's text-to-speech service for spoken game instructions. The voice provider and its processing depend on your device settings; some voice services may use online processing. The game does not ask you to record speech. MotionPlay Labs does not receive audio or voice-service requests from the game."
        ]
      },
      {
        "heading": "Keeping and deleting information",
        "body": [
          "Local profile and progress information remains on your device until it is removed or the app's storage is cleared. The parent area provides progress-reset and profile-management controls. To remove all local app information, clear Festival Town's storage in Android settings. Uninstalling normally removes local app data, but a device backup may restore it if you reinstall. Manage backups separately in your device or backup-account settings, and delete any progress codes you exported.",
          "MotionPlay Labs cannot access or remotely delete information stored only on your device or in your own backups."
        ]
      },
      {
        "heading": "Contacting us",
        "body": [
          "If a parent or guardian emails us, we receive the sender's email address and whatever information they choose to include. Please avoid sending children's names, photographs or other unnecessary personal information. We use correspondence to answer the request and provide support, with access limited to the people and email service providers needed for that purpose. We do not use support messages for advertising or sell their contents.",
          "We delete support correspondence within 12 months after the request is resolved, unless we must keep it longer to meet a legal obligation or handle an ongoing dispute. You may ask to access, correct or delete information we hold about you by emailing hello@motionplaylabs.com. Applicable privacy law may provide additional rights, including the right to complain to your local data-protection authority."
        ]
      },
      {
        "heading": "Children's privacy",
        "body": [
          "Festival Town is designed for children aged 4–7 with parent or guardian involvement. The game does not send children's personal information to MotionPlay Labs. Parents can manage locally saved information using the controls described above. If you believe a child has sent personal information to our support address, contact us so we can review and delete information that is not needed."
        ]
      },
      {
        "heading": "Changes",
        "body": [
          "We will update this page if the game's information-handling practices change. The date above identifies the latest version."
        ]
      }
    ]
  },
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
          "Our enquiry form collects your name, email, organisation and the details you submit so we can reply to you.",
          "The form sends your message to our inbox through our email provider, Resend.",
          "This site does not use advertising or tracking cookies.",
        ],
      },
      {
        heading: "Festival Town updates and school news",
        body: [
          "The optional parent and carer signup asks for an adult’s email address and consent to receive Festival Town updates. The school signup also asks for the school name, with optional contact name, location and role. We record the selected audience, consent wording and signup source. These forms do not ask for children’s details.",
          "Signup details are stored with Supabase. Resend sends the welcome email and a signup notification to our team. We use these details for the updates you choose. To unsubscribe, reply to one of our emails or contact hello@motionplaylabs.com. You can also ask us to delete your details.",
          "Signing up is not required to play Festival Town. The Android game has its own privacy policy at /legal/festival-town-privacy/.",
        ],
      },
      {
        heading: "Website usage",
        body: ["The website uses Vercel Analytics to measure visits and interactions such as play-button clicks, film plays and signup completion. The signup form does not include your email or contact details in these analytics events."],
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
          "Draw in the Air is used by children aged 3 to 7. We do not film or publish the children who use our products. Children shown in our marketing are models from licensed stock footage.",
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
        heading: "Festival Town film",
        body: [
          "Character scenes are animated from Festival Town's own art. Gameplay is recorded from the game. Voices are the game's own recordings; the narration is a synthetic voice. The music is original.",
          ...festivalTownStock.map((c) => `${c.title}. Mixkit, Mixkit Stock Video Free License. ${c.url}`),
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
