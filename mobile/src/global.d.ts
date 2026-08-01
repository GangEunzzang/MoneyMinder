// CSS / CSS Module side-effect imports (Expo web / Metro가 런타임 처리)
declare module '*.css';
declare module '*.module.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}
