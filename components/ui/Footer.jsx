export default function Footer() {
  return (
    <footer className="bg-green-600 text-white py-12 px-4">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">Preorder Makanan</h3>
            <p>
              Menyediakan makanan lezat dengan sistem preorder untuk kenyamanan
              Anda.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Kontak Kami</h3>
            <p>Email: info@preordermakanan.com</p>
            <p>Telepon: (021) 1234-5678</p>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Jam Operasional</h3>
            <p>Senin - Jumat: 08:00 - 20:00</p>
            <p>Sabtu - Minggu: 09:00 - 17:00</p>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Follow Kami</h3>
            <div className="flex space-x-4">
              <a href="#" className="hover:underline">
                Facebook
              </a>
              <a href="#" className="hover:underline">
                Instagram
              </a>
              <a href="#" className="hover:underline">
                Twitter
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 mt-8 pt-8 text-center">
          <p>
            &copy; Copyright {new Date().getFullYear()} Preorder Makanan |
            Salman Zulkarnain | All Right Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
