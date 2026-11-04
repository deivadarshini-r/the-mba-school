"use client";

import { useEffect, useRef, useState } from "react";

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
    // --- BATCH 1: Strategy & Competition (1–25) ---
    {
      category: "Strategy & Competition",
      title: "Cost Leadership vs. Differentiation Trap",
      description:
        "Role: Founder & CEO of a B2B Logistics SaaS\n\nSituation: A well-funded competitor enters your space, offering a clone of your core software at 60% lower pricing. Key enterprise clients are reaching out asking for price-matching, threatening to switch during their upcoming renewals.\n\nThe Decision: Do you discount your price to protect market share, or keep pricing firm while doubling down on premium support, custom integrations, and specialized feature development? Defend your strategy and 48-hour action plan.",
    },
    {
      category: "Strategy & Competition",
      title: "Disruption Defense",
      description:
        "Role: Chief Strategy Officer at a Traditional Retail Bank\n\nSituation: A fast-growing Fintech startup introduces a zero-fee, high-yield digital account that is rapidly draining your millennial and Gen-Z deposit base. Your current IT infrastructure cannot support a similar zero-fee digital product without cannibalizing 15% of overall interest income.\n\nThe Decision: Do you launch an independent digital-only sub-brand with lower margins, acquire a smaller fintech competitor to fast-track modern features, or ignore the low-tier deposit drain and focus purely on high-net-worth customers? Defend your trade-off.",
    },
    {
      category: "Strategy & Competition",
      title: "The Incumbent’s Dilemma",
      description:
        "Role: VP of Product at a Legacy On-Premise Enterprise Software Company\n\nSituation: Cloud-native competitors are eating into your market share. Moving fully to a Cloud/SaaS subscription model will boost long-term enterprise valuation, but will destroy your short-term cash flow and revenue targets for the next 6 quarters.\n\nThe Decision: Do you force a hard transition to Cloud/SaaS immediately, run a hybrid dual-model despite team strain and customer confusion, or stick with high-margin On-Premise software and milk the cash cow? Justify your choice.",
    },
    {
      category: "Strategy & Competition",
      title: "Defender vs. Attacker Pricing",
      description:
        "Role: CEO of a Regional Quick-Service Restaurant (QSR) Chain\n\nSituation: A massive global fast-food giant launches an aggressive localized value menu across 80% of your territory, cutting prices by 20% on core items to starve out local chains.\n\nThe Decision: Do you launch a counter-pricing war on core menu items, introduce localized high-value bundles, or pivot marketing entirely to locally-sourced quality and brand heritage without changing prices? Explain your rationale.",
    },
    {
      category: "Strategy & Competition",
      title: "Platform Disintermediation",
      description:
        "Role: Head of Marketplace Strategy at an On-Demand Home Services Platform\n\nSituation: Top-performing service providers (electricians, plumbers) and loyal customers are regularly bypassing your platform to transact directly off-app, avoiding your 15% commission fee.\n\nThe Decision: Do you implement strict penalties and automated messaging filters to catch off-platform transactions, or reduce commission rates while building exclusive in-app value-adds (like insurance and automated scheduling) to incentivize staying on-platform? Defend your strategy.",
    },
    {
      category: "Strategy & Competition",
      title: "Network Effects Flywheel Friction",
      description:
        "Role: Co-Founder of a Two-Sided B2B Wholesale Marketplace\n\nSituation: You are experiencing a classic cold-start problem in a new geographic market: supplier listings are low because buyers aren't active, and buyers leave because selection is sparse. Your remaining cash burn gives you 3 months to demonstrate liquidity.\n\nThe Decision: Do you subsidize the supply side by paying vendors a fixed fee just to list inventory, or subsidize the demand side by offering deep buyer discounts on purchases? Explain your strategic focus.",
    },
    {
      category: "Strategy & Competition",
      title: "Core vs. Adjacency Expansion",
      description:
        "Role: CEO of a Successful D2C Organic Skincare Brand\n\nSituation: Your core line of organic face serums has achieved strong profitability, but growth in the core segment is slowing. Investors are pushing for immediate entry into organic hair care, while your product team argues for expanding into international skincare markets first.\n\nThe Decision: Do you pursue horizontal line expansion (Hair Care in existing region) or geographical expansion (Core Skincare in new international markets)? Defend your decision based on risk and operational bandwidth.",
    },
    {
      category: "Strategy & Competition",
      title: "Defensive Moat Construction",
      description:
        "Role: Chief Product Officer at an AI-Powered Document Processing Tool\n\nSituation: Big Tech infrastructure providers (e.g., cloud platforms) have just integrated native AI document OCR directly into their base developer suites for free, rendering your core technology a commoditized feature.\n\nThe Decision: Do you move up-market to build specialized, deep workflow automation for strictly regulated industries (e.g., healthcare/legal compliance), or pivot to a consumer-facing productivity app? Justify your defensive positioning.",
    },
    {
      category: "Strategy & Competition",
      title: "Cannibalization vs. Cannibalization by Rivals",
      description:
        "Role: VP of Business Unit at a Top Consumer Electronics Manufacturer\n\nSituation: Your engineering team has created a breakthrough budget device that performs 85% as well as your flagship product, but costs 50% less to build. Launching it will certainly eat into your high-margin flagship sales.\n\nThe Decision: Do you launch the budget device immediately to preempt competitors from filling that price gap, or suppress/delay the release to protect flagship profit margins? Defend your position.",
    },
    {
      category: "Strategy & Competition",
      title: "Geographic Retrenchment",
      description:
        "Role: Managing Director of a Global Ride-Hailing Company\n\nSituation: You are currently #2 in Southeast Asia, burning $10M per month against a heavily dominant local competitor backed by regional conglomerates. Your home market in North America remains highly profitable but needs investment to stay ahead.\n\nThe Decision: Do you execute a total exit/asset swap with the local rival in Southeast Asia to focus entirely on defending your profitable core home market, or maintain the burned presence to keep strategic global leverage? Defend your call.",
    },
    {
      category: "Strategy & Competition",
      title: "Ecosystem Encroachment",
      description:
        "Role: Founder of an E-commerce Analytics Plugin\n\nSituation: The major e-commerce platform your tool runs on announces it is building a native analytics suite that replicates 70% of your tool's features and will include it free for all store owners.\n\nThe Decision: Do you rapidly re-engineer your product to integrate with rival e-commerce platforms to diversify platform risk, or deepen your analytics for large enterprise merchants on your current platform who need advanced capabilities? Defend your roadmap decision.",
    },
    {
      category: "Strategy & Competition",
      title: "Strategic Sourcing Bottleneck",
      description:
        "Role: Chief Operating Officer at an Electric Vehicle (EV) Startup\n\nSituation: Your sole battery supplier demands an exclusive multi-year contract with a 20% price hike, knowing alternative battery manufacturers have a 24-month waitlist. Accepting shrinks your gross margin per vehicle to near zero.\n\nThe Decision: Do you accept the exclusive contract to maintain production volume and market momentum, or refuse, cut production targets, and rapidly co-invest in building or securing alternative supply sources? Explain your trade-off.",
    },
    {
      category: "Strategy & Competition",
      title: "Preemptive Attack Response",
      description:
        "Role: CEO of a Mid-Sized Enterprise Cybersecurity Firm\n\nSituation: A massive tech conglomerate announces its intention to enter your niche cybersecurity category within 12 months with a bundled, lower-cost alternative.\n\nThe Decision: Do you launch an immediate aggressive PR/marketing campaign targeting enterprise buyers on compliance and security reliability, drop your prices preemptively, or seek a strategic acquisition by a rival conglomerate before the launch? Defend your move.",
    },
    {
      category: "Strategy & Competition",
      title: "Value-Chain Integration",
      description:
        "Role: CEO of a Premium Specialty Coffee Roaster\n\nSituation: Rising climate impacts and middleman costs have doubled green coffee bean import prices over 2 years, squeezing your roasting margins.\n\nThe Decision: Do you backward-integrate by buying/partnering directly with origin coffee farms to lock in supply and margins, or forward-integrate by opening high-margin flagship retail cafes to capture consumer pricing power? Justify your path.",
    },
    {
      category: "Strategy & Competition",
      title: "Strategic Pivot in a Shrinking Market",
      description:
        "Role: CEO of a Traditional Print & Digital Publishing House\n\nSituation: Print advertising revenue is down 30% year-over-year, and digital ad rates are collapsing due to ad-blockers and platform dominance. Subscription revenue is growing, but too slowly to offset print losses.\n\nThe Decision: Do you institute a hard paywall and transition fully to a high-ticket subscriber-only model (accepting lower total reach), or pivot to an events, community, and corporate sponsorship model? Defend your business model choice.",
    },
    {
      category: "Strategy & Competition",
      title: "Fast-Follower Strategy",
      description:
        "Role: Chief Strategy Officer at a Consumer Fitness Wearables Company\n\nSituation: A major competitor releases an innovative non-invasive metric tracker that captures consumer headlines and spikes their pre-orders. Your internal R&D team can replicate a stable version in 9 months.\n\nThe Decision: Do you launch an interim software feature update to keep current users engaged while rushing R&D, or slash the price of your current hardware models to maintain market volume until your version is ready? Defend your tactical timeline.",
    },
    {
      category: "Strategy & Competition",
      title: "The Niche vs. Mass Market Trade-off",
      description:
        "Role: Founder of a High-End Ergonomic Office Furniture Brand\n\nSituation: You dominate the luxury corporate executive segment ($1,500/chair) with 40% margins. Distributors urge you to launch a mass-market retail line ($300/chair) for remote workers, projecting a 5x volume increase at 12% margins.\n\nThe Decision: Do you launch the mass-market brand (risking luxury brand dilution), launch it under an unbranded subsidiary, or reject mass-market expansion to keep luxury pricing power pristine? Defend your choice.",
    },
    {
      category: "Strategy & Competition",
      title: "Coopetition Strategy",
      description:
        "Role: VP of Strategy at a Regional Logistics & Delivery Network\n\nSituation: A major global e-commerce giant offers to hire 70% of your fleet capacity on a guaranteed 3-year contract. However, the terms restrict you from servicing direct competitors of this e-commerce giant.\n\nThe Decision: Do you lock in guaranteed steady utilization and revenue with the giant (risking customer concentration and losing independent clients), or decline the offer to preserve operational independence? Justify your call.",
    },
    {
      category: "Strategy & Competition",
      title: "Regulatory Arbitrage Defense",
      description:
        "Role: Head of Public Policy & Business Operations at an Alternative Mobility Service\n\nSituation: City regulators issue a sudden temporary order limiting your fleet size by 50% until a new licensing framework is passed, giving legacy taxi services an immediate operational advantage.\n\nThe Decision: Do you pivot fleet assets to adjacent suburban regions outside city jurisdiction immediately, or launch a public-facing grassroots advocacy campaign while operating at the temporary cap? Defend your immediate operational move.",
    },
    {
      category: "Strategy & Competition",
      title: "Strategic Exit vs. Long Hold",
      description:
        "Role: Solo Founder of a Bootstrapped SaaS Tool generating $3M ARR at 70% margin\n\nSituation: A strategic acquirer offers $25M cash today. Meanwhile, your growth rate is 40% YoY, and market projections indicate you could double ARR in 2 years—though a well-funded rival is raising a massive Series B.\n\nThe Decision: Do you take the cash exit now, or reject the offer and execute an aggressive growth plan to compete head-to-head? Defend your financial and competitive reasoning.",
    },
    {
      category: "Strategy & Competition",
      title: "Standard-Setting Standards War",
      description:
        "Role: CEO of an IoT Smart Home Hardware Startup\n\nSituation: The smart home market is dividing between two competing connectivity standards (Standard Alpha vs. Standard Beta). Supporting both increases hardware production costs by 25%. Industry giants are split on which will dominate.\n\nThe Decision: Do you commit exclusively to Standard Alpha, Standard Beta, or absorb the 25% cost hike to manufacture dual-compatible hardware? Justify your choice under technology uncertainty.",
    },
    {
      category: "Strategy & Competition",
      title: "Unbundling Threat",
      description:
        "Role: VP of Product at an All-in-One Enterprise HR & Payroll Suite\n\nSituation: Single-feature startups (specialized recruiting, automated onboarding, niche benefits) are picking off your mid-market accounts by offering far superior user experience in individual sub-categories.\n\nThe Decision: Do you acquire one of the leading niche players to upgrade your suite, lower total bundle pricing to highlight cost savings over point solutions, or rebuild your core UI/UX from scratch? Defend your response.",
    },
    {
      category: "Strategy & Competition",
      title: "Switching Cost Barrier Strategy",
      description:
        "Role: Head of Commercial Strategy at a Cloud Database Provider\n\nSituation: To win developer market share from legacy database incumbents, your team proposes making data egress (export) completely free and effortless. Finance warns this eliminates your primary customer lock-in mechanism.\n\nThe Decision: Do you implement zero egress fees to use ease-of-exit as a competitive customer acquisition weapon, or retain exit fees to preserve customer lifetime value (LTV)? Defend your choice.",
    },
    {
      category: "Strategy & Competition",
      title: "Strategic Brand Repositioning",
      description:
        "Role: Chief Marketing Officer at a 50-Year-Old Traditional Automotive Supply Brand\n\nSituation: Vehicle manufacturers are shifting rapidly to Electric Vehicles (EVs). Your legacy brand is heavily associated with internal combustion engine components.\n\nThe Decision: Do you execute a complete, high-stakes brand pivot of the master brand toward EV and sustainable technology, or launch a totally separate clean-tech brand entity? Defend your branding strategy.",
    },
    {
      category: "Strategy & Competition",
      title: "Strategic Capacity Expansion",
      description:
        "Role: Head of Operations at a Specialized Microchip Packaging Facility\n\nSituation: Demand currently exceeds your production capacity by 200%. Building a new facility costs $150M and takes 18 months. Industry analysts warn the current chip demand surge might peak within 24 months.\n\nThe Decision: Do you commit capital to build the new facility now, run existing plants at risky 120% capacity over-utilization with high overtime, or outsource overflow production to third-party foundries at lower margins? Defend your operational choice.",
    },

    // --- BATCH 2: Strategy & Competition (26–50) ---
    {
      category: "Strategy & Competition",
      title: "The Innovator’s Dilemma in High-Margin Legacy",
      description:
        "Role: Chief Executive Officer at a Market-Leading Digital Camera Manufacturer\n\nSituation: Smartphone cameras are improving rapidly. While your core DSLR line yields 65% gross margins, your R&D team has developed a lightweight computational photography chip that could disrupt your low-end DSLR line.\n\nThe Decision: Do you launch a budget smartphone-integrated camera unit (which will erode 20% of low-end DSLR sales) or protect your high-margin DSLR lineup and focus strictly on professional photographers? Defend your call.",
    },
    {
      category: "Strategy & Competition",
      title: "Ecosystem Lock-In vs. Open Standards",
      description:
        "Role: VP of Product Strategy at a Smart Home Ecosystem Pioneer\n\nSituation: A coalition of tech giants launches an open-source smart device standard that makes competitors' smart home devices interoperable. Your ecosystem relies on proprietary hardware compatibility that drives 40% of customer retention.\n\nThe Decision: Do you open your ecosystem to support the universal standard (risking hardware churn) or double down on your walled garden with exclusive software features? Justify your choice.",
    },
    {
      category: "Strategy & Competition",
      title: "Platform Bottleneck & Vertical Integration",
      description:
        "Role: CEO of a Top-Tier Mobile Gaming Studio\n\nSituation: Apple and Google take a 30% cut on all in-app microtransactions. A new regulatory ruling opens the door to third-party web storefronts, but pushing users off-app introduces friction that drops checkout conversion by 15%.\n\nThe Decision: Do you launch your own external direct-to-consumer web store to bypass the 30% platform fee, or accept the fee to maintain seamless in-app conversion rates? Defend your trade-off.",
    },
    {
      category: "Strategy & Competition",
      title: "Preemptive Capacity Squeezing",
      description:
        "Role: Head of Supply Chain & Strategy at a Semiconductor Foundry\n\nSituation: A massive AI hardware surge has left chip fabrication capacity tight. Your top customer offers to pay a 40% premium to reserve 80% of your total capacity for the next 3 years, leaving existing mid-tier customers stranded.\n\nThe Decision: Do you accept the high-margin concentration deal with one dominant player, or cap single-customer allocation to maintain a diversified client portfolio? Defend your long-term position.",
    },
    {
      category: "Strategy & Competition",
      title: "The Counter-Positioning Move",
      description:
        "Role: Founder & CEO of an Independent Artisan Mattress Brand\n\nSituation: Heavyweight mattress manufacturers dominate retail stores with massive ad budgets and sales rep commissions. You operate 100% online with zero showroom overhead and a 100-night trial.\n\nThe Decision: Legacy brands start building their own direct-to-consumer websites. Do you open physical flagship stores to fight them on the high street, or lean heavily into radical pricing transparency and direct supply chain advantages? Explain your strategic focus.",
    },
    {
      category: "Strategy & Competition",
      title: "First-Mover Advantage vs. Second-Mover Efficiency",
      description:
        "Role: Chief Strategy Officer at an EV Infrastructure Startup\n\nSituation: Ultra-fast charging technology is evolving every 18 months. Expanding charging networks today locks in high early capital expenditure (CapEx) with hardware that could be obsolete in 3 years. Waiting allows competitors to claim prime real estate locations.\n\nThe Decision: Do you aggressively acquire prime charger locations now using current technology, or hold cash until hardware standards stabilize while taking secondary locations later? Justify your stance.",
    },
    {
      category: "Strategy & Competition",
      title: "Defensive Brand Extensions",
      description:
        "Role: VP of Brand Strategy at a Luxury Swiss Watchmakers Group\n\nSituation: Smartwatches have captured 35% of entry-level luxury watch volume. Your heritage brand has zero digital pedigree, but shareholders demand a response to declining youth adoption.\n\nThe Decision: Do you launch a hybrid smartwatch under your legacy brand name (risking heritage brand equity), launch a smart wearable sub-brand, or ignore smartwatches entirely and market traditional mechanical watches as timeless art? Defend your trade-off.",
    },
    {
      category: "Strategy & Competition",
      title: "Aggressive Loss-Leader Penetration",
      description:
        "Role: CEO of a Cloud Gaming Streaming Service\n\nSituation: You are entering a market dominated by legacy gaming consoles. Your CFO proposes pricing your subscription at a 30% monthly loss for 2 years to acquire a critical mass of gamers and build network effects.\n\nThe Decision: Do you approve the aggressive loss-leader pricing strategy (requiring additional dilution/capital raising), or price at break-even and rely on exclusive game titles to pull users? Defend your financial trade-off.",
    },
    {
      category: "Strategy & Competition",
      title: "Managing Supply Chain Bottlenecks in Duopolies",
      description:
        "Role: Chief Procurement Officer at a Commercial Aircraft Supplier\n\nSituation: You supply critical wing components to both Boeing and Airbus. Boeing offers a multi-billion dollar exclusive contract, demanding you drop Airbus within 12 months.\n\nThe Decision: Do you accept the exclusive deal for short-term volume and scale efficiency, or reject it to maintain dual-supplier leverage in the aerospace duopoly? Justify your move.",
    },
    {
      category: "Strategy & Competition",
      title: "High-End Retrenchment",
      description:
        "Role: CEO of a High-End Commercial Real Estate Developer\n\nSituation: Urban office occupancy is down 25%. Your portfolio is split between Grade A premium towers and Grade B mid-tier office complexes. Upgrading Grade B buildings to meet modern green/tech standards requires massive capital you don't have.\n\nThe Decision: Do you sell off all Grade B assets at a 20% discount to double down exclusively on trophy Grade A properties, or attempt a partial debt-funded retrofit across all properties? Defend your portfolio strategy.",
    },
    {
      category: "Strategy & Competition",
      title: "Exploiting Regulatory Shifts",
      description:
        "Role: Head of Corporate Strategy at a HealthTech Startup\n\nSituation: New government data privacy regulations require all healthcare software to store patient records on local on-premise servers, reversing cloud-first trends.\n\nThe Decision: Do you spend 6 months rebuilding your cloud software to support local server hosting (gaining a massive regulatory compliance head start over rivals), or lobby/wait for regulatory relief while keeping your cloud model? Defend your choice.",
    },
    {
      category: "Strategy & Competition",
      title: "Defensive Patent Blanket Strategy",
      description:
        "Role: VP of Intellectual Property & Strategy at a Biotech Firm\n\nSituation: Your flagship drug patent expires in 2 years. R&D has developed minor structural variations (secondary patents) that extend protection by 5 years, but generic manufacturers are threatening immediate legal challenges against \"evergreening.\"\n\nThe Decision: Do you aggressively litigate to defend the secondary patents to delay generic entry, or lower the original drug's price by 40% today to build consumer brand loyalty before generic entry? Defend your defensive moat strategy.",
    },
    {
      category: "Strategy & Competition",
      title: "B2B Channel Conflict",
      description:
        "Role: VP of Global Sales at a Professional Power Tools Manufacturer\n\nSituation: Independent hardware distributors generate 80% of your revenue. You launch a Direct-to-Consumer (D2C) e-commerce site to capture higher margins, and your distributor network threatens to pull your products from their shelves.\n\nThe Decision: Do you kill the D2C channel to protect distributor relationships, or push forward with D2C and offer distributors exclusive product lines not available online? Justify your decision.",
    },
    {
      category: "Strategy & Competition",
      title: "Preemptive Competitor Acquisition",
      description:
        "Role: CEO of a Social Media & Communication Platform\n\nSituation: A tiny 5-person app with a novel short-form audio format is growing 100% week-over-week. They ask for a $200M buy-out valuation. Your engineering team claims they can copy the feature in 6 weeks.\n\nThe Decision: Do you pay the $200M premium acquisition price to instantly eliminate the threat and acquire the user network, or clone the feature internally and out-distribute them? Defend your choice.",
    },
    {
      category: "Strategy & Competition",
      title: "Responding to Asymmetric Competition",
      description:
        "Role: Chief Commercial Officer at a Regional Airline\n\nSituation: High-speed rail line connections were just completed across your top three domestic air routes, offering 50% cheaper fares and zero airport security wait times.\n\nThe Decision: Do you slash flight frequencies on those routes and reallocate aircraft to non-rail destination routes, or match train pricing on core routes by unbundling baggage and seat selection fees? Explain your strategic pivot.",
    },
    {
      category: "Strategy & Competition",
      title: "Free-to-Paid Monetization Friction",
      description:
        "Role: Chief Product Officer at a Productivity Software SaaS\n\nSituation: Your freemium tier is too good: 92% of active users never upgrade to paid plans because the free version satisfies their needs. Revenue growth has stalled.\n\nThe Decision: Do you aggressively restrict core features in the free tier (risking user revolt and viral growth slowdown), or introduce ad-supported tiers for free users to monetize non-payers? Defend your growth model.",
    },
    {
      category: "Strategy & Competition",
      title: "Surviving Commoditization Through Services",
      description:
        "Role: Managing Director at a Solar Panel Manufacturing Company\n\nSituation: Overseas manufacturers have flooded the market with sub-cost solar panels, driving hardware margins from 25% down to 2%.\n\nThe Decision: Do you pivot the company from a hardware manufacturer to an end-to-end solar installation and grid-management service provider, or invest in R&D for next-gen high-efficiency panels to regain hardware premium pricing? Defend your transformation.",
    },
    {
      category: "Strategy & Competition",
      title: "Multi-Brand Strategy vs. One Master Brand",
      description:
        "Role: Chief Marketing Officer at a Global Consumer Packaged Goods (CPG) Conglomerate\n\nSituation: You are acquiring a fast-growing, eco-friendly laundry detergent startup that appeals to Gen-Z.\n\nThe Decision: Do you keep the acquired brand completely separate to preserve its indie credibility, or endorse it under your corporate master brand (e.g., \"by Enterprise Co.\") to leverage global retail distribution power? Justify your branding trade-off.",
    },
    {
      category: "Strategy & Competition",
      title: "Sovereign / Localization Pressures",
      description:
        "Role: CEO of a Global Cloud Infrastructure Provider\n\nSituation: European governments pass strict \"data sovereignty\" mandates requiring all government data to be managed by 100% locally-owned entities.\n\nThe Decision: Do you form a joint venture with a European tech firm (sharing profits and technical control), or build standalone isolated infrastructure nodes while challenging the mandate in court? Defend your geopolitics strategy.",
    },
    {
      category: "Strategy & Competition",
      title: "Managing Customer Concentration Risk",
      description:
        "Role: CEO of an Automotive Tier-1 Parts Supplier\n\nSituation: A single automaker accounts for 68% of your annual revenue. They demand an immediate 8% price reduction across all components for the upcoming model year, knowing you have idle capacity.\n\nThe Decision: Do you concede to the 8% price cut to retain the customer while cutting internal operational expenses, or refuse the price cut and risk losing 68% of your revenue to diversify into commercial/industrial vehicles? Defend your strategic stance.",
    },
    {
      category: "Strategy & Competition",
      title: "Disruption from Below",
      description:
        "Role: VP of Strategy at an Enterprise ERP Software Firm ($100k+/year contracts)\n\nSituation: Simple, modern workflow tools priced at $15/user/month are gradually being adopted by small teams inside your enterprise accounts, threatening your seat expansion.\n\nThe Decision: Do you launch a lightweight, low-cost self-serve version of your software to block these tools, or focus strictly on deep enterprise compliance and security integration where cheap tools can't compete? Defend your move.",
    },
    {
      category: "Strategy & Competition",
      title: "Exit Strategy Under Pressure",
      description:
        "Role: Founder of a Hyper-Local Quick-Commerce Delivery Service\n\nSituation: Cash burn is high, and your Series C lead investor pulled out. A major ride-hailing app offers a stock-swap acquisition that gives you a modest return, while a rival delivery company offers a fire-sale asset purchase in cash.\n\nThe Decision: Do you accept the stock-swap with the ride-hailing giant (betting on their long-term equity recovery), or take the immediate fire-sale cash purchase to guarantee liquidity for creditors and founders? Defend your financial rationale.",
    },
    {
      category: "Strategy & Competition",
      title: "Reverse-Innovation Entry",
      description:
        "Role: Head of Emerging Markets at a Medical Device Multinational\n\nSituation: Local Indian healthcare startups have created ultra-portable, battery-operated ECG machines at 1/10th the cost of your hospital-grade machines. They are starting to export these to other developing markets.\n\nThe Decision: Do you acquire one of these low-cost innovators and sell their portable machines globally, or build your own low-cost line specifically for emerging markets while protecting your premium hospital brand in Western markets? Explain your expansion strategy.",
    },
    {
      category: "Strategy & Competition",
      title: "Platform Governance Dilemma",
      description:
        "Role: Chief Operating Officer at a Professional Freelance Marketplace\n\nSituation: High-earning top 5% freelancers complain that low-cost international freelancers are bidding down project rates, reducing overall platform quality perceptions.\n\nThe Decision: Do you introduce tiered regional pricing/bidding caps to protect high-earning freelancers, or keep bidding completely open and market-driven to maintain maximum job transaction volume? Defend your marketplace dynamics.",
    },
    {
      category: "Strategy & Competition",
      title: "Defensive Alliances",
      description:
        "Role: CEO of an Independent Automotive OEM\n\nSituation: Tech giants and massive auto conglomerates are spending billions on Autonomous Vehicle (AV) development. Your R&D budget is less than 10% of theirs.\n\nThe Decision: Do you form an open R&D consortium with 3 other mid-sized independent automakers to pool AV development costs, or license completed AV technology from one of the tech giants? Defend your long-term independence.",
    },
  ],

  research: [
    // --- BATCH 3: Strategy & Competition (Research Mode 1–25) ---
    {
      category: "Strategy & Competition",
      title: "Disruptive Innovation & Legacy Cannibalization",
      description:
        "Company / Context: Netflix’s pivot from DVD rentals to streaming (2007–2011).\n\nResearch Assignment: Investigate Netflix’s strategic decision to launch streaming while its DVD-by-mail business was still highly profitable, including the 2011 \"Qwikster\" splitting controversy.\n\nThe Task: Analyze the evidence behind why Blockbuster failed to counter this move. Synthesize key operational metrics (subscriber growth, content acquisition costs, infrastructure investments) and evaluate what strategic choices allowed Netflix to survive its self-inflicted customer backlash. Recommend a modern framework for when an incumbent should cannibalize its own core business.",
    },
    {
      category: "Strategy & Competition",
      title: "Disruption of Legacy Telecom via Asymmetric Monetization",
      description:
        "Company / Context: Reliance Jio’s entry into the Indian Telecom Market (2016).\n\nResearch Assignment: Examine Reliance Jio’s multi-billion dollar greenfield network rollout (VoLTE/4G only) and its zero-tariff pricing strategy at launch.\n\nThe Task: Gather market share, ARPU (Average Revenue Per User), and consolidation data across the Indian telecom industry from 2016 to 2021. Analyze how Jio leveraged capital from core oil/petrochemical businesses to sustain asymmetric competition against Airtel and Vodafone Idea. Provide a fully cited recommendation on how an incumbent operator should strategically defend against non-traditional, cross-subsidized entrants.",
    },
    {
      category: "Strategy & Competition",
      title: "Open vs. Closed Ecosystem Competition",
      description:
        "Company / Context: Apple (iOS) vs. Google (Android) mobile operating system dominance.\n\nResearch Assignment: Research the contrasting platform strategies of Apple’s integrated closed model versus Google’s open-source Android licensing model between 2008 and 2020.\n\nThe Task: Analyze key revenue streams (hardware margins vs. search/ad monetization/app store commissions) and developer ecosystem flywheels for both companies. Based on financial filings and global market share data, evaluate which model yields stronger long-term strategic moats and recommend how a new platform startup should decide between open and closed ecosystem architectures today.",
    },
    {
      category: "Strategy & Competition",
      title: "Low-Cost Carrier (LCC) Strategic Moats",
      description:
        "Company / Context: Southwest Airlines (USA) and IndiGo (India).\n\nResearch Assignment: Investigate how pure-play Low-Cost Carriers build structural cost advantages through fleet standardization (e.g., single aircraft family), point-to-point routing, and rapid turnaround times.\n\nThe Task: Analyze operational metrics (seat-mile costs, fleet utilization hours, turnaround times) comparing IndiGo or Southwest against legacy full-service carriers (e.g., Air India, United). Formulate a strategic recommendation detailing whether a legacy carrier should launch an independent LCC sub-brand or unbundle its existing fare structure to compete.",
    },
    {
      category: "Strategy & Competition",
      title: "Platform Disintermediation & Marketplace Governance",
      description:
        "Company / Context: Airbnb vs. Direct Short-Term Rental Booking Platforms.\n\nResearch Assignment: Research Airbnb’s continuous strategy to prevent platform leakage (buyers and hosts transacting off-platform to bypass service fees).\n\nThe Task: Investigate the specific mechanisms Airbnb introduced (in-app messaging masking, insurance/protection guarantees like AirCover, review systems, dynamic pricing algorithms). Evaluate financial and behavioral data to determine which mechanism contributed most to retaining transaction volume on-platform. Recommend an operational strategy for a new two-sided B2B marketplace facing high disintermediation risk.",
    },
    {
      category: "Strategy & Competition",
      title: "Vertical Integration in Hardware & Silicon",
      description:
        "Company / Context: Apple’s transition from Intel processors to Apple Silicon (M-Series chips).\n\nResearch Assignment: Examine Apple’s 10-year strategic trajectory from acquiring P.A. Semi in 2008 to launching the M1 chip in 2020, moving away from Intel.\n\nThe Task: Analyze the performance-per-watt data, unit economics, control over product launch timelines, and supply chain leverage gained through in-house chip design. Synthesize your findings to recommend under what specific volume and margin conditions a tech hardware OEM should back-integrate into custom silicon design versus relying on merchant chipmakers (e.g., Intel, AMD, Qualcomm).",
    },
    {
      category: "Strategy & Competition",
      title: "Strategic Retrenchment & Turnaround Strategy",
      description:
        "Company / Context: Starbucks’ \"Transformation Agenda\" under Howard Schultz (2008).\n\nResearch Assignment: Investigate Starbucks closing 7,000 US stores for retraining in 2008 amid rapid over-expansion, economic recession, and brand dilution.\n\nThe Task: Analyze financial recovery metrics, store-level profitability, supply chain restructuring, and menu simplification implemented during the 2008–2010 turnaround. Formulate a structured crisis turnaround plan for a retail chain suffering from over-expansion and declining customer experience.",
    },
    {
      category: "Strategy & Competition",
      title: "Value Chain Decoupling & Supply Chain Lock-in",
      description:
        "Company / Context: ASML’s extreme ultraviolet (EUV) lithography monopoly in semiconductor manufacturing.\n\nResearch Assignment: Research how ASML secured a 100% market monopoly on EUV lithography machines required for advanced chip manufacturing (<5nm).\n\nThe Task: Examine ASML's strategic co-investment program with key customers (Intel, Samsung, TSMC) and exclusive supplier relationships (e.g., Zeiss optics). Evaluate how this ecosystem lock-in creates an insurmountable barrier to entry. Provide a strategic playbook on how specialized B2B industrial component manufacturers can build similar deep-supply-chain moats.",
    },
    {
      category: "Strategy & Competition",
      title: "Managing Dual-Brand Portfolios After Mergers",
      description:
        "Company / Context: Marriott International’s acquisition of Starwood Hotels & Resorts (2016).\n\nResearch Assignment: Investigate Marriott’s strategic integration of Starwood's brand portfolio (combining 30 distinct brands like Ritz-Carlton, W Hotels, Westin, and Sheraton).\n\nThe Task: Analyze customer loyalty consolidation (Marriott Bonvoy), brand overlap, cannibalization risks, and franchisee operational alignment post-merger. Design a portfolio management framework for CPG or hospitality companies evaluating whether to merge, eliminate, or maintain distinct brand identities after a major horizontal acquisition.",
    },
    {
      category: "Strategy & Competition",
      title: "Defending Against Low-Cost Counter-Positioning",
      description:
        "Company / Context: IKEA vs. Flat-Pack Furniture Disruptors and Traditional Showrooms.\n\nResearch Assignment: Investigate IKEA’s unique cost-structure model—self-assembly, flat-packing, suburban warehouse store layouts, and integrated cafeteria experiences.\n\nThe Task: Research why traditional furniture retailers failed to copy IKEA's model due to structural trade-offs (dealer conflicts, high shipping costs, floor space commitments). Synthesize IKEA’s strategic alignment across design, manufacturing, and store operations, and detail how an incumbent retail brand can counter modular low-cost entrants.",
    },
    {
      category: "Strategy & Competition",
      title: "Surviving Market Unbundling by Niche Software",
      description:
        "Company / Context: Bloomberg Terminal vs. Financial Data Software Contenders.\n\nResearch Assignment: Research the structural defenses protecting the Bloomberg Terminal's high price tag ($24,000+/year per seat) despite lower-cost single-feature competitors (S&P Capital IQ, FactSet, PitchBook).\n\nThe Task: Analyze data on Bloomberg’s proprietary instant messaging network (IB Chat), data depth, customer switching costs, and workflow integration. Outline a strategic action plan for enterprise SaaS platforms defending against point-solution unbundling threats.",
    },
    {
      category: "Strategy & Competition",
      title: "Aggressive International Expansion Strategy",
      description:
        "Company / Context: Uber’s exit from China (Didi Dache merger) vs. Expansion in Europe.\n\nResearch Assignment: Examine Uber’s aggressive multi-billion dollar international push into China between 2013 and 2016, ending in a local asset sale to Didi.\n\nThe Task: Compare regulatory barriers, local competitive dynamics, strategic capital burn, and consumer behavior differences in foreign markets. Synthesize key failure modes and formulate an international entry framework evaluating when to deploy organic market expansion versus entering via local joint ventures or strategic equity investments.",
    },
    {
      category: "Strategy & Competition",
      title: "Surviving Scale Aggression in Fast Fashion",
      description:
        "Company / Context: Shein’s ultra-fast fashion supply chain model vs. Zara’s agile manufacturing.\n\nResearch Assignment: Research Shein’s real-time algorithm-driven design testing and direct-from-factory micro-batch production model compared to Zara’s 2-week fast-fashion supply chain.\n\nThe Task: Gather evidence on lead times, return rates, customer acquisition costs, and inventory write-off metrics. Evaluate the sustainability of Shein's cost structure against environmental/regulatory risks, and formulate a competitive strategy for legacy retail fashion brands.",
    },
    {
      category: "Strategy & Competition",
      title: "Pivoting from Hardware Sales to Recurring Subscriptions",
      description:
        "Company / Context: Peloton Interactive’s hardware sales plateau and subscription pivot.\n\nResearch Assignment: Analyze Peloton’s financial transition from rapid demand during 2020–2021 to inventory gluts and restructuring in 2022–2024.\n\nThe Task: Track gross margins across hardware vs. subscription content, subscriber churn rates, customer lifetime value (LTV), and inventory write-downs. Develop a turnaround strategy for hardware-focused companies attempting to build scalable software subscription revenues without overestimating post-spike baseline demand.",
    },
    {
      category: "Strategy & Competition",
      title: "Cross-Industry Conglomerate Diversification",
      description:
        "Company / Context: Amazon’s acquisition of Whole Foods Market (2017).\n\nResearch Assignment: Investigate Amazon’s $13.7B entry into physical grocery retail through Whole Foods.\n\nThe Task: Analyze performance data on omnichannel integration (Prime discounts, lockers, grocery delivery fulfillment, customer data capture). Evaluate why digital native pure-plays struggle in physical grocery and propose how traditional grocery chains should structure digital-physical hybrid operations.",
    },
    {
      category: "Strategy & Competition",
      title: "Defending Premium Pricing in a Commoditized Market",
      description:
        "Company / Context: Lululemon’s athletic apparel pricing power.\n\nResearch Assignment: Research Lululemon’s capability to maintain 55%+ gross margins on basic polyester/nylon activewear despite thousands of low-cost competitors and private-label clones.\n\nThe Task: Examine data on direct-to-consumer store layouts, community marketing, fabric R&D patents, inventory control, and minimal discounting strategies. Synthesize a strategy for premium consumer brands operating in increasingly commoditized product categories.",
    },
    {
      category: "Strategy & Competition",
      title: "Standardization Wars in Technology Formats",
      description:
        "Company / Context: Sony (Blu-ray) vs. Toshiba (HD-DVD) High-Definition Format War (2006–2008).\n\nResearch Assignment: Examine the strategic battle between Blu-ray and HD-DVD formats for high-definition optical discs.\n\nThe Task: Research studio exclusivity deals, gaming console integration (Sony’s PS3 inclusion of Blu-ray), hardware pricing strategies, and retailer adoption points. Extract key lessons for technology leadership teams attempting to establish their proprietary architecture as the default industry standard.",
    },
    {
      category: "Strategy & Competition",
      title: "Preemptive Defensive M&A",
      description:
        "Company / Context: Facebook’s acquisition of Instagram (2012) and WhatsApp (2014).\n\nResearch Assignment: Research Facebook’s strategic acquisitions of Instagram for $1B and WhatsApp for $19B under antitrust and competitive threat frameworks.\n\nThe Task: Analyze engagement metrics, mobile user growth shifts, and network effect defenses captured by Facebook through these acquisitions. Evaluate subsequent regulatory scrutinies and formulate guidelines on when a dominant tech platform should buy vs. build against emerging mobile threats.",
    },
    {
      category: "Strategy & Competition",
      title: "Navigating Geopolitical & Sovereign Supply Chain Risks",
      description:
        "Company / Context: TSMC’s geographical concentration in Taiwan and global fab expansion.\n\nResearch Assignment: Investigate TSMC’s manufacturing concentration in Taiwan and its multi-billion dollar expansion into the US, Japan, and Europe under sovereign supply chain pressures.\n\nThe Task: Analyze fab CapEx costs, yield rate disparities across locations, talent availability, and government subsidy frameworks (e.g., US CHIPS Act). Build a risk-mitigation framework for global technology firms dependent on concentrated geographic supply chains.",
    },
    {
      category: "Strategy & Competition",
      title: "The Reverse-Franchise / Direct-to-Consumer Transition",
      description:
        "Company / Context: Nike’s Consumer Direct Offense strategy (2017–2023).\n\nResearch Assignment: Research Nike’s explicit decision to cut ties with thousands of independent retail distributors to prioritize Nike direct stores and digital app sales.\n\nThe Task: Examine the operational impact on gross margins, inventory control, marketing spend, and customer data ownership, alongside the eventual wholesale course-corrections in 2023–2024. Synthesize recommendations on balancing wholesale distributor partnerships with direct-to-consumer digital channels.",
    },
    {
      category: "Strategy & Competition",
      title: "Counter-Attacking Platform Encroachment",
      description:
        "Company / Context: Spotify vs. Apple Music & Amazon Music.\n\nResearch Assignment: Research Spotify’s competitive survival strategy against tech giants offering bundled music services at zero marginal profit to drive hardware/ecosystem retention.\n\nThe Task: Investigate Spotify’s expansion into podcasts, original audio content, algorithmic personalization flywheels, and direct creator tools. Analyze financial data (gross margin pressures, licensing payouts) and evaluate how independent single-category platforms can withstand multi-product ecosystem encroachment.",
    },
    {
      category: "Strategy & Competition",
      title: "Managing Rapid Category Decline",
      description:
        "Company / Context: Fujifilm’s survival vs. Kodak’s bankruptcy during the digital photography shift.\n\nResearch Assignment: Compare Fujifilm and Kodak’s strategic responses to the collapse of color film demand between 1995 and 2010.\n\nThe Task: Investigate how Fujifilm successfully leveraged its core chemical and thin-film technology capabilities into pharmaceuticals, cosmetics, and advanced display materials while Kodak failed to transition. Formulate a core-capability auditing framework for companies operating in shrinking or obsolete core markets.",
    },
    {
      category: "Strategy & Competition",
      title: "B2B Marketplace Supply Monetization vs. Demand Subsidies",
      description:
        "Company / Context: Freightos vs. Traditional Freight Forwarding Digitization.\n\nResearch Assignment: Research how digital freight marketplaces digitized global international shipping booking across fragmented carriers and cargo shippers.\n\nThe Task: Analyze data on freight rate transparency, spot rate volatility, platform transaction fees, and carrier onboarding friction. Formulate a monetization and marketplace liquidity strategy for industrial B2B exchanges attempting to digitize traditional broker-led industries.",
    },
    {
      category: "Strategy & Competition",
      title: "Defending Against Regulatory & Public Health Pushback",
      description:
        "Company / Context: Juul Labs’ market ascension and regulatory collapse (2018–2022).\n\nResearch Assignment: Research Juul’s rapid valuation surge to $38B and its subsequent collapse driven by regulatory interventions, ban orders, and litigation.\n\nThe Task: Track marketing campaigns, youth adoption data, lobbying strategies, FDA enforcement actions, and corporate governance decisions. Provide a proactive risk compliance playbook for high-growth consumer startups operating in heavy regulatory grey areas.",
    },
    {
      category: "Strategy & Competition",
      title: "Strategic Asset-Light Decoupling",
      description:
        "Company / Context: Asset-light pivots by major hotel chains (Hilton, Hyatt, Marriott).\n\nResearch Assignment: Investigate how major hospitality brands sold off physical real estate assets to become pure-play brand licensing and property management operators.\n\nThe Task: Compare ROIC (Return on Invested Capital), margin profiles, debt load flexibility during economic downturns, and franchisee management complexity between asset-heavy real estate owners and asset-light brand licensors. Formulate a strategic framework for real-estate intensive businesses evaluating asset-light transformations.",
    },

    // --- BATCH 4: Strategy & Competition (Research Mode 26–50) ---
    {
      category: "Strategy & Competition",
      title: "Platform Monopoly Monetization & Merchant Revolt",
      description:
        "Company / Context: Amazon Marketplace seller fee increases (2018–2024).\n\nResearch Assignment: Research Amazon’s gradual increase of seller take-rates (referral fees, FBA fulfillment fees, advertising requirements) to over 50% of seller revenue.\n\nThe Task: Gather data on merchant profitability, platform ad spend necessity, FTC regulatory scrutiny, and seller shifts toward Shopify or D2C channels. Formulate a strategic governance model for marketplace platforms balancing ecosystem seller viability with platform take-rate optimization.",
    },
    {
      category: "Strategy & Competition",
      title: "Scale Economies Shared (The Flywheel Model)",
      description:
        "Company / Context: Costco Wholesale’s business model and membership architecture.\n\nResearch Assignment: Investigate Costco’s structural business strategy: capping product markups at 14-15%, deriving 70%+ of operating income from membership fees, and maintaining high inventory turnover.\n\nThe Task: Analyze financial data on SKU curation (~4,000 SKUs vs ~100,000 at typical supermarkets), supplier volume leverage, membership renewal rates, and wage structures. Detail how traditional retail brands can adapt \"scale economies shared\" principles to create long-term pricing moats.",
    },
    {
      category: "Strategy & Competition",
      title: "Preemptive Standardization & Ecosystem Control",
      description:
        "Company / Context: Tesla’s North American Charging Standard (NACS) adoption by legacy OEMs.\n\nResearch Assignment: Examine Tesla’s strategic decision to open its proprietary Supercharger network and NACS plug design to competitors like Ford, GM, and Rivian in 2023–2024.\n\nThe Task: Analyze the strategic leverage gained (federal subsidies, charging revenue, driver data capture, default charging ecosystem status) versus losing exclusive hardware network access as a car selling point. Formulate a framework for when an infrastructure leader should open its proprietary network to competitors.",
    },
    {
      category: "Strategy & Competition",
      title: "Surviving Asymmetric Aggressors in Cloud Hosting",
      description:
        "Company / Context: DigitalOcean vs. Amazon Web Services (AWS) / Microsoft Azure.\n\nResearch Assignment: Research how DigitalOcean achieved profitability and a public listing by serving independent developers and SMBs despite competing with trillion-dollar cloud giants.\n\nThe Task: Investigate pricing simplicity, developer documentation focus, product unbundling, and community content strategies. Build a strategic roadmap for mid-tier niche cloud/software providers competing with dominant, multi-product tech conglomerates.",
    },
    {
      category: "Strategy & Competition",
      title: "Navigating Regulatory Splits Across Geographic Blocs",
      description:
        "Company / Context: Apple’s adoption of USB-C and Third-Party App Stores under the EU Digital Markets Act (DMA).\n\nResearch Assignment: Research Apple’s forced strategic compliance changes within the European Union regarding side-loading, browser engines, and USB-C hardware standards.\n\nThe Task: Evaluate financial impacts on App Store commission revenue, ecosystem brand consistency, compliance engineering overhead, and geographic product fragmentation risks. Develop a global regulatory compliance framework for multinational platforms operating under conflicting international laws.",
    },
    {
      category: "Strategy & Competition",
      title: "Pivot from Consumer D2C to Enterprise B2B SaaS",
      description:
        "Company / Context: 23andMe’s health/ancestry business model shift toward pharmaceutical drug discovery.\n\nResearch Assignment: Analyze 23andMe’s transition from a consumer DNA test kit manufacturer to a biopharmaceutical research partner leveraging user genetic databases.\n\nThe Task: Track key metrics (test kit acquisition costs, database scale, pharma partnership revenues with GSK, recurring subscription adoption). Evaluate privacy governance, revenue model volatility, and formulate strategic lessons for consumer platforms attempting to monetize aggregated user data in B2B enterprise markets.",
    },
    {
      category: "Strategy & Competition",
      title: "Defending Against Private Label Encroachment",
      description:
        "Company / Context: National CPG Brands (e.g., Kraft Heinz, Procter & Gamble) vs. Retailer Private Labels (Trader Joe’s, Kirkland Signature, Great Value).\n\nResearch Assignment: Research how major national CPG brands defend shelf space and pricing margins against retail partners’ high-margin private label alternatives.\n\nThe Task: Analyze consumer elasticity data, trade promotion spend, store placement contracts, and product innovation velocity. Synthesize a competitive strategy for manufacturing brands facing direct distribution partner competition.",
    },
    {
      category: "Strategy & Competition",
      title: "Multi-Sided Platform Cold-Start Overcoming",
      description:
        "Company / Context: DoorDash’s suburban market playbook vs. Grubhub’s urban focus (2015–2020).\n\nResearch Assignment: Examine DoorDash’s strategy of targeting underserved suburban markets, merchant selection depth, and door-to-door sales tactics to overtake early market leaders Grubhub and Seamless.\n\nThe Task: Compare customer acquisition costs, average order values, delivery logistics economics, and merchant partnership models between urban density and suburban spread. Recommend a geographic sequencing model for logistics platforms entering competitive markets.",
    },
    {
      category: "Strategy & Competition",
      title: "Overcoming Brand Dilution in High-Growth Mergers",
      description:
        "Company / Context: Adidas’ acquisition and eventual distressed sale of Reebok (2005–2021).\n\nResearch Assignment: Research Adidas’ $3.8B acquisition of Reebok in 2005 to challenge Nike, culminating in Reebok’s sale for $2.5B to Authentic Brands Group in 2021.\n\nThe Task: Analyze strategic positioning errors, brand identity cannibalization, supply chain integration failures, and marketing misallocations. Build a corporate governance framework for managing brand identity and operational autonomy in horizontal corporate acquisitions.",
    },
    {
      category: "Strategy & Competition",
      title: "Strategic Capacity De-risking in Capital-Intensive Sectors",
      description:
        "Company / Context: Semiconductor foundry business model creation by TSMC (100% pure-play foundry model).\n\nResearch Assignment: Investigate Morris Chang’s foundational strategy behind launching TSMC as a pure-play semiconductor foundry in 1987, explicitly promising never to design chips or compete with its customers.\n\nThe Task: Analyze how avoiding customer competition built absolute trust, scale advantages, and capital deployment efficiency compared to integrated device manufacturers (IDMs like Intel). Formulate strategic principles for building trusted neutral infrastructure platforms in capital-intensive industries.",
    },
    {
      category: "Strategy & Competition",
      title: "Managing Sudden Supply-Side De-Platforming Risk",
      description:
        "Company / Context: Epic Games vs. Apple & Google (The Fortnite App Store Dispute - 2020).\n\nResearch Assignment: Research Epic Games’ deliberate bypass of Apple and Google in-app payment systems, resulting in Fortnite’s removal from major app stores and subsequent antitrust litigation.\n\nThe Task: Track financial losses from mobile platform access, alternate distribution strategies (web, direct launcher, cloud gaming partnerships), and public relations outcomes. Provide a strategic risk audit for digital products dependent on third-party platform distribution.",
    },
    {
      category: "Strategy & Competition",
      title: "Aggressive Low-Cost Disruption in Hard Hardware",
      description:
        "Company / Context: DJI’s dominance over the global consumer drone market (2013–2020).\n\nResearch Assignment: Investigate how DJI bankrupted or forced out Western consumer drone competitors (3D Robotics, GoPro Karma, Parrot) through rapid iteration, low-cost Shenzhen manufacturing integration, and aggressive price points.\n\nThe Task: Analyze R&D cycle times, bill-of-materials cost advantages, vertical integration of flight controllers and gimbals, and software platform dominance. Synthesize strategic guidelines for Western hardware firms competing with Shenzhen-based hardware manufacturing ecosystems.",
    },
    {
      category: "Strategy & Competition",
      title: "Pivoting from Perpetual Licenses to SaaS Subscriptions",
      description:
        "Company / Context: Adobe’s transition to Creative Cloud (2011–2013).\n\nResearch Assignment: Research Adobe’s shift from selling $2,500 boxed perpetual software licenses to a $50/month recurring subscription model despite initial wall-street and user backlash.\n\nThe Task: Gather data on the initial short-term revenue dip (\"the financial fish model\"), customer lifetime value expansion, recurring revenue stability, and ARR growth metrics. Formulate an executive playbook for transitioning traditional software models to SaaS subscriptions.",
    },
    {
      category: "Strategy & Competition",
      title: "Surviving Systemic Business Model Obsolescence",
      description:
        "Company / Context: Western Union’s transformation from telegraph operator to global money transfer network.\n\nResearch Assignment: Examine Western Union’s historical pivot from dominating global telegraph communication to becoming a financial money transfer and cross-border payment network.\n\nThe Task: Research operational asset re-deployment, brand equity retention, physical agent network construction, and adaptation to digital mobile wallets (e.g., Wise, Remitly). Create a strategic framework for legacy infrastructure providers undergoing core-technology obsolescence.",
    },
    {
      category: "Strategy & Competition",
      title: "Open-Source Monetization & Commercialization Strategy",
      description:
        "Company / Context: Red Hat (Linux) acquisition by IBM ($34B) vs. Elastic / MongoDB licensing shifts.\n\nResearch Assignment: Investigate open-source commercialization models (Red Hat Enterprise Linux support model vs. Server Side Public License adoption by MongoDB and Elastic to defend against AWS re-packaging).\n\nThe Task: Analyze financial models, developer adoption metrics, cloud provider cloud-forking threats, and licensing structures. Formulate an open-source commercialization strategy balancing developer adoption with proprietary value capture.",
    },
    {
      category: "Strategy & Competition",
      title: "Countering Disruption Through Premiumization",
      description:
        "Company / Context: Dyson’s positioning in high-end consumer appliances (vacuums, hair care).\n\nResearch Assignment: Research Dyson’s ability to command $400–$600 price points for commoditized home appliances (vacuums, fans, hair dryers) through engineering branding and design differentiation.\n\nThe Task: Examine R&D expenditure percentages, digital motor patent protections, premium retail distribution, and packaging aesthetics. Build a strategic blueprint for consumer hardware manufacturers seeking to escape low-margin commodity price wars.",
    },
    {
      category: "Strategy & Competition",
      title: "Defending Against Aggressive Aggregator Platforms",
      description:
        "Company / Context: Independent Restaurant Networks vs. Delivery Aggregators (DoorDash/Uber Eats).\n\nResearch Assignment: Investigate the margin squeeze experienced by independent restaurants operating on delivery platforms charging 20–30% commissions, and the rise of white-label direct ordering infrastructure (Toast, ChowNow).\n\nThe Task: Analyze unit economics of delivery vs. dine-in orders, customer data ownership, direct ordering incentives, and ghost kitchen efficiency. Develop an operational survival strategy for small businesses dependent on powerful platform aggregators.",
    },
    {
      category: "Strategy & Competition",
      title: "Strategic Entry via Low-End Niche Footprints",
      description:
        "Company / Context: Enterprise SaaS market entry via developer-first bottom-up tools (Twilio, Stripe, Datadog).\n\nResearch Assignment: Research how developer-first API platforms bypassed traditional top-down enterprise sales software procurement by catering directly to software engineers with self-serve documentation and usage-based pricing.\n\nThe Task: Track developer adoption flywheels, net revenue retention (NRR) benchmarks, enterprise expansion metrics, and sales motion transitions (self-serve to enterprise sales force). Synthesize a bottom-up go-to-market strategy for technical B2B software products.",
    },
    {
      category: "Strategy & Competition",
      title: "Managing Ecosystem Conflicts Between Partners and Direct Sales",
      description:
        "Company / Context: Salesforce AppExchange partner ecosystem vs. Salesforce product acquisitions.\n\nResearch Assignment: Research how Salesforce manages developer partner trust on AppExchange when acquiring or building native products that directly compete with popular third-party partner apps.\n\nThe Task: Analyze partner agreements, platform neutrality messaging, revenue-share terms, and historic developer backlash incidents. Formulate developer ecosystem governance principles for platform software operators.",
    },
    {
      category: "Strategy & Competition",
      title: "Navigating Geopolitical Sanctions and Sovereignty Split",
      description:
        "Company / Context: Huawei’s response to US sanctions and loss of Google Mobile Services (2019–2024).\n\nResearch Assignment: Investigate Huawei’s strategic response to being placed on the US Entity List, cutting off access to Android (GMS), advanced chip foundries (TSMC), and EDA software.\n\nThe Task: Analyze Huawei's internal development of HarmonyOS, domestic supply-chain back-integration, R&D expenditure shifts, and market share retention within China versus international markets. Build a sovereign supply-chain resiliency strategy for global technology firms.",
    },
    {
      category: "Strategy & Competition",
      title: "Strategic Expansion into Ultra-Luxury Segments",
      description:
        "Company / Context: Hyundai Motor Group’s launch and standalone positioning of Genesis.\n\nResearch Assignment: Research how Hyundai successfully spun off Genesis into a legitimate luxury automotive contender against established German brands (BMW, Mercedes, Audi).\n\nThe Task: Track standalone dealership separation, brand design independence, pricing strategies, warranty offerings, and consumer perception metrics. Formulate a multi-tier brand architecture model for mass-market manufacturers entering luxury market segments.",
    },
    {
      category: "Strategy & Competition",
      title: "Managing Platform Algorithmic Dependency Risks",
      description:
        "Company / Context: Digital Media Publishers (BuzzFeed, Vox, Vice) vs. Meta/Facebook distribution algorithm shifts (2015–2023).\n\nResearch Assignment: Research how digital publishers pivoted heavily to video and content strategies optimized for Facebook’s News Feed algorithm, only to face traffic collapses when Meta deprioritized news content.\n\nThe Task: Analyze referral traffic metrics, ad-revenue collapses, digital media restructuring/bankruptcies, and direct subscriber revenue failures. Formulate a platform-diversification and audience-ownership strategy for media and digital content companies.",
    },
    {
      category: "Strategy & Competition",
      title: "Defending Against Fast-Follower Enterprise Clones",
      description:
        "Company / Context: Slack vs. Microsoft Teams bundling (2016–2021).\n\nResearch Assignment: Examine Microsoft’s strategic bundling of Teams into Office 365 for free to counter Slack’s rapid enterprise adoption, culminating in Salesforce acquiring Slack.\n\nThe Task: Analyze enterprise software distribution leverage, seat growth comparisons, integration flywheels, and anti-competitive bundling lawsuits in the EU. Synthesize an enterprise defense framework for standalone SaaS vendors competing against bundled software conglomerates.",
    },
    {
      category: "Strategy & Competition",
      title: "Managing High Capital Burn in Winner-Take-All Markets",
      description:
        "Company / Context: The US Quick-Commerce / Instant Delivery Collapse (Buyk, Fridge No More, Gopuff - 2021–2023).\n\nResearch Assignment: Research the rapid venture capital deployment and subsequent collapse of 15-minute ultra-fast grocery delivery startups.\n\nThe Task: Analyze micro-fulfillment hub real estate costs, order density requirements, customer acquisition unit economics, and ridership labor expenses. Formulate a sustainability checklist for hyper-local urban logistics models.",
    },
    {
      category: "Strategy & Competition",
      title: "Strategic Exit Planning Under Severe Market Distress",
      description:
        "Company / Context: Yahoo’s core internet business sale to Verizon (2016–2017).\n\nResearch Assignment: Examine Yahoo’s prolonged strategic decline, activist investor pressures, failure to execute core pivots, and eventual $4.4B sale of its core web assets to Verizon while separating its valuable Alibaba equity stake.\n\nThe Task: Track key strategic pivot failures (search vs. display ads vs. media acquisitions), operational margin erosion, and corporate governance decisions. Provide a strategic restructuring framework for mature technology incumbents facing irreversible core platform decline.",
    },
  ],
};

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function CardBack() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-3 text-center text-[#d8d5ca]">
      <div className="flex h-full w-full items-center justify-center rounded border border-[#d8d5ca]/30 p-2">
        <span className="font-serif text-xs font-bold tracking-widest opacity-40">MBA</span>
      </div>
    </div>
  );
}

