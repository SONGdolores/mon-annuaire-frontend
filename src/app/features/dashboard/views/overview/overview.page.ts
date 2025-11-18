import { ApiService } from '@/core/services/api.service';
import { Component, inject } from '@angular/core';

@Component({
  selector: 'app-overview',
  standalone: true,
  templateUrl: './overview.page.html',
  styleUrls: ['./overview.page.scss'],
})
export class OverviewPage {

   totalAdministrations = 0;
  apiService = inject(ApiService);

  ngOnInit(): void {
    this.chargerNombreAdministrations();
  }

  chargerNombreAdministrations() {
    this.apiService.get('administrations/count')
      .subscribe({
        next: (res: any) => {
          console.log('Réponse API administrations:', res);
          this.totalAdministrations = res.total;
        },
        error: (err) => {
          console.error("Erreur chargement administrations", err);
        }
      });
  }

}
