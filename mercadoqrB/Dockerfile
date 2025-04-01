# ==========================
# 🌟 Etapa 1: Compilación
# ==========================
FROM node:20-alpine AS builder
WORKDIR /app

# Copia solo los archivos de dependencias para aprovechar caché
COPY package*.json ./
RUN npm ci  # Instala todas las dependencias (incluyendo devDependencies)

# Copia el resto del código
COPY . .

# Compila el código (por ejemplo, si usas TypeScript o Webpack)
RUN npm run build

# ==========================
# 🚀 Etapa 2: Producción
# ==========================
FROM node:20-alpine
WORKDIR /app

# Variables de entorno (opcional)
#ENV NODE_ENV=production

# Copia solo los archivos de dependencias y las instala sin devDependencies
COPY package*.json ./
RUN npm ci --omit=dev  # Instala solo dependencias de producción

# Copia SOLO el código compilado desde la etapa anterior
COPY --from=builder /app/dist ./dist

# Opcional: Usuario sin privilegios para mayor seguridad
#RUN addgroup -S appgroup && adduser -S appuser -G appgroup
#USER appuser

# Expone el puerto en el que corre la aplicación
EXPOSE 8080

# Comando de inicio de la app
CMD ["node", "dist/srv.js"]
