<!--
 * @Author: shaohang-shy
 * @Date: 2022-12-07 10:21:51
 * @LastEditors: shaohang-shy
 * @LastEditTime: 2022-12-07 10:21:51
 * @Description: MenuBar
-->

<script setup lang="ts">
import type { Editor } from '@tiptap/vue-3'
import type { MenuBtnView } from '~/typings'
const props = defineProps<{
  editor?: Editor
}>()

function generateCommandButtonComponentSpecs(): MenuBtnView[] {
  if (!props.editor)
    return []
  const extensionManager = props.editor.extensionManager
  return extensionManager.extensions.reduce((acc, extension) => {
    if (extension.options.menubar === false)
      return acc
    const { menuBtnView } = extension.options
    if (!menuBtnView || typeof menuBtnView !== 'function')
      return acc
    const menuBtnComponentSpec = menuBtnView({
      editor: props.editor,
      extension,
    })

    if (Array.isArray(menuBtnComponentSpec))
      return [...acc, ...menuBtnComponentSpec]

    return [...acc, menuBtnComponentSpec]
  }, [] as MenuBtnView[])
}
</script>

<template>
  <div class="flex box-border  border-b-1 border-#ebeef5 flex-shrink-0 flex-wrap p-5px relative">
    <component
      :is="spec.component" v-for="(spec, i) in generateCommandButtonComponentSpecs()"
      :key="`command-button${i}`" v-bind="spec.componentProps"
    />
  </div>
</template>
