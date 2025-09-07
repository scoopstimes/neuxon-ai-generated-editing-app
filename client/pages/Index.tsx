import { Buffer } from "buffer";
import { useEffect, useMemo, useRef, useState } from "react";
import showcaseData from "@/data/showcase.json";

import { GoogleGenAI } from "@google/genai";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface LocalImage {
  file: File;
  previewUrl: string;
  width: number;
  height: number;
}

const MAX_FILES = 5;
const MAX_SIZE = 8 * 1024 * 1024; // 8MB
const MAX_DIM = 2048; // px

function useLocalStorage(key: string, initial: string = "") {
  const [value, setValue] = useState<string>(() => {
    try {
      const v = localStorage.getItem(key);
      return v ?? initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, value);
    } catch {}
  }, [key, value]);
  return [value, setValue] as const;
}

async function fileToImageInfo(file: File): Promise<LocalImage> {
  const url = URL.createObjectURL(file);
  try {
    const dims = await new Promise<{ width: number; height: number }>(
      (resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve({ width: img.width, height: img.height });
        img.onerror = () => reject(new Error("Failed to load image"));
        img.src = url;
      },
    );
    return { file, previewUrl: url, width: dims.width, height: dims.height };
  } catch (e) {
    URL.revokeObjectURL(url);
    throw e;
  }
}

async function resizeToMax(
  file: File,
): Promise<{ mimeType: string; data: string }> {
  const imageBitmap = await createImageBitmap(file);
  let { width, height } = imageBitmap;
  const scale = Math.min(1, MAX_DIM / Math.max(width, height));
  if (scale < 1) {
    width = Math.floor(width * scale);
    height = Math.floor(height * scale);
  }
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");
  ctx.drawImage(imageBitmap, 0, 0, width, height);
  const mimeType =
    file.type === "image/png" || file.type === "image/webp"
      ? file.type
      : "image/jpeg";
  const dataUrl = canvas.toDataURL(mimeType, 0.92);
  const base64 = dataUrl.split(",")[1] ?? "";
  return { mimeType, data: base64 };
}

function Sidebar({
  mode,
  setMode,
}: {
  mode: "image" | "text";
  setMode: (m: "image" | "text") => void;
}) {
  return (
    <aside className="hidden md:flex md:flex-col w-64 shrink-0 border-r bg-sidebar p-6 gap-4">
      <div className="flex items-center gap-2">
        <div className="h-9 w-9 rounded-md grid place-items-center">
          <img  src="https://januarzzz-ai-seven.vercel.app/neuxon.png"></img>
        </div>
        <div>
          <div className="font-extrabold tracking-tight text-lg">
            Neuxon Generate & Editing Image
          </div>
          <div className="text-xs text-muted-foreground">
            Neuxon with N-Flash 2.5
          </div>
        </div>
      </div>
      <Separator />
      <nav className="flex flex-col gap-2">
        <Button
          variant={mode === "image" ? "secondary" : "ghost"}
          className="justify-start"
          onClick={() => setMode("image")}
        >
          Image
        </Button>
        <Button
          variant={mode === "text" ? "secondary" : "ghost"}
          className="justify-start"
          onClick={() => setMode("text")}
        >
          Text-to-Image
        </Button>
      </nav>
    </aside>
  );
}

function ModelInput({
  model,
  setModel,
}: {
  model: string;
  setModel: (v: string) => void;
}) {
  return (
    <Input
      type="text"
      placeholder="Model (e.g. gemini-2.0-flash-exp)"
      value={model}
      onChange={(e) => setModel(e.target.value)}
    />
  );
}

