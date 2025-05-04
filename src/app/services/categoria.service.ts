import { Injectable } from '@angular/core';
import { BackendService } from './backend.service';
import { environment } from 'src/environments/environment';
import { Categoria } from '../models/categoria';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  api = 'categoria';

  constructor(private readonly backendService: BackendService) {}

  getCategorias(): Observable<Categoria[]> {
    return this.backendService.get(environment.apiUrl, this.api, 'listar');
  }
}