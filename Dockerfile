# Menggunakan image Node.js LTS
FROM node:18

# Mengatur direktori kerja di dalam container
WORKDIR /app

# Menyalin file package.json dan package-lock.json ke dalam container
COPY package*.json ./

# Menginstal dependensi aplikasi
RUN npm install

# Menyalin semua file proyek ke dalam direktori kerja di container
COPY . .

# Menjalankan server dari folder "server"
WORKDIR /app/server

# Mengekspos port yang akan digunakan oleh aplikasi
EXPOSE 3000

# Menjalankan aplikasi
CMD ["node", "server.js"]
