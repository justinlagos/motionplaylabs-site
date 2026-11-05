// Festival Town school data room: /festival-town/data-room/
// Unlisted (noindex). The PDFs live in public/festival-town/data-room/.
// The four documents are exports of their Claude Docs; re-export and replace the PDF when a doc changes.

export type DataRoomStatus = "ready" | "live" | "draft" | "coming" | "request";

export type DataRoomItem = {
  no: string;
  title: string;
  desc: string;
  kind: string;
  status: DataRoomStatus;
  href?: string;
};

export type DataRoomPart = { no: string; id: string; title: string; items: DataRoomItem[] };

const pdf = (name: string) => `/festival-town/data-room/${name}.pdf`;

export const dataRoom = {
  updated: "5 November 2026",
  title: "Festival Town data room",
  lead: "The documents behind the Festival Town school licence for Nigeria. Open any item, or download the PDFs to share.",
  glance: [
    { label: "Price", value: "₦1,500 per pupil per term" },
    { label: "Ages", value: "4 to 7" },
    { label: "In the game", value: "5 places, 15 activities" },
    { label: "School start", value: "January 2027" },
  ],
  parts: [
    {
      no: "1",
      id: "start",
      title: "Start here",
      items: [
        {
          no: "1.1",
          title: "Pitch deck",
          desc: "The problem, the game, the textbook service, the school licence and the ask.",
          kind: "PDF · 27 pages · 8.2 MB",
          status: "ready",
          href: pdf("festival-town-pitch-deck"),
        },
      ],
    },
    {
      no: "2",
      id: "product",
      title: "The product",
      items: [
        { no: "2.1", title: "Play Festival Town", desc: "Free to play in any web browser.", kind: "Live game", status: "ready", href: "/festival-town/game/" },
        { no: "2.2", title: "Website and promo film", desc: "The Festival Town page, with the 1 min 14 film.", kind: "Web page", status: "ready", href: "/festival-town/" },
        {
          no: "2.3",
          title: "Amazon Appstore listing",
          desc: "Live on the Amazon Appstore for Fire TV. Google Play, Samsung and LG are in review.",
          kind: "Store",
          status: "live",
          href: "https://www.amazon.co.uk/dp/B0HPLJ1BLS",
        },
        { no: "2.4", title: "Children’s privacy policy", desc: "What Festival Town collects, and what it does not.", kind: "Web page", status: "ready", href: "/legal/festival-town-privacy/" },
      ],
    },
    {
      no: "3",
      id: "schools",
      title: "For schools",
      items: [
        {
          no: "3.1",
          title: "Curriculum map and sample teacher guide",
          desc: "Every activity mapped to its Primary 1 to 3 subject, with a sample teacher guide.",
          kind: "PDF · 5 pages",
          status: "ready",
          href: pdf("curriculum-map-and-teacher-guide"),
        },
        {
          no: "3.2",
          title: "Four-week pilot plan and skills check",
          desc: "How a school runs the pilot, and the before and after check that measures it.",
          kind: "PDF · 5 pages",
          status: "ready",
          href: pdf("pilot-plan-and-skills-check"),
        },
        {
          no: "3.3",
          title: "School licence agreement and price sheet",
          desc: "Terms under Nigerian law, with the per-pupil price and what each school receives.",
          kind: "PDF · 5 pages",
          status: "draft",
          href: pdf("school-licence-agreement-draft"),
        },
        { no: "3.4", title: "Printable picture cards for the pilot", desc: "The cards named in the pilot plan.", kind: "Print", status: "coming" },
      ],
    },
    {
      no: "4",
      id: "company",
      title: "The company",
      items: [
        {
          no: "4.1",
          title: "Company profile",
          desc: "The UK and Nigerian companies, the founder, the products and how to reach us.",
          kind: "PDF · 3 pages",
          status: "ready",
          href: pdf("company-profile"),
        },
        {
          no: "4.2",
          title: "Certificate of incorporation, England and Wales",
          desc: "MotionPlay Labs Ltd, company 17304660, Companies House, 27 June 2026.",
          kind: "PDF · 2 pages",
          status: "ready",
          href: pdf("certificate-of-incorporation-uk"),
        },
        {
          no: "4.3",
          title: "Certificate of incorporation, Nigeria",
          desc: "MotionPlay Labs Ltd, RC 9621200, Corporate Affairs Commission, 18 June 2026.",
          kind: "PDF · 1 page",
          status: "ready",
          href: pdf("certificate-of-incorporation-nigeria"),
        },
        {
          no: "4.4",
          title: "Companies House record",
          desc: "The public register entry for company 17304660.",
          kind: "Registry",
          status: "ready",
          href: "https://find-and-update.company-information.service.gov.uk/company/17304660",
        },
        {
          no: "4.5",
          title: "CAC status report, memorandum and articles",
          desc: "Ask and we will send them.",
          kind: "PDF",
          status: "request",
        },
      ],
    },
  ] satisfies DataRoomPart[],
};

export const statusLabel: Record<DataRoomStatus, string> = {
  ready: "Ready",
  live: "Live",
  draft: "Draft",
  coming: "Being added",
  request: "On request",
};
