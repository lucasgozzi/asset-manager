import NavBar from '@/components/NavBar'
import OnboardingGuard from '@/components/OnboardingGuard'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <OnboardingGuard>
      <div className="min-h-screen pb-20">
        {children}
      </div>
      <NavBar />
    </OnboardingGuard>
  )
}
