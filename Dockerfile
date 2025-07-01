# Usa Node para desarrollo con Angular CLI
FROM node:18-alpine

# Establece el directorio de trabajo
WORKDIR /app

# Copia dependencias y código fuente
COPY package*.json ./
RUN npm install -g @angular/cli
RUN npm install

COPY . .

ENV NG_CLI_ANALYTICS false


# Expone el puerto 4200 para acceder desde fuera del contenedor
EXPOSE 4200

# Comando por defecto: ejecutar Angular en modo dev accesible desde el host
CMD ["ng", "serve", "--host", "0.0.0.0"]

# Para produccion, se deberia usar ngizx tambien
# # Etapa 1: Build del proyecto Angular
# FROM node:18-alpine AS build

# WORKDIR /app
# COPY . .
# RUN npm install
# RUN npm run build --configuration=production

# # Etapa 2: Servir con Nginx
# FROM nginx:1.25-alpine

# COPY --from=build /app/dist/codesa-front /usr/share/nginx/html
# COPY nginx.conf /etc/nginx/conf.d/default.conf
