import React, { useState, useEffect } from 'react';
import { GameSettings } from '../types';
import { sounds } from '../utils/sound';
import confetti from 'canvas-confetti';
import { ArrowLeft, RotateCcw, Lightbulb, Trophy, CheckCircle2, SplitSquareHorizontal, Eye, Maximize } from 'lucide-react';
import { TeamScoreboard } from '../components/TeamScoreboard';
import { TeamVictoryModal } from '../components/TeamVictoryModal';

interface Props {
  settings: GameSettings;
  onBack: () => void;
  onEarnStars: (count: number) => void;
  onChangeSettings: () => void;
}

interface DifferenceItem {
  id: number;
  name: string;
  x: number; // percentage (0 - 100)
  y: number; // percentage (0 - 100)
  radius: number; // click tolerance radius in percentage
  hint: string;
}

interface SpotScene {
  id: string;
  title: string;
  subtitle: string;
  differences: DifferenceItem[];
  renderIllustration: (isModified: boolean, foundIds: number[]) => React.ReactNode;
}

const SCENES: SpotScene[] = [
  // Scene 1: Noah's Ark & The Great Rainbow
  {
    id: 'noahs-ark',
    title: "Noah's Ark & Rainbow",
    subtitle: 'Find 5 differences between the two pictures!',
    differences: [
      { id: 1, name: 'Rainbow Stripe Color', x: 50, y: 18, radius: 11, hint: 'Look at the color of the second rainbow stripe!' },
      { id: 2, name: 'Dove Olive Branch', x: 26, y: 24, radius: 9, hint: "Look at the flying dove's beak in the sky!" },
      { id: 3, name: 'Giraffe in Ark Window', x: 62, y: 46, radius: 9, hint: "Look at who is peeking from the cabin window!" },
      { id: 4, name: 'Wave Splash Foam', x: 80, y: 78, radius: 10, hint: 'Look at the white water foam on the waves!' },
      { id: 5, name: 'Sun Face Expression', x: 85, y: 16, radius: 10, hint: "Look at the shining sun's smiling face!" },
    ],
    renderIllustration: (isModified: boolean, foundIds: number[]) => (
      <svg viewBox="0 0 400 300" className="w-full h-full select-none pointer-events-none">
        <defs>
          <linearGradient id="skyGrad1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#BAE6FD" />
            <stop offset="60%" stopColor="#E0F2FE" />
            <stop offset="100%" stopColor="#FEF08A" />
          </linearGradient>
          <linearGradient id="seaGrad1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0284C7" />
            <stop offset="100%" stopColor="#0369A1" />
          </linearGradient>
          <linearGradient id="arkWood1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#B45309" />
            <stop offset="100%" stopColor="#78350F" />
          </linearGradient>
        </defs>

        <rect width="400" height="210" fill="url(#skyGrad1)" />

        {/* Mountain */}
        <polygon points="280,210 340,110 400,210" fill="#94A3B8" />
        <polygon points="320,143 340,110 360,143 350,150 340,142 330,150" fill={isModified ? '#A3E635' : '#FFFFFF'} />

        {/* Rainbow */}
        <g opacity="0.85">
          <path d="M 50,210 A 150,150 0 0,1 350,210" fill="none" stroke="#EF4444" strokeWidth="8" />
          <path d="M 60,210 A 140,140 0 0,1 340,210" fill="none" stroke={isModified ? '#A855F7' : '#F97316'} strokeWidth="8" />
          <path d="M 70,210 A 130,130 0 0,1 330,210" fill="none" stroke="#FDE047" strokeWidth="8" />
          <path d="M 80,210 A 120,120 0 0,1 320,210" fill="none" stroke="#22C55E" strokeWidth="8" />
          <path d="M 90,210 A 110,110 0 0,1 310,210" fill="none" stroke="#38BDF8" strokeWidth="8" />
        </g>

        {/* Sun */}
        <g transform="translate(340, 50)">
          <circle cx="0" cy="0" r="26" fill="#FBBF24" />
          <circle cx="0" cy="0" r="30" fill="none" stroke="#FDE047" strokeWidth="3" strokeDasharray="6 6" />
          {isModified ? (
            <>
              <rect x="-14" y="-6" width="12" height="8" rx="2" fill="#1E293B" />
              <rect x="2" y="-6" width="12" height="8" rx="2" fill="#1E293B" />
              <line x1="-2" y1="-2" x2="2" y2="-2" stroke="#1E293B" strokeWidth="2" />
              <path d="M -8,8 Q 0,14 8,8" fill="none" stroke="#78350F" strokeWidth="2" strokeLinecap="round" />
            </>
          ) : (
            <>
              <circle cx="-7" cy="-3" r="3" fill="#78350F" />
              <circle cx="7" cy="-3" r="3" fill="#78350F" />
              <path d="M -8,5 Q 0,14 8,5" fill="none" stroke="#78350F" strokeWidth="3" strokeLinecap="round" />
              <circle cx="-11" cy="4" r="3" fill="#F87171" opacity="0.6" />
              <circle cx="11" cy="4" r="3" fill="#F87171" opacity="0.6" />
            </>
          )}
        </g>

        {/* Clouds */}
        <g fill="#FFFFFF" opacity="0.9">
          <ellipse cx="70" cy="80" rx="30" ry="16" />
          <ellipse cx="90" cy="74" rx="22" ry="18" />
          <ellipse cx="50" cy="84" rx="20" ry="12" />
        </g>

        {/* Flying Dove */}
        <g transform="translate(105, 70)">
          <ellipse cx="0" cy="0" rx="14" ry="9" fill="#FFFFFF" />
          <path d="M -5,-3 Q -15,-20 0,-16" fill="#FFFFFF" />
          <circle cx="10" cy="-2" r="1.5" fill="#1E293B" />
          <polygon points="12,-2 18,0 12,2" fill="#F97316" />
          {!isModified && (
            <g stroke="#15803D" strokeWidth="1.5" fill="#22C55E">
              <line x1="16" y1="0" x2="26" y2="-5" />
              <ellipse cx="20" cy="-6" rx="3" ry="1.5" transform="rotate(-30 20 -6)" />
              <ellipse cx="25" cy="-7" rx="3" ry="1.5" transform="rotate(20 25 -7)" />
            </g>
          )}
        </g>

        {/* Sea */}
        <rect y="200" width="400" height="100" fill="url(#seaGrad1)" />
        <path d="M 0,205 Q 40,195 80,205 T 160,205 T 240,205 T 320,205 T 400,205 L 400,300 L 0,300 Z" fill="#0284C7" opacity="0.6" />

        {/* Noah's Ark */}
        <g transform="translate(130, 140)">
          <rect x="25" y="0" width="90" height="40" rx="4" fill="#D97706" stroke="#92400E" strokeWidth="2" />
          <polygon points="15,0 70,-22 125,0" fill="#B45309" stroke="#78350F" strokeWidth="2" />
          <circle cx="45" cy="20" r="10" fill="#FEF08A" stroke="#78350F" strokeWidth="2" />
          <text x="45" y="24" fontSize="12" textAnchor="middle">🐑</text>

          {/* Window 2 (Giraffe in left vs Star in right) */}
          <circle cx="85" cy="20" r="10" fill="#FEF08A" stroke="#78350F" strokeWidth="2" />
          {!isModified ? (
            <text x="85" y="24" fontSize="12" textAnchor="middle">🦒</text>
          ) : (
            <text x="85" y="24" fontSize="10" textAnchor="middle">✨</text>
          )}

          <path d="M 0,38 L 140,38 Q 155,40 148,65 L 125,82 L 15,82 L -8,65 Q -15,40 0,38 Z" fill="url(#arkWood1)" stroke="#451A03" strokeWidth="3" />
          <line x1="-3" y1="52" x2="143" y2="52" stroke="#451A03" strokeWidth="2" />
        </g>

        {/* Foam Splash on Right */}
        <path d="M 0,240 Q 50,225 100,240 T 200,240 T 300,240 T 400,240" fill="none" stroke="#38BDF8" strokeWidth="4" />
        {isModified ? (
          <g fill="#FFFFFF" opacity="0.95">
            <ellipse cx="320" cy="235" rx="14" ry="7" />
            <circle cx="310" cy="227" r="4" />
            <circle cx="330" cy="225" r="5" />
          </g>
        ) : (
          <g fill="#FFFFFF" opacity="0.5">
            <ellipse cx="320" cy="237" rx="6" ry="3" />
          </g>
        )}
      </svg>
    ),
  },

  // Scene 2: The Good Shepherd in the Meadow
  {
    id: 'good-shepherd',
    title: 'The Good Shepherd',
    subtitle: 'Find 5 differences in the green pasture!',
    differences: [
      { id: 1, name: 'Lamb Neck Collar', x: 26, y: 72, radius: 10, hint: "Look at the little lamb's neck collar!" },
      { id: 2, name: 'Shepherd Staff Top', x: 58, y: 38, radius: 10, hint: "Look at the shepherd's crook staff head!" },
      { id: 3, name: 'Church Steeple Cross', x: 84, y: 32, radius: 9, hint: 'Look at the cross on top of the church tower!' },
      { id: 4, name: 'Meadow Flower', x: 74, y: 84, radius: 10, hint: 'Look at the flower blooming in the grass!' },
      { id: 5, name: 'Bird on Tree Branch', x: 14, y: 35, radius: 10, hint: 'Look at the little bird on the tree branch!' },
    ],
    renderIllustration: (isModified: boolean, foundIds: number[]) => (
      <svg viewBox="0 0 400 300" className="w-full h-full select-none pointer-events-none">
        <defs>
          <linearGradient id="hillGradA" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#86EFAC" />
            <stop offset="100%" stopColor="#22C55E" />
          </linearGradient>
          <linearGradient id="hillGradB" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4ADE80" />
            <stop offset="100%" stopColor="#15803D" />
          </linearGradient>
        </defs>

        <rect width="400" height="180" fill="#E0F2FE" />
        <circle cx="200" cy="40" r="30" fill="#FEF08A" opacity="0.6" />
        <circle cx="200" cy="40" r="22" fill="#FDE047" />

        <path d="M 0,160 Q 120,100 250,150 T 400,140 L 400,300 L 0,300 Z" fill="url(#hillGradA)" />
        <path d="M 0,185 Q 160,130 320,175 T 450,170 L 400,300 L 0,300 Z" fill="url(#hillGradB)" opacity="0.9" />

        {/* Church */}
        <g transform="translate(315, 80)">
          <rect x="0" y="30" width="50" height="40" fill="#F1F5F9" stroke="#64748B" strokeWidth="2" />
          <polygon points="-5,30 25,8 55,30" fill="#EA580C" />
          <rect x="15" y="0" width="20" height="30" fill="#F8FAFC" stroke="#64748B" strokeWidth="2" />
          <polygon points="12,0 25,-18 38,0" fill="#C2410C" />
          {isModified ? (
            <text x="25" y="-22" fontSize="14" textAnchor="middle">⭐</text>
          ) : (
            <g stroke="#F59E0B" strokeWidth="2.5">
              <line x1="25" y1="-28" x2="25" y2="-17" />
              <line x1="21" y1="-24" x2="29" y2="-24" />
            </g>
          )}
          <rect x="20" y="50" width="10" height="20" rx="5" fill="#475569" />
        </g>

        {/* Tree on Left */}
        <g transform="translate(30, 80)">
          <path d="M 20,120 Q 25,60 15,30 Q 30,50 35,120" fill="#78350F" />
          <circle cx="25" cy="20" r="35" fill="#16A34A" />
          <circle cx="-5" cy="25" r="25" fill="#15803D" />
          <circle cx="50" cy="25" r="28" fill="#22C55E" />
          <circle cx="20" cy="-5" r="30" fill="#4ADE80" />
          <g transform="translate(55, 10)">
            {isModified ? (
              <text x="0" y="0" fontSize="18">🦜</text>
            ) : (
              <text x="0" y="0" fontSize="18">🐥</text>
            )}
          </g>
        </g>

        {/* The Shepherd */}
        <g transform="translate(180, 110)">
          <path d="M 20,60 L 5,140 L 45,140 L 30,60 Z" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="2" />
          <circle cx="25" cy="40" r="14" fill="#FED7AA" stroke="#EA580C" strokeWidth="1.5" />
          <path d="M 10,40 Q 25,20 40,40 L 38,65 L 12,65 Z" fill="#92400E" />
          <circle cx="25" cy="40" r="12" fill="#FED7AA" />
          <circle cx="22" cy="38" r="1.5" fill="#1E293B" />
          <circle cx="28" cy="38" r="1.5" fill="#1E293B" />
          <path d="M 22,44 Q 25,48 28,44" fill="none" stroke="#9A3412" strokeWidth="1.5" />
          {isModified ? (
            <g stroke="#EAB308" strokeWidth="4" strokeLinecap="round">
              <line x1="52" y1="140" x2="52" y2="20" />
              <circle cx="52" cy="18" r="5" fill="#FDE047" stroke="#CA8A04" strokeWidth="1.5" />
            </g>
          ) : (
            <g stroke="#78350F" strokeWidth="4" fill="none" strokeLinecap="round">
              <line x1="52" y1="140" x2="52" y2="25" />
              <path d="M 52,25 A 10,10 0 0,0 35,20" />
            </g>
          )}
        </g>

        {/* Little Sheep */}
        <g transform="translate(80, 200)">
          <ellipse cx="25" cy="20" rx="22" ry="16" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
          <circle cx="12" cy="15" r="12" fill="#FFFFFF" />
          <circle cx="38" cy="15" r="12" fill="#FFFFFF" />
          <circle cx="25" cy="8" r="13" fill="#FFFFFF" />
          <circle cx="25" cy="28" r="12" fill="#FFFFFF" />
          <ellipse cx="5" cy="18" rx="8" ry="10" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="1.5" />
          <circle cx="2" cy="16" r="1.5" fill="#1E293B" />
          <rect x="12" y="32" width="4" height="15" fill="#1E293B" rx="2" />
          <rect x="20" y="32" width="4" height="15" fill="#1E293B" rx="2" />
          <rect x="30" y="32" width="4" height="15" fill="#1E293B" rx="2" />
          <rect x="38" y="32" width="4" height="15" fill="#1E293B" rx="2" />
          {isModified ? (
            <g transform="translate(10, 22)">
              <circle cx="0" cy="0" r="4" fill="#FBBF24" stroke="#B45309" strokeWidth="1" />
            </g>
          ) : (
            <g transform="translate(10, 22)">
              <polygon points="-5,-4 0,0 -5,4" fill="#F43F5E" />
              <polygon points="5,-4 0,0 5,4" fill="#F43F5E" />
              <circle cx="0" cy="0" r="2.5" fill="#FB7185" />
            </g>
          )}
        </g>

        {/* Flowers */}
        <g transform="translate(290, 245)">
          {isModified ? (
            <g>
              <circle cx="0" cy="0" r="10" fill="#38BDF8" />
              <circle cx="0" cy="0" r="4" fill="#FEF08A" />
              <line x1="0" y1="10" x2="0" y2="28" stroke="#15803D" strokeWidth="3" />
            </g>
          ) : (
            <g>
              <path d="M -8,0 C -8,-12 8,-12 8,0 C 8,8 -8,8 -8,0 Z" fill="#EF4444" />
              <line x1="0" y1="6" x2="0" y2="28" stroke="#15803D" strokeWidth="3" />
            </g>
          )}
        </g>
      </svg>
    ),
  },

  // Scene 3: Sunday School Classroom & Library
  {
    id: 'sunday-school',
    title: 'Sunday School Room',
    subtitle: 'Find 5 differences in the church classroom!',
    differences: [
      { id: 1, name: 'Wall Clock Hands', x: 20, y: 22, radius: 10, hint: 'Look at the time on the round wall clock!' },
      { id: 2, name: 'Bible Emblem Symbol', x: 50, y: 68, radius: 10, hint: 'Look at the golden emblem on the holy Bible!' },
      { id: 3, name: 'Vase Flowers', x: 78, y: 60, radius: 10, hint: 'Look at the bouquet of flowers on the table!' },
      { id: 4, name: 'Chalkboard Drawing', x: 50, y: 28, radius: 11, hint: 'Look at the chalk illustration on the blackboard!' },
      { id: 5, name: 'Hanging Ceiling Light', x: 82, y: 18, radius: 10, hint: 'Look at the lamp hanging from the ceiling!' },
    ],
    renderIllustration: (isModified: boolean, foundIds: number[]) => (
      <svg viewBox="0 0 400 300" className="w-full h-full select-none pointer-events-none">
        <rect width="400" height="200" fill="#FEF3C7" />
        <rect y="200" width="400" height="100" fill="#D97706" />
        <line x1="0" y1="200" x2="400" y2="200" stroke="#78350F" strokeWidth="4" />
        <line x1="60" y1="200" x2="30" y2="300" stroke="#B45309" strokeWidth="2" />
        <line x1="160" y1="200" x2="140" y2="300" stroke="#B45309" strokeWidth="2" />
        <line x1="260" y1="200" x2="250" y2="300" stroke="#B45309" strokeWidth="2" />

        {/* Clock */}
        <g transform="translate(80, 65)">
          <circle cx="0" cy="0" r="22" fill="#FFFFFF" stroke="#4F46E5" strokeWidth="4" />
          <circle cx="0" cy="0" r="2" fill="#1E293B" />
          {isModified ? (
            <>
              <line x1="0" y1="0" x2="0" y2="-14" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="0" y1="0" x2="12" y2="0" stroke="#E11D48" strokeWidth="2" strokeLinecap="round" />
            </>
          ) : (
            <>
              <line x1="0" y1="0" x2="0" y2="-14" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="0" y1="0" x2="-12" y2="0" stroke="#E11D48" strokeWidth="2" strokeLinecap="round" />
            </>
          )}
        </g>

        {/* Blackboard */}
        <g transform="translate(140, 40)">
          <rect x="0" y="0" width="120" height="75" rx="6" fill="#1E293B" stroke="#92400E" strokeWidth="5" />
          <text x="60" y="24" fill="#F8FAFC" fontSize="12" fontStyle="italic" textAnchor="middle" fontWeight="bold">GOD IS LOVE</text>
          {isModified ? (
            <text x="60" y="55" fontSize="22" textAnchor="middle">⭐</text>
          ) : (
            <text x="60" y="55" fontSize="22" textAnchor="middle">💖</text>
          )}
        </g>

        {/* Ceiling Lamp */}
        <g transform="translate(330, 20)">
          <line x1="0" y1="0" x2="0" y2="30" stroke="#64748B" strokeWidth="2" />
          {isModified ? (
            <circle cx="0" cy="40" r="16" fill="#EF4444" stroke="#B91C1C" strokeWidth="2" />
          ) : (
            <polygon points="-16,46 0,28 16,46" fill="#FBBF24" stroke="#D97706" strokeWidth="2" />
          )}
          <circle cx="0" cy="42" r="5" fill="#FEF08A" opacity="0.8" />
        </g>

        {/* Table */}
        <g transform="translate(80, 180)">
          <path d="M 20,20 L 220,20 L 240,65 L 0,65 Z" fill="#92400E" stroke="#78350F" strokeWidth="3" />
          <rect x="15" y="65" width="16" height="50" fill="#78350F" />
          <rect x="210" y="65" width="16" height="50" fill="#78350F" />

          {/* Bible */}
          <g transform="translate(100, 22)">
            <rect x="-30" y="-12" width="60" height="24" rx="3" fill="#1E3A8A" stroke="#172554" strokeWidth="2" />
            <line x1="0" y1="-12" x2="0" y2="12" stroke="#E2E8F0" strokeWidth="2" />
            {isModified ? (
              <g stroke="#FDE047" strokeWidth="2.5">
                <line x1="-14" y1="-8" x2="-14" y2="8" />
                <line x1="-18" y1="-4" x2="-10" y2="-4" />
              </g>
            ) : (
              <text x="-14" y="5" fontSize="13" textAnchor="middle">✨</text>
            )}
          </g>

          {/* Flowers in Vase */}
          <g transform="translate(195, 12)">
            <path d="M -10,0 Q -15,18 -8,25 L 8,25 Q 15,18 10,0 Z" fill="#38BDF8" stroke="#0284C7" strokeWidth="2" />
            {isModified ? (
              <>
                <circle cx="-6" cy="-10" r="7" fill="#FBBF24" />
                <circle cx="6" cy="-12" r="7" fill="#FBBF24" />
                <circle cx="0" cy="-20" r="8" fill="#F97316" />
              </>
            ) : (
              <>
                <circle cx="-4" cy="-10" r="8" fill="#F43F5E" />
                <circle cx="6" cy="-12" r="8" fill="#EC4899" />
              </>
            )}
          </g>
        </g>
      </svg>
    ),
  },

  // Scene 4: Himalayan Village Morning
  {
    id: 'himalayan-morning',
    title: 'Himalayan Morning',
    subtitle: 'Find 5 differences in the mountain valley!',
    differences: [
      { id: 1, name: 'Rainbow Cloud', x: 19, y: 18, radius: 10, hint: 'Look at the fluffy cloud on the top left!' },
      { id: 2, name: 'Morning Sun', x: 85, y: 17, radius: 10, hint: 'Look at the bright sun on the top right!' },
      { id: 3, name: 'Cottage Roof Color', x: 50, y: 57, radius: 11, hint: 'Look at the roof color of the mountain cottage!' },
      { id: 4, name: 'Mountain Friend', x: 19, y: 77, radius: 10, hint: 'Look at the animal standing on the left hill!' },
      { id: 5, name: 'Pine Tree Ornaments', x: 81, y: 75, radius: 11, hint: 'Look at what hangs on the right pine tree!' },
    ],
    renderIllustration: (isModified: boolean) => (
      <svg viewBox="0 0 400 300" className="w-full h-full select-none pointer-events-none">
        <defs>
          <linearGradient id="himSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7DD3FC" />
            <stop offset="100%" stopColor="#FEF9C3" />
          </linearGradient>
        </defs>
        <rect width="400" height="200" fill="url(#himSky)" />

        {/* Mountain Peaks */}
        <polygon points="0,200 95,85 190,200" fill="#64748B" />
        <polygon points="62,125 95,85 128,125 110,134 95,122 80,134" fill="#FFFFFF" />

        <polygon points="110,200 205,55 300,200" fill="#475569" />
        <polygon points="163,115 205,55 247,115 225,128 205,112 185,128" fill="#FFFFFF" />

        <polygon points="220,200 325,95 400,200" fill="#64748B" />
        <polygon points="288,132 325,95 362,132 342,140 325,130 308,140" fill="#FFFFFF" />

        {/* Diff #1: Cloud on top left */}
        <g transform="translate(75, 55)">
          <ellipse cx="0" cy="0" rx="28" ry="14" fill={isModified ? '#FBCFE8' : '#FFFFFF'} />
          <ellipse cx="-14" cy="4" rx="16" ry="10" fill={isModified ? '#FBCFE8' : '#FFFFFF'} />
          <ellipse cx="16" cy="4" rx="16" ry="10" fill={isModified ? '#FBCFE8' : '#FFFFFF'} />
          {isModified && <text x="0" y="5" fontSize="14" textAnchor="middle">💧</text>}
        </g>

        {/* Diff #2: Sun on top right */}
        <g transform="translate(340, 52)">
          <circle cx="0" cy="0" r="24" fill="#FBBF24" />
          {isModified ? (
            <circle cx="0" cy="0" r="28" fill="none" stroke="#F97316" strokeWidth="4" strokeDasharray="4 4" />
          ) : (
            <circle cx="0" cy="0" r="16" fill="#FDE047" />
          )}
          <circle cx="-6" cy="-3" r="2.5" fill="#78350F" />
          <circle cx="6" cy="-3" r="2.5" fill="#78350F" />
          <path d="M -6,5 Q 0,11 6,5" fill="none" stroke="#78350F" strokeWidth="2" />
        </g>

        {/* Green Valley Floor */}
        <path d="M 0,190 Q 200,170 400,190 L 400,300 L 0,300 Z" fill="#22C55E" />
        <path d="M 0,220 Q 200,200 400,225 L 400,300 L 0,300 Z" fill="#16A34A" />

        {/* Diff #3: Mountain Cottage */}
        <g transform="translate(155, 165)">
          <rect x="10" y="25" width="70" height="50" fill="#FEF3C7" stroke="#92400E" strokeWidth="2" />
          <polygon
            points="0,25 45,-10 90,25"
            fill={isModified ? '#0EA5E9' : '#EF4444'}
            stroke="#78350F"
            strokeWidth="2"
          />
          <rect x="35" y="45" width="20" height="30" fill="#78350F" />
          <rect x="16" y="36" width="14" height="14" fill="#38BDF8" stroke="#78350F" strokeWidth="1.5" />
          <rect x="60" y="36" width="14" height="14" fill="#38BDF8" stroke="#78350F" strokeWidth="1.5" />
        </g>

        {/* Diff #4: Animal on left hill */}
        <g transform="translate(76, 232)">
          <circle cx="0" cy="0" r="22" fill="#FFFFFF" opacity="0.25" />
          <text x="0" y="8" fontSize="34" textAnchor="middle">
            {isModified ? '🐑' : '🐐'}
          </text>
        </g>

        {/* Diff #5: Pine Tree on Right */}
        <g transform="translate(325, 225)">
          <rect x="-6" y="15" width="12" height="35" fill="#78350F" />
          <polygon points="-32,18 0,-28 32,18" fill="#15803D" />
          <polygon points="-25,-6 0,-48 25,-6" fill="#166534" />
          {isModified ? (
            <>
              <text x="-10" y="-12" fontSize="11">⭐</text>
              <text x="4" y="6" fontSize="11">⭐</text>
            </>
          ) : (
            <>
              <circle cx="-8" cy="-12" r="4.5" fill="#EF4444" />
              <circle cx="10" cy="6" r="4.5" fill="#EF4444" />
            </>
          )}
        </g>
      </svg>
    ),
  },

  // Scene 5: Loaves & Fishes Picnic
  {
    id: 'loaves-fishes',
    title: 'Loaves & Fishes Picnic',
    subtitle: 'Find 5 differences on the picnic blanket!',
    differences: [
      { id: 1, name: 'Sky Insect', x: 18, y: 18, radius: 10, hint: 'Look at the little flying friend on the top left!' },
      { id: 2, name: 'Tree Fruit', x: 84, y: 28, radius: 11, hint: 'Look at the fruit growing in the tree on the right!' },
      { id: 3, name: 'Picnic Fish', x: 56, y: 58, radius: 10, hint: 'Look at the fish peeking out of the picnic basket!' },
      { id: 4, name: 'Picnic Drink Cup', x: 24, y: 80, radius: 10, hint: 'Look at the drink on the bottom left of the blanket!' },
      { id: 5, name: 'Sweet Fruit Slice', x: 78, y: 81, radius: 10, hint: 'Look at the fruit sitting on the bottom right!' },
    ],
    renderIllustration: (isModified: boolean) => (
      <svg viewBox="0 0 400 300" className="w-full h-full select-none pointer-events-none">
        <rect width="400" height="165" fill="#BAE6FD" />
        <rect y="160" width="400" height="140" fill="#4ADE80" />

        {/* Diff #1: Flying Butterfly vs Bee */}
        <text x="72" y="62" fontSize="30" textAnchor="middle">
          {isModified ? '🐝' : '🦋'}
        </text>

        {/* Diff #2: Orchard Tree on Right */}
        <g transform="translate(335, 85)">
          <rect x="-10" y="20" width="20" height="70" fill="#78350F" />
          <circle cx="0" cy="-10" r="45" fill="#16A34A" />
          <circle cx="-25" cy="5" r="28" fill="#15803D" />
          <circle cx="25" cy="5" r="28" fill="#22C55E" />
          {isModified ? (
            <>
              <circle cx="-14" cy="-18" r="7" fill="#FDE047" />
              <circle cx="15" cy="-5" r="7" fill="#FDE047" />
              <circle cx="-2" cy="8" r="7" fill="#FDE047" />
            </>
          ) : (
            <>
              <circle cx="-14" cy="-18" r="7" fill="#EF4444" />
              <circle cx="15" cy="-5" r="7" fill="#EF4444" />
              <circle cx="-2" cy="8" r="7" fill="#EF4444" />
            </>
          )}
        </g>

        {/* Red Checkered Picnic Blanket */}
        <polygon points="50,200 350,200 385,285 15,285" fill="#FEF2F2" stroke="#EF4444" strokeWidth="4" />
        <line x1="35" y1="242" x2="365" y2="242" stroke="#FCA5A5" strokeWidth="6" />
        <line x1="200" y1="200" x2="200" y2="285" stroke="#FCA5A5" strokeWidth="6" />

        {/* Woven Basket */}
        <g transform="translate(200, 185)">
          <polygon points="-50,0 50,0 38,42 -38,42" fill="#D97706" stroke="#78350F" strokeWidth="3" />
          {/* Bread loaves */}
          <ellipse cx="-22" cy="-5" rx="16" ry="10" fill="#F59E0B" stroke="#92400E" strokeWidth="2" />
          <ellipse cx="-8" cy="-12" rx="16" ry="10" fill="#FBBF24" stroke="#92400E" strokeWidth="2" />
          {/* Diff #3: Fish color */}
          <g transform="translate(24, -10)">
            <ellipse cx="0" cy="0" rx="18" ry="10" fill={isModified ? '#F97316' : '#0EA5E9'} stroke="#1E293B" strokeWidth="1.5" />
            <polygon points="15,0 26,-8 26,8" fill={isModified ? '#EA580C' : '#0284C7'} />
            <circle cx="-8" cy="-2" r="2" fill="#FFFFFF" />
          </g>
        </g>

        {/* Diff #4: Drink on bottom left */}
        <g transform="translate(95, 240)">
          {isModified ? (
            <g>
              <rect x="-12" y="-12" width="24" height="28" rx="4" fill="#22C55E" stroke="#14532D" strokeWidth="2" />
              <circle cx="15" cy="2" r="7" fill="none" stroke="#14532D" strokeWidth="3" />
            </g>
          ) : (
            <g>
              <polygon points="-12,-10 12,-10 9,18 -9,18" fill="#EF4444" stroke="#991B1B" strokeWidth="2" />
              <line x1="3" y1="-10" x2="10" y2="-24" stroke="#FBBF24" strokeWidth="3" strokeLinecap="round" />
            </g>
          )}
        </g>

        {/* Diff #5: Sweet fruit on bottom right */}
        <text x="310" y="252" fontSize="34" textAnchor="middle">
          {isModified ? '🍇' : '🍉'}
        </text>
      </svg>
    ),
  },

  // Scene 6: Starry Night Over Hills
  {
    id: 'starry-night',
    title: 'Starry Bethlehem Night',
    subtitle: 'Find 5 differences under the starry sky!',
    differences: [
      { id: 1, name: 'Night Moon', x: 18, y: 18, radius: 10, hint: 'Look at the glowing moon on the top left!' },
      { id: 2, name: 'Bright Shining Star', x: 51, y: 17, radius: 10, hint: 'Look at the big bright star in the center sky!' },
      { id: 3, name: 'Palm Tree Coconuts', x: 83, y: 43, radius: 10, hint: 'Look right underneath the palm tree leaves!' },
      { id: 4, name: 'Campfire vs Lantern', x: 21, y: 77, radius: 10, hint: 'Look at the warm light on the bottom left!' },
      { id: 5, name: 'Sleeping Lamb', x: 76, y: 81, radius: 10, hint: 'Look at the little animal resting on the bottom right!' },
    ],
    renderIllustration: (isModified: boolean) => (
      <svg viewBox="0 0 400 300" className="w-full h-full select-none pointer-events-none">
        <defs>
          <linearGradient id="nightSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0F172A" />
            <stop offset="100%" stopColor="#1E3A8A" />
          </linearGradient>
        </defs>
        <rect width="400" height="210" fill="url(#nightSky)" />

        {/* Small background stars */}
        <circle cx="140" cy="40" r="2" fill="#FEF08A" />
        <circle cx="280" cy="35" r="2.5" fill="#FEF08A" />
        <circle cx="350" cy="60" r="2" fill="#FEF08A" />
        <circle cx="40" cy="110" r="2" fill="#FEF08A" />

        {/* Diff #1: Moon */}
        <g transform="translate(72, 54)">
          {isModified ? (
            <circle cx="0" cy="0" r="22" fill="#FEF08A" />
          ) : (
            <g>
              <circle cx="0" cy="0" r="22" fill="#FDE047" />
              <circle cx="9" cy="-4" r="18" fill="#0F172A" />
            </g>
          )}
        </g>

        {/* Diff #2: Big Center Star */}
        <g transform="translate(205, 50)">
          <line x1="0" y1="-28" x2="0" y2="28" stroke={isModified ? '#38BDF8' : '#FDE047'} strokeWidth="4" strokeLinecap="round" />
          <line x1="-24" y1="0" x2="24" y2="0" stroke={isModified ? '#38BDF8' : '#FDE047'} strokeWidth="4" strokeLinecap="round" />
          <circle cx="0" cy="0" r="9" fill={isModified ? '#EC4899' : '#FFFFFF'} />
        </g>

        {/* Hills */}
        <path d="M 0,210 Q 120,160 250,205 T 400,195 L 400,300 L 0,300 Z" fill="#1E293B" />
        <path d="M 0,235 Q 200,205 400,240 L 400,300 L 0,300 Z" fill="#334155" />

        {/* Shepherd Tent in Center */}
        <g transform="translate(200, 175)">
          <polygon points="-45,45 0,-15 45,45" fill="#D97706" stroke="#78350F" strokeWidth="2" />
          <polygon points="-14,45 0,10 14,45" fill="#451A03" />
        </g>

        {/* Diff #3: Palm Tree on Right */}
        <g transform="translate(332, 130)">
          <path d="M 0,90 Q -8,45 2,0" fill="none" stroke="#92400E" strokeWidth="8" strokeLinecap="round" />
          <ellipse cx="-18" cy="-4" rx="22" ry="7" fill="#16A34A" transform="rotate(-20 -18 -4)" />
          <ellipse cx="18" cy="-4" rx="22" ry="7" fill="#22C55E" transform="rotate(20 18 -4)" />
          <ellipse cx="0" cy="-14" rx="18" ry="7" fill="#4ADE80" transform="rotate(-5 0 -14)" />
          {!isModified ? (
            <>
              <circle cx="-5" cy="4" r="5" fill="#78350F" />
              <circle cx="6" cy="5" r="5" fill="#78350F" />
            </>
          ) : (
            <circle cx="0" cy="4" r="5" fill="#FBBF24" />
          )}
        </g>

        {/* Diff #4: Campfire vs Lantern on bottom left */}
        <g transform="translate(85, 232)">
          {isModified ? (
            <text x="0" y="10" fontSize="34" textAnchor="middle">🏮</text>
          ) : (
            <text x="0" y="10" fontSize="34" textAnchor="middle">🔥</text>
          )}
        </g>

        {/* Diff #5: Animal on bottom right */}
        <g transform="translate(305, 242)">
          <text x="0" y="10" fontSize="34" textAnchor="middle">
            {isModified ? '🐕' : '🐑'}
          </text>
        </g>
      </svg>
    ),
  },
];

