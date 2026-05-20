import {
  createContext,
  type ReactNode,
  type TouchEvent,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import { SlideButton } from '@/components/ui/slide-button'

type Lang = 'en' | 'es'

type ProblemItem = {
  icon: 'restart' | 'trend' | 'trash'
  text: string
}

type Translation = {
  meta: {
    language: string
    copied: string
    copyCommand: string
    done: string
    next: string
    previous: string
    slide: string
  }
  nav: string[]
  hero: {
    headlineTop: string
    headlineBottom: string
    subtext: string
    command: string
    committed: string
    install: string
    github: string
  }
  problem: {
    titleTop: string
    titleMiddle: string
    titleBottom: string
    items: ProblemItem[]
  }
  solution: {
    kicker: string
    title: string
    body: string
    lines: string[]
  }
  features: {
    title: string
    body: string
    items: Array<{ label: string; value: string }>
  }
  pricing: {
    title: string
    body: string
    freeTitle: string
    freeItems: string[]
    cloudTitle: string
    cloudItems: string[]
  }
  install: {
    title: string
    body: string
    init: string
  }
  footer: {
    title: string
    body: string
    github: string
    npm: string
    docs: string
    built: string
  }
}

const installCommand = 'npm install -g @quantpartners/pca'
const githubUrl = 'https://github.com/thequantpartners/pca'
const npmUrl = 'https://www.npmjs.com/package/@quantpartners/pca'

const translations: Record<Lang, Translation> = {
  en: {
    meta: {
      language: 'Language',
      copied: 'Copied',
      copyCommand: 'Copy npm install command',
      done: 'Done',
      next: 'Next screen',
      previous: 'Previous screen',
      slide: 'Slide to continue',
    },
    nav: ['Hero', 'Problem', 'Mechanism', 'Features', 'Pricing', 'Install', 'Links'],
    hero: {
      headlineTop: 'Git for AI',
      headlineBottom: 'context',
      subtext: 'AI agents forget. PCA remembers.',
      command: '$ pca commit "Defined auth strategy" --type decision',
      committed: 'Context committed',
      install: 'Install Free',
      github: 'View on GitHub',
    },
    problem: {
      titleTop: 'Your agent',
      titleMiddle: 'forgets',
      titleBottom: 'everything',
      items: [
        { icon: 'restart', text: 'Sessions restart with zero memory' },
        { icon: 'trend', text: 'Prompts grow longer every week' },
        { icon: 'trash', text: 'Decisions disappear forever' },
      ],
    },
    solution: {
      kicker: 'PCA memory flow',
      title: 'Commit the context once. Reuse it every session.',
      body: 'PCA stores decisions, tasks, and project facts as local markdown memory your agent can query before it guesses.',
      lines: [
        '$ pca init',
        '$ pca commit "Defined auth strategy" --type decision',
        '$ pca task "build login screen"',
        '-> compact context block ready',
      ],
    },
    features: {
      title: 'Built like a developer tool',
      body: 'No dashboard required to start. PCA works where agents already work: inside your repo.',
      items: [
        { label: 'local', value: 'Markdown files, no cloud required' },
        { label: 'commit', value: 'Record decisions like git history' },
        { label: 'health', value: 'Know when context is missing' },
      ],
    },
    pricing: {
      title: 'Free local memory today',
      body: 'Start with the CLI, then bring in cloud memory when team context needs to be shared.',
      freeTitle: 'Free',
      freeItems: ['Local CLI', 'Offline memory', 'Unlimited commits'],
      cloudTitle: 'Cloud soon',
      cloudItems: ['Vector memory', 'Dashboard', 'Token savings', 'Team context'],
    },
    install: {
      title: 'Start in 30 seconds',
      body: 'Install globally, initialize PCA, and let the next session begin with project memory loaded.',
      init: '$ pca init',
    },
    footer: {
      title: 'Never lose project context again',
      body: 'Git for AI context, built for agent-heavy teams.',
      github: 'GitHub',
      npm: 'npm',
      docs: 'Docs',
      built: 'Built by QuantPartners',
    },
  },
  es: {
    meta: {
      language: 'Idioma',
      copied: 'Copiado',
      copyCommand: 'Copiar comando npm install',
      done: 'Listo',
      next: 'Pantalla siguiente',
      previous: 'Pantalla anterior',
      slide: 'Desliza para continuar',
    },
    nav: ['Inicio', 'Problema', 'Mecanismo', 'Funciones', 'Precio', 'Instalar', 'Links'],
    hero: {
      headlineTop: 'Git para IA',
      headlineBottom: 'contexto',
      subtext: 'Los agentes de IA olvidan. PCA recuerda.',
      command: '$ pca commit "Defined auth strategy" --type decision',
      committed: 'Contexto registrado',
      install: 'Instalar gratis',
      github: 'Ver en GitHub',
    },
    problem: {
      titleTop: 'Tu agente',
      titleMiddle: 'olvida',
      titleBottom: 'todo',
      items: [
        { icon: 'restart', text: 'Las sesiones reinician sin memoria' },
        { icon: 'trend', text: 'Los prompts crecen cada semana' },
        { icon: 'trash', text: 'Las decisiones desaparecen para siempre' },
      ],
    },
    solution: {
      kicker: 'Flujo de memoria PCA',
      title: 'Registra el contexto una vez. Reusalo en cada sesion.',
      body: 'PCA guarda decisiones, tareas y datos del proyecto como memoria markdown local para que tu agente consulte antes de adivinar.',
      lines: [
        '$ pca init',
        '$ pca commit "Defined auth strategy" --type decision',
        '$ pca task "build login screen"',
        '-> bloque compacto de contexto listo',
      ],
    },
    features: {
      title: 'Hecho como herramienta dev',
      body: 'No necesitas dashboard para empezar. PCA vive donde tus agentes ya trabajan: dentro del repo.',
      items: [
        { label: 'local', value: 'Markdown local, sin nube obligatoria' },
        { label: 'commit', value: 'Registra decisiones como historial git' },
        { label: 'health', value: 'Detecta cuando falta contexto' },
      ],
    },
    pricing: {
      title: 'Memoria local gratis hoy',
      body: 'Empieza con la CLI y suma memoria cloud cuando el contexto del equipo deba compartirse.',
      freeTitle: 'Gratis',
      freeItems: ['CLI local', 'Memoria offline', 'Commits ilimitados'],
      cloudTitle: 'Cloud pronto',
      cloudItems: ['Memoria vectorial', 'Dashboard', 'Ahorro de tokens', 'Contexto de equipo'],
    },
    install: {
      title: 'Empieza en 30 segundos',
      body: 'Instala globalmente, inicializa PCA y deja que la siguiente sesion arranque con memoria del proyecto.',
      init: '$ pca init',
    },
    footer: {
      title: 'Nunca pierdas contexto otra vez',
      body: 'Git para contexto de IA, creado para equipos que trabajan con agentes.',
      github: 'GitHub',
      npm: 'npm',
      docs: 'Docs',
      built: 'Creado por QuantPartners',
    },
  },
}

const LanguageContext = createContext<{
  lang: Lang
  setLang: (lang: Lang) => void
  t: Translation
} | null>(null)

function useLanguage() {
  const context = useContext(LanguageContext)

  if (!context) {
    throw new Error('useLanguage must be used inside LanguageContext')
  }

  return context
}

function App() {
  const [lang, setLang] = useState<Lang>('en')
  const [active, setActive] = useState(0)
  const [copied, setCopied] = useState(false)
  const touchStartX = useRef<number | null>(null)
  const t = translations[lang]

  const screens = useMemo(
    () => [
      <Hero copied={copied} key="hero" setCopied={setCopied} />,
      <Problem key="problem" />,
      <Mechanism key="mechanism" />,
      <Features key="features" />,
      <Pricing key="pricing" />,
      <Install copied={copied} key="install" setCopied={setCopied} />,
      <Footer key="footer" />,
    ],
    [copied],
  )

  const max = screens.length - 1

  const goTo = useCallback(
    (index: number) => {
      setActive(Math.min(Math.max(index, 0), max))
    },
    [max],
  )

  const next = useCallback(() => goTo(active + 1), [active, goTo])
  const previous = useCallback(() => goTo(active - 1), [active, goTo])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight' || event.key === 'Enter') {
        next()
      }

      if (event.key === 'ArrowLeft') {
        previous()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [next, previous])

  useEffect(() => {
    if (!copied) {
      return
    }

    const timer = window.setTimeout(() => setCopied(false), 1600)
    return () => window.clearTimeout(timer)
  }, [copied])

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    touchStartX.current = event.touches[0]?.clientX ?? null
  }

  const handleTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    const startX = touchStartX.current

    if (startX === null) {
      return
    }

    const endX = event.changedTouches[0]?.clientX ?? startX
    const delta = startX - endX

    if (Math.abs(delta) > 54) {
      if (delta > 0) {
        next()
      } else {
        previous()
      }
    }

    touchStartX.current = null
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      <div
        className="relative h-dvh w-screen overflow-hidden bg-pca-bg text-white"
        onTouchEnd={handleTouchEnd}
        onTouchStart={handleTouchStart}
      >
        <main className="h-full">
          <div
            className="flex h-full transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${active * 100}vw)` }}
          >
            {screens.map((screen, index) => (
              <section
                aria-label={t.nav[index]}
                className="deck-screen grid h-dvh w-screen shrink-0 place-items-center overflow-hidden px-4 py-3"
                key={t.nav[index]}
              >
                <div className="mobile-stage">
                  <PhoneScreen>{screen}</PhoneScreen>
                </div>
                <TabletStage>{screen}</TabletStage>
                <DesktopStage active={index}>
                  {screen}
                </DesktopStage>
              </section>
            ))}
          </div>
        </main>

        <DeckNavigation
          active={active}
          labels={t.nav}
          isLast={active === max}
          next={next}
          previous={previous}
          restart={() => goTo(0)}
        />
      </div>
    </LanguageContext.Provider>
  )
}

