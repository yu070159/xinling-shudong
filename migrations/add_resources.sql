-- 书洞资源动态化：resources 表
-- 在 Supabase SQL Editor 中执行
-- 2026-05-25

-- 1. 创建资源表
CREATE TABLE IF NOT EXISTS public.resources (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  description TEXT,
  reason TEXT,
  category TEXT NOT NULL,
  link TEXT NOT NULL,
  submitted_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. 索引
CREATE INDEX IF NOT EXISTS idx_resources_category ON public.resources (category, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_resources_created ON public.resources (created_at DESC);

-- 3. RLS
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read resources" ON public.resources;
CREATE POLICY "Anyone can read resources" ON public.resources
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert resources" ON public.resources;
CREATE POLICY "Authenticated users can insert resources" ON public.resources
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- 4. 导入现有 20 条静态数据作为种子
INSERT INTO public.resources (title, author, description, reason, category, link) VALUES
('《社会性动物》', '埃利奥特·阿伦森', '一本被誉为《社会心理学圣经》的经典杰作，深入浅出地剖析了人类行为背后的社会根源。', '帮助理解群体中的个体是如何被影响的。无论是应对大学里的小组合作，还是洞察复杂的网络舆论现象，这本书都能为你提供一副清晰的透视镜。', '经典入门', 'https://search.douban.com/book/subject_search?search_text=社会性动物'),
('《影响力》', '罗伯特·西奥迪尼', '揭示了人们顺从他人请求的六大底层心理原则（互惠、承诺和一致、社会认同、喜好、权威、稀缺）。', '防范日常消费中的营销套路，在社团拉赞助或组织学生活动时，大幅提升你的说服力。', '经典入门', 'https://search.douban.com/book/subject_search?search_text=影响力'),
('《心理学与生活》', '理查德·格里格', '斯坦福大学等多所名校的经典心理学教材，全面系统地介绍了心理学的基础知识。', '框架严谨且贴切生活。如果你想系统地建立起完整的心理学知识树，这是绕不开的一块基石。', '经典入门', 'https://search.douban.com/book/subject_search?search_text=心理学与生活'),
('《与''众''不同的心理学》', '基思·斯坦诺维奇', '教导读者如何像真正的心理学家一样，用科学和批判性的眼光看待心理现象。', '帮你快速过滤掉互联网上的伪心理学和毒鸡汤，建立起基于实证的科学批判性思维。', '经典入门', 'https://search.douban.com/book/subject_search?search_text=与众不同的心理学'),
('《寻求灵魂的现代人》', '卡尔·荣格', '荣格分析心理学的入门之作，探讨了潜意识、梦境与人类精神的深层需求。', '对于喜欢深度思考、并常常倾听他人内心困境的人来说，能帮你更好地理解心灵的深邃与复杂，拓展共情维度。', '经典入门', 'https://search.douban.com/book/subject_search?search_text=寻求灵魂的现代人'),
('《被讨厌的勇气》', '岸见一郎、古贺史健', '以青年与哲人的对话形式，阐释了阿德勒心理学关于自由、人际关系与自我价值的颠覆性观点。', '帮你斩断''寻求他人认可''的枷锁，真正掌控属于自己的人生课题，摆脱人际内耗。', '自我成长', 'https://search.douban.com/book/subject_search?search_text=被讨厌的勇气'),
('《非暴力沟通》', '马歇尔·卢森堡', '提出了一套通过''观察、感受、需要、请求''四个步骤来化解冲突、建立深层联系的沟通模式。', '提供更具疗愈感的有效回应方法；在日常宿舍关系中，它也是化解矛盾的利器。', '自我成长', 'https://search.douban.com/book/subject_search?search_text=非暴力沟通'),
('《也许你该找个人聊聊》', '洛莉·戈特利布', '一位心理咨询师记录了自己与来访者的故事，以及她自己遭遇危机去接受心理咨询的真实经历。', '温和地提醒那些经常作为他人''情绪树洞''的人：在抚慰他人的同时，也要记得安抚自己。', '自我成长', 'https://search.douban.com/book/subject_search?search_text=也许你该找个人聊聊'),
('《伯恩斯新情绪疗法》', '戴维·伯恩斯', '认知行为疗法（CBT）的经典科普，提供了一系列实用的克服抑郁和焦虑情绪的实操工具。', '书中的''认知扭曲''清单能帮你迅速识别并调整导致内耗的负面思维模式，缓解学业或就业焦虑。', '自我成长', 'https://search.douban.com/book/subject_search?search_text=伯恩斯新情绪疗法'),
('《自卑与超越》', '阿尔弗雷德·阿德勒', '深入剖析了自卑感的来源，并指导人们如何将这种情绪转化为超越自我的内在动力。', '理清性格底色，将看似负面的自卑情绪转化为驱动大学生活前进的燃料。', '自我成长', 'https://search.douban.com/book/subject_search?search_text=自卑与超越'),
('《思考，快与慢》', '丹尼尔·卡尼曼', '诺贝尔经济学奖得主揭示了人类大脑的两种运作模式：直觉的''系统1''和理性的''系统2''。', '改变你的决策方式，让你在面对考研、就业等重大选择时，能够避开大脑自带的认知偏误。', '认知行为', 'https://search.douban.com/book/subject_search?search_text=思考快与慢'),
('《掌控习惯》', '詹姆斯·克莱尔', '提供了一套系统化的微小改变策略，证明每天进步 1% 最终能带来复利级的巨大成长。', '对于想要坚持早起、健身、背单词或戒除手机成瘾的大学生来说，这是一本立竿见影的行为重塑指南。', '认知行为', 'https://search.douban.com/book/subject_search?search_text=掌控习惯'),
('《心智探奇》', '史蒂芬·平克', '从进化心理学和计算理论的宏大视角，全面解开了人类心智运作的机制之谜。', '视角极其宏大且充满启发性，能极大拓宽你对人类行为（如语言、视觉、情感）本质的认知边界。', '认知行为', 'https://search.douban.com/book/subject_search?search_text=心智探奇'),
('PsyChinaXiv (心理学开放获取数据库)', '中国科学院心理研究所', '心理学预印本平台，国内完全免费获取前沿的心理学中文学术成果。', '无需校园网，随时随地掌握国内顶尖心理学科研动态。', '免费资源', 'http://www.psychinaxiv.org/'),
('DOAJ (开放获取期刊目录)', 'Directory of Open Access Journals', '提供高质量的开放获取同行评审期刊，支持全学科的免费全文下载。', '国内网络可直连，是查找外文心理学文献的绝佳宝库。', '免费资源', 'https://doaj.org/'),
('国家哲学社会科学文献中心', 'NCPSSD', '手机号免费注册即可在线阅读和下载国内海量的核心期刊社科文献。', '打破知网壁垒，免费查阅大量心理学核心期刊论文。', '免费资源', 'https://www.ncpssd.org/'),
('心理学进展 (Advances in Psychology)', '汉斯出版社', '开源中文期刊，所有发布的心理学学术文章均可免费阅读和下载。', '本科生寻找毕业论文灵感、了解研究方法的友好平台。', '免费资源', 'https://www.hanspub.org/journal/ap'),
('《心理学与生活》公开课', '南京大学 - 桑志芹教授团队', '中国大学MOOC课程。课程内容贴近日常，全面覆盖心理学基础。', '非常适合非心理学专业的大学生作为第一门系统入门课。', '公开课', 'https://www.icourse163.org/search.htm?search=心理学与生活'),
('《幸福课 (积极心理学)》', '哈佛大学 - Tal Ben-Shahar', '哈佛大学史上最受欢迎的课程之一，不讲深奥理论，专攻日常幸福感。', '在内卷和压力中，教你如何通过科学的方法提升感受快乐的能力。', '公开课', 'https://search.bilibili.com/all?keyword=哈佛大学幸福课'),
('《普通心理学》公开课', '北京大学', '偏向学术与硬核基础。带你深入了解大脑机制、感知觉原理。', '如果你对心理学有较深厚的兴趣，想建立扎实的学科素养，这门课是最佳选择。', '公开课', 'https://www.icourse163.org/search.htm?search=普通心理学'),
('《异常心理学 / 变态心理学》', '北京大学 - 钱铭怡教授', '系统讲解抑郁、焦虑、人格障碍等异常心理现象的机制与干预。', '科学认识心理异常，消除偏见，建立起客观包容的临床认知。', '公开课', 'https://search.bilibili.com/all?keyword=北京大学变态心理学钱铭怡')
ON CONFLICT DO NOTHING;