export const SpotDifferenceGame: React.FC<Props> = ({
  settings,
  onBack,
  onEarnStars,
  onChangeSettings,
}) => {
  const { difficulty, playerCount } = settings;
  const [sceneIndex, setSceneIndex] = useState(0);
  const [foundIds, setFoundIds] = useState<number[]>([]);
  const [showHintRadar, setShowHintRadar] = useState<number | null>(null);
  const [clickRipples, setClickRipples] = useState<{ id: number; x: number; y: number; isHit: boolean }[]>([]);
  const [viewMode, setViewMode] = useState<'both' | 'left' | 'right'>('both');
  const [isWon, setIsWon] = useState(false);

  // Multiplayer teams
  const [activeTeam, setActiveTeam] = useState(1);
  const [teamScores, setTeamScores] = useState<Record<number, number>>({ 1: 0, 2: 0, 3: 0 });

  const currentScene = SCENES[sceneIndex];
  const requiredCount = 5;

  useEffect(() => {
    setSceneIndex(0);
    setFoundIds([]);
    setIsWon(false);
    setActiveTeam(1);
    setTeamScores({ 1: 0, 2: 0, 3: 0 });
  }, [difficulty, playerCount]);

  useEffect(() => {
    setFoundIds([]);
    setShowHintRadar(null);
    setIsWon(false);
  }, [sceneIndex]);

  // Click handler works on BOTH Left and Right pictures!
  const handlePictureClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isWon) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;

    let hitItem: DifferenceItem | null = null;
    const toleranceMultiplier = difficulty === 'easy' ? 1.4 : difficulty === 'medium' ? 1.15 : 0.95;

    for (const diff of currentScene.differences) {
      if (foundIds.includes(diff.id)) continue;
      const dx = clickX - diff.x;
      const dy = clickY - diff.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist <= diff.radius * toleranceMultiplier) {
        hitItem = diff;
        break;
      }
    }

    if (hitItem) {
      sounds.playSuccess();
      const newFound = [...foundIds, hitItem.id];
      setFoundIds(newFound);
      setShowHintRadar(null);

      setClickRipples((prev) => [
        ...prev.slice(-6),
        { id: Date.now(), x: hitItem!.x, y: hitItem!.y, isHit: true },
      ]);

      if (playerCount > 1) {
        setTeamScores((prev) => ({
          ...prev,
          [activeTeam]: (prev[activeTeam] || 0) + 10,
        }));
        setActiveTeam((t) => (t % playerCount) + 1);
      }

      if (newFound.length >= requiredCount) {
        setTimeout(() => {
          setIsWon(true);
          sounds.playWin();
          try {
            confetti({ particleCount: 80, spread: 70 });
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
    const remaining = currentScene.differences.filter((d) => !foundIds.includes(d.id));
    if (remaining.length > 0) {
      setShowHintRadar(remaining[0].id);
    }
  };

  const handleNextScene = () => {
    sounds.playClick();
    if (sceneIndex + 1 < SCENES.length) {
      setSceneIndex((idx) => idx + 1);
    } else {
      setSceneIndex(0);
    }
  };

  const handleRestart = () => {
    sounds.playClick();
    setFoundIds([]);
    setIsWon(false);
    setShowHintRadar(null);
  };

  const difficultyText =
    difficulty === 'easy'
      ? 'Easy • Big Targets'
      : difficulty === 'medium'
      ? 'Medium • 5 Differences'
      : 'Hard • Expert Eye';

  const hintDiff = currentScene.differences.find((d) => d.id === showHintRadar);

  return (
    <div className="flex flex-col items-center max-w-5xl mx-auto px-3 sm:px-4 py-2 w-full animate-fadeIn select-none">
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
              {sceneIndex + 1} / {SCENES.length}
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

        {/* View Mode Toggle for Small Laptops & Hint */}
        <div className="flex items-center gap-1.5">
          <div className="hidden sm:flex bg-gray-100 p-0.5 rounded-xl text-xs font-bold">
            <button
              onClick={() => setViewMode('both')}
              className={`px-2 py-1 rounded-lg transition ${
                viewMode === 'both' ? 'bg-white text-indigo-600 shadow-xs' : 'text-gray-500'
              }`}
            >
              Side-by-Side ↔
            </button>
            <button
              onClick={() => setViewMode('left')}
              className={`px-2 py-1 rounded-lg transition ${
                viewMode === 'left' ? 'bg-white text-indigo-600 shadow-xs' : 'text-gray-500'
              }`}
            >
              Left 🖼️
            </button>
            <button
              onClick={() => setViewMode('right')}
              className={`px-2 py-1 rounded-lg transition ${
                viewMode === 'right' ? 'bg-white text-indigo-600 shadow-xs' : 'text-gray-500'
              }`}
            >
              Right 🔍
            </button>
          </div>

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
        turnMessage="Tap either picture to spot a difference!"
        onChangeSettings={onChangeSettings}
      />

      {/* Scene Switcher Strip (6 Scenes) */}
      <div className="flex flex-wrap justify-center gap-1 mb-1.5">
        {SCENES.map((sc, idx) => (
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

      {/* Hint Alert */}
      {hintDiff && (
        <div className="w-full max-w-2xl mb-2 bg-amber-50 border border-amber-300 text-amber-900 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-1.5">
            <Lightbulb className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>💡 Clue: {hintDiff.hint}</span>
          </div>
          <span className="text-[10px] bg-amber-200 text-amber-950 px-2 py-0.2 rounded-full font-black">
            Pulsing Beacon
          </span>
        </div>
      )}

      {/* Dual Picture Comparison Area (Fit to Laptop Screen Height) */}
      <div
        className={`w-full max-w-4xl grid gap-2 sm:gap-3 mb-2 ${
          viewMode === 'both' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 max-w-2xl'
        }`}
      >
        {/* Left: Original Picture */}
        {(viewMode === 'both' || viewMode === 'left') && (
          <div className="bg-white rounded-2xl p-2 sm:p-2.5 shadow-md border-3 border-indigo-200 flex flex-col items-center">
            <div className="w-full flex items-center justify-between px-1.5 mb-1">
              <span className="text-[11px] font-black text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full">
                Original Picture 🖼️
              </span>
              <span className="text-[10px] text-gray-400 font-semibold">{currentScene.title}</span>
            </div>

            <div
              onClick={handlePictureClick}
              className="w-full h-[32vh] min-h-[190px] max-h-[300px] aspect-4/3 rounded-xl overflow-hidden relative shadow-inner bg-sky-50 cursor-pointer touch-none"
            >
              {currentScene.renderIllustration(false, foundIds)}

              {/* Found rings */}
              {currentScene.differences.map((diff) => {
                if (!foundIds.includes(diff.id)) return null;
                return (
                  <div
                    key={diff.id}
                    style={{
                      left: `${diff.x}%`,
                      top: `${diff.y}%`,
                      width: `${diff.radius * 2.2}%`,
                      height: `${diff.radius * 2.5}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                    className="absolute rounded-full border-3 border-emerald-500 bg-emerald-400/20 shadow-md animate-scaleUp pointer-events-none"
                  />
                );
              })}

              {hintDiff && (
                <div
                  style={{
                    left: `${hintDiff.x}%`,
                    top: `${hintDiff.y}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                  className="absolute w-12 h-12 rounded-full border-3 border-amber-400 bg-amber-400/30 animate-ping pointer-events-none"
                />
              )}
            </div>
          </div>
        )}

        {/* Right: Modified Picture */}
        {(viewMode === 'both' || viewMode === 'right') && (
          <div className="bg-white rounded-2xl p-2 sm:p-2.5 shadow-md border-3 border-amber-300 flex flex-col items-center">
            <div className="w-full flex items-center justify-between px-1.5 mb-1">
              <span className="text-[11px] font-black text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full animate-pulse">
                Tap Differences Here! 🔍
              </span>
              <span className="text-[10px] font-bold text-emerald-600">
                {foundIds.length} / 5 Found
              </span>
            </div>

            <div
              onClick={handlePictureClick}
              className="w-full h-[32vh] min-h-[190px] max-h-[300px] aspect-4/3 rounded-xl overflow-hidden relative shadow-inner bg-sky-50 cursor-crosshair touch-none group"
            >
              {currentScene.renderIllustration(true, foundIds)}

              {/* Found items marked with green checkmark circles */}
              {currentScene.differences.map((diff) => {
                if (!foundIds.includes(diff.id)) return null;
                return (
                  <div
                    key={diff.id}
                    style={{
                      left: `${diff.x}%`,
                      top: `${diff.y}%`,
                      width: `${diff.radius * 2.2}%`,
                      height: `${diff.radius * 2.5}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                    className="absolute rounded-full border-3 border-emerald-500 bg-emerald-400/25 shadow-lg flex items-center justify-center animate-scaleUp pointer-events-none"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-white" />
                  </div>
                );
              })}

              {hintDiff && (
                <div
                  style={{
                    left: `${hintDiff.x}%`,
                    top: `${hintDiff.y}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                  className="absolute w-12 h-12 rounded-full border-3 border-amber-400 bg-amber-400/30 animate-ping pointer-events-none"
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
        )}
      </div>

      {/* Progress Stars Checklist Bar */}
      <div className="w-full max-w-xl bg-white/90 backdrop-blur rounded-xl px-3 py-1.5 border border-indigo-100 shadow-xs flex items-center justify-between">
        <span className="text-[11px] font-black text-gray-700">Differences Found:</span>
        <div className="flex gap-1.5">
          {Array.from({ length: 5 }).map((_, i) => {
            const isDone = i < foundIds.length;
            return (
              <div
                key={i}
                className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black transition-all ${
                  isDone
                    ? 'bg-emerald-500 text-white shadow-xs scale-105'
                    : 'bg-gray-100 text-gray-400 border border-gray-200'
                }`}
              >
                {isDone ? '⭐' : `${i + 1}`}
              </div>
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
          playAgainLabel="Next Picture ➔"
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
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-1">Sharp Eyes! 👁️✨</h2>
            <p className="text-xs sm:text-sm text-gray-600 font-medium mb-4">
              You found all 5 differences in "{currentScene.title}"!
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
                Next Picture ➔
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
