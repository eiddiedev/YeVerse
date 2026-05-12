export type Lang = "zh" | "en";
export type AlbumType = "solo" | "collab" | "compilation";
export type LocalizedText = Record<Lang, string>;

export interface TimelineEra {
  id: string;
  range: string;
  title: LocalizedText;
  body: LocalizedText;
  albumIds?: string[];
}

export interface Album {
  id: string;
  title: string;
  year: number;
  type: AlbumType;
  credit: string;
  palette: { primary: string; secondary: string; text: string };
  cover: string;
  heroImage?: string;
  spineImage?: string;
  spineSource?: "real" | "simulated" | "placeholder";
  heroOutpaint?: string;
  summary: LocalizedText;
  note?: LocalizedText;
  tracks: string[];
  links: { apple: string; spotify: string };
  sourceUrls: string[];
  spineDesign?: string;
}

export const copy = {
  nav: {
    hero: { zh: "Hero", en: "Hero" },
    timeline: { zh: "Timeline", en: "Timeline" },
    discography: { zh: "Discography", en: "Discography" },
    yeworld: { zh: "YeWorld", en: "YeWorld" },
    archive: { zh: "Archive", en: "Archive" },
    about: { zh: "About", en: "About" },
  },
  hero: {
    eyebrow: { zh: "一个献给 Ye 的个人宇宙", en: "A personal universe dedicated to Ye" },
    title: { zh: "YeVerse", en: "YeVerse" },
    body: {
      zh: "进入一座黑暗、克制、精神性的未来数字大教堂，沿着音乐、时尚、影像与档案追踪一位重塑当代流行文化的艺术家。",
      en: "Enter a restrained, spiritual, dark digital cathedral tracing music, fashion, film, and archive around an artist who reshaped contemporary pop culture.",
    },
    enter: { zh: "进入唱片宇宙", en: "Enter Discography" },
    timeline: { zh: "浏览时间线", en: "Read Timeline" },
  },
  sections: {
    timelineKicker: { zh: "垂直编年", en: "Vertical chronology" },
    timelineTitle: { zh: "节点不是目录，是入口。", en: "Nodes are portals, not labels." },
    discKicker: { zh: "17 张正式唱片口径", en: "17-record canon" },
    discTitle: { zh: "像抽出一张 CD，翻到正面。", en: "Pull a spine. Let it turn face-forward." },
    openAlbum: { zh: "打开专辑", en: "Open album" },
    source: { zh: "资料来源", en: "Sources" },
    tracks: { zh: "曲目", en: "Tracks" },
    listen: { zh: "外链收听", en: "Listen out" },
    yeworldTitle: { zh: "YeWorld 分支", en: "YeWorld branches" },
    archiveTitle: { zh: "Archive 留白区", en: "Archive void" },
    aboutTitle: { zh: "致敬与声明", en: "Tribute and disclaimer" },
  },
};

const sourceDiscography = "https://en.wikipedia.org/wiki/Kanye_West_albums_discography";
const sourceFandom = "https://kanyewest.fandom.com/wiki/Discography";
const musicLinks = (query: string) => ({
  apple: `https://music.apple.com/us/search?term=${encodeURIComponent(query)}`,
  spotify: `https://open.spotify.com/search/${encodeURIComponent(query)}`,
});

