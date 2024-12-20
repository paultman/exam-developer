import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { A11yModule } from '@angular/cdk/a11y';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { PageFooterComponent } from '../../shared/components/page-footer/page-footer.component';
import { ComponentStatusService } from '../../shared/services/component-status.service';
import { ComponentStatus } from '../../shared/interfaces/component-status.interface';

interface NavigationTile {
  id: ComponentStatus['id'];
  svg: string;
  title: string;
  route: string;
  color: string;
  ariaLabel?: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, A11yModule, PageHeaderComponent, PageFooterComponent],
  template: `
    <div class="page-wrapper">
      <!-- Skip Link -->
      <a class="skip-link" href="#main-content"> Skip to main content </a>

      <app-page-header></app-page-header>

      <nav
        class="breadcrumb"
        role="navigation"
        aria-label="Breadcrumb navigation"
      >
        <ol>
          <li>
            <a href="#" aria-label="Navigate to item bank">Item bank name</a>
          </li>
          <li><a href="#" aria-label="Navigate to project">Project name</a></li>
          <li><span aria-current="page">Item Assist</span></li>
        </ol>
      </nav>

      <main
        id="main-content"
        class="dashboard-container"
        role="main"
        aria-label="Item Assist Dashboard"
      >
        <div class="dashboard-header">
          <h1 tabindex="-1">Item Assist</h1>
          <div class="ai-status" role="status" aria-live="polite">
            <span class="label" id="ai-status-label"
              >AI assisted item writing:</span
            >
            <span
              class="status"
              [class.enabled]="aiWritingEnabled$ | async"
              [attr.aria-label]="
                (aiWritingEnabled$ | async)
                  ? 'AI writing is enabled'
                  : 'AI writing is disabled'
              "
            >
              {{ (aiWritingEnabled$ | async) ? 'Enabled' : 'Disabled' }}
            </span>
          </div>
        </div>

        <section
          class="settings-section"
          role="region"
          aria-labelledby="settings-heading"
        >
          <h2 id="settings-heading">Settings</h2>
          <p class="description" role="note">
            Select any tile to manage your project and authoring AI experience.
          </p>
        </section>

        <div
          class="navigation-grid"
          role="grid"
          aria-label="Navigation options"
        >
          @for (tile of navigationTiles; track tile.title) {
          <div
            class="navigation-tile"
            role="button"
            [attr.aria-label]="tile.ariaLabel"
            (click)="navigateTo(tile.route)"
            (keydown.enter)="navigateTo(tile.route)"
            (keydown.space)="$event.preventDefault(); navigateTo(tile.route)"
            tabindex="0"
            [ngStyle]="{ 'border-top-color': tile.color }"
          >
            <div class="tile-header">
              @if ((componentStatuses$ | async)?.[tile.id]?.isComplete) {
              <div
                class="completion-check"
                role="img"
                aria-label="Section completed"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
                    fill="#4CAF50"
                  />
                </svg>
              </div>
              }
            </div>
            <div class="tile-content">
              <div
                class="tile-icon"
                [style.backgroundColor]="tile.color"
                aria-hidden="true"
              >
                <div
                  class="svg-container"
                  [innerHTML]="getSafeHtml(tile.svg)"
                ></div>
              </div>
              <div class="tile-title">{{ tile.title }}</div>
            </div>
          </div>
          }
        </div>
      </main>

      <app-page-footer></app-page-footer>
    </div>
  `,
  styles: [
    `
      .skip-link {
        position: absolute;
        top: -40px;
        left: 0;
        background: #0073ea;
        color: white;
        padding: 8px;
        z-index: 100;
        transition: top 0.2s ease;

        &:focus {
          top: 0;
          outline: 2px solid #ffffff;
          outline-offset: 2px;
        }
      }

      .page-wrapper {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        background-color: #f8f9fa;
        max-width: 100vw;
        overflow-x: hidden;
      }

      .breadcrumb {
        padding: 16px 24px;
        font-size: 14px;
        color: rgba(0, 0, 0, 0.6);
        max-width: 1200px;
        margin: 0 auto;
        width: 100%;
        box-sizing: border-box;

        ol {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-wrap: wrap;
        }

        li {
          display: flex;
          align-items: center;

          &:not(:last-child)::after {
            content: '/';
            margin: 0 8px;
            color: rgba(0, 0, 0, 0.6);
          }
        }

        a {
          color: #0073ea;
          text-decoration: none;
          padding: 4px;
          border-radius: 4px;

          &:hover {
            text-decoration: underline;
          }

          &:focus {
            outline: 2px solid #0073ea;
            outline-offset: 2px;
          }

          &:focus:not(:focus-visible) {
            outline: none;
          }
        }
      }

      .dashboard-container {
        flex: 1;
        padding: 0 24px;
        max-width: 1200px;
        margin: 0 auto;
        width: 100%;
        box-sizing: border-box;
      }

      .dashboard-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 32px;

        h1 {
          font-size: 24px;
          font-weight: 400;
          margin: 0;
          color: rgba(0, 0, 0, 0.87);

          &:focus {
            outline: none;
          }
        }

        .ai-status {
          .label {
            color: rgba(0, 0, 0, 0.6);
          }
          .status {
            color: #0073ea;
            margin-left: 4px;

            &.enabled {
              color: #4caf50;
            }
          }
        }
      }

      .settings-section {
        text-align: center;
        margin-bottom: 24px;

        h2 {
          font-size: 20px;
          font-weight: 400;
          color: rgba(0, 0, 0, 0.87);
          margin: 0 0 16px;
          position: relative;
          display: inline-block;
          padding: 0 24px;

          &::before,
          &::after {
            content: '';
            position: absolute;
            top: 50%;
            width: 200px;
            height: 1px;
            background: rgba(0, 0, 0, 0.12);
          }

          &::before {
            right: 100%;
          }

          &::after {
            left: 100%;
          }
        }

        .description {
          font-size: 14px;
          color: rgba(0, 0, 0, 0.6);
          margin: 0;
        }
      }

      .navigation-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 24px;
        margin: 32px auto;
        width: 100%;
        max-width: 1000px;
      }

      .navigation-tile {
        background: white;
        border-radius: 4px;
        cursor: pointer;
        border: 1px solid rgba(0, 0, 0, 0.08);
        border-top-width: 3px;
        transition: box-shadow 0.2s ease;
        position: relative;

        &:hover {
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        &:focus {
          outline: 2px solid #0073ea;
          outline-offset: 2px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        &:focus:not(:focus-visible) {
          outline: none;
        }
      }

      .tile-header {
        height: 48px;
        background-color: rgba(0, 0, 0, 0.04);
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
        position: relative;
      }

      .completion-check {
        position: absolute;
        top: 12px;
        right: 12px;
        width: 24px;
        height: 24px;
      }

      .tile-content {
        padding: 24px;
        text-align: left;
        position: relative;
        min-height: 60px;
      }

      .tile-icon {
        position: absolute;
        top: -36px;
        left: 24px;
        width: 48px;
        height: 48px;
        border-radius: 16px;
        display: flex;
        align-items: center;
        justify-content: center;

        .svg-container {
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;

          ::ng-deep svg {
            width: 100%;
            height: 100%;
          }
        }
      }

      .tile-title {
        font-size: 16px;
        font-weight: 500;
        color: rgba(0, 0, 0, 0.87);
        margin-top: 8px;
      }

      @media (forced-colors: active) {
        .navigation-tile {
          border: 2px solid ButtonText;
        }

        .tile-icon {
          border: 1px solid ButtonText;
        }
      }
    `,
  ],
})
export class DashboardComponent implements OnInit {
  navigationTiles: NavigationTile[] = [
    {
      id: 'general',
      svg: `<svg viewBox="0 0 24 24" role="img" aria-hidden="true">
        <rect width="24" height="24" fill="none"/>
        <path fill="white" d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0-0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/>
      </svg>`,
      title: 'General',
      route: '/general',
      color: '#424242',
      ariaLabel: 'Configure general settings',
    },
    {
      id: 'knowledge-base',
      svg: `<svg viewBox="0 0 24 24" role="img" aria-hidden="true">
        <rect width="24" height="24" fill="none"/>
        <path fill="white" d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.12-.9 2-2V8l-6-6zM6 20V4h7v5h5v11H6z"/>
      </svg>`,
      title: 'Knowledge base',
      route: '/knowledge-base',
      color: '#0073EA',
      ariaLabel: 'Configure knowledge base settings',
    },
    {
      id: 'metadata',
      svg: `<svg viewBox="0 0 24 24" role="img" aria-hidden="true">
        <rect width="24" height="24" fill="none"/>
        <path fill="white" d="M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58.55 0 1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41 0-.55-.23-1.06-.59-1.42zM5.5 7C4.67 7 4 6.33 4 5.5S4.67 4 5.5 4 7 4.67 7 5.5 6.33 7 5.5 7z"/>
      </svg>`,
      title: 'Metadata',
      route: '/metadata',
      color: '#FF4E4E',
      ariaLabel: 'Configure metadata settings',
    },
    {
      id: 'additional-parameters',
      svg: `<svg viewBox="0 0 24 24" role="img" aria-hidden="true">
        <rect width="24" height="24" fill="none"/>
        <path fill="white" d="M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z"/>
      </svg>`,
      title: 'Additional parameters',
      route: '/parameters',
      color: '#4CAF50',
      ariaLabel: 'Configure additional parameters',
    },
    {
      id: 'prompt',
      svg: `<svg viewBox="0 0 24 24" role="img" aria-hidden="true">
        <rect width="24" height="24" fill="none"/>
        <path fill="white" d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/>
      </svg>`,
      title: 'Prompt',
      route: '/prompt',
      color: '#9C27B0',
      ariaLabel: 'Configure prompt settings',
    },
  ];

