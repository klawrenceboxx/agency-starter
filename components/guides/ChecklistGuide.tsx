'use client'

import { useEffect, useMemo, useState } from 'react'
import styles from '@/app/guides/guides.module.css'
import type { GuideChecklist } from '@/lib/guides'

// Interactive parts of a checklist guide (guide 005): the 10-point Leak Report scorer and the
// 11-phase framework with tick boxes. Progress is saved in this browser only.
const LEAK_KEY = 'boxx-guide-005-leak'
const ITEMS_KEY = 'boxx-guide-005-items'

function load<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}
function save(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* storage blocked: progress just won't persist */
  }
}

export function LeakScorer({ data }: { data: GuideChecklist }) {
  const [scores, setScores] = useState<(number | null)[]>(() => data.leak.map(() => null))
  useEffect(() => {
    const saved = load<(number | null)[]>(LEAK_KEY, [])
    if (saved.length === data.leak.length) setScores(saved)
  }, [data.leak.length])

  const set = (i: number, v: number) => {
    const next = scores.map((s, j) => (j === i ? (s === v ? null : v) : s))
    setScores(next)
    save(LEAK_KEY, next)
  }
  const reset = () => {
    const next = data.leak.map(() => null)
    setScores(next)
    save(LEAK_KEY, next)
  }

  const answered = scores.filter((s) => s !== null).length
  const total = scores.reduce<number>((a, s) => a + (s ?? 0), 0)
  const done = answered === data.leak.length
  const band = data.bands.find((b) => total >= b.min) || data.bands[data.bands.length - 1]
  const lowest = done
    ? scores
        .map((s, i) => ({ s: s as number, i }))
        .filter((x) => x.s < 2)
        .sort((a, b) => a.s - b.s || a.i - b.i)
        .slice(0, 3)
    : []

  return (
    <div className={styles.leak}>
      <ol className={styles.leakList}>
        {data.leak.map((c, i) => (
          <li key={c.title} className={styles.leakRow}>
            <span className={styles.leakNum}>{String(i + 1).padStart(2, '0')}</span>
            <div className={styles.leakText}>
              <h3 className={styles.h3}>{c.title}</h3>
              <p className={styles.muted}>{c.good}</p>
            </div>
            <div className={styles.leakBtns} role="group" aria-label={`Score for ${c.title}`}>
              {[0, 1, 2].map((v) => (
                <button
                  key={v}
                  type="button"
                  aria-pressed={scores[i] === v}
                  className={`${styles.scoreBtn} ${scores[i] === v ? styles.scoreOn : ''}`}
                  onClick={() => set(i, v)}
                >
                  {v}
                </button>
              ))}
            </div>
          </li>
        ))}
      </ol>
      <p className={styles.leakKey}>0 = missing or broken · 1 = partly working · 2 = working well</p>

      <div className={styles.result} aria-live="polite">
        <div className={styles.resultScore}>
          <span>{total}</span>
          <small>/ {data.leak.length * 2}</small>
        </div>
        <div>
          {done ? (
            <>
              <p className={styles.resultBand}>{band.label}</p>
              <p className={styles.muted}>{band.text}</p>
              {lowest.length > 0 && (
                <p className={styles.resultFix}>
                  Fix first: {lowest.map((x) => data.leak[x.i].title).join(', ')}.
                </p>
              )}
            </>
          ) : (
            <>
              <p className={styles.resultBand}>
                {answered} of {data.leak.length} scored
              </p>
              <p className={styles.muted}>Score all ten to see where your page stands.</p>
            </>
          )}
          {answered > 0 && (
            <button type="button" className={styles.linkBtn} onClick={reset}>
              Start over
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export function FrameworkChecklist({ data }: { data: GuideChecklist }) {
  const [checked, setChecked] = useState<Record<string, boolean>>({})
  useEffect(() => setChecked(load<Record<string, boolean>>(ITEMS_KEY, {})), [])

  const toggle = (id: string) => {
    const next = { ...checked, [id]: !checked[id] }
    if (!next[id]) delete next[id]
    setChecked(next)
    save(ITEMS_KEY, next)
  }
  const reset = () => {
    setChecked({})
    save(ITEMS_KEY, {})
  }

  const totalItems = useMemo(() => data.phases.reduce((a, p) => a + p.items.length, 0), [data.phases])
  const doneItems = Object.keys(checked).length
  const pct = Math.round((doneItems / totalItems) * 100)

  return (
    <div>
      <div className={styles.progressRow}>
        <div className={styles.progressBar} aria-hidden="true">
          <span style={{ width: `${pct}%` }} />
        </div>
        <span className={styles.progressText}>
          {doneItems} / {totalItems} done
        </span>
        {doneItems > 0 && (
          <button type="button" className={styles.linkBtn} onClick={reset}>
            Clear ticks
          </button>
        )}
      </div>

      <div className={styles.phases}>
        {data.phases.map((p) => {
          const n = p.items.filter((it) => checked[it.id]).length
          return (
            <details key={p.number} className={styles.phaseCard} open={p.number === 0}>
              <summary className={styles.phaseSum}>
                <span className={styles.num}>{String(p.number).padStart(2, '0')}</span>
                <span className={styles.phaseTitle}>
                  <span className={styles.phase}>
                    Phase {p.number} · {p.items.length} items · {p.deliverable}
                  </span>
                  <span className={styles.h3}>{p.name}</span>
                </span>
                <span className={`${styles.phaseCount} ${n === p.items.length ? styles.phaseDone : ''}`}>
                  {n}/{p.items.length}
                </span>
              </summary>
              <ul className={styles.items}>
                {p.items.map((it) => (
                  <li key={it.id} className={`${styles.item} ${checked[it.id] ? styles.itemDone : ''}`}>
                    <label className={styles.itemHead}>
                      <input type="checkbox" checked={!!checked[it.id]} onChange={() => toggle(it.id)} />
                      <span className={styles.itemId}>{it.id}</span>
                      <span className={styles.itemTitle}>{it.title}</span>
                    </label>
                    {it.desc && <p className={styles.itemDesc}>{it.desc}</p>}
                    <dl className={styles.ab}>
                      <div>
                        <dt>Audit</dt>
                        <dd>{it.audit}</dd>
                      </div>
                      <div>
                        <dt>Build</dt>
                        <dd>{it.build}</dd>
                      </div>
                    </dl>
                  </li>
                ))}
              </ul>
            </details>
          )
        })}
      </div>
    </div>
  )
}
