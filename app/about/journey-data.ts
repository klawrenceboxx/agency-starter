export type Milestone = {
  label: string
  title: string
  bullets: string[]
  image?: { src: string; alt: string; position?: string }
  placeholder?: string
}

// Replace a placeholder with an approved image here; the carousel layout stays the same.
export const milestones: Milestone[] = [
  {
    label: '2001', title: 'Scarborough Roots',
    bullets: ['I was born and raised in Scarborough, Toronto.', 'I grew up surrounded by different cultures and communities.', 'I developed an early interest in sports, learning, and problem-solving.'],
    image: { src: '/about/childhood.webp', alt: 'A childhood photograph of Kaleel', position: 'center 40%' },
  },
  {
    label: 'School years', title: 'French Immersion & Agincourt',
    bullets: ['I studied in the French immersion program.', 'I attended Agincourt Collegiate Institute.', 'I developed strong communication skills in English and French.'],
    placeholder: 'School-years photograph',
  },
  {
    label: 'Sports & fitness', title: 'Built Through Discipline',
    bullets: ['I played sports throughout childhood.', 'I developed a lasting passion for fitness.', 'I progressed into half-marathon and marathon running.', 'I learned the value of consistency, preparation, and discipline.'],
    placeholder: 'Toronto running photograph',
  },
  {
    label: '2019–2025', title: 'Mechanical Engineering',
    bullets: ['I earned a Bachelor of Engineering in Mechanical Engineering at Toronto Metropolitan University.', 'I earned Dean’s List recognition in first year.', 'I graduated in October 2025.', 'I developed a systematic approach to problem-solving.'],
    image: { src: '/about/graduation.webp', alt: 'Kaleel wearing his graduation gown', position: 'center 12%' },
  },
  {
    label: '2022–2023', title: 'Engineering at Enbridge',
    bullets: ['I worked as a Regional Engineer at Enbridge.', 'I coordinated more than 40 station projects.', 'I contributed to approximately $290,000 in project cost savings.', 'I built automations to reduce repetitive administrative work.', 'I gained experience coordinating technical projects across teams.'],
    image: { src: '/about/engineering.webp', alt: 'Kaleel and two colleagues in safety equipment at an engineering field site', position: 'center 40%' },
  },
  {
    label: '2024–2025', title: 'Design, Code & Psychology',
    bullets: ['I studied programming independently alongside university coursework.', 'I developed skills in Adobe design tools and website development.', 'I became fascinated by human behaviour and decision-making.', 'I combined engineering, design, and psychology to solve digital problems.', 'I began building websites, software, and workflow automations.'],
    placeholder: 'Development or workspace photograph',
  },
  {
    label: 'Today', title: 'Building BOXX Automations',
    bullets: ['I founded BOXX Automations to help businesses improve conversions.', 'I build websites designed around customer behaviour.', 'I develop automated email and SMS follow-up systems.', 'I combine engineering, design, and psychology to solve business problems.', 'I focus on helping businesses turn more opportunities into customers.'],
    image: { src: '/about/networking.webp', alt: 'Kaleel with another attendee at a professional networking event', position: 'center 35%' },
  },
]
