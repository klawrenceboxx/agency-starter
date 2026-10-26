export type Milestone = {
  label: string
  title: string
  bullets: string[]
  image?: { src: string; alt: string; position?: string; fit?: 'cover' | 'contain' }
  placeholder?: string
}

// Replace a placeholder with an approved image here; the carousel layout stays the same.
export const milestones: Milestone[] = [
  {
    label: '2001', title: 'Scarborough Roots',
    bullets: ['Born and raised in Scarborough, Toronto', 'Grew up around many cultures and communities', 'Early love of sports, learning and problem-solving'],
    image: { src: '/about/childhood.webp', alt: 'A childhood photograph of Kaleel', position: 'center 40%', fit: 'contain' },
  },
  {
    label: 'School years', title: 'French Immersion & Agincourt',
    bullets: ['French immersion program', 'Agincourt Collegiate Institute', 'Strong communication in English and French'],
    placeholder: 'School-years photograph',
  },
  {
    label: 'Sports & fitness', title: 'Built Through Discipline',
    bullets: ['Played sports throughout childhood', 'Lasting passion for fitness', 'Half-marathon and marathon runner', 'Learned consistency, preparation and discipline'],
    image: { src: '/about/running.webp', alt: 'Kaleel running in a Toronto road race', position: 'center 28%' },
  },
  {
    label: '2019–2025', title: 'Mechanical Engineering',
    bullets: ['Bachelor of Engineering, Mechanical, Toronto Metropolitan University', 'Dean’s List in first year', 'Graduated October 2025', 'Built a systematic approach to problem-solving'],
    image: { src: '/about/graduation.webp', alt: 'Kaleel wearing his graduation gown', position: 'center 12%', fit: 'contain' },
  },
  {
    label: '2022–2023', title: 'Engineering at Enbridge',
    bullets: ['Regional Engineer at Enbridge', 'Coordinated 40+ station projects', 'Helped save about $290,000 in project costs', 'Built automations to cut repetitive admin work', 'Coordinated technical projects across teams'],
    image: { src: '/about/engineering.webp', alt: 'Kaleel and two colleagues in safety equipment at an engineering field site', position: 'center 40%' },
  },
  {
    label: '2024–2025', title: 'Design, Code & Psychology',
    bullets: ['Taught myself programming alongside university', 'Adobe design tools and website development', 'Fascinated by human behaviour and decision-making', 'Combined engineering, design and psychology', 'Started building websites, software and automations'],
    image: { src: '/about/workspace.webp', alt: 'Kaleel smiling at his laptop in a purple-lit workspace', position: 'center 30%' },
  },
  {
    label: 'Today', title: 'Building BOXX Automations',
    bullets: ['Founded BOXX Automations to improve conversions', 'Websites designed around customer behaviour', 'Automated email and SMS follow-up', 'Engineering, design and psychology, applied to business', 'Helping businesses turn more leads into customers'],
    image: { src: '/about/networking.webp', alt: 'Kaleel with another attendee at a professional networking event', position: 'center 35%' },
  },
]
