import { ApiService } from '@/core/services/api.service';
import { TitleCasePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdministrationModel } from '../../models/administration.model';

@Component({
  selector: 'app-detailscards',
  standalone: true,
  imports: [ReactiveFormsModule],
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

}

