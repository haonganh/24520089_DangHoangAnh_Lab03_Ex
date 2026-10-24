
import { Fragment, useId } from 'react'
import { SkillBadge } from './SkillBadge'
import styles from './DeveloperCard.module.css'

export function DeveloperCard({
  fullName = 'Tran Vinh Khiem',
  role = 'Senior Systems Architect • UIT S3T',
  avatarUrl = '/avatar.svg',
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
    const headingId = useId()
  return (
    <article
      className={styles.card}
  aria-labelledby={headingId}
    >
      <header className={styles.header}>
        <img
          src={avatarUrl}
          alt={fullName}
          width="64"
          height="64"
        />

        <h2 id={headingId}>{fullName}</h2>
        <p>{role}</p>
      </header>

      <dl className={styles.metrics}>
        {Object.entries(metrics).map(([k, v]) => (
          <Fragment key={k}>
            <dt>{k}</dt>
            <dd>{v}</dd>
          </Fragment>
        ))}
      </dl>

      <ul
        className={styles.skills}
        aria-label="Engineered Skills"
      >
        {skills.map((s) => (
          <SkillBadge
            key={s.id}
            name={s.name}
            tier={s.tier}
          />
        ))}
      </ul>
    </article>
  )
}
