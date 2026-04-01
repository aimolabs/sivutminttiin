export type StylePresetId =
  | "minimal-trust"
  | "premium-dark"
  | "bold-modern"
  | "editorial-clean";

export type StylePreset = {
  id: StylePresetId;
  label: string;
  description: string;
  visual: {
    theme: "light" | "dark";
    accent: string;
    radius: "soft" | "sharp";
  };
  copy: {
    tone: string;
    ctaStyle: string;
  };
  layout: {
    density: "compact" | "spacious";
    emphasis: "conversion" | "brand" | "content";
  };
};

export const STYLE_PRESETS: Record<StylePresetId, StylePreset> = {
  "minimal-trust": {
    id: "minimal-trust",
    label: "Minimal Trust",
    description: "Selkeä, luottamusta rakentava ja rauhallinen palvelusivusto",
    visual: {
      theme: "light",
      accent: "neutral",
      radius: "soft"
    },
    copy: {
      tone: "calm",
      ctaStyle: "low-pressure"
    },
    layout: {
      density: "spacious",
      emphasis: "conversion"
    }
  },
  "premium-dark": {
    id: "premium-dark",
    label: "Premium Dark",
    description: "Tumma, moderni ja premium-fiilinen kokonaisuus",
    visual: {
      theme: "dark",
      accent: "violet",
      radius: "soft"
    },
    copy: {
      tone: "confident",
      ctaStyle: "focused"
    },
    layout: {
      density: "spacious",
      emphasis: "brand"
    }
  },
  "bold-modern": {
    id: "bold-modern",
    label: "Bold Modern",
    description: "Rohkea, nopea ja moderni kaupallinen ilme",
    visual: {
      theme: "light",
      accent: "blue",
      radius: "sharp"
    },
    copy: {
      tone: "direct",
      ctaStyle: "aggressive"
    },
    layout: {
      density: "compact",
      emphasis: "conversion"
    }
  },
  "editorial-clean": {
    id: "editorial-clean",
    label: "Editorial Clean",
    description: "Sisältöpainotteinen ja rauhallinen editorial-tyyli",
    visual: {
      theme: "light",
      accent: "gray",
      radius: "soft"
    },
    copy: {
      tone: "informative",
      ctaStyle: "subtle"
    },
    layout: {
      density: "spacious",
      emphasis: "content"
    }
  }
};
