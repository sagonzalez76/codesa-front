export interface ApiResponse<T = any> {
  mensaje: string;
  data?: T;
}
