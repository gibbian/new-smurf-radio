export default async function Home() {
  // const hello = await api.post.hello.query({ text: "from tRPC" });
  // const session = await getServerAuthSession();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div>Test123</div>
      <audio
        src="https://listen.mixlr.com/b56be669394360d179edfe32f99ab02c"
        controls
      ></audio>
    </main>
  );
}