export const albums: Album[] = [
  {
    id: "college-dropout",
    title: "The College Dropout",
    year: 2004,
    type: "solo",
    credit: "Kanye West",
    palette: { primary: "#7d4025", secondary: "#21140d", text: "#f3dac4" },
    cover: "/assets/covers/college-dropout.jpg",
    heroImage: "/assets/heroes/college-dropout.png",
    summary: {
      zh: "从制作人身份走向前台的起点。灵魂采样、校园熊形象、阶层焦虑与自我神话在这里第一次合成完整世界观。",
      en: "The producer steps into the foreground: soul samples, dropout iconography, class anxiety, and self-mythology form the first complete world.",
    },
    tracks: ["Intro", "We Don't Care", "All Falls Down", "Spaceship", "Jesus Walks", "Never Let Me Down", "Get Em High", "The New Workout Plan", "Slow Jamz", "Through the Wire", "Family Business", "Last Call"],
    links: musicLinks("Kanye West The College Dropout"),
    sourceUrls: [sourceDiscography],
    spineDesign: "THE COLLEGE DROPOUT",
  },
  {
    id: "late-registration",
    title: "Late Registration",
    year: 2005,
    type: "solo",
    credit: "Kanye West",
    palette: { primary: "#5d2b17", secondary: "#0d0907", text: "#f1c391" },
    cover: "/assets/covers/late-registration.jpg",
    heroImage: "/assets/heroes/late-registration.png",
    summary: {
      zh: "管弦乐、灵魂乐和说唱制作被拉进更大的剧场。它把首专的机智扩展为更华丽、更成熟的流行建筑。",
      en: "Orchestration, soul, and rap production expand into a larger theatre, turning the debut's wit into a more ornate pop architecture.",
    },
    tracks: ["Wake Up Mr. West", "Heard 'Em Say", "Touch the Sky", "Gold Digger", "Drive Slow", "Crack Music", "Roses", "Diamonds from Sierra Leone (Remix)", "We Major", "Hey Mama", "Gone", "Late"],
    links: musicLinks("Kanye West Late Registration"),
    sourceUrls: [sourceDiscography],
    spineDesign: "LATE REGISTRATION",
  },
  {
    id: "graduation",
    title: "Graduation",
    year: 2007,
    type: "solo",
    credit: "Kanye West",
    palette: { primary: "#7851d8", secondary: "#1b113c", text: "#f5e56b" },
    cover: "/assets/covers/graduation.jpg",
    heroImage: "/assets/heroes/graduation.png",
    summary: {
      zh: "电子合成器、竞技场钩子与村上隆视觉共同把说唱推向体育馆尺度。它明亮、锋利，也标记了博客时代的野心。",
      en: "Synths, stadium hooks, and Takashi Murakami imagery push rap toward arena scale: bright, sharp, and blog-era ambitious.",
    },
    tracks: ["Good Morning", "Champion", "Stronger", "I Wonder", "Good Life", "Can't Tell Me Nothing", "Barry Bonds", "Flashing Lights", "Everything I Am", "The Glory", "Homecoming", "Big Brother"],
    links: musicLinks("Kanye West Graduation"),
    sourceUrls: [sourceDiscography],
    spineDesign: "GRADUATION",
  },
  {
    id: "808s-heartbreak",
    title: "808s & Heartbreak",
    year: 2008,
    type: "solo",
    credit: "Kanye West",
    palette: { primary: "#b9c7d8", secondary: "#171b21", text: "#f2f7ff" },
    cover: "/assets/covers/808s-heartbreak.jpg",
    heroImage: "/assets/heroes/808s-heartbreak.webp",
    summary: {
      zh: "极简鼓机、Auto-Tune 与哀悼情绪构成冰冷空间。这张专辑把脆弱感变成后来十多年流行说唱的重要语言。",
      en: "Minimal drum machines, Auto-Tune, and grief create a cold room. Vulnerability becomes a language for the next decade of rap and pop.",
    },
    tracks: ["Say You Will", "Welcome to Heartbreak", "Heartless", "Amazing", "Love Lockdown", "Paranoid", "RoboCop", "Street Lights", "Bad News", "Coldest Winter", "Pinocchio Story"],
    links: musicLinks("Kanye West 808s & Heartbreak"),
    sourceUrls: [sourceDiscography],
    spineDesign: "808s & HEARTBREAK",
  },
  {
    id: "mbdtf",
    title: "My Beautiful Dark Twisted Fantasy",
    year: 2010,
    type: "solo",
    credit: "Kanye West",
    palette: { primary: "#7d0714", secondary: "#080305", text: "#ffd7c6" },
    cover: "/assets/covers/mbdtf.jpg",
    heroImage: "/assets/heroes/mbdtf.png",
    summary: {
      zh: "奢华、悔罪、狂妄与自我审判汇成一场巴洛克式说唱歌剧。深红与黑色成为这座宇宙里最浓烈的厅堂。",
      en: "Luxury, confession, arrogance, and self-trial converge into a baroque rap opera: the deepest red chamber in the universe.",
    },
    tracks: ["Dark Fantasy", "Gorgeous", "Power", "All of the Lights", "Monster", "So Appalled", "Devil in a New Dress", "Runaway", "Hell of a Life", "Blame Game", "Lost in the World", "Who Will Survive in America"],
    links: musicLinks("Kanye West My Beautiful Dark Twisted Fantasy"),
    sourceUrls: [sourceDiscography],
    spineDesign: "MY BEAUTIFUL DARK TWISTED FANTASY",
  },
  {
    id: "watch-the-throne",
    title: "Watch the Throne",
    year: 2011,
    type: "collab",
    credit: "Jay-Z & Kanye West",
    palette: { primary: "#c9a34b", secondary: "#0e0a05", text: "#fff0c2" },
    cover: "/assets/covers/watch-the-throne.jpg",
    heroImage: "/assets/covers/watch-the-throne.jpg",
    summary: {
      zh: "皇权、财富、黑人卓越与全球化采样的金色纪念碑。它把合作专辑做成一座自带回声的宫殿。",
      en: "A gold monument to power, wealth, Black excellence, and global samples; a collaborative album built like a palace with echoes.",
    },
    tracks: ["No Church in the Wild", "Lift Off", "Ni**as in Paris", "Otis", "Gotta Have It", "New Day", "That's My Bitch", "Welcome to the Jungle", "Who Gon Stop Me", "Murder to Excellence", "Made in America", "Why I Love You"],
    links: musicLinks("Jay-Z Kanye West Watch the Throne"),
    sourceUrls: [sourceDiscography],
    spineDesign: "WATCH THE THRONE",
  },
  {
    id: "cruel-summer",
    title: "Cruel Summer",
    year: 2012,
    type: "compilation",
    credit: "GOOD Music",
    palette: { primary: "#f4f0e7", secondary: "#111111", text: "#f9f4eb" },
    cover: "/assets/covers/cruel-summer.jpg",
    heroImage: "/assets/heroes/cruel-summer.png",
    summary: {
      zh: "GOOD Music 时代的集团合辑，像一张厂牌宣言。它不属于 Ye 个人专辑序列，却是 YeVerse 17 张口径里的关键支线。",
      en: "A GOOD Music crew statement. It is not a Ye solo album, but it is a key branch in this 17-record YeVerse canon.",
    },
    tracks: ["To the World", "Clique", "Mercy", "New God Flow", "The Morning", "Cold", "Higher", "Sin City", "The One", "Creepers", "Bliss", "Don't Like.1"],
    links: musicLinks("GOOD Music Cruel Summer"),
    sourceUrls: [sourceDiscography, sourceFandom],
    spineDesign: "CRUEL SUMMER",
  },
  {
    id: "yeezus",
    title: "Yeezus",
    year: 2013,
    type: "solo",
    credit: "Kanye West",
    palette: { primary: "#f2f2f2", secondary: "#050505", text: "#ffffff" },
    cover: "/assets/covers/yeezus.jpg",
    heroImage: "/assets/heroes/yeezus.png",
    summary: {
      zh: "工业噪音、极简封面、刺耳合成器和反流行结构。它像一块没有装饰的黑白金属板，冷、硬、冒犯、精准。",
      en: "Industrial noise, a minimal package, abrasive synths, and anti-pop structure: a cold black-and-white metal plate.",
    },
    tracks: ["On Sight", "Black Skinhead", "I Am a God", "New Slaves", "Hold My Liquor", "I'm In It", "Blood on the Leaves", "Guilt Trip", "Send It Up", "Bound 2"],
    links: musicLinks("Kanye West Yeezus"),
    sourceUrls: [sourceDiscography],
    spineDesign: "YEEZUS",
  },
  {
    id: "life-of-pablo",
    title: "The Life of Pablo",
    year: 2016,
    type: "solo",
    credit: "Kanye West",
    palette: { primary: "#f06a22", secondary: "#120905", text: "#ffe1c4" },
    cover: "/assets/covers/life-of-pablo.jpg",
    heroImage: "/assets/heroes/life-of-pablo.jpg",
    summary: {
      zh: "持续更新的流媒体时代拼贴：福音、家庭、欲望、时装周和未完成感共存。它像一块永远在改稿的橙色公告板。",
      en: "A streaming-era collage of gospel, family, desire, fashion week, and intentional incompletion: an orange board still being revised.",
    },
    tracks: ["Ultralight Beam", "Father Stretch My Hands Pt. 1", "Pt. 2", "Famous", "Feedback", "Low Lights", "Highlights", "Freestyle 4", "Waves", "FML", "Real Friends", "Wolves", "No More Parties in LA", "Saint Pablo"],
    links: musicLinks("Kanye West The Life of Pablo"),
    sourceUrls: [sourceDiscography],
    spineDesign: "THE LIFE OF PABLO",
  },
  {
    id: "ye",
    title: "Ye",
    year: 2018,
    type: "solo",
    credit: "Kanye West",
    palette: { primary: "#8aa0a7", secondary: "#101719", text: "#e9f1f2" },
    cover: "/assets/covers/ye.jpg",
    heroImage: "/assets/heroes/ye.jpg",
    summary: {
      zh: "七首歌的山地独白，短、暴露、像一张情绪切片。它把自画像压缩到近乎手写便签的尺度。",
      en: "A seven-song mountain monologue: brief, exposed, and compressed to the scale of a handwritten note.",
    },
    tracks: ["I Thought About Killing You", "Yikes", "All Mine", "Wouldn't Leave", "No Mistakes", "Ghost Town", "Violent Crimes"],
    links: musicLinks("Kanye West Ye"),
    sourceUrls: [sourceDiscography],
    spineDesign: "ye",
  },
  {
    id: "kids-see-ghosts",
    title: "Kids See Ghosts",
    year: 2018,
    type: "collab",
    credit: "Kids See Ghosts",
    palette: { primary: "#d65832", secondary: "#16100c", text: "#ffd4ba" },
    cover: "/assets/covers/kids-see-ghosts.jpg",
    heroImage: "/assets/heroes/kids-see-ghosts.webp",
    summary: {
      zh: "与 Kid Cudi 的七首治愈仪式。摇滚、迷幻、动漫式封面和心理阴影在短篇幅里达成罕见平衡。",
      en: "A seven-track healing ritual with Kid Cudi where rock, psychedelia, animated cover art, and shadow find rare balance.",
    },
    tracks: ["Feel the Love", "Fire", "4th Dimension", "Freeee (Ghost Town Pt. 2)", "Reborn", "Kids See Ghosts", "Cudi Montage"],
    links: musicLinks("Kids See Ghosts album"),
    sourceUrls: [sourceDiscography],
    spineDesign: "KIDS SEE GHOSTS",
  },
  {
    id: "jesus-is-king",
    title: "Jesus Is King",
    year: 2019,
    type: "solo",
    credit: "Kanye West",
    palette: { primary: "#2457d6", secondary: "#050814", text: "#d9e8ff" },
    cover: "/assets/covers/jesus-is-king.jpg",
    heroImage: "/assets/heroes/jesus-is-king.png",
    summary: {
      zh: "福音转向的正式声明，合唱、信仰语言与蓝色极简封面组成新的精神秩序。",
      en: "A formal gospel turn, placing choir, devotional language, and a blue minimal cover inside a new spiritual order.",
    },
    tracks: ["Every Hour", "Selah", "Follow God", "Closed on Sunday", "On God", "Everything We Need", "Water", "God Is", "Hands On", "Use This Gospel", "Jesus Is Lord"],
    links: musicLinks("Kanye West Jesus Is King"),
    sourceUrls: [sourceDiscography],
    spineDesign: "JESUS IS KING",
  },
  {
    id: "donda",
    title: "Donda",
    year: 2021,
    type: "solo",
    credit: "Kanye West",
    palette: { primary: "#151515", secondary: "#000000", text: "#f0f0f0" },
    cover: "/assets/covers/donda.jpg",
    heroImage: "/assets/heroes/donda.jpg",
    summary: {
      zh: "以母亲之名命名的黑色纪念碑。体育场试听、祈祷、空白封面和超长曲目让它像一场公共追思仪式。",
      en: "A black monument named for his mother, shaped by stadium listening events, prayer, a blank cover, and public mourning.",
    },
    tracks: ["Donda Chant", "Jail", "God Breathed", "Off the Grid", "Hurricane", "Praise God", "Jonah", "Ok Ok", "Junya", "Believe What I Say", "24", "Moon", "Heaven and Hell", "Remote Control", "Come to Life", "No Child Left Behind"],
    links: musicLinks("Kanye West Donda"),
    sourceUrls: [sourceDiscography],
    spineDesign: "DONDA",
  },
  {
    id: "donda-2",
    title: "Donda 2",
    year: 2022,
    type: "solo",
    credit: "Kanye West",
    palette: { primary: "#2e2e2e", secondary: "#050505", text: "#f2f2f2" },
    cover: "/assets/covers/donda-2.jpg",
    heroImage: "/assets/heroes/donda-2.png",
    note: {
      zh: "特殊发行：最初通过 Stem Player 发布，站内以正式 solo 口径收录并标注状态。",
      en: "Special release: initially issued through Stem Player; included here as a solo record with release context noted.",
    },
    summary: {
      zh: "一张带有未完成感和设备绑定历史的续章。它在 YeVerse 中更像一间半开放的房间，保留过程、缺口和争议状态。",
      en: "A sequel marked by unfinished edges and device-linked release history; an open room preserving process and ambiguity.",
    },
    tracks: ["True Love", "Broken Road", "Get Lost", "Too Easy", "Flowers", "Security", "We Did It Kid", "Pablo", "Louie Bags", "Happy", "Sci Fi", "Selfish", "Lord Lift Me Up", "City of Gods"],
    links: musicLinks("Kanye West Donda 2"),
    sourceUrls: [sourceDiscography],
    spineDesign: "DONDA 2",
  },
  {
    id: "vultures-1",
    title: "Vultures 1",
    year: 2024,
    type: "collab",
    credit: "¥$",
    palette: { primary: "#1b1b1b", secondary: "#050505", text: "#ececec" },
    cover: "/assets/covers/vultures-1.png",
    heroImage: "/assets/heroes/vultures-1.jpg",
    summary: {
      zh: "Ye 与 Ty Dolla Sign 的 ¥$ 章节开场。黑色、裸露、俱乐部低频和争议后的再组织构成新的阵列。",
      en: "The opening ¥$ chapter with Ty Dolla Sign: black surfaces, club low-end, and post-controversy reassembly.",
    },
    tracks: ["Stars", "Keys to My Life", "Paid", "Talking", "Back to Me", "Hoodrat", "Do It", "Paperwork", "Burn", "Fuk Sumn", "Vultures", "Carnival", "Beg Forgiveness", "Problematic", "King"],
    links: musicLinks("¥$ Vultures 1"),
    sourceUrls: [sourceDiscography],
    spineDesign: "VULTURES",
  },
  {
    id: "vultures-2",
    title: "Vultures 2",
    year: 2024,
    type: "collab",
    credit: "¥$",
    palette: { primary: "#111111", secondary: "#000000", text: "#f4f4f4" },
    cover: "/assets/covers/vultures-2.jpg",
    heroImage: "/assets/heroes/vultures-2.png",
    summary: {
      zh: "¥$ 第二章继续把夜色、低频与碎片化流媒体发行放在一起。站内先保留为可继续扩展的黑色房间。",
      en: "The second ¥$ chapter continues through night tones, low-end, and fragmented streaming-era release patterns.",
    },
    tracks: ["Slide", "Time Moving Slow", "Field Trip", "Fried", "Promotion", "Lifestyle", "Maybe", "River", "530", "Dead", "Forever Rolling", "Sky City", "My Soul"],
    links: musicLinks("¥$ Vultures 2"),
    sourceUrls: [sourceDiscography],
    spineDesign: "VULTURES 2",
  },
  {
    id: "bully",
    title: "Bully",
    year: 2025,
    type: "solo",
    credit: "Ye",
    palette: { primary: "#bdb8aa", secondary: "#0b0b09", text: "#f1eadb" },
    cover: "/assets/covers/bully.jpg",
    heroImage: "/assets/heroes/bully.png",
    note: {
      zh: "近期发行资料仍可能变化；第一版以公开资料口径收录，后续可逐项校订。",
      en: "Recent-release details may continue to shift; this prototype keeps it marked for future correction.",
    },
    summary: {
      zh: "Ye 新阶段的入口。第一版将它处理为一间尚未完全布展的展厅：保留封面、年份、曲目入口和未来交互空间。",
      en: "An entry into Ye's newer phase, treated here as a gallery still being installed, with room for later interaction design.",
    },
    tracks: ["Preacher Man", "Beauty and the Beast", "Bully", "Melrose", "Prey", "Highs and Lows"],
    links: musicLinks("Ye Bully album"),
    sourceUrls: [sourceDiscography, sourceFandom],
    spineDesign: "BULLY",
  },
];

