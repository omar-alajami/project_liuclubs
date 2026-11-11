import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserGraduate, faBullhorn, faUsers} from '@fortawesome/free-solid-svg-icons';

function About() {


  const AUDIENCES = [
    {
      icon: faUserGraduate,
      title: 'For Students',
      text: 'Find the clubs that match your interests, join with one click, and keep up with what they are planning.',
    },
    {
      icon: faBullhorn,
      title: 'For Club Leaders',
      text: 'Give your club a home where students can find it, learn what it does, and become members.',
    },
    {
      icon: faUsers,
      title: 'For The Campus',
      text: 'One directory for every club at LIU Bekaa, so the whole community can see what is happening.',
    },
  ]

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-primary">
        <div className="mx-auto max-w-6xl px-4 pb-16 pt-14 md:pb-20 md:pt-20">
          <h1 className="max-w-2xl font-display text-5xl leading-[1.05] tracking-tight text-white md:text-6xl">
            About LIU Clubs – Bekaa
          </h1>
        </div>
        <div className="h-1 w-full bg-accent" />
      </section>

      {/* Mission */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid grid-cols-1 gap-6">
          <h2 className="font-display text-3xl text-ink md:text-4xl">Our Mission</h2>
          <div>
            <p className="text-base leading-relaxed text-ink">
              Clubs are where students meet people who care about the same things they do. LIU Clubs
              puts all of them in one place, so finding a club, joining it, and showing up to its events
              takes minutes instead of asking around.
            </p>
            <p className="mt-4 text-base leading-relaxed text-muted">
              Join a club and contribute to the community today.
            </p>
          </div>
        </div>
      </section>

      {/* Who it's for */}
      <section className="border-t border-primary-soft bg-primary-soft/30">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-center font-display text-2xl text-ink md:text-3xl">Who It's For</h2>

          <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-3">
            {AUDIENCES.map((item) => (
              <div key={item.title} className="flex flex-col items-center text-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/15 text-accent">
                  <FontAwesomeIcon icon={item.icon} className="text-lg" />
                </span>
                <h3 className="mt-4 text-sm font-semibold text-ink">{item.title}</h3>
                <p className="mt-2 max-w-xs text-sm text-muted">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Contact / get listed banner */}
      <section className="bg-white">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-4 py-14 md:flex-row md:items-center">
          <div>
            <h2 className="font-display text-2xl text-ink md:text-3xl">
              Questions, or want your club listed?
            </h2>

            <p className="mt-2 max-w-md text-sm text-ink/70">
              Get in touch using the contact details at the bottom of the page.
            </p>
          </div>
        </div>
      </section>

    </div>
  )
}

export default About;