export default function Home() {
  const [mode, setMode] = useState<Mode>("offroad");
  const [topic, setTopic] = useState("All topics");
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [drawnTitles, setDrawnTitles] = useState<string[]>([]);
  const [isShuffling, setIsShuffling] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [phase, setPhase] = useState<Phase>("draw");
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settingsLoaded, setSettingsLoaded] = useState(false);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);

  const shuffleTimeout = useRef<number | null>(null);
  const drawTimeout = useRef<number | null>(null);

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

  useEffect(() => {
    return () => {
      if (shuffleTimeout.current) clearTimeout(shuffleTimeout.current);
      if (drawTimeout.current) clearTimeout(drawTimeout.current);
    };
  }, []);

  const topics = Array.from(new Set(decks[mode].map((item) => item.category))).sort();

  const filteredDeck =
    topic === "All topics"
      ? decks[mode]
      : decks[mode].filter((item) => item.category === topic);

  function cancelAnimations() {
    if (shuffleTimeout.current) clearTimeout(shuffleTimeout.current);
    if (drawTimeout.current) clearTimeout(drawTimeout.current);
    shuffleTimeout.current = null;
    drawTimeout.current = null;
    setIsShuffling(false);
    setIsDrawing(false);
  }

  function resetChallenge() {
    cancelAnimations();
    setPhase("draw");
    setSecondsLeft(0);
    setChallenge(null);
  }

  function switchMode(nextMode: Mode) {
    if (isShuffling || isDrawing) return;
    setMode(nextMode);
    setTopic("All topics");
    setDrawnTitles([]);
    resetChallenge();
  }

  function drawCard() {
    if (isShuffling || isDrawing || filteredDeck.length === 0) return;

    const available = filteredDeck.filter(
      (item) => !drawnTitles.includes(item.title)
    );

    const drawPool = available.length > 0 ? available : filteredDeck;
    const next = drawPool[Math.floor(Math.random() * drawPool.length)];

    setIsShuffling(true);
    setIsDrawing(false);
    setChallenge(null);
    setPhase("draw");
    setSecondsLeft(0);

    // Physical-style shuffle animation, followed by a single-card draw.
    shuffleTimeout.current = window.setTimeout(() => {
      setIsShuffling(false);
      setIsDrawing(true);

      drawTimeout.current = window.setTimeout(() => {
        setChallenge(next);
        setDrawnTitles((previous) =>
          available.length === 0 ? [next.title] : [...previous, next.title]
        );
        setIsDrawing(false);
      }, 650);
    }, 1900);
  }

  function startResearch() {
    setSecondsLeft(settings.researchMinutes * 60);
    setPhase("research");
  }

  function startSpeaking() {
    setSecondsLeft(settings.speechMinutes * 60);
    setPhase("speaking");
  }

  function updateMinutes(key: "speechMinutes" | "researchMinutes", amount: number) {
    setSettings((current) => ({
      ...current,
      [key]: Math.max(1, Math.min(60, current[key] + amount)),
    }));
  }

  return (
    <main className="min-h-screen bg-[#faf9f6] px-6 py-8 text-[#21483a] sm:px-10 lg:px-16">
      <header className="flex flex-wrap items-start justify-between gap-5">
        <div>
          <h1 className="font-serif text-3xl sm:text-[34px]">The MBA School</h1>
          <p className="font-serif text-lg">A gym for business judgement</p>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-sm">
          <a href="https://www.instagram.com/who.is.this.deiva/" target="_blank" rel="noreferrer" className="hover:underline">Instagram</a>
          <a href="https://www.linkedin.com/in/deiva-darshini-r-0784a0424/" target="_blank" rel="noreferrer" className="hover:underline">LinkedIn</a>
          <span className="hidden text-xs text-[#21483a]/60 xl:inline">Made by R Deiva Darshini</span>
          <button onClick={() => setSettingsOpen(true)} className="border border-[#21483a]/30 px-4 py-2 transition hover:bg-[#21483a] hover:text-[#faf9f6]">⚙ Settings</button>
        </div>
      </header>

      <section className="mx-auto mt-10 max-w-3xl">
        <p className="text-center font-serif text-lg text-[#171717]">Choose a topic. Draw a challenge. Think for yourself.</p>

        <div className="mt-7 flex flex-wrap justify-center gap-4">
          <button onClick={() => switchMode("offroad")} disabled={isShuffling || isDrawing} aria-pressed={mode === "offroad"} className={`w-64 px-5 py-5 font-serif text-lg transition ${mode === "offroad" ? "bg-[#21483a] text-[#faf9f6]" : "bg-[#dedddb] hover:bg-[#d2d0cb]"}`}>
            Off the road
            <span className="mt-1 block text-sm">Keeping you on your toes.</span>
          </button>
          <button onClick={() => switchMode("research")} disabled={isShuffling || isDrawing} aria-pressed={mode === "research"} className={`w-64 px-5 py-5 font-serif text-lg transition ${mode === "research" ? "bg-[#21483a] text-[#faf9f6]" : "bg-[#dedddb] hover:bg-[#d2d0cb]"}`}>
            Research
            <span className="mt-1 block text-sm">Take your time.</span>
          </button>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <label htmlFor="topic-select" className="text-sm">Choose a topic</label>
          <select
            id="topic-select"
            value={topic}
            disabled={isShuffling || isDrawing}
            onChange={(event) => {
              setTopic(event.target.value);
              setDrawnTitles([]);
              resetChallenge();
            }}
            className="min-w-56 border border-[#21483a]/30 bg-transparent px-4 py-2 text-sm outline-none focus:border-[#21483a]"
          >
            <option value="All topics">All topics</option>
            {topics.map((category) => <option key={category} value={category}>{category}</option>)}
          </select>
        </div>
      </section>

      {/* PHYSICAL-STYLE CARD DECK */}
      <section className="mx-auto mt-14 max-w-3xl">
        <div className="flex flex-col items-center">
          <p className="mb-2 text-xs uppercase tracking-[0.25em] text-[#77776f]">Your challenge deck</p>
          <h2 className="mb-3 text-center font-serif text-3xl">
            {isShuffling ? "Shuffling the deck..." : isDrawing ? "Drawing your card..." : challenge ? "Your card is ready" : "Ready to draw?"}
          </h2>
          <p className="mb-8 text-center text-sm text-[#77776f]">
            {challenge ? "Your next business challenge has been drawn." : "Shuffle the deck and discover your next challenge."}
          </p>

          <div className={`card-table relative flex h-[310px] w-full max-w-md items-center justify-center ${isShuffling ? "is-shuffling" : ""} ${isDrawing ? "is-drawing" : ""}`}>
            {!challenge && (
              <>
                <div className="deck-half deck-left">
                  {Array.from({ length: 7 }, (_, index) => (
                    <div className={`playing-card card-left card-${index + 1}`} key={`left-${index}`}>
                      <CardBack />
                    </div>
                  ))}
                </div>
                <div className="deck-half deck-right">
                  {Array.from({ length: 7 }, (_, index) => (
                    <div className={`playing-card card-right card-${index + 1}`} key={`right-${index}`}>
                      <CardBack />
                    </div>
                  ))}
                </div>
              </>
            )}

            {challenge && (
              <div className="drawn-card w-72 rounded-lg border border-[#d8d5ca] bg-[#21483a] p-6 text-center text-[#faf9f6] shadow-lg">
                <div className="drawn-card-inner">
                  <div className="drawn-card-front">
                    <p className="mb-4 text-xs uppercase tracking-[0.2em] text-[#d8d5ca]">{challenge.category}</p>
                    <h3 className="font-serif text-2xl">{challenge.title}</h3>
                    <p className="mt-5 text-xs tracking-[0.15em] text-[#d8d5ca]">YOUR CHALLENGE</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={drawCard}
            disabled={isShuffling || isDrawing}
            className="mt-7 min-w-52 bg-[#21483a] px-8 py-4 text-sm tracking-wide text-[#faf9f6] transition hover:bg-[#2b5948] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isShuffling ? "SHUFFLING..." : isDrawing ? "DRAWING..." : challenge ? "DRAW ANOTHER CARD" : "SHUFFLE & DRAW"}
          </button>

          <p className="mt-3 text-xs text-[#77776f]">
            {Math.max(0, filteredDeck.length - drawnTitles.length)} challenges remaining in this deck
          </p>
        </div>
      </section>

      {/* CHALLENGE AND TIMERS */}
      {challenge && (
        <section className="mx-auto mt-8 max-w-[850px] border-t border-[#21483a]/20 pt-7">
          {phase === "draw" && (
            <div className="grid gap-6 sm:grid-cols-[1fr_auto] sm:items-center sm:gap-8">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-[#77776f]">Your challenge</p>
                <h2 className="mt-2 font-serif text-2xl">{challenge.title}</h2>
                <p className="mt-2 max-w-2xl whitespace-pre-line text-sm leading-6 text-[#343a35]">{challenge.description}</p>
              </div>
              <button onClick={startResearch} className="bg-[#21483a] px-6 py-4 text-sm text-[#faf9f6] transition hover:bg-[#2b5948]">
                Start research
                <span className="mt-1 block text-xs text-[#d8d5ca]">{settings.researchMinutes} min</span>
              </button>
            </div>
          )}

          {phase === "research" && (
            <div className="grid gap-6 sm:grid-cols-[1fr_auto] sm:items-center sm:gap-8">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-[#77776f]">Research in progress</p>
                <h2 className="mt-2 font-serif text-2xl">{challenge.title}</h2>
                <p className="mt-2 max-w-2xl whitespace-pre-line text-sm leading-6 text-[#343a35]">{challenge.description}</p>
                <p className="mt-3 text-sm text-[#21483a]/75">Form a view, find evidence, and decide what matters most.</p>
              </div>
              <div className="min-w-44 bg-[#21483a] px-7 py-5 text-center text-[#faf9f6]">
                <p className="text-xs uppercase tracking-[0.2em] text-[#d8d5ca]">Research time</p>
                <p className="mt-2 font-serif text-4xl tabular-nums">{formatTime(secondsLeft)}</p>
                {!settings.deepResearchOnly && (
                  <button onClick={() => setPhase("ready")} className="mt-4 text-xs text-[#d8d5ca] underline">Finish research early</button>
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
                <p className="text-sm text-[#343a35]">Up next: {settings.speechMinutes} {settings.speechMinutes === 1 ? "min" : "mins"} to speak.</p>
              </div>
              <button onClick={startSpeaking} className="bg-[#21483a] px-8 py-4 text-[#faf9f6] transition hover:bg-[#2b5948]">I&apos;m ready to speak</button>
              <p className="mt-3 text-xs text-[#77776f]">Click to start the speaking timer.</p>
            </div>
          )}

          {phase === "speaking" && (
            <div className="mx-auto max-w-xl py-3 text-center">
              <p className="text-xs uppercase tracking-[0.2em]">Speak your answer</p>
              <h2 className="mt-2 font-serif text-3xl">{challenge.title}</h2>
              <p className="mt-3 text-sm text-[#343a35]">Make your case. Explain your reasoning. State what would change your mind.</p>
              <p className="my-6 font-serif text-6xl tabular-nums">{formatTime(secondsLeft)}</p>
              <button onClick={() => setPhase("finished")} className="border border-[#21483a] px-6 py-3 text-sm hover:bg-[#21483a] hover:text-[#faf9f6]">Finish speaking</button>
            </div>
          )}

          {phase === "finished" && (
            <div className="mx-auto max-w-xl py-3 text-center">
              <p className="text-xs uppercase tracking-[0.2em]">Session complete</p>
              <h2 className="mt-2 font-serif text-3xl">{challenge.title}</h2>
              <p className="mt-4 text-sm text-[#343a35]">Reflect: what was your conclusion, and what evidence mattered most?</p>
              <button onClick={drawCard} disabled={isShuffling || isDrawing} className="mt-6 bg-[#21483a] px-7 py-4 text-[#faf9f6] hover:bg-[#2b5948] disabled:opacity-60">Draw another challenge</button>
            </div>
          )}
        </section>
      )}

      <p className="mt-10 text-center font-serif text-sm text-[#21483a]/70">One challenge at a time. Think before you act.</p>

      {/* SETTINGS MODAL */}
      {settingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 px-6 py-8" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setSettingsOpen(false);
        }}>
          <section role="dialog" aria-modal="true" aria-labelledby="settings-title" className="w-full max-w-lg bg-[#faf9f6] p-8 text-[#21483a] shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 id="settings-title" className="font-serif text-3xl">Settings</h2>
              <button onClick={() => setSettingsOpen(false)} aria-label="Close settings" className="px-2 py-1 text-2xl leading-none hover:bg-[#dedddb]">×</button>
            </div>
            <p className="mt-3 text-sm text-[#66685f]">Timer lengths in whole minutes.</p>

            <div className="mt-7 space-y-6">
              <div className="flex items-center justify-between gap-4 border-b border-[#21483a]/15 pb-5">
                <div>
                  <p className="font-medium">Speech</p>
                  <p className="mt-1 text-xs text-[#66685f]">Time to present your answer</p>
                </div>
                <div className="flex items-center gap-4">
                  <button onClick={() => updateMinutes("speechMinutes", -1)} disabled={settings.speechMinutes <= 1} aria-label="Decrease speech timer" className="h-9 w-9 border border-[#21483a]/30 disabled:opacity-30">−</button>
                  <span className="w-16 text-center font-serif text-lg">{settings.speechMinutes} {settings.speechMinutes === 1 ? "min" : "mins"}</span>
                  <button onClick={() => updateMinutes("speechMinutes", 1)} disabled={settings.speechMinutes >= 60} aria-label="Increase speech timer" className="h-9 w-9 border border-[#21483a]/30 disabled:opacity-30">+</button>
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 border-b border-[#21483a]/15 pb-5">
                <div>
                  <p className="font-medium">Research</p>
                  <p className="mt-1 text-xs text-[#66685f]">Time to think and research</p>
                </div>
                <div className="flex items-center gap-4">
                  <button onClick={() => updateMinutes("researchMinutes", -1)} disabled={settings.researchMinutes <= 1} aria-label="Decrease research timer" className="h-9 w-9 border border-[#21483a]/30 disabled:opacity-30">−</button>
                  <span className="w-16 text-center font-serif text-lg">{settings.researchMinutes} {settings.researchMinutes === 1 ? "min" : "mins"}</span>
                  <button onClick={() => updateMinutes("researchMinutes", 1)} disabled={settings.researchMinutes >= 60} aria-label="Increase research timer" className="h-9 w-9 border border-[#21483a]/30 disabled:opacity-30">+</button>
                </div>
              </div>

              <label className="flex cursor-pointer items-start justify-between gap-6">
                <span>
                  <span className="block font-medium">Deep research only</span>
                  <span className="mt-1 block text-xs text-[#66685f]">Keep the full research timer and hide the early-finish option.</span>
                </span>
                <input type="checkbox" checked={settings.deepResearchOnly} onChange={(event) => setSettings((current) => ({ ...current, deepResearchOnly: event.target.checked }))} className="mt-1 h-5 w-5 accent-[#21483a]" />
              </label>

              <label className="flex cursor-pointer items-start justify-between gap-6">
                <span>
                  <span className="block font-medium">Mute sound effects</span>
                  <span className="mt-1 block text-xs text-[#66685f]">Silence the optional timer sound.</span>
                </span>
                <input type="checkbox" checked={settings.muteSoundEffects} onChange={(event) => setSettings((current) => ({ ...current, muteSoundEffects: event.target.checked }))} className="mt-1 h-5 w-5 accent-[#21483a]" />
              </label>
            </div>

            <p className="mt-6 text-xs text-[#66685f]">Settings are saved in this browser.</p>
            <button onClick={() => setSettingsOpen(false)} className="mt-5 w-full bg-[#21483a] px-6 py-4 font-medium text-[#faf9f6] transition hover:bg-[#2b5948]">Done</button>
          </section>
        </div>
      )}

      <style jsx>{`
        .card-table {
          perspective: 1200px;
          isolation: isolate;
        }

        .deck-half {
          position: absolute;
          width: 104px;
          height: 148px;
          transform-style: preserve-3d;
        }

        .deck-left {
          transform: translateX(-42px) rotate(-7deg);
        }

        .deck-right {
          transform: translateX(42px) rotate(7deg);
        }

        .playing-card {
          position: absolute;
          inset: 0;
          border-radius: 10px;
          border: 1px solid #d8d5ca;
          background: #21483a;
          box-shadow: 0 5px 12px rgba(25, 40, 30, 0.18);
          overflow: hidden;
          transform-origin: center bottom;
          backface-visibility: hidden;
        }

        .card-left:nth-child(1) { transform: translate(-3px, 2px) rotate(-3deg); }
        .card-left:nth-child(2) { transform: translate(-2px, 1px) rotate(-2deg); }
        .card-left:nth-child(3) { transform: translate(-1px, 0) rotate(-1deg); }
        .card-left:nth-child(4) { transform: translate(0, -1px); }
        .card-left:nth-child(5) { transform: translate(1px, -2px) rotate(1deg); }
        .card-left:nth-child(6) { transform: translate(2px, -3px) rotate(2deg); }
        .card-left:nth-child(7) { transform: translate(3px, -4px) rotate(3deg); }

        .card-right:nth-child(1) { transform: translate(3px, 2px) rotate(3deg); }
        .card-right:nth-child(2) { transform: translate(2px, 1px) rotate(2deg); }
        .card-right:nth-child(3) { transform: translate(1px, 0) rotate(1deg); }
        .card-right:nth-child(4) { transform: translate(0, -1px); }
        .card-right:nth-child(5) { transform: translate(-1px, -2px) rotate(-1deg); }
        .card-right:nth-child(6) { transform: translate(-2px, -3px) rotate(-2deg); }
        .card-right:nth-child(7) { transform: translate(-3px, -4px) rotate(-3deg); }
      `}</style>
    </main>
  );
}