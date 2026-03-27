import HomeClient from "./home-client";
import { SIM_TEMPLATES } from "./simulate/sim-registry";

export default function Page() {
  return <HomeClient templates={SIM_TEMPLATES} />;
}