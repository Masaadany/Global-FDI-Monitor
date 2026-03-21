import { Header } from '@/components/shared/Header'
import { Footer } from '@/components/shared/Footer'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{display:'flex',flexDirection:'column',minHeight:'100vh'}}>
      <Header/>
      <main style={{flex:1,paddingTop:'64px'}}>
        {children}
      </main>
      <Footer/>
    </div>
  )
}
