import { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { Upload, Play, FileText, Mail, ArrowLeft, CheckCircle } from 'lucide-react'
import axios from 'axios'
import ReactMarkdown from 'react-markdown'

interface Meeting {
  id: number
  title: string
  description: string
  meeting_date: string
  location: string
  audio_file: string
  transcription_completed: boolean
  summary_generated: boolean
  summary: string
  activity_flowchart: string
  promotional_points: string
  created_at: string
}

interface TranscriptionSegment {
  id: number
  start_time: number
  end_time: number
  speaker: string
  text: string
  heritage_category: string
}

const MeetingDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [meeting, setMeeting] = useState<Meeting | null>(null)
  const [segments, setSegments] = useState<TranscriptionSegment[]>([])
  const [activeTab, setActiveTab] = useState<'transcription' | 'summary' | 'flowchart' | 'promotion'>('transcription')
  const [emailModal, setEmailModal] = useState(false)
  const [mediaEmails, setMediaEmails] = useState('')
  const [sponsorEmails, setSponsorEmails] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    if (id) {
      fetchMeeting()
    }
  }, [id])

  const fetchMeeting = async () => {
    try {
      const [meetingRes, segmentsRes] = await Promise.all([
        axios.get(`/api/meetings/${id}`),
        axios.get(`/api/meetings/${id}/transcription`),
      ])
      setMeeting(meetingRes.data)
      setSegments(segmentsRes.data)
    } catch (error) {
      console.error('Error fetching meeting:', error)
    }
  }

  const handleAudioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !id) return

    const formData = new FormData()
    formData.append('file', file)

    try {
      await axios.post(`/api/meetings/${id}/upload-audio`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      fetchMeeting()
    } catch (error) {
      console.error('Error uploading audio:', error)
    }
  }

  const handleProcessAudio = async () => {
    if (!id) return
    setProcessing(true)
    try {
      await axios.post(`/api/meetings/${id}/process-audio`)
      fetchMeeting()
    } catch (error) {
      console.error('Error processing audio:', error)
    } finally {
      setProcessing(false)
    }
  }

  const handleGenerateSummary = async () => {
    if (!id) return
    setProcessing(true)
    try {
      await axios.post(`/api/meetings/${id}/generate-summary`)
      fetchMeeting()
    } catch (error) {
      console.error('Error generating summary:', error)
    } finally {
      setProcessing(false)
    }
  }

  const handleSendEmails = async () => {
    if (!id) return
    try {
      await axios.post(`/api/meetings/${id}/send-emails`, {
        media_emails: mediaEmails.split(',').map(e => e.trim()).filter(Boolean),
        sponsor_emails: sponsorEmails.split(',').map(e => e.trim()).filter(Boolean),
      })
      setEmailModal(false)
      setMediaEmails('')
      setSponsorEmails('')
    } catch (error) {
      console.error('Error sending emails:', error)
    }
  }

  if (!meeting) {
    return <div className="text-center py-12 text-heritage-600">加载中...</div>
  }

  const tabs = [
    { id: 'transcription', label: '转写内容', icon: FileText },
    { id: 'summary', label: '会议摘要', icon: FileText },
    { id: 'flowchart', label: '活动流程', icon: Play },
    { id: 'promotion', label: '宣传要点', icon: FileText },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => window.history.back()}
            className="p-2 hover:bg-heritage-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} className="text-heritage-600" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-heritage-800">{meeting.title}</h2>
            <p className="text-heritage-600">{meeting.description}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*"
            onChange={handleAudioUpload}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center space-x-2 px-4 py-2 border border-heritage-200 text-heritage-700 rounded-lg hover:bg-heritage-50 transition-colors"
          >
            <Upload size={18} />
            <span>上传音频</span>
          </button>
          {meeting.audio_file && !meeting.transcription_completed && (
            <button
              onClick={handleProcessAudio}
              disabled={processing}
              className="flex items-center space-x-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50"
            >
              <Play size={18} />
              <span>{processing ? '处理中...' : '处理音频'}</span>
            </button>
          )}
          {meeting.transcription_completed && !meeting.summary_generated && (
            <button
              onClick={handleGenerateSummary}
              disabled={processing}
              className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
            >
              <FileText size={18} />
              <span>{processing ? '生成中...' : '生成摘要'}</span>
            </button>
          )}
          {meeting.summary_generated && (
            <button
              onClick={() => setEmailModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-heritage-600 text-white rounded-lg hover:bg-heritage-700 transition-colors"
            >
              <Mail size={18} />
              <span>发送邮件</span>
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-6 bg-white rounded-xl p-4 card-shadow">
        <div className="flex items-center space-x-2">
          <CheckCircle size={20} className={meeting.audio_file ? 'text-emerald-500' : 'text-gray-300'} />
          <span className={meeting.audio_file ? 'text-heritage-800' : 'text-gray-400'}>音频上传</span>
        </div>
        <div className="w-12 h-0.5 bg-heritage-200"></div>
        <div className="flex items-center space-x-2">
          <CheckCircle size={20} className={meeting.transcription_completed ? 'text-emerald-500' : 'text-gray-300'} />
          <span className={meeting.transcription_completed ? 'text-heritage-800' : 'text-gray-400'}>音频转写</span>
        </div>
        <div className="w-12 h-0.5 bg-heritage-200"></div>
        <div className="flex items-center space-x-2">
          <CheckCircle size={20} className={meeting.summary_generated ? 'text-emerald-500' : 'text-gray-300'} />
          <span className={meeting.summary_generated ? 'text-heritage-800' : 'text-gray-400'}>摘要生成</span>
        </div>
      </div>

      <div className="flex space-x-1 bg-white rounded-xl p-1 card-shadow">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg transition-colors ${
              activeTab === tab.id
                ? 'bg-heritage-100 text-heritage-800 font-medium'
                : 'text-heritage-600 hover:bg-heritage-50'
            }`}
          >
            <tab.icon size={18} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl card-shadow p-6 min-h-96">
        {activeTab === 'transcription' && (
          <div className="space-y-4">
            {segments.length > 0 ? (
              segments.map((seg) => (
                <div key={seg.id} className="p-4 bg-heritage-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-heritage-800">{seg.speaker}</span>
                    <div className="flex items-center space-x-2">
                      {seg.heritage_category && (
                        <span className="px-2 py-0.5 bg-heritage-200 text-heritage-700 text-xs rounded">
                          {seg.heritage_category}
                        </span>
                      )}
                      <span className="text-sm text-heritage-500">
                        {Math.floor(seg.start_time / 60)}:{(seg.start_time % 60).toFixed(0).padStart(2, '0')}
                      </span>
                    </div>
                  </div>
                  <p className="text-heritage-700">{seg.text}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-heritage-500">
                {meeting.audio_file ? '请先处理音频获取转写内容' : '请上传音频文件'}
              </div>
            )}
          </div>
        )}

        {activeTab === 'summary' && (
          <div className="prose max-w-none">
            {meeting.summary ? (
              <ReactMarkdown>{meeting.summary}</ReactMarkdown>
            ) : (
              <div className="text-center py-12 text-heritage-500">
                {meeting.transcription_completed ? '请先生成会议摘要' : '请先处理音频'}
              </div>
            )}
          </div>
        )}

        {activeTab === 'flowchart' && (
          <div className="prose max-w-none">
            {meeting.activity_flowchart ? (
              <ReactMarkdown>{meeting.activity_flowchart}</ReactMarkdown>
            ) : (
              <div className="text-center py-12 text-heritage-500">
                {meeting.summary_generated ? '活动流程图将在这里显示' : '请先生成摘要'}
              </div>
            )}
          </div>
        )}

        {activeTab === 'promotion' && (
          <div className="prose max-w-none">
            {meeting.promotional_points ? (
              <ReactMarkdown>{meeting.promotional_points}</ReactMarkdown>
            ) : (
              <div className="text-center py-12 text-heritage-500">
                {meeting.summary_generated ? '宣传要点将在这里显示' : '请先生成摘要'}
              </div>
            )}
          </div>
        )}
      </div>

      {emailModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg">
            <h3 className="text-xl font-bold text-heritage-800 mb-4">发送邮件通知</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-heritage-700 mb-1">媒体邮箱（多个用逗号分隔）</label>
                <textarea
                  value={mediaEmails}
                  onChange={(e) => setMediaEmails(e.target.value)}
                  className="w-full px-3 py-2 border border-heritage-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-heritage-500"
                  rows={2}
                  placeholder="press@example.com, news@media.cn"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-heritage-700 mb-1">赞助商邮箱（多个用逗号分隔）</label>
                <textarea
                  value={sponsorEmails}
                  onChange={(e) => setSponsorEmails(e.target.value)}
                  className="w-full px-3 py-2 border border-heritage-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-heritage-500"
                  rows={2}
                  placeholder="sponsor@company.com, partner@org.cn"
                />
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setEmailModal(false)}
                className="flex-1 px-4 py-2 border border-heritage-200 text-heritage-700 rounded-lg hover:bg-heritage-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleSendEmails}
                className="flex-1 px-4 py-2 bg-heritage-600 text-white rounded-lg hover:bg-heritage-700 transition-colors"
              >
                发送
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MeetingDetail
