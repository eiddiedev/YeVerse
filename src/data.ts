export type Lang = "zh" | "en";
export type AlbumType = "solo" | "collab" | "compilation";
export type LocalizedText = Record<Lang, string>;

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

export interface TimelineEvent {
  year: string;
  title: LocalizedText;
  body: LocalizedText;
  albumId?: string;
  category: "life" | "music" | "fashion" | "culture";
}

export interface TimelineBranch {
  id: string;
  range: string;
  category: "life" | "music" | "fashion" | "culture";
  title: LocalizedText;
  summary: LocalizedText;
  side: "left" | "right";
  nodes: Array<{
    year: string;
    title: LocalizedText;
    body: LocalizedText;
    albumId?: string;
  }>;
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
    heroImage: "/assets/heroes/mbdtf.jpg",
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
    heroImage: "/assets/heroes/yeezus.jpeg",
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
    heroImage: "/assets/heroes/jesus-is-king.webp",
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
    heroImage: "/assets/heroes/donda-2.jpg",
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
export const timeline: TimelineEvent[] = [
  {
    year: "1977",
    category: "life",
    title: { zh: "出生于亚特兰大，成长于芝加哥", en: "Born in Atlanta, raised in Chicago" },
    body: { zh: "芝加哥成为 Ye 早期灵魂采样、城市叙事和自我教育神话的重要底色。", en: "Chicago becomes the ground tone for soul samples, city narratives, and self-education." },
  },
  {
    year: "2004",
    category: "music",
    albumId: "college-dropout",
    title: { zh: "The College Dropout 打开入口", en: "The College Dropout opens the gate" },
    body: { zh: "制作人走到麦克风前，个人神话正式成形。点击进入专辑厅。", en: "The producer steps to the microphone and the self-myth takes form. Open the album chamber." },
  },
  {
    year: "2007",
    category: "music",
    albumId: "graduation",
    title: { zh: "竞技场尺度的 Graduation", en: "Graduation reaches arena scale" },
    body: { zh: "电子化、体育馆副歌和视觉艺术合作，把流行说唱推向更亮的空间。", en: "Electronics, stadium hooks, and visual-art collaboration move rap toward a brighter scale." },
  },
  {
    year: "2008",
    category: "music",
    albumId: "808s-heartbreak",
    title: { zh: "808s 改写情绪语法", en: "808s rewrites emotional grammar" },
    body: { zh: "Auto-Tune 与极简鼓机让脆弱感成为未来流行说唱的核心材料。", en: "Auto-Tune and minimal drums turn vulnerability into a future-facing rap material." },
  },
  {
    year: "2010",
    category: "music",
    albumId: "mbdtf",
    title: { zh: "红黑歌剧 MBDTF", en: "The red-black opera of MBDTF" },
    body: { zh: "奢华制作、悔罪叙事与自我审判形成 YeVerse 的中心大厅。", en: "Luxury production, confession, and self-judgment become a central hall in YeVerse." },
  },
  {
    year: "2013",
    category: "music",
    albumId: "yeezus",
    title: { zh: "Yeezus 的工业极简", en: "Yeezus and industrial minimalism" },
    body: { zh: "一张几乎拒绝装饰的专辑，把声音和包装都推向冷硬边缘。", en: "An album that rejects decoration, pushing sound and packaging toward a cold edge." },
  },
  {
    year: "2015-2016",
    category: "fashion",
    title: { zh: "Yeezy 进入时尚系统", en: "Yeezy enters the fashion system" },
    body: { zh: "鞋履、廓形、秀场和大众消费共同构成 YeWorld 的时尚支线。", en: "Footwear, silhouettes, runway, and mass consumption form the fashion branch of YeWorld." },
  },
  {
    year: "2018",
    category: "music",
    albumId: "kids-see-ghosts",
    title: { zh: "怀俄明七首歌时期", en: "The Wyoming seven-track period" },
    body: { zh: "Ye 与 Kids See Ghosts 让短篇幅、治疗感和粗粝制作形成一组并置。", en: "Ye and Kids See Ghosts pair short form, healing language, and rough-hewn production." },
  },
  {
    year: "2021",
    category: "music",
    albumId: "donda",
    title: { zh: "Donda 的黑色公共仪式", en: "Donda as black public ritual" },
    body: { zh: "体育场试听与空白封面把专辑变成公开追思和精神建筑。", en: "Stadium listening events and a blank cover turn the album into public remembrance." },
  },
  {
    year: "2024",
    category: "music",
    albumId: "vultures-1",
    title: { zh: "¥$ 时代开启", en: "The ¥$ era begins" },
    body: { zh: "与 Ty Dolla Sign 的合作把黑色低频、俱乐部质感和碎片化发行放到前台。", en: "The Ty Dolla Sign collaboration foregrounds black low-end, club texture, and fragmented release." },
  },
];

export const timelineBranches: TimelineBranch[] = [
  {
    id: "origins",
    range: "1977-1999",
    category: "life",
    side: "left",
    title: { zh: "Origins", en: "Origins" },
    summary: {
      zh: "从亚特兰大到芝加哥，家庭、教育和城市声音塑造了最早的坐标。",
      en: "From Atlanta to Chicago, family, education, and city sound formed the earliest coordinates.",
    },
    nodes: [
      {
        year: "1977",
        title: { zh: "出生于亚特兰大", en: "Born in Atlanta" },
        body: { zh: "随后成长于芝加哥，母亲 Donda West 的教育背景成为核心精神线索。", en: "He later grew up in Chicago, with Donda West's educational presence becoming a core spiritual line." },
      },
      {
        year: "1990s",
        title: { zh: "制作人与采样语言", en: "Producer language" },
        body: { zh: "灵魂采样、鼓组和本地制作网络成为进入主流之前的地下训练。", en: "Soul samples, drums, and local production networks became the underground training before the mainstream." },
      },
      {
        year: "1997",
        title: { zh: "短暂大学经历", en: "Brief college period" },
        body: { zh: "退学叙事后来被转化为第一张专辑的核心隐喻。", en: "The dropout narrative later became the central metaphor of the debut album." },
      },
    ],
  },
  {
    id: "producer-artist",
    range: "2000-2005",
    category: "music",
    side: "right",
    title: { zh: "Producer to Artist", en: "Producer to Artist" },
    summary: {
      zh: "从 Roc-A-Fella 制作人走向麦克风前，建立个人叙事。",
      en: "The Roc-A-Fella producer moved to the microphone and built a first-person mythology.",
    },
    nodes: [
      {
        year: "2001",
        title: { zh: "制作声名扩大", en: "Production profile expands" },
        body: { zh: "为 Jay-Z 等艺术家制作让他的采样审美进入主流视野。", en: "Production for artists including Jay-Z brought his sample language into mainstream view." },
      },
      {
        year: "2002",
        title: { zh: "车祸与 Through the Wire", en: "Crash and Through the Wire" },
        body: { zh: "身体创伤被转化为职业转折点，也强化了自我神话。", en: "Physical trauma became a career pivot and intensified the self-myth." },
      },
      {
        year: "2004",
        albumId: "college-dropout",
        title: { zh: "The College Dropout", en: "The College Dropout" },
        body: { zh: "首张专辑让制作人身份正式变成艺术家身份。", en: "The debut album turned the producer identity into an artist identity." },
      },
      {
        year: "2005",
        albumId: "late-registration",
        title: { zh: "Late Registration", en: "Late Registration" },
        body: { zh: "管弦乐和灵魂乐扩展了早期世界观。", en: "Orchestration and soul expanded the early world." },
      },
    ],
  },
  {
    id: "pop-expansion",
    range: "2007",
    category: "music",
    side: "left",
    title: { zh: "Pop Expansion", en: "Pop Expansion" },
    summary: {
      zh: "电子化、体育馆尺度和视觉艺术合作把 Ye 推入全球流行中心。",
      en: "Electronics, arena scale, and visual-art collaboration moved Ye into the pop center.",
    },
    nodes: [
      {
        year: "2007",
        albumId: "graduation",
        title: { zh: "Graduation", en: "Graduation" },
        body: { zh: "竞技场副歌、合成器与村上隆视觉定义了明亮的扩张期。", en: "Arena hooks, synths, and Takashi Murakami imagery defined the bright expansion era." },
      },
      {
        year: "2007",
        title: { zh: "流行说唱权力转移", en: "A rap-pop power shift" },
        body: { zh: "这阶段让更实验、更设计化的说唱表达进入主流中心。", en: "This period pushed a more experimental, designed rap language into the mainstream center." },
      },
    ],
  },
  {
    id: "emotional-minimalism",
    range: "2008-2009",
    category: "music",
    side: "right",
    title: { zh: "Emotional Minimalism", en: "Emotional Minimalism" },
    summary: {
      zh: "悲伤、Auto-Tune 和极简鼓机把脆弱感变成未来声音。",
      en: "Grief, Auto-Tune, and minimal drum machines made vulnerability sound futuristic.",
    },
    nodes: [
      {
        year: "2008",
        albumId: "808s-heartbreak",
        title: { zh: "808s & Heartbreak", en: "808s & Heartbreak" },
        body: { zh: "情绪、机械节拍和空旷声场成为后来十多年流行说唱的重要语法。", en: "Emotion, machine rhythm, and empty space became a grammar for the following decade." },
      },
      {
        year: "2009",
        title: { zh: "公共形象转折", en: "Public-image turn" },
        body: { zh: "公众事件让艺术家形象进入更复杂的媒体周期。", en: "Public events pushed the artist image into a more complex media cycle." },
      },
    ],
  },
  {
    id: "luxury-return",
    range: "2010-2012",
    category: "music",
    side: "left",
    title: { zh: "Luxury / Exile / Return", en: "Luxury / Exile / Return" },
    summary: {
      zh: "红黑奢华、合作权力和厂牌宣言构成宏大回归。",
      en: "Red-black luxury, collaborative power, and label statements formed a grand return.",
    },
    nodes: [
      {
        year: "2010",
        albumId: "mbdtf",
        title: { zh: "MBDTF", en: "MBDTF" },
        body: { zh: "悔罪、狂妄、奢华制作被压缩成中心歌剧。", en: "Confession, arrogance, and luxury production compressed into a central opera." },
      },
      {
        year: "2011",
        albumId: "watch-the-throne",
        title: { zh: "Watch the Throne", en: "Watch the Throne" },
        body: { zh: "与 Jay-Z 的合作把权力叙事做成金色纪念碑。", en: "The Jay-Z collaboration became a gold monument to power narratives." },
      },
      {
        year: "2012",
        albumId: "cruel-summer",
        title: { zh: "Cruel Summer", en: "Cruel Summer" },
        body: { zh: "GOOD Music 的厂牌合辑成为这个时期的支线档案。", en: "The GOOD Music compilation became a branch archive of the period." },
      },
    ],
  },
  {
    id: "industrial-turn",
    range: "2013-2016",
    category: "music",
    side: "right",
    title: { zh: "Industrial Turn", en: "Industrial Turn" },
    summary: {
      zh: "工业噪音、极简包装和流媒体拼贴让作品更像系统实验。",
      en: "Industrial noise, minimal packaging, and streaming collage turned the work into system experiments.",
    },
    nodes: [
      {
        year: "2013",
        albumId: "yeezus",
        title: { zh: "Yeezus", en: "Yeezus" },
        body: { zh: "没有传统封面，只有冷硬材料和刺耳声音。", en: "No traditional cover, just hard material and abrasive sound." },
      },
      {
        year: "2016",
        albumId: "life-of-pablo",
        title: { zh: "The Life of Pablo", en: "The Life of Pablo" },
        body: { zh: "流媒体时代的可更新专辑，像持续改稿的橙色公告板。", en: "A streaming-era updateable album, like an orange board under constant revision." },
      },
    ],
  },
  {
    id: "yeezy-fashion",
    range: "2015-2020",
    category: "fashion",
    side: "left",
    title: { zh: "Yeezy / Fashion", en: "Yeezy / Fashion" },
    summary: {
      zh: "鞋履、廓形、秀场和大众消费让 YeWorld 进入时尚系统。",
      en: "Footwear, silhouettes, runway, and mass consumption moved YeWorld into the fashion system.",
    },
    nodes: [
      {
        year: "2015",
        title: { zh: "Yeezy Season", en: "Yeezy Season" },
        body: { zh: "秀场、色调和剪影建立出反乌托邦式服装语汇。", en: "Runway, tones, and silhouettes built a dystopian clothing language." },
      },
      {
        year: "2018",
        albumId: "ye",
        title: { zh: "Wyoming period", en: "Wyoming period" },
        body: { zh: "音乐、私人叙事和山地空间短暂收缩为七首歌。", en: "Music, private narrative, and mountain space compressed into seven songs." },
      },
      {
        year: "2018",
        albumId: "kids-see-ghosts",
        title: { zh: "Kids See Ghosts", en: "Kids See Ghosts" },
        body: { zh: "与 Kid Cudi 的合作将治疗感、摇滚和动画视觉并置。", en: "The Kid Cudi collaboration paired healing, rock, and animated imagery." },
      },
    ],
  },
  {
    id: "faith-donda",
    range: "2019-2022",
    category: "culture",
    side: "right",
    title: { zh: "Faith / Donda", en: "Faith / Donda" },
    summary: {
      zh: "信仰语言、母亲记忆和体育场仪式把专辑变成公共空间。",
      en: "Faith language, maternal memory, and stadium ritual turned albums into public space.",
    },
    nodes: [
      {
        year: "2019",
        albumId: "jesus-is-king",
        title: { zh: "Jesus Is King", en: "Jesus Is King" },
        body: { zh: "福音转向成为正式声明。", en: "The gospel turn became a formal statement." },
      },
      {
        year: "2021",
        albumId: "donda",
        title: { zh: "Donda", en: "Donda" },
        body: { zh: "黑色封面、体育场试听和母亲之名构成公共追思。", en: "A black cover, stadium listening, and his mother's name formed public remembrance." },
      },
      {
        year: "2022",
        albumId: "donda-2",
        title: { zh: "Donda 2", en: "Donda 2" },
        body: { zh: "特殊发行状态被保留为 YeVerse 中的半开放房间。", en: "Its special release status remains a half-open room inside YeVerse." },
      },
    ],
  },
  {
    id: "ys-era",
    range: "2024-2025",
    category: "music",
    side: "left",
    title: { zh: "¥$ Era", en: "¥$ Era" },
    summary: {
      zh: "黑色低频、合作身份和碎片化发行构成新的晚近章节。",
      en: "Black low-end, collaborative identity, and fragmented release form the recent chapter.",
    },
    nodes: [
      {
        year: "2024",
        albumId: "vultures-1",
        title: { zh: "Vultures 1", en: "Vultures 1" },
        body: { zh: "Ye 与 Ty Dolla Sign 的 ¥$ 章节开场。", en: "The opening ¥$ chapter with Ty Dolla Sign." },
      },
      {
        year: "2024",
        albumId: "vultures-2",
        title: { zh: "Vultures 2", en: "Vultures 2" },
        body: { zh: "第二章继续夜色、低频与碎片化结构。", en: "The second chapter continues the night tone, low-end, and fragment structure." },
      },
      {
        year: "2025",
        albumId: "bully",
        title: { zh: "Bully", en: "Bully" },
        body: { zh: "作为近期阶段入口，保留后续校订空间。", en: "A recent-phase entry with room for future correction." },
      },
    ],
  },
];
