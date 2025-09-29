import { Component, inject, OnInit, signal } from '@angular/core';
import { AdministrationModel } from '../../models/administration.model';
import { ApiService } from '@/core/services/api.service';
import { HeaderComponent } from "../../components/header/header.component";
import { SearchFilterComponent } from "../../components/search-filter/search-filter.component";
import { PaginationComponent } from "../../components/pagination/pagination.component";
import { AdministrationCardComponent } from "../../components/administration-card/administration-card.component";

@Component({
  selector: 'app-public',
  standalone: true,
  templateUrl: './public.page.html',
  styleUrls: ['./public.page.scss'],
  imports: [HeaderComponent, SearchFilterComponent, PaginationComponent, AdministrationCardComponent],
})
export class PublicPage implements OnInit {

  administrations: AdministrationModel[] = [];
  total = 0;
  page = 1;
  limit = 10;
  isLoading = signal(false);

  searchTerm = '';
  categorie = '';

  apiService = inject(ApiService);


  ngOnInit(): void {
    this.loadAdministrations();
    console.log('PublicPage initialized');
    console.log(this.administrations);
    
  }

  loadAdministrations(): void {
    this.isLoading.set(true);


    this.apiService.get<{ data: AdministrationModel[]; total: number }>('administrations', {
      search: this.searchTerm,
      categorie: this.categorie,
      page: this.page,
      limit: this.limit
    }).subscribe(res => {
      this.isLoading.set(false);
      this.administrations = res.data;
      this.total = res.total;
    });
  }

  onFilterChange(search: string, categorie: string): void {
    this.searchTerm = search;
    this.categorie = categorie;
    this.page = 1;
    this.loadAdministrations();
  }

  onPageChange(newPage: number): void {
    this.page = newPage;
    this.loadAdministrations();
  }
}
