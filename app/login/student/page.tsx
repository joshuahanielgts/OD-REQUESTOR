import LoginCard from '@/components/LoginCard'

export default function StudentLoginPage() {
  return (
    <LoginCard 
      title="Student Login" 
      redirectPath="/student/dashboard" 
    />
  )
}