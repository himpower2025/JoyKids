import React, { useState, useEffect } from 'react';
import { GameSettings } from '../types';
import { sounds } from '../utils/sound';
import confetti from 'canvas-confetti';
import { ArrowLeft, RotateCcw, Lightbulb, Trophy, CheckCircle2, Volume2, Search } from 'lucide-react';
import { TeamScoreboard } from '../components/TeamScoreboard';
import { TeamVictoryModal } from '../components/TeamVictoryModal';

interface Props {
  settings: GameSettings;
  onBack: () => void;
  onEarnStars: (count: number) => void;
  onChangeSettings: () => void;
}

interface HiddenTarget {
  id: number;
  name: string;
  emoji: string;
  x: number;
  y: number;
  radius: number;
  hint: string;
}

interface HiddenScene {
  id: string;
  title: string;
  subtitle: string;
  targets: HiddenTarget[];
  renderIllustration: (foundIds: number[]) => React.ReactNode;
}

const HIDDEN_SCENES: HiddenScene[] = [
  // Scene 1: Sunday School Playground & Church Garden
  {
    id: 'church-garden',
    title: 'Sunday School Garden',
    subtitle: 'Find 5 hidden tools and items in the garden!',
    targets: [
      { id: 1, name: 'Spoon', emoji: '🥄', x: 28, y: 76, radius: 9, hint: 'Look near the wooden garden bench legs!' },
      { id: 2, name: 'Toothbrush', emoji: '🪥', x: 82, y: 82, radius: 9, hint: 'Look inside the flower planter pot!' },
      { id: 3, name: 'Golden Key', emoji: '🔑', x: 52, y: 50, radius: 9, hint: 'Look on the church door frame post!' },
      { id: 4, name: 'Glasses', emoji: '👓', x: 14, y: 56, radius: 9, hint: 'Look on top of the round stone birdbath!' },
      { id: 5, name: 'Bell', emoji: '🔔', x: 74, y: 22, radius: 9, hint: 'Look high up in the green tree leaves!' },
    ],
    renderIllustration: (foundIds: number[]) => (
      <svg viewBox="0 0 500 350" className="w-full h-full select-none pointer-events-none">
        <defs>
          <linearGradient id="gardenSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#BAE6FD" />
            <stop offset="60%" stopColor="#E0F2FE" />
            <stop offset="100%" stopColor="#FEF9C3" />
          </linearGradient>
          <linearGradient id="grassGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#86EFAC" />
            <stop offset="100%" stopColor="#22C55E" />
          </linearGradient>
        </defs>

        <rect width="500" height="200" fill="url(#gardenSky)" />
        <circle cx="430" cy="50" r="30" fill="#FDE047" opacity="0.8" />
        <circle cx="430" cy="50" r="22" fill="#FBBF24" />

        <g fill="#FFFFFF" opacity="0.85">
          <ellipse cx="80" cy="50" rx="35" ry="18" />
          <ellipse cx="110" cy="45" rx="25" ry="20" />
          <ellipse cx="280" cy="60" rx="30" ry="16" />
        </g>

        {/* Church in Center Background */}
        <g transform="translate(180, 70)">
          <rect x="20" y="50" width="120" height="90" fill="#F8FAFC" stroke="#64748B" strokeWidth="3" />
          <polygon points="10,50 80,10 150,50" fill="#EA580C" stroke="#9A3412" strokeWidth="2" />
          <rect x="50" y="-30" width="40" height="80" fill="#F1F5F9" stroke="#64748B" strokeWidth="3" />
          <polygon points="45,-30 70,-65 95,-30" fill="#C2410C" stroke="#9A3412" strokeWidth="2" />
          <g stroke="#F59E0B" strokeWidth="3" strokeLinecap="round">
            <line x1="70" y1="-80" x2="70" y2="-65" />
            <line x1="62" y1="-74" x2="78" y2="-74" />
          </g>

          <path d="M 60,140 L 60,95 Q 80,80 100,95 L 100,140 Z" fill="#78350F" stroke="#451A03" strokeWidth="2" />
          <circle cx="92" cy="115" r="3" fill="#FDE047" />

          <circle cx="80" cy="65" r="14" fill="#38BDF8" stroke="#0284C7" strokeWidth="2" />
          <line x1="80" y1="51" x2="80" y2="79" stroke="#0284C7" strokeWidth="1.5" />
          <line x1="66" y1="65" x2="94" y2="65" stroke="#0284C7" strokeWidth="1.5" />

          {/* Target #3: Golden Key */}
          <g transform="translate(82, 105)">
            <circle cx="0" cy="0" r="4.5" fill="#FBBF24" stroke="#B45309" strokeWidth="1.2" />
            <circle cx="0" cy="0" r="2" fill="#78350F" />
            <line x1="0" y1="4.5" x2="0" y2="16" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" />
            <line x1="0" y1="12" x2="4" y2="12" stroke="#FBBF24" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="0" y1="15" x2="3" y2="15" stroke="#FBBF24" strokeWidth="1.5" strokeLinecap="round" />
          </g>
        </g>

        {/* Grass Lawn */}
        <path d="M 0,190 Q 250,170 500,190 L 500,350 L 0,350 Z" fill="url(#grassGrad)" />

        {/* Big Apple Tree on Right */}
        <g transform="translate(320, 40)">
          <path d="M 50,180 Q 60,110 40,70 Q 70,100 80,180" fill="#78350F" />
          <circle cx="60" cy="60" r="55" fill="#15803D" />
          <circle cx="20" cy="70" r="45" fill="#16A34A" />
          <circle cx="100" cy="65" r="48" fill="#22C55E" />
          <circle cx="55" cy="25" r="50" fill="#4ADE80" />

          {/* Target #5: Bell */}
          <g transform="translate(50, 40)">
            <path d="M -8,12 Q -10,0 0,-10 Q 10,0 8,12 Z" fill="#F59E0B" stroke="#B45309" strokeWidth="1.5" />
            <ellipse cx="0" cy="12" rx="9" ry="2.5" fill="#FBBF24" stroke="#B45309" strokeWidth="1" />
            <circle cx="0" cy="14" r="2" fill="#78350F" />
          </g>
        </g>

        {/* Garden Bench on Left */}
        <g transform="translate(100, 230)">
          <rect x="0" y="15" width="80" height="10" rx="3" fill="#92400E" stroke="#451A03" strokeWidth="2" />
          <rect x="0" y="0" width="80" height="8" rx="2" fill="#92400E" stroke="#451A03" strokeWidth="2" />
          <rect x="10" y="8" width="6" height="7" fill="#78350F" />
          <rect x="64" y="8" width="6" height="7" fill="#78350F" />
          <rect x="8" y="25" width="6" height="30" fill="#451A03" rx="1" />
          <rect x="66" y="25" width="6" height="30" fill="#451A03" rx="1" />

          {/* Target #1: Spoon */}
          <g transform="translate(40, 36) rotate(45)">
            <ellipse cx="0" cy="-10" rx="4" ry="7" fill="#94A3B8" stroke="#475569" strokeWidth="1" />
            <line x1="0" y1="-3" x2="0" y2="18" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
          </g>
        </g>

        {/* Stone Birdbath on Far Left */}
        <g transform="translate(40, 160)">
          <rect x="25" y="40" width="16" height="50" fill="#94A3B8" stroke="#64748B" strokeWidth="2" rx="2" />
          <ellipse cx="33" cy="38" rx="32" ry="12" fill="#64748B" />
          <ellipse cx="33" cy="36" rx="28" ry="9" fill="#38BDF8" stroke="#0284C7" strokeWidth="1.5" />

          {/* Target #4: Glasses */}
          <g transform="translate(38, 36)">
            <circle cx="-6" cy="0" r="4.5" fill="none" stroke="#E11D48" strokeWidth="1.5" />
            <circle cx="6" cy="0" r="4.5" fill="none" stroke="#E11D48" strokeWidth="1.5" />
            <line x1="-1.5" y1="0" x2="1.5" y2="0" stroke="#E11D48" strokeWidth="1.5" />
            <line x1="-10.5" y1="-1" x2="-14" y2="3" stroke="#E11D48" strokeWidth="1" />
            <line x1="10.5" y1="-1" x2="14" y2="3" stroke="#E11D48" strokeWidth="1" />
          </g>
        </g>

        {/* Flower Planter Pot on Right */}
        <g transform="translate(380, 240)">
          <polygon points="10,25 50,25 44,60 16,60" fill="#EA580C" stroke="#9A3412" strokeWidth="2" />
          <ellipse cx="30" cy="25" rx="20" ry="6" fill="#78350F" />
          <circle cx="20" cy="15" r="7" fill="#F43F5E" />
          <circle cx="38" cy="12" r="7" fill="#FBBF24" />
          <circle cx="30" cy="5" r="8" fill="#A855F7" />

          {/* Target #2: Toothbrush */}
          <g transform="translate(32, 45) rotate(-25)">
            <rect x="-2" y="-18" width="4" height="28" rx="1.5" fill="#38BDF8" stroke="#0284C7" strokeWidth="1" />
            <rect x="-3" y="-23" width="6" height="5" rx="1" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="0.8" />
          </g>
        </g>
      </svg>
    ),
  },

  // Scene 2: Noah's Great Ark Deck
  {
    id: 'noahs-deck',
    title: "Noah's Ark Deck",
    subtitle: 'Find 5 hidden items on the wooden ship deck!',
    targets: [
      { id: 1, name: 'Spoon', emoji: '🥄', x: 68, y: 76, radius: 9, hint: 'Look beside the animal food trough on the deck!' },
      { id: 2, name: 'Toothbrush', emoji: '🪥', x: 18, y: 68, radius: 9, hint: 'Look leaning on the wooden barrel!' },
      { id: 3, name: 'Candle', emoji: '🕯️', x: 48, y: 38, radius: 9, hint: 'Look on the cabin window shelf!' },
      { id: 4, name: 'Cozy Sock', emoji: '🧦', x: 88, y: 58, radius: 9, hint: 'Look draped over the side rope railing!' },
      { id: 5, name: 'Apple', emoji: '🍎', x: 34, y: 82, radius: 9, hint: 'Look tucked in the round coil of rope!' },
    ],
    renderIllustration: (foundIds: number[]) => (
      <svg viewBox="0 0 500 350" className="w-full h-full select-none pointer-events-none">
        <rect width="500" height="160" fill="#E0F2FE" />
        <path d="M 50,160 A 240,240 0 0,1 450,160" fill="none" stroke="#F87171" strokeWidth="10" opacity="0.6" />
        <path d="M 60,160 A 230,230 0 0,1 440,160" fill="none" stroke="#FBBF24" strokeWidth="10" opacity="0.6" />
        <path d="M 70,160 A 220,220 0 0,1 430,160" fill="none" stroke="#4ADE80" strokeWidth="10" opacity="0.6" />
        <path d="M 80,160 A 210,210 0 0,1 420,160" fill="none" stroke="#38BDF8" strokeWidth="10" opacity="0.6" />

        <g transform="translate(120, 50)">
          <ellipse cx="0" cy="0" rx="14" ry="8" fill="#FFFFFF" />
          <path d="M -5,-3 Q -15,-16 0,-14" fill="#FFFFFF" />
          <polygon points="12,-2 18,0 12,2" fill="#F97316" />
        </g>

        <rect y="140" width="500" height="60" fill="#0284C7" />
        <path d="M 0,150 Q 50,140 100,150 T 200,150 T 300,150 T 400,150 T 500,150" fill="none" stroke="#7DD3FC" strokeWidth="4" />

        {/* Wooden Deck Floor */}
        <polygon points="0,200 500,180 500,350 0,350" fill="#B45309" stroke="#78350F" strokeWidth="4" />
        <line x1="0" y1="230" x2="500" y2="210" stroke="#78350F" strokeWidth="2" />
        <line x1="0" y1="265" x2="500" y2="245" stroke="#78350F" strokeWidth="2" />
        <line x1="0" y1="305" x2="500" y2="285" stroke="#78350F" strokeWidth="2" />

        {/* Ark Cabin */}
        <g transform="translate(180, 80)">
          <rect x="0" y="0" width="160" height="110" fill="#D97706" stroke="#78350F" strokeWidth="3" rx="4" />
          <polygon points="-10,0 80,-30 170,0" fill="#92400E" stroke="#451A03" strokeWidth="3" />
          <rect x="40" y="25" width="80" height="50" fill="#FEF08A" stroke="#78350F" strokeWidth="3" rx="2" />
          <line x1="80" y1="25" x2="80" y2="75" stroke="#78350F" strokeWidth="2" />

          {/* Target #3: Candle */}
          <g transform="translate(60, 50)">
            <rect x="-3" y="10" width="6" height="14" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="1" rx="1" />
            <ellipse cx="0" cy="8" rx="2.5" ry="4" fill="#FBBF24" />
            <circle cx="0" cy="8" r="1.5" fill="#EF4444" />
          </g>
        </g>

        {/* Rope Railing */}
        <g transform="translate(400, 160)">
          <rect x="20" y="0" width="8" height="60" fill="#78350F" />
          <rect x="70" y="0" width="8" height="60" fill="#78350F" />
          <line x1="0" y1="15" x2="100" y2="15" stroke="#FDE047" strokeWidth="5" />
          <line x1="0" y1="40" x2="100" y2="40" stroke="#FDE047" strokeWidth="5" />

          {/* Target #4: Sock */}
          <g transform="translate(40, 40)">
            <path d="M -4,-2 L 4,-2 L 4,14 Q 4,20 12,20 L 14,24 Q 8,28 0,22 L -4,14 Z" fill="#F43F5E" stroke="#BE123C" strokeWidth="1.2" />
            <line x1="-3" y1="2" x2="3" y2="2" stroke="#FFFFFF" strokeWidth="1.5" />
          </g>
        </g>

        {/* Barrel on Left */}
        <g transform="translate(60, 200)">
          <path d="M 10,0 Q 0,25 10,50 L 40,50 Q 50,25 40,0 Z" fill="#92400E" stroke="#451A03" strokeWidth="2" />
          <ellipse cx="25" cy="0" rx="15" ry="5" fill="#B45309" stroke="#451A03" strokeWidth="1.5" />

          {/* Target #2: Toothbrush */}
          <g transform="translate(32, 38) rotate(18)">
            <rect x="-2" y="-18" width="4" height="26" rx="1.5" fill="#A855F7" stroke="#7E22CE" strokeWidth="1" />
            <rect x="-3" y="-23" width="6" height="5" rx="1" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="0.8" />
          </g>
        </g>

        {/* Coiled Rope */}
        <g transform="translate(170, 280)">
          <ellipse cx="0" cy="0" rx="25" ry="14" fill="none" stroke="#FBBF24" strokeWidth="6" />
          <ellipse cx="0" cy="0" rx="16" ry="9" fill="none" stroke="#D97706" strokeWidth="5" />

          {/* Target #5: Apple */}
          <g transform="translate(0, -2)">
            <circle cx="0" cy="0" r="7" fill="#DC2626" />
            <ellipse cx="2" cy="-2" rx="2" ry="3" fill="#EF4444" />
            <line x1="0" y1="-7" x2="2" y2="-11" stroke="#78350F" strokeWidth="1.5" />
            <ellipse cx="3" cy="-10" rx="2" ry="1" fill="#22C55E" />
          </g>
        </g>

        {/* Animal Trough */}
        <g transform="translate(320, 245)">
          <polygon points="0,0 80,0 70,30 10,30" fill="#78350F" stroke="#451A03" strokeWidth="2" />
          <polygon points="5,2 75,2 66,16 14,16" fill="#FEF08A" opacity="0.9" />

          {/* Target #1: Spoon */}
          <g transform="translate(20, 18) rotate(-35)">
            <ellipse cx="0" cy="-8" rx="4" ry="6" fill="#94A3B8" stroke="#475569" strokeWidth="1" />
            <line x1="0" y1="-2" x2="0" y2="16" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
          </g>
        </g>
      </svg>
    ),
  },

  // Scene 3: Cozy Sunday School Classroom
  {
    id: 'cozy-classroom',
    title: 'Cozy Classroom',
    subtitle: 'Find 5 hidden school tools in the room!',
    targets: [
      { id: 1, name: 'Pencil', emoji: '✏️', x: 28, y: 74, radius: 9, hint: "Look on the brown teacher's desk!" },
      { id: 2, name: 'Scissors', emoji: '✂️', x: 84, y: 39, radius: 9, hint: 'Look on the top shelf of the bookcase!' },
      { id: 3, name: 'Blue Mug', emoji: '☕', x: 19, y: 41, radius: 9, hint: 'Look resting on the left windowsill!' },
      { id: 4, name: 'Red Book', emoji: '📕', x: 53, y: 44, radius: 9, hint: 'Look on the chalkboard chalk tray!' },
      { id: 5, name: 'Wrist Watch', emoji: '⌚', x: 72, y: 80, radius: 9, hint: 'Look on the floor beside the right chair!' },
    ],
    renderIllustration: () => (
      <svg viewBox="0 0 500 350" className="w-full h-full select-none pointer-events-none">
        {/* Wall & Wooden Floor */}
        <rect width="500" height="225" fill="#FEF3C7" />
        <rect y="225" width="500" height="125" fill="#D97706" />
        <line x1="0" y1="225" x2="500" y2="225" stroke="#78350F" strokeWidth="4" />

        {/* Left Window */}
        <g transform="translate(35, 45)">
          <rect x="0" y="0" width="90" height="100" fill="#BAE6FD" stroke="#92400E" strokeWidth="5" rx="3" />
          <line x1="45" y1="0" x2="45" y2="100" stroke="#92400E" strokeWidth="3" />
          <line x1="0" y1="50" x2="90" y2="50" stroke="#92400E" strokeWidth="3" />
          <rect x="-8" y="98" width="106" height="10" fill="#B45309" rx="2" />
        </g>
        {/* Target #3: Blue Mug at (95, 145) */}
        <g transform="translate(95, 142)">
          <rect x="-7" y="-8" width="14" height="14" rx="2" fill="#0284C7" stroke="#0369A1" strokeWidth="1.5" />
          <circle cx="9" cy="-1" r="4" fill="none" stroke="#0369A1" strokeWidth="2" />
        </g>

        {/* Center Chalkboard */}
        <g transform="translate(155, 40)">
          <rect x="0" y="0" width="190" height="115" fill="#1E293B" stroke="#92400E" strokeWidth="6" rx="4" />
          <text x="95" y="45" fill="#FEF08A" fontSize="16" fontWeight="bold" textAnchor="middle">ABC • 123</text>
          <text x="95" y="75" fill="#86EFAC" fontSize="13" fontWeight="bold" textAnchor="middle">Love &amp; Kindness</text>
          <rect x="-4" y="112" width="198" height="8" fill="#78350F" rx="2" />
        </g>
        {/* Target #4: Red Book at (265, 155) */}
        <g transform="translate(265, 152) rotate(-8)">
          <rect x="-12" y="-7" width="24" height="15" rx="2" fill="#DC2626" stroke="#7F1D1D" strokeWidth="1.5" />
          <line x1="-10" y1="0" x2="10" y2="0" stroke="#FEF2F2" strokeWidth="2" />
        </g>

        {/* Bookshelf on Right */}
        <g transform="translate(380, 105)">
          <rect x="0" y="0" width="85" height="125" fill="#92400E" stroke="#451A03" strokeWidth="3" />
          <rect x="8" y="38" width="69" height="6" fill="#78350F" />
          <rect x="8" y="80" width="69" height="6" fill="#78350F" />
          <rect x="14" y="46" width="12" height="34" fill="#3B82F6" />
          <rect x="28" y="50" width="12" height="30" fill="#22C55E" />
          <rect x="44" y="45" width="14" height="35" fill="#F59E0B" />
        </g>
        {/* Target #2: Scissors at (420, 135) */}
        <g transform="translate(420, 135) rotate(25)">
          <circle cx="-5" cy="7" r="4" fill="none" stroke="#EC4899" strokeWidth="2" />
          <circle cx="5" cy="7" r="4" fill="none" stroke="#EC4899" strokeWidth="2" />
          <line x1="-2" y1="3" x2="4" y2="-10" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="2" y1="3" x2="-4" y2="-10" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" />
        </g>

        {/* Teacher's Desk on Left */}
        <g transform="translate(60, 215)">
          <rect x="0" y="30" width="150" height="16" fill="#B45309" stroke="#78350F" strokeWidth="2" rx="2" />
          <rect x="12" y="46" width="12" height="60" fill="#78350F" />
          <rect x="126" y="46" width="12" height="60" fill="#78350F" />
        </g>
        {/* Target #1: Pencil at (140, 260) */}
        <g transform="translate(140, 260) rotate(-18)">
          <rect x="-15" y="-3" width="24" height="6" fill="#FACC15" stroke="#CA8A04" strokeWidth="1" />
          <polygon points="9,-3 17,0 9,3" fill="#FED7AA" />
          <polygon points="15,-1 18,0 15,1" fill="#1E293B" />
          <rect x="-19" y="-3" width="4" height="6" fill="#FB7185" />
        </g>

        {/* Student Chair & Target #5: Wrist Watch at (360, 280) */}
        <g transform="translate(300, 220)">
          <rect x="0" y="0" width="45" height="40" fill="#38BDF8" stroke="#0284C7" strokeWidth="2" rx="4" />
          <rect x="0" y="35" width="45" height="10" fill="#0284C7" rx="2" />
          <rect x="5" y="45" width="6" height="35" fill="#475569" />
          <rect x="34" y="45" width="6" height="35" fill="#475569" />
        </g>
        <g transform="translate(360, 280)">
          <rect x="-3" y="-14" width="6" height="28" fill="#16A34A" rx="2" />
          <circle cx="0" cy="0" r="7" fill="#FFFFFF" stroke="#1E293B" strokeWidth="2" />
          <line x1="0" y1="0" x2="0" y2="-4" stroke="#1E293B" strokeWidth="1.5" />
          <line x1="0" y1="0" x2="3" y2="2" stroke="#EF4444" strokeWidth="1.5" />
        </g>
      </svg>
    ),
  },

  // Scene 4: Mountain Picnic Trail
  {
    id: 'mountain-picnic',
    title: 'Mountain Picnic Trail',
    subtitle: 'Find 5 hidden travel tools in the mountains!',
    targets: [
      { id: 1, name: 'Water Bottle', emoji: '🧴', x: 15, y: 71, radius: 9, hint: 'Look resting near the green pine tree trunk!' },
      { id: 2, name: 'Sun Hat', emoji: '👒', x: 45, y: 39, radius: 9, hint: 'Look hanging on the wooden trail signpost!' },
      { id: 3, name: 'Hair Comb', emoji: '🪮', x: 68, y: 81, radius: 9, hint: 'Look sitting on the grey stone by the stream!' },
      { id: 4, name: 'Umbrella', emoji: '☂️', x: 84, y: 57, radius: 9, hint: 'Look leaning beside the mountain hut!' },
      { id: 5, name: 'Banana', emoji: '🍌', x: 43, y: 77, radius: 9, hint: 'Look resting on the wooden picnic bench!' },
    ],
    renderIllustration: () => (
      <svg viewBox="0 0 500 350" className="w-full h-full select-none pointer-events-none">
        <rect width="500" height="190" fill="#BAE6FD" />
        <polygon points="0,190 120,65 240,190" fill="#64748B" />
        <polygon points="82,107 120,65 158,107 135,116 120,104 105,116" fill="#FFFFFF" />
        <polygon points="180,190 310,45 440,190" fill="#475569" />
        <polygon points="262,98 310,45 358,98 330,110 310,94 290,110" fill="#FFFFFF" />

        {/* Green Hillside */}
        <path d="M 0,180 Q 250,155 500,185 L 500,350 L 0,350 Z" fill="#4ADE80" />
        {/* Stream */}
        <path d="M 320,180 Q 370,260 310,350 L 385,350 Q 430,260 365,180 Z" fill="#38BDF8" />

        {/* Pine Tree on Left */}
        <g transform="translate(55, 120)">
          <rect x="-8" y="80" width="16" height="55" fill="#78350F" />
          <polygon points="-40,85 0,25 40,85" fill="#15803D" />
          <polygon points="-32,45 0,-10 32,45" fill="#166534" />
        </g>
        {/* Target #1: Water Bottle at (75, 250) */}
        <g transform="translate(75, 250)">
          <rect x="-6" y="-12" width="12" height="24" rx="3" fill="#0EA5E9" stroke="#0369A1" strokeWidth="1.5" />
          <rect x="-4" y="-16" width="8" height="4" fill="#EF4444" rx="1" />
        </g>

        {/* Trail Signpost + Target #2: Sun Hat at (225, 135) */}
        <g transform="translate(225, 135)">
          <rect x="-4" y="0" width="8" height="80" fill="#78350F" />
          <polygon points="-35,-12 28,-12 38,0 28,12 -35,12" fill="#FDE047" stroke="#B45309" strokeWidth="2" />
          <g transform="translate(0, -14)">
            <ellipse cx="0" cy="4" rx="16" ry="5" fill="#F59E0B" stroke="#92400E" strokeWidth="1.5" />
            <path d="M -9,4 Q 0,-12 9,4 Z" fill="#FBBF24" stroke="#92400E" strokeWidth="1.5" />
          </g>
        </g>

        {/* Mountain Hut + Target #4: Umbrella at (420, 200) */}
        <g transform="translate(415, 130)">
          <rect x="0" y="30" width="65" height="50" fill="#FEF3C7" stroke="#92400E" strokeWidth="2" />
          <polygon points="-8,30 32,0 73,30" fill="#EA580C" stroke="#9A3412" strokeWidth="2" />
          <rect x="22" y="50" width="20" height="30" fill="#78350F" />
        </g>
        <g transform="translate(420, 200) rotate(15)">
          <path d="M -14,0 A 14,14 0 0,1 14,0 Z" fill="#A855F7" stroke="#6B21A8" strokeWidth="1.5" />
          <line x1="0" y1="0" x2="0" y2="20" stroke="#78350F" strokeWidth="2.5" />
          <path d="M 0,20 A 4,4 0 0,0 7,20" fill="none" stroke="#78350F" strokeWidth="2.5" />
        </g>

        {/* Picnic Bench + Target #5: Banana at (215, 270) */}
        <g transform="translate(175, 255)">
          <rect x="0" y="15" width="85" height="10" rx="2" fill="#92400E" stroke="#451A03" strokeWidth="2" />
          <rect x="12" y="25" width="8" height="25" fill="#451A03" />
          <rect x="65" y="25" width="8" height="25" fill="#451A03" />
        </g>
        <g transform="translate(215, 266)">
          <path d="M -10,4 Q 0,-12 14,2 Q 2,-3 -10,4 Z" fill="#FACC15" stroke="#CA8A04" strokeWidth="1.5" />
        </g>

        {/* Rock by Stream + Target #3: Comb at (340, 285) */}
        <ellipse cx="340" cy="295" rx="24" ry="12" fill="#94A3B8" stroke="#475569" strokeWidth="2" />
        <g transform="translate(340, 285) rotate(-12)">
          <rect x="-12" y="-5" width="24" height="5" rx="2" fill="#EC4899" />
          {[-9, -5, -1, 3, 7, 10].map((tx) => (
            <line key={tx} x1={tx} y1="0" x2={tx} y2="6" stroke="#EC4899" strokeWidth="1.8" />
          ))}
        </g>
      </svg>
    ),
  },

  // Scene 5: Starry Shepherd Camp
  {
    id: 'starry-camp',
    title: 'Shepherd Starry Camp',
    subtitle: 'Find 5 hidden camp tools under the stars!',
    targets: [
      { id: 1, name: 'Lantern', emoji: '🏮', x: 39, y: 43, radius: 9, hint: 'Look hanging on the wooden tent pole!' },
      { id: 2, name: 'Soup Bowl', emoji: '🥣', x: 64, y: 74, radius: 9, hint: 'Look warming beside the campfire!' },
      { id: 3, name: 'Golden Harp', emoji: '🎵', x: 19, y: 70, radius: 9, hint: 'Look resting near the fluffy sheep!' },
      { id: 4, name: 'Warm Scarf', emoji: '🧣', x: 85, y: 61, radius: 9, hint: 'Look draped over the wooden fence!' },
      { id: 5, name: 'Compass', emoji: '🧭', x: 49, y: 84, radius: 9, hint: 'Look lying on the flat stepping stone!' },
    ],
    renderIllustration: () => (
      <svg viewBox="0 0 500 350" className="w-full h-full select-none pointer-events-none">
        <defs>
          <linearGradient id="campSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0F172A" />
            <stop offset="100%" stopColor="#1E3A8A" />
          </linearGradient>
        </defs>
        <rect width="500" height="215" fill="url(#campSky)" />
        <circle cx="80" cy="50" r="20" fill="#FDE047" />
        <circle cx="90" cy="46" r="16" fill="#0F172A" />
        <text x="380" y="65" fontSize="28">⭐</text>

        {/* Hills */}
        <path d="M 0,200 Q 250,165 500,205 L 500,350 L 0,350 Z" fill="#166534" />

        {/* Shepherd Tent */}
        <g transform="translate(130, 120)">
          <polygon points="-50,100 35,0 120,100" fill="#D97706" stroke="#78350F" strokeWidth="3" />
          <polygon points="10,100 35,35 60,100" fill="#451A03" />
          <line x1="65" y1="20" x2="65" y2="40" stroke="#78350F" strokeWidth="3" />
        </g>
        {/* Target #1: Lantern at (195, 150) */}
        <g transform="translate(195, 152)">
          <rect x="-7" y="-10" width="14" height="18" rx="4" fill="#EF4444" stroke="#991B1B" strokeWidth="1.5" />
          <circle cx="0" cy="-1" r="4" fill="#FEF08A" />
        </g>

        {/* Fluffy Sheep + Target #3: Harp at (95, 245) */}
        <g transform="translate(45, 240)">
          <ellipse cx="20" cy="15" rx="22" ry="15" fill="#FFFFFF" />
          <circle cx="0" cy="12" r="9" fill="#1E293B" />
        </g>
        <g transform="translate(95, 245)">
          <path d="M -8,12 Q -10,-12 8,-14 L 8,12 Z" fill="none" stroke="#FBBF24" strokeWidth="3" />
          <line x1="-2" y1="-8" x2="-2" y2="12" stroke="#FEF08A" strokeWidth="1" />
          <line x1="3" y1="-10" x2="3" y2="12" stroke="#FEF08A" strokeWidth="1" />
        </g>

        {/* Campfire + Target #2: Soup Bowl at (320, 260) */}
        <g transform="translate(275, 240)">
          <polygon points="-15,20 0,-12 15,20" fill="#F97316" />
          <polygon points="-8,20 0,0 8,20" fill="#FDE047" />
        </g>
        <g transform="translate(320, 260)">
          <path d="M -12,-2 Q 0,18 12,-2 Z" fill="#38BDF8" stroke="#0369A1" strokeWidth="1.5" />
          <ellipse cx="0" cy="-2" rx="12" ry="3.5" fill="#FBBF24" />
        </g>

        {/* Wooden Fence + Target #4: Warm Scarf at (425, 215) */}
        <g transform="translate(385, 195)">
          <rect x="0" y="0" width="10" height="50" fill="#78350F" />
          <rect x="65" y="0" width="10" height="50" fill="#78350F" />
          <rect x="-5" y="12" width="85" height="8" fill="#92400E" />
        </g>
        <g transform="translate(425, 215)">
          <rect x="-12" y="-8" width="24" height="8" rx="3" fill="#F43F5E" />
          <rect x="2" y="-2" width="8" height="22" rx="2" fill="#E11D48" />
        </g>

        {/* Flat Stone + Target #5: Compass at (245, 295) */}
        <ellipse cx="245" cy="298" rx="22" ry="10" fill="#94A3B8" stroke="#475569" strokeWidth="1.5" />
        <g transform="translate(245, 295)">
          <circle cx="0" cy="0" r="9" fill="#FDE047" stroke="#B45309" strokeWidth="1.5" />
          <polygon points="0,-6 2.5,0 0,6 -2.5,0" fill="#EF4444" />
        </g>
      </svg>
    ),
  },
];

