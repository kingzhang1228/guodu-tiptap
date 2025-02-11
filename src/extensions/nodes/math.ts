import { Node } from '@tiptap/core'
import { VueNodeViewRenderer, nodeInputRule, nodePasteRule } from '@tiptap/vue-3'
import MathView from '~/components/ExtensionViews/MathView.vue'

export const inputRegex = /(?:^|\s)((?:\$)((?:[^\$]+))(?:\$))$/
export const pasteRegex = /(?:^|\s)((?:\$)((?:[^\$]+))(?:\$))/g

export default Node.create({
  name: 'math',
  group: 'inline math',
  inline: true,
  atom: true,
  draggable: true,
  addAttributes() {
    return {
      katex: {
        default: '',
        parseHTML: (element) => {
          return element.innerText
        },
      },
      inline: {
        default: true,
      },
    }
  },
  parseHTML() {
    return [
      {
        tag: 'span',
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        getAttrs: element => element.hasAttribute('data-katex') ?? false,
      },
    ]
  },

  renderHTML(v) {
    return ['span', { 'data-katex': true }, `$${v.HTMLAttributes.katex}$`]
  },

  addNodeView() {
    return VueNodeViewRenderer(MathView)
  },

  addInputRules() {
    return [
      nodeInputRule({
        find: inputRegex,
        type: this.type,
        getAttributes: (match) => {
          return {
            katex: match[2],
          }
        },
      }),
    ]
  },

  addPasteRules() {
    return [
      nodePasteRule({
        find: pasteRegex,
        type: this.type,
        getAttributes: (match) => {
          return {
            katex: match[2],
          }
        },
      }),
    ]
  },
})
