import React, { useState, useRef, useEffect } from 'react';
import { GameSettings } from '../types';
import { sounds } from '../utils/sound';
import { ArrowLeft, RotateCcw, Download, Undo, Sparkles, Stamp, Brush, Eraser, UserCheck, PaintBucket } from 'lucide-react';
import confetti from 'canvas-confetti';
import { TeamScoreboard } from '../components/TeamScoreboard';

interface Props {
  settings: GameSettings;
  onBack: () => void;
  onEarnStars: (count: number) => void;
  onChangeSettings: () => void;
}

const TEMPLATES = [
  { id: 'ark', title: "⛵ Noah's Ark" },
  { id: 'sheep', title: '🐑 Little Sheep' },
  { id: 'church', title: '⛪ Happy Church' },
  { id: 'dove', title: '🕊️ Peace Dove' },
  { id: 'himalaya', title: '🏔️ Himalayas' },
  { id: 'garden', title: '🌸 Flower & Butterfly' },
  { id: 'fish', title: '🐟 Happy Fish' },
  { id: 'blank', title: '🎨 Blank Canvas' },
];

const COLORS = [
  '#EF4444', '#F97316', '#FBBF24', '#EAB308',
  '#84CC16', '#22C55E', '#06B6D4', '#3B82F6',
  '#6366F1', '#A855F7', '#EC4899', '#78350F',
  '#1E293B', '#FFFFFF',
];

