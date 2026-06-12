// =============================================================================
//  PYRGOS STUDIO — hidden content management panel
// -----------------------------------------------------------------------------
//  Reached at /admin (path configurable in admin.config.json).
//  Edits are held as a local draft, then published as ONE git commit to main;
//  Netlify rebuilds automatically and the live site updates in ~1-2 minutes.
//
//  Security model (honest version):
//   - The passcode gate keeps casual visitors out. Like anything in a static
//     site bundle, it is obfuscation, not a vault.
//   - The thing that actually protects the website is the GitHub token, which
//     is entered at publish time and NEVER stored in the repository. Without
//     it, this panel cannot change anything.
// =============================================================================
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Lock, LogOut, Plus, Pencil, Trash2, ChevronUp, ChevronDown, Upload, X,
  ExternalLink, AlertTriangle, CheckCircle2, Loader2,
} from 'lucide-react';
import {
  listings as bundledListings,
  type ListingsData, type RawApartment, type RawBuilding, type ApartmentStatus,
} from '../data/pyrgosData';
import adminConfig from './admin.config.json';
import { publishCommit, validateToken, REPO, BRANCH, type PublishFile } from './github';
import { prepareImage, slugifyFilename, type PreparedImage } from './image';

// ---- constants & helpers ----------------------------------------------------
const RAW_URL = `https://raw.githubusercontent.com/${REPO}/${BRANCH}/src/data/listings.json`;
const LS_DRAFT = 'pyrgos_studio_draft_v2';
const SS_AUTH = 'pyrgos_studio_authed';
const SS_TOKEN = 'pyrgos_studio_token';

const clone = <T,>(x: T): T => JSON.parse(JSON.stringify(x)) as T;

async function sha256hex(text: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

const inp =
  'w-full border border-line bg-paper px-3 py-2.5 text-ink text-sm focus:outline-none focus:border-bronze transition-colors';
const btnDark =
  'inline-flex items-center justify-center gap-2 bg-ink text-ivory px-5 py-2.5 text-sm tracking-wide hover:bg-bronze transition-colors disabled:opacity-40 disabled:hover:bg-ink';
const btnGhost =
  'inline-flex items-center justify-center gap-2 border border-line bg-paper text-ink px-4 py-2.5 text-sm hover:border-bronze transition-colors';

type Uploads = Record<string, PreparedImage>;

const resolveImg = (path: string, uploads: Uploads) =>
  uploads['public' + path]?.previewUrl ?? path;

// ---- tiny form primitives ----------------------------------------------------
function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs tracking-luxe uppercase text-ink-mute mb-1.5">{label}</span>
      {children}
      {hint && <span className="block text-xs text-ink-mute mt-1">{hint}</span>}
    </label>
  );
}

function NumInput({ value, onChange, placeholder }: { value?: number; onChange: (v?: number) => void; placeholder?: string }) {
  return (
    <input
      type="number" inputMode="decimal" className={inp} placeholder={placeholder}
      value={value ?? ''} onChange={(e) => onChange(e.target.value === '' ? undefined : Number(e.target.value))}
    />
  );
}

function TagsEditor({ values, onChange, placeholder }: { values: string[]; onChange: (v: string[]) => void; placeholder: string }) {
  const [draft, setDraft] = useState('');
  const add = () => {
    const v = draft.trim();
    if (!v) return;
    onChange([...values, v]);
    setDraft('');
  };
  return (
    <div className="border border-line bg-paper p-2">
      <div className="flex flex-wrap gap-2 mb-2">
        {values.map((v, i) => (
          <span key={`${v}-${i}`} className="inline-flex items-center gap-1.5 bg-ivory border border-line px-2.5 py-1 text-xs text-ink">
            {v}
            <button type="button" onClick={() => onChange(values.filter((_, j) => j !== i))} className="text-ink-mute hover:text-ink">
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
        {values.length === 0 && <span className="text-xs text-ink-mute py-1">Nothing added yet.</span>}
      </div>
      <div className="flex gap-2">
        <input
          className={inp} placeholder={placeholder} value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); add(); } }}
        />
        <button type="button" onClick={add} className={btnGhost}><Plus className="h-4 w-4" /></button>
      </div>
    </div>
  );
}

