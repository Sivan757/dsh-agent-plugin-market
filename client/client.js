window.__ModuleLoader__.load({ id: "dsh-agent-plugins-market", factory: (require) => {

		var module = { exports: {} };
		var exports = module.exports;
(function(){if(typeof document!=="undefined"){var s=document.createElement("style");s.setAttribute("data-dsh-client","dsh-agent-plugins-market");s.textContent=".qMtKNa_market {\n  min-width: 0;\n  height: 100%;\n  min-height: 0;\n  color: var(--dsw-alias-label-primary, #1f2328);\n  flex-direction: column;\n  gap: 24px;\n  display: flex;\n}\n\n.qMtKNa_pageMode {\n  width: 100%;\n  min-width: 0;\n}\n\n.qMtKNa_marketControls {\n  flex-direction: column;\n  gap: 8px;\n  min-height: 0;\n  display: flex;\n}\n\n.qMtKNa_mcpSurface {\n  flex: 1;\n  min-height: 0;\n  display: flex;\n}\n\n.qMtKNa_surfaceSwitch {\n  border: 1px solid var(--dsw-alias-border-l2, #d4dce8);\n  background: var(--dsw-alias-bg-layer-1, #fff);\n  height: 26px;\n  color: var(--dsw-alias-brand-primary, #4966f5);\n  cursor: pointer;\n  border-radius: 7px;\n  flex: none;\n  align-self: center;\n  padding: 0 10px;\n  font-size: 11px;\n}\n\n.qMtKNa_surfaceSwitch:hover {\n  background: var(--dsw-alias-bg-selected, #edf1ff);\n}\n\nhtml[data-dsh-agent-plugins-market-page] [data-pane=\"conversation\"], html[data-dsh-agent-plugins-market-page] [class*=\"centerCol\"] {\n  position: relative;\n}\n\n.qMtKNa_pageView {\n  z-index: 60;\n  background: var(--dsw-alias-bg-base, #f7f8fa);\n  min-width: 0;\n  min-height: 0;\n  padding: 20px 24px;\n  display: none;\n  position: absolute;\n  inset: 0;\n  overflow: hidden;\n}\n\nhtml[data-dsh-agent-plugins-market-page] .qMtKNa_pageView {\n  display: flex;\n}\n\nhtml[data-dsh-agent-plugins-market-page] [data-pane=\"conversation\"] > :not([data-dsh-agent-plugins-market-page-view]), html[data-dsh-agent-plugins-market-page] [class*=\"centerCol\"] > :not([data-dsh-agent-plugins-market-page-view]) {\n  display: none !important;\n}\n\n.qMtKNa_pageEntry {\n  width: 100%;\n  min-height: 32px;\n  color: var(--dsw-alias-label-primary, #1f2328);\n  cursor: pointer;\n  font: inherit;\n  text-align: left;\n  background: none;\n  border: none;\n  border-radius: 8px;\n  align-items: center;\n  gap: 8px;\n  padding: 6px 12px;\n  font-size: 13px;\n  line-height: 20px;\n  display: flex;\n}\n\n.qMtKNa_pageEntry:hover {\n  background: var(--dsw-alias-bg-hover, #0000000d);\n}\n\n.qMtKNa_pageEntry:active {\n  background: var(--dsw-alias-bg-active, #00000014);\n}\n\n.qMtKNa_pageEntry svg {\n  color: var(--dsw-alias-label-secondary, #6b7280);\n  flex-shrink: 0;\n}\n\n.qMtKNa_pageEntry span {\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  min-width: 0;\n  overflow: hidden;\n}\n\n[data-dsh-frame][data-sidebar-collapsed] .qMtKNa_pageEntry {\n  justify-content: center;\n  padding-inline: 0;\n}\n\n[data-dsh-frame][data-sidebar-collapsed] .qMtKNa_pageEntry span {\n  display: none;\n}\n\n.qMtKNa_pageEntry:focus-visible, .qMtKNa_srcTabMain:focus-visible, .qMtKNa_srcTabEdit:focus-visible, .qMtKNa_srcTabDel:focus-visible, .qMtKNa_seg:focus-visible, .qMtKNa_segOn:focus-visible, .qMtKNa_detailItemRow:focus-visible, .qMtKNa_detailItemOpen:focus-visible {\n  outline: 2px solid var(--dsw-alias-brand-primary, #4f6ef7);\n  outline-offset: 2px;\n}\n\n.qMtKNa_header {\n  flex-direction: column;\n  flex-shrink: 0;\n  gap: 8px;\n  display: flex;\n}\n\n.qMtKNa_titleRow {\n  align-items: center;\n  gap: 8px;\n  display: flex;\n}\n\n.qMtKNa_title {\n  margin: 0;\n  font-size: 16px;\n  font-weight: 600;\n  line-height: 24px;\n}\n\n.qMtKNa_sub {\n  color: var(--dsw-alias-label-tertiary, #8b93a1);\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  flex: 1;\n  align-items: center;\n  gap: 8px;\n  min-width: 0;\n  margin: 0;\n  font-size: 13px;\n  line-height: 20px;\n  display: flex;\n  overflow: hidden;\n}\n\n.qMtKNa_spacer {\n  flex: 1;\n}\n\n.qMtKNa_searchGroup {\n  align-items: center;\n  gap: 2px;\n  display: flex;\n}\n\n.qMtKNa_body {\n  flex: 1;\n  align-items: flex-start;\n  gap: 20px;\n  min-height: 0;\n  display: flex;\n}\n\n.qMtKNa_sourceTabsRow {\n  padding: 0;\n  display: block;\n}\n\n.qMtKNa_sourceTabsScroll {\n  grid-template-columns: repeat(auto-fill, minmax(118px, 1fr));\n  gap: 4px;\n  display: grid;\n}\n\n.qMtKNa_srcTabEdit {\n  font: inherit;\n  color: var(--dsw-alias-label-tertiary, #9ca3af);\n  cursor: pointer;\n  background: none;\n  border: none;\n  flex-shrink: 0;\n  padding: 2px;\n  font-size: 12px;\n  line-height: 18px;\n}\n\n.qMtKNa_srcTabEdit:hover {\n  color: var(--dsw-alias-label-primary, #1f2328);\n}\n\n.qMtKNa_srcTabOn .qMtKNa_srcTabEdit, .qMtKNa_srcTabOn .qMtKNa_srcTabEdit:hover {\n  color: var(--dsw-alias-label-primary-foreground, #fff);\n}\n\n.qMtKNa_srcTab, .qMtKNa_srcTabOn {\n  border: 1px solid var(--dsw-alias-border-l3, #d9dde3);\n  background: var(--dsw-alias-bg-layer-1, #fff);\n  border-radius: 999px;\n  justify-content: center;\n  align-items: center;\n  width: 100%;\n  height: 24px;\n  display: inline-flex;\n  overflow: hidden;\n}\n\n.qMtKNa_srcTabMain {\n  font: inherit;\n  color: var(--dsw-alias-label-primary, #1f2328);\n  cursor: pointer;\n  white-space: nowrap;\n  text-overflow: ellipsis;\n  background: none;\n  border: none;\n  flex: 1;\n  min-width: 0;\n  padding: 2px 2px 2px 10px;\n  font-size: 12px;\n  line-height: 18px;\n  overflow: hidden;\n}\n\n.qMtKNa_srcTabMain:hover {\n  color: var(--dsw-alias-brand-primary, #4f6ef7);\n}\n\n.qMtKNa_srcTabOn {\n  background: var(--dsw-alias-brand-primary-new-colorprimary-new-color, #4176e6);\n  border-color: var(--dsw-alias-brand-primary-new-colorprimary-new-color, #4176e6);\n}\n\n.qMtKNa_srcTabOn .qMtKNa_srcTabMain {\n  color: var(--dsw-alias-label-primary-foreground, #fff);\n  font-weight: 600;\n}\n\n.qMtKNa_srcTabDel {\n  font: inherit;\n  color: var(--dsw-alias-label-tertiary, #9ca3af);\n  cursor: pointer;\n  background: none;\n  border: none;\n  flex-shrink: 0;\n  padding: 2px 8px 2px 2px;\n  font-size: 12px;\n  line-height: 18px;\n}\n\n.qMtKNa_srcTabDel:hover {\n  color: var(--dsw-alias-state-error-primary, #dc2626);\n}\n\n.qMtKNa_srcTabOn .qMtKNa_srcTabDel, .qMtKNa_srcTabOn .qMtKNa_srcTabDel:hover {\n  color: var(--dsw-alias-label-primary-foreground, #fff);\n}\n\n.qMtKNa_grid {\n  scrollbar-gutter: stable;\n  flex: 1;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  align-content: start;\n  gap: 12px;\n  min-width: 0;\n  min-height: 0;\n  padding-right: 4px;\n  display: grid;\n  overflow-y: auto;\n}\n\n.qMtKNa_list {\n  scrollbar-gutter: stable;\n  flex-direction: column;\n  flex: 1;\n  gap: 8px;\n  min-width: 0;\n  min-height: 0;\n  padding-right: 4px;\n  display: flex;\n  overflow-y: auto;\n}\n\n.qMtKNa_list .qMtKNa_card {\n  flex-flow: wrap;\n  align-items: center;\n  gap: 8px 14px;\n}\n\n.qMtKNa_list .qMtKNa_cardTop {\n  flex: none;\n}\n\n.qMtKNa_list .qMtKNa_cardDesc {\n  -webkit-line-clamp: 1;\n  flex: 1;\n  min-width: 200px;\n  min-height: 0;\n}\n\n.qMtKNa_list .qMtKNa_cardActions {\n  flex: none;\n}\n\n.qMtKNa_list .qMtKNa_meta {\n  flex-basis: 100%;\n}\n\n.qMtKNa_empty {\n  color: var(--dsw-alias-label-tertiary, #8b93a1);\n  text-align: center;\n  grid-column: 1 / -1;\n  padding: 48px 0;\n  font-size: 13px;\n}\n\n.qMtKNa_card {\n  background: var(--dsw-alias-bg-layer-1, #fff);\n  border: 1px solid var(--dsw-alias-border-l2, #e5e7eb);\n  border-radius: 12px;\n  flex-direction: column;\n  gap: 8px;\n  min-width: 0;\n  padding: 12px 14px;\n  display: flex;\n}\n\n.qMtKNa_cardTop {\n  align-items: center;\n  gap: 8px;\n  display: flex;\n}\n\n.qMtKNa_cardTitle {\n  flex: 1;\n  align-items: center;\n  gap: 8px;\n  min-width: 0;\n  display: flex;\n}\n\n.qMtKNa_cardName {\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  font-size: 13px;\n  font-weight: 600;\n  line-height: 22px;\n  overflow: hidden;\n}\n\n.qMtKNa_version {\n  color: var(--dsw-alias-label-tertiary, #8b93a1);\n  font-variant-numeric: tabular-nums;\n  flex-shrink: 0;\n  font-size: 12px;\n  line-height: 20px;\n}\n\n.qMtKNa_cardActions {\n  flex-shrink: 0;\n  align-items: center;\n  gap: 4px;\n  display: flex;\n}\n\n.qMtKNa_switchOn, .qMtKNa_switchOff {\n  cursor: pointer;\n  border: none;\n  border-radius: 999px;\n  flex-shrink: 0;\n  width: 38px;\n  height: 22px;\n  padding: 0;\n  transition: background-color .15s;\n  position: relative;\n}\n\n.qMtKNa_switchOn {\n  background: var(--dsw-alias-state-success-primary, #22c55e);\n}\n\n.qMtKNa_switchOff {\n  background: var(--dsw-alias-state-neutral, #d1d5db);\n}\n\n.qMtKNa_switchOn:disabled, .qMtKNa_switchOff:disabled {\n  opacity: .6;\n  cursor: default;\n}\n\n.qMtKNa_switchThumb {\n  pointer-events: none;\n  background: #fff;\n  border-radius: 50%;\n  width: 16px;\n  height: 16px;\n  transition: left .15s;\n  position: absolute;\n  top: 3px;\n  left: 3px;\n  box-shadow: 0 1px 2px #0003;\n}\n\n.qMtKNa_switchOn .qMtKNa_switchThumb {\n  left: 19px;\n}\n\n.qMtKNa_desc {\n  color: var(--dsw-alias-label-tertiary, #8b93a1);\n  -webkit-line-clamp: 2;\n  -webkit-box-orient: vertical;\n  min-height: 36px;\n  margin: 0;\n  font-size: 12px;\n  line-height: 18px;\n  display: -webkit-box;\n  overflow: hidden;\n}\n\n.qMtKNa_meta {\n  flex-wrap: wrap;\n  align-items: center;\n  gap: 6px;\n  display: flex;\n}\n\n.qMtKNa_src {\n  color: var(--dsw-alias-label-secondary, #9ca3af);\n  font-size: 12px;\n  text-decoration: none;\n}\n\n.qMtKNa_tag {\n  border: 1px solid var(--dsw-alias-border-l3, #d9dde3);\n  color: var(--dsw-alias-label-secondary, #6b7280);\n  border-radius: 4px;\n  flex-shrink: 0;\n  padding: 1px 6px;\n  font-size: 12px;\n  line-height: 18px;\n}\n\n.qMtKNa_okState {\n  color: var(--dsw-alias-state-success-primary, #16a34a);\n  white-space: nowrap;\n  font-size: 12px;\n  font-weight: 600;\n}\n\n.qMtKNa_warnLine {\n  color: var(--dsw-alias-state-warn-primary, #b45309);\n  cursor: help;\n  margin: 0;\n  font-size: 12px;\n  font-weight: 600;\n  line-height: 18px;\n}\n\n.qMtKNa_modalFooter {\n  justify-content: flex-end;\n  gap: 8px;\n  width: 100%;\n  display: flex;\n}\n\n.qMtKNa_modalFooterLeft {\n  gap: 8px;\n  margin-right: auto;\n  display: flex;\n}\n\n.qMtKNa_editorDialog {\n  width: min(500px, 92vw);\n}\n\n.qMtKNa_editorForm {\n  flex-direction: column;\n  gap: 14px;\n  min-width: 0;\n  display: flex;\n}\n\n.qMtKNa_modeRow {\n  border: 1px solid var(--dsw-alias-border-l2, #e5e7eb);\n  background: var(--dsw-alias-bg-layer-2, #f3f4f6);\n  border-radius: 10px;\n  align-self: flex-start;\n  gap: 6px;\n  padding: 3px;\n  display: flex;\n}\n\n.qMtKNa_seg, .qMtKNa_segOn {\n  font: inherit;\n  color: var(--dsw-alias-label-secondary, #6b7280);\n  cursor: pointer;\n  background: none;\n  border: none;\n  border-radius: 8px;\n  padding: 5px 14px;\n  font-size: 13px;\n  line-height: 20px;\n}\n\n.qMtKNa_segOn {\n  background: var(--dsw-alias-bg-layer-1, #fff);\n  color: var(--dsw-alias-label-primary, #1f2328);\n  font-weight: 600;\n  box-shadow: 0 1px 2px #00000014;\n}\n\n.qMtKNa_fieldGroup {\n  flex-direction: column;\n  gap: 5px;\n  display: flex;\n}\n\n.qMtKNa_fieldLabel {\n  color: var(--dsw-alias-label-secondary, #6b7280);\n  font-size: 12px;\n  font-weight: 600;\n}\n\n.qMtKNa_fieldHint {\n  color: var(--dsw-alias-label-tertiary, #8b93a1);\n  font-size: 12px;\n  line-height: 16px;\n}\n\n.qMtKNa_staticId {\n  border: 1px dashed var(--dsw-alias-border-l3, #d9dde3);\n  background: var(--dsw-alias-bg-layer-2, #f3f4f6);\n  border-radius: 8px;\n  align-items: center;\n  gap: 8px;\n  padding: 7px 10px;\n  display: flex;\n}\n\n.qMtKNa_staticIdValue {\n  color: var(--dsw-alias-label-primary, #1f2328);\n  font-size: 13px;\n  font-weight: 600;\n}\n\n.qMtKNa_detailDialog {\n  width: min(800px, 94vw);\n}\n\n.qMtKNa_detailBody {\n  flex-direction: column;\n  gap: 14px;\n  max-height: 78vh;\n  display: flex;\n  overflow-y: auto;\n}\n\n.qMtKNa_detailSections {\n  flex-direction: column;\n  gap: 14px;\n  display: flex;\n}\n\n.qMtKNa_detailSection {\n  flex-direction: column;\n  gap: 6px;\n  display: flex;\n}\n\n.qMtKNa_detailHead {\n  color: var(--dsw-alias-label-secondary, #6b7280);\n  border-bottom: 1px solid var(--dsw-alias-border-l2, #e5e7eb);\n  margin: 0;\n  padding-bottom: 4px;\n  font-size: 13px;\n  font-weight: 600;\n}\n\n.qMtKNa_detailGrid {\n  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));\n  gap: 6px 14px;\n  display: grid;\n}\n\n.qMtKNa_detailCell {\n  flex-direction: column;\n  gap: 2px;\n  min-width: 0;\n  display: flex;\n}\n\n.qMtKNa_detailKey {\n  color: var(--dsw-alias-label-tertiary, #8b93a1);\n  font-size: 12px;\n}\n\n.qMtKNa_detailValue {\n  color: var(--dsw-alias-label-primary, #1f2328);\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  font-size: 13px;\n  overflow: hidden;\n}\n\n.qMtKNa_detailDesc {\n  color: var(--dsw-alias-label-secondary, #6b7280);\n  margin: 4px 0 0;\n  font-size: 13px;\n  line-height: 20px;\n}\n\n.qMtKNa_mono {\n  word-break: break-all;\n  white-space: pre-wrap;\n  color: var(--dsw-alias-label-primary, #1f2328);\n  margin: 0;\n  font-family: ui-monospace, Menlo, Consolas, monospace;\n  font-size: 12px;\n  line-height: 18px;\n}\n\n.qMtKNa_detailItem {\n  border: 1px solid var(--dsw-alias-border-l2, #e5e7eb);\n  border-radius: 8px;\n  flex-direction: column;\n  display: flex;\n  overflow: hidden;\n}\n\n.qMtKNa_detailItemRow, .qMtKNa_detailItemOpen {\n  width: 100%;\n  font: inherit;\n  text-align: left;\n  cursor: pointer;\n  color: var(--dsw-alias-label-primary, #1f2328);\n  background: none;\n  border: none;\n  align-items: center;\n  gap: 8px;\n  padding: 7px 10px;\n  display: flex;\n}\n\n.qMtKNa_detailItemRow:hover {\n  background: var(--dsw-alias-bg-hover, #0000000d);\n}\n\n.qMtKNa_detailItemOpen {\n  background: var(--dsw-alias-bg-selected, #4f6ef714);\n}\n\n.qMtKNa_detailItemName {\n  flex-shrink: 0;\n  font-size: 13px;\n  font-weight: 600;\n}\n\n.qMtKNa_detailItemDesc {\n  min-width: 0;\n  color: var(--dsw-alias-label-tertiary, #8b93a1);\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  flex: 1;\n  font-size: 12px;\n  overflow: hidden;\n}\n\n.qMtKNa_detailChevron {\n  color: var(--dsw-alias-label-tertiary, #8b93a1);\n  flex-shrink: 0;\n}\n\n.qMtKNa_skillContent {\n  border-top: 1px solid var(--dsw-alias-border-l2, #e5e7eb);\n  max-height: 320px;\n  color: var(--dsw-alias-label-primary, #1f2328);\n  padding: 10px 12px;\n  font-size: 13px;\n  line-height: 20px;\n  overflow-y: auto;\n}\n\n.qMtKNa_progress, .qMtKNa_progressError {\n  border: 1px solid var(--dsw-alias-border-l2, #e5e7eb);\n  background: var(--dsw-alias-bg-layer-2, #7f7f7f0f);\n  color: var(--dsw-alias-label-primary, #1f2328);\n  border-radius: 8px;\n  align-items: center;\n  gap: 10px;\n  padding: 10px 12px;\n  font-size: 13px;\n  line-height: 20px;\n  display: flex;\n}\n\n.qMtKNa_progressError {\n  border-color: var(--dsw-alias-danger, #e5484d);\n  color: var(--dsw-alias-danger, #e5484d);\n}\n\n.qMtKNa_progressSpin {\n  border: 2px solid var(--dsw-alias-border-l2, #e5e7eb);\n  border-top-color: var(--dsw-alias-brand-primary, #4f6ef7);\n  border-radius: 50%;\n  flex-shrink: 0;\n  width: 14px;\n  height: 14px;\n  animation: .8s linear infinite qMtKNa_dshApmSpin;\n}\n\n@keyframes qMtKNa_dshApmSpin {\n  to {\n    transform: rotate(360deg);\n  }\n}\n\n.qMtKNa_progressFail {\n  flex-shrink: 0;\n  font-size: 13px;\n}\n\n.qMtKNa_progressText {\n  overflow-wrap: anywhere;\n  min-width: 0;\n}\n\n@media (width <= 720px) {\n  .qMtKNa_pageView {\n    padding: 14px;\n  }\n\n  .qMtKNa_titleRow {\n    flex-wrap: wrap;\n  }\n\n  .qMtKNa_title {\n    flex: 1 0 auto;\n  }\n\n  .qMtKNa_sub {\n    white-space: normal;\n    flex: 1 0 100%;\n    order: 3;\n  }\n\n  .qMtKNa_searchGroup {\n    flex: 1 0 100%;\n    order: 4;\n  }\n\n  .qMtKNa_sourceTabsScroll {\n    scrollbar-width: thin;\n    padding-bottom: 2px;\n    display: flex;\n    overflow-x: auto;\n  }\n\n  .qMtKNa_srcTab, .qMtKNa_srcTabOn {\n    flex: none;\n    width: auto;\n    min-width: 128px;\n  }\n\n  .qMtKNa_grid {\n    grid-template-columns: minmax(0, 1fr);\n  }\n\n  .qMtKNa_list .qMtKNa_cardTop, .qMtKNa_list .qMtKNa_cardActions {\n    max-width: 100%;\n  }\n}\n\n@media (prefers-reduced-motion: reduce) {\n  .qMtKNa_progressSpin, .qMtKNa_switchOn, .qMtKNa_switchOff, .qMtKNa_switchThumb {\n    transition: none;\n    animation: none;\n  }\n}\n.R7YLDa_toolbar {\n  grid-template-columns: minmax(0, 1fr) 12px auto auto auto 8px auto;\n  align-items: flex-end;\n  gap: 0;\n  min-width: 0;\n  display: grid;\n}\n\n.R7YLDa_filterGap, .R7YLDa_viewGap {\n  min-width: 0;\n}\n\n.R7YLDa_search {\n  box-sizing: border-box;\n  align-items: center;\n  width: 100%;\n  min-width: 0;\n  height: 36px;\n  display: flex;\n}\n\n.R7YLDa_search input {\n  box-sizing: border-box;\n  width: 100%;\n  min-width: 0;\n  height: 36px;\n  min-height: 36px;\n  max-height: 36px;\n  padding-top: 0;\n  padding-bottom: 0;\n  font-size: 12px;\n  line-height: 20px;\n}\n\n.R7YLDa_filter, .R7YLDa_filterOn {\n  min-width: 54px;\n  height: 36px;\n  color: var(--dsw-alias-label-secondary, #6b7280);\n  cursor: pointer;\n  font: inherit;\n  white-space: nowrap;\n  background: none;\n  border: none;\n  border-bottom: 2px solid #0000;\n  justify-content: center;\n  align-items: center;\n  gap: 5px;\n  padding: 7px 9px;\n  font-size: 13px;\n  display: inline-flex;\n}\n\n.R7YLDa_filterOn {\n  color: var(--dsw-alias-brand-primary, #4f6ef7);\n  border-bottom-color: var(--dsw-alias-brand-primary, #4f6ef7);\n  font-weight: 600;\n}\n\n.R7YLDa_filter svg, .R7YLDa_filterOn svg, .R7YLDa_viewSwitch svg {\n  stroke: currentColor;\n  stroke-width: 1.5px;\n  stroke-linecap: round;\n  stroke-linejoin: round;\n}\n\n.R7YLDa_filterCount {\n  font-variant-numeric: tabular-nums;\n}\n\n.R7YLDa_viewSwitch {\n  width: 34px;\n  height: 36px;\n  color: var(--dsw-alias-label-tertiary, #9ca3af);\n  cursor: pointer;\n  background: none;\n  border: none;\n  border-bottom: 2px solid #0000;\n  justify-content: center;\n  align-items: center;\n  display: inline-flex;\n}\n\n.R7YLDa_viewSwitch:hover {\n  color: var(--dsw-alias-label-primary, #1f2328);\n}\n\n.R7YLDa_viewSwitch:focus-visible, .R7YLDa_filter:focus-visible, .R7YLDa_filterOn:focus-visible {\n  outline: 2px solid var(--dsw-alias-brand-primary, #4f6ef7);\n  outline-offset: 2px;\n}\n\n@media (width <= 760px) {\n  .R7YLDa_toolbar {\n    grid-template-columns: auto auto auto 8px auto;\n    justify-content: end;\n    overflow-x: auto;\n  }\n\n  .R7YLDa_search {\n    grid-column: 1 / -1;\n  }\n\n  .R7YLDa_filterGap {\n    display: none;\n  }\n}\n.--KJaG_surface {\n  height: 100%;\n  min-height: 0;\n  max-height: 100%;\n  color: var(--dsw-alias-label-primary, #1f2328);\n  flex-direction: column;\n  flex: 1;\n  display: flex;\n  overflow: hidden;\n}\n\n.--KJaG_header {\n  flex: none;\n  align-items: center;\n  gap: 8px;\n  padding: 4px 0 8px;\n  display: flex;\n}\n\n.--KJaG_title {\n  margin: 0;\n  font-size: 16px;\n  font-weight: 600;\n  line-height: 24px;\n}\n\n.--KJaG_subtitle {\n  color: var(--dsw-alias-label-tertiary, #8b93a1);\n  margin: 2px 0 0;\n  font-size: 13px;\n  line-height: 20px;\n}\n\n.--KJaG_headerActions {\n  align-items: center;\n  gap: 8px;\n  margin-left: auto;\n  display: flex;\n}\n\n.--KJaG_summary {\n  color: var(--dsw-alias-label-secondary, #667085);\n  white-space: nowrap;\n  align-items: center;\n  gap: 7px;\n  font-size: 12px;\n  display: inline-flex;\n}\n\n.--KJaG_errorSummary {\n  color: var(--dsw-alias-state-error-primary, #dc2626);\n  font-variant-numeric: tabular-nums;\n  align-items: center;\n  gap: 6px;\n  font-size: 12px;\n  display: inline-flex;\n}\n\n.--KJaG_summaryDotGreen, .--KJaG_summaryDotRed {\n  border-radius: 50%;\n  width: 7px;\n  height: 7px;\n}\n\n.--KJaG_summaryDotGreen {\n  background: var(--dsw-alias-state-success-primary, #16a34a);\n}\n\n.--KJaG_summaryDotRed {\n  background: var(--dsw-alias-state-error-primary, #dc2626);\n}\n\n.--KJaG_toolbar {\n  flex: none;\n  margin-bottom: 24px;\n}\n\n.--KJaG_grid {\n  scrollbar-gutter: stable;\n  flex: 1;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  align-content: start;\n  gap: 12px;\n  min-width: 0;\n  min-height: 0;\n  padding-right: 4px;\n  display: grid;\n  overflow-y: auto;\n}\n\n.--KJaG_list {\n  scrollbar-gutter: stable;\n  flex-direction: column;\n  flex: 1;\n  gap: 8px;\n  min-width: 0;\n  min-height: 0;\n  padding-right: 4px;\n  display: flex;\n  overflow-y: auto;\n}\n\n.--KJaG_list .--KJaG_card {\n  flex-flow: wrap;\n  align-items: center;\n  gap: 8px 14px;\n}\n\n.--KJaG_list .--KJaG_cardTop {\n  flex: 0 260px;\n}\n\n.--KJaG_list .--KJaG_endpoint {\n  -webkit-line-clamp: 1;\n  flex: 200px;\n  min-height: 0;\n}\n\n.--KJaG_list .--KJaG_meta {\n  flex: 0 auto;\n}\n\n.--KJaG_list .--KJaG_cardReason {\n  flex-basis: 100%;\n}\n\n.--KJaG_card {\n  min-width: 0;\n  min-height: 0;\n  color: inherit;\n  background: var(--dsw-alias-bg-layer-1, #fff);\n  border: 1px solid var(--dsw-alias-border-l2, #e5e7eb);\n  cursor: pointer;\n  font: inherit;\n  text-align: left;\n  border-radius: 12px;\n  flex-direction: column;\n  gap: 8px;\n  padding: 12px 14px;\n  display: flex;\n}\n\n.--KJaG_card:hover {\n  border-color: var(--dsw-alias-border-l3, #d9dde3);\n  background: var(--dsw-alias-bg-hover, #00000009);\n}\n\n.--KJaG_card:focus-visible {\n  outline: 2px solid var(--dsw-alias-brand-primary, #4f6ef7);\n  outline-offset: 2px;\n}\n\n.--KJaG_cardTop {\n  align-items: center;\n  gap: 8px;\n  min-width: 0;\n  display: flex;\n}\n\n.--KJaG_statusDot {\n  background: var(--dsw-alias-state-success-primary, #16a34a);\n  border-radius: 50%;\n  flex: none;\n  width: 7px;\n  height: 7px;\n}\n\n.--KJaG_statusconnected {\n  background: var(--dsw-alias-state-success-primary, #16a34a);\n}\n\n.--KJaG_statusdegraded {\n  background: var(--dsw-alias-state-warn-primary, #b45309);\n}\n\n.--KJaG_statusfailed {\n  background: var(--dsw-alias-state-error-primary, #dc2626);\n}\n\n.--KJaG_statusdisabled {\n  background: var(--dsw-alias-label-tertiary, #98a2b3);\n}\n\n.--KJaG_service {\n  flex: 1;\n  min-width: 0;\n}\n\n.--KJaG_name {\n  color: var(--dsw-alias-label-primary, #1f2328);\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  font: 600 13px / 22px ui-monospace, Menlo, Consolas, monospace;\n  display: block;\n  overflow: hidden;\n}\n\n.--KJaG_endpoint {\n  min-height: 36px;\n  color: var(--dsw-alias-label-tertiary, #8b93a1);\n  -webkit-line-clamp: 2;\n  overflow-wrap: anywhere;\n  -webkit-box-orient: vertical;\n  margin: 0;\n  font: 12px / 18px ui-monospace, Menlo, Consolas, monospace;\n  display: -webkit-box;\n  overflow: hidden;\n}\n\n.--KJaG_meta {\n  flex-wrap: wrap;\n  align-items: center;\n  gap: 6px;\n  display: flex;\n}\n\n.--KJaG_sourcePlugin, .--KJaG_sourceDirect, .--KJaG_transport, .--KJaG_toolCount {\n  min-width: 0;\n  max-width: 100%;\n  color: var(--dsw-alias-label-secondary, #6b7280);\n  border: 1px solid var(--dsw-alias-border-l3, #d9dde3);\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  border-radius: 4px;\n  align-items: center;\n  gap: 5px;\n  padding: 1px 6px;\n  font-size: 12px;\n  line-height: 18px;\n  display: inline-flex;\n}\n\n.--KJaG_sourcePlugin svg, .--KJaG_sourceDirect svg {\n  color: currentColor;\n  stroke: currentColor;\n  stroke-width: 1.35px;\n  stroke-linecap: round;\n  stroke-linejoin: round;\n  flex: none;\n  width: 14px;\n  height: 14px;\n}\n\n.--KJaG_transport {\n  font-family: ui-monospace, Menlo, Consolas, monospace;\n}\n\n.--KJaG_toolCount {\n  color: var(--dsw-alias-label-primary, #1f2328);\n  flex: none;\n  font-weight: 600;\n}\n\n.--KJaG_cardReason {\n  color: var(--dsw-alias-state-error-primary, #dc2626);\n  overflow-wrap: anywhere;\n  margin: 0;\n  font-size: 12px;\n  line-height: 18px;\n}\n\n.--KJaG_state, .--KJaG_detailState {\n  color: var(--dsw-alias-state-success-primary, #16a34a);\n  white-space: nowrap;\n  align-items: center;\n  gap: 5px;\n  font-size: 11px;\n  display: inline-flex;\n}\n\n.--KJaG_state:before, .--KJaG_detailState:before {\n  content: \"\";\n  background: currentColor;\n  border-radius: 50%;\n  width: 6px;\n  height: 6px;\n}\n\n.--KJaG_stateconnected, .--KJaG_detailStateconnected {\n  color: var(--dsw-alias-state-success-primary, #16a34a);\n}\n\n.--KJaG_statedegraded, .--KJaG_detailStatedegraded {\n  color: var(--dsw-alias-state-warn-primary, #b45309);\n}\n\n.--KJaG_statefailed, .--KJaG_detailStatefailed {\n  color: var(--dsw-alias-state-error-primary, #dc2626);\n}\n\n.--KJaG_statedisabled, .--KJaG_detailStatedisabled {\n  color: var(--dsw-alias-label-tertiary, #98a2b3);\n}\n\n.--KJaG_chevron {\n  color: var(--dsw-alias-label-tertiary, #8b93a1);\n  font-size: 18px;\n}\n\n.--KJaG_empty, .--KJaG_detailEmpty {\n  color: var(--dsw-alias-label-tertiary, #8b93a1);\n  text-align: center;\n  padding: 24px;\n  font-size: 12px;\n}\n\n.--KJaG_error {\n  color: var(--dsw-alias-state-error-primary, #dc2626);\n  align-items: center;\n  gap: 8px;\n  margin: 16px 0;\n  font-size: 12px;\n  display: flex;\n}\n\n.--KJaG_boundary {\n  color: var(--dsw-alias-label-tertiary, #8b93a1);\n  background: var(--dsw-alias-bg-layer-2, #f7f8fa);\n  border-left: 2px solid var(--dsw-alias-border-l3, #d9dde3);\n  margin: 10px 0 0;\n  padding: 9px 10px;\n  font-size: 11px;\n  line-height: 17px;\n}\n\n.--KJaG_detailDialog {\n  width: min(720px, 94vw);\n}\n\n.--KJaG_detailBody {\n  max-height: 72vh;\n  overflow-y: auto;\n}\n\n.--KJaG_modalFooter {\n  justify-content: flex-end;\n  width: 100%;\n  display: flex;\n}\n\n.--KJaG_detail {\n  flex-direction: column;\n  gap: 16px;\n  display: flex;\n}\n\n.--KJaG_detailMeta {\n  flex-wrap: wrap;\n  gap: 6px;\n  display: flex;\n}\n\n.--KJaG_reason {\n  color: var(--dsw-alias-state-error-primary, #dc2626);\n  background: var(--dsw-alias-bg-error, #dc26260f);\n  border-left: 2px solid;\n  padding: 9px 10px;\n  font-size: 11px;\n  line-height: 16px;\n}\n\n.--KJaG_detailSection {\n  flex-direction: column;\n  gap: 7px;\n  display: flex;\n}\n\n.--KJaG_detailHead {\n  color: var(--dsw-alias-label-secondary, #667085);\n  border-bottom: 1px solid var(--dsw-alias-border-l2, #e5e7eb);\n  margin: 0;\n  padding-bottom: 5px;\n  font-size: 12px;\n  font-weight: 600;\n}\n\n.--KJaG_config {\n  max-height: 220px;\n  color: var(--dsw-alias-label-primary, #344054);\n  background: var(--dsw-alias-bg-layer-2, #f6f8fc);\n  border: 1px solid var(--dsw-alias-border-l1, #e2e7ef);\n  white-space: pre-wrap;\n  word-break: break-word;\n  border-radius: 7px;\n  margin: 0;\n  padding: 10px;\n  font: 11px / 17px ui-monospace, Menlo, Consolas, monospace;\n  overflow: auto;\n}\n\n.--KJaG_toolList {\n  flex-direction: column;\n  display: flex;\n}\n\n.--KJaG_tool {\n  border-bottom: 1px solid var(--dsw-alias-border-l1, #eef1f5);\n  grid-template-columns: 26px minmax(120px, auto) minmax(0, 1fr);\n  align-items: center;\n  gap: 8px;\n  padding: 7px 0;\n  display: grid;\n}\n\n.--KJaG_tool:last-child {\n  border-bottom: none;\n}\n\n.--KJaG_toolIndex {\n  color: var(--dsw-alias-brand-primary, #4f6ef7);\n  font: 10px / 16px ui-monospace, Menlo, Consolas, monospace;\n}\n\n.--KJaG_toolName {\n  color: var(--dsw-alias-label-primary, #1f2328);\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  font: 11px / 16px ui-monospace, Menlo, Consolas, monospace;\n  overflow: hidden;\n}\n\n.--KJaG_toolDescription {\n  color: var(--dsw-alias-label-tertiary, #8b93a1);\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  font-size: 10px;\n  overflow: hidden;\n}\n\n@media (width <= 760px) {\n  .--KJaG_header, .--KJaG_toolbar {\n    padding-left: 0;\n    padding-right: 0;\n  }\n\n  .--KJaG_header {\n    flex-direction: column;\n  }\n\n  .--KJaG_headerActions {\n    justify-content: space-between;\n    width: 100%;\n    margin-left: 0;\n  }\n\n  .--KJaG_grid {\n    grid-template-columns: minmax(0, 1fr);\n  }\n\n  .--KJaG_list .--KJaG_cardTop, .--KJaG_list .--KJaG_meta {\n    max-width: 100%;\n  }\n\n  .--KJaG_tool {\n    grid-template-columns: 26px minmax(0, 1fr);\n  }\n\n  .--KJaG_toolDescription {\n    display: none;\n  }\n}\n";document.head.appendChild(s);}})();
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
//#region \0rolldown/runtime.js
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
	if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
		key = keys[i];
		if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
			get: ((k) => from[k]).bind(null, key),
			enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
		});
	}
	return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule || !__hasOwnProp.call(mod, "default") ? __defProp(target, "default", {
	value: mod,
	enumerable: true
}) : target, mod));
//#endregion
let react = require("react");
let _deepseek_ai_dsh_client_ui_primitives = require("@deepseek-ai/dsh-client-ui-primitives");
_deepseek_ai_dsh_client_ui_primitives = __toESM(_deepseek_ai_dsh_client_ui_primitives, 1);
let react_dom_client = require("react-dom/client");
//#region src/client/locales.ts
/** Chinese is the source-of-truth key set; English is checked against it below. */
const zh = {
	nav: "Agent Plugins 市场",
	subtitle: "发现与安装 Agent Plugins（agent-plugins.org 便携包）",
	searchPh: "搜索 Agent Plugins…",
	tabAll: "全部",
	tabInstalled: "已安装",
	tabUninstalled: "未安装",
	market: "仓库源",
	addSource: "添加源",
	sourceIdPh: "源 id（小写字母数字）",
	sourceUrlPh: "git 仓库地址",
	sourceUrlLocalPh: "本地仓库路径（绝对路径或 ~/…）",
	sourceModeGit: "远程 git",
	sourceModeLocal: "本地目录",
	branchPh: "分支（可选）",
	sourceLocal: "本地",
	editSource: "编辑当前源",
	editSourceTitle: "编辑仓库源",
	addSourceTitle: "新增仓库源",
	save: "保存",
	confirmDelete: "确认删除",
	refreshAll: "刷新全部",
	detailTitle: "Agent Plugins 详情",
	overviewSection: "概览",
	skillsSection: "技能",
	mcpSection: "MCP 服务",
	commandsSection: "命令",
	agentsSection: "子代理",
	hooksLabel: "Hooks",
	sourceLabel: "来源",
	dimensionLabel: "维度",
	layoutLabel: "布局",
	statusLabel: "状态",
	authorLabel: "作者",
	keywordsLabel: "关键词",
	disabledLabel: "已停用",
	notInstalledLabel: "未安装",
	noSkills: "（无技能）",
	noMcp: "（无 MCP 服务）",
	loading: "加载中…",
	lspSection: "LSP 服务",
	editorHint: "仓库源提供 Agent Plugins。本地目录直接读取（实时反映工作树）；git 源克隆到 ~/.dsh/agent-plugins/.sources/<id>。",
	idHint: "小写字母/数字/连字符，全局唯一",
	urlGitHint: "git 仓库地址，例如 https://github.com/org/repo.git",
	urlLocalHint: "绝对路径或 ~/…，直接读取本地目录（不克隆、移除源时不会删除）",
	branchHint: "可选；不填则跟踪默认分支",
	idFixed: "id 不可修改（源标识全局唯一）",
	progressStarting: "正在提交…",
	progressCloning: "正在克隆仓库（git clone），可能需要几十秒…",
	progressReading: "正在读取插件清单…",
	idAutoLabel: "源 ID（自动生成）",
	idAutoHint: "自动从插件清单名或仓库名解析，无需填写",
	detailHint: "点击技能或 MCP 服务行可展开查看详情",
	add: "添加",
	remove: "移除",
	refresh: "刷新",
	install: "安装",
	installing: "安装中…",
	installedBadge: "已安装",
	uninstall: "卸载",
	uninstallConfirmTitle: "卸载 Agent Plugins",
	uninstallConfirmDesc: "将从已安装列表移除该 Agent Plugins，其技能与 MCP 工具随即停止注入。仓库源克隆保留。",
	removeSourceConfirmTitle: "移除仓库源「{sourceId}」",
	removeSourceConfirmDesc: "将删除该源的本地克隆与全部安装记录。",
	enable: "启用",
	disable: "禁用",
	cancel: "取消",
	confirm: "确认",
	empty: "没有匹配的 Agent Plugins",
	installedEmpty: "还没有安装 Agent Plugins",
	loadFail: "Agent Plugins 目录加载失败，请稍后重试",
	actionFail: "操作失败",
	version: "版本",
	dimensionUser: "用户级",
	dimensionProject: "项目级",
	layoutV1: "便携 v1",
	layoutCC: "Claude Code",
	layoutCodex: "Codex",
	layoutSkills: "技能集合",
	layoutUniversal: "通用",
	layoutCursor: "Cursor",
	layoutKimi: "Kimi",
	layoutRemote: "远程引用",
	remoteRef: "远程",
	surfaceSkills: "技能",
	surfaceMcp: "MCP",
	surfaceHooks: "Hooks",
	surfaceCommands: "命令",
	surfaceAgents: "子代理",
	surfaceLsp: "LSP",
	sourceNotCloned: "未克隆",
	sourceCloned: "已克隆",
	errors: "校验问题",
	sourceErrorSeparator: "；",
	viewMode: "视图模式",
	grid: "网格",
	list: "列表",
	openSettings: "在设置中打开",
	rootLabel: "Agent Plugins 目录",
	dataLabel: "Agent Plugins 数据目录",
	countAll: "共 {n} 个 Agent Plugins",
	countInstalled: "已装 {n}",
	countEnabled: "启用 {n}",
	mcpStatusNav: "MCP 服务",
	mcpStatusTitle: "MCP 服务",
	mcpStatusSubtitle: "连接状态、来源和工具清单",
	mcpSearch: "搜索 MCP 名称、来源或地址…",
	mcpAll: "全部",
	mcpPlugin: "Plugin",
	mcpDirect: "直接安装",
	mcpService: "服务",
	mcpSource: "来源",
	mcpTransport: "传输",
	mcpTools: "工具",
	mcpConnected: "已连接",
	mcpDegraded: "降级",
	mcpFailed: "失败",
	mcpDisabled: "未启用",
	mcpObservedEndpoint: "当前工具表观测",
	mcpServiceDetail: "服务详情",
	mcpConfig: "连接配置",
	mcpSelectHint: "选择一个 MCP 服务查看配置与工具",
	mcpEmpty: "没有匹配的 MCP 服务",
	mcpNoTools: "当前没有已注册工具",
	mcpDirectConfigUnavailable: "宿主未提供直接安装 MCP 的配置记录",
	mcpDirectBoundary: "直接安装 MCP 仅显示当前工具表中可观测的服务；宿主未提供配置与连接状态 API。",
	mcpBackToMarket: "返回市场",
	mcpRetry: "重试"
};
const en = {
	nav: "Agent Plugins Market",
	subtitle: "Discover and install Agent Plugins suites (agent-plugins.org portable packages)",
	searchPh: "Search suites…",
	tabAll: "All",
	tabInstalled: "Installed",
	tabUninstalled: "Uninstalled",
	market: "Sources",
	addSource: "Add source",
	sourceIdPh: "source id (lowercase alnum)",
	sourceUrlPh: "git repository URL",
	sourceUrlLocalPh: "local repository path (absolute or ~/…)",
	sourceModeGit: "remote git",
	sourceModeLocal: "local dir",
	branchPh: "branch (optional)",
	sourceLocal: "local",
	editSource: "Edit source",
	editSourceTitle: "Edit source",
	addSourceTitle: "Add source",
	save: "Save",
	confirmDelete: "Delete",
	refreshAll: "Refresh all",
	detailTitle: "Suite details",
	overviewSection: "Overview",
	skillsSection: "Skills",
	mcpSection: "MCP servers",
	commandsSection: "Commands",
	agentsSection: "Subagents",
	hooksLabel: "Hooks",
	sourceLabel: "Source",
	dimensionLabel: "Dimension",
	layoutLabel: "Layout",
	statusLabel: "Status",
	authorLabel: "Author",
	keywordsLabel: "Keywords",
	disabledLabel: "disabled",
	notInstalledLabel: "not installed",
	noSkills: "(no skills)",
	noMcp: "(no MCP servers)",
	loading: "Loading…",
	lspSection: "LSP servers",
	editorHint: "A source provides suites (Agent Plugins). Local directories are read in place (live working tree); git sources clone into ~/.dsh/agent-plugins/.sources/<id>.",
	idHint: "lowercase letters / digits / hyphens, globally unique",
	urlGitHint: "git repository URL, e.g. https://github.com/org/repo.git",
	urlLocalHint: "absolute path or ~/…, read in place (never cloned, never deleted on removal)",
	branchHint: "optional; defaults to the repository default branch",
	idFixed: "id is fixed (the source identifier is globally unique)",
	progressStarting: "Submitting…",
	progressCloning: "Cloning the repository (git clone) — this can take tens of seconds…",
	progressReading: "Reading plugin manifests…",
	idAutoLabel: "Source ID (auto)",
	idAutoHint: "Derived from the suite or repo name — no need to type it",
	detailHint: "Click a skill or MCP server row to expand its details",
	add: "Add",
	remove: "Remove",
	refresh: "Refresh",
	install: "Install",
	installing: "Installing…",
	installedBadge: "Installed",
	uninstall: "Uninstall",
	uninstallConfirmTitle: "Uninstall suite",
	uninstallConfirmDesc: "Removes the suite from the installed list; its skills and MCP tools stop injecting. The source clone stays.",
	removeSourceConfirmTitle: "Remove source “{sourceId}”",
	removeSourceConfirmDesc: "Deletes the local clone and all install records of this source.",
	enable: "Enable",
	disable: "Disable",
	cancel: "Cancel",
	confirm: "Confirm",
	empty: "No matching suites",
	installedEmpty: "No suites installed yet",
	loadFail: "Failed to load the suite catalog, try again later",
	actionFail: "Action failed",
	version: "Version",
	dimensionUser: "user",
	dimensionProject: "project",
	layoutV1: "portable v1",
	layoutCC: "Claude Code",
	layoutCodex: "Codex",
	layoutSkills: "skill dir",
	layoutUniversal: "universal",
	layoutCursor: "Cursor",
	layoutKimi: "Kimi",
	layoutRemote: "remote reference",
	remoteRef: "remote",
	surfaceSkills: "skills",
	surfaceMcp: "MCP",
	surfaceHooks: "hooks",
	surfaceCommands: "commands",
	surfaceAgents: "subagents",
	surfaceLsp: "LSP",
	sourceNotCloned: "not cloned",
	sourceCloned: "cloned",
	errors: "validation issues",
	sourceErrorSeparator: "; ",
	viewMode: "View mode",
	grid: "grid",
	list: "list",
	openSettings: "Open in settings",
	rootLabel: "Suite root",
	dataLabel: "Suite data root",
	countAll: "{n} suites",
	countInstalled: "{n} installed",
	countEnabled: "{n} enabled",
	mcpStatusNav: "MCP services",
	mcpStatusTitle: "MCP services",
	mcpStatusSubtitle: "Connection state, sources, and tools",
	mcpSearch: "Search MCP names, sources, or endpoints…",
	mcpAll: "All",
	mcpPlugin: "Plugin",
	mcpDirect: "Direct",
	mcpService: "Service",
	mcpSource: "Source",
	mcpTransport: "Transport",
	mcpTools: "tools",
	mcpConnected: "connected",
	mcpDegraded: "degraded",
	mcpFailed: "failed",
	mcpDisabled: "disabled",
	mcpObservedEndpoint: "observed from tool registry",
	mcpServiceDetail: "Service detail",
	mcpConfig: "Connection config",
	mcpSelectHint: "Select an MCP service to inspect config and tools",
	mcpEmpty: "No matching MCP services",
	mcpNoTools: "No registered tools",
	mcpDirectConfigUnavailable: "The host does not expose direct-MCP configuration",
	mcpDirectBoundary: "Direct MCP entries only show services observed in the current tool registry; the host exposes no config or connection-status API.",
	mcpBackToMarket: "Back to market",
	mcpRetry: "Retry"
};
//#endregion
//#region src/client/api.ts
async function fetchOverview() {
	const response = await fetch("/api/agent-plugins/overview", { credentials: "same-origin" });
	if (!response.ok) throw new Error(`overview failed: ${response.status}`);
	return response.json();
}
async function fetchSourceProgress() {
	const response = await fetch("/api/agent-plugins/progress", { credentials: "same-origin" });
	if (!response.ok) throw new Error(`progress failed: ${response.status}`);
	return response.json();
}
async function fetchSuiteDetail(sourceId, suiteId) {
	const response = await fetch(`/api/agent-plugins/suite?sourceId=${encodeURIComponent(sourceId)}&suiteId=${encodeURIComponent(suiteId)}`, { credentials: "same-origin" });
	if (!response.ok) throw new Error(`suite detail failed: ${response.status}`);
	return response.json();
}
async function fetchMcpStatus() {
	const response = await fetch("/api/agent-plugins/mcp-status", { credentials: "same-origin" });
	if (!response.ok) throw new Error(`MCP status failed: ${response.status}`);
	return response.json();
}
async function fetchSkillContent(sourceId, suiteId, skill) {
	const response = await fetch(`/api/agent-plugins/skill?sourceId=${encodeURIComponent(sourceId)}&suiteId=${encodeURIComponent(suiteId)}&skill=${encodeURIComponent(skill)}`, { credentials: "same-origin" });
	if (!response.ok) throw new Error(`skill content failed: ${response.status}`);
	return response.json();
}
async function postAction(path, body) {
	const response = await fetch(`/api/agent-plugins/${path}`, {
		method: "POST",
		credentials: "same-origin",
		headers: { "content-type": "application/json" },
		body: JSON.stringify(body)
	});
	const payload = await response.json();
	if (!response.ok || payload.ok !== true) throw new Error(payload.error ?? `request failed: ${response.status}`);
	return payload;
}
//#endregion
//#region src/client/ErrorBoundary.tsx
/**
* Error boundary for untrusted preview content.
*
* Skill/command/agent bodies and hook/LSP JSON are third-party content; a
* renderer throw must degrade to a plain-text fallback instead of unmounting
* the whole settings section (React has no built-in boundary).
*/
var ErrorBoundary = class extends react.Component {
	state = { error: void 0 };
	static getDerivedStateFromError(error) {
		return { error };
	}
	componentDidCatch(error, info) {
		console.warn("[dsh-agent-plugins-market] preview render failed:", error, info);
	}
	render() {
		if (this.state.error !== void 0) return this.props.fallback === void 0 ? (0, react.createElement)("pre", { className: "dsh-agent-plugins-fallback" }, `预览渲染失败：${this.state.error.message}`) : this.props.fallback(this.state.error);
		return this.props.children;
	}
};
//#endregion
//#region src/client/market.module.css
var market_module_default = {
	"body": "qMtKNa_body",
	"card": "qMtKNa_card",
	"cardActions": "qMtKNa_cardActions",
	"cardDesc": "qMtKNa_cardDesc",
	"cardName": "qMtKNa_cardName",
	"cardTitle": "qMtKNa_cardTitle",
	"cardTop": "qMtKNa_cardTop",
	"desc": "qMtKNa_desc",
	"detailBody": "qMtKNa_detailBody",
	"detailCell": "qMtKNa_detailCell",
	"detailChevron": "qMtKNa_detailChevron",
	"detailDesc": "qMtKNa_detailDesc",
	"detailDialog": "qMtKNa_detailDialog",
	"detailGrid": "qMtKNa_detailGrid",
	"detailHead": "qMtKNa_detailHead",
	"detailItem": "qMtKNa_detailItem",
	"detailItemDesc": "qMtKNa_detailItemDesc",
	"detailItemName": "qMtKNa_detailItemName",
	"detailItemOpen": "qMtKNa_detailItemOpen",
	"detailItemRow": "qMtKNa_detailItemRow",
	"detailKey": "qMtKNa_detailKey",
	"detailSection": "qMtKNa_detailSection",
	"detailSections": "qMtKNa_detailSections",
	"detailValue": "qMtKNa_detailValue",
	"dshApmSpin": "qMtKNa_dshApmSpin",
	"editorDialog": "qMtKNa_editorDialog",
	"editorForm": "qMtKNa_editorForm",
	"empty": "qMtKNa_empty",
	"fieldGroup": "qMtKNa_fieldGroup",
	"fieldHint": "qMtKNa_fieldHint",
	"fieldLabel": "qMtKNa_fieldLabel",
	"grid": "qMtKNa_grid",
	"header": "qMtKNa_header",
	"list": "qMtKNa_list",
	"market": "qMtKNa_market",
	"marketControls": "qMtKNa_marketControls",
	"mcpSurface": "qMtKNa_mcpSurface",
	"meta": "qMtKNa_meta",
	"modalFooter": "qMtKNa_modalFooter",
	"modalFooterLeft": "qMtKNa_modalFooterLeft",
	"modeRow": "qMtKNa_modeRow",
	"mono": "qMtKNa_mono",
	"okState": "qMtKNa_okState",
	"pageEntry": "qMtKNa_pageEntry",
	"pageMode": "qMtKNa_pageMode",
	"pageView": "qMtKNa_pageView",
	"progress": "qMtKNa_progress",
	"progressError": "qMtKNa_progressError",
	"progressFail": "qMtKNa_progressFail",
	"progressSpin": "qMtKNa_progressSpin",
	"progressText": "qMtKNa_progressText",
	"searchGroup": "qMtKNa_searchGroup",
	"seg": "qMtKNa_seg",
	"segOn": "qMtKNa_segOn",
	"skillContent": "qMtKNa_skillContent",
	"sourceTabsRow": "qMtKNa_sourceTabsRow",
	"sourceTabsScroll": "qMtKNa_sourceTabsScroll",
	"spacer": "qMtKNa_spacer",
	"src": "qMtKNa_src",
	"srcTab": "qMtKNa_srcTab",
	"srcTabDel": "qMtKNa_srcTabDel",
	"srcTabEdit": "qMtKNa_srcTabEdit",
	"srcTabMain": "qMtKNa_srcTabMain",
	"srcTabOn": "qMtKNa_srcTabOn",
	"staticId": "qMtKNa_staticId",
	"staticIdValue": "qMtKNa_staticIdValue",
	"sub": "qMtKNa_sub",
	"surfaceSwitch": "qMtKNa_surfaceSwitch",
	"switchOff": "qMtKNa_switchOff",
	"switchOn": "qMtKNa_switchOn",
	"switchThumb": "qMtKNa_switchThumb",
	"tag": "qMtKNa_tag",
	"title": "qMtKNa_title",
	"titleRow": "qMtKNa_titleRow",
	"version": "qMtKNa_version",
	"warnLine": "qMtKNa_warnLine"
};
//#endregion
//#region src/client/SuiteDetail.tsx
/**
* Suite detail modal: click one suite card to browse its internals.
*
* Sections: manifest overview, the skill list (each skill expands to its
* SKILL.md body through the safe MarkdownText renderer), the validated
* mcp.json servers (each expands to its full config), command/subagent file
* lists, hook/LSP counts, and validation diagnostics.
*/
function SuiteDetailModal({ t, sourceId, suiteId, onClose }) {
	const [detail, setDetail] = (0, react.useState)(void 0);
	const [error, setError] = (0, react.useState)(void 0);
	const [openSkill, setOpenSkill] = (0, react.useState)(void 0);
	const [skillText, setSkillText] = (0, react.useState)(void 0);
	const [skillLoading, setSkillLoading] = (0, react.useState)(false);
	const [openMcp, setOpenMcp] = (0, react.useState)(void 0);
	const [openPreview, setOpenPreview] = (0, react.useState)(void 0);
	(0, react.useEffect)(() => {
		let cancelled = false;
		setDetail(void 0);
		setError(void 0);
		fetchSuiteDetail(sourceId, suiteId).then((value) => {
			if (!cancelled) setDetail(value);
		}).catch((reason) => {
			if (!cancelled) setError(reason instanceof Error ? reason.message : String(reason));
		});
		return () => {
			cancelled = true;
		};
	}, [sourceId, suiteId]);
	const toggleSkill = async (name) => {
		if (openSkill === name) {
			setOpenSkill(void 0);
			return;
		}
		setOpenSkill(name);
		setSkillLoading(true);
		setSkillText(void 0);
		try {
			const content = await fetchSkillContent(sourceId, suiteId, name);
			setSkillText(content.content);
		} catch (reason) {
			setSkillText(`⚠ ${reason instanceof Error ? reason.message : String(reason)}`);
		} finally {
			setSkillLoading(false);
		}
	};
	const toggleMcp = (key) => {
		setOpenMcp(openMcp === key ? void 0 : key);
	};
	const layoutLabel = detail === void 0 ? "" : detail.layout === "agent-plugin-v1" ? t("layoutV1") : detail.layout === "claude-code" ? t("layoutCC") : detail.layout === "codex" ? t("layoutCodex") : detail.layout === "universal" ? t("layoutUniversal") : detail.layout === "cursor" ? t("layoutCursor") : detail.layout === "kimi" ? t("layoutKimi") : detail.layout === "remote" ? t("layoutRemote") : t("layoutSkills");
	return (0, react.createElement)(_deepseek_ai_dsh_client_ui_primitives.Modal, {
		open: true,
		onClose,
		title: detail === void 0 ? t("detailTitle") : `${detail.name}${detail.version === null ? "" : ` v${detail.version}`}`,
		description: detail === void 0 ? void 0 : t("detailHint"),
		closeLabel: t("cancel"),
		className: market_module_default.detailDialog,
		contentClassName: market_module_default.detailBody,
		footer: (0, react.createElement)("div", { className: market_module_default.modalFooter }, (0, react.createElement)(_deepseek_ai_dsh_client_ui_primitives.Button, {
			variant: "ghost",
			onClick: onClose
		}, t("cancel"))),
		children: (0, react.createElement)(ErrorBoundary, {
			fallback: (boundaryError) => (0, react.createElement)("div", { className: market_module_default.warnLine }, `${t("actionFail")}: ${boundaryError.message}`),
			children: error !== void 0 ? (0, react.createElement)("div", { className: market_module_default.warnLine }, error) : detail === void 0 ? (0, react.createElement)("div", { className: market_module_default.empty }, t("loading")) : (0, react.createElement)("div", { className: market_module_default.detailSections }, (0, react.createElement)("section", { className: market_module_default.detailSection }, (0, react.createElement)("h4", { className: market_module_default.detailHead }, t("overviewSection")), (0, react.createElement)("div", { className: market_module_default.detailGrid }, (0, react.createElement)("div", { className: market_module_default.detailCell }, (0, react.createElement)("span", { className: market_module_default.detailKey }, t("sourceLabel")), (0, react.createElement)("span", { className: market_module_default.detailValue }, detail.sourceId)), (0, react.createElement)("div", { className: market_module_default.detailCell }, (0, react.createElement)("span", { className: market_module_default.detailKey }, t("dimensionLabel")), (0, react.createElement)("span", { className: market_module_default.detailValue }, detail.dimension === "user" ? t("dimensionUser") : t("dimensionProject"))), (0, react.createElement)("div", { className: market_module_default.detailCell }, (0, react.createElement)("span", { className: market_module_default.detailKey }, t("layoutLabel")), (0, react.createElement)("span", { className: market_module_default.detailValue }, layoutLabel)), (0, react.createElement)("div", { className: market_module_default.detailCell }, (0, react.createElement)("span", { className: market_module_default.detailKey }, t("statusLabel")), (0, react.createElement)("span", { className: detail.enabled ? market_module_default.okState : market_module_default.detailValue }, detail.installed ? detail.enabled ? t("installedBadge") : t("disabledLabel") : t("notInstalledLabel"))), detail.author === null ? null : (0, react.createElement)("div", { className: market_module_default.detailCell }, (0, react.createElement)("span", { className: market_module_default.detailKey }, t("authorLabel")), (0, react.createElement)("span", { className: market_module_default.detailValue }, detail.author)), detail.keywords.length === 0 ? null : (0, react.createElement)("div", { className: market_module_default.detailCell }, (0, react.createElement)("span", { className: market_module_default.detailKey }, t("keywordsLabel")), (0, react.createElement)("span", { className: market_module_default.detailValue }, detail.keywords.join(", ")))), detail.description === null ? null : (0, react.createElement)("p", { className: market_module_default.detailDesc }, detail.description), (0, react.createElement)("div", { className: market_module_default.detailCell }, (0, react.createElement)("span", { className: market_module_default.detailKey }, t("rootLabel")), (0, react.createElement)("span", { className: market_module_default.mono }, detail.root))), (0, react.createElement)("section", { className: market_module_default.detailSection }, (0, react.createElement)("h4", { className: market_module_default.detailHead }, `${t("skillsSection")} (${detail.skills.length})`), detail.skills.length === 0 ? (0, react.createElement)("div", { className: market_module_default.sidebarEmpty }, "—") : detail.skills.map((skill) => (0, react.createElement)("div", {
				key: skill.name,
				className: market_module_default.detailItem
			}, (0, react.createElement)("button", {
				type: "button",
				className: openSkill === skill.name ? market_module_default.detailItemOpen : market_module_default.detailItemRow,
				onClick: () => {
					toggleSkill(skill.name);
				}
			}, (0, react.createElement)("span", { className: market_module_default.detailItemName }, skill.name), (0, react.createElement)("span", { className: market_module_default.detailItemDesc }, skill.description), (0, react.createElement)("span", { className: market_module_default.detailChevron }, openSkill === skill.name ? "▾" : "▸")), openSkill !== skill.name ? null : (0, react.createElement)("div", { className: market_module_default.skillContent }, skillLoading ? t("loading") : (0, react.createElement)(_deepseek_ai_dsh_client_ui_primitives.MarkdownText, { text: skillText ?? "" }))))), (0, react.createElement)("section", { className: market_module_default.detailSection }, (0, react.createElement)("h4", { className: market_module_default.detailHead }, `${t("mcpSection")} (${detail.mcpServers.length})`), detail.mcpErrors.length === 0 ? null : (0, react.createElement)("div", {
				className: market_module_default.warnLine,
				style: { margin: "0 0 6px" }
			}, `⚠ ${detail.mcpErrors.join(t("sourceErrorSeparator"))}`), detail.mcpServers.length === 0 ? (0, react.createElement)("div", { className: market_module_default.sidebarEmpty }, "—") : detail.mcpServers.map((server) => (0, react.createElement)("div", {
				key: server.key,
				className: market_module_default.detailItem
			}, (0, react.createElement)("button", {
				type: "button",
				className: openMcp === server.key ? market_module_default.detailItemOpen : market_module_default.detailItemRow,
				onClick: () => toggleMcp(server.key)
			}, (0, react.createElement)("span", { className: market_module_default.detailItemName }, server.key), (0, react.createElement)("span", { className: market_module_default.detailItemDesc }, mcpSummary(server)), (0, react.createElement)("span", { className: market_module_default.detailChevron }, openMcp === server.key ? "▾" : "▸")), openMcp !== server.key ? null : (0, react.createElement)("pre", { className: market_module_default.mono }, JSON.stringify(server, null, 2))))), (0, react.createElement)("section", { className: market_module_default.detailSection }, (0, react.createElement)("h4", { className: market_module_default.detailHead }, `${t("commandsSection")} (${detail.commands.length})`), detail.commands.length === 0 ? (0, react.createElement)("div", { className: market_module_default.sidebarEmpty }, "—") : detail.commands.map((command) => (0, react.createElement)(PreviewRow, {
				key: `c:${command.name}`,
				t,
				name: `/${command.name}`,
				description: command.description,
				open: openPreview === `c:${command.name}`,
				onToggle: () => setOpenPreview(openPreview === `c:${command.name}` ? void 0 : `c:${command.name}`),
				children: (0, react.createElement)(_deepseek_ai_dsh_client_ui_primitives.MarkdownText, { text: command.content })
			}))), (0, react.createElement)("section", { className: market_module_default.detailSection }, (0, react.createElement)("h4", { className: market_module_default.detailHead }, `${t("agentsSection")} (${detail.agents.length})`), detail.agents.length === 0 ? (0, react.createElement)("div", { className: market_module_default.sidebarEmpty }, "—") : detail.agents.map((agent) => (0, react.createElement)(PreviewRow, {
				key: `a:${agent.name}`,
				t,
				name: agent.name,
				description: agent.description,
				open: openPreview === `a:${agent.name}`,
				onToggle: () => setOpenPreview(openPreview === `a:${agent.name}` ? void 0 : `a:${agent.name}`),
				children: (0, react.createElement)(_deepseek_ai_dsh_client_ui_primitives.MarkdownText, { text: agent.content })
			}))), (0, react.createElement)("section", { className: market_module_default.detailSection }, (0, react.createElement)("h4", { className: market_module_default.detailHead }, `${t("hooksLabel")} (${detail.hooks.count})`), detail.hooks.count === 0 ? (0, react.createElement)("div", { className: market_module_default.sidebarEmpty }, "—") : detail.hooks.entries.map((hook, index) => (0, react.createElement)(PreviewRow, {
				key: `h:${index}`,
				t,
				name: hook.event,
				description: hook.command,
				open: openPreview === `h:${index}`,
				onToggle: () => setOpenPreview(openPreview === `h:${index}` ? void 0 : `h:${index}`),
				children: (0, react.createElement)("pre", { className: market_module_default.mono }, JSON.stringify(hook, null, 2))
			}))), (0, react.createElement)("section", { className: market_module_default.detailSection }, (0, react.createElement)("h4", { className: market_module_default.detailHead }, `${t("lspSection")} (${detail.lsp.length})`), detail.lsp.length === 0 ? (0, react.createElement)("div", { className: market_module_default.sidebarEmpty }, "—") : detail.lsp.map((entry) => (0, react.createElement)(PreviewRow, {
				key: `l:${entry.name}`,
				t,
				name: entry.name,
				open: openPreview === `l:${entry.name}`,
				onToggle: () => setOpenPreview(openPreview === `l:${entry.name}` ? void 0 : `l:${entry.name}`),
				children: (0, react.createElement)("pre", { className: market_module_default.mono }, entry.content)
			}))), detail.errors.length === 0 ? null : (0, react.createElement)("section", { className: market_module_default.detailSection }, (0, react.createElement)("h4", { className: market_module_default.detailHead }, `${t("errors")} (${detail.errors.length})`), detail.errors.map((entry, index) => (0, react.createElement)("div", {
				key: index,
				className: market_module_default.warnLine
			}, entry))))
		})
	});
}
function mcpSummary(server) {
	if (server.type === "stdio") return server.command ?? server.type;
	return server.url ?? server.type;
}
function PreviewRow(props) {
	const { t: _t, name, description, open, onToggle, children } = props;
	return (0, react.createElement)("div", { className: market_module_default.detailItem }, (0, react.createElement)("button", {
		type: "button",
		className: open ? market_module_default.detailItemOpen : market_module_default.detailItemRow,
		onClick: onToggle
	}, (0, react.createElement)("span", { className: market_module_default.detailItemName }, name), description === void 0 ? null : (0, react.createElement)("span", { className: market_module_default.detailItemDesc }, description), (0, react.createElement)("span", { className: market_module_default.detailChevron }, open ? "▾" : "▸")), open ? (0, react.createElement)("div", { className: market_module_default.skillContent }, children) : null);
}
//#endregion
//#region src/client/SearchFilterToolbar.module.css
var SearchFilterToolbar_module_default = {
	"filter": "R7YLDa_filter",
	"filterCount": "R7YLDa_filterCount",
	"filterGap": "R7YLDa_filterGap",
	"filterOn": "R7YLDa_filterOn",
	"search": "R7YLDa_search",
	"toolbar": "R7YLDa_toolbar",
	"viewGap": "R7YLDa_viewGap",
	"viewSwitch": "R7YLDa_viewSwitch"
};
//#endregion
//#region src/client/SearchFilterToolbar.tsx
/**
* Shared search, filter, and view controls for catalog-style settings panels.
*/
/**
* Render a consistent control row for searchable grid and list content.
*
* @param props - Search state, selectable filters, and view-mode state.
* @returns Search input, filter tabs, and an accessible grid/list toggle.
*/
function SearchFilterToolbar(props) {
	const nextView = props.view === "grid" ? "list" : "grid";
	const nextViewLabel = nextView === "grid" ? props.gridLabel : props.listLabel;
	return (0, react.createElement)("div", { className: props.className === void 0 ? SearchFilterToolbar_module_default.toolbar : `${SearchFilterToolbar_module_default.toolbar} ${props.className}` }, (0, react.createElement)(_deepseek_ai_dsh_client_ui_primitives.Input, {
		className: SearchFilterToolbar_module_default.search,
		value: props.search,
		placeholder: props.searchPlaceholder,
		"aria-label": props.searchLabel,
		onChange: (event) => props.onSearchChange(event.target.value)
	}), (0, react.createElement)("div", { className: SearchFilterToolbar_module_default.filterGap }), ...props.filters.map((filter) => (0, react.createElement)("button", {
		key: filter.id,
		type: "button",
		className: filter.active ? SearchFilterToolbar_module_default.filterOn : SearchFilterToolbar_module_default.filter,
		title: `${filter.label} ${filter.count}`,
		"aria-label": `${filter.label} ${filter.count}`,
		onClick: filter.onSelect
	}, filter.icon, (0, react.createElement)("span", { className: SearchFilterToolbar_module_default.filterCount }, filter.count))), (0, react.createElement)("div", { className: SearchFilterToolbar_module_default.viewGap }), (0, react.createElement)("button", {
		type: "button",
		className: SearchFilterToolbar_module_default.viewSwitch,
		"aria-label": nextViewLabel,
		title: nextViewLabel,
		onClick: () => props.onViewChange(nextView)
	}, (0, react.createElement)(ViewIcon, { mode: nextView })));
}
function ViewIcon({ mode }) {
	const common = {
		width: 16,
		height: 16,
		viewBox: "0 0 16 16",
		fill: "none",
		"aria-hidden": true
	};
	return mode === "list" ? (0, react.createElement)("svg", common, (0, react.createElement)("path", { d: "M3 4h10M3 8h10M3 12h10" })) : (0, react.createElement)("svg", common, (0, react.createElement)("rect", {
		x: 2.5,
		y: 2.5,
		width: 4,
		height: 4,
		rx: .8
	}), (0, react.createElement)("rect", {
		x: 9.5,
		y: 2.5,
		width: 4,
		height: 4,
		rx: .8
	}), (0, react.createElement)("rect", {
		x: 2.5,
		y: 9.5,
		width: 4,
		height: 4,
		rx: .8
	}), (0, react.createElement)("rect", {
		x: 9.5,
		y: 9.5,
		width: 4,
		height: 4,
		rx: .8
	}));
}
//#endregion
//#region src/client/MarketSection.tsx
/**
* The Agent Plugins Market settings section.
*
* Layout: repository sources run along the TOP as chips (全部 first), with
* edit-current / add / refresh-all controls on the right; below sit search,
* status tabs, and the card grid. Colors ride the dsh --dsw-alias-* tokens
* with light-mode fallbacks so the page follows the active theme.
*/
/** Host step keys -> translation keys, resolved against the active t(). */
const PROGRESS_STEP_LABELS = {
	cloning: "progressCloning",
	reading: "progressReading"
};
/**
* Poll the host's source-mutation progress while an add-source request runs.
* Failures of the poll itself never surface: the add request is the authority.
*/
function startProgressPolling(report) {
	let stopped = false;
	const tick = async () => {
		if (stopped) return;
		try {
			const progress = await fetchSourceProgress();
			if (!stopped && progress.active) report({
				step: progressStepLabel(progress.step),
				error: void 0
			});
		} catch {}
		if (!stopped) timer = setTimeout(tick, 800);
	};
	let timer = setTimeout(tick, 400);
	return { stop: () => {
		stopped = true;
		clearTimeout(timer);
	} };
}
function progressStepLabel(step) {
	return PROGRESS_STEP_LABELS[step] ?? step;
}
/** Keep parameterized copy compatible with hosts whose bound translator ignores params. */
function interpolate(text, params) {
	return text.replace(/\{(\w+)\}/g, (match, key) => key in params ? String(params[key]) : match);
}
const EMPTY_OVERVIEW = {
	sources: [],
	suites: [],
	totals: {
		all: 0,
		installed: 0,
		enabled: 0
	},
	roots: {
		user: "",
		data: ""
	}
};
/**
* Session-level overview cache: the first mount paints the last snapshot
* instantly (no empty-state flash on reopen), then revalidates in the
* background. Every refresh overwrites the cached copy.
*/
let cachedOverview;
let inflightOverview;
function loadOverview() {
	const initial = cachedOverview ?? EMPTY_OVERVIEW;
	if (inflightOverview === void 0) inflightOverview = fetchOverview().then((data) => {
		cachedOverview = data;
		return data;
	}).finally(() => {
		inflightOverview = void 0;
	});
	return {
		initial,
		revalidating: cachedOverview === void 0,
		promise: inflightOverview
	};
}
/** Invalidate the cached overview after any mutating action. */
function dropCachedOverview() {
	cachedOverview = void 0;
}
function MarketSection({ t, mode = "settings" }) {
	const [overview, setOverview] = (0, react.useState)(() => loadOverview().initial);
	const [loading, setLoading] = (0, react.useState)(() => cachedOverview === void 0);
	const [search, setSearch] = (0, react.useState)("");
	const [tab, setTab] = (0, react.useState)("all");
	const [category, setCategory] = (0, react.useState)("all");
	const [view, setView] = (0, react.useState)("grid");
	const [busy, setBusy] = (0, react.useState)(void 0);
	const [toast, setToast] = (0, react.useState)(void 0);
	const [confirm, setConfirm] = (0, react.useState)(void 0);
	const [editor, setEditor] = (0, react.useState)(void 0);
	const [detail, setDetail] = (0, react.useState)(void 0);
	const [progress, setProgress] = (0, react.useState)({
		step: void 0,
		error: void 0
	});
	const refresh = (0, react.useCallback)(async () => {
		dropCachedOverview();
		try {
			const data = await loadOverview().promise;
			setOverview(data);
		} catch {
			setToast({
				key: Date.now(),
				message: t("loadFail")
			});
		} finally {
			setLoading(false);
		}
	}, [t]);
	(0, react.useEffect)(() => {
		refresh();
	}, [refresh]);
	const action = (0, react.useCallback)(async (key, path, body) => {
		setBusy(key);
		try {
			await postAction(path, body);
			dropCachedOverview();
			await refresh();
			return true;
		} catch (error) {
			setToast({
				key: Date.now(),
				message: `${t("actionFail")}: ${error instanceof Error ? error.message : String(error)}`
			});
			return false;
		} finally {
			setBusy(void 0);
		}
	}, [refresh, t]);
	const scopeTotals = (0, react.useMemo)(() => {
		if (category === "all") return overview.totals;
		const scoped = overview.suites.filter((suite) => suite.sourceId === category);
		return {
			all: scoped.length,
			installed: scoped.filter((suite) => suite.installed).length,
			enabled: scoped.filter((suite) => suite.enabled).length
		};
	}, [overview, category]);
	const filtered = (0, react.useMemo)(() => {
		const needle = search.trim().toLowerCase();
		return overview.suites.filter((suite) => {
			if (category !== "all" && suite.sourceId !== category) return false;
			if (tab === "installed" && !suite.installed) return false;
			if (tab === "uninstalled" && suite.installed) return false;
			if (needle === "") return true;
			return `${suite.name} ${suite.description ?? ""} ${suite.keywords.join(" ")}`.toLowerCase().includes(needle);
		});
	}, [
		overview,
		search,
		tab,
		category
	]);
	const openUninstall = (0, react.useCallback)((suite) => {
		setConfirm({
			kind: "uninstall",
			sourceId: suite.sourceId,
			suiteId: suite.suiteId
		});
	}, []);
	const confirmAction = (0, react.useCallback)(async () => {
		if (confirm === void 0) return;
		if (confirm.kind === "uninstall" && confirm.suiteId !== void 0) await action(`u:${confirm.suiteId}`, "uninstall", {
			sourceId: confirm.sourceId,
			suiteId: confirm.suiteId
		});
		else if (confirm.kind === "removeSource") {
			await action(`s:${confirm.sourceId}`, "sources/remove", { id: confirm.sourceId });
			if (category === confirm.sourceId) setCategory("all");
		}
		setConfirm(void 0);
	}, [
		confirm,
		action,
		category
	]);
	const selectedSource = category === "all" ? void 0 : overview.sources.find((source) => source.id === category);
	return (0, react.createElement)(ErrorBoundary, {
		fallback: (error) => (0, react.createElement)("div", { className: market_module_default.empty }, `${t("actionFail")}: ${error.message}`),
		children: (0, react.createElement)("div", { className: mode === "page" ? `${market_module_default.market} ${market_module_default.pageMode}` : market_module_default.market }, (0, react.createElement)("header", { className: market_module_default.header }, (0, react.createElement)("div", { className: market_module_default.titleRow }, (0, react.createElement)("h2", { className: market_module_default.title }, t("nav")), (0, react.createElement)("div", { className: market_module_default.spacer }), (0, react.createElement)("div", { className: market_module_default.searchGroup }, (0, react.createElement)(_deepseek_ai_dsh_client_ui_primitives.Button, {
			variant: "ghost",
			size: "sm",
			title: t("addSource"),
			onClick: () => setEditor({ mode: "add" })
		}, "＋"), (0, react.createElement)(_deepseek_ai_dsh_client_ui_primitives.Button, {
			variant: "ghost",
			size: "sm",
			title: t("refreshAll"),
			onClick: () => {
				action("s:refresh:all", "sources/refresh", {});
			}
		}, "↻"))), (0, react.createElement)("div", { className: market_module_default.marketControls }, (0, react.createElement)("div", { className: market_module_default.sourceTabsRow }, (0, react.createElement)("div", { className: market_module_default.sourceTabsScroll }, (0, react.createElement)(SourceTab, {
			key: "__all__",
			t,
			active: category === "all",
			label: `${t("tabAll")} ${overview.totals.all}`,
			onSelect: () => setCategory("all")
		}), ...[...overview.sources].sort((a, b) => a.id.localeCompare(b.id)).map((source) => (0, react.createElement)(SourceTab, {
			key: source.id,
			t,
			active: category === source.id,
			label: `${source.id}${source.local === true ? ` · ${t("sourceLocal")}` : ""} ${source.suiteIds.length}${source.cloned === false ? " ⚠" : ""}`,
			onSelect: () => setCategory(source.id),
			onDelete: () => setConfirm({
				kind: "removeSource",
				sourceId: source.id
			}),
			onEdit: selectedSource?.id === source.id ? () => setEditor({
				mode: "edit",
				source
			}) : void 0
		})))), (0, react.createElement)(SearchFilterToolbar, {
			search,
			searchLabel: t("searchPh"),
			searchPlaceholder: t("searchPh"),
			onSearchChange: setSearch,
			filters: [
				{
					id: "all",
					label: t("tabAll"),
					count: scopeTotals.all,
					icon: (0, react.createElement)(StatusIcon, { kind: "all" }),
					active: tab === "all",
					onSelect: () => setTab("all")
				},
				{
					id: "installed",
					label: t("tabInstalled"),
					count: scopeTotals.installed,
					icon: (0, react.createElement)(StatusIcon, { kind: "installed" }),
					active: tab === "installed",
					onSelect: () => setTab("installed")
				},
				{
					id: "uninstalled",
					label: t("tabUninstalled"),
					count: scopeTotals.all - scopeTotals.installed,
					icon: (0, react.createElement)(StatusIcon, { kind: "uninstalled" }),
					active: tab === "uninstalled",
					onSelect: () => setTab("uninstalled")
				}
			],
			view,
			gridLabel: t("grid"),
			listLabel: t("list"),
			onViewChange: (nextView) => setView(nextView)
		}))), (0, react.createElement)("main", { className: view === "grid" ? market_module_default.grid : market_module_default.list }, loading ? (0, react.createElement)("div", { className: market_module_default.empty }, t("loading")) : filtered.length === 0 ? (0, react.createElement)("div", { className: market_module_default.empty }, tab === "installed" ? t("installedEmpty") : t("empty")) : filtered.map((suite) => (0, react.createElement)(SuiteCard, {
			key: `${suite.sourceId}/${suite.suiteId}`,
			t,
			suite,
			busy: busy !== void 0,
			onOpen: () => setDetail({
				sourceId: suite.sourceId,
				suiteId: suite.suiteId
			}),
			onInstall: () => {
				action(`i:${suite.suiteId}`, "install", {
					sourceId: suite.sourceId,
					suiteId: suite.suiteId
				});
			},
			onAddSource: () => {
				if (suite.remoteUrl !== void 0) action(`a:${suite.suiteId}`, "sources/add", { url: suite.remoteUrl });
			},
			onToggle: () => {
				action(`e:${suite.suiteId}`, "set-enabled", {
					sourceId: suite.sourceId,
					suiteId: suite.suiteId,
					enabled: !suite.enabled
				});
			},
			onRefresh: () => {
				action(`r:${suite.suiteId}`, "sources/refresh", { id: suite.sourceId });
			},
			onUninstall: () => openUninstall(suite)
		}))), toast === void 0 ? null : (0, react.createElement)(_deepseek_ai_dsh_client_ui_primitives.Toast, {
			key: toast.key,
			text: toast.message,
			onDone: () => setToast(void 0)
		}), confirm === void 0 ? null : (0, react.createElement)(_deepseek_ai_dsh_client_ui_primitives.Modal, {
			open: true,
			onClose: () => setConfirm(void 0),
			title: confirm.kind === "uninstall" ? t("uninstallConfirmTitle") : interpolate(t("removeSourceConfirmTitle", { sourceId: confirm.sourceId }), { sourceId: confirm.sourceId }),
			closeLabel: t("cancel"),
			description: confirm.kind === "uninstall" ? t("uninstallConfirmDesc") : t("removeSourceConfirmDesc"),
			footer: (0, react.createElement)("div", { className: market_module_default.modalFooter }, (0, react.createElement)(_deepseek_ai_dsh_client_ui_primitives.Button, {
				variant: "ghost",
				onClick: () => setConfirm(void 0)
			}, t("cancel")), (0, react.createElement)(_deepseek_ai_dsh_client_ui_primitives.Button, {
				variant: "primary",
				onClick: () => {
					confirmAction();
				}
			}, t("confirmDelete")))
		}), detail === void 0 ? null : (0, react.createElement)(SuiteDetailModal, {
			t,
			sourceId: detail.sourceId,
			suiteId: detail.suiteId,
			onClose: () => setDetail(void 0)
		}), editor === void 0 ? null : (0, react.createElement)(SourceEditorModal, {
			t,
			editor,
			busy: busy !== void 0,
			progress,
			onClose: () => setEditor(void 0),
			onSave: async (url, branch, local) => {
				const key = editor.mode === "edit" ? `s:edit:${editor.source.id}` : `s:add:${url}`;
				const body = {
					url,
					...branch === "" ? {} : { branch },
					local
				};
				if (editor.mode === "add") {
					setBusy(key);
					setProgress({
						step: t("progressStarting"),
						error: void 0
					});
					const poll = startProgressPolling(setProgress);
					try {
						const derived = (await postAction("sources/add", body))["source"]?.id;
						dropCachedOverview();
						await refresh();
						setEditor(void 0);
						if (derived !== void 0) setCategory(derived);
						return true;
					} catch (error) {
						setToast({
							key: Date.now(),
							message: `${t("actionFail")}: ${error instanceof Error ? error.message : String(error)}`
						});
						setProgress({
							step: void 0,
							error: error instanceof Error ? error.message : String(error)
						});
						return false;
					} finally {
						poll.stop();
						setBusy(void 0);
					}
				}
				const ok = await action(key, "sources/update", {
					id: editor.source.id,
					...body
				});
				if (ok) setEditor(void 0);
				return ok;
			},
			onRemove: async (id) => {
				setConfirm({
					kind: "removeSource",
					sourceId: id
				});
				setEditor(void 0);
			}
		}))
	});
}
function StatusIcon({ kind }) {
	const common = {
		width: 16,
		height: 16,
		viewBox: "0 0 16 16",
		fill: "none",
		"aria-hidden": true
	};
	if (kind === "installed") return (0, react.createElement)("svg", common, (0, react.createElement)("circle", {
		cx: 8,
		cy: 8,
		r: 5.5
	}), (0, react.createElement)("path", { d: "m5.5 8 1.7 1.7 3.4-3.4" }));
	if (kind === "uninstalled") return (0, react.createElement)("svg", common, (0, react.createElement)("path", { d: "M8 2v8m-3-3 3 3 3-3M3 13h10" }));
	return (0, react.createElement)("svg", common, (0, react.createElement)("path", { d: "M2.5 5 8 2.5 13.5 5 8 7.5 2.5 5Zm0 3L8 10.5 13.5 8M2.5 11 8 13.5 13.5 11" }));
}
/** A source tab with a trailing delete control (deletion confirms at the section level). */
function SourceTab(props) {
	const { t, active = false, label, onSelect, onDelete, onEdit } = props;
	return (0, react.createElement)("div", { className: active ? market_module_default.srcTabOn : market_module_default.srcTab }, (0, react.createElement)("button", {
		type: "button",
		className: market_module_default.srcTabMain,
		onClick: onSelect
	}, label), onEdit === void 0 ? null : (0, react.createElement)("button", {
		type: "button",
		className: market_module_default.srcTabEdit,
		title: t("editSource"),
		onClick: (event) => {
			event.stopPropagation();
			onEdit();
		}
	}, "✎"), onDelete === void 0 ? null : (0, react.createElement)("button", {
		type: "button",
		className: market_module_default.srcTabDel,
		title: t("remove"),
		onClick: (event) => {
			event.stopPropagation();
			onDelete();
		}
	}, "×"));
}
function SourceEditorModal(props) {
	const { t, editor } = props;
	const [local, setLocal] = (0, react.useState)(editor.mode === "edit" && editor.source.local === true);
	const [url, setUrl] = (0, react.useState)(editor.mode === "edit" ? editor.source.url : "");
	const [branch, setBranch] = (0, react.useState)(editor.mode === "edit" ? editor.source.branch ?? "" : "");
	const id = editor.mode === "edit" ? editor.source.id : "";
	const title = editor.mode === "edit" ? t("editSourceTitle") : t("addSourceTitle");
	return (0, react.createElement)(_deepseek_ai_dsh_client_ui_primitives.Modal, {
		open: true,
		onClose: props.onClose,
		title,
		description: t("editorHint"),
		closeLabel: t("cancel"),
		className: market_module_default.editorDialog,
		footer: (0, react.createElement)("div", { className: market_module_default.modalFooter }, (0, react.createElement)("div", { className: market_module_default.modalFooterLeft }, editor.mode === "edit" ? (0, react.createElement)(_deepseek_ai_dsh_client_ui_primitives.Button, {
			variant: "ghost",
			onClick: () => props.onRemove(id)
		}, `🗑 ${t("remove")}`) : null), (0, react.createElement)(_deepseek_ai_dsh_client_ui_primitives.Button, {
			variant: "ghost",
			onClick: props.onClose
		}, t("cancel")), (0, react.createElement)(_deepseek_ai_dsh_client_ui_primitives.Button, {
			variant: "primary",
			disabled: props.busy,
			onClick: () => {
				props.onSave(url.trim(), branch.trim(), local);
			}
		}, t("save"))),
		children: (0, react.createElement)("div", { className: market_module_default.editorForm }, (0, react.createElement)("div", { className: market_module_default.modeRow }, (0, react.createElement)("button", {
			type: "button",
			className: local ? market_module_default.seg : market_module_default.segOn,
			onClick: () => setLocal(false)
		}, t("sourceModeGit")), (0, react.createElement)("button", {
			type: "button",
			className: local ? market_module_default.segOn : market_module_default.seg,
			onClick: () => setLocal(true)
		}, t("sourceModeLocal"))), editor.mode === "edit" ? (0, react.createElement)("div", { className: market_module_default.fieldGroup }, (0, react.createElement)("label", { className: market_module_default.fieldLabel }, t("sourceIdPh")), (0, react.createElement)("div", { className: market_module_default.staticId }, (0, react.createElement)("span", { className: market_module_default.staticIdValue }, id), (0, react.createElement)("span", { className: market_module_default.fieldHint }, t("idFixed")))) : null, (0, react.createElement)("div", { className: market_module_default.fieldGroup }, (0, react.createElement)("label", { className: market_module_default.fieldLabel }, local ? t("sourceUrlLocalPh") : t("sourceUrlPh")), (0, react.createElement)(_deepseek_ai_dsh_client_ui_primitives.Input, {
			placeholder: local ? t("sourceUrlLocalPh") : t("sourceUrlPh"),
			value: url,
			onChange: (event) => setUrl(event.target.value)
		}), (0, react.createElement)("span", { className: market_module_default.fieldHint }, local ? t("urlLocalHint") : t("urlGitHint"))), local ? null : (0, react.createElement)("div", { className: market_module_default.fieldGroup }, (0, react.createElement)("label", { className: market_module_default.fieldLabel }, t("branchPh")), (0, react.createElement)(_deepseek_ai_dsh_client_ui_primitives.Input, {
			placeholder: t("branchPh"),
			value: branch,
			onChange: (event) => setBranch(event.target.value)
		}), (0, react.createElement)("span", { className: market_module_default.fieldHint }, t("branchHint"))), props.progress.error === void 0 && props.progress.step === void 0 ? null : (0, react.createElement)("div", { className: props.progress.error === void 0 ? market_module_default.progress : market_module_default.progressError }, props.progress.error === void 0 ? (0, react.createElement)("span", { className: market_module_default.progressSpin }) : (0, react.createElement)("span", { className: market_module_default.progressFail }, "✕"), (0, react.createElement)("span", { className: market_module_default.progressText }, props.progress.error === void 0 ? props.progress.step : `${t("actionFail")}: ${props.progress.error}`)))
	});
}
/** A green/gray switch control for suite enable state. */
function ToggleSwitch(props) {
	return (0, react.createElement)("button", {
		type: "button",
		role: "switch",
		"aria-checked": props.on,
		title: props.title,
		disabled: props.disabled,
		className: props.on ? market_module_default.switchOn : market_module_default.switchOff,
		onClick: (event) => {
			event.stopPropagation();
			props.onChange();
		}
	}, (0, react.createElement)("span", { className: market_module_default.switchThumb }));
}
function SuiteCard(props) {
	const { t, suite, busy } = props;
	const tags = [
		[t("surfaceSkills"), suite.surfaces.skills],
		[t("surfaceMcp"), suite.surfaces.mcp],
		[t("surfaceHooks"), suite.surfaces.hooks],
		[t("surfaceCommands"), suite.surfaces.commands],
		[t("surfaceAgents"), suite.surfaces.agents],
		[t("surfaceLsp"), suite.surfaces.lsp]
	].filter(([, count]) => count > 0);
	const layoutLabel = suite.layout === "agent-plugin-v1" ? t("layoutV1") : suite.layout === "claude-code" ? t("layoutCC") : suite.layout === "codex" ? t("layoutCodex") : suite.layout === "universal" ? t("layoutUniversal") : suite.layout === "cursor" ? t("layoutCursor") : suite.layout === "kimi" ? t("layoutKimi") : suite.layout === "remote" ? t("layoutRemote") : t("layoutSkills");
	const isRemote = suite.remoteUrl !== void 0;
	const stop = (callback) => (event) => {
		event.stopPropagation();
		callback();
	};
	return (0, react.createElement)("article", {
		className: market_module_default.card,
		onClick: props.onOpen
	}, (0, react.createElement)("div", { className: market_module_default.cardTop }, (0, react.createElement)("div", { className: market_module_default.cardTitle }, (0, react.createElement)("span", { className: market_module_default.cardName }, suite.name), suite.version === void 0 ? null : (0, react.createElement)("span", { className: market_module_default.version }, `v${suite.version}`)), (0, react.createElement)("div", { className: market_module_default.cardActions }, suite.installed ? (0, react.createElement)(ToggleSwitch, {
		on: suite.enabled,
		disabled: busy,
		title: suite.enabled ? t("disable") : t("enable"),
		onChange: props.onToggle
	}) : isRemote ? (0, react.createElement)(_deepseek_ai_dsh_client_ui_primitives.Button, {
		variant: "primary",
		size: "sm",
		disabled: busy,
		title: suite.remoteUrl,
		onClick: stop(props.onAddSource)
	}, t("addSource")) : (0, react.createElement)(_deepseek_ai_dsh_client_ui_primitives.Button, {
		variant: "primary",
		size: "sm",
		disabled: busy,
		onClick: stop(props.onInstall)
	}, t("install")), suite.installed ? (0, react.createElement)(_deepseek_ai_dsh_client_ui_primitives.Button, {
		variant: "ghost",
		size: "sm",
		title: t("refresh"),
		disabled: busy,
		onClick: stop(props.onRefresh)
	}, "↻") : null, suite.installed ? (0, react.createElement)(_deepseek_ai_dsh_client_ui_primitives.Button, {
		variant: "ghost",
		size: "sm",
		title: t("uninstall"),
		disabled: busy,
		onClick: stop(props.onUninstall)
	}, "🗑") : null)), (0, react.createElement)("p", { className: market_module_default.desc }, suite.description ?? ""), (0, react.createElement)("div", { className: market_module_default.meta }, (0, react.createElement)("span", { className: market_module_default.src }, `${suite.sourceId} · ${isRemote ? t("remoteRef") : suite.dimension === "user" ? t("dimensionUser") : t("dimensionProject")}`), (0, react.createElement)("span", { className: market_module_default.tag }, layoutLabel), suite.installed ? (0, react.createElement)("span", { className: suite.enabled ? market_module_default.okState : market_module_default.tag }, suite.enabled ? `✓ ${t("installedBadge")}` : t("installedBadge")) : null, ...tags.map(([label, count]) => (0, react.createElement)("span", {
		key: label,
		className: market_module_default.tag
	}, `${label} ${count}`)), suite.errors.length === 0 ? null : (0, react.createElement)(_deepseek_ai_dsh_client_ui_primitives.Tooltip, {
		label: suite.errors.slice(0, 8).join(t("sourceErrorSeparator")),
		children: (0, react.createElement)("span", { className: market_module_default.warnLine }, `⚠ ${t("errors")} ${suite.errors.length}`)
	}), (suite.mcpErrors?.length ?? 0) === 0 ? null : (0, react.createElement)(_deepseek_ai_dsh_client_ui_primitives.Tooltip, {
		label: suite.mcpErrors.slice(0, 8).join(t("sourceErrorSeparator")),
		children: (0, react.createElement)("span", { className: market_module_default.warnLine }, `⚠ ${t("mcpSection")} ${suite.mcpErrors.length}`)
	})));
}
//#endregion
//#region src/client/mcp-status.module.css
var mcp_status_module_default = {
	"boundary": "--KJaG_boundary",
	"card": "--KJaG_card",
	"cardReason": "--KJaG_cardReason",
	"cardTop": "--KJaG_cardTop",
	"chevron": "--KJaG_chevron",
	"config": "--KJaG_config",
	"detail": "--KJaG_detail",
	"detailBody": "--KJaG_detailBody",
	"detailDialog": "--KJaG_detailDialog",
	"detailEmpty": "--KJaG_detailEmpty",
	"detailHead": "--KJaG_detailHead",
	"detailMeta": "--KJaG_detailMeta",
	"detailSection": "--KJaG_detailSection",
	"detailState": "--KJaG_detailState",
	"detailStateconnected": "--KJaG_detailStateconnected",
	"detailStatedegraded": "--KJaG_detailStatedegraded",
	"detailStatedisabled": "--KJaG_detailStatedisabled",
	"detailStatefailed": "--KJaG_detailStatefailed",
	"empty": "--KJaG_empty",
	"endpoint": "--KJaG_endpoint",
	"error": "--KJaG_error",
	"errorSummary": "--KJaG_errorSummary",
	"grid": "--KJaG_grid",
	"header": "--KJaG_header",
	"headerActions": "--KJaG_headerActions",
	"list": "--KJaG_list",
	"meta": "--KJaG_meta",
	"modalFooter": "--KJaG_modalFooter",
	"name": "--KJaG_name",
	"reason": "--KJaG_reason",
	"service": "--KJaG_service",
	"sourceDirect": "--KJaG_sourceDirect",
	"sourcePlugin": "--KJaG_sourcePlugin",
	"state": "--KJaG_state",
	"stateconnected": "--KJaG_stateconnected",
	"statedegraded": "--KJaG_statedegraded",
	"statedisabled": "--KJaG_statedisabled",
	"statefailed": "--KJaG_statefailed",
	"statusconnected": "--KJaG_statusconnected",
	"statusdegraded": "--KJaG_statusdegraded",
	"statusdisabled": "--KJaG_statusdisabled",
	"statusDot": "--KJaG_statusDot",
	"statusfailed": "--KJaG_statusfailed",
	"subtitle": "--KJaG_subtitle",
	"summary": "--KJaG_summary",
	"summaryDotGreen": "--KJaG_summaryDotGreen",
	"summaryDotRed": "--KJaG_summaryDotRed",
	"surface": "--KJaG_surface",
	"title": "--KJaG_title",
	"tool": "--KJaG_tool",
	"toolbar": "--KJaG_toolbar",
	"toolCount": "--KJaG_toolCount",
	"toolDescription": "--KJaG_toolDescription",
	"toolIndex": "--KJaG_toolIndex",
	"toolList": "--KJaG_toolList",
	"toolName": "--KJaG_toolName",
	"transport": "--KJaG_transport"
};
//#endregion
//#region src/client/McpStatusPanel.tsx
const EMPTY_STATUS = {
	entries: [],
	observedAt: "",
	totals: {
		all: 0,
		connected: 0,
		degraded: 0,
		failed: 0,
		disabled: 0
	},
	directObservationOnly: true
};
/** DSH-native MCP inventory: click a service card for a standard Modal detail. */
function McpStatusPanel({ t }) {
	const [payload, setPayload] = (0, react.useState)(EMPTY_STATUS);
	const [loading, setLoading] = (0, react.useState)(true);
	const [error, setError] = (0, react.useState)(void 0);
	const [filter, setFilter] = (0, react.useState)("all");
	const [search, setSearch] = (0, react.useState)("");
	const [view, setView] = (0, react.useState)("grid");
	const [selected, setSelected] = (0, react.useState)(void 0);
	const refresh = () => {
		setLoading(true);
		setError(void 0);
		fetchMcpStatus().then(setPayload).catch((caught) => {
			setError(caught instanceof Error ? caught.message : String(caught));
		}).finally(() => setLoading(false));
	};
	(0, react.useEffect)(() => {
		refresh();
	}, []);
	const activeEntries = payload.entries.filter((entry) => entry.state !== "disabled");
	const visibleTotals = {
		all: activeEntries.length,
		connected: activeEntries.filter((entry) => entry.state === "connected").length,
		failed: activeEntries.filter((entry) => entry.state === "failed").length
	};
	const filtered = (0, react.useMemo)(() => {
		const query = search.trim().toLowerCase();
		return activeEntries.filter((entry) => {
			if (filter !== "all" && entry.kind !== filter) return false;
			if (query === "") return true;
			return `${entry.name} ${entry.source ?? ""} ${entry.endpoint ?? ""} ${entry.transport}`.toLowerCase().includes(query);
		});
	}, [
		activeEntries,
		filter,
		search
	]);
	return (0, react.createElement)("div", { className: mcp_status_module_default.surface }, (0, react.createElement)("header", { className: mcp_status_module_default.header }, (0, react.createElement)("div", {}, (0, react.createElement)("h2", { className: mcp_status_module_default.title }, t("mcpStatusTitle"))), (0, react.createElement)("div", { className: mcp_status_module_default.headerActions }, visibleTotals.failed > 0 ? (0, react.createElement)("span", {
		className: mcp_status_module_default.errorSummary,
		title: `${visibleTotals.failed} ${t("mcpFailed")}`
	}, (0, react.createElement)("span", { className: mcp_status_module_default.summaryDotRed }), visibleTotals.failed) : null, (0, react.createElement)(_deepseek_ai_dsh_client_ui_primitives.Button, {
		variant: "ghost",
		size: "sm",
		onClick: refresh,
		disabled: loading,
		title: t("refresh")
	}, "↻"))), (0, react.createElement)(SearchFilterToolbar, {
		className: mcp_status_module_default.toolbar,
		search,
		searchLabel: t("mcpSearch"),
		searchPlaceholder: t("mcpSearch"),
		onSearchChange: setSearch,
		filters: [
			"all",
			"plugin",
			"direct"
		].map((kind) => ({
			id: kind,
			label: filterLabel(t, kind),
			count: kind === "all" ? visibleTotals.all : activeEntries.filter((entry) => entry.kind === kind).length,
			icon: (0, react.createElement)(McpFilterIcon, { kind }),
			active: filter === kind,
			onSelect: () => setFilter(kind)
		})),
		view,
		gridLabel: t("grid"),
		listLabel: t("list"),
		onViewChange: (nextView) => setView(nextView)
	}), error !== void 0 ? (0, react.createElement)("div", { className: mcp_status_module_default.error }, error, (0, react.createElement)(_deepseek_ai_dsh_client_ui_primitives.Button, {
		variant: "ghost",
		size: "sm",
		onClick: refresh
	}, t("mcpRetry"))) : loading && activeEntries.length === 0 ? (0, react.createElement)("div", { className: mcp_status_module_default.empty }, t("loading")) : filtered.length === 0 ? (0, react.createElement)("div", { className: mcp_status_module_default.empty }, t("mcpEmpty")) : (0, react.createElement)("div", { className: view === "grid" ? mcp_status_module_default.grid : mcp_status_module_default.list }, filtered.map((entry) => (0, react.createElement)(McpCard, {
		key: entry.id,
		entry,
		t,
		onClick: () => setSelected(entry)
	}))), selected === void 0 ? null : (0, react.createElement)(McpDetailModal, {
		entry: selected,
		t,
		onClose: () => setSelected(void 0)
	}));
}
function McpCard({ entry, t, onClick }) {
	return (0, react.createElement)("button", {
		type: "button",
		className: mcp_status_module_default.card,
		onClick
	}, (0, react.createElement)("div", { className: mcp_status_module_default.cardTop }, (0, react.createElement)("span", {
		className: `${mcp_status_module_default.statusDot} ${mcp_status_module_default[`status${entry.state}`]}`,
		title: stateLabel(t, entry.state),
		"aria-label": stateLabel(t, entry.state)
	}), (0, react.createElement)("span", { className: mcp_status_module_default.service }, (0, react.createElement)("span", { className: mcp_status_module_default.name }, entry.name)), (0, react.createElement)("span", { className: mcp_status_module_default.toolCount }, `${t("mcpTools")} ${entry.tools.length}`)), (0, react.createElement)("p", { className: mcp_status_module_default.endpoint }, entry.endpoint ?? t("mcpObservedEndpoint")), (0, react.createElement)("div", { className: mcp_status_module_default.meta }, (0, react.createElement)(McpSourceBadge, {
		kind: entry.kind,
		label: entry.kind === "plugin" ? entry.source ?? "—" : t("mcpDirect"),
		t
	}), (0, react.createElement)("span", { className: mcp_status_module_default.transport }, entry.transport)), entry.reason === void 0 ? null : (0, react.createElement)("p", { className: mcp_status_module_default.cardReason }, entry.reason));
}
function McpSourceBadge({ kind, label, t }) {
	return (0, react.createElement)("span", { className: kind === "plugin" ? mcp_status_module_default.sourcePlugin : mcp_status_module_default.sourceDirect }, (0, react.createElement)(McpSourceIcon, { kind }), (0, react.createElement)("span", {}, kind === "plugin" ? label : t("mcpDirect")));
}
function McpSourceIcon({ kind }) {
	const common = {
		width: 16,
		height: 16,
		viewBox: "0 0 16 16",
		fill: "none",
		"aria-hidden": true
	};
	return kind === "plugin" ? (0, react.createElement)("svg", common, (0, react.createElement)("path", { d: "M6 2.5v2H4A1.5 1.5 0 0 0 2.5 6v2h2a1.5 1.5 0 1 1 0 3h-2v2A1.5 1.5 0 0 0 4 14.5h2v-2a1.5 1.5 0 1 1 3 0v2h2a1.5 1.5 0 0 0 1.5-1.5v-2h-2a1.5 1.5 0 1 1 0-3h2V6A1.5 1.5 0 0 0 11 4.5H9v-2a1.5 1.5 0 1 0-3 0Z" })) : (0, react.createElement)("svg", common, (0, react.createElement)("circle", {
		cx: 8,
		cy: 5,
		r: 2.2
	}), (0, react.createElement)("path", { d: "M3.5 13c.6-2.2 2.1-3.3 4.5-3.3s3.9 1.1 4.5 3.3" }));
}
function McpFilterIcon({ kind }) {
	if (kind === "plugin") return (0, react.createElement)(McpSourceIcon, { kind: "plugin" });
	if (kind === "direct") return (0, react.createElement)(McpSourceIcon, { kind: "direct" });
	return (0, react.createElement)("svg", {
		width: 16,
		height: 16,
		viewBox: "0 0 16 16",
		fill: "none",
		"aria-hidden": true
	}, (0, react.createElement)("path", { d: "M2.5 5 8 2.5 13.5 5 8 7.5 2.5 5Zm0 3L8 10.5 13.5 8M2.5 11 8 13.5 13.5 11" }));
}
function McpDetailModal({ entry, t, onClose }) {
	return (0, react.createElement)(_deepseek_ai_dsh_client_ui_primitives.Modal, {
		open: true,
		onClose,
		title: entry.name,
		description: t("mcpServiceDetail"),
		closeLabel: t("cancel"),
		className: mcp_status_module_default.detailDialog,
		contentClassName: mcp_status_module_default.detailBody,
		footer: (0, react.createElement)("div", { className: mcp_status_module_default.modalFooter }, (0, react.createElement)(_deepseek_ai_dsh_client_ui_primitives.Button, {
			variant: "ghost",
			onClick: onClose
		}, t("cancel"))),
		children: (0, react.createElement)("div", { className: mcp_status_module_default.detail }, (0, react.createElement)("div", { className: mcp_status_module_default.detailMeta }, (0, react.createElement)(McpSourceBadge, {
			kind: entry.kind,
			label: entry.kind === "plugin" ? entry.source ?? "—" : t("mcpDirect"),
			t
		}), (0, react.createElement)("span", { className: mcp_status_module_default.transport }, entry.transport), (0, react.createElement)("span", { className: `${mcp_status_module_default.state} ${mcp_status_module_default[`state${entry.state}`]}` }, stateLabel(t, entry.state))), entry.reason === void 0 ? null : (0, react.createElement)("div", { className: mcp_status_module_default.reason }, entry.reason), (0, react.createElement)("section", { className: mcp_status_module_default.detailSection }, (0, react.createElement)("h4", { className: mcp_status_module_default.detailHead }, t("mcpConfig")), entry.config === void 0 ? (0, react.createElement)("div", { className: mcp_status_module_default.detailEmpty }, t("mcpDirectConfigUnavailable")) : (0, react.createElement)("pre", { className: mcp_status_module_default.config }, JSON.stringify(entry.config, null, 2))), (0, react.createElement)("section", { className: mcp_status_module_default.detailSection }, (0, react.createElement)("h4", { className: mcp_status_module_default.detailHead }, `${t("mcpTools")} (${entry.tools.length})`), entry.tools.length === 0 ? (0, react.createElement)("div", { className: mcp_status_module_default.detailEmpty }, t("mcpNoTools")) : (0, react.createElement)("div", { className: mcp_status_module_default.toolList }, entry.tools.map((tool, index) => (0, react.createElement)("div", {
			key: tool.name,
			className: mcp_status_module_default.tool
		}, (0, react.createElement)("span", { className: mcp_status_module_default.toolIndex }, String(index + 1).padStart(2, "0")), (0, react.createElement)("span", { className: mcp_status_module_default.toolName }, tool.name), (0, react.createElement)("span", { className: mcp_status_module_default.toolDescription }, tool.description ?? ""))))))
	});
}
function filterLabel(t, kind) {
	if (kind === "plugin") return t("mcpPlugin");
	if (kind === "direct") return t("mcpDirect");
	return t("mcpAll");
}
function stateLabel(t, state) {
	if (state === "connected") return t("mcpConnected");
	if (state === "degraded") return t("mcpDegraded");
	if (state === "failed") return t("mcpFailed");
	return t("mcpDisabled");
}
//#endregion
//#region src/client/page-mode-selection.ts
/** Pure capability decision for the legacy page-mode fallback. */
/**
* Use the DOM page fallback only when the host has no settings page and does
* expose a page shell for the fallback to mount into.
*
* @param settingsSurfaceAvailable - whether `settings.section` is live.
* @param pageShellAvailable - whether the sidebar/conversation shell exists.
* @returns true when the fallback is the only available market surface.
*/
function shouldUseLegacyPageMode(settingsSurfaceAvailable, pageShellAvailable) {
	return !settingsSurfaceAvailable && pageShellAvailable;
}
//#endregion
//#region src/client/page-mode.tsx
/**
* Legacy Web page-mode adapter.
*
* Current DSH compositions expose `settings.section`; older compositions that
* predate that slot can still host a top-level market panel through the DOM
* shell used by the original page-mode integration. The adapter is deliberately
* guarded by the live settings-slot state so one composition never renders two
* market surfaces.
*/
const ACTIVE_ATTRIBUTE = "data-dsh-agent-plugins-market-page";
const VIEW_ATTRIBUTE = "data-dsh-agent-plugins-market-page-view";
const ENTRY_ATTRIBUTE = "data-dsh-agent-plugins-market-entry";
const SURFACE_EVENT = "dsh-agent-plugins-market-settings-surface";
const PANEL_EVENT = "dsh-panel-activate";
const PANEL_NAME = "agent-plugins-market";
/** Notify the page adapter that the settings-slot capability changed. */
const LEGACY_PAGE_MODE_SURFACE_EVENT = SURFACE_EVENT;
const SIDEBAR_COLUMN_SELECTOR = "[data-pane=\"sidebar\"], [class*=\"sidebarCol\"]";
const CONVERSATION_COLUMN_SELECTOR = "[data-pane=\"conversation\"], [class*=\"centerCol\"]";
const SIDEBAR_CONTEXT_SELECTOR = "[class*=\"sessionRow\"], [class*=\"projectRow\"], [class*=\"searchResultRow\"], [class*=\"searchResultWorkspace\"], [class*=\"newSession\"]";
/**
* Mount the page-mode fallback and its sidebar entry.
*
* The fallback remains dormant when the settings surface is present. It also
* remains a no-op in non-browser runtimes or shells that expose neither the
* sidebar nor the conversation column.
*
* @param options - page-mode dependencies and host capability probe.
* @returns disposer that removes the injected entry, panel, listeners, and
* active document marker.
*/
function mountLegacyPageMode(options) {
	if (typeof document === "undefined" || typeof MutationObserver === "undefined") return () => {};
	let stopped = false;
	let open = false;
	let root;
	let container;
	let entry;
	let entryLabel;
	let observer;
	const setActive = (next) => {
		open = next;
		if (open && !options.isSettingsSurfaceAvailable()) {
			document.documentElement.setAttribute(ACTIVE_ATTRIBUTE, "");
			document.dispatchEvent(new CustomEvent(PANEL_EVENT, { detail: PANEL_NAME }));
		} else document.documentElement.removeAttribute(ACTIVE_ATTRIBUTE);
	};
	const removeView = () => {
		setActive(false);
		root?.unmount();
		root = void 0;
		container?.remove();
		container = void 0;
	};
	const renderView = () => {
		if (root === void 0) return;
		root.render((0, react.createElement)(MarketSection, {
			t: options.t,
			mode: "page"
		}));
	};
	const updateEntryCopy = () => {
		if (entryLabel === void 0 || entry === void 0) return;
		const label = options.t("nav");
		entryLabel.textContent = label;
		entry.title = label;
		entry.setAttribute("aria-label", label);
	};
	const ensureView = () => {
		if (stopped || options.isSettingsSurfaceAvailable()) {
			removeView();
			return;
		}
		const column = conversationColumn();
		if (!shouldUseLegacyPageMode(options.isSettingsSurfaceAvailable(), column !== void 0)) {
			removeView();
			return;
		}
		if (column === void 0) return;
		if (container !== void 0 && container.isConnected) return;
		root?.unmount();
		container?.remove();
		container = document.createElement("div");
		container.setAttribute(VIEW_ATTRIBUTE, "");
		container.className = market_module_default.pageView;
		column.appendChild(container);
		root = (0, react_dom_client.createRoot)(container);
		renderView();
	};
	const ensureEntry = () => {
		if (stopped || options.isSettingsSurfaceAvailable()) {
			entry?.remove();
			return;
		}
		const rootElement = sidebarRoot();
		const anchor = rootElement === void 0 ? void 0 : newSessionButton(rootElement);
		if (rootElement === void 0 || anchor === void 0 || anchor.parentElement === null) return;
		if (entry === void 0) {
			entry = createEntry(() => {
				setActive(!open);
				ensureView();
			});
			entryLabel = entry.querySelector("[data-dsh-agent-plugins-market-label]") ?? void 0;
			updateEntryCopy();
		}
		if (entry.parentElement !== anchor.parentElement || entry.previousSibling !== anchor) anchor.insertAdjacentElement("afterend", entry);
	};
	const observeShell = () => {
		if (stopped || observer !== void 0 || options.isSettingsSurfaceAvailable()) return;
		observer = new MutationObserver(ensure);
		observer.observe(document.body ?? document.documentElement, {
			childList: true,
			subtree: true
		});
	};
	const stopObservingShell = () => {
		observer?.disconnect();
		observer = void 0;
	};
	const ensure = () => {
		if (stopped) return;
		if (options.isSettingsSurfaceAvailable()) {
			stopObservingShell();
			removeView();
			entry?.remove();
			return;
		}
		observeShell();
		ensureView();
		ensureEntry();
	};
	const onLocale = () => {
		updateEntryCopy();
		renderView();
	};
	const onSurfaceChange = () => {
		ensure();
	};
	const unsubscribeLocale = options.subscribeLocale?.(onLocale);
	const onPanelActivate = (event) => {
		if (event.detail !== PANEL_NAME && open) setActive(false);
	};
	const onSidebarContextClick = (event) => {
		if (!open) return;
		const target = event.target;
		if (!(target instanceof HTMLElement) || target.closest(SIDEBAR_CONTEXT_SELECTOR) === null) return;
		setActive(false);
	};
	document.addEventListener(PANEL_EVENT, onPanelActivate);
	document.addEventListener(SURFACE_EVENT, onSurfaceChange);
	document.addEventListener("click", onSidebarContextClick, true);
	queueMicrotask(ensure);
	return () => {
		stopped = true;
		unsubscribeLocale?.();
		document.removeEventListener(PANEL_EVENT, onPanelActivate);
		document.removeEventListener(SURFACE_EVENT, onSurfaceChange);
		document.removeEventListener("click", onSidebarContextClick, true);
		stopObservingShell();
		entry?.remove();
		removeView();
	};
}
function sidebarRoot() {
	const column = document.querySelector(SIDEBAR_COLUMN_SELECTOR);
	if (column === null) return void 0;
	return column.querySelector("[class*=\"logoRow\"]")?.parentElement ?? column.firstElementChild ?? void 0;
}
function newSessionButton(root) {
	const nested = root.querySelector("button[class*=\"newSession\"]");
	if (nested !== null) return nested;
	for (const child of root.children) if (child instanceof HTMLButtonElement) return child;
}
function conversationColumn() {
	return document.querySelector(CONVERSATION_COLUMN_SELECTOR) ?? void 0;
}
function createEntry(onClick) {
	const button = document.createElement("button");
	button.type = "button";
	button.setAttribute(ENTRY_ATTRIBUTE, "");
	button.className = market_module_default.pageEntry;
	button.innerHTML = "<svg viewBox=\"0 0 16 16\" width=\"14\" height=\"14\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.3\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><rect x=\"2\" y=\"2\" width=\"5\" height=\"5\" rx=\"1\"/><rect x=\"9\" y=\"2\" width=\"5\" height=\"5\" rx=\"1\"/><rect x=\"2\" y=\"9\" width=\"5\" height=\"5\" rx=\"1\"/><rect x=\"9\" y=\"9\" width=\"5\" height=\"5\" rx=\"1\"/></svg>";
	const label = document.createElement("span");
	label.dataset.dshAgentPluginsMarketLabel = "";
	button.append(label);
	button.addEventListener("click", onClick);
	return button;
}
//#endregion
//#region src/client/index.ts
/**
* dsh-agent-plugins-market client: registers the Agent Plugins Market section inside the Web
* GUI's settings page (the same settings.section seat dshmarket uses), with a
* guarded legacy top-level page fallback for older shells. The bundle's
* browser externals are React, ReactDOM, and the injected `dsh.client.inject`
* module table, so it cannot reach packages the host does not serve.
*/
const NS = "dsh-agent-plugins-market";
const name = "dsh-agent-plugins-market";
const inject = ["slots", "locale"];
/** Primitives this section renders with; absent exports degrade the whole section. */
const REQUIRED_PRIMITIVES = [
	"Button",
	"Input",
	"Modal",
	"Toast",
	"Tooltip"
];
/** Detect host primitives that predate the exports this UI relies on. */
function missingPrimitives(module, required = REQUIRED_PRIMITIVES) {
	return required.filter((name) => module[name] === void 0);
}
function apply(ctx) {
	ctx.effect(() => ctx.locale.register(NS, {
		zh,
		en
	}), "dsh-agent-plugins: dictionaries");
	const t = ctx.locale.bind(NS);
	const gaps = missingPrimitives(_deepseek_ai_dsh_client_ui_primitives);
	if (gaps.length > 0) {
		console.warn(`[dsh-agent-plugins-market] host ui-primitives missing ${gaps.join(", ")} — Agent Plugins Market section disabled (dsh web >= 0.1.0-rc.6 required)`);
		return;
	}
	let settingsSurfaceAvailable = false;
	ctx.effect(() => mountLegacyPageMode({
		t,
		isSettingsSurfaceAvailable: () => settingsSurfaceAvailable,
		subscribeLocale: ctx.locale.subscribe === void 0 ? void 0 : (listener) => ctx.locale.subscribe(listener)
	}), "dsh-agent-plugins-market: legacy page mode");
	ctx.slots.inject("settings.section", () => {
		settingsSurfaceAvailable = true;
		notifyPageModeSurfaceChange();
		const marketDispose = ctx.slots.register({
			name: "settings.section",
			id: "agent-plugin",
			order: 45,
			label: () => t("nav"),
			locale: NS,
			inject: () => ({ t })
		}, () => (0, react.createElement)(MarketSection, {
			t,
			mode: "settings"
		}));
		const mcpDispose = ctx.slots.register({
			name: "settings.section",
			id: "mcp-status",
			order: 46,
			label: () => t("mcpStatusNav"),
			locale: NS,
			inject: () => ({ t })
		}, () => (0, react.createElement)(McpStatusPanel, { t }));
		return () => {
			settingsSurfaceAvailable = false;
			notifyPageModeSurfaceChange();
			if (typeof mcpDispose === "function") mcpDispose();
			if (typeof marketDispose === "function") marketDispose();
		};
	});
}
function notifyPageModeSurfaceChange() {
	if (typeof document !== "undefined") document.dispatchEvent(new Event(LEGACY_PAGE_MODE_SURFACE_EVENT));
}
//#endregion
exports.REQUIRED_PRIMITIVES = REQUIRED_PRIMITIVES;
exports.apply = apply;
exports.inject = inject;
exports.missingPrimitives = missingPrimitives;
exports.name = name;

//# sourceMappingURL=client.js.map
		return module.exports;
}
});
