import SimulateClient from "./simulate-client";

export default async function Page({
  searchParams
}: {
  searchParams?: Promise<{ topic?: string; sim?: string }>;
}) {
  const params = await searchParams;
  return (
    <SimulateClient
      initialTopic={params?.topic ?? ""}
      initialSim={params?.sim ?? ""}
    />
  );
}