import { useEffect, useState } from 'react'
import { Plus, Award, Phone, User } from 'lucide-react'
import axios from 'axios'

interface Artisan {
  id: number
  name: string
  heritage_category: string
  description: string
  portrait_url: string
  contact_info: string
  heritage_level: string
  years_of_experience: number
}

const Artisans: React.FC = () => {
  const [artisans, setArtisans] = useState<Artisan[]>([])
  const [showModal, setShowModal] = useState(false)
  const [newArtisan, setNewArtisan] = useState({
    name: '',
    heritage_category: '',
    description: '',
    portrait_url: '',
    contact_info: '',
    heritage_level: '',
    years_of_experience: 0,
  })

  useEffect(() => {
    fetchArtisans()
  }, [])

  const fetchArtisans = async () => {
    try {
      const response = await axios.get('/api/artisans/')
      setArtisans(response.data)
    } catch (error) {
      console.error('Error fetching artisans:', error)
      setArtisans([
        {
          id: 1,
          name: '陈师傅',
          heritage_category: '传统技艺',
          description: '从事陶瓷制作40余年，擅长青花瓷绘制，作品多次获得国家级奖项。',
          portrait_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
          contact_info: '138****8888',
          heritage_level: '国家级传承人',
          years_of_experience: 42,
        },
        {
          id: 2,
          name: '李阿姨',
          heritage_category: '传统美术',
          description: '剪纸艺术传承人，作品风格细腻婉约，曾在多个国家展出。',
          portrait_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
          contact_info: '139****6666',
          heritage_level: '省级传承人',
          years_of_experience: 35,
        },
        {
          id: 3,
          name: '王大师',
          heritage_category: '传统音乐',
          description: '古筝演奏家，师从名家，致力于传统音乐的传承与创新。',
          portrait_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
          contact_info: '137****9999',
          heritage_level: '国家级传承人',
          years_of_experience: 50,
        },
        {
          id: 4,
          name: '张奶奶',
          heritage_category: '传统技艺',
          description: '苏绣传承人，针法精湛，作品被多家博物馆收藏。',
          portrait_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face',
          contact_info: '136****7777',
          heritage_level: '国家级传承人',
          years_of_experience: 55,
        },
        {
          id: 5,
          name: '刘师傅',
          heritage_category: '传统技艺',
          description: '木雕艺术家，擅长人物雕刻，作品栩栩如生。',
          portrait_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face',
          contact_info: '135****5555',
          heritage_level: '省级传承人',
          years_of_experience: 28,
        },
        {
          id: 6,
          name: '赵老师',
          heritage_category: '传统戏剧',
          description: '京剧表演艺术家，工青衣，传承梅派艺术。',
          portrait_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face',
          contact_info: '134****4444',
          heritage_level: '国家级传承人',
          years_of_experience: 40,
        },
      ])
    }
  }

  const handleCreateArtisan = async () => {
    try {
      await axios.post('/api/artisans/', newArtisan)
      setShowModal(false)
      setNewArtisan({
        name: '',
        heritage_category: '',
        description: '',
        portrait_url: '',
        contact_info: '',
        heritage_level: '',
        years_of_experience: 0,
      })
      fetchArtisans()
    } catch (error) {
      console.error('Error creating artisan:', error)
    }
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      '传统技艺': 'bg-amber-100 text-amber-700',
      '传统音乐': 'bg-blue-100 text-blue-700',
      '传统舞蹈': 'bg-pink-100 text-pink-700',
      '传统戏剧': 'bg-purple-100 text-purple-700',
      '传统曲艺': 'bg-orange-100 text-orange-700',
      '传统美术': 'bg-emerald-100 text-emerald-700',
      '传统医药': 'bg-teal-100 text-teal-700',
      '民俗': 'bg-red-100 text-red-700',
    }
    return colors[category] || 'bg-gray-100 text-gray-700'
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-heritage-800">手工艺人风采</h2>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-heritage-600 text-white rounded-lg hover:bg-heritage-700 transition-colors"
        >
          <Plus size={18} />
          <span>添加传承人</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {artisans.map((artisan) => (
          <div key={artisan.id} className="bg-white rounded-xl card-shadow overflow-hidden group">
            <div className="relative h-64 overflow-hidden">
              <img
                src={artisan.portrait_url}
                alt={artisan.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <h3 className="text-xl font-bold">{artisan.name}</h3>
                <span className={`inline-block px-2 py-0.5 rounded text-xs ${getCategoryColor(artisan.heritage_category)}`}>
                  {artisan.heritage_category}
                </span>
              </div>
            </div>
            <div className="p-5">
              <div className="flex items-center space-x-2 mb-3">
                <Award size={16} className="text-amber-500" />
                <span className="text-sm font-medium text-heritage-700">{artisan.heritage_level}</span>
                <span className="text-sm text-heritage-500">· 从艺{artisan.years_of_experience}年</span>
              </div>
              <p className="text-heritage-600 text-sm line-clamp-3 mb-4">
                {artisan.description}
              </p>
              <div className="flex items-center text-sm text-heritage-500">
                <Phone size={14} className="mr-1" />
                <span>{artisan.contact_info}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-heritage-800 mb-4">添加传承人</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-heritage-700 mb-1">姓名</label>
                <input
                  type="text"
                  value={newArtisan.name}
                  onChange={(e) => setNewArtisan({ ...newArtisan, name: e.target.value })}
                  className="w-full px-3 py-2 border border-heritage-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-heritage-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-heritage-700 mb-1">非遗类别</label>
                  <select
                    value={newArtisan.heritage_category}
                    onChange={(e) => setNewArtisan({ ...newArtisan, heritage_category: e.target.value })}
                    className="w-full px-3 py-2 border border-heritage-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-heritage-500"
                  >
                    <option value="">请选择</option>
                    <option value="传统技艺">传统技艺</option>
                    <option value="传统音乐">传统音乐</option>
                    <option value="传统舞蹈">传统舞蹈</option>
                    <option value="传统戏剧">传统戏剧</option>
                    <option value="传统曲艺">传统曲艺</option>
                    <option value="传统美术">传统美术</option>
                    <option value="传统医药">传统医药</option>
                    <option value="民俗">民俗</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-heritage-700 mb-1">传承级别</label>
                  <select
                    value={newArtisan.heritage_level}
                    onChange={(e) => setNewArtisan({ ...newArtisan, heritage_level: e.target.value })}
                    className="w-full px-3 py-2 border border-heritage-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-heritage-500"
                  >
                    <option value="">请选择</option>
                    <option value="国家级传承人">国家级传承人</option>
                    <option value="省级传承人">省级传承人</option>
                    <option value="市级传承人">市级传承人</option>
                    <option value="县级传承人">县级传承人</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-heritage-700 mb-1">从艺年限</label>
                <input
                  type="number"
                  value={newArtisan.years_of_experience}
                  onChange={(e) => setNewArtisan({ ...newArtisan, years_of_experience: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-heritage-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-heritage-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-heritage-700 mb-1">简介</label>
                <textarea
                  value={newArtisan.description}
                  onChange={(e) => setNewArtisan({ ...newArtisan, description: e.target.value })}
                  className="w-full px-3 py-2 border border-heritage-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-heritage-500"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-heritage-700 mb-1">肖像照片URL</label>
                <input
                  type="text"
                  value={newArtisan.portrait_url}
                  onChange={(e) => setNewArtisan({ ...newArtisan, portrait_url: e.target.value })}
                  className="w-full px-3 py-2 border border-heritage-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-heritage-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-heritage-700 mb-1">联系方式</label>
                <input
                  type="text"
                  value={newArtisan.contact_info}
                  onChange={(e) => setNewArtisan({ ...newArtisan, contact_info: e.target.value })}
                  className="w-full px-3 py-2 border border-heritage-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-heritage-500"
                />
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 border border-heritage-200 text-heritage-700 rounded-lg hover:bg-heritage-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleCreateArtisan}
                className="flex-1 px-4 py-2 bg-heritage-600 text-white rounded-lg hover:bg-heritage-700 transition-colors"
              >
                添加
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Artisans
