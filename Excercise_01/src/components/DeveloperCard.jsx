import styles from './DeveloperCard.module.css'

export function DeveloperCard({
  fullName = 'Tran Vinh Khiem',
  role = 'Senior Systems Architect • UIT S3T',
  avatarUrl = 'https://images.unsplash.com/photo-1534528741775-53994a69eda?w=240',
  metrics = {
    commits: 512,
    vdomNodes: 0,
    a11yScore: 100
  },
  skills = [
    {
      id: 'sk-1',
      name: 'React 19 Fiber',
      tier: 'Core'
    }
  ]
} = {}) {
  return (
    <article className={styles.card} aria-label={`${fullName} profile`}>
      <img src={avatarUrl} alt={fullName} width="64" height="64" />
      <p>{fullName} — {role}</p>
      <p>
        Commits: {metrics.commits} |
        VDOM Nodes: {metrics.vdomNodes} |
        A11y Score: {metrics.a11yScore}
      </p>
      <p>Skills: {skills.map(skill => skill.name).join(', ')}</p>
    </article>
  )
}