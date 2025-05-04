import { Injectable } from '@angular/core';
import { BackendService } from './backend.service';
import { environment } from 'src/environments/environment';
import { Nacionalidad } from '../models/nacionalidad';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NacionalidadService {
  api = 'nacionalidad';

  constructor(private backendService: BackendService) {}

  getNacionalidad(): Observable<Nacionalidad[]> {
    return this.backendService.get(environment.apiUrl, this.api, 'listar');
  }
}