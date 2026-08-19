window.__ModuleLoader__.load({ id: "dsh-agent-plugins-market", factory: (require) => {

		var module = { exports: {} };
		var exports = module.exports;
(function(){if(typeof document!=="undefined"){var s=document.createElement("style");s.setAttribute("data-dsh-client","dsh-agent-plugins-market");s.textContent=".qMtKNa_market {\n  min-width: 0;\n  height: 100%;\n  min-height: 0;\n  color: var(--dsw-alias-label-primary, #1f2328);\n  flex-direction: column;\n  gap: 14px;\n  display: flex;\n}\n\n.qMtKNa_header {\n  flex-direction: column;\n  flex-shrink: 0;\n  gap: 8px;\n  display: flex;\n}\n\n.qMtKNa_titleRow {\n  align-items: center;\n  gap: 12px;\n  display: flex;\n}\n\n.qMtKNa_title {\n  margin: 0;\n  font-size: 16px;\n  font-weight: 600;\n  line-height: 24px;\n}\n\n.qMtKNa_sub {\n  color: var(--dsw-alias-label-tertiary, #8b93a1);\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  flex: 1;\n  align-items: center;\n  gap: 8px;\n  min-width: 0;\n  margin: 0;\n  font-size: 13px;\n  line-height: 20px;\n  display: flex;\n  overflow: hidden;\n}\n\n.qMtKNa_spacer {\n  flex: 1;\n}\n\n.qMtKNa_tabGap {\n  flex-shrink: 0;\n  width: 16px;\n}\n\n.qMtKNa_searchGroup {\n  align-items: center;\n  gap: 2px;\n  display: flex;\n}\n\n.qMtKNa_searchWrap, .qMtKNa_searchInput {\n  align-items: center;\n  display: flex;\n}\n\n.qMtKNa_searchInput input {\n  width: 240px;\n  font-size: 12px;\n  line-height: 20px;\n}\n\n.qMtKNa_tabRow {\n  border-bottom: 1px solid var(--dsw-alias-border-l2, #e5e7eb);\n  justify-content: flex-end;\n  align-items: flex-end;\n  gap: 2px;\n  display: flex;\n}\n\n.qMtKNa_tab, .qMtKNa_tabOn {\n  font: inherit;\n  color: var(--dsw-alias-label-secondary, #6b7280);\n  cursor: pointer;\n  white-space: nowrap;\n  background: none;\n  border: none;\n  border-bottom: 2px solid #0000;\n  padding: 7px 12px;\n  font-size: 13px;\n}\n\n.qMtKNa_tabOn {\n  color: var(--dsw-alias-brand-primary, #4f6ef7);\n  border-bottom-color: var(--dsw-alias-brand-primary, #4f6ef7);\n  font-weight: 600;\n}\n\n.qMtKNa_viewSwitch {\n  font: inherit;\n  color: var(--dsw-alias-label-tertiary, #9ca3af);\n  cursor: pointer;\n  white-space: nowrap;\n  background: none;\n  border: none;\n  border-bottom: 2px solid #0000;\n  padding: 7px 12px;\n  font-size: 13px;\n}\n\n.qMtKNa_viewSwitch:hover {\n  color: var(--dsw-alias-label-primary, #1f2328);\n}\n\n.qMtKNa_body {\n  flex: 1;\n  align-items: flex-start;\n  gap: 20px;\n  min-height: 0;\n  display: flex;\n}\n\n.qMtKNa_sourceTabsRow {\n  padding: 0;\n  display: block;\n}\n\n.qMtKNa_sourceTabsScroll {\n  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));\n  gap: 6px;\n  display: grid;\n}\n\n.qMtKNa_srcTabEdit {\n  font: inherit;\n  color: var(--dsw-alias-label-tertiary, #9ca3af);\n  cursor: pointer;\n  background: none;\n  border: none;\n  flex-shrink: 0;\n  padding: 2px;\n  font-size: 12px;\n  line-height: 18px;\n}\n\n.qMtKNa_srcTabEdit:hover {\n  color: var(--dsw-alias-label-primary, #1f2328);\n}\n\n.qMtKNa_srcTabOn .qMtKNa_srcTabEdit {\n  color: #ffffffd9;\n}\n\n.qMtKNa_srcTabOn .qMtKNa_srcTabEdit:hover {\n  color: #fff;\n}\n\n.qMtKNa_srcTab, .qMtKNa_srcTabOn {\n  border: 1px solid var(--dsw-alias-border-l3, #d9dde3);\n  background: var(--dsw-alias-bg-layer-1, #fff);\n  border-radius: 999px;\n  justify-content: center;\n  align-items: center;\n  width: 100%;\n  height: 24px;\n  display: inline-flex;\n  overflow: hidden;\n}\n\n.qMtKNa_srcTabMain {\n  font: inherit;\n  color: var(--dsw-alias-label-primary, #1f2328);\n  cursor: pointer;\n  white-space: nowrap;\n  text-overflow: ellipsis;\n  background: none;\n  border: none;\n  flex: 1;\n  min-width: 0;\n  padding: 2px 2px 2px 10px;\n  font-size: 12px;\n  line-height: 18px;\n  overflow: hidden;\n}\n\n.qMtKNa_srcTabMain:hover {\n  color: var(--dsw-alias-brand-primary, #4f6ef7);\n}\n\n.qMtKNa_srcTabOn {\n  background: var(--dsw-alias-brand-primary, #4f6ef7);\n  border-color: var(--dsw-alias-brand-primary, #4f6ef7);\n}\n\n.qMtKNa_srcTabOn .qMtKNa_srcTabMain {\n  color: #fff;\n  font-weight: 600;\n}\n\n.qMtKNa_srcTabDel {\n  font: inherit;\n  color: var(--dsw-alias-label-tertiary, #9ca3af);\n  cursor: pointer;\n  background: none;\n  border: none;\n  flex-shrink: 0;\n  padding: 2px 8px 2px 2px;\n  font-size: 12px;\n  line-height: 18px;\n}\n\n.qMtKNa_srcTabDel:hover {\n  color: var(--dsw-alias-state-error-primary, #dc2626);\n}\n\n.qMtKNa_srcTabOn .qMtKNa_srcTabDel {\n  color: #ffffffd9;\n}\n\n.qMtKNa_srcTabOn .qMtKNa_srcTabDel:hover {\n  color: #fff;\n}\n\n.qMtKNa_grid {\n  scrollbar-gutter: stable;\n  flex: 1;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  align-content: start;\n  gap: 12px;\n  min-width: 0;\n  min-height: 0;\n  padding-right: 4px;\n  display: grid;\n  overflow-y: auto;\n}\n\n.qMtKNa_list {\n  scrollbar-gutter: stable;\n  flex-direction: column;\n  flex: 1;\n  gap: 8px;\n  min-width: 0;\n  min-height: 0;\n  padding-right: 4px;\n  display: flex;\n  overflow-y: auto;\n}\n\n.qMtKNa_list .qMtKNa_card {\n  flex-flow: wrap;\n  align-items: center;\n  gap: 8px 14px;\n}\n\n.qMtKNa_list .qMtKNa_cardTop {\n  flex: none;\n}\n\n.qMtKNa_list .qMtKNa_cardDesc {\n  -webkit-line-clamp: 1;\n  flex: 1;\n  min-width: 200px;\n  min-height: 0;\n}\n\n.qMtKNa_list .qMtKNa_cardActions {\n  flex: none;\n}\n\n.qMtKNa_list .qMtKNa_meta {\n  flex-basis: 100%;\n}\n\n.qMtKNa_empty {\n  color: var(--dsw-alias-label-tertiary, #8b93a1);\n  text-align: center;\n  grid-column: 1 / -1;\n  padding: 48px 0;\n  font-size: 13px;\n}\n\n.qMtKNa_card {\n  background: var(--dsw-alias-bg-layer-1, #fff);\n  border: 1px solid var(--dsw-alias-border-l2, #e5e7eb);\n  border-radius: 12px;\n  flex-direction: column;\n  gap: 8px;\n  min-width: 0;\n  padding: 12px 14px;\n  display: flex;\n}\n\n.qMtKNa_cardTop {\n  align-items: center;\n  gap: 8px;\n  display: flex;\n}\n\n.qMtKNa_cardTitle {\n  flex: 1;\n  align-items: center;\n  gap: 8px;\n  min-width: 0;\n  display: flex;\n}\n\n.qMtKNa_cardName {\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  font-size: 13px;\n  font-weight: 600;\n  line-height: 22px;\n  overflow: hidden;\n}\n\n.qMtKNa_version {\n  color: var(--dsw-alias-label-tertiary, #8b93a1);\n  font-variant-numeric: tabular-nums;\n  flex-shrink: 0;\n  font-size: 12px;\n  line-height: 20px;\n}\n\n.qMtKNa_cardActions {\n  flex-shrink: 0;\n  align-items: center;\n  gap: 4px;\n  display: flex;\n}\n\n.qMtKNa_switchOn, .qMtKNa_switchOff {\n  cursor: pointer;\n  border: none;\n  border-radius: 999px;\n  flex-shrink: 0;\n  width: 38px;\n  height: 22px;\n  padding: 0;\n  transition: background-color .15s;\n  position: relative;\n}\n\n.qMtKNa_switchOn {\n  background: var(--dsw-alias-state-success-primary, #22c55e);\n}\n\n.qMtKNa_switchOff {\n  background: var(--dsw-alias-state-neutral, #d1d5db);\n}\n\n.qMtKNa_switchOn:disabled, .qMtKNa_switchOff:disabled {\n  opacity: .6;\n  cursor: default;\n}\n\n.qMtKNa_switchThumb {\n  pointer-events: none;\n  background: #fff;\n  border-radius: 50%;\n  width: 16px;\n  height: 16px;\n  transition: left .15s;\n  position: absolute;\n  top: 3px;\n  left: 3px;\n  box-shadow: 0 1px 2px #0003;\n}\n\n.qMtKNa_switchOn .qMtKNa_switchThumb {\n  left: 19px;\n}\n\n.qMtKNa_desc {\n  color: var(--dsw-alias-label-tertiary, #8b93a1);\n  -webkit-line-clamp: 2;\n  -webkit-box-orient: vertical;\n  min-height: 36px;\n  margin: 0;\n  font-size: 12px;\n  line-height: 18px;\n  display: -webkit-box;\n  overflow: hidden;\n}\n\n.qMtKNa_meta {\n  flex-wrap: wrap;\n  align-items: center;\n  gap: 6px;\n  display: flex;\n}\n\n.qMtKNa_src {\n  color: var(--dsw-alias-label-secondary, #9ca3af);\n  font-size: 12px;\n  text-decoration: none;\n}\n\n.qMtKNa_tag {\n  border: 1px solid var(--dsw-alias-border-l3, #d9dde3);\n  color: var(--dsw-alias-label-secondary, #6b7280);\n  border-radius: 4px;\n  flex-shrink: 0;\n  padding: 1px 6px;\n  font-size: 12px;\n  line-height: 18px;\n}\n\n.qMtKNa_okState {\n  color: var(--dsw-alias-state-success-primary, #16a34a);\n  white-space: nowrap;\n  font-size: 12px;\n  font-weight: 600;\n}\n\n.qMtKNa_warnLine {\n  color: var(--dsw-alias-state-warn-primary, #b45309);\n  cursor: help;\n  margin: 0;\n  font-size: 12px;\n  font-weight: 600;\n  line-height: 18px;\n}\n\n.qMtKNa_modalFooter {\n  justify-content: flex-end;\n  gap: 8px;\n  width: 100%;\n  display: flex;\n}\n\n.qMtKNa_modalFooterLeft {\n  gap: 8px;\n  margin-right: auto;\n  display: flex;\n}\n\n.qMtKNa_editorDialog {\n  width: min(500px, 92vw);\n}\n\n.qMtKNa_editorForm {\n  flex-direction: column;\n  gap: 14px;\n  min-width: 0;\n  display: flex;\n}\n\n.qMtKNa_modeRow {\n  border: 1px solid var(--dsw-alias-border-l2, #e5e7eb);\n  background: var(--dsw-alias-bg-layer-2, #f3f4f6);\n  border-radius: 10px;\n  align-self: flex-start;\n  gap: 6px;\n  padding: 3px;\n  display: flex;\n}\n\n.qMtKNa_seg, .qMtKNa_segOn {\n  font: inherit;\n  color: var(--dsw-alias-label-secondary, #6b7280);\n  cursor: pointer;\n  background: none;\n  border: none;\n  border-radius: 8px;\n  padding: 5px 14px;\n  font-size: 13px;\n  line-height: 20px;\n}\n\n.qMtKNa_segOn {\n  background: var(--dsw-alias-bg-layer-1, #fff);\n  color: var(--dsw-alias-label-primary, #1f2328);\n  font-weight: 600;\n  box-shadow: 0 1px 2px #00000014;\n}\n\n.qMtKNa_fieldGroup {\n  flex-direction: column;\n  gap: 5px;\n  display: flex;\n}\n\n.qMtKNa_fieldLabel {\n  color: var(--dsw-alias-label-secondary, #6b7280);\n  font-size: 12px;\n  font-weight: 600;\n}\n\n.qMtKNa_fieldHint {\n  color: var(--dsw-alias-label-tertiary, #8b93a1);\n  font-size: 12px;\n  line-height: 16px;\n}\n\n.qMtKNa_staticId {\n  border: 1px dashed var(--dsw-alias-border-l3, #d9dde3);\n  background: var(--dsw-alias-bg-layer-2, #f3f4f6);\n  border-radius: 8px;\n  align-items: center;\n  gap: 8px;\n  padding: 7px 10px;\n  display: flex;\n}\n\n.qMtKNa_staticIdValue {\n  color: var(--dsw-alias-label-primary, #1f2328);\n  font-size: 13px;\n  font-weight: 600;\n}\n\n.qMtKNa_detailDialog {\n  width: min(800px, 94vw);\n}\n\n.qMtKNa_detailBody {\n  flex-direction: column;\n  gap: 14px;\n  max-height: 78vh;\n  display: flex;\n  overflow-y: auto;\n}\n\n.qMtKNa_detailSections {\n  flex-direction: column;\n  gap: 14px;\n  display: flex;\n}\n\n.qMtKNa_detailSection {\n  flex-direction: column;\n  gap: 6px;\n  display: flex;\n}\n\n.qMtKNa_detailHead {\n  color: var(--dsw-alias-label-secondary, #6b7280);\n  border-bottom: 1px solid var(--dsw-alias-border-l2, #e5e7eb);\n  margin: 0;\n  padding-bottom: 4px;\n  font-size: 13px;\n  font-weight: 600;\n}\n\n.qMtKNa_detailGrid {\n  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));\n  gap: 6px 14px;\n  display: grid;\n}\n\n.qMtKNa_detailCell {\n  flex-direction: column;\n  gap: 2px;\n  min-width: 0;\n  display: flex;\n}\n\n.qMtKNa_detailKey {\n  color: var(--dsw-alias-label-tertiary, #8b93a1);\n  font-size: 12px;\n}\n\n.qMtKNa_detailValue {\n  color: var(--dsw-alias-label-primary, #1f2328);\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  font-size: 13px;\n  overflow: hidden;\n}\n\n.qMtKNa_detailDesc {\n  color: var(--dsw-alias-label-secondary, #6b7280);\n  margin: 4px 0 0;\n  font-size: 13px;\n  line-height: 20px;\n}\n\n.qMtKNa_mono {\n  word-break: break-all;\n  white-space: pre-wrap;\n  color: var(--dsw-alias-label-primary, #1f2328);\n  margin: 0;\n  font-family: ui-monospace, Menlo, Consolas, monospace;\n  font-size: 12px;\n  line-height: 18px;\n}\n\n.qMtKNa_detailItem {\n  border: 1px solid var(--dsw-alias-border-l2, #e5e7eb);\n  border-radius: 8px;\n  flex-direction: column;\n  display: flex;\n  overflow: hidden;\n}\n\n.qMtKNa_detailItemRow, .qMtKNa_detailItemOpen {\n  width: 100%;\n  font: inherit;\n  text-align: left;\n  cursor: pointer;\n  color: var(--dsw-alias-label-primary, #1f2328);\n  background: none;\n  border: none;\n  align-items: center;\n  gap: 8px;\n  padding: 7px 10px;\n  display: flex;\n}\n\n.qMtKNa_detailItemRow:hover {\n  background: var(--dsw-alias-bg-hover, #0000000d);\n}\n\n.qMtKNa_detailItemOpen {\n  background: var(--dsw-alias-bg-selected, #4f6ef714);\n}\n\n.qMtKNa_detailItemName {\n  flex-shrink: 0;\n  font-size: 13px;\n  font-weight: 600;\n}\n\n.qMtKNa_detailItemDesc {\n  min-width: 0;\n  color: var(--dsw-alias-label-tertiary, #8b93a1);\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  flex: 1;\n  font-size: 12px;\n  overflow: hidden;\n}\n\n.qMtKNa_detailChevron {\n  color: var(--dsw-alias-label-tertiary, #8b93a1);\n  flex-shrink: 0;\n}\n\n.qMtKNa_skillContent {\n  border-top: 1px solid var(--dsw-alias-border-l2, #e5e7eb);\n  max-height: 320px;\n  color: var(--dsw-alias-label-primary, #1f2328);\n  padding: 10px 12px;\n  font-size: 13px;\n  line-height: 20px;\n  overflow-y: auto;\n}\n";document.head.appendChild(s);}})();
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
//#region src/client/locales.ts
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
	removeSourceConfirmTitle: "移除仓库源",
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
	grid: "网格",
	list: "列表",
	openSettings: "在设置中打开",
	rootLabel: "Agent Plugins 目录",
	dataLabel: "Agent Plugins 数据目录",
	countAll: "共 {n} 个 Agent Plugins",
	countInstalled: "已装 {n}",
	countEnabled: "启用 {n}"
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
	removeSourceConfirmTitle: "Remove source",
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
	grid: "grid",
	list: "list",
	openSettings: "Open in settings",
	rootLabel: "Suite root",
	dataLabel: "Suite data root",
	countAll: "{n} suites",
	countInstalled: "{n} installed",
	countEnabled: "{n} enabled"
};
//#endregion
//#region src/client/api.ts
async function fetchOverview() {
	const response = await fetch("/api/agent-plugins/overview", { credentials: "same-origin" });
	if (!response.ok) throw new Error(`overview failed: ${response.status}`);
	return response.json();
}
async function fetchSuiteDetail(sourceId, suiteId) {
	const response = await fetch(`/api/agent-plugins/suite?sourceId=${encodeURIComponent(sourceId)}&suiteId=${encodeURIComponent(suiteId)}`, { credentials: "same-origin" });
	if (!response.ok) throw new Error(`suite detail failed: ${response.status}`);
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
	"meta": "qMtKNa_meta",
	"modalFooter": "qMtKNa_modalFooter",
	"modalFooterLeft": "qMtKNa_modalFooterLeft",
	"modeRow": "qMtKNa_modeRow",
	"mono": "qMtKNa_mono",
	"okState": "qMtKNa_okState",
	"searchGroup": "qMtKNa_searchGroup",
	"searchInput": "qMtKNa_searchInput",
	"searchWrap": "qMtKNa_searchWrap",
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
	"switchOff": "qMtKNa_switchOff",
	"switchOn": "qMtKNa_switchOn",
	"switchThumb": "qMtKNa_switchThumb",
	"tab": "qMtKNa_tab",
	"tabGap": "qMtKNa_tabGap",
	"tabOn": "qMtKNa_tabOn",
	"tabRow": "qMtKNa_tabRow",
	"tag": "qMtKNa_tag",
	"title": "qMtKNa_title",
	"titleRow": "qMtKNa_titleRow",
	"version": "qMtKNa_version",
	"viewSwitch": "qMtKNa_viewSwitch",
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
	const layoutLabel = detail === void 0 ? "" : detail.layout === "agent-plugin-v1" ? t("layoutV1") : detail.layout === "claude-code" ? t("layoutCC") : detail.layout === "codex" ? t("layoutCodex") : detail.layout === "remote" ? t("layoutRemote") : t("layoutSkills");
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
			}, `⚠ ${detail.mcpErrors.join("；")}`), detail.mcpServers.length === 0 ? (0, react.createElement)("div", { className: market_module_default.sidebarEmpty }, "—") : detail.mcpServers.map((server) => (0, react.createElement)("div", {
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
//#region src/client/MarketSection.tsx
/**
* The Agent Plugins Market settings section.
*
* Layout: repository sources run along the TOP as chips (全部 first), with
* edit-current / add / refresh-all controls on the right; below sit search,
* status tabs, and the card grid. Colors ride the dsh --dsw-alias-* tokens
* with light-mode fallbacks so the page follows the active theme.
*/
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
function MarketSection({ t }) {
	const [overview, setOverview] = (0, react.useState)(EMPTY_OVERVIEW);
	const [loading, setLoading] = (0, react.useState)(true);
	const [search, setSearch] = (0, react.useState)("");
	const [tab, setTab] = (0, react.useState)("all");
	const [category, setCategory] = (0, react.useState)("all");
	const [view, setView] = (0, react.useState)("grid");
	const [busy, setBusy] = (0, react.useState)(void 0);
	const [toast, setToast] = (0, react.useState)(void 0);
	const [confirm, setConfirm] = (0, react.useState)(void 0);
	const [editor, setEditor] = (0, react.useState)(void 0);
	const [detail, setDetail] = (0, react.useState)(void 0);
	const refresh = (0, react.useCallback)(async () => {
		try {
			setOverview(await fetchOverview());
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
		children: (0, react.createElement)("div", { className: market_module_default.market }, (0, react.createElement)("header", { className: market_module_default.header }, (0, react.createElement)("div", { className: market_module_default.titleRow }, (0, react.createElement)("h2", { className: market_module_default.title }, t("nav")), (0, react.createElement)("p", { className: market_module_default.sub }, t("subtitle")), (0, react.createElement)("div", { className: market_module_default.spacer }), (0, react.createElement)("div", { className: market_module_default.searchGroup }, (0, react.createElement)(_deepseek_ai_dsh_client_ui_primitives.Button, {
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
		}, "↻"), (0, react.createElement)("div", { className: market_module_default.searchWrap }, (0, react.createElement)(_deepseek_ai_dsh_client_ui_primitives.Input, {
			className: market_module_default.searchInput,
			placeholder: t("searchPh"),
			value: search,
			onChange: (event) => setSearch(event.target.value)
		})))), (0, react.createElement)("div", { className: market_module_default.sourceTabsRow }, (0, react.createElement)("div", { className: market_module_default.sourceTabsScroll }, (0, react.createElement)(SourceTab, {
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
		})))), (0, react.createElement)("div", { className: market_module_default.tabRow }, (0, react.createElement)(TabButton, {
			t,
			active: tab === "all",
			label: `${t("tabAll")} ${scopeTotals.all}`,
			onClick: () => setTab("all")
		}), (0, react.createElement)(TabButton, {
			t,
			active: tab === "installed",
			label: `${t("tabInstalled")} ${scopeTotals.installed}`,
			onClick: () => setTab("installed")
		}), (0, react.createElement)(TabButton, {
			t,
			active: tab === "uninstalled",
			label: `${t("tabUninstalled")} ${scopeTotals.all - scopeTotals.installed}`,
			onClick: () => setTab("uninstalled")
		}), (0, react.createElement)("div", { className: market_module_default.tabGap }), (0, react.createElement)("button", {
			type: "button",
			className: market_module_default.viewSwitch,
			onClick: () => setView(view === "grid" ? "list" : "grid")
		}, view === "grid" ? t("list") : t("grid")))), (0, react.createElement)("main", { className: view === "grid" ? market_module_default.grid : market_module_default.list }, loading ? (0, react.createElement)("div", { className: market_module_default.empty }, "…") : filtered.length === 0 ? (0, react.createElement)("div", { className: market_module_default.empty }, tab === "installed" ? t("installedEmpty") : t("empty")) : filtered.map((suite) => (0, react.createElement)(SuiteCard, {
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
			title: confirm.kind === "uninstall" ? t("uninstallConfirmTitle") : `${t("removeSourceConfirmTitle")}「${confirm.sourceId}」`,
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
					try {
						const derived = (await postAction("sources/add", body))["source"]?.id;
						await refresh();
						setEditor(void 0);
						if (derived !== void 0) setCategory(derived);
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
function TabButton({ t: _t, active, label, onClick }) {
	return (0, react.createElement)("button", {
		type: "button",
		className: active ? market_module_default.tabOn : market_module_default.tab,
		onClick
	}, label);
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
		}), (0, react.createElement)("span", { className: market_module_default.fieldHint }, t("branchHint"))))
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
		label: suite.errors.slice(0, 8).join("；"),
		children: (0, react.createElement)("span", { className: market_module_default.warnLine }, `⚠ ${t("errors")} ${suite.errors.length}`)
	}), (suite.mcpErrors?.length ?? 0) === 0 ? null : (0, react.createElement)(_deepseek_ai_dsh_client_ui_primitives.Tooltip, {
		label: suite.mcpErrors.slice(0, 8).join("；"),
		children: (0, react.createElement)("span", { className: market_module_default.warnLine }, `⚠ ${t("mcpSection")} ${suite.mcpErrors.length}`)
	})));
}
//#endregion
//#region src/client/index.ts
/**
* dsh-agent-plugins-market client: registers the Agent Plugins Market section inside the Web
* GUI's settings dialog (the same settings.section seat dshmarket uses).
* Mirrors the market's integration contract: the bundle's only externals are
* react and the injected `dsh.client.inject` module table, so it cannot reach
* packages the host does not serve.
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
	ctx.slots.inject("settings.section", () => ctx.slots.register({
		name: "settings.section",
		id: "agent-plugin",
		order: 45,
		label: () => t("nav"),
		locale: NS,
		inject: () => ({ t })
	}, () => (0, react.createElement)(MarketSection, { t })));
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
