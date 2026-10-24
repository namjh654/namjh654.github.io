// 첨부 이미지를 브라우저에서 줄여 base64 로 바꾼다. (서버 요청 한도 4.5MB 안에 5장이 들어가도록)

export interface Attachment {
  id: string;
  name: string;
  type: "image/jpeg" | "image/png" | "image/webp";
  /** base64 (data: 접두사 없음) */
  content: string;
  bytes: number;
  preview: string;
}

const MAX_SIDE = 1600;
const QUALITY = 0.82;

const loadImage = (file: File) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("이미지를 읽지 못했습니다."));
    };
    img.src = url;
  });

export async function toAttachment(file: File): Promise<Attachment> {
  if (!file.type.startsWith("image/")) throw new Error("이미지 파일만 첨부할 수 있습니다.");
  const img = await loadImage(file);
  const scale = Math.min(1, MAX_SIDE / Math.max(img.naturalWidth, img.naturalHeight));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(img.naturalWidth * scale);
  canvas.height = Math.round(img.naturalHeight * scale);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("이미지를 처리하지 못했습니다.");
  // 투명 PNG 를 JPEG 로 바꿀 때 검게 나오지 않도록 흰 바탕
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  URL.revokeObjectURL(img.src);

  const dataUrl = canvas.toDataURL("image/jpeg", QUALITY);
  const content = dataUrl.split(",")[1];
  return {
    id: `${file.name}-${file.size}-${file.lastModified}`,
    name: file.name.replace(/\.[^.]+$/, "") + ".jpg",
    type: "image/jpeg",
    content,
    bytes: Math.floor((content.length * 3) / 4),
    preview: dataUrl,
  };
}

export const formatBytes = (n: number) =>
  n < 1024 * 1024 ? `${Math.round(n / 1024)}KB` : `${(n / 1024 / 1024).toFixed(1)}MB`;
