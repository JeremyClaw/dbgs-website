import { Button } from "@/components/ui/Button";

export function InlineCTA({ text }: { text: string }) {
  return (
    <div className="flex flex-col items-center text-center gap-4 mt-14 pt-10 border-t border-black/10">
      <p className="text-lg font-semibold">{text}</p>
      <Button href="#fit" variant="primary">
        See If We're A Fit →
      </Button>
    </div>
  );
}
