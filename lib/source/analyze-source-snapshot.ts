import type { NormalizedSourceSnapshot } from "./normalize-source-snapshot";

export type AuditIssue = {
  title: string;
  detail: string;
};

export type SuggestedSection = {
  name: string;
  reason: string;
};

export type SourceAnalysis = {
  auditIssues: AuditIssue[];
  suggestedSections: SuggestedSection[];
};

function pushIssue(
  issues: AuditIssue[],
  title: string,
  detail: string
) {
  issues.push({ title, detail });
}

function pushSuggestion(
  suggestions: SuggestedSection[],
  name: string,
  reason: string
) {
  suggestions.push({ name, reason });
}

export function analyzeSourceSnapshot(
  snapshot: NormalizedSourceSnapshot,
  companyName: string
): SourceAnalysis {
  const auditIssues: AuditIssue[] = [];
  const suggestedSections: SuggestedSection[] = [];

  if (snapshot.fetchStatus === "fallback") {
    pushIssue(
      auditIssues,
      "Lähdesivun signaaleja ei saatu haettua luotettavasti",
      `${companyName} brief jouduttiin rakentamaan fallback-logiikalla. Tämä heikentää analyysin tarkkuutta ja lisää geneerisen tulkinnan riskiä.`
    );

    pushSuggestion(
      suggestedSections,
      "Selkeä hero + ensisijainen CTA",
      "Kun lähdesignaalit ovat epävarmat, etusivun tärkein tehtävä on tehdä arvolupauksesta ja seuraavasta askeleesta mahdollisimman selkeä."
    );
  }

  if (!snapshot.pageTitle) {
    pushIssue(
      auditIssues,
      "Sivun title-signaali puuttuu tai jäi epäselväksi",
      "Nykyisestä sivusta ei saatu selkeää page title -signaalia. Tämä heikentää sekä hakukonenäkymää että ensivaikutelman johdonmukaisuutta."
    );
  }

  if (!snapshot.metaDescription) {
    pushIssue(
      auditIssues,
      "Meta description puuttuu tai ei välity selkeästi",
      `${companyName} sivulta ei löytynyt käyttökelpoista meta-kuvausta. Tämä viittaa siihen, että hakutuloksessa näkyvä viesti ei välttämättä tue klikkausta tai arvolupausta riittävästi.`
    );
  }

  if (!snapshot.h1) {
    pushIssue(
      auditIssues,
      "Etusivun pääotsikko ei näy rakenteellisesti selkeänä",
      "Nykyisestä sivusta ei löytynyt käyttökelpoista H1-signaalia. Tämä viittaa siihen, että pääviesti ei välttämättä lukitu nopeasti käyttäjälle eikä hakukoneelle."
    );
  }

  if (snapshot.h2s.length === 0) {
    pushIssue(
      auditIssues,
      "Sisältöhierarkia jää ohueksi",
      "Sivulta ei löytynyt käyttökelpoisia H2-signaaleja. Tämä viittaa siihen, että palvelut, hyödyt tai luottamusta rakentavat sisällöt eivät ehkä jäsenny selkeästi."
    );
  } else if (snapshot.h2s.length <= 2) {
    pushIssue(
      auditIssues,
      "Sisällön teemat näyttävät jäävän liian kapeiksi",
      "Nykyiseltä sivulta löytyi vain vähän selkeitä H2-tason sisältösignaaleja. Tämä voi tarkoittaa, että palvelu- tai hyötyrakenne jää käyttäjälle liian ohueksi."
    );
  }

  if (snapshot.ctaTexts.length === 0) {
    pushIssue(
      auditIssues,
      "Toimintakehote ei erotu nykyiseltä sivulta",
      "Nykyisestä sivusta ei löytynyt selkeitä CTA-signaaleja. Tämä on vahva merkki siitä, että konversiopolku jää liian heikoksi tai hajanaiseksi."
    );
  } else if (snapshot.ctaTexts.length === 1) {
    pushIssue(
      auditIssues,
      "CTA-logiikka näyttää liian ohuelta",
      "Sivulta löytyi vain yksi käyttökelpoinen CTA-signaali. Tämä voi tarkoittaa, että käyttäjän etenemispolku ei ole riittävän näkyvä tai toistuva."
    );
  }

  if (
    snapshot.companyNameCandidate.toLowerCase() === snapshot.domain.toLowerCase() ||
    snapshot.companyNameCandidate.length < 3
  ) {
    pushIssue(
      auditIssues,
      "Brändisignaali jää epävarmaksi",
      "Yritysnimi ei erotu lähdesivuista täysin vakuuttavasti. Tämä heikentää sekä uskottavuutta että kokonaisuuden muistettavuutta."
    );
  }

  if (snapshot.ctaTexts.length <= 1) {
    pushSuggestion(
      suggestedSections,
      "Vahva CTA useampaan kohtaan sivua",
      "Kun nykyiset CTA-signaalit jäävät heikoiksi, redesignissa yhteydenotto tai tarjouspyyntö pitää nostaa näkyviin useammin ja selkeämmin."
    );
  }

  if (snapshot.h2s.length <= 2) {
    pushSuggestion(
      suggestedSections,
      "Selkeä palvelu- tai sisältörakenne",
      "Nykyinen sivu ei näytä jäsentävän sisältöä riittävän vahvasti. Redesignissa palvelut tai pääteemat pitää tehdä heti hahmotettaviksi."
    );
  }

  if (!snapshot.metaDescription || !snapshot.pageTitle) {
    pushSuggestion(
      suggestedSections,
      "Hakutulosta tukeva hero ja viestirakenne",
      "Kun nykyiset metadata-signaalit ovat heikot, uuden etusivun pääviestin pitää olla tavallista tarkemmin johdettu hakua ja ensivaikutelmaa varten."
    );
  }

  if (snapshot.navItems.length <= 3) {
    pushSuggestion(
      suggestedSections,
      "Selkeä sivukartta ja navigaatiologiikka",
      "Niukat navigaatiosignaalit viittaavat siihen, että sivurakenne voi jäädä liian ohueksi tai epäselväksi käyttäjälle."
    );
  }

  if (snapshot.h2s.length >= 3) {
    pushSuggestion(
      suggestedSections,
      "Nykyisten sisältöteemojen uudelleenjärjestely",
      "Lähdesivulta löytyi jo käyttökelpoisia sisältöteemoja. Redesignissa niitä kannattaa jäsentää uudelleen selkeämmäksi myyntirakenteeksi."
    );
  }

  if (auditIssues.length === 0) {
    pushIssue(
      auditIssues,
      "Nykyinen sivu sisältää jo käyttökelpoisia signaaleja, mutta rakenne ei vielä tue niitä maksimaalisesti",
      "Sivulta löytyi useita käyttökelpoisia sisältö- ja CTA-signaaleja. Redesignin tehtävä on tehdä niistä selkeämpi, uskottavampi ja kaupallisempi kokonaisuus."
    );
  }

  if (suggestedSections.length === 0) {
    pushSuggestion(
      suggestedSections,
      "Selkeä hero + palvelut + luottamussisältö + CTA",
      "Vaikka lähdesivu sisältää jo hyviä signaaleja, redesignissa niiden järjestys ja painotus pitää tehdä huomattavasti selkeämmäksi."
    );
  }

  return {
    auditIssues: auditIssues.slice(0, 4),
    suggestedSections: suggestedSections.slice(0, 5)
  };
}