export const HiddenObjectsGame: React.FC<Props> = ({
  settings,
  onBack,
  onEarnStars,
  onChangeSettings,
}) => {
  const { difficulty, playerCount } = settings;
  const [sceneIndex, setSceneIndex] = useState(0);
  const [foundIds, setFoundIds] = useState<number[]>([]);
  const [showHintBeacon, setShowHintBeacon] = useState<number | null>(null);
  const [clickRipples, setClickRipples] = useState<{ id: number; x: number; y: number; isHit: boolean }[]>([]);
  const [isWon, setIsWon] = useState(false);

  // Multiplayer teams
  const [activeTeam, setActiveTeam] = useState(1);
  const [teamScores, setTeamScores] = useState<Record<number, number>>({ 1: 0, 2: 0, 3: 0 });

  const currentScene = HIDDEN_SCENES[sceneIndex];

  useEffect(() => {
    setSceneIndex(0);
    setFoundIds([]);
    setIsWon(false);
    setActiveTeam(1);
    setTeamScores({ 1: 0, 2: 0, 3: 0 });
  }, [difficulty, playerCount]);

  useEffect(() => {
    setFoundIds([]);
    setShowHintBeacon(null);
    setIsWon(false);
  }, [sceneIndex]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isWon) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;

    let hitTarget: HiddenTarget | null = null;
    const toleranceMultiplier = difficulty === 'easy' ? 1.4 : difficulty === 'medium' ? 1.15 : 0.95;

    for (const target of currentScene.targets) {
      if (foundIds.includes(target.id)) continue;
      const dx = clickX - target.x;
      const dy = clickY - target.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist <= target.radius * toleranceMultiplier) {
        hitTarget = target;
        break;
      }
    }

    if (hitTarget) {
      sounds.playStar();
      sounds.speakWord(hitTarget.name);

      const newFound = [...foundIds, hitTarget.id];
      setFoundIds(newFound);
      setShowHintBeacon(null);

      setClickRipples((prev) => [
        ...prev.slice(-6),
        { id: Date.now(), x: hitTarget!.x, y: hitTarget!.y, isHit: true },
      ]);

      if (playerCount > 1) {
        setTeamScores((prev) => ({
          ...prev,
          [activeTeam]: (prev[activeTeam] || 0) + 10,
        }));
        setActiveTeam((t) => (t % playerCount) + 1);
      }

      if (newFound.length >= currentScene.targets.length) {
        setTimeout(() => {
          setIsWon(true);
          sounds.playWin();
          try {
            confetti({ particleCount: 85, spread: 70 });
          } catch {
            // ignore
          }
          const totalStars = difficulty === 'easy' ? 8 : difficulty === 'medium' ? 12 : 16;
          onEarnStars(totalStars);
        }, 500);
      }
    } else {
      sounds.playPop();
      setClickRipples((prev) => [
        ...prev.slice(-6),
        { id: Date.now(), x: clickX, y: clickY, isHit: false },
      ]);
    }
  };

  const handleHint = () => {
    sounds.playStar();
    const remaining = currentScene.targets.filter((t) => !foundIds.includes(t.id));
    if (remaining.length > 0) {
      setShowHintBeacon(remaining[0].id);
    }
  };

  const handleNextScene = () => {
    sounds.playClick();
    if (sceneIndex + 1 < HIDDEN_SCENES.length) {
      setSceneIndex((i) => i + 1);
    } else {
      setSceneIndex(0);
    }
  };

  const handleRestart = () => {
    sounds.playClick();
    setFoundIds([]);
    setIsWon(false);
    setShowHintBeacon(null);
  };

  const difficultyText =
    difficulty === 'easy'
      ? 'Easy • 5 Items'
      : difficulty === 'medium'
      ? 'Medium • 5 Items'
      : 'Hard • Expert Seeker';

  const hintTarget = currentScene.targets.find((t) => t.id === showHintBeacon);

  return (
    <div className="flex flex-col items-center max-w-4xl mx-auto px-3 sm:px-4 py-2 w-full animate-fadeIn select-none">
      {/* Top Bar */}
      <div className="flex items-center justify-between w-full mb-2">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-gray-700 font-bold rounded-xl shadow hover:bg-gray-50 border border-gray-200 transition active:scale-95 text-xs sm:text-sm"
        >
          <ArrowLeft className="w-4 h-4 text-indigo-600" />
          <span>Menu</span>
        </button>

        <div className="flex items-center gap-2.5 bg-white px-3.5 py-1 rounded-xl shadow border border-gray-100">
          <div className="text-center">
            <span className="text-[10px] text-gray-400 block font-bold">SCENE</span>
            <span className="text-sm font-black text-indigo-600">
              {sceneIndex + 1} / {HIDDEN_SCENES.length}
            </span>
          </div>
          <div className="w-px h-5 bg-gray-200" />
          <div className="text-center">
            <span className="text-[10px] text-gray-400 block font-bold">FOUND</span>
            <div className="flex items-center gap-1">
              <span className="text-base font-black text-emerald-600">{foundIds.length}</span>
              <span className="text-[11px] text-gray-400 font-bold">/ 5</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleHint}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold rounded-xl shadow-xs transition active:scale-95 text-xs"
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
            <span>Hint</span>
          </button>
          <button
            onClick={handleRestart}
            className="p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition"
            title="Restart Scene"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Multiplayer Team Scoreboard & Level Display */}
      <TeamScoreboard
        playerCount={playerCount}
        activeTeam={activeTeam}
        scores={teamScores}
        difficultyLabel={difficultyText}
        turnMessage="Find a hidden item in the picture!"
        onChangeSettings={onChangeSettings}
      />

      {/* Scene Switcher Strip (5 Scenes) */}
      <div className="flex flex-wrap justify-center gap-1 mb-1.5">
        {HIDDEN_SCENES.map((sc, idx) => (
          <button
            key={sc.id}
            onClick={() => {
              sounds.playClick();
              setSceneIndex(idx);
            }}
            className={`px-2.5 py-0.5 rounded-lg text-[11px] font-bold transition cursor-pointer ${
              sceneIndex === idx
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white/80 text-gray-600 hover:bg-indigo-50 border border-gray-200'
            }`}
          >
            {idx + 1}. {sc.title.split(' ')[0]}
          </button>
        ))}
      </div>

      {/* Hint Banner if Active */}
      {hintTarget && (
        <div className="w-full max-w-2xl mb-2 bg-amber-50 border border-amber-300 text-amber-900 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-1.5">
            <Lightbulb className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>
              💡 Find {hintTarget.emoji} {hintTarget.name}: {hintTarget.hint}
            </span>
          </div>
          <span className="text-[10px] bg-amber-200 text-amber-950 px-2 py-0.2 rounded-full font-black">
            Pulsing Beacon
          </span>
        </div>
      )}

      {/* Main Illustrated Scene (Fit to Laptop Screen Height) */}
      <div className="w-full max-w-3xl bg-white rounded-2xl p-2 sm:p-2.5 shadow-md border-3 border-indigo-200 flex flex-col items-center mb-2">
        <div className="w-full flex items-center justify-between px-1.5 mb-1">
          <div className="flex items-center gap-1.5">
            <Search className="w-3.5 h-3.5 text-indigo-600" />
            <span className="text-xs font-black text-indigo-900">{currentScene.title}</span>
          </div>
          <span className="text-[11px] text-gray-500 font-medium">{currentScene.subtitle}</span>
        </div>

        <div
          onClick={handleCanvasClick}
          className="w-full h-[38vh] min-h-[220px] max-h-[310px] aspect-10/7 rounded-xl overflow-hidden relative shadow-inner bg-sky-50 cursor-crosshair touch-none group"
        >
          {currentScene.renderIllustration(foundIds)}

          {/* Found items marked with glowing animated circle */}
          {currentScene.targets.map((target) => {
            if (!foundIds.includes(target.id)) return null;
            return (
              <div
                key={target.id}
                style={{
                  left: `${target.x}%`,
                  top: `${target.y}%`,
                  width: `${target.radius * 2.2}%`,
                  height: `${target.radius * 2.5}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                className="absolute rounded-full border-3 border-emerald-500 bg-emerald-400/30 shadow-lg flex items-center justify-center animate-scaleUp pointer-events-none"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-white" />
              </div>
            );
          })}

          {/* Hint beacon */}
          {hintTarget && (
            <div
              style={{
                left: `${hintTarget.x}%`,
                top: `${hintTarget.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
              className="absolute w-12 h-12 rounded-full border-3 border-amber-400 bg-amber-400/35 animate-ping pointer-events-none"
            />
          )}

          {clickRipples.map((rip) => (
            <div
              key={rip.id}
              style={{
                left: `${rip.x}%`,
                top: `${rip.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
              className={`absolute w-7 h-7 rounded-full pointer-events-none animate-ping ${
                rip.isHit ? 'border-3 border-emerald-500' : 'border-2 border-rose-400'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Bottom Target Items Tray to Find (Compact & Clear for Laptops) */}
      <div className="w-full max-w-3xl bg-white/95 backdrop-blur rounded-2xl p-2.5 sm:p-3 shadow-md border border-indigo-100 flex flex-col gap-1.5">
        <div className="flex items-center justify-between px-1">
          <span className="text-[11px] font-black uppercase text-gray-500 tracking-wider">
            Items to Find ({foundIds.length}/5):
          </span>
          <span className="text-[10px] text-indigo-600 font-bold">
            Tap card to hear English 🔊
          </span>
        </div>

        <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
          {currentScene.targets.map((target) => {
            const isFound = foundIds.includes(target.id);
            return (
              <button
                key={target.id}
                onClick={() => {
                  sounds.playPop();
                  sounds.speakWord(target.name);
                }}
                className={`py-1.5 px-1 rounded-xl border-2 flex flex-col items-center justify-center gap-0.5 transition-all transform active:scale-95 cursor-pointer ${
                  isFound
                    ? 'bg-emerald-50 border-emerald-400 text-emerald-900 shadow-xs opacity-90'
                    : 'bg-white border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/50 shadow-xs'
                }`}
              >
                <div className="text-xl sm:text-2xl filter drop-shadow-xs">{target.emoji}</div>
                <div className="text-[10px] sm:text-xs font-black truncate max-w-full">{target.name}</div>
                {isFound ? (
                  <span className="text-[9px] font-black text-emerald-600 flex items-center gap-0.5">
                    <CheckCircle2 className="w-2.5 h-2.5" /> Done
                  </span>
                ) : (
                  <span className="text-[9px] text-gray-400 font-bold">Find me</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Victory Celebration: Team Podium or Solo Modal */}
      {isWon && playerCount > 1 && (
        <TeamVictoryModal
          playerCount={playerCount}
          scores={teamScores}
          totalStarsEarned={difficulty === 'easy' ? 8 : difficulty === 'medium' ? 12 : 16}
          playAgainLabel="Next Scene ➔"
          onPlayAgain={() => {
            setTeamScores({ 1: 0, 2: 0, 3: 0 });
            setActiveTeam(1);
            handleNextScene();
          }}
          onBackToMenu={onBack}
        />
      )}

      {isWon && playerCount === 1 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full text-center shadow-2xl border-4 border-amber-300 animate-scaleUp">
            <div className="w-18 h-18 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Trophy className="w-10 h-10 text-amber-500" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-1">Master Seeker! 🏆✨</h2>
            <p className="text-xs sm:text-sm text-gray-600 font-medium mb-4">
              You spotted all 5 hidden items in "{currentScene.title}"!
            </p>
            <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-800 px-4 py-2 rounded-full font-bold mb-5">
              <span>⭐ Reward:</span>
              <span className="text-lg text-amber-600 font-black">
                +{difficulty === 'easy' ? 8 : difficulty === 'medium' ? 12 : 16} Stars!
              </span>
            </div>
            <div className="flex gap-2.5">
              <button
                onClick={onBack}
                className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition text-sm"
              >
                Menu
              </button>
              <button
                onClick={handleNextScene}
                className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md shadow-indigo-200 transition text-sm"
              >
                Next Scene ➔
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
