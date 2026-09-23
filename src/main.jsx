import React, { useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowDown, ArrowDownRight, ArrowUpRight, Asterisk, AtSign, Github, Mail, MapPin, MoveUpRight, Play } from 'lucide-react';
import './styles.css';

function HeroVideo() {
  const videoRef = useRef(null);
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    let frame;
    let width = 0;
    let height = 0;
    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      width = canvas.width = Math.round(window.innerWidth * ratio);
      height = canvas.height = Math.round(window.innerHeight * ratio);
    };
    resize();
    window.addEventListener('resize', resize);
    const points = Array.from({ length: 64 }, (_, i) => ({ x: (i % 8) / 7, y: Math.floor(i / 8) / 7 }));
    const draw = (time) => {
      context.fillStyle = '#080d0e';
      context.fillRect(0, 0, width, height);
      const scale = width / 1600;
      context.save();
      context.scale(scale, scale);
      const w = width / scale;
      const h = height / scale;
      context.strokeStyle = 'rgba(111, 153, 140, .13)';
      context.lineWidth = 1;
      for (let x = 0; x < w; x += 88) { context.beginPath(); context.moveTo(x, 0); context.lineTo(x, h); context.stroke(); }
      for (let y = 0; y < h; y += 88) { context.beginPath(); context.moveTo(0, y); context.lineTo(w, y); context.stroke(); }
      const nodes = points.map((p, i) => ({ x: w * (.52 + p.x * .43), y: h * (.17 + p.y * .68) + Math.sin(time * .00055 + i * .7) * 12 }));
      nodes.forEach((a, i) => nodes.slice(i + 1).forEach((b) => {
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < 170) { context.strokeStyle = `rgba(125, 191, 159, ${.1 * (1 - d / 170)})`; context.beginPath(); context.moveTo(a.x, a.y); context.lineTo(b.x, b.y); context.stroke(); }
      }));
      nodes.forEach((p, i) => { context.fillStyle = i % 9 === 0 ? '#bd8d61' : '#a2c9ac'; context.globalAlpha = .55 + .3 * Math.sin(time * .001 + i); context.beginPath(); context.arc(p.x, p.y, i % 9 === 0 ? 2.4 : 1.4, 0, Math.PI * 2); context.fill(); });
      context.globalAlpha = 1;
      const scan = ((time * .04) % (h + 240)) - 120;
      const glow = context.createLinearGradient(0, scan - 30, 0, scan + 30);
      glow.addColorStop(0, 'rgba(182, 153, 113, 0)'); glow.addColorStop(.5, 'rgba(182, 153, 113, .13)'); glow.addColorStop(1, 'rgba(182, 153, 113, 0)');
      context.fillStyle = glow; context.fillRect(w * .48, scan - 30, w * .52, 60);
      context.restore();
      frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw);
    if (canvas.captureStream) { video.srcObject = canvas.captureStream(24); video.play().catch(() => {}); }
    return () => { cancelAnimationFrame(frame); window.removeEventListener('resize', resize); video.srcObject?.getTracks().forEach((track) => track.stop()); };
  }, []);
  return <video ref={videoRef} className="hero-video" muted autoPlay playsInline aria-hidden="true" />;
}

function ProjectVisual({ project }) {
  const [playing, setPlaying] = React.useState(false);
  const videoRef = React.useRef(null);
  const showVideoCover = () => {
    const video = videoRef.current;
    if (video) video.currentTime = 0.1;
  };
  return <div className={`project-visual ${project.imageClass}`}>
    {project.video ? <>
      <video ref={videoRef} className="project-demo-video" src={project.video} controls={playing} autoPlay={playing} muted={!playing} playsInline preload="metadata" onLoadedMetadata={showVideoCover} onClick={() => { if (!playing) setPlaying(true); }} aria-label={`${project.title} 演示视频`} />
      {!playing && <button className="video-play" type="button" onClick={() => setPlaying(true)} aria-label={`播放 ${project.title} 演示视频`}><Play size={19} fill="currentColor" /><span>播放项目演示</span></button>}
    </> : <img src={project.image} alt={`${project.title} 项目视觉`} loading="lazy" />}
    {project.secondary && <img className="secondary-visual" src={project.secondary} alt="Agent 系统架构" loading="lazy" />}
    <span className="visual-index">CASE / {project.number}</span>
  </div>;
}

