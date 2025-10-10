import { AfterViewInit, Component, inject, Input } from '@angular/core';
import { AdministrationModel } from '../../models/administration.model';
import L from 'leaflet';
import { HeaderComponent } from "../../components/header/header.component";
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '@/core/services/api.service';

@Component({
  selector: 'app-carte',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule , HeaderComponent],
  templateUrl: './carte.page.html',
  styleUrls: ['./carte.page.scss'],
})
export class CartePage implements AfterViewInit {
  private apiService = inject(ApiService);


  @Input() administrations: AdministrationModel[] = [];

  filteredAdmins: AdministrationModel[] = [];
  searchQuery = new FormControl('');
  selectedAdministration: AdministrationModel | null = null;

  private map!: L.Map;
  private markers: L.Marker[] = [];

     ngAfterViewInit(): void {
    this.filteredAdmins = [...this.administrations];
    this.initMap();
    //this.loadAdministrations();

    setTimeout(() => this.map.invalidateSize(), 200);
  }

  private initMap(): void {
    this.map = L.map('map').setView([0.39, 9.45], 13);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);

    this.loadMarkers();
  }

  //   private loadAdministrations(): void {
  //   this.apiService.get('administrations').subscribe({
  //     next: (res: any) => {
  //       console.log('Réponse brute API:', res);

  //       const data = res?.data || [];

  //       this.administrations = data;
  //       this.filteredAdmins = [...data];
  //       this.loadMarkers();
  //     },
  //     error: (err) => console.error('Erreur chargement administrations', err),
  //   });
  // }


    private loadMarkers(): void {
    this.markers = [];

    this.administrations.forEach(administration => {
      if (administration.latitude && administration.longitude) {
        const marker = L.marker([administration.latitude, administration.longitude])
          .bindPopup(`
            <b>${administration.nom}</b><br>
            ${administration.ville?.nom || ''}
          `)
          .addTo(this.map);

        this.markers.push(marker);
      }
    });

        if (this.administrations.length) {
      const group = L.featureGroup(
        this.administrations
          .filter(a => a.latitude && a.longitude)
          .map(a => L.marker([a.latitude!, a.longitude!]))
      );
      this.map.fitBounds(group.getBounds(), { padding: [50, 50] });
    }
  }


  filterAdmins(): void {
    const query = this.searchQuery.value?.toLowerCase() || '';

    console.log('Recherche :', query);

    this.filteredAdmins = this.administrations.filter(administration =>
      administration.nom.toLowerCase().includes(query) ||
      (administration.ville?.nom?.toLowerCase().includes(query)) ||
      (administration.typeAdministration?.libelle?.toLowerCase().includes(query))
    );

    console.log('Résultats filtrés :', this.filteredAdmins);
  }


  selectAdmin(administration: AdministrationModel): void {
    this.selectedAdministration = administration;

    if (this.map && administration.latitude && administration.longitude) {
      this.map.setView([administration.latitude, administration.longitude], 15);

      const marker = this.markers.find(
        (m) =>
          m.getLatLng().lat === administration.latitude &&
          m.getLatLng().lng === administration.longitude
      );
      marker?.openPopup();
    }
  }
}
