# KOTVA — systém na generovanie komiksových promptov

> **Poznámka:** Toto je návrh **samostatnej aplikácie**, nie súčasť projektu NA CESTY.
> Žije v tomto repe len dočasne, kým sa nerozhodne o rozsahu. Pri realizácii patrí
> do vlastného repozitára.
>
> Interaktívna verzia návrhu (vrátane živého prompt kompilátora):
> https://claude.ai/code/artifact/bf3002ba-25e6-472c-b639-d565a0abe4e0

Stav: v0.1 · 12. 9. 2026

---

## 1. Zadanie

Aplikácia, v ktorej sa nastavia parametre komiksu a ona z nich vygeneruje prompt.
Prompt sa potom ručne (fáza 1) alebo cez API (fáza 4) spracuje obrazovým modelom.

Kritická požiadavka: **konzistencia kresby postáv, farebnosti a štýlu v rámci celého
príbehu.**

## 2. Jadro problému

Obrazový model nemá pamäť medzi generovaniami. Každý panel je nezávislý pokus.
Konzistenciu drží výlučne množstvo identických signálov, textových aj obrazových.

Drift má tri nezávislé zdroje:

| Zdroj | Prejav | Liek |
|---|---|---|
| Preformulovanie | „tmavé vlasy po plecia" vs. „hnedý mikádo účes" → dve rôzne postavy | zámok textu |
| Chýbajúca kotva | model si tvár dopočítava nanovo (75–85 % zhody pri čisto textovom prompte) | referenčné platne |
| Kontinuita scény | roztrhaný rukáv z panelu 3 zmizne v paneli 4 | stavový stroj scény |

## 3. Princíp: štyri vrstvy, tri zamknuté

Prompt je zložený z blokov v **pevnom poradí** a mení sa **iba posledný blok**.
Prvé tri sú znak po znaku identické naprieč celým príbehom — aplikácia ich nikdy
negeneruje nanovo, iba ich vkladá.

```
[A] STYLE LOCK      médium, linka, tieňovanie, textúra, tlačový look     projekt
[B] PALETTE LOCK    uzavretý zoznam hex kódov s rolami                   projekt
[C] CAST LOCK       identita + outfit každej prítomnej postavy           postava
[D] SCENE LOCK      lokácia + variant dennej doby                        lokácia
[E] PANEL           záber, uhol, akcia, emócia, zóna pre bublinu         ← premenné
[F] TECH            pomer strán, no text, no watermark                   projekt
[G] MODEL PARAMS    --oref/--sref/--ow, sloty referencií, LoRA, seed     profil
```

**Dôsledok pre UI:** žiadne veľké textové pole „popis panelu". Výbery (postava,
outfit, lokácia, záber, emócia) + jedno krátke pole na akciu. Čím menej autor píše
voľným textom, tým menej driftu.

**Jazyk:** UI po slovensky, hodnoty zamknutých reťazcov po anglicky. Obrazové modely
sú trénované prevažne na angličtine; slovenský prompt sa interne prekladá so stratou
detailu. Slovenčina zostáva v dialógoch, ktoré sa do obrázka nikdy nedostanú.

## 4. Pyramída kotiev

Panely sa negenerujú z ničoho — generujú sa zo zamrznutých obrázkov. Poradie je
záväzné, každá vrstva používa výstup predchádzajúcej ako referenciu.

```
TIER 0  Štýlová platňa      1 obrázok  → zamrzne: style_plate.png + sref kód / seed
   │
   ├──► TIER 1  Model sheety       3+/postavu → turnaround, expressions, outfit sheet
   │
   └──► TIER 2  Platne lokácií     1–3/miesto → široký záber, varianty deň/noc
              │
              └──► TIER 3  Panely  → prompt + zoznam referenčných súborov
```

- **Tier 0** — jeden obrázok, ktorý definuje celý vizuál. Generuje sa dovtedy, kým
  nie je dokonalý, potom sa zamkne navždy.
- **Tier 1** — najdôležitejší krok celého systému. Tu sa rozhoduje, či bude komiks
  konzistentný. Všetko sa generuje so štýlovou platňou ako štýlovou referenciou.
