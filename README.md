# 🐷 Grisens spel

Små spel med en gris i huvudrollen, gjorda för (och tillsammans med) en 7-åring. På startsidan (`index.html`) väljer man spel.

**Spela:** https://albin-willman.github.io/pig-maze/

## 🍌 Bananlabyrinten (`maze.html`)

Hjälp grisen att hitta alla bananer i en mörk labyrint och ta dig sedan ut genom dörren.

### Så spelar man

- Gå med **piltangenterna** / **W A S D**, pilknapparna på skärmen, eller genom att dra med fingret på labyrinten.
- Hela labyrinten är upplyst i 3 sekunder i början av varje nivå, sedan syns bara området runt grisen.
- 🐮 **Kor** vaktar vissa bananer och vill ha ett lösenord: vad bilden de visar heter på svenska.
- 🔐 **Skattkistor** öppnas när man löser ett mattetal.
- Vissa bananer är **bluff** och räknas inte, och vissa gångar har **osynliga väggar**.
- 🚪 **Utgången** finns någonstans i labyrinten och är låst tills alla riktiga bananer är hittade. Gå igenom den när den är öppen för att klara nivån.
- 💡 **Hjälp**: när den är på lyser alla bananer (även bluffbananerna) upp var 30:e sekund och tonar sedan bort i mörkret under 5 sekunder. När dörren är öppen lyser den också i mörkret.

## 🎒 Gårdsäventyret (`quest.html`)

Hjälp mormor 👵! Gå runt på gården, plocka upp saker och tryck på två saker i väskan 🎒 för att sätta ihop dem (🪵 + 🪨 = 🪓). Ge sakerna till djuren och hindren som vill ha dem. En pratbubbla visar vad de vill ha när man kommer nära. 💡 föreslår vad man kan göra härnäst.

Varje omgång spelas på en av fyra kartor (gården, floden med en bro, skogen och fruktträdgården), som ibland är spegelvända och får nya blommor. Sakerna och djuren hamnar på nya ställen varje gång, och omgången blandas ihop av tre delar:

- **Vad mormor vill ha:** en tårta 🎂, pannkakor 🥞 eller en present 🎁 (en halsduk 🧣)
- **Vad som står i vägen:** ett omkullfallet träd 🌲 (yxa 🪓), ett spindelnät 🕸️ (kvast 🧹) eller en björn 🐻 (honung 🍯 från bina)
- **Vem som har nyckeln till grinden:** katten 🐱 (fisk 🐟), apan 🐒 (banan 🍌 från palmen) eller musen 🐭 (ost 🧀 från geten)

Innan en omgång börjar spelar spelet igenom den i huvudet för att se till att den går att klara. Allt finns som vanlig data högst upp i koden (`ITEMS`, `WHO`, `BLOCKERS`, `KEYHOLDERS`, `GOALS`, `MAPS`), så det är lätt att lägga till fler delar och kartor.

## ✈️ Flygturen (`fly.html`)

Grisen flyger ett flygplan! Håll nere **mellanslag**, **pil upp** eller **fingret** på skärmen för att flyga uppåt och släpp för att sjunka. Akta dig för marken och taket, plocka bananer 🍌 och flyg hela vägen till målet 🏁 efter 200 meter.

- Var 50:e meter byter banan miljö. Miljöerna är samma som temana i Bananlabyrinten (Trädgård, Strand, Höst, Vinter, Godis, Djungel, Rymden och Regnbåge), och varje bana får fyra av dem i slumpad ordning.
- En mätare högst upp visar hur långt grisen har kommit och vilka miljöer som kommer.
- Man har 5 liv ❤️. En krasch kostar ett liv, och sedan blinkar planet en stund och kan inte krocka.
- Ibland flyger ett hjärta ❤️ förbi som ger tillbaka ett liv.
- Det börjar brett och lugnt och blir lite svårare (snabbare och smalare) mot målet. En bana tar ungefär en minut.
- Planets färg väljs på start- och slutskärmen (tio färger, bland annat en regnbåge 🌈) och sparas.
- Rekordet (flest bananer på en klarad bana) sparas.

## 🪙 Mynt och hattar

När man klarar ett spel får man mynt:

- **Bananlabyrinten:** 6 mynt för nivå 1, ett mynt mer för varje nivå (som mest 15)
- **Gårdsäventyret:** 15 mynt
- **Flygturen:** 2 mynt för varje avklarad 50-metersdel (även om man kraschar senare), plus 5 mynt extra för att nå målet och ett mynt för var femte banan

Mynten används i **Hattbutiken**, som man öppnar med knappen "Hattar" på startsidan eller i spelen. Där finns de vanliga hattarna gratis och 19 roligare saker att köpa (allt kan vara en hatt: 🍌 🍄 🐸 🍕 🦖 🚀 🪐 …). Tryck på en hatt man inte har för att prova den på grisen först, och tryck igen (eller på köpknappen) för att köpa den. Mynt, köpta hattar och vald hatt sparas i webbläsaren och delas av alla spelen. Koden finns i `piggy.js`.

## Lägga till ett spel

Varje spel är en egen fristående HTML-sida utan beroenden eller byggsteg. Skapa en ny sida och lägg till den i listan `GAMES` i `index.html`. Ge den en 🏠-länk tillbaka till `index.html`, ladda `piggy.js` för hattar och mynt, och ge mynt med `Piggy.reward(n)` när spelet är klarat.