const STAMPS = ['⭐', '❤️', '🕊️', '🌸', '⛪', '👑', '☀️', '🐑'];

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace('#', '');
  const num = parseInt(clean, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

export const ColoringBookGame: React.FC<Props> = ({
  settings,
  onBack,
  onEarnStars,
  onChangeSettings,
}) => {
  const { difficulty, playerCount } = settings;
  const [selectedTemplate, setSelectedTemplate] = useState('ark');
  const [activeTool, setActiveTool] = useState<'bucket' | 'brush' | 'rainbow' | 'eraser' | 'stamp'>('bucket');
  const [color, setColor] = useState('#3B82F6');
  const [brushSize, setBrushSize] = useState(difficulty === 'easy' ? 14 : 8);
  const [selectedStamp, setSelectedStamp] = useState('⭐');

  // Multiplayer teams
  const [activeTeam, setActiveTeam] = useState(1);
  const [teamStrokes, setTeamStrokes] = useState<Record<number, number>>({ 1: 0, 2: 0, 3: 0 });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawing = useRef(false);
  const lastPos = useRef<{ x: number; y: number } | null>(null);
  const rainbowHue = useRef(0);
  const historyRef = useRef<ImageData[]>([]);

  useEffect(() => {
    initCanvas();
  }, [selectedTemplate, difficulty]);

  const initCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawTemplateOutline(ctx, selectedTemplate, canvas.width, canvas.height);
    historyRef.current = [ctx.getImageData(0, 0, canvas.width, canvas.height)];
  };

  // Helper to draw clean filled-white + crisp-black-stroked closed shape
  const drawCleanShape = (
    ctx: CanvasRenderingContext2D,
    drawPath: () => void,
    fillWhite = true
  ) => {
    ctx.beginPath();
    drawPath();
    if (fillWhite) {
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();
    }
    ctx.stroke();
  };

  const drawTemplateOutline = (ctx: CanvasRenderingContext2D, templateId: string, w: number, h: number) => {
    ctx.strokeStyle = '#1E293B';
    ctx.lineWidth = difficulty === 'easy' ? 5 : 4;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (templateId === 'ark') {
      // Rainbow bands (top arc down to horizon, cleanly separated!)
      const rCx = w / 2;
      const rCy = 290;
      [250, 225, 200, 175].forEach((radius) => {
        ctx.beginPath();
        ctx.arc(rCx, rCy, radius, Math.PI * 1.12, Math.PI * 1.88);
        ctx.stroke();
      });

      // Sun in top-left with separate ray paths
      drawCleanShape(ctx, () => ctx.arc(85, 75, 34, 0, Math.PI * 2));
      for (let i = 0; i < 8; i++) {
        const ang = (i * Math.PI) / 4;
        ctx.beginPath();
        ctx.moveTo(85 + Math.cos(ang) * 42, 75 + Math.sin(ang) * 42);
        ctx.lineTo(85 + Math.cos(ang) * 56, 75 + Math.sin(ang) * 56);
        ctx.stroke();
      }

      // Cute cloud on top-right
      drawCleanShape(ctx, () => {
        ctx.moveTo(490, 95);
        ctx.arc(510, 82, 22, Math.PI, 0);
        ctx.arc(542, 75, 26, Math.PI * 1.1, Math.PI * 1.9);
        ctx.arc(572, 85, 20, Math.PI * 1.2, Math.PI * 0.4);
        ctx.lineTo(490, 105);
        ctx.arc(490, 95, 14, Math.PI * 0.5, Math.PI * 1.3);
        ctx.closePath();
      });

      // Ark Roof & Cabin (drawn with white fill so rainbow behind doesn't cut inside!)
      drawCleanShape(ctx, () => {
        ctx.rect(215, 205, 210, 75);
      });
      drawCleanShape(ctx, () => {
        ctx.moveTo(195, 205);
        ctx.lineTo(320, 145);
        ctx.lineTo(445, 205);
        ctx.closePath();
      });

      // Two round windows on cabin
      drawCleanShape(ctx, () => ctx.arc(265, 242, 20, 0, Math.PI * 2));
      drawCleanShape(ctx, () => ctx.arc(375, 242, 20, 0, Math.PI * 2));

      // Cabin Door
      drawCleanShape(ctx, () => {
        ctx.rect(302, 225, 36, 55);
      });

      // Ark Hull
      drawCleanShape(ctx, () => {
        ctx.moveTo(130, 280);
        ctx.lineTo(510, 280);
        ctx.quadraticCurveTo(500, 355, 455, 380);
        ctx.lineTo(185, 380);
        ctx.quadraticCurveTo(140, 355, 130, 280);
        ctx.closePath();
      });
      // Wood plank stripe
      ctx.beginPath();
      ctx.moveTo(142, 325);
      ctx.lineTo(498, 325);
      ctx.stroke();

      // Ocean waves across bottom (closed wave band)
      ctx.beginPath();
      ctx.moveTo(0, 385);
      for (let x = 0; x <= w; x += 64) {
        ctx.quadraticCurveTo(x + 16, 365, x + 32, 385);
        ctx.quadraticCurveTo(x + 48, 405, x + 64, 385);
      }
      ctx.stroke();
    } else if (templateId === 'sheep') {
      // Rolling meadow hills
      ctx.beginPath();
      ctx.moveTo(0, 365);
      ctx.quadraticCurveTo(w / 2, 325, w, 365);
      ctx.stroke();

      // Sun
      drawCleanShape(ctx, () => ctx.arc(545, 75, 36, 0, Math.PI * 2));

      // Legs (behind wool body)
      const legPositions = [255, 290, 350, 385];
      legPositions.forEach((lx) => {
        drawCleanShape(ctx, () => {
          ctx.rect(lx, 310, 22, 65);
        });
      });

      // Fluffy Sheep Wool Body (single smooth scalloped cloud path — NO interior intersecting lines!)
      drawCleanShape(ctx, () => {
        const cx = 340;
        const cy = 245;
        ctx.moveTo(cx - 95, cy);
        ctx.bezierCurveTo(cx - 115, cy - 55, cx - 60, cy - 95, cx - 25, cy - 75);
        ctx.bezierCurveTo(cx - 5, cy - 115, cx + 65, cy - 105, cx + 65, cy - 60);
        ctx.bezierCurveTo(cx + 115, cy - 60, cx + 130, cy - 5, cx + 95, cy + 25);
        ctx.bezierCurveTo(cx + 115, cy + 70, cx + 55, cy + 95, cx + 25, cy + 75);
        ctx.bezierCurveTo(cx - 5, cy + 100, cx - 65, cy + 90, cx - 70, cy + 60);
        ctx.bezierCurveTo(cx - 110, cy + 55, cx - 115, cy + 15, cx - 95, cy);
        ctx.closePath();
      });

      // Sheep Ears
      drawCleanShape(ctx, () => ctx.ellipse(200, 215, 26, 13, -0.5, 0, Math.PI * 2));
      drawCleanShape(ctx, () => ctx.ellipse(285, 215, 26, 13, 0.5, 0, Math.PI * 2));

      // Sheep Head
      drawCleanShape(ctx, () => ctx.ellipse(242, 238, 42, 46, 0, 0, Math.PI * 2));

      // Fluffy forehead tuft
      drawCleanShape(ctx, () => {
        ctx.moveTo(212, 205);
        ctx.arc(227, 198, 15, Math.PI, 0);
        ctx.arc(255, 198, 15, Math.PI, 0);
        ctx.quadraticCurveTo(242, 215, 212, 205);
        ctx.closePath();
      });

      // Cute Eyes & Smile
      ctx.beginPath();
      ctx.arc(226, 234, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#1E293B';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(258, 234, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#1E293B';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(242, 250, 12, 0.15 * Math.PI, 0.85 * Math.PI);
      ctx.stroke();

      // Cute flowers in grass
      [110, 520].forEach((fx) => {
        ctx.beginPath();
        ctx.moveTo(fx, 400);
        ctx.lineTo(fx, 445);
        ctx.stroke();
        for (let p = 0; p < 5; p++) {
          const a = (p * 2 * Math.PI) / 5;
          drawCleanShape(ctx, () => {
            ctx.arc(fx + Math.cos(a) * 14, 390 + Math.sin(a) * 14, 10, 0, Math.PI * 2);
          });
        }
        drawCleanShape(ctx, () => ctx.arc(fx, 390, 9, 0, Math.PI * 2));
      });
    } else if (templateId === 'church') {
      // Ground line
      ctx.beginPath();
      ctx.moveTo(0, 415);
      ctx.lineTo(w, 415);
      ctx.stroke();

      // Left & Right Pine Trees
      [95, 545].forEach((tx) => {
        drawCleanShape(ctx, () => ctx.rect(tx - 12, 355, 24, 60));
        drawCleanShape(ctx, () => {
          ctx.moveTo(tx - 45, 355);
          ctx.lineTo(tx, 260);
          ctx.lineTo(tx + 45, 355);
          ctx.closePath();
        });
        drawCleanShape(ctx, () => {
          ctx.moveTo(tx - 35, 285);
          ctx.lineTo(tx, 205);
          ctx.lineTo(tx + 35, 285);
          ctx.closePath();
        });
      });

      // Main Church Building
      drawCleanShape(ctx, () => ctx.rect(185, 225, 270, 190));

      // Main Roof
      drawCleanShape(ctx, () => {
        ctx.moveTo(165, 225);
        ctx.lineTo(320, 155);
        ctx.lineTo(475, 225);
        ctx.closePath();
      });

      // Steeple Tower
      drawCleanShape(ctx, () => ctx.rect(275, 115, 90, 110));
      drawCleanShape(ctx, () => {
        ctx.moveTo(265, 115);
        ctx.lineTo(320, 45);
        ctx.lineTo(375, 115);
        ctx.closePath();
      });

      // Cross on top
      ctx.beginPath();
      ctx.moveTo(320, 45);
      ctx.lineTo(320, 12);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(306, 25);
      ctx.lineTo(334, 25);
      ctx.stroke();

      // Round Stained Glass Window
      drawCleanShape(ctx, () => ctx.arc(320, 165, 24, 0, Math.PI * 2));
      ctx.beginPath();
      ctx.moveTo(320, 141);
      ctx.lineTo(320, 189);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(296, 165);
      ctx.lineTo(344, 165);
      ctx.stroke();

      // Arched Front Door
      drawCleanShape(ctx, () => {
        ctx.arc(320, 340, 38, Math.PI, 0);
        ctx.lineTo(358, 415);
        ctx.lineTo(282, 415);
        ctx.closePath();
      });
      ctx.beginPath();
      ctx.moveTo(320, 302);
      ctx.lineTo(320, 415);
      ctx.stroke();

      // Side Windows
      drawCleanShape(ctx, () => ctx.rect(210, 280, 42, 65));
      drawCleanShape(ctx, () => ctx.rect(388, 280, 42, 65));
    } else if (templateId === 'dove') {
      const cx = 310;
      const cy = 265;

      // Tail feathers
      drawCleanShape(ctx, () => {
        ctx.moveTo(cx - 50, cy + 10);
        ctx.lineTo(cx - 140, cy - 10);
        ctx.lineTo(cx - 135, cy + 45);
        ctx.lineTo(cx - 50, cy + 35);
        ctx.closePath();
      });

      // Back Wing
      drawCleanShape(ctx, () => {
        ctx.moveTo(cx - 10, cy - 15);
        ctx.quadraticCurveTo(cx - 80, cy - 155, cx - 150, cy - 115);
        ctx.quadraticCurveTo(cx - 115, cy - 35, cx - 35, cy + 5);
        ctx.closePath();
      });

      // Main Body & Head silhouette
      drawCleanShape(ctx, () => {
        ctx.ellipse(cx, cy + 15, 78, 46, -0.1, 0, Math.PI * 2);
      });
      drawCleanShape(ctx, () => {
        ctx.arc(cx + 80, cy - 22, 34, 0, Math.PI * 2);
      });

      // Front Wing (in front of body)
      drawCleanShape(ctx, () => {
        ctx.moveTo(cx - 5, cy + 5);
        ctx.quadraticCurveTo(cx + 35, cy - 165, cx - 55, cy - 150);
        ctx.quadraticCurveTo(cx - 65, cy - 60, cx - 20, cy + 15);
        ctx.closePath();
      });

      // Beak
      drawCleanShape(ctx, () => {
        ctx.moveTo(cx + 112, cy - 28);
        ctx.lineTo(cx + 140, cy - 18);
        ctx.lineTo(cx + 110, cy - 10);
        ctx.closePath();
      });

      // Eye
      ctx.beginPath();
      ctx.arc(cx + 88, cy - 28, 4.5, 0, Math.PI * 2);
      ctx.fillStyle = '#1E293B';
      ctx.fill();

      // Olive branch
      ctx.beginPath();
      ctx.moveTo(cx + 132, cy - 16);
      ctx.quadraticCurveTo(cx + 180, cy - 35, cx + 220, cy - 55);
      ctx.stroke();

      drawCleanShape(ctx, () => ctx.ellipse(cx + 165, cy - 42, 14, 7, -0.6, 0, Math.PI * 2));
      drawCleanShape(ctx, () => ctx.ellipse(cx + 195, cy - 26, 14, 7, 0.3, 0, Math.PI * 2));
      drawCleanShape(ctx, () => ctx.ellipse(cx + 218, cy - 62, 14, 7, -0.4, 0, Math.PI * 2));
    } else if (templateId === 'himalaya') {
      // Rising sun behind peaks
      drawCleanShape(ctx, () => ctx.arc(320, 120, 44, 0, Math.PI * 2));

      // Left & Right Mountain Peaks
      drawCleanShape(ctx, () => {
        ctx.moveTo(30, 350);
        ctx.lineTo(175, 130);
        ctx.lineTo(320, 350);
        ctx.closePath();
      });
      drawCleanShape(ctx, () => {
        ctx.moveTo(310, 350);
        ctx.lineTo(465, 145);
        ctx.lineTo(610, 350);
        ctx.closePath();
      });
      // Center Tall Everest Peak
      drawCleanShape(ctx, () => {
        ctx.moveTo(155, 350);
        ctx.lineTo(320, 75);
        ctx.lineTo(485, 350);
        ctx.closePath();
      });

      // Snow cap lines
      ctx.beginPath();
      ctx.moveTo(265, 165);
      ctx.lineTo(295, 185);
      ctx.lineTo(320, 165);
      ctx.lineTo(345, 185);
      ctx.lineTo(375, 165);
      ctx.stroke();

      // Foreground Valley Hill
      drawCleanShape(ctx, () => {
        ctx.moveTo(0, 350);
        ctx.lineTo(w, 350);
        ctx.lineTo(w, h);
        ctx.lineTo(0, h);
        ctx.closePath();
      });

      // Cozy Cottage
      drawCleanShape(ctx, () => ctx.rect(250, 370, 140, 85));
      drawCleanShape(ctx, () => {
        ctx.moveTo(235, 370);
        ctx.lineTo(320, 315);
        ctx.lineTo(405, 370);
        ctx.closePath();
      });
      drawCleanShape(ctx, () => ctx.rect(300, 405, 40, 50));
      drawCleanShape(ctx, () => ctx.rect(265, 390, 24, 24));
      drawCleanShape(ctx, () => ctx.rect(352, 390, 24, 24));
    } else if (templateId === 'garden') {
      // Hill
      ctx.beginPath();
      ctx.moveTo(0, 395);
      ctx.quadraticCurveTo(w / 2, 360, w, 395);
      ctx.stroke();

      // Big Center Daisy Flower
      ctx.beginPath();
      ctx.moveTo(260, 240);
      ctx.lineTo(260, 420);
      ctx.stroke();

      // Leaves
      drawCleanShape(ctx, () => ctx.ellipse(225, 345, 35, 16, -0.4, 0, Math.PI * 2));
      drawCleanShape(ctx, () => ctx.ellipse(295, 325, 35, 16, 0.4, 0, Math.PI * 2));

      // Petals
      for (let i = 0; i < 8; i++) {
        const angle = (i * 2 * Math.PI) / 8;
        drawCleanShape(ctx, () => {
          ctx.ellipse(
            260 + Math.cos(angle) * 58,
            215 + Math.sin(angle) * 58,
            30,
            22,
            angle,
            0,
            Math.PI * 2
          );
        });
      }
      // Smiling Flower Center
      drawCleanShape(ctx, () => ctx.arc(260, 215, 36, 0, Math.PI * 2));
      ctx.beginPath();
      ctx.arc(248, 208, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#1E293B';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(272, 208, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(260, 222, 12, 0.15 * Math.PI, 0.85 * Math.PI);
      ctx.stroke();

      // Big Butterfly on Right
      const bx = 485;
      const by = 185;
      drawCleanShape(ctx, () => ctx.ellipse(bx - 38, by - 25, 42, 30, -0.3, 0, Math.PI * 2));
      drawCleanShape(ctx, () => ctx.ellipse(bx + 38, by - 25, 42, 30, 0.3, 0, Math.PI * 2));
      drawCleanShape(ctx, () => ctx.ellipse(bx - 32, by + 26, 30, 24, 0.3, 0, Math.PI * 2));
      drawCleanShape(ctx, () => ctx.ellipse(bx + 32, by + 26, 30, 24, -0.3, 0, Math.PI * 2));
      drawCleanShape(ctx, () => ctx.ellipse(bx, by, 10, 44, 0, 0, Math.PI * 2));
      ctx.beginPath();
      ctx.moveTo(bx - 4, by - 42);
      ctx.quadraticCurveTo(bx - 20, by - 70, bx - 28, by - 65);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(bx + 4, by - 42);
      ctx.quadraticCurveTo(bx + 20, by - 70, bx + 28, by - 65);
      ctx.stroke();
    } else if (templateId === 'fish') {
      // Bubbles
      drawCleanShape(ctx, () => ctx.arc(140, 150, 14, 0, Math.PI * 2));
      drawCleanShape(ctx, () => ctx.arc(115, 105, 20, 0, Math.PI * 2));
      drawCleanShape(ctx, () => ctx.arc(155, 70, 11, 0, Math.PI * 2));

      // Top Fin & Tail Fin
      drawCleanShape(ctx, () => {
        ctx.moveTo(285, 165);
        ctx.quadraticCurveTo(320, 95, 370, 165);
        ctx.closePath();
      });
      drawCleanShape(ctx, () => {
        ctx.moveTo(420, 240);
        ctx.lineTo(525, 160);
        ctx.quadraticCurveTo(495, 240, 525, 320);
        ctx.closePath();
      });

      // Main Fish Body
      drawCleanShape(ctx, () => ctx.ellipse(310, 240, 130, 82, 0, 0, Math.PI * 2));

      // Stripes inside fish body
      ctx.beginPath();
      ctx.arc(240, 240, 58, -0.45 * Math.PI, 0.45 * Math.PI);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(315, 240, 66, -0.45 * Math.PI, 0.45 * Math.PI);
      ctx.stroke();

      // Side Fin
      drawCleanShape(ctx, () => ctx.ellipse(305, 265, 32, 16, 0.35, 0, Math.PI * 2));

      // Eye & Smile
      drawCleanShape(ctx, () => ctx.arc(225, 220, 14, 0, Math.PI * 2));
      ctx.beginPath();
      ctx.arc(222, 220, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#1E293B';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(205, 252, 16, 0.1 * Math.PI, 0.7 * Math.PI);
      ctx.stroke();

      // Seabed & Seaweed
      ctx.beginPath();
      ctx.moveTo(0, 425);
      ctx.quadraticCurveTo(w / 2, 395, w, 425);
      ctx.stroke();
    }
  };

  const getCanvasPos = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    let clientX = 0;
    let clientY = 0;
    if ('touches' in e) {
      if (e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      }
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  // Fast scanline Flood Fill for Paint Bucket tool
  const floodFillAt = (startX: number, startY: number, fillHex: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const sx = Math.floor(startX);
    const sy = Math.floor(startY);
    if (sx < 0 || sx >= w || sy < 0 || sy >= h) return;

    const imgData = ctx.getImageData(0, 0, w, h);
    const data = imgData.data;

    const idx = (sy * w + sx) * 4;
    const startR = data[idx];
    const startG = data[idx + 1];
    const startB = data[idx + 2];

    // Do not overwrite dark outline border pixels (#1E293B)
    if (startR < 75 && startG < 75 && startB < 85) return;

    const [fillR, fillG, fillB] = hexToRgb(fillHex);
    if (Math.abs(startR - fillR) < 8 && Math.abs(startG - fillG) < 8 && Math.abs(startB - fillB) < 8) {
      return;
    }

    const tolerance = 55;
    const visited = new Uint8Array(w * h);
    const stack: number[] = [sx, sy];

    const matchesStart = (pixelIndex: number) => {
      const p4 = pixelIndex * 4;
      const dr = Math.abs(data[p4] - startR);
      const dg = Math.abs(data[p4 + 1] - startG);
      const db = Math.abs(data[p4 + 2] - startB);
      return dr <= tolerance && dg <= tolerance && db <= tolerance;
    };

    while (stack.length > 0) {
      const y = stack.pop()!;
      const x = stack.pop()!;
      let px = x;

      // Move left to edge
      while (px >= 0 && !visited[y * w + px] && matchesStart(y * w + px)) {
        px--;
      }
      px++;

      let spanAbove = false;
      let spanBelow = false;

      while (px < w && !visited[y * w + px] && matchesStart(y * w + px)) {
        const pIdx = y * w + px;
        visited[pIdx] = 1;
        const p4 = pIdx * 4;
        data[p4] = fillR;
        data[p4 + 1] = fillG;
        data[p4 + 2] = fillB;
        data[p4 + 3] = 255;

        if (y > 0) {
          const aboveIdx = (y - 1) * w + px;
          const aboveMatch = !visited[aboveIdx] && matchesStart(aboveIdx);
          if (!spanAbove && aboveMatch) {
            stack.push(px, y - 1);
            spanAbove = true;
          } else if (spanAbove && !aboveMatch) {
            spanAbove = false;
          }
        }

        if (y < h - 1) {
          const belowIdx = (y + 1) * w + px;
          const belowMatch = !visited[belowIdx] && matchesStart(belowIdx);
          if (!spanBelow && belowMatch) {
            stack.push(px, y + 1);
            spanBelow = true;
          } else if (spanBelow && !belowMatch) {
            spanBelow = false;
          }
        }

        px++;
      }
    }

    ctx.putImageData(imgData, 0, 0);
    saveState();
  };

  const handleStartDraw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const pos = getCanvasPos(e);

    if (activeTool === 'bucket') {
      sounds.playPop();
      floodFillAt(pos.x, pos.y, color);
      if (playerCount > 1) {
        setTeamStrokes((prev) => ({
          ...prev,
          [activeTeam]: (prev[activeTeam] || 0) + 1,
        }));
      }
      return;
    }

    if (activeTool === 'stamp') {
      sounds.playPop();
      ctx.font = `${brushSize * 3 + 24}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(selectedStamp, pos.x, pos.y);
      saveState();

      if (playerCount > 1) {
        setTeamStrokes((prev) => ({
          ...prev,
          [activeTeam]: (prev[activeTeam] || 0) + 1,
        }));
      }
      return;
    }

    isDrawing.current = true;
    lastPos.current = pos;
  };

  const handleDrawMove = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current || !lastPos.current || activeTool === 'stamp' || activeTool === 'bucket') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const currentPos = getCanvasPos(e);

    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(currentPos.x, currentPos.y);

    if (activeTool === 'eraser') {
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = brushSize * 2.5;
    } else if (activeTool === 'rainbow') {
      rainbowHue.current = (rainbowHue.current + 6) % 360;
      ctx.strokeStyle = `hsl(${rainbowHue.current}, 90%, 55%)`;
      ctx.lineWidth = brushSize;
    } else {
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;
    }

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();

    lastPos.current = currentPos;
  };

  const handleEndDraw = () => {
    if (isDrawing.current) {
      isDrawing.current = false;
      lastPos.current = null;
      saveState();

      if (playerCount > 1) {
        setTeamStrokes((prev) => ({
          ...prev,
          [activeTeam]: (prev[activeTeam] || 0) + 1,
        }));
      }
    }
  };

  const saveState = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;
    historyRef.current.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    if (historyRef.current.length > 20) {
      historyRef.current.shift();
    }
  };

  const handleUndo = () => {
    sounds.playClick();
    if (historyRef.current.length > 1) {
      historyRef.current.pop();
      const prev = historyRef.current[historyRef.current.length - 1];
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;
      ctx.putImageData(prev, 0, 0);
    }
  };

  const handlePassTurn = () => {
    sounds.playWin();
    setActiveTeam((t) => (t % playerCount) + 1);
  };

  const handleDownload = () => {
    sounds.playWin();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `joykids-drawing-${selectedTemplate}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();

    try {
      confetti({ particleCount: 50, spread: 60 });
    } catch {
      // ignore
    }
    onEarnStars(8);
  };

  const difficultyText =
    difficulty === 'easy'
      ? 'Easy • Preschool-Gr.2'
      : difficulty === 'medium'
      ? 'Medium • Gr.3-5'
      : 'Hard • Gr.6+';

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

        <h2 className="text-base sm:text-lg font-black text-indigo-950 flex items-center gap-1.5">
          <span>🎨 Color &amp; Draw</span>
        </h2>

        <div className="flex gap-1.5">
          <button
            onClick={handleUndo}
            title="Undo"
            className="p-1.5 bg-white hover:bg-gray-100 text-gray-700 rounded-xl border border-gray-200 shadow transition active:scale-90"
          >
            <Undo className="w-4 h-4" />
          </button>
          <button
            onClick={initCanvas}
            title="Clear Canvas"
            className="p-1.5 bg-white hover:bg-gray-100 text-rose-600 rounded-xl border border-gray-200 shadow transition active:scale-90"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-md transition active:scale-95 text-xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Save PNG</span>
          </button>
        </div>
      </div>

      {/* Multiplayer Team Scoreboard & Level Display */}
      <TeamScoreboard
        playerCount={playerCount}
        activeTeam={activeTeam}
        scores={teamStrokes}
        difficultyLabel={difficultyText}
        turnMessage="Fill spaces or draw together!"
        onChangeSettings={onChangeSettings}
      />

      {playerCount > 1 && (
        <div className="mb-1.5 flex items-center gap-2">
          <button
            onClick={handlePassTurn}
            className="px-3.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl text-xs shadow transition active:scale-95 flex items-center gap-1 cursor-pointer"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Pass Turn to Next Team ➔</span>
          </button>
        </div>
      )}

      {/* Template Selectors */}
      <div className="flex flex-wrap gap-1.5 justify-center mb-1.5 w-full">
        {TEMPLATES.map((tmpl) => (
          <button
            key={tmpl.id}
            onClick={() => {
              sounds.playClick();
              setSelectedTemplate(tmpl.id);
            }}
            className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition cursor-pointer ${
              selectedTemplate === tmpl.id
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white text-gray-700 hover:bg-indigo-50 border border-gray-200'
            }`}
          >
            {tmpl.title}
          </button>
        ))}
      </div>

      {/* Drawing Canvas */}
      <div className="w-full max-w-2xl bg-white rounded-2xl p-1.5 shadow-xl border-3 border-indigo-200 flex justify-center items-center overflow-hidden">
        <canvas
          ref={canvasRef}
          width={640}
          height={480}
          onMouseDown={handleStartDraw}
          onMouseMove={handleDrawMove}
          onMouseUp={handleEndDraw}
          onMouseLeave={handleEndDraw}
          onTouchStart={handleStartDraw}
          onTouchMove={handleDrawMove}
          onTouchEnd={handleEndDraw}
          className="w-full h-auto max-h-[34vh] min-h-[190px] aspect-4/3 rounded-xl bg-white cursor-crosshair touch-none"
        />
      </div>

      {/* Toolbox: Tools, Brush Size, Colors, Stamps */}
      <div className="w-full max-w-2xl mt-2 bg-white/95 backdrop-blur rounded-2xl p-2.5 shadow-md border border-gray-200 flex flex-col gap-2">
        <div className="flex flex-wrap items-center justify-between gap-1.5 border-b border-gray-100 pb-1.5">
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => { sounds.playClick(); setActiveTool('bucket'); }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTool === 'bucket' ? 'bg-indigo-600 text-white shadow' : 'bg-gray-100 text-gray-700'
              }`}
            >
              <PaintBucket className="w-3.5 h-3.5" />
              <span>Fill Bucket</span>
            </button>
            <button
              onClick={() => { sounds.playClick(); setActiveTool('brush'); }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTool === 'brush' ? 'bg-indigo-600 text-white shadow' : 'bg-gray-100 text-gray-700'
              }`}
            >
              <Brush className="w-3.5 h-3.5" />
              <span>Brush</span>
            </button>
            <button
              onClick={() => { sounds.playClick(); setActiveTool('rainbow'); }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTool === 'rainbow' ? 'bg-gradient-to-r from-pink-500 to-amber-500 text-white shadow' : 'bg-gray-100 text-gray-700'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-200" />
              <span>Rainbow</span>
            </button>
            <button
              onClick={() => { sounds.playClick(); setActiveTool('stamp'); }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTool === 'stamp' ? 'bg-indigo-600 text-white shadow' : 'bg-gray-100 text-gray-700'
              }`}
            >
              <Stamp className="w-3.5 h-3.5" />
              <span>Stamps</span>
            </button>
            <button
              onClick={() => { sounds.playClick(); setActiveTool('eraser'); }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTool === 'eraser' ? 'bg-rose-600 text-white shadow' : 'bg-gray-100 text-gray-700'
              }`}
            >
              <Eraser className="w-3.5 h-3.5" />
              <span>Eraser</span>
            </button>
          </div>

          <div className="flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded-xl">
            {[4, 8, 14, 24].map((size) => (
              <button
                key={size}
                onClick={() => setBrushSize(size)}
                className={`w-6 h-6 rounded-lg flex items-center justify-center transition ${
                  brushSize === size ? 'bg-white shadow text-indigo-700 font-bold' : 'text-gray-400'
                }`}
              >
                <div
                  className="rounded-full bg-current"
                  style={{ width: `${Math.min(15, size + 2)}px`, height: `${Math.min(15, size + 2)}px` }}
                />
              </button>
            ))}
          </div>
        </div>

        {(activeTool === 'brush' || activeTool === 'bucket') && (
          <div className="flex flex-wrap gap-1.5 items-center justify-center">
            {COLORS.map((c) => (
              <button
                key={c}
                onClick={() => { sounds.playClick(); setColor(c); }}
                style={{ backgroundColor: c }}
                className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full shadow transition-transform transform cursor-pointer ${
                  color === c ? 'scale-125 ring-3 ring-indigo-400 ring-offset-1' : 'hover:scale-110'
                } ${c === '#FFFFFF' ? 'border border-gray-300' : ''}`}
              />
            ))}
          </div>
        )}

        {activeTool === 'stamp' && (
          <div className="flex flex-wrap gap-1.5 items-center justify-center">
            {STAMPS.map((st) => (
              <button
                key={st}
                onClick={() => { sounds.playPop(); setSelectedStamp(st); }}
                className={`w-8 h-8 rounded-xl text-xl flex items-center justify-center transition-all cursor-pointer ${
                  selectedStamp === st ? 'bg-indigo-100 border-2 border-indigo-500 scale-110 shadow' : 'bg-gray-50'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
