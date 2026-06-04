import os
from openai import OpenAI
from dotenv import load_dotenv
from typing import Dict, Any

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
client = OpenAI(api_key=OPENAI_API_KEY)

def generate_meeting_summary(transcript: str) -> str:
    prompt = f"""
    你是一位专业的会议纪要撰写者，负责记录非物质文化遗产节策划会议的讨论内容。
    
    请根据以下会议记录，生成一份详细的会议纪要，包括：
    1. 会议主题和目标
    2. 主要讨论点（按非遗类别分类整理）
    3. 各位传承人提出的核心诉求和建议
    4. 文旅局的回应和决策
    5. 下一步行动计划
    6. 待解决的问题
    
    会议记录：
    {transcript}
    
    请用中文，以专业、清晰的格式输出。
    """
    
    response = client.chat.completions.create(
        model="gpt-4-turbo-preview",
        messages=[
            {"role": "system", "content": "你是一位专业的会议纪要撰写者，擅长整理非遗保护相关的会议内容。"},
            {"role": "user", "content": prompt}
        ],
        temperature=0.7,
        max_tokens=2000
    )
    
    return response.choices[0].message.content

def generate_activity_flowchart(transcript: str) -> str:
    prompt = f"""
    基于以下非物质文化遗产节策划会议记录，请设计一份完整的节日活动流程图。
    
    请包含以下内容：
    1. 活动时间轴（按天/按时间段）
    2. 开闭幕式安排
    3. 各项非遗展示活动的时间和地点
    4. 互动体验环节安排
    5. 传承人表演和讲座安排
    6. 关键节点和注意事项
    
    请用Markdown的Mermaid流程图格式输出，确保清晰易读。
    
    会议记录：
    {transcript}
    """
    
    response = client.chat.completions.create(
        model="gpt-4-turbo-preview",
        messages=[
            {"role": "system", "content": "你是一位专业的活动策划师，擅长设计文化节活动流程。"},
            {"role": "user", "content": prompt}
        ],
        temperature=0.7,
        max_tokens=3000
    )
    
    return response.choices[0].message.content

def generate_promotional_points(transcript: str) -> str:
    prompt = f"""
    基于以下非物质文化遗产节策划会议记录，请提炼出宣传推广要点。
    
    请包含：
    1. 核心宣传口号（3-5个）
    2. 节日亮点和特色（按类别整理）
    3. 重点推荐的非遗项目和传承人
    4. 适合不同媒体的宣传角度
    5. 赞助商合作亮点
    6. 目标受众和传播策略
    
    请用中文，以清晰的分点格式输出。
    
    会议记录：
    {transcript}
    """
    
    response = client.chat.completions.create(
        model="gpt-4-turbo-preview",
        messages=[
            {"role": "system", "content": "你是一位专业的品牌营销策划师，擅长文化活动的宣传推广。"},
            {"role": "user", "content": prompt}
        ],
        temperature=0.8,
        max_tokens=2000
    )
    
    return response.choices[0].message.content

def generate_media_email_content(meeting) -> Dict[str, str]:
    subject = f"【媒体邀请】{meeting.title} - 非遗文化盛宴即将开启"
    
    body = f"""
尊敬的媒体朋友：

您好！

我们诚挚地邀请您参加即将举办的{meeting.title}。本次活动汇聚了众多国家级和省级非物质文化遗产传承人，将为观众呈现一场精彩的文化盛宴。

{meeting.summary if meeting.summary else '活动详情正在紧张筹备中...'}

活动亮点：
{meeting.promotional_points if meeting.promotional_points else '- 精彩内容即将揭晓'}

活动流程：
{meeting.activity_flowchart if meeting.activity_flowchart else '- 详细流程将稍后公布'}

如您有意采访报道，请与我们联系。期待您的光临！

此致
敬礼

非遗节组委会
    """
    
    return {"subject": subject, "body": body}

def generate_sponsor_email_content(meeting) -> Dict[str, str]:
    subject = f"【合作邀请】{meeting.title} - 与非遗文化同行"
    
    body = f"""
尊敬的合作伙伴：

您好！

我们诚挚地邀请贵公司参与{meeting.title}的赞助合作。本次非遗节是展示企业文化、履行社会责任的绝佳平台。

{meeting.summary if meeting.summary else '活动详情正在紧张筹备中...'}

合作价值：
- 品牌曝光：预计覆盖观众10万人次+，媒体报道50+
- 文化共鸣：与非遗文化深度绑定，提升品牌文化内涵
- 精准触达：面向文化爱好者、家庭群体、年轻人群
- 公益形象：支持非遗保护，彰显企业社会责任

宣传亮点：
{meeting.promotional_points if meeting.promotional_points else '- 精彩内容即将揭晓'}

我们可根据贵公司需求定制合作方案。期待与您携手，共同守护非遗文化瑰宝！

此致
敬礼

非遗节组委会
    """
    
    return {"subject": subject, "body": body}
