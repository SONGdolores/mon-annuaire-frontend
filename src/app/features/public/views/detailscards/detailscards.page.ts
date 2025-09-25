import { ApiService } from '@/core/services/api.service';
import { TitleCasePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
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
  isLoading = true;

  joursSemaine = ['lundi','mardi','mercredi','jeudi','vendredi','samedi'];

   constructor(
    private route: ActivatedRoute,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.apiService.get<AdministrationModel>(`administrations/${id}`).subscribe({
        next: (data) => {
          console.log('Données reçues:', data);
          this.admin = data;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Erreur lors du chargement', err);
          this.isLoading = false;
        }
      });
    }
  }
}

