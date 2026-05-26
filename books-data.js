// 书洞资源数据 - 131本书籍/资源/课程
// 所有链接均指向免费阅读或下载平台（鸠摩搜书、微信读书、ManyBooks、Internet Archive、Project Gutenberg等）

const libraryData = [
    // ═══════════════════════════════════════════════
    // 经典入门 — 心理学根基与学科全景
    // ═══════════════════════════════════════════════
    {
        title: "《社会性动物》",
        author: "埃利奥特·阿伦森",
        desc: "被誉为《社会心理学圣经》的经典杰作，深入浅出地剖析了人类行为背后的社会根源。",
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
    {
        title: "《精神分析引论》",
        author: "西格蒙德·弗洛伊德",
        desc: "弗洛伊德在维也纳大学的演讲合集，通俗系统地介绍了精神分析的基本理论与方法。",
        reason: "比《梦的解析》更易读，是了解精神分析最友好的入口，涵盖失误行为、梦、神经症三大板块。",
        category: "经典入门",
        link: "https://www.jiumodiary.com/search?q=精神分析引论+弗洛伊德"
    },
    {
        title: "《自我与本我》",
        author: "西格蒙德·弗洛伊德",
        desc: "提出了本我、自我、超我的人格结构理论，是精神分析后期最重要的理论著作之一。",
        reason: "理解弗洛伊德人格理论的核心文本，'三个我'的概念至今仍是心理学的日常用语。",
        category: "经典入门",
        link: "https://www.jiumodiary.com/search?q=自我与本我+弗洛伊德"
    },
    {
        title: "《自卑与生活》",
        author: "阿尔弗雷德·阿德勒",
        desc: "阿德勒个体心理学的核心著作，系统阐述了自卑感如何驱动人类行为与人格发展。",
        reason: "与《自卑与超越》互为补充，更深入探讨自卑感在日常生活中的具体表现与转化路径。",
        category: "经典入门",
        link: "https://www.jiumodiary.com/search?q=自卑与生活+阿德勒"
    },
    {
        title: "《理解人性》",
        author: "阿尔弗雷德·阿德勒",
        desc: "阿德勒面向大众读者的心理学著作，探讨了性格形成、社会情感与人生风格的本质。",
        reason: "阿德勒最通俗的作品之一，帮你从个体心理学视角理解自己和他人行为背后的动机。",
        category: "经典入门",
        link: "https://www.jiumodiary.com/search?q=理解人性+阿德勒"
    },
    {
        title: "《逃避自由》",
        author: "埃里希·弗洛姆",
        desc: "精神分析与社会学交叉的杰作，探讨现代人为何在获得自由后又主动逃避自由的心理机制。",
        reason: "深刻解释了权威主义人格的心理根源，对理解当下社会从众、盲从现象极具启发性。",
        category: "经典入门",
        link: "https://www.jiumodiary.com/search?q=逃避自由+弗洛姆"
    },
    {
        title: "《爱的艺术》",
        author: "埃里希·弗洛姆",
        desc: "论证爱不是一种偶然的情感，而是一门需要知识和努力的艺术，分析了各种爱的类型与异化。",
        reason: "颠覆你对'爱'的常识认知——爱不是被爱的问题，而是有没有爱的能力的问题。",
        category: "经典入门",
        link: "https://weread.qq.com/web/search?key=爱的艺术+弗洛姆"
    },
    {
        title: "《健全的社会》",
        author: "埃里希·弗洛姆",
        desc: "诊断现代社会对人的心理健康的损害，探讨一个真正有利于人的精神健康的社会应该是什么样的。",
        reason: "帮你从社会层面理解心理问题——有些'病'不是个人的，而是时代的。",
        category: "经典入门",
        link: "https://www.jiumodiary.com/search?q=健全的社会+弗洛姆"
    },
    {
        title: "《人的自我寻求》",
        author: "罗洛·梅",
        desc: "存在心理学经典，探讨现代人在焦虑、空虚和孤独中重新找到自我与人生意义的可能路径。",
        reason: "被誉为'美国存在心理学中最深刻的一本书'，特别适合感到迷茫和空虚的大学生阅读。",
        category: "经典入门",
        link: "https://www.jiumodiary.com/search?q=人的自我寻求+罗洛梅"
    },
    {
        title: "《爱与意志》",
        author: "罗洛·梅",
        desc: "探究爱与意志在当代社会中被分离的现象，呼唤将情感与责任重新结合的存在主义心理学。",
        reason: "帮你理解为什么现代人'爱无能'——爱需要意志，意志需要爱的滋养。",
        category: "经典入门",
        link: "https://www.jiumodiary.com/search?q=爱与意志+罗洛梅"
    },
    {
        title: "《个人形成论：我的心理治疗观》",
        author: "卡尔·罗杰斯",
        desc: "人本主义心理学创始人罗杰斯的代表作，阐述了以'无条件积极关注'为核心的当事人中心疗法。",
        reason: "倾听他人心事时最重要的一本书——教你如何真正地共情，而非急于给出建议。",
        category: "经典入门",
        link: "https://www.jiumodiary.com/search?q=个人形成论+罗杰斯"
    },
    {
        title: "《论人的成长》",
        author: "卡尔·罗杰斯",
        desc: "罗杰斯晚年思想结晶，将心理治疗的洞见扩展到教育、家庭、社会乃至世界和平。",
        reason: "超越心理咨询的技术层面，从人本主义视角重新思考'什么是好好长大'。",
        category: "经典入门",
        link: "https://www.jiumodiary.com/search?q=论人的成长+罗杰斯"
    },
    {
        title: "《动机与人格》",
        author: "亚伯拉罕·马斯洛",
        desc: "提出了著名的需求层次理论与自我实现概念，是人本主义心理学的奠基之作。",
        reason: "理解人类动机的经典框架，帮你思考在满足基本需求之后，人生的更高追求是什么。",
        category: "经典入门",
        link: "https://www.jiumodiary.com/search?q=动机与人格+马斯洛"
    },
    {
        title: "《存在心理学探索》",
        author: "亚伯拉罕·马斯洛",
        desc: "马斯洛对自我实现者的人格特征、高峰体验及存在价值的深入探索。",
        reason: "了解'健康人格'是什么样的，帮你找到自我成长的参照坐标。",
        category: "经典入门",
        link: "https://www.jiumodiary.com/search?q=存在心理学探索+马斯洛"
    },
    {
        title: "《心理类型》",
        author: "卡尔·荣格",
        desc: "荣格提出内倾/外倾及四种心理功能（思维、情感、感觉、直觉）的分类学著作，MBTI的理论源头。",
        reason: "做完MBTI测试后必读——了解性格类型理论的思想源头，而非停留在四个字母上。",
        category: "经典入门",
        link: "https://www.jiumodiary.com/search?q=心理类型+荣格"
    },
    {
        title: "《人及其象征》",
        author: "卡尔·荣格等",
        desc: "荣格专门为普通读者撰写的最后一本著作，用大量图示解释了原型、集体无意识与梦的象征。",
        reason: "荣格思想最通俗的入门书，图文并茂地展示了潜意识如何通过象征与我们对话。",
        category: "经典入门",
        link: "https://www.jiumodiary.com/search?q=人及其象征+荣格"
    },
    {
        title: "《发展心理学：人的毕生发展》",
        author: "罗伯特·费尔德曼",
        desc: "全面覆盖从孕前期到生命终点的全人发展历程，是发展心理学领域的权威教材。",
        reason: "帮你理解人生每个阶段的心理任务与危机，既理解自己，也理解父母与未来的孩子。",
        category: "经典入门",
        link: "https://www.jiumodiary.com/search?q=发展心理学+人的毕生发展+费尔德曼"
    },
    {
        title: "《改变心理学的40项研究》",
        author: "罗杰·霍克",
        desc: "精选中外心理学史上最具影响力的40个经典实验，用故事化的语言还原研究过程与意义。",
        reason: "比任何教材都更生动地展示'心理学如何知道它知道的'，适合初学者培养科学思维。",
        category: "经典入门",
        link: "https://www.jiumodiary.com/search?q=改变心理学的40项研究+霍克"
    },
    {
        title: "《心理学史》",
        author: "戴维·霍瑟萨尔",
        desc: "以人物传记的方式叙述心理学从古希腊到认知革命的发展历程，兼具学术性与可读性。",
        reason: "了解一门学科最好的方式是了解它的历史——这本书让你看到心理学各流派如何对话与交锋。",
        category: "经典入门",
        link: "https://www.jiumodiary.com/search?q=心理学史+霍瑟萨尔"
    },
    {
        title: "《社会心理学》",
        author: "戴维·迈尔斯",
        desc: "全球最畅销的社会心理学教材，以生动的案例和严谨的研究覆盖了社会认知、从众、偏见、冲突等主题。",
        reason: "被全球数百所大学采用，文字优美如散文，读起来不像教材而像一本关于人性的故事书。",
        category: "经典入门",
        link: "https://www.jiumodiary.com/search?q=社会心理学+戴维迈尔斯"
    },
    {
        title: "《心理学导论》",
        author: "菲利普·津巴多",
        desc: "斯坦福监狱实验主持者津巴多编写的经典入门教材，涵盖感知、记忆、思维、情绪、人格等全部领域。",
        reason: "津巴多善于用生动案例讲解复杂理论，是许多心理学专业学生的第一本教材。",
        category: "经典入门",
        link: "https://www.jiumodiary.com/search?q=心理学导论+津巴多"
    },

    // ═══════════════════════════════════════════════
    // 自我成长 — 情绪疗愈、人格完善与幸福之道
    // ═══════════════════════════════════════════════
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
    {
        title: "《当下的力量》",
        author: "埃克哈特·托利",
        desc: "引导读者从思维的强迫性认同中解脱出来，全然地活在当下，找到内心的平和与宁静。",
        reason: "当你被焦虑的思绪（过去）和担忧（未来）吞噬时，这本书是一剂强效的'回到现在'的解药。",
        category: "自我成长",
        link: "https://weread.qq.com/web/search?key=当下的力量"
    },
    {
        title: "《人性的弱点》",
        author: "戴尔·卡耐基",
        desc: "人际关系的经典之作，提供了赢得友谊、影响他人和建立良好人际关系的实用原则。",
        reason: "虽然书名有争议，但书中关于真诚关心他人、记住名字、做好的倾听者的建议至今有效。",
        category: "自我成长",
        link: "https://www.jiumodiary.com/search?q=人性的弱点+卡耐基"
    },
    {
        title: "《人性的优点》",
        author: "戴尔·卡耐基",
        desc: "卡耐基关于克服忧虑的经典著作，提供了大量实用的应对焦虑和压力的具体方法。",
        reason: "期末考试前焦虑？求职季睡不着？书中的'隔离忧虑'方法今天依然有效。",
        category: "自我成长",
        link: "https://www.jiumodiary.com/search?q=人性的优点+卡耐基"
    },
    {
        title: "《高效能人士的七个习惯》",
        author: "史蒂芬·柯维",
        desc: "以原则为中心的自我管理经典，从个人领域的成功到公众领域的成功再到持续更新。",
        reason: "不只是效率工具，而是一套完整的心智操作系统——从'依赖'到'独立'再到'互赖'。",
        category: "自我成长",
        link: "https://weread.qq.com/web/search?key=高效能人士的七个习惯"
    },
    {
        title: "《自控力》",
        author: "凯利·麦格尼格尔",
        desc: "斯坦福大学最受欢迎的心理学课程精华，基于神经科学解读意志力的运作机制与提升方法。",
        reason: "想戒手机却总是失败？这本书告诉你意志力像肌肉一样可以锻炼，并教你具体的训练方法。",
        category: "自我成长",
        link: "https://weread.qq.com/web/search?key=自控力+麦格尼格尔"
    },
    {
        title: "《意志力》",
        author: "罗伊·鲍迈斯特",
        desc: "意志力科学研究的权威著作，揭示了自我控制如何像肌肉一样消耗葡萄糖并可以通过训练增强。",
        reason: "解释了为什么晚上更容易放纵——意志力是一种有限的生理资源，需要策略性地管理。",
        category: "自我成长",
        link: "https://www.jiumodiary.com/search?q=意志力+鲍迈斯特"
    },
    {
        title: "《坚毅》",
        author: "安吉拉·达克沃斯",
        desc: "基于大量实证研究证明：成功的真正秘诀不是天赋，而是激情与坚持的结合——坚毅。",
        reason: "当你觉得自己'不够聪明'而想放弃时，这本书提醒你持续投入比天赋更重要。",
        category: "自我成长",
        link: "https://weread.qq.com/web/search?key=坚毅+达克沃斯"
    },
    {
        title: "《终身成长》",
        author: "卡罗尔·德韦克",
        desc: "揭示固定型思维与成长型思维的差异，证明对能力的信念如何深刻影响学习、事业与人生。",
        reason: "改变你对'聪明'和'天赋'的看法——被夸'聪明'的孩子反而害怕挑战，被夸'努力'的孩子走得更远。",
        category: "自我成长",
        link: "https://weread.qq.com/web/search?key=终身成长+德韦克"
    },
    {
        title: "《内向者的优势》",
        author: "马蒂·奥尔森·莱尼",
        desc: "为内向者正名的经典，论证内向不是缺陷而是一种独特的力量，并提供内向者在社交、职场中的实用策略。",
        reason: "如果你总被说'太安静''不合群'，这本书帮你重新认识自己的内向特质并发挥其优势。",
        category: "自我成长",
        link: "https://www.jiumodiary.com/search?q=内向者的优势+莱尼"
    },
    {
        title: "《安静：内向者的力量》",
        author: "苏珊·凯恩",
        desc: "从文化史、神经科学到职场实践，全面论证内向者在喧嚣世界中的独特价值与力量。",
        reason: "TED演讲观看超3000万次，帮你理解为什么独处和深度思考是创造力的关键来源。",
        category: "自我成长",
        link: "https://weread.qq.com/web/search?key=安静+内向者的力量"
    },
    {
        title: "《脆弱的力量》",
        author: "布琳·布朗",
        desc: "基于数十年质性研究的TED现象级著作，证明脆弱、勇气、共情和归属感是完整人生的核心。",
        reason: "不敢向他人展示真实的自己？这本书告诉你，脆弱不是软弱，而是勇气的起点。",
        category: "自我成长",
        link: "https://weread.qq.com/web/search?key=脆弱的力量+布朗"
    },
    {
        title: "《幸福的方法》",
        author: "泰勒·本-沙哈尔",
        desc: "哈佛大学幸福课教授将学术研究转化为日常幸福的实践指南，提出了四种人生模式。",
        reason: "纠正'成功=幸福'的幻觉——太多人在到达目标后才发现那里没有幸福，幸福在过程中。",
        category: "自我成长",
        link: "https://weread.qq.com/web/search?key=幸福的方法+泰勒"
    },
    {
        title: "《真实的幸福》",
        author: "马丁·塞利格曼",
        desc: "积极心理学之父塞利格曼的代表作，用科学方法定义和测量幸福，并提供提升幸福感的实操练习。",
        reason: "超越'开心就好'的肤浅鸡汤，教你用科学方法识别并发挥自己的优势美德。",
        category: "自我成长",
        link: "https://www.jiumodiary.com/search?q=真实的幸福+塞利格曼"
    },
    {
        title: "《持续的幸福》",
        author: "马丁·塞利格曼",
        desc: "从'真实的幸福'升级到'持续的幸福'，提出PERMA模型（积极情绪、投入、关系、意义、成就）。",
        reason: "幸福的五个支柱缺一不可——帮你诊断当前哪根柱子需要加强。",
        category: "自我成长",
        link: "https://www.jiumodiary.com/search?q=持续的幸福+塞利格曼"
    },
    {
        title: "《象与骑象人》",
        author: "乔纳森·海特",
        desc: "以'情绪是大象，理性是骑象人'的精妙比喻，融合古代智慧与现代心理学研究探讨幸福的本质。",
        reason: "这本书最精彩的洞见：骑象人不是大象的主人，而是大象的仆人——情绪驱动了大多数决策。",
        category: "自我成长",
        link: "https://weread.qq.com/web/search?key=象与骑象人"
    },
    {
        title: "《不再害羞》",
        author: "菲利普·津巴多",
        desc: "害羞研究权威津巴多全面分析社交焦虑的成因，并提供系统的认知行为改善方案。",
        reason: "课堂不敢发言、社交场合手足无措？这本书提供了从认知到行为的完整脱敏训练。",
        category: "自我成长",
        link: "https://www.jiumodiary.com/search?q=不再害羞+津巴多"
    },
    {
        title: "《高敏感是种天赋》",
        author: "伊尔斯·桑德",
        desc: "系统介绍高敏感人群（HSP）的特征、优势与自我照顾策略，帮助高敏感者找到与世界相处的方式。",
        reason: "如果你容易'被情绪淹没'、对细节异常敏感，这不是病，而是一种被科学验证的人格特质。",
        category: "自我成长",
        link: "https://weread.qq.com/web/search?key=高敏感是种天赋"
    },
    {
        title: "《共情的力量》",
        author: "亚瑟·乔拉米卡利",
        desc: "深入剖析共情的本质、种类与边界，教你如何既深入理解他人又不被情绪淹没。",
        reason: "对于经常倾听他人心事的'树洞型'人格尤其重要——学会共情，更要学会保护自己。",
        category: "自我成长",
        link: "https://weread.qq.com/web/search?key=共情的力量"
    },
    {
        title: "《身体从未忘记》",
        author: "巴塞尔·范德考克",
        desc: "创伤研究权威著作，用神经科学解释了创伤如何在身体中留下印记，以及如何真正疗愈。",
        reason: "如果你或身边人经历过创伤，这本书提供了理解创伤的生理基础与有效的疗愈路径。",
        category: "自我成长",
        link: "https://weread.qq.com/web/search?key=身体从未忘记"
    },
    {
        title: "《自我关怀的力量》",
        author: "克里斯汀·内夫",
        desc: "自我关怀（Self-Compassion）研究的开创者系统介绍如何像对待最好的朋友一样善待自己。",
        reason: "总是对自己说'我不够好'？这本书教你用自我关怀取代自我批评，且不影响进取动力。",
        category: "自我成长",
        link: "https://weread.qq.com/web/search?key=自我关怀的力量"
    },
    {
        title: "《内向思考》",
        author: "雷蒙德·卡特",
        desc: "探讨独处对创造力、自我认知和深度思考的重要性，为内向者提供发挥优势的实用策略。",
        reason: "在信息噪音无处不在的时代，学会与自己独处是一种稀缺而珍贵的能力。",
        category: "自我成长",
        link: "https://www.jiumodiary.com/search?q=内向思考+卡特"
    },
    {
        title: "《反脆弱》",
        author: "纳西姆·塔勒布",
        desc: "提出'反脆弱'概念——有些事物不仅能承受冲击，还能在混乱和不确定性中变得更强。",
        reason: "不只是心理学，更是一种生活哲学：如何在不确定的世界中不止生存，而且获益。",
        category: "自我成长",
        link: "https://weread.qq.com/web/search?key=反脆弱+塔勒布"
    },
    {
        title: "《心静的力量》",
        author: "拿破仑·希尔",
        desc: "成功学经典《思考致富》作者的晚年力作，聚焦于内心宁静对身心健康和成就的影响。",
        reason: "在一个喧嚣的时代，内心的宁静是一种被遗忘但极为重要的能力。",
        category: "自我成长",
        link: "https://www.jiumodiary.com/search?q=心静的力量+希尔"
    },
    {
        title: "《超越自卑》",
        author: "阿尔弗雷德·阿德勒",
        desc: "阿德勒对自卑感、优越感和社会兴趣三者关系的经典论述，提供了超越自卑走向合作的人生方向。",
        reason: "阿德勒学派最核心的洞见：所有心理问题本质上都是人际关系问题。",
        category: "自我成长",
        link: "https://www.jiumodiary.com/search?q=超越自卑+阿德勒"
    },

    // ═══════════════════════════════════════════════
    // 认知行为 — 思维模式、习惯养成与行为改变
    // ═══════════════════════════════════════════════
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
        desc: "CBT创始人Aaron Beck之女所著的权威教材，系统讲解认知行为疗法的核心技术与实操流程。",
        reason: "如果你对心理咨询感兴趣或想深度学习CBT，这是全球心理系通用的必读教材。",
        category: "认知行为",
        link: "https://www.jiumodiary.com/search?q=认知疗法基础与应用+Beck"
    },
    {
        title: "《认知天性》",
        author: "彼得·布朗等",
        desc: "基于认知科学的学习方法指南，揭示了间隔练习、穿插练习、检索练习等高效学习的科学原理。",
        reason: "颠覆'重复阅读=有效学习'的幻觉——检索比复习更有效，困难比轻松学得更牢。",
        category: "认知行为",
        link: "https://weread.qq.com/web/search?key=认知天性"
    },
    {
        title: "《刻意练习》",
        author: "安德斯·艾利克森",
        desc: "推翻'天才神话'的科学著作，证明顶尖能力并非天赋而是正确方法下的长期刻意练习的结果。",
        reason: "想在任何领域达到优秀？这本书告诉你'一万小时定律'的真相和正确的练习方法。",
        category: "认知行为",
        link: "https://weread.qq.com/web/search?key=刻意练习+艾利克森"
    },
    {
        title: "《专注的快乐》",
        author: "米哈里·契克森米哈伊",
        desc: "心流理论的实践手册，教你如何在日常工作、学习和人际关系中创造更多心流体验。",
        reason: "《心流》的姊妹篇，更轻量、更实操，是一本随手可翻的心流刻意练习指南。",
        category: "认知行为",
        link: "https://www.jiumodiary.com/search?q=专注的快乐+契克森米哈伊"
    },
    {
        title: "《创造力：心流与创新心理学》",
        author: "米哈里·契克森米哈伊",
        desc: "基于对近百位创造性天才的访谈，揭示了创造力的心理机制与产生心流的条件。",
        reason: "创造力不是少数人的天赋——掌握了心流产生的方法，每个人都可以更有创意。",
        category: "认知行为",
        link: "https://www.jiumodiary.com/search?q=创造力+心流+契克森米哈伊"
    },
    {
        title: "《先发影响力》",
        author: "罗伯特·西奥迪尼",
        desc: "《影响力》作者的新作，揭示在传递信息之前通过'预说服'创造最佳时机的心理学原理。",
        reason: "比《影响力》更前一步——在你说服之前，在对方开口之前，影响力就已经开始运作。",
        category: "认知行为",
        link: "https://weread.qq.com/web/search?key=先发影响力"
    },
    {
        title: "《怪诞行为学》",
        author: "丹·艾瑞里",
        desc: "用妙趣横生的实验揭示人类决策中的非理性，证明我们远不如自己以为的那样理性。",
        reason: "双十一为什么忍不住买买买？这本书用行为经济学解释了你明知道不该却还是做了的种种行为。",
        category: "认知行为",
        link: "https://weread.qq.com/web/search?key=怪诞行为学"
    },
    {
        title: "《助推》",
        author: "理查德·塞勒",
        desc: "诺贝尔经济学奖得主提出'自由意志的家长主义'，通过微小的选择架构改变引导人们做出更好的决策。",
        reason: "改变自己不一定靠意志力——改变环境中的一个微小'默认选项'可能比下决心更有效。",
        category: "认知行为",
        link: "https://weread.qq.com/web/search?key=助推+塞勒"
    },
    {
        title: "《决策与判断》",
        author: "斯科特·普劳斯",
        desc: "系统全面地介绍了决策心理学的研究成果，涵盖不确定性下的判断、风险感知、群体决策等主题。",
        reason: "在面临考研、就业、分手等重大决策时，帮你识别思维中的系统性偏差，做出更明智的选择。",
        category: "认知行为",
        link: "https://www.jiumodiary.com/search?q=决策与判断+普劳斯"
    },
    {
        title: "《学习之道》",
        author: "芭芭拉·奥克利",
        desc: "从数学学渣到工程学教授的亲身经历，结合脑科学总结出一套适用于任何学科的高效学习方法。",
        reason: "拖延癌的救星——'番茄工作法'的神经科学解释，以及如何利用发散模式和专注模式交替学习。",
        category: "认知行为",
        link: "https://weread.qq.com/web/search?key=学习之道+奥克利"
    },
    {
        title: "《如何阅读一本书》",
        author: "莫提默·艾德勒",
        desc: "阅读方法的经典之作，将阅读分为基础、检视、分析、主题四个层次并详细指导。",
        reason: "大学四年读了几百本书却感觉什么都没记住？这本书教你从'被动接收'升级到'主动对话'。",
        category: "认知行为",
        link: "https://www.jiumodiary.com/search?q=如何阅读一本书+艾德勒"
    },
    {
        title: "《重塑大脑，重塑人生》",
        author: "诺曼·道伊奇",
        desc: "用大量真实案例介绍了神经可塑性（Neuroplasticity）的革命性发现，证明大脑终身可以改变。",
        reason: "打破'成年后性格定型'的宿命论——你的大脑比你想象的更可塑，改变随时可能发生。",
        category: "认知行为",
        link: "https://www.jiumodiary.com/search?q=重塑大脑重塑人生+道伊奇"
    },
    {
        title: "《大脑的情绪生活》",
        author: "理查德·戴维森",
        desc: "情感神经科学先驱戴维森用30年脑科学研究证明：情绪风格可以像健身一样通过训练改变。",
        reason: "你不是'天生焦虑'或'天生悲观'——六种情绪维度都可以通过刻意训练重新校准。",
        category: "认知行为",
        link: "https://www.jiumodiary.com/search?q=大脑的情绪生活+戴维森"
    },
    {
        title: "《注意力曲线》",
        author: "露西·乔·帕拉迪诺",
        desc: "提出了注意力的'倒U型曲线'理论，教你如何将自己调整到注意力最佳区域以应对数字干扰。",
        reason: "手机成瘾、无法专注阅读超过5分钟？这本书帮你理解注意力的生理机制并找回深度专注。",
        category: "认知行为",
        link: "https://www.jiumodiary.com/search?q=注意力曲线+帕拉迪诺"
    },
    {
        title: "《专念：积极心理学的力量》",
        author: "埃伦·兰格",
        desc: "哈佛大学心理学教授提出的'专念'(Mindfulness)概念在西方的最早研究，强调觉察当下的力量。",
        reason: "比'正念'更早、更学术化的研究，被《纽约时报》誉为'改变无数人生活的书'。",
        category: "认知行为",
        link: "https://www.jiumodiary.com/search?q=专念+积极心理学+兰格"
    },
    {
        title: "《贪婪的多巴胺》",
        author: "丹尼尔·利伯曼",
        desc: "用生动的科普语言揭示了多巴胺如何驱动人类的欲望、爱情、创造力和疯狂的深层机制。",
        reason: "解释了为什么刷短视频停不下来——多巴胺是关于'想要'而非'喜欢'的分子。",
        category: "认知行为",
        link: "https://weread.qq.com/web/search?key=贪婪的多巴胺"
    },
    {
        title: "《为什么学生不喜欢上学》",
        author: "丹尼尔·威林厄姆",
        desc: "认知科学家用九条认知原理解释了学习的本质，回答'为什么有些课让人昏昏欲睡'。",
        reason: "如果你是一名学生或未来的教师，这本书让你理解大脑如何学习，从而学得更快教得更好。",
        category: "认知行为",
        link: "https://www.jiumodiary.com/search?q=为什么学生不喜欢上学+威林厄姆"
    },
    {
        title: "《瞬变》",
        author: "奇普·希思、丹·希思",
        desc: "用骑象人与大象的比喻，从理性、情感和环境三个层面提供了实现个人与组织改变的实用框架。",
        reason: "为什么改变这么难？因为理性知道方向但情感不想动。这本书给你指挥大象的具体方法。",
        category: "认知行为",
        link: "https://weread.qq.com/web/search?key=瞬变+希思"
    },
    {
        title: "《习惯的力量》",
        author: "查尔斯·杜希格",
        desc: "深入习惯回路（暗示、惯常行为、奖赏）的科学原理，揭示习惯如何形成以及如何改变。",
        reason: "想戒掉熬夜刷手机？关键不是消灭坏习惯，而是用新行为替换旧回路中的惯常行为。",
        category: "认知行为",
        link: "https://weread.qq.com/web/search?key=习惯的力量+杜希格"
    },
    {
        title: "《番茄工作法图解》",
        author: "斯达凡·诺特伯格",
        desc: "以图文并茂的方式详细介绍番茄工作法的原理、操作步骤与常见问题的解决方案。",
        reason: "最简单也最有效的专注力工具——25分钟专注+5分钟休息，帮你战胜拖延和分心。",
        category: "认知行为",
        link: "https://www.jiumodiary.com/search?q=番茄工作法图解"
    },

    // ═══════════════════════════════════════════════
    // 情绪与人际 — 情感管理、关系维护与社交智慧
    // ═══════════════════════════════════════════════
    {
        title: "《情商》",
        author: "丹尼尔·戈尔曼",
        desc: "提出情绪智力（EQ）概念的全景式著作，论证了情绪管理能力比智商更能预测人生的成功与幸福。",
        reason: "为什么有些学霸在社会上并不成功？EQ比IQ更能解释领导力、人际关系和人生满意度。",
        category: "自我成长",
        link: "https://weread.qq.com/web/search?key=情商+戈尔曼"
    },
    {
        title: "《情商2：影响你一生的社交商》",
        author: "丹尼尔·戈尔曼",
        desc: "聚焦于社交商（Social Intelligence），从神经科学角度揭示人际互动如何重塑我们的大脑。",
        reason: "人际关系的质量影响你的生理健康——孤独和被排斥会在大脑中产生类似物理疼痛的反应。",
        category: "自我成长",
        link: "https://weread.qq.com/web/search?key=情商2+社交商"
    },
    {
        title: "《愤怒之舞》",
        author: "哈里特·勒纳",
        desc: "女性心理学家以30余年临床经验指导读者将愤怒从破坏性力量转化为改善关系的有效工具。",
        reason: "愤怒不是问题，如何处理愤怒才是问题——这本书教你用愤怒推动改变而非制造伤害。",
        category: "自我成长",
        link: "https://www.jiumodiary.com/search?q=愤怒之舞+勒纳"
    },
    {
        title: "《依恋》",
        author: "约翰·鲍比",
        desc: "依恋理论奠基人之作，系统阐述了早期亲子关系如何塑造一个人一生的人际关系模式。",
        reason: "理解你为什么在恋爱中是焦虑型、回避型还是安全型——根源可以追溯到童年。",
        category: "经典入门",
        link: "https://www.jiumodiary.com/search?q=依恋+鲍比"
    },
    {
        title: "《依恋与成人关系》",
        author: "阿米尔·莱文",
        desc: "将依恋理论应用于成人恋爱关系的畅销著作，帮助识别自己和伴侣的依恋风格并改善关系。",
        reason: "恋爱总是陷入同样的困局？了解你的依恋风格（安全/焦虑/回避），打破重复的关系模式。",
        category: "自我成长",
        link: "https://weread.qq.com/web/search?key=依恋与成人关系"
    },
    {
        title: "《爱的五种语言》",
        author: "盖瑞·查普曼",
        desc: "提出表达和接收爱的五种方式（肯定的言词、精心的时刻、礼物、服务、肢体接触）。",
        reason: "你觉得已经付出很多，对方却感受不到？因为你们说的是不同的'爱的语言'。",
        category: "自我成长",
        link: "https://weread.qq.com/web/search?key=爱的五种语言"
    },
    {
        title: "《关系的重建》",
        author: "阿米尔·莱文",
        desc: "深入解析成人依恋的三种类型，并为每种类型提供建立和维系安全亲密关系的具体指南。",
        reason: "不仅仅是了解依恋类型，更重要的是提供了从焦虑/回避向安全型转变的实操方法。",
        category: "自我成长",
        link: "https://weread.qq.com/web/search?key=关系的重建+莱文"
    },
    {
        title: "《男人来自火星，女人来自金星》",
        author: "约翰·格雷",
        desc: "以通俗易懂的比喻解析两性沟通差异，帮助男女双方理解彼此的情感需求和表达方式。",
        reason: "虽然性别二元论有争议，但书中对沟通风格差异的洞察至今仍能解释很多情侣间的误会。",
        category: "自我成长",
        link: "https://weread.qq.com/web/search?key=男人来自火星女人来自金星"
    },
    {
        title: "《冷暴力》",
        author: "玛丽-弗朗斯·伊里戈扬",
        desc: "首次系统揭示精神虐待（Gaslighting、冷暴力）的心理机制与应对策略的里程碑著作。",
        reason: "识别亲密关系和职场中的隐形暴力——冷暴力看似不流血，但对心理的伤害深且持久。",
        category: "自我成长",
        link: "https://weread.qq.com/web/search?key=冷暴力+伊里戈扬"
    },
    {
        title: "《情感勒索》",
        author: "苏珊·福沃德",
        desc: "揭示了以爱之名的操控行为（如果你爱我，你就应该……），并提供打破勒索循环的系统方法。",
        reason: "父母说'我为你付出这么多'、恋人说'如果你爱我你就……'——学会识别并有效应对情感勒索。",
        category: "自我成长",
        link: "https://weread.qq.com/web/search?key=情感勒索+福沃德"
    },

    // ═══════════════════════════════════════════════
    // 心理治疗与咨询 — 疗愈之道与临床智慧
    // ═══════════════════════════════════════════════
    {
        title: "《存在主义心理治疗》",
        author: "欧文·亚隆",
        desc: "心理治疗大师亚隆系统论述了死亡、自由、孤独、无意义四大终极关怀及其在治疗中的应用。",
        reason: "亚隆的巅峰之作——如果你想深入了解心理咨询，这是从存在主义视角理解人类困境的最佳读物。",
        category: "认知行为",
        link: "https://www.jiumodiary.com/search?q=存在主义心理治疗+亚隆"
    },
    {
        title: "《给心理治疗师的礼物》",
        author: "欧文·亚隆",
        desc: "亚隆从数十年临床经验中提炼出85条给治疗师的建议，充满人性温暖与实践智慧。",
        reason: "即使不做心理咨询师，书中关于如何真诚地与他人建立深层关系的建议也受益终身。",
        category: "认知行为",
        link: "https://www.jiumodiary.com/search?q=给心理治疗师的礼物+亚隆"
    },
    {
        title: "《直视骄阳：征服死亡恐惧》",
        author: "欧文·亚隆",
        desc: "亚隆专门探讨死亡焦虑及其对人生影响的深刻著作，提供了面对死亡恐惧的心理学路径。",
        reason: "死亡不是用来恐惧的，而是用来唤醒的——意识到生命的有限反而让人更充分地活着。",
        category: "自我成长",
        link: "https://www.jiumodiary.com/search?q=直视骄阳+亚隆"
    },
    {
        title: "《当尼采哭泣》",
        author: "欧文·亚隆",
        desc: "心理治疗与哲学对话的巧妙融合，虚构了尼采与布雷尔医生之间的心理治疗故事。",
        reason: "以小说形式展示了心理咨询的本质——两个灵魂在对话中相互疗愈。",
        category: "自我成长",
        link: "https://weread.qq.com/web/search?key=当尼采哭泣"
    },
    {
        title: "《蛤蟆先生去看心理医生》",
        author: "罗伯特·戴博德",
        desc: "以《柳林风声》角色为主角的心理治疗寓言，用通俗的故事展示了心理咨询的全过程。",
        reason: "如果你对心理咨询好奇但又不敢尝试，这本书是最好的入门——温暖、治愈、毫无说教感。",
        category: "自我成长",
        link: "https://weread.qq.com/web/search?key=蛤蟆先生去看心理医生"
    },
    {
        title: "《登天的感觉》",
        author: "岳晓东",
        desc: "中国第一位哈佛心理学博士用十个真实案例展示心理咨询如何帮助人突破心理困境。",
        reason: "中国本土心理咨询经典，语言亲切，案例贴近中国大学生和留学生群体的真实困境。",
        category: "认知行为",
        link: "https://www.jiumodiary.com/search?q=登天的感觉+岳晓东"
    },
    {
        title: "《心理治疗中的依恋》",
        author: "戴维·瓦林",
        desc: "将依恋理论与临床心理治疗结合，展示了治疗关系本身如何成为修复早期依恋创伤的工具。",
        reason: "对于想深入理解'治疗关系就是疗愈'这一理念的读者，这是必读之作。",
        category: "认知行为",
        link: "https://www.jiumodiary.com/search?q=心理治疗中的依恋+瓦林"
    },
    {
        title: "《正念：此刻是一枝花》",
        author: "乔·卡巴金",
        desc: "正念减压疗法（MBSR）创始人卡巴金以诗意的语言引导读者在日常生活中修习正念。",
        reason: "正念不是玄学，是经过科学验证的减压技术——这本书是最温和的正念入门。",
        category: "认知行为",
        link: "https://weread.qq.com/web/search?key=正念+此刻是一枝花"
    },
    {
        title: "《辩证行为疗法》",
        author: "马修·麦凯",
        desc: "将DBT的核心技术（正念、痛苦耐受、情绪调节、人际效能）转化为可自学的工作手册。",
        reason: "如果你有强烈的情绪波动难以自控，DBT是专门为情绪失调设计的科学方法。",
        category: "认知行为",
        link: "https://www.jiumodiary.com/search?q=辩证行为疗法+麦凯"
    },
    {
        title: "《ACT就这么简单》",
        author: "罗斯·哈里斯",
        desc: "接纳承诺疗法（ACT）的通俗入门，教你停止与负面想法抗争，追求有价值的人生方向。",
        reason: "不必消灭焦虑和负面想法才能过好人生——ACT教你带着不适感依然朝向价值方向前行。",
        category: "认知行为",
        link: "https://www.jiumodiary.com/search?q=ACT就这么简单+哈里斯"
    },

    // ═══════════════════════════════════════════════
    // 进化与社会心理学 — 从演化视角理解人性
    // ═══════════════════════════════════════════════
    {
        title: "《裸猿》",
        author: "德斯蒙德·莫里斯",
        desc: "从动物行为学角度审视人类的经典之作，将人类视为一种裸露的猿类分析其行为模式。",
        reason: "许多'不可思议'的人类行为在动物世界里都有原型——这本书用进化视角解释人性。",
        category: "经典入门",
        link: "https://www.jiumodiary.com/search?q=裸猿+莫里斯"
    },
    {
        title: "《自私的基因》",
        author: "理查德·道金斯",
        desc: "从基因中心视角解释进化与行为的科普杰作，提出'我们是被基因制造的生存机器'。",
        reason: "利他行为如何进化而来？这本书用'基因自私性'解释了人类最困惑的合作与牺牲行为。",
        category: "经典入门",
        link: "https://www.jiumodiary.com/search?q=自私的基因+道金斯"
    },
    {
        title: "《进化心理学》",
        author: "戴维·巴斯",
        desc: "进化心理学领域的权威教材，用进化论统一解释了择偶、亲代投资、合作、攻击等人类行为。",
        reason: "为什么你喜欢的类型总是一样？进化心理学提供了一套关于人性底层代码的系统解释。",
        category: "经典入门",
        link: "https://www.jiumodiary.com/search?q=进化心理学+戴维巴斯"
    },
    {
        title: "《乌合之众》",
        author: "古斯塔夫·勒庞",
        desc: "群体心理学的开山之作，深刻剖析了个体在群体中丧失理性、被情绪感染的心理学机制。",
        reason: "网络暴力、饭圈文化、恐慌抢购——100多年前的洞察精准解释了今天的群体现象。",
        category: "经典入门",
        link: "https://www.jiumodiary.com/search?q=乌合之众+勒庞"
    },
    {
        title: "《路西法效应》",
        author: "菲利普·津巴多",
        desc: "斯坦福监狱实验的完整记录与反思，揭示了情境力量如何让普通人做出邪恶行为。",
        reason: "'好人'和'坏人'的界限比你想象的模糊——了解情境的力量就是保护自己不被它左右。",
        category: "经典入门",
        link: "https://www.jiumodiary.com/search?q=路西法效应+津巴多"
    },
    {
        title: "《对权威的服从》",
        author: "斯坦利·米尔格拉姆",
        desc: "米尔格拉姆电击实验的完整报告，揭示了普通人为何会服从权威指令对他人施加痛苦。",
        reason: "社会心理学最重要的实验之一——理解服从权威的心理机制，警惕日常生活中的'平庸之恶'。",
        category: "经典入门",
        link: "https://www.jiumodiary.com/search?q=对权威的服从+米尔格拉姆"
    },
    {
        title: "《狂热分子》",
        author: "埃里克·霍弗",
        desc: "探讨群众运动心理学的经典，分析什么样的人最容易成为狂热分子以及背后的心理需求。",
        reason: "理解为什么有些人会投入极端主义——往往不是因为信仰，而是因为对自我人生的失望。",
        category: "经典入门",
        link: "https://www.jiumodiary.com/search?q=狂热分子+霍弗"
    },
    {
        title: "《选择的悖论》",
        author: "巴里·施瓦茨",
        desc: "论证过多的选择非但不能带来自由和幸福，反而导致焦虑、后悔和决策瘫痪。",
        reason: "选择恐惧症的心理学解释——在这个'无限选择'的时代，学会'够好就收'是重要的心理能力。",
        category: "认知行为",
        link: "https://weread.qq.com/web/search?key=选择的悖论+施瓦茨"
    },

    // ═══════════════════════════════════════════════
    // 儿童与发展心理学 — 成长、养育与生命历程
    // ═══════════════════════════════════════════════
    {
        title: "《童年的秘密》",
        author: "玛利亚·蒙台梭利",
        desc: "蒙台梭利教育法的理论基础，深刻揭示了儿童在0-6岁期间的心理发展规律和内在需求。",
        reason: "理解自己的童年如何塑造了今天的你，也为未来可能的育儿之路提供科学的视角。",
        category: "经典入门",
        link: "https://www.jiumodiary.com/search?q=童年的秘密+蒙台梭利"
    },
    {
        title: "《孩子：挑战》",
        author: "鲁道夫·德雷克斯",
        desc: "阿德勒学派儿童心理学的实践指南，用大量案例指导家长如何在民主式教养中培养孩子责任感。",
        reason: "作者是阿德勒的学生，将个体心理学完美应用于儿童教育，至今仍是育儿心理学必读之作。",
        category: "自我成长",
        link: "https://www.jiumodiary.com/search?q=孩子挑战+德雷克斯"
    },
    {
        title: "《教养的迷思》",
        author: "朱迪斯·哈里斯",
        desc: "颠覆性的发展心理学著作，论证同龄群体对孩子人格的影响远超父母的教养方式。",
        reason: "引发巨大争议但逻辑严密——父母的影响可能被高估了，同伴才是人格塑造的关键力量。",
        category: "经典入门",
        link: "https://www.jiumodiary.com/search?q=教养的迷思+哈里斯"
    },
    {
        title: "《园丁与木匠》",
        author: "艾莉森·高普尼克",
        desc: "儿童发展心理学家以进化视角解析养育的本质：父母应该是园丁（创造生长环境）而非木匠（雕刻成品）。",
        reason: "焦虑的中国家长必读——放手让孩子自由探索，比精心设计的'培养计划'更符合人类的天性。",
        category: "自我成长",
        link: "https://weread.qq.com/web/search?key=园丁与木匠"
    },
    {
        title: "《青春期大脑风暴》",
        author: "丹尼尔·西格尔",
        desc: "用神经科学最新发现解释青春期大脑的重塑过程，以及如何利用这段时期实现个人成长。",
        reason: "如果你正在经历或已经度过青春期，这本书帮你理解那段'情绪过山车'背后的神经科学。",
        category: "认知行为",
        link: "https://weread.qq.com/web/search?key=青春期大脑风暴"
    },

    // ═══════════════════════════════════════════════
    // 心理健康科普 — 抑郁、焦虑与心理自助
    // ═══════════════════════════════════════════════
    {
        title: "《我有一只叫抑郁症的黑狗》",
        author: "马修·约翰斯通",
        desc: "作者用画笔记录自己与抑郁症共处的真实经历，以插图故事的形式呈现抑郁症的内心世界。",
        reason: "如果你不理解抑郁症是什么样的感觉，这本图文并茂的小书是最好的共情入门。",
        category: "自我成长",
        link: "https://weread.qq.com/web/search?key=我有一只叫抑郁症的黑狗"
    },
    {
        title: "《高兴死了！！！》",
        author: "珍妮·罗森",
        desc: "一位患有多种精神障碍的作家用疯狂幽默记录自己对抗抑郁症、焦虑症的真实故事。",
        reason: "最奇特的心理健康读物——用疯狂的幽默对抗疯狂，让你在爆笑中理解精神疾病的日常。",
        category: "自我成长",
        link: "https://weread.qq.com/web/search?key=高兴死了+罗森"
    },
    {
        title: "《焦虑症与恐惧症手册》",
        author: "艾德蒙·伯恩",
        desc: "畅销30余年的焦虑症自助经典，涵盖放松训练、认知重建、暴露疗法等六大类干预方法。",
        reason: "从轻度焦虑到惊恐发作的系统自助方案——相当于一本焦虑管理的家庭工具箱。",
        category: "认知行为",
        link: "https://www.jiumodiary.com/search?q=焦虑症与恐惧症手册+伯恩"
    },
    {
        title: "《不焦虑的生活》",
        author: "罗伯特·莱希",
        desc: "美国认知治疗协会主席用CBT方法帮助读者识别和挑战引发焦虑的思维模式。",
        reason: "每章一个焦虑主题，用认知行为疗法的核心技术帮你逐项击破日常焦虑的来源。",
        category: "认知行为",
        link: "https://www.jiumodiary.com/search?q=不焦虑的生活+莱希"
    },
    {
        title: "《自我训练：改变焦虑和抑郁的习惯》",
        author: "约瑟夫·卢斯亚尼",
        desc: "提出'自我交谈'技术的心理自助经典，教你识别和改变导致焦虑抑郁的内在对话模式。",
        reason: "焦虑和抑郁不是'你是谁'，而是'你养成的习惯'——而习惯是可以改变的。",
        category: "认知行为",
        link: "https://www.jiumodiary.com/search?q=自我训练+改变焦虑和抑郁+卢斯亚尼"
    },
    {
        title: "《战胜完美主义》",
        author: "罗兹·沙夫曼",
        desc: "两位牛津大学临床心理学家系统分析了完美主义的根源、类型及其与抑郁焦虑的关系。",
        reason: "如果'必须做到最好'的想法让你痛苦不堪——这本书帮你区分健康的追求卓越和有毒的完美主义。",
        category: "自我成长",
        link: "https://www.jiumodiary.com/search?q=战胜完美主义+沙夫曼"
    },
    {
        title: "《睡眠革命》",
        author: "尼克·利特尔黑尔斯",
        desc: "顶级运动睡眠教练提出R90睡眠方案，以90分钟为周期重新定义睡眠质量和效率。",
        reason: "熬夜党的睡眠救星——与其焦虑失眠，不如理解睡眠周期并用科学方法找回好睡眠。",
        category: "认知行为",
        link: "https://weread.qq.com/web/search?key=睡眠革命"
    },
    {
        title: "《心理韧性》",
        author: "里克·汉森",
        desc: "神经心理学家教你如何通过12种内在力量的刻意训练，培养面对逆境的心理韧性（Resilience）。",
        reason: "抗压能力不是天生的——通过针对性的心理训练，任何人都可以增强心理免疫力。",
        category: "自我成长",
        link: "https://weread.qq.com/web/search?key=心理韧性+汉森"
    },

    // ═══════════════════════════════════════════════
    // 免费资源 — 学术数据库、期刊与在线工具
    // ═══════════════════════════════════════════════
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
    {
        title: "PubMed Central (生物医学文献库)",
        author: "美国国立医学图书馆",
        desc: "全球最大的免费生物医学文献数据库，包含海量精神病学与临床心理学研究全文。",
        reason: "查阅英文心理学和精神病学文献的最佳入口，所有论文免费全文下载。",
        category: "免费资源",
        link: "https://www.ncbi.nlm.nih.gov/pmc/"
    },
    {
        title: "Project Gutenberg (古腾堡计划)",
        author: "Project Gutenberg",
        desc: "超过6万本免费电子书的在线图书馆，包含大量已进入公共领域的心理学经典著作。",
        reason: "弗洛伊德、荣格、詹姆斯等早期心理学家的英文原版著作可免费下载为ePub/Kindle/PDF。",
        category: "免费资源",
        link: "reader.html?book=project-gutenberg-free-ebooks.pdf&url=https%3A%2F%2Fwww.gutenberg.org%2Febooks%2Fsubjects%2Fsearch%2Fpsychology"
    },
    {
        title: "Internet Archive (互联网档案馆)",
        author: "Internet Archive",
        desc: "全球最大的数字图书馆，包含数百万免费书籍、学术论文、音视频资料。",
        reason: "很多绝版心理学书籍的扫描版可以在这里找到，学术研究的宝藏之地。",
        category: "免费资源",
        link: "https://archive.org/details/books?and%5B%5D=subject%3A%22Psychology%22"
    },
    {
        title: "Simply Psychology",
        author: "Simply Psychology",
        desc: "英文心理学入门网站，用通俗易懂的语言配以图表解释心理学核心概念与经典研究。",
        reason: "英文尚可的同学必收藏——AP Psychology级别的优质免费教材，图表清晰、解释到位。",
        category: "免费资源",
        link: "https://www.simplypsychology.org/"
    },
    {
        title: "Verywell Mind",
        author: "Verywell / Dotdash",
        desc: "专家审核的心理健康知识库，涵盖情绪管理、心理疾病、治疗方法和日常心理技巧。",
        reason: "英文世界最大的心理健康科普网站之一，每篇文章均由持证心理学家或咨询师审核。",
        category: "免费资源",
        link: "https://www.verywellmind.com/"
    },
    {
        title: "Psychology Today (今日心理学)",
        author: "Psychology Today",
        desc: "全球最大的心理学与心理健康科普平台，有数千位持证治疗师撰写的通俗文章。",
        reason: "了解最新的心理学研究发现和心理健康话题，文章通俗易懂又科学严谨。",
        category: "免费资源",
        link: "https://www.psychologytoday.com/"
    },
    {
        title: "中国心理学会",
        author: "中国心理学会 (CPS)",
        desc: "中国心理学领域最具权威性的学术组织官网，发布学术动态、伦理准则和行业资讯。",
        reason: "了解国内心理学行业标准、注册心理咨询师制度和最新学术会议信息。",
        category: "免费资源",
        link: "https://www.cpsbeijing.org/"
    },
    {
        title: "壹心理",
        author: "壹心理团队",
        desc: "国内最大的心理学综合平台，提供心理测试、科普文章、课程和在线咨询服务。",
        reason: "大量中文心理健康科普内容，包括情绪管理、关系修复、自我探索等热门主题。",
        category: "免费资源",
        link: "https://www.xinli001.com/"
    },
    {
        title: "知乎 · 心理学话题",
        author: "知乎社区",
        desc: "汇集心理学专业从业者和爱好者的问答社区，话题涵盖所有心理学分支领域。",
        reason: "国内最活跃的中文心理学讨论区之一，适合碎片化学习和找到感兴趣的方向。",
        category: "免费资源",
        link: "https://www.zhihu.com/topic/19550940"
    },
    {
        title: "ResearchGate (科研之门)",
        author: "ResearchGate",
        desc: "全球最大的学术社交网络，研究者直接上传论文全文，可免费请求和下载大量心理学期刊文章。",
        reason: "许多心理学家和神经科学家直接在这里分享论文PDF，注册免费账号即可下载。",
        category: "免费资源",
        link: "https://www.researchgate.net/search/publication?q=psychology"
    },
    {
        title: "OpenStax Psychology (免费教材)",
        author: "莱斯大学 OpenStax",
        desc: "莱斯大学提供的免费大学心理学教材，内容质量与商业教材相当，有网页版和PDF下载。",
        reason: "完全免费的英文心理学导论教材，适合用英文学习心理学的同学，质量不输收费教材。",
        category: "免费资源",
        link: "reader.html?book=openstax-psychology-textbook.pdf&url=https%3A%2F%2Fopenstax.org%2Fdetails%2Fbooks%2Fpsychology-2e"
    },
    {
        title: "MIT OpenCourseWare · 心理学",
        author: "麻省理工学院",
        desc: "MIT免费开放的心理学课程资源，包含教学大纲、讲义、阅读材料和考试题。",
        reason: "零距离接触世界顶级高校的心理学课程内容，完全免费且无需注册。",
        category: "免费资源",
        link: "https://ocw.mit.edu/search/?q=psychology"
    },
    {
        title: "Noba Psychology",
        author: "Noba Project",
        desc: "由顶尖心理学家编写的模块化心理学教材，每个模块聚焦一个主题，可自由组合。",
        reason: "类似'心理学维基'的免费教材，每个模块短小精悍，适合按需查找和学习特定概念。",
        category: "免费资源",
        link: "https://nobaproject.com/"
    },
    {
        title: "社会心理学网络 (Social Psychology Network)",
        author: "韦斯利安大学 - Scott Plous",
        desc: "全球最大的社会心理学在线社区，包含教学资源、研究链接和心理健康资源目录。",
        reason: "社会心理学方向必收藏——汇集了数千个高质量链接，涵盖教学、研究和实践资源。",
        category: "免费资源",
        link: "https://www.socialpsychology.org/"
    },

    // ═══════════════════════════════════════════════
    // PDF直读 — 公版/开源/开放获取，可直接下载或在线阅读
    // ═══════════════════════════════════════════════
    {
        title: "《心理学》免费教材 (OpenStax Psychology 2e)",
        author: "莱斯大学 OpenStax",
        desc: "完全免费的大学级心理学导论教材，内容涵盖感知、记忆、学习、情绪、人格、心理障碍等全部核心主题。直接提供PDF下载。",
        reason: "与售价数百元的商业教材同等质量但完全免费，适合系统自学心理学的同学，支持网页阅读和PDF下载。",
        category: "免费资源",
        link: "reader.html?book=openstax-psychology-2e-textbook.pdf&url=https%3A%2F%2Fopenstax.org%2Fdetails%2Fbooks%2Fpsychology-2e"
    },
    {
        title: "《社会心理学》开源教材 (Principles of Social Psychology)",
        author: "明尼苏达大学开源教材项目",
        desc: "完整的大学社会心理学开源教材，覆盖社会认知、态度、从众、群体行为等主题，提供PDF和在线版。",
        reason: "免费且高质量的社会心理学教材，被多所大学采用，支持直接下载PDF。",
        category: "免费资源",
        link: "https://open.umn.edu/opentextbooks/textbooks/principles-of-social-psychology"
    },
    {
        title: "古腾堡计划 · 心理学经典书库",
        author: "Project Gutenberg",
        desc: "包含弗洛伊德、荣格、威廉·詹姆斯等心理学先驱的英文原版著作，全部可免费下载为PDF/ePub/Kindle格式。",
        reason: "《梦的解析》《精神分析引论》《心理学原理》等经典著作英文原版免费下载，适合中英对照阅读。",
        category: "免费资源",
        link: "reader.html?book=gutenberg-psychology-classics.pdf&url=https%3A%2F%2Fwww.gutenberg.org%2Febooks%2Fsubjects%2Fsearch%2Fpsychology"
    },
    {
        title: "心理学历史上经典论文全集 (Classics in the History of Psychology)",
        author: "约克大学 - Christopher D. Green",
        desc: "收集了从古希腊到20世纪心理学史上最重要的原创论文全文，包括詹姆斯、弗洛伊德、华生、斯金纳等。",
        reason: "直接阅读心理学大师的原著论文而非二手解读，每篇都有HTML网页版可直接在线阅读。",
        category: "免费资源",
        link: "https://psychclassics.yorku.ca/"
    },
    {
        title: "APA 开放获取心理学论文",
        author: "美国心理学会 (APA)",
        desc: "美国心理学会官方开放获取论文集合，所有文章均可免费全文下载PDF，涵盖临床、认知、发展等全部领域。",
        reason: "全球最权威的心理学学术组织的免费论文——了解心理学最新研究发现的直接窗口。",
        category: "免费资源",
        link: "https://www.apa.org/pubs/journals/open-access"
    },
    {
        title: "B-OK / Z-Library 镜像 (全球最大电子书库)",
        author: "Z-Library Project",
        desc: "全球最大的免费电子书搜索引擎，包含海量心理学中英文书籍的PDF/ePub/Mobi格式下载链接。",
        reason: "几乎能找到任何心理学书籍的电子版——鸠摩搜书搜不到时来这里，注意遵守当地版权法规。",
        category: "免费资源",
        link: "https://zh.z-lib.gs/"
    },

    // ═══════════════════════════════════════════════
    // 公开课 — 国内外优质心理学视频课程
    // ═══════════════════════════════════════════════
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
    },
    {
        title: "《社会心理学》公开课",
        author: "清华大学 - 彭凯平教授",
        desc: "中国积极心理学领军人物彭凯平教授的社会心理学课程，生动地讲述群体、从众等核心主题。",
        reason: "彭凯平教授是清华心理系复系主任，讲课风格幽默接地气，社会学+心理学双重视角。",
        category: "公开课",
        link: "https://search.bilibili.com/all?keyword=清华大学社会心理学彭凯平"
    },
    {
        title: "《心理学概论》公开课",
        author: "清华大学 - 彭凯平教授",
        desc: "清华大学的心理学入门通识课，从感觉、知觉到社会、文化，建立完整的学科地图。",
        reason: "学堂在线和国家精品课程，适合想系统建立心理学知识框架但又不想啃教材的同学。",
        category: "公开课",
        link: "https://www.icourse163.org/search.htm?search=心理学概论+彭凯平"
    },
    {
        title: "《发展心理学》公开课",
        author: "北京师范大学",
        desc: "北师大心理学部教授团队主讲，从婴儿到老年的全生命周期心理发展。",
        reason: "理解人在不同年龄阶段的心理任务，既认识自己也更好地理解身边的老人和孩子。",
        category: "公开课",
        link: "https://www.icourse163.org/search.htm?search=发展心理学"
    },
    {
        title: "《沟通心理学》公开课",
        author: "哈尔滨工业大学 - 裴秋宇教授",
        desc: "国家精品在线课程，将心理学原理应用于日常沟通，分析语言背后的心理博弈。",
        reason: "被学生称为'最实用的心理学课'——教你听出话外之音，说出有效之言。",
        category: "公开课",
        link: "https://www.icourse163.org/search.htm?search=沟通心理学+裴秋宇"
    },
    {
        title: "Introduction to Psychology (心理学导论)",
        author: "耶鲁大学 - Paul Bloom",
        desc: "耶鲁大学最受欢迎的公开课之一，B站有中文字幕版，Bloom教授讲课魅力十足。",
        reason: "可能是全世界最受欢迎的心理学公开课——Paul Bloom讲课如脱口秀，B站播放量超百万。",
        category: "公开课",
        link: "https://search.bilibili.com/all?keyword=耶鲁大学心理学导论+Paul+Bloom"
    },
    {
        title: "《人格心理学》公开课",
        author: "北京师范大学",
        desc: "系统讲述人格心理学六大流派（精神分析、特质论、生物学、人本主义、行为主义、认知论）。",
        reason: "帮你理解为什么不同学派对人性的看法如此不同——建立多元视角理解人格。",
        category: "公开课",
        link: "https://www.icourse163.org/search.htm?search=人格心理学"
    },
    {
        title: "《咨询心理学》公开课",
        author: "北京师范大学",
        desc: "系统介绍心理咨询的理论流派与实务技术，了解心理咨询到底是怎么一回事。",
        reason: "如果你考虑未来从事心理咨询，这门课是了解行业全貌的最佳起点。",
        category: "公开课",
        link: "https://www.icourse163.org/search.htm?search=咨询心理学"
    },
    {
        title: "《犯罪心理学》公开课",
        author: "中国政法大学 - 马皑教授",
        desc: "国内最受欢迎的犯罪心理学公开课，马皑教授用大量案例解析犯罪行为背后的心理机制。",
        reason: "马皑教授讲课极有感染力——了解犯罪心理不仅是好奇，更是理解人性阴暗面的窗口。",
        category: "公开课",
        link: "https://search.bilibili.com/all?keyword=中国政法大学犯罪心理学马皑"
    },
    {
        title: "How to Make Stress Your Friend (TED演讲)",
        author: "凯利·麦格尼格尔",
        desc: "改变无数人看待压力方式的TED经典演讲——压力本身不致命，认为压力有害的信念才致命。",
        reason: "14分钟的演讲可能改变你的一生：拥抱压力，它其实是你的身体在帮你准备好迎接挑战。",
        category: "公开课",
        link: "https://www.ted.com/talks/kelly_mcgonigal_how_to_make_stress_your_friend"
    },
    {
        title: "The Power of Vulnerability (TED演讲)",
        author: "布琳·布朗",
        desc: "全球播放量最高的TED演讲之一，用研究数据和真实自我揭示脆弱如何成为人类连接的核心。",
        reason: "20分钟让你重新认识脆弱——它不是弱点，而是勇气、归属感和完整人生的必要条件。",
        category: "公开课",
        link: "https://www.ted.com/talks/brene_brown_the_power_of_vulnerability"
    },
    {
        title: "《大脑探秘》公开课",
        author: "复旦大学 - 俞洪波教授",
        desc: "科普性极强的脑科学课程，用通俗易懂的方式介绍大脑结构、神经机制和前沿研究。",
        reason: "对脑科学好奇但又害怕太专业？这门课用大量动画和比喻帮你直观理解大脑的运作。",
        category: "公开课",
        link: "https://search.bilibili.com/all?keyword=复旦大学大脑探秘俞洪波"
    },
    {
        title: "Learning How to Learn (学会如何学习)",
        author: "Coursera - Barbara Oakley",
        desc: "全球最受欢迎的MOOC课程之一，基于脑科学揭示高效学习的核心原理和实操技巧。",
        reason: "学什么都事半功倍的元技能——全球超过300万人选修，B站有中文翻译版本。",
        category: "公开课",
        link: "https://search.bilibili.com/all?keyword=Learning+How+to+Learn+Oakley"
    },
    {
        title: "《认知心理学》公开课",
        author: "华东师范大学",
        desc: "系统介绍认知心理学核心领域：感知、注意、记忆、语言、思维和问题解决。",
        reason: "了解人类信息加工的内在机制——你每天的思考、记忆和注意力背后都有精密的认知过程。",
        category: "公开课",
        link: "https://www.icourse163.org/search.htm?search=认知心理学"
    },
    {
        title: "《实验心理学》公开课",
        author: "北京大学",
        desc: "讲解心理学实验设计、数据分析和科学推理的硬核课程，培养心理学的科学素养。",
        reason: "想做心理学研究或读懂心理学论文，这门课教你'心理学如何证明一个结论是可靠的'。",
        category: "公开课",
        link: "https://www.icourse163.org/search.htm?search=实验心理学"
    },
    {
        title: "《心理统计学》公开课",
        author: "北京师范大学",
        desc: "心理学研究中统计学方法的系统教学，从描述统计到推论统计，适合零基础入门。",
        reason: "想做心理学研究但怕数学？这门课从零教起，用心理学实例讲解统计原理。",
        category: "公开课",
        link: "https://www.icourse163.org/search.htm?search=心理统计学"
    },
    {
        title: "The Science of Well-Being (幸福的科学)",
        author: "耶鲁大学 - Laurie Santos",
        desc: "耶鲁大学历史上最受欢迎的课程，用科学方法揭示幸福感的真实来源并引导行为改变。",
        reason: "Coursera上超过400万人注册——不是因为作业简单，而是因为它真的能让人更快乐。",
        category: "公开课",
        link: "https://search.bilibili.com/all?keyword=耶鲁大学幸福的科学+Laurie+Santos"
    }
];
