import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Pause, Play, Car, Eye, Map } from 'lucide-react';
import { PageHeader } from '../../components/PageHeader.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card.jsx';
import { Button } from '../../components/ui/button.jsx';
import { Badge } from '../../components/ui/badge.jsx';
import { EmptyState } from '../../components/StateViews.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useAppData } from '../../context/AppContext.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { makeId, formatDate } from '../../utils/helpers.js';
import {
  ACCEL, BRAKE, CANVAS_H, CANVAS_W, DEFAULT_LIMIT, FRICTION, GAME_TIME_LIMIT,
  LANES, MAX_SPEED, PASS_SCORE, TRACK_LENGTH, buildItems, drawScene, laneCenterX,
} from '../../lib/drivingSim.js';

const Simulator = () => {
  const { auth } = useAuth();
  const { state, logSimulatorSession, pushToast } = useAppData();
  const { t } = useLanguage();
  const student = state.students.find((s) => s.id === auth.studentId);

  const [phase, setPhase] = useState('idle'); // idle | running | paused | finished
  const [camera, setCamera] = useState('chase'); // chase | cockpit | top
  const [ui, setUi] = useState({ speed: 0, limit: DEFAULT_LIMIT, score: 100, distance: 0, time: 0 });
  const [violationsUi, setViolationsUi] = useState([]);
  const [finalResult, setFinalResult] = useState(null);

  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const lastTimeRef = useRef(null);
  const phaseRef = useRef('idle');
  const cameraRef = useRef('chase');

  useEffect(() => { cameraRef.current = camera; }, [camera]);

  const speedRef = useRef(0);
  const limitRef = useRef(DEFAULT_LIMIT);
  const distanceRef = useRef(0);
  const scoreRef = useRef(100);
  const elapsedRef = useRef(0);
  const laneRef = useRef(1);
  const carXRef = useRef(laneCenterX(1));
  const itemsRef = useRef([]);
  const violationsRef = useRef([]);
  const speedingFlagRef = useRef(false);
  const keysRef = useRef({ up: false, down: false });
  const pressedRef = useRef(new Set());
  const uiAccumRef = useRef(0);

  const history = (state.simulatorSessions || []).filter((s) => s.studentId === auth.studentId).sort((a, b) => b.date.localeCompare(a.date));

  const recordViolation = useCallback((key, penalty) => {
    scoreRef.current = Math.max(0, scoreRef.current - penalty);
    violationsRef.current = [{ id: makeId('v'), key, distance: Math.round(distanceRef.current) }, ...violationsRef.current].slice(0, 6);
    pushToast(t(`simulator.violation.${key}`), 'danger');
  }, [pushToast, t]);

  const evaluateItem = useCallback((item) => {
    const distance = distanceRef.current;

    if (item.type === 'speedLimit' && !item.applied && distance >= item.triggerDistance) {
      limitRef.current = item.value;
      item.applied = true;
      return;
    }
    if (item.type === 'endOfLimit' && !item.applied && distance >= item.triggerDistance) {
      limitRef.current = DEFAULT_LIMIT;
      item.applied = true;
      return;
    }

    if (item.type === 'car' && !item.collided) {
      const zoneStart = item.triggerDistance - 5;
      const zoneEnd = item.triggerDistance + 5;
      if (distance >= zoneStart && distance <= zoneEnd && laneRef.current === item.lane) {
        item.collided = true;
        recordViolation('collision', 25);
      } else if (distance > zoneEnd) {
        item.collided = true;
      }
      return;
    }

    if (['stop', 'yield', 'pedestrian'].includes(item.type) && !item.evaluated) {
      const zoneBefore = item.type === 'stop' ? 25 : item.type === 'yield' ? 18 : 16;
      const zoneStart = item.triggerDistance - zoneBefore;
      const zoneEnd = item.triggerDistance + 4;
      if (distance >= zoneStart && distance <= zoneEnd) {
        item.minSpeedSeen = Math.min(item.minSpeedSeen, speedRef.current);
      }
      if (distance > zoneEnd) {
        item.evaluated = true;
        const threshold = item.type === 'stop' ? 3 : item.type === 'yield' ? 25 : 15;
        if (item.minSpeedSeen > threshold) {
          recordViolation(item.type === 'pedestrian' ? 'pedestrian' : item.type, item.type === 'pedestrian' ? 20 : 10);
        }
      }
    }
  }, [recordViolation]);

  const endGame = useCallback(() => {
    const finalScore = scoreRef.current;
    const passed = finalScore >= PASS_SCORE;
    logSimulatorSession(auth.studentId, {
      score: finalScore,
      distance: Math.round(distanceRef.current),
      violations: violationsRef.current.length,
      passed,
    });
    setFinalResult({ score: finalScore, passed, violations: violationsRef.current.length, distance: Math.round(distanceRef.current) });
    setPhase('finished');
    phaseRef.current = 'finished';
  }, [auth.studentId, logSimulatorSession]);

  // main loop — runs continuously, gated internally by phaseRef
  useEffect(() => {
    const loop = (now) => {
      rafRef.current = requestAnimationFrame(loop);
      const canvas = canvasRef.current;
      if (!canvas) return;

      if (phaseRef.current !== 'running') {
        lastTimeRef.current = now;
        return;
      }

      const dt = Math.min(0.05, (now - (lastTimeRef.current || now)) / 1000);
      lastTimeRef.current = now;
      elapsedRef.current += dt;

      if (keysRef.current.up) speedRef.current = Math.min(MAX_SPEED, speedRef.current + ACCEL * dt);
      else if (keysRef.current.down) speedRef.current = Math.max(0, speedRef.current - BRAKE * dt);
      else speedRef.current = Math.max(0, speedRef.current - FRICTION * dt);

      distanceRef.current += (speedRef.current / 3.6) * dt;

      itemsRef.current.forEach(evaluateItem);

      if (speedRef.current > limitRef.current + 8) {
        if (!speedingFlagRef.current) { recordViolation('speeding', 10); speedingFlagRef.current = true; }
      } else if (speedRef.current <= limitRef.current + 2) {
        speedingFlagRef.current = false;
      }

      const target = laneCenterX(laneRef.current);
      carXRef.current += (target - carXRef.current) * 0.18;

      if (distanceRef.current >= TRACK_LENGTH || elapsedRef.current >= GAME_TIME_LIMIT) {
        endGame();
      }

      const ctx = canvas.getContext('2d');
      drawScene(ctx, { carX: carXRef.current, distance: distanceRef.current, items: itemsRef.current, now, camera: cameraRef.current });

      uiAccumRef.current += dt;
      if (uiAccumRef.current > 0.12) {
        uiAccumRef.current = 0;
        setUi({
          speed: Math.round(speedRef.current),
          limit: limitRef.current,
          score: scoreRef.current,
          distance: Math.round(distanceRef.current),
          time: Math.round(elapsedRef.current),
        });
        setViolationsUi(violationsRef.current);
      }
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [evaluateItem, recordViolation, endGame]);

  // keyboard controls
  useEffect(() => {
    const laneKeys = { ArrowLeft: -1, a: -1, A: -1, ArrowRight: 1, d: 1, D: 1 };
    const onKeyDown = (e) => {
      if (phaseRef.current !== 'running') return;
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') keysRef.current.up = true;
      if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S' || e.key === ' ') keysRef.current.down = true;
      if (laneKeys[e.key] !== undefined && !pressedRef.current.has(e.key)) {
        pressedRef.current.add(e.key);
        laneRef.current = Math.min(LANES - 1, Math.max(0, laneRef.current + laneKeys[e.key]));
      }
    };
    const onKeyUp = (e) => {
      pressedRef.current.delete(e.key);
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') keysRef.current.up = false;
      if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S' || e.key === ' ') keysRef.current.down = false;
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, []);

  // canvas resolution setup
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = CANVAS_W * dpr;
    canvas.height = CANVAS_H * dpr;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
  }, []);

  const startGame = () => {
    speedRef.current = 0;
    limitRef.current = DEFAULT_LIMIT;
    distanceRef.current = 0;
    scoreRef.current = 100;
    elapsedRef.current = 0;
    laneRef.current = 1;
    carXRef.current = laneCenterX(1);
    itemsRef.current = buildItems(makeId);
    violationsRef.current = [];
    speedingFlagRef.current = false;
    setViolationsUi([]);
    setUi({ speed: 0, limit: DEFAULT_LIMIT, score: 100, distance: 0, time: 0 });
    setFinalResult(null);
    setPhase('running');
    phaseRef.current = 'running';
  };

  const togglePause = () => {
    const next = phase === 'running' ? 'paused' : 'running';
    setPhase(next);
    phaseRef.current = next;
  };

  const setKey = (key, value) => { keysRef.current[key] = value; };
  const changeLane = (dir) => { laneRef.current = Math.min(LANES - 1, Math.max(0, laneRef.current + dir)); };

  if (student && !student.active) {
    return (
      <>
        <PageHeader title={t('simulator.title')} subtitle={t('simulator.subtitle')} />
        <div className="flex-1 p-6 md:p-8">
          <Card><EmptyState title={t('simulator.locked')} hint={t('simulator.lockedHint')} /></Card>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader title={t('simulator.title')} subtitle={t('simulator.subtitle')} />
      <div className="flex-1 p-6 md:p-8">
        <div className="grid gap-5 lg:grid-cols-[auto_1fr]">
          <div className="flex flex-col items-center gap-3">
            <div className="flex w-full max-w-[340px] gap-1 rounded-md bg-secondary p-1">
              {[
                { key: 'chase', icon: Car, label: t('simulator.cameraChase') },
                { key: 'cockpit', icon: Eye, label: t('simulator.cameraCockpit') },
                { key: 'top', icon: Map, label: t('simulator.cameraTop') },
              ].map((c) => (
                <button
                  key={c.key}
                  type="button"
                  onClick={() => setCamera(c.key)}
                  className={`flex flex-1 items-center justify-center gap-1.5 rounded px-2 py-1.5 text-xs font-semibold transition-colors ${
                    camera === c.key ? 'bg-card text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <c.icon className="h-3.5 w-3.5" />
                  {c.label}
                </button>
              ))}
            </div>

            <div className="relative w-full max-w-[340px] overflow-hidden rounded-lg border shadow-sm" style={{ aspectRatio: `${CANVAS_W}/${CANVAS_H}` }}>
              <canvas ref={canvasRef} className="h-full w-full" style={{ width: CANVAS_W, height: CANVAS_H }} />

              {phase === 'idle' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-background/95 p-6 text-center">
                  <h3 className="font-display text-lg font-semibold">{t('simulator.instructions')}</h3>
                  <p className="max-w-[240px] text-xs text-muted-foreground">{t('simulator.instructionsBody')}</p>
                  <Button variant="accent" onClick={startGame}>{t('simulator.start')}</Button>
                </div>
              )}

              {phase === 'paused' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-background/90">
                  <Button variant="accent" onClick={togglePause}><Play className="h-4 w-4" />{t('simulator.resume')}</Button>
                </div>
              )}

              {phase === 'finished' && finalResult && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-background/95 p-6 text-center">
                  <Badge variant={finalResult.passed ? 'success' : 'destructive'}>
                    {finalResult.passed ? t('simulator.passed') : t('simulator.failed')}
                  </Badge>
                  <h3 className="mt-1 font-display text-lg font-semibold">{t('simulator.gameOverTitle')}</h3>
                  <div className="font-display text-3xl font-semibold text-primary">{finalResult.score}/100</div>
                  <p className="text-xs text-muted-foreground">{t('simulator.finalScore')}</p>
                  <Button variant="accent" className="mt-2" onClick={startGame}>{t('simulator.playAgain')}</Button>
                </div>
              )}

              {(phase === 'running' || phase === 'paused') && (
                <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-between gap-2 p-2 text-[11px] font-semibold">
                  <span className="rounded bg-black/55 px-2 py-1 text-white">{t('simulator.speed')}: {ui.speed} km/h</span>
                  <span className="rounded bg-black/55 px-2 py-1 text-white">{t('simulator.limit')}: {ui.limit}</span>
                  <span className="rounded bg-black/55 px-2 py-1 text-white">{t('simulator.score')}: {ui.score}</span>
                </div>
              )}
            </div>

            {phase === 'running' && (
              <div className="flex w-full max-w-[340px] items-center justify-between gap-2">
                <div className="flex gap-2">
                  <Button size="icon" variant="outline" onPointerDown={() => changeLane(-1)} aria-label={t('simulator.left')}><ArrowLeft className="h-4 w-4" /></Button>
                  <Button size="icon" variant="outline" onPointerDown={() => changeLane(1)} aria-label={t('simulator.right')}><ArrowRight className="h-4 w-4" /></Button>
                </div>
                <Button size="icon" variant="outline" onClick={togglePause} aria-label={t('simulator.pause')}><Pause className="h-4 w-4" /></Button>
                <div className="flex gap-2">
                  <Button
                    size="icon" variant="outline" aria-label={t('simulator.brake')}
                    onPointerDown={() => setKey('down', true)} onPointerUp={() => setKey('down', false)} onPointerLeave={() => setKey('down', false)}
                  ><ArrowDown className="h-4 w-4" /></Button>
                  <Button
                    size="icon" variant="accent" aria-label={t('simulator.accelerate')}
                    onPointerDown={() => setKey('up', true)} onPointerUp={() => setKey('up', false)} onPointerLeave={() => setKey('up', false)}
                  ><ArrowUp className="h-4 w-4" /></Button>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-5">
            {(phase === 'running' || phase === 'paused' || phase === 'finished') && (
              <Card>
                <CardHeader><CardTitle>{t('simulator.violations')}</CardTitle></CardHeader>
                <CardContent className="pt-0">
                  {violationsUi.length === 0 ? (
                    <p className="text-sm text-muted-foreground">{t('simulator.noViolations')}</p>
                  ) : (
                    <ul className="flex flex-col gap-1.5">
                      {violationsUi.map((v) => (
                        <li key={v.id} className="flex items-center justify-between rounded-md border border-destructive/30 bg-destructive-soft px-3 py-1.5 text-xs text-destructive">
                          <span>{t(`simulator.violation.${v.key}`)}</span>
                          <span className="font-mono">{v.distance}m</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader><CardTitle>{t('simulator.history')}</CardTitle></CardHeader>
              <CardContent className="pt-0">
                {history.length === 0 ? (
                  <EmptyState title={t('simulator.empty')} hint={t('simulator.emptyHint')} />
                ) : (
                  <ul className="flex flex-col gap-1.5">
                    {history.map((h) => (
                      <li key={h.id} className="flex items-center justify-between rounded-md border px-3 py-2 text-sm">
                        <span className="text-muted-foreground">{formatDate(h.date)}</span>
                        <span className="font-semibold">{h.score}/100</span>
                        <Badge variant={h.passed ? 'success' : 'destructive'}>{h.passed ? t('simulator.passed') : t('simulator.failed')}</Badge>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default Simulator;
