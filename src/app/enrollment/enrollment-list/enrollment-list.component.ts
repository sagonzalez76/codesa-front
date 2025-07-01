import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EnrollmentService } from '../enrollment.service';
import { StudentService } from '../../student/student.service';
import { CourseService } from '../../course/course.service';
import { Student } from '../../student/student.model';
import { Course } from '../../course/course.model';
import { Enrollment } from '../enrollment.model';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-enrollment-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    DialogModule,
    CalendarModule,
    DropdownModule,
    ToastModule,
    ConfirmDialogModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './enrollment-list.component.html',
  styleUrls: ['./enrollment-list.component.css']
})
export class EnrollmentListComponent implements OnInit {
  enrollments: Enrollment[] = [];
  students: Student[] = [];
  courses: Course[] = [];
  enrollmentForm: FormGroup;
  showDialog = false;
  saving = false;
  loading = false;
  rows = 5;
  totalRecords = 0;
  sortField = 'fechaInscripcion';
  sortOrder = -1;
  editingEnrollment: Enrollment | null = null;

  constructor(
    private fb: FormBuilder,
    private enrollmentService: EnrollmentService,
    private studentService: StudentService,
    private courseService: CourseService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    this.enrollmentForm = this.fb.group({
      id: [null],
      idEstudiante: [null, Validators.required],
      idCurso: [null, Validators.required],
      fechaInscripcion: [new Date(), Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadEnrollments({ first: 0, rows: this.rows });
    this.loadStudents();
    this.loadCourses();
  }

  loadEnrollments(event: any): void {
    this.loading = true;
    const page = event.first / event.rows;
    const size = event.rows;
    const sortField = this.sortField;
    const sortOrder = this.sortOrder === 1 ? 'asc' : 'desc';

    this.enrollmentService.getAllPaginated(page, size, sortField, sortOrder).subscribe({
      next: (res) => {
        this.enrollments = res.content;
        this.totalRecords = res.totalElements;
        this.loading = false;
      },
      error: () => this.showError('Error al cargar inscripciones')
    });
  }

  loadStudents(): void {
    this.studentService.getAllPaginated(0, 100, 'nombre', 'asc').subscribe({
      next: (res) => (this.students = res.content),
      error: () => this.showError('Error al cargar estudiantes')
    });
  }

  loadCourses(): void {
    this.courseService.getAllPaginated(0, 100, 'nombre', 'asc').subscribe({
      next: (res) => (this.courses = res.content),
      error: () => this.showError('Error al cargar cursos')
    });
  }

  createEnrollment(): void {
    this.editingEnrollment = null;
    this.enrollmentForm.reset();
    this.enrollmentForm.patchValue({ fechaInscripcion: new Date() });
    this.showDialog = true;
  }

  editEnrollment(enrollment: Enrollment): void {
    this.editingEnrollment = enrollment;
    this.enrollmentForm.patchValue(enrollment);
    this.showDialog = true;
  }

  saveEnrollment(): void {
    if (this.enrollmentForm.invalid) return;

    this.saving = true;
    const formValue = this.enrollmentForm.value;

    const successHandler = (msg: string) => {
      this.showDialog = false;
      this.loadEnrollments({ first: 0, rows: this.rows });
      this.messageService.add({ severity: 'success', summary: 'Éxito', detail: msg });
      this.saving = false;
    };

    const errorHandler = (msg: string) => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: msg });
      this.saving = false;
    };

    if (formValue.id) {
      this.enrollmentService.update(formValue.id, formValue).subscribe({
        next: () => successHandler('Inscripción actualizada'),
        error: () => errorHandler('Error al actualizar la inscripción')
      });
    } else {
      this.enrollmentService.create(formValue).subscribe({
        next: () => successHandler('Inscripción creada'),
        error: () => errorHandler('Error al crear inscripción')
      });
    }
  }

  deleteEnrollment(id: number): void {
    this.confirmationService.confirm({
      message: '¿Estás seguro de eliminar esta inscripción?',
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.enrollmentService.delete(id).subscribe(() => {
          this.loadEnrollments({ first: 0, rows: this.rows });
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Inscripción eliminada' });
        });
      }
    });
  }

  getStudentName(id: number): string {
    const student = this.students.find(e => e.id === id);
    return student ? `${student.nombre} ${student.apellido}` : 'Sin estudiante';
  }

  getCourseName(id: number): string {
    const course = this.courses.find(c => c.id === id);
    return course ? course.nombre : 'Sin curso';
  }

  showError(msg: string): void {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: msg });
  }
}
