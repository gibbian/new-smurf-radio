import { getServerAuthSession } from "~/server/auth";

export default async function Home() {
  const session = await getServerAuthSession();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center ">
      <div>SMURF RADIO</div>
    </main>
  );
}
