import Link from "next/link";

export default function Header() {
    return (
        <header className="flex items-center justify-between p-4 bg-gray-800 text-white">
            <h1 className="text-2xl font-bold">GT-Task</h1>
            <nav className="flex space-x-4">
                <Link href="/" className="text-lg hover:text-gray-400">
                    Home
                </Link>
            </nav>
        </header>
    )
}