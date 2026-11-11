import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { faInstagram, faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";

function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-12 bg-primary text-white">
      <div className="h-1 w-full bg-accent" />

      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 sm:flex-row sm:justify-between">
        <div className="max-w-sm">
          <span className="text-lg font-bold leading-tight">LIU Clubs – Bekaa</span>
          <p className="mt-2 text-sm text-white/70">
            A directory of all clubs at LIU Bekaa. Join a club and contribute to the community today.
          </p>
        </div>

        <div className="flex flex-wrap gap-8 sm:gap-12">
          <div>
            <h4 className="text-sm font-semibold text-white/90">Contact</h4>
            <ul className="mt-3 flex flex-col gap-2 text-sm">
              <li>
                <a href="tel:+96176353348" className="flex items-center gap-2 text-white/70 transition-colors hover:text-accent">
                  <FontAwesomeIcon icon={faPhone} className="h-4 w-4" />
                  +961 76 353 348
                </a>
              </li>
              <li>
                <a href="mailto:omar.r.ajami@gmail.com" className="flex items-center gap-2 text-white/70 transition-colors hover:text-accent">
                  <FontAwesomeIcon icon={faEnvelope} className="h-4 w-4" />
                  omar.r.ajami@gmail.com
                </a>
              </li>
            </ul>
          </div>
          <div className="sm:border-l sm:border-accent/40 sm:pl-12">
            <h4 className="text-sm font-semibold text-white/90">Socials</h4>
            <ul className="mt-3 flex flex-col gap-2 text-sm">
              <li>
                <a href="https://instagram.com/omar.r.ajami" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white/70 transition-colors hover:text-accent">
                  <FontAwesomeIcon icon={faInstagram} className="h-4 w-4" />
                  Instagram
                </a>
              </li>
              <li>
                <a href="https://github.com/omar-alajami" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white/70 transition-colors hover:text-accent">
                  <FontAwesomeIcon icon={faGithub} className="h-4 w-4" />
                  GitHub
                </a>
              </li>
              <li>
                <a href="#" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white/70 transition-colors hover:text-accent">
                  <FontAwesomeIcon icon={faLinkedin} className="h-4 w-4" />
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 px-4 py-4">
        <p className="mx-auto max-w-6xl text-center text-xs text-white/50">
          © {year} LIU Clubs — All Rights Reserved
        </p>
        <p className="mt-1 text-center text-xs text-white/50 font-semibold">
          By Omar R. Al-Ajami
        </p>
      </div>
    </footer>
  )
}

export default Footer;