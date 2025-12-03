//client/styled.d.ts
// 扩展 styled-components 的 DefaultTheme 接口以匹配自定义主题类型，theme

import 'styled-components';
import type { Theme } from './styles/theme';

declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}
