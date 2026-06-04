import { useEffect, useState } from 'react'
import { Plus, MapPin, Info } from 'lucide-react'
import axios from 'axios'

interface Booth {
  id: number
  booth_number: string
  name: string
  heritage_category: string
  artisan_id: number
  location_x: number
  location_y: number
  width: number
  height: number
  description: string
  image_url: string
}

const BoothMap: React.FC = () => {
  const [booths, setBooths] = useState<Booth[]>([])
  const [selectedBooth, setSelectedBooth] = useState<Booth | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [newBooth, setNewBooth] = useState({
    booth_number: '',
    name: '',
    heritage_category: '',
    artisan_id: 0,
    location_x: 100,
    location_y: 100,
    width: 100,
    height: 100,
    description: '',
    image_url: '',
  })

  useEffect(() => {
    fetchBooths()
  }, [])

  const fetchBooths = async () => {
    try {
      const response = await axios.get('/api/booths/')
      setBooths(response.data)
    } catch (error) {
      console.error('Error fetching booths:', error)
      setBooths([
        {
          id: 1,
          booth_number: 'A01',
          name: '青花瓷艺坊',
          heritage_category: '传统技艺',
          artisan_id: 1,
          location_x: 80,
          location_y: 80,
          width: 120,
          height: 100,
          description: '展示景德镇传统青花瓷制作技艺，可现场体验绘制。',
          image_url: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=400&h=300&fit=crop',
        },
        {
          id: 2,
          booth_number: 'A02',
          name: '剪纸轩',
          heritage_category: '传统美术',
          artisan_id: 2,
          location_x: 220,
          location_y: 80,
          width: 100,
          height: 100,
          description: '传统剪纸艺术展示，可定制个性化剪纸作品。',
          image_url: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop',
        },
        {
          id: 3,
          booth_number: 'B01',
          name: '古韵筝社',
          heritage_category: '传统音乐',
          artisan_id: 3,
          location_x: 80,
          location_y: 200,
          width: 140,
          height: 100,
          description: '古筝演奏展示，传统民乐欣赏与教学体验。',
          image_url: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=400&h=300&fit=crop',
        },
        {
          id: 4,
          booth_number: 'B02',
          name: '绣韵阁',
          heritage_category: '传统技艺',
          artisan_id: 4,
          location_x: 240,
          location_y: 200,
          width: 120,
          height: 100,
          description: '苏绣精品展示，传承人现场演示刺绣技艺。',
          image_url: 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=400&h=300&fit=crop',
        },
        {
          id: 5,
          booth_number: 'C01',
          name: '木韵堂',
          heritage_category: '传统技艺',
          artisan_id: 5,
          location_x: 80,
          location_y: 320,
          width: 110,
          height: 100,
          description: '东阳木雕艺术展示，精品木雕作品鉴赏。',
          image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
        },
        {
          id: 6,
          booth_number: 'C02',
          name: '梅韵兰芳',
          heritage_category: '传统戏剧',
          artisan_id: 6,
          location_x: 210,
          location_y: 320,
          width: 130,
          height: 100,
          description: '京剧艺术展示，梅派唱腔欣赏与脸谱绘制体验。',
          image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
        },
        {
          id: 7,
          booth_number: 'D01',
          name: '主舞台',
          heritage_category: '民俗',
          artisan_id: 0,
          location_x: 380,
          location_y: 80,
          width: 200,
          height: 150,
          description: '开幕式、闭幕式及大型演出活动场地。',
          image_url: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=300&fit=crop',
        },
        {
          id: 8,
          booth_number: 'D02',
          name: '互动体验区',
          heritage_category: '民俗',
          artisan_id: 0,
          location_x: 380,
          location_y: 250,
          width: 200,
          height: 150,
          description: '多项非遗项目互动体验，游客可亲手参与制作。',
          image_url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&h=300&fit=crop',
        },
      ])
    }
  }

  const handleCreateBooth = async () => {
    try {
      await axios.post('/api/booths/', newBooth)
      setShowModal(false)
      setNewBooth({
        booth_number: '',
        name: '',
        heritage_category: '',
        artisan_id: 0,
        location_x: 100,
        location_y: 100,
        width: 100,
        height: 100,
        description: '',
        image_url: '',
      })
      fetchBooths()
    } catch (error) {
      console.error('Error creating booth:', error)
    }
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      '传统技艺': 'bg-amber-500',
      '传统音乐': 'bg-blue-500',
      '传统舞蹈': 'bg-pink-500',
      '传统戏剧': 'bg-purple-500',
      '传统曲艺': 'bg-orange-500',
      '传统美术': 'bg-emerald-500',
      '传统医药': 'bg-teal-500',
      '民俗': 'bg-red-500',
    }
    return colors[category] || 'bg-gray-500'
  }

  const getCategoryBorderColor = (category: string) => {
    const colors: Record<string, string> = {
      '传统技艺': 'border-amber-500',
      '传统音乐': 'border-blue-500',
      '传统舞蹈': 'border-pink-500',
      '传统戏剧': 'border-purple-500',
      '传统曲艺': 'border-orange-500',
      '传统美术': 'border-emerald-500',
      '传统医药': 'border-teal-500',
      '民俗': 'border-red-500',
    }
    return colors[category] || 'border-gray-500'
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-heritage-800">展位分布图</h2>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-heritage-600 text-white rounded-lg hover:bg-heritage-700 transition-colors"
        >
          <Plus size={18} />
          <span>添加展位</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl card-shadow p-6">
            <div className="booth-map bg-heritage-50 rounded-lg relative" style={{ height: '500px' }}>
              <div className="absolute top-2 left-2 bg-white/90 px-3 py-1 rounded-lg text-sm text-heritage-700">
                <MapPin size={14} className="inline mr-1" />
                非遗展馆平面图
              </div>
              
              {booths.map((booth) => (
                <div
                  key={booth.id}
                  onClick={() => setSelectedBooth(booth)}
                  className={`absolute border-2 rounded-lg cursor-pointer transition-all hover:scale-105 hover:shadow-lg ${
                    selectedBooth?.id === booth.id
                      ? `ring-2 ring-offset-2 ring-heritage-500 ${getCategoryBorderColor(booth.heritage_category)}`
                      : getCategoryBorderColor(booth.heritage_category)
                  }`}
                  style={{
                    left: `${booth.location_x}px`,
                    top: `${booth.location_y}px`,
                    width: `${booth.width}px`,
                    height: `${booth.height}px`,
                    backgroundColor: 'rgba(255,255,255,0.9)',
                  }}
                >
                  <div className={`h-2 ${getCategoryColor(booth.heritage_category)} rounded-t-md`}></div>
                  <div className="p-2">
                    <div className="text-xs font-bold text-heritage-800">{booth.booth_number}</div>
                    <div className="text-xs text-heritage-600 truncate">{booth.name}</div>
                  </div>
                </div>
              ))}

              <div className="absolute bottom-4 right-4 bg-white/90 rounded-lg p-3 text-xs">
                <div className="font-medium text-heritage-700 mb-2">图例</div>
                <div className="space-y-1">
                  {['传统技艺', '传统美术', '传统音乐', '传统戏剧', '民俗'].map((cat) => (
                    <div key={cat} className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded ${getCategoryColor(cat)}`}></div>
                      <span className="text-heritage-600">{cat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-xl card-shadow p-4">
            <h3 className="font-bold text-heritage-800 mb-3 flex items-center space-x-2">
              <Info size={18} />
              <span>展位详情</span>
            </h3>
            {selectedBooth ? (
              <div className="space-y-3">
                <img
                  src={selectedBooth.image_url}
                  alt={selectedBooth.name}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-heritage-800">{selectedBooth.name}</span>
                    <span className={`px-2 py-0.5 rounded text-xs text-white ${getCategoryColor(selectedBooth.heritage_category)}`}>
                      {selectedBooth.heritage_category}
                    </span>
                  </div>
                  <div className="text-sm text-heritage-500">展位号：{selectedBooth.booth_number}</div>
                </div>
                <p className="text-sm text-heritage-600">{selectedBooth.description}</p>
              </div>
            ) : (
              <div className="text-center py-8 text-heritage-500 text-sm">
                点击左侧展位查看详情
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl card-shadow p-4">
            <h3 className="font-bold text-heritage-800 mb-3">展位列表</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {booths.map((booth) => (
                <div
                  key={booth.id}
                  onClick={() => setSelectedBooth(booth)}
                  className={`p-2 rounded-lg cursor-pointer transition-colors ${
                    selectedBooth?.id === booth.id
                      ? 'bg-heritage-100'
                      : 'hover:bg-heritage-50'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded ${getCategoryColor(booth.heritage_category)}`}></div>
                    <span className="text-sm font-medium text-heritage-700">{booth.booth_number}</span>
                    <span className="text-sm text-heritage-600">{booth.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-heritage-800 mb-4">添加展位</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-heritage-700 mb-1">展位号</label>
                  <input
                    type="text"
                    value={newBooth.booth_number}
                    onChange={(e) => setNewBooth({ ...newBooth, booth_number: e.target.value })}
                    className="w-full px-3 py-2 border border-heritage-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-heritage-500"
                    placeholder="A01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-heritage-700 mb-1">非遗类别</label>
                  <select
                    value={newBooth.heritage_category}
                    onChange={(e) => setNewBooth({ ...newBooth, heritage_category: e.target.value })}
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
              </div>
              <div>
                <label className="block text-sm font-medium text-heritage-700 mb-1">展位名称</label>
                <input
                  type="text"
                  value={newBooth.name}
                  onChange={(e) => setNewBooth({ ...newBooth, name: e.target.value })}
                  className="w-full px-3 py-2 border border-heritage-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-heritage-500"
                />
              </div>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-heritage-700 mb-1">X坐标</label>
                  <input
                    type="number"
                    value={newBooth.location_x}
                    onChange={(e) => setNewBooth({ ...newBooth, location_x: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-heritage-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-heritage-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-heritage-700 mb-1">Y坐标</label>
                  <input
                    type="number"
                    value={newBooth.location_y}
                    onChange={(e) => setNewBooth({ ...newBooth, location_y: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-heritage-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-heritage-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-heritage-700 mb-1">宽度</label>
                  <input
                    type="number"
                    value={newBooth.width}
                    onChange={(e) => setNewBooth({ ...newBooth, width: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-heritage-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-heritage-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-heritage-700 mb-1">高度</label>
                  <input
                    type="number"
                    value={newBooth.height}
                    onChange={(e) => setNewBooth({ ...newBooth, height: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-heritage-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-heritage-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-heritage-700 mb-1">简介</label>
                <textarea
                  value={newBooth.description}
                  onChange={(e) => setNewBooth({ ...newBooth, description: e.target.value })}
                  className="w-full px-3 py-2 border border-heritage-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-heritage-500"
                  rows={2}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-heritage-700 mb-1">图片URL</label>
                <input
                  type="text"
                  value={newBooth.image_url}
                  onChange={(e) => setNewBooth({ ...newBooth, image_url: e.target.value })}
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
                onClick={handleCreateBooth}
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

export default BoothMap
