import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer>
      <div className="max-w-6xl mx-auto px-6">
        <Separator />
        <div className="flex items-center justify-between py-6 text-sm text-muted-foreground">
          <span>Built on Midnight Network</span>
          <span>PrivateDrop &copy; 2025</span>
        </div>
      </div>
    </footer>
  );
}