export default function Index() {
  const apiKey = "AIzaSyDXgSANyZJ7tAZn-goXJcqXiAGAcqthPK0";
  const [prompt, setPrompt] = useState("");
  const [images, setImages] = useState<LocalImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [resultUrls, setResultUrls] = useState<string[] | null>(null);
  const [model, setModel] = useState<string>("neuxon-flash-2.5-image-generated");
  const [mode, setMode] = useState<"image" | "text">("image");
  const dropRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);
  const [allowShowcaseScroll, setAllowShowcaseScroll] = useState(false);
  // Ganti state loadingProgress dengan loadingTime
  const [loadingTime, setLoadingTime] = useState(0);

  // Update useEffect untuk menghitung waktu
  useEffect(() => {
    if (isLoading) {
      const startTime = Date.now();
      const interval = setInterval(() => {
        const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
        setLoadingTime(elapsedSeconds);
      }, 1000);
      return () => {
        clearInterval(interval);
        setLoadingTime(0);
      };
    }
  }, [isLoading]);

  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    const el = dropRef.current;
    if (!el) return;
    const prevent = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };
    const onDrop = (e: DragEvent) => {
      prevent(e);
      const dt = e.dataTransfer;
      if (!dt) return;
      const files = Array.from(dt.files);
      handleFiles(files);
    };
    el.addEventListener("dragover", prevent);
    el.addEventListener("drop", onDrop);
    return () => {
      el.removeEventListener("dragover", prevent);
      el.removeEventListener("drop", onDrop);
    };
  }, []);

  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;
    const onScroll = () => {
      const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 1;
      setAllowShowcaseScroll(atBottom);
    };
    onScroll();
    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const canGenerate = useMemo(
    () =>
      Boolean(
        apiKey &&
          prompt &&
          !isLoading &&
          (mode === "text" || images.length > 0),
      ),
    [apiKey, prompt, images, isLoading, mode],
  );

  async function handleFiles(files: File[]) {
    const imgs: LocalImage[] = [];
    for (const f of files) {
      if (!f.type.startsWith("image/")) continue;
      if (f.size > MAX_SIZE) {
        toast.error(`${f.name} exceeds 8MB limit`);
        continue;
      }
      try {
        const info = await fileToImageInfo(f);
        if (Math.max(info.width, info.height) > MAX_DIM * 2) {
          toast.message(
            `${f.name} is very large, will be downscaled on upload`,
          );
        }
        imgs.push(info);
      } catch {
        toast.error(`Failed to read ${f.name}`);
      }
    }
    const merged = [...images, ...imgs].slice(0, MAX_FILES);
    if (merged.length === 0) {
      toast.error("Please add 1–5 image files");
    }
    setImages(merged);
  }

  async function onGenerate() {
    try {
      const ai = new GoogleGenAI({ apiKey: apiKey });
      setIsLoading(true);
      setResultUrls(null);

      const imageParts = await Promise.all(
        images.map(async (i) => {
          const resized = await resizeToMax(i.file);
          return {
            inlineData: {
              mimeType: resized.mimeType,
              data: resized.data,
            },
          };
        }),
      );

      const newPrompt = [{ text: prompt }, ...imageParts];

      const response = await ai.models.generateContent({
        model: "neuxon-flash-2.5-image-generated",
        contents: newPrompt,
      });

      const newResultUrls: string[] = [];
      for (const candidate of response.candidates[0].content.parts) {
        if (candidate.inlineData) {
          const blob = new Blob(
            [Buffer.from(candidate.inlineData.data, "base64")],
            {
              type: candidate.inlineData.mimeType,
            },
          );
          const url = URL.createObjectURL(blob);
          newResultUrls.push(url);
        }
      }
      setResultUrls(newResultUrls);
      toast.success("Generated image ready");
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to generate");
    } finally {
      setIsLoading(false);
    }
  }

  function onReset() {
    setPrompt("");
    setImages([]);
    setResultUrls(null);
  }

  function applyPreset(type: "removebg" | "cyberpunk" | "portrait") {
    const map = {
      removebg:
        "Remove background, clean subject cutout, smooth edges, high-quality alpha",
      cyberpunk:
        "Cyberpunk neon lights, rainy city reflections, dramatic rim light, high contrast",
      portrait:
        "Studio portrait, soft key light, 85mm lens look, shallow depth of field",
    } as const;
    const extra = map[type];
    setPrompt((p) => (p ? `${p}\n\n${extra}` : extra));
  }

  async function useExampleItem(item: {
    image: string;
    prompt: string;
    image_ingredients?: string[];
  }) {
    try {
      const imagesToLoad = item.image_ingredients || [item.image];
      const loadedImages: LocalImage[] = [];

      for (const imgUrl of imagesToLoad) {
        const r = await fetch(imgUrl);
        const b = await r.blob();
        const file = new File([b], imgUrl.split("/").pop() || "example.png", {
          type: b.type || "image/png",
        });
        const info = await fileToImageInfo(file);
        loadedImages.push(info);
      }

      if (mode === "image") {
        setImages(loadedImages);
      } else {
        setImages([]);
      }
      setPrompt(item.prompt);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e: any) {
      console.error(e);
      toast.error("Failed to load example");
    }
  }

  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Prompt copied");
    } catch {
      toast.error("Copy failed");
    }
  }

  return (
    <div className="h-screen bg-gradient-to-br from-muted to-background text-foreground">
      <div className="mx-auto max-w-7xl flex h-full">
        <Sidebar mode={mode} setMode={setMode} />
        <main
          ref={mainRef}
          className="flex-1 min-h-0 p-6 md:p-10 overflow-y-auto"
        >
          <header className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                Neuxon Generate & Editing Image
              </h1>
              <p className="text-sm text-muted-foreground">
                Image editing with Neuxon AI
              </p>
            </div>
          
          </header>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 min-h-0 overflow-y-auto">
            <div className="xl:col-span-2 space-y-6">
            <Card>
  <CardHeader>
    <CardTitle>Model</CardTitle>
    <CardDescription>
     N-Flash 2.5
    </CardDescription>
  </CardHeader>
</Card>
              {mode === "image" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Upload images</CardTitle>
                    <CardDescription>
                      1–5 files, up to 8MB each, max 2048px
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div
                      ref={dropRef}
                      className={cn(
                        "flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-lg p-8 text-center",
                        "bg-accent/30 hover:bg-accent/50 transition-colors",
                      )}
                    >
                      <div className="text-sm text-muted-foreground">
                        Drag & drop images here or
                      </div>
                      <label className="inline-flex items-center gap-2">
                        <Input
                          id="file-upload"
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          onChange={(e) => {
                            const f = e.target.files
                              ? Array.from(e.target.files)
                              : [];
                            handleFiles(f);
                            e.currentTarget.value = "";
                          }}
                        />
                        <Button asChild>
                          <label htmlFor="file-upload">Browse</label>
                        </Button>
                      </label>
                      <div className="text-xs text-muted-foreground">
                        {images.length}/{MAX_FILES} selected
                      </div>
                    </div>
                    {images.length > 0 && (
                      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
                        {images.map((img, i) => (
                          <div key={i} className="relative group">
                            <img
                              src={img.previewUrl}
                              alt={`upload-${i}`}
                              className="w-full h-28 object-cover rounded-md border"
                            />
                            <button
                              className="absolute top-2 right-2 text-xs px-2 py-1 rounded bg-background/80 border shadow opacity-0 group-hover:opacity-100 transition"
                              onClick={() =>
                                setImages((arr) =>
                                  arr.filter((_, idx) => idx !== i),
                                )
                              }
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle>Prompt</CardTitle>
                  <CardDescription>
                    Describe your edit intent or style
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="e.g. Clean product cutout with slight drop shadow"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    rows={6}
                  />
                  <div className="flex flex-wrap gap-2 mt-3">
                    {mode === "image" && (
                      <Button
                        variant="outline"
                        onClick={() => applyPreset("removebg")}
                      >
                        Remove BG
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      onClick={() => applyPreset("cyberpunk")}
                    >
                      Cyberpunk
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => applyPreset("portrait")}
                    >
                      Studio Portrait
                    </Button>
                  </div>
                </CardContent>
                <CardFooter className="flex items-center gap-3">
                  <Button disabled={!canGenerate} onClick={onGenerate}>
                    {isLoading ? "Generating..." : "Generate"}
                  </Button>
                  <Button variant="ghost" onClick={onReset}>
                    Reset
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Result</CardTitle>
                  <CardDescription>Preview and download</CardDescription>
                </CardHeader>
                <CardContent>
                  {resultUrls && resultUrls.length > 0 ? (
                    <div className="space-y-3">
                      {resultUrls.map((url, index) => (
                        <img
                          key={index}
                          src={url}
                          alt={`result-${index}`}
                          className="w-full max-h-[480px] object-contain rounded-md border"
                        />
                      ))}
                      <div className="flex gap-2">
                        {resultUrls.map((url, index) => (
                          <Button asChild key={index}>
                            <a
                              href={url}
                              download={`neuxon-results-${index}.png`}
                            >
                              Download {index + 1}
                            </a>
                          </Button>
                        ))}
                        <Button
                          variant="outline"
                          onClick={() => setResultUrls(null)}
                        >
                          Clear
                        </Button>
                      </div>
                    </div>
                  ) : isLoading ? (
                    <div className="space-y-4 animate-pulse">
                      <div className="h-[320px] bg-muted rounded-md flex items-center justify-center">
                        <div className="text-sm text-muted-foreground flex flex-col items-center gap-2">
                          <div className="loading-spinner h-6 w-6 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          <div>Generating... {Math.floor(loadingTime)}s</div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground">
                      No result yet
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="xl:col-span-1 flex flex-col min-h-0">
              <Card className="h-full flex flex-col">
                <CardHeader>
                  <CardTitle>Showcase</CardTitle>
                  <CardDescription>
                    Use an example or copy its prompt
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 flex-1 pr-2 overflow-y-auto">
                  {(mode === "image"
                    ? (showcaseData as any).image
                    : (showcaseData as any).text
                  ).map((item: any, idx: number) => (
                    <div
                      key={idx}
                      className="rounded-lg border overflow-hidden"
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-40 object-cover"
                      />
                      <div className="p-4 space-y-2">
                        <div className="font-medium">{item.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {item.description}
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {item.tags.map((t, i) => (
                            <Badge key={i} variant="secondary">
                              {t}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex gap-2 pt-2">
                          <Button
                            size="sm"
                            onClick={() => useExampleItem(item)}
                          >
                            Use this template
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copy(item.prompt)}
                          >
                            Copy prompt
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
