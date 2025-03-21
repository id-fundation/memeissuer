# Используем Node.js образ
FROM node:18-alpine

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package.json package-lock.json ./

# Устанавливаем зависимости
RUN npm install --frozen-lockfile


# Копируем остальные файлы проекта
COPY . .


# Указываем порт
EXPOSE 3000

# Запускаем сервер
CMD ["npm", "run", "dev"]