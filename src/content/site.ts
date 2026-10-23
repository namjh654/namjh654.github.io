// 사이트 공통 정보. 브랜드명·연락처·카테고리는 여기서만 수정한다.

export const site = {
  brand: "BONGBONG STUDIO",
  brandShort: "BONGBONG",
  brandKo: "봉봉 스튜디오",
  tagline: "공간에 오래 남는 이야기를 설계합니다.",
  intro:
    "봉봉 스튜디오는 주거·상업 공간의 설계와 리모델링, 그리고 공간에 어울리는 브랜드 경험을 함께 만드는 디자인 스튜디오입니다.",
  email: "namjh654@gmail.com",
  phone: "",
  address: "Seoul, Korea",
  instagram: "",
  since: 2024,
};

// 프로젝트 카테고리. project.json 의 "category" 는 이 키 중 하나여야 한다.
export const categories = {
  residential: "주거",
  commercial: "상업",
  remodeling: "리모델링",
  branding: "브랜딩",
} as const;

export type CategoryKey = keyof typeof categories;

export const services = [
  {
    title: "Architecture",
    titleKo: "건축 설계",
    body: "대지와 생활 방식을 읽고, 오래 머물 수 있는 구조와 비례를 제안합니다.",
  },
  {
    title: "Remodeling",
    titleKo: "리모델링",
    body: "기존 공간의 흔적을 살리면서 동선과 빛, 수납을 새로 정리합니다.",
  },
  {
    title: "Interior",
    titleKo: "인테리어 디자인",
    body: "재료와 조명, 가구까지 하나의 톤으로 맞춰 완성도를 높입니다.",
  },
  {
    title: "Branding",
    titleKo: "공간 브랜딩",
    body: "공간의 성격을 로고·사인·그래픽으로 이어 브랜드 경험을 만듭니다.",
  },
];

export const processSteps = [
  { step: "01", title: "상담", body: "공간과 예산, 일정, 원하는 분위기를 함께 정리합니다." },
  { step: "02", title: "실측·기획", body: "현장 실측 후 공간 계획과 방향을 제안합니다." },
  { step: "03", title: "디자인", body: "도면, 재료, 3D 이미지로 결과를 미리 확인합니다." },
  { step: "04", title: "시공·감리", body: "현장을 직접 관리하며 디테일을 끝까지 챙깁니다." },
  { step: "05", title: "완공·기록", body: "결과물을 촬영해 포트폴리오와 비하인드로 남깁니다." },
];
