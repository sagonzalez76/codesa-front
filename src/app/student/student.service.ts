import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Student } from './student.model';
import { environment } from '../../environments/environment';


@Injectable({ providedIn: 'root' })
export class StudentService {
  private apiUrl = environment.apiUrl + '/estudiantes';

  constructor(private http: HttpClient) { }

  getAllPaginated(
    page: number,
    size: number,
    sortField: string,
    sortOrder: string
  ): Observable<{ content: Student[]; totalElements: number }> {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('sort', `${sortField},${sortOrder}`);

    return this.http.get<{ content: Student[]; totalElements: number }>(this.apiUrl, { params });
  }

  getById(id: number): Observable<Student> {
    return this.http.get<Student>(`${this.apiUrl}/${id}`);
  }

  create(student: Student): Observable<Student> {
    return this.http.post<Student>(this.apiUrl, student);
  }

  update(id: number, student: Student): Observable<Student> {
    return this.http.put<Student>(`${this.apiUrl}/${id}`, student);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
