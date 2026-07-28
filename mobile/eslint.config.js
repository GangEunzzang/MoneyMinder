const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const boundaries = require('eslint-plugin-boundaries');

/**
 * 두 가지를 강제한다.
 *  1) 레이어 의존 방향 (app → features → entities → shared)
 *  2) 디자인 토큰 (D23/D24 스케일 밖 숫자 · RN Text 직접 사용 차단)
 * 문서로만 있는 규칙은 반드시 깨지므로 린트로 막는다.
 */
module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*', '.expo/*', 'scripts/*'],
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    plugins: { boundaries },
    settings: {
      'boundaries/elements': [
        { type: 'app', pattern: 'src/app/**' },
        { type: 'features', pattern: 'src/features/*/**', capture: ['feature'] },
        { type: 'entities', pattern: 'src/entities/*/**', capture: ['entity'] },
        { type: 'shared', pattern: 'src/shared/**' },
      ],
      'boundaries/include': ['src/**/*.{ts,tsx}'],
    },
    rules: {
      'boundaries/dependencies': [
        'error',
        {
          default: 'disallow',
          policies: [
            { from: [{ type: 'app' }], allow: [{ type: 'features' }, { type: 'entities' }, { type: 'shared' }] },
            // features 끼리 직접 참조 금지 — 공유가 필요하면 entities로 내린다.
            {
              from: [{ type: 'features' }],
              allow: [
                { type: 'features', feature: '{{from.feature}}' },
                { type: 'entities' },
                { type: 'shared' },
              ],
            },
            { from: [{ type: 'entities' }], allow: [{ type: 'entities' }, { type: 'shared' }] },
            { from: [{ type: 'shared' }], allow: [{ type: 'shared' }] },
          ],
        },
      ],
    },
  },
  {
    // 디자인 토큰 강제: 스케일을 코드에서 다시 흘리지 않는다.
    files: ['src/app/**/*.tsx', 'src/features/**/*.tsx', 'src/entities/**/*.tsx'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector:
            "Property[key.name=/^(fontSize|lineHeight|letterSpacing)$/] > Literal[value=/^\\d/]",
          message: 'fontSize는 theme의 type 스케일(D23)만 사용한다. <Text variant="..."> 를 쓸 것.',
        },
        {
          selector:
            "Property[key.name=/^(padding|paddingTop|paddingBottom|paddingLeft|paddingRight|paddingHorizontal|paddingVertical|gap|rowGap|columnGap|margin|marginTop|marginBottom|marginHorizontal|marginVertical)$/] > Literal[value=/^\\d/]",
          message: 'spacing은 theme의 space 스케일(D24)만 사용한다.',
        },
        {
          selector: 'Property[key.name=/^(borderRadius)$/] > Literal[value=/^\\d/]',
          message: 'radius는 theme의 radius 스케일(D24)만 사용한다.',
        },
        {
          selector: "Literal[value=/^#[0-9a-fA-F]{3,8}$/]",
          message: '색은 theme의 palette 토큰만 사용한다. hex 직접 입력 금지.',
        },
      ],
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: 'react-native',
              importNames: ['Text'],
              message: 'shared/ui의 <Text variant> 를 사용한다 (타입 스케일 강제).',
            },
          ],
        },
      ],
    },
  },
  {
    // theme·shared/ui 는 토큰을 정의하는 자리라 예외.
    files: ['src/shared/**'],
    rules: { 'no-restricted-syntax': 'off', 'no-restricted-imports': 'off' },
  },
  {
    files: ['**/*.test.{ts,tsx}', 'jest.setup.ts'],
    rules: { 'boundaries/dependencies': 'off' },
  },
]);
