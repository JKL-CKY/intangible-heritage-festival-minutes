import { Link, useNavigate } from 'react-router-dom'
import { Home, Users, MapPin, FileText } from 'lucide-react'

interface NavbarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const navigate = useNavigate()

  const navItems = [
    { id: 'home', label: '首页', icon: Home, path: '/' },
    { id: 'meetings', label: '会议纪要', icon: FileText, path: '/meetings' },
    { id: 'artisans', label: '手工艺人', icon: Users, path: '/artisans' },
    { id: 'booths', label: '展位图', icon: MapPin, path: '/booths' },
  ]

  const handleNavClick = (id: string, path: string) => {
    setActiveTab(id)
    navigate(path)
  }

  return (
    <nav className="heritage-gradient text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-xl">🎭</span>
            </div>
            <h1 className="text-xl font-bold">非遗文化节 · 风物纪要</h1>
          </div>
          <div className="flex space-x-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id, item.path)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                  activeTab === item.id
                    ? 'bg-white/20 font-medium'
                    : 'hover:bg-white/10'
                }`}
              >
                <item.icon size={18} />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
