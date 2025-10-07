import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen bg-[rgb(var(--surface))]">
    <Topbar />
    <Sidebar />
    <div className="pt-16 md:pl-64">
      <main className="px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  </div>
)

export default DashboardLayout


