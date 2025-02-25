# Panduan Docker untuk PhyscaNow

Docker adalah alat yang memungkinkan kita untuk menjalankan aplikasi dalam kontainer yang terisolasi. Berikut adalah panduan sederhana untuk menggunakan Docker dengan PhyscaNow.

## Prasyarat

1. Install [Docker Desktop](https://www.docker.com/products/docker-desktop/) di komputer Anda
2. Pastikan Docker sudah berjalan (ikon Docker di taskbar berwarna hijau)

## Cara Menjalankan Aplikasi dengan Docker

### Untuk Pengembangan (Development)

1. Buka terminal/command prompt
2. Arahkan ke folder proyek PhyscaNow
3. Jalankan perintah:

```bash
docker-compose up
```

4. Tunggu sampai proses selesai (biasanya memerlukan waktu beberapa menit untuk pertama kali)
5. Akses aplikasi di browser: http://localhost:3000

### Untuk Mode Produksi

1. Buka terminal/command prompt
2. Arahkan ke folder proyek PhyscaNow
3. Jalankan perintah:

```bash
docker build -t physcanow-prod .
docker run -p 3000:3000 physcanow-prod
```

4. Akses aplikasi di browser: http://localhost:3000

## Perintah Docker yang Berguna

### Menjalankan di Background

```bash
docker-compose up -d
```

### Menghentikan Container

```bash
docker-compose down
```

### Melihat Container yang Berjalan

```bash
docker ps
```

### Melihat Log Aplikasi

```bash
docker-compose logs -f app
```

### Menjalankan Perintah di Container

```bash
docker-compose exec app bun run prisma db push
```

## Memahami Konfigurasi Docker

1. **Dockerfile** - Berisi instruksi untuk membuat image Docker produksi
2. **Dockerfile.dev** - Khusus untuk pengembangan (lebih cepat)
3. **docker-compose.yml** - Mengatur cara container berjalan bersama-sama
4. **.dockerignore** - Menentukan file yang tidak perlu disertakan dalam image

## Troubleshooting

### Masalah Koneksi Database

Jika aplikasi tidak dapat terhubung ke database, pastikan container database sudah berjalan:

```bash
docker-compose ps
```

Jika perlu restart database:

```bash
docker-compose restart db
```

### Container Tidak Ingin Berhenti

```bash
docker-compose down --remove-orphans
```

### Perubahan Tidak Terlihat

Coba rebuild container:

```bash
docker-compose up --build
```
