import AuthGuard from '../components/AuthGuard'

export default function Settings() {
  return (
    <AuthGuard>
      <div>Settings</div>
    </AuthGuard>
  )
}
