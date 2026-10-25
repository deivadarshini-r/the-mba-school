"use client";

import { useEffect, useState } from "react";

type Challenge = {
  category: string;
  title: string;
  description: string;
};

type Mode = "offroad" | "research";
type Phase = "draw" | "research" | "ready" | "speaking" | "finished";

type Settings = {
  speechMinutes: number;
  researchMinutes: number;
  deepResearchOnly: boolean;
  muteSoundEffects: boolean;
};

const DEFAULT_SETTINGS: Settings = {
  speechMinutes: 1,
  researchMinutes: 10,
  deepResearchOnly: false,
  muteSoundEffects: false,
};

const decks: Record<Mode, Challenge[]> = {
  offroad: [
    { category: "Strategy", title: "The discount dilemma", description: "A competitor cuts prices by 25%, and your sales begin to fall. Matching the discount could protect market share but damage your margins. What do you do?" },
    { category: "Leadership", title: "The star performer", description: "Your best salesperson exceeds targets but treats colleagues poorly. Replacing them risks missing targets, while keeping them risks losing the team. How do you handle it?" },
    { category: "Growth", title: "The tempting expansion", description: "A new city offers a major growth opportunity, but entering it would consume most of your available cash. Your existing business is profitable but fragile. Do you expand?" },
    { category: "Competition", title: "The copycat", description: "A larger competitor launches a product almost identical to yours, backed by a much bigger marketing budget. Where would you compete, and where would you refuse to compete?" },
    { category: "Customers", title: "The difficult client", description: "One major client accounts for 35% of your revenue. They demand a costly custom feature that other customers do not need. Refusing may lose the account. What is your move?" },
    { category: "People", title: "The uncomfortable promotion", description: "Your most experienced employee expects a promotion, but a newer colleague appears better suited to lead the team. How do you make the decision?" },
    { category: "Crisis", title: "The public mistake", description: "A product defect affects a small but visible group of customers. Speaking publicly could damage trust in the short term. Staying silent could make things worse. What do you do first?" },
    { category: "Negotiation", title: "One final offer", description: "A supplier raises prices just before your busiest season. You have few alternatives and little negotiating time. How would you approach the conversation?" },
    { category: "Focus", title: "The shiny opportunity", description: "Your team has one quarter to deliver its main product. A major prospect requests a different feature that could open a new market. Do you divert the team?" },
    { category: "Hiring", title: "The perfect résumé", description: "A candidate has an outstanding résumé but gives vague answers about their actual contributions. Another has less experience but demonstrates clear judgment. Who do you hire?" },
    { category: "Cash flow", title: "Profitable but broke", description: "Your company is profitable on paper, but customers pay late and payroll is approaching. What actions would you take, and which tempting options would you avoid?" },
    { category: "Product", title: "The unpopular feature", description: "Your loudest customers demand a feature that would take months to build. Usage data suggests most customers barely use the existing product. Whose needs guide your decision?" },
    { category: "Ethics", title: "The convenient shortcut", description: "A competitor is winning business with claims you believe are misleading. Your team wants to make similar claims to keep up. How do you respond?" },
    { category: "Partnerships", title: "The powerful partner", description: "A large company offers to distribute your product but demands exclusivity for three years. The deal could transform your business or leave you dependent. Would you accept?" },
    { category: "Culture", title: "The silent meeting", description: "Your team agrees with every proposal in meetings but privately raises concerns afterward. A major decision is due tomorrow. How do you uncover genuine disagreement?" },
    { category: "Brand", title: "The viral moment", description: "A humorous post about your business unexpectedly goes viral, bringing attention from an audience you never intended to target. How do you decide whether to embrace it?" },
    { category: "Operations", title: "The fragile system", description: "One employee understands a critical process that nobody else can run. Documenting it will take time your team doesn't feel it has. What do you do?" },
    { category: "Risk", title: "The big bet", description: "You can invest heavily in one promising product or spread the budget across three smaller experiments. Your runway is limited. How do you choose?" },
    { category: "Customer trust", title: "The refund request", description: "A customer demands a refund outside your policy after a disappointing experience. Granting it may set a precedent; refusing may turn a small problem into a public dispute. What matters most?" },
    { category: "Decision-making", title: "The missing information", description: "Your team must choose a direction by Friday, but two critical data points won't arrive for another month. Waiting has a cost too. How do you decide under uncertainty?" },
  ],
  research: [
    { category: "Market research", title: "Is the market real?", description: "A report predicts rapid growth in a new market. What independent data would you seek, which assumptions would you test, and how would you estimate actual demand?" },
    { category: "Unit economics", title: "Growth or profit?", description: "A subscription business is gaining customers quickly but spends heavily to acquire them. Which metrics would help you determine whether its growth is sustainable?" },
    { category: "Pricing", title: "What will customers pay?", description: "Your team believes customers would pay more for a premium version. Design a research experiment to estimate willingness to pay before changing prices." },
    { category: "Competition", title: "The market leader", description: "An established company dominates your target market. How would you investigate underserved customers, switching costs, competitive advantages, and possible entry points?" },
    { category: "Customer behaviour", title: "The disappearing users", description: "Many customers sign up, but few return after the first week. What data would help distinguish poor onboarding from weak product value or the wrong target audience?" },
    { category: "Investment", title: "Where should capital go?", description: "You can invest in marketing, product development, or customer support, but can fund only one. What evidence and comparison framework would you use to choose?" },
    { category: "Market sizing", title: "A million potential customers?", description: "A founder claims their product has ten million potential customers. How would you independently estimate the realistically reachable market from the bottom up?" },
    { category: "Experiment design", title: "Did the campaign work?", description: "Sales rose 18% after a marketing campaign, but a seasonal promotion ran at the same time. How would you investigate whether the campaign caused the increase?" },
    { category: "Retention", title: "The leaky bucket", description: "A subscription service attracts new customers but loses many after three months. Which customer cohorts and behavioural patterns would you analyse first?" },
    { category: "Business models", title: "Free versus paid", description: "A software product has many free users but few paying customers. What evidence would help you assess whether to introduce limits, add premium features, or target a different audience?" },
    { category: "Operations", title: "The bottleneck", description: "Order volume has doubled, but delivery times have tripled. Map the operational data you would collect to identify the constraint before recommending a fix." },
    { category: "Consumer insights", title: "What customers really want", description: "In interviews, customers say they want more features, yet usage of existing features is low. How would you investigate the gap between what customers say and what they do?" },
    { category: "Pricing research", title: "The price increase", description: "A proposed 10% price increase could improve margins but reduce demand. What historical data, customer segments, and experiments would help estimate the likely impact?" },
    { category: "Financial analysis", title: "Revenue is rising", description: "Revenue is up 30%, but cash reserves are falling. Which financial statements and operating metrics would you examine to explain the divergence?" },
    { category: "Channel strategy", title: "Where do customers come from?", description: "Your company sells through online ads, referrals, and retail partners. How would you compare the true cost, customer quality, and long-term value of each channel?" },
    { category: "Product research", title: "Build or buy?", description: "A critical product capability could be built internally or purchased from a vendor. What would you compare beyond the initial price to make a sound decision?" },
    { category: "Forecasting", title: "The optimistic forecast", description: "Your sales forecast assumes every month will outperform the previous one. How would you create a more defensible forecast and test its key assumptions?" },
    { category: "Segmentation", title: "Not every customer", description: "Two customer groups generate similar revenue, but one requires twice as much support. What additional evidence would you use to decide which group to prioritise?" },
    { category: "Competitive research", title: "The competitor's advantage", description: "A rival charges more yet appears to retain customers better. How would you investigate why customers stay, what value they perceive, and whether the advantage can be replicated?" },
    { category: "Decision-making", title: "The evidence gap", description: "Leadership wants a recommendation tomorrow, but the available evidence is incomplete. How would you separate facts from assumptions and communicate your confidence?" },
  ],
};

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export default function Home() {
  const [mode, setMode] = useState<Mode>("offroad");
  const [topic, setTopic] = useState("All topics");
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [drawnTitles, setDrawnTitles] = useState<string[]>([]);
  const [phase, setPhase] = useState<Phase>("draw");
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settingsLoaded, setSettingsLoaded] = useState(false);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("mba-school-settings");
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<Settings>;
        setSettings({
          speechMinutes: Math.max(1, Math.min(60, Math.round(parsed.speechMinutes ?? 1))),
          researchMinutes: Math.max(1, Math.min(60, Math.round(parsed.researchMinutes ?? 10))),
          deepResearchOnly: parsed.deepResearchOnly ?? false,
          muteSoundEffects: parsed.muteSoundEffects ?? false,
        });
      }
    } catch {
      // Use defaults if saved settings cannot be read.
    }
    setSettingsLoaded(true);
  }, []);

  useEffect(() => {
    if (settingsLoaded) {
      localStorage.setItem("mba-school-settings", JSON.stringify(settings));
    }
  }, [settings, settingsLoaded]);

  useEffect(() => {
    if (phase !== "research" && phase !== "speaking") return;

    const timer = window.setInterval(() => {
      setSecondsLeft((current) => {
        if (current <= 1) {
          window.clearInterval(timer);

          if (!settings.muteSoundEffects) {
            try {
              const audio = new window.AudioContext();
              const oscillator = audio.createOscillator();
              const gain = audio.createGain();

              oscillator.type = "sine";
              oscillator.frequency.value = 660;
              gain.gain.value = 0.06;
              oscillator.connect(gain);
              gain.connect(audio.destination);
              oscillator.start();
              oscillator.stop(audio.currentTime + 0.18);
              oscillator.onended = () => void audio.close();
            } catch {
              // Audio is optional.
            }
          }

          setPhase(phase === "research" ? "ready" : "finished");
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [phase, settings.muteSoundEffects]);

  const topics = Array.from(new Set(decks[mode].map((item) => item.category))).sort();

  const filteredDeck =
    topic === "All topics"
      ? decks[mode]
      : decks[mode].filter((item) => item.category === topic);

  function updateMinutes(key: "speechMinutes" | "researchMinutes", amount: number) {
    setSettings((current) => ({
      ...current,
      [key]: Math.max(1, Math.min(60, current[key] + amount)),
    }));
  }

  function resetChallenge() {
    setPhase("draw");
    setSecondsLeft(0);
    setSelectedCard(null);
    setChallenge(null);
  }

  function switchMode(nextMode: Mode) {
    setMode(nextMode);
    setTopic("All topics");
    setDrawnTitles([]);
    resetChallenge();
  }

  function drawCard(index: number) {
    if (selectedCard === index && phase === "draw") {
      setSelectedCard(null);
      setChallenge(null);
      return;
    }

    let available = filteredDeck.filter((item) => !drawnTitles.includes(item.title));

    if (available.length === 0) {
      available = filteredDeck;
      setDrawnTitles([]);
    }

    if (available.length > 1 && challenge) {
      const withoutCurrent = available.filter((item) => item.title !== challenge.title);
      if (withoutCurrent.length > 0) available = withoutCurrent;
    }

    const next = available[Math.floor(Math.random() * available.length)];

    setChallenge(next);
    setSelectedCard(index);
    setDrawnTitles((previous) => [...previous, next.title]);
    setPhase("draw");
    setSecondsLeft(0);
  }

  function startResearch() {
    setSecondsLeft(settings.researchMinutes * 60);
    setPhase("research");
  }

  function startSpeaking() {
    setSecondsLeft(settings.speechMinutes * 60);
    setPhase("speaking");
  }

  return (
    <main className="min-h-screen bg-[#faf9f6] px-6 py-8 text-[#21483a] sm:px-10 lg:px-16">
      <header className="flex flex-wrap items-start justify-between gap-5">
        <div>
          <h1 className="font-serif text-3xl sm:text-[34px]">The MBA School</h1>
          <p className="font-serif text-lg">A gym for business judgement</p>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-sm">
          <a
            href="https://www.instagram.com/who.is.this.deiva/"
            target="_blank"
            rel="noreferrer"
            className="hover:underline"
          >
            Instagram
          </a>
          <a
            href="https://www.linkedin.com/in/deiva-darshini-r-0784a0424/"
            target="_blank"
            rel="noreferrer"
            className="hover:underline"
          >
            LinkedIn
          </a>
          <span className="hidden text-xs text-[#21483a]/60 xl:inline">Made by R Deiva Darshini</span>
          <button
            onClick={() => setSettingsOpen(true)}
            className="border border-[#21483a]/30 px-4 py-2 transition hover:bg-[#21483a] hover:text-[#faf9f6]"
          >
            ⚙ Settings
          </button>
        </div>
      </header>

      <section className="mx-auto mt-10 max-w-3xl">
        <p className="text-center font-serif text-lg text-[#171717]">
          Choose a topic. Draw a challenge. Think for yourself.
        </p>

        <div className="mt-7 flex flex-wrap justify-center gap-4">
          <button
            onClick={() => switchMode("offroad")}
            aria-pressed={mode === "offroad"}
            className={`w-64 px-5 py-5 font-serif text-lg transition ${
              mode === "offroad"
                ? "bg-[#21483a] text-[#faf9f6]"
                : "bg-[#dedddb] hover:bg-[#d2d0cb]"
            }`}
          >
            Off the road
            <span className="mt-1 block text-sm">Keeping you on your toes.</span>
          </button>

          <button
            onClick={() => switchMode("research")}
            aria-pressed={mode === "research"}
            className={`w-64 px-5 py-5 font-serif text-lg transition ${
              mode === "research"
                ? "bg-[#21483a] text-[#faf9f6]"
                : "bg-[#dedddb] hover:bg-[#d2d0cb]"
            }`}
          >
            Research
            <span className="mt-1 block text-sm">Take your time.</span>
          </button>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <label htmlFor="topic-select" className="text-sm">
            Choose a topic
          </label>
          <select
            id="topic-select"
            value={topic}
            onChange={(event) => {
              setTopic(event.target.value);
              setDrawnTitles([]);
              resetChallenge();
            }}
            className="min-w-56 border border-[#21483a]/30 bg-transparent px-4 py-2 text-sm outline-none focus:border-[#21483a]"
          >
            <option value="All topics">All topics</option>
            {topics.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </section>

      <section className="mx-auto mt-10 grid max-w-4xl grid-cols-1 gap-5 sm:grid-cols-3">
        {[0, 1, 2].map((index) => {
          const isSelected = selectedCard === index && challenge !== null;

          return (
            <button
              key={index}
              onClick={() => drawCard(index)}
              aria-label={`Draw challenge card ${index + 1}`}
              className="group h-64 [perspective:1000px]"
            >
              <div
                className={`relative h-full w-full transition-transform duration-700 [transform-style:preserve-3d] ${
                  isSelected ? "[transform:rotateY(180deg)]" : ""
                }`}
              >
                <div
                  className="absolute inset-0 flex items-center justify-center bg-[#21483a] [backface-visibility:hidden]"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#faf9f6] bg-[#dedddb]">
                    <span className="h-2 w-2 rounded-full bg-[#faf9f6]" />
                  </span>
                </div>

                <div
                  className="absolute inset-0 flex flex-col items-center justify-center overflow-y-auto bg-[#21483a] px-6 py-6 text-center text-[#faf9f6] [backface-visibility:hidden] [transform:rotateY(180deg)]"
                >
                  {isSelected && challenge && (
                    <>
                      <p className="mb-4 text-xs uppercase tracking-[0.2em] text-[#d8d5ca]">
                        {challenge.category}
                      </p>
                      <h2 className="mb-4 font-serif text-2xl">{challenge.title}</h2>
                      <p className="text-sm leading-7">{challenge.description}</p>
                      <p className="mt-5 text-xs text-[#d8d5ca]">Your challenge is ready below</p>
                    </>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </section>

      {challenge && selectedCard !== null && (
        <section className="mx-auto mt-8 max-w-[850px] border-t border-[#21483a]/20 pt-7">
          {phase === "draw" && (
            <div className="grid gap-6 sm:grid-cols-[1fr_auto] sm:items-center sm:gap-8">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-[#77776f]">Your challenge</p>
                <h2 className="mt-2 font-serif text-2xl">{challenge.title}</h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-[#343a35]">
                  {challenge.description}
                </p>
              </div>
              <button
                onClick={startResearch}
                className="bg-[#21483a] px-6 py-4 text-sm text-[#faf9f6] transition hover:bg-[#2b5948]"
              >
                Start research
                <span className="mt-1 block text-xs text-[#d8d5ca]">
                  {settings.researchMinutes} min
                </span>
              </button>
            </div>
          )}

          {phase === "research" && (
            <div className="grid gap-6 sm:grid-cols-[1fr_auto] sm:items-center sm:gap-8">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-[#77776f]">Research in progress</p>
                <h2 className="mt-2 font-serif text-2xl">{challenge.title}</h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-[#343a35]">
                  {challenge.description}
                </p>
                <p className="mt-3 text-sm text-[#21483a]/75">
                  Form a view, find evidence, and decide what matters most.
                </p>
              </div>
              <div className="min-w-44 bg-[#21483a] px-7 py-5 text-center text-[#faf9f6]">
                <p className="text-xs uppercase tracking-[0.2em] text-[#d8d5ca]">Research time</p>
                <p className="mt-2 font-serif text-4xl tabular-nums">{formatTime(secondsLeft)}</p>
                {!settings.deepResearchOnly && (
                  <button
                    onClick={() => setPhase("ready")}
                    className="mt-4 text-xs text-[#d8d5ca] underline"
                  >
                    Finish research early
                  </button>
                )}
              </div>
            </div>
          )}

          {phase === "ready" && (
            <div className="mx-auto max-w-xl py-3 text-center">
              <p className="text-xs uppercase tracking-[0.2em]">{challenge.category}</p>
              <h2 className="mt-2 font-serif text-3xl">{challenge.title}</h2>
              <p className="mt-4 text-sm text-[#343a35]">Research done.</p>
              <div className="my-6 border-y border-[#21483a]/20 py-5">
                <p className="text-sm text-[#343a35]">
                  Up next: {settings.speechMinutes} {settings.speechMinutes === 1 ? "min" : "mins"} to speak.
                </p>
              </div>
              <button
                onClick={startSpeaking}
                className="bg-[#21483a] px-8 py-4 text-[#faf9f6] transition hover:bg-[#2b5948]"
              >
                I&apos;m ready to speak
              </button>
              <p className="mt-3 text-xs text-[#77776f]">Click to start the speaking timer.</p>
            </div>
          )}

          {phase === "speaking" && (
            <div className="mx-auto max-w-xl py-3 text-center">
              <p className="text-xs uppercase tracking-[0.2em]">Speak your answer</p>
              <h2 className="mt-2 font-serif text-3xl">{challenge.title}</h2>
              <p className="mt-3 text-sm text-[#343a35]">
                Make your case. Explain your reasoning. State what would change your mind.
              </p>
              <p className="my-6 font-serif text-6xl tabular-nums">{formatTime(secondsLeft)}</p>
              <button
                onClick={() => setPhase("finished")}
                className="border border-[#21483a] px-6 py-3 text-sm hover:bg-[#21483a] hover:text-[#faf9f6]"
              >
                Finish speaking
              </button>
            </div>
          )}

          {phase === "finished" && (
            <div className="mx-auto max-w-xl py-3 text-center">
              <p className="text-xs uppercase tracking-[0.2em]">Session complete</p>
              <h2 className="mt-2 font-serif text-3xl">{challenge.title}</h2>
              <p className="mt-4 text-sm text-[#343a35]">
                Reflect: what was your conclusion, and what evidence mattered most?
              </p>
              <button
                onClick={resetChallenge}
                className="mt-6 bg-[#21483a] px-7 py-4 text-[#faf9f6] hover:bg-[#2b5948]"
              >
                Draw another challenge
              </button>
            </div>
          )}
        </section>
      )}

      <p className="mt-10 text-center font-serif text-sm text-[#21483a]/70">
        One challenge at a time. Think before you act.
      </p>

      {settingsOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 px-6 py-8"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSettingsOpen(false);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="settings-title"
            className="w-full max-w-lg bg-[#faf9f6] p-8 text-[#21483a] shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <h2 id="settings-title" className="font-serif text-3xl">Settings</h2>
              <button
                onClick={() => setSettingsOpen(false)}
                aria-label="Close settings"
                className="px-2 py-1 text-2xl leading-none hover:bg-[#dedddb]"
              >
                ×
              </button>
            </div>

            <p className="mt-3 text-sm text-[#66685f]">Timer lengths in whole minutes.</p>

            <div className="mt-7 space-y-6">
              <div className="flex items-center justify-between gap-4 border-b border-[#21483a]/15 pb-5">
                <div>
                  <p className="font-medium">Speech</p>
                  <p className="mt-1 text-xs text-[#66685f]">Time to present your answer</p>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => updateMinutes("speechMinutes", -1)}
                    disabled={settings.speechMinutes <= 1}
                    aria-label="Decrease speech timer"
                    className="h-9 w-9 border border-[#21483a]/30 disabled:opacity-30"
                  >
                    −
                  </button>
                  <span className="w-16 text-center font-serif text-lg">
                    {settings.speechMinutes} {settings.speechMinutes === 1 ? "min" : "mins"}
                  </span>
                  <button
                    onClick={() => updateMinutes("speechMinutes", 1)}
                    disabled={settings.speechMinutes >= 60}
                    aria-label="Increase speech timer"
                    className="h-9 w-9 border border-[#21483a]/30 disabled:opacity-30"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 border-b border-[#21483a]/15 pb-5">
                <div>
                  <p className="font-medium">Research</p>
                  <p className="mt-1 text-xs text-[#66685f]">Time to think and research</p>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => updateMinutes("researchMinutes", -1)}
                    disabled={settings.researchMinutes <= 1}
                    aria-label="Decrease research timer"
                    className="h-9 w-9 border border-[#21483a]/30 disabled:opacity-30"
                  >
                    −
                  </button>
                  <span className="w-16 text-center font-serif text-lg">
                    {settings.researchMinutes} {settings.researchMinutes === 1 ? "min" : "mins"}
                  </span>
                  <button
                    onClick={() => updateMinutes("researchMinutes", 1)}
                    disabled={settings.researchMinutes >= 60}
                    aria-label="Increase research timer"
                    className="h-9 w-9 border border-[#21483a]/30 disabled:opacity-30"
                  >
                    +
                  </button>
                </div>
              </div>

              <label className="flex cursor-pointer items-start justify-between gap-6">
                <span>
                  <span className="block font-medium">Deep research only</span>
                  <span className="mt-1 block text-xs text-[#66685f]">
                    Keep the full research timer and hide the early-finish option.
                  </span>
                </span>
                <input
                  type="checkbox"
                  checked={settings.deepResearchOnly}
                  onChange={(event) =>
                    setSettings((current) => ({
                      ...current,
                      deepResearchOnly: event.target.checked,
                    }))
                  }
                  className="mt-1 h-5 w-5 accent-[#21483a]"
                />
              </label>

              <label className="flex cursor-pointer items-start justify-between gap-6">
                <span>
                  <span className="block font-medium">Mute sound effects</span>
                  <span className="mt-1 block text-xs text-[#66685f]">
                    Silence the optional timer sound.
                  </span>
                </span>
                <input
                  type="checkbox"
                  checked={settings.muteSoundEffects}
                  onChange={(event) =>
                    setSettings((current) => ({
                      ...current,
                      muteSoundEffects: event.target.checked,
                    }))
                  }
                  className="mt-1 h-5 w-5 accent-[#21483a]"
                />
              </label>
            </div>

            <p className="mt-6 text-xs text-[#66685f]">Settings are saved in this browser.</p>
            <button
              onClick={() => setSettingsOpen(false)}
              className="mt-5 w-full bg-[#21483a] px-6 py-4 font-medium text-[#faf9f6] transition hover:bg-[#2b5948]"
            >
              Done
            </button>
          </section>
        </div>
      )}
    </main>
  );
}