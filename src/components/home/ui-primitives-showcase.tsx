"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { SearchInput } from "@/components/ui/search-input";
import { Text } from "@/components/ui/text";
import type { Dictionary } from "@/i18n/get-dictionary";

type UiPrimitivesShowcaseProps = {
  labels: Dictionary["home"]["uiShowcase"];
};

export function UiPrimitivesShowcase({ labels }: UiPrimitivesShowcaseProps) {
  const emailId = useId();
  const passwordId = useId();
  const [demoLoading, setDemoLoading] = useState(false);
  const demoBtnTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (demoBtnTimerRef.current != null) {
        clearTimeout(demoBtnTimerRef.current);
      }
    },
    [],
  );

  return (
    <article className="rounded-2xl border border-border/70 bg-background/80 p-5 shadow-soft lg:col-span-2">
      <h3 className="text-lg font-semibold text-foreground">{labels.title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{labels.subtitle}</p>

      <div className="mt-6 grid gap-8 lg:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {labels.text}
          </p>
          <div className="mt-3 space-y-3 rounded-xl border border-border/50 bg-panel/50 p-4">
            <Text variant="heading">{labels.headingSample}</Text>
            <Text variant="body">{labels.bodySample}</Text>
            <Text variant="caption">{labels.captionSample}</Text>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {labels.buttons}
          </p>
          <div className="mt-3 flex flex-wrap gap-2 rounded-xl border border-border/50 bg-panel/50 p-4">
            <Button type="button" variant="primary" size="sm">
              Primary
            </Button>
            <Button type="button" variant="secondary" size="sm">
              Secondary
            </Button>
            <Button type="button" variant="ghost" size="sm">
              Ghost
            </Button>
            <Button type="button" variant="danger" size="sm">
              Danger
            </Button>
            <Button type="button" variant="primary" size="md" disabled>
              Disabled
            </Button>
            <Button
              type="button"
              variant="primary"
              size="md"
              loading={demoLoading}
              onClick={() => {
                if (demoBtnTimerRef.current != null) {
                  clearTimeout(demoBtnTimerRef.current);
                }
                setDemoLoading(true);
                demoBtnTimerRef.current = setTimeout(() => {
                  setDemoLoading(false);
                  demoBtnTimerRef.current = null;
                }, 2000);
              }}
            >
              {labels.loadingDemoButton}
            </Button>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {labels.inputs}
          </p>
          <Card padding="sm" className="mt-3 border-border/50 bg-panel/50">
            <div className="space-y-3">
              <Input
                placeholder={labels.emailPlaceholder}
                aria-label={labels.emailLabel}
              />
              <Input
                disabled
                placeholder={labels.emailPlaceholder}
                aria-label={labels.emailLabel}
              />
              <Input
                error
                placeholder={labels.emailPlaceholder}
                aria-label={labels.emailLabel}
              />
            </div>
          </Card>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {labels.composed}
          </p>
          <Card padding="sm" className="mt-3 border-border/50 bg-panel/50">
            <div className="space-y-4">
              <FormField
                label={labels.emailLabel}
                htmlFor={emailId}
                error={labels.sampleError}
              >
                <Input
                  id={emailId}
                  error
                  type="email"
                  placeholder={labels.emailPlaceholder}
                />
              </FormField>
              <FormField label={labels.passwordLabel} htmlFor={passwordId}>
                <PasswordInput id={passwordId} autoComplete="new-password" />
              </FormField>
              <SearchInput
                placeholder={labels.searchPlaceholder}
                aria-label={labels.searchPlaceholder}
              />
            </div>
          </Card>
        </div>
      </div>
    </article>
  );
}
