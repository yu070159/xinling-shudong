// 书洞资源数据 - 31本书籍/资源
// 所有链接均指向免费阅读或下载平台（鸠摩搜书、微信读书、ManyBooks、Internet Archive等）

const libraryData = [
    // ═══════════ 经典入门 ═══════════
    {
        title: "《社会性动物》",
        author: "埃利奥特·阿伦森",
        desc: "一本被誉为《社会心理学圣经》的经典杰作，深入浅出地剖析了人类行为背后的社会根源。",
        reason: "帮助理解群体中的个体是如何被影响的。无论是大学里的小组合作，还是洞察复杂的网络舆论现象，这本书都能为你提供一副清晰的透视镜。",
        category: "经典入门",
        link: "https://www.jiumodiary.com/search?q=社会性动物+阿伦森"
    },
    {
        title: "《影响力》",
        author: "罗伯特·西奥迪尼",
        desc: "揭示了人们顺从他人请求的六大底层心理原则（互惠、承诺和一致、社会认同、喜好、权威、稀缺）。",
        reason: "防范日常消费中的营销套路，在社团拉赞助或组织学生活动时，大幅提升你的说服力。",
        category: "经典入门",
        link: "https://manybooks.net/search?q=influence+psychology+persuasion+cialdini"
    },
    {
        title: "《心理学与生活》",
        author: "理查德·格里格",
        desc: "斯坦福大学等多所名校的经典心理学教材，全面系统地介绍了心理学的基础知识。",
        reason: "框架严谨且贴切生活。如果你想系统地建立起完整的心理学知识树，这是绕不开的一块基石。",
        category: "经典入门",
        link: "https://www.jiumodiary.com/search?q=心理学与生活+格里格"
    },
    {
        title: "《与'众'不同的心理学》",
        author: "基思·斯坦诺维奇",
        desc: "教导读者如何像真正的心理学家一样，用科学和批判性的眼光看待心理现象。",
        reason: "帮你快速过滤掉互联网上的伪心理学和毒鸡汤，建立起基于实证的科学批判性思维。",
        category: "经典入门",
        link: "https://archive.org/search.php?query=How+to+Think+Straight+About+Psychology+Stanovich"
    },
    {
        title: "《寻求灵魂的现代人》",
        author: "卡尔·荣格",
        desc: "荣格分析心理学的入门之作，探讨了潜意识、梦境与人类精神的深层需求。",
        reason: "对于喜欢深度思考、并常常倾听他人内心困境的人来说，能帮你更好地理解心灵的深邃与复杂，拓展共情维度。",
        category: "经典入门",
        link: "https://www.jiumodiary.com/search?q=寻求灵魂的现代人+荣格"
    },
    {
        title: "《梦的解析》",
        author: "西格蒙德·弗洛伊德",
        desc: "精神分析学派的奠基之作，首次系统阐述了潜意识、梦的运作机制与心理结构的深层关系。",
        reason: "了解心理学史无法绕过的里程碑，帮助理解现代心理咨询诸多流派的思想源头。",
        category: "经典入门",
        link: "https://www.jiumodiary.com/search?q=梦的解析+弗洛伊德"
    },
    {
        title: "《亲密关系》",
        author: "罗兰·米勒",
        desc: "基于大量实证研究的亲密关系科学读本，涵盖吸引力、爱情、冲突、沟通等核心主题。",
        reason: "无论恋爱、友谊还是家庭关系，这本书用科学告诉你维系健康关系的底层逻辑。",
        category: "经典入门",
        link: "https://weread.qq.com/web/search?key=亲密关系+罗兰米勒"
    },
    {
        title: "《我们时代的神经症人格》",
        author: "卡伦·霍妮",
        desc: "新精神分析学派经典，深入剖析现代文化中焦虑、竞争与神经症人格的形成机制。",
        reason: "帮你理解当代社会竞争压力下的焦虑根源，看到'内卷'背后的心理学解释。",
        category: "经典入门",
        link: "https://www.jiumodiary.com/search?q=我们时代的神经症人格+霍妮"
    },

    // ═══════════ 自我成长 ═══════════
    {
        title: "《被讨厌的勇气》",
        author: "岸见一郎、古贺史健",
        desc: "以青年与哲人的对话形式，阐释了阿德勒心理学关于自由、人际关系与自我价值的颠覆性观点。",
        reason: "帮你斩断'寻求他人认可'的枷锁，真正掌控属于自己的人生课题，摆脱人际内耗。",
        category: "自我成长",
        link: "https://weread.qq.com/web/search?key=被讨厌的勇气"
    },
    {
        title: "《非暴力沟通》",
        author: "马歇尔·卢森堡",
        desc: "提出了一套通过'观察、感受、需要、请求'四个步骤来化解冲突、建立深层联系的沟通模式。",
        reason: "提供更具疗愈感的有效回应方法；在日常宿舍关系中，它也是化解矛盾的利器。",
        category: "自我成长",
        link: "https://weread.qq.com/web/search?key=非暴力沟通"
    },
    {
        title: "《也许你该找个人聊聊》",
        author: "洛莉·戈特利布",
        desc: "一位心理咨询师记录了自己与来访者的故事，以及她自己遭遇危机去接受心理咨询的真实经历。",
        reason: "温和地提醒那些经常作为他人'情绪树洞'的人：在抚慰他人的同时，也要记得安抚自己。",
        category: "自我成长",
        link: "https://weread.qq.com/web/search?key=也许你该找个人聊聊"
    },
    {
        title: "《伯恩斯新情绪疗法》",
        author: "戴维·伯恩斯",
        desc: "认知行为疗法（CBT）的经典科普，提供了一系列实用的克服抑郁和焦虑情绪的实操工具。",
        reason: "书中的'认知扭曲'清单能帮你迅速识别并调整导致内耗的负面思维模式，缓解学业或就业焦虑。",
        category: "自我成长",
        link: "https://www.jiumodiary.com/search?q=伯恩斯新情绪疗法"
    },
    {
        title: "《自卑与超越》",
        author: "阿尔弗雷德·阿德勒",
        desc: "深入剖析了自卑感的来源，并指导人们如何将这种情绪转化为超越自我的内在动力。",
        reason: "理清性格底色，将看似负面的自卑情绪转化为驱动大学生活前进的燃料。",
        category: "自我成长",
        link: "https://www.jiumodiary.com/search?q=自卑与超越+阿德勒"
    },
    {
        title: "《心流：最优体验心理学》",
        author: "米哈里·契克森米哈伊",
        desc: "积极心理学里程碑之作，揭示了人类在完全沉浸于某项活动时所体验到的最优心理状态。",
        reason: "学习时无法专注？这本书教你如何通过调整挑战与技能的平衡，进入忘我的心流状态。",
        category: "自我成长",
        link: "https://weread.qq.com/web/search?key=心流+最优体验"
    },
    {
        title: "《少有人走的路》",
        author: "M·斯科特·派克",
        desc: "以'人生苦难重重'开篇，探讨了自律、爱、成长与信仰等人生核心命题的心理学经典。",
        reason: "被誉为'来自上帝的礼物'，用温和而坚定的笔触引导你正视人生的艰难与成长的必要。",
        category: "自我成长",
        link: "https://weread.qq.com/web/search?key=少有人走的路"
    },
    {
        title: "《活出生命的意义》",
        author: "维克多·弗兰克尔",
        desc: "作者以其在集中营的亲身经历，开创了意义疗法——即使在极端苦难中，人仍能选择自己的态度。",
        reason: "当你感到迷茫、空虚或生活无意义时，这本书能帮你找到属于自己的生命方向。",
        category: "自我成长",
        link: "https://www.jiumodiary.com/search?q=活出生命的意义+弗兰克尔"
    },
    {
        title: "《感谢自己的不完美》",
        author: "武志红",
        desc: "中国本土心理学代表作，引导读者接纳自己的负面情绪与不完美，与内心的阴影和解。",
        reason: "贴近中国大学生的文化语境，用熟悉的案例帮你理解：坏情绪不是敌人，而是信使。",
        category: "自我成长",
        link: "https://weread.qq.com/web/search?key=感谢自己的不完美+武志红"
    },

    // ═══════════ 认知行为 ═══════════
    {
        title: "《思考，快与慢》",
        author: "丹尼尔·卡尼曼",
        desc: "诺贝尔经济学奖得主揭示了人类大脑的两种运作模式：直觉的'系统1'和理性的'系统2'。",
        reason: "改变你的决策方式，让你在面对考研、就业等重大选择时，能够避开大脑自带的认知偏误。",
        category: "认知行为",
        link: "https://manybooks.net/search?q=thinking+fast+slow+kahneman"
    },
    {
        title: "《掌控习惯》",
        author: "詹姆斯·克莱尔",
        desc: "提供了一套系统化的微小改变策略，证明每天进步 1% 最终能带来复利级的巨大成长。",
        reason: "对于想要坚持早起、健身、背单词或戒除手机成瘾的大学生来说，这是一本立竿见影的行为重塑指南。",
        category: "认知行为",
        link: "https://manybooks.net/search?q=atomic+habits+clear"
    },
    {
        title: "《心智探奇》",
        author: "史蒂芬·平克",
        desc: "从进化心理学和计算理论的宏大视角，全面解开了人类心智运作的机制之谜。",
        reason: "视角极其宏大且充满启发性，能极大拓宽你对人类行为（如语言、视觉、情感）本质的认知边界。",
        category: "认知行为",
        link: "https://archive.org/search.php?query=How+the+Mind+Works+Steven+Pinker"
    },
    {
        title: "《情绪急救》",
        author: "盖伊·温奇",
        desc: "针对日常心理伤害（拒绝、孤独、丧失、内疚、反刍、失败、自卑）提供科学的'急救'方案。",
        reason: "就像家里备着创可贴一样，这本书教你给心理伤口做即时处理，防止小情绪发展成大问题。",
        category: "认知行为",
        link: "https://weread.qq.com/web/search?key=情绪急救"
    },
    {
        title: "《拖延心理学》",
        author: "简·博克、莱诺拉·袁",
        desc: "两位拖延研究权威深入分析了拖延的心理根源，并提供了循序渐进的克服策略。",
        reason: "期末论文、考研复习总是拖延到最后一刻？这本书从心理机制层面给你真正的解决方案。",
        category: "认知行为",
        link: "https://www.jiumodiary.com/search?q=拖延心理学+博克"
    },
    {
        title: "《认知疗法：基础与应用》",
        author: "朱迪丝·贝克",
        desc: "认知行为疗法（CBT）创始人Aaron Beck之女所著的权威教材，系统讲解CBT的核心技术与实操流程。",
        reason: "如果你对心理咨询感兴趣或想深度学习CBT，这是全球心理系通用的必读教材。",
        category: "认知行为",
        link: "https://www.jiumodiary.com/search?q=认知疗法基础与应用+Beck"
    },

    // ═══════════ 免费资源 ═══════════
    {
        title: "PsyChinaXiv (心理学开放获取数据库)",
        author: "中国科学院心理研究所",
        desc: "心理学预印本平台，国内完全免费获取前沿的心理学中文学术成果。",
        reason: "无需校园网，随时随地掌握国内顶尖心理学科研动态。",
        category: "免费资源",
        link: "http://www.psychinaxiv.org/"
    },
    {
        title: "DOAJ (开放获取期刊目录)",
        author: "Directory of Open Access Journals",
        desc: "提供高质量的开放获取同行评审期刊，支持全学科的免费全文下载。",
        reason: "国内网络可直连，是查找外文心理学文献的绝佳宝库。",
        category: "免费资源",
        link: "https://doaj.org/"
    },
    {
        title: "国家哲学社会科学文献中心",
        author: "NCPSSD",
        desc: "手机号免费注册即可在线阅读和下载国内海量的核心期刊社科文献。",
        reason: "打破知网壁垒，免费查阅大量心理学核心期刊论文。",
        category: "免费资源",
        link: "https://www.ncpssd.org/"
    },
    {
        title: "心理学进展 (Advances in Psychology)",
        author: "汉斯出版社",
        desc: "开源中文期刊，所有发布的心理学学术文章均可免费阅读和下载。",
        reason: "本科生寻找毕业论文灵感、了解研究方法的友好平台。",
        category: "免费资源",
        link: "https://www.hanspub.org/journal/ap"
    },

    // ═══════════ 公开课 ═══════════
    {
        title: "《心理学与生活》公开课",
        author: "南京大学 - 桑志芹教授团队",
        desc: "中国大学MOOC课程。课程内容贴近日常，全面覆盖心理学基础。",
        reason: "非常适合非心理学专业的大学生作为第一门系统入门课。",
        category: "公开课",
        link: "https://www.icourse163.org/search.htm?search=心理学与生活"
    },
    {
        title: "《幸福课 (积极心理学)》",
        author: "哈佛大学 - Tal Ben-Shahar",
        desc: "哈佛大学史上最受欢迎的课程之一，不讲深奥理论，专攻日常幸福感。",
        reason: "在内卷和压力中，教你如何通过科学的方法提升感受快乐的能力。",
        category: "公开课",
        link: "https://search.bilibili.com/all?keyword=哈佛大学幸福课"
    },
    {
        title: "《普通心理学》公开课",
        author: "北京大学",
        desc: "偏向学术与硬核基础。带你深入了解大脑机制、感知觉原理。",
        reason: "如果你对心理学有较深厚的兴趣，想建立扎实的学科素养，这门课是最佳选择。",
        category: "公开课",
        link: "https://www.icourse163.org/search.htm?search=普通心理学"
    },
    {
        title: "《异常心理学 / 变态心理学》",
        author: "北京大学 - 钱铭怡教授",
        desc: "系统讲解抑郁、焦虑、人格障碍等异常心理现象的机制与干预。",
        reason: "科学认识心理异常，消除偏见，建立起客观包容的临床认知。",
        category: "公开课",
        link: "https://search.bilibili.com/all?keyword=北京大学变态心理学钱铭怡"
    }
];