- **Tier 2** — pozadia utekajú rovnako ako tváre. Šetrí to viac driftu, než sa čaká.
- **Tier 3** — panel dostane štýlovú platňu + model sheety prítomných postáv +
  platňu lokácie, plus vetu, ktorá modelu povie, čo je čo.

## 5. Dátový model

```
project      id, nazov, model_profil, pomer_stran, jazyk_promptu
style_lock   projekt_id, medium, linka, tienovanie, textura,
             tlac_look, negativ, sref_kod, seed, platna_subor
palette      projekt_id, rola, hex, poznamka
             -- rola: ink | papier | tien | skin_base | akcent | signal
character    projekt_id, meno, vek, vyska_cm, telo,
             tvar_tvare, oci, obocie, nos, usta, vlasy, plet_hex,
             znamenia, zakazane          -- „žiadne okuliare, žiadne náušnice"
outfit       postava_id, kod, popis, hex_1..hex_3, je_default
char_ref     postava_id, typ, subor, poradie_slotu
             -- typ: turnaround | expressions | outfit | detail
location     projekt_id, nazov, popis, svetlo_den, svetlo_noc, platna_subor
page         projekt_id, cislo, mriezka          -- „3x2", „splash"
panel        strana_id, poradie, lokacia_id, denna_doba,
             zaber, uhol, objektiv, akcia, emocia, bublina_zona,
             pomer_stran, poznamka
panel_cast   panel_id, postava_id, outfit_id, vyraz, poza, plan
             -- plan: popredie | stred | pozadie
continuity   panel_id, kluc, hodnota
             -- „rukav=roztrhnuty" — dedí sa dopredu, kým sa nezruší
dialog       panel_id, poradie, postava_id, typ, text
             -- typ: bublina | mysl | krik | sepkanie | caption | sfx
render       panel_id, prompt_text, refs_json, model, datum, subor, hodnotenie
```

Tabuľka `render` je protokol. Každý vygenerovaný obrázok si pamätá presný prompt
a presný zoznam referencií. Bez toho sa nedá opraviť jeden panel o tri týždne neskôr.

## 6. Model profily

Model je **profil** — tabuľka pravidiel (koľko referencií, ako sa zapisujú parametre,
či existuje štýlový kód). Kompilátor je spoločný pre všetky.

| Profil | Kotvenie postavy | Kotvenie štýlu | Slabina |
|---|---|---|---|
| **Nano Banana Pro** (odporúčaný štart) | až 14 refov v prompte; podľa dokumentácie ~5 postáv, ~6 objektov, ~3 štýlové refy | štýlové refy + textový zámok | seed nie je deterministický; pri 5+ refoch klesá kvalita — 2–4 čisté refy fungujú lepšie |
| **Midjourney V7** | `--oref` (1 obrázok), `--ow` 1–1000, default 100, odporúčané pod 400 | `--sref` obrázok alebo číselný kód, `--sw` 0–1000 | iba jedna postava na `--oref`; dvaja ľudia v paneli sú problém |
| **FLUX.2** | 2–10 referenčných obrázkov naraz | referenčné obrázky / štýlová LoRA | štýl treba držať refmi, nie kódom |
| **Lokálne SDXL/Flux + LoRA** (fáza 5) | character LoRA, 15–30 obrázkov | style LoRA, 30–80 obrázkov | tréning stojí čas a GPU |

**Nespoliehaj sa na seed.** Reprodukovateľnosť cez seed je naprieč poskytovateľmi
nespoľahlivá (OpenAI dokumentuje len „približne deterministické", pri Gemini
používatelia hlásia rôzne výstupy aj pri fixnom seede). Seed ukladaj do protokolu,
ale konzistenciu na ňom nestavaj. Nosná kotva je vždy referenčný obrázok.

## 7. Farebnosť

Farebnosť uteká pomaly — všimneš si to až keď položíš vedľa seba stranu 4 a stranu 19.
Riešenie požičané z animácie: **color script** namiesto voľného opisu farieb.

