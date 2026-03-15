'use client';

import Counter from "../Counter";
import StaggerChildren, { StaggerItem } from "../StaggerChildren";

export default function SocialProof() {
  return (
    <section className="border-y border-border bg-muted/30">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <StaggerChildren className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: 12000, suffix: "+", label: "Stories created" },
            { value: 98, suffix: "%", label: "Parent satisfaction" },
            { value: 40, suffix: "+", label: "Illustration styles" },
            { value: 15, suffix: " languages", label: "Supported" },
          ].map(({ value, suffix, label }) => (
            <StaggerItem key={label}>
              <div className="text-3xl font-bold text-foreground">
                <Counter target={value} suffix={suffix} />
              </div>
              <div className="text-sm text-muted-foreground mt-1">{label}</div>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
}