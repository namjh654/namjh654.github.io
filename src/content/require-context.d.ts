// webpack(CRA) 의 require.context 타입. 콘텐츠 폴더 자동 인식에 사용한다.
interface WebpackRequireContext {
  keys(): string[];
  (id: string): any;
}

interface NodeRequire {
  context(
    directory: string,
    useSubdirectories?: boolean,
    regExp?: RegExp,
    mode?: "sync" | "eager" | "weak" | "lazy" | "lazy-once"
  ): WebpackRequireContext;
}
