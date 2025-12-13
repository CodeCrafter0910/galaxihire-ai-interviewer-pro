import AuthGuard from '../components/AuthGuard'

export default function Reports() {
  return (
    <AuthGuard>
      <div>Reports</div>
    </AuthGuard>
  )
}
