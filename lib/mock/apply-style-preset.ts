
export type PresetAdjustedContent = {
  heroHeadline: string;
  heroSubheadline: string;
  primaryCta: string;
  secondaryCta: string;
  aboutTitle: string;
  aboutBody: string;
  testimonialsTitle: string;
};

type ApplyStylePresetInput = {
  stylePreset: string;
  companyName: string;
  industryLabel: string;
  baseHeadline: string;
  baseSubheadline: string;
  baseAboutBody: string;
};

export function applyStylePresetToContent({
  stylePreset,
  companyName,
  industryLabel,
  baseHeadline,
  baseSubheadline,
  baseAboutBody
}: ApplyStylePresetInput): PresetAdjustedContent {
  switch (stylePreset) {
    case "minimal-trust":
      return {
        heroHeadline: baseHeadline,
        heroSubheadline: `${baseSubheadline} Tavoitteena on tehdä ensivaikutelmasta rauhallinen, selkeä ja helposti lähestyttävä.`,
        primaryCta: "Pyydä arvio",
        secondaryCta: "Tutustu palveluihin",
        aboutTitle: "Miksi tämä suunta toimii",
        aboutBody: `${baseAboutBody} Minimal Trust -suunta painottaa selkeyttä, rauhallista luottamusta ja matalaa kynnystä ottaa yhteyttä.`,
        testimonialsTitle: "Luottamusta rakentavat signaalit"
      };

    case "premium-dark":
      return {
        heroHeadline: `${companyName} tarvitsee verkkosivun, joka tuntuu premiumilta jo ensisilmäyksellä.`,
        heroSubheadline: `${baseSubheadline} Tässä suunnassa painotus on vahvassa ensivaikutelmassa, tummassa premium-ilmeessä ja selkeässä kaupallisessa rakenteessa.`,
        primaryCta: "Pyydä tarjous",
        secondaryCta: "Katso konsepti",
        aboutTitle: "Miksi tämä premium-suunta toimii",
        aboutBody: `${baseAboutBody} Premium Dark tekee ${industryLabel.toLowerCase()}-yrityksestä uskottavamman, modernimman ja arvokkaamman tuntuisen ilman että rakenne muuttuu raskaaksi.`,
        testimonialsTitle: "Premium-vaikutelmaa tukevat elementit"
      };

    case "bold-modern":
      return {
        heroHeadline: `${companyName} tarvitsee rohkeamman sivun, joka tekee arvon näkyväksi heti.`,
        heroSubheadline: `${baseSubheadline} Tässä suunnassa sisältöä tiivistetään, viestiä terävöitetään ja CTA:t nostetaan vahvemmin näkyviin.`,
        primaryCta: "Aloita projekti",
        secondaryCta: "Katso palvelut",
        aboutTitle: "Miksi tämä rohkea suunta toimii",
        aboutBody: `${baseAboutBody} Bold Modern korostaa nopeaa ymmärrettävyyttä, vahvaa kaupallista rytmiä ja modernia vaikutelmaa.`,
        testimonialsTitle: "Miksi tämä näyttää vahvemmalta"
      };

    case "editorial-clean":
      return {
        heroHeadline: `${companyName} tarvitsee harkitumman sivun, jossa sisältö kantaa vaikutelman.`,
        heroSubheadline: `${baseSubheadline} Tässä suunnassa painotetaan sisältöhierarkiaa, rauhallista typografiaa ja harkittua rytmiä.`,
        primaryCta: "Tutustu tarkemmin",
        secondaryCta: "Katso rakenne",
        aboutTitle: "Miksi tämä editorial-suunta toimii",
        aboutBody: `${baseAboutBody} Editorial Clean tekee kokonaisuudesta harkitumman ja sisällöllisesti vakuuttavamman ilman geneeristä template-fiilistä.`,
        testimonialsTitle: "Sisältöä tukevat havainnot"
      };

    default:
      return {
        heroHeadline: baseHeadline,
        heroSubheadline: baseSubheadline,
        primaryCta: "Pyydä tarjous",
        secondaryCta: "Katso palvelut",
        aboutTitle: "Miksi tämä konsepti toimii paremmin",
        aboutBody: baseAboutBody,
        testimonialsTitle: "Luottamus näkyväksi"
      };
  }
}
