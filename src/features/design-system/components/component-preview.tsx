import { Bell, BookOpen, Download, Sparkles } from "lucide-react";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Field,
  Input,
  Select,
  Textarea,
} from "@/components/ui";
import { cn } from "@/lib/utils";

/** The same components rendered under a forced theme scope, so both modes are visible at once. */
export function ComponentPreview({ theme }: { theme: "light" | "dark" }) {
  return (
    <div
      className={cn(
        theme,
        "relative isolate overflow-hidden rounded-2xl border bg-background p-6 text-foreground md:p-8",
      )}
    >
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="absolute -start-20 -top-24 size-80 rounded-full bg-[radial-gradient(circle,var(--aurora-1),transparent_65%)] blur-2xl" />
        <div className="absolute -end-24 bottom-0 size-80 rounded-full bg-[radial-gradient(circle,var(--aurora-2),transparent_65%)] blur-2xl" />
      </div>
      <p className="mb-6 text-xs font-semibold tracking-[0.3em] text-brand uppercase">
        {theme}
      </p>
      <div className="grid gap-6">
        <div className="flex flex-wrap gap-2">
          <Button>
            <Sparkles aria-hidden />
            Primary
          </Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="glass">Glass</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
          <Button loading>Loading</Button>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge>Neutral</Badge>
          <Badge tone="brand">Brand</Badge>
          <Badge tone="secondary">Secondary</Badge>
          <Badge tone="success">Success</Badge>
          <Badge tone="warning">Warning</Badge>
          <Badge tone="danger">Danger</Badge>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Glass card</CardTitle>
            <CardDescription>Frosted surface over the aurora backdrop.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Field label="Email" htmlFor={`${theme}-email`} hint="We never share it.">
              <Input id={`${theme}-email`} placeholder="you@example.com" />
            </Field>
            <Field label="Level" htmlFor={`${theme}-level`}>
              <Select id={`${theme}-level`} defaultValue="b2">
                <option value="b1">B1 · Intermediate</option>
                <option value="b2">B2 · Upper-intermediate</option>
              </Select>
            </Field>
            <Field
              label="Invalid"
              htmlFor={`${theme}-bad`}
              error="This field is required."
            >
              <Textarea id={`${theme}-bad`} aria-invalid />
            </Field>
          </CardContent>
        </Card>
        <div className="flex items-center gap-4 rounded-xl p-4 glass-strong">
          <span className="grid size-11 place-items-center rounded-full bg-primary text-primary-foreground">
            <BookOpen className="size-5" aria-hidden />
          </span>
          <div className="flex-1">
            <p className="font-medium">Strong glass</p>
            <p className="text-sm text-muted-foreground">For overlays on busy content.</p>
          </div>
          <Button size="icon" variant="glass" aria-label="Download">
            <Download />
          </Button>
          <Button size="icon" variant="ghost" aria-label="Notifications">
            <Bell />
          </Button>
        </div>
      </div>
    </div>
  );
}
