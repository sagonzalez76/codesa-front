import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Course } from '../course.model';
import { CourseService } from '../course.service';
import { TeacherService } from '../../teacher/teacher.service';
import { Teacher } from '../../teacher/teacher.model';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    DropdownModule,
    ToastModule,
    ConfirmDialogModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.css']
})
export class CourseListComponent implements OnInit {
  courses: Course[] = [];
  teachers: Teacher[] = [];
  showDialog = false;
  totalRecords = 0;
  rows = 5;
  sortField: string = 'nombre';
  sortOrder: number = 1;
  loading = false;
  saving = false;
  editingCourse: Course | null = null;
  courseForm: FormGroup;
  creditOptions = Array.from({ length: 20 }, (_, i) => ({ label: (i + 1).toString(), value: i + 1 }));


  constructor(
    private fb: FormBuilder,
    private courseService: CourseService,
    private confirmationService: ConfirmationService,

    private teacherService: TeacherService,
    private messageService: MessageService
  ) {
    this.courseForm = this.fb.group({
      id: [null],
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      creditos: [1, [Validators.required, Validators.min(1)]],
      idProfesor: [null]
    });
  }

  ngOnInit(): void {
    this.loadCourses({ first: 0, rows: this.rows, sortField: this.sortField, sortOrder: this.sortOrder });
    this.loadTeachers();
  }

  loadCourses(event: any): void {

    this.loading = true;

    const page = event.first / event.rows;
    const size = event.rows;
    const sortField = event.sortField || 'nombre';
    const sortOrder = event.sortOrder === 1 ? 'asc' : 'desc';
    this.courseService.getAllPaginated(page, size, sortField, sortOrder).subscribe({
      next: res => {
        this.courses = res.content;
        this.totalRecords = res.totalElements;
        this.loading = false;
      },
      error: () => this.showError('Error al cargar cursos')
    });
  }

  loadTeachers(): void {
    this.teacherService.getAllPaginated(0, 100, 'nombre', 'asc').subscribe({
      next: (teacher) => (this.teachers = teacher.content),
      error: () => this.showError('Error al cargar profesores')
    });
  }

  createCourse(): void {
    this.editingCourse = null;
    this.courseForm.reset();
    this.showDialog = true;
  }

  editCourse(course: Course): void {
    this.editingCourse = course;
    this.courseForm.patchValue(course);
    this.showDialog = true;
  }

  saveCourse(): void {
    if (this.courseForm.invalid) return;

    this.saving = true;
    const formValue = this.courseForm.value;

    const onSuccess = (msg: string) => {
      this.showDialog = false;
      this.loadCourses({ first: 0, rows: this.rows, sortField: this.sortField, sortOrder: this.sortOrder });
      this.messageService.add({ severity: 'success', summary: 'Éxito', detail: msg });
      this.saving = false;
    };

    const onError = (msg: string) => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: msg });
      this.saving = false;
    };

    if (formValue.id) {
      this.courseService.update(formValue.id, formValue).subscribe({
        next: () => onSuccess('Curso actualizado'),
        error: () => onError('Error al actualizar curso')
      });
    } else {
      this.courseService.create(formValue).subscribe({
        next: () => onSuccess('Curso creado'),
        error: () => onError('Error al crear curso')
      });
    }
  }

  deleteCourse(id: number) {
    this.confirmationService.confirm({
      message: '¿Estás seguro de que deseas eliminar el curso?',
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.courseService.delete(id).subscribe(() => {
          this.loadCourses({ first: 0, rows: this.rows, sortField: this.sortField, sortOrder: this.sortOrder });
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Curso eliminado' });
        });
      }
    });
  }

  showError(msg: string): void {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: msg });
  }

  getTeacherName(id: number): string {
    const teacher = this.teachers.find(t => t.id === id);
    return teacher ? `${teacher.nombre} ${teacher.apellido}` : 'Sin profesor';
  }
}