  componentStatuses$ = this.componentStatusService.getAllComponentStatuses();
  aiWritingEnabled$ = this.componentStatusService.isAiWritingEnabled();

  constructor(
    private router: Router,
    private sanitizer: DomSanitizer,
    private componentStatusService: ComponentStatusService
  ) {}

  ngOnInit(): void {
    // Set initial focus to the main heading when the component loads
    setTimeout(() => {
      const mainHeading = document.querySelector('h1');
      if (mainHeading) {
        (mainHeading as HTMLElement).focus();
      }
    });
  }

  @HostListener('keydown.tab', ['$event'])
  handleTabNavigation(event: KeyboardEvent): void {
    const focusableElements = this.getFocusableElements();
    const firstFocusableElement = focusableElements[0];
    const lastFocusableElement =
      focusableElements[focusableElements.length - 1];

    // Handle shift + tab
    if (event.shiftKey) {
      if (document.activeElement === firstFocusableElement) {
        lastFocusableElement.focus();
        event.preventDefault();
      }
    }
    // Handle tab
    else {
      if (document.activeElement === lastFocusableElement) {
        firstFocusableElement.focus();
        event.preventDefault();
      }
    }
  }

  private getFocusableElements(): HTMLElement[] {
    const selector = 'a[href], button, [tabindex="0"], input, select, textarea';
    return Array.from(document.querySelectorAll(selector)) as HTMLElement[];
  }

  getSafeHtml(svg: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(svg);
  }

  navigateTo(route: string): void {
    this.router.navigate([route]).then(() => {
      // Announce navigation to screen readers
      this.announceNavigation(route);
    });
  }

  private announceNavigation(route: string): void {
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', 'polite');
    announcer.setAttribute('aria-atomic', 'true');
    announcer.classList.add('sr-only'); // Add this class to your global styles
    announcer.textContent = `Navigating to ${route.replace('/', '')} page`;
    document.body.appendChild(announcer);

    // Remove the announcer after the announcement
    setTimeout(() => {
      document.body.removeChild(announcer);
    }, 1000);
  }
}
