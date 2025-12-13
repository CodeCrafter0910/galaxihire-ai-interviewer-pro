import Link from 'next/link'

export default function Sidebar() {
  return (
    <div>
      <Link href="/dashboard">Dashboard</Link>
      <Link href="/interview">Interview</Link>
      <Link href="/reports">Reports</Link>
      <Link href="/settings">Settings</Link>
      <Link href="/logout">Logout</Link>
    </div>
  )
}
