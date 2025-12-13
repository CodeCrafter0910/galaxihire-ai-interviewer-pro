import AuthGuard from '../../components/AuthGuard'

export default function Interview() {
  return (
    <AuthGuard>
      <div>Interview</div>
    </AuthGuard>
  )
}
