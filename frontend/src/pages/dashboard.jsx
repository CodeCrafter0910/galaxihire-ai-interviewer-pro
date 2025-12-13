import AuthGuard from '../components/AuthGuard'

export default function Dashboard() {
  return (
    <AuthGuard>
      <div>Dashboard</div>
    </AuthGuard>
  )
}
