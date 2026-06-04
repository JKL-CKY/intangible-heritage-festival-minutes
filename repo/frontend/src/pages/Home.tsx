import { useEffect, useState } from 'react'
import { Calendar, Users, MapPin, TrendingUp } from 'lucide-react'
import axios from 'axios'

interface StatsData {
  meetings: number
  artisans: number
  booths: number
  categories: number
}

const Home: React.FC = () => {
  const [stats, setStats] = useState<StatsData>({
    meetings: 0,
    artisans: 0,
    booths: 0,
    categories: 8,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [meetingsRes, artisansRes, boothsRes] = await Promise.all([
          axios.get('/api/meetings/'),
          axios.get('/api/artisans/'),
          axios.get('/api/booths/'),
        ])
        setStats({
          meetings: meetingsRes.data.length,
          artisans: artisansRes.data.length,
          booths: boothsRes.data.length,
          categories: 8,
        })
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  const statCards = [
    { label: '策划会议', value: stats.meetings, icon: Calendar, color: 'bg-amber-100 text-amber-700' },
    { label: '手工艺人', value: stats.artisans, icon: Users, color: 'bg-rose-100 text-rose-700' },
    { label: '展位数量', value: stats.booths, icon: MapPin, color: 'bg-emerald-100 text-emerald-700' },
    { label: '非遗类别', value: stats.categories, icon: TrendingUp, color: 'bg-blue-100 text-blue-700' },
  ]

  return (
    <div className="space-y-8">
      <div className="text-center py-12">
        <h2 className="text-4xl font-bold text-heritage-800 mb-4">
        非物质文化遗产节
        </h2>
        <p className="text-xl text-heritage-600">
          传承千年文脉 · 绽放时代光彩
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <div key={index} className="bg-white rounded-xl card-shadow p-6">
            <div className={`w-12 h-12 rounded-lg ${card.color} flex items-center justify-center mb-4`}>
              <card.icon size={24} />
            </div>
            <div className="text-3xl font-bold text-heritage-800">{card.value}</div>
            <div className="text-heritage-600">{card.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl card-shadow p-6">
          <h3 className="text-xl font-bold text-heritage-800 mb-4">非遗类别分布</h3>
          <div className="space-y-3">
            {['传统技艺', '传统音乐', '传统舞蹈', '传统戏剧', '传统曲艺', '传统美术', '传统医药', '民俗'].map((category, idx) => (
              <div key={idx} className="flex items-center justify-between">
              <span className="text-heritage-700">{category}</span>
              <div className="w-32 h-2 bg-heritage-100 rounded-full overflow-hidden">
                <div className="h-full heritage-gradient" style={{ width: `${60 + idx * 5}%` }}></div>
              </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl card-shadow p-6">
          <h3 className="text-xl font-bold text-heritage-800 mb-4">系统功能</h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 rounded-full bg-heritage-600 mt-2"></div>
              <div>
                <div className="font-medium text-heritage-800">会议音频转写</div>
                <div className="text-sm text-heritage-600">Whisper方言模型自动转写</div>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 rounded-full bg-heritage-600 mt-2"></div>
              <div>
                <div className="font-medium text-heritage-800">发言人识别</div>
                <div className="text-sm text-heritage-600">pyannote标记非遗代表</div>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 rounded-full bg-heritage-600 mt-2"></div>
              <div>
                <div className="font-medium text-heritage-800">AI智能摘要</div>
                <div className="text-sm text-heritage-600">OpenAI生成活动流程与宣传要点</div>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 rounded-full bg-heritage-600 mt-2"></div>
              <div>
                <div className="font-medium text-heritage-800">邮件推送</div>
                <div className="text-sm text-heritage-600">一键发送给媒体和赞助商</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
