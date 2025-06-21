export default function Footer() {
  return (
    <footer className="absolute bottom-0 w-full bg-slate-800 text-white py-6">
      <div className="container mx-auto px-4 text-center">
        <p className="text-center">
          This website was made by{" "}
          <a href="https://shivam.pro" className="text-blue-400 hover:text-blue-300 underline">
            Shivam
          </a>
          . Copyright &copy; 2024 shivam.pro. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
