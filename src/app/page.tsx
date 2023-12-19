export default async function Home() {
  // const hello = await api.post.hello.query({ text: "from tRPC" });
  // const session = await getServerAuthSession();
  const action = async () => {
    "use server";
    throw new Error("Error on purpose");
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#171717] text-white">
      <div>SMURF RADIO</div>
      <form action={action}>
        <button type="submit">Submit Error</button>
      </form>
    </main>
  );
}