- Paleta má **role, nie mená**: nie „modrá", ale `tien = #2E5A63`. Do promptu ide
  pravidlo „shadows are teal #2E5A63, never grey".
- **Uzavretý zoznam**: „use only these colors" + 6–8 hexov. Menej ako 6 vyzerá
  chudobne, viac ako 10 prestane držať.
- **Pleť je zamknutá zvlášť** a patrí k postave, nie k palete. Najčastejší
  nepovšimnutý zdroj driftu.
- **Denná doba je posun, nie nová paleta** — mení sa svetlo a intenzita, nie hex kódy.
- **Kontrolná strana**: mriežka zmenšenín celej kapitoly. Drift farby vidno na
  20 náhľadoch vedľa seba okamžite; na jednom obrázku nikdy.

## 8. Lettering

Text sa do panelu **negeneruje**, aj keď to modely vedia. Slovenská diakritika sa láme,
text sa nedá opraviť bez pregenerovania, druhý jazyk = druhá generácia.

- Prompt vždy končí: `no text, no speech bubbles, no watermark, no signature`.
- Prompt obsahuje **zónu pre bublinu**: „leave clear negative space in the upper-right
  third". Kompozícia sa navrhuje s miestom na text, nie okolo neho dodatočne.
- Bubliny, captiony a SFX sú **SVG vrstva nad obrázkom** v aplikácii. Text zostáva
  v DB — editovateľný, hľadateľný, preložiteľný.
- Poradie čítania sa odvodí z poradia v `dialog`; aplikácia vie skontrolovať, či
  bubliny nejdú proti smeru čítania.

## 9. Protokol proti driftu

| Fáza | Nástroj |
|---|---|
| Pred generovaním | **Kontaktná mriežka** — pri paneli sa zobrazí model sheet postavy |
| Po generovaní | **Hodnotenie 1–5** — čo dostane 1–2, ide do fronty; hodnotenie sa ukladá k promptu, po 30 paneloch vidno, ktoré formulácie fungujú |
| Oprava | **Repair prompt** — nikdy nepregeneruj stranu: „keep composition, pose and lighting exactly; change only the coat color to #8C4A2F" + pôvodný panel ako referencia |
| Reset | **Pravidlo troch** — ak panel neprejde ani na tretí pokus, chyba je v zámku, nie v paneli. Uprav popis postavy alebo model sheet. |

## 10. Fázy

Stack ako pri NA CESTY — PHP, MariaDB, vanilla JS, žiadne frameworky. Celá appka je
formulár nad databázou + šablónový engine; ťažkú prácu robí obrazový model inde.

| Fáza | Obsah |
|---|---|
| **1** | **Bible + kompilátor.** CRUD na projekt, štýl, paletu, postavy, outfity, lokácie. Editor panelov. Prompt do schránky. Žiadne API. Rieši ~80 % problému. |
| **2** | **Knižnica referencií + strany.** Upload a správa model sheetov, priradenie slotov, mriežka strán, kontaktná mriežka kapitoly, hodnotenie, protokol renderov. |
| **3** | **Lettering.** SVG vrstva (bubliny, chvostíky, captiony, SFX), export do PNG/PDF, kontrola poradia čítania. |
| **4** | **API most.** Priame volanie modelu, dávkové generovanie strany, automatický zápis do protokolu. Voliteľne asistent na rozpis panelov z prózy — **iba do premenného bloku**, zámkov sa nesmie dotknúť. |
| **5** | **LoRA pipeline.** Export schválených panelov ako trénovacieho datasetu. Pri 25–30 dobrých obrázkoch postavy sa oplatí natrénovať vlastnú LoRA. |

**Odporúčanie k začiatku:** nezačínaj panelmi. Postav najprv Tier 0 a Tier 1 **ručne** —
jednu štýlovú platňu a model sheety pre dve postavy. Až keď uvidíš, že to drží, má
zmysel písať kód. Aplikácia má zautomatizovať postup, ktorý už raz prešiel rukou.

## 11. Overiteľnosť zdrojov

