import Link from "next/link";
import { getServerAuthSession } from "~/server/auth";

export default async function Home() {
  const session = await getServerAuthSession();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center ">
      <div>SMURF RADIO</div>
      {JSON.stringify(session?.user)}
      <Link href={"/api/auth/signin"}>Sign IN</Link>
    </main>
  );
}
