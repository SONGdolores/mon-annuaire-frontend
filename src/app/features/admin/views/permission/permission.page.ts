import { ApiService } from '@/core/services/api.service';
import { Component, inject, signal } from '@angular/core';

@Component({
  selector: 'app-permission',
  standalone: true,
  templateUrl: './permission.page.html',
  styleUrls: ['./permission.page.scss'],
})
export class PermissionPage {

   private apiService = inject(ApiService);

  permissions = signal<any[]>([]);
  isLoading = signal(true);
  errorMessage: string | null = null;

  ngOnInit() {
    this.loadPermissions();
  }

  loadPermissions() {
    this.apiService.get('permissions').subscribe({
      next: (data: any) => {
        this.permissions.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.errorMessage = "Impossible de charger les permissions";
        this.isLoading.set(false);
        console.error(err);
      }
    });
  }
}
