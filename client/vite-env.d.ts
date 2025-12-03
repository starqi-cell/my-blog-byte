//client/vite-env.d.ts
//定义 Vite 项目中的环境变量类型和 ImportMeta 接口的扩展

/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