export const timelineEras: TimelineEra[] = [
  {
    id: "early-life",
    range: "1977 – 1997",
    title: { zh: "Early Life", en: "Early Life" },
    body: {
      zh: "出生于亚特兰大，成长于芝加哥。母亲 Donda West 是英语教授，父亲 Ray West 是前黑豹党成员。10 岁随母亲赴南京担任富布赖特学者。少年时期开始写诗、说唱、制作 beats。师从制作人 No I.D.，进入芝加哥美国艺术学院后转入芝加哥州立大学，20 岁退学追求音乐。2002 年车祸下颌碎裂，戴着钢丝录制 Through the Wire。",
      en: "Born Kanye Omari West in Atlanta, Georgia in 1977. Raised primarily in Chicago after his parents divorced. His mother Donda West was an English professor. His father Ray West worked as a photojournalist. Developed interests in poetry, visual art, music production, and rap during childhood.",
    },
  },
  {
    id: "roc-a-fella",
    range: "1996 – 2002",
    title: { zh: "Early Work & Roc-A-Fella", en: "Early Work & Roc-A-Fella" },
    body: {
      zh: "1990 年代中期在芝加哥开始制作 beats。与本地艺人和 Go-Getters 合作。通过 Roc-A-Fella Records 获得认可。为 Jay-Z 的 The Blueprint 制作。2002 年车祸后录制 Through the Wire。",
      en: "Started producing beats in Chicago in the mid-1990s. Worked with local artists and the Go-Getters. Earned recognition through Roc-A-Fella Records. Produced for Jay-Z's The Blueprint. Recorded 'Through the Wire' after a near-fatal 2002 car accident.",
    },
  },
  {
    id: "college-era",
    range: "2003 – 2006",
    title: { zh: "The College Dropout / Late Registration", en: "The College Dropout / Late Registration" },
    body: {
      zh: "2004 年发行 The College Dropout。专辑确立了他作为说唱歌手和制作人的双重身份。Late Registration 以管弦乐制作扩展了他的声音。这个时代引入了标志性的 Dropout Bear 形象。",
      en: "Released The College Dropout in 2004. The album established him as both rapper and producer. Late Registration expanded his sound with orchestral production. This era introduced the iconic Dropout Bear imagery.",
    },
    albumIds: ["college-dropout", "late-registration"],
  },
  {
    id: "graduation-808s",
    range: "2007 – 2009",
    title: { zh: "Graduation / 808s & Heartbreak", en: "Graduation / 808s & Heartbreak" },
    body: {
      zh: "Graduation 在 2007 年取得重大商业成功。Stronger 将电子音乐影响引入主流嘻哈。母亲 Donda West 去世后，他发行了 808s & Heartbreak。这张专辑影响了一代旋律说唱艺术家。2009 年 VMA 事件成为一个重大文化转折点。",
      en: "Graduation became a major commercial success in 2007. Stronger introduced electronic influences into mainstream hip-hop. After the death of Donda West, he released 808s & Heartbreak. The album influenced a generation of melodic rap artists. The 2009 VMAs incident became a major cultural turning point.",
    },
    albumIds: ["graduation", "808s-heartbreak"],
  },
  {
    id: "dark-fantasy",
    range: "2010 – 2012",
    title: { zh: "Dark Fantasy / Watch the Throne", en: "Dark Fantasy / Watch the Throne" },
    body: {
      zh: "在夏威夷创作 My Beautiful Dark Twisted Fantasy。发行 Runaway 和 GOOD Fridays 系列。与 Jay-Z 合作 Watch the Throne。通过 Cruel Summer 扩展了 GOOD Music 集体。",
      en: "Created My Beautiful Dark Twisted Fantasy in Hawaii. Released Runaway and the GOOD Fridays series. Collaborated with Jay-Z on Watch the Throne. Expanded the GOOD Music collective with Cruel Summer.",
    },
    albumIds: ["mbdtf", "watch-the-throne", "cruel-summer"],
  },
  {
    id: "yeezus-fashion",
    range: "2013 – 2015",
    title: { zh: "Yeezus & Fashion", en: "Yeezus & Fashion" },
    body: {
      zh: "Yeezus 引入了刺耳的工业极简声音。扩展到建筑、时尚和产品设计。发展了 Yeezy 视觉身份和时尚方向。黑色极简美学成为他作品的核心。",
      en: "Yeezus introduced a harsh industrial minimalist sound. Expanded into architecture, fashion, and product design. Developed the Yeezy visual identity and fashion direction. Minimal black aesthetics became central to his work.",
    },
    albumIds: ["yeezus"],
  },
  {
    id: "pablo",
    range: "2016 – 2017",
    title: { zh: "The Life of Pablo", en: "The Life of Pablo" },
    body: {
      zh: "通过不断演变的公众发布方式发行 The Life of Pablo。专辑融合了福音、互联网文化和极繁主义。Saint Pablo Tour 采用了悬浮舞台概念。这个时期以公众不稳定性和巡演取消告终。",
      en: "Released The Life of Pablo through an evolving public rollout. The album blended gospel, internet culture, and maximalism. The Saint Pablo Tour featured a floating stage concept. This period ended with public instability and tour cancellation.",
    },
    albumIds: ["life-of-pablo"],
  },
  {
    id: "wyoming",
    range: "2018 – 2019",
    title: { zh: "Wyoming Sessions", en: "Wyoming Sessions" },
    body: {
      zh: "在怀俄明州制作多张专辑。发行 Ye 和 Kids See Ghosts。为 Nas、Pusha T 和 Teyana Taylor 制作项目。主题包括孤立、心理健康和重塑。",
      en: "Produced multiple albums in Wyoming. Released Ye and Kids See Ghosts. Produced projects for Nas, Pusha T, and Teyana Taylor. Themes included isolation, mental health, and reinvention.",
    },
    albumIds: ["ye", "kids-see-ghosts"],
  },
  {
    id: "faith-era",
    range: "2019 – 2022",
    title: { zh: "Jesus Is King / Donda", en: "Jesus Is King / Donda" },
    body: {
      zh: "发起 Sunday Service 演出。2019 年发行 Jesus Is King。通过大规模体育场试听活动创作 Donda。这个时代聚焦于悲伤、信仰、极简主义和表演奇观。",
      en: "Launched Sunday Service performances. Released Jesus Is King in 2019. Created Donda through large-scale stadium listening events. This era focused on grief, faith, minimalism, and performance spectacle.",
    },
    albumIds: ["jesus-is-king", "donda", "donda-2"],
  },
  {
    id: "current-era",
    range: "2023 – Present",
    title: { zh: "Vultures / Current Era", en: "Vultures / Current Era" },
    body: {
      zh: "与 Ty Dolla Sign 合作组成 ¥$。2024 年发行 Vultures 1。公众形象变得越来越有争议和碎片化。将这个时代呈现为一个未完成的篇章。",
      en: "Collaborated with Ty Dolla Sign as ¥$. Released Vultures 1 in 2024. Public image became increasingly controversial and fragmented. Present this era neutrally as an unfinished chapter.",
    },
    albumIds: ["vultures-1", "vultures-2", "bully"],
  },
];
