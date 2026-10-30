import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import type { ReactNode } from "react";

/* Email clients don't support CSS variables; these mirror the primitive palette. */
const palette = {
  oat: "#fbf8f3",
  oatDeep: "#e2d8cb",
  mulberry: "#56061d",
  midnight: "#022e4a",
  reverie: "#507593",
};

type EmailLayoutProps = {
  preview: string;
  heading: string;
  brand: string;
  dir?: "ltr" | "rtl";
  lang?: string;
  children: ReactNode;
  action?: { label: string; href: string };
  footer?: string;
};

export function EmailLayout({
  preview,
  heading,
  brand,
  dir = "ltr",
  lang = "en",
  children,
  action,
  footer,
}: EmailLayoutProps) {
  return (
    <Html lang={lang} dir={dir}>
      <Head />
      <Preview>{preview}</Preview>
      <Body
        style={{
          backgroundColor: palette.oat,
          fontFamily: "Helvetica, Arial, sans-serif",
          padding: "32px 0",
        }}
      >
        <Container
          style={{
            backgroundColor: "#ffffff",
            border: `1px solid ${palette.oatDeep}`,
            borderRadius: 20,
            padding: "40px 36px",
            maxWidth: 520,
          }}
        >
          <Text
            style={{
              color: palette.mulberry,
              fontSize: 13,
              letterSpacing: 3,
              textTransform: "uppercase",
              margin: 0,
            }}
          >
            {brand}
          </Text>
          <Heading
            style={{
              color: palette.midnight,
              fontFamily: "Georgia, serif",
              fontSize: 28,
              fontWeight: 400,
              margin: "16px 0 8px",
            }}
          >
            {heading}
          </Heading>
          <Section style={{ color: palette.midnight, fontSize: 15, lineHeight: "24px" }}>
            {children}
          </Section>
          {action ? (
            <Section style={{ margin: "28px 0" }}>
              <Button
                href={action.href}
                style={{
                  backgroundColor: palette.mulberry,
                  color: palette.oat,
                  borderRadius: 999,
                  padding: "14px 28px",
                  fontSize: 15,
                  textDecoration: "none",
                }}
              >
                {action.label}
              </Button>
            </Section>
          ) : null}
          {footer ? (
            <>
              <Hr style={{ borderColor: palette.oatDeep, margin: "28px 0 16px" }} />
              <Text
                style={{
                  color: palette.reverie,
                  fontSize: 12,
                  lineHeight: "18px",
                  margin: 0,
                }}
              >
                {footer}
              </Text>
            </>
          ) : null}
        </Container>
      </Body>
    </Html>
  );
}

export { Text as EmailText };
