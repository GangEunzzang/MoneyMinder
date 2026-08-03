import { execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { build } from './node_modules/esbuild/lib/main.js';
import { resolve } from 'node:path';
import { createRequire } from 'node:module';

const req = createRequire(resolve(process.cwd(), 'package.json'));
// main 필드는 CJS 를 가리킨다. CJS 는 동적 require('react') 를 써서 번들에서 터진다.
const RNW = req.resolve('react-native-web/dist/index.js');
// react-native-svg 는 웹 엔트리를 따로 낸다. 기본(module) 은 fabric 네이티브 모듈을 물고 와
// RNW 에 없는 TurboModuleRegistry 를 찾는다.
const RNSVG = req.resolve('react-native-svg/lib/module/ReactNativeSVG.web.js');

const R = (p) => resolve(process.cwd(), p);

/**
 * RN 컴포넌트를 브라우저에서 렌더하기 위한 최소 셋.
 *  - 정확히 'react-native' 만 react-native-web 으로. 깊은 경로(Libraries/…)는 RNW 에 없다.
 *  - 내비게이션·라우팅은 프리뷰에 필요 없다 → 스텁. 컴포넌트가 렌더되는 데는 지장 없다.
 */
const shim = {
  name: 'rn-web-shim',
  setup(b) {
    // RNW 는 RN 표면의 일부만 낸다. 없는 것(TurboModuleRegistry 등)을 채운 가상 모듈로 감싼다 —
    // 그러지 않으면 react-native-svg 의 fabric 모듈이 import 에서 터진다.
    b.onResolve({ filter: /^react-native$/ }, () => ({ path: 'rn', namespace: 'stub' }));

    b.onResolve({ filter: /^react-native-svg$/ }, () => ({ path: RNSVG }));
    b.onResolve({ filter: /^react-native\// }, (a) => ({ path: a.path, namespace: 'rn-deep' }));
    // codegenNativeComponent 처럼 호출되는 것들이 있어 default 는 함수여야 한다.
    b.onLoad({ filter: /.*/, namespace: 'rn-deep' }, () => ({
      contents: [
        'const stub = () => null;',
        'export default stub;',
        'export const get = () => null;',
        'export const getEnforcing = () => null;',
      ].join('\n'), loader: 'js' }));

    b.onResolve({ filter: /^expo-router$/ }, () => ({ path: 'expo-router', namespace: 'stub' }));
    // 폰트 바이너리는 RN 이 expo-font 로 싣는 것이다. 웹 프리뷰는 CSS @font-face 가 담당하므로
    // 번들에 넣을 이유가 없다 — 넣으면 4굵기 TTF 로 75MB 가 된다.
    b.onResolve({ filter: /^@expo-google-fonts\// }, () => ({ path: 'fonts', namespace: 'stub' }));
    b.onResolve({ filter: /^react-native-safe-area-context$/ }, () => ({ path: 'safe-area', namespace: 'stub' }));
    b.onLoad({ filter: /.*/, namespace: 'stub' }, (a) =>
      a.path === 'rn'
      ? { contents: `
          export * from ${JSON.stringify(RNW)};
          const nullModule = { get: () => null, getEnforcing: () => null };
          export const TurboModuleRegistry = nullModule;
          export const NativeModules = {};
          export const requireNativeComponent = () => () => null;
          export const UIManager = { getViewManagerConfig: () => null };`, loader: 'js', resolveDir: process.cwd() }
      : a.path === 'fonts'
      ? { contents: [
          'export default {};',
          ...['200ExtraLight','300Light','400Regular','500Medium','600SemiBold','700Bold','800ExtraBold','900Black']
            .map(w => `export const NotoSansKR_${w} = null;`),
        ].join('\n'), loader: 'js' }
      : a.path === 'safe-area'
        ? { contents: `
            export const useSafeAreaInsets = () => ({ top: 44, bottom: 34, left: 0, right: 0 });
            export const SafeAreaProvider = ({ children }) => children;
            export const SafeAreaView = ({ children }) => children;`, loader: 'js' }
        : { contents: `
            const noop = () => {};
            export const router = { push: noop, back: noop, replace: noop };
            export const Link = ({ children }) => children;
            export const useLocalSearchParams = () => ({});
            export const useRouter = () => router;
            export const usePathname = () => '/';
            export const useSegments = () => [];`, loader: 'js' });
  },
};

await build({
  entryPoints: ['.ds-src/index.ts'],
  outfile: 'dist/index.es.js',
  bundle: true,
  format: 'esm',
  platform: 'browser',
  target: 'es2020',
  jsx: 'automatic',
  loader: { '.ttf': 'empty', '.png': 'dataurl' },
  external: ['react', 'react-dom', 'react/jsx-runtime'],
  alias: { '@': R('src') },
  // RN 생태계는 .web.js 로 웹 구현을 따로 낸다. 이걸 우선하지 않으면 react-native-svg 의
  // ./elements 가 네이티브 구현으로 잡혀 Svg·Path 가 null 이 된다 (React #130).
  resolveExtensions: ['.web.tsx', '.web.ts', '.web.jsx', '.web.js', '.tsx', '.ts', '.jsx', '.js', '.json'],
  plugins: [shim],
  define: { __DEV__: 'false', 'process.env.NODE_ENV': '"production"' },
  logLevel: 'warning',
});
console.log('✓ dist/index.es.js');

// 변환기는 컴포넌트 목록을 .d.ts 에서 읽는다. 여기서 같이 내지 않으면 배럴을 넓혀도
// 카드 수가 그대로라 "왜 안 늘지"로 한참 헤맨다 (실제로 겪음).
execFileSync('npx', ['tsc', '-p', '.ds-src/tsconfig.dts.json'], { stdio: 'inherit' });
writeFileSync('dist/index.d.ts', "export * from './.ds-src/index';\n");
console.log('✓ dist/index.d.ts');
