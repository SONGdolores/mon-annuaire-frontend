import { AfterViewInit, Component, inject, Input } from '@angular/core';
import { AdministrationModel } from '../../models/administration.model';
import L from 'leaflet';
import 'leaflet.markercluster';
import { HeaderComponent } from "../../components/header/header.component";
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '@/core/services/api.service';

@Component({
  selector: 'app-carte',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HeaderComponent],
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
  private markerClusterGroup!: L.MarkerClusterGroup;
  private readonly GABON_CENTER: L.LatLngExpression = [0.4162, 9.4673]; // Libreville
  private readonly DEFAULT_ZOOM = 6;

  ngAfterViewInit(): void {
    this.initMap();
    this.loadAdministrations();
    this.filteredAdmins = [...this.administrations];

    setTimeout(() => {
      this.map.invalidateSize();
      this.map.setView(this.GABON_CENTER, this.DEFAULT_ZOOM);
    }, 300);
  }

  private initMap(): void {
    this.map = L.map('map', {
      center: this.GABON_CENTER,
      zoom: this.DEFAULT_ZOOM,
      minZoom: 3,
      maxZoom: 18,
      zoomControl: true,
    });

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);

    this.markerClusterGroup = L.markerClusterGroup();
    this.map.addLayer(this.markerClusterGroup);
  }

  private loadAdministrations(): void {
    this.apiService.get('administrations').subscribe({
      next: (res: any) => {
        console.log('Réponse brute API:', res);
        //const data = res?.data || [];
        //this.administrations = data;
        this.administrations = res?.data || [];
        this.filteredAdmins = [...this.administrations];
        this.loadMarkers();
      },
      error: (err) => console.error('Erreur chargement administrations', err),
    });
  }


  private loadMarkers(): void {
    if (!this.map || !this.markerClusterGroup) return;

    this.markerClusterGroup.clearLayers();

    const validAdmins = this.administrations.filter(a => a.latitude && a.longitude);

    validAdmins.forEach(admin => {
      const marker = L.marker([admin.latitude!, admin.longitude!])
        .bindPopup(`<b>${admin.nom}</b><br>${admin.ville?.nom || ''}`)
      this.markerClusterGroup.addLayer(marker);
    });

    if (validAdmins.length) {
      const group = L.featureGroup(this.markerClusterGroup.getLayers() as L.Marker[]);
      this.map.fitBounds(group.getBounds(), { padding: [50, 50] });
    } else {

      this.map.setView(this.GABON_CENTER, this.DEFAULT_ZOOM);
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
    this.administrations = [...this.filteredAdmins];
    console.log('Données administrations:', this.administrations);

    this.loadMarkers();
  }


  selectAdmin(administration: AdministrationModel): void {
    this.selectedAdministration = administration;

    if (this.map && administration.latitude && administration.longitude) {
      this.map.setView([administration.latitude, administration.longitude], 15);

      const marker = (this.markerClusterGroup.getLayers() as L.Marker[]).find(
        (m) =>
          m.getLatLng().lat === administration.latitude &&
          m.getLatLng().lng === administration.longitude
      );
      marker?.openPopup();
    }
  }
}
