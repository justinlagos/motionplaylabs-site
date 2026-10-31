// Festival Town: the page at /festival-town/. Everything here is checked against the game
// (festival-town.netlify.app, build of 27 Oct 2026). Do not add worlds, activities or features
// the game does not have.

export const festivalTown = {
  name: "Festival Town",
  tagline: "Help the town get ready",
  playUrl: "https://festival-town.netlify.app/",
  /** Public Amazon listing supplied by the publisher, 30 October 2026. */
  amazonUrl: "https://www.amazon.co.uk/dp/B0HPLJ1BLS",
  /** Production release is still in review in Play Console. */
  googlePlayStatus: "Coming soon",
  /** Set to the Play listing once it is live: the page then links the Google Play badge and drops "Coming soon". */
  googlePlayUrl: "",
  /** Set when playfestivaltown.com is bought and pointed at this page. */
  canonicalUrl: "https://motionplaylabs.com/festival-town/",
  /** Age range shown on the page. The game has no age gate; this is the range the activities are pitched at. */
  ages: "4 to 7",
  premise: "The big street festival is on Saturday and the whole town needs a hand. Children pick a friend, visit five places, and bring something back from each one for the festival square.",
  /**
   * Promotional film. With an empty src the section shows the device screens and no player.
   * Files live in public/festival-town/film/. Masters are kept outside the repo.
   */
  film: {
    src: "/festival-town/film/festival-town-1080.mp4",
    srcSmall: "/festival-town/film/festival-town-720.mp4",
    captions: "/festival-town/film/festival-town-en.vtt",
    poster: "/festival-town/film/poster-1600.webp",
    posterSmall: "/festival-town/film/poster-900.webp",
    /** ISO 8601, for the VideoObject in the page's structured data. */
    duration: "PT1M14S",
    uploadDate: "2026-10-28",
    title: "Big adventures. Little discoveries.",
    body: "The film shows the characters at work in their worlds and children playing on a phone, a tablet and a laptop.",
    /** Shown under the player. The children are licensed stock, not our users. */
    credit: "Character scenes are animated from the game's own art. Gameplay is recorded from the game. Children's footage is licensed stock from Mixkit.",
  },
};

/** Licensed stock in the Festival Town film (main film and social cut). Listed on /legal/credits/. */
export const festivalTownStock = [
  { title: "A girl on a bed, smiling at a tablet", url: "https://mixkit.co/free-stock-video/smiling-girl-using-her-tablet-laying-on-bed-101259/" },
  { title: "A boy using a phone", url: "https://mixkit.co/free-stock-video/young-boy-using-a-smartphone-101246/" },
  { title: "A child working on a laptop", url: "https://mixkit.co/free-stock-video/kid-focused-on-homework-at-laptop-101330/" },
  { title: "A boy using a tablet", url: "https://mixkit.co/free-stock-video/young-boy-using-a-tablet-101250/" },
  { title: "A girl in headphones, smiling at a tablet", url: "https://mixkit.co/free-stock-video/smiling-little-girl-using-headphones-glaring-at-a-tabet-101267/" },
];

export type Hero = {
  id: "ada" | "tobi" | "amina" | "zizi";
  name: string;
  role: string;
  /** The character's own line from the game. */
  says: string;
  body: string;
  colour: string;
};

export const heroes: Hero[] = [
  {
    id: "ada",
    name: "Ada",
    role: "Counts everything",
    says: "Hi! I'm Ada. I love counting things!",
    body: "Ada counts mangoes, puff-puff and toys at the market, and she is the one who notices when a number is wrong.",
    colour: "#D6336C",
  },
  {
    id: "tobi",
    name: "Tobi",
    role: "Builds and fixes",
    says: "Hi! I'm Tobi. I like building and fixing things!",
    body: "Tobi is happiest at the Builders' Yard, finding out what floats, which plank fits the gap and which frame stays up in the wind.",
    colour: "#F26A1F",
  },
  {
    id: "amina",
    name: "Amina",
    role: "Asks how it works",
    says: "Hi! I'm Amina. I want to know how everything works!",
    body: "Amina wants the reason behind things: why the plant droops, how the robot follows its code, why the bulb lights.",
    colour: "#6A35D9",
  },
  {
    id: "zizi",
    name: "Zizi",
    role: "Your guide",
    says: "Welcome to our town! The big street festival is on Saturday.",
    body: "Zizi walks beside whichever child you choose, explains each place, gives a nudge when you are stuck, and does push-ups when you get one right.",
    colour: "#F59E0B",
  },
];

export type World = {
  id: "market" | "farm" | "tech" | "build" | "adire";
  name: string;
  /** The subject the world carries: counting, growing, coding, building, making. */
  verb: string;
  subject: string;
  letter: "S" | "T" | "E" | "M";
  colour: string;
  dark: string;
  host: { id: string; name: string };
  intro: string;
  activities: { name: string; what: string }[];
  scene: string;
  /** What this place sends to the festival square once its three activities are done. */
  gift: string;
  /** Which hero stands in the scene, and in which pose. */
  kid: { id: Hero["id"]; pose: string };
  props: string[];
};

