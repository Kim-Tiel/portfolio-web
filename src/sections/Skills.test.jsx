import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Skills } from './Skills'
import { mockSkills } from '../test/mocks/handlers'
describe('Skills', () => {
  it('shows the first category by default with its skills', () => {
    render(<Skills skills={mockSkills} />)
    const frontendSkill = mockSkills.find((skill) => skill.category === 'frontend')
    expect(screen.getByText(frontendSkill.name)).toBeInTheDocument()
    expect(screen.getByText(frontendSkill.proficiency)).toBeInTheDocument()
  })
  it('switches skills when a different category tab is clicked', () => {
    render(<Skills skills={mockSkills} />)
    const backendSkill = mockSkills.find((skill) => skill.category === 'backend')
    const frontendSkill = mockSkills.find((skill) => skill.category === 'frontend')
    fireEvent.click(
      screen.getByRole('button', {
        name: 'Backend',
      }),
    )
    expect(screen.getByText(backendSkill.name)).toBeInTheDocument()
    expect(screen.queryByText(frontendSkill.name)).not.toBeInTheDocument()
  })
  it('does not render tabs when only one category is present', () => {
    render(<Skills skills={[mockSkills[0]]} />)
    expect(
      screen.queryByRole('button', {
        name: 'Frontend',
      }),
    ).not.toBeInTheDocument()
    expect(screen.getByText(mockSkills[0].name)).toBeInTheDocument()
  })
  it('shows an empty state when there are no skills', () => {
    render(<Skills skills={[]} />)
    expect(screen.getByText('No skills listed yet.')).toBeInTheDocument()
  })
  it('selects a category once skills arrive after an initial empty (loading) render', () => {
    const { rerender } = render(<Skills skills={[]} />)
    expect(screen.getByText('No skills listed yet.')).toBeInTheDocument()
    rerender(<Skills skills={mockSkills} />)
    const frontendSkill = mockSkills.find((skill) => skill.category === 'frontend')
    expect(screen.getByText(frontendSkill.name)).toBeInTheDocument()
    expect(screen.queryByText('No skills listed yet.')).not.toBeInTheDocument()
  })
  it('eases the cursor spotlight toward the pointer and reveals it', () => {
    render(<Skills skills={mockSkills} />)
    const section = document.getElementById('skills')
    const spotlight = screen.getByTestId('cursor-spotlight')
    fireEvent.mouseMove(section, {
      clientX: 100,
      clientY: 60,
    })
    expect(spotlight.style.left).toBe('100px')
    expect(spotlight.style.opacity).toBe('1')
  })
})
