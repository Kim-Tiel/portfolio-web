import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { CircleCheckBig, Loader2 } from 'lucide-react'
import { useForm, useWatch } from 'react-hook-form'
import { z } from 'zod'
import { useMemoryLogQuery, useSubmitMemoryLogEntry } from '../api/memoryLog'
import { useCursorSpotlight } from '../hooks/useCursorSpotlight'
import { MemoryGraph } from './MemoryGraph'

const MAX_MESSAGE = 280
const schema = z.object({
  displayName: z.string().trim().max(60, 'Keep the name under 60 characters').optional(),
  message: z
    .string()
    .trim()
    .min(1, 'Write something first')
    .max(MAX_MESSAGE, `Keep it under ${MAX_MESSAGE} characters`),
  // Honeypot passthrough — the server decides what to do with it.
  nickname: z.string().optional(),
})

const fieldClasses =
  'mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-4 py-2.5 text-[var(--text)] outline-none transition-colors focus:border-[var(--accent)]'

function errorMessage(error) {
  if (!error) return null
  if (error.status === 429) {
    return "You're leaving traces faster than I can read them — try again in a bit."
  }
  if (error.status === 422) return error.message
  return "Couldn't save that — try again."
}

export function MemoryLog({ email }) {
  const { spotlightRef, handleMouseMove } = useCursorSpotlight()
  const { data: entries = [], isLoading, isError } = useMemoryLogQuery()
  const submit = useSubmitMemoryLogEntry()
  const [done, setDone] = useState(false)
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) })
  const message = useWatch({ control, name: 'message' })
  const remaining = MAX_MESSAGE - (message?.length ?? 0)

  async function onSubmit(values) {
    setDone(false)
    try {
      await submit.mutateAsync({
        display_name: values.displayName ?? '',
        message: values.message,
        nickname: values.nickname ?? '',
      })
      reset()
      setDone(true)
    } catch {
      // surfaced via submit.error below
    }
  }

  return (
    <section
      id="memory-log"
      onMouseMove={handleMouseMove}
      className="relative flex h-[100svh] flex-col overflow-hidden px-4 pt-20 pb-6"
    >
      <div
        ref={spotlightRef}
        aria-hidden
        data-testid="cursor-spotlight"
        className="pointer-events-none absolute top-1/2 left-1/2 z-20 mix-blend-screen h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--accent-from)]/20 opacity-0 blur-[110px] transition-[left,top,opacity] duration-500 ease-out"
      />

      <div className="relative z-10 mx-auto flex min-h-0 w-full max-w-6xl flex-1 flex-col">
        <div className="shrink-0">
          <div className="flex items-center gap-3 text-sm tracking-widest text-[var(--text-muted)] uppercase">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
            <span className="font-mono text-[var(--accent)]">06</span>
            <span>/ Memory Log</span>
          </div>
          <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-1">
            <h2 className="mt-1 text-3xl font-bold text-[var(--text)] sm:text-4xl">
              Leave a{' '}
              <span className="bg-gradient-to-r from-[var(--accent-from)] to-[var(--accent-to)] bg-clip-text text-transparent italic">
                trace
              </span>
              .
            </h2>
            <p className="pb-1 text-sm text-[var(--text-muted)]">A note, a thought, a question. It stays.</p>
          </div>
        </div>

        <div className="relative mt-2 min-h-0 flex-1 overflow-hidden">
          {isLoading && <div className="grid h-full place-items-center text-[var(--text-muted)]">Loading the log…</div>}
          {isError && (
            <div className="grid h-full place-items-center text-[var(--text-muted)]">Couldn&apos;t load the log.</div>
          )}
          {!isLoading && !isError && entries.length === 0 && (
            <div className="grid h-full place-items-center text-[var(--text-muted)]">No traces yet — be the first.</div>
          )}
          {entries.length > 0 && <MemoryGraph entries={entries} />}

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="absolute bottom-0 left-0 z-20 w-full max-w-md space-y-2 rounded-xl bg-[var(--bg)]/70 p-4 [backdrop-filter:blur(8px)]"
          >
            <input
              type="text"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="absolute -left-[9999px] h-px w-px opacity-0"
              {...register('nickname')}
            />

            <div>
              <label htmlFor="ml-name" className="text-[11px] tracking-widest text-[var(--text-muted)] uppercase">
                Your name (optional)
              </label>
              <input id="ml-name" type="text" className={fieldClasses} {...register('displayName')} />
              {errors.displayName && <p className="mt-1 text-sm text-red-500">{errors.displayName.message}</p>}
            </div>

            <div>
              <label htmlFor="ml-message" className="text-[11px] tracking-widest text-[var(--text-muted)] uppercase">
                Leave a note
              </label>
              <textarea
                id="ml-message"
                rows={2}
                maxLength={MAX_MESSAGE}
                className={`${fieldClasses} resize-none`}
                {...register('message')}
              />
              <div className="mt-1 flex items-center justify-between">
                {errors.message ? <p className="text-sm text-red-500">{errors.message.message}</p> : <span />}
                <span className="font-mono text-xs text-[var(--text-muted)]">{remaining} left</span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                {email && (
                  <p className="text-[11px] text-[var(--text-muted)]">
                    Entries appear publicly. Removal requests:{' '}
                    <a className="underline" href={`mailto:${email}`}>
                      {email}
                    </a>
                  </p>
                )}
                {done && (
                  <span className="inline-flex items-center gap-1.5 text-sm text-[var(--accent)]">
                    <CircleCheckBig size={16} /> Trace left.
                  </span>
                )}
                {submit.isError && <p className="text-sm text-red-500">{errorMessage(submit.error)}</p>}
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex shrink-0 items-center gap-2 rounded-full bg-gradient-to-r from-[var(--accent-from)] to-[var(--accent-to)] px-6 py-2.5 text-sm font-medium text-white disabled:opacity-60"
              >
                {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : null}
                Log entry →
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}