**Dobre overené** (primárna dokumentácia alebo zhoda viacerých zdrojov): limit
14 referenčných obrázkov a zoznam pomerov strán u Nano Banana; rozsahy a defaulty
`--ow` a `--sw`; 2–10 referencií u FLUX.2; veľkosti datasetov pre LoRA;
nespoľahlivosť seedu naprieč API.

**Jeden zdroj / marketingové číslo** — ber s rezervou: konkrétne percentá konzistencie
(85 %, 90 %, 92/100, 95 %) pochádzajú z blogov nástrojov a nie sú nezávisle merané.
Rozdelenie slotov u Nano Banana Pro (5 postáv / 6 objektov / 3 štýly) uvádzajú
sekundárne zdroje — pred implementáciou profilu over v aktuálnej dokumentácii.

**Rýchlo sa mení:** názvy a verzie modelov, ceny, presné limity API. Stav k 12. 9. 2026.
Časť oficiálnej dokumentácie (`ai.google.dev`, `docs.midjourney.com`) bola z prostredia
nedostupná, takže ich údaje pochádzajú zo sekundárnych zdrojov.

### Zdroje

- [Google Cloud — Ultimate prompting guide for Nano Banana](https://cloud.google.com/blog/products/ai-machine-learning/ultimate-prompting-guide-for-nano-banana) — formuly promptov, limit 14 referencií, pomery strán, rozlíšenia, sadzba textu
- [Google DeepMind — Gemini 3 Pro Image](https://deepmind.google/models/gemini-image/pro/) — oficiálna stránka modelu
- [CometAPI — Omni-Reference v Midjourney V7](https://www.cometapi.com/how-to-use-omni-reference-in-midjourney-v7/) · [Prompt Architects — `--sref`](https://prompt-architects.com/blog/214-style-references-in-midjourney-sref-explained) — syntax a rozsahy `--oref`/`--ow`/`--sref`/`--sw`
- [TaleAtelier — Midjourney for Comics](https://taleatelier.com/midjourney-for-comics) — obmedzenia naprieč verziami, typický workflow
- [FLUX.2 multi-reference](https://studio.aifilms.ai/blog/flux-2-production-image-generation) · [Phosphene — FLUX.2 face consistency](https://phosphene.cc/blog/flux-2-face-consistency-guide) — 2–10 referencií, tvorba model sheetov
- [StoryDiffusion (NeurIPS 2024)](https://arxiv.org/abs/2405.01434) — Consistent Self-Attention, akademický základ
- [StoryMaker](https://arxiv.org/pdf/2409.12576) — holistická konzistencia postáv vrátane oblečenia a pózy
- [Apatero — ComfyUI LoRA training 2026](https://www.apatero.com/blog/comfyui-lora-training-character-consistency-guide-2026) · [LoRA Training in 2026](https://aiofm.info/en/guides/lora-complete-guide) — veľkosti datasetov
- [OpenAI Community — seed a determinizmus](https://community.openai.com/t/question-about-the-use-of-seed-parameter-and-deterministic-outputs/773638) · [Google AI Developers Forum — nedeterminizmus pri fixnom seede](https://discuss.ai.google.dev/t/the-gemini-api-is-exhibiting-non-deterministic-behavior-for-the-gemini-2-5-pro-model-it-is-producing-different-outputs-for-identical-requests-even-when-a-fixed-seed-is-provided-along-with-a-constant-temperature-this-behavior-has-been-reliably-rep/101331)
- [AI Comic Factory](https://github.com/jbilcke-hf/ai-comic-factory) · [Comic Studio AI](https://github.com/RobinaMirbahar/Comic-Studio-Ai) — otvorené implementácie pipeline LLM → panel prompt → obrázok
- [LlamaGen — problém konzistencie](https://llamagen.ai/blogs/revolutionizing-comic-creation-how-llamagen-ai-solves-the-consistency-problem-in-ai-comics) · [Dashtoon Studio review](https://www.toolworthy.ai/tool/dashtoon-studio) — ako to riešia komerčné nástroje
- [Learn Prompting — Shot Types](https://learnprompting.org/docs/image_prompting/shot_type) — slovník záberov a uhlov
