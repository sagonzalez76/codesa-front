import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Teacher } from './teacher.model';

@Injectable({ providedIn: 'root' })
export class TeacherService {
  private apiUrl = environment.apiUrl + '/profesores';

  constructor(private http: HttpClient) { }

  getAllPaginated(
    page: number,
    size: number,
    sortField: string,
    sortOrder: string
  ): Observable<{ content: Teacher[]; totalElements: number }> {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('sort', `${sortField},${sortOrder}`);
    return this.http.get<{ content: Teacher[]; totalElements: number }>(this.apiUrl, { params });
  }

  getById(id: number): Observable<Teacher> {
    return this.http.get<Teacher>(`${this.apiUrl}/${id}`);
  }

  create(teacher: Teacher): Observable<Teacher> {
    return this.http.post<Teacher>(this.apiUrl, teacher);
  }

  update(id: number, teacher: Teacher): Observable<Teacher> {
    return this.http.put<Teacher>(`${this.apiUrl}/${id}`, teacher);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
