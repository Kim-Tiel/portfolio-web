import { Nav } from '../layout/Nav'
import { Footer } from '../layout/Footer'
import { Intro } from '../sections/Intro'
import { About } from '../sections/About'
import { Skills } from '../sections/Skills'
import { Projects } from '../sections/Projects'
import { Experience } from '../sections/Experience'
import { LiveDemo } from '../sections/LiveDemo'
import { MemoryLog } from '../sections/MemoryLog'
import { Contact } from '../sections/Contact'
import { useProfileQuery } from '../api/profile'
import { useEducationQuery } from '../api/education'
import { useSkillsQuery } from '../api/skills'
import { useProjectsQuery } from '../api/projects'
import { useExperiencesQuery } from '../api/experiences'
export function Home() {
  const { data: profile, isLoading, isError } = useProfileQuery()
  const { data: education = [] } = useEducationQuery()
  const { data: skills = [] } = useSkillsQuery()
  const { data: projects = [] } = useProjectsQuery()
  const { data: experiences = [] } = useExperiencesQuery()
  return (
    <>
      <Nav />
      <main>
        {isLoading && <p className="flex min-h-screen items-center justify-center px-4">Loading…</p>}
        {isError && <p className="flex min-h-screen items-center justify-center px-4">Could not load profile.</p>}
        {profile && (
          <>
            <Intro profile={profile} />
            <About profile={profile} education={education} />
          </>
        )}

        <Skills skills={skills} />
        <Projects projects={projects} />
        <Experience experiences={experiences} profile={profile} />
        <LiveDemo profile={profile} skills={skills} projects={projects} />
        <MemoryLog email={profile?.email} />
        <Contact availableFor={profile?.available_for ?? []} profile={profile} />
      </main>
      <Footer profile={profile} projects={projects} skills={skills} />
    </>
  )
}
