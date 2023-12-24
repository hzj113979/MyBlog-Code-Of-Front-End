// v-md-editor 引用依赖
import Vue from "vue";
import hljs from "highlight.js";
import VueMarkdownEditor from "@kangc/v-md-editor";
import VMdPreview from "@kangc/v-md-editor/lib/preview";
import createCopyCodePlugin from "@kangc/v-md-editor/lib/plugins/copy-code/index";
import createLineNumbertPlugin from "@kangc/v-md-editor/lib/plugins/line-number/index";
import createCopyCodePreview from "@kangc/v-md-editor/lib/plugins/copy-code/preview";
import "@kangc/v-md-editor/lib/style/base-editor.css";
import "@kangc/v-md-editor/lib/plugins/copy-code/copy-code.css";

// vuepress:
import VMdEditor from "@kangc/v-md-editor/lib/codemirror-editor";
import "@kangc/v-md-editor/lib/style/codemirror-editor.css";
import githubTheme from "@kangc/v-md-editor/lib/theme/github.js";
import "@kangc/v-md-editor/lib/theme/style/github.css";
import vuepressTheme from "@kangc/v-md-editor/lib/theme/vuepress.js";
import "@kangc/v-md-editor/lib/theme/style/vuepress.css";
// 自定义CSS
import '../GlobalCSS/v-md-preview.css'
//高亮
import Prism from "prismjs";
import createHighlightLinesPlugin from "@kangc/v-md-editor/lib/plugins/highlight-lines/index";
import "@kangc/v-md-editor/lib/plugins/highlight-lines/highlight-lines.css";
//emoji表情
//:grinning:
import createEmojiPlugin from '@kangc/v-md-editor/lib/plugins/emoji/index';
import '@kangc/v-md-editor/lib/plugins/emoji/emoji.css';
// 水平位置语法支持
//::: align-left
//   left
// :::
//
// ::: align-center
//   center
// :::
//
// ::: align-right
//   right
// :::
import createAlignPlugin from '@kangc/v-md-editor/lib/plugins/align';
// todo-list 插件来支持插入 任务列表：
//- [x] Task
import createTodoListPlugin from '@kangc/v-md-editor/lib/plugins/todo-list/index';
import '@kangc/v-md-editor/lib/plugins/todo-list/todo-list.css';
//mermaid 插件来支持流程图或者其他图形
//```mermaid
// graph LR
// A --- B
// B-->C[fa:fa-ban forbidden]
// B-->D(fa:fa-spinner);
// ```
import createMermaidPlugin from '@kangc/v-md-editor/lib/plugins/mermaid/cdn';
import '@kangc/v-md-editor/lib/plugins/mermaid/mermaid.css';
//katex 插件来支持插入 katex 公式：
//$$\sum_{i=1}^n a_i=0$$
import createKatexPlugin from '@kangc/v-md-editor/lib/plugins/katex/cdn';


// 调用方法将 markdown 转换成 html 并使用 xss 过滤

//katex 插件来支持插入 katex 公式：
VueMarkdownEditor.use(createKatexPlugin())
//mermaid 插件来支持流程图或者其他图形
VueMarkdownEditor.use(createMermaidPlugin());
//todo-list 插件来支持插入 任务列表：
VueMarkdownEditor.use(createTodoListPlugin());
// 水平位置语法支持
VueMarkdownEditor.use(createAlignPlugin());
//emoji表情
VueMarkdownEditor.use(createEmojiPlugin());
/** https://prismjs.com **/
VueMarkdownEditor.use(createHighlightLinesPlugin());

// codemirror 编辑器的相关资源
import Codemirror from "codemirror";
// mode
import "codemirror/mode/markdown/markdown";
import "codemirror/mode/javascript/javascript";
import "codemirror/mode/css/css";
import "codemirror/mode/htmlmixed/htmlmixed";
import "codemirror/mode/vue/vue";
// edit
import "codemirror/addon/edit/closebrackets";
import "codemirror/addon/edit/closetag";
import "codemirror/addon/edit/matchbrackets";
// placeholder
import "codemirror/addon/display/placeholder";
// active-line
import "codemirror/addon/selection/active-line";
// scrollbar
import "codemirror/addon/scroll/simplescrollbars";
import "codemirror/addon/scroll/simplescrollbars.css";
// style
import "codemirror/lib/codemirror.css";

VMdEditor.Codemirror = Codemirror;

// 使用代码块的时候显示代码行数
VueMarkdownEditor.use(createLineNumbertPlugin());
// 实现预览框内的复制功能
VueMarkdownEditor.use(createCopyCodePlugin());
// 预览组件实现复制功能
VMdPreview.use(createCopyCodePreview());

VueMarkdownEditor.use(vuepressTheme, {
  Prism,
  extend(md) {
    // md为 markdown-it 实例，可以在此处进行修改配置,并使用 plugin 进行语法扩展
    // md.set(option).use(plugin);
  },
});
// 修改vuepressTheme和Prism 为githubTheme和hljs 即可更换主题
VMdEditor.use(vuepressTheme, {
  Prism: Prism,
  config: {
    toc: {
      includeLevel: [1, 2],
    },
  },
});
VMdPreview.use(vuepressTheme, {
  Prism: Prism,
});

Vue.use(VMdEditor);
Vue.use(VMdPreview);
Vue.use(VueMarkdownEditor);
