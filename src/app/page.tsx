import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AuthStatus } from "@/components/auth-status";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100">
      {/* Header dengan AuthStatus */}
      <header className="w-full py-4 px-6 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-blue-900">
            PhyscaNow
          </Link>
          <AuthStatus />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-blue-900 mb-6">
              Selamat Datang di PhyscaNow
            </h1>
            <p className="text-xl text-gray-700 mb-8">
              Platform pembelajaran fisika online yang membantu siswa memahami
              konsep fisika dengan mudah dan menyenangkan.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Link href="/login">Mulai Belajar</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-blue-600 text-blue-600 hover:bg-blue-50"
              >
                <Link href="/register">Daftar Sekarang</Link>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold text-blue-800 mb-3">
                Materi Berkualitas
              </h2>
              <p className="text-gray-600">
                Akses materi pembelajaran fisika yang disusun oleh guru
                berpengalaman dan sesuai dengan kurikulum terbaru.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold text-blue-800 mb-3">
                Latihan Interaktif
              </h2>
              <p className="text-gray-600">
                Tingkatkan pemahaman dengan latihan soal interaktif dan dapatkan
                umpan balik langsung untuk setiap jawaban.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold text-blue-800 mb-3">
                Bimbingan Guru
              </h2>
              <p className="text-gray-600">
                Dapatkan bimbingan langsung dari guru fisika berpengalaman untuk
                membantu mengatasi kesulitan belajar.
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white py-8 border-t">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500">
          <p>© 2023 PhyscaNow. Hak Cipta Dilindungi.</p>
        </div>
      </footer>
    </div>
  );
}
