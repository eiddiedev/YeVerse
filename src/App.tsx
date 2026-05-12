import { Fragment, useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import { ArrowUpRight, Globe2, Menu, X } from "lucide-react";
import * as THREE from "three";
import { albums, timelineEras, type Album, type Lang } from "./data";
import "./transitions.css";

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
  const titleColor = album.spineColor || album.titleColor || album.palette.text;
  context.fillStyle = titleColor;
  const primaryFont = (album.titleFont || "Arial").split(",")[0].trim().replace(/^["']|["']$/g, "");
  const spineFontSize = mode === "spine" ? 38 : 50;
  context.font = `900 ${spineFontSize}px ${primaryFont}, sans-serif`;
  context.textAlign = "center";
  // Limit title width so it doesn't cover the year code
  const titleMaxWidth = canvas.height - 280;
  context.fillText(meta.title, 0, 0, titleMaxWidth);
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
  onHome,
  onToggleLang,
}: {
  issue: IssueId;
  lang: Lang;
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
  return (
    <section className="issue issue-timeline">
      <div className="tl-container">
        {/* Header */}
        <header className="tl-header">
          <p className="eyebrow">{lang === "zh" ? "时间线" : "TIMELINE"}</p>
          <h2 className="tl-title">
            {lang === "zh" ? "Kanye West / Ye" : "Kanye West / Ye"}
          </h2>
          <p className="tl-subtitle">
            {lang === "zh"
              ? "音乐、时尚、文化与公众身份的视觉档案"
              : "A visual archive of music, fashion, culture, and public identity."}
          </p>
        </header>

        {/* Timeline axis */}
        <div className="tl-axis" aria-hidden="true" />

        {/* Timeline entries */}
        {timelineEras.map((era, index) => {
          const side = index % 2 === 0 ? "left" : "right";
          const figNum = String(index + 1).padStart(2, "0");

          const figImg = `/assets/${index + 1}.png`;

          return (
            <article key={era.id} className={`tl-entry tl-entry--${side}`}>
              {/* Dot on axis */}
              <div className="tl-dot-wrap" aria-hidden="true">
                <span className="tl-dot" />
              </div>

              {/* Content */}
              <div className="tl-content">
                {/* Image side */}
                <div className="tl-fig">
                  <img src={figImg} alt={`Fig. ${figNum}`} className={`tl-fig-img${(index === 0 || index === 9) ? " tl-fig-img--sm" : ""}`} />
                </div>

                {/* Text side */}
                <div className="tl-text">
                  <div className="tl-years">{era.range}</div>
                  <h3 className="tl-era-title">{text(era.title, lang)}</h3>
                  <p className="tl-body">{text(era.body, lang)}</p>
                  {era.albumIds && era.albumIds.length > 0 && (
                    <div className="tl-albums">
                      {era.albumIds.map((id: string) => {
                        const album = albums.find((a) => a.id === id);
                        return album ? (
                          <button key={id} className="tl-album-link" onClick={() => onAlbumJump(id)}>
                            {album.title}
                          </button>
                        ) : null;
                      })}
                    </div>
                  )}
                </div>
              </div>
            </article>
          );
        })}

        {/* Footer */}
        <footer className="tl-footer">
          <span className="tl-footer-line" aria-hidden="true" />
          <span className="tl-footer-text">
            {lang === "zh" ? "未完待续" : "TO BE CONTINUED"}
          </span>
        </footer>
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
              <strong style={{ fontFamily: album.titleFont, color: album.spineColor || album.titleColor || album.palette.text }}>{spineMeta(album).title}</strong>
              <em>{spineMeta(album).code}</em>
            </span>
            <span className="case-side front-face">
              <span className="front-plastic" />
              <span className="front-spine-strip">
                <strong style={{ fontFamily: album.titleFont, color: album.spineColor || album.titleColor || album.palette.text }}>{album.title}</strong>
              </span>
              <span className="jewel-hinge" aria-hidden="true" />
              <span className="jewel-bevel" aria-hidden="true" />
              <CoverImage album={album} />
            </span>
            <span className="case-side back-face" />
            <span className="case-side left-spine-face">
              <strong style={{ fontFamily: album.titleFont, color: album.spineColor || album.titleColor || album.palette.text }}>{spineMeta(album).title}</strong>
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

    // Rebuild spine/back textures once Google Fonts are loaded
    const fontFamilies = [...new Set(albums.map(a => (a.titleFont || "Arial").split(",")[0].trim().replace(/^["']|["']$/g, "")))];
    Promise.all(fontFamilies.map(f => document.fonts.load(`900 38px "${f}"`).catch(() => {}))).then(() => {
      if (state.disposed) return;
      groups.forEach((group, index) => {
        const album = albums[index];
        const meshes = group.children.filter((c): c is THREE.Mesh => c instanceof THREE.Mesh);
        if (!meshes[0]) return;
        const mats = Array.isArray(meshes[0].material) ? meshes[0].material : [meshes[0].material];
        const spineMat = mats[0] as THREE.MeshPhysicalMaterial;
        const backMat = mats[5] as THREE.MeshStandardMaterial;
        if (spineMat) {
          spineMat.map?.dispose();
          spineMat.map = makeTextTexture(album, "spine");
          spineMat.needsUpdate = true;
        }
        if (backMat) {
          backMat.map?.dispose();
          backMat.map = makeTextTexture(album, "back");
          backMat.needsUpdate = true;
        }
      });
    });

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

const transitionAlbums = [
  "college-dropout", "late-registration", "graduation", "808s-heartbreak",
  "mbdtf", "watch-the-throne", "cruel-summer", "yeezus",
  "life-of-pablo", "ye", "kids-see-ghosts", "jesus-is-king",
  "donda", "donda-2", "vultures-1", "vultures-2", "bully",
];

function MosaicBlocks() {
  const colors = [
    "#7d0714", "#961018", "#b81a2a", "#cc2222",
    "#e8302a", "#c01818", "#5a0a10", "#3a0808",
    "#f06848", "#d45a2a", "#e8922a", "#f0a830",
  ];
  const cols = 20;
  const rows = 14;
  const delays = Array.from({ length: cols * rows }, () => Math.floor(Math.random() * 1200));
  const colorIndices = Array.from({ length: cols * rows }, () => Math.floor(Math.random() * colors.length));

  return (
    <div className="mosaic-layer">
      {Array.from({ length: rows }, (_, row) =>
        Array.from({ length: cols }, (_, col) => {
          const i = row * cols + col;
          return (
            <div
              key={i}
              className="mosaic-block"
              style={{
                left: `${(col / cols) * 100}%`,
                top: `${(row / rows) * 100}%`,
                width: `${100 / cols}%`,
                height: `${100 / rows}%`,
                background: colors[colorIndices[i]],
                animationDelay: `${delays[i]}ms`,
              } as CSSProperties}
            />
          );
        })
      )}
    </div>
  );
}

function TransitionOverlay({
  albumId,
  phase,
  onFadeOutComplete,
}: {
  albumId: string | null;
  phase: "idle" | "in" | "out";
  onFadeOutComplete: () => void;
}) {
  useEffect(() => {
    if (phase === "out") {
      const timer = setTimeout(onFadeOutComplete, 420);
      return () => clearTimeout(timer);
    }
  }, [phase, onFadeOutComplete]);

  if (!albumId || phase === "idle") return null;

  const isActive = transitionAlbums.includes(albumId);
  const transClass = isActive ? `trans-${albumId}` : "trans-college-dropout";

  return (
    <div
      className={`transition-overlay active ${transClass} ${phase === "in" ? "transition-fade-in" : "transition-fade-out"}`}
      style={{ "--trans-duration": "1800ms" } as CSSProperties}
    >
      <div className="trans-layer-1" />
      <div className="trans-layer-2" />
      <div className="trans-layer-3" />
      {albumId === "mbdtf" && <MosaicBlocks />}
    </div>
  );
}

function PitchforkBadge({ score, albumTitle }: { score: number; albumTitle: string }) {
  const isHigh = score >= 8.0;
  const url = `https://pitchfork.com/search/?query=${encodeURIComponent(albumTitle)}`;
  return (
    <a className={`badge-pitchfork${isHigh ? " badge-pitchfork--high" : ""}`} href={url} target="_blank" rel="noreferrer">
      <span className="badge-pitchfork__score">{score.toFixed(1)}</span>
    </a>
  );
}

function MetacriticBadge({ score, albumTitle }: { score: number; albumTitle: string }) {
  const tier = score >= 80 ? "green" : score >= 60 ? "yellow" : "red";
  const url = `https://www.metacritic.com/search/${encodeURIComponent(albumTitle)}/`;
  return (
    <a className={`badge-metacritic badge-metacritic--${tier}`} href={url} target="_blank" rel="noreferrer">
      <span className="badge-metacritic__score">{score}</span>
    </a>
  );
}

function AotyBadge({ score, albumTitle }: { score: number; albumTitle: string }) {
  const url = `https://www.albumoftheyear.org/search/?q=${encodeURIComponent(albumTitle)}`;
  const barColor = score >= 70 ? "#4a7a2e" : score >= 50 ? "#a08530" : "#7a2e2e";
  return (
    <a className="badge-aoty" href={url} target="_blank" rel="noreferrer">
      <span className="badge-aoty__score">{score}</span>
      <div className="badge-aoty__track">
        <div className="badge-aoty__fill" style={{ width: `${score}%`, backgroundColor: barColor }} />
        <div className="badge-aoty__dot" style={{ left: `${score}%` }} />
      </div>
    </a>
  );
}

function AlbumModal({ album, lang, onClose }: { album: Album; lang: Lang; onClose: () => void }) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeTrack, setActiveTrack] = useState<{ name: string; id: string } | null>(null);

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
  const r = album.ratings;

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
          className="album-detail"
          style={{
            opacity: scrollProgress < 0.5 ? 0 : Math.min(1, (scrollProgress - 0.5) * 3),
            transform: `translateY(${scrollProgress < 0.5 ? 100 : Math.max(0, 100 - (scrollProgress - 0.5) * 300)}px)`,
          }}
        >
          <h1 className="album-detail-title" style={{ color: album.titleColor || album.palette.text, fontFamily: album.titleFont, fontWeight: album.titleBold ? 700 : undefined, textTransform: album.titleUpper ? 'uppercase' : undefined }}>{album.title}</h1>

          <div className="album-detail-body">
            <div className="album-detail-desc">
              <h3>{lang === "zh" ? "专辑介绍" : "Album notes"}</h3>
              <p>{album.year} / {text(albumKinds[album.type], lang)} / {album.credit}</p>
              <span>{text(album.summary, lang)}</span>
              {album.note && <em>{text(album.note, lang)}</em>}
              {r && (r.pitchfork != null || r.metacritic != null || r.aoty != null) && (
                <div className="album-ratings">
                  {r.pitchfork != null && <PitchforkBadge score={r.pitchfork} albumTitle={album.title} />}
                  {r.metacritic != null && <MetacriticBadge score={r.metacritic} albumTitle={album.title} />}
                  {r.aoty != null && <AotyBadge score={r.aoty} albumTitle={album.title} />}
                </div>
              )}
              <div className="listen-row">
                <a href={album.links.apple} target="_blank" rel="noreferrer">Apple Music <ArrowUpRight size={14} /></a>
                <a href={album.links.spotify} target="_blank" rel="noreferrer">Spotify <ArrowUpRight size={14} /></a>
              </div>
            </div>
            <div className="album-detail-tracks">
              <h3>{lang === "zh" ? "歌曲列表" : "Tracklist"}</h3>
              <ol>
                {album.tracks.map((track) => (
                  <Fragment key={track.name}>
                    <li>
                      <span>{track.name}</span>
                      {track.spotifyTrackId && (
                        <button
                          className={`track-play-btn${activeTrack?.id === track.spotifyTrackId ? " track-play-btn--active" : ""}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (activeTrack?.id === track.spotifyTrackId) {
                              setActiveTrack(null);
                            } else {
                              setActiveTrack({ name: track.name, id: track.spotifyTrackId! });
                            }
                          }}
                          aria-label={`Play ${track.name}`}
                        >
                          {activeTrack?.id === track.spotifyTrackId
                            ? <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
                            : <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                          }
                        </button>
                      )}
                    </li>
                    {activeTrack?.id === track.spotifyTrackId && track.spotifyTrackId && (
                      <li className="track-embed-row">
                        <iframe
                          src={`https://open.spotify.com/embed/track/${track.spotifyTrackId}?utm_source=generator&theme=0`}
                          width="100%"
                          height="80"
                          frameBorder="0"
                          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                          loading="lazy"
                          title={`Play ${track.name}`}
                        />
                      </li>
                    )}
                  </Fragment>
                ))}
              </ol>
            </div>
          </div>
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
  const [flipped, setFlipped] = useState(false);

  const emailParts = ["2314869561a", "gmail.com"];

  return (
    <section className="issue issue-about">
      <div className={`id-card-flipper ${flipped ? "id-card-flipper--flipped" : ""}`} onClick={() => setFlipped(f => !f)}>
        {/* Front */}
        <div className="id-card id-card--front">
          <div className="id-card__header">
            <span>loading / eiddie personal branding</span>
            <span>version 001</span>
          </div>

          <div className="id-card__body">
            <div className="id-card__portrait">
              <img src="/assets/heroes/profile.png" alt="Ye" />
            </div>

            <div className="id-card__info">
              <h2 className="id-card__title">IDENTIFICATION CARD</h2>

              <div className="id-card__row">
                <span className="id-card__label">[name]</span>
                <span className="id-card__value">EIDDIE</span>
                <span className="id-card__label">[type]</span>
                <span className="id-card__value">Fan Tribute</span>
              </div>

              <div className="id-card__divider" />

              <div className="id-card__row">
                <span className="id-card__label">[favorite era]</span>
                <span className="id-card__value">The College Dropout</span>
              </div>

              <div className="id-card__divider" />

              <div className="id-card__row">
                <span className="id-card__label">[email]</span>
                <span className="id-card__value">
                  <a href={`mailto:${emailParts[0]}@${emailParts[1]}`}>
                    {emailParts[0]} [at] {emailParts[1]}
                  </a>
                </span>
                <span className="id-card__label">[github]</span>
                <span className="id-card__value">
                  <a href="https://github.com/eiddiedev" target="_blank" rel="noreferrer">
                    eiddiedev
                  </a>
                </span>
              </div>

              <div className="id-card__row">
                <span className="id-card__label">[twitter]</span>
                <span className="id-card__value">
                  <a href="https://twitter.com/10jm411336" target="_blank" rel="noreferrer">@10jm411336</a>
                </span>
                <span className="id-card__label">[douyin]</span>
                <span className="id-card__value">
                  <a href="https://www.douyin.com/user/jamalmusiala_10" target="_blank" rel="noreferrer">jamalmusiala_10</a>
                </span>
              </div>

              <div className="id-card__signature">
                <span>Signature:</span>
                <img src="/assets/heroes/sign.png" alt="" className="id-card__sig-img" />
              </div>
            </div>
          </div>

          <div className="id-card__footer">
            <div className="id-card__barcode" aria-hidden="true">
              {Array.from({ length: 40 }, (_, i) => (
                <span key={i} className={`bar bar--${i % 3 === 0 ? "thick" : i % 2 === 0 ? "medium" : "thin"}`} />
              ))}
            </div>
            <div className="id-card__dates">
              <div className="id-card__date">
                <span className="id-card__label">[issue date]</span>
                <span className="id-card__value">05/10/2025</span>
              </div>
              <div className="id-card__date">
                <span className="id-card__label">[last update]</span>
                <span className="id-card__value">05/12/2026</span>
              </div>
            </div>
          </div>
        </div>

        {/* Back */}
        <div className="id-card id-card--back">
          <div className="id-card__header">
            <span>loading / eiddie personal branding</span>
            <span>version 001</span>
          </div>

          <div className="id-card-back__content">
            <h2 className="id-card-back__title">{lang === "zh" ? "致谢与声明" : "ACKNOWLEDGEMENTS & DISCLAIMER"}</h2>

            <div className="id-card-back__section">
              <h3>{lang === "zh" ? "致谢" : "Acknowledgements"}</h3>
              <p>
                {lang === "zh"
                  ? "YeVerse 是一个非官方的粉丝致敬网站，仅用于视觉设计、交互叙事与档案策展的研究与展示。本站不托管任何音频文件。"
                  : "YeVerse is an unofficial fan tribute website for visual design, interaction narrative, and archival curation. This site does not host any audio."}
              </p>
            </div>

            <div className="id-card-back__section">
              <h3>{lang === "zh" ? "信息来源" : "Sources"}</h3>
              <p>
                {lang === "zh"
                  ? "本站内容参考：Wikipedia、Spotify、Apple Music、Metacritic、Pitchfork、Album of the Year、RateYourMusic、Genius、Kanye West Fandom Wiki。所有素材版权归其各自所有者。"
                  : "Content sourced from: Wikipedia, Spotify, Apple Music, Metacritic, Pitchfork, Album of the Year, RateYourMusic, Genius, Kanye West Fandom Wiki. All materials belong to their respective rights holders."}
              </p>
            </div>

            <div className="id-card-back__section">
              <h3>{lang === "zh" ? "版权声明" : "Copyright"}</h3>
              <p>
                {lang === "zh"
                  ? "如有任何内容侵犯了您的权益，请通过 GitHub Issues 或邮件联系，我们将在核实后立即删除。如有侵权必删。"
                  : "If any content infringes your rights, please contact us via GitHub Issues or email. We will remove it promptly upon verification."}
              </p>
            </div>

            <div className="id-card-back__section">
              <h3>{lang === "zh" ? "参与共建" : "Contribute"}</h3>
              <p>
                {lang === "zh"
                  ? "如果你也是 Ye 的粉丝，欢迎前往 GitHub 提交 Issue 或 Pull Request，一起构建更好的 YeVerse！"
                  : "If you're a Ye fan too, feel free to submit Issues or Pull Requests on our GitHub repo to help build a better YeVerse together!"}
              </p>
              <a className="id-card-back__gh-link" href="https://github.com/eiddiedev/YeVerse" target="_blank" rel="noreferrer">
                github.com/eiddiedev/YeVerse
              </a>
            </div>
          </div>

          <div className="id-card__footer">
            <div className="id-card__barcode" aria-hidden="true">
              {Array.from({ length: 40 }, (_, i) => (
                <span key={i} className={`bar bar--${i % 3 === 0 ? "thick" : i % 2 === 0 ? "medium" : "thin"}`} />
              ))}
            </div>
            <div className="id-card__dates">
              <div className="id-card__date">
                <span className="id-card__label">[issue date]</span>
                <span className="id-card__value">05/10/2025</span>
              </div>
              <div className="id-card__date">
                <span className="id-card__label">[last update]</span>
                <span className="id-card__value">05/12/2026</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <p className="id-card__disclaimer">
        YeVerse is an unofficial fan tribute website prototype for visual design, interaction narrative, and archival curation. This site does not host audio. Music, cover art, trademarks, and related materials belong to their respective rights holders.
      </p>
    </section>
  );
}

export default function App() {
  const [lang, setLang] = useState<Lang>("zh");
  const [activeIssue, setActiveIssue] = useState<IssueId>("hero");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState(albums[0]);
  const [openAlbum, setOpenAlbum] = useState<Album | null>(null);
  const [transAlbumId, setTransAlbumId] = useState<string | null>(null);
  const [transPhase, setTransPhase] = useState<"idle" | "in" | "out">("idle");
  const pendingAlbumRef = useRef<Album | null>(null);


  function navigate(issue: IssueId) {
    setActiveIssue(issue);
    setDrawerOpen(false);
  }

  function jumpToAlbum(albumId: string) {
    const album = albums.find((item) => item.id === albumId);
    if (!album) return;
    setSelectedAlbum(album);
    openAlbumWithTransition(album);
  }

  function openAlbumWithTransition(album: Album) {
    if (transPhase !== "idle") return;
    pendingAlbumRef.current = album;
    setTransAlbumId(album.id);
    setTransPhase("in");
    setTimeout(() => {
      setTransPhase("out");
      setOpenAlbum(pendingAlbumRef.current);
    }, 1800);
  }

  function handleFadeOutComplete() {
    setTransPhase("idle");
    setTransAlbumId(null);
    pendingAlbumRef.current = null;
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
            onOpen={openAlbumWithTransition}
            onHoverAlbum={() => {}}
          />
        )}
        {activeIssue === "yeworld" && <YeWorldIssue lang={lang} />}
        {activeIssue === "archive" && <ArchiveIssue lang={lang} />}
        {activeIssue === "about" && <AboutIssue lang={lang} />}
      </main>
      <TransitionOverlay
        albumId={transAlbumId}
        phase={transPhase}
        onFadeOutComplete={handleFadeOutComplete}
      />
      {openAlbum && <AlbumModal album={openAlbum} lang={lang} onClose={() => setOpenAlbum(null)} />}
    </div>
  );
}
