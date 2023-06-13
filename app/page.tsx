export default function Home() {
  return (
    <div className="flex flex-col items-center justify-around min-h-screen lg:flex-row bg-amber-200">
      <div className="flex flex-col gap-2 w-72">
        <h1 className="text-6xl font-bold text-blue-800">
          Welcome to <a href="https://nextjs.org" className="text-blue-600 underline">Next.js!</a>
        </h1>
      </div>
    </div>
  )
}
