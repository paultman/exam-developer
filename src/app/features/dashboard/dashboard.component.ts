// src/app/features/dashboard/dashboard.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { PageFooterComponent } from '../../shared/components/page-footer/page-footer.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent, PageFooterComponent],
  template: `
    <div class="page-wrapper">
      <app-page-header></app-page-header>

      <nav class="breadcrumb">
        <a href="#">Item bank name</a> / <a href="#">Project name</a> /
        <span>Item Assist</span>
      </nav>

      <main class="dashboard-container">
        <div class="dashboard-header">
          <h1>Item Assist</h1>
          <div class="ai-status">
            <span class="label">AI assisted item writing:</span>
            <span class="status">Disabled</span>
          </div>
        </div>

        <div class="settings-section">
          <h2>Settings</h2>
          <p class="description">
            Select any tile to manage your project and authoring AI experience.
          </p>
        </div>

        <div class="navigation-grid">
          @for (tile of navigationTiles; track tile.title) {
          <div
            class="navigation-tile"
            (click)="navigateTo(tile.route)"
            [ngStyle]="{ 'border-top-color': tile.color }"
          >
            <div class="tile-header"></div>
            <div class="tile-content">
              <div class="tile-icon" [style.backgroundColor]="tile.color">
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

        a {
          color: #0073ea;
          text-decoration: none;

          &:hover {
            text-decoration: underline;
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
        }

        .ai-status {
          .label {
            color: rgba(0, 0, 0, 0.6);
          }
          .status {
            color: #0073ea;
            margin-left: 4px;
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
            width: 200px; // Increased line length
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
        max-width: 1000px; // Makes cards slightly smaller
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
      }

      .tile-header {
        height: 48px;
        background-color: rgba(0, 0, 0, 0.04);
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
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
        left: 24px; // Changed to left from right
        width: 48px;
        height: 48px;
        border-radius: 16px; // More rounded corners
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
    `,
  ],
})
export class DashboardComponent {
  navigationTiles = [
    {
      svg: `<svg viewBox="0 0 24 24">
        <rect width="24" height="24" fill="none"/>
        <path fill="white" d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/>
      </svg>`,
      title: 'General',
      route: '/general',
      color: '#424242',
    },
    {
      svg: `<svg viewBox="0 0 24 24">
        <rect width="24" height="24" fill="none"/>
        <path fill="white" d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zM6 20V4h7v5h5v11H6z"/>
      </svg>`,
      title: 'Knowledge base',
      route: '/knowledge-base',
      color: '#0073EA',
    },
    {
      svg: `<svg viewBox="0 0 24 24">
        <rect width="24" height="24" fill="none"/>
        <path fill="white" d="M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58.55 0 1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41 0-.55-.23-1.06-.59-1.42zM5.5 7C4.67 7 4 6.33 4 5.5S4.67 4 5.5 4 7 4.67 7 5.5 6.33 7 5.5 7z"/>
      </svg>`,
      title: 'Metadata',
      route: '/metadata',
      color: '#FF4E4E',
    },
    {
      svg: `<svg viewBox="0 0 24 24">
        <rect width="24" height="24" fill="none"/>
        <path fill="white" d="M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z"/>
      </svg>`,
      title: 'Additional parameters',
      route: '/parameters',
      color: '#4CAF50',
    },
    {
      svg: `<svg viewBox="0 0 24 24">
        <rect width="24" height="24" fill="none"/>
        <path fill="white" d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/>
      </svg>`,
      title: 'Prompt',
      route: '/prompt',
      color: '#9C27B0',
    },
  ];

  constructor(private router: Router, private sanitizer: DomSanitizer) {}

  getSafeHtml(svg: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(svg);
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}