function PhoneScreen({ children }: { children: ReactNode }) {
  return (
    <div className="phone-shell">
      <div className="phone-notch" />
      <div className="screen-texture" />
      <div className="relative z-10 flex h-full min-h-0 flex-col px-[24px] pb-[112px] pt-[38px] sm:px-[34px] sm:pb-[122px] sm:pt-[48px]">
        {children}
      </div>
    </div>
  )
}

function TabletStage({ children }: { children: ReactNode }) {
  return (
    <div className="tablet-stage">
      <div className="tablet-shell">
        <div className="tablet-content">{children}</div>
      </div>
    </div>
  )
}

function DesktopStage({
  active,
  children,
}: {
  active: number
  children: ReactNode
}) {
  if (active === 0) {
    return (
      <div className="desktop-stage">
        <DesktopHome />
      </div>
    )
  }

  return (
    <div className="desktop-stage">
      <div className="desktop-shell">
        <div className="desktop-main">{children}</div>
      </div>
    </div>
  )
}

function DesktopHome() {
  const { t } = useLanguage()

  return (
    <div className="desktop-browser">
      <div className="browser-address">
        <span>←</span>
        <span>→</span>
        <span>↻</span>
        <div>pca.dev</div>
      </div>
      <div className="desktop-home-content">
        <header className="desktop-home-top">
          <BrandLogo />
          <LanguageInline />
        </header>
        <section className="desktop-hero-grid">
          <div>
            <h1 className="pixel-title text-pca-cyan">{t.hero.headlineTop} {t.hero.headlineBottom}</h1>
            <p className="desktop-subtext">{t.hero.subtext}</p>
            <TerminalCard className="desktop-terminal">
              <p>
                <span className="text-pca-cyan">$</span>{' '}
                <span>{t.hero.command.slice(2)}</span>
              </p>
              <p className="mt-4 text-pca-cyan">
                <span aria-hidden="true">&#10003;</span> {t.hero.committed}
              </p>
            </TerminalCard>
            <button
              className="install-cta desktop-install"
              onClick={() => copyInstall(() => undefined)}
              type="button"
            >
              {t.hero.install}
            </button>
            <p className="desktop-command-muted">{installCommand}</p>
            <a className="desktop-github" href={githubUrl} rel="noreferrer" target="_blank">
              {t.hero.github} →
            </a>
          </div>
        </section>
        <section className="desktop-problem-block">
          <h2 className="pixel-title text-pca-cyan">{t.problem.titleTop} {t.problem.titleMiddle} {t.problem.titleBottom}</h2>
          <div className="desktop-problem-grid">
            {t.problem.items.map((item, index) => (
              <ProblemSummaryCard index={index} item={item} key={item.text} />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

function BrandLogo({ compact = false }: { compact?: boolean }) {
  return (
    <img
      alt="PCA - Git for AI context"
      className={compact ? 'brand-logo brand-logo-compact' : 'brand-logo'}
      decoding="async"
      src="/pca-logo.png"
    />
  )
}

function LanguageInline() {
  const { lang, setLang } = useLanguage()

  return (
    <div className="language-inline">
      <button className={lang === 'en' ? 'is-active' : ''} onClick={() => setLang('en')} type="button">
        EN
      </button>
      <span>/</span>
      <button className={lang === 'es' ? 'is-active' : ''} onClick={() => setLang('es')} type="button">
        ES
      </button>
    </div>
  )
}

function ProblemSummaryCard({
  index,
  item,
}: {
  index: number
  item: ProblemItem
}) {
  const details = [
    'Every new session starts from scratch.',
    'More context, more tokens, more cost.',
    'Important choices get lost in the void.',
  ]

  return (
    <Surface className="problem-summary-card">
      <ProblemIcon icon={item.icon} />
      <div>
        <p>{item.text}</p>
        <span>{details[index]}</span>
      </div>
    </Surface>
  )
}

function Hero({
  copied,
  setCopied,
}: {
  copied: boolean
  setCopied: (copied: boolean) => void
}) {
  const { t } = useLanguage()

  return (
    <div className="flex h-full min-h-0 flex-col">
      <TopBar />
      <div className="grid min-h-0 flex-1 content-center gap-[clamp(18px,3.1svh,26px)] pb-2 pt-[clamp(28px,4.8svh,42px)]">
        <div>
          <h1 className="pixel-title text-[clamp(44px,11.4vw,56px)] leading-[1.08] text-pca-cyan">
            <span className="block">{t.hero.headlineTop}</span>
            <span className="block">{t.hero.headlineBottom}</span>
          </h1>
          <p className="mt-[clamp(16px,2.5svh,22px)] font-mono text-[clamp(13px,3.6vw,17px)] leading-relaxed text-pca-muted">
            {t.hero.subtext}
          </p>
        </div>

        <TerminalCard className="p-[clamp(18px,4.8vw,24px)] text-[clamp(13px,3.6vw,17px)]">
          <p>
            <span className="text-pca-cyan">$</span>{' '}
            <span className="break-words text-white">{t.hero.command.slice(2)}</span>
          </p>
          <p className="mt-4 text-pca-cyan">
            <span aria-hidden="true">✓</span> {t.hero.committed}
          </p>
        </TerminalCard>

        <div className="grid gap-[clamp(10px,1.8svh,15px)]">
          <button
            className="install-cta min-h-[58px] w-full px-5 font-mono text-[clamp(19px,5.1vw,24px)] font-bold"
            onClick={() => copyInstall(setCopied)}
            type="button"
          >
            {copied ? t.meta.copied : t.hero.install}
          </button>
          <button
            className="w-full break-words px-2 text-center font-mono text-[clamp(11px,3.2vw,14px)] leading-relaxed text-pca-muted transition hover:text-white"
            onClick={() => copyInstall(setCopied)}
            type="button"
            aria-label={t.meta.copyCommand}
          >
            {installCommand}
          </button>
          <a
            className="block text-center font-mono text-[clamp(14px,3.8vw,17px)] text-pca-cyan transition hover:text-[#7cedff]"
            href={githubUrl}
            rel="noreferrer"
            target="_blank"
          >
            {t.hero.github}
          </a>
        </div>
      </div>
    </div>
  )
}

function TopBar() {
  const { lang, setLang, t } = useLanguage()

  return (
    <header className="flex shrink-0 items-center justify-between">
      <button
        aria-label="PCA"
        className="brand-logo-button"
        type="button"
      >
        <BrandLogo compact />
      </button>
      <div aria-label={t.meta.language} className="flex items-center gap-2 font-mono text-[clamp(12px,3.4vw,16px)]">
        <button
          className={lang === 'en' ? 'text-pca-cyan' : 'text-pca-muted'}
          onClick={() => setLang('en')}
          type="button"
        >
          EN
        </button>
        <span className="text-pca-muted">/</span>
        <button
          className={lang === 'es' ? 'text-pca-cyan' : 'text-pca-muted'}
          onClick={() => setLang('es')}
          type="button"
        >
          ES
        </button>
      </div>
    </header>
  )
}

function Problem() {
  const { t } = useLanguage()

  return (
    <div className="flex h-full min-h-0 flex-col justify-center gap-[clamp(28px,5svh,42px)]">
      <h2 className="pixel-title text-[clamp(46px,13.5vw,58px)] leading-[1.12] text-pca-cyan">
        <span className="block">{t.problem.titleTop}</span>
        <span className="block">{t.problem.titleMiddle}</span>
        <span className="block">{t.problem.titleBottom}</span>
      </h2>
      <div className="grid gap-[clamp(18px,3.2svh,28px)]">
        {t.problem.items.map((item) => (
          <ProblemCard item={item} key={item.text} />
        ))}
      </div>
    </div>
  )
}

function ProblemCard({ item }: { item: ProblemItem }) {
  return (
    <Surface className="grid min-h-[112px] grid-cols-[82px_1fr] items-center gap-4 p-5">
      <div className="grid place-items-center border-r border-pca-cyan/35 pr-4 text-pca-cyan">
        <ProblemIcon icon={item.icon} />
      </div>
      <p className="font-mono text-[clamp(17px,4.8vw,21px)] leading-[1.45] text-white">{item.text}</p>
    </Surface>
  )
}

function Mechanism() {
  const { t } = useLanguage()

  return (
    <ContentScreen>
      <p className="font-mono text-sm uppercase text-pca-cyan">{t.solution.kicker}</p>
      <h2 className="pixel-title mt-3 text-[clamp(32px,9vw,40px)] leading-[1.08] text-pca-cyan">
        {t.solution.title}
      </h2>
      <p className="mt-4 font-sans text-[clamp(14px,3.8vw,17px)] leading-relaxed text-pca-muted">{t.solution.body}</p>
      <TerminalCard className="mt-6 text-[clamp(13px,3.5vw,17px)]">
        {t.solution.lines.map((line) => (
          <p className="terminal-line-static" key={line}>
            {line}
          </p>
        ))}
      </TerminalCard>
    </ContentScreen>
  )
}

function Features() {
  const { t } = useLanguage()

  return (
    <ContentScreen>
      <h2 className="pixel-title text-[clamp(38px,10.5vw,48px)] leading-[1.08] text-pca-cyan">{t.features.title}</h2>
      <p className="mt-5 font-sans text-[clamp(15px,4vw,19px)] leading-relaxed text-pca-muted">{t.features.body}</p>
      <div className="mt-7 grid gap-3">
        {t.features.items.map((item) => (
          <Surface className="p-4" key={item.label}>
            <p className="font-mono text-xs uppercase text-pca-cyan">{item.label}</p>
            <p className="mt-2 font-mono text-[clamp(15px,4vw,19px)] leading-relaxed text-white">{item.value}</p>
          </Surface>
        ))}
      </div>
    </ContentScreen>
  )
}

function Pricing() {
  const { t } = useLanguage()

  return (
    <ContentScreen>
      <h2 className="pixel-title text-[clamp(38px,10vw,46px)] leading-[1.08] text-pca-cyan">{t.pricing.title}</h2>
      <p className="mt-5 font-sans text-[clamp(15px,4vw,19px)] leading-relaxed text-pca-muted">{t.pricing.body}</p>
      <div className="mt-7 grid gap-4">
        <PlanCard items={t.pricing.freeItems} title={t.pricing.freeTitle} />
        <PlanCard items={t.pricing.cloudItems} muted title={t.pricing.cloudTitle} />
      </div>
    </ContentScreen>
  )
}

function Install({
  copied,
  setCopied,
}: {
  copied: boolean
  setCopied: (copied: boolean) => void
}) {
  const { t } = useLanguage()

  return (
    <ContentScreen center>
      <h2 className="pixel-title text-[clamp(44px,12vw,56px)] leading-[1.08] text-pca-cyan">{t.install.title}</h2>
      <p className="mt-5 font-sans text-[clamp(15px,4vw,19px)] leading-relaxed text-pca-muted">{t.install.body}</p>
      <button
        className="install-cta mt-8 min-h-[70px] w-full px-5 font-mono text-[clamp(20px,5.6vw,30px)] font-bold"
        onClick={() => copyInstall(setCopied)}
        type="button"
      >
        {copied ? t.meta.copied : t.hero.install}
      </button>
      <TerminalCard className="mt-5 text-left">
        <p>{installCommand}</p>
        <p className="mt-4 text-pca-cyan">{t.install.init}</p>
      </TerminalCard>
    </ContentScreen>
  )
}

function Footer() {
  const { t } = useLanguage()

  return (
    <ContentScreen center>
      <h2 className="pixel-title text-[clamp(38px,10.5vw,48px)] leading-[1.08] text-pca-cyan">{t.footer.title}</h2>
      <p className="mt-5 font-sans text-[clamp(15px,4vw,19px)] leading-relaxed text-pca-muted">{t.footer.body}</p>
      <div className="mt-8 grid gap-4 font-mono text-[clamp(17px,4.7vw,22px)]">
        <a className="text-pca-cyan" href={githubUrl} rel="noreferrer" target="_blank">
          {t.footer.github}
        </a>
        <a className="text-pca-cyan" href={npmUrl} rel="noreferrer" target="_blank">
          {t.footer.npm}
        </a>
        <a className="text-pca-cyan" href="#docs">
          {t.footer.docs}
        </a>
      </div>
      <p className="mt-10 font-mono text-sm text-pca-muted">{t.footer.built}</p>
    </ContentScreen>
  )
}

function ContentScreen({
  center = false,
  children,
}: {
  center?: boolean
  children: ReactNode
}) {
  return (
    <div className={`flex h-full min-h-0 flex-col ${center ? 'justify-center text-center' : 'justify-center'}`}>
      {children}
    </div>
  )
}

function Surface({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-xl border border-pca-cyan/55 bg-card ${className}`}>{children}</div>
}

function TerminalCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <Surface className={`p-[clamp(22px,5.6vw,30px)] font-mono text-[clamp(14px,4vw,20px)] leading-relaxed text-white ${className}`}>
      {children}
    </Surface>
  )
}

function PlanCard({
  items,
  muted = false,
  title,
}: {
  items: string[]
  muted?: boolean
  title: string
}) {
  return (
    <Surface className={`p-5 ${muted ? 'border-pca-cyan/30' : ''}`}>
      <p className="font-mono text-[clamp(20px,5.4vw,28px)] font-bold text-pca-cyan">{title}</p>
      <ul className="mt-4 space-y-2 font-mono text-[clamp(14px,3.7vw,18px)] text-white">
        {items.map((item) => (
          <li key={item}>
            <span className="text-pca-cyan">✓</span> {item}
          </li>
        ))}
      </ul>
    </Surface>
  )
}

function DeckNavigation({
  active,
  isLast,
  labels,
  next,
  previous,
  restart,
}: {
  active: number
  isLast: boolean
  labels: string[]
  next: () => void
  previous: () => void
  restart: () => void
}) {
  const { t } = useLanguage()

  return (
    <div className="deck-navigation pointer-events-none fixed inset-x-0 bottom-6 z-20 grid place-items-center gap-3 px-4">
      <div className="deck-swipe-control pointer-events-auto">
      <SlideButton
        aria-label={isLast ? labels[0] : t.meta.next}
        completeLabel={t.meta.done}
        key={active}
        label={isLast ? t.nav[0] : t.meta.slide}
        onSlideComplete={isLast ? restart : next}
      />
      </div>
      <div className="deck-progress-controls flex items-center justify-center gap-3">
        <button
          aria-label={labels[active - 1] ?? labels[0]}
          className="pointer-events-auto hidden h-10 w-10 place-items-center rounded-full bg-black/70 font-mono text-pca-cyan lg:grid"
        disabled={active === 0}
        onClick={previous}
        type="button"
      >
        ←
      </button>
      <div className="flex gap-2">
        {labels.map((label, index) => (
          <span
            aria-label={label}
            className={`h-1.5 rounded-full transition-all ${index === active ? 'w-8 bg-pca-cyan' : 'w-1.5 bg-white/25'}`}
            key={label}
          />
        ))}
      </div>
        <button
          aria-label={labels[active + 1] ?? labels[labels.length - 1]}
          className="pointer-events-auto hidden h-10 w-10 place-items-center rounded-full bg-black/70 font-mono text-pca-cyan lg:grid"
        disabled={active === labels.length - 1}
        onClick={next}
        type="button"
      >
        →
      </button>
      </div>
    </div>
  )
}

function ProblemIcon({ icon }: { icon: ProblemItem['icon'] }) {
  if (icon === 'restart') {
    return (
      <svg className="h-12 w-12" fill="none" viewBox="0 0 48 48" aria-hidden="true">
        <path d="M36 16v10h-10" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
        <path d="M36 26a14 14 0 1 1-4-10" stroke="currentColor" strokeLinecap="round" strokeWidth="3" />
      </svg>
    )
  }

  if (icon === 'trend') {
    return (
      <svg className="h-12 w-12" fill="none" viewBox="0 0 48 48" aria-hidden="true">
        <path d="m8 34 11-11 8 7 13-16" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
        <path d="M30 14h10v10" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
      </svg>
    )
  }

  return (
    <svg className="h-12 w-12" fill="none" viewBox="0 0 48 48" aria-hidden="true">
      <path d="M15 15h18M20 15V9h8v6M18 19l2 20h8l2-20" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
    </svg>
  )
}

async function copyInstall(setCopied: (copied: boolean) => void) {
  try {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(installCommand)
    } else {
      legacyCopy(installCommand)
    }

    setCopied(true)
  } catch {
    legacyCopy(installCommand)
    setCopied(true)
  }
}

function legacyCopy(value: string) {
  const textArea = document.createElement('textarea')
  textArea.value = value
  textArea.setAttribute('readonly', 'true')
  textArea.style.position = 'fixed'
  textArea.style.left = '-9999px'
  document.body.appendChild(textArea)
  textArea.select()

  try {
    document.execCommand('copy')
  } finally {
    document.body.removeChild(textArea)
  }
}

export default App
