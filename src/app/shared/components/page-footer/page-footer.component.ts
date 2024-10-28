// src/app/shared/components/page-footer/page-footer.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-page-footer',
  standalone: true,
  template: `
    <footer class="page-footer">
      <div class="footer-links">
        <a href="#">Terms</a>
        <span class="divider">|</span>
        <a href="#">Use Agreement</a>
        <span class="divider">|</span>
        <a href="#">Privacy</a>
      </div>
      <div class="copyright">
        Copyright 2024 Pearson Education Inc. or its affiliate(s). All rights
        reserved.
      </div>
    </footer>
  `,
  styles: [
    `
      .page-footer {
        text-align: center;
        padding: 24px;
        margin-top: auto;

        .footer-links {
          margin-bottom: 8px;
          font-size: 14px;

          a {
            color: #0073ea;
            text-decoration: none;
            padding: 0 8px;

            &:hover {
              text-decoration: underline;
            }
          }

          .divider {
            color: rgba(0, 0, 0, 0.6);
          }
        }

        .copyright {
          font-size: 12px;
          color: rgba(0, 0, 0, 0.6);
        }
      }
    `,
  ],
})
export class PageFooterComponent {}
