import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Administrativo } from './administrative.model';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class AdministrativoService {
  private apiUrl = 'http://localhost:8080/api/administrativos';

  constructor(private http: HttpClient) { }

  getAllPaginated(
    page: number,
    size: number,
    sortField: string,
    sortOrder: string
  ): Observable<{ content: Administrativo[]; totalElements: number }> {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('sort', `${sortField},${sortOrder}`);

    return this.http.get<{ content: Administrativo[]; totalElements: number }>(
      this.apiUrl,
      { params }
    );
  }

  getById(id: number): Observable<Administrativo> {
    return this.http.get<Administrativo>(`${this.apiUrl}/${id}`);
  }

  create(admin: Administrativo): Observable<Administrativo> {
    return this.http.post<Administrativo>(this.apiUrl, admin);
  }

  update(id: number, admin: Administrativo): Observable<Administrativo> {
    return this.http.put<Administrativo>(`${this.apiUrl}/${id}`, admin);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
