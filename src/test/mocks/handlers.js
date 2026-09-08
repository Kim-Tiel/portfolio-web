import { http, HttpResponse } from 'msw'
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
export const mockProfile = {
  name: 'Kim Anderson Tiel',
  first_name: 'Kim',
  middle_name: 'Anderson',
  last_name: 'Tiel',
  title: 'Full-Stack Developer',
  location: 'Remote',
  timezone: 'Asia/Manila',
  years_career_experience: 5,
  completed_projects: 12,
  employer_satisfaction: 98.5,
  available_for: ['Full-time', 'Contract'],
  avatar_url: null,
  hero_tagline: 'Building reliable systems end to end.',
  bio: 'I love the whole journey — from spinning up an API to polishing the last pixel.',
  email: 'kim@example.com',
  linkedin_url: 'https://linkedin.com/in/kimtiel',
  github_url: 'https://github.com/Kim-Tiel',
  resume_url: 'https://example.com/resume.pdf',
}
export const mockSkills = [
  {
    id: '1',
    name: 'React',
    category: 'frontend',
    proficiency: 'proficient',
    icon_slug: 'react',
  },
  {
    id: '2',
    name: 'Ruby on Rails',
    category: 'backend',
    proficiency: 'expert',
    icon_slug: 'rails',
  },
]
export const mockProjects = [
  {
    id: '1',
    slug: 'sample-project',
    title: 'Sample Project',
    client_type: null,
    location: null,
    summary: 'A sample project summary.',
    description: null,
    status: 'live',
    site_url: null,
    repo_url: null,
    image_url: null,
    is_featured: true,
    started_on: null,
    completed_on: null,
    skills: [mockSkills[0]],
    metrics: [
      {
        label: 'Users',
        value: '10k+',
      },
    ],
  },
]
export const mockExperiences = [
  {
    id: '1',
    company: 'Example Company',
    role: 'Full-Stack Developer',
    location: 'Remote',
    is_remote: true,
    start_date: '2023-01-01',
    end_date: null,
    commit_hash: null,
    highlights: ['Shipped a core feature.'],
    skills: [mockSkills[1]],
  },
]
export const mockEducation = [
  {
    id: '1',
    institution: 'Example University',
    degree: 'B.S. Computer Science',
    field: null,
    location: null,
    start_date: '2018-01-01',
    end_date: '2022-01-01',
    is_graduated: true,
    milestones: [],
  },
]
export const handlers = [
  http.get(`${API_BASE_URL}/api/v1/profile`, () => HttpResponse.json(mockProfile)),
  http.get(`${API_BASE_URL}/api/v1/skills`, () => HttpResponse.json(mockSkills)),
  http.get(`${API_BASE_URL}/api/v1/projects`, () => HttpResponse.json(mockProjects)),
  http.get(`${API_BASE_URL}/api/v1/projects/:slug`, ({ params }) => {
    const project = mockProjects.find((p) => p.slug === params.slug)
    return project
      ? HttpResponse.json(project)
      : new HttpResponse(null, {
          status: 404,
        })
  }),
  http.get(`${API_BASE_URL}/api/v1/experiences`, () => HttpResponse.json(mockExperiences)),
  http.get(`${API_BASE_URL}/api/v1/education`, () => HttpResponse.json(mockEducation)),
  http.post(`${API_BASE_URL}/api/v1/contact_messages`, () =>
    HttpResponse.json(
      {
        status: 'sent',
      },
      {
        status: 201,
      },
    ),
  ),
]
