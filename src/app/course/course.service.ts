import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Course } from './course.model';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpParams } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class CourseService {
  private apiUrl = environment.apiUrl + '/cursos';

  constructor(private http: HttpClient) { }

  getAllPaginated(
    page: number,
    size: number,
    sortField: string,
    sortOrder: string
  ): Observable<{ content: Course[]; totalElements: number }> {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('sort', `${sortField},${sortOrder}`);

    return this.http.get<{ content: Course[]; totalElements: number }>(this.apiUrl, { params });
  }

  getById(id: number): Observable<Course> {
    return this.http.get<Course>(`${this.apiUrl}/${id}`);
  }

  create(course: Course): Observable<Course> {
    return this.http.post<Course>(this.apiUrl, course);
  }

  update(id: number, course: Course): Observable<Course> {
    return this.http.put<Course>(`${this.apiUrl}/${id}`, course);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
