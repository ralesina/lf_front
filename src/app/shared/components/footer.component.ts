import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  template: `
    <footer class="footer">
      <div class="footer-content">
        <div class="license-section">
          <a href="https://creativecommons.org/licenses/by/4.0/deed.es" 
             target="_blank" 
             rel="noopener noreferrer">
            <img src="https://mirrors.creativecommons.org/presskit/buttons/88x31/svg/by.svg" 
                 alt="CC-BY License" 
                 class="cc-logo">
          </a>
          <p>
            Esta obra está bajo una 
            <a href="https://creativecommons.org/licenses/by/4.0/deed.es">
              Licencia Creative Commons Atribución 4.0 Internacional
            </a>
          </p>
        </div>
        
        <div class="developer-info">
          <h3>Desarrollado por:</h3>
          <p>Ricardo Alesina Cuenca</p>
          <p>CIFP Carlos III Cartagena 2024</p>
          <p>DESARROLLO APLICACIONES WEB 2024</p>
        </div>

        <div class="help-links">
          <h3>Texto Legal</h3>
          <ul>
            <li>
              <a href="https://creativecommons.org/licenses/by-sa/4.0/legalcode.en"
                 target="_blank" 
                 rel="noopener noreferrer">
                Licencias Creative Commons
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    :host {
      margin-top: auto; /* Empuja el footer hacia abajo */
    }

    .footer {
      background-color: var(--color-dark-brown);
      color: white;
      padding: 1.5rem 0;
      width: 100%;
    }

    .footer-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
      align-items: start;
    }

    .license-section {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }

    .cc-logo {
      width: 88px;
      height: 31px;
      margin-bottom: 0.5rem;
    }

    .developer-info {
      text-align: center;
    }

    .social-links {
      display: flex;
      justify-content: center;
      gap: 1rem;
      margin-top: 0.5rem;
    }

    .help-links {
      text-align: center;
    }

    .help-links ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .help-links li {
      margin: 0.5rem 0;
    }

    a {
      color: var(--color-light-yellow);
      text-decoration: none;
      transition: color 0.3s ease;
    }

    a:hover {
      color: var(--color-pistachio);
    }

    h3 {
      color: var(--color-pistachio);
      margin: 0 0 0.5rem 0;
      font-size: 1rem;
    }

    p {
      margin: 0.25rem 0;
    }
  `]
})
export class FooterComponent {}