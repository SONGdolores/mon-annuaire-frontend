import { ApiService } from '@/core/services/api.service';
import { TitleCasePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdministrationModel } from '../../models/administration.model';

@Component({
  selector: 'app-detailscards',
  standalone: true,
  imports: [ReactiveFormsModule, TitleCasePipe],
  templateUrl: './detailscards.page.html',
  styleUrls: ['./detailscards.page.scss'],
})
export class DetailscardsPage implements OnInit {
  admin!: AdministrationModel;
  isLoading = signal(true);

  joursSemaine = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];

  apiService = inject(ApiService);
  route = inject(ActivatedRoute);
  router = inject(Router);


  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.apiService.get<AdministrationModel>(`administrations/${id}`).subscribe({
        next: (data) => {
          console.log('Données reçues:', data);
          this.admin = data;
          this.isLoading.set(false);
        },
        error: (err) => {
          console.error('Erreur lors du chargement', err);
          this.isLoading.set(false);
        }
      });
    }
  }
  goBack() {
    this.router.navigate(['/public']);
  }

  onCoverSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      const formData = new FormData();
      formData.append('cover', file);

      this.apiService.post(`administrations/${this.admin.id}/cover`, formData).subscribe({
        next: (res: any) => {
          console.log('Cover uploadée avec succès', res);
          if (res && res.cover) {
            this.admin.cover = res.cover;
          }
        },
        error: (err) => {
          console.error('Erreur lors de l’upload de la cover', err);
        },
      });
    }
  }

}