const projects = [
  { number: '01', title: 'EasyOfficer', eyebrow: 'AI PRODUCT · PRODUCT DESIGN', description: '让复杂文档回到人的尺度。围绕长文档阅读痛点，设计 AI 辅助排版工具，让结构更清楚、重点更容易抵达。', video: '/media/easyofficer-demo.mp4', imageClass: 'image-easy', tags: ['AI 产品设计', '需求分析', '体验策略'], result: '上海徐汇区 AI 创新创业大赛 · 产品获得最佳表现奖', link: 'https://easyofficer.tech/' },
  { number: '02', title: 'Privacy Policy, Reimagined', eyebrow: 'GRADUATION PROJECT · PRIVACY UX', description: '把隐私政策从“读不完的条款”变成可理解的信息。结合 OPP-115 文本分类、LLM 分析建议与风险可视化，帮助用户更快发现数据使用方式。', image: '/media/privacy-wordcloud.png', imageClass: 'image-privacy', tags: ['隐私政策分类', 'OPP-115', 'PyQt5 / Pyecharts'], result: '毕业设计：法律科技重新设计法律信息 · 2023（古法编程时期）', link: null },
  { number: '03', title: 'Legal Intelligence Agent', eyebrow: 'AI AGENT · LEGAL DATA', description: '用多步工具调用回答真实的企业法律问题：理解意图、规划查询、调取企业与司法数据，再把证据组织成清晰答案。', image: '/media/legal-agent-competition.png', imageClass: 'image-agent', tags: ['GLM-4 Function Call', '多步任务规划', '证据链设计'], result: '阿里云天池法律行业大模型挑战赛 · 华北赛区初赛第 9 名', link: null, secondary: '/media/portfolio-agent-architecture.svg' },
  { number: '04', title: 'EvidenceCombine', eyebrow: 'OPEN SOURCE · EVIDENCE WORKFLOW', description: '面向法律工作场景的证据整合与分析项目。探索如何把分散材料转化为可核对、可引用、可继续工作的证据成果。', image: '/media/evidence-combine.svg', imageClass: 'image-evidence', tags: ['法律科技', '证据分析', 'GitHub'], result: '查看项目代码与 README', link: 'https://github.com/Yeorange3500/EvidenceCombine' },
];

const strengths = [
  { id: '01', title: '把法律问题拆成产品问题', text: '从真实业务与规则出发，找到关键风险、用户任务与系统边界，再把判断转成可执行的需求。', label: 'PRODUCT THINKING', tone: 'moss' },
  { id: '02', title: '让 AI 输出可验证', text: '熟悉 Function Call、Prompt Engineering 与多步 Agent 工作流；关注数据来源、调用过程和结论如何被复核。', label: 'AI × TRUST', tone: 'clay' },
  { id: '03', title: '兼顾技术实现与合规设计', text: '软件工程训练帮助我理解模型、数据与接口；法律训练帮助我识别权利义务、风险和治理要求。', label: 'SYSTEMS & POLICY', tone: 'blue' },
];

