import Link from "next/link";

export default function ModernFooter() {
  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60" style={{ position: "absolute", bottom: 0, width: "100%" }}>
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col items-center justify-center space-y-2 text-center">
          <p className="text-sm text-muted-foreground">
            This website was made by{" "}
            <Link href="https://shivam.pro" className="font-medium underline underline-offset-4 hover:text-primary" target="_blank" rel="noopener noreferrer">
              Shivam
            </Link>
          </p>
          <p className="text-xs text-muted-foreground">Copyright &copy; 2024 shivam.pro. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
