
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, Subject, BehaviorSubject, combineLatest } from 'rxjs';
import { debounceTime, takeUntil, tap, map, startWith } from 'rxjs/operators';
import { ClienteService } from '@core/services/cliente.service';
import { Comercio } from '@shared/models/comercio.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PageEvent } from '@angular/material/paginator';

interface SearchResponse {
  items: Comercio[];
  total: number;
}

@Component({
  selector: 'app-buscar-comercios',
  template: `
    <div class="container">
      <div class="search-container">
        <mat-form-field appearance="outline" class="search-field">
          <mat-label>Buscar comercios</mat-label>
          <input matInput [formControl]="searchControl" placeholder="Nombre o tipo de comercio">
          <mat-icon matSuffix>search</mat-icon>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Categoría</mat-label>
          <mat-select [formControl]="categoryControl">
            <mat-option value="">Todas</mat-option>
            <mat-option *ngFor="let cat of categories$ | async" [value]="cat.id">
              {{cat.nombre}}
            </mat-option>
          </mat-select>
        </mat-form-field>
      </div>

      <div class="filters">
        <mat-chip-list>
          <mat-chip *ngFor="let filter of activeFilters" 
                   (removed)="removeFilter(filter)">
            {{filter}}
            <mat-icon matChipRemove>cancel</mat-icon>
          </mat-chip>
        </mat-chip-list>
      </div>

      <div class="comercios-grid" *ngIf="!(loading$ | async); else loadingTpl">
        <mat-card *ngFor="let comercio of comercios$ | async" 
                  class="comercio-card">
          <mat-card-header>
            <mat-card-title>{{comercio.nombre}}</mat-card-title>
            <mat-card-subtitle>{{comercio.categoria}}</mat-card-subtitle>
          </mat-card-header>

          <mat-card-content>
            <p class="address">
              <mat-icon>location_on</mat-icon>
              {{comercio.direccion}}
            </p>
            <p *ngIf="comercio.distancia" class="distance">
              <mat-icon>near_me</mat-icon>
              {{comercio.distancia | number:'1.1-1'}} km
            </p>
          </mat-card-content>

          <mat-card-actions>
            <button mat-button color="primary"
                    [routerLink]="['/cliente/comercio', comercio.id_comercio]">
              Ver Productos
            </button>
          </mat-card-actions>
        </mat-card>
      </div>

      <ng-template #loadingTpl>
        <div class="loading-container">
          <mat-spinner></mat-spinner>
        </div>
      </ng-template>

      <mat-paginator [length]="totalItems"
                    [pageSize]="pageSize"
                    [pageSizeOptions]="[12, 24, 48]"
                    (page)="onPageChange($event)">
      </mat-paginator>
    </div>
  `,
  styles: [`
    .container {
      padding: 2rem;
      background-color: var(--color-light-yellow);
      min-height: calc(100vh - 64px);
    }

    .search-container {
      display: flex;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .search-field {
      flex: 1;
    }

    .filters {
      margin-bottom: 1rem;
    }

    .comercios-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .comercio-card {
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .address, .distance {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin: 0.5rem 0;
      color: rgba(0, 0, 0, 0.7);
    }

    .loading-container {
      display: flex;
      justify-content: center;
      padding: 2rem;
    }
  `]
})
export class BuscarComerciosComponent implements OnInit, OnDestroy {
  searchControl = new FormControl<string>('');
  categoryControl = new FormControl<string>('');
  categories$: Observable<any[]>;
  comercios$: Observable<Comercio[]> = new Observable<Comercio[]>();
  loading$ = new BehaviorSubject<boolean>(false);
  activeFilters: string[] = [];
  totalItems = 0;
  pageSize = 12;
  private destroy$ = new Subject<void>();

  constructor(
    private clienteService: ClienteService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.categories$ = this.clienteService.getCategorias();
    this.setupSearch();
  }

  ngOnInit() {
    this.route.queryParams.pipe(
      takeUntil(this.destroy$)
    ).subscribe(params => {
      if (params['categoria']) {
        this.categoryControl.setValue(params['categoria']);
      }
      if (params['q']) {
        this.searchControl.setValue(params['q']);
      }
      this.loadComercios();
    });
  }

  private setupSearch() {
    combineLatest([
      this.searchControl.valueChanges.pipe(startWith('')),
      this.categoryControl.valueChanges.pipe(startWith(''))
    ]).pipe(
      debounceTime(300),
      takeUntil(this.destroy$)
    ).subscribe(([search, category]) => {
      this.updateFilters(search || '', category || '');
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { q: search, categoria: category },
        queryParamsHandling: 'merge'
      });
    });
  }

  private loadComercios() {
    this.loading$.next(true);
    this.comercios$ = this.clienteService.buscarComercios({
      search: this.searchControl.value || '',
      category: this.categoryControl.value || '',
      page: 0,
      pageSize: this.pageSize
    }).pipe(
      tap((response: SearchResponse) => {
        this.totalItems = response.total;
        this.loading$.next(false);
      }),
      map((response: SearchResponse) => response.items)
    );
  }

  private updateFilters(search: string, category: string) {
    this.activeFilters = [];
    if (search) this.activeFilters.push(`Búsqueda: ${search}`);
    if (category) this.activeFilters.push(`Categoría: ${category}`);
  }

  removeFilter(filter: string) {
    if (filter.startsWith('Búsqueda')) {
      this.searchControl.setValue('');
    } else if (filter.startsWith('Categoría')) {
      this.categoryControl.setValue('');
    }
  }

  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.loadComercios();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}