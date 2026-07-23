import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, XCircle, Clock } from 'lucide-react';
import { PageHeader } from '../../components/PageHeader.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card.jsx';
import { Button } from '../../components/ui/button.jsx';
import { Badge } from '../../components/ui/badge.jsx';
import { RoadSign } from '../../components/RoadSign.jsx';
import { cn } from '../../lib/utils.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useAppData } from '../../context/AppContext.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { examQuestions } from '../../data/examQuestions.js';

const PASS_THRESHOLD = 25; // out of 30, matching the real exam's ~5-error tolerance
const QUESTION_TIME = 25; // seconds per question in exam mode

const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const ExamQuiz = () => {
  const { auth } = useAuth();
  const { logExamAttempt, state } = useAppData();
  const { t, lang } = useLanguage();

  const [phase, setPhase] = useState('intro'); // intro | active | results
  const [mode, setMode] = useState(null); // practice | exam
  const [order, setOrder] = useState(examQuestions.map((_, i) => i));
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState(() => Array(examQuestions.length).fill(null));
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);

  const total = examQuestions.length;
  const originalIdx = order[index];
  const current = examQuestions[originalIdx];
  const currentText = current[lang] || current.en;
  const selected = answers[originalIdx];

  const score = useMemo(
    () => examQuestions.reduce((sum, q, i) => sum + (answers[i] === (q[lang] || q.en).answer ? 1 : 0), 0),
    [answers, lang]
  );
  const passed = score >= PASS_THRESHOLD;

  const pastAttempts = (state.examAttempts || []).filter((a) => a.studentId === auth.studentId).sort((a, b) => b.date.localeCompare(a.date));

  const finish = () => {
    const finalScore = examQuestions.reduce((sum, q, i) => sum + (answers[i] === (q[lang] || q.en).answer ? 1 : 0), 0);
    logExamAttempt(auth.studentId, finalScore, total, finalScore >= PASS_THRESHOLD);
    setPhase('results');
  };

  const goNext = () => {
    if (index >= total - 1) finish();
    else setIndex((i) => i + 1);
  };

  const startQuiz = (selectedMode) => {
    setMode(selectedMode);
    setOrder(selectedMode === 'exam' ? shuffle(examQuestions.map((_, i) => i)) : examQuestions.map((_, i) => i));
    setAnswers(Array(total).fill(null));
    setIndex(0);
    setTimeLeft(QUESTION_TIME);
    setPhase('active');
  };

  const selectOption = (optionIndex) => {
    setAnswers((prev) => prev.map((a, i) => (i === originalIdx ? optionIndex : a)));
    if (mode === 'exam') {
      window.setTimeout(() => goNext(), 220);
    }
  };

  // reset the per-question countdown whenever the question changes, in exam mode
  useEffect(() => {
    if (mode !== 'exam' || phase !== 'active') return;
    setTimeLeft(QUESTION_TIME);
  }, [index, mode, phase]);

  // countdown ticker for exam mode; auto-advances when it hits zero
  useEffect(() => {
    if (mode !== 'exam' || phase !== 'active') return undefined;
    if (timeLeft <= 0) {
      goNext();
      return undefined;
    }
    const id = window.setTimeout(() => setTimeLeft((v) => v - 1), 1000);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, mode, phase]);

  if (phase === 'intro') {
    return (
      <>
        <PageHeader title={t('examQuiz.title')} subtitle={t('examQuiz.subtitle')} />
        <div className="flex-1 space-y-5 p-6 md:p-8">
          <Card className="max-w-2xl p-6">
            <p className="mb-4 text-sm text-muted-foreground">{t('examQuiz.choosePrompt')}</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col justify-between rounded-lg border p-4">
                <div>
                  <h3 className="font-display text-base font-semibold">{t('examQuiz.practiceMode')}</h3>
                  <p className="mt-1.5 text-xs text-muted-foreground">{t('examQuiz.practiceModeDesc')}</p>
                </div>
                <Button variant="outline" className="mt-4" onClick={() => startQuiz('practice')}>{t('examQuiz.practiceMode')}</Button>
              </div>
              <div className="flex flex-col justify-between rounded-lg border border-accent bg-accent-soft/40 p-4">
                <div>
                  <h3 className="font-display text-base font-semibold">{t('examQuiz.examMode')}</h3>
                  <p className="mt-1.5 text-xs text-muted-foreground">{t('examQuiz.examModeDesc', { seconds: QUESTION_TIME })}</p>
                </div>
                <Button variant="accent" className="mt-4" onClick={() => startQuiz('exam')}>{t('examQuiz.examMode')}</Button>
              </div>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">{t('examQuiz.passThreshold', { threshold: PASS_THRESHOLD })} / {total}</p>
          </Card>

          {pastAttempts.length > 0 && (
            <Card>
              <CardHeader><CardTitle>{t('simulator.history')}</CardTitle></CardHeader>
              <CardContent className="flex flex-col gap-2 pt-0">
                {pastAttempts.map((a) => (
                  <div key={a.id} className="flex items-center justify-between rounded-md border px-3 py-2 text-sm">
                    <span className="text-muted-foreground">{a.date}</span>
                    <span className="font-semibold">{a.score}/{a.total}</span>
                    <Badge variant={a.passed ? 'success' : 'destructive'}>{a.passed ? t('examQuiz.passed') : t('examQuiz.failed')}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </>
    );
  }

  if (phase === 'active') {
    return (
      <>
        <PageHeader
          title={t('examQuiz.title')}
          subtitle={t('examQuiz.questionOf', { current: index + 1, total })}
          action={<Badge variant={mode === 'exam' ? 'accent' : 'neutral'}>{mode === 'exam' ? t('examQuiz.modeBadgeExam') : t('examQuiz.modeBadgePractice')}</Badge>}
        />
        <div className="flex-1 p-6 md:p-8">
          <Card className="mx-auto max-w-2xl p-6">
            <div className="mb-4 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
              <div className="h-full bg-primary transition-all" style={{ width: `${((index + 1) / total) * 100}%` }} />
            </div>

            {mode === 'exam' && (
              <div className="mb-4 flex items-center justify-center gap-2">
                <Clock className="h-4 w-4 text-accent" />
                <div className="h-1.5 w-40 overflow-hidden rounded-full bg-secondary">
                  <div
                    className={cn('h-full transition-all', timeLeft <= 8 ? 'bg-destructive' : 'bg-accent')}
                    style={{ width: `${(timeLeft / QUESTION_TIME) * 100}%` }}
                  />
                </div>
                <span className="font-mono text-xs text-muted-foreground">{timeLeft}s</span>
              </div>
            )}

            {current.sign && (
              <div className="mb-4 flex justify-center">
                <RoadSign type={current.sign.type} value={current.sign.value} size={92} />
              </div>
            )}

            <h3 className="mb-4 text-center font-display text-lg font-semibold leading-snug">{currentText.question}</h3>

            <div className="flex flex-col gap-2">
              {currentText.options.map((opt, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => selectOption(i)}
                  className={cn(
                    'rounded-md border px-4 py-2.5 text-start text-sm transition-colors',
                    selected === i ? 'border-primary bg-primary-soft font-semibold text-primary' : 'border-input hover:bg-secondary'
                  )}
                >
                  {opt}
                </button>
              ))}
            </div>

            <div className="mt-6 flex justify-between">
              {mode === 'practice' ? (
                <Button variant="outline" disabled={index === 0} onClick={() => setIndex((i) => i - 1)}>{t('examQuiz.previous')}</Button>
              ) : (
                <span className="text-xs text-muted-foreground">{t('examQuiz.noBackNote')}</span>
              )}
              {mode === 'practice' && (
                index === total - 1 ? (
                  <Button variant="accent" disabled={selected === null} onClick={finish}>{t('examQuiz.finish')}</Button>
                ) : (
                  <Button disabled={selected === null} onClick={() => setIndex((i) => i + 1)}>{t('examQuiz.next')}</Button>
                )
              )}
            </div>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader title={t('examQuiz.resultsTitle')} subtitle={t('examQuiz.title')} />
      <div className="flex-1 space-y-5 p-6 md:p-8">
        <Card className="mx-auto max-w-xl p-6 text-center">
          <Badge variant={passed ? 'success' : 'destructive'} className="mx-auto inline-flex">
            {passed ? t('examQuiz.passed') : t('examQuiz.failed')}
          </Badge>
          <div className="mt-3 font-display text-4xl font-semibold text-primary">{score}/{total}</div>
          <p className="mt-2 text-sm text-muted-foreground">{t('examQuiz.scoreLabel', { score, total })}</p>
          <p className="mt-1 text-xs text-muted-foreground">{t('examQuiz.passThreshold', { threshold: PASS_THRESHOLD })}</p>
          <div className="mt-4 flex justify-center gap-2">
            <Button variant="outline" onClick={() => setPhase('intro')}>{t('examQuiz.changeMode')}</Button>
            <Button onClick={() => startQuiz(mode)}>{t('examQuiz.retry')}</Button>
          </div>
        </Card>

        <Card className="mx-auto max-w-2xl">
          <CardHeader><CardTitle>{t('examQuiz.reviewTitle')}</CardTitle></CardHeader>
          <CardContent className="flex flex-col gap-4 pt-0">
            {examQuestions.map((q, i) => {
              const text = q[lang] || q.en;
              const yourAnswer = answers[i];
              const isCorrect = yourAnswer === text.answer;
              return (
                <div key={q.id} className="rounded-md border p-4">
                  <div className="mb-2 flex items-start gap-2">
                    {isCorrect ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" /> : <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />}
                    <p className="text-sm font-medium">{text.question}</p>
                  </div>
                  <div className="ms-6 space-y-1 text-xs">
                    <p className={cn(!isCorrect && 'text-destructive')}>
                      {t('examQuiz.yourAnswer')}: {yourAnswer !== null ? text.options[yourAnswer] : '—'}
                    </p>
                    {!isCorrect && <p className="text-success">{t('examQuiz.correctAnswer')}: {text.options[text.answer]}</p>}
                    <p className="mt-1.5 text-muted-foreground">{text.explanation}</p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default ExamQuiz;
