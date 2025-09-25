import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { ApiService } from '@/core/services/api.service';

interface Administration {
  id: string;
  nom: string;
  mission: string;
  categorie: string;
  ville: string;
  imageUrl: string;
}

@Component({
  selector: 'app-front-office',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './front-office.page.html',
  styleUrls: ['./front-office.page.scss'],
})
export class FrontOfficePage implements OnInit {
  private apiService = inject(ApiService);

  administrations: Administration[] = [];
  paginatedAdministrations: Administration[] = [];
  categories: string[] = ['Tous', 'Ministère', 'Agence', 'Directions'];

  // la pagination
  currentPage: number = 1;
  itemsPerPage: number = 6;
  totalPages: number = 1;

  // la recherche et filtre
  search: string = '';
  selectedCategorie: string = 'Tous';
  loading: boolean = false;

  // Formulaire pour la recherche et le filtre
    searchForm = new FormGroup({
    searchTerm: new FormControl(''),
    selectedCategorie: new FormControl('Tous')
  });


  ngOnInit() {
    this.loadAdministrations();
  }

  loadAdministrations() {
    this.loading = true;

    const params = {
      search: this.searchForm.value.searchTerm || '',
      categorie: this.searchForm.value.selectedCategorie !== 'Tous' ? this.searchForm.value.selectedCategorie : '',
      page: this.currentPage.toString(),
      limit: this.itemsPerPage.toString()
    };


  }

  // le champ de recherche change
  onSearchChange(value: string) {
    this.search = value;
    this.currentPage = 1;
    this.loadAdministrations();
  }

  // la catégorie change
  onCategoryChange(value: string) {
    this.selectedCategorie = value;
    this.currentPage = 1;
    this.loadAdministrations();
  }

  // Changer de page pour la pagination
  changePage(newPage: number) {
    if (newPage >= 1 && newPage <= this.totalPages) {
      this.currentPage = newPage;
      this.loadAdministrations();
    }
  }
}