export const worlds: World[] = [
  {
    id: "market",
    name: "Market Street",
    verb: "Counting",
    subject: "Maths",
    letter: "M",
    colour: "#D6336C",
    dark: "#A8204F",
    host: { id: "bisi", name: "Mama Bisi" },
    intro: "Everyone is selling things for the festival. Children count what each stall needs and check the last number they say.",
    activities: [
      { name: "Toy stall", what: "Wake Uncle Femi's sleeping teddies one at a time and count as you go" },
      { name: "Mango stall", what: "Pack the number of mangoes Mama Bisi asks for, then add green ones to make the total" },
      { name: "Puff-puff", what: "Share Aunty Ronke's puff-puff so every plate gets the same" },
    ],
    scene: "bg_market_toys",
    gift: "A talking drum, a basket of mangoes and a tray of puff-puff",
    kid: { id: "ada", pose: "point" },
    props: ["mango", "puff", "teddy_pink"],
  },
  {
    id: "farm",
    name: "Grandma's Farm",
    verb: "Growing",
    subject: "Science",
    letter: "S",
    colour: "#3E9B5A",
    dark: "#24603A",
    host: { id: "gran", name: "Grandma" },
    intro: "Plants and animals live here. Children give a bean what it needs to grow, put a life cycle in order and feed the right animal.",
    activities: [
      { name: "Bean garden", what: "Water the droopy bean, move the cloud off the sun, and work out which bean grows best" },
      { name: "Life cycles", what: "Put the bean, the hen and the butterfly pictures in order, first to last" },
      { name: "Feeding time", what: "Give the goat, the hen and the rabbit the food each one eats, then sort living from not living" },
    ],
    scene: "bg_farm_garden",
    gift: "Sunflowers, and the animals come too",
    kid: { id: "zizi", pose: "cheer" },
    props: ["pl_sprout", "chick", "sunflower"],
  },
  {
    id: "tech",
    name: "Computer Village",
    verb: "Coding",
    subject: "Technology",
    letter: "T",
    colour: "#17A2A8",
    dark: "#0B5F63",
    host: { id: "ngozi", name: "Sister Ngozi" },
    intro: "People come here to fix phones and computers. Children code a robot, find the bug and complete a circuit.",
    activities: [
      { name: "Code Bolt", what: "Tap arrows in order, press Go, and Bolt the robot walks to his battery" },
      { name: "Fix the bug", what: "Watch Bolt go wrong, find the arrow that sent him the wrong way and swap it" },
      { name: "Light it up", what: "Fill the gap in the wire so electricity goes round the loop and the bulb comes on" },
    ],
    scene: "bg_tech",
    gift: "A music speaker and the fairy lights",
    kid: { id: "amina", pose: "think" },
    props: ["bolt", "bulb_on", "battery"],
  },
  {
    id: "build",
    name: "Builders' Yard",
    verb: "Building",
    subject: "Engineering",
    letter: "E",
    colour: "#F26A1F",
    dark: "#9A3B08",
    host: { id: "bayo", name: "Engineer Bayo" },
    intro: "Engineer Bayo builds things that really work. Children test what floats, build a bridge that holds and find the strongest shape.",
    activities: [
      { name: "Float or sink", what: "Guess, then drop each thing in the river, and build a raft that carries Zizi across" },
      { name: "Bridge builder", what: "Count the spaces in the gap and find the plank, or two planks, that fit it" },
      { name: "Strong shapes", what: "Build a tower to the flag line, then test which frame stays up when the fan blows" },
    ],
    scene: "bg_build",
    gift: "A boat, a bridge and the stage itself",
    kid: { id: "tobi", pose: "cheer" },
    props: ["duck", "brick", "block"],
  },
  {
    id: "adire",
    name: "Adire Workshop",
    verb: "Making",
    subject: "Maths",
    letter: "M",
    colour: "#2E3A87",
    dark: "#1E2C6A",
    host: { id: "kemi", name: "Aunty Kemi" },
    intro: "The tailors are making cloth for the festival. Children continue a stamp pattern, measure ribbon and sort kites by shape.",
    activities: [
      { name: "Stamp the cloth", what: "Keep the pattern going, circle, star, triangle, and spot the stamp that broke it" },
      { name: "Measure ribbons", what: "Lay buttons along a ribbon to measure it, then cut a piece the right length" },
      { name: "Shape kites", what: "Find the triangles, sort shapes by their sides and make a kite the same on both sides" },
    ],
    scene: "bg_adire",
    gift: "Bunting, a ribbon pole and kites for the sky",
    kid: { id: "ada", pose: "cheer" },
    props: ["stamp_star", "kite", "scissors"],
  },
];

export const schoolRoles = ["Teacher", "Head or deputy", "Nursery lead", "Parent-teacher group", "Something else"];

export const consentText = {
  parent: "Email me about new worlds and updates to Festival Town. I can unsubscribe at any time.",
  school: "Email me about Festival Town for schools, including pilots. I can unsubscribe at any time.",
};
