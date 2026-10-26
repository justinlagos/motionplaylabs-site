import { Film } from "@/components/Film";
import { film } from "@/content/film";

export default function Home() {
  return <Film beats={film} />;
}
