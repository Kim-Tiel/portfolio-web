import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { CircleCheckBig, Loader2, Mail, MapPin } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useSubmitContactMessage } from '../api/contact'
import { useCursorSpotlight } from '../hooks/useCursorSpotlight'
const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.email('Enter a valid email address'),
  subject: z.string().optional(),
  message: z.string().min(1, 'Message is required'),
})
const inputClasses =
  'mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-4 py-2.5 text-[var(--text)] outline-none transition-colors focus:border-[var(--accent)]'

// The info cards reveal one after another rather than all at once.
//
// This gets its OWN `whileInView` trigger below (rather than inheriting
// "show" from an ancestor) because `infoCards` is built from `profile`,
// which loads asynchronously — see the comment on Projects.jsx's
// GRID_VARIANTS for why a card list that can still be empty at the
// moment an ancestor's viewport trigger fires needs its own observer
// instead.
const CARD_LIST_VARIANTS = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}
const CARD_ITEM_VARIANTS = {
  hidden: {
    opacity: 0,
    y: 16,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    },
  },
}
export function Contact({ availableFor, profile }) {
  const { spotlightRef, handleMouseMove } = useCursorSpotlight()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(contactSchema),
  })
  const submitContactMessage = useSubmitContactMessage()
  async function onSubmit(values) {
    try {
      await submitContactMessage.mutateAsync({
        name: values.name,
        email: values.email,
        subject: values.subject,
        body: values.message,
      })
      reset()
    } catch {
      // surfaced inline via submitContactMessage.isError below
    }
  }
  const infoCards = []
  if (profile?.email) {
    infoCards.push({
      icon: Mail,
      label: 'Email',
      value: (
        <a href={`mailto:${profile.email}`} className="transition-colors hover:text-[var(--accent)]">
          {profile.email}
        </a>
      ),
    })
  }
  if (profile?.location) {
    infoCards.push({
      icon: MapPin,
      label: 'Location',
      value: profile.location,
    })
  }
  if (availableFor.length > 0) {
    infoCards.push({
      icon: CircleCheckBig,
      label: 'Availability',
      value: (
        <span className="inline-flex items-center gap-2">
          <span aria-hidden className="h-2 w-2 rounded-full bg-[var(--accent)]" />
          Available for {availableFor.join(' & ')}
        </span>
      ),
    })
  }
  return (
    <section id="contact" onMouseMove={handleMouseMove} className="relative overflow-hidden px-4 py-24">
      <div
        ref={spotlightRef}
        aria-hidden
        data-testid="cursor-spotlight"
        className="pointer-events-none absolute top-1/2 left-1/2 -z-10 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--accent-from)]/20 opacity-0 blur-[110px] transition-[left,top,opacity] duration-500 ease-out"
      />

      <motion.div
        initial={{
          opacity: 0,
          y: 40,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        viewport={{
          once: true,
          amount: 0.2,
        }}
        transition={{
          duration: 0.6,
          ease: 'easeOut',
        }}
        className="relative z-10 mx-auto max-w-6xl text-center"
      >
        <div className="flex items-center justify-center gap-3 text-sm tracking-widest text-[var(--text-muted)] uppercase">
          <span className="font-mono text-[var(--accent)]">05</span>
          <span className="h-px w-8 bg-gradient-to-r from-[var(--accent-from)] to-[var(--accent-to)]" />
          <span>Get in Touch</span>
        </div>

        <h2 className="mt-2 text-4xl font-bold text-[var(--text)] sm:text-5xl">
          Get In{' '}
          <span className="bg-gradient-to-r from-[var(--accent-from)] to-[var(--accent-to)] bg-clip-text text-transparent italic">
            Touch
          </span>
        </h2>
        <p className="mt-2 text-[var(--text-muted)]">Let's work together on your next project</p>

        <div className="mt-10 grid grid-cols-1 gap-6 text-left lg:grid-cols-[1fr_1.5fr]">
          <motion.div
            variants={CARD_LIST_VARIANTS}
            initial="hidden"
            whileInView="show"
            viewport={{
              once: true,
              amount: 0.2,
            }}
            className="space-y-4"
          >
            {infoCards.map((card, index) => (
              <motion.div
                key={card.label}
                variants={CARD_ITEM_VARIANTS}
                className="relative rounded-2xl border border-[var(--border)] bg-[var(--bg-alt)] p-6 transition-all duration-300 hover:border-[var(--accent)]/60 hover:shadow-[0_0_30px_-8px_var(--accent)]"
              >
                <span className="absolute top-4 right-4 font-mono text-xs text-[var(--text-muted)]">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--accent)]/15 text-[var(--accent)]">
                  <card.icon size={20} />
                </div>
                <p className="mt-4 text-xs tracking-widest text-[var(--text-muted)] uppercase">{card.label}</p>
                <div className="mt-1 font-semibold text-[var(--text)]">{card.value}</div>
              </motion.div>
            ))}
          </motion.div>

          <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-alt)] p-6 sm:p-8">
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="contact-name" className="text-sm text-[var(--text-muted)]">
                    Name
                  </label>
                  <input id="contact-name" type="text" {...register('name')} className={inputClasses} />
                  {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
                </div>

                <div>
                  <label htmlFor="contact-email" className="text-sm text-[var(--text-muted)]">
                    Email
                  </label>
                  <input id="contact-email" type="email" {...register('email')} className={inputClasses} />
                  {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="contact-subject" className="text-sm text-[var(--text-muted)]">
                  Subject
                </label>
                <input id="contact-subject" type="text" {...register('subject')} className={inputClasses} />
              </div>

              <div>
                <label htmlFor="contact-message" className="text-sm text-[var(--text-muted)]">
                  Message
                </label>
                <textarea id="contact-message" rows={5} {...register('message')} className={inputClasses} />
                {errors.message && <p className="mt-1 text-sm text-red-500">{errors.message.message}</p>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex w-full scale-100 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[var(--accent-from)] to-[var(--accent-to)] px-6 py-3 text-sm font-medium text-white transition-all duration-150 ease-out active:scale-[0.98] disabled:opacity-60"
              >
                {isSubmitting ? 'Sending…' : 'Send Message'}
                {isSubmitting ? <Loader2 aria-hidden size={16} className="animate-spin" /> : <Mail size={16} />}
              </button>

              {submitContactMessage.isSuccess && (
                <p className="text-sm text-green-500">Thanks! Your message has been sent.</p>
              )}
              {submitContactMessage.isError && (
                <p className="text-sm text-red-500">Something went wrong. Please try again.</p>
              )}
            </form>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