function App() {
  return <>
    <header className="topbar">
      <a className="wordmark" href="#home" aria-label="回到首页">G.Y.C</a>
      <nav aria-label="主导航"><a href="#about">关于</a><a href="#work">项目</a><a href="#strengths">能力</a></nav>
    </header>
    <main>
      <section id="home" className="hero">
        <HeroVideo />
        <div className="hero-shade" />
        <img className="hero-character" src="/media/hero-chibi-reference.png" alt="" aria-hidden="true" />
        <div className="hero-meta"><span><i /> OPEN TO THE RIGHT OPPORTUNITY</span><span>HANGZHOU · SHANGHAI · GLOBAL</span></div>
        <div className="hero-content">
          <p className="eyebrow"><Asterisk size={15} /> 安全产品经理 / AI 合规经理 / 合规设计师</p>
          <h1>让技术的边界<br /><span>更值得信任。</span></h1>
          <div className="hero-bottom"><p>龚业程 Yecheng Gong<br />法律 × 软件工程 × 产品设计</p><a className="circle-link" href="#work" aria-label="浏览精选项目"><ArrowDown size={20} /></a></div>
        </div>
        <div className="hero-index">PERSONAL PORTFOLIO <span>2026 — 01</span></div>
        <a className="scroll-cue" href="#about"><span>SCROLL TO EXPLORE</span><ArrowDownRight size={15} /></a>
      </section>

      <section id="about" className="about section-wrap">
        <div className="section-kicker"><span>01 / PROFILE</span><span>ABOUT ME</span></div>
        <div className="about-grid">
          <div className="portrait-panel"><div className="portrait-orbit orbit-one"/><div className="portrait-orbit orbit-two"/><div className="portrait-monogram">G.Y.C</div><div className="portrait-caption"><span>LAW × TECHNOLOGY</span><span>EST. 2020</span></div><div className="portrait-coord">30°16′ N<br />120°09′ E</div></div>
          <div className="about-copy"><p className="eyebrow muted">A LITTLE CONTEXT</p><h2>懂规则，也懂<br /><em>规则如何变成产品。</em></h2><p className="body-copy">浙江大学法律硕士在读，知识产权方向；本科就读于北京邮电大学，拥有软件工程与管理学双学位。我的工作方式，是在法律判断、技术能力与真实用户之间建立清晰的连接。</p><p className="body-copy">从隐私政策分析、法律检索 Agent 到知识产权实务，我持续关注 AI 产品怎样做到有用、合规、可解释，也能被真实业务采纳。</p>
            <div className="contact-inline"><a href="mailto:zjuyecheng_gong@163.com"><Mail size={15} /> zjuyecheng_gong@163.com <ArrowUpRight size={13} /></a><span><MapPin size={15} /> 杭州 / 上海</span></div>
          </div>
          <div className="metrics"><div><strong>89.13</strong><span>GPA · 专业前 5%</span></div><div><strong>7.0</strong><span>IELTS</span></div><div><strong>03</strong><span>工学+管理学+法学</span></div></div>
        </div>
        <div className="experience-line"><span>NOW</span><div><strong>浙江大学 · 光华法学院</strong><small>法律硕士 / 知识产权方向</small></div><b /><div><strong>北京市中伦（上海）律师事务所</strong><small>知识产权实习 · 专利与商业秘密争议、IP 尽调</small></div><b /><div><strong>浙江垦丁律师事务所 · TMT</strong><small>产品合规、知识产权诉讼与行业研究</small></div><span>2025 — 26</span></div>
      </section>

      <section id="work" className="work section-wrap">
        <div className="section-kicker"><span>02 / SELECTED WORK</span><span>FOUR PROJECTS · FOUR ANGLES</span></div>
        <div className="work-heading"><h2>把问题做成<br /><em>能运行的答案。</em></h2><p>从产品构想到模型工作流，从隐私体验到法律证据。<br />每个项目，都是一次边界与可能性的重新定义。</p></div>
        <div className="project-list">{projects.map((project) => <article className="project" key={project.number}>
          <ProjectVisual project={project} />
          <div className="project-copy"><div className="project-eyebrow"><span>{project.eyebrow}</span><span>{project.number} / 04</span></div><h3>{project.title}</h3><p>{project.description}</p><div className="tag-list">{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div><div className="project-result"><Asterisk size={15} /><span>{project.result}</span></div>{project.link && <a className="project-link" href={project.link} target="_blank" rel="noreferrer">查看项目 <MoveUpRight size={15} /></a>}</div>
        </article>)}</div>
      </section>

      <section id="strengths" className="strengths section-wrap"><div className="section-kicker"><span>03 / WHAT I BRING</span><span>CAPABILITIES</span></div><div className="strength-heading"><h2>我擅长的，<em>是跨越边界。</em></h2><span>01 — 03</span></div><div className="strength-grid">{strengths.map(item => <article className={`strength-card ${item.tone}`} key={item.id}><div className="strength-top"><span>{item.id}</span><ArrowUpRight size={18} /></div><div><span className="strength-label">{item.label}</span><h3>{item.title}</h3><p>{item.text}</p></div><div className="strength-foot"><Asterisk size={17} /><span>Y. GONG / PRACTICE NOTE</span></div></article>)}</div></section>

      <section className="closing"><div className="closing-inner"><div className="section-kicker"><span>04 / GET IN TOUCH</span><span>THE NEXT CHAPTER</span></div><p className="eyebrow"><Asterisk size={15} /> GOOD WORK STARTS WITH A GOOD QUESTION</p><h2>一起把重要的事，<br /><em>做得更可信。</em></h2><a className="closing-mail" href="https://mail.163.com/" target="_blank" rel="noreferrer"><span>zjuyecheng_gong@163.com</span><span><ArrowUpRight size={22} /></span></a><div className="closing-foot"><span>龚业程 Yecheng Gong · 杭州 / 上海</span><div><a href="https://github.com/Yeorange3500" target="_blank" rel="noreferrer" aria-label="GitHub"><Github size={17} /></a><a href="https://mail.163.com/" target="_blank" rel="noreferrer" aria-label="Email"><AtSign size={17} /></a><a href="#home" aria-label="返回顶部"><ArrowUpRight size={17} /></a></div><span>© 2026 · BUILT WITH INTENTION</span></div></div></section>
    </main>
  </>;
}

createRoot(document.getElementById('root')).render(<App />);
