/** Source editor modal for adding or editing a catalog source. */
import { createElement as h, useState, type ReactNode } from 'react'
import { Button, Input, Modal } from '@deepseek-ai/dsh-client-ui-primitives'
import type { SourceOverview } from '../../api.js'
import type { SourceProgressState } from './market-resource.js'
import type { Translate } from '../../index.js'
import css from '../../market.module.css'

export type EditorState = { mode: 'edit'; source: SourceOverview } | { mode: 'add' } | undefined

export interface SourceEditorModalProps {
  t: Translate
  editor: Exclude<EditorState, undefined>
  busy: boolean
  progress: SourceProgressState
  onClose: () => void
  onSave: (url: string, branch: string, local: boolean) => Promise<boolean>
  onRemove: (id: string) => void
}

export function SourceEditorModal(props: SourceEditorModalProps): ReactNode {
  const { t, editor } = props
  const [local, setLocal] = useState(editor.mode === 'edit' && editor.source.local === true)
  const [url, setUrl] = useState(editor.mode === 'edit' ? editor.source.url : '')
  const [branch, setBranch] = useState(editor.mode === 'edit' ? (editor.source.branch ?? '') : '')
  const id = editor.mode === 'edit' ? editor.source.id : ''
  const title = editor.mode === 'edit' ? t('editSourceTitle') : t('addSourceTitle')
  return h(Modal, {
    open: true,
    onClose: props.onClose,
    title,
    description: t('editorHint'),
    closeLabel: t('cancel'),
    className: css.editorDialog,
    footer: h(
      'div',
      { className: css.modalFooter },
      h('div', { className: css.modalFooterLeft }, editor.mode === 'edit' ? h(Button, { variant: 'ghost', onClick: () => props.onRemove(id) }, `🗑 ${t('remove')}`) : null),
      h(Button, { variant: 'ghost', onClick: props.onClose }, t('cancel')),
      h(
        Button,
        {
          variant: 'primary',
          disabled: props.busy,
          onClick: () => {
            void props.onSave(url.trim(), branch.trim(), local)
          }
        },
        t('save')
      )
    ),
    children: h(
      'div',
      { className: css.editorForm },
      h(
        'div',
        { className: css.modeRow },
        h(
          'button',
          {
            type: 'button',
            className: local ? css.seg : css.segOn,
            onClick: () => setLocal(false)
          },
          t('sourceModeGit')
        ),
        h(
          'button',
          {
            type: 'button',
            className: local ? css.segOn : css.seg,
            onClick: () => setLocal(true)
          },
          t('sourceModeLocal')
        )
      ),
      editor.mode === 'edit'
        ? h(
            'div',
            { className: css.fieldGroup },
            h('label', { className: css.fieldLabel }, t('sourceIdPh')),
            h('div', { className: css.staticId }, h('span', { className: css.staticIdValue }, id), h('span', { className: css.fieldHint }, t('idFixed')))
          )
        : null,
      h(
        'div',
        { className: css.fieldGroup },
        h('label', { className: css.fieldLabel }, local ? t('sourceUrlLocalPh') : t('sourceUrlPh')),
        h(Input, { placeholder: local ? t('sourceUrlLocalPh') : t('sourceUrlPh'), value: url, onChange: event => setUrl((event.target as HTMLInputElement).value) }),
        h('span', { className: css.fieldHint }, local ? t('urlLocalHint') : t('urlGitHint'))
      ),
      local
        ? null
        : h(
            'div',
            { className: css.fieldGroup },
            h('label', { className: css.fieldLabel }, t('branchPh')),
            h(Input, { placeholder: t('branchPh'), value: branch, onChange: event => setBranch((event.target as HTMLInputElement).value) }),
            h('span', { className: css.fieldHint }, t('branchHint'))
          ),
      props.progress.error === undefined && props.progress.step === undefined
        ? null
        : h(
            'div',
            {
              className: props.progress.error === undefined ? css.progress : css.progressError
            },
            props.progress.error === undefined ? h('span', { className: css.progressSpin }) : h('span', { className: css.progressFail }, '✕'),
            h('span', { className: css.progressText }, props.progress.error === undefined ? props.progress.step : `${t('actionFail')}: ${props.progress.error}`)
          )
    )
  })
}
