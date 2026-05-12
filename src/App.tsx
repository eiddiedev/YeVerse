import { useEffect, useMemo, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import { ArrowUpRight, Globe2, Menu, X } from "lucide-react";
import * as THREE from "three";
import { albums, timelineEras, type Album, type Lang, type TimelineEra } from "./data";

const issueIds = ["hero", "timeline", "discography", "yeworld", "archive", "about"] as const;
type IssueId = (typeof issueIds)[number];

const issueLabels: Record<IssueId, string> = {
  hero: "HERO",
  timeline: "TIMELINE",
  discography: "DISCOGRAPHY",
  yeworld: "YEWORLD",
  archive: "ARCHIVE",
  about: "ABOUT",
};

const romanNumerals = ["I", "II", "III", "IV", "V", "VI"];

const albumKinds = {
  solo: { zh: "个人专辑", en: "Solo album" },
  collab: { zh: "合作专辑", en: "Collaborative album" },
  compilation: { zh: "厂牌合辑", en: "Compilation" },
};

function text(value: Record<Lang, string>, lang: Lang) {
  return value[lang];
}

function albumStyle(album: Album): CSSProperties {
  return {
    "--album-a": album.palette.primary,
    "--album-b": album.palette.secondary,
    "--album-text": album.palette.text,
  } as CSSProperties;
}

function getCoverState(album: Album) {
  if (!album.cover) return "placeholder";
  return "real";
}

function spineMeta(album: Album) {
  return {
    title: album.spineDesign ?? album.title.toUpperCase(),
    code: String(album.year),
  };
}

function CoverImage({ album, className }: { album: Album; className?: string }) {
  const [failed, setFailed] = useState(getCoverState(album) === "placeholder");

  useEffect(() => {
    setFailed(getCoverState(album) === "placeholder");
  }, [album]);

  if (failed) {
    return (
      <div className={`cover-fallback ${className ?? ""}`} style={albumStyle(album)}>
        <span>{album.title}</span>
      </div>
    );
  }

  return <img className={className} src={album.cover} alt={`${album.title} cover`} onError={() => setFailed(true)} />;
}

function makeTextTexture(album: Album, mode: "spine" | "back") {
  const meta = spineMeta(album);
  const canvas = document.createElement("canvas");
  canvas.width = mode === "spine" ? 192 : 768;
  canvas.height = 1024;
  const context = canvas.getContext("2d");
  if (!context) return new THREE.CanvasTexture(canvas);

  const gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, album.palette.primary);
  gradient.addColorStop(1, album.palette.secondary);
  context.fillStyle = gradient;
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "rgba(255,255,255,0.16)";
  context.fillRect(0, 0, mode === "spine" ? 22 : 34, canvas.height);
  context.fillRect(canvas.width - (mode === "spine" ? 18 : 28), 0, mode === "spine" ? 18 : 28, canvas.height);

  context.save();
  context.translate(canvas.width / 2, canvas.height / 2);
  context.rotate(Math.PI / 2);
  context.textBaseline = "middle";
  context.fillStyle = "rgba(255,255,255,0.9)";
  context.font = `900 ${mode === "spine" ? 38 : 50}px Arial, sans-serif`;
  context.textAlign = "center";
  context.fillText(meta.title, 0, 0, canvas.height - 180);
  context.fillStyle = "rgba(255,255,255,0.48)";
  context.font = "800 32px Arial, sans-serif";
  context.textAlign = "right";
  context.fillText(meta.code, canvas.height / 2 - 52, 0, 150);
  context.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

function makeFallbackCoverTexture(album: Album) {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 1024;
  const context = canvas.getContext("2d");
  if (!context) return new THREE.CanvasTexture(canvas);

  const gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, album.palette.primary);
  gradient.addColorStop(1, "#020202");
  context.fillStyle = gradient;
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "rgba(255,255,255,0.82)";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.font = "800 88px Arial, sans-serif";
  const words = album.title.toUpperCase().split(" ");
  words.forEach((word, index) => {
    context.fillText(word, canvas.width / 2, canvas.height / 2 + (index - (words.length - 1) / 2) * 96, canvas.width - 120);
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

function IssueDrawer({
  activeIssue,
  isOpen,
  onToggle,
  onNavigate,
}: {
  activeIssue: IssueId;
  isOpen: boolean;
  onToggle: () => void;
  onNavigate: (issue: IssueId) => void;
}) {
  return (
    <>
      {isOpen && <div className="issue-backdrop" onClick={onToggle} />}
      <button className={`issue-tab ${isOpen ? "is-open" : ""}`} onClick={onToggle} aria-label="Toggle issue navigation">
        {isOpen ? <X size={18} /> : <Menu size={18} />}
      </button>
      <aside className={`issue-drawer ${isOpen ? "is-open" : ""}`}>
        <nav aria-label="Issue navigation">
          {issueIds.map((issue, index) => (
            <button
              key={issue}
              className={activeIssue === issue ? "active" : ""}
              onClick={() => onNavigate(issue)}
            >
              <span>{romanNumerals[index]}</span>
              <strong>{issueLabels[issue]}</strong>
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
}

function Topbar({
  issue,
  lang,
  selectedIndex,
  onHome,
  onToggleLang,
}: {
  issue: IssueId;
  lang: Lang;
  selectedIndex: number;
  onHome: () => void;
  onToggleLang: () => void;
}) {
  return (
    <header className="topbar">
      <button className="brand" onClick={onHome}>
        YEVERSE
      </button>
      <div className="topbar-status">
        <span>{issueLabels[issue]}</span>
        <span>{String(selectedIndex).padStart(2, "0")} / 17</span>
        <button className="lang-toggle" onClick={onToggleLang}>
          <Globe2 size={15} />
          {lang === "zh" ? "EN" : "中"}
        </button>
      </div>
    </header>
  );
}

function HeroIssue() {
  return (
    <section className="issue issue-hero">
      <div className="hero-copy">
        <img src="/assets/heroes/kanye-signature.png" alt="Kanye West" className="hero-signature" />
        <p className="hero-quote">Kanye West is the most brilliant, volatile, and polarizing artist of his generation.</p>
        <p className="hero-source">—— Rolling Stone</p>
      </div>
    </section>
  );
}

function TimelineIssue({ lang, onAlbumJump }: { lang: Lang; onAlbumJump: (albumId: string) => void }) {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  function getEraCover(era: TimelineEra): string | undefined {
    if (!era.albumIds?.length) return undefined;
    const album = albums.find((a) => a.id === era.albumIds![0]);
    return album?.cover;
  }

  function getEraColor(era: TimelineEra): string {
    if (!era.albumIds?.length) return "#1a1a1a";
    const album = albums.find((a) => a.id === era.albumIds![0]);
    return album?.palette.primary ?? "#1a1a1a";
  }

  return (
    <section className="issue issue-timeline">
      <div className="timeline-header">
        <p className="eyebrow">TIMELINE</p>
        <h2>{lang === "zh" ? "Ye 的成长之路" : "The Path of Ye"}</h2>
      </div>
      <div className="timeline-scroll" ref={scrollRef}>
        <div className="timeline-line" aria-hidden="true" />
        <div className="timeline-track">
          {timelineEras.map((era, index) => {
            const cover = getEraCover(era);
            const color = getEraColor(era);
            const firstAlbumId = era.albumIds?.[0];
            return (
              <article
                key={era.id}
                className="timeline-era"
                style={{ "--era-color": color } as CSSProperties}
              >
                <div className="era-image">
                  {cover ? (
                    <img
                      src={cover}
                      alt={text(era.title, lang)}
                      onClick={() => firstAlbumId && onAlbumJump(firstAlbumId)}
                      className={firstAlbumId ? "clickable" : ""}
                    />
                  ) : (
                    <div className="era-image-placeholder" />
                  )}
                  <span className="era-index">{String(index + 1).padStart(2, "0")}</span>
                </div>
                <div className="era-marker">
                  <span className="era-dot" />
                  <span className="era-range">{era.range}</span>
                </div>
                <div className="era-text">
                  <h3>{text(era.title, lang)}</h3>
                  <p>{text(era.body, lang)}</p>
                  {era.albumIds && era.albumIds.length > 1 && (
                    <div className="era-albums">
                      {era.albumIds.map((id: string) => {
                        const album = albums.find((a) => a.id === id);
                        return album ? (
                          <button key={id} className="era-album-link" onClick={() => onAlbumJump(id)}>
                            <span>{album.title}</span>
                          </button>
                        ) : null;
                      })}
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function CssAlbumShelf({
  selected,
  flippedAlbumId,
  onSelect,
  onFlip,
  onOpen,
  onHover,
}: {
  selected: Album;
  flippedAlbumId: string | null;
  onSelect: (album: Album) => void;
  onFlip: (albumId: string | null) => void;
  onOpen: (album: Album) => void;
  onHover: (album: Album | null) => void;
}) {
  const selectedIndex = albums.findIndex((album) => album.id === selected.id);
  const [shelfPosition, setShelfPosition] = useState(selectedIndex);

  useEffect(() => {
    setShelfPosition(selectedIndex);
  }, [selectedIndex]);

  function moveShelf(event: PointerEvent<HTMLElement>) {
    if (flippedAlbumId) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
    const softPosition = ratio * (albums.length - 1);
    setShelfPosition((current) => current + (softPosition - current) * 0.2);
  }

  function chooseAlbum(album: Album, index: number) {
    if (flippedAlbumId === album.id) {
      onOpen(album);
      return;
    }
    onSelect(album);
    setShelfPosition(index);
    onFlip(album.id);
  }

  function returnToShelf(event: PointerEvent<HTMLElement>) {
    const target = event.target as HTMLElement;
    if (!target.closest(".cd-case-3d") && flippedAlbumId) onFlip(null);
  }

  return (
    <div className="shelf-stage" aria-label="3D CD album shelf" onPointerMove={moveShelf} onPointerDown={returnToShelf}>
      {albums.map((album, index) => {
        const delta = index - shelfPosition;
        const clamped = Math.max(-8, Math.min(8, delta));
        const isFlipped = flippedAlbumId === album.id;
        const flippedIndex = flippedAlbumId ? albums.findIndex((item) => item.id === flippedAlbumId) : -1;
        const isReceding = Boolean(flippedAlbumId && !isFlipped);
        const retreatDirection = index > flippedIndex ? 1 : -1;
        const isSelected = selected.id === album.id;
        const x = isFlipped ? 0 : clamped * 88 + (isReceding ? retreatDirection * 520 : 0);
        const y = isFlipped ? -18 : Math.abs(clamped) * 9;
        const z = isFlipped ? 470 : (isReceding ? -100 : 118) - Math.abs(clamped) * 22;
        const rotateY = isFlipped ? 0 : 76 - clamped * 1.35;
        const rotateZ = isFlipped ? 0 : clamped * -0.55;
        const scale = isFlipped ? 0.7 : (isReceding ? 0.72 : 1) - Math.min(Math.abs(clamped) * 0.028, 0.2);
        const opacity = isFlipped ? 1 : Math.abs(clamped) > 7.2 ? 0 : (isReceding ? 0.34 : 1) - Math.min(Math.abs(clamped) * 0.048, 0.36);

        return (
          <button
            className={`cd-case-3d ${isSelected ? "selected" : ""} ${isFlipped ? "flipped" : ""}`}
            key={album.id}
            onClick={() => chooseAlbum(album, index)}
            onMouseEnter={() => onHover(album)}
            onMouseLeave={() => onHover(null)}
            style={{
              ...albumStyle(album),
              transform: `translate3d(calc(-50% + ${x}px), calc(-50% + ${y}px), ${z}px) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg) scale(${scale})`,
              opacity,
              zIndex: isFlipped ? 4000 : Math.round(1000 - Math.abs(clamped) * 20),
            }}
            aria-label={isFlipped ? `Open ${album.title}` : `Flip ${album.title}`}
          >
            <span className="case-shadow" aria-hidden="true" />
            <span className="case-side spine-face">
              <strong>{spineMeta(album).title}</strong>
              <em>{spineMeta(album).code}</em>
            </span>
            <span className="case-side front-face">
              <span className="front-plastic" />
              <span className="front-spine-strip">
                <strong>{album.title}</strong>
              </span>
              <span className="jewel-hinge" aria-hidden="true" />
              <span className="jewel-bevel" aria-hidden="true" />
              <CoverImage album={album} />
            </span>
            <span className="case-side back-face" />
            <span className="case-side left-spine-face">
              <strong>{spineMeta(album).title}</strong>
            </span>
            <span className="case-side case-top" />
            <span className="case-side case-bottom" />
          </button>
        );
      })}
    </div>
  );
}

function ThreeAlbumShelf({
  selected,
  flippedAlbumId,
  onSelect,
  onFlip,
  onOpen,
  onHover,
}: {
  selected: Album;
  flippedAlbumId: string | null;
  onSelect: (album: Album) => void;
  onFlip: (albumId: string | null) => void;
  onOpen: (album: Album) => void;
  onHover: (album: Album | null) => void;
}) {
  const [webglFailed, setWebglFailed] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sceneRef = useRef<{
    renderer: THREE.WebGLRenderer;
    camera: THREE.PerspectiveCamera;
    scene: THREE.Scene;
    groups: THREE.Group[];
    raycaster: THREE.Raycaster;
    pointer: THREE.Vector2;
    frame: number;
    targetPosition: number;
    shelfPosition: number;
    selectedId: string;
    flippedId: string | null;
    disposed: boolean;
  } | null>(null);

  useEffect(() => {
    sceneRef.current && (sceneRef.current.selectedId = selected.id);
    const index = albums.findIndex((album) => album.id === selected.id);
    if (sceneRef.current && index >= 0) sceneRef.current.targetPosition = index;
  }, [selected.id]);

  useEffect(() => {
    sceneRef.current && (sceneRef.current.flippedId = flippedAlbumId);
  }, [flippedAlbumId]);

  useEffect(() => {
    if (webglFailed) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const renderCanvas = canvas;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "high-performance" });
    } catch {
      setWebglFailed(true);
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
    camera.position.set(0, 0.14, 8.2);
    camera.lookAt(0, 0, 0);

    scene.add(new THREE.AmbientLight(0xffffff, 1.5));
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.8);
    keyLight.position.set(-3, 4, 7);
    scene.add(keyLight);
    const rimLight = new THREE.DirectionalLight(0xd8d0c2, 1.6);
    rimLight.position.set(4, -1, 5);
    scene.add(rimLight);

    const loader = new THREE.TextureLoader();
    const groups = albums.map((album, index) => {
      const group = new THREE.Group();
      group.userData = { albumId: album.id, index };

      const coverTexture = getCoverState(album) === "placeholder" ? makeFallbackCoverTexture(album) : loader.load(album.cover);
      coverTexture.colorSpace = THREE.SRGBColorSpace;
      coverTexture.anisotropy = 8;
      const spineTexture = makeTextTexture(album, "spine");
      const backTexture = makeTextTexture(album, "back");

      const edgeMaterial = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(album.palette.secondary),
        metalness: 0,
        roughness: 0.28,
        clearcoat: 1,
        clearcoatRoughness: 0.18,
        transparent: true,
        opacity: 0.88,
      });
      const spineMaterial = new THREE.MeshPhysicalMaterial({
        map: spineTexture,
        metalness: 0,
        roughness: 0.22,
        clearcoat: 1,
        clearcoatRoughness: 0.14,
      });
      const coverMaterial = new THREE.MeshStandardMaterial({ map: coverTexture, roughness: 0.45 });
      const backMaterial = new THREE.MeshStandardMaterial({ map: backTexture, roughness: 0.52 });

      const caseMesh = new THREE.Mesh(
        new THREE.BoxGeometry(2.42, 2.42, 0.36, 1, 1, 1),
        [spineMaterial, spineMaterial, edgeMaterial, edgeMaterial, coverMaterial, backMaterial],
      );
      group.add(caseMesh);

      const plastic = new THREE.Mesh(
        new THREE.PlaneGeometry(2.48, 2.48),
        new THREE.MeshPhysicalMaterial({
          color: 0xffffff,
          metalness: 0,
          roughness: 0.04,
          transmission: 0.15,
          clearcoat: 1,
          clearcoatRoughness: 0.05,
          transparent: true,
          opacity: 0.22,
          side: THREE.DoubleSide,
        }),
      );
      plastic.position.z = 0.188;
      group.add(plastic);

      const hinge = new THREE.Mesh(
        new THREE.BoxGeometry(0.1, 2.46, 0.4),
        new THREE.MeshPhysicalMaterial({
          color: 0xf0eadf,
          roughness: 0.08,
          clearcoat: 1,
          transparent: true,
          opacity: 0.36,
        }),
      );
      hinge.position.set(-1.11, 0, 0.03);
      group.add(hinge);

      scene.add(group);
      return group;
    });

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const state = {
      renderer,
      camera,
      scene,
      groups,
      raycaster,
      pointer,
      frame: 0,
      targetPosition: albums.findIndex((album) => album.id === selected.id),
      shelfPosition: albums.findIndex((album) => album.id === selected.id),
      selectedId: selected.id,
      flippedId: flippedAlbumId,
      disposed: false,
    };
    sceneRef.current = state;

    function resize() {
      const rect = renderCanvas.getBoundingClientRect();
      renderer.setSize(rect.width, rect.height, false);
      camera.aspect = rect.width / rect.height;
      camera.updateProjectionMatrix();
    }

    function tick() {
      if (state.disposed) return;
      state.frame = window.requestAnimationFrame(tick);
      state.shelfPosition += (state.targetPosition - state.shelfPosition) * 0.075;

      groups.forEach((group, index) => {
        const delta = index - state.shelfPosition;
        const clamped = Math.max(-8, Math.min(8, delta));
        const isFlipped = state.flippedId === group.userData.albumId;
        const flippedIndex = state.flippedId ? albums.findIndex((album) => album.id === state.flippedId) : -1;
        const isReceding = Boolean(state.flippedId && !isFlipped);
        const retreatDirection = index > flippedIndex ? 1 : -1;

        const targetX = isFlipped ? 0 : clamped * 0.76 + (isReceding ? retreatDirection * 4.6 : 0);
        const targetY = isFlipped ? -0.04 : Math.abs(clamped) * -0.015;
        const targetZ = isFlipped ? 2.04 : (isReceding ? -1.45 : 0.05) - Math.abs(clamped) * 0.08;
        const targetRotY = THREE.MathUtils.degToRad(isFlipped ? 0 : 68 - clamped * 1.3);
        const targetRotZ = THREE.MathUtils.degToRad(isFlipped ? 0 : clamped * -0.55);
        const targetScale = isFlipped ? 0.98 : (isReceding ? 0.72 : 1) - Math.min(Math.abs(clamped) * 0.035, 0.24);

        group.position.lerp(new THREE.Vector3(targetX, targetY, targetZ), 0.11);
        group.rotation.y += (targetRotY - group.rotation.y) * 0.11;
        group.rotation.z += (targetRotZ - group.rotation.z) * 0.11;
        const currentScale = group.scale.x + (targetScale - group.scale.x) * 0.11;
        group.scale.setScalar(currentScale);
        group.visible = Math.abs(clamped) < 8 || isReceding || isFlipped;
      });

      renderer.render(scene, camera);
    }

    resize();
    window.addEventListener("resize", resize);
    tick();

    return () => {
      state.disposed = true;
      window.cancelAnimationFrame(state.frame);
      window.removeEventListener("resize", resize);
      groups.forEach((group) => {
        group.traverse((child: THREE.Object3D) => {
          if (child instanceof THREE.Mesh) {
            child.geometry.dispose();
            const materials = Array.isArray(child.material) ? child.material : [child.material as THREE.Material];
            materials.forEach((material: THREE.Material) => {
              Object.values(material as unknown as Record<string, unknown>).forEach((value) => {
                if (value instanceof THREE.Texture) value.dispose();
              });
              material.dispose();
            });
          }
        });
      });
      renderer.dispose();
      sceneRef.current = null;
    };
  }, [webglFailed]);

  function updatePointer(event: PointerEvent<HTMLCanvasElement>) {
    const state = sceneRef.current;
    const canvas = canvasRef.current;
    if (!state || !canvas || state.flippedId) return;
    const rect = canvas.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
    state.targetPosition = ratio * (albums.length - 1);

    state.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    state.pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    state.raycaster.setFromCamera(state.pointer, state.camera);
    const hits = state.raycaster.intersectObjects(state.groups, true);
    const group = hits[0]?.object.parent;
    const albumId = group?.userData.albumId as string | undefined;
    const hovered = albumId ? albums.find((a) => a.id === albumId) ?? null : null;
    onHover(hovered);
  }

  function pickAlbum(event: PointerEvent<HTMLCanvasElement>) {
    const state = sceneRef.current;
    const canvas = canvasRef.current;
    if (!state || !canvas) return;
    const rect = canvas.getBoundingClientRect();
    state.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    state.pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    state.raycaster.setFromCamera(state.pointer, state.camera);
    const hits = state.raycaster.intersectObjects(state.groups, true);
    const group = hits[0]?.object.parent;
    const albumId = group?.userData.albumId as string | undefined;
    const album = albumId ? albums.find((item) => item.id === albumId) : null;

    if (!album) {
      onFlip(null);
      return;
    }
    if (flippedAlbumId === album.id) {
      onOpen(album);
      return;
    }
    onSelect(album);
    onFlip(album.id);
    state.targetPosition = albums.findIndex((item) => item.id === album.id);
  }

  if (webglFailed) {
    return <CssAlbumShelf selected={selected} flippedAlbumId={flippedAlbumId} onSelect={onSelect} onFlip={onFlip} onOpen={onOpen} onHover={onHover} />;
  }

  return (
    <canvas
      ref={canvasRef}
      className="three-shelf"
      onPointerMove={updatePointer}
      onPointerDown={pickAlbum}
      aria-label="3D CD album shelf"
    />
  );
}

function DiscographyIssue({
  selected,
  onSelect,
  onOpen,
  onHoverAlbum,
}: {
  selected: Album;
  onSelect: (album: Album) => void;
  onOpen: (album: Album) => void;
  onHoverAlbum: (album: Album | null) => void;
}) {
  const [flippedAlbumId, setFlippedAlbumId] = useState<string | null>(null);
  const [hoveredAlbum, setHoveredAlbum] = useState<Album | null>(null);

  function handleHover(album: Album | null) {
    setHoveredAlbum(album);
    onHoverAlbum(album);
  }

  const display = hoveredAlbum ?? selected;

  return (
    <section
      className={`issue issue-discography immersive-shelf ${flippedAlbumId ? "has-flipped-case" : ""}`}
      style={albumStyle(display)}
    >
      <div className="shelf-depth" aria-hidden="true" />
      <ThreeAlbumShelf
        selected={selected}
        flippedAlbumId={flippedAlbumId}
        onSelect={onSelect}
        onFlip={setFlippedAlbumId}
        onOpen={onOpen}
        onHover={handleHover}
      />
      <div className="shelf-caption">
        <span>{display.title} · {display.year}</span>
        <span>{flippedAlbumId === display.id ? "CLICK AGAIN TO ENTER" : "CLICK TO TURN"}</span>
      </div>
    </section>
  );
}

function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [active, setActive] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const interactive = "button, a, [role='button'], input, textarea, select";

    function move(event: globalThis.PointerEvent) {
      setPosition({ x: event.clientX, y: event.clientY });
      setVisible(true);
      setActive(Boolean((event.target as Element | null)?.closest?.(interactive)));
    }

    function leave() {
      setVisible(false);
    }

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <div
      className={`custom-cursor ${visible ? "visible" : ""} ${active ? "active" : ""}`}
      style={{ transform: `translate3d(${position.x}px, ${position.y}px, 0)` }}
      aria-hidden="true"
    />
  );
}

function AlbumModal({ album, lang, onClose }: { album: Album; lang: Lang; onClose: () => void }) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    function onScroll() {
      const raw = el!.scrollTop / el!.clientHeight;
      setScrollProgress(Math.min(1, raw));
    }
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const heroSrc = album.heroImage ?? album.cover;

  return (
    <div className="album-modal" role="dialog" aria-modal="true" aria-label={album.title} style={albumStyle(album)}>
      <button className="modal-close" onClick={onClose} aria-label="Close album">
        <X size={20} />
      </button>
      <div
        className="album-poster-bg"
        style={{ opacity: scrollProgress < 0.5 ? 1 - scrollProgress * 1.7 : 0.15 }}
      >
        <img src={heroSrc} alt="" />
      </div>
      <div className="album-scroll" ref={scrollRef}>
        <section className="album-hero-spacer" />
        <section
          className="album-info-panel"
          style={{
            opacity: scrollProgress < 0.5 ? 0 : Math.min(1, (scrollProgress - 0.5) * 3),
            transform: `translateY(${scrollProgress < 0.5 ? 100 : Math.max(0, 100 - (scrollProgress - 0.5) * 300)}px)`,
          }}
        >
          <div className="album-info-copy">
            <p>{album.year} / {text(albumKinds[album.type], lang)} / {album.credit}</p>
            <h3>{lang === "zh" ? "专辑介绍" : "Album notes"}</h3>
            <span>{text(album.summary, lang)}</span>
            {album.note && <em>{text(album.note, lang)}</em>}
            <div className="listen-row">
              <a href={album.links.apple} target="_blank" rel="noreferrer">Apple Music <ArrowUpRight size={14} /></a>
              <a href={album.links.spotify} target="_blank" rel="noreferrer">Spotify <ArrowUpRight size={14} /></a>
            </div>
          </div>
          <div className="album-sources">
            <h4>{lang === "zh" ? "资料来源" : "Sources"}</h4>
            {album.sourceUrls.map((url) => (
              <a key={url} href={url} target="_blank" rel="noreferrer">
                {new URL(url).hostname}
              </a>
            ))}
          </div>
        </section>
        <section className="song-list-panel">
          <h3>{lang === "zh" ? "歌曲列表" : "Track list"}</h3>
          <ol>
            {album.tracks.map((track) => (
              <li key={track}>
                <span>{track}</span>
                <div>
                  <a href={`https://music.apple.com/us/search?term=${encodeURIComponent(`${album.title} ${track}`)}`} target="_blank" rel="noreferrer">
                    Apple
                  </a>
                  <a href={`https://open.spotify.com/search/${encodeURIComponent(`${album.title} ${track}`)}`} target="_blank" rel="noreferrer">
                    Spotify
                  </a>
                </div>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </div>
  );
}

function YeWorldIssue({ lang }: { lang: Lang }) {
  const branches = [
    ["YEEZY", lang === "zh" ? "鞋履、廓形、秀场、消费系统。" : "Footwear, silhouettes, runway, consumption systems."],
    ["ART", lang === "zh" ? "封面、舞台、字体、建筑式空间。" : "Covers, stages, typography, architectural space."],
    ["PUBLIC", lang === "zh" ? "中性编年的公共节点，后续展开。" : "Neutral public chronology, to be expanded."],
    ["MV", lang === "zh" ? "音乐影像、现场、试听会与视觉叙事。" : "Music video, live staging, listening-event visual narrative."],
    ["COLLABS", lang === "zh" ? "制作、合作专辑、厂牌与跨界网络。" : "Production, collaborative albums, label and cross-field networks."],
  ];

  return (
    <section className="issue issue-yeworld">
      <div className="issue-heading">
        <p className="eyebrow">YEWORLD</p>
      </div>
      <div className="world-branches">
        {branches.map(([title, body], index) => (
          <article key={title}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <h3>{title}</h3>
            <p>{body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function ArchiveIssue({ lang }: { lang: Lang }) {
  return (
    <section className="issue issue-archive">
      <div className="archive-void">
        <p className="eyebrow">ARCHIVE</p>
        <p>
          {lang === "zh"
            ? "未发布音乐、歌词解读、访谈摘录和粉丝理论将在后续版本逐层进入。第一版先保留一个安静、可扩展的档案室。"
            : "Unreleased music, lyric readings, interview excerpts, and fan theories will enter in later versions. This first pass keeps a quiet expandable archive room."}
        </p>
      </div>
    </section>
  );
}

function AboutIssue({ lang }: { lang: Lang }) {
  return (
    <section className="issue issue-about">
      <div className="about-title">
        <p className="eyebrow">ABOUT / MADE BY EIDDIE</p>
      </div>
      <div className="about-grid">
        <article>
          <h3>{lang === "zh" ? "项目性质" : "Project"}</h3>
          <p>
            {lang === "zh"
              ? "YeVerse 是一个非官方个人网站原型，用于视觉设计、交互叙事和资料策展实验。它不是 Ye、Kanye West、Yeezy、GOOD Music 或任何唱片公司/品牌的官方项目。"
              : "YeVerse is an unofficial personal website prototype for visual design, interaction narrative, and archival curation. It is not affiliated with Ye, Kanye West, Yeezy, GOOD Music, or any label/brand."}
          </p>
        </article>
        <article>
          <h3>{lang === "zh" ? "版权与音频" : "Rights and audio"}</h3>
          <p>
            {lang === "zh"
              ? "音乐、封面、商标、影像和相关素材版权归其各自权利方所有。本站不托管音频，只提供 Apple Music 和 Spotify 等外部平台搜索/跳转链接。"
              : "Music, cover art, trademarks, video, and related materials belong to their respective rights holders. This site does not host audio and only links to external platforms such as Apple Music and Spotify."}
          </p>
        </article>
        <article>
          <h3>{lang === "zh" ? "资料来源" : "Sources"}</h3>
          <p>
            Wikipedia album discography, Kanye West Wiki/Fandom, Apple/iTunes public artwork search, official streaming platform metadata, and manually curated notes.
          </p>
        </article>
        <article>
          <h3>{lang === "zh" ? "联系方式" : "Contact"}</h3>
          <p>
            Email: <a href="mailto:2314869561a@gmail.com">2314869561a@gmail.com</a>
            <br />
            GitHub: <a href="https://github.com/eiddiedev" target="_blank" rel="noreferrer">eiddiedev</a>
          </p>
        </article>
      </div>
    </section>
  );
}

export default function App() {
  const [lang, setLang] = useState<Lang>("zh");
  const [activeIssue, setActiveIssue] = useState<IssueId>("hero");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState(albums[0]);
  const [openAlbum, setOpenAlbum] = useState<Album | null>(null);
  const [hoveredAlbumIndex, setHoveredAlbumIndex] = useState<number | null>(null);

  const selectedIndex = useMemo(() => albums.findIndex((album) => album.id === selectedAlbum.id) + 1, [selectedAlbum.id]);
  const displayIndex = hoveredAlbumIndex ?? selectedIndex;

  function navigate(issue: IssueId) {
    setActiveIssue(issue);
    setDrawerOpen(false);
    setHoveredAlbumIndex(null);
  }

  function jumpToAlbum(albumId: string) {
    const album = albums.find((item) => item.id === albumId);
    if (!album) return;
    setSelectedAlbum(album);
    navigate("discography");
  }

  return (
    <div className="app">
      <CustomCursor />
      <div className="grain" aria-hidden="true" />
      <IssueDrawer
        activeIssue={activeIssue}
        isOpen={drawerOpen}
        onToggle={() => setDrawerOpen((value) => !value)}
        onNavigate={navigate}
      />
      <Topbar
        issue={activeIssue}
        lang={lang}
        selectedIndex={displayIndex}
        onHome={() => navigate("hero")}
        onToggleLang={() => setLang((value) => (value === "zh" ? "en" : "zh"))}
      />
      <main className="issue-shell">
        {activeIssue === "hero" && <HeroIssue />}
        {activeIssue === "timeline" && (
          <TimelineIssue lang={lang} onAlbumJump={jumpToAlbum} />
        )}
        {activeIssue === "discography" && (
          <DiscographyIssue
            selected={selectedAlbum}
            onSelect={setSelectedAlbum}
            onOpen={setOpenAlbum}
            onHoverAlbum={(album) => setHoveredAlbumIndex(album ? albums.findIndex((a) => a.id === album.id) + 1 : null)}
          />
        )}
        {activeIssue === "yeworld" && <YeWorldIssue lang={lang} />}
        {activeIssue === "archive" && <ArchiveIssue lang={lang} />}
        {activeIssue === "about" && <AboutIssue lang={lang} />}
      </main>
      {openAlbum && <AlbumModal album={openAlbum} lang={lang} onClose={() => setOpenAlbum(null)} />}
    </div>
  );
}