function ImageListEditor({
  label, paths, onChange, uploads, onUpload, uploadDir,
}: {
  label: string; paths: string[]; onChange: (v: string[]) => void;
  uploads: Uploads; onUpload: (files: FileList, dir: string) => Promise<string[]>; uploadDir: string;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [manual, setManual] = useState('');
  const move = (i: number, d: number) => {
    const j = i + d;
    if (j < 0 || j >= paths.length) return;
    const next = [...paths];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs tracking-luxe uppercase text-ink-mute">{label}</span>
        <button
          type="button" disabled={busy} onClick={() => fileRef.current?.click()}
          className="inline-flex items-center gap-1.5 text-xs text-ink border-b border-bronze pb-0.5 hover:text-bronze transition-colors disabled:opacity-50"
        >
          {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
          Upload photo{busy ? 's…' : 's'}
        </button>
        <input
          ref={fileRef} type="file" accept="image/*" multiple className="hidden"
          onChange={async (e) => {
            if (!e.target.files?.length) return;
            setBusy(true);
            try {
              const added = await onUpload(e.target.files, uploadDir);
              onChange([...paths, ...added]);
            } catch {
              window.alert('That photo could not be processed — please try a JPEG or PNG.');
            } finally {
              setBusy(false);
              if (fileRef.current) fileRef.current.value = '';
            }
          }}
        />
      </div>
      <div className="border border-line bg-paper divide-y divide-line">
        {paths.map((p, i) => (
          <div key={`${p}-${i}`} className="flex items-center gap-3 p-2">
            <img src={resolveImg(p, uploads)} alt="" className="w-14 h-11 object-cover bg-ivory border border-line shrink-0" loading="lazy" />
            <span className="flex-1 min-w-0 text-xs text-ink-soft truncate">{p}{uploads['public' + p] ? ' · new' : ''}</span>
            <button type="button" onClick={() => move(i, -1)} className="text-ink-mute hover:text-ink p-1"><ChevronUp className="h-4 w-4" /></button>
            <button type="button" onClick={() => move(i, 1)} className="text-ink-mute hover:text-ink p-1"><ChevronDown className="h-4 w-4" /></button>
            <button type="button" onClick={() => onChange(paths.filter((_, j) => j !== i))} className="text-ink-mute hover:text-ink p-1"><Trash2 className="h-4 w-4" /></button>
          </div>
        ))}
        {paths.length === 0 && <p className="p-3 text-xs text-ink-mute">No images yet — upload one, or add an existing path below.</p>}
        <div className="flex gap-2 p-2">
          <input className={inp} placeholder="/images/… (existing file path)" value={manual} onChange={(e) => setManual(e.target.value)} />
          <button
            type="button" className={btnGhost}
            onClick={() => { const v = manual.trim(); if (v) { onChange([...paths, v]); setManual(''); } }}
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function Modal({ title, onClose, children, footer }: { title: string; onClose: () => void; children: React.ReactNode; footer?: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-[80] bg-ivory overflow-y-auto">
      <div className="sticky top-0 z-10 bg-ivory/95 backdrop-blur border-b border-line">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-3">
          <h2 className="font-display text-xl text-ink truncate">{title}</h2>
          <button type="button" onClick={onClose} className="p-2 text-ink-mute hover:text-ink"><X className="h-5 w-5" /></button>
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-5 pb-32">{children}</div>
      {footer && (
        <div className="fixed bottom-0 inset-x-0 bg-paper border-t border-line">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-end gap-3">{footer}</div>
        </div>
      )}
    </div>
  );
}

// ---- main page ----------------------------------------------------------------
export default function AdminPage() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem(SS_AUTH) === '1');
  const [pass, setPass] = useState('');
  const [passErr, setPassErr] = useState('');

  const [baseline, setBaseline] = useState<ListingsData | null>(null);
  const [data, setData] = useState<ListingsData | null>(null);
  const [draftRestored, setDraftRestored] = useState(false);
  const [pendingPassHash, setPendingPassHash] = useState<string | null>(null);
  const [uploads, setUploads] = useState<Uploads>({});

  const [tab, setTab] = useState<'units' | 'buildings' | 'site'>('units');
  const [bFilter, setBFilter] = useState<string>('all');

  const [editUnit, setEditUnit] = useState<{ unit: RawApartment; isNew: boolean } | null>(null);
  const [editBuilding, setEditBuilding] = useState<{ building: RawBuilding; isNew: boolean } | null>(null);
  const [publishOpen, setPublishOpen] = useState(false);

  // Keep search engines away from this route.
  useEffect(() => {
    document.title = 'Pyrgos Studio';
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);
    return () => { document.head.removeChild(meta); };
  }, []);

  // Load the LIVE listings.json as baseline (falls back to the bundled copy),
  // then restore any local draft on top of it.
  useEffect(() => {
    if (!authed) return;
    let cancelled = false;
    (async () => {
      let base: ListingsData = clone(bundledListings);
      try {
        const res = await fetch(`${RAW_URL}?t=${Date.now()}`, { cache: 'no-store' });
        if (res.ok) base = (await res.json()) as ListingsData;
      } catch { /* offline or first deploy: bundled copy is fine */ }
      if (cancelled) return;
      setBaseline(base);
      try {
        const raw = localStorage.getItem(LS_DRAFT);
        if (raw) {
          const draft = JSON.parse(raw) as { data: ListingsData; pendingPassHash?: string | null };
          setData(draft.data);
          setPendingPassHash(draft.pendingPassHash ?? null);
          setDraftRestored(true);
          return;
        }
      } catch { /* corrupt draft -> ignore */ }
      setData(clone(base));
    })();
    return () => { cancelled = true; };
  }, [authed]);

  // Autosave the draft (text only; pending photo uploads live in memory).
  useEffect(() => {
    if (!data || !baseline) return;
    const changed = JSON.stringify(data) !== JSON.stringify(baseline) || pendingPassHash;
    if (changed) {
      localStorage.setItem(LS_DRAFT, JSON.stringify({ data, pendingPassHash, ts: Date.now() }));
    } else {
      localStorage.removeItem(LS_DRAFT);
    }
  }, [data, baseline, pendingPassHash]);

  const dirty = useMemo(() => {
    if (!data || !baseline) return false;
    return JSON.stringify(data) !== JSON.stringify(baseline) || !!pendingPassHash || Object.keys(uploads).length > 0;
  }, [data, baseline, pendingPassHash, uploads]);

  const summary = useMemo(() => {
    if (!data || !baseline) return [] as string[];
    const out: string[] = [];
    const baseById = new Map(baseline.apartments.map((a) => [a.id, a]));
    const dataById = new Map(data.apartments.map((a) => [a.id, a]));
    let added = 0, removed = 0, changed = 0;
    for (const a of data.apartments) {
      const b = baseById.get(a.id);
      if (!b) added += 1;
      else if (JSON.stringify(a) !== JSON.stringify(b)) changed += 1;
    }
    for (const b of baseline.apartments) if (!dataById.has(b.id)) removed += 1;
    if (added) out.push(`${added} unit${added > 1 ? 's' : ''} added`);
    if (changed) out.push(`${changed} unit${changed > 1 ? 's' : ''} edited`);
    if (removed) out.push(`${removed} unit${removed > 1 ? 's' : ''} removed`);
    if (JSON.stringify(data.buildings) !== JSON.stringify(baseline.buildings)) out.push('buildings updated');
    if (JSON.stringify(data.site) !== JSON.stringify(baseline.site) || data.publishPrices !== baseline.publishPrices) out.push('site settings updated');
    const dataStr = JSON.stringify(data);
    const n = Object.keys(uploads).filter((p) => dataStr.includes(p.replace(/^public/, ''))).length;
    if (n) out.push(`${n} photo${n > 1 ? 's' : ''} uploaded`);
    if (pendingPassHash) out.push('passcode changed');
    return out;
  }, [data, baseline, uploads, pendingPassHash]);

  const problems = useMemo(() => {
    if (!data) return [] as string[];
    const out: string[] = [];
    const baselineStr = JSON.stringify(baseline ?? {});
    const lost = (p: string, where: string) => {
      if (p.startsWith('/images/uploads/') && !uploads['public' + p] && !baselineStr.includes(p)) {
        out.push(`Photo "${p.split('/').pop()}" in ${where} was uploaded in a previous session and is gone — remove it or upload it again.`);
      }
    };
    const bSlugs = new Set(data.buildings.map((b) => b.slug));
    const seen = new Set<string>();
    for (const a of data.apartments) {
      if (!a.title.trim()) out.push(`A unit in ${a.buildingSlug} has no title.`);
      if (!a.slug.trim()) out.push(`"${a.title || a.id}" has no URL slug.`);
      if (!bSlugs.has(a.buildingSlug)) out.push(`"${a.title}" points at a missing building (${a.buildingSlug}).`);
      const key = `${a.buildingSlug}/${a.slug}`;
      if (seen.has(key)) out.push(`Duplicate URL slug "${a.slug}" in ${a.buildingSlug}.`);
      seen.add(key);
      [...a.images, ...(a.floorPlans ?? [])].forEach((p) => lost(p, `"${a.title}"`));
    }
    for (const b of data.buildings) {
      if (!b.title.trim()) out.push('A building has no title.');
      if (!b.slug.trim()) out.push(`Building "${b.title}" has no URL slug.`);
      if (b.status !== 'upcoming' && b.images.length === 0) out.push(`Building "${b.title}" is published but has no photos.`);
      [...b.images, ...(b.locationImage ? [b.locationImage] : [])].forEach((p) => lost(p, `building "${b.title}"`));
    }
    return out;
  }, [data, baseline, uploads]);

  // ---- gate ---------------------------------------------------------------
  const tryUnlock = async () => {
    const h = await sha256hex(pass);
    if (h === (adminConfig as { passHash: string }).passHash) {
      sessionStorage.setItem(SS_AUTH, '1');
      setAuthed(true);
      setPassErr('');
    } else {
      setPassErr('That passcode is not right.');
    }
  };

  if (!authed) {
    return (
      <div className="fixed inset-0 z-[60] bg-ivory flex items-center justify-center px-6">
        <div className="w-full max-w-sm border border-line bg-paper p-8 text-center">
          <Lock className="h-6 w-6 text-bronze mx-auto mb-4" />
          <p className="eyebrow mb-1">Pyrgos</p>
          <h1 className="font-display text-3xl text-ink mb-6">Studio</h1>
          <input
            type="password" className={inp + ' text-center'} placeholder="Passcode" value={pass}
            onChange={(e) => setPass(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') void tryUnlock(); }}
            autoFocus
          />
          {passErr && <p className="text-xs text-red-700 mt-2">{passErr}</p>}
          <button type="button" onClick={() => void tryUnlock()} className={btnDark + ' w-full mt-4'}>Enter</button>
          <p className="text-[11px] text-ink-mute mt-6 leading-relaxed">
            Private content panel. Publishing additionally requires a GitHub token, which is never stored on the website.
          </p>
        </div>
      </div>
    );
  }

  if (!data || !baseline) {
    return (
      <div className="fixed inset-0 z-[60] bg-ivory flex items-center justify-center">
        <Loader2 className="h-6 w-6 text-bronze animate-spin" />
      </div>
    );
  }

  // ---- shared mutators ------------------------------------------------------
  const handleUpload = async (files: FileList, dir: string): Promise<string[]> => {
    const webPaths: string[] = [];
    const next: Uploads = {};
    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      const prepared = await prepareImage(f);
      const name = `${slugifyFilename(f.name)}-${Date.now()}${i ? '-' + i : ''}.jpg`;
      const repoPath = `${dir}/${name}`;
      next[repoPath] = prepared;
      webPaths.push('/' + repoPath.replace(/^public\//, ''));
    }
    setUploads((u) => ({ ...u, ...next }));
    return webPaths;
  };

  const moveUnit = (id: string, dir: -1 | 1) => {
    setData((d) => {
      if (!d) return d;
      const arr = [...d.apartments];
      const i = arr.findIndex((a) => a.id === id);
      if (i < 0) return d;
      let j = i + dir;
      while (j >= 0 && j < arr.length && arr[j].buildingSlug !== arr[i].buildingSlug) j += dir;
      if (j < 0 || j >= arr.length) return d;
      [arr[i], arr[j]] = [arr[j], arr[i]];
      return { ...d, apartments: arr };
    });
  };

  const saveUnit = (unit: RawApartment, isNew: boolean) => {
    setData((d) => {
      if (!d) return d;
      const arr = [...d.apartments];
      if (isNew) {
        let last = -1;
        for (let k = 0; k < arr.length; k++) if (arr[k].buildingSlug === unit.buildingSlug) last = k;
        arr.splice(last + 1, 0, unit);
      } else {
        const i = arr.findIndex((a) => a.id === unit.id);
        if (i >= 0) arr[i] = unit; else arr.push(unit);
      }
      return { ...d, apartments: arr };
    });
    setEditUnit(null);
  };

  const discardAll = () => {
    if (!window.confirm('Discard every unpublished change and return to the live content?')) return;
    Object.values(uploads).forEach((u) => URL.revokeObjectURL(u.previewUrl));
    setUploads({});
    setPendingPassHash(null);
    setData(clone(baseline));
    localStorage.removeItem(LS_DRAFT);
    setDraftRestored(false);
  };

  const visibleBuildings = data.buildings;
  const unitsFor = (slug: string) => data.apartments.filter((a) => a.buildingSlug === slug);

  // ---- render ----------------------------------------------------------------
  return (
    <div className="fixed inset-0 z-[60] bg-ivory overflow-y-auto">
      {/* header */}
      <div className="sticky top-0 z-20 bg-ivory/95 backdrop-blur border-b border-line">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <p className="eyebrow leading-none">Pyrgos</p>
            <h1 className="font-display text-2xl text-ink leading-tight">Studio</h1>
          </div>
          {dirty && <span className="hidden sm:inline text-xs text-bronze">Unpublished changes</span>}
          <button type="button" onClick={() => setPublishOpen(true)} disabled={!dirty} className={btnDark}>
            Publish{dirty ? '' : 'ed'}
          </button>
          <button type="button" title="Lock studio" onClick={() => { sessionStorage.removeItem(SS_AUTH); setAuthed(false); }} className="p-2 text-ink-mute hover:text-ink">
            <LogOut className="h-5 w-5" />
          </button>
        </div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex gap-6 text-sm">
          {(['units', 'buildings', 'site'] as const).map((t) => (
            <button
              key={t} type="button" onClick={() => setTab(t)}
              className={`pb-3 -mb-px border-b-2 transition-colors capitalize ${tab === t ? 'border-bronze text-ink' : 'border-transparent text-ink-mute hover:text-ink'}`}
            >
              {t === 'site' ? 'Site settings' : t}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 pb-40 space-y-6">
        {draftRestored && (
          <div className="flex items-start gap-3 border border-bronze/40 bg-paper p-4 text-sm text-ink-soft">
            <AlertTriangle className="h-4 w-4 text-bronze mt-0.5 shrink-0" />
            <div className="flex-1">
              An unpublished draft from a previous session was restored.
              <button type="button" onClick={discardAll} className="ml-2 text-ink border-b border-bronze pb-0.5 hover:text-bronze">Discard it</button>
            </div>
            <button type="button" onClick={() => setDraftRestored(false)} className="text-ink-mute hover:text-ink"><X className="h-4 w-4" /></button>
          </div>
        )}
        {Object.keys(uploads).length > 0 && (
          <p className="text-xs text-ink-mute -mt-2">
            Newly uploaded photos are held in memory — publish before closing this tab or they will need re-uploading.
          </p>
        )}

        {/* ---------------- UNITS ---------------- */}
        {tab === 'units' && (
          <>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => setBFilter('all')} className={`px-3 py-1.5 text-xs border transition-colors ${bFilter === 'all' ? 'bg-ink text-ivory border-ink' : 'border-line text-ink-soft hover:border-bronze'}`}>All buildings</button>
              {visibleBuildings.map((b) => (
                <button key={b.slug} type="button" onClick={() => setBFilter(b.slug)} className={`px-3 py-1.5 text-xs border transition-colors ${bFilter === b.slug ? 'bg-ink text-ivory border-ink' : 'border-line text-ink-soft hover:border-bronze'}`}>{b.title}</button>
              ))}
            </div>

            {visibleBuildings.filter((b) => bFilter === 'all' || b.slug === bFilter).map((b) => (
              <section key={b.slug}>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-display text-xl text-ink">{b.title} <span className="text-ink-mute text-sm font-sans">· {unitsFor(b.slug).length} units</span></h2>
                  <button
                    type="button" className={btnGhost}
                    onClick={() => setEditUnit({
                      isNew: true,
                      unit: { id: '', buildingSlug: b.slug, slug: '', title: '', status: 'available', features: [], images: [], floorPlans: [] },
                    })}
                  >
                    <Plus className="h-4 w-4" /> Add unit
                  </button>
                </div>
                <div className="border border-line divide-y divide-line bg-paper">
                  {unitsFor(b.slug).map((u) => (
                    <div key={u.id} className="flex items-center gap-3 p-3">
                      <img src={resolveImg(u.images[0] ?? u.floorPlans?.[0] ?? '', uploads)} alt="" className="w-16 h-12 object-cover bg-ivory border border-line shrink-0" loading="lazy" />
                      <button type="button" onClick={() => setEditUnit({ unit: clone(u), isNew: false })} className="flex-1 min-w-0 text-left group">
                        <p className="font-display text-ink truncate group-hover:text-bronze transition-colors">{u.title || 'Untitled unit'}</p>
                        <p className="text-xs text-ink-mute truncate">
                          {[u.unitType, u.floorLabel, u.price != null ? '€' + u.price.toLocaleString('en-US') : 'no price'].filter(Boolean).join(' · ')}
                        </p>
                      </button>
                      <select
                        value={u.status} aria-label={`Status of ${u.title}`}
                        onChange={(e) => setData((d) => d && ({ ...d, apartments: d.apartments.map((a) => a.id === u.id ? { ...a, status: e.target.value as ApartmentStatus } : a) }))}
                        className={`text-xs border px-2 py-1.5 bg-paper ${u.status === 'sold' ? 'border-ink text-ink' : u.status === 'reserved' ? 'border-bronze text-bronze' : 'border-line text-ink-soft'}`}
                      >
                        <option value="available">Available</option>
                        <option value="reserved">Reserved</option>
                        <option value="sold">Sold</option>
                      </select>
                      <div className="hidden sm:flex flex-col">
                        <button type="button" onClick={() => moveUnit(u.id, -1)} className="text-ink-mute hover:text-ink"><ChevronUp className="h-4 w-4" /></button>
                        <button type="button" onClick={() => moveUnit(u.id, 1)} className="text-ink-mute hover:text-ink"><ChevronDown className="h-4 w-4" /></button>
                      </div>
                      <button type="button" onClick={() => setEditUnit({ unit: clone(u), isNew: false })} className="p-2 text-ink-mute hover:text-ink"><Pencil className="h-4 w-4" /></button>
                    </div>
                  ))}
                  {unitsFor(b.slug).length === 0 && <p className="p-4 text-sm text-ink-mute">No units in this building yet.</p>}
                </div>
              </section>
            ))}
          </>
        )}

        {/* ---------------- BUILDINGS ---------------- */}
        {tab === 'buildings' && (
          <>
            <div className="flex justify-end">
              <button
                type="button" className={btnGhost}
                onClick={() => setEditBuilding({
                  isNew: true,
                  building: { id: '', slug: '', title: '', location: 'Athens', status: 'upcoming', description: '', images: [], highlights: [] },
                })}
              >
                <Plus className="h-4 w-4" /> Add building
              </button>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {visibleBuildings.map((b) => (
                <button key={b.slug} type="button" onClick={() => setEditBuilding({ building: clone(b), isNew: false })} className="text-left border border-line bg-paper p-4 hover:border-bronze transition-colors group">
                  <div className="aspect-[16/9] bg-ivory border border-line mb-3 overflow-hidden">
                    {b.images[0] && <img src={resolveImg(b.images[0], uploads)} alt="" className="w-full h-full object-cover" loading="lazy" />}
                  </div>
                  <p className="font-display text-lg text-ink group-hover:text-bronze transition-colors">{b.title}</p>
                  <p className="text-xs text-ink-mute">{b.location} · {b.status === 'upcoming' ? 'Upcoming' : 'Published'} · {unitsFor(b.slug).length} units</p>
                </button>
              ))}
            </div>
          </>
        )}

        {/* ---------------- SITE SETTINGS ---------------- */}
        {tab === 'site' && (
          <SiteSettings
            data={data} setData={setData}
            pendingPassHash={pendingPassHash} setPendingPassHash={setPendingPassHash}
            onDiscard={discardAll}
          />
        )}
      </div>

      {/* ---------------- editors & publish ---------------- */}
      {editUnit && (
        <UnitEditor
          key={editUnit.unit.id || 'new'}
          initial={editUnit.unit} isNew={editUnit.isNew} data={data}
          uploads={uploads} onUpload={handleUpload}
          onSave={saveUnit}
          onDelete={(id) => { setData((d) => d && ({ ...d, apartments: d.apartments.filter((a) => a.id !== id) })); setEditUnit(null); }}
          onClose={() => setEditUnit(null)}
        />
      )}
      {editBuilding && (
        <BuildingEditor
          key={editBuilding.building.id || 'new'}
          initial={editBuilding.building} isNew={editBuilding.isNew} data={data}
          uploads={uploads} onUpload={handleUpload}
          onSave={(b, isNew) => {
            setData((d) => {
              if (!d) return d;
              const arr = [...d.buildings];
              let apts = d.apartments;
              if (isNew) arr.push(b);
              else {
                const i = arr.findIndex((x) => x.id === b.id);
                if (i >= 0) {
                  const prevSlug = arr[i].slug;
                  arr[i] = b;
                  if (prevSlug !== b.slug) apts = d.apartments.map((a) => (a.buildingSlug === prevSlug ? { ...a, buildingSlug: b.slug } : a));
                }
              }
              return { ...d, buildings: arr, apartments: apts };
            });
            setEditBuilding(null);
          }}
          onDelete={(slug) => {
            if (unitsFor(slug).length > 0) { window.alert('Move or delete the units in this building first.'); return; }
            setData((d) => d && ({ ...d, buildings: d.buildings.filter((b) => b.slug !== slug) }));
            setEditBuilding(null);
          }}
          onClose={() => setEditBuilding(null)}
        />
      )}
      {publishOpen && (
        <PublishModal
          data={data} summary={summary} problems={problems} uploads={uploads} pendingPassHash={pendingPassHash}
          onClose={() => setPublishOpen(false)}
          onPublished={(published) => {
            Object.values(uploads).forEach((u) => URL.revokeObjectURL(u.previewUrl));
            setUploads({});
            setPendingPassHash(null);
            setBaseline(clone(published));
            setData(clone(published));
            localStorage.removeItem(LS_DRAFT);
            setDraftRestored(false);
          }}
        />
      )}
    </div>
  );
}

// ---- unit editor --------------------------------------------------------------
function UnitEditor({
  initial, isNew, data, uploads, onUpload, onSave, onDelete, onClose,
}: {
  initial: RawApartment; isNew: boolean; data: ListingsData;
  uploads: Uploads; onUpload: (files: FileList, dir: string) => Promise<string[]>;
  onSave: (u: RawApartment, isNew: boolean) => void; onDelete: (id: string) => void; onClose: () => void;
}) {
  const [u, setU] = useState<RawApartment>(initial);
  const [err, setErr] = useState('');
  const set = <K extends keyof RawApartment>(k: K, v: RawApartment[K]) => setU((x) => ({ ...x, [k]: v }));
  const uploadDir = `public/images/uploads/${u.buildingSlug || 'general'}`;

  const save = () => {
    const title = u.title.trim();
    const slug = (u.slug.trim() || slugify(title));
    if (!title) { setErr('The unit needs a title.'); return; }
    if (!slug) { setErr('The unit needs a URL slug.'); return; }
    const clash = data.apartments.some((a) => a.id !== u.id && a.buildingSlug === u.buildingSlug && a.slug === slug);
    if (clash) { setErr(`Another unit in this building already uses the slug "${slug}".`); return; }
    let id = u.id;
    if (isNew) {
      id = `apt_${u.buildingSlug}_${slug}`.replace(/-/g, '_');
      let suffix = 2;
      while (data.apartments.some((a) => a.id === id)) id = `apt_${u.buildingSlug}_${slug}_${suffix++}`.replace(/-/g, '_');
    }
    onSave({ ...u, id, title, slug }, isNew);
  };

  return (
    <Modal
      title={isNew ? 'New unit' : u.title || 'Edit unit'} onClose={onClose}
      footer={
        <>
          {!isNew && (
            <button type="button" className="mr-auto inline-flex items-center gap-2 text-sm text-red-800 hover:text-red-600" onClick={() => { if (window.confirm(`Delete "${u.title}"? This is removed from the site on next publish.`)) onDelete(u.id); }}>
              <Trash2 className="h-4 w-4" /> Delete
            </button>
          )}
          <button type="button" className={btnGhost} onClick={onClose}>Cancel</button>
          <button type="button" className={btnDark} onClick={save}>{isNew ? 'Add unit' : 'Apply'}</button>
        </>
      }
    >
      {err && <p className="text-sm text-red-700 border border-red-200 bg-red-50 p-3">{err}</p>}
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Title"><input className={inp} value={u.title} onChange={(e) => set('title', e.target.value)} placeholder="Duplex D1" /></Field>
        <Field label="URL slug" hint="Leave blank to derive from the title — this sets the page URL.">
          <input className={inp} value={u.slug} onChange={(e) => set('slug', slugify(e.target.value))} placeholder={slugify(u.title) || 'duplex-d1'} />
        </Field>
        <Field label="Building">
          <select className={inp} value={u.buildingSlug} onChange={(e) => set('buildingSlug', e.target.value)}>
            {data.buildings.map((b) => <option key={b.slug} value={b.slug}>{b.title}</option>)}
          </select>
        </Field>
        <Field label="Status">
          <select className={inp} value={u.status} onChange={(e) => set('status', e.target.value as ApartmentStatus)}>
            <option value="available">Available</option><option value="reserved">Reserved</option><option value="sold">Sold</option>
          </select>
        </Field>
        <Field label="Price (€)" hint='Hidden site-wide when "Show prices" is off.'><NumInput value={u.price} onChange={(v) => set('price', v)} placeholder="565000" /></Field>
        <Field label="Unit type"><input className={inp} value={u.unitType ?? ''} onChange={(e) => set('unitType', e.target.value || undefined)} placeholder="Simplex / Duplex" /></Field>
        <Field label="Floor label"><input className={inp} value={u.floorLabel ?? ''} onChange={(e) => set('floorLabel', e.target.value || undefined)} placeholder="3rd floor" /></Field>
        <Field label="Parking"><input className={inp} value={u.parking ?? ''} onChange={(e) => set('parking', e.target.value || undefined)} placeholder="1 spot included" /></Field>
        <Field label="Interior m²"><NumInput value={u.sizeInteriorSqm} onChange={(v) => set('sizeInteriorSqm', v)} /></Field>
        <Field label="Balconies m²"><NumInput value={u.balconiesSqm} onChange={(v) => set('balconiesSqm', v)} /></Field>
        <Field label="Garden m²"><NumInput value={u.gardenSqm} onChange={(v) => set('gardenSqm', v)} /></Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Beds"><NumInput value={u.beds} onChange={(v) => set('beds', v)} /></Field>
          <Field label="Baths"><NumInput value={u.baths} onChange={(v) => set('baths', v)} /></Field>
        </div>
      </div>
      <Field label="Features"><TagsEditor values={u.features} onChange={(v) => set('features', v)} placeholder="e.g. Private garden" /></Field>
      <Field label="Description"><textarea className={inp + ' min-h-28'} value={u.description ?? ''} onChange={(e) => set('description', e.target.value || undefined)} /></Field>
      <ImageListEditor label="Photos" paths={u.images} onChange={(v) => set('images', v)} uploads={uploads} onUpload={onUpload} uploadDir={uploadDir} />
      <ImageListEditor label="Floor plans" paths={u.floorPlans ?? []} onChange={(v) => set('floorPlans', v.length ? v : undefined)} uploads={uploads} onUpload={onUpload} uploadDir={uploadDir} />
    </Modal>
  );
}

// ---- building editor ------------------------------------------------------------
function BuildingEditor({
  initial, isNew, data, uploads, onUpload, onSave, onDelete, onClose,
}: {
  initial: RawBuilding; isNew: boolean; data: ListingsData;
  uploads: Uploads; onUpload: (files: FileList, dir: string) => Promise<string[]>;
  onSave: (b: RawBuilding, isNew: boolean) => void; onDelete: (slug: string) => void; onClose: () => void;
}) {
  const [b, setB] = useState<RawBuilding>(initial);
  const [err, setErr] = useState('');
  const set = <K extends keyof RawBuilding>(k: K, v: RawBuilding[K]) => setB((x) => ({ ...x, [k]: v }));
  const uploadDir = `public/images/uploads/${b.slug || 'buildings'}`;

  const save = () => {
    const title = b.title.trim();
    const slug = b.slug.trim() || slugify(title);
    if (!title) { setErr('The building needs a title.'); return; }
    if (data.buildings.some((x) => x.id !== b.id && x.slug === slug)) { setErr(`Another building already uses the slug "${slug}".`); return; }
    let id = b.id;
    if (isNew) id = `bld_${slug}`.replace(/-/g, '_');
    onSave({ ...b, id, title, slug }, isNew);
  };

  return (
    <Modal
      title={isNew ? 'New building' : b.title || 'Edit building'} onClose={onClose}
      footer={
        <>
          {!isNew && (
            <button type="button" className="mr-auto inline-flex items-center gap-2 text-sm text-red-800 hover:text-red-600" onClick={() => onDelete(b.slug)}>
              <Trash2 className="h-4 w-4" /> Delete
            </button>
          )}
          <button type="button" className={btnGhost} onClick={onClose}>Cancel</button>
          <button type="button" className={btnDark} onClick={save}>{isNew ? 'Add building' : 'Apply'}</button>
        </>
      }
    >
      {err && <p className="text-sm text-red-700 border border-red-200 bg-red-50 p-3">{err}</p>}
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Title"><input className={inp} value={b.title} onChange={(e) => set('title', e.target.value)} /></Field>
        <Field label="URL slug" hint="Changing this changes the building's public URL."><input className={inp} value={b.slug} onChange={(e) => set('slug', slugify(e.target.value))} placeholder={slugify(b.title)} /></Field>
        <Field label="Status" hint='"Upcoming" shows the building as coming soon.'>
          <select className={inp} value={b.status ?? 'available'} onChange={(e) => set('status', e.target.value === 'upcoming' ? 'upcoming' : 'available')}>
            <option value="available">Published</option><option value="upcoming">Upcoming</option>
          </select>
        </Field>
        <Field label="Neighbourhood"><input className={inp} value={b.location} onChange={(e) => set('location', e.target.value)} placeholder="Glyfada" /></Field>
        <Field label="Address"><input className={inp} value={b.address ?? ''} onChange={(e) => set('address', e.target.value || undefined)} /></Field>
        <Field label='"From" price override (€)' hint="Blank = automatic from the cheapest unsold unit.">
          <NumInput value={b.startingPriceFrom} onChange={(v) => set('startingPriceFrom', v)} />
        </Field>
      </div>
      <Field label="Description"><textarea className={inp + ' min-h-28'} value={b.description} onChange={(e) => set('description', e.target.value)} /></Field>
      <Field label="Location description"><textarea className={inp + ' min-h-24'} value={b.locationDescription ?? ''} onChange={(e) => set('locationDescription', e.target.value || undefined)} /></Field>
      <Field label="Highlights"><TagsEditor values={b.highlights} onChange={(v) => set('highlights', v)} placeholder="e.g. Energy Class A" /></Field>
      <ImageListEditor label="Building photos" paths={b.images} onChange={(v) => set('images', v)} uploads={uploads} onUpload={onUpload} uploadDir={uploadDir} />
      <ImageListEditor label="Location image" paths={b.locationImage ? [b.locationImage] : []} onChange={(v) => set('locationImage', v[v.length - 1])} uploads={uploads} onUpload={onUpload} uploadDir={uploadDir} />
      {b.brochure && <p className="text-xs text-ink-mute">Brochure: {b.brochure.pdf} ({b.brochure.pages} pages) — replacing brochures is handled by your developer.</p>}
    </Modal>
  );
}

// ---- site settings -------------------------------------------------------------
function SiteSettings({
  data, setData, pendingPassHash, setPendingPassHash, onDiscard,
}: {
  data: ListingsData; setData: React.Dispatch<React.SetStateAction<ListingsData | null>>;
  pendingPassHash: string | null; setPendingPassHash: (h: string | null) => void;
  onDiscard: () => void;
}) {
  const [np1, setNp1] = useState('');
  const [np2, setNp2] = useState('');
  const [passMsg, setPassMsg] = useState('');
  const setSite = (patch: Partial<ListingsData['site']>) => setData((d) => d && ({ ...d, site: { ...d.site, ...patch } }));

  return (
    <div className="space-y-8 max-w-2xl">
      <section className="space-y-4">
        <h2 className="font-display text-xl text-ink">Content</h2>
        <label className="flex items-center gap-3 border border-line bg-paper p-4 cursor-pointer">
          <input type="checkbox" checked={data.publishPrices} onChange={(e) => setData((d) => d && ({ ...d, publishPrices: e.target.checked }))} className="accent-[#a9824f] h-4 w-4" />
          <span className="text-sm text-ink">Show euro prices on the website <span className="text-ink-mute">(off = “Price on request”)</span></span>
        </label>
        <Field label="Tagline"><textarea className={inp} value={data.site.tagline} onChange={(e) => setSite({ tagline: e.target.value })} /></Field>
        <Field label="Projects page headline"><input className={inp} value={data.site.projectsHeadline} onChange={(e) => setSite({ projectsHeadline: e.target.value })} /></Field>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-xl text-ink">Contact</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Email"><input className={inp} value={data.site.email} onChange={(e) => setSite({ email: e.target.value })} /></Field>
          <Field label="WhatsApp number" hint='With country code, e.g. +30 698 610 8962. Shown as a "WhatsApp" button on unit pages; blank hides it.'>
            <input className={inp} value={data.site.whatsapp} onChange={(e) => setSite({ whatsapp: e.target.value })} placeholder="+30 …" />
          </Field>
          <Field label="Address"><input className={inp} value={data.site.address} onChange={(e) => setSite({ address: e.target.value })} /></Field>
          <Field label="Location (short)"><input className={inp} value={data.site.locationShort} onChange={(e) => setSite({ locationShort: e.target.value })} /></Field>
        </div>
        <Field label="Phones">
          <div className="space-y-2">
            {data.site.phones.map((p, i) => (
              <div key={i} className="flex gap-2">
                <input className={inp + ' w-24'} value={p.label} onChange={(e) => setData((d) => d && ({ ...d, site: { ...d.site, phones: d.site.phones.map((x, j) => j === i ? { ...x, label: e.target.value } : x) } }))} />
                <input className={inp} value={p.display} onChange={(e) => { const display = e.target.value; setData((d) => d && ({ ...d, site: { ...d.site, phones: d.site.phones.map((x, j) => j === i ? { ...x, display, href: 'tel:' + display.replace(/[^+\d]/g, '') } : x) } })); }} />
                <button type="button" className="p-2 text-ink-mute hover:text-ink" onClick={() => setData((d) => d && ({ ...d, site: { ...d.site, phones: d.site.phones.filter((_, j) => j !== i) } }))}><Trash2 className="h-4 w-4" /></button>
              </div>
            ))}
            <button type="button" className={btnGhost} onClick={() => setData((d) => d && ({ ...d, site: { ...d.site, phones: [...d.site.phones, { label: 'Office', display: '', href: 'tel:' }] } }))}><Plus className="h-4 w-4" /> Add phone</button>
          </div>
        </Field>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-xl text-ink">Studio passcode</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="New passcode"><input type="password" className={inp} value={np1} onChange={(e) => setNp1(e.target.value)} /></Field>
          <Field label="Repeat it"><input type="password" className={inp} value={np2} onChange={(e) => setNp2(e.target.value)} /></Field>
        </div>
        <button
          type="button" className={btnGhost}
          onClick={async () => {
            if (np1.length < 8) { setPassMsg('Use at least 8 characters.'); return; }
            if (np1 !== np2) { setPassMsg('The two entries do not match.'); return; }
            setPendingPassHash(await sha256hex(np1));
            setNp1(''); setNp2('');
            setPassMsg('Queued — the new passcode takes effect after the next publish. Do not forget it.');
          }}
        >
          Queue passcode change
        </button>
        {pendingPassHash && <p className="text-xs text-bronze">A passcode change is queued for the next publish.</p>}
        {passMsg && <p className="text-xs text-ink-soft">{passMsg}</p>}
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-xl text-ink">Maintenance</h2>
        <a href={`https://github.com/${REPO}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-sm text-ink border-b border-bronze pb-0.5 hover:text-bronze">
          Open the repository <ExternalLink className="h-3.5 w-3.5" />
        </a>
        <p className="text-xs text-ink-mute leading-relaxed">
          Every publish is a git commit — the full history (and any rollback) lives in the repository.
        </p>
        <button type="button" onClick={onDiscard} className="inline-flex items-center gap-2 text-sm text-red-800 hover:text-red-600">
          <Trash2 className="h-4 w-4" /> Discard all unpublished changes
        </button>
      </section>
    </div>
  );
}

// ---- publish modal --------------------------------------------------------------
function PublishModal({
  data, summary, problems, uploads, pendingPassHash, onClose, onPublished,
}: {
  data: ListingsData; summary: string[]; problems: string[]; uploads: Uploads;
  pendingPassHash: string | null; onClose: () => void; onPublished: (d: ListingsData) => void;
}) {
  const [token, setToken] = useState(() => sessionStorage.getItem(SS_TOKEN) ?? '');
  const [remember, setRemember] = useState(true);
  const [state, setState] = useState<'idle' | 'working' | 'done' | 'error'>('idle');
  const [progress, setProgress] = useState('');
  const [error, setError] = useState('');
  const [commitUrl, setCommitUrl] = useState('');

  const publish = async () => {
    if (!token.trim()) { setError('Paste a GitHub token to publish.'); return; }
    setState('working'); setError('');
    try {
      setProgress('Checking the token…');
      const v = await validateToken(token.trim());
      if (!v.ok) throw new Error(v.error ?? 'Token rejected');
      if (remember) sessionStorage.setItem(SS_TOKEN, token.trim());

      const dataStr = JSON.stringify(data);
      const files: PublishFile[] = [
        { path: 'src/data/listings.json', contentUtf8: JSON.stringify(data, null, 2) + '\n' },
        ...Object.entries(uploads)
          .filter(([path]) => dataStr.includes(path.replace(/^public/, '')))
          .map(([path, u]) => ({ path, contentB64: u.b64 })),
      ];
      if (pendingPassHash) {
        const cfg = { ...(adminConfig as { adminPath: string; passHash: string }), passHash: pendingPassHash };
        files.push({ path: 'src/admin/admin.config.json', contentUtf8: JSON.stringify(cfg, null, 2) + '\n' });
      }
      const message = `Pyrgos Studio: ${summary.join(', ') || 'content update'}`;
      const res = await publishCommit(token.trim(), files, message, setProgress);
      setCommitUrl(res.url);
      setState('done');
      onPublished(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Publish failed');
      setState('error');
    }
  };

  return (
    <div className="fixed inset-0 z-[90] bg-ink/40 flex items-end sm:items-center justify-center p-0 sm:p-6" onClick={state === 'working' ? undefined : onClose}>
      <div className="w-full max-w-lg bg-ivory border border-line p-6 sm:p-8 max-h-[92vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {state === 'done' ? (
          <div className="text-center py-6">
            <CheckCircle2 className="h-9 w-9 text-bronze mx-auto mb-4" />
            <h2 className="font-display text-2xl text-ink mb-2">Published</h2>
            <p className="text-sm text-ink-soft mb-5">Netlify is rebuilding the site — changes are live in about 1–2 minutes.</p>
            {commitUrl && (
              <a href={commitUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-sm text-ink border-b border-bronze pb-0.5 hover:text-bronze mb-6">
                View the commit <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
            <div><button type="button" className={btnDark} onClick={onClose}>Done</button></div>
            <p className="text-[11px] text-ink-mute mt-5">If this token was created just for this session, you can revoke it on GitHub now.</p>
          </div>
        ) : (
          <>
            <h2 className="font-display text-2xl text-ink mb-4">Publish to the live site</h2>
            {problems.length > 0 ? (
              <div className="border border-red-200 bg-red-50 p-4 mb-5">
                <p className="text-sm text-red-800 mb-2 flex items-center gap-2"><AlertTriangle className="h-4 w-4" /> Fix these before publishing:</p>
                <ul className="text-xs text-red-800 space-y-1 list-disc pl-4">{problems.map((p, i) => <li key={i}>{p}</li>)}</ul>
              </div>
            ) : (
              <ul className="text-sm text-ink-soft mb-5 space-y-1">
                {summary.map((s, i) => <li key={i} className="flex items-center gap-2"><span className="h-1 w-1 bg-bronze rounded-full" />{s}</li>)}
                {summary.length === 0 && <li>No changes detected.</li>}
              </ul>
            )}
            <Field label="GitHub token" hint="Fine-grained, this repository only, Contents: read & write. Held for this browser session only — never published.">
              <input type="password" className={inp} value={token} onChange={(e) => setToken(e.target.value)} placeholder="github_pat_…" />
            </Field>
            <div className="flex items-center justify-between mt-2 mb-5">
              <label className="flex items-center gap-2 text-xs text-ink-soft">
                <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="accent-[#a9824f]" /> Keep for this session
              </label>
              <a href="https://github.com/settings/personal-access-tokens" target="_blank" rel="noreferrer" className="text-xs text-ink border-b border-bronze pb-0.5 hover:text-bronze">Create a token</a>
            </div>
            {state === 'working' && (
              <p className="text-sm text-ink-soft mb-4 flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin text-bronze" /> {progress}</p>
            )}
            {error && <p className="text-sm text-red-700 mb-4">{error}</p>}
            <div className="flex justify-end gap-3">
              <button type="button" className={btnGhost} onClick={onClose} disabled={state === 'working'}>Cancel</button>
              <button type="button" className={btnDark} onClick={() => void publish()} disabled={state === 'working' || problems.length > 0}>
                {state === 'working' ? 'Publishing…' : 'Publish'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
