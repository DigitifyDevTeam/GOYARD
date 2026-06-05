import { useEffect } from "react";
import { CONTACT_PHONE_HREF, CONTACT_PHONE_DISPLAY } from "../../constants/contactPhone";

const CONTACT_EMAIL = "contact@guivarche-demenagement.fr";
const CONTACT_MOBILE_HREF = "tel:+33746326678";
const CONTACT_MOBILE_DISPLAY = "+33 7 46 32 66 78";

const footerContactLinkClass =
  "hover:opacity-70 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#CC922F] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1C2E42] rounded-sm";

function Group685() {
  return (
    <img
      src="/logo.svg"
      alt="Guivarche Déménagement"
      className="block h-24 sm:h-28 lg:h-40 w-auto"
    />
  );
}

export default function Footer() {
  useEffect(() => {
    if (document.querySelector('script[src="https://elfsightcdn.com/platform.js"]')) return;
    const script = document.createElement("script");
    script.src = "https://elfsightcdn.com/platform.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <footer className="w-full bg-[#1C2E42] text-white">
      <div className="max-w-[1920px] mx-auto">
        <div className="section-px py-10 md:py-12 lg:py-16">
        {/* Top Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 lg:gap-16 mb-10 md:mb-12 lg:mb-16">
          {/* Logo and Contact Column */}
          <div className="flex flex-col gap-6 lg:gap-8 items-start">
            <Group685 />
            <div className="flex flex-col gap-3 text-sm lg:text-[15px]">
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className={footerContactLinkClass}
              >
                {CONTACT_EMAIL}
              </a>
              <a href={CONTACT_MOBILE_HREF} className={footerContactLinkClass}>
                {CONTACT_MOBILE_DISPLAY}
              </a>
              <a href={CONTACT_PHONE_HREF} className={footerContactLinkClass}>
                {CONTACT_PHONE_DISPLAY}
              </a>

              <p>25 Rue de Cîteaux, 75012 Paris, France</p>
            </div>
          </div>

          {/* Column 1 - Pages */}
          <div className="flex flex-col gap-6">
            <p className="text-[15px] opacity-65 tracking-[-0.1px] font-medium">Accès Rapide</p>
            <div className="flex flex-col gap-4 text-base lg:text-[17px] tracking-[-0.2px]">
              <a href="/" className="hover:opacity-70 transition-opacity">Accueil</a>
              <a href="/solution/" className="hover:opacity-70 transition-opacity">Solution</a>
              <a href="/demenagement-entreprise/" className="hover:opacity-70 transition-opacity">Déménagement entreprise</a>
              <a href="/demenagement-particulier/" className="hover:opacity-70 transition-opacity">Déménagement particulier</a>
              <a href="/blog/" className="hover:opacity-70 transition-opacity">Blog</a>
              <a href="/faq/" className="hover:opacity-70 transition-opacity">FAQ</a>
              <a href="/tarif/" className="hover:opacity-70 transition-opacity">Tarification</a>
              <a href="/contact/" className="hover:opacity-70 transition-opacity">Contact</a>
            </div>
          </div>

          {/* Column 2 - Recent Articles */}
          <div className="flex flex-col gap-6">
            <p className="text-[15px] opacity-65 tracking-[-0.1px] font-medium">Articles Récents</p>
            <div className="flex flex-col gap-4 text-base lg:text-[17px] tracking-[-0.2px]">
              <a href="/blog/guide-complet-demenagement-reussi/" className="hover:opacity-70 transition-opacity">Guide complet pour un déménagement réussi</a>
              <a href="/blog/comment-emballer-objets-fragiles/" className="hover:opacity-70 transition-opacity">Comment emballer vos objets fragiles</a>
              <a href="/blog/demenagement-ecologique-solutions-durables/" className="hover:opacity-70 transition-opacity">Déménagement écologique : nos solutions durables</a>
            </div>
          </div>

          {/* Column 3 - Legal + Reviews directly under Nous Contacter */}
          <div className="flex flex-col gap-6">
            <p className="text-[15px] opacity-65 tracking-[-0.1px] font-medium">Informations</p>
            <div className="flex flex-col gap-4 text-base lg:text-[17px] tracking-[-0.2px]">
              <a href="/mentions-legales/" className="hover:opacity-70 transition-opacity">Mentions Légales</a>
              <a href="/rgpd/" className="hover:opacity-70 transition-opacity">RGPD</a>
              <div className="flex flex-col gap-3 items-start">
                <a href="/contact/" className="hover:opacity-70 transition-opacity">Nous Contacter</a>
                <div className="elfsight-app-94f468c1-4f93-46f0-a5d3-dcee026001cf" data-elfsight-app-lazy />
                <a
                  href="https://www.trustpilot.com/review/guivarchedemenagement.fr"
                  target="_blank"
                  rel="nofollow noopener noreferrer"
                  className="shrink-0"
                  aria-label="Voir nos avis Trustpilot"
                >
                  <img
                    src="/trust.png"
                    alt="Trustpilot - Avis clients"
                    className="h-20 w-auto object-contain sm:h-24 md:h-28 lg:h-32"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-[1px] bg-[#292F41] mb-8"></div>

        {/* Bottom Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          {/* Copyright and Legal Links */}
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            <p className="text-[15px] opacity-65 tracking-[-0.1px]">
              © 2025 Copyright, All Right Reserved, Guivarche Déménagement
            </p>
            <a href="/mentions-legales/" className="text-[15px] opacity-65 tracking-[-0.1px] hover:opacity-100 transition-opacity">
              Mentions légales
            </a>
            <a href="/rgpd/" className="text-[15px] opacity-65 tracking-[-0.1px] hover:opacity-100 transition-opacity">
              RGPD
            </a>
          </div>

          {/* Social Media Icons */}
          <div className="flex items-center gap-8">
            <a href="https://www.facebook.com/profile.php?id=61587408931997" target="_blank" rel="nofollow noopener noreferrer" className="hover:opacity-70 transition-opacity" aria-label="Facebook">
              <svg className="w-[19px] h-[19px]" fill="none" viewBox="0 0 19 19">
                <path d="M19 9.5573C18.9992 4.4726 15.0424 0.278485 9.99592 0.0132214C4.94945 -0.252042 0.579855 3.50441 0.0525261 8.56134C-0.474803 13.6183 3.02473 18.2055 8.01601 19V12.3203H5.60428V9.5573H8.01601V7.45142C8.01601 5.0558 9.43443 3.73253 11.6039 3.73253C12.3164 3.74247 13.0272 3.80477 13.7307 3.91892V6.27153H12.5325C12.1189 6.21626 11.7028 6.35325 11.4017 6.64381C11.1006 6.93437 10.9471 7.34697 10.9847 7.76506V9.5573H13.6196L13.1981 12.3203H10.9847V19C15.6013 18.2651 19.0007 14.2603 19 9.5573Z" fill="white" />
              </svg>
            </a>
            <a href="https://www.instagram.com/guivarche_demenagement/" target="_blank" rel="nofollow noopener noreferrer" className="hover:opacity-70 transition-opacity" aria-label="Instagram">
              <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 18 18">
                <path clipRule="evenodd" d="M5.28937 0.054C6.24937 0.0105 6.55575 0 9 0C11.4443 0 11.7506 0.0105 12.7106 0.054C14.1739 0.12075 15.4583 0.47925 16.4895 1.5105C17.5211 2.54212 17.8792 3.82687 17.946 5.28937C17.9895 6.24937 18 6.55575 18 9C18 11.4443 17.9895 11.7506 17.946 12.7106C17.8792 14.1739 17.5208 15.4583 16.4895 16.4895C15.4579 17.5211 14.1727 17.8792 12.7106 17.946C11.7506 17.9895 11.4443 18 9 18C6.55575 18 6.24937 17.9895 5.28937 17.946C3.82612 17.8792 2.54175 17.5208 1.5105 16.4895C0.478875 15.4579 0.12075 14.1731 0.054 12.7106C0.0105 11.7506 0 11.4443 0 9C0 6.55575 0.0105 6.24937 0.054 5.28937C0.12075 3.82612 0.47925 2.54175 1.5105 1.5105C2.54212 0.478875 3.82687 0.12075 5.28937 0.054ZM12.6368 1.674C11.6876 1.6305 11.403 1.6215 9 1.6215C6.597 1.6215 6.31238 1.63087 5.36325 1.674C4.33913 1.72088 3.3885 1.926 2.65725 2.65725C1.926 3.3885 1.72088 4.33913 1.674 5.36325C1.6305 6.31238 1.6215 6.597 1.6215 9C1.6215 11.403 1.63087 11.6876 1.674 12.6368C1.72088 13.6609 1.926 14.6115 2.65725 15.3427C3.3885 16.074 4.33913 16.2791 5.36325 16.326C6.312 16.3695 6.59663 16.3785 9 16.3785C11.4034 16.3785 11.688 16.3691 12.6368 16.326C13.6609 16.2791 14.6115 16.074 15.3427 15.3427C16.074 14.6115 16.2791 13.6609 16.326 12.6368C16.3695 11.6876 16.3785 11.403 16.3785 9C16.3785 6.597 16.3691 6.31238 16.326 5.36325C16.2791 4.33913 16.074 3.3885 15.3427 2.65725C14.6115 1.926 13.6609 1.72088 12.6368 1.674Z" fill="white" fillRule="evenodd" />
                <path clipRule="evenodd" d="M4.90909 9.40909C4.90909 6.92394 6.92357 4.90909 9.40909 4.90909C11.8946 4.90909 13.9091 6.92357 13.9091 9.40909C13.9091 11.8946 11.8946 13.9091 9.40909 13.9091C6.92357 13.9091 4.90909 11.8942 4.90909 9.40909ZM6.48796 9.40909C6.48796 11.0223 7.7959 12.3302 9.40909 12.3302C11.0223 12.3302 12.3302 11.0223 12.3302 9.40909C12.3302 7.7959 11.0223 6.48796 9.40909 6.48796C7.7959 6.48796 6.48796 7.7959 6.48796 9.40909Z" fill="white" fillRule="evenodd" />
                <circle cx="13.5" cy="4.5" fill="white" r="1.22727" />
              </svg>
            </a>
            <a href="https://www.linkedin.com/company/guivarche-d%C3%A9m%C3%A9nagement/about/?viewAsMember=true" target="_blank" rel="nofollow noopener noreferrer" className="hover:opacity-70 transition-opacity" aria-label="LinkedIn">
              <svg className="w-[18px] h-[18px]" fill="white" viewBox="0 0 24 24">
                <path d="M4.98 3.5C4.98 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM.32 8.44H4.68V23H.32V8.44zM8.34 8.44h4.18v1.99h.06c.58-1.1 2-2.27 4.11-2.27 4.4 0 5.21 2.9 5.21 6.67V23h-4.36v-7.01c0-1.67-.03-3.82-2.33-3.82-2.33 0-2.69 1.82-2.69 3.7V23H8.34V8.44z" />
              </svg>
            </a>
            <a href="https://www.youtube.com/@Guivarchedem" target="_blank" rel="nofollow noopener noreferrer" className="hover:opacity-70 transition-opacity" aria-label="YouTube">
              <svg className="w-[24px] h-[24px]" fill="none" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" fill="white" />
              </svg>
            </a>
            <a href="https://www.tiktok.com/@guivarche_demenagement" target="_blank" rel="nofollow noopener noreferrer" className="hover:opacity-70 transition-opacity" aria-label="TikTok">
              <svg className="w-[18px] h-[18px]" fill="white" viewBox="0 0 24 24">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
              </svg>
            </a>
            <a href="https://www.pagesjaunes.fr/pros/64768014" target="_blank" rel="nofollow noopener noreferrer" className="hover:opacity-70 transition-opacity" aria-label="Pages Jaunes">
              <svg className="w-[18px] h-[18px]" fill="white" viewBox="0 0 24 24">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
              </svg>
            </a>
            <a href="https://www.reddit.com/user/Accurate-Throat6716/" target="_blank" rel="nofollow noopener noreferrer" className="hover:opacity-70 transition-opacity" aria-label="Reddit">
              <svg className="w-[18px] h-[18px]" fill="white" viewBox="0 0 24 24">
                <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.88-7.004 4.88-3.874 0-7.004-2.186-7.004-4.88 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.201 12a1.75 1.75 0 0 1 1.754-1.754c.479 0 .901.182 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
              </svg>
            </a>
            <a href="https://pin.it/1mMMhJJrZ" target="_blank" rel="nofollow noopener noreferrer" className="hover:opacity-70 transition-opacity" aria-label="Pinterest">
              <svg className="w-[18px] h-[18px]" fill="white" viewBox="0 0 24 24">
                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z"/>
              </svg>
            </a>
            <a href="https://www.tumblr.com/guivarche-demenagement" target="_blank" rel="nofollow noopener noreferrer" className="hover:opacity-70 transition-opacity" aria-label="Tumblr">
              <svg className="w-[18px] h-[18px]" fill="white" viewBox="0 0 24 24">
                <path d="M14.563 24c-5.093 0-7.031-3.756-7.031-6.411V9.747H5.414V6.643c3.63-1.313 4.512-4.596 4.71-6.469C10.184.051 11.244 0 12.083 0h3.644v8.266h4.834v3.481h-4.834v6.658c0 1.629.784 2.41 2.308 2.41h6.585V24h-9.003z"/>
              </svg>
            </a>
          </div>
        </div>
        </div>
      </div>
    </footer>
  );
}

