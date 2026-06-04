import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, FileAudio, FileText, Send, Clock } from 'lucide-react'
import axios from 'axios'

interface Meeting {
  id: number
  title: string
  description: string
  meeting_date: string
  location: string
  transcription_completed: boolean
  summary_generated: boolean
  created_at: string
}

const Meetings: React.FC = () => {
  const navigate = useNavigate()
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newMeeting, setNewMeeting] = useState({
    title: '',
    description: '',
    location: '',
  })

  useEffect(() => {
    fetchMeetings()
  }, [])

  const fetchMeetings = async () => {
    try {
      const response = await axios.get('/api/meetings/')
      setMeetings(response.data)
    } catch (error) {
      console.error('Error fetching meetings:', error)
    }
  }

  const handleCreateMeeting = async () => {
    try {
      await axios.post('/api/meetings/', newMeeting)
      setShowCreateModal(false)
      setNewMeeting({ title: '', description: '', location: '' })
      fetchMeetings()
    } catch (error) {
      console.error('Error creating meeting:', error)
    }
  }

  const getStatusBadge = (meeting: Meeting) => {
    if (meeting.summary_generated) {
      return (
        <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full">
          已完成
        </span>
      )
    } else if (meeting.transcription_completed) {
      return (
        <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs rounded-full">
          已转写
        </span>
      )
    } else {
      return (
        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
          待处理
        </span>
      )
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-heritage-800">会议纪要列表</h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-heritage-600 text-white rounded-lg hover:bg-heritage-700 transition-colors"
        >
          <Plus size={18} />
          <span>新建会议</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {meetings.map((meeting) => (
          <div
            key={meeting.id}
            onClick={() => navigate(`/meetings/${meeting.id}`)}
            className="bg-white rounded-xl card-shadow p-6 cursor-pointer hover:shadow-xl transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-lg font-bold text-heritage-800">{meeting.title}</h3>
              {getStatusBadge(meeting)}
            </div>
            <p className="text-heritage-600 text-sm mb-4 line-clamp-2">
              {meeting.description}
            </p>
            <div className="flex items-center space-x-4 text-sm text-heritage-500">
              <div className="flex items-center space-x-1">
                <Clock size={14} />
                <span>{new Date(meeting.created_at).toLocaleDateString('zh-CN')}</span>
              </div>
            </div>
            <div className="flex items-center space-x-2 mt-4 pt-4 border-t border-heritage-100">
              <FileAudio size={16} className={meeting.transcription_completed ? 'text-emerald-500' : 'text-gray-400'} />
              <FileText size={16} className={meeting.summary_generated ? 'text-emerald-500' : 'text-gray-400'} />
              <Send size={16} className="text-gray-400" />
            </div>
          </div>
        ))}
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-heritage-800 mb-4">新建会议</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-heritage-700 mb-1">会议标题</label>
                <input
                  type="text"
                  value={newMeeting.title}
                  onChange={(e) => setNewMeeting({ ...newMeeting, title: e.target.value })}
                  className="w-full px-3 py-2 border border-heritage-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-heritage-500"
                  placeholder="请输入会议标题"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-heritage-700 mb-1">会议描述</label>
                <textarea
                  value={newMeeting.description}
                  onChange={(e) => setNewMeeting({ ...newMeeting, description: e.target.value })}
                  className="w-full px-3 py-2 border border-heritage-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-heritage-500"
                  rows={3}
                  placeholder="请输入会议描述"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-heritage-700 mb-1">会议地点</label>
                <input
                  type="text"
                  value={newMeeting.location}
                  onChange={(e) => setNewMeeting({ ...newMeeting, location: e.target.value })}
                  className="w-full px-3 py-2 border border-heritage-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-heritage-500"
                  placeholder="请输入会议地点"
                />
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-2 border border-heritage-200 text-heritage-700 rounded-lg hover:bg-heritage-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleCreateMeeting}
                className="flex-1 px-4 py-2 bg-heritage-600 text-white rounded-lg hover:bg-heritage-700 transition-colors"
              >
                创建
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Meetings
