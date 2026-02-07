export interface Tool {
    id: string;
    title: string;
    description: string;
    category: "영상 제작" | "디자인" | "생산성" | "마케팅" | "개발";
    imageUrl: string;
    link: string;
    priceType: "무료" | "부분유료" | "유료";
    author: string;
    date: string;
    readTime: string;
    discountCode?: string;
    isSale?: boolean;
    featured?: boolean;
}

export const toolsData: Tool[] = [
    {
        id: "1",
        title: "Vidio AI: 텍스트로 비디오를 만드는 마법",
        description: "복잡한 편집 프로그램 없이, 텍스트 입력만으로 고품질의 영상을 제작할 수 있는 Vidio AI의 모든 기능을 심층 분석합니다.",
        category: "영상 제작",
        imageUrl: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop",
        link: "https://example.com/vidio",
        priceType: "부분유료",
        author: "김에디터",
        date: "2024. 02. 10",
        readTime: "5분",
        discountCode: "VIDIO50",
        isSale: true,
        featured: true,
    },
    {
        id: "2",
        title: "CopyMaster: 잘 팔리는 글쓰기의 비밀",
        description: "블로그, 광고, 이메일 마케팅 문구 작성이 어렵다면? AI가 제안하는 카피라이팅 솔루션을 만나보세요.",
        category: "마케팅",
        imageUrl: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=1000",
        link: "https://example.com/copy",
        priceType: "유료",
        author: "이마케터",
        date: "2024. 02. 08",
        readTime: "3분",
        discountCode: "COPY20",
        featured: true,
    },
    {
        id: "3",
        title: "ImageGenius: 미드저니를 위협하는 신흥 강자",
        description: "더 이상 복잡한 프롬프트 엔지니어링이 필요 없습니다. 직관적인 인터페이스로 원하는 이미지를 생성하세요.",
        category: "디자인",
        imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1000",
        link: "https://example.com/image",
        priceType: "무료",
        author: "박디자이너",
        date: "2024. 02. 05",
        readTime: "4분",
    },
    {
        id: "4",
        title: "DevBuddy: 당신의 코딩 파트너",
        description: "버그 수정부터 코드 리팩토링까지. 개발자의 생산성을 200% 올려주는 AI 페어 프로그래밍 도구.",
        category: "개발",
        imageUrl: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&q=80&w=1000",
        link: "https://example.com/dev",
        priceType: "부분유료",
        author: "최개발",
        date: "2024. 02. 01",
        readTime: "6분",
        isSale: true,
        discountCode: "DEV10",
    },
    {
        id: "5",
        title: "MarketBot: 소셜 미디어 자동화의 끝판왕",
        description: "인스타그램, 틱톡, 유튜브 쇼츠 업로드 스케줄링부터 성과 분석까지 한 번에 해결하세요.",
        category: "마케팅",
        imageUrl: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&q=80&w=1000",
        link: "https://example.com/market",
        priceType: "유료",
        author: "전기획",
        date: "2024. 01. 28",
        readTime: "4분",
    },
];
