// Where Festival Town is published, for the admin analytics page. Update by hand when a status changes.
// Installs and plays on the stores and portals live in their own consoles; the links go there.

export type Channel = {
  name: string;
  kind: "web" | "store" | "portal";
  /** the `ch` value the game sends from this channel, so its play counts can be matched */
  ch: string;
  version: string;
  status: string;
  /** game version that first sends play counts on this channel; null while it sends none */
  countsFrom: string | null;
  console?: string;
};

export const channelsUpdated = "5 November 2026";

export const channels: Channel[] = [
  { name: "Web game (Netlify)", kind: "web", ch: "web", version: "1.0.3", status: "Live", countsFrom: "1.0.3", console: "https://app.netlify.com/projects/festival-town" },
  { name: "motionplaylabs.com/festival-town/game", kind: "web", ch: "site", version: "1.0.3", status: "Live", countsFrom: "1.0.3" },
  { name: "Amazon Appstore (Fire TV)", kind: "store", ch: "app-firetv", version: "1.0.0", status: "Live. 1.0.3 to upload", countsFrom: null, console: "https://developer.amazon.com/apps-and-games/console/apps/list.html" },
  { name: "Google Play", kind: "store", ch: "app-android", version: "1.0.1", status: "In review since 30 Oct", countsFrom: null, console: "https://play.google.com/console" },
  { name: "Samsung TV (Tizen)", kind: "store", ch: "app-tizen", version: "1.0.0", status: "In certification", countsFrom: null, console: "https://seller.samsungapps.com" },
  { name: "LG TV (webOS)", kind: "store", ch: "app-webos", version: "1.0.0", status: "In review", countsFrom: null, console: "https://seller.lgappstv.com" },
  { name: "CrazyGames", kind: "portal", ch: "crazygames", version: "1.0.2-r3", status: "Draft, QA in progress", countsFrom: null, console: "https://developer.crazygames.com" },
  { name: "GameDistribution", kind: "portal", ch: "gamedistribution", version: "1.0.2-r3", status: "Draft, upload pending", countsFrom: null, console: "https://developer.gamedistribution.com/games/80339" },
  { name: "Coolmath Games", kind: "portal", ch: "coolmath", version: "1.0.2", status: "Submitted 3 Nov", countsFrom: null },
  { name: "Poki", kind: "portal", ch: "poki", version: "", status: "Not submitted", countsFrom: null },
];
