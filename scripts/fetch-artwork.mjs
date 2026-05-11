import { mkdir, rm, writeFile } from "node:fs/promises";

const albums = [
  ["college-dropout", "Kanye West The College Dropout", ["the college dropout"]],
  ["late-registration", "Kanye West Late Registration", ["late registration"]],
  ["graduation", "Kanye West Graduation", ["graduation"]],
  ["808s-heartbreak", "Kanye West 808s Heartbreak", ["808s & heartbreak", "808s and heartbreak"]],
  ["mbdtf", "Kanye West My Beautiful Dark Twisted Fantasy", ["my beautiful dark twisted fantasy"]],
  ["watch-the-throne", "Jay-Z Kanye West Watch the Throne", ["watch the throne"]],
  ["cruel-summer", "GOOD Music Cruel Summer", ["cruel summer"]],
  ["yeezus", "Kanye West Yeezus", ["yeezus"]],
  ["life-of-pablo", "Kanye West The Life of Pablo", ["the life of pablo"]],
  ["ye", "Kanye West Ye", ["ye"]],
  ["kids-see-ghosts", "Kids See Ghosts Kids See Ghosts", ["kids see ghosts"]],
  ["jesus-is-king", "Kanye West Jesus Is King", ["jesus is king"]],
  ["donda", "Kanye West Donda", ["donda"]],
  ["donda-2", "Kanye West Donda 2", ["donda 2"]],
  ["vultures-1", "¥$ Vultures 1", ["vultures 1"]],
  ["vultures-2", "¥$ Vultures 2", ["vultures 2"]],
  ["bully", "Ye Bully", ["bully"]],
];

await mkdir("public/assets/covers", { recursive: true });

for (const [id, term, aliases] of albums) {
  try {
    const api = `https://itunes.apple.com/search?media=music&entity=album&limit=8&term=${encodeURIComponent(term)}`;
    const response = await fetch(api);
    if (!response.ok) throw new Error(`iTunes search failed: ${response.status}`);
    const data = await response.json();
    const item = data.results?.find((result) => {
      const name = String(result.collectionName ?? "").toLowerCase();
      return result.artworkUrl100 && aliases.some((alias) => name.includes(alias)) && !name.includes("single");
    });

    if (!item?.artworkUrl100) {
      await rm(`public/assets/covers/${id}.jpg`, { force: true });
      console.log(`blank placeholder: ${id}`);
      continue;
    }

    const artwork = item.artworkUrl100.replace(/100x100bb\.(jpg|png)$/i, "1200x1200bb.$1");
    const image = await fetch(artwork);
    if (!image.ok) throw new Error(`artwork failed: ${image.status}`);
    const bytes = Buffer.from(await image.arrayBuffer());
    await writeFile(`public/assets/covers/${id}.jpg`, bytes);
    console.log(`saved ${id}: ${item.collectionName}`);
  } catch (error) {
    console.log(`blank placeholder: ${id} (${error.message})`);
  }
}
